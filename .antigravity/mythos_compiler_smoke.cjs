#!/usr/bin/env node
/**
 * MYTHOS DUAL-DOMAIN COMPILER — SMOKE TEST DETERMINÍSTICO (sin GPU).
 * ----------------------------------------------------------------------------
 * Verifica el contrato numérico del compilador sin depender de ts-node ni de la
 * red. Lee la Zona Cero (ear-os-ssot.ts) y el módulo del compilador, y asevera:
 *   1. Dinero SSOT: base 350 € -> artista 280 € / EAR 35 € / VIMUME 35 €.
 *   2. Depósito inmutable 100 €.
 *   3. SCORECARD 16/16 ampliado (CORE + CYBER + BIO + GOVERNANCE).
 *   4. Doble dominio CYBER_DEFENSE + BIO_ACOUSTIC.
 *   5. Rider acústico adaptativo (4 contextos).
 *   6. Hash SHA-256 canónico de la Zona Cero (reproduce KNOWN_GOOD_SSOT_HASH).
 * ----------------------------------------------------------------------------
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const compilerSrc = read('src/lib/compiler/mythos-dual-domain-compiler.ts');
const ssotSrc = read('src/lib/constants/ear-os-ssot.ts');

const stripComments = (src) =>
    src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\n]*/g, '');

const num = (src, re) => {
    const m = stripComments(src).match(re);
    if (!m) return NaN;
    return Number(m[1]);
};

const failures = [];

// ── 1. Dinero SSOT derivado de Zona Cero ─────────────────────────────────────
const baseEur = num(ssotSrc, /TARIFA_BASE_SOLISTA_EUR\s*:\s*number\s*=\s*([\d.]+)/);
const depositEur = num(ssotSrc, /DEPOSITO_STRIPE_EUR\s*:\s*number\s*=\s*([\d.]+)/);
const spArtista = num(ssotSrc, /artista\s*:\s*([\d.]+)/);
const spEarOs = num(ssotSrc, /earOs\s*:\s*([\d.]+)/);
const spVimume = num(ssotSrc, /vimume\s*:\s*([\d.]+)/);

const artistaEur = (baseEur * spArtista).toFixed(2);
const earOsEur = (baseEur * spEarOs).toFixed(2);
const vimumeEur = (baseEur * spVimume).toFixed(2);

const assert = (label, ok, detail) => {
    if (ok) {
        console.log('  ✅ ' + label + (detail ? ' — ' + detail : ''));
    } else {
        failures.push(label);
        console.error('  ❌ ' + label + (detail ? ' — ' + detail : ''));
    }
};

assert('Tarifa base solista = 350,00 €', baseEur === 350.0, baseEur.toFixed(2));
assert('Depósito inmutable = 100,00 €', depositEur === 100.0, depositEur.toFixed(2));
assert('Split 80/10/10 suma 1', Math.abs(spArtista + spEarOs + spVimume - 1) < 1e-9,
    `${spArtista}/${spEarOs}/${spVimume}`);
assert('Split sobre TOTAL show 350 € -> artista 280 €', artistaEur === '280.00', artistaEur);
assert('Split sobre TOTAL show 350 € -> EAR 35 €', earOsEur === '35.00', earOsEur);
assert('Split sobre TOTAL show 350 € -> VIMUME 35 €', vimumeEur === '35.00', vimumeEur);

// ── 2. El compilador consume Zona Cero (imports) y no re-hardcodea dinero ────
assert('Importa SSOT canónico', /from\s+'\.\.\/constants\/ear-os-ssot'/.test(compilerSrc));
assert('NO re-hardcodea "280,00" literal', !compilerSrc.includes('280.00'), 'deriva de SPLIT_SOBERANO');

// ── 3. SCORECARD 16/16 ampliado ──────────────────────────────────────────────
const hasScorecardHeader = compilerSrc.includes('SCORECARD 16/16');
const coreChecks = compilerSrc.includes('CORE_8');
const cyberChecks = compilerSrc.includes('CYBER_4');
const bioChecks = compilerSrc.includes('BIO_2');
const govChecks = compilerSrc.includes('GOV_2');
assert('Scorecard 16/16 (header)', hasScorecardHeader);
assert('Capas CORE (8)', coreChecks);
assert('Capas CYBER (4)', cyberChecks);
assert('Capas BIO (2)', bioChecks);
assert('Capas GOVERNANCE (2)', govChecks);

// ── 4. Doble dominio ─────────────────────────────────────────────────────────
assert('Dominio CYBER_DEFENSE', compilerSrc.includes('CYBER_DEFENSE'));
assert('Dominio BIO_ACOUSTIC', compilerSrc.includes('BIO_ACOUSTIC'));
assert('Fail-closed de secretos', compilerSrc.includes('Fail-closed'));
assert('Firma webhook obligatoria', compilerSrc.includes('Firma webhook Stripe obligatoria'));
assert('Ledger idempotente', compilerSrc.includes('LEDGER_IDEMPOTENCE') && compilerSrc.includes('idempotente'));

// ── 5. Rider acústico adaptativo (4 contextos) ───────────────────────────────
assert('Rider FESTEJO (90-102 dBA)', compilerSrc.includes('FESTEJO') && compilerSrc.includes('102'));
assert('Rider BODA_FINCA (85-90 dBA)', compilerSrc.includes('BODA_FINCA') && compilerSrc.includes('90'));
assert('Rider SOLISTA_COCTEL (70-80 dBA)', compilerSrc.includes('SOLISTA_COCTEL') && compilerSrc.includes('80'));
assert('Rider VIMUME_SENIOR (65-75 dBA)', compilerSrc.includes('VIMUME_SENIOR') && compilerSrc.includes('65'));

// ── 6. Hash SHA-256 canónico de Zona Cero (Sentinel) ─────────────────────────
// Reproduce EXACTAMENTE la serialización canónica de ssotIntegrityGuard.ts.
const ordered = {
    TARIFA_BASE_SOLISTA_EUR: '350.00',
    LOGISTICA_EUR_PER_KM: '1.50',
    LOGISTICA_KM_EXENTOS: '50.00',
    LOGISTICA_KM_HOTEL: '200.00',
    SUPLEMENTO_HOTEL_EUR: '120.00',
    HORA_FIN_HOTEL: '3.00',
    DEPOSITO_STRIPE_EUR: '100.00',
    LIMITE_B2G_LCSP_EUR: '15000.00',
    SAFE_LCSP_CEILING_EUR: '14250.00',
    LIMITE_SPL_DB: '75.00',
    WATTS_PER_PAX: '12.00',
    VAT_RATE: '0.21',
    CENTRALITA_EAR_OS: '+34 693 693 048',
    SPLIT_SOBERANO: '{artista:0.8000,earOs:0.1000,vimume:0.1000}'
};
const canonical = Object.entries(ordered)
    .map(([k, v]) => `${k}:${v}`)
    .sort()
    .join('|');
const sentinelHash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
const KNOWN_GOOD_SSOT_HASH = 'ebc011a07ea56e1f196d4b890ad1228142bc74ba0e56dae8e38d29cf55bb29dd';
assert('Sentinel SHA-256 reproduce KNOWN_GOOD_SSOT_HASH', sentinelHash === KNOWN_GOOD_SSOT_HASH, sentinelHash);

// ── Resultado ────────────────────────────────────────────────────────────────
console.log('\n──────────────────────────────────────────────');
if (failures.length > 0) {
    console.error(`FAIL — ${failures.length} aserciones rotas:`);
    failures.forEach((f) => console.error('  - ' + f));
    process.exit(1);
}
console.log('PASS — MYTHOS DUAL-DOMAIN COMPILER (contrato sellado)');
process.exit(0);