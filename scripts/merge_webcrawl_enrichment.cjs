#!/usr/bin/env node
'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * MERGE_WEBCRAWL_ENRICHMENT.CJS — FUSIÓN FASE 1 → OVERLAY DE ENRIQUECIMIENTO
 * ════════════════════════════════════════════════════════════════════════════════
 * Toma reports/PROVIDER_WEBCRAWL_INTEL.json y completa huecos del overlay
 * reports/PROVIDER_ENRICHMENT.json sin sobrescribir jamás el teléfono de Overture
 * ni reutilizar un número ya reclamado por otro proveedor (enriquecimiento o Edge).
 *
 * USO:
 *   node scripts/merge_webcrawl_enrichment.cjs --dry-run
 *   node scripts/merge_webcrawl_enrichment.cjs
 *   node scripts/merge_webcrawl_enrichment.cjs --crawl=reports/OTRO.json --enrichment=reports/OTRO_ENRICH.json
 *
 * Exit Code 0 = fusión aplicada (o simulada) sin conflictos nuevos.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const path = require('path');
const { applyWebcrawlMerge } = require('./lib/webcrawl_merge.cjs');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (prefix) => {
    const found = args.find((arg) => arg.startsWith(prefix));
    return found ? path.resolve(ROOT, found.slice(prefix.length)) : '';
};

const options = { dryRun: has('--dry-run') };
const crawlPath = valueOf('--crawl=');
const enrichmentPath = valueOf('--enrichment=');
const edgeDir = valueOf('--edge=');
if (crawlPath) options.crawlPath = crawlPath;
if (enrichmentPath) options.enrichmentPath = enrichmentPath;
if (edgeDir) options.edgeDir = edgeDir;

const result = applyWebcrawlMerge(options);
if (!result.applied) {
    console.error(`❌ Fusión no aplicable: ${result.reason}. Ejecuta antes el crawler (Fase 1).`);
    process.exit(1);
}

const stats = result.stats;
console.log(JSON.stringify({
    modo: options.dryRun ? 'dry-run' : 'escritura',
    proveedoresEvaluados: stats.vendorsConsidered,
    proveedoresEnOverlay: stats.vendorsMatched,
    telefonosAñadidos: stats.phonesAdded,
    telefonosYaPresentes: stats.phonesAlreadyPresent,
    telefonosRetenidosPorConflicto: stats.phonesWithheldClaimed,
    emailsAñadidos: stats.emailsAdded,
    redesAñadidas: stats.socialsAdded,
    proveedoresTocados: stats.vendorsTouched,
    telefonosDisputados: stats.disputedPhones,
    verificadosAntes: stats.verifiedBefore,
    verificadosDespues: stats.verifiedAfter,
    totales: stats.counts
}, null, 2));

if (options.dryRun) {
    console.log('\nℹ️  Dry run: no se ha modificado reports/PROVIDER_ENRICHMENT.json');
} else {
    console.log('\n✅ Overlay actualizado. Siguiente paso: node scripts/build_enrichment_chunks.cjs && node scripts/build_lean_verified_edge.cjs && node scripts/verify_provider_edge_truth.cjs');
}
