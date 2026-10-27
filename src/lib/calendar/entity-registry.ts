/**
 * ════════════════════════════════════════════════════════════════════════════
 * REGISTRO DE ENTIDADES CON CALENDARIO PROPIO (SOLO SERVIDOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Resuelve `kind + slug` → nombre comercial real. Sin inventar entidades:
 *   1. Roster soberano de artistas y catálogo de formatos S-Class.
 *   2. Data Lake de proveedores (particiones edge verificadas).
 *   3. Desconocido → se respeta el slug como nombre y se avisa (never 404 en
 *      medio de una venta; el proveedor puede reclamar después).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { ARTIST_FORMATS } from '@/lib/reservar/solista-catalog';
import { SOVEREIGN_ARTISTS_ROSTER } from '@/lib/constants/sovereign-artists-roster';
import {
  getCalendarEntityKindMeta,
  resolveCalendarEntityKind,
  type CalendarEntityKind,
} from '@/lib/calendar/entity-calendar-types';
import {
  findEdgeProviderBySlug,
  loadProvidersByCategory,
} from '@/lib/providers/edge-partition-loader';

export interface ResolvedCalendarEntity {
  readonly kind: CalendarEntityKind;
  readonly slug: string;
  readonly displayName: string;
  readonly source: 'artist' | 'provider' | 'unresolved';
  readonly category: string | null;
}

interface ArtistLookupEntry {
  readonly slug: string;
  readonly name: string;
}

const ARTIST_LOOKUP: readonly ArtistLookupEntry[] = Object.freeze([
  ...SOVEREIGN_ARTISTS_ROSTER.map((artist) => ({
    slug: artist.id.toLowerCase(),
    name: artist.name,
  })),
  ...ARTIST_FORMATS.map((format) => ({
    slug: format.id.toLowerCase(),
    name: format.name,
  })),
]);

/** Artistas con agenda propia (roster + formatos) para el selector de entidades. */
export function listArtistCalendarEntities(): readonly ArtistLookupEntry[] {
  const seen = new Set<string>();
  const list: ArtistLookupEntry[] = [];
  for (const entry of ARTIST_LOOKUP) {
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    list.push(entry);
  }
  return list;
}

/** Busca un artista por slug exacto (case-insensitive). */
export function findArtistBySlug(slug: string): ArtistLookupEntry | null {
  const target = slug.trim().toLowerCase();
  return ARTIST_LOOKUP.find((entry) => entry.slug === target) ?? null;
}

/** Categoría del Data Lake → kind canónico del calendario. */
const CATEGORY_TO_KIND: Readonly<Record<string, CalendarEntityKind>> = Object.freeze({
  musica: 'musica',
  finca: 'finca',
  catering: 'catering',
  sonido: 'tecnica',
  foto: 'fotografia',
  moda: 'moda',
  decoracion: 'decoracion',
  transporte: 'transporte',
  wedding: 'wedding',
  servicios: 'servicios',
  senior_care: 'senior_care',
});

/**
 * Resuelve la entidad de un calendario. El `kind` solicitado manda (permite
 * que un artista de la casa use `artista` aunque su registro viva en `musica`).
 */
export function resolveCalendarEntity(
  kind: CalendarEntityKind,
  slug: string,
): ResolvedCalendarEntity {
  const artist = findArtistBySlug(slug);
  if (artist) {
    return {
      kind,
      slug: artist.slug,
      displayName: artist.name,
      source: 'artist',
      category: 'artista',
    };
  }

  const meta = getCalendarEntityKindMeta(kind);
  const provider = findEdgeProviderBySlug(slug);
  if (provider) {
    return {
      kind,
      slug: provider.slug,
      displayName: provider.name,
      source: 'provider',
      category: provider.category || meta.providerCategory,
    };
  }

  return {
    kind,
    slug,
    displayName: slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    source: 'unresolved',
    category: meta.providerCategory,
  };
}

/**
 * Deduce el kind de una entidad a partir del slug (para paneles heredados que
 * solo conocen el slug, como la sesión del proveedor).
 */
export function inferCalendarEntityKind(slug: string): CalendarEntityKind {
  if (findArtistBySlug(slug)) return 'artista';
  const provider = findEdgeProviderBySlug(slug);
  if (provider) return CATEGORY_TO_KIND[provider.category] ?? 'servicios';
  return 'servicios';
}

/** Slugs de proveedores disponibles para un kind (selector / simulación). */
export function listProviderCalendarEntities(
  kind: CalendarEntityKind,
  limit = 24,
): readonly ArtistLookupEntry[] {
  const meta = getCalendarEntityKindMeta(kind);
  if (kind === 'artista') return listArtistCalendarEntities();

  const category = meta.providerCategory;
  if (!category) return [];

  return loadProvidersByCategory(category)
    .slice(0, Math.max(1, limit))
    .map((provider) => ({ slug: provider.slug, name: provider.name }));
}

/** Normaliza un parámetro `kind` de URL. `null` si es inválido. */
export function parseCalendarEntityKindParam(raw: string | null | undefined): CalendarEntityKind | null {
  return resolveCalendarEntityKind(raw);
}
