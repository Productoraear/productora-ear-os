#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFY_CASHTUNNEL_IDEMPOTENCY_SCOPE.CJS — AISLAMIENTO DE LA CLAVE DE STRIPE
 * ════════════════════════════════════════════════════════════════════════════
 * El agujero que este gate cierra, medido en disco el 2026-11-26:
 *
 *   El BuyBox del Scrollytelling Cash-Tunnel enviaba
 *     idempotencyKey = `cashtunnel-${formato}-${fecha}`
 *   — una clave INDEPENDIENTE DEL CLIENTE. El servidor la propaga a Stripe:
 *
 *     orderId       = `EAR-SOLISTA-${idempotencyKey}`          (route.ts:342)
 *     priceLockHash = sha256(orderId + DEPOSIT_CENTS + fecha + stripeSecret)
 *     stripe.checkout.sessions.create(..., { idempotencyKey: priceLockHash })
 *                                                              (route.ts:401)
 *
 *   Consecuencia: dos compradores distintos del MISMO sábado compartían orderId
 *   y clave de idempotencia; Stripe (retención ~24 h) habría entregado al segundo
 *   la sesión de checkout ya emitida al primero. La ventana es cotidiana, no
 *   exótica: el candado de fecha caduca a los 30 min
 *   (atomicDateLockEngine `ttlMinutes = 30`) y la sesión de Stripe sobrevive 24 h.
 *
 * Qué mide (100% estático, coste de red 0,00 €):
 *   1. La plantilla de `idempotencyKey` existe y es legible.
 *   2. La plantilla interpola un nonce (algo más que `formato` + `fecha`).
 *   3. La plantilla prohibida (sólo formato + fecha) NO reaparece.
 *   4. Existe un generador de nonce por visita basado en `crypto.randomUUID`.
 *   5. El nonce está CABLEADO: se fija al montar y se usa en el POST.
 *   6. La clave simulada cumple el contrato del servidor:
 *      `sanitizeToken(body.idempotencyKey, 8, 128)` ⇒ 8..128 chars y /^[A-Za-z0-9_-]+$/.
 *   7. AISLAMIENTO: dos visitantes distintos ⇒ dos claves distintas;
 *      el MISMO intento repetido ⇒ la MISMA clave (dedupe preservado).
 *   8. CERROJO DE CONTRATO: la ruta sigue derivando `priceLockHash` de `orderId`
 *      y sigue pasándolo como `idempotencyKey` de Stripe. Si alguien cambia esa
 *      derivación, este gate avisa en vez de degradarse en silencio.
 *
 * Anti-fachada (AF-1 / AF-2): declara probed:false, source:"static",
 * mode:"SIMULADO". No inventa cifras: sólo afirmaciones sobre el texto en disco.
 *
 * Uso:
 *   node scripts/verify_cashtunnel_idempotency_scope.cjs
 *   node scripts/verify_cashtunnel_idempotency_scope.cjs --json
 *
 * Salida: .antigravity/reports/cashtunnel_idempotency_scope.json
 * Exit: 0 = aislado · 1 = violación · 2 = error de entorno.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENT_REL = 'src/components/checkout/SovereignStickyCheckoutBar.tsx';
const ROUTE_REL = 'src/app/api/reservar/solista/deposit/route.ts';
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const REPORT_FILE = path.join(REPORT_DIR, 'cashtunnel_idempotency_scope.json');
const JSON_ONLY = process.argv.includes('--json');

/** Contrato del servidor: `sanitizeToken(body.idempotencyKey, 8, 128)`. */
const KEY_MIN = 8;
const KEY_MAX = 128;
const KEY_PATTERN = /^[A-Za-z0-9_-]+$/;

/** Plantilla PROHIBIDA: clave determinista por fecha, idéntica para todo visitante. */
const FORBIDDEN_TEMPLATE = 'cashtunnel-${formato}-${fecha}';

/** Variables del componente que NO son nonce (contexto comercial legítimo). */
const CONTEXT_VARS = Object.freeze(['formato', 'fecha']);

/** Formatos que el BuyBox envía realmente (ACT_TERMINALS del componente). */
const FORMATS = Object.freeze(['solista', 'seating-planner']);
const SAMPLE_DATE = '2026-11-28';

function readSource(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

/** Renderiza la plantilla con valores dados, aplicando el saneado del componente. */
function renderKey(template, values) {
  return template
    .replace(/\$\{([A-Za-z0-9_]+)\}/g, (_, name) =>
      Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : `__MISSING_${name}__`
    )
    .replace(/[^A-Za-z0-9_-]/g, '-');
}

/** Extrae la plantilla literal de `idempotencyKey: \`...\``. */
function extractTemplate(source) {
  const match = /idempotencyKey:\s*`([^`]+)`/.exec(source);
  return match ? match[1] : null;
}

/** Extrae los nombres de variable interpolados en una plantilla. */
function templateVars(template) {
  const names = [];
  const re = /\$\{([A-Za-z0-9_]+)\}/g;
  let m = re.exec(template);
  while (m !== null) {
    names.push(m[1]);
    m = re.exec(template);
  }
  return names;
}

function main() {
  const startedAt = Date.now();
  const component = readSource(COMPONENT_REL);
  const route = readSource(ROUTE_REL);

  if (component === null || route === null) {
    const missing = [component === null ? COMPONENT_REL : null, route === null ? ROUTE_REL : null].filter(Boolean);
    console.error(`[Ω-IDEMPOTENCIA] ERROR DE ENTORNO: no se pudo leer ${missing.join(', ')}`);
    process.exit(2);
  }

  const checks = [];
  const add = (id, ok, detail) => checks.push({ id, ok, detail });

  // 1 · La plantilla existe.
  const template = extractTemplate(component);
  add(
    'C1_KEY_TEMPLATE_PRESENT',
    template !== null,
    template === null ? 'no se halló `idempotencyKey: `...`` en el componente' : `plantilla: ${template}`
  );

  const vars = template === null ? [] : templateVars(template);
  const nonceVars = vars.filter((v) => !CONTEXT_VARS.includes(v));

  // 2 · La plantilla interpola un nonce (más que formato + fecha).
  add(
    'C2_NONCE_INTERPOLATED',
    nonceVars.length >= 1,
    nonceVars.length >= 1
      ? `variable(s) de nonce: ${nonceVars.join(', ')}`
      : `la clave sólo depende de [${vars.join(', ')}] ⇒ idéntica para todo visitante`
  );

  // 3 · La plantilla prohibida no reaparece.
  add(
    'C3_FORBIDDEN_TEMPLATE_ABSENT',
    component.includes(FORBIDDEN_TEMPLATE) === false,
    component.includes(FORBIDDEN_TEMPLATE)
      ? `reapareció la clave determinista por fecha: ${FORBIDDEN_TEMPLATE}`
      : 'la clave determinista por fecha no está presente'
  );

  // 4 · Generador de nonce por visita.
  const hasGenerator = /function\s+createIntentNonce\s*\(/.test(component);
  const usesRandomUuid = /crypto\.randomUUID\s*\(/.test(component);
  add(
    'C4_NONCE_GENERATOR',
    hasGenerator && usesRandomUuid,
    hasGenerator && usesRandomUuid
      ? 'createIntentNonce() presente y basado en crypto.randomUUID'
      : `generador=${hasGenerator} randomUUID=${usesRandomUuid}`
  );

  // 5 · El nonce está cableado (fijado al montar y usado en el POST).
  const boundOnMount = /setIntentId\(\s*createIntentNonce\(\s*\)\s*\)/.test(component);
  const boundAtCall = nonceVars.some((v) => new RegExp(`const\\s+${v}\\s*=[^;]*createIntentNonce\\(`).test(component));
  add(
    'C5_NONCE_BOUND',
    boundOnMount && boundAtCall,
    boundOnMount && boundAtCall
      ? 'nonce fijado en useEffect y re-derivado en el handler antes del fetch'
      : `useEffect=${boundOnMount} handler=${boundAtCall}`
  );

  // 6 · Contrato del servidor (longitud y alfabeto).
  const contractFailures = [];
  const rendered = {};
  if (nonceVars.length >= 1 && template !== null) {
    const nonceVar = nonceVars[0];
    for (const formato of FORMATS) {
      const key = renderKey(template, { [nonceVar]: 'a'.repeat(32), formato, fecha: SAMPLE_DATE });
      rendered[formato] = key;
      if (key.length < KEY_MIN || key.length > KEY_MAX) contractFailures.push(`${formato}: longitud ${key.length}`);
      if (!KEY_PATTERN.test(key)) contractFailures.push(`${formato}: alfabeto inválido`);
      if (key.includes('__MISSING_')) contractFailures.push(`${formato}: variable sin resolver en la plantilla`);
    }
  } else {
    contractFailures.push('no hay plantilla con nonce que simular');
  }
  add(
    'C6_SERVER_KEY_CONTRACT',
    contractFailures.length === 0,
    contractFailures.length === 0
      ? `claves dentro de [${KEY_MIN},${KEY_MAX}] y /^[A-Za-z0-9_-]+$/ (p.ej. ${rendered.solista ?? 'N/D'})`
      : contractFailures.join(' · ')
  );

  // 7 · Aislamiento entre visitantes + dedupe del mismo intento.
  let isolation = false;
  let dedupe = false;
  let isolationDetail = 'no evaluable';
  if (nonceVars.length >= 1 && template !== null) {
    const nonceVar = nonceVars[0];
    const base = { formato: 'solista', fecha: SAMPLE_DATE };
    const visitorA = renderKey(template, { ...base, [nonceVar]: 'a1b2c3d4e5f60718293a4b5c6d7e8f90' });
    const visitorB = renderKey(template, { ...base, [nonceVar]: '0f9e8d7c6b5a4938271605f4e3d2c1b0' });
    const visitorA2 = renderKey(template, { ...base, [nonceVar]: 'a1b2c3d4e5f60718293a4b5c6d7e8f90' });
    isolation = visitorA !== visitorB;
    dedupe = visitorA === visitorA2;
    isolationDetail = `A=${visitorA} · B=${visitorB} · A_reintento=${visitorA2}`;
  }
  add(
    'C7_VISITOR_ISOLATION',
    isolation && dedupe,
    `${isolation ? 'visitantes distintos ⇒ claves distintas' : 'COLISIÓN entre visitantes'} · ${
      dedupe ? 'mismo intento ⇒ misma clave' : 'DEDUPE ROTO'
    } :: ${isolationDetail}`
  );

  // 8 · Cerrojo de contrato con la ruta de cobro.
  const hashFromOrderId = /createHash\('sha256'\)[\s\S]{0,200}update\(`\$\{orderId\}-/.test(route);
  const passesToStripe = /idempotencyKey:\s*priceLockHash/.test(route);
  const orderFromKey = /const\s+orderId\s*=\s*`EAR-SOLISTA-\$\{idempotencyKey/.test(route);
  add(
    'C8_STRIPE_CONTRACT_LOCK',
    hashFromOrderId && passesToStripe && orderFromKey,
    hashFromOrderId && passesToStripe && orderFromKey
      ? 'route.ts: orderId ← idempotencyKey · priceLockHash ← sha256(orderId…) · Stripe ← priceLockHash'
      : `orderId←key=${orderFromKey} hash←orderId=${hashFromOrderId} stripe←hash=${passesToStripe}`
  );

  const failed = checks.filter((c) => !c.ok);
  const verdict = failed.length === 0 ? 'PASS' : 'FAIL';

  const report = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    generator: 'scripts/verify_cashtunnel_idempotency_scope.cjs',
    doctrine: 'INV-08 · Idempotencia ACID · Aislamiento de la clave de Stripe por visitante',
    evidence: { probed: false, source: 'static', mode: 'SIMULADO', checkedAt: new Date().toISOString() },
    sources: { component: COMPONENT_REL, route: ROUTE_REL },
    contract: { minLength: KEY_MIN, maxLength: KEY_MAX, pattern: KEY_PATTERN.source, stripeKey: 'priceLockHash' },
    checks,
    violations: failed,
    verdict,
    durationMs: Date.now() - startedAt,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (JSON_ONLY) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    console.log('');
    console.log('[Ω-IDEMPOTENCIA] AISLAMIENTO DE LA CLAVE DE STRIPE (INV-08)');
    for (const c of checks) console.log(`  ${c.ok ? '✅' : '❌'} ${c.id} — ${c.detail}`);
    console.log('');
    console.log(`[Ω-IDEMPOTENCIA] Informe: ${path.relative(ROOT, REPORT_FILE).replace(/\\/g, '/')} · ${report.durationMs} ms`);
    console.log(`[Ω-IDEMPOTENCIA] VEREDICTO: ${verdict}`);
    console.log('');
  }

  process.exit(failed.length === 0 ? 0 : 1);
}

main();
