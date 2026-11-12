#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR META · SCORECARD «Ω-DIAMANTE ROJO» (20 ítems)
 * ════════════════════════════════════════════════════════════════════════════
 * Ley del Auditor Real (AGENTS §15 / .clinerules §13): un ítem del scorecard
 * sin comando ejecutable en disco vale **0 puntos**, no «pendiente».
 *
 * Problema que resuelve: el 2026-11-05 se firmó `omega_diamante: 20/20
 * VERIFICADO` (CLINE_EXECUTION_LOG.md:1494) mientras §13 de la doctrina declara
 * que los ítems 9, 10, 11, 12, 13, 15 y 16 NO tienen auditor en disco. Un 20/20
 * sin comando es el fraude máximo del sistema (SIG-2).
 *
 * Qué hace este script — y qué NO hace:
 *   · NO mide calidad. Mide COBERTURA AUDITABLE: para cada uno de los 20 ítems
 *     comprueba si existe en disco el comando que lo demuestra.
 *   · Los ítems 3, 7 y 8 los mide de verdad, de forma estática, aquí dentro
 *     (cero `any`, cero TODO/FIXME y cero secreto de servidor en fichero
 *     `"use client"` sobre la ruta de dinero).
 *   · Los demás se resuelven al comando ya existente del repo (npm script +
 *     fichero real). Si el fichero no existe: SIN_EVIDENCIA con la ruta exacta
 *     que falta construir.
 *
 * Vocabulario CERRADO (EP-2): VERIFICADO · PARCIAL · SIN_EVIDENCIA.
 *   VERIFICADO  → el comando existe y resuelve a un fichero real en disco.
 *   PARCIAL     → el script npm está declarado pero su binario no aparece.
 *   SIN_EVIDENCIA → no hay comando. El ítem vale 0 hasta que exista.
 *
 * Anti-fachada (AF-1/AF-5): no hay «verde por defecto». Un ítem P0 que no se
 * pueda demostrar hace que el exit code sea 1, y el sello se firma `n/20` con
 * los huecos a la vista.
 *
 * USO
 *   node scripts/audit_omega_rojo_scorecard.cjs          # tabla legible
 *   node scripts/audit_omega_rojo_scorecard.cjs --json   # sólo JSON a stdout
 *   node scripts/audit_omega_rojo_scorecard.cjs --strict # PARCIAL también falla (P0)
 *
 * SALIDA CONTRACTUAL
 *   OMEGA_ROJO_ITEMS=20 VERIFICADO=<n> PARCIAL=<n> SIN_EVIDENCIA=<n>
 *   OMEGA_ROJO_SCORE=<n>/20 · OMEGA_ROJO_VERDICT=ROJO|VERDE
 * Exit 0 sólo si los 8 ítems P0 están VERIFICADO (núcleo S-Class).
 * Zero-dep · sin red · sin escrituras destructivas (sólo escribe su reporte).
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const REPORT_JSON = path.join(REPORT_DIR, 'omega_rojo_scorecard.json');
const EVIDENCE_DIR = path.join(ROOT, '.antigravity', 'evidence');
const EVIDENCE_SCORECARD_JSON = path.join(EVIDENCE_DIR, 'scorecard_omega_diamante.json');

const ARGV = process.argv.slice(2);
const JSON_ONLY = ARGV.includes('--json');
const STRICT = ARGV.includes('--strict');

/** ¿Existe la ruta relativa al repo? */
function exists(rel) {
  try {
    return fs.existsSync(path.join(ROOT, rel));
  } catch {
    return false;
  }
}

/** Lee un fichero del repo; null si no se puede (nunca lanza). */
function read(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
  } catch {
    return null;
  }
}

const pkgRaw = read('package.json');
if (pkgRaw === null) {
  console.error('FATAL: package.json no legible desde ' + ROOT);
  process.exit(2);
}

let pkg = {};
try {
  pkg = JSON.parse(pkgRaw);
} catch (err) {
  console.error('FATAL: package.json inválido: ' + err.message);
  process.exit(2);
}

const SCRIPTS = pkg && typeof pkg.scripts === 'object' && pkg.scripts !== null ? pkg.scripts : {};

/**
 * Extrae del comando npm la ruta de script PROPIA que exista de verdad en disco.
 * Prefiere el script del repo sobre el runner de `node_modules` (tsx/tsc), porque
 * lo que se audita es el auditor, no el lanzador. Devuelve ruta o null.
 */
function resolveScriptFile(command) {
  if (typeof command !== 'string') return null;
  const tokens = command.split(/\s+/);
  const candidates = [];
  for (const raw of tokens) {
    const token = raw.replace(/^["']|["']$/g, '');
    if (!token || token.startsWith('-')) continue;
    if (!/[\\/]/.test(token)) continue;
    const looksLikeScript = /\.(cjs|mjs|js|ts)$/.test(token);
    const isTscBinary = /node_modules[\\/]typescript[\\/]bin[\\/]tsc$/.test(token);
    if (!looksLikeScript && !isTscBinary) continue;
    if (exists(token)) candidates.push(token);
  }
  if (candidates.length === 0) return null;
  const ownScript = candidates.find((token) => !/node_modules/.test(token));
  return ownScript || candidates[0];
}

/* ────────────────────────────────────────────────────────────────────────────
 * RUTA DE DINERO — los ficheros donde un fallo cuesta factura, sanción o demanda
 * (.clinerules §2 INV-01…INV-10). Sólo se auditan las rutas que EXISTEN: si una
 * falta, se declara en vez de inventarse.
 * ──────────────────────────────────────────────────────────────────────────── */
const MONEY_PATH_CANDIDATES = [
  'src/lib/constants/ear-os-ssot.ts',
  'src/lib/budget/budget-allocator-engine.ts',
  'src/lib/availability/atomicDateLockEngine.ts',
  'src/lib/security/ssotIntegrityGuard.ts',
  'src/app/api/quote/generate-lock/route.ts',
  'src/app/experiencia/page.tsx',
  'src/components/portal/OmniChannelHub360.tsx'
];

const MONEY_PATH = MONEY_PATH_CANDIDATES.filter(exists);
const MONEY_PATH_MISSING = MONEY_PATH_CANDIDATES.filter((rel) => !exists(rel));

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'scratch',
  '.antigravity',
  'extracted_astra_neural',
  'staging'
]);

const SOURCE_EXT = /\.(ts|tsx|js|jsx|cjs|mjs)$/;

/** Recorre un árbol devolviendo rutas relativas de código, con techo duro. */
function walk(dirRel, acc, cap) {
  if (acc.length >= cap) return acc;
  let entries;
  try {
    entries = fs.readdirSync(path.join(ROOT, dirRel), { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (acc.length >= cap) break;
    const rel = dirRel ? dirRel + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(rel, acc, cap);
    } else if (entry.isFile() && SOURCE_EXT.test(entry.name)) {
      acc.push(rel);
    }
  }
  return acc;
}

/** Busca un patrón línea a línea y devuelve `ruta:línea · texto`. */
function scanFiles(files, pattern) {
  const hits = [];
  for (const rel of files) {
    const text = read(rel);
    if (text === null) continue;
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      if (pattern.test(lines[i])) {
        hits.push(rel + ':' + (i + 1) + ' · ' + lines[i].trim().slice(0, 110));
      }
    }
  }
  return hits;
}

/** Ítem 3 · `any` implícito/explícito en la ruta de dinero (nunca en comentarios). */
function probeAnyInMoneyPath() {
  const pattern = /(:\s*any\b|<any>|as\s+any\b|any\[\])/;
  const hits = scanFiles(MONEY_PATH, pattern).filter((hit) => !/\/\/|\*/.test(hit.split(' · ')[1] || ''));
  return {
    ok: hits.length === 0,
    detail: hits.length === 0
      ? MONEY_PATH.length + ' ficheros de dinero, 0 `any`'
      : hits.length + ' `any` en ruta de dinero → ' + hits.slice(0, 3).join(' | ')
  };
}

/** Ítem 7 · TODO/FIXME/XXX en la ruta de venta. */
function probeTodoInMoneyPath() {
  const hits = scanFiles(MONEY_PATH, /\b(TODO|FIXME|XXX|HACK)\b/);
  return {
    ok: hits.length === 0,
    detail: hits.length === 0
      ? MONEY_PATH.length + ' ficheros de dinero, 0 TODO/FIXME'
      : hits.length + ' marcas pendientes → ' + hits.slice(0, 3).join(' | ')
  };
}

/** Ítem 8 · secreto de servidor alcanzable desde un módulo `"use client"`. */
function probeClientSecrets() {
  const files = walk('src', [], 4000);
  const secret = /process\.env\.([A-Z0-9_]*(?:SECRET|TOKEN|PRIVATE_KEY|PASSWORD|SERVICE_ROLE)[A-Z0-9_]*)/;
  const offenders = [];
  let clientFiles = 0;
  for (const rel of files) {
    const text = read(rel);
    if (text === null) continue;
    if (!/^["']use client["']/.test(text.slice(0, 200).trimStart())) continue;
    clientFiles += 1;
    const found = text.match(secret);
    if (found) offenders.push(rel + ' · ' + found[0]);
  }
  return {
    ok: offenders.length === 0,
    detail: offenders.length === 0
      ? clientFiles + ' ficheros "use client" escaneados, 0 secreto de servidor'
      : offenders.length + ' fugas → ' + offenders.slice(0, 3).join(' | ')
  };
}

const INLINE_PROBES = {
  'any-money': probeAnyInMoneyPath,
  'todo-money': probeTodoInMoneyPath,
  'client-secrets': probeClientSecrets
};

/* ────────────────────────────────────────────────────────────────────────────
 * LOS 20 ÍTEMS (AGENTS §14). `p0: true` = Núcleo S-Class: sin él no hay sello.
 * `ref` de tipo file = ruta exacta del auditor que hoy NO existe y hay que
 * construir. Se publica la ruta: un hueco sin dirección no se puede cerrar.
 * ──────────────────────────────────────────────────────────────────────────── */
const ITEMS = [
  { n: 1, p0: true, label: 'tsc --noEmit Exit 0', check: { type: 'npm', ref: 'typecheck' } },
  { n: 2, p0: true, label: 'eslint Exit 0', check: { type: 'npm', ref: 'lint' } },
  { n: 3, p0: true, label: '0 any en ruta de dinero', check: { type: 'inline', ref: 'any-money' } },
  { n: 4, p0: true, label: '0 verified:true falso (INV-06/12)', check: { type: 'npm', ref: 'audit:phone' } },
  { n: 5, p0: true, label: '0 handler huerfano / clic muerto (INV-09)', check: { type: 'npm', ref: 'audit:cta-matrix' } },
  { n: 6, p0: true, label: '0 precio hardcodeado (INV-10)', check: { type: 'npm', ref: 'audit:tariff-copy' } },
  { n: 7, p0: true, label: '0 TODO/FIXME en ruta de venta', check: { type: 'inline', ref: 'todo-money' } },
  { n: 8, p0: true, label: '0 secreto alcanzable desde cliente (INV-07)', check: { type: 'inline', ref: 'client-secrets' } },
  { n: 9, p0: false, label: 'ISO/IEC 25010 documentada', check: { type: 'file', ref: '.antigravity/reports/ISO_25010_QUALITY_MAP.md' } },
  { n: 10, p0: false, label: 'ISO/IEC 5055 (CISQ) estructural', check: { type: 'file', ref: 'scripts/audit_cisq_structural.cjs' } },
  { n: 11, p0: false, label: 'OWASP ASVS L3 con payloads', check: { type: 'file', ref: 'scripts/audit_asvs_l3_payloads.cjs' } },
  { n: 12, p0: false, label: 'Lighthouse 100x4 reproducible', check: { type: 'file', ref: 'scripts/audit_lighthouse_x4.cjs' } },
  { n: 13, p0: false, label: 'Core Web Vitals p75 / CLS <= 0,05', check: { type: 'file', ref: 'scripts/audit_cls_budget.cjs' } },
  { n: 14, p0: false, label: 'WCAG 2.2 (contraste medido)', check: { type: 'npm', ref: 'audit:contrast:core' } },
  { n: 15, p0: false, label: 'Rich Results schema.org en CI', check: { type: 'file', ref: 'scripts/audit_rich_results.cjs' } },
  { n: 16, p0: false, label: 'Jaccard/TF-IDF sobre corpus completo', check: { type: 'file', ref: 'scripts/audit_similarity_corpus.cjs' } },
  { n: 17, p0: false, label: 'Provenance hash por claim', check: { type: 'file', ref: '.antigravity/evidence/ledger.jsonl' } },
  { n: 18, p0: false, label: 'build<60s · repo<50MB · edge<1MB', check: { type: 'npm', ref: 'audit:residues' } },
  { n: 19, p0: false, label: 'Idempotencia ACID Stripe (INV-08)', check: { type: 'npm', ref: 'sim:event' } },
  { n: 20, p0: false, label: 'n8n no bloqueante + DLQ', check: { type: 'npm', ref: 'verify:price-lock-flow' } }
];

/** Evalúa un ítem y devuelve { status, detail }. */
function evaluate(item) {
  const check = item.check;
  if (check.type === 'file') {
    return exists(check.ref)
      ? { status: 'VERIFICADO', detail: check.ref }
      : { status: 'SIN_EVIDENCIA', detail: 'falta crear: ' + check.ref };
  }
  if (check.type === 'npm') {
    const command = SCRIPTS[check.ref];
    if (typeof command !== 'string') {
      return { status: 'SIN_EVIDENCIA', detail: 'falta script npm "' + check.ref + '"' };
    }
    const file = resolveScriptFile(command);
    if (file) return { status: 'VERIFICADO', detail: 'npm run ' + check.ref + ' -> ' + file };
    return { status: 'PARCIAL', detail: 'npm run ' + check.ref + ' declarado, binario no localizado' };
  }
  if (check.type === 'inline') {
    const probe = INLINE_PROBES[check.ref];
    if (typeof probe !== 'function') {
      return { status: 'SIN_EVIDENCIA', detail: 'sonda inline inexistente: ' + check.ref };
    }
    const result = probe();
    return { status: result.ok ? 'VERIFICADO' : 'PARCIAL', detail: result.detail };
  }
  return { status: 'SIN_EVIDENCIA', detail: 'tipo de comprobacion desconocido' };
}

const results = ITEMS.map((item) => {
  const outcome = evaluate(item);
  return { n: item.n, p0: item.p0, label: item.label, status: outcome.status, detail: outcome.detail };
});

const tally = { VERIFICADO: 0, PARCIAL: 0, SIN_EVIDENCIA: 0 };
for (const row of results) tally[row.status] += 1;

const p0Fails = results.filter((row) => row.p0 && row.status !== 'VERIFICADO');
const score = tally.VERIFICADO;
const verdict = p0Fails.length === 0 && !(STRICT && tally.PARCIAL > 0) ? 'VERDE' : 'ROJO';

const report = {
  schema: 'ear-os/omega-rojo-scorecard/1.0',
  generated_at: new Date().toISOString(),
  root: ROOT,
  score: score + '/20',
  verdict,
  summary: {
    items: results.length,
    verificado: tally.VERIFICADO,
    parcial: tally.PARCIAL,
    sin_evidencia: tally.SIN_EVIDENCIA,
    p0_bloqueantes: p0Fails.map((row) => row.n)
  },
  money_path: { audited: MONEY_PATH, missing: MONEY_PATH_MISSING },
  items: results
};

if (JSON_ONLY) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('OMEGA DIAMANTE ROJO · COBERTURA AUDITABLE DE LOS 20 ITEMS');
  console.log('============================================================');
  console.log('Raiz: ' + ROOT);
  console.log('Ruta de dinero auditada: ' + MONEY_PATH.length + ' ficheros' +
    (MONEY_PATH_MISSING.length ? ' (declarados ausentes: ' + MONEY_PATH_MISSING.join(', ') + ')' : ''));
  console.log('------------------------------------------------------------');
  for (const row of results) {
    const tag = row.status === 'VERIFICADO' ? 'VERIFICADO   ' : row.status === 'PARCIAL' ? 'PARCIAL      ' : 'SIN_EVIDENCIA';
    const severity = row.p0 ? 'P0' : 'P1';
    console.log('[OMEGA-' + String(row.n).padStart(2, '0') + '][' + severity + '] ' + tag + ' · ' + row.label);
    console.log('              ' + row.detail);
  }
  console.log('============================================================');
  console.log('OMEGA_ROJO_ITEMS=' + results.length + ' VERIFICADO=' + tally.VERIFICADO +
    ' PARCIAL=' + tally.PARCIAL + ' SIN_EVIDENCIA=' + tally.SIN_EVIDENCIA);
  console.log('OMEGA_ROJO_SCORE=' + score + '/20 · OMEGA_ROJO_VERDICT=' + verdict);
  if (p0Fails.length) {
    console.log('P0 BLOQUEANTES: ' + p0Fails.map((row) => '#' + row.n).join(', ') +
      ' -> no se firma nucleo 8/8 (SIG-2).');
  }
}

try {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8');
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.writeFileSync(EVIDENCE_SCORECARD_JSON, JSON.stringify(report, null, 2), 'utf8');
  if (!JSON_ONLY) console.log('Reporte: .antigravity/reports/omega_rojo_scorecard.json · .antigravity/evidence/scorecard_omega_diamante.json');
} catch (err) {
  console.error('AVISO: no se pudo escribir el reporte (' + err.message + '). La medicion sigue siendo valida.');
}

process.exit(verdict === 'VERDE' ? 0 : 1);
