import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { resolveCurrentVendor } from '@/lib/vendor/vendorSession';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─── Zod v4 strict ─────────────────────────────────────────────────────────────

const CreateClientSchema = z
    .object({
        fullName: z.string().trim().min(2).max(120),
        phone: z.string().trim().min(6).max(30),
        email: z.string().email().optional().nullable(),
        eventDate: z.string().datetime({ offset: true }).optional().nullable(),
        eventType: z.string().trim().min(2).max(80),
        venue: z.string().trim().max(160).optional().nullable(),
        budgetEur: z.number().min(0).optional().nullable(),
        status: z.string().trim().max(30).optional(),
        notes: z.string().trim().max(2000).optional().nullable(),
    })
    .strict();

const UpdateClientSchema = z
    .object({
        fullName: z.string().trim().min(2).max(120).optional(),
        phone: z.string().trim().min(6).max(30).optional(),
        email: z.string().email().optional().nullable(),
        eventDate: z.string().datetime({ offset: true }).optional().nullable(),
        eventType: z.string().trim().min(2).max(80).optional(),
        venue: z.string().trim().max(160).optional().nullable(),
        budgetEur: z.number().min(0).optional().nullable(),
        status: z.string().trim().max(30).optional(),
        notes: z.string().trim().max(2000).optional().nullable(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debe enviar al menos un campo para actualizar.',
    });

type CreateClient = z.infer<typeof CreateClientSchema>;
type UpdateClient = z.infer<typeof UpdateClientSchema>;

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

        // 🛡️ Aislamiento multi-tenant estricto: WHERE vendorId = currentVendorId.
        const clients = await prisma.vendorCrmClient.findMany({
            where: { vendorId: vendor.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, clients });
    } catch (err) {
        return internalError('[vendor/crm/clients:GET]', err);
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
        const parsed = CreateClientSchema.safeParse(raw);

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

        const data: CreateClient = parsed.data;

        const client = await prisma.vendorCrmClient.create({
            data: {
                vendorId: vendor.id, // 🛡️ vendorId forzado al tenant actual.
                fullName: data.fullName,
                phone: data.phone,
                email: data.email ?? null,
                eventDate: data.eventDate ? new Date(data.eventDate) : null,
                eventType: data.eventType,
                venue: data.venue ?? null,
                budgetEur: data.budgetEur ?? null,
                status: data.status ?? 'LEAD',
                notes: data.notes ?? null,
            },
        });

        return NextResponse.json({ success: true, client }, { status: 201 });
    } catch (err) {
        return internalError('[vendor/crm/clients:POST]', err);
    }
}

// ─── PUT ───────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest): Promise<NextResponse> {
    try {
        const vendor = await resolveCurrentVendor(req);
        if (!vendor) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado o sesión no autorizada.' },
                { status: 404 },
            );
        }

        const clientId = new URL(req.url).searchParams.get('id')?.trim();
        if (!clientId) {
            return NextResponse.json(
                { error: 'Debe indicar el parámetro "id" del cliente a actualizar.' },
                { status: 400 },
            );
        }

        const raw: unknown = await req.json();
        const parsed = UpdateClientSchema.safeParse(raw);

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

        const data: UpdateClient = parsed.data;

        // 🛡️ updateMany con WHERE id + vendorId garantiza aislamiento multi-tenant.
        const result = await prisma.vendorCrmClient.updateMany({
            where: { id: clientId, vendorId: vendor.id },
            data: {
                ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
                ...(data.phone !== undefined ? { phone: data.phone } : {}),
                ...(data.email !== undefined ? { email: data.email } : {}),
                ...(data.eventDate !== undefined ? { eventDate: data.eventDate ? new Date(data.eventDate) : null } : {}),
                ...(data.eventType !== undefined ? { eventType: data.eventType } : {}),
                ...(data.venue !== undefined ? { venue: data.venue } : {}),
                ...(data.budgetEur !== undefined ? { budgetEur: data.budgetEur } : {}),
                ...(data.status !== undefined ? { status: data.status } : {}),
                ...(data.notes !== undefined ? { notes: data.notes } : {}),
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Cliente no encontrado o no autorizado.' },
                { status: 404 },
            );
        }

        const client = await prisma.vendorCrmClient.findUnique({ where: { id: clientId } });

        return NextResponse.json({ success: true, client });
    } catch (err) {
        return internalError('[vendor/crm/clients:PUT]', err);
    }
}

// ─── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    try {
        const vendor = await resolveCurrentVendor(req);
        if (!vendor) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado o sesión no autorizada.' },
                { status: 404 },
            );
        }

        const clientId = new URL(req.url).searchParams.get('id')?.trim();
        if (!clientId) {
            return NextResponse.json(
                { error: 'Debe indicar el parámetro "id" del cliente a eliminar.' },
                { status: 400 },
            );
        }

        // 🛡️ deleteMany con WHERE id + vendorId garantiza aislamiento multi-tenant.
        const result = await prisma.vendorCrmClient.deleteMany({
            where: { id: clientId, vendorId: vendor.id },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Cliente no encontrado o no autorizado.' },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, deleted: result.count });
    } catch (err) {
        return internalError('[vendor/crm/clients:DELETE]', err);
    }
}


