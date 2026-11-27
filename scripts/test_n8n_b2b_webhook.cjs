#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · PRUEBA DE HUMO DEL PUENTE n8n B2B (webhook `b2b-quote`)
 * ════════════════════════════════════════════════════════════════════════════
 * Certifica, en una sola pasada, las TRES capas que pueden romperse en silencio:
 *   1. CONTRATO   · el payload canónico EAR OS ↔ los campos que el formateador
 *                   de n8n exige (`const required = [...]` del nodo Code).
 *   2. FORMATEADOR· ejecuta el `jsCode` REAL del workflow (sandbox vm) y comprueba
 *                   la tarifa oficial (550) y el suelo con cupón (350).
 *   3. TRANSPORTE · POST nativo contra `/webhook/b2b-quote` (fallback declarado a
 *                   `/webhook-test/b2b-quote`) con cabeceras limpias, AbortSignal
 *                   de 8 s y captura de status/body/latencia/SHA-256.
 *
 * USO:
 *   node scripts/test_n8n_b2b_webhook.cjs                      # sonda REAL
 *   node scripts/test_n8n_b2b_webhook.cjs --offline            # sin red
 *   node scripts/test_n8n_b2b_webhook.cjs --test               # fuerza /webhook-test/
 *   node scripts/test_n8n_b2b_webhook.cjs --url=https://...    # endpoint explícito
 *   node scripts/test_n8n_b2b_webhook.cjs --base=https://n8n.x # otra instancia
 *   node scripts/test_n8n_b2b_webhook.cjs --timeout=5000       # ms (techo duro 8000)
 *   node scripts/test_n8n_b2b_webhook.cjs --report=out.json    # artefacto
 *
 * CONTRATO DE SALIDA (EP-2 / AF-5: prohibido el verde por defecto):
 *   exit 0 → todos los gates verdes (sonda REAL ejecutada o `--offline` declarado).
 *   exit 1 → al menos un gate contractual en ROJO (el detalle dice cuál y por qué).
 *   exit 2 → SIN_EVIDENCIA: SSOT ilegible o n8n inalcanzable / 404 en ambas rutas.
 *   exit 3 → uso incorrecto de la CLI.
 *
 * DEPENDENCIAS: `node:fs`, `node:path`, `node:crypto`, `node:vm` y `typescript`
 * (ya instalado en el repo) para introspección AST determinista — doctrina
 * AGENTS.md §0.1 «DETERMINISMO Y AST». Cero red externa salvo la sonda.
 *
 * EFECTO SECUNDARIO DECLARADO: una corrida REAL dispara UNA ejecución del
 * workflow n8n `b2b-quote` (notificación Telegram al CEO). El `requestId` viaja
 * con prefijo `SMOKE-` para que la alerta sea identificable como simulacro.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const hasFlag = (name) => ARGS.includes(`--${name}`);
const optValue = (name, fallback) => {
  const hit = ARGS.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const SLUG = (optValue('slug', 'b2b-quote') || '').trim();
const OFFLINE = hasFlag('offline');
const FORCE_TEST_PATH = hasFlag('test');
/** INV-17: ninguna API externa por encima de 8 s. */
const TIMEOUT_MS = Math.min(
  Math.max(Number.parseInt(optValue('timeout', '8000'), 10) || 8000, 1000),
  8000,
);
const REPORT_PATH = path.resolve(
  ROOT,
  optValue('report', path.join('.antigravity', 'evidence', 'n8n_b2b_webhook_smoke.json')),
);

const SSOT_TS = path.join(ROOT, 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const DISPATCHER_TS = path.join(ROOT, 'src', 'lib', 'services', 'n8n-dispatcher.ts');
const WORKFLOW_JSON = path.join(ROOT, 'n8n-workflows', `comercial-${SLUG}.json`);
const ACG_TS = path.join(ROOT, 'src', 'lib', 'acg', 'acgDecisionEngine.ts');
const SRC_DIR = path.join(ROOT, 'src');

/**
 * CONTRATO COMERCIAL EXIGIDO POR LA DIRECTIVA.
 * Se usa SOLO como oráculo de aserción: los importes reales del payload se
 * derivan del SSOT en disco (`ear-os-ssot.ts`), nunca de estas literales.
 */
const CONTRACT = Object.freeze({
  holder: 'Reserva Directa Edwin Agudelo (Madrid)',
  wireFormat: 'solista_edwin',
  catalogFormatId: 'solista-edwin-agudelo',
  distanceKm: 15,
  location: 'Madrid',
  hub: 'Hub Méntrida',
  eventType: 'boda',
  standardPriceEur: 550,
  floorPriceEur: 350,
  depositEur: 100,
  centralitaDisplay: '+34 693 693 048',
  centralitaE164: '+34693693048',
});

const gates = [];
const diagnostics = [];
const startedAt = new Date();

function recordGate(id, ok, detail, extra) {
  const entry = { id, ok: Boolean(ok), detail, ...(extra || {}) };
  gates.push(entry);
  console.log(`  [${entry.ok ? 'PASS' : 'FAIL'}] ${id} · ${detail}`);
  return entry;
}

function recordDiagnostic(id, severity, detail, extra) {
  diagnostics.push({ id, severity, detail, ...(extra || {}) });
  console.log(`  [DIAG ${severity}] ${id} · ${detail}`);
}

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Serializa con claves ordenadas: mismo objeto ⇒ mismo hash, sin ambigüedad. */
function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(value[k])}`).join(',')}}`;
}

/** Redondeo monetario a 2 decimales sin arrastrar error de coma flotante. */
function eur2(value) {
  return Math.round(value * 100) / 100;
}

/** Lee una variable de entorno sin dependencias: process.env -> .env.local -> .env. */
function readEnvVar(name) {
  if (typeof process.env[name] === 'string' && process.env[name].trim() !== '') {
    return process.env[name].trim();
  }
  for (const file of ['.env.local', '.env']) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    const match = new RegExp(`^${name}=(.*)$`, 'm').exec(fs.readFileSync(abs, 'utf8'));
    if (match && match[1]) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

/** AST TypeScript determinista (doctrina AGENTS.md §0.1). */
function parseTs(file) {
  const ts = require('typescript');
  const text = fs.readFileSync(file, 'utf8');
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function findVariableDeclaration(sourceFile, exportName) {
  const ts = require('typescript');
  let found = null;
  const visit = (node) => {
    if (found !== null) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === exportName) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

/** Valor numérico literal de una const exportada del SSOT. */
function readSsotNumber(sourceFile, exportName) {
  const ts = require('typescript');
  const decl = findVariableDeclaration(sourceFile, exportName);
  if (!decl || !decl.initializer) return null;
  if (ts.isNumericLiteral(decl.initializer)) return Number(decl.initializer.text);
  const parsed = Number(decl.initializer.getText(sourceFile).replace(/_/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Valor textual literal de una const exportada del SSOT. */
function readSsotString(sourceFile, exportName) {
  const ts = require('typescript');
  const decl = findVariableDeclaration(sourceFile, exportName);
  if (!decl || !decl.initializer || !ts.isStringLiteral(decl.initializer)) return null;
  return decl.initializer.text;
}

/** Propiedades numéricas de un `Object.freeze({...})` declarado en el SSOT. */
function readSsotFrozenObject(sourceFile, exportName) {
  const ts = require('typescript');
  const decl = findVariableDeclaration(sourceFile, exportName);
  if (!decl || !decl.initializer) return null;
  const init = decl.initializer;
  if (!ts.isCallExpression(init) || init.arguments.length === 0) return null;
  let arg = init.arguments[0];
  while (ts.isAsExpression(arg) || ts.isParenthesizedExpression(arg) || ts.isTypeAssertionExpression(arg)) {
    arg = arg.expression;
  }
  if (!ts.isObjectLiteralExpression(arg)) return null;
  const out = {};
  for (const prop of arg.properties) {
    if (!prop.name || !ts.isIdentifier(prop.name) || !prop.initializer) continue;
    const value = Number(prop.initializer.getText(sourceFile));
    if (Number.isFinite(value)) out[prop.name.text] = value;
  }
  return out;
}

/**
 * Carga las constantes canónicas de la Zona Cero. Cualquier hueco aquí es
 * SIN_EVIDENCIA: sin SSOT legible no se puede certificar ningún importe.
 */
function loadSsot() {
  if (!fs.existsSync(SSOT_TS)) return null;
  const sourceFile = parseTs(SSOT_TS);
  const ssot = {
    file: path.relative(ROOT, SSOT_TS),
    baseSolista: readSsotNumber(sourceFile, 'TARIFA_BASE_SOLISTA_EUR'),
    estandarSolista: readSsotNumber(sourceFile, 'TARIFA_ESTANDAR_SOLISTA_EUR'),
    kmIncluidos: readSsotNumber(sourceFile, 'SOLISTA_KM_INCLUIDOS'),
    eurPerKm: readSsotNumber(sourceFile, 'LOGISTICA_EUR_PER_KM'),
    kmExentos: readSsotNumber(sourceFile, 'LOGISTICA_KM_EXENTOS'),
    kmHotel: readSsotNumber(sourceFile, 'LOGISTICA_KM_HOTEL'),
    hotelEur: readSsotNumber(sourceFile, 'SUPLEMENTO_HOTEL_EUR'),
    depositoEur: readSsotNumber(sourceFile, 'DEPOSITO_STRIPE_EUR'),
    techoB2gEur: readSsotNumber(sourceFile, 'AJUSTE_PREVENTIVO_B2G_EUR'),
    limiteSplDb: readSsotNumber(sourceFile, 'LIMITE_SPL_DB'),
    wattsPerPax: readSsotNumber(sourceFile, 'WATTS_PER_PAX'),
    vatRate: readSsotNumber(sourceFile, 'VAT_RATE'),
    split: readSsotFrozenObject(sourceFile, 'SPLIT_SOBERANO'),
    centralita: readSsotString(sourceFile, 'CENTRALITA_EAR_OS'),
  };
  const missing = Object.entries(ssot).filter(([, v]) => v === null || v === undefined).map(([k]) => k);
  return { ...ssot, missing };
}

/** Base URL canónica leída del dispatcher: cero host duplicado en este script. */
function loadDispatcherBaseUrl() {
  if (!fs.existsSync(DISPATCHER_TS)) return null;
  const text = fs.readFileSync(DISPATCHER_TS, 'utf8');
  const match = /N8N_BASE_URL\s*=\s*process\.env\.N8N_BASE_URL\s*\|\|\s*'([^']+)'/.exec(text);
  return match ? match[1] : null;
}

/**
 * Artefacto de workflow en disco. Es la ÚNICA definición versionada del
 * formateador: el canvas de n8n no está bajo control de versiones, así que la
 * única evidencia contractual reproducible es este JSON (hipótesis declarada
 * en el acta: el workflow desplegado puede diferir).
 */
function loadWorkflowArtifact() {
  if (!fs.existsSync(WORKFLOW_JSON)) return null;
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(WORKFLOW_JSON, 'utf8'));
  } catch (err) {
    return { parseError: err instanceof Error ? err.message : String(err) };
  }
  const nodes = Array.isArray(parsed.nodes) ? parsed.nodes : [];
  const webhook = nodes.find((n) => n && n.type === 'n8n-nodes-base.webhook') || null;
  const codeNode = nodes.find((n) => n && n.type === 'n8n-nodes-base.code') || null;
  const jsCode =
    codeNode && codeNode.parameters && typeof codeNode.parameters.jsCode === 'string'
      ? codeNode.parameters.jsCode
      : null;

  /** `const required = ['clientName', ...]` — contrato real del formateador. */
  let required = [];
  if (jsCode) {
    const block = /const\s+required\s*=\s*\[([\s\S]*?)\]/.exec(jsCode);
    if (block) required = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  }

  /** Constantes re-impresas dentro del nodo Code en lugar de consumir el SSOT. */
  const ssotLiterals = {};
  if (jsCode) {
    const block = /const\s+SSOT\s*=\s*\{([\s\S]*?)\};/.exec(jsCode);
    if (block) {
      for (const m of block[1].matchAll(/([A-Za-z_$][\w$]*)\s*:\s*(-?[\d.]+)/g)) {
        ssotLiterals[m[1]] = Number(m[2]);
      }
    }
  }

  return {
    file: path.relative(ROOT, WORKFLOW_JSON),
    name: parsed.name,
    active: parsed.active === true,
    webhook: webhook
      ? {
          path: webhook.parameters && webhook.parameters.path,
          httpMethod: webhook.parameters && webhook.parameters.httpMethod,
          responseMode: webhook.parameters && webhook.parameters.responseMode,
        }
      : null,
    jsCode,
    required,
    ssotLiterals,
  };
}

/**
 * Ejecuta el `jsCode` REAL del nodo Code en un sandbox vm, reproduciendo el
 * envoltorio de n8n (función) y el contrato de entrada `$input.first().json`.
 * No se re-implementa el formateador: se mide el artefacto del repositorio.
 */
function runWorkflowFormatter(jsCode, payload) {
  if (typeof jsCode !== 'string' || jsCode.trim() === '') {
    return { ok: false, error: 'jsCode ausente en el nodo Code' };
  }
  const input = { first: () => ({ json: { body: payload } }) };
  try {
    const script = new vm.Script(`(function () {\n${jsCode}\n})`, { filename: `${SLUG}-formatter.js` });
    const fn = script.runInNewContext({ $input: input }, { timeout: 2000 });
    const output = fn();
    if (output === null || typeof output !== 'object') {
      return { ok: false, error: `el formateador devolvió ${typeof output}` };
    }
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Sábado siguiente: fecha de evento realista y estable para la prueba de humo. */
function nextSaturdayIso(from) {
  const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const delta = (6 - date.getUTCDay() + 7) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

/**
 * Construye el payload canónico B2B a partir del SSOT en disco.
 * `coupon` decide la base tarifaria: suelo 350 (cupón válido) vs oficial 550.
 */
function buildCanonicalPayload(ssot, coupon, now) {
  const distanceKm = CONTRACT.distanceKm;
  const franchiseKm = ssot.kmExentos;
  const billableKm = Math.max(0, distanceKm - franchiseKm);
  const travelCost = eur2(billableKm * ssot.eurPerKm);
  const hotelSupplement = 0; // 15 km < umbral de pernocta y hora fin 02:00
  const quotedPriceEur = coupon ? ssot.baseSolista : ssot.estandarSolista;
  const totalPriceEur = eur2(quotedPriceEur + travelCost + hotelSupplement);
  const depositEur = eur2(ssot.depositoEur);
  const e164 = `+${String(ssot.centralita || '').replace(/[^0-9]/g, '')}`;

  /** Espejo exacto de `calculateSovereignQuote` (src/lib/pricing/sovereign-pricing.ts:92). */
  const priceLockBasis = `solista|${distanceKm}|${franchiseKm}|${totalPriceEur}|${depositEur}`;
  const priceLockHash = sha256(priceLockBasis);

  const core = {
    requestId: `SMOKE-${SLUG.toUpperCase()}-${now.getTime().toString(36).toUpperCase()}`,
    smokeTest: true,
    source: 'ear-os-smoke-harness',
    event: coupon ? 'cita_iniciada_por_whatsapp' : 'cotizacion_directa_sin_cupon',
    channel: 'whatsapp',
    // ── Contrato exigido por el nodo Code de n8n (campos `required`) ──
    clientName: CONTRACT.holder,
    clientPhone: e164,
    eventType: CONTRACT.eventType,
    eventDate: nextSaturdayIso(now),
    location: CONTRACT.location,
    distanceKm,
    // ── Identidad tarifaria canónica EAR OS ──
    format: CONTRACT.wireFormat,
    formatCatalogId: CONTRACT.catalogFormatId,
    hub: CONTRACT.hub,
    hubFranchiseKm: franchiseKm,
    billableKm,
    standardPriceEur: eur2(ssot.estandarSolista),
    floorPriceEur: eur2(ssot.baseSolista),
    couponApplied: coupon,
    couponCode: coupon ? 'SMOKE-CUPON-SUELO-350' : null,
    quotedPriceEur: eur2(quotedPriceEur),
    expectedTotalPrice: totalPriceEur,
    clientPhoneDisplay: ssot.centralita,
    depositAmountEur: depositEur,
    depositDeductiblePct: 100,
    priceLock: {
      algorithm: 'SHA-256',
      basis: 'solista|distanceKm|franchiseKm|totalPrice|deposit',
      hash: priceLockHash,
    },
  };

  const integrity = {
    algorithm: 'SHA-256',
    scope: 'canonical-payload',
    hash: sha256(canonicalStringify(core)),
  };
  return { ...core, integrity };
}

/** Recalcula el SHA-256 del payload sin el propio bloque `integrity`. */
function recomputeIntegrity(payload) {
  const clone = { ...payload };
  delete clone.integrity;
  return sha256(canonicalStringify(clone));
}

/**
 * Verifica los mandatos de la Directiva sobre el payload PROCESADO por el
 * formateador: se mide lo que n8n realmente ve, no lo que EAR OS envió.
 */
function assertMandates(processed, expectedTotal, ssot) {
  const checks = [];
  const push = (id, ok, detail) => checks.push({ id, ok: Boolean(ok), detail });
  const split = processed.split || {};
  const splitSum = eur2(Number(split.artista || 0) + Number(split.earOs || 0) + Number(split.vimume || 0));

  push('titular', processed.clientName === CONTRACT.holder, `clientName="${processed.clientName}"`);
  push(
    'formato',
    processed.format === CONTRACT.wireFormat && processed.formatCatalogId === CONTRACT.catalogFormatId,
    `format="${processed.format}" catalogFormatId="${processed.formatCatalogId}"`,
  );
  push(
    'tarifa_oficial_550',
    processed.standardPriceEur === CONTRACT.standardPriceEur,
    `standardPriceEur=${processed.standardPriceEur} (oráculo ${CONTRACT.standardPriceEur})`,
  );
  push(
    'suelo_cupon_350',
    processed.floorPriceEur === CONTRACT.floorPriceEur,
    `floorPriceEur=${processed.floorPriceEur} (oráculo ${CONTRACT.floorPriceEur})`,
  );
  push(
    'distancia_hub_15km',
    processed.distanceKm === CONTRACT.distanceKm && processed.logistica === 0 && processed.hub === CONTRACT.hub,
    `distanceKm=${processed.distanceKm} logistica=${processed.logistica} hub="${processed.hub}"`,
  );
  push(
    'deposito_price_lock_100',
    processed.depositAmount === CONTRACT.depositEur && processed.depositDeductible === CONTRACT.depositEur,
    `depositAmount=${processed.depositAmount} deducible=${processed.depositDeductible}`,
  );
  push(
    'telefono_centralita',
    processed.clientPhone === CONTRACT.centralitaE164 && processed.clientPhoneDisplay === CONTRACT.centralitaDisplay,
    `clientPhone=${processed.clientPhone} display="${processed.clientPhoneDisplay}"`,
  );
  push('total_cotizado', processed.totalPrice === expectedTotal, `totalPrice=${processed.totalPrice} esperado=${expectedTotal}`);
  push('split_80_10_10', Math.abs(splitSum - Number(processed.totalPrice || 0)) < 0.01, `splitSum=${splitSum} total=${processed.totalPrice}`);
  push('b2g_elegible', processed.b2gEligible === (Number(processed.totalPrice) < ssot.techoB2gEur), `b2gEligible=${processed.b2gEligible}`);

  const failed = checks.filter((c) => !c.ok);
  return { ok: failed.length === 0, checks, failed };
}

/**
 * INV-10: el nodo Code re-imprime constantes del SSOT. Toda divergencia es
 * deuda de doble fuente y se reporta con el valor de cada lado.
 */
function auditWorkflowSsotDrift(workflow, ssot) {
  const pairs = [
    ['baseSolista', 'baseSolista', 'TARIFA_BASE_SOLISTA_EUR'],
    ['deposito', 'depositoEur', 'DEPOSITO_STRIPE_EUR'],
    ['tarifaKm', 'eurPerKm', 'LOGISTICA_EUR_PER_KM'],
    ['kmGratis', 'kmExentos', 'LOGISTICA_KM_EXENTOS'],
    ['hotel', 'hotelEur', 'SUPLEMENTO_HOTEL_EUR'],
    ['hotelKmUmbral', 'kmHotel', 'LOGISTICA_KM_HOTEL'],
    ['techoB2G', 'techoB2gEur', 'AJUSTE_PREVENTIVO_B2G_EUR'],
  ];
  return pairs.map(([literalKey, ssotKey, ssotName]) => ({
    literal: `SSOT.${literalKey}`,
    workflow: Object.prototype.hasOwnProperty.call(workflow.ssotLiterals, literalKey) ? workflow.ssotLiterals[literalKey] : null,
    canonical: ssot[ssotKey],
    source: ssotName,
    match: workflow.ssotLiterals[literalKey] === ssot[ssotKey],
  }));
}

/** Recorre `src/` una sola vez; sin node_modules ni artefactos de build. */
function collectTsFiles(dir, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'adn_vault', 'adn_vault_staging', 'data'].includes(entry.name)) continue;
      collectTsFiles(path.join(dir, entry.name), acc);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

/**
 * Resuelve las claves de un payload a partir del AST:
 * literal de objeto, identificador con inicializador literal, o interfaz local.
 */
function resolvePayloadKeys(ts, node, sourceFile) {
  if (!node) return null;
  if (ts.isObjectLiteralExpression(node)) {
    return node.properties
      .filter((p) => p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)))
      .map((p) => p.name.text);
  }
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node)) {
    return resolvePayloadKeys(ts, node.expression, sourceFile);
  }
  if (ts.isIdentifier(node)) {
    const name = node.text;
    let keys = null;
    const visit = (n) => {
      if (keys !== null) return;
      if (
        ts.isVariableDeclaration(n) &&
        ts.isIdentifier(n.name) &&
        n.name.text === name &&
        n.initializer &&
        ts.isObjectLiteralExpression(n.initializer)
      ) {
        keys = resolvePayloadKeys(ts, n.initializer, sourceFile);
        return;
      }
      if (ts.isInterfaceDeclaration(n) && n.name.text === name) {
        keys = n.members.filter((m) => m.name && ts.isIdentifier(m.name)).map((m) => m.name.text);
        return;
      }
      if (ts.isTypeAliasDeclaration(n) && n.name.text === name) {
        const members = n.type && n.type.members ? n.type.members : [];
        keys = members.filter((m) => m.name && ts.isIdentifier(m.name)).map((m) => m.name.text);
        return;
      }
      ts.forEachChild(n, visit);
    };
    visit(sourceFile);
    return keys;
  }
  return null;
}

/**
 * Auditoría AST de los emisores `N8n('<slug>', payload)`: compara las claves
 * reales de cada llamada con el array `required` del formateador de n8n.
 * Es la causa raíz del "puente roto": cuatro emisores, cuatro formas, un solo
 * contrato. Determinista y sin ejecutar el código (cero efectos secundarios).
 */
function auditEmitters(ts, workflow) {
  const required = Array.isArray(workflow.required) ? workflow.required : [];
  const findings = [];
  for (const abs of collectTsFiles(SRC_DIR, [])) {
    let text;
    try {
      text = fs.readFileSync(abs, 'utf8');
    } catch {
      continue;
    }
    if (!/N8n\(\s*'/.test(text)) continue;
    const sourceFile = ts.createSourceFile(abs, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const visit = (node) => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const callee = node.expression.text;
        const arg0 = node.arguments[0];
        if (
          (callee === 'fireAndForgetN8n' || callee === 'dispatchToN8n' || callee === 'dispatchLead') &&
          arg0 &&
          ts.isStringLiteral(arg0) &&
          arg0.text === SLUG
        ) {
          const arg1 = node.arguments[1];
          const keys = resolvePayloadKeys(ts, arg1, sourceFile);
          const missing = keys === null ? required.slice() : required.filter((k) => !keys.includes(k));
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          findings.push({
            file: path.relative(ROOT, abs),
            line,
            callee,
            payloadShape: keys === null ? 'UNRESOLVED' : 'OBJECT',
            keys: keys === null ? [] : keys,
            missing,
            contractOk: keys !== null && missing.length === 0,
          });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return findings;
}

/**
 * Resuelve los endpoints candidatos. El orden importa: n8n sirve producción en
 * `/webhook/<slug>` y la escucha de test en `/webhook-test/<slug>`. Un 404 en la
 * primera ruta NO significa "puente roto": puede ser el modo test.
 */
function resolveEndpoints() {
  const explicit = (optValue('url', '') || '').trim();
  if (explicit !== '') return { base: null, endpoints: [explicit] };
  const base = (optValue('base', '') || readEnvVar('N8N_BASE_URL') || loadDispatcherBaseUrl() || '').replace(/\/+$/, '');
  if (!base) return { base: null, endpoints: [] };
  const primary = FORCE_TEST_PATH ? 'webhook-test' : 'webhook';
  const secondary = FORCE_TEST_PATH ? 'webhook' : 'webhook-test';
  return { base, endpoints: [`${base}/${primary}/${SLUG}`, `${base}/${secondary}/${SLUG}`] };
}

/**
 * POST nativo con cabeceras limpias (el fallo clásico en PowerShell es perder
 * las comillas del JSON y recibir un 422 "Failed to parse request body": no es
 * una caída de n8n, es un cuerpo corrupto). Latencia y SHA-256 medidos aquí.
 */
async function probeEndpoint(endpoint, payload) {
  const startedNs = process.hrtime.bigint();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        'User-Agent': 'EAR-OS-N8N-Smoke/1.0 (+https://productoraear.com)',
        'X-EAR-OS-Smoke-Test': '1',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: 'manual',
    });
    const body = await response.text();
    const latencyMs = Math.round(Number(process.hrtime.bigint() - startedNs) / 1e6);
    let parsedBody = null;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = null;
    }
    return {
      endpoint,
      status: response.status,
      body,
      parsedBody,
      bodySha256: sha256(body),
      latencyMs,
      error: null,
      contentType: response.headers.get('content-type'),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const aborted = /abort|timeout/i.test(message);
    return {
      endpoint,
      status: 0,
      body: '',
      parsedBody: null,
      bodySha256: null,
      latencyMs: Math.round(Number(process.hrtime.bigint() - startedNs) / 1e6),
      error: aborted ? `timeout>${TIMEOUT_MS}ms` : message,
      contentType: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Traduce el status HTTP a un diagnóstico accionable, no a un adjetivo. */
function classifyTransport(result) {
  if (result.error) return { state: 'SIN_EVIDENCIA', code: 'UNREACHABLE', remedy: 'comprobar DNS/TLS y que la instancia n8n esté arriba' };
  const status = result.status;
  if (status === 200 || status === 202) {
    const asyncAck = Boolean(result.parsedBody && result.parsedBody.message === 'Workflow was started');
    return {
      state: 'VERIFICADO',
      code: asyncAck ? 'ACK_ASINCRONO' : 'ACK_SINCRONO',
      asyncAck,
      remedy: asyncAck ? 'n8n responde "Workflow was started": el 200 certifica transporte, NO el formateador' : null,
    };
  }
  if (status === 404) return { state: 'SIN_EVIDENCIA', code: 'WEBHOOK_NOT_REGISTERED', remedy: 'workflow inactivo o ruta equivocada (/webhook/ vs /webhook-test/)' };
  if (status === 422) return { state: 'FACHADA', code: 'BODY_REJECTED', remedy: 'cabeceras/cuerpo corruptos: exigir JSON.stringify nativo (nunca shell quoting)' };
  if (status === 401 || status === 403) return { state: 'SOSPECHOSO', code: 'AUTH_REQUIRED', remedy: 'el webhook exige token; declarar credencial en n8n y en el dispatcher' };
  if (status >= 500) return { state: 'SOSPECHOSO', code: 'SERVER_ERROR', remedy: 'revisar ejecuciones del workflow en n8n' };
  return { state: 'SOSPECHOSO', code: `HTTP_${status}`, remedy: 'status no contemplado por el contrato' };
}

function writeReport(report) {
  try {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    return path.relative(ROOT, REPORT_PATH);
  } catch (err) {
    console.error(`[WARN] no se pudo escribir el artefacto: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

async function main() {
  if (!/^[a-z0-9-]+$/.test(SLUG)) {
    console.error(`USO INVÁLIDO: slug "${SLUG}" no es un identificador de webhook (a-z, 0-9, guion).`);
    process.exit(3);
  }

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`EAR OS · SMOKE TEST PUENTE n8n B2B · slug=${SLUG} · modo=${OFFLINE ? 'SIMULADO (--offline)' : 'REAL'}`);
  console.log('═══════════════════════════════════════════════════════════════════');

  // ── FASE 1 · SSOT (Zona Cero) ──────────────────────────────────────────
  console.log('\n[FASE 1] SSOT canónico (src/lib/constants/ear-os-ssot.ts)');
  const ssot = loadSsot();
  if (!ssot || ssot.missing.length > 0) {
    const detail = !ssot ? 'ear-os-ssot.ts ausente o ilegible' : `constantes no extraíbles: ${ssot.missing.join(',')}`;
    recordGate('G0_SSOT_CANONICO', false, detail);
    console.error('\n[SIN_EVIDENCIA] Sin SSOT legible no se certifica ningún importe.');
    writeReport({
      test: 'test_n8n_b2b_webhook',
      slug: SLUG,
      mode: OFFLINE ? 'SIMULADO' : 'REAL',
      gates,
      diagnostics,
      verdict: 'SIN_EVIDENCIA',
      checkedAt: new Date().toISOString(),
    });
    process.exit(2);
  }
  const ssotChecks = [
    { id: 'INV-01 suelo 350', ok: ssot.baseSolista === CONTRACT.floorPriceEur, detail: `base=${ssot.baseSolista}` },
    { id: 'tarifa oficial 550', ok: ssot.estandarSolista === CONTRACT.standardPriceEur, detail: `estandar=${ssot.estandarSolista}` },
    { id: 'INV-03 deposito 100', ok: ssot.depositoEur === CONTRACT.depositEur, detail: `deposito=${ssot.depositoEur}` },
    { id: 'INV-12 centralita', ok: ssot.centralita === CONTRACT.centralitaDisplay, detail: `centralita=${ssot.centralita}` },
    {
      id: 'INV-02 split 80/10/10',
      ok: Boolean(ssot.split) && ssot.split.artista === 0.8 && ssot.split.earOs === 0.1 && ssot.split.vimume === 0.1,
      detail: `split=${JSON.stringify(ssot.split)}`,
    },
    { id: 'INV-13 rider 75 dB / 12 W-pax', ok: ssot.limiteSplDb === 75 && ssot.wattsPerPax === 12, detail: `${ssot.limiteSplDb}dB · ${ssot.wattsPerPax}W/pax` },
  ];
  recordGate('G0_SSOT_CANONICO', ssotChecks.every((c) => c.ok),
    `${ssotChecks.filter((c) => c.ok).length}/${ssotChecks.length} invariantes · hub ${ssot.kmExentos} km exentos`,
    { checks: ssotChecks });

  // ── FASE 2 · Artefacto del workflow ────────────────────────────────────
  console.log('\n[FASE 2] Artefacto del workflow (n8n-workflows/)');
  const workflow = loadWorkflowArtifact();
  if (!workflow) {
    recordGate('G1_WORKFLOW_ARTIFACT', false, `no existe n8n-workflows/comercial-${SLUG}.json`);
  } else if (workflow.parseError) {
    recordGate('G1_WORKFLOW_ARTIFACT', false, `JSON ilegible: ${workflow.parseError}`);
  } else {
    const acgText = fs.existsSync(ACG_TS) ? fs.readFileSync(ACG_TS, 'utf8') : '';
    const acgFloor = /id:\s*'solista-edwin-agudelo'[\s\S]{0,240}?basePriceEur:\s*([\d.]+)/.exec(acgText);
    const checks = [
      { id: 'webhook.path', ok: Boolean(workflow.webhook && workflow.webhook.path === SLUG), detail: `path=${workflow.webhook && workflow.webhook.path}` },
      { id: 'webhook.method', ok: Boolean(workflow.webhook && workflow.webhook.httpMethod === 'POST'), detail: `method=${workflow.webhook && workflow.webhook.httpMethod}` },
      { id: 'code.jsCode', ok: typeof workflow.jsCode === 'string' && workflow.jsCode.length > 0, detail: `${workflow.jsCode ? workflow.jsCode.length : 0} chars` },
      { id: 'required[]', ok: workflow.required.length > 0, detail: `${workflow.required.length} campos: ${workflow.required.join(',')}` },
      { id: 'ACG suelo 350', ok: Boolean(acgFloor) && Number(acgFloor[1]) === CONTRACT.floorPriceEur, detail: acgFloor ? `basePriceEur=${acgFloor[1]}` : 'id solista-edwin-agudelo no hallado' },
    ];
    recordGate('G1_WORKFLOW_ARTIFACT', checks.every((c) => c.ok),
      `${checks.filter((c) => c.ok).length}/${checks.length} · activo=${workflow.active} · responseMode=${workflow.webhook && workflow.webhook.responseMode}`,
      { checks });
  }

  // ── FASE 3 · Payload canónico + integridad SHA-256 ─────────────────────
  console.log('\n[FASE 3] Payload canónico + integridad SHA-256');
  const now = new Date();
  const couponPayload = buildCanonicalPayload(ssot, true, now);
  const standardPayload = buildCanonicalPayload(ssot, false, now);
  const priceLockBasis = `solista|${CONTRACT.distanceKm}|${ssot.kmExentos}|${couponPayload.expectedTotalPrice}|${eur2(ssot.depositoEur)}`;
  const payloadChecks = [
    { id: 'titular', ok: couponPayload.clientName === CONTRACT.holder, detail: couponPayload.clientName },
    { id: 'formato', ok: couponPayload.format === CONTRACT.wireFormat && couponPayload.formatCatalogId === CONTRACT.catalogFormatId, detail: `${couponPayload.format} / ${couponPayload.formatCatalogId}` },
    { id: 'distancia', ok: couponPayload.distanceKm === CONTRACT.distanceKm && couponPayload.billableKm === 0, detail: `${couponPayload.distanceKm} km · facturables ${couponPayload.billableKm}` },
    { id: 'deposito', ok: couponPayload.depositAmountEur === CONTRACT.depositEur, detail: `${couponPayload.depositAmountEur} EUR` },
    { id: 'telefono', ok: couponPayload.clientPhone === CONTRACT.centralitaE164 && couponPayload.clientPhoneDisplay === CONTRACT.centralitaDisplay, detail: couponPayload.clientPhoneDisplay },
    { id: 'tarifas', ok: couponPayload.standardPriceEur === 550 && couponPayload.floorPriceEur === 350, detail: `oficial ${couponPayload.standardPriceEur} / suelo ${couponPayload.floorPriceEur}` },
    { id: 'integrity.sha256', ok: couponPayload.integrity.hash === recomputeIntegrity(couponPayload), detail: `${couponPayload.integrity.hash.slice(0, 16)}…` },
    { id: 'priceLock.sha256', ok: couponPayload.priceLock.hash === sha256(priceLockBasis), detail: `${couponPayload.priceLock.hash.slice(0, 16)}…` },
    { id: 'contrato_n8n', ok: Boolean(workflow && workflow.required.every((k) => Object.prototype.hasOwnProperty.call(couponPayload, k))), detail: workflow ? workflow.required.join(',') : 'sin workflow' },
  ];
  recordGate('G2_PAYLOAD_CANONICO', payloadChecks.every((c) => c.ok),
    `${payloadChecks.filter((c) => c.ok).length}/${payloadChecks.length} · requestId=${couponPayload.requestId}`,
    { checks: payloadChecks });

  // ── FASE 4/5 · Formateador REAL del workflow (sandbox vm) ──────────────
  console.log('\n[FASE 4] Formateador n8n · escenario CUPÓN (suelo 350)');
  const s1 = workflow && workflow.jsCode ? runWorkflowFormatter(workflow.jsCode, couponPayload) : { ok: false, error: 'sin jsCode' };
  if (!s1.ok) {
    recordGate('G3_FORMATTER_CUPON_350', false, `formateador no ejecutable: ${s1.error}`);
  } else {
    const mandates = assertMandates(s1.output, couponPayload.expectedTotalPrice, ssot);
    recordGate('G3_FORMATTER_CUPON_350', s1.output.valid === true && mandates.ok,
      `valid=${s1.output.valid} · ${mandates.checks.filter((c) => c.ok).length}/${mandates.checks.length} mandatos · total=${s1.output.totalPrice} EUR`,
      { output: s1.output, checks: mandates.checks });
  }

  console.log('\n[FASE 5] Formateador n8n · escenario SIN CUPÓN (tarifa oficial 550)');
  const s2 = workflow && workflow.jsCode ? runWorkflowFormatter(workflow.jsCode, standardPayload) : { ok: false, error: 'sin jsCode' };
  if (!s2.ok) {
    recordGate('G4_FORMATTER_OFICIAL_550', false, `formateador no ejecutable: ${s2.error}`);
  } else {
    const mandates = assertMandates(s2.output, standardPayload.expectedTotalPrice, ssot);
    const delta = eur2(Number(s2.output.totalPrice || 0) - standardPayload.expectedTotalPrice);
    recordGate('G4_FORMATTER_OFICIAL_550', s2.output.valid === true && mandates.ok,
      `valid=${s2.output.valid} · total=${s2.output.totalPrice} EUR vs esperado ${standardPayload.expectedTotalPrice} EUR (delta ${delta}) · fallidos=${mandates.failed.map((c) => c.id).join(',') || 'ninguno'}`,
      { output: s2.output, checks: mandates.checks, delta });
  }

  // ── FASE 6 · Contrato de emisores (AST) + deriva del doble SSOT ────────
  console.log('\n[FASE 6] Contrato de emisores (AST) + deriva de literales');
  const ts = require('typescript');
  let emitterFindings = [];
  if (workflow && workflow.required.length > 0) {
    try {
      emitterFindings = auditEmitters(ts, workflow);
    } catch (err) {
      recordDiagnostic('AUDITORIA_AST_EMISORES', 'P1', `introspección fallida: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  const brokenEmitters = emitterFindings.filter((f) => !f.contractOk);
  recordGate('G5_EMISORES_CONTRATO', emitterFindings.length > 0 && brokenEmitters.length === 0,
    `${emitterFindings.length - brokenEmitters.length}/${emitterFindings.length} emisores cumplen los ${workflow ? workflow.required.length : 0} campos required`,
    { findings: emitterFindings });
  for (const finding of brokenEmitters) {
    recordDiagnostic('EMISOR_FUERA_DE_CONTRATO', 'P0',
      `${finding.file}:${finding.line} (${finding.callee}) omite: ${finding.missing.join(',') || 'resolución de claves imposible'}`,
      finding);
  }
  if (workflow) {
    const drift = auditWorkflowSsotDrift(workflow, ssot);
    const mismatches = drift.filter((row) => !row.match);
    if (mismatches.length > 0) {
      recordDiagnostic('DOBLE_SSOT_WORKFLOW', 'P1',
        `${mismatches.length}/${drift.length} literales divergen del SSOT: ${mismatches.map((m) => `${m.literal}=${m.workflow}≠${m.canonical}`).join(' · ')}`,
        { rows: drift });
    } else {
      console.log(`  [DIAG OK] ${drift.length}/${drift.length} literales del nodo Code coinciden con el SSOT`);
    }
    if (!/EAR-MCH-/.test(workflow.jsCode || '')) {
      recordDiagnostic('EMISOR_PRODUCCION_FUERA_DE_GIT', 'P1',
        'el formato de referencia vivo EAR-MCH-… no se genera en este repo: el emisor real corre fuera del árbol versionado (SOSPECHOSO)');
    }
  }

  // ── FASE 7 · Transporte HTTP real ──────────────────────────────────────
  let transport = {
    state: 'SIN_EVIDENCIA',
    code: 'OFFLINE',
    probed: false,
    source: 'static',
    mode: 'SIMULADO',
    checkedAt: new Date().toISOString(),
    note: 'ejecutado con --offline: no se sondeó la red',
  };
  if (!OFFLINE) {
    console.log('\n[FASE 7] Transporte HTTP (n8n)');
    const { endpoints } = resolveEndpoints();
    if (endpoints.length === 0) {
      recordGate('G6_TRANSPORTE_HTTP', false, 'sin base URL: ni --base, ni N8N_BASE_URL, ni fallback en el dispatcher');
      transport = { ...transport, code: 'NO_BASE_URL', source: 'static' };
    } else {
      let result = null;
      let usedEndpoint = null;
      for (const endpoint of endpoints) {
        const attempt = await probeEndpoint(endpoint, couponPayload);
        if (attempt.status !== 404) {
          result = attempt;
          usedEndpoint = endpoint;
          break;
        }
        if (result === null) result = attempt;
        console.log(`  [404] ${endpoint} no registrado → se prueba la ruta alternativa del contrato`);
      }
      const verdict = classifyTransport(result);
      recordGate('G6_TRANSPORTE_HTTP', result.status === 200 || result.status === 202,
        `HTTP ${result.status} · ${result.latencyMs} ms · ${verdict.code}${result.error ? ` · ${result.error}` : ''}`,
        { endpoint: result.endpoint, body: result.body, bodySha256: result.bodySha256 });
      transport = {
        ...result,
        usedEndpoint,
        fallbackUsed: usedEndpoint !== endpoints[0],
        ...verdict,
        probed: true,
        source: 'live',
        mode: 'REAL',
        checkedAt: new Date().toISOString(),
        processingCertified: verdict.asyncAck === true ? false : result.status === 200,
        note: verdict.asyncAck === true
          ? 'n8n acusa recibo asíncrono: el 200 certifica TRANSPORTE, no la ejecución del formateador'
          : null,
      };
      if (result.status === 200 && verdict.asyncAck === true && workflow && workflow.webhook && workflow.webhook.responseMode === 'responseNode') {
        recordDiagnostic('WORKFLOW_DESPLEGADO_DIFIERE', 'P1',
          'el JSON del repo declara responseMode=responseNode pero producción responde "Workflow was started" (onReceived): el artefacto versionado no es el desplegado');
      }
    }
  }

  // ── VEREDICTO, ARTEFACTO Y QUÍNTUPLA EP-1 ──────────────────────────────
  const reds = gates.filter((g) => !g.ok);
  const transportUnmeasurable = !OFFLINE && transport.state === 'SIN_EVIDENCIA';
  let exitCode = 0;
  if (transportUnmeasurable) exitCode = 2;
  else if (reds.length > 0) exitCode = 1;
  const verdict = exitCode === 2 ? 'SIN_EVIDENCIA' : exitCode === 1 ? 'ROJO' : OFFLINE ? 'PARCIAL' : 'VERDE';

  const evidence = {
    id: 'N8N_B2B_WEBHOOK_SMOKE',
    cmd: ['node scripts/test_n8n_b2b_webhook.cjs', ...ARGS].join(' ').trim(),
    exit: exitCode,
    url: transport.endpoint || null,
    sha256: transport.bodySha256 || null,
    ts: new Date().toISOString(),
  };

  const report = {
    test: 'test_n8n_b2b_webhook',
    harness: 'EAR OS · puente n8n B2B',
    slug: SLUG,
    mode: OFFLINE ? 'SIMULADO' : 'REAL',
    probed: !OFFLINE,
    source: OFFLINE ? 'static' : 'live',
    checkedAt: new Date().toISOString(),
    startedAt: startedAt.toISOString(),
    ssot: { file: ssot.file, values: { ...ssot, missing: undefined } },
    workflow: workflow
      ? {
          file: workflow.file,
          name: workflow.name,
          active: workflow.active,
          webhook: workflow.webhook,
          required: workflow.required,
          ssotLiterals: workflow.ssotLiterals,
        }
      : null,
    payloads: { cupon: couponPayload, sinCupon: standardPayload },
    gates,
    diagnostics,
    transport,
    verdict,
    exitCode,
    evidence,
    reportPath: path.relative(ROOT, REPORT_PATH),
  };

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`gates      : ${gates.filter((g) => g.ok).length}/${gates.length} PASS · ${reds.length} rojo(s)`);
  for (const gate of reds) console.log(`  ROJO · ${gate.id} · ${gate.detail}`);
  console.log(
    `transporte : ${OFFLINE
      ? 'SIN_EVIDENCIA (--offline: no se sondeó la red)'
      : `HTTP ${transport.status} · ${transport.code} · ${transport.latencyMs} ms · ${transport.usedEndpoint || transport.endpoint || '-'}`}`,
  );
  console.log(`payload    : ${couponPayload.requestId} · cupón ${couponPayload.expectedTotalPrice} EUR · oficial ${standardPayload.expectedTotalPrice} EUR`);
  console.log(`integridad : integrity(${couponPayload.integrity.hash.slice(0, 16)}…) · priceLock(${couponPayload.priceLock.hash.slice(0, 16)}…)`);
  const artifact = writeReport(report);
  console.log(`artefacto  : ${artifact}`);
  console.log(`VERDICT=${verdict}`);
  console.log(
    `EP-1: CLAIM{${evidence.id}} :: cmd="${evidence.cmd}" :: exit=${evidence.exit} :: url="${evidence.url || 'null'}" :: sha256=${evidence.sha256 || 'null'} :: ts=${evidence.ts}`,
  );
  console.log('═══════════════════════════════════════════════════════════════════');

  process.exit(exitCode);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(2);
});