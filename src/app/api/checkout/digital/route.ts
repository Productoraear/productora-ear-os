import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import { OccasionCategory, MusicalGenre, EmotionalTone } from '@/lib/types/digital-products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

const OCCASION_NAMES: Record<OccasionCategory, string> = {
  cumpleanos: 'Cumpleaños Especial',
  aniversario: 'Aniversario de Pareja',
  boda_votos: 'Votos Nupciales Cantados',
  boda_baile: 'Primer Baile Nupcial',
  bodas_oro_plata: 'Bodas de Oro / Plata',
  pedida_mano: 'Pedida de Mano Sorpresa',
  jubilacion: 'Homenaje de Jubilación',
  homenaje_padres: 'Día de la Madre / Padre',
  in_memoriam: 'In Memoriam (Tributo a la Memoria)',
  agradecimiento: 'Carta de Gratitud Eterna'
};

const GENRE_NAMES: Record<MusicalGenre, string> = {
  ranchera: 'Ranchera Imperial (Mariachi de Gala)',
  bolero: 'Bolero Clásico Romántico',
  balada: 'Balada de Autor',
  crossover_lirico: 'Crossover Sinfónico (Tenor Lírico)',
  pop_acustico: 'Pop Acústico Íntimo (Piano & Cuerdas)',
  vals_matrimonial: 'Vals Matrimonial Ceremonial',
  rumba_fiesta: 'Rumba Festiva & Fusión'
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ocasion,
      genero,
      tono,
      protagonista,
      quienRegala,
      detalles,
      videoUpsell,
      expressUpsell,
      karaokeUpsell
    } = body;

    if (!protagonista || !detalles) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const basePrice = 4900;
    const videoPrice = videoUpsell ? 4900 : 0;
    const expressPrice = expressUpsell ? 2900 : 0;
    const karaokePrice = karaokeUpsell ? 1500 : 0;
    const totalAmount = basePrice + videoPrice + expressPrice + karaokePrice;

    const orderId = `EAR-SONG-${Date.now()}`;
    const priceLockHash = crypto
      .createHash('sha256')
      .update(`${orderId}-${totalAmount}-${process.env.STRIPE_SECRET_KEY || 'dev'}`)
      .digest('hex');

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007';

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Canción de Autor: ${OCCASION_NAMES[ocasion as OccasionCategory] || 'Personalizada'}`,
            description: `Género: ${GENRE_NAMES[genero as MusicalGenre] || genero} | Para: ${protagonista} (De: ${quienRegala || 'Anónimo'})`,
          },
          unit_amount: basePrice,
        },
        quantity: 1,
      }
    ];

    if (videoUpsell) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Videoclip Cinemático S-Class con Fotografías',
            description: 'Montaje de estudio con etalonaje, transiciones y subtítulos sincronizados',
          },
          unit_amount: videoPrice,
        },
        quantity: 1,
      });
    }

    if (expressUpsell) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Producción Prioritaria Express 24h',
            description: 'Grabación y mezcla preferente en cabina con entrega en menos de 24 horas',
          },
          unit_amount: expressPrice,
        },
        quantity: 1,
      });
    }

    if (karaokeUpsell) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Pista Instrumental Sin Voz (Karaoke HD)',
            description: 'Audio masterizado sin la voz solista para interpretación personal en directo',
          },
          unit_amount: karaokePrice,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${origin}/boda/reserva-confirmada?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/encargos?status=cancelled`,
      line_items: lineItems,
      metadata: {
        orderId,
        tipo: 'CANCIÓN_DIGITAL_AUTOR',
        protagonista,
        ocasion,
        genero,
        tono,
        priceLockHash
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE DIGITAL ERROR]', error);
    return NextResponse.json({ error: error.message || 'Error en pasarela de checkout' }, { status: 500 });
  }
}
