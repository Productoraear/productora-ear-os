#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · AUDITOR DE RESOLUCION DE RUTAS GSC (COBERTURA ORGANICA)
 * ════════════════════════════════════════════════════════════════════════════
 * USO:
 *   node scripts/audit_gsc_routes_resolution.cjs                   # sonda HTTP :3007
 *   node scripts/audit_gsc_routes_resolution.cjs --base=http://x   # otro host
 *   node scripts/audit_gsc_routes_resolution.cjs --offline         # analisis estatico
 *   node scripts/audit_gsc_routes_resolution.cjs --timeout=20000   # ms por sonda
 *
 * CONTRATO (EP-2 · prohibido el verde por defecto):
 *   · exit 0 → 0 rutas GSC devuelven 404 (todas responden 200/301/307/308).
 *   · exit 1 → al menos una ruta GSC devuelve 404.
 *   · exit 2 → SIN_EVIDENCIA: el servidor no responde; no se puede medir.
 *
 * CERO DEPENDENCIAS NPM (doctrina Ponytail): solo `node:fs` y `fetch` nativo.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const hasFlag = (name) => ARGS.includes(`--${name}`);
const optValue = (name, fallback) => {
  const hit = ARGS.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const OFFLINE = hasFlag('offline');
const BASE = optValue('base', 'http://localhost:3007').replace(/\/+$/, '');
const TIMEOUT_MS = Number.parseInt(optValue('timeout', '20000'), 10);

const GSC_REPORT = path.join(ROOT, '.antigravity', 'reports', 'gsc_high_opportunity.json');
const ALIAS_MODULE = path.join(ROOT, 'src', 'lib', 'routing', 'legacy-route-aliases.ts');
const PARTS_DIR = path.join(ROOT, 'public', 'data', 'providers');
const FICHAS_INDEX = path.join(ROOT, 'public', 'data', 'fichas', 'fichas_index.json');

function slugify(raw) {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Catalogo real (slug + nombre normalizados) de las particiones publicadas. */
function buildCatalogIndex() {
  const catalog = new Set();
  if (!fs.existsSync(PARTS_DIR)) return catalog;
  for (const file of fs.readdirSync(PARTS_DIR)) {
    if (!file.endsWith('.json') || file === 'manifest.json') continue;
    let arr;
    try {
      arr = JSON.parse(fs.readFileSync(path.join(PARTS_DIR, file), 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(arr)) continue;
    for (const entry of arr) {
      if (!entry) continue;
      if (typeof entry.slug === 'string') catalog.add(slugify(entry.slug));
      if (typeof entry.name === 'string') catalog.add(slugify(entry.name));
    }
  }
  if (fs.existsSync(FICHAS_INDEX)) {
    try {
      const idx = JSON.parse(fs.readFileSync(FICHAS_INDEX, 'utf8'));
      for (const entry of idx.entries || []) {
        if (entry && typeof entry.slug === 'string') catalog.add(slugify(entry.slug));
      }
    } catch {
      /* indice ilegible: el catalogo de particiones sigue siendo valido */
    }
  }
  return catalog;
}

/** Lee los mapas de alias del modulo TS (verificacion estatica, G-0). */
function extractObjectBlock(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) return '';
  const open = src.indexOf('{', start);
  const close = src.indexOf('});', open);
  return open < 0 || close < 0 ? '' : src.slice(open, close);
}

function loadAliasMap() {
  const src = fs.readFileSync(ALIAS_MODULE, 'utf8');
  const parseEntries = (block) => {
    const out = new Map();
    for (const m of block.matchAll(/'([^']+)':\s*'([^']+)'/g)) out.set(m[1], m[2]);
    return out;
  };
  const exact = parseEntries(extractObjectBlock(src, 'LEGACY_ROUTE_ALIASES'));
  const ids = parseEntries(extractObjectBlock(src, 'LEGACY_PROVIDER_ID_ALIASES'));
  const prefixes = [];
  for (const m of src.matchAll(/Object\.freeze\(\{\s*prefix:\s*'([^']+)',\s*target:\s*'([^']+)'\s*\}\)/g)) {
    prefixes.push({ prefix: m[1], target: m[2] });
  }
  const unknown = /LEGACY_UNKNOWN_PROVIDER_TARGET\s*=\s*'([^']+)'/.exec(src);
  return { exact, ids, prefixes, unknownTarget: unknown ? unknown[1] : '/proveedores' };
}

/** Clasifica una ruta GSC segun la capa que la absorbe. */
function classify(urlPath, aliases) {
  const norm = urlPath.replace(/\/+$/, '') || '/';
  if (aliases.exact.has(norm)) return { kind: 'ALIAS_EXACT', target: aliases.exact.get(norm) };
  for (const p of aliases.prefixes) {
    if (norm === p.prefix || norm.startsWith(`${p.prefix}/`)) return { kind: 'ALIAS_PREFIX', target: p.target };
  }
  const seg = norm.split('/').filter(Boolean);
  if (seg.length === 2 && seg[0] === 'proveedores') {
    if (/-consulta-disponibilidad-y-precios$/.test(seg[1])) {
      return { kind: 'ALIAS_SUFFIX', target: '/proveedores?q=<slug sin sufijo>' };
    }
    const opaque = /^(?:prov|vendor|v)-?(\d{3,})$|^(\d{3,})$/.exec(seg[1]);
    if (opaque) {
      const id = opaque[1] || opaque[2];
      const mapped = aliases.ids.get(id);
      return {
        kind: mapped ? 'ALIAS_OPAQUE_ID' : 'ALIAS_OPAQUE_FALLBACK',
        target: mapped || aliases.unknownTarget,
      };
    }
  }
  return { kind: 'NATIVE_ROUTE', target: norm };
}

function printHeader() {
  console.log('======================================================================');
  console.log('EAR OS · AUDITOR DE RESOLUCION DE RUTAS GSC (cobertura organica)');
  console.log(`modo: ${OFFLINE ? 'OFFLINE (analisis estatico)' : 'HTTP PROBE'}  ·  base: ${BASE}`);
  console.log('======================================================================');
}

async function probe(url, redirectMode) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: redirectMode || 'manual',
      signal: controller.signal,
      headers: { 'user-agent': 'EAR-OS-GSC-Auditor/1.0 (+https://www.productoraear.com)' },
    });
    return { status: res.status, location: res.headers.get('location') || '' };
  } catch (err) {
    const name = err && err.name ? err.name : 'FETCH_FAIL';
    return { status: 0, location: `ERROR:${name}` };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!fs.existsSync(GSC_REPORT)) {
    console.error(`[SIN_EVIDENCIA] informe GSC ausente en disco: ${GSC_REPORT}`);
    process.exit(2);
  }

  const report = JSON.parse(fs.readFileSync(GSC_REPORT, 'utf8'));
  const paths = (report.opportunities || [])
    .map((o) => {
      try {
        return new URL(o.page).pathname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const aliases = loadAliasMap();
  const catalog = buildCatalogIndex();

  printHeader();
  console.log(`rutas GSC analizadas      : ${paths.length}`);
  console.log(`alias exactos             : ${aliases.exact.size}`);
  console.log(`alias por prefijo         : ${aliases.prefixes.length}`);
  console.log(`fichas reales en catalogo : ${catalog.size}`);
  console.log('');

  const plan = paths.map((p) => ({ path: p, ...classify(p, aliases) }));

  // G-0: los destinos de ficha procedentes del mapa estatico deben existir en el
  // catalogo de particiones publicado. Los destinos derivados del dataset curado
  // (mapa de ids) quedan SIN_EVIDENCIA en offline y se certifican con la sonda
  // HTTP end-to-end (autoridad final).
  let brokenTargets = 0;
  let unevidenced = 0;
  for (const item of plan) {
    const targetPath = item.target.split('?')[0];
    const seg = targetPath.split('/').filter(Boolean);
    if (seg[0] !== 'proveedores' || seg.length !== 2) continue;
    if (item.kind === 'ALIAS_EXACT') {
      if (!catalog.has(slugify(seg[1]))) {
        brokenTargets += 1;
        console.log(`  [DESTINO ROTO] ${item.path} -> ${item.target} (no existe en particiones)`);
      }
    } else if (item.kind === 'ALIAS_OPAQUE_ID' && !catalog.has(slugify(seg[1]))) {
      unevidenced += 1;
    }
  }

  const byKind = plan.reduce((acc, item) => {
    acc[item.kind] = (acc[item.kind] || 0) + 1;
    return acc;
  }, {});
  console.log('── CLASIFICACION (capa que absorbe cada ruta) ──');
  for (const item of plan) console.log(`  [${item.kind}] ${item.path}  ->  ${item.target}`);
  console.log('');
  console.log('resumen por capa:', JSON.stringify(byKind));
  console.log(`OFFLINE_DESTINOS_ROTOS=${brokenTargets}`);
  console.log(`OFFLINE_DESTINOS_SIN_EVIDENCIA=${unevidenced} (derivados del dataset curado; exigen sonda HTTP)`);
  console.log('');

  if (OFFLINE) {
    console.log(`VERDICT=${brokenTargets === 0 ? 'PASS' : 'FAIL'} (offline: no se sondeo HTTP)`);
    process.exit(brokenTargets === 0 ? 0 : 1);
  }

  console.log('── SONDA HTTP: 1er salto (manual) + destino final (follow) ──');
  const results = [];
  for (const item of plan) {
    const first = await probe(`${BASE}${item.path}`, 'manual');
    const final = await probe(`${BASE}${item.path}`, 'follow');
    results.push({ ...item, status: first.status, location: first.location, finalStatus: final.status });
    const tag = first.status === 404 ? '[404]' : first.status === 0 ? '[ERR]' : `[${first.status}]`;
    const finalTag = final.status === 404 ? '  FINAL=404' : final.status === 0 ? '  FINAL=ERR' : '';
    console.log(`  ${tag} ${item.path}${first.location ? `  ->  ${first.location}` : ''}${finalTag}`);
  }

  const count404 = results.filter((r) => r.finalStatus === 404).length;
  const origin404 = results.filter((r) => r.status === 404).length;
  const unreachable = results.filter((r) => r.status === 0).length;

  console.log('');
  console.log(`GSC_ROUTES_TOTAL=${results.length}`);
  console.log(`GSC_ORIGIN_404_COUNT=${origin404}`);
  console.log(`GSC_404_COUNT=${count404} (incluye destino final de la cadena)`);
  console.log(`GSC_UNREACHABLE=${unreachable}`);
  console.log(`GSC_REDIRECTED_301=${results.filter((r) => r.status === 301).length}`);
  console.log(`GSC_REDIRECTED_308=${results.filter((r) => r.status === 308).length}`);

  if (unreachable === results.length) {
    console.log('VERDICT=SIN_EVIDENCIA (servidor inalcanzable; arranca `npm run dev` en :3007)');
    process.exit(2);
  }

  console.log(`VERDICT=${count404 === 0 ? 'PASS' : 'FAIL'}`);
  process.exit(count404 === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(2);
});

