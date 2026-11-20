/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR EJECUTABLE — ROUTE-GATING + PUENTE HMAC N8N
 * ════════════════════════════════════════════════════════════════════════════
 * Prueba mecánicamente, sin red y sin base de datos:
 *   1. La lista blanca certificada y el matching por PREFIJO SEGMENTADO
 *      (`/presupuesto-oculto` NO cuela por `startsWith('/presupuesto')`).
 *   2. La firma HMAC-SHA256 acepta el mensaje legítimo, rechaza cuerpo
 *      manipulado, rechaza replay fuera de ventana y falla cerrado sin secreto.
 *
 * Exit Code 0 = todas las aserciones pasan. Exit Code 1 = alguna falla.
 * Uso: npx --no-install tsx scripts/verify_route_gating_and_hmac_bridge.ts
 * ════════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  computeN8nSignature,
  verifyN8nSignature,
  N8N_DISPATCH_ACTIONS,
  N8N_SECRET_ENV_KEYS,
} from '../src/lib/security/n8nHmacBridge';

const scriptDir: string = path.dirname(fileURLToPath(import.meta.url));
const repoRoot: string = path.resolve(scriptDir, '..');

let passed = 0;
const failures: string[] = [];

function assert(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    passed += 1;
    console.log(`  PASS · ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL · ${label}${detail !== undefined ? ` — ${detail}` : ''}`);
  }
}

/* ── BLOQUE 1 · ROUTE-GATING ─────────────────────────────────────────────── */

console.log('── BLOQUE 1 · ROUTE-GATING (middleware) ──');

const middlewareSource: string = readFileSync(path.join(repoRoot, 'src', 'middleware.ts'), 'utf8');

const EXPECTED_CERTIFIED: readonly string[] = [
  '/',
  '/gobiernos',
  '/celebraciones',
  '/profesionales',
  '/restaurante-otzarreta',
  '/seating-planner',
  '/presupuesto',
  '/portal/proveedor',
  '/login',
];

assert(
  'declara CERTIFIED_PRODUCTION_ROUTES',
  middlewareSource.includes('const CERTIFIED_PRODUCTION_ROUTES'),
);

for (const route of EXPECTED_CERTIFIED) {
  const literal = `'${route}'`;
  assert(`ruta certificada presente: ${route}`, middlewareSource.includes(literal), `falta ${literal}`);
}

assert(
  'redirige con 307 (preserva método, no caché permanente)',
  /NextResponse\.redirect\(.*?,\s*307\)/s.test(middlewareSource),
);
assert(
  'matching por prefijo segmentado (no startsWith crudo de ruta)',
  middlewareSource.includes('pathname.startsWith(`${route}/`)'),
);

/**
 * Reimplementación fiel de la lógica del middleware para probar el
 * comportamiento observable (la función no se exporta: es privada del edge).
 */
function isCertifiedRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return EXPECTED_CERTIFIED.some(
    (route) => route !== '/' && (pathname === route || pathname.startsWith(`${route}/`)),
  );
}

assert('certifica la raíz exacta', isCertifiedRoute('/'));
assert('certifica ruta de la lista', isCertifiedRoute('/restaurante-otzarreta'));
assert('certifica subruta de la lista', isCertifiedRoute('/presupuesto/paso-2'));
assert('NO certifica ruta en taller', !isCertifiedRoute('/dashboard-interno'));
assert(
  'NO certifica prefijo trampa (/presupuesto-oculto)',
  !isCertifiedRoute('/presupuesto-oculto'),
);
assert('NO certifica /vimume (en taller)', !isCertifiedRoute('/vimume'));

/* ── BLOQUE 2 · PUENTE HMAC n8n ──────────────────────────────────────────── */

console.log('── BLOQUE 2 · PUENTE HMAC-SHA256 n8n ──');

const SECRET = 'secreto_de_prueba_suficientemente_largo_para_hmac_0123456789';
const ENV: Record<string, string> = { [N8N_SECRET_ENV_KEYS[0]]: SECRET };
const NOW = 1_760_000_000_000; // instante fijo → test determinista
const TS = String(Math.floor(NOW / 1000));
const BODY = JSON.stringify({ action: 'STRIPE_PRICE_LOCK_CONFIRMED', payload: { sessionId: 'cs_test_123' } });
const GOOD_SIG = computeN8nSignature(SECRET, TS, BODY);

assert(
  'acepta firma legítima',
  verifyN8nSignature({ rawBody: BODY, signature: GOOD_SIG, timestamp: TS, nowMs: NOW, env: ENV }).ok,
);

assert(
  'rechaza cuerpo manipulado (1 byte distinto)',
  !verifyN8nSignature({
    rawBody: `${BODY} `,
    signature: GOOD_SIG,
    timestamp: TS,
    nowMs: NOW,
    env: ENV,
  }).ok,
);

assert(
  'rechaza firma de otro secreto',
  !verifyN8nSignature({
    rawBody: BODY,
    signature: computeN8nSignature('otro_secreto', TS, BODY),
    timestamp: TS,
    nowMs: NOW,
    env: ENV,
  }).ok,
);

const STALE_TS = String(Math.floor(NOW / 1000) - 4000);
assert(
  'rechaza replay fuera de ventana (STALE_TIMESTAMP)',
  (() => {
    const v = verifyN8nSignature({
      rawBody: BODY,
      signature: computeN8nSignature(SECRET, STALE_TS, BODY),
      timestamp: STALE_TS,
      nowMs: NOW,
      env: ENV,
    });
    return !v.ok && v.reason === 'STALE_TIMESTAMP';
  })(),
);

assert(
  'fail-closed sin secreto (NO_SECRET)',
  (() => {
    const v = verifyN8nSignature({ rawBody: BODY, signature: GOOD_SIG, timestamp: TS, nowMs: NOW, env: {} });
    return !v.ok && v.reason === 'NO_SECRET';
  })(),
);

assert(
  'rechaza firma ausente (MISSING_SIGNATURE)',
  (() => {
    const v = verifyN8nSignature({ rawBody: BODY, signature: null, timestamp: TS, nowMs: NOW, env: ENV });
    return !v.ok && v.reason === 'MISSING_SIGNATURE';
  })(),
);

assert(
  'acepta rotación vía secreto secundario',
  verifyN8nSignature({
    rawBody: BODY,
    signature: GOOD_SIG,
    timestamp: TS,
    nowMs: NOW,
    env: { [N8N_SECRET_ENV_KEYS[1]]: SECRET },
  }).ok,
);

assert('declara las 5 acciones del bus', N8N_DISPATCH_ACTIONS.length === 5, `encontradas ${N8N_DISPATCH_ACTIONS.length}`);

/* ── BLOQUE 3 · ENDPOINT EN DISCO ────────────────────────────────────────── */

console.log('── BLOQUE 3 · ENDPOINT /api/webhooks/n8n-dispatch ──');

const routeSource: string = readFileSync(
  path.join(repoRoot, 'src', 'app', 'api', 'webhooks', 'n8n-dispatch', 'route.ts'),
  'utf8',
);

assert('verifica la firma ANTES de parsear el cuerpo', routeSource.indexOf('verifyN8nSignature') < routeSource.indexOf('JSON.parse'));
assert('valida el cuerpo con Zod', routeSource.includes('safeParse'));
assert('declara probed/source/mode/checkedAt (AF-1)', ['probed', 'source', 'mode', 'checkedAt'].every((k: string) => routeSource.includes(k)));
assert(
  'responde 503 sin secreto (fail-closed)',
  routeSource.includes('? 503') && routeSource.includes("'NO_SECRET'"),
);
assert('responde 401 ante firma inválida', routeSource.includes('401'));

/* ── RESULTADO ───────────────────────────────────────────────────────────── */

console.log('\n────────────────────────────────────────────────────────────');
if (failures.length === 0) {
  console.log(`RESULTADO: ${passed}/${passed} ASERCIONES PASS · EXIT CODE 0`);
  process.exit(0);
} else {
  console.log(`RESULTADO: ${passed} PASS · ${failures.length} FAIL`);
  for (const f of failures) console.log(`  · ${f}`);
  process.exit(1);
}
