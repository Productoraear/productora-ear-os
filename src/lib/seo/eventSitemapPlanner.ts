/**
 * EVENT SITEMAP PLANNER — convierte la taxonomía de eventos y el universo
 * municipal de España en un inventario de URLs troceado en shards servibles.
 *
 * Reglas que este módulo hace cumplir por construcción:
 *  · Un `<loc>` sólo existe si su ruta tiene página real en app/(public)/eventos/**.
 *    No se emite ninguna URL \"promesa\" sin ruta (EP-3, AF-5).
 *  · Ningún shard supera EVENT_SHARD_MAX_URLS (20.000), por debajo del límite de
 *    50.000/50 MB de sitemaps.org: margen para crecer sin rehacer el índice.
 *  · `lastmod` NO se emite: no existe fecha real por URL. Inventar la de hoy
 *    convierte el sitemap en una mentira diaria (AF-5).
 *  · El inventario es determinista: mismo dataset ⇒ mismo orden ⇒ mismos ids de
 *    shard. Un cambio de orden sólo puede venir de un cambio de datos.
 *
 * Orden de prioridad de rastreo (dinero primero):
 *   hub → familias → intenciones → intención×provincia (tier 1, 2, 3) → municipios.
 *
 * SEC-2 · role: public | tenant: global. Cero datos personales.
 */
import type { MetadataRoute } from 'next';
import { toCanonicalLoc } from '@/lib/seo/canonicalSite';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import {
  EVENT_FAMILIES,
  EVENT_INTENTS,
  EVENT_INTENT_COUNT,
  buildEventIntentPath,
  buildEventIntentProvincePath,
  buildEventMunicipalityPath,
} from '@/lib/seo/eventIntentTaxonomy';
import {
  SPAIN_MUNICIPALITIES,
  SPAIN_MUNICIPALITY_COUNT,
  MUNICIPALITY_COVERAGE_STATS,
} from '@/lib/seo/spainMunicipalityCoverage';

export const EVENT_SITEMAP_SHARD_PREFIX = 'eventos-';
export const EVENT_SHARD_MAX_URLS = 20000;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

export type EventUrlLevel = 'hub' | 'family' | 'intent' | 'intent-province' | 'municipality';

export interface EventUrlRecord {
  /** Ruta relativa canónica, siempre con barra inicial. */
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  level: EventUrlLevel;
}

export interface EventSitemapShard {
  /** Id público: `eventos-0001`. */
  id: string;
  /** Posición 1-based. */
  index: number;
  /** Número de URLs del shard (≤ EVENT_SHARD_MAX_URLS). */
  urlCount: number;
}

const PROVINCE_SLUGS: readonly string[] = Object.keys(PROVINCIAS_52_GRAPH);

function buildInventory(): EventUrlRecord[] {
  const records: EventUrlRecord[] = [];

  records.push({ path: '/eventos', priority: 0.9, changeFrequency: 'daily', level: 'hub' });
  records.push({
    path: '/eventos/cobertura-municipal',
    priority: 0.88,
    changeFrequency: 'weekly',
    level: 'hub',
  });

  for (const family of EVENT_FAMILIES) {
    records.push({
      path: `/eventos/${family.id}`,
      priority: 0.85,
      changeFrequency: 'weekly',
      level: 'family',
    });
  }

  for (const intent of EVENT_INTENTS) {
    records.push({
      path: buildEventIntentPath(intent.family, intent.slug),
      priority: intent.demandTier === 1 ? 0.8 : 0.7,
      changeFrequency: 'weekly',
      level: 'intent',
    });
  }

  // Intención × provincia, en orden de demanda (tier 1 primero) y después por provincia.
  for (const tier of [1, 2, 3]) {
    const tierIntents = EVENT_INTENTS.filter((intent) => intent.demandTier === tier);
    for (const intent of tierIntents) {
      for (const provinceSlug of PROVINCE_SLUGS) {
        records.push({
          path: buildEventIntentProvincePath(intent.family, intent.slug, provinceSlug),
          priority: tier === 1 ? 0.75 : tier === 2 ? 0.65 : 0.55,
          changeFrequency: 'weekly',
          level: 'intent-province',
        });
      }
    }
  }

  for (const municipality of SPAIN_MUNICIPALITIES) {
    records.push({
      path: buildEventMunicipalityPath(municipality.provinceSlug, municipality.slug),
      priority: 0.6,
      changeFrequency: 'monthly',
      level: 'municipality',
    });
  }

  return records;
}

let cachedInventory: EventUrlRecord[] | null = null;
let cachedNonMunicipalInventory: EventUrlRecord[] | null = null;

/** Inventario completo memoizado (24k registros ≈ pocos MB, una sola construcción). */
export function getEventUrlInventory(): readonly EventUrlRecord[] {
  if (!cachedInventory) cachedInventory = buildInventory();
  return cachedInventory;
}

/**
 * Todo el inventario menos las fichas municipales.
 *
 * Por qué se separa: las 8.131 fichas municipales se sirven en la partición 4
 * (`/sitemaps/4.xml`, "cobertura municipal") para no publicar la misma URL en
 * dos sitemaps. Los shards `eventos-NNNN` cubren hub + familias + intenciones +
 * intención×provincia.
 */
function getNonMunicipalInventory(): readonly EventUrlRecord[] {
  if (!cachedNonMunicipalInventory) {
    cachedNonMunicipalInventory = getEventUrlInventory().filter(
      (record) => record.level !== 'municipality'
    );
  }
  return cachedNonMunicipalInventory;
}


function formatShardId(index: number): string {
  return `${EVENT_SITEMAP_SHARD_PREFIX}${String(index).padStart(4, '0')}`;
}

/** Shards deterministas del catálogo de eventos (excluye fichas municipales). */
export function getEventSitemapShards(): readonly EventSitemapShard[] {
  const total = getNonMunicipalInventory().length;
  const shardCount = Math.max(1, Math.ceil(total / EVENT_SHARD_MAX_URLS));
  const shards: EventSitemapShard[] = [];

  for (let i = 0; i < shardCount; i += 1) {
    const start = i * EVENT_SHARD_MAX_URLS;
    const end = Math.min(start + EVENT_SHARD_MAX_URLS, total);
    shards.push({ id: formatShardId(i + 1), index: i + 1, urlCount: end - start });
  }

  return shards;
}

export function getEventShardIds(): readonly string[] {
  return getEventSitemapShards().map((shard) => shard.id);
}

/**
 * Valida un id de shard (`eventos-0001`, con o sin `.xml`).
 * Devuelve la posición 1-based o `null` si no existe (SEC-1: cerrado por defecto).
 */
export function parseEventShardId(value: string): number | null {
  const clean = value.replace(/\.xml$/i, '').trim().toLowerCase();
  if (!clean.startsWith(EVENT_SITEMAP_SHARD_PREFIX)) return null;

  const numeric = clean.slice(EVENT_SITEMAP_SHARD_PREFIX.length);
  if (!/^\d{4}$/.test(numeric)) return null;

  const index = Number.parseInt(numeric, 10);
  if (!Number.isInteger(index) || index < 1) return null;

  return index <= getEventSitemapShards().length ? index : null;
}

/** Ruta pública donde se sirve un shard (fuera de /api/). */
export function getEventShardPublicPath(shardId: string): string | null {
  return parseEventShardId(shardId) === null ? null : `/sitemaps/${shardId}.xml`;
}

/**
 * Entradas `<urlset>` de un shard. `lastmod` se omite a propósito: no existe
 * fecha real por URL y fingirla sería el "verde por defecto" que prohíbe AF-5.
 */
export function buildEventShardEntries(shardId: string, origin: string): MetadataRoute.Sitemap {
  const index = parseEventShardId(shardId);
  if (index === null) throw new Error(`Shard de eventos no canónico: ${shardId}`);

  const inventory = getNonMunicipalInventory();
  const start = (index - 1) * EVENT_SHARD_MAX_URLS;
  const slice = inventory.slice(start, start + EVENT_SHARD_MAX_URLS);

  return slice.map((record) => ({
    url: toCanonicalLoc(record.path, origin),
    changeFrequency: record.changeFrequency,
    priority: record.priority,
  }));
}

/**
 * Entradas de las fichas municipales, consumidas por la partición 4.
 * Mismo origen único de verdad que el resto del catálogo: si un municipio no
 * está en el inventario, no existe aquí.
 */
export function getMunicipalSitemapEntries(origin: string): MetadataRoute.Sitemap {
  return getEventUrlInventory()
    .filter((record) => record.level === 'municipality')
    .map((record) => ({
      url: toCanonicalLoc(record.path, origin),
      changeFrequency: record.changeFrequency,
      priority: record.priority,
    }));
}

export interface EventCoverageStats {
  families: number;
  intents: number;
  provincesCovered: number;
  intentProvinceUrls: number;
  /** URLs servidas por los shards `eventos-NNNN` (hub + familias + intenciones + provincia). */
  eventShardUrls: number;
  municipalityRowsRaw: number;
  municipalityUrls: number;
  totalUrls: number;
  shards: number;
  maxUrlsPerShard: number;
  largestShardUrls: number;
  ineCodeCollisions: number;
  excludedUnresolvedProvince: number;
  excludedDuplicatePath: number;
  excludedInvalidSlug: number;
}

/** Cifras derivadas del inventario real, no de constantes escritas a mano. */
export function getEventCoverageStats(): EventCoverageStats {
  const inventory = getEventUrlInventory();
  const shards = getEventSitemapShards();
  const countByLevel = (level: EventUrlLevel): number =>
    inventory.filter((record) => record.level === level).length;

  return {
    families: EVENT_FAMILIES.length,
    intents: EVENT_INTENT_COUNT,
    provincesCovered: PROVINCE_SLUGS.length,
    intentProvinceUrls: countByLevel('intent-province'),
    eventShardUrls: shards.reduce((sum, shard) => sum + shard.urlCount, 0),
    municipalityRowsRaw: MUNICIPALITY_COVERAGE_STATS.rawRows,
    municipalityUrls: countByLevel('municipality'),
    totalUrls: inventory.length,
    shards: shards.length,
    maxUrlsPerShard: EVENT_SHARD_MAX_URLS,
    largestShardUrls: shards.reduce((max, shard) => Math.max(max, shard.urlCount), 0),
    ineCodeCollisions: MUNICIPALITY_COVERAGE_STATS.ineCodeCollisions,
    excludedUnresolvedProvince: MUNICIPALITY_COVERAGE_STATS.excludedUnresolvedProvince,
    excludedDuplicatePath: MUNICIPALITY_COVERAGE_STATS.excludedDuplicatePath,
    excludedInvalidSlug: MUNICIPALITY_COVERAGE_STATS.excludedInvalidSlug,
  };
}

let cachedPublishedPaths: ReadonlySet<string> | null = null;

/**
 * ¿Esta ruta está publicada en el sitemap de eventos?
 *
 * Disponible para que cualquier página nueva pueda decidir `robots.index` sin
 * duplicar la lógica del inventario. Las cinco plantillas actuales sólo generan
 * rutas que están en el inventario, así que publican `index: true`; si mañana
 * se añade una plantilla que pueda generar rutas fuera del inventario, esta
 * función es el gate (nunca se pide indexar lo que no se publica).
 */
export function isEventPathPublished(path: string): boolean {
  if (!cachedPublishedPaths) {
    cachedPublishedPaths = new Set(getEventUrlInventory().map((record) => record.path));
  }
  return cachedPublishedPaths.has(path);
}

export { SPAIN_MUNICIPALITY_COUNT };

