/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENDPOINT DE WEBHOOK WHATSAPP CONCIERGE (W55_T02 · 2026-11-11)
 * ════════════════════════════════════════════════════════════════════════════
 * GET  · handshake hub.mode / hub.verify_token
 * POST · mensajes de texto y clics de botón con desglose determinista
 *
 * La lógica vive en `@/lib/whatsapp/whatsapp-concierge` (motor puro, testable).
 * Ver `src/lib/whatsapp/whatsapp-concierge.ts` para el contrato completo.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';

import { dispatchToN8n } from '@/lib/services/n8n-dispatcher';
import {
  loadDefaultFichas,
  parseInboundEvent,
  planConciergeReply,
  resolveMcpEndpointUrl,
  verifyWebhookSignature,
  verifyWebhookSubscription,
  type ConciergePlan,
} from '@/lib/whatsapp/whatsapp-concierge';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Techo de cuerpo aceptado. Un mensaje de WhatsApp no llega ni a 100 KB. */
export const MAX_BODY_BYTES: number = 64 * 1024;

const NO_STORE_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, must-revalidate',
  'X-Robots-Tag': 'noindex',
};

/** Presupuesto del despacho a n8n: si tarda más, la DLQ cubre el fallo. */
const DISPATCH_BUDGET_MS: number = 6_000;

function json(body: Record<string, unknown>, status: number): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

/**
 * Sobre de honestidad obligatorio en toda respuesta (AF-1). `probed:true`
 * porque la ruta se ha ejecutado de verdad; el motivo viaja en `detail`.
 */
function result(status: number, ok: boolean, detail: string, extra: Record<string, unknown>): NextResponse {
  return json(
    {
      ok,
      probed: true,
      source: 'live',
      mode: 'REAL',
      checkedAt: new Date().toISOString(),
      detail,
      ...extra,
    },
    status,
  );
}

/** Compara en tiempo constante sin filtrar longitudes (SEC-1). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff: number = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Origen público del despliegue: cero host cableado (SEC-3). */
export function resolvePublicOrigin(request: Request): string {
  const configured: string | undefined = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_BASE_URL;
  if (typeof configured === 'string' && configured.startsWith('http')) {
    return configured.replace(/\/+$/, '');
  }
  const url: URL = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

/**
 * GET · handshake de suscripción de Meta.
 * Devuelve el `challenge` en texto plano SÓLO si el token coincide.
 */
export function GET(request: Request): NextResponse {
  const url: URL = new URL(request.url);
  const verdict = verifyWebhookSubscription(url.searchParams, process.env);

  if (!verdict.ok) {
    return result(verdict.status, false, verdict.reason, {
      endpoint: 'whatsapp-concierge',
      operation: 'verify',
    });
  }

  return new NextResponse(verdict.challenge, {
    status: 200,
    headers: { ...NO_STORE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/** Resultado del despacho a n8n, ya normalizado (nunca indefinido). */
interface DispatchOutcome {
  readonly delivered: boolean;
  readonly lastError: string | null;
}

/**
 * Entrega el turno al workflow de n8n con presupuesto de tiempo. Si n8n no
 * contesta a tiempo, el evento sigue su curso en la DLQ del dispatcher: el
 * cliente ve que no se ha entregado, no una mentira verde (AF-5).
 */
async function deliverToN8n(payload: Record<string, unknown>): Promise<DispatchOutcome> {
  const timeout: Promise<DispatchOutcome> = new Promise((resolve) =>
    setTimeout(() => resolve({ delivered: false, lastError: 'DISPATCH_BUDGET_EXCEEDED' }), DISPATCH_BUDGET_MS),
  );
  const outcome = await Promise.race([dispatchToN8n('call-center-intake', payload), timeout]);
  return { delivered: outcome.delivered, lastError: outcome.lastError };
}

/**
 * POST · recepción de eventos.
 *
 * Dos orígenes legítimos:
 *   A) Meta directo  → firma HMAC obligatoria sobre el cuerpo crudo.
 *   B) n8n (lanzador)→ `Authorization: Bearer <WHATSAPP_WEBHOOK_TOKEN>`.
 * Sin ninguna de las dos credenciales la ruta responde 401/403 y no procesa.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const rawBody: string = await request.text().catch((): string => '');

  if (rawBody.length === 0) {
    return result(400, false, 'cuerpo vacío.', { endpoint: 'whatsapp-concierge' });
  }
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return result(413, false, 'cuerpo por encima del techo de 64 KB.', { endpoint: 'whatsapp-concierge' });
  }

  const contentType: string | null = request.headers.get('content-type');
  if (contentType === null || !contentType.toLowerCase().includes('application/json')) {
    return result(415, false, 'Content-Type distinto de application/json.', {
      endpoint: 'whatsapp-concierge',
    });
  }

  const signature: string | null = request.headers.get('x-hub-signature-256');
  const bearer: string | null = request.headers.get('authorization');
  const launcherToken: string | undefined = process.env.WHATSAPP_WEBHOOK_TOKEN;

  let authenticatedBy: 'meta-signature' | 'n8n-bearer' | null = null;

  if (signature !== null) {
    const verdict = verifyWebhookSignature(rawBody, signature, process.env);
    if (!verdict.ok) {
      return result(verdict.status, false, verdict.reason, {
        endpoint: 'whatsapp-concierge',
        gate: 'signature',
      });
    }
    authenticatedBy = 'meta-signature';
  } else if (
    bearer !== null &&
    bearer.startsWith('Bearer ') &&
    typeof launcherToken === 'string' &&
    launcherToken.length >= 16 &&
    safeEqual(bearer.slice('Bearer '.length), launcherToken)
  ) {
    authenticatedBy = 'n8n-bearer';
  } else {
    return result(
      401,
      false,
      'sin firma X-Hub-Signature-256 ni token de lanzador válido: evento no autenticado.',
      { endpoint: 'whatsapp-concierge', gate: 'origin' },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return result(400, false, 'JSON ilegible.', { endpoint: 'whatsapp-concierge' });
  }

  const parsed = parseInboundEvent(payload, process.env.WHATSAPP_WA_REF_SECRET);
  if (!parsed.ok) {
    // 200 para que Meta no reintente un evento que jamás vamos a entender.
    return result(200, true, `evento ignorado: ${parsed.reason}`, {
      endpoint: 'whatsapp-concierge',
      ignored: true,
      delivered: false,
      deadLettered: false,
      authenticatedBy,
    });
  }

  const now: number = Date.now();
  const plan: ConciergePlan = planConciergeReply(parsed.event, {
    entries: loadDefaultFichas(),
    now,
  });

  const origin: string = resolvePublicOrigin(request);
  const mcpEndpoint: string = resolveMcpEndpointUrl(origin);
  const priceLockUrl: string | null = plan.priceLockHref === null ? null : `${origin}${plan.priceLockHref}`;

  const dispatch: DispatchOutcome = await deliverToN8n({
    channel: 'whatsapp',
    leadId: plan.waRef,
    intent: plan.intent.categoryHint === null ? 'whatsapp_concierge' : 'whatsapp_concierge_catalogado',
    surface: 'inline',
    origin: '/api/webhooks/whatsapp-concierge',
    timestamp: new Date(now).toISOString(),
    replyText: plan.replyText,
    messageId: plan.messageId,
    priceLockUrl,
    toolCalls: plan.toolCalls,
    mcpEndpoint,
    createsStripeSession: false,
    requiresHuman: plan.requiresHuman,
  });

  return result(
    200,
    true,
    dispatch.delivered
      ? 'evento procesado y entregado a n8n.'
      : 'evento procesado; la entrega queda en la DLQ.',
    {
      endpoint: 'whatsapp-concierge',
      authenticatedBy,
      delivered: dispatch.delivered,
      deadLettered: !dispatch.delivered,
      lastError: dispatch.lastError,
      waRef: plan.waRef,
      messageId: plan.messageId,
      toolCalls: plan.toolCalls,
      mcpEndpoint,
      createsStripeSession: false,
      requiresHuman: plan.requiresHuman,
      replyText: plan.replyText,
      evidenceSha256: plan.evidenceSha256,
      splitSumsToTotal: plan.splitReport === null ? null : plan.splitReport.splitSumsToTotal,
    },
  );
}

/** SEC-1 default-deny: el webhook sólo habla GET y POST. */
export function PUT(): NextResponse {
  return json({ status: 'error', code: 'METHOD_NOT_ALLOWED' }, 405);
}

export const PATCH = PUT;
export const DELETE = PUT;
