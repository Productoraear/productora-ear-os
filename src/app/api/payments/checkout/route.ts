import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';

/**
 * 🏛️ STRIPE CHECKOUT - S-CLASS FINANCIAL ENGINE (V141)
 * Inyecta metadata de Split, Golden Cohort y B2G para el CommissionLedger.
 */
export async function POST(req: Request) {
  try {
    const { amount, concept, metadata: clientMeta } = await req.json();

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

    // Cálculo del Split 80/10/10
    const totalCents = Math.round(Number(amount) * 100);
    const platformFeeCents = Math.round(totalCents * 0.10);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: concept || 'Inversión S-Class EAR OS',
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        source: 'EAR_OS_GOLD_V141',
        concept: concept || 'S-Class',
        venue_id: clientMeta?.venue_id || '',
        is_b2g: clientMeta?.is_b2g ? 'true' : 'false',
        artist_tier: clientMeta?.artist_tier || '',
        split_platform: String(platformFeeCents),
        split_affiliate: String(Math.round(totalCents * 0.10)),
        split_provider: String(Math.round(totalCents * 0.80)),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cotizador`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('STRIKE_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
