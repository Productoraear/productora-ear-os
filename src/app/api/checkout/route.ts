import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-01-27.acacia' as any, 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productionEventId } = body;

    if (!productionEventId) {
      return NextResponse.json({ error: 'Falta productionEventId' }, { status: 400 });
    }

    const event = await prisma.productionEvent.findUnique({
      where: { id: productionEventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    // BALA DE PLATA 1: STRIPE METADATA BYPASS
    // En lugar de inyectar 43 servicios (que excedería 50 llaves/500 chars), 
    // pasamos únicamente el ID de producción.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/success?session_id={CHECKOUT_SESSION_ID}&production_id=${productionEventId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/dashboard/production/${productionEventId}`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: event.title || 'Producción EAR OS',
              description: 'Servicio Multi-Operador S-Class',
            },
            unit_amount: Math.round(event.totalBudget * 100), // en céntimos
          },
          quantity: 1,
        },
      ],
      metadata: {
        productionEventId: event.id, // <-- Bypass: Solo el ID. El Webhook se encarga del resto.
        clientEmail: event.clientEmail || '',
        schemaVersion: 'omega-s-class'
      }
    });

    // Actualizamos estado en base de datos
    await prisma.productionEvent.update({
      where: { id: event.id },
      data: {
        status: 'CHECKOUT_SESSION_CREATED',
        metadata: {
          checkoutSessionId: session.id
        }
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('[API/checkout] Stripe Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
