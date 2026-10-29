import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* -------------------------------------------------------------------------- */
/*                              SECURITY HEADERS                              */
/* -------------------------------------------------------------------------- */

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
    init?: { status?: number; headers?: Record<string, string> },
): NextResponse {
    return NextResponse.json(body, {
        status: init?.status ?? 200,
        headers: { ...SECURITY_HEADERS, ...(init?.headers ?? {}) },
    });
}

/* -------------------------------------------------------------------------- */
/*                              ZOD VALIDATION                                */
/* -------------------------------------------------------------------------- */

const MAX_QUERY_LEN = 80;
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

const ListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).max(10_000).catch(1),
    size: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).catch(DEFAULT_PAGE_SIZE),
    q: z
        .string()
        .trim()
        .max(MAX_QUERY_LEN)
        .optional()
        .transform((v) => (v && v.length > 0 ? v : undefined)),
});

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PatchBodySchema = z
    .object({
        id: z.string().trim().min(1, 'id requerido').max(64),
        status: z
            .string()
            .trim()
            .min(1)
            .max(40)
            .optional(),
        displayName: z
            .string()
            .trim()
            .min(1)
            .max(120)
            .optional(),
        slug: z
            .string()
            .trim()
            .min(1)
            .max(120)
            .regex(SLUG_REGEX, 'slug inválido')
            .optional(),
    })
    .strict();

type PatchBody = z.infer<typeof PatchBodySchema>;

const ARTIST_STATUSES = ['DRAFT', 'PUBLISHED', 'PAUSED'] as const;

const CreateBodySchema = z
    .object({
        email: z.string().trim().email().max(180),
        name: z.string().trim().min(1).max(120).optional(),
        stageName: z.string().trim().min(2).max(120),
        displayName: z.string().trim().min(1).max(120).optional(),
        slug: z
            .string()
            .trim()
            .min(1)
            .max(120)
            .regex(SLUG_REGEX, 'slug inválido')
            .optional(),
        genres: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
        status: z.enum(ARTIST_STATUSES).default('PUBLISHED'),
    })
    .strict();

type CreateBody = z.infer<typeof CreateBodySchema>;

/** Normaliza a slug URL-safe: sin acentos, minúsculas y guiones simples. */
function slugify(value: string): string {
    return (
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 120) || 'artista'
    );
}

/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */

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
            return jsonResponse(
                { ok: false, error: 'Parámetros inválidos' },
                { status: 400 },
            );
        }

        const { page, size, q } = parsed.data;

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

        return jsonResponse({ ok: true, data, total, page, size });
    } catch (err) {
        console.error('[admin/artists][GET]', err);
        return jsonResponse(
            { ok: false, error: 'Internal error' },
            { status: 500 },
        );
    }
}

/* -------------------------------------------------------------------------- */
/*                                  PATCH                                     */
/* -------------------------------------------------------------------------- */

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    try {
        const raw = await req.json().catch(() => null);
        if (raw === null || typeof raw !== 'object') {
            return jsonResponse(
                { ok: false, error: 'Body JSON inválido' },
                { status: 400 },
            );
        }

        const parsed = PatchBodySchema.safeParse(raw);
        if (!parsed.success) {
            return jsonResponse(
                {
                    ok: false,
                    error: 'Payload inválido',
                    issues: parsed.error.issues.map((i) => ({
                        path: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 },
            );
        }

        const body: PatchBody = parsed.data;

        const data: { status?: string; displayName?: string; slug?: string } = {};
        if (body.status !== undefined) data.status = body.status;
        if (body.displayName !== undefined) data.displayName = body.displayName;
        if (body.slug !== undefined) data.slug = body.slug;

        if (Object.keys(data).length === 0) {
            return jsonResponse(
                { ok: false, error: 'Nada que actualizar' },
                { status: 400 },
            );
        }

        const updated = await prisma.artistProfile.update({
            where: { id: body.id },
            data,
        });

        return jsonResponse({ ok: true, data: updated });
    } catch (err) {
        if (
            typeof err === 'object' &&
            err !== null &&
            'code' in err &&
            (err as { code?: string }).code === 'P2025'
        ) {
            return jsonResponse(
                { ok: false, error: 'Artista no encontrado' },
                { status: 404 },
            );
        }
        console.error('[admin/artists][PATCH]', err);
        return jsonResponse(
            { ok: false, error: 'Internal error' },
            { status: 500 },
        );
    }
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    const raw: unknown = await req.json().catch(() => null);
    const parsed = CreateBodySchema.safeParse(raw);
    if (!parsed.success) {
        return jsonResponse(
            {
                ok: false,
                error: 'Payload inválido',
                issues: parsed.error.issues.map((i) => ({
                    path: i.path.join('.'),
                    message: i.message,
                })),
            },
            { status: 400 },
        );
    }

    const body: CreateBody = parsed.data;
    const baseSlug = body.slug ?? slugify(body.stageName);

    try {
        // ACID: User + artistProfile se crean o se revierten juntos.
        const created = await prisma.$transaction(async (tx) => {
            const user = await tx.user.upsert({
                where: { email: body.email },
                update: { name: body.name ?? undefined },
                create: {
                    email: body.email,
                    name: body.name ?? body.stageName,
                    role: 'ARTIST',
                },
            });

            const existing = await tx.artistProfile.findUnique({
                where: { userId: user.id },
                select: { id: true },
            });
            if (existing) throw new Error('ARTIST_PROFILE_EXISTS');

            return tx.artistProfile.create({
                data: {
                    userId: user.id,
                    stageName: body.stageName,
                    displayName: body.displayName ?? body.stageName,
                    slug: baseSlug,
                    genres: body.genres,
                    status: body.status,
                },
                include: { user: { select: { email: true, name: true } } },
            });
        });

        return jsonResponse({ ok: true, data: created }, { status: 201 });
    } catch (err) {
        if (err instanceof Error && err.message === 'ARTIST_PROFILE_EXISTS') {
            return jsonResponse(
                { ok: false, error: 'El artista ya tiene perfil' },
                { status: 409 },
            );
        }
        if (
            typeof err === 'object' &&
            err !== null &&
            'code' in err &&
            (err as { code?: string }).code === 'P2002'
        ) {
            return jsonResponse(
                { ok: false, error: 'slug o email duplicado' },
                { status: 409 },
            );
        }
        console.error('[admin/artists][POST]', err);
        return jsonResponse(
            { ok: false, error: 'Internal error' },
            { status: 500 },
        );
    }
}