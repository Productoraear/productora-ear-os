import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';

export const runtime = 'nodejs';

/**
 * 🏛️ STRIPE CHECKOUT - S-CLASS FINANCIAL ENGINE (V141)
 * Desglose explícito de presupuesto, concepto, aforo, provincia y split 80/10/10.
 */
export async function POST(req: Request) {
  try {
    let { amount, concept, metadata: clientMeta } = await req.json();

    // 🛡️ SECURITY BLINDAJE: Validación de importes según tipología de producto
    const isFianzaAlquiler = clientMeta?.type === 'FIANZA_ALQUILER' || clientMeta?.isFianza === true;
    const isTripwire = clientMeta?.type === 'TRIPWIRE' || Number(amount) === 1 || Number(amount) === 10;

    if (process.env.NODE_ENV === 'production') {
      if (isFianzaAlquiler) {
        // Fianza mínima del 50% del valor del equipo (mínimo de seguridad 50,00 €)
        if (Number(amount) < 50) {
          console.warn(`[SECURITY] Fianza inferior al mínimo de 50 €. Forzando 50 €. Original: ${amount}`);
          amount = 50;
        }
      } else if (isTripwire) {
        // Micro-conversión 1€ o 10€
        if (Number(amount) !== 1 && Number(amount) !== 10) {
          amount = 1;
        }
      } else {
        // Price-Lock inmutable de 100 € para artistas y reservas de fecha
        if (Number(amount) !== 100) {
          console.warn(`[SECURITY] Forzando depósito Price-Lock canónico de 100 €. Original: ${amount}`);
          amount = 100;
        }
      }
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

    // Cálculo del Split 80/10/10
    const totalCents = Math.round(Number(amount || 100) * 100);
    const platformFeeCents = Math.round(totalCents * 0.10);

    const productName = clientMeta?.productName || concept || `Reserva & Bloqueo de Fecha S-Class (${amount} €)`;
    
    // Protocolo Hold & Ping: Pre-autorización bancaria de 7 días (capture_method: manual)
    const isHoldAndPing = clientMeta?.hold_and_ping === true || clientMeta?.hold_and_ping === 'true';

    // Descripción estructurada sin perder contexto
    const productDesc = clientMeta?.description || (
      clientMeta?.serviceName 
        ? `${clientMeta.serviceName} (${clientMeta.finalTotal || 0} €) • ${clientMeta.occasion || 'Evento'} | ${clientMeta.pax || 150} PAX | ${clientMeta.province || 'Madrid'} | Hash: ${clientMeta.sha256Token || '72H-LOCK'}`
        : `Garantía de Bloqueo de Fecha 72h • Productora EAR • Hash: ${clientMeta?.sha256Token || '72H-LOCK'}`
    );

    let stripeLineItems: any[] = [];

    if (isFianzaAlquiler && clientMeta?.includeRental && clientMeta?.dailyPrice) {
      const rentalCents = Math.round(Number(clientMeta.dailyPrice) * 100);
      const fianzaCents = Math.round(Number(clientMeta.fianzaAmount || amount) * 100);
      stripeLineItems = [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Alquiler: ${clientMeta.itemName || 'Equipo de Sonido'} (${clientMeta.eventDate || 'Fecha Confirmada'})`,
              description: `Tarifa oficial de alquiler por jornada • Productora EAR • Calibración técnica RTA`,
            },
            unit_amount: rentalCents,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Fianza Reembolsable de Custodia (50% Mínimo)`,
              description: `Depósito en custodia temporal. Reembolso íntegro automático en 48h tras revisión técnica (Protocolo Fotográfico Amovens).`,
            },
            unit_amount: fianzaCents,
          },
          quantity: 1,
        }
      ];
    } else if (isFianzaAlquiler) {
      const fianzaCents = Math.round(Number(amount) * 100);
      stripeLineItems = [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Fianza Reembolsable de Alquiler (50% Mínimo): ${clientMeta?.itemName || 'Equipo'}`,
              description: `Tarifa diaria de alquiler: ${clientMeta?.dailyPrice || 0} €/día • Fianza del 50%: ${amount} € • Devolución en 48h con fotos de entrega (Protocolo Amovens).`,
            },
            unit_amount: fianzaCents,
          },
          quantity: 1,
        }
      ];
    } else {
      stripeLineItems = [
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
      ];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
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
    console.error('❌ [STRIPE POST CHECKOUT ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error iniciando Checkout Stripe' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const amountParam = urlObj.searchParams.get('amount') || '100';
    const concept = urlObj.searchParams.get('concept') || 'Reserva & Bloqueo de Fecha S-Class (100 €)';
    const ref = urlObj.searchParams.get('ref') || '';
    const hash = urlObj.searchParams.get('hash') || '';
    const serviceName = urlObj.searchParams.get('serviceName') || 'Contratación Directa S-Class';

    let amount = Number(amountParam) || 100;
    if (process.env.NODE_ENV === 'production' && amount !== 100 && amount !== 50 && amount !== 1) {
      amount = 100;
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';
    const totalCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: concept,
              description: `Depósito de Reserva & Price-Lock SHA-256 (${ref || 'DIRECT'}) • ${serviceName}`,
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      metadata: {
        source: 'EAR_OS_GET_CHECKOUT',
        concept,
        ref,
        sha256_token: hash,
        service_name: serviceName,
        deposit_amount: String(amount)
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cotizador`,
    });

    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }

    return NextResponse.json({ error: 'No se pudo generar la URL de Stripe Checkout' }, { status: 500 });

  } catch (error: any) {
    console.error('❌ [STRIPE GET CHECKOUT ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error en enlace de Checkout' }, { status: 500 });
  }
}