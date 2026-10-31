/**
 * AUDITOR DE COBERTURA DEL SITEMAP DE EVENTOS
 *
 * Qué prueba (y qué NO):
 *  1. La taxonomía declara exactamente 300 tipologías, con slugs únicos y sin
 *     servicios inventados (todo servicio debe existir en CANONICAL_SERVICES).
 *  2. La cobertura municipal cuadra: filas = publicadas + descartadas, y toda
 *     provincia del dataset resuelve a una clave de PROVINCIAS_52_GRAPH.
 *  3. El inventario no tiene rutas duplicadas, todas empiezan por /eventos y
 *     ningún shard supera EVENT_SHARD_MAX_URLS.
 *  4. El XML generado no contiene el apex (`productoraear.com`) — cada `<loc>`
 *     nace en el host final — ni supera el límite de 50.000 URLs.
 *  5. Con `--live`, sondea URLs reales y exige 200 (aquí sí hay red).
 *
 * Sin `--live` el resultado es ESTÁTICO: prueba la coherencia del dato, no que
 * producción responda. El resumen lo declara tal cual (AF-1/AF-5).
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_event_sitemap_coverage.ts
 *   SITEMAP_FORCE_ORIGIN="http://localhost:3007" ... --live
 */
import { CANONICAL_SERVICES } from '@/lib/navigation/canonical-taxonomy';
import {
  EVENT_FAMILIES,
  EVENT_INTENTS,
  EVENT_INTENT_COUNT,
  EVENT_INTENT_TARGET,
} from '@/lib/seo/eventIntentTaxonomy';
import {
  MUNICIPALITY_COVERAGE_STATS,
  SPAIN_MUNICIPALITIES,
  getProvinceCoverage,
} from '@/lib/seo/spainMunicipalityCoverage';
import {
  EVENT_SHARD_MAX_URLS,
  buildEventShardEntries,
  getEventCoverageStats,
  getEventShardIds,
  getEventUrlInventory,
  parseEventShardId,
} from '@/lib/seo/eventSitemapPlanner';
import { resolveSitemapOrigin } from '@/lib/seo/canonicalSite';
import { renderUrlsetXml } from '@/lib/seo/sitemapRegistry';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const failures: string[] = [];
const warnings: string[] = [];

function check(name: string, condition: boolean, detail: string): void {
  if (!condition) failures.push(`${name} :: ${detail}`);
}

function warn(name: string, condition: boolean, detail: string): void {
  if (!condition) warnings.push(`${name} :: ${detail}`);
}

// ── 1 · TAXONOMÍA ───────────────────────────────────────────────────────
check(
  'taxonomy.count',
  EVENT_INTENT_COUNT === EVENT_INTENT_TARGET,
  `declara ${EVENT_INTENT_COUNT} de ${EVENT_INTENT_TARGET}`
);

const slugSet = new Set<string>();
const duplicateSlugs: string[] = [];
for (const intent of EVENT_INTENTS) {
  if (slugSet.has(intent.slug)) duplicateSlugs.push(intent.slug);
  slugSet.add(intent.slug);
  check('taxonomy.slug_shape', SLUG_PATTERN.test(intent.slug), `slug inválido: ${intent.slug}`);
  check('taxonomy.label', intent.label.trim().length > 3, `label vacío: ${intent.slug}`);
}
check(
  'taxonomy.slug_unique',
  duplicateSlugs.length === 0,
  `duplicados: ${duplicateSlugs.slice(0, 5).join(', ')}`
);

const canonicalServiceSlugs = new Set(CANONICAL_SERVICES.map((service) => service.slug));
const unknownServices = new Set<string>();
for (const intent of EVENT_INTENTS) {
  check('taxonomy.services_present', intent.services.length > 0, `sin servicios: ${intent.slug}`);
  for (const service of intent.services) {
    if (!canonicalServiceSlugs.has(service)) unknownServices.add(service);
  }
}
check(
  'taxonomy.services_canonical',
  unknownServices.size === 0,
  `servicios fuera del SSOT: ${Array.from(unknownServices).join(', ')}`
);

for (const family of EVENT_FAMILIES) {
  const count = EVENT_INTENTS.filter((intent) => intent.family === family.id).length;
  check('taxonomy.family_nonempty', count > 0, `${family.id} sin tipologías`);
}

// Etiquetas casi idénticas dentro de la misma familia = doorway de manual.
function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2)
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const nearDuplicates: string[] = [];
for (const family of EVENT_FAMILIES) {
  const intents = EVENT_INTENTS.filter((intent) => intent.family === family.id);
  for (let i = 0; i < intents.length; i += 1) {
    for (let j = i + 1; j < intents.length; j += 1) {
      const score = jaccard(tokens(intents[i].label), tokens(intents[j].label));
      if (score >= 0.8) {
        nearDuplicates.push(`${intents[i].slug}~${intents[j].slug} (${score.toFixed(2)})`);
      }
    }
  }
}
warn(
  'taxonomy.label_near_duplicate',
  nearDuplicates.length === 0,
  `${nearDuplicates.length} pares ≥ 0,80 de Jaccard: ${nearDuplicates.slice(0, 3).join(' | ')}`
);

// ── 2 · GEOGRAFÍA ───────────────────────────────────────────────────────
const accounted =
  MUNICIPALITY_COVERAGE_STATS.accepted +
  MUNICIPALITY_COVERAGE_STATS.excludedInvalidSlug +
  MUNICIPALITY_COVERAGE_STATS.excludedUnresolvedProvince +
  MUNICIPALITY_COVERAGE_STATS.excludedDuplicatePath;

check(
  'geo.rows_accounted',
  accounted === MUNICIPALITY_COVERAGE_STATS.rawRows,
  `${accounted} contabilizadas de ${MUNICIPALITY_COVERAGE_STATS.rawRows}`
);
check(
  'geo.published',
  SPAIN_MUNICIPALITIES.length === MUNICIPALITY_COVERAGE_STATS.accepted,
  `${SPAIN_MUNICIPALITIES.length} publicadas vs ${MUNICIPALITY_COVERAGE_STATS.accepted} aceptadas`
);
check(
  'geo.no_unresolved_province',
  MUNICIPALITY_COVERAGE_STATS.excludedUnresolvedProvince === 0,
  `${MUNICIPALITY_COVERAGE_STATS.excludedUnresolvedProvince} filas sin provincia canónica`
);
check(
  'geo.no_duplicate_path',
  MUNICIPALITY_COVERAGE_STATS.excludedDuplicatePath === 0,
  `${MUNICIPALITY_COVERAGE_STATS.excludedDuplicatePath} pares (provincia, slug) duplicados`
);
warn(
  'geo.provinces_without_municipalities',
  MUNICIPALITY_COVERAGE_STATS.provincesWithoutMunicipalities.length === 0,
  `sin municipios: ${MUNICIPALITY_COVERAGE_STATS.provincesWithoutMunicipalities.join(', ')}`
);
warn(
  'geo.ine_collisions',
  MUNICIPALITY_COVERAGE_STATS.ineCodeCollisions === 0,
  `${MUNICIPALITY_COVERAGE_STATS.ineCodeCollisions} códigos INE repetidos: ${MUNICIPALITY_COVERAGE_STATS.ineCodeCollisionExamples.join(' | ')}`
);

const provinces = getProvinceCoverage();
check('geo.provinces', provinces.length === 52, `${provinces.length} provincias en el grafo`);

// ── 3 · INVENTARIO Y SHARDS ─────────────────────────────────────────────
const inventory = getEventUrlInventory();
const stats = getEventCoverageStats();
const shardIds = getEventShardIds();

const seenPaths = new Set<string>();
const duplicatePaths: string[] = [];
for (const record of inventory) {
  if (seenPaths.has(record.path)) duplicatePaths.push(record.path);
  seenPaths.add(record.path);
  check('inventory.path_prefix', record.path.startsWith('/eventos'), `ruta fuera de /eventos: ${record.path}`);
  check('inventory.path_shape', SLUG_PATTERN.test(record.path.slice(1).replace(/\//g, '-')), `ruta no canónica: ${record.path}`);
}
check('inventory.no_duplicates', duplicatePaths.length === 0, `${duplicatePaths.slice(0, 5).join(', ')}`);
check(
  'inventory.shard_cap',
  shardIds.length > 0 && stats.largestShardUrls <= EVENT_SHARD_MAX_URLS,
  `shard mayor de ${EVENT_SHARD_MAX_URLS}: ${stats.largestShardUrls}`
);
check(
  'inventory.shard_ids',
  shardIds.every((id) => /^eventos-\d{4}$/.test(id)),
  `ids inválidos: ${shardIds.join(', ')}`
);
check(
  'inventory.shard_roundtrip',
  shardIds.every((id) => parseEventShardId(id) !== null) &&
    parseEventShardId(`eventos-${String(shardIds.length + 1).padStart(4, '0')}`) === null,
  'un shard válido no resuelve o un id inexistente sí resuelve'
);
check(
  'inventory.shard_sum',
  stats.eventShardUrls + stats.municipalityUrls === inventory.length,
  `${stats.eventShardUrls} shards + ${stats.municipalityUrls} municipios ≠ ${inventory.length}`
);
check('inventory.total_vs_provinces', stats.intentProvinceUrls === 300 * 52, `${stats.intentProvinceUrls} ≠ 15.600`);

// ── 4 · XML (offline) ───────────────────────────────────────────────────
const origin = resolveSitemapOrigin();
const firstShardEntries = buildEventShardEntries(shardIds[0], origin);
const xml = renderUrlsetXml(firstShardEntries, origin);

check('xml.size', firstShardEntries.length <= 50000, `${firstShardEntries.length} URLs en un <urlset>`);
check('xml.declaration', xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'cabecera XML ausente');
check('xml.urlset', xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'urlset mal formado');
check('xml.no_apex', !xml.includes('https://productoraear.com/'), 'hay <loc> en el apex (301)');
check(
  'xml.absolute',
  firstShardEntries.every((entry) => entry.url.startsWith(`${origin}/`)),
  'hay <loc> relativo o con otro origen'
);

// ── 5 · SONDA EN VIVO (opcional) ────────────────────────────────────────
interface LiveReport {
  checked: number;
  ok: number;
  errors: string[];
}

const LIVE_SAMPLE = [
  `${origin}/eventos`,
  `${origin}/eventos/cobertura-municipal`,
  `${origin}/eventos/particular/boda-civil`,
  `${origin}/eventos/particular/boda-civil/madrid`,
  `${origin}/eventos/local/${SPAIN_MUNICIPALITIES[0].provinceSlug}/${SPAIN_MUNICIPALITIES[0].slug}`,
  `${origin}/sitemaps/${shardIds[0]}.xml`,
  `${origin}/sitemaps/4.xml`,
  `${origin}/sitemap-index.xml`,
];

async function runLiveSample(): Promise<LiveReport> {
  const report: LiveReport = { checked: 0, ok: 0, errors: [] };

  for (const url of LIVE_SAMPLE) {
    report.checked += 1;
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status !== 200) {
        report.errors.push(`${url} -> ${response.status}`);
      } else {
        report.ok += 1;
      }
    } catch (error) {
      report.errors.push(`${url} -> ${error instanceof Error ? error.message : 'fetch failed'}`);
    }
  }

  return report;
}

async function main(): Promise<void> {
  const live = process.argv.includes('--live');
  const liveReport = live ? await runLiveSample() : null;

  if (liveReport && liveReport.errors.length > 0) {
    for (const error of liveReport.errors) failures.push(`live.probe :: ${error}`);
  }

  const summary = {
    mode: live ? 'LIVE' : 'STATIC',
    origin,
    taxonomy: {
      intents: stats.intents,
      target: EVENT_INTENT_TARGET,
      families: stats.families,
      nearDuplicateLabels: nearDuplicates.length,
    },
    geography: {
      rowsRaw: stats.municipalityRowsRaw,
      published: stats.municipalityUrls,
      provinces: stats.provincesCovered,
      excludedUnresolvedProvince: stats.excludedUnresolvedProvince,
      excludedDuplicatePath: stats.excludedDuplicatePath,
      excludedInvalidSlug: stats.excludedInvalidSlug,
      ineCodeCollisions: stats.ineCodeCollisions,
    },
    sitemap: {
      intentProvinceUrls: stats.intentProvinceUrls,
      eventShardUrls: stats.eventShardUrls,
      shards: stats.shards,
      largestShardUrls: stats.largestShardUrls,
      totalUrls: stats.totalUrls,
      firstShardSample: `eventos-0001 (${firstShardEntries.length} URLs)`,
    },
    live: liveReport,
    failures,
    warnings,
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
  };

  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = failures.length === 0 ? 0 : 1;
}

void main();


