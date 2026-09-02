import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';

/**
 * 🏛️ STRIPE CHECKOUT - S-CLASS FINANCIAL ENGINE (V141)
 * Desglose explícito de presupuesto, concepto, aforo, provincia y split 80/10/10.
 */
export async function POST(req: Request) {
  try {
    const { amount, concept, metadata: clientMeta } = await req.json();

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

    // Cálculo del Split 80/10/10
    const totalCents = Math.round(Number(amount) * 100);
    const platformFeeCents = Math.round(totalCents * 0.10);

    const productName = clientMeta?.productName || concept || `Reserva & Bloqueo de Fecha S-Class (${amount} €)`;
    
    // Descripción estructurada sin perder contexto
    const productDesc = clientMeta?.description || (
      clientMeta?.serviceName 
        ? `${clientMeta.serviceName} (${clientMeta.finalTotal || 0} €) • ${clientMeta.occasion || 'Evento'} | ${clientMeta.pax || 150} PAX | ${clientMeta.province || 'Madrid'} | Hash: ${clientMeta.sha256Token || '72H-LOCK'}`
        : `Garantía de Bloqueo de Fecha 72h • Productora EAR • Hash: ${clientMeta?.sha256Token || '72H-LOCK'}`
    );

    // Protocolo Hold & Ping: Pre-autorización bancaria de 7 días (capture_method: manual)
    const isHoldAndPing = clientMeta?.hold_and_ping === true || clientMeta?.hold_and_ping === 'true';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: isHoldAndPing 
                ? `[HOLD & PING 7 DÍAS] Bloqueo de 100,00 € con verificación asíncrona de disponibilidad • ${productDesc}`
                : productDesc,
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: isHoldAndPing ? {
        capture_method: 'manual',
        description: `EAR OS Hold & Ping Protocol — Preautorización 7 días (${productName})`,
        metadata: {
          hold_and_ping: 'true',
          venue_phone: clientMeta?.venue_phone || '',
          venue_name: clientMeta?.venue_name || '',
          event_date: clientMeta?.event_date || '',
        }
      } : undefined,
      metadata: {
        source: 'EAR_OS_GOLD_V141',
        concept: concept || 'S-Class',
        service_name: clientMeta?.serviceName || '',
        occasion: clientMeta?.occasion || '',
        province: clientMeta?.province || 'Madrid',
        pax: String(clientMeta?.pax || 150),
        final_total: String(clientMeta?.finalTotal || 0),
        deposit_amount: String(amount || 0),
        sha256_token: clientMeta?.sha256Token || '',
        venue_id: clientMeta?.venue_id || '',
        is_b2g: clientMeta?.is_b2g ? 'true' : 'false',
        artist_tier: clientMeta?.artist_tier || '',
        hold_and_ping: isHoldAndPing ? 'true' : 'false',
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
