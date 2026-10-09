import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { ClaimStatus, VendorCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VENDOR_CATEGORIES: VendorCategory[] = [
    'FINCA_ALQUILER',
    'CATERING',
    'DJ_DISCOMOVIL',
    'BARRA_LIBRE',
    'FOTOGRAFIA_VIDEO',
    'FLORISTERIA',
    'TRANSPORTE_AUTOBUS',
    'DECORACION_ILUMINACION',
];

const CLAIM_STATUSES: ClaimStatus[] = [
    'GHOST_UNCLAIMED',
    'CLAIMED_PENDING_VERIFICATION',
    'VERIFIED_ACTIVE',
];

function sanitizeSearch(raw: unknown): string | undefined {
    if (typeof raw !== 'string') return undefined;
    const trimmed = raw.trim().slice(0, 120);
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const { searchParams } = new URL(request.url);
        const rawCategory = searchParams.get('category');
        const rawStatus = searchParams.get('status');
        const rawClaimStatus = searchParams.get('claimStatus');
        const rawSearch = searchParams.get('search');

        const where: Prisma.providerProfileWhereInput = {};

        if (rawCategory) {
            const category = rawCategory.toUpperCase() as VendorCategory;
            if (!VENDOR_CATEGORIES.includes(category)) {
                return NextResponse.json(
                    { ok: false, error: 'category no valida' },
                    { status: 400 },
                );
            }
            where.category = category;
        }

        if (rawStatus) {
            const status = rawStatus.trim().slice(0, 64);
            if (status) where.status = status;
        }

        if (rawClaimStatus) {
            const claimStatus = rawClaimStatus.toUpperCase() as ClaimStatus;
            if (!CLAIM_STATUSES.includes(claimStatus)) {
                return NextResponse.json(
                    { ok: false, error: 'claimStatus no valido' },
                    { status: 400 },
                );
            }
            where.claimStatus = claimStatus;
        }

        const search = sanitizeSearch(rawSearch);
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

        return NextResponse.json({ ok: true, data, total });
    } catch (error) {
        console.error('[admin/providers] GET error', error);
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
            rating?: unknown;
        };

        const id = typeof body.id === 'string' ? body.id.trim() : '';
        if (!id) {
            return NextResponse.json(
                { ok: false, error: 'id requerido' },
                { status: 400 },
            );
        }

        // Solo se permite actualizar status y rating. Jamás isVerified/verified.
        const data: Prisma.providerProfileUpdateInput = {};

        if (body.status !== undefined) {
            if (typeof body.status !== 'string') {
                return NextResponse.json(
                    { ok: false, error: 'status no valido' },
                    { status: 400 },
                );
            }
            const status = body.status.trim().slice(0, 64);
            if (!status) {
                return NextResponse.json(
                    { ok: false, error: 'status no valido' },
                    { status: 400 },
                );
            }
            data.status = status;
        }

        if (body.rating !== undefined) {
            const rating = Number(body.rating);
            if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
                return NextResponse.json(
                    { ok: false, error: 'rating debe estar entre 0 y 5' },
                    { status: 400 },
                );
            }
            data.rating = rating;
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { ok: false, error: 'no hay campos validos para actualizar' },
                { status: 400 },
            );
        }

        const updated = await prisma.providerProfile.update({
            where: { id },
            data,
            include: {
                quota: true,
                calibration: true,
                packages: true,
            },
        });

        return NextResponse.json({ ok: true, data: updated });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return NextResponse.json(
                { ok: false, error: 'Proveedor no encontrado' },
                { status: 404 },
            );
        }
        console.error('[admin/providers] PATCH error', error);
        return NextResponse.json(
            { ok: false, error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}