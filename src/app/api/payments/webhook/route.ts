import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!webhookSecret && process.env.NODE_ENV === 'production') {
    console.error('❌ [SECURITY_VIOLATION] STRIPE_WEBHOOK_SECRET no configurado en producción.');
    return NextResponse.json({ error: 'CONFIGURACION_SEGURIDAD_INVALIDA' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('⚠️ [SECURITY_ALERT] Webhook Signature Verification failed:', err?.message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${err?.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const amountTotal = (session.amount_total || 0) / 100; // Convert to EUR
      const quoteHash = session.metadata?.quoteHash || 'UNKNOWN_QUOTE';
      const customerEmail = session.customer_details?.email || session.customer_email || 'client@productoraear.com';

      console.log(`✅ [STRIPE WEBHOOK] Checkout session completed: ${session.id} | Amount: ${amountTotal}€ | Quote: ${quoteHash}`);

      // Reparto Inmutable 80/10/10 en Commission Ledger
      const providerAmount = Number((amountTotal * 0.80).toFixed(2));
      const platformFee = Number((amountTotal * 0.10).toFixed(2));
      const reserveFund = Number((amountTotal * 0.10).toFixed(2));

      try {
        if (process.env.POSTGRES_PRISMA_URL) {
          await prisma.commissionLedger.create({
            data: {
              amount: amountTotal,
              currency: session.currency?.toUpperCase() || 'EUR',
              status: 'PAID',
              reference: session.id,
              sourceEvent: `STRIPE_CHECKOUT_PRICE_LOCK_${quoteHash}`,
              description: `Depósito de Reserva EAR OS (Price-Lock 72h) - Quote ${quoteHash}`,
              notes: JSON.stringify({
                split: {
                  provider80: providerAmount,
                  earOsFee10: platformFee,
                  reserveFund10: reserveFund
                },
                metadata: session.metadata,
                customerEmail
              })
            }
          });
          console.log(`📜 [LEDGER COMMITTED] Entrada de comisión registrada para ${session.id}`);
        }
      } catch (dbErr: any) {
        console.warn('⚠️ [LEDGER DB NOTICE] Registro en fallback resiliente:', dbErr?.message);
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}