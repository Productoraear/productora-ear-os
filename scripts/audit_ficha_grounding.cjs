#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DE GROUNDING DE FICHAS — ADVERSARIO INDEPENDIENTE (W43)
 * ════════════════════════════════════════════════════════════════════════════
 * No confía en el builder: re-lee los artefactos publicados y vuelve a deducir
 * los invariantes por su cuenta (consenso antagónico §13: el juez es el código).
 *
 * Comprueba:
 *  A. §4bis  — `verified:true` sólo con teléfono real (≥9 dígitos, nunca la
 *              centralita +34 693 693 048, nunca placeholder).
 *  B. Cero claves duplicadas y `ph` coherente con el `provenanceHash` dorado.
 *  C. Presupuesto de rendimiento: índice y doradas < 1 MB cada uno (§18).
 *  D. 10 casos de grounding real: URL con `--e<id>`, ruta interna y slug
 *     resuelven a la MISMA ficha (nombre, municipio, categoría).
 *  E. Cableado en el código: `pageContext` expone la entidad `provider` y el
 *     chat tiene rama determinista sin LLM (cero agentes ciegos).
 *
 * Exit 0 = circuito probado. Cualquier violación => Exit 1.
 * Uso: node scripts/audit_ficha_grounding.cjs [--verbose]
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const FICHAS_DIR = path.join(ROOT, 'public', 'data', 'fichas');
const INDEX_PATH = path.join(FICHAS_DIR, 'fichas_index.json');
const GOLD_PATH = path.join(FICHAS_DIR, 'fichas_gold.json');
const PAGE_CONTEXT = path.join(ROOT, 'src', 'lib', 'agents', 'pageContext.ts');
const CHAT_ROUTE = path.join(ROOT, 'src', 'app', 'api', 'agents', 'chat', 'route.ts');
const FICHA_PROVIDER = path.join(ROOT, 'src', 'lib', 'providers', 'fichaProvider.ts');
const CALL_CENTER = path.join(ROOT, 'src', 'app', '(admin)', 'admin', 'call-center', 'page.tsx');

const MAX_BYTES = 1_000_000;
const CENTRALITA_DIGITS = '693693048';
const PLACEHOLDER_PHONES = ['999999999', '727272727', '703831064', '721056835', '000000000', '111111111'];

const failures = [];
const checked = { phones: 0, verified: 0, cases: 0, wiring: 0 };

function fail(message) {
  failures.push(message);
}

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    fail(`Artefacto ausente: ${label} (${path.relative(ROOT, filePath)}). Ejecuta node scripts/build_provider_fichas.cjs`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Artefacto ilegible: ${label} — ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function digitsOf(value) {
  return String(value === null || value === undefined ? '' : value).replace(/\D/g, '');
}

// ── A. Doctrina del dato verificado (§4bis) ─────────────────────────────────
function auditVerifiedDoctrine(index) {
  const seenKeys = new Set();
  for (const entry of index.entries) {
    if (!entry || typeof entry.key !== 'string' || entry.key.length === 0) {
      fail('Entrada sin clave en fichas_index.json');
      continue;
    }
    if (seenKeys.has(entry.key)) fail(`Clave duplicada en el índice: ${entry.key}`);
    seenKeys.add(entry.key);

    if (typeof entry.name !== 'string' || entry.name.trim().length === 0) {
      fail(`Ficha sin nombre: ${entry.key} (sería citable como fachada)`);
    }

    const digits = digitsOf(entry.phone);
    if (digits.length > 0) {
      checked.phones += 1;
      if (digits.includes(CENTRALITA_DIGITS)) fail(`Centralita publicada como teléfono de proveedor: ${entry.key}`);
      if (PLACEHOLDER_PHONES.some((fake) => digits.includes(fake))) fail(`Teléfono placeholder publicado: ${entry.key} (${entry.phone})`);
      if (digits.length < 9) fail(`Teléfono no publicable (<9 dígitos) publicado: ${entry.key} (${entry.phone})`);
    }

    if (entry.verified === true) {
      checked.verified += 1;
      if (digits.length < 9) fail(`verified:true SIN teléfono real: ${entry.key} — violación directa de §4bis`);
      if (digits.includes(CENTRALITA_DIGITS)) fail(`verified:true con la centralita: ${entry.key}`);
    }
  }
  if (index.counts && index.counts.entries !== index.entries.length) {
    fail(`counts.entries (${index.counts.entries}) no cuadra con el array (${index.entries.length})`);
  }
}

// ── B. Provenance: `ph` del índice debe ser prefijo del hash dorado ─────────
function auditProvenance(index, gold) {
  const goldByKey = new Map();
  for (const ficha of gold.fichas) goldByKey.set(ficha.key, ficha);

  let compared = 0;
  for (const entry of index.entries) {
    const ficha = goldByKey.get(entry.key);
    if (!ficha) continue;
    compared += 1;
    if (typeof entry.ph !== 'string' || entry.ph.length < 8) fail(`Entrada sin prefijo de provenance: ${entry.key}`);
    else if (typeof ficha.provenanceHash !== 'string' || !ficha.provenanceHash.startsWith(entry.ph)) {
      fail(`Provenance DESINCRONIZADO entre índice y ficha dorada: ${entry.key}`);
    }
  }
  if (compared !== gold.fichas.length) {
    fail(`El conjunto dorado (${gold.fichas.length}) no está contenido en el índice (${compared} coincidencias)`);
  }
  for (const ficha of gold.fichas) {
    if (typeof ficha.name !== 'string' || ficha.name.trim().length === 0) fail(`Ficha dorada sin nombre: ${ficha.key}`);
    if (ficha.verified === true && digitsOf(ficha.phone).length < 9) fail(`Ficha dorada verified sin teléfono: ${ficha.key}`);
  }
  checked.provenance = compared;
}


// ── C. Presupuesto de rendimiento (§18) ─────────────────────────────────────
function auditBudgets() {
  for (const [label, filePath] of [['fichas_index.json', INDEX_PATH], ['fichas_gold.json', GOLD_PATH]]) {
    if (!fs.existsSync(filePath)) continue;
    const bytes = fs.statSync(filePath).size;
    if (bytes > MAX_BYTES) fail(`${label} rompe el presupuesto: ${(bytes / 1024 / 1024).toFixed(2)} MB > 1 MB`);
  }
}

// ── D. 10 casos de grounding real (URL / ruta / slug) ───────────────────────
function vendorIdFromUrl(value) {
  const text = String(value === null || value === undefined ? '' : value);
  const patterns = [/--e(\d{3,})/i, /\/vendor\/(\d+)/i, /[?&]id=(\d{4,})/i];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match !== null) return match[1];
  }
  return null;
}

function normalizeSlug(value) {
  return String(value === null || value === undefined ? '' : value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function auditGroundingCases(index) {
  const byKey = new Map();
  const bySlug = new Map();
  const byVendorId = new Map();
  for (const entry of index.entries) {
    byKey.set(entry.key, entry);
    if (entry.slug && !bySlug.has(entry.slug)) bySlug.set(entry.slug, entry);
    if (entry.key.startsWith('v-') && !byVendorId.has(entry.key.slice(2))) byVendorId.set(entry.key.slice(2), entry);
  }

  // Selección determinista y variada: 4 con vendorId, 4 por slug, 2 verificadas.
  const withVendor = index.entries.filter((entry) => entry.key.startsWith('v-')).slice(0, 4);
  const withSlug = index.entries.filter((entry) => entry.slug.length > 0 && !entry.key.startsWith('v-')).slice(0, 4);
  const verifiedOnes = index.entries.filter((entry) => entry.verified === true).slice(0, 2);
  const pool = [...withVendor, ...withSlug, ...verifiedOnes]
    .filter((entry, position, all) => all.findIndex((other) => other.key === entry.key) === position)
    .slice(0, 10);

  if (pool.length < 10) {
    fail(`No hay 10 fichas resolubles para probar (sólo ${pool.length}): el grounding no es verificable.`);
  }

  for (const expected of pool) {
    const probes = [];
    if (expected.key.startsWith('v-')) {
      const vendorId = expected.key.slice(2);
      probes.push({ label: `URL --e${vendorId}`, value: `https://www.bodas.net/proveedores/${expected.slug || 'ficha'}--e${vendorId}` });
      probes.push({ label: `ruta /proveedores/${vendorId}`, value: `/proveedores/${vendorId}` });
    }
    if (expected.slug) probes.push({ label: `ruta /proveedores/${expected.slug}`, value: `/proveedores/${expected.slug}` });

    for (const probe of probes) {
      checked.cases += 1;
      const vendorId = vendorIdFromUrl(probe.value);
      let resolved = vendorId !== null ? byVendorId.get(vendorId) || null : null;
      if (resolved === null) {
        const pathMatch = /\/proveedores\/([^/?#\s]+)/i.exec(probe.value);
        const rawSlug = pathMatch !== null ? pathMatch[1].replace(/--e\d+$/i, '') : probe.value;
        const slug = normalizeSlug(rawSlug);
        resolved =
          bySlug.get(slug) ||
          (/^v-\d{3,}$/.test(slug) ? byKey.get(slug) : null) ||
          (/^\d{3,}$/.test(slug) ? byVendorId.get(slug) : null) ||
          null;
      }
      if (resolved === null) {
        fail(`Grounding FALLIDO (${probe.label}): ninguna ficha resuelve «${probe.value}»`);
        continue;
      }
      if (resolved.key !== expected.key) {
        fail(`Grounding AMBIGUO (${probe.label}): «${probe.value}» → ${resolved.key}, se esperaba ${expected.key}`);
      }
    }
  }
}

// ── E. Cableado real en el código (cero agentes ciegos) ─────────────────────
function auditWiring() {
  const checks = [
    [PAGE_CONTEXT, /kind:\s*'provider'/, 'pageContext no proyecta la entidad provider'],
    [PAGE_CONTEXT, /buildProviderContext/, 'pageContext no construye contexto de proveedor'],
    [PAGE_CONTEXT, /resolveFichaFromUrlOrText/, 'pageContext no resuelve la ficha desde URL'],
    [CHAT_ROUTE, /pageContext\.kind === 'provider'/, 'chat sin rama determinista para fichas de proveedor'],
    [CHAT_ROUTE, /buildPageContextBlock\(pageContext\)/, 'el bloque de ficha no viaja al prompt'],
    [FICHA_PROVIDER, /export function findFichaByVendorId/, 'fichaProvider sin resolución por vendorId'],
    [FICHA_PROVIDER, /export function resolveFichaFromUrlOrText/, 'fichaProvider sin resolución URL/texto'],
    [CALL_CENTER, /pathname:\s*fichaPath/, 'el Call Center no envía la ruta de la ficha (pitch ciego)'],
  ];

  for (const [filePath, pattern, message] of checks) {
    if (!fs.existsSync(filePath)) {
      fail(`${message} (archivo ausente: ${path.relative(ROOT, filePath)})`);
      continue;
    }
    const source = fs.readFileSync(filePath, 'utf8');
    if (!pattern.test(source)) fail(`${message} — ${path.relative(ROOT, filePath)}`);
    else checked.wiring += 1;
  }
}

// ── Runner ──────────────────────────────────────────────────────────────────
function main() {
  const verbose = process.argv.includes('--verbose');
  const index = readJson(INDEX_PATH, 'fichas_index.json');
  const gold = readJson(GOLD_PATH, 'fichas_gold.json');

  if (index !== null && gold !== null) {
    auditVerifiedDoctrine(index);
    auditProvenance(index, gold);
    auditBudgets();
    auditGroundingCases(index);
  }
  auditWiring();

  if (failures.length > 0) {
    for (const failure of failures) console.error(`[audit:fichas] ✗ ${failure}`);
    console.error(`[audit:fichas] RESULTADO: ${failures.length} violación(es).`);
    process.exit(1);
  }

  console.log(
    `[audit:fichas] ✓ OK · fichas=${index.entries.length} · doradas=${gold.fichas.length} · verificadas=${checked.verified} · teléfonos=${checked.phones} · provenance=${checked.provenance} · casos=${checked.cases} · cableado=${checked.wiring}/8${verbose ? ' · verbose' : ''}`,
  );
  process.exit(0);
}

main();

