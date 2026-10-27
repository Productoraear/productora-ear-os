#!/usr/bin/env node
'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VERIFY_PROVINCE_ADJACENCY.CJS — GUARDIÁN DE LA FASE 2
 * ════════════════════════════════════════════════════════════════════════════════
 * 1. Colindancias correctas (Madrid↔Toledo sí; Madrid↔Barcelona no).
 * 2. Aceptación SOLO con evidencia de dominio.
 * 3. `confidence <= 0.90` y `verified:false` en todo rescate transfronterizo.
 * 4. Los pares de DuckDB (exact y fuzzy) coinciden exactamente con el SSOT JS.
 * 5. Los SQL filtran provincias limítrofes y no relajan el resto.
 * Exit Code 0 = Fase 2 blindada.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { ADJACENCY_PAIRS, areAdjacent, normProvince, neighborsOf } = require('./lib/province_adjacency.cjs');
const { evaluateCandidate, chooseForProvider } = require('./lib/provider_enrichment.cjs');

const failures = [];
let checks = 0;

function check(label, condition, detail) {
    checks++;
    if (!condition) failures.push(`${label}${detail ? ` -> ${detail}` : ''}`);
}

/* 1. Colindancias reales. */
check('Madrid↔Toledo', areAdjacent('Madrid', 'Toledo') === true);
check('Madrid↔Guadalajara', areAdjacent('madrid', 'guadalajara') === true);
check('Madrid↔Barcelona NO', areAdjacent('Madrid', 'Barcelona') === false);
check('Barcelona↔Girona (alias Gerona)', areAdjacent('Barcelona', 'Gerona') === true);
check('Sevilla↔Cádiz', areAdjacent('Sevilla', 'Cádiz') === true);
check('Baleares sin frontera', areAdjacent('Baleares', 'Valencia') === false);
check('misma provincia no es adyacente', areAdjacent('Madrid', 'Madrid') === false);
check('vacío no es adyacente', areAdjacent('', 'Toledo') === false);
check('alias La Coruña', normProvince('La Coruña') === 'a coruna');
check('alias Vizcaya', normProvince('Vizcaya') === 'bizkaia');
check('vecinos de Madrid', JSON.stringify(neighborsOf('Madrid')) === JSON.stringify(['avila', 'cuenca', 'guadalajara', 'segovia', 'toledo']), JSON.stringify(neighborsOf('Madrid')));
check('pares simétricos únicos', ADJACENCY_PAIRS.length === 110, String(ADJACENCY_PAIRS.length));

/* 2-3. Motor de atribución: rescate solo con dominio y nunca verificado. */
const provider = { vendorId: '9001', name: 'Finca Los Olivos Toledo', province: 'Madrid', category: 'finca' };
const strong = {
    vendorId: '9001', mode: 'exact', geo: 0, cat: 1, adjacent: true,
    ov_id: 'ov-1', ov_name: 'Finca Los Olivos Toledo', ov_category: 'event_venue', ov_prov: 'toledo',
    region: 'Toledo', locality: 'Toledo', jw: 1,
    phones: ['+34 925 123 456'], websites: ['https://fincalosolivos.es'],
    emails: ['reservas@fincalosolivos.es'], socials: [],
    street: 'Camino de la Vega 3', lat: 39.8628, lon: -4.0273
};
const strongEval = evaluateCandidate(provider, strong, 1);
check('acepta colindante con dominio', strongEval.accepted === true, strongEval.reason);
check('marca adyacencia', strongEval.adjacent === true);
const strongResult = chooseForProvider(provider, [strongEval]);
check('produce enriquecimiento', Boolean(strongResult.enrichment));
if (strongResult.enrichment) {
    const enrichment = strongResult.enrichment;
    check('confidence limitada a 0.90', enrichment.confidence === 0.9, String(enrichment.confidence));
    check('verified NUNCA true en colindante', enrichment.verified === false);
    check('teléfono real atribuido', enrichment.phone === '+34 925 123 456', enrichment.phone);
    check('matched.crossProvince', enrichment.matched.crossProvince === true);
    check('matched.providerProvince', enrichment.matched.providerProvince === 'Madrid');
    check('regla trazable', String(enrichment.evidence.rule).includes('adjacent-province'), enrichment.evidence.rule);
    check('geo conservada', enrichment.lat === 39.8628 && enrichment.lng === -4.0273);
}

const weak = { ...strong, websites: ['https://sitio-ajeno-sin-relacion.es'], emails: ['hola@sitio-ajeno-sin-relacion.es'] };
const weakEval = evaluateCandidate(provider, weak, 1);
check('rechaza colindante sin dominio', weakEval.accepted === false, weakEval.reason);
check('motivo exacto', weakEval.reason === 'exact_adjacent_no_domain_evidence', weakEval.reason);

const notNeighbor = { ...strong, ov_prov: 'barcelona', region: 'Barcelona' };
const notNeighborEval = evaluateCandidate(provider, notNeighbor, 1);
check('rechaza no colindante', notNeighborEval.accepted === false);
check('motivo geo mismatch', notNeighborEval.reason === 'exact_geo_mismatch', notNeighborEval.reason);

const sameProvince = { ...strong, geo: 1, adjacent: false, ov_prov: 'madrid', region: 'Madrid' };
const sameResult = chooseForProvider(provider, [evaluateCandidate(provider, sameProvince, 1)]);
check('misma provincia sigue verificando', Boolean(sameResult.enrichment) && sameResult.enrichment.verified === true);
check('misma provincia 0.99', Boolean(sameResult.enrichment) && sameResult.enrichment.confidence === 0.99);

/* 4-5. Deriva SQL. */
function pairsFromSql(file) {
    const sql = fs.readFileSync(file, 'utf8');
    const block = /INSERT INTO prov_neigh_base VALUES([\s\S]*?);/.exec(sql);
    if (!block) return null;
    const pairs = [...block[1].matchAll(/\('([^']+)',\s*'([^']+)'\)/g)].map((match) => [match[1], match[2]]);
    return { pairs, sql };
}

const expected = ADJACENCY_PAIRS.map(([a, b]) => `${a}|${b}`).sort();
for (const file of ['overture_exact.sql', 'overture_fuzzy.sql']) {
    const parsed = pairsFromSql(path.join(__dirname, file));
    check(`${file}: tabla prov_neigh`, Boolean(parsed));
    if (!parsed) continue;
    const actual = parsed.pairs.map(([a, b]) => `${a}|${b}`).sort();
    check(`${file}: pares idénticos al SSOT JS`, JSON.stringify(actual) === JSON.stringify(expected), `${actual.length} vs ${expected.length}`);
    check(`${file}: simetría SQL`, parsed.sql.includes('UNION SELECT b, a FROM prov_neigh_base'));
    check(`${file}: columna adjacent`, parsed.sql.includes('AS adjacent'));
    check(`${file}: join de colindancia`, parsed.sql.includes('LEFT JOIN prov_neigh pn'));
}
const fuzzy = fs.readFileSync(path.join(__dirname, 'overture_fuzzy.sql'), 'utf8');
check('fuzzy no descarta colindantes', fuzzy.includes('(geo > 0 OR adjacent)'));
const exact = fs.readFileSync(path.join(__dirname, 'overture_exact.sql'), 'utf8');
check('exact conserva geo mismatch', exact.includes("WHEN p.prov_norm = '' OR o.prov_norm IS NULL THEN 0.5 ELSE 0.0 END AS geo"));

console.log(JSON.stringify({ checks, fallos: failures.length, pares: ADJACENCY_PAIRS.length }, null, 2));
if (failures.length > 0) {
    console.error('\n❌ FALLOS FASE 2:');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
}
console.log('\n✅ FASE 2 BLINDADA: colindancias exactas, rescate con dominio y jamás verificado.');
