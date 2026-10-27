/**
 * ════════════════════════════════════════════════════════════════════════════
 * LOADER DE PARTICIONES EDGE DEL DATA LAKE (SOLO SERVIDOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Lee las particiones publicadas en `public/data/providers/*.json` guiándose
 * por `manifest.json` (SSOT del CDN). Sin `any`, con caché por partición y
 * presupuesto de memoria controlado (una partición base por gremio).
 *
 * Presupuesto:
 *   · Modo estándar  → primera partición de cada gremio (~1 MB/gremio).
 *   · EAR_PROVIDER_DEEP_SCAN=1 → todas las particiones del manifest.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';

/** Registro mínimo y tipado de proveedor del Data Lake. */
export interface EdgeProviderRecord {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly province: string | null;
  readonly municipality: string | null;
  readonly phone: string | null;
  readonly hasRealPhone: boolean;
  readonly verified: boolean;
  readonly rating: number | null;
  readonly reviewsCount: number | null;
  readonly basePrice: number | null;
  readonly lat: number | null;
  readonly lng: number | null;
  readonly image: string | null;
  readonly description: string | null;
}

/** Categorías publicadas del Data Lake (orden canónico). */
export const EDGE_PROVIDER_CATEGORIES: readonly string[] = Object.freeze([
  'finca',
  'catering',
  'musica',
  'foto',
  'decoracion',
  'sonido',
  'moda',
  'transporte',
  'wedding',
  'servicios',
  'senior_care',
]);

const PARTITION_DIRS: readonly string[] = Object.freeze([
  path.join(process.cwd(), 'public', 'data', 'providers'),
  path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'providers'),
]);

const globalScan = globalThis as typeof globalThis & {
  __earEdgePartitionCache?: Map<string, readonly EdgeProviderRecord[]>;
  __earEdgeManifestCache?: Record<string, readonly string[]>;
};

const partitionCache: Map<string, readonly EdgeProviderRecord[]> =
  (globalScan.__earEdgePartitionCache ??= new Map());

function resolveExistingPath(fileName: string): string | null {
  for (const dir of PARTITION_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) return candidate;
    } catch {
      // Ignorar rutas inaccesibles.
    }
  }
  return null;
}

interface ManifestChunkEntry {
  readonly chunks?: readonly string[];
}

/** Chunks publicados por gremio (según manifest), con fallback `<gremio>.json`. */
function readManifestChunks(): Record<string, readonly string[]> {
  if (globalScan.__earEdgeManifestCache) return globalScan.__earEdgeManifestCache;

  const result: Record<string, readonly string[]> = {};
  const manifestPath = resolveExistingPath('manifest.json');

  if (manifestPath) {
    try {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ manifestPath, 'utf8');
      const parsed = JSON.parse(raw) as Record<string, ManifestChunkEntry | undefined>;
      for (const [key, entry] of Object.entries(parsed)) {
        if (key === '_meta' || !entry || !Array.isArray(entry.chunks)) continue;
        result[key] = entry.chunks.filter(
          (chunk): chunk is string => typeof chunk === 'string' && chunk.endsWith('.json'),
        );
      }
    } catch (error) {
      console.warn('[edgePartitionLoader] manifest ilegible:', error);
    }
  }

  for (const category of EDGE_PROVIDER_CATEGORIES) {
    if (!result[category] || result[category].length === 0) {
      result[category] = [`${category}.json`];
    }
  }

  globalScan.__earEdgeManifestCache = result;
  return result;
}

const DEEP_SCAN = process.env.EAR_PROVIDER_DEEP_SCAN === '1';

/**
 * Presupuesto de particiones por gremio.
 *   1 = mínima latencia (~1 MB/gremio).
 *   2-3 = mejor cobertura de match (recomendado 2 para el plano de evento).
 *   EAR_PROVIDER_DEEP_SCAN=1 = todas las particiones publicadas.
 */
const CHUNKS_PER_CATEGORY = (() => {
  const raw = Number(process.env.EAR_PROVIDER_CHUNKS_PER_CATEGORY ?? 2);
  if (!Number.isFinite(raw)) return 2;
  return Math.min(12, Math.max(1, Math.round(raw)));
})();

function chunkFilesForCategory(category: string): readonly string[] {
  const chunks = readManifestChunks()[category] ?? [`${category}.json`];
  if (DEEP_SCAN) return chunks;
  return chunks.slice(0, CHUNKS_PER_CATEGORY);
}


function readString(source: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return null;
}

function readNumber(source: Record<string, unknown>, keys: readonly string[]): number | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function readBoolean(source: Record<string, unknown>, keys: readonly string[]): boolean {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'boolean') return value;
  }
  return false;
}

/** Normaliza un registro crudo del CDN a `EdgeProviderRecord`. */
function normalizeProvider(raw: unknown, fallbackCategory: string): EdgeProviderRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;

  const name = readString(source, ['name', 'displayName', 'companyName']);
  const slug = readString(source, ['slug']);
  const id = readString(source, ['id', 'vendorId', 'shaHash']);
  if (!name || !slug || !id) return null;

  const phone = readString(source, ['phone', 'telephone', 'phoneRaw']);
  const imageList = source['imageUrls'];
  const firstImage =
    readString(source, ['img', 'image', 'photo']) ??
    (Array.isArray(imageList)
      ? imageList.find((value): value is string => typeof value === 'string' && value.startsWith('http')) ?? null
      : null);

  return {
    id,
    slug: slug.toLowerCase(),
    name,
    category: readString(source, ['category', 'gremio'])?.toLowerCase() ?? fallbackCategory,
    province: readString(source, ['province', 'provincia']),
    municipality: readString(source, ['municipality', 'city', 'municipio']),
    phone,
    hasRealPhone: readBoolean(source, ['has_real_phone', 'hasDirectPhone']) || Boolean(phone),
    verified: readBoolean(source, ['verified', 'isVerified']),
    rating: readNumber(source, ['rating', 'score']),
    reviewsCount: readNumber(source, ['reviewsCount', 'reviews']),
    basePrice: readNumber(source, ['basePrice', 'price', 'basePriceEur']),
    lat: readNumber(source, ['lat', 'latitude']),
    lng: readNumber(source, ['lng', 'lon', 'longitude']),
    image: firstImage,
    description: readString(source, ['description', 'tagline']),
  };
}

/** Carga (con caché) una partición concreta por nombre de archivo. */
function loadPartitionFile(fileName: string): readonly EdgeProviderRecord[] {
  const cached = partitionCache.get(fileName);
  if (cached) return cached;

  const resolved = resolveExistingPath(fileName);
  if (!resolved) {
    partitionCache.set(fileName, []);
    return [];
  }

  try {
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ resolved, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      partitionCache.set(fileName, []);
      return [];
    }
    const fallbackCategory = fileName.replace(/__\d+\.json$/, '').replace(/\.json$/, '');
    const normalized: EdgeProviderRecord[] = [];
    for (const entry of parsed) {
      const record = normalizeProvider(entry, fallbackCategory);
      if (record) normalized.push(record);
    }
    partitionCache.set(fileName, normalized);
    return normalized;
  } catch (error) {
    console.warn(`[edgePartitionLoader] partición ${fileName} ilegible:`, error);
    partitionCache.set(fileName, []);
    return [];
  }
}

/** Proveedores de un gremio (partición base o completa según presupuesto). */
export function loadProvidersByCategory(category: string): readonly EdgeProviderRecord[] {
  const normalizedCategory = category.trim().toLowerCase();
  const files = chunkFilesForCategory(normalizedCategory);
  const collected: EdgeProviderRecord[] = [];
  for (const file of files) {
    for (const record of loadPartitionFile(file)) {
      if (record.category === normalizedCategory) collected.push(record);
    }
  }
  return collected;
}

/** Catálogo agregado de todos los gremios (deduplicado por slug). */
export function loadFullProviderCatalog(): readonly EdgeProviderRecord[] {
  const seen = new Set<string>();
  const catalog: EdgeProviderRecord[] = [];
  for (const category of EDGE_PROVIDER_CATEGORIES) {
    for (const record of loadProvidersByCategory(category)) {
      if (seen.has(record.slug)) continue;
      seen.add(record.slug);
      catalog.push(record);
    }
  }
  return catalog;
}

/** Búsqueda exacta por slug (case-insensitive) sobre el catálogo agregado. */
export function findEdgeProviderBySlug(slug: string): EdgeProviderRecord | null {
  const target = slug.trim().toLowerCase();
  if (!target) return null;
  for (const category of EDGE_PROVIDER_CATEGORIES) {
    const match = loadProvidersByCategory(category).find(
      (record) => record.slug === target || record.id.toLowerCase() === target,
    );
    if (match) return match;
  }
  return null;
}
