import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const THERAPIST_STATUSES = ['ACTIVE', 'SUSPENDED', 'INACTIVE'] as const;
type TherapistStatus = (typeof THERAPIST_STATUSES)[number];

const SECURITY_HEADERS: Record<string, string> = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
};

const MAX_QUERY_LENGTH = 120;
const MAX_PAGE_SIZE = 500;

const statusSchema = z.enum(THERAPIST_STATUSES);

const querySchema = z.object({
    specialty: z
        .string()
        .trim()
        .min(1)
        .max(MAX_QUERY_LENGTH)
        .optional(),
    status: statusSchema.optional(),
});

const patchBodySchema = z
    .object({
        id: z.string().trim().min(1).max(128),
        status: statusSchema.optional(),
        specialty: z
            .string()
            .trim()
            .min(1)
            .max(MAX_QUERY_LENGTH)
            .optional(),
        isActive: z.boolean().optional(),
    })
    .strict();

type ApiError = { ok: false; error: string };
type ApiSuccess<T> = { ok: true; data: T; total?: number };

function jsonResponse<T>(
    payload: ApiSuccess<T> | ApiError,
    status = 200,
): NextResponse {
    return NextResponse.json(payload, {
        status,
        headers: SECURITY_HEADERS,
    });
}

function sanitizeQuery(raw: string | null): string | undefined {
    if (typeof raw !== 'string') return undefined;
    const trimmed = raw.trim().slice(0, MAX_QUERY_LENGTH);
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const { searchParams } = new URL(request.url);

        const parsed = querySchema.safeParse({
            specialty: sanitizeQuery(searchParams.get('specialty')),
            status: sanitizeQuery(searchParams.get('status')),
        });

        if (!parsed.success) {
            return jsonResponse(
                { ok: false, error: 'Parámetros de consulta no válidos' },
                400,
            );
        }

        const where: Prisma.TherapistProfileWhereInput = {};
        if (parsed.data.specialty) where.specialty = parsed.data.specialty;
        if (parsed.data.status) where.status = parsed.data.status;

        const [data, total] = await Promise.all([
            prisma.therapistProfile.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                take: MAX_PAGE_SIZE,
                include: {
                    user: {
                        select: { email: true, name: true },
                    },
                },
            }),
            prisma.therapistProfile.count({ where }),
        ]);

        return jsonResponse({ ok: true, data, total });
    } catch (error) {
        console.error('[admin/therapists] GET error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno del servidor' },
            500,
        );
    }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        let rawBody: unknown;
        try {
            rawBody = await request.json();
        } catch {
            return jsonResponse(
                { ok: false, error: 'Cuerpo de solicitud no válido' },
                400,
            );
        }

        const parsed = patchBodySchema.safeParse(rawBody);
        if (!parsed.success) {
            return jsonResponse(
                { ok: false, error: 'Datos de entrada no válidos' },
                400,
            );
        }

        const { id, status, specialty, isActive } = parsed.data;

        const data: Prisma.TherapistProfileUpdateInput = {};
        if (status !== undefined) data.status = status as TherapistStatus;
        if (specialty !== undefined) data.specialty = specialty;
        if (isActive !== undefined) data.isActive = isActive;

        if (Object.keys(data).length === 0) {
            return jsonResponse(
                { ok: false, error: 'No hay campos válidos para actualizar' },
                400,
            );
        }

        const updated = await prisma.therapistProfile.update({
            where: { id },
            data,
            include: {
                user: {
                    select: { email: true, name: true },
                },
            },
        });

        return jsonResponse({ ok: true, data: updated });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return jsonResponse(
                { ok: false, error: 'Terapeuta no encontrado' },
                404,
            );
        }
        console.error('[admin/therapists] PATCH error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno del servidor' },
            500,
        );
    }
}