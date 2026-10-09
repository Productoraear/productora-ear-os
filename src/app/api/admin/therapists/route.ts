import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const THERAPIST_STATUSES = ['ACTIVE', 'SUSPENDED', 'INACTIVE'] as const;
type TherapistStatus = (typeof THERAPIST_STATUSES)[number];

function sanitizeQuery(raw: unknown): string | undefined {
    if (typeof raw !== 'string') return undefined;
    const trimmed = raw.trim().slice(0, 120);
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const { searchParams } = new URL(request.url);
        const rawSpecialty = searchParams.get('specialty');
        const rawStatus = searchParams.get('status');

        const where: Prisma.TherapistProfileWhereInput = {};

        const specialty = sanitizeQuery(rawSpecialty);
        if (specialty) where.specialty = specialty;

        const status = sanitizeQuery(rawStatus);
        if (status) {
            if (!(THERAPIST_STATUSES as readonly string[]).includes(status)) {
                return NextResponse.json(
                    { ok: false, error: 'status no valido' },
                    { status: 400 },
                );
            }
            where.status = status;
        }

        const [data, total] = await Promise.all([
            prisma.therapistProfile.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                take: 500,
                include: {
                    user: {
                        select: { email: true, name: true },
                    },
                },
            }),
            prisma.therapistProfile.count({ where }),
        ]);

        return NextResponse.json({ ok: true, data, total });
    } catch (error) {
        console.error('[admin/therapists] GET error', error);
        return NextResponse.json(
            { ok: false, error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const body = (await request.json()) as {
            id?: unknown;
            status?: unknown;
            specialty?: unknown;
            isActive?: unknown;
        };

        const id = typeof body.id === 'string' ? body.id.trim() : '';
        if (!id) {
            return NextResponse.json(
                { ok: false, error: 'id requerido' },
                { status: 400 },
            );
        }

        const data: Prisma.TherapistProfileUpdateInput = {};

        if (body.status !== undefined) {
            if (typeof body.status !== 'string') {
                return NextResponse.json(
                    { ok: false, error: 'status no valido' },
                    { status: 400 },
                );
            }
            const status = body.status.trim().toUpperCase() as TherapistStatus;
            if (!(THERAPIST_STATUSES as readonly string[]).includes(status)) {
                return NextResponse.json(
                    { ok: false, error: 'status no valido' },
                    { status: 400 },
                );
            }
            data.status = status;
        }

        if (body.specialty !== undefined) {
            if (typeof body.specialty !== 'string') {
                return NextResponse.json(
                    { ok: false, error: 'specialty no valido' },
                    { status: 400 },
                );
            }
            const specialty = body.specialty.trim().slice(0, 120);
            if (!specialty) {
                return NextResponse.json(
                    { ok: false, error: 'specialty no valido' },
                    { status: 400 },
                );
            }
            data.specialty = specialty;
        }

        if (body.isActive !== undefined) {
            if (typeof body.isActive !== 'boolean') {
                return NextResponse.json(
                    { ok: false, error: 'isActive no valido' },
                    { status: 400 },
                );
            }
            data.isActive = body.isActive;
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { ok: false, error: 'no hay campos validos para actualizar' },
                { status: 400 },
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

        return NextResponse.json({ ok: true, data: updated });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return NextResponse.json(
                { ok: false, error: 'Terapeuta no encontrado' },
                { status: 404 },
            );
        }
        console.error('[admin/therapists] PATCH error', error);
        return NextResponse.json(
            { ok: false, error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}