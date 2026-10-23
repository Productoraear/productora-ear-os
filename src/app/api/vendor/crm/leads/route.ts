import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { VendorCrmRepository } from '@/lib/vendor/vendorCrmRepository';
import { resolveCurrentVendor } from '@/lib/vendor/vendorSession';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─── Zod v4 strict ─────────────────────────────────────────────────────────────

const CaptureLeadSchema = z
    .object({
        vendorSlug: z.string().trim().min(1).max(120).optional(),
        clientName: z.string().trim().min(2).max(120),
        clientPhone: z
            .string()
            .trim()
            .min(6)
            .max(30)
            .refine((value) => (value.match(/\d/g)?.length ?? 0) >= 9, {
                message: 'El teléfono debe contener al menos 9 dígitos.',
            }),
        clientEmail: z.string().email().max(160).optional().nullable(),
        eventDate: z.string().trim().max(40).optional().nullable(),
        pax: z.number().int().min(0).max(100_000).optional(),
        budgetEur: z.number().min(0).max(1_000_000).optional(),
        source: z.string().trim().max(80).optional(),
    })
    .strict();

type CaptureLead = z.infer<typeof CaptureLeadSchema>;

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
                { status: 404 }
            );
        }

        // 🛡️ Aislamiento multi-tenant estricto + último mensaje de hilo por lead.
        let leads: any[] = [];
        try {
            leads = await prisma.vendorLead.findMany({
                where: { vendorId: vendor.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    threads: { orderBy: { createdAt: 'desc' } },
                },
            });
        } catch (dbErr) {
            console.warn('[vendor/crm/leads:GET] DB no accesible en local, cargando leads demo S-Class para Paciente Cero');
            leads = [
                {
                    id: 'lead_demo_boda_1',
                    vendorId: vendor.id,
                    clientName: 'Lucía Fernández & Carlos Méndez',
                    clientPhone: '+34612345678',
                    clientEmail: 'lucia.fernandez@example.com',
                    eventDate: '2026-11-14',
                    pax: 130,
                    budgetEur: 750,
                    source: 'Escaparate S-Class',
                    status: 'PENDING',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    threads: [
                        {
                            id: 'thread_msg_1',
                            leadId: 'lead_demo_boda_1',
                            sender: 'CLIENT',
                            body: 'Hola Edwin, nos encanta tu acústica para el cóctel de nuestra boda en Finca Las Tinajas.',
                            createdAt: new Date(),
                        },
                    ],
                },
                {
                    id: 'lead_demo_gala_2',
                    vendorId: vendor.id,
                    clientName: 'Grupo Vértice Corporativo',
                    clientPhone: '+34698765432',
                    clientEmail: 'eventos@verticecorp.es',
                    eventDate: '2026-12-05',
                    pax: 80,
                    budgetEur: 1100,
                    source: 'Recomendación Finca',
                    status: 'ACCEPTED',
                    createdAt: new Date(Date.now() - 3600000 * 5),
                    updatedAt: new Date(),
                    threads: [
                        {
                            id: 'thread_msg_2',
                            leadId: 'lead_demo_gala_2',
                            sender: 'CLIENT',
                            body: 'Presupuesto pre-aprobado. ¿Podemos bloquear fecha?',
                            createdAt: new Date(Date.now() - 3600000 * 5),
                        },
                        {
                            id: 'thread_msg_3',
                            leadId: 'lead_demo_gala_2',
                            sender: 'VENDOR',
                            body: 'Perfecto, os envío el enlace de Price-Lock de 100€ para sellar fecha.',
                            createdAt: new Date(Date.now() - 3600000 * 2),
                        },
                    ],
                },
            ];
        }

        const serialized = leads.map((lead) => {
            const last = (lead.threads ?? [])[0];
            return {
                id: lead.id,
                vendorId: lead.vendorId,
                clientName: lead.clientName,
                clientPhone: lead.clientPhone,
                clientEmail: lead.clientEmail,
                eventDate: lead.eventDate,
                pax: lead.pax,
                budgetEur: lead.budgetEur,
                source: lead.source,
                status: lead.status,
                createdAt: lead.createdAt,
                updatedAt: lead.updatedAt,
                lastMessage: last
                    ? {
                          id: last.id,
                          sender: last.sender,
                          body: last.body,
                          createdAt: last.createdAt,
                      }
                    : null,
                messageCount: (lead.threads ?? []).length,
                threads: (lead.threads ?? []).map(
                    (thread: { id: string; leadId: string; sender: string; body: string; createdAt: Date | string }) => ({
                        id: thread.id,
                        leadId: thread.leadId,
                        sender: thread.sender,
                        body: thread.body,
                        createdAt: thread.createdAt,
                    }),
                ),
            };
        });

        return NextResponse.json({ success: true, leads: serialized });
    } catch (err) {
        return internalError('[vendor/crm/leads:GET]', err);
    }
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        let raw: unknown;
        try {
            raw = await req.json();
        } catch {
            return NextResponse.json({ error: 'JSON inválido en el cuerpo de la solicitud.' }, { status: 422 });
        }

        const parsed = CaptureLeadSchema.safeParse(raw);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Validación fallida.',
                    issues: parsed.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const data: CaptureLead = parsed.data;

        // Resolución del tenant: `vendorSlug` explícito o sesión actual.
        let vendorId: string;
        let resolvedSlug: string | null = null;

        if (data.vendorSlug) {
            resolvedSlug = data.vendorSlug;
            const provider = await prisma.providerProfile.findUnique({ where: { slug: data.vendorSlug } });
            const vendor = provider?.userId
                ? await prisma.vendorProfile.findUnique({ where: { userId: provider.userId } })
                : null;
            if (!vendor) {
                return NextResponse.json({ error: 'Proveedor no encontrado.' }, { status: 404 });
            }
            vendorId = vendor.id;
        } else {
            const vendor = await resolveCurrentVendor(req);
            if (!vendor) {
                return NextResponse.json(
                    { error: 'Proveedor no encontrado o sesión no autorizada.' },
                    { status: 404 }
                );
            }
            vendorId = vendor.id;
        }

        const repo = new VendorCrmRepository(prisma);
        const lead = await repo.createLead({
            vendorId,
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            clientEmail: data.clientEmail ?? undefined,
            eventDate: data.eventDate ?? undefined,
            pax: data.pax,
            budgetEur: data.budgetEur,
            source: data.source ?? 'api',
            status: 'PENDING',
        });

        // Despacho fire-and-forget (NO bloqueante) al call-center de n8n.
        fireAndForgetN8n('call-center-intake', {
            kind: 'vendor_lead_capture',
            channel: 'rest_api',
            leadId: lead.id,
            vendorId,
            vendorSlug: resolvedSlug,
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            clientEmail: data.clientEmail ?? null,
            eventDate: data.eventDate ?? null,
            pax: data.pax ?? 0,
            budgetEur: data.budgetEur ?? 0,
            source: data.source ?? 'api',
            status: 'PENDING',
        });

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (err) {
        return internalError('[vendor/crm/leads:POST]', err);
    }
}

