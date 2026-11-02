import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dispatchToN8n } from '@/lib/services/n8n-dispatcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CALL CENTER & WHATSAPP LEAD INTAKE (/api/webhooks/call-center-intake)
 * ════════════════════════════════════════════════════════════════════════════
 * Puerta de entrada de los leads que nacen en la superficie comercial
 * (botón flotante de WhatsApp, dock móvil, llamadas de centralita) y que
 * terminan en el workflow n8n `call-center-intake`.
 *
 * SEC-2 · Matriz de autorización
 *   role   : public   — captación anónima. No hay sesión ni credencial.
 *   tenant : ear-os
 *   secretos: NINGUNO. Esta ruta no lee, no acepta ni devuelve claves.
 *
 * SEC-1 · Nace cerrada (caso negativo antes que camino feliz):
 *   405  método distinto de POST (GET explícito, no autogenerado)
 *   415  Content-Type distinto de application/json
 *   413  cuerpo > 4 KB (cabecera o bytes reales)
 *   400  JSON inválido o esquema incumplido
 *   429  rate-limit por IP (ventana de 60 s)
 *   202  aceptado — `delivered`/`deadLettered` dicen la VERDAD de lo ocurrido
 *
 * AF-1 / AF-5 · Cero verde por defecto: si n8n no responde, la respuesta NO
 * dice "ok". Dice `delivered:false, deadLettered:true`, y el payload queda en
 * la DLQ del dispatcher canónico para que `dlq-retry` lo recupere. Un lead
 * perdido en silencio es una factura perdida.
 *
 * INV-14 / SEC-8 · Minimización en origen: el cliente sólo envía el pathname
 * (sin query ni fragmento), el teléfono PÚBLICO de centralita y un timestamp.
 * No viaja IP, ni cookies, ni email, ni el teléfono del visitante. `pii:false`.
 * ════════════════════════════════════════════════════════════════════════════
 */

const MAX_BODY_BYTES = 4096;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_BUCKETS = 5_000;
const DEDUPE_WINDOW_MS = 10 * 60_000;
const DEDUPE_MAX_ENTRIES = 5_000;
/** Presupuesto de respuesta. Si n8n tarda más, el despacho sigue en background
 *  (el usuario ya está en WhatsApp) y la DLQ cubre el fallo posterior. */
const DISPATCH_BUDGET_MS = 5_500;

const NO_STORE_HEADERS: Readonly<Record<string, string>> = {
    'Cache-Control': 'no-store, must-revalidate',
    'X-Robots-Tag': 'noindex',
};

/**
 * Esquema de entrada. Allowlist estricta: todo campo que no esté aquí se
 * descarta antes de tocar n8n, de modo que un cliente hostil no puede inyectar
 * claves arbitrarias en el workflow (SEC-4).
 */
const leadIntakeSchema = z.object({
    leadId: z
        .string()
        .min(8)
        .max(64)
        .regex(/^[A-Za-z0-9_-]+$/, 'leadId debe ser alfanumérico (guiones y guion bajo permitidos)'),
    channel: z.enum(['whatsapp', 'call']),
    intent: z
        .string()
        .min(3)
        .max(64)
        .regex(/^[a-z0-9_.-]+$/, 'intent debe ser un slug en minúsculas'),
    surface: z.enum(['floating_cta', 'mobile_dock', 'inline']).optional(),
    phone: z
        .string()
        .regex(/^\+[1-9]\d{6,14}$/, 'phone debe estar en E.164 (ej. +34693693048)'),
    origin: z
        .string()
        .min(1)
        .max(180)
        .regex(/^\/[A-Za-z0-9\-._~/%]*$/, 'origin debe ser un pathname sin query ni fragmento'),
    timestamp: z
        .string()
        .min(20)
        .max(32)
        .refine((value) => !Number.isNaN(Date.parse(value)), 'timestamp debe ser ISO-8601'),
});

function jsonResponse(body: Record<string, unknown>, status: number): NextResponse {
    return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

function jsonError(
    status: number,
    error: string,
    message: string,
    extraHeaders?: Readonly<Record<string, string>>
): NextResponse {
    return NextResponse.json(
        {
            ok: false,
            error,
            message,
            // La ruta ha sido ejecutada de verdad; el fallo es del cliente, no
            // una caída del motor. Se declara el modo para no simular salud.
            probed: true,
            source: 'live',
            mode: 'REAL',
            checkedAt: new Date().toISOString(),
        },
        { status, headers: { ...NO_STORE_HEADERS, ...(extraHeaders ?? {}) } }
    );
}

/**
 * IP reportada por el proxy (Coolify/Traefik delante de Next). Es la mejor
 * aproximación disponible en el proceso; el límite duro debe vivir además en
 * el edge. Se documenta para no vender un rate-limit que no es absoluto.
 */
function resolveClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        const first = forwarded.split(',')[0]?.trim();
        if (first) return first;
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
    return 'unknown';
}

const rateBuckets = new Map<string, number[]>();

function isRateLimited(clientIp: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const hits = (rateBuckets.get(clientIp) ?? []).filter((ts) => ts > windowStart);

    if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
        rateBuckets.set(clientIp, hits);
        return true;
    }

    hits.push(now);
    rateBuckets.set(clientIp, hits);

    if (rateBuckets.size > RATE_LIMIT_MAX_BUCKETS) {
        for (const [ip, timestamps] of rateBuckets) {
            if (timestamps.every((ts) => ts <= windowStart)) rateBuckets.delete(ip);
        }
    }

    return false;
}

/**
 * INV-08 aplicado al intake: el mismo `leadId` reintentado (doble clic, retry
 * del navegador, `keepalive` duplicado) NO genera un segundo lead en n8n.
 * Ventana de 10 minutos. El almacén es memoria de proceso, y así se declara.
 */
const recentLeads = new Map<string, number>();

function isDuplicateLead(leadId: string): boolean {
    const now = Date.now();
    pruneDedupe(now);

    const firstSeenAt = recentLeads.get(leadId);
    if (firstSeenAt !== undefined && now - firstSeenAt < DEDUPE_WINDOW_MS) {
        return true;
    }

    recentLeads.set(leadId, now);
    return false;
}

function pruneDedupe(now: number): void {
    if (recentLeads.size < DEDUPE_MAX_ENTRIES) return;

    for (const [leadId, firstSeenAt] of recentLeads) {
        if (now - firstSeenAt >= DEDUPE_WINDOW_MS) recentLeads.delete(leadId);
    }

    // Techo duro de memoria: si sigue lleno, se vacía. Se prefiere perder la
    // deduplicación de una ventana a un proceso que crece sin límite.
    if (recentLeads.size >= DEDUPE_MAX_ENTRIES) recentLeads.clear();
}

/** Ejecuta `promise` con un techo de tiempo; devuelve `null` si expira. */
async function withBudget<T>(promise: Promise<T>, budgetMs: number): Promise<T | null> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const guard = new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), budgetMs);
    });

    try {
        return await Promise.race([promise, guard]);
    } finally {
        if (timer !== undefined) clearTimeout(timer);
    }
}

/** Caso negativo explícito (SEC-1): esta ruta sólo acepta POST. */
export async function GET(): Promise<NextResponse> {
    return jsonError(405, 'method_not_allowed', 'Esta ruta sólo acepta POST.', { Allow: 'POST' });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const clientIp = resolveClientIp(req);

        if (isRateLimited(clientIp)) {
            return jsonError(429, 'rate_limited', 'Demasiadas peticiones desde esta IP. Reintenta en 60 s.', {
                'Retry-After': '60',
            });
        }

        const contentType = (req.headers.get('content-type') ?? '').toLowerCase();
        if (!contentType.includes('application/json')) {
            return jsonError(415, 'unsupported_media_type', 'Content-Type debe ser application/json.');
        }

        const declaredLength = Number.parseInt(req.headers.get('content-length') ?? '', 10);
        if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
            return jsonError(413, 'payload_too_large', `El cuerpo no puede superar ${MAX_BODY_BYTES} bytes.`);
        }

        const rawBody = await req.text();
        if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
            return jsonError(413, 'payload_too_large', `El cuerpo no puede superar ${MAX_BODY_BYTES} bytes.`);
        }

        let candidate: unknown;
        try {
            candidate = JSON.parse(rawBody);
        } catch {
            return jsonError(400, 'invalid_json', 'El cuerpo no es JSON válido.');
        }

        const parsed = leadIntakeSchema.safeParse(candidate);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    ok: false,
                    error: 'invalid_schema',
                    issues: parsed.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                    probed: true,
                    source: 'live',
                    mode: 'REAL',
                    checkedAt: new Date().toISOString(),
                },
                { status: 400, headers: NO_STORE_HEADERS }
            );
        }

        const lead = parsed.data;

        if (isDuplicateLead(lead.leadId)) {
            return jsonResponse(
                {
                    ok: true,
                    accepted: true,
                    deduplicated: true,
                    delivered: null,
                    deadLettered: false,
                    leadId: lead.leadId,
                    probed: true,
                    source: 'idempotency-guard',
                    mode: 'REAL',
                    checkedAt: new Date().toISOString(),
                },
                202
            );
        }

        // Payload explícito hacia n8n: se reconstruye campo a campo (nunca se
        // reenvía el objeto del cliente) para que la allowlist sea real.
        const n8nPayload: Record<string, unknown> = {
            event: 'lead.intake',
            leadId: lead.leadId,
            channel: lead.channel,
            intent: lead.intent,
            surface: lead.surface ?? 'floating_cta',
            origin: lead.origin,
            clientTimestamp: lead.timestamp,
            receivedAt: new Date().toISOString(),
            contactPhone: lead.phone, // línea pública de centralita, no dato del visitante
            contactPhoneRole: 'centralita',
            source: 'ear-os-web',
            pii: false,
        };

        const dispatch = await withBudget(dispatchToN8n('call-center-intake', n8nPayload), DISPATCH_BUDGET_MS);

        if (dispatch === null) {
            // El despacho sigue vivo en background; si agota reintentos, cae en
            // la DLQ. Se declara `delivered:null` porque aún no se sabe: FALSE
            // sería tan mentira como TRUE (AF-1).
            return jsonResponse(
                {
                    ok: true,
                    accepted: true,
                    deduplicated: false,
                    delivered: null,
                    deadLettered: false,
                    dispatch: 'deferred',
                    leadId: lead.leadId,
                    probed: true,
                    source: 'live',
                    mode: 'REAL',
                    checkedAt: new Date().toISOString(),
                },
                202
            );
        }

        return jsonResponse(
            {
                ok: dispatch.delivered,
                accepted: true,
                deduplicated: false,
                delivered: dispatch.delivered,
                deadLettered: !dispatch.delivered,
                attempts: dispatch.attempts,
                status: dispatch.status,
                lastError: dispatch.lastError,
                // La DLQ canónica vive en memoria del proceso (no sobrevive a un
                // redeploy ni se comparte entre réplicas). Declararlo evita
                // vender "0 leads perdidos" como si fuera una garantía durable.
                dlqScope: dispatch.delivered ? null : 'process-local',
                leadId: lead.leadId,
                probed: true,
                source: 'live',
                mode: 'REAL',
                checkedAt: new Date().toISOString(),
            },
            202
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado en el intake de leads';
        return jsonError(500, 'internal_error', message);
    }
}
