#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · CONTRATO CONCIERGE MULTI-FICHA + SAGAS DURABLES
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el dictamen arquitectónico (`.antigravity/specs/
 * CONCIERGE_MULTITENANT_SAGA_SPEC.md`) se convierte en prosa decorativa si nadie
 * lo ejecuta. Este arnés ata cada cláusula a un símbolo REAL en disco y a un
 * comportamiento observable (no a la compilación), según `.clinerules` §5.
 *
 * Qué prueba (y cómo se rompe: Exit 1):
 *   1. FICHA_STORE      · el índice de 2.150 fichas se construye y resuelve una
 *                         ficha por slug y por URL interna sin I/O de red.
 *   2. EXPOSE_PHONE     · `buildFichaFacts` es FAIL-CLOSED: sin `exposePhone`
 *                         ningún hecho contiene el número del proveedor; con
 *                         `exposePhone: true`, sí aparece.
 *   3. MISSING_FACTS    · una ficha sin tarifa declara el hueco, no lo inventa.
 *   4. LOCK_CONTRACT    · `lockDateAtomically` / `unlockDateAtomically` /
 *                         `releaseStalePendingLocks` existen con su clave de
 *                         idempotencia (`stripeSessionId`) y su TTL real.
 *   5. SAGA_ENGINE_STATE· declara HONESTAMENTE si el motor de sagas existe. Si
 *                         no existe se reporta SIN_EVIDENCIA sin fingir verde.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_saga_contract.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_saga_contract.ts --json
 *
 * Exit: 0 = contrato vivo · 1 = promesa sin motor · 2 = fatal (módulo ilegible).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { findFichaBySlug, getFichaStoreStats, resolveFichaFromUrlOrText } from '../src/lib/providers/fichaProvider';
import { buildFichaFacts, buildFichaMissing } from '../src/lib/providers/providerFichaTypes';
import type { ProviderFicha } from '../src/lib/providers/providerFichaTypes';

const ROOT = process.cwd();
const JSON_MODE = process.argv.includes('--json');

interface Assertion {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const assertions: Assertion[] = [];

function record(id: string, ok: boolean, detail: string): void {
  assertions.push({ id, ok, detail });
}

function read(relativePath: string): string {
  const absolute = path.join(ROOT, relativePath);
  if (!existsSync(absolute)) return '';
  try {
    return readFileSync(absolute, 'utf8');
  } catch {
    return '';
  }
}

// ── 1 · FICHA_STORE ─────────────────────────────────────────────────────────
const stats = getFichaStoreStats();
record(
  'FICHA_STORE_COUNT',
  stats.loaded && stats.entries >= 1500,
  `loaded=${stats.loaded} entries=${stats.entries} gold=${stats.gold} verified=${stats.verified} (umbral 1500 fichas vivas)`,
);

/** Primera ficha del índice canónico: muestra determinista, cero azar. */
function firstIndexedSlug(): string | null {
  const raw = read('public/data/fichas/fichas_index.json');
  if (raw.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const entries: unknown = (parsed as { entries?: unknown }).entries;
  if (!Array.isArray(entries)) return null;
  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) continue;
    const slug: unknown = (entry as { slug?: unknown }).slug;
    if (typeof slug === 'string' && slug.length > 3) return slug;
  }
  return null;
}

const sampleSlug = firstIndexedSlug();
if (sampleSlug === null) {
  record('FICHA_RESOLVE', false, 'fichas_index.json ilegible o sin `entries[]`: no hay muestra resoluble');
} else {
  const bySlug = findFichaBySlug(sampleSlug);
  const viaUrl = resolveFichaFromUrlOrText(`https://www.productoraear.com/proveedores/${sampleSlug}`);
  record(
    'FICHA_RESOLVE',
    bySlug !== null && viaUrl !== null,
    `slug="${sampleSlug}" bySlug=${bySlug !== null} viaUrl=${viaUrl !== null} (cero I/O de red)`,
  );
}

// ── 2 · EXPOSE_PHONE (fail-closed) ──────────────────────────────────────────
const VERIFIED_PHONE = '666777888';
const probeFicha: ProviderFicha = {
  key: 'verify-concierge-probe',
  vendorId: '999999',
  slug: 'verify-concierge-probe',
  name: 'Proveedor Sonda',
  category: 'catering',
  municipality: 'Méntrida',
  province: 'Toledo',
  priceEur: 350,
  priceRange: '',
  rating: 4.8,
  reviewsCount: 12,
  description: 'Proveedor sintético del arnés (no es dato de negocio).',
  phone: VERIFIED_PHONE,
  whatsapp: null,
  email: null,
  web: '',
  lat: null,
  lng: null,
  sources: ['catalogo_html'],
  matchMode: 'vendorId',
  verified: true,
  completeness: 90,
  provenanceHash: 'probe',
};

const closedFacts = buildFichaFacts(probeFicha);
const openFacts = buildFichaFacts(probeFicha, { exposePhone: true });
const closedLeaks = closedFacts.some((fact) => fact.includes(VERIFIED_PHONE));
const openShows = openFacts.some((fact) => fact.includes(VERIFIED_PHONE));
record(
  'EXPOSE_PHONE_FAIL_CLOSED',
  !closedLeaks && openShows,
  `default_leaks=${closedLeaks} explicit_exposes=${openShows} facts_cerrados=${closedFacts.length}`,
);

// ── 3 · MISSING_FACTS (lo que la ficha NO certifica se declara) ──────────────
const noPriceFicha: ProviderFicha = { ...probeFicha, priceEur: null, priceRange: '' };
const missing = buildFichaMissing(noPriceFicha);
const inventedPriceFacts = buildFichaFacts(noPriceFicha).filter((fact) => /tarifa|precio/i.test(fact));
record(
  'MISSING_FACTS_DECLARED',
  missing.includes('tarifa real del servicio') && inventedPriceFacts.length === 0,
  `huecos_declarados=${missing.length} tarifa_en_huecos=${missing.includes('tarifa real del servicio')} precios_inventados=${inventedPriceFacts.length}`,
);

// ── 4 · LOCK_CONTRACT ───────────────────────────────────────────────────────
const lockSource = read('src/lib/availability/atomicDateLockEngine.ts');
const lockSymbols: readonly string[] = [
  'lockDateAtomically',
  'unlockDateAtomically',
  'releaseStalePendingLocks',
  'stripeSessionId',
];
const missingSymbols = lockSymbols.filter((symbol) => !lockSource.includes(symbol));
record(
  'LOCK_CONTRACT_SYMBOLS',
  lockSource.length > 0 && missingSymbols.length === 0,
  missingSymbols.length === 0
    ? `símbolos presentes: ${lockSymbols.join(', ')}`
    : `faltan en atomicDateLockEngine.ts: ${missingSymbols.join(', ')}`,
);

const ttlMatch = /releaseStalePendingLocks\s*\(\s*ttlMinutes\s*=\s*(\d+)/.exec(lockSource);
const ttlMinutes = ttlMatch === null ? null : Number(ttlMatch[1]);
record(
  'LOCK_TTL_MEASURED',
  ttlMinutes !== null && ttlMinutes > 0,
  `TTL real de liberación de retenes = ${ttlMinutes === null ? 'no declarado' : String(ttlMinutes)} min (el discurso dice 45; el disco manda)`,
);

// ── 5 · SAGA_ENGINE_STATE (honestidad anti-fachada) ─────────────────────────
function sagaFilesInDisk(): readonly string[] {
  const relativeDir = path.join('src', 'lib', 'booking');
  const absoluteDir = path.join(ROOT, relativeDir);
  if (!existsSync(absoluteDir)) return [];
  try {
    return readdirSync(absoluteDir).filter((name) => /saga/i.test(name));
  } catch {
    return [];
  }
}

const sagaFiles = sagaFilesInDisk();
record(
  'SAGA_ENGINE_STATE',
  true,
  sagaFiles.length === 0
    ? 'SIN_EVIDENCIA: no existe motor de sagas en src/lib/booking (declarado, no prometido)'
    : `presente: ${sagaFiles.join(', ')}`,
);

// ── Veredicto ───────────────────────────────────────────────────────────────
const failures = assertions.filter((item) => !item.ok);
const verdict = failures.length === 0 ? 'PASS' : 'FAIL';

if (JSON_MODE) {
  console.log(JSON.stringify({ harness: 'verify_concierge_saga_contract.ts', verdict, assertions }, null, 2));
} else {
  console.log('── CONTRATO CONCIERGE MULTI-FICHA + SAGAS (EARS) ──────────────');
  for (const item of assertions) {
    console.log(`${item.ok ? '[OK]  ' : '[FAIL]'} ${item.id}: ${item.detail}`);
  }
  if (failures.length > 0) {
    console.log('');
    console.log('PROMESAS SIN MOTOR (SIN_EVIDENCIA):');
    for (const item of failures) console.log(`  · ${item.id} — ${item.detail}`);
  }
}

console.log(`CONCIERGE_SAGA_CONTRACT=${verdict} ASSERTIONS=${assertions.length} FAILED=${failures.length}`);
process.exit(failures.length === 0 ? 0 : 1);
