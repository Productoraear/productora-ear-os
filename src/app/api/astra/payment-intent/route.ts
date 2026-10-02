import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sanitización del concepto (nunca reflejar strings crudos sin recortar)
    const concept: string =
      typeof body?.concept === 'string'
        ? body.concept.trim().slice(0, 120)
        : 'EAR OS Concierge Reservation';

    // Price-Lock inmutable: el depósito canónico es 100,00 € en producción.
    let finalAmount = 100;
    if (process.env.NODE_ENV !== 'production') {
      const parsed = Number(body?.amount);
      if (Number.isFinite(parsed) && parsed > 0 && parsed <= 100000) {
        finalAmount = parsed;
      }
    }

    const totalCents = Math.round(finalAmount * 100);
    const platformFeeCents = Math.round(totalCents * 0.10);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'eur',
      description: concept,
      metadata: {
        source: 'EAR_CONCIERGE_CMD_K',
        split_platform: String(platformFeeCents),
        split_affiliate: String(Math.round(totalCents * 0.10)),
        split_provider: String(Math.round(totalCents * 0.80)),
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    console.error('PAYMENT_INTENT_ERROR:', error);
    return NextResponse.json({ error: 'No se pudo procesar el pago. Inténtelo de nuevo.' }, { status: 500 });
  }
}
