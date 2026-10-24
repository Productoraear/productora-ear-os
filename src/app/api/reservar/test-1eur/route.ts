import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { stripe } from '@/lib/payments';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TEST_DEPOSIT_CENTS = 100; // 1,00 €

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientPhone = String(body.clientPhone || '659116376').trim();
    const clientName = String(body.clientName || 'Cliente VIP').trim();
    const eventDate = String(body.eventDate || '2026-10-31').trim();
    const format = 'Edwin Agudelo (Solista Premium con pistas de estudio)';
    const clientSignatureData = typeof body.signature === 'string' ? body.signature.slice(0, 500) : 'BIOMETRIC_PRE_VERIFIED';

    const orderId = `EAR-VIP-1EUR-${Date.now()}`;
    const secretSeed = process.env.STRIPE_SECRET_KEY || 'ear_os_price_lock_seed';
    
    // Hash inmutable SHA-256 del contrato bilateral
    const contractSha256 = crypto
      .createHash('sha256')
      .update(`${orderId}:${clientPhone}:${eventDate}:${format}:${TEST_DEPOSIT_CENTS}:${clientSignatureData}:${secretSeed}`)
      .digest('hex');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

    // Crear sesión de Stripe Checkout real de 1,00 €
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${baseUrl}/reservar/test-1eur?status=success&orderId=${orderId}&hash=${contractSha256.slice(0, 16)}`,
      cancel_url: `${baseUrl}/reservar/test-1eur?status=cancelled&orderId=${orderId}`,
      customer_email: body.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ? body.email : undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Bloqueo Price-Lock 1,00 € · Edwin Agudelo (${eventDate})`,
              description: `Contrato Pre-Firmado · Solista Premium con pistas de estudio · Tel: ${clientPhone} · Hash: ${contractSha256.slice(0, 12)}`,
              images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'],
            },
            unit_amount: TEST_DEPOSIT_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        type: 'TEST_1EUR_PRICE_LOCK_CONTRACT',
        clientPhone,
        clientName,
        eventDate,
        format,
        contractSha256,
        depositAmountEur: '1.00',
        split: '80_ARTIST_10_INFRA_10_VIMUME',
      },
    });

    // Despacho no bloqueante al clúster n8n
    fireAndForgetN8n('stripe-price-lock', {
      event: 'test_1eur_session_created',
      orderId,
      contractSha256,
      clientPhone,
      clientName,
      eventDate,
      format,
      sessionId: session.id,
      checkoutUrl: session.url,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      orderId,
      contractSha256,
      checkoutUrl: session.url,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creando sesión de test 1€';
    console.error('[API TEST 1EUR ERROR]', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
