import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { prisma } from '@/lib/prisma';

/**
 * 🌌 STRIPE WEBHOOK HANDLER - S-CLASS FINANCIAL ENGINE (V141)
 * Registra el Split 80/10/10 en el CommissionLedger con trazabilidad forense.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ CRITICAL_ERROR: STRIPE_WEBHOOK_SECRET is missing.');
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ SECURITY_VIGILANTE: Webhook signature failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

    if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const meta = session.metadata || {};
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    // Smart Split V152: 80% Artística, 10% Infraestructura (EAR OS), 10% Retención Social (VIMUME)
    const infrastructureFee = amountTotal * 0.10;
    const socialRetained = amountTotal * 0.10;
    const artisticCut = amountTotal * 0.80;

    try {
      // 1. Firestore Order (Legacy / Backup)
      await addDoc(collection(db, 'ear_orders'), {
        sessionId: session.id,
        amount: amountTotal,
        currency: session.currency,
        status: 'PAID',
        client: session.customer_details?.email || 'Desconocido',
        metadata: meta,
        split: { infrastructureFee, socialRetained, artisticCut },
        createdAt: serverTimestamp(),
      });

      // 2. CommissionLedger (Prisma/Supabase)
      try {
        await prisma.commissionLedger.create({
          data: {
            userId: 'SYSTEM_ESCROW',
            amountTotal,
            amountUser: artisticCut,
            currency: session.currency?.toUpperCase() || 'EUR',
            platformFee: infrastructureFee,
            affiliateFee: socialRetained, // Mapeado internamente como retención social/VIMUME
            providerCut: artisticCut,
            status: 'SETTLED',
            type: 'SPLIT',
            stripePaymentId: session.payment_intent || session.id,
            metadata: {
              ui_template: meta.ui_template,
              provincia: meta.provincia,
              is_b2g: meta.is_b2g,
              artist_tier: meta.artist_tier,
              concept: meta.concept,
              source: meta.source,
              engine_version: 'V152_LEVIATHAN'
            },
          },
        });
      } catch (ledgerErr) {
        console.error('⚠️ LEDGER_WRITE_FAILED (non-blocking):', ledgerErr);
      }

      // 3. Telemetría Telegram
      const currency = session.currency?.toUpperCase() || 'EUR';
      const email = session.customer_details?.email || 'Anónimo';
      const splitStatus = `EAR OS: ${infrastructureFee}€ | VIMUME: ${socialRetained}€ | Artista: ${artisticCut}€`;

      await sendTelegramNotification(
        `💰 *NUEVA VENTA S-CLASS CONFIRMADA*\n\n` +
        `👤 *Cliente:* ${email}\n` +
        `💵 *Monto:* ${amountTotal} ${currency}\n` +
        `📊 *Smart Split:* ${splitStatus}\n` +
        `🌍 *Provincia:* ${meta.provincia || 'No especificada'}\n` +
        `🎨 *UI:* ${meta.ui_template || 'No especificada'}\n` +
        `🏛️ *B2G:* ${meta.is_b2g === 'true' ? 'SÍ' : 'NO'}\n` +
        `🆔 *Sesión:* \`${session.id}\`\n\n` +
        `🚀 _EAR OS GOLD V152: Leviathan Ledger Active._`
      );

    } catch (dbErr) {
      console.error('❌ Error guardando orden:', dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
