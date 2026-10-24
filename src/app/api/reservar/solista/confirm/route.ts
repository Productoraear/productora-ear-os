import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/payments';
import { lockDateAtomically } from '@/lib/availability/atomicDateLockEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Respuesta canónica de confirmación post-pago (idempotente). */
export interface SolistaConfirmResponse {
  confirmed: boolean;
  status: 'CONFIRMED' | 'PENDING' | 'INVALID';
  orderId?: string;
  productionId?: string;
  eventDate?: string;
  location?: string;
  reason?: string;
}

/**
 * P0 #3 — CONFIRMACIÓN POST-PAGO IDEMPOTENTE.
 *
 * Encadena el funnel secuencial (y la ruta /reservar/solista) al cierre del depósito:
 * 1. Lectura pura: si el webhook de Stripe ya materializó el ProductionEvent
 *    (dedupe por metadata.stripeSessionId), devuelve CONFIRMED sin reescribir.
 * 2. Fallback ante carrera webhook↔cliente: si el usuario aterriza en success_url
 *    antes de que llegue el webhook, verificamos la sesión contra Stripe (fail-closed)
 *    y materializamos el bloqueo con el MISMO motor ACID idempotente
 *    (lockDateAtomically deduplica por stripeSessionId dentro de transacción).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = (url.searchParams.get('order_id') ?? '').trim();
  const lock = (url.searchParams.get('lock') ?? '').trim();
  const sessionId = (url.searchParams.get('session_id') ?? '').trim();

  if (!orderId || !lock) {
    return NextResponse.json(
      { confirmed: false, status: 'INVALID', reason: 'Faltan order_id y lock.' } satisfies SolistaConfirmResponse,
      { status: 400 }
    );
  }

  // ── 1. RESOLUCIÓN IDEMPOTENTE (lectura pura, sin escritura) ──────────────────
  if (sessionId) {
    try {
      const existing = await prisma.productionEvent.findFirst({
        where: { metadata: { path: ['stripeSessionId'], equals: sessionId } },
      });

      if (existing) {
        return NextResponse.json({
          confirmed: true,
          status: 'CONFIRMED',
          orderId,
          productionId: existing.id,
          eventDate: existing.eventDate.toISOString().slice(0, 10),
          location: existing.location ?? undefined,
        } satisfies SolistaConfirmResponse);
      }
    } catch (err) {
      console.warn(
        '[SOLISTA CONFIRM] Lectura ProductionEvent fallida:',
        err instanceof Error ? err.message : String(err)
      );
    }
  } else {
    // Sin session_id no podemos verificar contra Stripe: pendiente (el webhook resolverá).
    return NextResponse.json({
      confirmed: false,
      status: 'PENDING',
      orderId,
      reason: 'Confirmación pendiente de verificación Stripe.',
    } satisfies SolistaConfirmResponse);
  }

  // ── 2. FALLBACK ANTE CARRERA WEBHOOK (materialización idempotente) ────────────
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const meta: Record<string, string> = session.metadata ?? {};

    const isSolistaDeposit = meta.tipo === 'DEPOSITO_SOLISTA_S_CLASS';
    const isMatchingOrder = meta.orderId === orderId;
    const lockMatches =
      typeof meta.priceLockHash === 'string' && meta.priceLockHash.startsWith(lock);
    const isPaid = session.payment_status === 'paid';
    const eventDate = meta.fecha ?? '';

    if (isSolistaDeposit && isMatchingOrder && lockMatches && isPaid && eventDate) {
      const result = await lockDateAtomically({
        eventDate,
        clientName: session.customer_details?.email || session.customer_email || 'Cliente EAR OS',
        location: meta.formato || 'Reserva Solista S-Class',
        stripeSessionId: session.id,
      });

      if (result.success) {
        return NextResponse.json({
          confirmed: true,
          status: 'CONFIRMED',
          orderId,
          productionId: result.productionId,
          eventDate,
          location: meta.formato || 'Reserva Solista S-Class',
        } satisfies SolistaConfirmResponse);
      }

      return NextResponse.json(
        {
          confirmed: false,
          status: 'PENDING',
          orderId,
          reason: `Fecha no bloqueable: ${result.reason}`,
        } satisfies SolistaConfirmResponse,
        { status: 409 }
      );
    }

    return NextResponse.json({
      confirmed: false,
      status: 'PENDING',
      orderId,
      reason: 'Pago aún no verificado. Reintentando…',
    } satisfies SolistaConfirmResponse);
  } catch (err) {
    console.warn(
      '[SOLISTA CONFIRM] Verificación Stripe fallida (fail-closed):',
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json({
      confirmed: false,
      status: 'PENDING',
      orderId,
      reason: 'Confirmación en proceso (webhook pendiente).',
    } satisfies SolistaConfirmResponse);
  }
}
