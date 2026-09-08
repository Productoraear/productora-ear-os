import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';

export async function POST(req: Request) {
  try {
    const { amount, concept } = await req.json();

    let finalAmount = amount || 100;
    
    // Security: Price-Lock
    if (process.env.NODE_ENV === 'production') {
      finalAmount = 100;
    }

    const totalCents = Math.round(Number(finalAmount) * 100);
    const platformFeeCents = Math.round(totalCents * 0.10);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'eur',
      description: concept || 'EAR OS Concierge Reservation',
      metadata: {
        source: 'EAR_CONCIERGE_CMD_K',
        split_platform: String(platformFeeCents),
        split_affiliate: String(Math.round(totalCents * 0.10)),
        split_provider: String(Math.round(totalCents * 0.80)),
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('PAYMENT_INTENT_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
