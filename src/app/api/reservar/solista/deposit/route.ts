import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build',
  { apiVersion: '2025-01-27.acacia' as any }
);

const DEPOSIT_CENTS = 10000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fecha, formato, distanciaKm, horaFin, totalEstimado } = body;

    if (!fecha || typeof distanciaKm !== 'number') {
      return NextResponse.json(
        { error: 'Datos de reserva incompletos (fecha y distancia requeridas)' },
        { status: 400 }
      );
    }

    const orderId = `EAR-SOLISTA-${Date.now()}`;
    const priceLockHash = crypto
      .createHash('sha256')
      .update(`${orderId}-${DEPOSIT_CENTS}-${fecha}-${process.env.STRIPE_SECRET_KEY || 'dev'}`)
      .digest('hex');

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://productoraear.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${origin}/reservar/solista?deposit=confirmado&order_id=${orderId}&lock=${priceLockHash.slice(0, 16)}`,
      cancel_url: `${origin}/reservar/solista?deposit=cancelado`,
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

    return NextResponse.json({ url: session.url, orderId, priceLockHash });
  } catch (error: any) {
    console.error('[SOLISTA DEPOSIT ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el depósito de reserva' },
      { status: 500 }
    );
  }
}