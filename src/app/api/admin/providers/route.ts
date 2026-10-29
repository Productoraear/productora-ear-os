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

const CreateBodySchema = z
    .object({
        name: z.string().trim().min(2).max(160),
        companyName: z.string().trim().max(160).optional(),
        category: z.enum(VENDOR_CATEGORIES),
        city: z.string().trim().max(120).optional(),
        province: z.string().trim().min(2).max(120).default('Madrid / Toledo'),
        phone: z.string().trim().max(24).optional(),
        email: z.string().trim().email().max(180).optional(),
        description: z.string().trim().max(4000).optional(),
        claimStatus: z.enum(CLAIM_STATUSES).default('GHOST_UNCLAIMED'),
        status: StatusSchema.default('DRAFT'),
    })
    .strict();

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
/*  Doctrina del dato verificado (Zona Cero: cero verified de fachada)        */
/* -------------------------------------------------------------------------- */

/** Centralita del CEO: NUNCA es un teléfono de proveedor verificable. */
const CENTRALITA = '+34693693048';
const CENTRALITA_DIGITS = CENTRALITA.replace(/\D/g, '');

function normalizePhone(raw?: string): string | undefined {
    if (!raw) return undefined;
    const cleaned = raw.replace(/[^0-9+]/g, '');
    return cleaned.length >= 9 ? cleaned : undefined;
}

/**
 * Compara por dígitos para no dejar pasar la centralita escrita en formato
 * nacional (693693048) o internacional (0034693693048).
 */
function isCentralita(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) return false;
    return (
        digits.endsWith(CENTRALITA_DIGITS) ||
        CENTRALITA_DIGITS.endsWith(digits)
    );
}

function slugify(raw: string): string {
    return raw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
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

/* -------------------------------------------------------------------------- */
/*  POST /api/admin/providers                                                 */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    let rawBody: unknown;
    try {
        rawBody = await request.json();
    } catch {
        return jsonResponse(
            { ok: false, error: 'JSON invalido' },
            { status: 400 },
        );
    }

    const parsed = CreateBodySchema.safeParse(rawBody);
    if (!parsed.success) {
        return jsonResponse(
            {
                ok: false,
                error: 'Payload inválido',
                issues: parsed.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            },
            { status: 400 },
        );
    }

    const body = parsed.data;
    const phone = normalizePhone(body.phone);
    const realPhone = phone !== undefined && !isCentralita(phone);
    const slug = slugify(body.name);

    if (!slug) {
        return jsonResponse(
            { ok: false, error: 'Nombre no genera slug válido' },
            { status: 400 },
        );
    }

    // Doctrina del dato verificado: sin teléfono real no hay VERIFIED_ACTIVE
    // ni isVerified. La centralita y el vacío degradan a pendiente de verificar.
    const claimStatus: ClaimStatus =
        body.claimStatus === 'VERIFIED_ACTIVE' && !realPhone
            ? 'CLAIMED_PENDING_VERIFICATION'
            : body.claimStatus;
    const isVerified = realPhone && claimStatus === 'VERIFIED_ACTIVE';
    const effectiveStatus =
        !isVerified && body.status === 'ACTIVE_VERIFIED'
            ? 'DRAFT'
            : body.status;

    try {
        const created = await prisma.providerProfile.create({
            data: {
                name: body.name,
                slug,
                companyName: body.companyName ?? '',
                category: body.category,
                city: body.city,
                province: body.province,
                phone,
                email: body.email,
                description: body.description,
                claimStatus,
                status: effectiveStatus,
                isVerified,
            },
        });

        return jsonResponse({ ok: true, data: created }, { status: 201 });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return jsonResponse(
                { ok: false, error: 'Nombre o slug ya registrado' },
                { status: 409 },
            );
        }
        console.error('[admin/providers][POST]', error);
        return jsonResponse(
            { ok: false, error: 'Internal error' },
            { status: 500 },
        );
    }
}