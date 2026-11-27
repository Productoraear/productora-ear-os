#!/usr/bin/env node
/**
 * scripts/audit_seo_metadata.cjs
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR ESTÁTICO DE METADATOS SEO — arnés del skill
 * `.agents/skills/seo-optimizer/SKILL.md`
 * ════════════════════════════════════════════════════════════════════════════
 * Mide, SIN construir, SIN red y a 0 tokens, lo que hasta hoy era opinión:
 *   · Longitud real del `<title>` (presupuesto 50-60) y de la meta description
 *     (presupuesto 140-160, doctrina Velocity).
 *   · Token de marca en el título (plantilla `| EAR OS` o sufijo vivo
 *     `| Productora EAR`).
 *   · `alternates.canonical` presente y apuntando a una ruta REAL de `src/app/`.
 *   · Canibalización: dos rutas con el mismo título/description normalizado.
 *   · Presencia de JSON-LD (`application/ld+json` o `schemaOrgGenerator`).
 *
 * Qué NO hace (declarado, no maquillado):
 *   · No juzga calidad de copy ni de keywords: eso es criterio editorial humano.
 *   · No mide títulos no literales (`title: SITE_TITLE` → SIN_EVIDENCIA) ni
 *     interpolados (`${servicio}` → `interpolated:true`, longitud no medible).
 *   · No sondea producción ni el sitemap: eso lo cubre `verify:seo-sitemap-lock`.
 *   · Alcance: `src/app/**\/page.tsx`. Los `layout.tsx` se cuentan aparte porque
 *     su `title` suele ser una plantilla `%s`, no una promesa de SERP.
 *
 * USO
 *   node scripts/audit_seo_metadata.cjs             # informe legible · exit 0
 *   node scripts/audit_seo_metadata.cjs --json      # sólo JSON a stdout
 *   node scripts/audit_seo_metadata.cjs --strict    # exit 1 si hay violaciones
 *   node scripts/audit_seo_metadata.cjs --public-only # sólo superficie SERP
 *   node scripts/audit_seo_metadata.cjs --limit=40  # violaciones impresas
 *
 * SALIDA CONTRACTUAL
 *   SEO_PAGES=<n> SEO_PUBLIC=<n> SEO_INTERNAL=<n> SEO_WITH_METADATA=<n>
 *   SEO_DYNAMIC=<n> SEO_NO_METADATA=<n> SEO_VIOLATIONS=<n> SEO_WARNINGS=<n>
 *   SEO_VERDICT=PASS|FAIL
 * Exit codes: 0 = medición completa · 1 = --strict con violaciones · 2 = sin src/app.
 * Zero-dep · sólo lectura (escribe únicamente su informe en .antigravity/reports).
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const REPORT_JSON = path.join(REPORT_DIR, 'seo_metadata_audit.json');

const ARGS = process.argv.slice(2);
const JSON_ONLY = ARGS.includes('--json');
const STRICT = ARGS.includes('--strict');
const LIMIT_ARG = ARGS.find((a) => a.startsWith('--limit='));
const PRINT_LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split('=')[1]) : 25;
const PUBLIC_ONLY = ARGS.includes('--public-only');

/** Presupuesto SEO (fuente única: .agents/skills/seo-optimizer/SKILL.md). */
const BUDGET = Object.freeze({ titleMin: 50, titleMax: 60, descMin: 140, descMax: 160 });

/**
 * Superficie interna (back-office): no compite en SERP, así que un título de 25
 * caracteres ahí no es una promesa comercial rota. Se mide igual (honestidad) y
 * se separa del cómputo de la superficie pública, que es la que vende.
 */
const INTERNAL_PREFIXES = [
  '/admin',
  '/portal',
  '/panel',
  '/vendor',
  '/studio',
  '/register',
  '/login',
  '/signin',
  '/signup',
  '/api',
];

/** Token de marca aceptado en el título. */
const BRAND_TOKEN = 'EAR';

/** Sufijos de marca que se ignoran al comparar títulos (canibalización). */
const BRAND_SUFFIXES = ['| productora ear', '| ear os', '| ear'];

/** Adjetivos vacíos prohibidos por la doctrina Velocity (Pase 4 UNSLOP). */
const EMPTY_ADJECTIVES = [
  'increíble',
  'increibles',
  'único',
  'única',
  'el mejor',
  'la mejor',
  'revoluciona',
  'espectacular',
  'inmejorable',
  'pionero',
];

if (!fs.existsSync(APP_DIR)) {
  console.error(`FATAL: no existe ${path.relative(ROOT, APP_DIR)} — SOSPECHOSO (deriva de rutas)`);
  process.exit(2);
}

/* ────────────────────────────── UTILIDADES ─────────────────────────────── */

/** Lista recursiva de ficheros por nombre exacto. */
function walkNamed(dir, filename, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkNamed(full, filename, acc);
    else if (entry.name === filename) acc.push(full);
  }
  return acc;
}

/** Ruta pública derivada de un fichero de `src/app` (ignora grupos y slots). */
function routeFromFile(file) {
  const rel = path.relative(APP_DIR, path.dirname(file));
  const segments = rel
    .split(path.sep)
    .filter((seg) => seg !== '.' && seg !== '' && !/^\(.*\)$/.test(seg) && !seg.startsWith('@'))
    .map((seg) => seg.replace(/^\[\.\.\.(.+)\]$/, ':$1*').replace(/^\[(.+)\]$/, ':$1'));
  return segments.length === 0 ? '/' : '/' + segments.join('/');
}

/** Clasifica la ruta: superficie pública (SERP) o back-office interno. */
function surfaceOf(route) {
  return INTERNAL_PREFIXES.some((prefix) => route === prefix || route.startsWith(prefix + '/')) ? 'internal' : 'public';
}

/**
 * Devuelve el bloque `{...}` equilibrado que arranca en `start` (text[start] === '{'),
 * respetando cadenas, plantillas y comentarios. `null` si no cierra.
 */
function findBalanced(text, start) {
  if (text[start] !== '{') return null;
  let depth = 0;
  let quote = null;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quote !== null) {
      if (ch === '\\') {
        i += 1;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') {
      const nl = text.indexOf('\n', i);
      if (nl === -1) return null;
      i = nl;
      continue;
    }
    if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2);
      if (end === -1) return null;
      i = end + 1;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

/** Parte el interior de un objeto literal en entradas `clave: valor` de primer nivel. */
function splitTopLevel(inner) {
  const chunks = [];
  let depth = 0;
  let quote = null;
  let buf = '';
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (quote !== null) {
      buf += ch;
      if (ch === '\\') {
        buf += inner[i + 1] || '';
        i += 1;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === '{' || ch === '[' || ch === '(') depth += 1;
    else if (ch === '}' || ch === ']' || ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      chunks.push(buf);
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim() !== '') chunks.push(buf);

  return chunks
    .map((chunk) => {
      const match = /^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*([\s\S]*)$/.exec(chunk);
      if (match === null) return null;
      return { key: match[1] || match[2] || match[3], value: (match[4] || '').trim() };
    })
    .filter((entry) => entry !== null);
}

/** Primer literal de cadena del texto (`null` si el valor no es literal). */
function firstStringLiteral(text) {
  if (typeof text !== 'string') return null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch !== "'" && ch !== '"' && ch !== '`') continue;
    let out = '';
    for (let j = i + 1; j < text.length; j += 1) {
      const c = text[j];
      if (c === '\\') {
        out += text[j + 1] || '';
        j += 1;
        continue;
      }
      if (c === ch) return out;
      out += c;
    }
    return null;
  }
  return null;
}

/** Normaliza para comparar canibalización (sin sufijo de marca, sin puntuación final). */
function normalize(text) {
  let out = String(text).toLowerCase().replace(/\s+/g, ' ').trim();
  for (const suffix of BRAND_SUFFIXES) {
    if (out.endsWith(suffix)) out = out.slice(0, -suffix.length).trim();
  }
  return out.replace(/[.,;:·]+$/, '').trim();
}

/* ──────────────────────── EXTRACCIÓN Y ANÁLISIS ─────────────────────────── */

function analyzePage(file) {
  const text = fs.readFileSync(file, 'utf8');
  const route = routeFromFile(file);
  const record = {
    route,
    surface: surfaceOf(route),
    file: path.relative(ROOT, file).split(path.sep).join('/'),
    kind: 'static',
    title: null,
    description: null,
    titleLength: null,
    descriptionLength: null,
    interpolated: false,
    unresolved: [],
    canonical: null,
    canonicalInterpolated: false,
    jsonLd: /application\/ld\+json/.test(text) || /schemaOrgGenerator/.test(text),
    emptyAdjectives: [],
  };

  if (/export\s+(?:async\s+)?function\s+generateMetadata/.test(text)) {
    record.kind = 'dynamic';
    return record;
  }

  const anchor = text.indexOf('export const metadata');
  if (anchor === -1) {
    record.kind = 'none';
    return record;
  }
  const eq = text.indexOf('= {', anchor);
  const literal = eq === -1 ? null : findBalanced(text, eq + 2);
  if (literal === null) {
    record.unresolved.push('METADATA_BLOCK_NOT_PARSED');
    return record;
  }

  const entries = splitTopLevel(literal.slice(1, -1));
  const titleEntry = entries.find((entry) => entry.key === 'title');
  const descEntry = entries.find((entry) => entry.key === 'description');
  const altEntry = entries.find((entry) => entry.key === 'alternates');

  if (titleEntry === undefined) record.unresolved.push('TITLE_ABSENT');
  else {
    const title = firstStringLiteral(titleEntry.value);
    if (title === null) record.unresolved.push('TITLE_NOT_LITERAL');
    else {
      record.title = title;
      record.interpolated = record.interpolated || title.includes('${');
      record.titleLength = record.interpolated ? null : title.length;
    }
  }

  if (descEntry === undefined) record.unresolved.push('DESCRIPTION_ABSENT');
  else {
    const description = firstStringLiteral(descEntry.value);
    if (description === null) record.unresolved.push('DESCRIPTION_NOT_LITERAL');
    else {
      record.description = description;
      record.interpolated = record.interpolated || description.includes('${');
      record.descriptionLength = record.interpolated ? null : description.length;
      const lower = description.toLowerCase();
      record.emptyAdjectives = EMPTY_ADJECTIVES.filter((adj) => lower.includes(adj));
    }
  }

  if (altEntry !== undefined) {
    const canonicalMatch = /canonical\s*:\s*([\s\S]*)$/.exec(altEntry.value);
    if (canonicalMatch !== null) {
      const canonical = firstStringLiteral(canonicalMatch[1]);
      if (canonical !== null) {
        record.canonical = canonical;
        record.canonicalInterpolated = canonical.includes('${');
      }
    }
  }

  return record;
}

/* ────────────────────────────── EJECUCIÓN ──────────────────────────────── */

const pageFiles = walkNamed(APP_DIR, 'page.tsx');
const layoutFiles = walkNamed(APP_DIR, 'layout.tsx');

const records = [];
for (const file of pageFiles) {
  try {
    records.push(analyzePage(file));
  } catch (err) {
    records.push({
      route: routeFromFile(file),
      surface: surfaceOf(routeFromFile(file)),
      file: path.relative(ROOT, file).split(path.sep).join('/'),
      kind: 'error',
      title: null,
      description: null,
      titleLength: null,
      descriptionLength: null,
      interpolated: false,
      unresolved: [`READ_ERROR:${err && err.message ? err.message : 'unknown'}`],
      canonical: null,
      canonicalInterpolated: false,
      jsonLd: false,
      emptyAdjectives: [],
    });
  }
}

/** Rutas estáticas reales de `src/app` para validar canonicals. */
const knownRoutes = new Set(records.map((record) => record.route));

const violations = [];
const warnings = [];
const push = (bucket, code, record, detail) =>
  bucket.push({ route: record.route, surface: record.surface, file: record.file, code, detail });

for (const record of records) {
  if (record.kind === 'none') {
    warnings.push({
      route: record.route,
      surface: record.surface,
      file: record.file,
      code: 'ROUTE_WITHOUT_METADATA',
      detail: 'sin `export const metadata` ni `generateMetadata` (hereda el layout)',
    });
    continue;
  }
  if (record.kind === 'dynamic') continue;

  for (const flag of record.unresolved) {
    warnings.push({
      route: record.route,
      surface: record.surface,
      file: record.file,
      code: flag,
      detail: 'SIN_EVIDENCIA: valor no literal, no medible de forma estática',
    });
  }

  if (record.titleLength !== null) {
    if (record.titleLength < BUDGET.titleMin) {
      push(violations, 'TITLE_TOO_SHORT', record, `${record.titleLength} < ${BUDGET.titleMin}`);
    } else if (record.titleLength > BUDGET.titleMax) {
      push(violations, 'TITLE_TOO_LONG', record, `${record.titleLength} > ${BUDGET.titleMax}`);
    }
  }
  if (record.title !== null && !record.title.includes(BRAND_TOKEN)) {
    push(violations, 'TITLE_BRAND_MISSING', record, `sin token de marca "${BRAND_TOKEN}"`);
  }
  if (record.descriptionLength !== null) {
    if (record.descriptionLength < BUDGET.descMin) {
      push(violations, 'DESC_TOO_SHORT', record, `${record.descriptionLength} < ${BUDGET.descMin}`);
    } else if (record.descriptionLength > BUDGET.descMax) {
      push(violations, 'DESC_TOO_LONG', record, `${record.descriptionLength} > ${BUDGET.descMax}`);
    }
  }
  if (record.emptyAdjectives.length > 0) {
    push(violations, 'DESC_EMPTY_ADJECTIVE', record, record.emptyAdjectives.join(', '));
  }
  if (record.canonical === null) {
    warnings.push({
      route: record.route,
      surface: record.surface,
      file: record.file,
      code: 'CANONICAL_ABSENT',
      detail: 'sin alternates.canonical',
    });
  } else if (!record.canonicalInterpolated && !record.route.includes(':')) {
    let canonicalPath = record.canonical;
    try {
      canonicalPath = new URL(record.canonical).pathname;
    } catch {
      canonicalPath = record.canonical.split('?')[0];
    }
    const normalizedPath = canonicalPath.replace(/\/$/, '') === '' ? '/' : canonicalPath.replace(/\/$/, '');
    if (!knownRoutes.has(normalizedPath)) {
      warnings.push({
        route: record.route,
        surface: record.surface,
        file: record.file,
        code: 'CANONICAL_NOT_LOCAL_ROUTE',
        detail: `${record.canonical} no corresponde a ninguna ruta de src/app`,
      });
    }
  }
}

/* Canibalización: mismo título o misma description normalizados en 2+ rutas. */
const index = (field) => {
  const map = new Map();
  for (const record of records) {
    if (record.kind !== 'static' || record[field] === null || record.surface !== 'public') continue;
    const key = normalize(record[field]);
    if (key === '') continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(record);
  }
  return map;
};

for (const [key, group] of index('title')) {
  if (group.length < 2) continue;
  for (const record of group) {
    push(violations, 'DUPLICATE_TITLE', record, `${group.length} rutas comparten "${key}"`);
  }
}
for (const [key, group] of index('description')) {
  if (group.length < 2) continue;
  for (const record of group) {
    push(violations, 'DUPLICATE_DESCRIPTION', record, `${group.length} rutas comparten "${key.slice(0, 60)}…"`);
  }
}

/* Filtro de superficie: `--public-only` mide sólo lo que compite en SERP.
 * La canibalización (arriba) ya se evalúa únicamente sobre superficie pública. */
const isPublic = (item) => item.surface === 'public';
const scopedViolations = PUBLIC_ONLY ? violations.filter(isPublic) : violations;
const scopedWarnings = PUBLIC_ONLY ? warnings.filter(isPublic) : warnings;

const totals = {
  pages: records.length,
  publicPages: records.filter((r) => r.surface === 'public').length,
  internalPages: records.filter((r) => r.surface === 'internal').length,
  withMetadata: records.filter((r) => r.kind === 'static').length,
  dynamic: records.filter((r) => r.kind === 'dynamic').length,
  withoutMetadata: records.filter((r) => r.kind === 'none').length,
  errored: records.filter((r) => r.kind === 'error').length,
  layoutsIgnored: layoutFiles.length,
  jsonLdPages: records.filter((r) => r.jsonLd).length,
  violations: scopedViolations.length,
  violationsPublic: violations.filter(isPublic).length,
  violationsInternal: violations.filter((item) => item.surface === 'internal').length,
  warnings: scopedWarnings.length,
};

const verdict = scopedViolations.length === 0 ? 'PASS' : 'FAIL';

const report = {
  auditedAt: new Date().toISOString(),
  skill: '.agents/skills/seo-optimizer/SKILL.md',
  scope: 'src/app/**/page.tsx (layout.tsx contados aparte)',
  surfaceFilter: PUBLIC_ONLY ? 'public-only' : 'all',
  budget: BUDGET,
  brandToken: BRAND_TOKEN,
  totals,
  verdict,
  violations: scopedViolations,
  violationsInternal: violations.filter((item) => item.surface === 'internal'),
  warnings: scopedWarnings,
  routes: records,
};

try {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8');
} catch (err) {
  if (!JSON_ONLY) console.error(`WARN: no se pudo escribir el informe: ${err.message}`);
}

if (JSON_ONLY) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const line = '─'.repeat(74);
  console.log(line);
  console.log('AUDITOR SEO DE METADATOS · arnés de .agents/skills/seo-optimizer/SKILL.md');
  console.log(line);
  console.log(`Alcance       : ${report.scope} · superficie=${report.surfaceFilter}`);
  console.log(`Presupuesto   : título ${BUDGET.titleMin}-${BUDGET.titleMax} · description ${BUDGET.descMin}-${BUDGET.descMax}`);
  console.log(
    `Páginas       : ${totals.pages} (públicas=${totals.publicPages} · internas=${totals.internalPages} · static=${totals.withMetadata} · dynamic=${totals.dynamic} · sin metadata=${totals.withoutMetadata} · error=${totals.errored})`,
  );
  console.log(`Layouts (info): ${totals.layoutsIgnored} (fuera del presupuesto de SERP)`);
  console.log(`JSON-LD       : ${totals.jsonLdPages} páginas con ld+json / schemaOrgGenerator`);
  console.log(
    `Violaciones   : ${totals.violations} (públicas=${totals.violationsPublic} · internas=${totals.violationsInternal}) · Avisos: ${totals.warnings}`,
  );

  if (scopedViolations.length > 0) {
    console.log('');
    console.log(`VIOLACIONES (primeras ${Math.min(PRINT_LIMIT, scopedViolations.length)})`);
    for (const item of scopedViolations.slice(0, PRINT_LIMIT)) {
      console.log(`  [${item.code}] (${item.surface}) ${item.route} :: ${item.detail}`);
    }
    if (scopedViolations.length > PRINT_LIMIT) {
      console.log(`  … ${scopedViolations.length - PRINT_LIMIT} más en ${path.relative(ROOT, REPORT_JSON)}`);
    }
  }
  console.log('');
  console.log(`Informe: ${path.relative(ROOT, REPORT_JSON)}`);
}

console.log(
  `SEO_PAGES=${totals.pages} SEO_PUBLIC=${totals.publicPages} SEO_INTERNAL=${totals.internalPages} ` +
    `SEO_WITH_METADATA=${totals.withMetadata} SEO_DYNAMIC=${totals.dynamic} ` +
    `SEO_NO_METADATA=${totals.withoutMetadata} SEO_VIOLATIONS=${totals.violations} ` +
    `SEO_WARNINGS=${totals.warnings} SEO_VERDICT=${verdict}`,
);

if (STRICT && scopedViolations.length > 0) process.exit(1);
process.exit(0);




