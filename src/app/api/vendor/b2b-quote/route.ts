import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { ServiceCategory } from '@/types/multi-service';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES: ServiceCategory[] = [
    'MUSICA_LIVE', 'DJ', 'MARIACHI', 'FOTOGRAFIA', 'VIDEO',
    'CATERING', 'DECORACION', 'ILUMINACION', 'WEDDING_PLANNER', 'TRANSPORTE', 'FINCA',
];

const B2BServiceLineSchema = z.object({
    name: z.string().min(2).max(120),
    category: z.enum(SERVICE_CATEGORIES as [ServiceCategory, ...ServiceCategory[]]),
    basePrice: z.number().positive().max(100000),
    providerId: z.string().min(1).optional(),
    requirements: z.array(z.string().min(1)).max(20).default([]),
});

const B2BQuoteRequestSchema = z.object({
    fincaId: z.string().min(3).max(64),
    fincaRazonSocial: z.string().min(3).max(120),
    fincaCif: z.string().regex(/^[A-Z]\d{8}[A-Z0-9]$/, 'CIF inválido'),
    eventDate: z.string().datetime({ offset: true }),
    location: z.string().min(2).max(120),
    clientName: z.string().min(2).max(80).optional(),
    clientEmail: z.string().email().optional(),
    services: z.array(B2BServiceLineSchema).min(1, 'Se requiere al menos un servicio').max(30),
    notes: z.string().max(500).optional(),
});

type B2BQuoteRequest = z.infer<typeof B2BQuoteRequestSchema>;

// ─── Tipos de Respuesta ────────────────────────────────────────────────────────

interface B2BServiceQuoteLine {
    lineId: string;
    name: string;
    category: ServiceCategory;
    basePrice: number;
    providerId: string | null;
    requirements: string[];
}

interface B2BQuoteResponse {
    success: true;
    quoteId: string;
    timestamp: string;
    expiresAt: string;
    finca: {
        fincaId: string;
        razonSocial: string;
        cif: string;
    };
    event: {
        eventDate: string;
        location: string;
        clientName: string | null;
        clientEmail: string | null;
    };
    services: B2BServiceQuoteLine[];
    financials: {
        subtotal: number;
        earOsInfrastructureFee: number;
        earOsFeePct: number;
        netToFinca: number;
        vatPct: number;
        vatAmount: number;
        totalWithVat: number;
    };
    integrity: {
        hashSha256: string;
        algorithm: string;
    };
    sla: {
        quoteValidityHours: number;
        responseTimeMinutes: number;
    };
}

// ─── Constantes SSOT ───────────────────────────────────────────────────────────

const EAR_OS_INFRASTRUCTURE_FEE_PCT = 0.10;
const VAT_PCT = 0.21;
const QUOTE_VALIDITY_HOURS = 72;

// Webhook asíncrono para inyección en el CRM vía n8n (fire-and-forget).
const N8N_B2B_CRM_WEBHOOK_URL = process.env.N8N_B2B_CRM_WEBHOOK_URL;
const N8N_DISPATCH_TIMEOUT_MS = 4000;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

function generateQuoteId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `B2BQ-${ts}-${rand}`;
}

function computeIntegrityHash(payload: string): string {
    return `0x${crypto.createHash('sha256').update(payload).digest('hex').toUpperCase().slice(0, 32)}`;
}

interface B2BN8nCrmEvent {
    event: 'b2b_quote_created';
    quoteId: string;
    timestamp: string;
    fincaId: string;
    fincaRazonSocial: string;
    fincaCif: string;
    eventDate: string;
    location: string;
    clientName: string | null;
    clientEmail: string | null;
    subtotal: number;
    totalWithVat: number;
    servicesCount: number;
    integrityHash: string;
}

/**
 * Despacha la cotización al webhook de n8n en segundo plano sin bloquear la
 * respuesta al cliente. Si n8n no está configurado, el despacho se omite de
 * forma segura (no interrumpe el flujo de cotización).
 */
function dispatchToN8nCrm(event: B2BN8nCrmEvent): void {
    fireAndForgetN8n('b2b-quote', event as unknown as Record<string, unknown>);
}

// ─── POST Handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    const t0 = Date.now();

    try {
        // 1. Parse & Validate
        const rawBody: unknown = await req.json();
        const parsed = B2BQuoteRequestSchema.safeParse(rawBody);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validación de payload fallida',
                    issues: parsed.error.issues.map((i) => ({
                        path: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 }
            );
        }

        const data: B2BQuoteRequest = parsed.data;

        // 2. Build service lines
        const services: B2BServiceQuoteLine[] = data.services.map((srv, idx) => ({
            lineId: `L${String(idx + 1).padStart(2, '0')}`,
            name: srv.name,
            category: srv.category,
            basePrice: round2(srv.basePrice),
            providerId: srv.providerId ?? null,
            requirements: srv.requirements,
        }));

        // 3. Financial computation (SSOT)
        const subtotal = round2(services.reduce((acc, s) => acc + s.basePrice, 0));
        const earOsInfrastructureFee = round2(subtotal * EAR_OS_INFRASTRUCTURE_FEE_PCT);
        const netToFinca = round2(subtotal - earOsInfrastructureFee);
        const vatAmount = round2(subtotal * VAT_PCT);
        const totalWithVat = round2(subtotal + vatAmount);

        // 4. Quote metadata
        const now = new Date();
        const quoteId = generateQuoteId();
        const expiresAt = new Date(now.getTime() + QUOTE_VALIDITY_HOURS * 60 * 60 * 1000).toISOString();

        // 5. Integrity hash
        const hashPayload = [
            quoteId,
            data.fincaCif,
            subtotal.toFixed(2),
            earOsInfrastructureFee.toFixed(2),
            expiresAt,
            services.map((s) => `${s.category}:${s.basePrice.toFixed(2)}`).join('|'),
        ].join('::');
        const hashSha256 = computeIntegrityHash(hashPayload);

        // 6. Response
        const response: B2BQuoteResponse = {
            success: true,
            quoteId,
            timestamp: now.toISOString(),
            expiresAt,
            finca: {
                fincaId: data.fincaId,
                razonSocial: data.fincaRazonSocial,
                cif: data.fincaCif,
            },
            event: {
                eventDate: data.eventDate,
                location: data.location,
                clientName: data.clientName ?? null,
                clientEmail: data.clientEmail ?? null,
            },
            services,
            financials: {
                subtotal,
                earOsInfrastructureFee,
                earOsFeePct: EAR_OS_INFRASTRUCTURE_FEE_PCT,
                netToFinca,
                vatPct: VAT_PCT,
                vatAmount,
                totalWithVat,
            },
            integrity: {
                hashSha256,
                algorithm: 'SHA-256',
            },
            sla: {
                quoteValidityHours: QUOTE_VALIDITY_HOURS,
                responseTimeMinutes: 15,
            },
        };

        // 7. Webhook asíncrono a n8n para entrada en CRM (no bloqueante).
        dispatchToN8nCrm({
            event: 'b2b_quote_created',
            quoteId,
            timestamp: now.toISOString(),
            fincaId: data.fincaId,
            fincaRazonSocial: data.fincaRazonSocial,
            fincaCif: data.fincaCif,
            eventDate: data.eventDate,
            location: data.location,
            clientName: data.clientName ?? null,
            clientEmail: data.clientEmail ?? null,
            subtotal,
            totalWithVat,
            servicesCount: services.length,
            integrityHash: hashSha256,
        });

        return NextResponse.json(response, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error interno del orquestador B2B';
        console.error('[API/vendor/b2b-quote] ERROR:', msg);
        return NextResponse.json(
            { success: false, error: 'Error interno al procesar la cotización B2B' },
            { status: 500 }
        );
    }
}