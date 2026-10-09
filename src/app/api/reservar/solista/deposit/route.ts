import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import { checkDateAvailability } from '@/lib/availability/atomicDateLockEngine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEPOSIT_CENTS = 10000;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

export async function POST(req: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: 'pagos_no_configurados' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2025-01-27.acacia' as never,
    });

    const body = await req.json();
    const { fecha, formato, distanciaKm, horaFin, totalEstimado, artistProfileId } = body;

    if (!fecha || typeof distanciaKm !== 'number') {
      return NextResponse.json(
        { error: 'Datos de reserva incompletos (fecha y distancia requeridas)' },
        { status: 400 }
      );
    }

    // ── W06-001 · GUARDIÁN ANTI-COLISIÓN ACID ──────────────────────────────
    // Verificación atómica de disponibilidad ANTES de materializar la sesión
    // Stripe. Impide que dos clientes reserven el mismo sábado.
    const availability = await checkDateAvailability({
      eventDate: fecha,
      artistProfileId:
        typeof artistProfileId === 'string' && artistProfileId.length > 0
          ? artistProfileId
          : undefined,
    });

    if (!availability.available) {
      return NextResponse.json(
        {
          error:
            'La fecha solicitada ya está comprometida por una reserva activa. Selecciona otro día o contacta por WhatsApp para la lista de espera prioritaria.',
          reason: availability.reason,
          conflictingBlockId: availability.conflictingBlockId,
          conflictingProductionId: availability.conflictingProductionId,
        },
        { status: 409 }
      );
    }

    const orderId = `EAR-SOLISTA-${Date.now()}`;
    const priceLockHash = crypto
      .createHash('sha256')
      .update(`${orderId}-${DEPOSIT_CENTS}-${fecha}-${stripeSecret}`)
      .digest('hex');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${BASE_URL}/reservar/solista?deposit=confirmado&order_id=${orderId}&lock=${priceLockHash.slice(0, 16)}`,
      cancel_url: `${BASE_URL}/reservar/solista?deposit=cancelado`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Depósito Vinculante de Reserva — ${formato === 'mariachi' ? 'Mariachi de Gala' : 'Solista S-Class'}`,
              description: `Bloqueo inmutable de fecha ${fecha} · Distancia ${distanciaKm} km · Fin ~${horaFin || 'N/D'} · Presupuesto total ${totalEstimado || 0} €`,
            },
            unit_amount: DEPOSIT_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        tipo: 'DEPOSITO_SOLISTA_S_CLASS',
        fecha,
        formato: formato || 'solista',
        distanciaKm: String(distanciaKm),
        horaFin: horaFin || '',
        totalEstimado: String(totalEstimado || 0),
        priceLockHash,
      },
    });

    // Despacho asíncrono al workflow n8n de Stripe Price-Lock (no bloqueante).
    // Garantiza que el depósito quede registrado en el CRM aunque el cliente
    // todavía no haya completado el pago en Stripe.
    fireAndForgetN8n('stripe-price-lock', {
      event: 'deposit_session_created',
      orderId,
      priceLockHash,
      fecha,
      formato: formato || 'solista',
      distanciaKm,
      horaFin: horaFin || '',
      totalEstimado: totalEstimado || 0,
      sessionId: session.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ url: session.url, orderId, priceLockHash });
  } catch (error: unknown) {
    console.error('[SOLISTA DEPOSIT ERROR]', error);
    return NextResponse.json(
      { error: 'Error al crear el depósito de reserva' },
      { status: 500 }
    );
  }
}