import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import { checkDateAvailability } from '@/lib/availability/atomicDateLockEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 🔒 FAIL-CLOSED STRIPE (BLINDAJE SESSION_SECRET P0): sin secreto real, el módulo NO se instancia.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_dummy_key_for_build') {
  throw new Error('[ARTIST_DEPOSIT] STRIPE_SECRET_KEY no configurado en el servidor (fail-closed).');
}

const stripe = new Stripe(
  STRIPE_SECRET_KEY,
  { apiVersion: '2025-01-27.acacia' as any }
);

const DEPOSIT_CENTS = 10000; // 100,00 € inmutable S-Class Price-Lock

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      artistId,
      artistName,
      fecha,
      horaTramo,
      formato,
      distanciaKm = 0,
      municipio = '',
      totalEstimado = 350
    } = body;

    if (!fecha || !artistName) {
      return NextResponse.json(
        { error: 'Datos de reserva incompletos (fecha y artista requeridos)' },
        { status: 400 }
      );
    }

    // 1. Chequeo atómico de disponibilidad por franja horaria (Anti-colisión)
    const availability = await checkDateAvailability({
      eventDate: fecha,
      artistProfileId: artistId || undefined,
      timeSlot: horaTramo || undefined
    });

    if (!availability.available) {
      const reasonMsg =
        availability.reason === 'MAX_DAILY_CAP_REACHED'
          ? `El artista ya ha alcanzado el límite ético de 6 actuaciones para el ${fecha}. Por favor, selecciona otra fecha.`
          : `El tramo de las ${horaTramo || 'seleccionado'} para el ${fecha} ya ha sido reservado. Las demás franjas de este día siguen disponibles.`;

      return NextResponse.json({ error: reasonMsg, availability }, { status: 409 });
    }

    // 2. Generación del Price-Lock SHA-256
    const orderId = `EAR-ARTIST-${Date.now()}`;
    const priceLockHash = crypto
      .createHash('sha256')
      .update(`${orderId}-${DEPOSIT_CENTS}-${fecha}-${horaTramo || ''}-${STRIPE_SECRET_KEY}`)
      .digest('hex');

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://productoraear.com';

    // 3. Creación de la sesión de Stripe Checkout (100 €)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${origin}/boda/reserva-confirmada?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&tipo=artista`,
      cancel_url: `${origin}/artistas`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Bloqueo de Tramo (100 €) — ${artistName}`,
              description: `Pase ${horaTramo || 'Horario a confirmar'} · Fecha ${fecha} · ${formato || 'Formato Estándar'} · Total estimado ${totalEstimado} € · Margen de +30 min buffer logístico`,
            },
            unit_amount: DEPOSIT_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        tipo: 'DEPOSITO_ARTISTA_TRAMO',
        artistId: String(artistId || ''),
        artistName: String(artistName),
        fecha: String(fecha),
        horaTramo: String(horaTramo || ''),
        bufferMinutes: '30',
        formato: String(formato || 'Solista'),
        municipio: String(municipio || ''),
        distanciaKm: String(distanciaKm),
        totalEstimado: String(totalEstimado || 0),
        priceLockHash,
      },
    });

    return NextResponse.json({ url: session.url, orderId, priceLockHash });
  } catch (error: any) {
    console.error('[ARTIST DEPOSIT ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Error al iniciar el depósito de reserva de artista' },
      { status: 500 }
    );
  }
}
