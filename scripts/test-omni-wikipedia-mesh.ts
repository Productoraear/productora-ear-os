/**
 * TEST: OMNI GOLD WIKIPEDIA KNOWLEDGE MESH
 * Valida el motor de malla enciclopédica: clasificación, wikilinks, backlinks
 * y resolución de términos clave en < 15 ms.
 */

import {
  classifyAsset,
  extractKeywords,
  buildWikilinks,
  buildKnowledgeMesh,
  resolveMeshTerm,
  renderWikipediaArticle,
  type MeshNode,
  type MeshCluster
} from '../src/lib/knowledge/omniGoldWikipediaMeshEngine';

console.log('🚀 [TEST] Verificando Malla Enciclopédica Wikipedia ZTM...\n');

// ── 1. Test de clasificación semántica ──────────────────────────────────────
const classificationCases: Array<{ path: string; expected: MeshCluster }> = [
  { path: 'H:\\VAULT\\audio\\bose-f1-812-rider-spl.md', expected: 'AUDIO_ACUSTICA' },
  { path: 'H:\\VAULT\\legal\\art-118-lcsp-contrato-menor-dir3.md', expected: 'LEGAL_B2G' },
  { path: 'H:\\VAULT\\estrategia\\split-80-10-10-vimume-edwin-agudelo.md', expected: 'ESTRATEGIA' },
  { path: 'H:\\VAULT\\code\\multiServiceOrchestrator-prisma-zustand.ts', expected: 'CODIGO_INGENIERIA' },
  { path: 'H:\\VAULT\\proveedores\\catalogo-mariachi-catering-finca.json', expected: 'PROVEEDORES_ARSENAL' }
];

let classPassed = 0;
classificationCases.forEach((c) => {
  const result = classifyAsset(c.path);
  if (result === c.expected) {
    classPassed++;
    console.log(`   ✅ Clasificado "${c.path.split('\\').pop()}" → ${result}`);
  } else {
    console.error(`   ❌ Fallo: esperado ${c.expected}, obtenido ${result}`);
  }
});

// ── 2. Construir malla de prueba ────────────────────────────────────────────
const rawPaths = [
  'H:\\VAULT\\audio\\bose-f1-812-line-array-shure-spl.md',
  'H:\\VAULT\\audio\\bose-s1-pro-rider-watts.md',
  'H:\\VAULT\\audio\\shure-beta-87a-microfono-spl.md',
  'H:\\VAULT\\legal\\art-118-lcsp-contrato-menor.md',
  'H:\\VAULT\\legal\\licitacion-municipal-dir3-face.md',
  'H:\\VAULT\\legal\\b2g-ayuntamiento-pliego-cpv.md',
  'H:\\VAULT\\estrategia\\split-80-10-10-soberano.md',
  'H:\\VAULT\\estrategia\\vimume-edwin-agudelo-s-class.md',
  'H:\\VAULT\\code\\orchestrator-prisma-zustand-engine.ts',
  'H:\\VAULT\\code\\stripe-hmac-sha-256-api-route.ts',
  'H:\\VAULT\\proveedores\\catalogo-mariachi-catering.json',
  'H:\\VAULT\\proveedores\\arsenal-finca-floristeria-dj.json'
];

const nodes: MeshNode[] = rawPaths.map((p, i) => ({
  id: `node-${i}`,
  title: p.split('\\').pop() || p,
  cluster: classifyAsset(p),
  sourcePath: p,
  keywords: extractKeywords(p),
  wikilinks: [],
  weight: extractKeywords(p).length
}));

// Construir wikilinks
nodes.forEach((n) => {
  n.wikilinks = buildWikilinks(n, nodes);
});

const mesh = buildKnowledgeMesh(nodes);

console.log(`\n   📊 Malla construida: ${mesh.totalNodes} nodos`);
console.log(`   Clusters: ${JSON.stringify(mesh.clusterCounts)}`);
console.log(`   Keywords indexadas: ${Object.keys(mesh.keywordIndex).length}`);
console.log(`   Nodos con backlinks: ${Object.keys(mesh.backlinks).length}`);

// ── 3. Test de resolución de términos clave (< 15 ms) ───────────────────────
const searchTerms = ['Line Array', 'Art. 118 LCSP', 'Edwin Agudelo', 'Bose F1', 'S-Class'];

let searchPassed = 0;
searchTerms.forEach((term) => {
  const t0 = Date.now();
  const results = resolveMeshTerm(mesh, term);
  const elapsed = Date.now() - t0;

  if (results.length > 0 && elapsed < 15) {
    searchPassed++;
    console.log(`   ✅ "${term}" → ${results.length} activos en ${elapsed} ms`);
  } else {
    console.error(`   ❌ "${term}" → ${results.length} activos en ${elapsed} ms (fallo)`);
  }
});

// ── 4. Test de renderizado de artículo Wikipedia ────────────────────────────
const article = renderWikipediaArticle(mesh, 'node-0');
const articleOk = article.includes('# ') && article.includes('Cluster:') && article.includes('Backlinks');

// ── 5. Verificación de enlaces bidireccionales ──────────────────────────────
const hasBidirectionalLinks = Object.keys(mesh.backlinks).length > 0;

console.log(`\n   📄 Artículo Wikipedia generado: ${articleOk ? 'OK' : 'FALLO'}`);
console.log(`   🔗 Enlaces bidireccionales: ${hasBidirectionalLinks ? 'OK' : 'FALLO'}`);

const totalTests = classificationCases.length + searchTerms.length + 2;
const passedTests = classPassed + searchPassed + (articleOk ? 1 : 0) + (hasBidirectionalLinks ? 1 : 0);

console.log(`\n📊 RESULTADO: ${passedTests}/${totalTests} tests superados`);

if (passedTests === totalTests) {
  console.log('\n✅ TEST PASSED: Malla Enciclopédica Wikipedia ZTM validada. Exit Code 0.');
  process.exit(0);
} else {
  console.error('\n❌ TEST FAILED: Fallo en la malla enciclopédica.');
  process.exit(1);
}
