/**
 * MINE OMNI WIKIPEDIA MESH // MINERÍA ZTM POR STREAMING
 *
 * Lee H:\EAR_GOLDEN_INDEX.csv línea por línea (readline) SIN cargar el archivo en RAM.
 * Agrupa los 362.498 activos en 5 clusters maestros y genera el grafo enciclopédico
 * WIKIPEDIA_GOLD_KNOWLEDGE_MESH.json (< 5 MB) con índices de búsqueda rápida.
 *
 * ZERO-TOKEN MEMORY: nunca se vuelca el CSV completo a memoria ni a consola.
 */

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import {
  classifyAsset,
  extractKeywords,
  buildWikilinks,
  buildKnowledgeMesh,
  type MeshNode,
  type MeshCluster
} from '../src/lib/knowledge/omniGoldWikipediaMeshEngine';

const CSV_PATH = 'H:\\EAR_GOLDEN_INDEX.csv';
const OUTPUT_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\01_ESTRATEGIA_Y_CHATS';
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'WIKIPEDIA_GOLD_KNOWLEDGE_MESH.json');

// Límite de nodos representativos por cluster para mantener el JSON < 5 MB
const MAX_NODES_PER_CLUSTER = 1500;

interface ClusterBucket {
  cluster: MeshCluster;
  nodes: MeshNode[];
}

async function mineMesh(): Promise<void> {
  console.log('⛏️  [ZTM] Iniciando minería por streaming de EAR_GOLDEN_INDEX.csv...');

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV no encontrado en ${CSV_PATH}. Abortando.`);
    process.exit(1);
  }

  const buckets: Record<MeshCluster, MeshNode[]> = {
    AUDIO_ACUSTICA: [],
    LEGAL_B2G: [],
    ESTRATEGIA: [],
    CODIGO_INGENIERIA: [],
    PROVEEDORES_ARSENAL: []
  };

  let totalLines = 0;
  let classifiedCount = 0;
  let nodeCounter = 0;

  const fileStream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    totalLines++;

    // El CSV es un output de WizTree: la primera columna suele ser la ruta del archivo.
    // Extraemos el primer campo no vacío que parezca una ruta.
    const firstField = line.split(',')[0]?.replace(/^"|"$/g, '').trim();
    if (!firstField || firstField.length < 4) continue;

    // Ignorar ruido de sistema
    const lower = firstField.toLowerCase();
    if (
      lower.includes('node_modules') ||
      lower.includes('\\windows\\') ||
      lower.includes('$recycle') ||
      lower.includes('system volume information')
    ) {
      continue;
    }

    const cluster = classifyAsset(firstField);
    const bucket = buckets[cluster];

    // Cap por cluster para mantener el JSON ligero
    if (bucket.length >= MAX_NODES_PER_CLUSTER) continue;

    const keywords = extractKeywords(firstField);
    if (keywords.length === 0) continue;

    const fileName = path.basename(firstField);
    const node: MeshNode = {
      id: `node-${nodeCounter++}`,
      title: fileName,
      cluster,
      sourcePath: firstField,
      keywords,
      wikilinks: [],
      weight: keywords.length
    };

    bucket.push(node);
    classifiedCount++;
  }

  // Construir wikilinks dentro de cada cluster (densidad controlada)
  const allNodes: MeshNode[] = [];
  (Object.keys(buckets) as MeshCluster[]).forEach((cluster) => {
    const clusterNodes = buckets[cluster];
    for (const node of clusterNodes) {
      node.wikilinks = buildWikilinks(node, clusterNodes);
    }
    allNodes.push(...clusterNodes);
  });

  const mesh = buildKnowledgeMesh(allNodes);

  // Asegurar directorio de salida
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mesh), 'utf-8');
  const sizeMb = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);

  console.log('\n📊 RESUMEN DE MINERÍA (ZTM):');
  console.log(`   Líneas CSV procesadas: ${totalLines.toLocaleString('es-ES')}`);
  console.log(`   Activos clasificados: ${classifiedCount.toLocaleString('es-ES')}`);
  console.log(`   Nodos en la malla: ${mesh.totalNodes.toLocaleString('es-ES')}`);
  console.log('   Distribución por cluster:');
  (Object.keys(mesh.clusterCounts) as MeshCluster[]).forEach((c) => {
    console.log(`     - ${c}: ${mesh.clusterCounts[c].toLocaleString('es-ES')}`);
  });
  console.log(`   Keywords indexadas: ${Object.keys(mesh.keywordIndex).length.toLocaleString('es-ES')}`);
  console.log(`   Archivo generado: ${OUTPUT_PATH} (${sizeMb} MB)`);

  if (parseFloat(sizeMb) < 5) {
    console.log('\n✅ MINERÍA COMPLETADA: Malla Wikipedia < 5 MB. Exit Code 0.');
    process.exit(0);
  } else {
    console.error(`\n⚠️  El archivo supera 5 MB (${sizeMb} MB). Reducir MAX_NODES_PER_CLUSTER.`);
    process.exit(1);
  }
}

mineMesh().catch((err) => {
  console.error('❌ Error en minería:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
