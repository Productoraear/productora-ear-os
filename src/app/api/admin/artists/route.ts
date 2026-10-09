import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ArtistPatchBody = {
    id: string;
    status?: string;
    displayName?: string;
    slug?: string;
};

function sanitizeText(value: unknown, max: number): string {
    return String(value ?? '').trim().slice(0, max);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    try {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(1, Number.parseInt(sp.get('page') ?? '1', 10) || 1);
        const size = Math.min(100, Math.max(1, Number.parseInt(sp.get('size') ?? '20', 10) || 20));
        const q = sanitizeText(sp.get('q'), 80);

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

        return NextResponse.json({ ok: true, data, total });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    try {
        const body = (await req.json().catch(() => null)) as ArtistPatchBody | null;

        if (!body || typeof body.id !== 'string' || body.id.trim().length === 0) {
            return NextResponse.json({ ok: false, error: 'id requerido' }, { status: 400 });
        }

        const data: { status?: string; displayName?: string; slug?: string } = {};
        if (typeof body.status === 'string' && body.status.trim().length > 0) {
            data.status = body.status.trim().slice(0, 40);
        }
        if (typeof body.displayName === 'string' && body.displayName.trim().length > 0) {
            data.displayName = body.displayName.trim().slice(0, 120);
        }
        if (typeof body.slug === 'string' && body.slug.trim().length > 0) {
            data.slug = body.slug.trim().slice(0, 120);
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ ok: false, error: 'Nada que actualizar' }, { status: 400 });
        }

        const updated = await prisma.artistProfile.update({
            where: { id: body.id.trim() },
            data,
        });

        return NextResponse.json({ ok: true, data: updated });
    } catch (err) {
        if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2025') {
            return NextResponse.json({ ok: false, error: 'Artista no encontrado' }, { status: 404 });
        }
        const message = err instanceof Error ? err.message : 'Internal error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}