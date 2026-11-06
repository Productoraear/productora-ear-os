import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'X-Robots-Tag': 'noindex, nofollow',
};

function jsonResponse<T>(
  body: T,
  init?: { status?: number; headers?: Record<string, string> }
): NextResponse {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: { ...SECURITY_HEADERS, ...(init?.headers ?? {}) },
  });
}

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  size: z.coerce.number().int().min(1).max(100).catch(20),
  q: z.string().trim().max(80).optional(),
});

interface DiskArtistItem {
  id: string;
  name: string;
  slug: string;
  stageName?: string;
  displayName?: string;
  category?: string;
  phone?: string;
  price?: string;
  description?: string;
  genres?: string[];
  status?: string;
}

/** Carga de respaldo en disco cuando PostgreSQL local no responde */
function loadDiskArtists(): DiskArtistItem[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'artists', 'artists_canonical.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.map((a) => ({
          id: String(a.id || a.slug),
          name: a.name || 'Artista',
          stageName: a.name || 'Artista',
          displayName: a.name || 'Artista',
          slug: a.slug || 'artista',
          category: a.category || 'musica',
          phone: a.phone || '',
          price: a.price || '350 €',
          description: a.description || '',
          genres: a.gremioTag ? [a.gremioTag] : ['solista'],
          status: 'PUBLISHED',
        }));
      }
    }
  } catch (err) {
    console.error('[artists/route] Fallback error loading disk artists:', err);
  }
  return [];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const sp = req.nextUrl.searchParams;
    const parsed = ListQuerySchema.safeParse({
      page: sp.get('page') ?? undefined,
      size: sp.get('size') ?? undefined,
      q: sp.get('q') ?? undefined,
    });

    if (!parsed.success) {
      return jsonResponse({ ok: false, error: 'Parámetros inválidos' }, { status: 400 });
    }

    const { page, size, q } = parsed.data;

    // Intento 1: Prisma PostgreSQL
    try {
      const where = q
        ? {
            OR: [
              { stageName: { contains: q, mode: 'insensitive' as const } },
              { displayName: { contains: q, mode: 'insensitive' as const } },
              { slug: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [data, total] = await Promise.all([
        prisma.artistProfile.findMany({
          where,
          include: { user: { select: { email: true, name: true } } },
          orderBy: { updatedAt: 'desc' },
          skip: (page - 1) * size,
          take: size,
        }),
        prisma.artistProfile.count({ where }),
      ]);

      return jsonResponse({
        ok: true,
        data,
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
        source: 'database',
      });
    } catch (dbErr) {
      console.warn('[artists/route] Base de datos no disponible, activando MODO RESILIENTE DE DISCO');

      // Intento 2: Carga resiliente desde disco sin lanzar 500
      let diskArtists = loadDiskArtists();

      if (q) {
        const query = q.toLowerCase();
        diskArtists = diskArtists.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.slug.toLowerCase().includes(query) ||
            (a.category && a.category.toLowerCase().includes(query))
        );
      }

      const total = diskArtists.length;
      const start = (page - 1) * size;
      const paginated = diskArtists.slice(start, start + size);

      return jsonResponse({
        ok: true,
        data: paginated,
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
        source: 'disk_resilient',
        warning: 'Datos servidos desde manifiesto en disco (PostgreSQL en reposo).',
      });
    }
  } catch (error) {
    console.error('[artists/route] GET error fatal:', error);
    return jsonResponse(
      { ok: false, error: 'Error al procesar la solicitud de artistas' },
      { status: 500 }
    );
  }
}
