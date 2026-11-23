/**
 * ════════════════════════════════════════════════════════════════════════════
 * TEST DE CONTRATO — 8 PERSONAS DEL ORÁCULO (Ley Anti-Fachada AF-1)
 * ════════════════════════════════════════════════════════════════════════════
 * El defecto que este test impide reintroducir:
 *
 *   `src/app/api/admin/compile-intent/route.ts` declaraba ocho personas en Zod
 *   mientras `refineQueryWithOracle` solo implementaba dos. Las seis restantes
 *   caían en el `else` y devolvían doctrina de CEO con `persona: 'CEO'`.
 *
 * Propiedades verificadas (deterministas, 0 aleatoriedad):
 *
 *   P1. Cobertura total: cada ID de `ORACLE_PERSONA_IDS` devuelve su propio
 *       `persona` — nunca la degrada a CEO.
 *   P2. Inyectividad de doctrina: las 8 personas producen 8 `doctrineName`
 *       DISTINTOS (cardinalidad 8/8).
 *   P3. Inyectividad de prompt: las 8 personas producen 8 `refinedPrompt`
 *       distintos para una orden idéntica.
 *   P4. Trazabilidad SSOT: toda cifra presente en la doctrina pertenece al
 *       SSOT canónico (INV-10 — cero precio tecleado a mano).
 *   P5. Type-guard: `isOraclePersona` rechaza cualquier valor fuera del
 *       contrato (`'CISO'`, `''`, `null`, objeto, número).
 *
 * Ejecución: npx tsx src/lib/oracle/__tests__/oracle-personas.test.ts
 * Exit Code 0 si las cinco propiedades se cumplen; 1 en caso contrario.
 * ════════════════════════════════════════════════════════════════════════════
 */

import assert from 'node:assert/strict';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SPLIT_SOBERANO,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  VAT_RATE,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import {
  ORACLE_PERSONA_CATALOG,
  ORACLE_PERSONA_IDS,
  getOracleDoctrine,
  isOraclePersona,
  refineQueryWithOracle,
} from '../quantum-oracle-engine';
import type { OraclePersona } from '../quantum-oracle-engine';

/** Orden de prueba común: la misma entrada para las ocho personas. */
const ORDER = 'prepara la campaña de fincas y el cobro del depósito con garantías';

const PERSONAS: readonly OraclePersona[] = ORACLE_PERSONA_IDS;

let checks = 0;
function ok(label: string, condition: boolean): void {
  assert.equal(condition, true, `FALLO: ${label}`);
  checks += 1;
}

/* ── P0. Contrato cerrado: exactamente ocho personas ─────────────────────── */
ok('P0 · hay 8 personas declaradas', PERSONAS.length === 8);
ok('P0 · el catálogo tiene 8 descriptores', ORACLE_PERSONA_CATALOG.length === 8);
ok(
  'P0 · ids únicos (sin duplicados)',
  new Set(PERSONAS).size === PERSONAS.length,
);

/* ── P1. Cobertura total: ninguna persona se degrada a CEO ───────────────── */
for (const persona of PERSONAS) {
  const result = refineQueryWithOracle(ORDER, persona);
  ok(`P1 · refine(${persona}).persona === '${persona}'`, result.persona === persona);
  ok(`P1 · refine(${persona}) devuelve prompt no vacío`, result.refinedPrompt.length > 0);
  ok(`P1 · refine(${persona}) devuelve al menos 3 palancas`, result.tacticalLevers.length >= 3);
  ok(`P1 · refine(${persona}) devuelve al menos 3 verificaciones`, result.businessChecks.length >= 3);
}

/* ── P2. Inyectividad de doctrina: 8 personas ⇒ 8 doctrinas ─────────────── */
const doctrineNames = new Set(PERSONAS.map((p) => getOracleDoctrine(p).nombre));
ok(
  `P2 · 8 doctrinas distintas (obtenidas ${doctrineNames.size})`,
  doctrineNames.size === PERSONAS.length,
);

/* ── P3. Inyectividad de prompt: 8 personas ⇒ 8 prompts ──────────────────── */
const refinedPrompts = new Set(
  PERSONAS.map((p) => refineQueryWithOracle(ORDER, p).refinedPrompt),
);
ok(
  `P3 · 8 prompts refinados distintos (obtenidos ${refinedPrompts.size})`,
  refinedPrompts.size === PERSONAS.length,
);

/* ── P4. Trazabilidad SSOT: cero cifras tecleadas a mano ────────────────── */
const ALLOWED_FIGURES = new Map<string, string>([
  [DEPOSITO_STRIPE_EUR.toFixed(2), 'DEPOSITO_STRIPE_EUR'],
  [TARIFA_BASE_SOLISTA_EUR.toFixed(0), 'TARIFA_BASE_SOLISTA_EUR'],
  [TARIFA_BASE_SOLISTA_EUR.toFixed(2), 'TARIFA_BASE_SOLISTA_EUR'],
  [AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES'), 'AJUSTE_PREVENTIVO_B2G_EUR'],
  [LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES'), 'LIMITE_B2G_LCSP_EUR'],
  [String(Math.round(VAT_RATE * 100)), 'VAT_RATE'],
  [String(LIMITE_SPL_DB), 'LIMITE_SPL_DB'],
  [String(WATTS_PER_PAX), 'WATTS_PER_PAX'],
  [String(Math.round(SPLIT_SOBERANO.artista * 100)), 'SPLIT_SOBERANO.artista'],
  [String(Math.round(SPLIT_SOBERANO.earOs * 100)), 'SPLIT_SOBERANO.earOs'],
  [String(Math.round(SPLIT_SOBERANO.vimume * 100)), 'SPLIT_SOBERANO.vimume'],
  [LOGISTICA_EUR_PER_KM.toFixed(2), 'LOGISTICA_EUR_PER_KM'],
  [String(LOGISTICA_KM_EXENTOS), 'LOGISTICA_KM_EXENTOS'],
  [SUPLEMENTO_HOTEL_EUR.toFixed(0), 'SUPLEMENTO_HOTEL_EUR'],
]);

/**
 * Cifras con significado ECONÓMICO o de unidad técnica (€ / dB / W/pax).
 * Los umbrales de ingeniería (CLS ≤ 0,05 · LCP ≤ 2,5 s · INP ≤ 200 ms) son
 * presupuesto de rendimiento declarado en la doctrina (INV-11), no cifras de
 * negocio, y por diseño NO viven en el SSOT de precios.
 */
const MONEY_OR_UNIT = /\d[\d.,]*\s*(?:€|dB|W\/pax)/g;

for (const persona of PERSONAS) {
  const doctrine = getOracleDoctrine(persona);
  const corpus = [...doctrine.principios, ...doctrine.verificaciones].join(' ');
  const figures = corpus.match(MONEY_OR_UNIT) ?? [];
  for (const raw of figures) {
    const token = raw.trim();
    const numeric = token.replace(/[^\d.,]/g, '');
    const isSsot = ALLOWED_FIGURES.has(numeric) || ALLOWED_FIGURES.has(token);
    ok(`P4 · ${persona} · cifra "${token}" rastreable al SSOT`, isSsot);
  }
}

/* ── P5. Type-guard del boundary (SEC-4) ────────────────────────────────── */
ok('P5 · acepta cada id del contrato', PERSONAS.every((p) => isOraclePersona(p)));
for (const rejected of ['CISO', 'ceo', '', ' ARTISTA ', 'PACIENTE']) {
  ok(`P5 · rechaza "${rejected}"`, isOraclePersona(rejected) === false);
}
ok('P5 · rechaza null', isOraclePersona(null) === false);
ok('P5 · rechaza undefined', isOraclePersona(undefined) === false);
ok('P5 · rechaza número', isOraclePersona(42) === false);
ok('P5 · rechaza objeto', isOraclePersona({ persona: 'CEO' }) === false);

/* ── P6. Retorno a CEO por defecto (contrato del llamador) ──────────────── */
const defaulted = refineQueryWithOracle(ORDER);
ok("P6 · sin persona explícita devuelve 'CEO'", defaulted.persona === 'CEO');

console.log(`[ORACLE-PERSONAS] OK · ${checks} aserciones · 8/8 doctrinas distintas · Exit 0`);
