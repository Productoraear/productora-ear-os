import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/database/prisma';
import { fireAndForgetN8n, type N8nWebhookSlug } from '@/lib/services/n8n-dispatcher';
import { describeCronAuthFailure, verifyCronSecret } from '@/lib/security/cronSecretGuard';
import {
  FUNNEL_EVENT_NAMES,
  isConversionEvent,
  type FunnelEventName,
} from '@/lib/telemetry/funnelEventTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const funnelEventSchema = z.object({
  eventId: z.string().min(8).max(128),
  sessionId: z.string().min(1).max(128),
  funnelKey: z.string().min(1).max(64),
  archetype: z.string().max(64).nullable().optional(),
  step: z.number().int().min(1).max(20).nullable().optional(),
  stepTag: z.string().max(32).nullable().optional(),
  eventType: z.enum(FUNNEL_EVENT_NAMES),
  sourceUrl: z.string().max(512).nullable().optional(),
  utmSource: z.string().max(255).nullable().optional(),
  utmMedium: z.string().max(255).nullable().optional(),
  utmCampaign: z.string().max(255).nullable().optional(),
  referrer: z.string().max(512).nullable().optional(),
  priceSnapshot: z.number().nonnegative().nullable().optional(),
  orderId: z.string().max(128).nullable().optional(),
  error: z.string().max(512).nullable().optional(),
  leadName: z.string().max(160).nullable().optional(),
  leadPhone: z.string().max(40).nullable().optional(),
  leadEmail: z.string().max(160).nullable().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).nullable().optional(),
  timestamp: z.string().datetime().optional(),
});

type FunnelEventInput = z.infer<typeof funnelEventSchema>;

/** Sanitización server-side anti-XSS (OWASP ASVS L3): control chars + `<`/`>` eliminados. */
function sanitizeText(value: string | null | undefined, maxLen: number): string | null {
  if (value == null) return null;
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
  return cleaned.length > 0 ? cleaned : null;
}

/** Mapa de eventos de conversión → webhook n8n (0 leads huérfanos). */
const CONVERSION_DISPATCH: Readonly<Partial<Record<FunnelEventName, N8nWebhookSlug>>> = {
  LEAD_SUBMITTED: 'call-center-intake',
  DEPOSIT_INITIATED: 'autonomous-escalation',
  DEPOSIT_CONFIRMED: 'executive-kpi-radar',
};

function dispatchConversion(data: FunnelEventInput): void {
  if (!isConversionEvent(data.eventType)) return;
  const slug = CONVERSION_DISPATCH[data.eventType];
  if (!slug) return;

  const metadata = data.metadata ?? {};
  const orderId =
    data.orderId ?? (typeof metadata.orderId === 'string' ? metadata.orderId : '');

  fireAndForgetN8n(slug, {
    event: data.eventType,
    sessionId: data.sessionId,
    funnelKey: data.funnelKey,
    archetype: data.archetype ?? '',
    sourceUrl: data.sourceUrl ?? '',
    leadName: data.leadName ?? '',
    leadPhone: data.leadPhone ?? '',
    leadEmail: data.leadEmail ?? '',
    orderId,
    priceSnapshot: data.priceSnapshot ?? 0,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const raw = await req.json().catch(() => null);
    const parsed = funnelEventSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'invalid_payload' }, { status: 400 });
    }

    const data = parsed.data;

    // Despacho n8n NO bloqueante para eventos de conversión (0 leads huérfanos).
    dispatchConversion(data);

    const createInput: Prisma.FunnelEventCreateInput = {
      eventId: data.eventId,
      sessionId: data.sessionId,
      funnelKey: data.funnelKey,
      archetype: sanitizeText(data.archetype, 64) ?? undefined,
      step: data.step ?? undefined,
      stepTag: sanitizeText(data.stepTag, 32) ?? undefined,
      eventType: data.eventType,
      sourceUrl: sanitizeText(data.sourceUrl, 512) ?? undefined,
      utmSource: sanitizeText(data.utmSource, 255) ?? undefined,
      utmMedium: sanitizeText(data.utmMedium, 255) ?? undefined,
      utmCampaign: sanitizeText(data.utmCampaign, 255) ?? undefined,
      referrer: sanitizeText(data.referrer, 512) ?? undefined,
      priceSnapshot: data.priceSnapshot ?? undefined,
      orderId: sanitizeText(data.orderId, 128) ?? undefined,
      error: sanitizeText(data.error, 512) ?? undefined,
      leadName: sanitizeText(data.leadName, 160) ?? undefined,
      leadPhone: sanitizeText(data.leadPhone, 40) ?? undefined,
      leadEmail: sanitizeText(data.leadEmail, 160) ?? undefined,
      metadata: (data.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    };

    let persisted = false;
    try {
      // Idempotente por eventId: retries de beacon/Stripe NO duplican filas.
      await prisma.funnelEvent.upsert({
        where: { eventId: data.eventId },
        update: {},
        create: createInput,
      });
      persisted = true;
    } catch (dbError) {
      console.error('[funnel-telemetry] persist error:', dbError);
    }

    return NextResponse.json({ success: true, persisted });
  } catch (error: unknown) {
    console.error('[funnel-telemetry] ingest error:', error);
    return NextResponse.json({ success: false, error: 'internal_error' }, { status: 500 });
  }
}

interface FunnelAggregateRow {
  eventType: FunnelEventName;
  count: number;
}

interface StepAggregateRow {
  step: number | null;
  count: number;
}

export async function GET(req: Request): Promise<Response> {
  // 🔒 SSOT `cronSecretGuard` (antes `if (secret && x-admin-secret !== secret)`:
  // sin `CRON_SECRET` desplegado, el embudo de conversión quedaba PÚBLICO).
  // Acepta `Authorization: Bearer`, `x-cron-secret` y el histórico
  // `x-admin-secret` que ya usaba esta ruta: mismo valor, misma verificación.
  const verdict = verifyCronSecret(req);
  if (!verdict.ok) {
    return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
  }

  try {
    const [total, byEvent, byStep] = await Promise.all([
      prisma.funnelEvent.count(),
      prisma.funnelEvent.groupBy({ by: ['eventType'], _count: { _all: true } }),
      prisma.funnelEvent.groupBy({ by: ['step'], _count: { _all: true } }),
    ]);

    const byEventSorted: FunnelAggregateRow[] = byEvent
      .map((row) => ({ eventType: row.eventType as FunnelEventName, count: row._count._all }))
      .sort((a, b) => b.count - a.count);

    const byStepSorted: StepAggregateRow[] = byStep
      .map((row) => ({ step: row.step, count: row._count._all }))
      .sort((a, b) => (a.step ?? 0) - (b.step ?? 0));

    return NextResponse.json({
      total,
      byEvent: byEventSorted,
      byStep: byStepSorted,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('[funnel-telemetry] aggregate error:', error);
    return NextResponse.json({ total: 0, byEvent: [], byStep: [], unavailable: true });
  }
}
