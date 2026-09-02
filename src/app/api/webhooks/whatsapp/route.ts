import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 🏛️ META WHATSAPP BUSINESS WEBHOOK HANDLER
 * ==========================================
 * 1. GET: Verificación criptográfica del Webhook de Meta Developers (Handshake).
 * 2. POST: Recepción de eventos de entrega (sent, delivered, read) y respuestas de proveedores.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'EAR_OS_WHATSAPP_SECRET_2026_SCLASS';

  console.log(`📡 [WHATSAPP_WEBHOOK GET] Handshake recibido: mode=${mode}, token=${token ? token.substring(0, 8) + '...' : 'none'}`);

  // Verificación requerida por Meta
  if (mode === 'subscribe' && token === expectedToken) {
    console.log('✅ [WHATSAPP_WEBHOOK] Handshake de verificación de Meta aceptado (HTTP 200).');
    return new Response(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  console.warn('❌ [WHATSAPP_WEBHOOK] Handshake rechazado. Token inválido o modo incorrecto.');
  return new Response('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Verificación de estructura básica de Meta
    if (rawBody.object === 'whatsapp_business_account') {
      const entries = rawBody.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          const value = change.value || {};

          // 1. Mensajes entrantes de proveedores
          if (value.messages && value.messages.length > 0) {
            for (const msg of value.messages) {
              const from = msg.from;
              const textBody = msg.text?.body || msg.button?.text || '';
              const msgType = msg.type;

              console.log(`📩 [WHATSAPP INBOUND] Mensaje de ${from} (${msgType}): "${textBody}"`);

              // Heurística de confirmación rápida
              const normalized = textBody.toLowerCase().trim();
              if (normalized.includes('si') || normalized.includes('confirm') || normalized.includes('ok') || normalized.includes('acepto')) {
                console.log(`🎉 [HOLD_CONFIRMED] Proveedor ${from} ha respondido positivamente.`);
              }
            }
          }

          // 2. Estados de entrega (sent, delivered, read)
          if (value.statuses && value.statuses.length > 0) {
            for (const st of value.statuses) {
              const id = st.id;
              const status = st.status;
              const recipientId = st.recipient_id;
              console.log(`📊 [WHATSAPP STATUS] Mensaje ${id} a ${recipientId} -> ${status}`);
            }
          }
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
  } catch (err: any) {
    console.error('❌ [WHATSAPP_WEBHOOK POST ERROR]', err.message);
    return NextResponse.json({ error: 'INTERNAL_ERROR', details: err.message }, { status: 200 });
  }
}
