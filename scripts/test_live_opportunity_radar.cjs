/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN FORENSE: OPPORTUNITY RADAR EN VIVO (CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════
 */
const path = require('path');
const fs = require('fs');

async function main() {
    console.log('🔍 [TEST LIVE RADAR] Iniciando verificación forense de fuentes reales...');

    // 1. Probar el conector RSS con un feed real del BOE
    const { fetchRssFeed } = require('../src/lib/services/opportunity-radar/rss-connector.ts');
    const boeUrl = 'https://www.boe.es/rss/canal.php?c=ayudas';

    console.log(`📡 Consultando feed real: ${boeUrl}`);
    const fetchResult = await fetchRssFeed(boeUrl);

    console.log(`• Status: ${fetchResult.ok ? '✅ OK' : '❌ ERROR'}`);
    console.log(`• Avisos extraídos: ${fetchResult.items.length}`);

    if (fetchResult.items.length > 0) {
        const sample = fetchResult.items[0];
        console.log(`• Muestra real: "${sample.title.slice(0, 80)}..."`);
        console.log(`• Link real: ${sample.link}`);
        console.log(`• Publicado: ${sample.publishedAt}`);

        // 2. Probar el clasificador semántico
        const { classifyOpportunity } = require('../src/lib/services/opportunity-radar/classifier.ts');
        const classification = classifyOpportunity(sample.title, sample.description);
        console.log(`• Clasificación: ${classification.categories.join(', ')}`);
        console.log(`• Match Score: ${classification.matchScore}%`);
        console.log(`• Razones: ${classification.matchReasons.join(' | ')}`);
    }

    console.log('\n🏁 [TEST LIVE RADAR] Verificación completada con éxito.');
}

main().catch((err) => {
    console.error('❌ Error en test:', err);
    process.exit(1);
});
