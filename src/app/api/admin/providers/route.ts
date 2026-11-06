import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { ClaimStatus, VendorCategory } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VENDOR_CATEGORIES = [
  'FINCA_ALQUILER',
  'CATERING',
  'DJ_DISCOMOVIL',
  'BARRA_LIBRE',
  'FOTOGRAFIA_VIDEO',
  'FLORISTERIA',
  'TRANSPORTE_AUTOBUS',
  'DECORACION_ILUMINACION',
] as const satisfies readonly VendorCategory[];

const CLAIM_STATUSES = [
  'GHOST_UNCLAIMED',
  'CLAIMED_PENDING_VERIFICATION',
  'VERIFIED_ACTIVE',
] as const satisfies readonly ClaimStatus[];

const SECURITY_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
});

function jsonResponse(
  body: unknown,
  init?: { status?: number; headers?: Record<string, string> }
): NextResponse {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: { ...SECURITY_HEADERS, ...(init?.headers ?? {}) },
  });
}

const SearchSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, ''));

const StatusSchema = z.string().trim().min(1).max(64);

const GetQuerySchema = z.object({
  category: z.string().optional(),
  claimStatus: z.string().optional(),
  status: StatusSchema.optional(),
  search: SearchSchema.optional(),
});

interface DiskProviderItem {
  id: string;
  name: string;
  companyName?: string;
  slug: string;
  category: string;
  city?: string;
  province?: string;
  phone?: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  claimStatus: string;
  status: string;
}

/** Fallback resiliente a disco si la base de datos PostgreSQL no responde */
function loadDiskProviders(): DiskProviderItem[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'providers', 'providers_canonical.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.map((p) => ({
          id: String(p.id || p.slug),
          name: p.name || 'Proveedor',
          companyName: p.name || 'Proveedor',
          slug: p.slug || 'proveedor',
          category: p.category || 'FINCA_ALQUILER',
          city: p.municipality || p.city || '',
          province: p.province || 'Madrid',
          phone: p.telephone || p.phone || '',
          rating: typeof p.rating === 'number' ? p.rating : 5.0,
          reviewsCount: p.reviewsCount || 0,
          description: p.description || '',
          claimStatus: 'VERIFIED_ACTIVE',
          status: 'VERIFICADO',
        }));
      }
    }
  } catch (err) {
    console.error('[providers/route] Fallback error loading disk providers:', err);
  }
  return [];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const rawCategory = searchParams.get('category');
    const rawClaimStatus = searchParams.get('claimStatus');
    const rawStatus = searchParams.get('status');
    const rawSearch = searchParams.get('search');

    const parsed = GetQuerySchema.safeParse({
      category: rawCategory ?? undefined,
      claimStatus: rawClaimStatus ?? undefined,
      status: rawStatus ?? undefined,
      search: rawSearch ?? undefined,
    });

    if (!parsed.success) {
      return jsonResponse({ ok: false, error: 'Parámetros no válidos' }, { status: 400 });
    }

    const { category, claimStatus, status, search } = parsed.data;

    // Intento 1: Prisma PostgreSQL
    try {
      const where: Prisma.providerProfileWhereInput = {};

      if (category && (VENDOR_CATEGORIES as readonly string[]).includes(category)) {
        where.category = category as VendorCategory;
      }
      if (claimStatus && (CLAIM_STATUSES as readonly string[]).includes(claimStatus)) {
        where.claimStatus = claimStatus as ClaimStatus;
      }
      if (status) where.status = status;

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { province: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.providerProfile.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          take: 500,
          include: {
            quota: true,
            calibration: true,
            packages: true,
          },
        }),
        prisma.providerProfile.count({ where }),
      ]);

      return jsonResponse({ ok: true, data, total, source: 'database' });
    } catch (dbErr) {
      console.warn('[providers/route] Base de datos en reposo, activando MODO RESILIENTE DE DISCO');

      // Intento 2: Fallback resiliente a disco
      let diskProviders = loadDiskProviders();

      if (search) {
        const q = search.toLowerCase();
        diskProviders = diskProviders.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            (p.city && p.city.toLowerCase().includes(q)) ||
            (p.province && p.province.toLowerCase().includes(q))
        );
      }

      if (category) {
        const cat = category.toLowerCase();
        diskProviders = diskProviders.filter((p) => p.category.toLowerCase().includes(cat));
      }

      return jsonResponse({
        ok: true,
        data: diskProviders,
        total: diskProviders.length,
        source: 'disk_resilient',
        warning: 'Datos cargados desde el catálogo de disco (PostgreSQL local desconectado).',
      });
    }
  } catch (error) {
    console.error('[admin/providers] GET error fatal:', error);
    return jsonResponse({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
