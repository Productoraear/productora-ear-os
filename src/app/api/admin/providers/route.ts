import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { ClaimStatus, VendorCategory } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* -------------------------------------------------------------------------- */
/*  SSOT-aligned enums (mirror of Prisma enums, kept local for validation)    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Security headers                                                          */
/* -------------------------------------------------------------------------- */

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
    init?: { status?: number; headers?: Record<string, string> },
): NextResponse {
    return NextResponse.json(body, {
        status: init?.status ?? 200,
        headers: { ...SECURITY_HEADERS, ...(init?.headers ?? {}) },
    });
}

/* -------------------------------------------------------------------------- */
/*  Zod schemas                                                               */
/* -------------------------------------------------------------------------- */

const SearchSchema = z
    .string()
    .trim()
    .min(1)
    .max(120)
    .transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, ''));

const StatusSchema = z.string().trim().min(1).max(64);

const GetQuerySchema = z.object({
    category: z.enum(VENDOR_CATEGORIES).optional(),
    claimStatus: z.enum(CLAIM_STATUSES).optional(),
    status: StatusSchema.optional(),
    search: SearchSchema.optional(),
});

const PatchBodySchema = z
    .object({
        id: z.string().trim().min(1).max(64),
        status: StatusSchema.optional(),
        rating: z
            .union([z.number(), z.string()])
            .transform((v) => (typeof v === 'string' ? Number(v) : v))
            .refine((v) => Number.isFinite(v), { message: 'rating no valido' })
            .refine((v) => v >= 0 && v <= 5, {
                message: 'rating debe estar entre 0 y 5',
            })
            .optional(),
    })
    .strict()
    .refine((v) => v.status !== undefined || v.rating !== undefined, {
        message: 'no hay campos validos para actualizar',
    });

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function parseEnumParam<T extends string>(
    raw: string | null,
    allowed: readonly T[],
): { ok: true; value: T | undefined } | { ok: false } {
    if (raw === null) return { ok: true, value: undefined };
    const normalized = raw.trim().toUpperCase();
    if (normalized.length === 0) return { ok: true, value: undefined };
    if ((allowed as readonly string[]).includes(normalized)) {
        return { ok: true, value: normalized as T };
    }
    return { ok: false };
}

/* -------------------------------------------------------------------------- */
/*  GET /api/admin/providers                                                  */
/* -------------------------------------------------------------------------- */

export async function GET(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const { searchParams } = new URL(request.url);

        const categoryResult = parseEnumParam(
            searchParams.get('category'),
            VENDOR_CATEGORIES,
        );
        if (!categoryResult.ok) {
            return jsonResponse(
                { ok: false, error: 'category no valida' },
                { status: 400 },
            );
        }

        const claimStatusResult = parseEnumParam(
            searchParams.get('claimStatus'),
            CLAIM_STATUSES,
        );
        if (!claimStatusResult.ok) {
            return jsonResponse(
                { ok: false, error: 'claimStatus no valido' },
                { status: 400 },
            );
        }

        const rawStatus = searchParams.get('status');
        const rawSearch = searchParams.get('search');

        const parsed = GetQuerySchema.safeParse({
            category: categoryResult.value,
            claimStatus: claimStatusResult.value,
            status: rawStatus ?? undefined,
            search: rawSearch ?? undefined,
        });

        if (!parsed.success) {
            return jsonResponse(
                { ok: false, error: 'Parametros de consulta no validos' },
                { status: 400 },
            );
        }

        const { category, claimStatus, status, search } = parsed.data;

        const where: Prisma.providerProfileWhereInput = {};

        if (category) where.category = category;
        if (claimStatus) where.claimStatus = claimStatus;
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

        return jsonResponse({ ok: true, data, total });
    } catch (error) {
        console.error('[admin/providers] GET error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}

/* -------------------------------------------------------------------------- */
/*  PATCH /api/admin/providers                                                */
/* -------------------------------------------------------------------------- */

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        let rawBody: unknown;
        try {
            rawBody = await request.json();
        } catch {
            return jsonResponse(
                { ok: false, error: 'JSON invalido' },
                { status: 400 },
            );
        }

        const parsed = PatchBodySchema.safeParse(rawBody);
        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            return jsonResponse(
                {
                    ok: false,
                    error: firstIssue?.message ?? 'Payload no valido',
                },
                { status: 400 },
            );
        }

        const { id, status, rating } = parsed.data;

        // Solo se permite actualizar status y rating. Jamás isVerified/verified.
        const data: Prisma.providerProfileUpdateInput = {};
        if (status !== undefined) data.status = status;
        if (rating !== undefined) data.rating = rating;

        const updated = await prisma.providerProfile.update({
            where: { id },
            data,
            include: {
                quota: true,
                calibration: true,
                packages: true,
            },
        });

        return jsonResponse({ ok: true, data: updated });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return jsonResponse(
                { ok: false, error: 'Proveedor no encontrado' },
                { status: 404 },
            );
        }
        console.error('[admin/providers] PATCH error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}