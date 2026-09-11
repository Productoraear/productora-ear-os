import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { calculateSovereignSplit } from '@/lib/atmosphere-matcher';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummyBuildBypass', {
  apiVersion: '2025-02-24' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Configuración o firma de Stripe ausente' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error de firma invalida';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const amountInEuros = paymentIntent.amount / 100;

    // Split 80/10/10
    const split = calculateSovereignSplit(amountInEuros);

    // Registro del ingreso repartido en la base de datos
    const supplierId = paymentIntent.metadata?.supplier_id;
    if (supplierId) {
      await supabase.from('sourcing_suppliers').update({
        paid_amount: split.supplierShare,
        metadata: {
          ear_os_commission: split.earOsShare,
          vimume_commission: split.vimumeShare,
          stripe_payment_id: paymentIntent.id,
          processed_at: new Date().toISOString(),
        },
      }).eq('id', supplierId);
    }
  }

  return NextResponse.json({ received: true });
}

