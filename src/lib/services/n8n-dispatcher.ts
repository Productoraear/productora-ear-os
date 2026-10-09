/**
 * 🛰️ N8N WEBHOOK DISPATCHER (S-CLASS v2.0 — BLINDAJE DE ENTREGA)
 * ----------------------------------------------------------------------------
 * Puente canónico EAR OS -> n8n. Concentra las URLs de los workflows de
 * producción y despacha eventos en background SIN bloquear el flujo principal.
 *
 * NUEVO EN v2.0 (DOCTRINA "LO CONSTRUIDO NO PUEDE FALLAR"):
 *  - Reintentos con backoff exponencial (3 intentos, 500ms/1s/2s).
 *  - Dead Letter Queue (DLQ): ningún lead o depósito se pierde en silencio.
 *  - Health-check de la instancia n8n (`/healthz`).
 *  - Cada despacho reporta `attempts` y `lastError` para telemetría forense.
 *
 * DOCTRINA (AGENTS.md §11):
 *  - Base: https://n8n.productoraear.com (override vía N8N_BASE_URL).
 *  - Endpoints: /webhook/<slug> (b2b-quote, stripe-price-lock, etc.).
 *  - Despacho NO bloqueante: jamás retrasa la respuesta al cliente.
 *  - Sin credenciales ni redes -> el flujo principal continúa intacto.
 * ----------------------------------------------------------------------------
 */

export type N8nWebhookSlug =
    | 'b2b-quote'
    | 'stripe-price-lock'
    | 'finca-partnership'
    | 'vimume-clinical-report'
    | 'call-center-intake'
    | 'autonomous-escalation'
    | 'executive-kpi-radar'
    | 'support-health'
    | 'dlq-retry';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n.productoraear.com';
const N8N_DISPATCH_TIMEOUT_MS = 4000;
const N8N_MAX_RETRIES = 3;
const N8N_RETRY_BASE_DELAY_MS = 500;

export function buildN8nWebhookUrl(slug: N8nWebhookSlug): string {
    return `${N8N_BASE_URL.replace(/\/$/, '')}/webhook/${slug}`;
}

export interface N8nDispatchResult {
    slug: N8nWebhookSlug;
    delivered: boolean;
    status: number | null;
    attempts: number;
    lastError: string | null;
}

interface DeadLetterEntry {
    slug: N8nWebhookSlug;
    payload: Record<string, unknown>;
    attempts: number;
    lastError: string;
    ts: string;
}

/**
 * Cola de cartas muertas: aquí aterrizan los eventos que n8n no pudo recibir
 * tras agotar reintentos. El workflow `dlq-retry` de n8n (o un barrido desde
 * el backend) puede volver a procesarlos y alertar a Telegram/WhatsApp/email.
 */
const deadLetterQueue: DeadLetterEntry[] = [];

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function attemptFetch(slug: N8nWebhookSlug, payload: Record<string, unknown>): Promise<{ delivered: boolean; status: number | null }> {
    const url = buildN8nWebhookUrl(slug);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), N8N_DISPATCH_TIMEOUT_MS);

    return (async () => {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            const delivered = res.ok || res.status === 200 || res.status === 202;
            if (!delivered) {
                console.error(`[n8n-dispatcher] ${slug} no OK (${res.status}).`);
            }
            return { delivered, status: res.status };
        } finally {
            clearTimeout(timeout);
        }
    })();
}

/**
 * Despacha un payload a un webhook n8n con reintentos exponenciales.
 * Devuelve una promesa resuelta (nunca lanza) para permitir fire-and-forget.
 * Si agota los reintentos, encola el evento en la Dead Letter Queue.
 */
export async function dispatchToN8n(slug: N8nWebhookSlug, payload: Record<string, unknown>): Promise<N8nDispatchResult> {
    let lastError: string | null = null;
    let status: number | null = null;
    let attempts = 0;

    for (let attempt = 1; attempt <= N8N_MAX_RETRIES; attempt++) {
        attempts = attempt;
        try {
            const result = await attemptFetch(slug, payload);
            status = result.status;
            if (result.delivered) {
                return { slug, delivered: true, status, attempts, lastError: null };
            }
            lastError = `HTTP ${result.status}`;
        } catch (reason) {
            lastError = reason instanceof Error ? reason.message : String(reason);
            console.error(`[n8n-dispatcher] Intento ${attempt}/${N8N_MAX_RETRIES} fallido para ${slug}: ${lastError}`);
        }

        if (attempt < N8N_MAX_RETRIES) {
            await sleep(N8N_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
        }
    }

    const entry: DeadLetterEntry = {
        slug,
        payload,
        attempts,
        lastError: lastError ?? 'Error desconocido',
        ts: new Date().toISOString()
    };
    deadLetterQueue.push(entry);
    console.error(`[n8n-dispatcher] DLQ encolado para ${slug}: ${entry.lastError}`);

    return { slug, delivered: false, status, attempts, lastError };
}

/**
 * Variante fire-and-forget: despacha en background sin esperar el resultado.
 */
export function fireAndForgetN8n(slug: N8nWebhookSlug, payload: Record<string, unknown>): void {
    void dispatchToN8n(slug, payload);
}

/**
 * Devuelve una instantánea de los eventos que no pudieron entregarse.
 * Útil para telemetría forense y para el workflow de reintento `dlq-retry`.
 */
export function getDeadLetterQueue(): readonly DeadLetterEntry[] {
    return [...deadLetterQueue];
}

/** Vacía la Dead Letter Queue tras un reintento exitoso desde el backend. */
export function flushDeadLetterQueue(): void {
    deadLetterQueue.splice(0, deadLetterQueue.length);
}

export interface N8nInstanceHealth {
    alive: boolean;
    status: number | null;
    latencyMs: number | null;
    checkedAt: string;
}

/**
 * Verifica que la instancia n8n responde contra su endpoint nativo `/healthz`.
 * No dispara workflows de negocio; solo comprueba disponibilidad del orquestador.
 */
export async function pingN8nInstance(): Promise<N8nInstanceHealth> {
    const started = Date.now();
    const url = `${N8N_BASE_URL.replace(/\/$/, '')}/healthz`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), N8N_DISPATCH_TIMEOUT_MS);

    try {
        const res = await fetch(url, { method: 'GET', signal: controller.signal });
        clearTimeout(timeout);
        return {
            alive: res.ok || res.status === 200,
            status: res.status,
            latencyMs: Date.now() - started,
            checkedAt: new Date().toISOString()
        };
    } catch (reason) {
        clearTimeout(timeout);
        const message = reason instanceof Error ? reason.message : String(reason);
        console.error(`[n8n-dispatcher] Health-check fallido: ${message}`);
        return { alive: false, status: null, latencyMs: null, checkedAt: new Date().toISOString() };
    }
}