import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type StripeSession = Stripe.Checkout.Session & {
  customer_details?: { email?: string | null; name?: string | null } | null;
  customer_email?: string | null;
  metadata?: Record<string, string | null>;
  amount_total?: number | null;
};

/**
 * Normalizes email address formatting for strict matching.
 */
function getEmailFromSession(session: StripeSession): string | null {
  const email = 
    session.customer_details?.email?.trim().toLowerCase() ||
    session.customer_email?.trim().toLowerCase() ||
    null;
  return email;
}

/**
 * 🌌 STRIPE WEBHOOK HANDLER - S-CLASS RESILIENCY ENGINE (V153.FUSION)
 * Implements Proactive Idempotency Gating, Deterministic Guest Identity, and Unified ACID Transaction.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ [ASTRA_WEBHOOK] [CRITICAL_ERROR] STRIPE_WEBHOOK_SECRET is missing.');
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ [ASTRA_WEBHOOK] [SECURITY_ALERT] Webhook signature validation failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  }

  const session = event.data.object as StripeSession;
  const meta = session.metadata || {};
  const idempotencyRef = `STRIPE-${session.id}`;
  const amountTotal = (session.amount_total ?? 0) / 100;

  // 1. Proactive Idempotency Gate
  try {
    const existingLedger = await prisma.commissionLedger.findUnique({
      where: { reference: idempotencyRef },
      select: { id: true }
    });

    if (existingLedger) {
      console.log(`ℹ️ [ASTRA_WEBHOOK] [IDEMPOTENCY_HIT] Session ${session.id} was already processed. Terminating execution.`);
      return NextResponse.json({ received: true, status: 'SKIPPED_DUPLICATE' }, { status: 200 });
    }
  } catch (checkErr: any) {
    console.error(`⚠️ [ASTRA_WEBHOOK] [DB_CONN_FAILURE] Could not run idempotency check: ${checkErr.message}`);
  }

  // Smart Split V152: 80% Artística, 10% Infraestructura (EAR OS), 10% Retención Social (VIMUME)
  const infrastructureFee = amountTotal * 0.10;
  const socialRetained = amountTotal * 0.10;
  const artisticCut = amountTotal * 0.80;

  try {
    // 2. Deterministic Identity Resolution (Fase 1: Resolving/Creating Guest User)
    const resolvedUserId = await prisma.$transaction(async (tx) => {
      // A. Try internal metadata clientId matching
      if (meta.clientId) {
        const existingUser = await tx.user.findUnique({
          where: { id: meta.clientId },
          select: { id: true }
        });
        if (existingUser) return existingUser.id;
      }

      // B. Resolve by Stripe Checkout email details
      const email = getEmailFromSession(session);
      if (!email) {
        throw new Error('Unable to resolve guest identity from Stripe session');
      }

      const existingByEmail = await tx.user.findUnique({
        where: { email },
        select: { id: true }
      });
      if (existingByEmail) return existingByEmail.id;

      // C. Create guest user with explicit CLIENT role & rank mapping
      const newTempUser = await tx.user.create({
        data: {
          email,
          displayName: meta.clientName || session.customer_details?.name || 'Cliente Invitado',
          role: 'CLIENT',
          rank: 'NIVEL_0_EXPLORADOR'
        },
        select: { id: true }
      });
      return newTempUser.id;
    });

    // 3. Consolidated Transactional ACID Writes (Ledger, Wallet and Waybill dispatch)
    const result = await prisma.$transaction(async (tx) => {
      // A. B2B / CommissionLedger Registration
      const ledger = await tx.commissionLedger.create({
        data: {
          userId: resolvedUserId,
          amount: amountTotal,
          currency: session.currency?.toUpperCase() || 'EUR',
          status: 'PAID',
          stripeSessionId: session.id,
          notes: `Smart Split V152: EAR OS = ${infrastructureFee.toFixed(2)}€ | VIMUME = ${socialRetained.toFixed(2)}€ | Artista = ${artisticCut.toFixed(2)}€`,
          reference: idempotencyRef,
          sourceEvent: 'checkout.session.completed'
        },
        select: { id: true }
      });

      // B. Wallet Balance Increment
      const artistId = meta.artistId;
      let walletUserId = resolvedUserId;

      if (artistId && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(artistId)) {
        const artistProfile = await tx.artistProfile.findUnique({
          where: { id: artistId },
          select: { userId: true }
        });
        if (artistProfile) {
          walletUserId = artistProfile.userId;
        } else {
          const providerProfile = await tx.providerProfile.findUnique({
            where: { id: artistId },
            select: { userId: true }
          });
          if (providerProfile && providerProfile.userId) {
            walletUserId = providerProfile.userId;
          }
        }
      }

      await tx.auraWallet.upsert({
        where: { userId: walletUserId },
        create: {
          userId: walletUserId,
          balance: artisticCut,
          currency: session.currency?.toUpperCase() || 'EUR'
        },
        update: {
          balance: {
            increment: artisticCut
          }
        }
      });

      // C. Logistics Waybill Dispatch
      const workspace = await tx.workspace.findFirst({ select: { id: true } });
      let waybillId = null;

      if (workspace) {
        const isUuid = (val: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);
        const verifiedArtistProfileId = artistId && isUuid(artistId) ? artistId : null;
        const verifiedProviderProfileId = artistId && isUuid(artistId) && !verifiedArtistProfileId ? artistId : null;

        const waybill = await tx.waybill.create({
          data: {
            workspaceId: workspace.id,
            artistProfileId: verifiedArtistProfileId,
            providerProfileId: verifiedProviderProfileId,
            status: 'QUEUED',
            referenceCode: `WAY-${session.id}`,
            originLabel: meta.origin || 'Madrid, España',
            destinationLabel: meta.destination || 'Provincia Destino',
            originLat: meta.originLat ? parseFloat(meta.originLat) : 40.416775,
            originLng: meta.originLng ? parseFloat(meta.originLng) : -3.703790,
            destinationLat: meta.destinationLat ? parseFloat(meta.destinationLat) : 40.416775,
            destinationLng: meta.destinationLng ? parseFloat(meta.destinationLng) : -3.703790,
            startsAt: new Date(),
            notes: `Waybill autogenerado por Stripe Connect Webhook. Artista ID: ${artistId}. Importe: ${amountTotal}€`
          },
          select: { id: true }
        });
        waybillId = waybill.id;
      }

      return { ledgerId: ledger.id, waybillId };
    });

    console.log(`✨ [ASTRA_WEBHOOK] [SUCCESS] Deterministic transactions finalized. User ID: ${resolvedUserId}`);

    // 4. Async Firestore Order Backup (Non-blocking telemetry log)
    try {
      await addDoc(collection(db, 'ear_orders'), {
        sessionId: session.id,
        amount: amountTotal,
        currency: session.currency,
        status: 'PAID',
        client: getEmailFromSession(session) || 'Desconocido',
        metadata: meta,
        split: { infrastructureFee, socialRetained, artisticCut },
        createdAt: serverTimestamp(),
      });
    } catch (backupErr: any) {
      console.error(`⚠️ [ASTRA_WEBHOOK] [BACKUP_WARN] Firestore write failed: ${backupErr.message}`);
    }

    // 5. Async Telegram Notification dispatch
    try {
      const currency = session.currency?.toUpperCase() || 'EUR';
      const email = getEmailFromSession(session) || 'Anónimo';
      const splitStatus = `EAR OS: ${infrastructureFee.toFixed(2)}€ | VIMUME: ${socialRetained.toFixed(2)}€ | Artista: ${artisticCut.toFixed(2)}€`;

      await sendTelegramNotification(
        `💰 *NUEVA VENTA S-CLASS CONFIRMADA (GUEST DETECTED)*\n\n` +
        `👤 *Cliente:* ${email}\n` +
        `💵 *Monto:* ${amountTotal} ${currency}\n` +
        `📊 *Smart Split:* ${splitStatus}\n` +
        `🌍 *Destino:* ${meta.destination || 'No especificado'}\n` +
        `🏆 *ID Contable:* \`${result.ledgerId}\`\n` +
        `🚛 *Waybill:* \`${result.waybillId || 'No despachado (Falta Workspace)'}\`\n\n` +
        `🚀 _EAR OS GOLD V153: Leviathan Ledger Deterministic Active._`
      );
    } catch (tgErr: any) {
      console.error(`⚠️ [ASTRA_WEBHOOK] [TELEGRAM_WARN] Notification delivery failed: ${tgErr.message}`);
    }

    return NextResponse.json({
      received: true,
      status: 'PROCESSED',
      userId: resolvedUserId,
      ...result
    });

  } catch (transactionErr: any) {
    console.error('❌ [ASTRA_WEBHOOK] [ACID_TRANSACTION_FAILED] Fatal error in processing webhook:', transactionErr.message);
    return NextResponse.json({ error: `Database transaction failed: ${transactionErr.message}` }, { status: 500 });
  }
}
