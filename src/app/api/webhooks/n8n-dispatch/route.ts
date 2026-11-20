import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  N8N_SIGNATURE_HEADER,
  N8N_TIMESTAMP_HEADER,
  N8N_DISPATCH_ACTIONS,
  verifyN8nSignature,
  type N8nDispatchAction,
} from '@/lib/security/n8nHmacBridge';
import { dispatchToN8n, type N8nWebhookSlug } from '@/lib/services/n8n-dispatcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/webhooks/n8n-dispatch — PUENTE BIDIRECCIONAL FIRMADO n8n → EAR OS
 * ════════════════════════════════════════════════════════════════════════════
 * n8n (Telegram VIP, WhatsApp Centralita, cron) ordena aquí una acción sobre el
 * bus de EAR OS. Cada orden viaja firmada con HMAC-SHA256 sobre
 * `${timestamp}.${rawBody}`.
 *
 * Default-deny (SEC-1): se verifica la firma ANTES de leer o interpretar el
 * cuerpo como orden. Un cuerpo malformado procedente de una fuente no firmada
 * no llega ni a Zod — no se da información de validación a un atacante.
 *
 * Códigos de respuesta:
 *   401 — firma ausente o no coincidente.
 *   400 — firma válida pero payload inválido (Zod) o acción desconocida.
 *   503 — `N8N_DISPATCH_SECRET` no configurado (fail-closed, nunca 200).
 *   200 — orden aceptada y despachada (o registrada en DLQ si n8n no responde).
 *
 * AF-1: la respuesta declara `probed`, `source`, `mode` y `checkedAt` reales.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Mapa de acción → workflow n8n que la consume. */
const ACTION_TO_SLUG: Readonly<Record<N8nDispatchAction, N8nWebhookSlug>> = Object.freeze({
  STRIPE_PRICE_LOCK_CONFIRMED: 'stripe-price-lock',
  HITL_PAUSE: 'autonomous-escalation',
  HITL_RESUME: 'autonomous-escalation',
  TELEGRAM_VIP_ALERT: 'executive-kpi-radar',
  WHATSAPP_CENTRALITA_ALERT: 'call-center-intake',
});

const DispatchEnvelope = z.object({
  action: z.enum(N8N_DISPATCH_ACTIONS),
  /** Identificador de correlación del workflow origen (trazabilidad forense). */
  workflowRunId: z.string().min(1).max(128).optional(),
  /** Cuerpo de la orden: lo que consumirá el workflow destino. */
  payload: z.record(z.string(), z.unknown()).default({}),
});

export async function POST(request: Request): Promise<NextResponse> {
  const rawBody: string = await request.text();

  const verdict = verifyN8nSignature({
    rawBody,
    signature: request.headers.get(N8N_SIGNATURE_HEADER),
    timestamp: request.headers.get(N8N_TIMESTAMP_HEADER),
  });

  if (!verdict.ok) {
    // Diagnóstico sin secretos ni payload: sólo el motivo del rechazo.
    console.warn(`[N8N_DISPATCH] orden rechazada · reason=${verdict.reason}`);
    const status: number =
      verdict.reason === 'NO_SECRET' ? 503 : verdict.reason === 'SIGNATURE_MISMATCH' || verdict.reason === 'MISSING_SIGNATURE' ? 401 : 400;
    return NextResponse.json(
      {
        ok: false,
        probed: true,
        source: 'live',
        mode: 'REAL',
        checkedAt: new Date().toISOString(),
        error: `Orden no aceptada (${verdict.reason}).`,
      },
      { status },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        probed: true,
        source: 'live',
        mode: 'REAL',
        checkedAt: new Date().toISOString(),
        error: 'Cuerpo firmado pero no es JSON válido.',
      },
      { status: 400 },
    );
  }

  const parsed = DispatchEnvelope.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        probed: true,
        source: 'live',
        mode: 'REAL',
        checkedAt: new Date().toISOString(),
        error: 'Payload inválido para el contrato de despacho.',
        issues: parsed.error.issues.map((issue: z.ZodIssue) => issue.path.join('.') || 'root'),
      },
      { status: 400 },
    );
  }

  const action: N8nDispatchAction = parsed.data.action;
  const slug: N8nWebhookSlug = ACTION_TO_SLUG[action];

  const result = await dispatchToN8n(slug, {
    action,
    workflowRunId: parsed.data.workflowRunId ?? null,
    orderedAt: new Date().toISOString(),
    signatureAgeSeconds: verdict.ageSeconds,
    body: parsed.data.payload,
  });

  return NextResponse.json(
    {
      ok: result.delivered,
      probed: true,
      source: 'live',
      mode: 'REAL',
      checkedAt: new Date().toISOString(),
      action,
      slug,
      delivered: result.delivered,
      status: result.status,
      attempts: result.attempts,
      lastError: result.lastError,
    },
    { status: result.delivered ? 200 : 502 },
  );
}
