import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('⚠️ Webhook Signature Verification failed.', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
switch (event.type) {
case 'payment_intent.succeeded':
  const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
  console.log(`PaymentIntent for ${paymentIntentSucceeded.id} succeeded!`);
    break;
case 'payment_intent.payment_failed':
  const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
  console.error(`PaymentIntent for ${paymentIntentFailed.id} failed.`);
  // Handle failure logic here
    break;
case 'invoice.payment_succeeded':
  const invoiceSucceeded = event.data.object as Stripe.Invoice;
  console.log(`Invoice for ${invoiceSucceeded.number} succeeded!`);
    break;
case 'invoice.payment_failed':
  const invoiceFailed = event.data.object as Stripe.Invoice;
  console.error(`Invoice for ${invoiceFailed.number} failed.`);
  // Handle failure logic here
    break;
  default:
    console.warn(`Unhandled event type: ${event.type}`);
}

  return NextResponse.json({ success: true }, { status: 200 });
}