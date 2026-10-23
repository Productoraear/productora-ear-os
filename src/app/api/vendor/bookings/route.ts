import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { SPLIT_SOBERANO } from '@/lib/constants/ear-os-ssot';
import { prisma } from '@/lib/prisma';
import { resolveCurrentVendor } from '@/lib/vendor/vendorSession';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─── Zod v4 strict ─────────────────────────────────────────────────────────────

const CreateBookingSchema = z
    .object({
        clientId: z.string().optional().nullable(),
        eventTitle: z.string().trim().min(2).max(160),
        eventDate: z.string().datetime({ offset: true }),
        location: z.string().trim().min(2).max(200),
        totalPriceEur: z.number().positive().max(1000000),
        depositPaidEur: z.number().min(0).optional(),
        isLockedAcid: z.boolean().optional(),
        contractHash: z.string().trim().max(128).optional().nullable(),
        status: z.string().trim().max(30).optional(),
    })
    .strict();

type CreateBooking = z.infer<typeof CreateBookingSchema>;

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

function internalError(scope: string, err: unknown): NextResponse {
    const message = err instanceof Error ? err.message : 'Error interno';
    console.error(`${scope} ERROR:`, message);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
}

// ─── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const vendor = await resolveCurrentVendor(req);
        if (!vendor) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado o sesión no autorizada.' },
                { status: 404 },
            );
        }

        // 🛡️ Aislamiento multi-tenant estricto + orden por fecha de evento.
        const bookings = await prisma.vendorBooking.findMany({
            where: { vendorId: vendor.id },
            orderBy: { eventDate: 'asc' },
        });

        return NextResponse.json({ success: true, bookings });
    } catch (err) {
        return internalError('[vendor/bookings:GET]', err);
    }
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const vendor = await resolveCurrentVendor(req);
        if (!vendor) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado o sesión no autorizada.' },
                { status: 404 },
            );
        }

        const raw: unknown = await req.json();
        const parsed = CreateBookingSchema.safeParse(raw);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Validación fallida.',
                    issues: parsed.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
                { status: 400 },
            );
        }

        const data: CreateBooking = parsed.data;

        // Split Soberano 80/10/10 calculado de forma determinista desde el SSOT.
        // Cero precios hardcodeados.
        const splitArtistEur = round2(data.totalPriceEur * SPLIT_SOBERANO.artista);
        const splitEarEur = round2(data.totalPriceEur * SPLIT_SOBERANO.earOs);
        const splitVimumeEur = round2(data.totalPriceEur * SPLIT_SOBERANO.vimume);

        const booking = await prisma.vendorBooking.create({
            data: {
                vendorId: vendor.id, // 🛡️ vendorId forzado al tenant actual.
                clientId: data.clientId ?? null,
                eventTitle: data.eventTitle,
                eventDate: new Date(data.eventDate),
                location: data.location,
                totalPriceEur: data.totalPriceEur,
                depositPaidEur: data.depositPaidEur ?? 0,
                splitArtistEur,
                splitEarEur,
                splitVimumeEur,
                isLockedAcid: data.isLockedAcid ?? true,
                contractHash: data.contractHash ?? null,
                status: data.status ?? 'CONFIRMED',
            },
        });

        return NextResponse.json(
            {
                success: true,
                booking,
                split: {
                    artistEur: splitArtistEur,
                    earOsEur: splitEarEur,
                    vimumeEur: splitVimumeEur,
                    splitArtistPct: SPLIT_SOBERANO.artista,
                    splitEarOsPct: SPLIT_SOBERANO.earOs,
                    splitVimumePct: SPLIT_SOBERANO.vimume,
                },
            },
            { status: 201 },
        );
    } catch (err) {
        return internalError('[vendor/bookings:POST]', err);
    }
}
