/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE RADIO DE IMPACTO (BLAST-RADIUS AUDIT ENGINE) · EAR OS S-CLASS
 * ────────────────────────────────────────────────────────────────────────────
 * Resuelve transitivamente el impacto de cualquier mutación o consulta sobre
 * el grafo de control plane operacional de EAR OS:
 *   - Nodos gobernados por la Zona Cero y el Oráculo
 *   - Rutas de venta (Money Paths)
 *   - Endpoints de ejecución y persistencia
 *   - Compuertas mecánicas de calidad (15/22 gates y prepush)
 *
 * Soporta resolución canónica y alias rápidos:
 *   - 'RULE-53', 'RULE-64', 'SSOT-PRICING', 'API-STRIPE', 'OTZARRETA', etc.
 * ════════════════════════════════════════════════════════════════════════════
 */

import rawTopology from './control-plane-topology.json';

export type TopologyNodeType = 'route' | 'api' | 'data' | 'constitutional' | 'domain';
export type CriticalityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RelationshipType = 'caller->callee' | 'reads->writes' | 'governs->executes' | 'depends_on';

export interface TopologyNode {
  id: string;
  name: string;
  type: TopologyNodeType;
  path: string;
  integrityHash: string;
  criticality: CriticalityLevel;
  metadata: Record<string, unknown>;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface ControlPlaneTopology {
  schema_version: string;
  generated_at: string;
  execution_duration_ms: number;
  stats: {
    total_nodes: number;
    total_edges: number;
    nodes_by_type: Record<string, number>;
    criticality_distribution: Record<string, number>;
  };
  aliases: Record<string, string>;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface BlastRadiusImpactItem {
  nodeId: string;
  nodeName: string;
  nodeType: TopologyNodeType;
  criticality: CriticalityLevel;
  depth: number;
  relationship: string;
  path: string;
}

export interface BlastRadiusReport {
  targetNodeId: string;
  canonicalNodeId: string;
  targetNode: TopologyNode;
  totalImpactedNodes: number;
  blastSeverity: CriticalityLevel;
  directDependents: TopologyNode[];
  transitiveDependents: TopologyNode[];
  governedEntities: TopologyNode[];
  mechanicalGatesAffected: TopologyNode[];
  impactChain: BlastRadiusImpactItem[];
  summary: string;
}

const topology = rawTopology as unknown as ControlPlaneTopology;

const nodesMap = new Map<string, TopologyNode>();
const outgoingEdgesMap = new Map<string, TopologyEdge[]>();
const incomingEdgesMap = new Map<string, TopologyEdge[]>();

// Indexar nodos
topology.nodes.forEach((node) => {
  nodesMap.set(node.id, node);
});

// Indexar aristas
topology.edges.forEach((edge) => {
  if (!outgoingEdgesMap.has(edge.source)) outgoingEdgesMap.set(edge.source, []);
  outgoingEdgesMap.get(edge.source)!.push(edge);

  if (!incomingEdgesMap.has(edge.target)) incomingEdgesMap.set(edge.target, []);
  incomingEdgesMap.get(edge.target)!.push(edge);
});

/**
 * Resuelve cualquier identificador o alias a su ID canónico.
 * Ej: 'SSOT-PRICING' -> 'SSOT-EAR-OS'
 *     'API-STRIPE' -> 'API-/api/stripe/checkout'
 *     'RULE-53' -> 'RULE-53'
 */
export function resolveCanonicalNodeId(input: string): string | null {
  if (!input) return null;
  const clean = input.trim();

  // 1. Coincidencia directa
  if (nodesMap.has(clean)) return clean;

  // 2. Coincidencia en alias declarados
  const upper = clean.toUpperCase();
  if (topology.aliases && topology.aliases[upper]) {
    return topology.aliases[upper];
  }

  // 3. Normalización común (RULE-X o RULEX)
  const ruleMatch = clean.match(/^(?:RULE|REGLA)[-_]?(\d+)$/i);
  if (ruleMatch) {
    const candidate = `RULE-${ruleMatch[1]}`;
    if (nodesMap.has(candidate)) return candidate;
  }

  // 4. Búsqueda insensible a mayúsculas
  for (const id of nodesMap.keys()) {
    if (id.toLowerCase() === clean.toLowerCase()) return id;
  }

  // 5. Búsqueda por subcadena única
  const matching = Array.from(nodesMap.keys()).filter((k) =>
    k.toLowerCase().includes(clean.toLowerCase())
  );
  if (matching.length === 1) return matching[0];

  return null;
}

/**
 * Obtiene el objeto de nodo por ID o alias.
 */
export function getNode(nodeIdOrAlias: string): TopologyNode | undefined {
  const canonicalId = resolveCanonicalNodeId(nodeIdOrAlias);
  if (!canonicalId) return undefined;
  return nodesMap.get(canonicalId);
}

/**
 * Devuelve el dataset canónico completo de la topología.
 */
export function getTopology(): ControlPlaneTopology {
  return topology;
}

/**
 * Calcula el radio de impacto (Blast-Radius) transitivo de un nodo.
 *
 * @param nodeIdOrAlias Identificador del nodo (ej. 'RULE-53', 'SSOT-PRICING', 'API-STRIPE')
 * @param maxDepth Profundidad máxima de propagación (por defecto 4)
 */
export function computeBlastRadius(
  nodeIdOrAlias: string,
  maxDepth: number = 4
): BlastRadiusReport {
  const canonicalId = resolveCanonicalNodeId(nodeIdOrAlias);
  if (!canonicalId || !nodesMap.has(canonicalId)) {
    throw new Error(
      `[BLAST-RADIUS] Nodo no encontrado en la topología de control: "${nodeIdOrAlias}"`
    );
  }

  const targetNode = nodesMap.get(canonicalId)!;

  // BFS para resolver dependencias downstream transitivas
  const visited = new Set<string>([canonicalId]);
  const queue: { id: string; depth: number; relation: string }[] = [
    { id: canonicalId, depth: 0, relation: 'ROOT' },
  ];

  const impactChain: BlastRadiusImpactItem[] = [];
  const directDependents: TopologyNode[] = [];
  const transitiveDependents: TopologyNode[] = [];
  const governedEntities: TopologyNode[] = [];
  const mechanicalGatesAffected: TopologyNode[] = [];

  let highestCritLevel: CriticalityLevel = targetNode.criticality;

  while (queue.length > 0) {
    const { id: currentId, depth, relation } = queue.shift()!;

    if (currentId !== canonicalId) {
      const node = nodesMap.get(currentId);
      if (node) {
        impactChain.push({
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          criticality: node.criticality,
          depth,
          relationship: relation,
          path: node.path,
        });

        if (depth === 1) {
          directDependents.push(node);
        } else {
          transitiveDependents.push(node);
        }

        if (relation.includes('governs')) {
          governedEntities.push(node);
        }

        if (
          node.type === 'constitutional' &&
          Boolean(node.metadata?.isMechanicalGate)
        ) {
          mechanicalGatesAffected.push(node);
        }

        if (node.criticality === 'CRITICAL') {
          highestCritLevel = 'CRITICAL';
        } else if (node.criticality === 'HIGH' && highestCritLevel !== 'CRITICAL') {
          highestCritLevel = 'HIGH';
        }
      }
    }

    if (depth < maxDepth) {
      const outgoing = outgoingEdgesMap.get(currentId) || [];
      for (const edge of outgoing) {
        if (!visited.has(edge.target) && nodesMap.has(edge.target)) {
          visited.add(edge.target);
          queue.push({
            id: edge.target,
            depth: depth + 1,
            relation: edge.relationship,
          });
        }
      }

      // Si es un API o componente, verificar llamadas entrantes que puedan verse afectadas
      if (depth === 0) {
        const incoming = incomingEdgesMap.get(currentId) || [];
        for (const edge of incoming) {
          if (!visited.has(edge.source) && nodesMap.has(edge.source)) {
            visited.add(edge.source);
            queue.push({
              id: edge.source,
              depth: depth + 1,
              relation: `inverse:${edge.relationship}`,
            });
          }
        }
      }
    }
  }

  const totalImpacted = impactChain.length;
  const summary = `Blast-Radius para [${targetNode.id}] "${targetNode.name}": ${totalImpacted} nodos alcanzados transitivamente (${directDependents.length} directos, ${transitiveDependents.length} transitivos, ${mechanicalGatesAffected.length} compuertas mecánicas). Severidad calculada: ${highestCritLevel}.`;

  return {
    targetNodeId: nodeIdOrAlias,
    canonicalNodeId: canonicalId,
    targetNode,
    totalImpactedNodes: totalImpacted,
    blastSeverity: highestCritLevel,
    directDependents,
    transitiveDependents,
    governedEntities,
    mechanicalGatesAffected,
    impactChain,
    summary,
  };
}

/**
 * Consulta rápida de todas las rutas de usuario afectadas por un nodo.
 */
export function queryImpactedPaths(nodeIdOrAlias: string): string[] {
  const report = computeBlastRadius(nodeIdOrAlias);
  const paths = new Set<string>();

  if (report.targetNode.type === 'route') {
    paths.add(report.targetNode.name);
  }

  report.impactChain.forEach((item) => {
    if (item.nodeType === 'route') {
      paths.add(item.nodeName);
    }
  });

  return Array.from(paths);
}

/**
 * Consulta de estadísticas resumidas del plano de control.
 */
export function getControlPlaneStats() {
  return topology.stats;
}
