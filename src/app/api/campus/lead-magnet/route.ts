import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dispatchToN8n, CampusLeadMagnetPayload, ConciergeWhatsAppDispatchPayload } from '@/lib/services/n8n-dispatcher';
import { CENTRALITA } from '@/lib/phone-constants';
import catalogoCampus from '@/data/catalogo_61_campus.json';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CAMPUS 61 PDFS LEAD MAGNET EXTRACTOR API ROUTE
 * (/api/campus/lead-magnet)
 * ════════════════════════════════════════════════════════════════════════════
 * Ingesta telemática de solicitudes de descarga de activos de Campus.
 * Dispara en background los webhooks n8n `campus-lead-magnet` y
 * `concierge-whatsapp-dispatch` sin meter PDFs pesados en Git, asegurando
 * entrega por WhatsApp (+34 693 693 048) y tolerancia a fallos con DLQ.
 * ════════════════════════════════════════════════════════════════════════════
 */

const MAX_BODY_BYTES = 4096;
const DISPATCH_BUDGET_MS = 7000; // AGENTS.md §5: techo estricto <= 8000ms

const NO_STORE_HEADERS: Readonly<Record<string, string>> = {
    'Cache-Control': 'no-store, must-revalidate',
    'X-Robots-Tag': 'noindex',
};

const leadMagnetSchema = z.object({
    assetId: z.string().trim().min(1).max(128),
    assetTitle: z.string().trim().min(1).max(256),
    targetAudience: z.enum(['parejas', 'proveedores']).default('proveedores'),
    contactPhone: z.string().trim().max(32).optional(),
    contactEmail: z.string().trim().email().max(128).optional(),
    sourceUrl: z.string().trim().max(512).optional(),
    utm: z.record(z.string().max(128), z.string().max(256).optional()).optional(),
});

interface CatalogItem {
    id: string;
    nombre: string;
    titulo?: string;
    categoria?: string;
    sizeMB?: string;
    seoAngle?: string;
    targetAudience?: string;
}

/** Ejecuta promise con un techo de tiempo <= 8000ms con AbortController */
async function withBudget<T>(promise: Promise<T>, budgetMs: number): Promise<T | null> {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const guard = new Promise<null>((resolve) => {
        timer = setTimeout(() => {
            controller.abort();
            resolve(null);
        }, budgetMs);
    });

    try {
        return await Promise.race([promise, guard]);
    } finally {
        if (timer !== undefined) clearTimeout(timer);
    }
}

/**
 * GET — Método no permitido (SEC-1: Nace cerrada).
 */
export async function GET(): Promise<NextResponse> {
    return NextResponse.json(
        { ok: false, error: 'method_not_allowed' },
        {
            status: 405,
            headers: {
                ...NO_STORE_HEADERS,
                Allow: 'POST',
            },
        }
    );
}

/**
 * POST — Ingesta de Lead Magnet con despacho n8n y WhatsApp Concierge.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    // 1. Verificación de Content-Type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
        return NextResponse.json(
            { ok: false, error: 'unsupported_media_type' },
            { status: 415, headers: NO_STORE_HEADERS }
        );
    }

    // 2. Verificación de tamaño de payload
    const rawBody = await req.text();
    const byteLength = Buffer.byteLength(rawBody, 'utf8');
    if (byteLength > MAX_BODY_BYTES) {
        return NextResponse.json(
            { ok: false, error: 'payload_too_large' },
            { status: 413, headers: NO_STORE_HEADERS }
        );
    }

    // 3. Parseo JSON
    let bodyJson: unknown;
    try {
        bodyJson = JSON.parse(rawBody);
    } catch {
        return NextResponse.json(
            { ok: false, error: 'invalid_json' },
            { status: 400, headers: NO_STORE_HEADERS }
        );
    }

    // 4. Validación con Zod
    const parsed = leadMagnetSchema.safeParse(bodyJson);
    if (!parsed.success) {
        return NextResponse.json(
            { ok: false, error: 'invalid_schema', issues: parsed.error.flatten() },
            { status: 400, headers: NO_STORE_HEADERS }
        );
    }

    const { assetId, assetTitle, targetAudience, contactPhone, contactEmail, sourceUrl, utm } = parsed.data;

    // 5. Enriquecimiento cruzado con catálogo de 61 activos
    const catalogList = catalogoCampus as unknown as CatalogItem[];
    const catalogItem = catalogList.find((item) => item.id === assetId);

    const cleanTitle = catalogItem?.titulo || assetTitle.replace(/\.(pdf|docx)$/i, '').trim();
    const categoria = catalogItem?.categoria || 'Campus S-Class';
    const audienceLabel = targetAudience === 'parejas' ? 'Pareja' : 'Profesional / Proveedor';

    // 6. Construcción de URL oficial de WhatsApp con CENTRALITA (+34 693 693 048)
    const whatsappMsg = `Hola Edwin, solicito la guía oficial de Campus EAR OS: "${cleanTitle}" (Ref: ${assetId}, Categoría: ${categoria}, Perfil: ${audienceLabel}). ¿Podéis enviármela por WhatsApp o email?`;
    const whatsappUrl = `https://wa.me/${CENTRALITA.raw}?text=${encodeURIComponent(whatsappMsg)}`;

    const leadId = `campus_lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();

    // 7. Preparación de payloads estrictamente tipados para n8n
    const campusPayload: CampusLeadMagnetPayload = {
        assetId,
        assetTitle: cleanTitle,
        targetAudience,
        contactPhone,
        contactEmail,
        sourceUrl,
        utm: utm as Record<string, string | undefined> | undefined,
        leadId,
        timestamp,
        categoria,
        sizeMB: catalogItem?.sizeMB,
        seoAngle: catalogItem?.seoAngle,
    };

    const conciergePayload: ConciergeWhatsAppDispatchPayload = {
        assetId,
        assetTitle: cleanTitle,
        targetAudience,
        whatsappUrl,
        channel: 'whatsapp',
        leadIntent: `download_request_${targetAudience}`,
        timestamp,
    };

    // 8. Despacho n8n con techo estricto <= 8000ms (AbortController.timeout(8000))
    // Aplicamos AbortController como cerrojo de latencia
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 8000);

    let delivered: boolean | null = null;
    let deadLettered = false;

    try {
        // Disparamos ambos webhooks en paralelo dentro del presupuesto
        const dispatchWork = Promise.all([
            dispatchToN8n('campus-lead-magnet', campusPayload as unknown as Record<string, unknown>),
            dispatchToN8n('concierge-whatsapp-dispatch', conciergePayload as unknown as Record<string, unknown>),
        ]);

        const results = await withBudget(dispatchWork, DISPATCH_BUDGET_MS);

        if (results === null) {
            // Presupuesto superado: el usuario no espera, los despachos siguen en background hacia n8n/DLQ
            delivered = null;
            deadLettered = false;
        } else {
            const [campusRes, conciergeRes] = results;
            delivered = campusRes.delivered && conciergeRes.delivered;
            deadLettered = !delivered;
        }
    } catch {
        delivered = false;
        deadLettered = true;
    } finally {
        clearTimeout(abortTimeout);
    }

    // 9. Respuesta final siempre entregando el whatsappUrl al cliente sin fricción
    return NextResponse.json(
        {
            ok: true,
            whatsappUrl,
            assetId,
            deliveryChannel: 'whatsapp' as const,
            leadId,
            delivered,
            deadLettered,
            catalogMatched: Boolean(catalogItem),
            timestamp,
        },
        {
            status: delivered === null ? 202 : 200,
            headers: NO_STORE_HEADERS,
        }
    );
}
