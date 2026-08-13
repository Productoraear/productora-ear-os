import { GravitationalIngestionEngine } from '../../src/lib/services/rag/GravitationalIngestionEngine';
import * as path from 'path';

// ============================================================================
// 🎻 OMEGA GRAVITATIONAL VAMPIRIZER - BIG BAND SYMPHONIC INGESTION CLI
// Ingestion & Semantic Query Orchestrator for EAR OS
// ============================================================================

async function main() {
  const query = process.argv.slice(2).join(' ').trim();

  if (!query) {
    console.log('=' .repeat(88));
    console.log('🎻 USO: npx ts-node scripts/ingestion/gravitational_vampirizer.ts "consulta semántica"');
    console.log('=' .repeat(88));
    return;
  }

  console.log('=' .repeat(88));
  console.log(`🌌 INICIANDO EXTRACCIÓN GRAVITACIONAL S-CLASS`);
  console.log(`CONSULTA: "${query}"`);
  console.log('=' .repeat(88));

  const engine = new GravitationalIngestionEngine({
    bunkerPath: 'D:\\EAR_OS_INTEL_BUNKER',
    dbPath: 'D:\\EAR_OS_INTEL_BUNKER\\_vector_db\\embeddings.json',
    localApiUrl: 'http://127.0.0.1:1234/v1/embeddings',
    model: 'nomic-embed-text',
    topK: 15
  } as any);

  try {
    const start = Date.now();
    const result = await engine.search(query, 15);
    const elapsed = Date.now() - start;

    console.log(`\n📊 FUENTE: ${result.source}`);
    console.log(`DOCUMENTOS EN ÍNDICE: ${result.totalIndexed}`);
    console.log(`DOCUMENTOS FILTRADOS DE ALTA SEÑAL: ${result.totalFiltered}`);
    console.log(`TIEMPO DE EJECUCIÓN: ${elapsed}ms`);
    console.log('=' .repeat(88));

    if (result.results.length === 0) {
      console.log('⚠️ No se encontraron coincidencias de alta señal para los filtros gravitacionales.');
      return;
    }

    result.results.forEach((doc, idx) => {
      console.log(`\n#${idx + 1} | SIMILITUD: ${(doc.score || 0).toFixed(4)} | AJUSTADA: ${(doc.adjustedScore || 0).toFixed(4)}`);
      console.log(`ARCHIVO: ${path.basename(doc.path || 'unknown')}`);
      console.log(`RUTA: ${doc.path}`);
      console.log(`CONTEXTO: ${doc.preview?.replace(/\s+/g, ' ').slice(0, 300)}...`);
    });

    console.log('\n✅ EXTRACCIÓN_GRAVITACIONAL_EXITOSA (100% ADITIVO)');
  } catch (err: any) {
    console.error('❌ [ERROR GRAVITACIONAL]:', err.message);
  }
}

main().catch(console.error);
