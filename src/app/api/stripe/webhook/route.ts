import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build',
  {
    apiVersion: '2026-07-29.dahlia',
  }
);

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const clientEmail = session.customer_email ?? 'unknown';
      const amountCents = session.amount_total ?? 1000;
      const metadata = session.metadata ?? {};

      console.log(
        `[STRIPE WEBHOOK] checkout.session.completed | email=${clientEmail} | amount=${amountCents} | vertical=${metadata.vertical} | intent=${metadata.intentSlug}`
      );

      // Persistencia idempotente en SmartLock (Price-Lock 72h)
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        const lockedAt = new Date();
        const expiresAt = new Date(lockedAt.getTime() + 72 * 60 * 60 * 1000);

        await prisma.smartLock.upsert({
          where: { stripeSessionId: session.id },
          update: {
            status: 'ACTIVE_LOCKED',
            amountCents,
            lockedAt,
            expiresAt,
          },
          create: {
            email: clientEmail,
            vertical: metadata.vertical ?? 'bodas',
            intentSlug: metadata.intentSlug ?? 'madrid-precios-musica-directo',
            stripeSessionId: session.id,
            amountCents,
            status: 'ACTIVE_LOCKED',
            lockedAt,
            expiresAt,
          },
        });
        await prisma.$disconnect();
      } catch (dbErr) {
        console.warn('[STRIPE WEBHOOK] DB persist skipped:', dbErr instanceof Error ? dbErr.message : dbErr);
      }

      return NextResponse.json({ received: true });
    }

    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(`[STRIPE WEBHOOK] payment_intent.succeeded | id=${pi.id} | amount=${pi.amount}`);
      return NextResponse.json({ received: true });
    }

    default:
      return NextResponse.json({ received: true, ignored: event.type });
  }
}