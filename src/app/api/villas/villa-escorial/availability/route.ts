import { NextRequest, NextResponse } from 'next/server';
import { getVillaEscorialTelemetry, calculateCustomStayPrice } from '@/lib/villas/villa-escorial-sync';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('refresh') === 'true';
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    const telemetry = await getVillaEscorialTelemetry(force);

    // Si se consulta un rango de fechas personalizado
    if (checkIn && checkOut) {
      const calculation = calculateCustomStayPrice(checkIn, checkOut, telemetry.occupiedDates);
      return NextResponse.json({
        success: true,
        calculation,
        telemetry
      });
    }

    return NextResponse.json({
      success: true,
      telemetry
    });
  } catch (err: any) {
    console.error('[API-VILLA-ESCORIAL] Error obteniendo disponibilidad:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error sincronizando calendario' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingMode = 'WEEKEND', // 'WEEKEND' | 'CUSTOM_STAY'
      weekendId,
      checkInDate,
      checkOutDate,
      clientName,
      clientEmail,
      clientPhone,
      notes
    } = body;

    const telemetry = await getVillaEscorialTelemetry();

    let stayLabel = '';
    let totalPrice = 4500;
    let depositPrice = 500;
    let datesSummary = '';

    if (bookingMode === 'WEEKEND') {
      const slot = telemetry.availableWeekends.find(w => w.weekendId === weekendId);
      if (!slot) {
        return NextResponse.json(
          { success: false, error: 'Fin de semana no encontrado en el calendario' },
          { status: 404 }
        );
      }
      if (!slot.isAvailable) {
        return NextResponse.json(
          { success: false, error: 'El fin de semana seleccionado ya se encuentra ocupado' },
          { status: 400 }
        );
      }
      stayLabel = `Fin de Semana de Gala (${slot.label})`;
      totalPrice = slot.totalPriceEur;
      datesSummary = `${slot.fridayDate} al ${slot.sundayDate}`;
    } else {
      // Estancia personalizada anual (entre semana, semanas completas o eventos)
      if (!checkInDate || !checkOutDate) {
        return NextResponse.json(
          { success: false, error: 'Debes indicar fecha de entrada y salida' },
          { status: 400 }
        );
      }
      const calc = calculateCustomStayPrice(checkInDate, checkOutDate, telemetry.occupiedDates);
      if (!calc.isAvailable) {
        return NextResponse.json(
          { success: false, error: 'Una o varias fechas seleccionadas no están disponibles' },
          { status: 400 }
        );
      }
      stayLabel = `Estancia de ${calc.totalNights} Noches (${checkInDate} al ${checkOutDate})`;
      totalPrice = calc.totalPriceEur;
      datesSummary = `${checkInDate} al ${checkOutDate} (${calc.totalNights} noches)`;
    }

    // Configuración Stripe para el depósito de 500 € Price-Lock
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: clientEmail,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Reserva Villa Escorial Park: ${stayLabel}`,
                description: `Bloqueo de estancia (${datesSummary}). Total estancia: ${totalPrice.toLocaleString('es-ES')} €. Señal de fianza/reserva: ${depositPrice} €.`,
                images: ['https://img.amplistay.com/villaescorialpark/la-villa:hero/1784796941217-3-IMG-20230327-WA0004.jpg']
              },
              unit_amount: depositPrice * 100 // 500.00 EUR
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        metadata: {
          type: 'VILLA_ESCORIAL_RESERVATION',
          bookingMode,
          stayLabel,
          datesSummary,
          totalPrice: String(totalPrice),
          deposit: String(depositPrice),
          clientName: clientName || '',
          clientPhone: clientPhone || '',
          clientEmail: clientEmail || '',
          notes: notes || ''
        },
        success_url: `${req.nextUrl.origin}/fincas/villa-escorial-park?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.nextUrl.origin}/fincas/villa-escorial-park?status=cancelled`
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
        totalPrice,
        depositPrice,
        stayLabel
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Pre-reserva registrada con éxito. Edwin Agudelo contactará de inmediato para formalizar la fianza de 500 €.',
      totalPrice,
      depositPrice,
      stayLabel
    });
  } catch (err: any) {
    console.error('[API-VILLA-ESCORIAL] Error iniciando reserva:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error procesando solicitud de reserva' },
      { status: 500 }
    );
  }
}
