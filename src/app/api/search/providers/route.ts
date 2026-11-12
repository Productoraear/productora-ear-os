/**
 * ════════════════════════════════════════════════════════════════════════════
 * GET /api/search/providers — AUTOCOMPLETADO REAL SOBRE POSTGRESQL (PRISMA)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Motivo de existencia:
 *   El autocompletado del buscador global sólo servía índices estáticos. La
 *   dirección exige que la primera línea de resultados sean proveedores VIVOS
 *   de la base de datos (PostgreSQL vía Prisma), no un catálogo congelado.
 *
 * Contrato:
 *   · Búsqueda insensible a mayúsculas/minúsculas (`mode:'insensitive'`) sobre
 *     nombre artístico, bio y géneros (artista) y nombre/bio (proveedor).
 *   · Sólo `vendorProfile.status === 'ACTIVE'` y `artistProfile.status`
 *     publicado/activo (cero proveedores suspendidos en venta).
 *   · Prisma `select` quirúrgico (INV-20): jamás `SELECT *`.
 *   · Techo de tiempo de 8 s sobre la sonda de BD (INV-17).
 *   · AF-1: la respuesta declara `probed`, `source`, `mode` y `checkedAt`.
 *   · Ante BD inaccesible degrada con honestidad (`source:'unreachable'`,
 *     `mode:'SIMULADO'`, lista vacía + bloque `taxonomy`): NUNCA inventa filas.
 *
 * Ruta de sólo lectura: cero escrituras, cero migraciones, cero DDL.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { resolveTaxonomyMatch, type TaxonomyMatch } from '@/lib/search/taxonomy-index';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Techo de la sonda de base de datos (INV-17: ≤ 8.000 ms). */
const DB_TIMEOUT_MS = 8000;

/** Máximo de filas devueltas por consulta (payload acotado). */
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

/** Longitud mínima de consulta para interrogar la BD (evita ruido de red). */
const MIN_QUERY_CHARS = 2;

/** Estados de artista considerados publicables (INV-09: nada apagado en venta). */
const PUBLISHABLE_ARTIST_STATUSES: string[] = ['PUBLISHED', 'ACTIVE', 'VERIFIED'];

/** Estados de proveedor publicables. */
const PUBLISHABLE_VENDOR_STATUSES: string[] = ['ACTIVE'];

/** Forma de salida, idéntica para las dos fuentes (contrato estable de UI). */
interface ProviderSearchHit {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly province: string | null;
  readonly kind: 'vendor' | 'artist';
  /** Ruta real a la ficha (existe en disco: `/proveedores/[slug]`, `/artistas/[slug]`). */
  readonly href: string;
  /** Slug o hash estable para la URL. */
  readonly slug: string;
}

/** Bloque de taxonomía: siempre presente para que la UI tenga destino de cierre. */
interface TaxonomyBlock {
  readonly matched: boolean;
  readonly label: string;
  readonly familyLabel: string;
  readonly href: string;
  readonly facetId: string | null;
}

/** Convierte texto libre en un slug seguro para ruta. */
function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}


function readQueryParam(url: URL, ...names: readonly string[]): string {
  for (const name of names) {
    const value = url.searchParams.get(name);
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return '';
}

function readLimit(url: URL): number {
  const raw = Number.parseInt(url.searchParams.get('limit') ?? '', 10);
  if (!Number.isFinite(raw) || raw < 1) return DEFAULT_LIMIT;
  return Math.min(raw, MAX_LIMIT);
}

/** Carrera contra un techo de tiempo: impide una sonda colgada (INV-17). */
async function withTimeout<T>(task: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`DB_TIMEOUT_${timeoutMs}ms`)), timeoutMs);
  });
  try {
    return await Promise.race([task, timeout]);
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/**
 * Sonda PostgreSQL vía Prisma: dos consultas paralelas sobre los modelos que
 * existen en el esquema (`vendorProfile`, `artistProfile`). Devuelve SÓLO lo
 * publicado y con `select` quirúrgico (INV-20).
 */
async function probeDatabase(query: string, limit: number): Promise<ProviderSearchHit[]> {
  const [vendors, artists] = await Promise.all([
    prisma.vendorProfile.findMany({
      where: {
        status: { in: PUBLISHABLE_VENDOR_STATUSES },
        OR: [
          { stageName: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, stageName: true },
      take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.artistProfile.findMany({
      where: {
        status: { in: PUBLISHABLE_ARTIST_STATUSES },
        OR: [
          { stageName: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
          { genres: { has: query } },
        ],
      },
      select: { id: true, slug: true, stageName: true, displayName: true, genres: true },
      take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const vendorHits: ProviderSearchHit[] = vendors.map((vendor) => {
    const name = (vendor.stageName ?? 'Proveedor EAR OS').trim();
    const slug = toSlug(name) || vendor.id;
    return {
      id: vendor.id,
      name,
      category: 'Proveedor',
      province: null,
      kind: 'vendor' as const,
      slug,
      href: `/proveedores/${slug}`,
    };
  });

  const artistHits: ProviderSearchHit[] = artists.map((artist) => {
    const name = (artist.stageName ?? artist.displayName ?? 'Artista EAR OS').trim();
    const slug = artist.slug ?? toSlug(name) ?? artist.id;
    return {
      id: artist.id,
      name,
      category: artist.genres.length > 0 ? artist.genres.join(' · ') : 'Música',
      province: null,
      kind: 'artist' as const,
      slug: slug || artist.id,
      href: `/artistas/${slug || artist.id}`,
    };
  });

  return [...vendorHits, ...artistHits].slice(0, limit);
}

/** Resuelve el bloque de taxonomía de la consulta (destino de cierre garantizado). */
function buildTaxonomyBlock(query: string): TaxonomyBlock {
  const match: TaxonomyMatch = resolveTaxonomyMatch(query);
  return {
    matched: match.facet !== null,
    label: match.label,
    familyLabel: match.family?.label ?? '',
    href: match.href,
    facetId: match.facet?.id ?? null,
  };
}


export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const query = readQueryParam(url, 'q', 'query', 'search');
  const limit = readLimit(url);
  const checkedAt = new Date().toISOString();
  const taxonomy = buildTaxonomyBlock(query);

  // Consulta demasiado corta: no se toca la BD (ni se inventan resultados).
  if (query.length < MIN_QUERY_CHARS) {
    return NextResponse.json({
      success: true,
      probed: false,
      source: 'live',
      mode: 'REAL',
      checkedAt,
      query,
      total: 0,
      providers: [],
      taxonomy,
      reason: 'QUERY_TOO_SHORT',
    });
  }

  try {
    const providers = await withTimeout(probeDatabase(query, limit), DB_TIMEOUT_MS);

    return NextResponse.json({
      success: true,
      probed: true,
      source: 'live',
      mode: 'REAL',
      checkedAt,
      query,
      total: providers.length,
      providers,
      taxonomy,
    });
  } catch (error: unknown) {
    // AF-1 / AF-5: la BD no respondió. Se declara el fallo; no se finge verde.
    const message = error instanceof Error ? error.message : 'DB_UNREACHABLE';
    console.warn('[SEARCH_PROVIDERS_DEGRADED]', message);

    return NextResponse.json({
      success: true,
      probed: true,
      source: 'unreachable',
      mode: 'SIMULADO',
      checkedAt,
      query,
      total: 0,
      providers: [],
      taxonomy,
      disclaimer:
        'Base de datos no alcanzable en este instante: no se devuelven proveedores (cero filas inventadas). La taxonomía sí está disponible.',
    });
  }
}
