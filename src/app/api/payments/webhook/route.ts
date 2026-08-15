import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2026-07-29.dahlia',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_for_build';
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('⚠️ Webhook Signature Verification failed:', err?.message);
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
          // 1. Registrar entrada en Commission Ledger
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

          console.log(`📊 [LEDGER] Registrado split 80/10/10 para sesión ${session.id}`);
        }
      } catch (dbError) {
        console.warn('⚠️ [STRIPE WEBHOOK] Error al registrar en Prisma Ledger (Modo Resiliencia):', dbError);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💳 [STRIPE WEBHOOK] PaymentIntent succeeded: ${paymentIntent.id}`);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      console.error(`❌ [STRIPE WEBHOOK] PaymentIntent failed: ${paymentIntentFailed.id}`);
      break;
    }

    default:
      console.log(`ℹ️ [STRIPE WEBHOOK] Evento no procesado: ${event.type}`);
  }

  return NextResponse.json({ received: true, eventType: event.type }, { status: 200 });
}