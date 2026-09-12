/**
 * OMNI GOLD WIKIPEDIA KNOWLEDGE MESH ENGINE
 *
 * Motor de categorización y resolución de enlaces bidireccionales ([[Wikilinks]])
 * estilo Wikipedia sobre los 362.498 activos de oro (EAR_GOLDEN_INDEX.csv).
 *
 * Conecta activos clasificados (Audio, Legal B2G, Estrategia, Código, Proveedores)
 * con artículos de blog, fichas del Arsenal y casos de éxito.
 *
 * ZTM: NO carga el CSV en RAM. El script de minería (mine_omni_wikipedia_mesh.ts)
 * usa streaming readline y alimenta este motor con nodos ya clasificados.
 */

export type MeshCluster =
  | 'AUDIO_ACUSTICA'
  | 'LEGAL_B2G'
  | 'ESTRATEGIA'
  | 'CODIGO_INGENIERIA'
  | 'PROVEEDORES_ARSENAL';

export interface MeshNode {
  id: string;
  title: string;
  cluster: MeshCluster;
  sourcePath: string;
  keywords: string[];
  wikilinks: string[]; // Enlaces bidireccionales [[...]]
  weight: number;
}

export interface MeshIndex {
  generatedAt: string;
  totalNodes: number;
  clusterCounts: Record<MeshCluster, number>;
  nodes: MeshNode[];
  keywordIndex: Record<string, string[]>; // keyword → nodeIds
  backlinks: Record<string, string[]>; // nodeId → nodeIds que apuntan a él
}

// ─────────────────────────────────────────────────────────────────────────────
// DICCIONARIO DE CLASIFICACIÓN SEMÁNTICA (SSOT S-CLASS)
// ─────────────────────────────────────────────────────────────────────────────
export const CLUSTER_KEYWORDS: Record<MeshCluster, string[]> = {
  AUDIO_ACUSTICA: [
    'bose', 'line array', 'shure', 'spl', 'db', 'sonido', 'acustica', 'acústica',
    'microfono', 'micrófono', 'f1 812', 's1 pro', 'beta 87', 'rider', 'watts', 'w/pax'
  ],
  LEGAL_B2G: [
    'lcsp', 'art. 118', 'art 118', 'licitacion', 'licitación', 'contrato menor',
    'dir3', 'face', 'pliego', 'b2g', 'municipal', 'ayuntamiento', 'adjudicacion',
    'adjudicación', 'cpv', 'sroi'
  ],
  ESTRATEGIA: [
    'estrategia', 'split', '80/10/10', 'soberano', 'vimume', 'edwin agudelo',
    'productora ear', 's-class', 'sclass', 'moat', 'ltv', 'campaña', 'campana'
  ],
  CODIGO_INGENIERIA: [
    'engine', 'motor', 'orchestrator', 'prisma', 'zustand', 'hook', 'store',
    'api', 'route', 'component', 'tsx', 'typescript', 'sha-256', 'hmac', 'stripe'
  ],
  PROVEEDORES_ARSENAL: [
    'proveedor', 'arsenal', 'catalogo', 'catálogo', 'mariachi', 'catering',
    'finca', 'floristeria', 'floristería', 'dj', 'iluminacion', 'iluminación',
    'tarifa', 'servicio', 'vendor'
  ]
};

/**
 * Clasifica un activo en uno de los 5 clusters maestros según su ruta y nombre.
 */
export function classifyAsset(pathOrName: string): MeshCluster {
  const lower = pathOrName.toLowerCase();
  let bestCluster: MeshCluster = 'ESTRATEGIA';
  let bestScore = 0;

  (Object.keys(CLUSTER_KEYWORDS) as MeshCluster[]).forEach((cluster) => {
    const score = CLUSTER_KEYWORDS[cluster].reduce(
      (acc, kw) => (lower.includes(kw) ? acc + 1 : acc),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestCluster = cluster;
    }
  });

  return bestCluster;
}

/**
 * Extrae keywords relevantes de un título/ruta para el índice de búsqueda rápida.
 */
export function extractKeywords(pathOrName: string): string[] {
  const tokens = pathOrName
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü\s/._-]/gi, ' ')
    .split(/[\s/._-]+/)
    .filter((t) => t.length >= 3);

  const allKeywords = Object.values(CLUSTER_KEYWORDS).flat();
  const matched = allKeywords.filter((kw) => pathOrName.toLowerCase().includes(kw));
  return Array.from(new Set([...tokens.slice(0, 8), ...matched]));
}

/**
 * Genera enlaces bidireccionales [[Wikilinks]] entre nodos que comparten keywords.
 */
export function buildWikilinks(node: MeshNode, allNodes: MeshNode[]): string[] {
  const links: string[] = [];
  const nodeKeywords = new Set(node.keywords);

  for (const other of allNodes) {
    if (other.id === node.id) continue;
    const shared = other.keywords.filter((k) => nodeKeywords.has(k));
    if (shared.length >= 2 || (other.cluster === node.cluster && shared.length >= 1)) {
      links.push(other.id);
    }
    if (links.length >= 12) break; // Límite de densidad de enlaces
  }

  return links;
}

/**
 * Construye el índice completo de la malla enciclopédica a partir de nodos crudos.
 */
export function buildKnowledgeMesh(rawNodes: MeshNode[]): MeshIndex {
  const clusterCounts: Record<MeshCluster, number> = {
    AUDIO_ACUSTICA: 0,
    LEGAL_B2G: 0,
    ESTRATEGIA: 0,
    CODIGO_INGENIERIA: 0,
    PROVEEDORES_ARSENAL: 0
  };

  const keywordIndex: Record<string, string[]> = {};
  const backlinks: Record<string, string[]> = {};

  // 1. Contar clusters e indexar keywords
  for (const node of rawNodes) {
    clusterCounts[node.cluster]++;
    for (const kw of node.keywords) {
      if (!keywordIndex[kw]) keywordIndex[kw] = [];
      if (keywordIndex[kw].length < 200) keywordIndex[kw].push(node.id);
    }
  }

  // 2. Construir backlinks (enlaces bidireccionales)
  for (const node of rawNodes) {
    for (const target of node.wikilinks) {
      if (!backlinks[target]) backlinks[target] = [];
      backlinks[target].push(node.id);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totalNodes: rawNodes.length,
    clusterCounts,
    nodes: rawNodes,
    keywordIndex,
    backlinks
  };
}

/**
 * Resuelve un término de búsqueda devolviendo los activos asociados (búsqueda rápida).
 */
export function resolveMeshTerm(mesh: MeshIndex, term: string): MeshNode[] {
  // Normalizar: minúsculas y unificar guiones/espacios para tolerar "S-Class" vs "s-class"
  const normalize = (s: string) => s.toLowerCase().replace(/[-_]/g, ' ').trim();
  const lower = normalize(term);
  const matchedIds = new Set<string>();

  // 1. Coincidencia directa en el índice de keywords (normalizado)
  for (const [kw, ids] of Object.entries(mesh.keywordIndex)) {
    const nkw = normalize(kw);
    if (nkw.includes(lower) || lower.includes(nkw)) {
      ids.forEach((id) => matchedIds.add(id));
    }
  }

  // 2. Coincidencia en título (normalizado)
  for (const node of mesh.nodes) {
    if (normalize(node.title).includes(lower)) {
      matchedIds.add(node.id);
    }
  }

  // 3. Coincidencia en keywords de cada nodo (normalizado)
  for (const node of mesh.nodes) {
    if (node.keywords.some((k) => normalize(k).includes(lower) || lower.includes(normalize(k)))) {
      matchedIds.add(node.id);
    }
  }

  return mesh.nodes.filter((n) => matchedIds.has(n.id)).slice(0, 50);
}

/**
 * Genera un artículo enciclopédico estilo Wikipedia para un nodo.
 */
export function renderWikipediaArticle(mesh: MeshIndex, nodeId: string): string {
  const node = mesh.nodes.find((n) => n.id === nodeId);
  if (!node) return `# Activo no encontrado: ${nodeId}`;

  const links = node.wikilinks
    .map((id) => {
      const target = mesh.nodes.find((n) => n.id === id);
      return target ? `- [[${target.title}]] (${target.cluster})` : null;
    })
    .filter((l): l is string => l !== null);

  const back = (mesh.backlinks[nodeId] || [])
    .map((id) => {
      const source = mesh.nodes.find((n) => n.id === id);
      return source ? `- [[${source.title}]]` : null;
    })
    .filter((l): l is string => l !== null);

  return `
# ${node.title}

**Cluster:** ${node.cluster}
**Ruta Fuente:** \`${node.sourcePath}\`
**Peso:** ${node.weight}

## Palabras Clave
${node.keywords.map((k) => `\`${k}\``).join(' · ')}

## Enlaces Salientes (${links.length})
${links.join('\n') || '_Sin enlaces_'}

## Backlinks (${back.length})
${back.join('\n') || '_Sin backlinks_'}
`.trim();
}
