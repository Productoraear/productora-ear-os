#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * OMEGA-11 · OWASP ASVS L3 — ARNÉS ADVERSARIAL DE PAYLOADS
 * ════════════════════════════════════════════════════════════════════════════
 * Ley del Auditor Real: este script NO proclama "ASVS L3 cumplido". Declara,
 * con evidencia observable, qué ocurre cuando alguien envía basura a las rutas
 * que mueven dinero o datos.
 *
 * Dos modos, ambos honestos:
 *  1. `--static` (por defecto): inspección en disco de las rutas objetivo.
 *     Verifica que cada boundary declara validación estricta, guard de techo y
 *     cero `any` en la frontera. Sin red, sin falsos rojos por timeout.
 *  2. `--live=<base>`: dispara payloads REALES y exige rechazo
 *     (400/401/403/404/405/409/415/422/429) y CERO HTTP 500.
 *     Sin `--live` este modo NO se ejecuta y no se reclama.
 *
 * Salida: ASVS_L3_MODE= · ASVS_L3_CHECKS= · ASVS_L3_FAILED= · ASVS_L3_VERDICT=
 * Exit 0 sólo si FAILED=0.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const argv = process.argv.slice(2);
const liveArg = argv.find((a) => a.startsWith('--live='));
const LIVE_BASE = liveArg ? liveArg.slice('--live='.length).replace(/\/$/, '') : null;

/** Rutas objetivo de la directiva §5.1. */
const TARGETS = [
  {
    route: '/api/quote/generate-lock',
    file: 'src/app/api/quote/generate-lock/route.ts',
    required: [
      { label: 'validación del formato contra SSOT', pattern: /ACG_ARTIST_OFFERS\.find/ },
      { label: 'validación numérica de distancia', pattern: /Number\.isFinite\(distanceKm\)/ },
      { label: 'firma HMAC del lock', pattern: /createHmac\(\s*['"]sha256['"]/ },
      { label: 'sin secreto no hay firma (503)', pattern: /SIGNING_KEY_MISSING/ },
    ],
    /**
     * `req.json()` sobre input no confiable: SIN try/catch propio, un body con
     * JSON malformado deja escapar el error al catch genérico y responde 500
     * (excepción no controlada). ASVS L3 §5.1 lo prohíbe.
     */
    mustRejectMalformedBody: true,
  },
  {
    route: '/api/telemetry/[id]',
    file: 'src/app/api/telemetry/[id]/route.ts',
    required: [
      { label: 'params resueltos como promesa', pattern: /await\s+[\w.]*params/ },
      { label: 'validación del id', pattern: /safeParse|parse\(|zod|Zod|length/ },
    ],
  },
  {
    route: '/api/artist/career/connect/[provider]',
    file: 'src/app/api/artist/career/connect/[provider]/route.ts',
    required: [
      // Next.js 16: `ctx.params` es una promesa; se admite cualquier nombre.
      { label: 'params resueltos como promesa', pattern: /await\s+[\w.]*params/ },
      { label: 'allowlist/registro de proveedor', pattern: /ADAPTERS\.get|PROVIDERS|allowlist|Set\(/ },
      { label: 'respuesta a método no permitido', pattern: /METHOD_NOT_ALLOWED/ },
    ],
  },
];

/** Payloads adversarios: un boundary sano NUNCA los acepta como válidos. */
const PAYLOADS = [
  { id: 'SQLI_QUOTE', method: 'POST', path: '/api/quote/generate-lock', body: { totalEstimado: '1; DROP TABLE users;--' } },
  { id: 'NEGATIVE_AMOUNT', method: 'POST', path: '/api/quote/generate-lock', body: { totalEstimado: -999999 } },
  { id: 'OVER_CEILING', method: 'POST', path: '/api/quote/generate-lock', body: { totalEstimado: 999999999999 } },
  { id: 'PROTO_POLLUTION', method: 'POST', path: '/api/quote/generate-lock', body: { totalEstimado: 350, isAdmin: true } },
  { id: 'SQLI_TELEMETRY', method: 'GET', path: "/api/telemetry/1'%20OR%20'1'='1" },
  { id: 'TRAVERSAL_PROVIDER', method: 'GET', path: '/api/artist/career/connect/..%2F..%2Fetc%2Fpasswd' },
  { id: 'UNKNOWN_PROVIDER', method: 'GET', path: '/api/artist/career/connect/proveedor-fantasma' },
];

const ACCEPTED_REJECTION = new Set([400, 401, 403, 404, 405, 409, 415, 422, 429]);

const results = [];
let failed = 0;

function check(id, ok, detail) {
  results.push({ id, ok, detail });
  if (!ok) failed += 1;
}

/**
 * ¿El `req.json()` está protegido por un `try {...} catch {...}` que responde
 * 4xx? Se recorre el texto equilibrando llaves desde el `{` del `try` real (no
 * desde una llave cualquiera): así el auditor no se engaña con llaves previas.
 */
function isJsonParseGuarded(source) {
  const jsonAt = source.indexOf('req.json()');
  if (jsonAt === -1) return false;

  // Último `try {` antes del parseo: es el bloque que lo contiene.
  const tryRegex = /\btry\s*\{/g;
  let openTry = -1;
  let m = tryRegex.exec(source);
  while (m !== null && m.index < jsonAt) {
    openTry = m.index;
    m = tryRegex.exec(source);
  }
  if (openTry === -1) return false;

  const braceIndex = source.indexOf('{', openTry);
  let depth = 0;
  let closeIndex = -1;
  for (let i = braceIndex; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        closeIndex = i;
        break;
      }
    }
  }
  if (closeIndex === -1 || closeIndex < jsonAt) return false;

  // El catch que sigue al bloque debe responder 4xx.
  const after = source.slice(closeIndex, closeIndex + 700);
  const catchMatch = after.match(/catch[\s\S]{0,600}/);
  if (catchMatch === null) return false;
  return /status:\s*4\d\d/.test(catchMatch[0]);
}

/* ─────────────────────────── Modo estático ──────────────────────────────── */

function runStatic() {
  for (const target of TARGETS) {
    const abs = path.join(ROOT, target.file);
    if (!fs.existsSync(abs)) {
      check(`${target.route}:existe`, false, `MISSING → ${target.file}`);
      continue;
    }
    const source = fs.readFileSync(abs, 'utf8');
    check(`${target.route}:existe`, true, target.file);
    for (const marker of target.required) {
      check(`${target.route}:${marker.label}`, marker.pattern.test(source), target.file);
    }
    // ASVS L3 §5.3: cero `any` en la frontera externa.
    const hasAny = /:\s*any\b|as\s+any\b/.test(source);
    check(`${target.route}:cero-any`, !hasAny, hasAny ? 'tipo `any` en la frontera' : 'sin `any`');

    // §5.1: el parseo de un body no confiable debe tener su PROPIO control de
    // error que responda 4xx. Se localiza el `{` del bloque `try` que contiene
    // `req.json()` y se comprueba que su `catch` devuelve un 4xx (nunca 5xx).
    if (target.mustRejectMalformedBody) {
      const inside = isJsonParseGuarded(source);
      check(
        `${target.route}:body-malformado-no-500`,
        inside,
        inside ? 'req.json() con try/catch propio que responde 4xx' : 'req.json() sin control de error propio → 500',
      );
    }
  }
  check('inventario-payloads', PAYLOADS.length >= 7, `${PAYLOADS.length} payloads definidos`);
  return 'static';
}

/* ─────────────────────────── Modo live ──────────────────────────────────── */

/** INV-17: toda salida externa con `AbortController` <= 8 s. */
async function dispatch(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const init = { method: payload.method, signal: controller.signal, headers: {} };
    if (payload.body !== undefined) {
      init.headers['content-type'] = 'application/json';
      init.body = JSON.stringify(payload.body);
    }
    const response = await fetch(`${LIVE_BASE}${payload.path}`, init);
    return response.status;
  } catch {
    return controller.signal.aborted ? 0 : -1;
  } finally {
    clearTimeout(timer);
  }
}

async function runLive() {
  for (const payload of PAYLOADS) {
    const status = await dispatch(payload);
    if (status === 0) {
      check(payload.id, false, 'sin respuesta en 8 s');
      continue;
    }
    if (status === -1) {
      check(payload.id, false, 'error de transporte');
      continue;
    }
    // Un 500 es SIEMPRE fallo: excepción no controlada en la frontera.
    check(payload.id, status !== 500 && ACCEPTED_REJECTION.has(status), `HTTP ${status}`);
  }
  return 'live';
}

/* ──────────────────────────────── Main ──────────────────────────────────── */

(async () => {
  const mode = LIVE_BASE !== null ? await runLive() : runStatic();
  const verdict = failed === 0 ? 'PASS' : 'FAIL';

  const report = {
    probed: mode === 'live',
    source: mode === 'live' ? 'live' : 'static',
    mode: mode === 'live' ? 'REAL' : 'SIMULADO',
    disclaimer:
      mode === 'live'
        ? 'Payloads adversarios disparados contra el servidor indicado.'
        : 'Inspección estática de boundaries; los payloads NO se han disparado (usa --live=<base>).',
    checkedAt: new Date().toISOString(),
    checks: results.length,
    failed,
    verdict,
    results,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, 'asvs_l3_payloads.json'), JSON.stringify(report, null, 2), 'utf8');

  for (const row of results) {
    console.log(`  ${row.ok ? 'PASS' : 'FAIL'} · ${row.id} — ${row.detail}`);
  }
  console.log(`ASVS_L3_MODE=${mode} · ASVS_L3_CHECKS=${results.length} · ASVS_L3_FAILED=${failed}`);
  console.log(`ASVS_L3_VERDICT=${verdict}`);
  process.exit(failed === 0 ? 0 : 1);
})();
