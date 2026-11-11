/**
 * ════════════════════════════════════════════════════════════════════════════
 * CATÁLOGO DINÁMICO DE FICHAS (W55_T01 · WAVE 55 · AGENTE SOBERANO)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el agente frontal y el bot de WhatsApp necesitan consultar el
 * catálogo de 2.150 fichas SIN que nadie cablee resultados. Este módulo es la
 * ÚNICA puerta a esos datos: todo lo que devuelve se declara con su origen
 * físico (`live` = PostgreSQL 16 medido · `static` = artefacto en disco).
 *
 * REGLAS DURAS:
 *   · CERO fichas cableadas o limitadas a mano. La consulta se construye en
 *     tiempo de ejecución a partir de los filtros pedidos (AF-1, cero fachada).
 *   · Fuente primaria = base de datos DURADERA (`prisma.providerFicha`, 2.150
 *     filas de W44). `select` quirúrgico obligatorio (INV-20).
 *   · `artistProfile` es un modelo DISTINTO (`career_artist_profile`, con
 *     `baseFeeCents`): se expone como vertical de artistas con su propia forma
 *     y se declara la fuente. No se mezclan silenciosamente.
 *   · Si la base no responde, el fallback al artefacto JSON se declara
 *     `source:"static"` y `degraded:true`. NUNCA se disfraza de `live` (AF-5).
 *   · Teléfonos: este módulo NO los publica; el llamador decide con
 *     `maskPhone` / contact-gate (anti-picaresca, JUR-1).
 *
 * MÓDULO DE SERVIDOR: usa `node:fs`. Prohibido importarlo desde `"use client"`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

/* ──────────────────────────────────────────────────────────────────────────── */
/* Contratos                                                                   */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Origen físico del dato. Vocabulario cerrado (EP-2 / AF-1). */
export type CatalogSource = 'live' | 'static';

/** Vertical del catálogo. Cada ficha declara de qué tabla o artefacto sale. */
export type CatalogVertical = 'provider' | 'artist';

/** Filtro facetado y paginado. Todos los campos son opcionales y acotados. */
export interface FichaSearchQuery {
  /** Texto libre: nombre, municipio, provincia o categoría. */
  readonly text: string | null;
  readonly category: string | null;
  readonly municipality: string | null;
  readonly province: string | null;
  /** Rango de presupuesto en EUROS (inclusivo). `null` = sin cota. */
  readonly minPriceEur: number | null;
  readonly maxPriceEur: number | null;
  /** Sólo fichas con teléfono verificado publicable. */
  readonly verifiedOnly: boolean;
  readonly limit: number;
  readonly offset: number;
}

/** Ficha normalizada (independiente de si vino de BD o de JSON). */
export interface CatalogFicha {
  readonly key: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string | null;
  readonly province: string | null;
  readonly municipality: string | null;
  /** SIEMPRE `true` o `false`: indica que hay teléfono, nunca el número. */
  readonly hasPhone: boolean;
  readonly priceEur: number | null;
  readonly rating: number | null;
  readonly verified: boolean;
  readonly completeness: number;
  /** Puntero de procedencia (SHA-256 completo en BD, prefijo 16 hex en JSON). */
  readonly provenanceRef: string | null;
  readonly vertical: CatalogVertical;
}

/** Resultado de búsqueda con metadatos de honestidad y trazabilidad. */
export interface FichaSearchResult {
  readonly source: CatalogSource;
  /** `true` si se sirvió del artefacto porque la BD no respondió. */
  readonly degraded: boolean;
  readonly degradedReason: string | null;
  /** Total real que casa con los filtros (no el tamaño de la página). */
  readonly total: number;
  readonly returned: number;
  readonly limit: number;
  readonly offset: number;
  readonly fichas: readonly CatalogFicha[];
  /** Facetas reales del conjunto devuelto (para el desplegable del agente). */
  readonly facets: {
    readonly categories: Readonly<Record<string, number>>;
    readonly provinces: Readonly<Record<string, number>>;
  };
  readonly queryMs: number;
}

/** Detalle completo de una ficha para el handoff comercial. */
export interface FichaDetails {
  readonly source: CatalogSource;
  readonly degraded: boolean;
  readonly ficha: CatalogFicha;
  /** Servicios/menús declarados por el proveedor. `null` si no hay dato. */
  readonly services: readonly string[] | null;
  /** Hechos citables (sólo campos presentes; jamás relleno inventado). */
  readonly facts: readonly string[];
  /** Lo que la ficha NO certifica. */
  readonly missing: readonly string[];
  /** Sitio web declarado en origen. `null` = ausente. */
  readonly web: string | null;
  /** Teléfono ENMASCARADO listo para mostrar. Nunca el número en claro. */
  readonly maskedPhone: string | null;
  /** ID de vendor canónico para el handoff (`v-12345` → `12345`). */
  readonly vendorId: string | null;
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Puerto Prisma (testabilidad sin base viva)                                  */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Fila de `ProviderFicha` — `select` quirúrgico (INV-20), sin campos de más. */
export interface ProviderFichaRow {
  readonly key: string;
  readonly slug: string | null;
  readonly name: string;
  readonly category: string | null;
  readonly province: string | null;
  readonly municipality: string | null;
  readonly phone: string | null;
  readonly priceEur: number | null;
  readonly rating: number | null;
  readonly verified: boolean;
  readonly completeness: number;
  readonly provenanceHash: string;
  readonly vendorId: string | null;
}

/** Fila de `artistProfile` — céntimos enteros (`baseFeeCents`), cero floats. */
export interface ArtistProfileRow {
  readonly id: string;
  readonly territory: string;
  readonly primaryGenre: string | null;
  readonly baseFeeCents: number | null;
}

/** `where` normalizado para `ProviderFicha` (nunca un objeto arbitrario). */
export interface ProviderWhere {
  readonly AND: readonly unknown[];
}

/** `where` normalizado para `artistProfile`. */
export interface ArtistWhere {
  readonly AND: readonly unknown[];
}

/**
 * Puerto mínimo sobre Prisma. Permite inyectar un doble en el arnés y probar
 * la lógica SIN base viva, y obliga a `count` con el MISMO `where` que la
 * página (total honesto sin traer 2.150 filas a memoria).
 */
export interface CatalogDbPort {
  readonly source: 'database';
  countProviders(where: ProviderWhere): Promise<number>;
  findProviders(
    where: ProviderWhere,
    limit: number,
    offset: number,
  ): Promise<readonly ProviderFichaRow[]>;
  findProviderByKey(key: string): Promise<ProviderFichaRow | null>;
  countArtists(where: ArtistWhere): Promise<number>;
  findArtists(
    where: ArtistWhere,
    limit: number,
    offset: number,
  ): Promise<readonly ArtistProfileRow[]>;
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Utilidades puras                                                            */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Minúsculas sin acentos ni signos: base de comparación determinista. */
export function normalizeText(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Céntimos enteros → euros exactos (jamás `toFixed` sobre un float crudo). */
export function centsToEur(cents: number | null): number | null {
  if (cents === null || !Number.isFinite(cents)) return null;
  return Math.round(cents) / 100;
}

/** Filtro por defecto: acotado para que un LLM no pida 2.150 filas de golpe. */
export const DEFAULT_SEARCH_LIMIT: number = 20;
/** Techo de página: protege la latencia del bot de WhatsApp. */
export const MAX_SEARCH_LIMIT: number = 50;

/** Aplica las cotas de paginación al filtro crudo. */
export function clampSearchQuery(input: Partial<FichaSearchQuery>): FichaSearchQuery {
  const limit: number = Math.min(
    MAX_SEARCH_LIMIT,
    Math.max(1, Math.trunc(input.limit ?? DEFAULT_SEARCH_LIMIT)),
  );
  const offset: number = Math.max(0, Math.trunc(input.offset ?? 0));
  return {
    text: input.text ?? null,
    category: input.category ?? null,
    municipality: input.municipality ?? null,
    province: input.province ?? null,
    minPriceEur: input.minPriceEur ?? null,
    maxPriceEur: input.maxPriceEur ?? null,
    verifiedOnly: input.verifiedOnly === true,
    limit,
    offset,
  };
}


/**
 * Construye el `where` de `ProviderFicha` en tiempo de ejecución.
 *
 * Se usa `mode: 'insensitive'` (PostgreSQL) para que «Méntrida» case con
 * «mentrida». El arnés mide la FORMA del filtro (cero resultados cableados),
 * no el motor remoto.
 */
export function buildProviderWhere(query: FichaSearchQuery): ProviderWhere {
  const and: unknown[] = [];
  if (query.category !== null && query.category.length > 0) {
    and.push({ category: { equals: query.category, mode: 'insensitive' } });
  }
  if (query.province !== null && query.province.length > 0) {
    and.push({ province: { equals: query.province, mode: 'insensitive' } });
  }
  if (query.municipality !== null && query.municipality.length > 0) {
    and.push({ municipality: { contains: query.municipality, mode: 'insensitive' } });
  }
  if (query.text !== null && query.text.length > 0) {
    and.push({
      OR: [
        { name: { contains: query.text, mode: 'insensitive' } },
        { municipality: { contains: query.text, mode: 'insensitive' } },
        { province: { contains: query.text, mode: 'insensitive' } },
        { category: { contains: query.text, mode: 'insensitive' } },
      ],
    });
  }
  const price: { gte?: number; lte?: number } = {};
  if (query.minPriceEur !== null) price.gte = query.minPriceEur;
  if (query.maxPriceEur !== null) price.lte = query.maxPriceEur;
  if (Object.keys(price).length > 0) and.push({ priceEur: price });
  if (query.verifiedOnly) and.push({ verified: true });
  return { AND: and };
}

/** `where` de `artistProfile` (vertical de artistas, en CÉNTIMOS enteros). */
export function buildArtistWhere(query: FichaSearchQuery): ArtistWhere {
  const and: unknown[] = [];
  if (query.text !== null && query.text.length > 0) {
    and.push({
      OR: [
        { id: { contains: query.text, mode: 'insensitive' } },
        { primaryGenre: { contains: query.text, mode: 'insensitive' } },
      ],
    });
  }
  const fee: { gte?: number; lte?: number } = {};
  if (query.minPriceEur !== null) fee.gte = Math.round(query.minPriceEur * 100);
  if (query.maxPriceEur !== null) fee.lte = Math.round(query.maxPriceEur * 100);
  if (Object.keys(fee).length > 0) and.push({ baseFeeCents: fee });
  return { AND: and };
}

/** Fila de BD → ficha normalizada. `hasPhone` es booleano, jamás el número. */
export function toCatalogFicha(row: ProviderFichaRow): CatalogFicha {
  return {
    key: row.key,
    slug: row.slug !== null && row.slug.length > 0 ? row.slug : row.key,
    name: row.name,
    category: row.category !== null && row.category.length > 0 ? row.category : null,
    province: row.province !== null && row.province.length > 0 ? row.province : null,
    municipality:
      row.municipality !== null && row.municipality.length > 0 ? row.municipality : null,
    hasPhone: typeof row.phone === 'string' && row.phone.replace(/\D/g, '').length >= 9,
    priceEur: row.priceEur,
    rating: row.rating,
    verified: row.verified,
    completeness: row.completeness,
    provenanceRef: row.provenanceHash.length > 0 ? row.provenanceHash : null,
    vertical: 'provider',
  };
}

/** Fila de artista → ficha normalizada (`baseFeeCents` → euros exactos). */
export function artistToFicha(row: ArtistProfileRow): CatalogFicha {
  return {
    key: row.id,
    slug: row.id,
    name: row.id,
    category: row.primaryGenre,
    province: row.territory,
    municipality: null,
    hasPhone: false,
    priceEur: centsToEur(row.baseFeeCents),
    rating: null,
    verified: true,
    completeness: 100,
    provenanceRef: null,
    vertical: 'artist',
  };
}

/** Facetas reales contadas sobre las fichas devueltas por el motor. */
export function buildFacets(fichas: readonly CatalogFicha[]): FichaSearchResult['facets'] {
  const categories: Record<string, number> = {};
  const provinces: Record<string, number> = {};
  for (const ficha of fichas) {
    if (ficha.category !== null) categories[ficha.category] = (categories[ficha.category] ?? 0) + 1;
    if (ficha.province !== null) provinces[ficha.province] = (provinces[ficha.province] ?? 0) + 1;
  }
  return { categories, provinces };
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Fuente 1 · Base de datos (primaria)                                         */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Búsqueda contra la base de datos. El llamador decide si puede degradar. */
export async function searchProvidersInDb(
  port: CatalogDbPort,
  query: FichaSearchQuery,
  startedAt: number = Date.now(),
): Promise<FichaSearchResult> {
  const where: ProviderWhere = buildProviderWhere(query);
  const [total, rows] = await Promise.all([
    port.countProviders(where),
    port.findProviders(where, query.limit, query.offset),
  ]);
  const fichas: readonly CatalogFicha[] = rows.map(toCatalogFicha);
  return {
    source: 'live',
    degraded: false,
    degradedReason: null,
    total,
    returned: fichas.length,
    limit: query.limit,
    offset: query.offset,
    fichas,
    facets: buildFacets(fichas),
    queryMs: Date.now() - startedAt,
  };
}

/** Detalle desde BD por clave natural (`ProviderFicha.key` es `@id`). */
export async function getProviderDetailsInDb(
  port: CatalogDbPort,
  key: string,
): Promise<FichaDetails | null> {
  const row: ProviderFichaRow | null = await port.findProviderByKey(key);
  if (row === null) return null;
  return buildDetails(toCatalogFicha(row), row, { source: 'live', degraded: false });
}

/**
 * Hechos citables y huecos declarados. Regla de oro: si el dato es `null`, no
 * se emite frase (cero relleno inventado, AF-4).
 */
export function buildDetails(
  ficha: CatalogFicha,
  row: ProviderFichaRow,
  meta: { readonly source: CatalogSource; readonly degraded: boolean },
): FichaDetails {
  const facts: string[] = [];
  const missing: string[] = [];

  const location: string = [ficha.municipality, ficha.province]
    .filter((part: string | null): part is string => part !== null && part.length > 0)
    .join(' · ');
  facts.push(
    location.length > 0 ? `Proveedor: ${ficha.name} — ${location}.` : `Proveedor: ${ficha.name}.`,
  );
  if (ficha.category !== null) facts.push(`Categoría declarada: ${ficha.category}.`);
  if (ficha.priceEur !== null && ficha.priceEur > 0) {
    facts.push(`Tarifa publicada en su ficha: ${ficha.priceEur.toFixed(2)} €.`);
  } else {
    missing.push('tarifa real del servicio');
  }
  if (ficha.rating !== null && ficha.rating > 0) {
    facts.push(`Valoración publicada: ${ficha.rating.toFixed(1)}/5.`);
  } else {
    missing.push('valoraciones independientes');
  }
  facts.push(
    ficha.hasPhone
      ? 'Teléfono verificado en la ficha de origen; se entrega al confirmar la reserva.'
      : 'Sin teléfono verificado en origen: el canal válido es la Conserjería EAR OS.',
  );
  if (ficha.municipality === null) missing.push('municipio de cobertura');
  missing.push('disponibilidad real de la fecha', 'condiciones de desplazamiento y montaje');

  return {
    source: meta.source,
    degraded: meta.degraded,
    ficha,
    services: null,
    facts,
    missing,
    web: null,
    maskedPhone: null,
    vendorId: row.vendorId,
  };
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Fuente 2 · Artefacto JSON (fallback DECLARADO, nunca silencioso)            */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Artefacto canónico de W43: 2.150 entradas, < 1 MB. */
export const FICHAS_INDEX_PATH: string = path.join(
  process.cwd(),
  'public',
  'data',
  'fichas',
  'fichas_index.json',
);

/** Entrada del artefacto (espejo de `ProviderFichaIndexEntry`). */
export interface IndexEntry {
  readonly key: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly province: string;
  readonly municipality: string;
  readonly phone: string | null;
  readonly priceEur: number | null;
  readonly rating: number | null;
  readonly verified: boolean;
  readonly completeness: number;
  readonly ph: string;
}

let indexCache: readonly IndexEntry[] | null = null;

/** Carga (una vez por proceso) el artefacto. Lanza si no es legible. */
export function loadIndexEntries(filePath: string = FICHAS_INDEX_PATH): readonly IndexEntry[] {
  if (indexCache !== null) return indexCache;
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  const entries: unknown = (parsed as { entries?: unknown }).entries;
  if (!Array.isArray(entries)) throw new Error('fichas_index.json sin array `entries`.');
  indexCache = entries as readonly IndexEntry[];
  return indexCache;
}

/** Sólo para el arnés: descarga la caché de proceso. */
export function resetIndexCache(): void {
  indexCache = null;
}

/** Filtro en memoria sobre el artefacto (mismos criterios que el SQL). */
export function searchProvidersInIndex(
  query: FichaSearchQuery,
  entries: readonly IndexEntry[],
): FichaSearchResult {
  const startedAt: number = Date.now();
  const cat: string = normalizeText(query.category);
  const prov: string = normalizeText(query.province);
  const muni: string = normalizeText(query.municipality);
  const text: string = normalizeText(query.text);

  const matched: IndexEntry[] = entries.filter((entry: IndexEntry) => {
    if (cat.length > 0 && normalizeText(entry.category) !== cat) return false;
    if (prov.length > 0 && normalizeText(entry.province) !== prov) return false;
    if (muni.length > 0 && !normalizeText(entry.municipality).includes(muni)) return false;
    if (query.verifiedOnly && !entry.verified) return false;
    if (
      query.minPriceEur !== null &&
      (entry.priceEur === null || entry.priceEur < query.minPriceEur)
    ) {
      return false;
    }
    if (
      query.maxPriceEur !== null &&
      (entry.priceEur === null || entry.priceEur > query.maxPriceEur)
    ) {
      return false;
    }
    if (text.length > 0) {
      const haystack: string = [entry.name, entry.municipality, entry.province, entry.category]
        .map((part: string) => normalizeText(part))
        .join(' ');
      if (!haystack.includes(text)) return false;
    }
    return true;
  });

  // Orden determinista: verificadas primero, luego completitud, luego nombre.
  const sorted: IndexEntry[] = [...matched].sort(
    (a: IndexEntry, b: IndexEntry) =>
      Number(b.verified) - Number(a.verified) ||
      b.completeness - a.completeness ||
      a.name.localeCompare(b.name),
  );
  const page: readonly IndexEntry[] = sorted.slice(query.offset, query.offset + query.limit);

  const fichas: readonly CatalogFicha[] = page.map(
    (entry: IndexEntry): CatalogFicha => ({
      key: entry.key,
      slug: entry.slug.length > 0 ? entry.slug : entry.key,
      name: entry.name,
      category: entry.category.length > 0 ? entry.category : null,
      province: entry.province.length > 0 ? entry.province : null,
      municipality: entry.municipality.length > 0 ? entry.municipality : null,
      hasPhone: typeof entry.phone === 'string' && entry.phone.replace(/\D/g, '').length >= 9,
      priceEur: entry.priceEur,
      rating: entry.rating,
      verified: entry.verified,
      completeness: entry.completeness,
      provenanceRef: entry.ph.length > 0 ? entry.ph : null,
      vertical: 'provider',
    }),
  );

  return {
    source: 'static',
    degraded: true,
    degradedReason:
      'DB_UNREACHABLE: se sirve el artefacto sellado de W43 (2.150 fichas) declarado como `static`.',
    total: matched.length,
    returned: fichas.length,
    limit: query.limit,
    offset: query.offset,
    fichas,
    facets: buildFacets(fichas),
    queryMs: Date.now() - startedAt,
  };
}

/** Detalle desde el artefacto (mismos hechos, mismos huecos declarados). */
export function getProviderDetailsInIndex(
  key: string,
  entries: readonly IndexEntry[],
): FichaDetails | null {
  const entry: IndexEntry | undefined = entries.find((item: IndexEntry) => item.key === key);
  if (entry === undefined) return null;
  const row: ProviderFichaRow = {
    key: entry.key,
    slug: entry.slug,
    name: entry.name,
    category: entry.category,
    province: entry.province,
    municipality: entry.municipality,
    phone: entry.phone,
    priceEur: entry.priceEur,
    rating: entry.rating,
    verified: entry.verified,
    completeness: entry.completeness,
    provenanceHash: entry.ph,
    vendorId: entry.key.startsWith('v-') ? entry.key.slice(2) : null,
  };
  return buildDetails(toCatalogFicha(row), row, { source: 'static', degraded: true });
}

