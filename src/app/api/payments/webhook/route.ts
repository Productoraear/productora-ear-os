import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { prisma } from '@/lib/prisma';

/**
 * 🌌 STRIPE WEBHOOK HANDLER - S-CLASS RESILIENCY ENGINE (V153)
 * Implements Proactive Idempotency Gating, Structured Logging and ACID splits.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ [ASTRA_WEBHOOK] [CRITICAL_ERROR] STRIPE_WEBHOOK_SECRET is missing.');
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ [ASTRA_WEBHOOK] [SECURITY_ALERT] Webhook signature validation failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`ℹ️ [ASTRA_WEBHOOK] [RECEIVED] Event Type: ${event.type}, ID: ${event.id}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const meta = session.metadata || {};
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    const idempotencyRef = `STRIPE-${session.id}`;

    // 1. Proactive Idempotency Gate
    try {
      const existingLedger = await prisma.commissionLedger.findUnique({
        where: { reference: idempotencyRef }
      });

      if (existingLedger) {
        console.log(`ℹ️ [ASTRA_WEBHOOK] [IDEMPOTENCY_HIT] Session ${session.id} was already processed. Terminating execution.`);
        return NextResponse.json({ received: true, status: 'SKIPPED_DUPLICATE' });
      }
    } catch (checkErr: any) {
      console.error(`⚠️ [ASTRA_WEBHOOK] [DB_CONN_FAILURE] Could not run idempotency check: ${checkErr.message}`);
      // Proceed under database transaction lock safety
    }

    // Smart Split V152: 80% Artística, 10% Infraestructura (EAR OS), 10% Retención Social (VIMUME)
    const infrastructureFee = amountTotal * 0.10;
    const socialRetained = amountTotal * 0.10;
    const artisticCut = amountTotal * 0.80;

    try {
      // 2. Transacción Prisma ACID S-Class (Consolidación contable e inventario en una única transacción atómica)
      await prisma.$transaction(async (tx) => {
        // A. Resolver/Crear el Cliente del Ledger (Fase 1: Fallback Cero)
        let finalUserId = meta.clientId || 'GUEST';
        let clientUser = null;
        
        if (finalUserId && finalUserId !== 'GUEST' && finalUserId !== 'sys-guest-fallback') {
          clientUser = await tx.user.findUnique({
            where: { id: finalUserId },
            select: { id: true, email: true }
          });
        }

        if (!clientUser && session.customer_details?.email) {
          const customerEmail = session.customer_details.email;
          
          const existingUser = await tx.user.findUnique({
            where: { email: customerEmail },
            select: { id: true }
          });
          
          if (existingUser) {
            clientUser = existingUser;
            finalUserId = existingUser.id;
          } else {
            const newTempUser = await tx.user.create({
              data: {
                email: customerEmail,
                displayName: session.customer_details.name || 'Cliente Invitado',
                role: 'EXPLORADOR'
              },
              select: { id: true }
            });
            clientUser = newTempUser;
            finalUserId = newTempUser.id;
          }
        }

        if (!clientUser) {
          const systemUser = await tx.user.findFirst({ select: { id: true } });
          if (systemUser) {
            finalUserId = systemUser.id;
          } else {
            const adminFallback = await tx.user.create({
              data: {
                email: 'escrow@productoraear.com',
                displayName: 'EAR OS Escrow Admin',
                role: 'COMMANDER'
              },
              select: { id: true }
            });
            finalUserId = adminFallback.id;
          }
        }

        // B. Registrar la transacción en CommissionLedger
        await tx.commissionLedger.create({
          data: {
            userId: finalUserId,
            amount: amountTotal,
            currency: session.currency?.toUpperCase() || 'EUR',
            status: 'PAID',
            stripeSessionId: session.id,
            notes: `Smart Split V152: EAR OS = ${infrastructureFee.toFixed(2)}€ | VIMUME = ${socialRetained.toFixed(2)}€ | Artista = ${artisticCut.toFixed(2)}€`,
            reference: idempotencyRef,
            sourceEvent: 'checkout.session.completed'
          }
        });

        // C. Actualizar Aura Wallet (ear_aura_wallets)
        const artistId = meta.artistId;
        let walletUserId = finalUserId;
        
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

        // D. Habilitar Waybill automático en fleet (FLEET OS dispatch sync)
        const originLabel = meta.origin || 'Madrid, España';
        const destinationLabel = meta.destination || 'Provincia Destino';
        
        const workspace = await tx.workspace.findFirst({ select: { id: true } });
        
        if (workspace) {
          const isUuid = (val: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);
          const verifiedArtistProfileId = artistId && isUuid(artistId) ? artistId : null;
          const verifiedProviderProfileId = artistId && isUuid(artistId) && !verifiedArtistProfileId ? artistId : null;

          await tx.waybill.create({
            data: {
              workspaceId: workspace.id,
              artistProfileId: verifiedArtistProfileId,
              providerProfileId: verifiedProviderProfileId,
              status: 'QUEUED',
              referenceCode: `WAY-${session.id}`,
              originLabel,
              destinationLabel,
              originLat: parseFloat(meta.originLat) || 40.416775,
              originLng: parseFloat(meta.originLng) || -3.703790,
              destinationLat: parseFloat(meta.destinationLat) || 40.416775,
              destinationLng: parseFloat(meta.destinationLng) || -3.703790,
              startsAt: new Date(),
              notes: `Waybill autogenerado por Stripe Connect Webhook. Artista ID: ${artistId}. Importe: ${amountTotal}€`
            }
          });
        }
      });

      console.log(`✨ [ASTRA_WEBHOOK] [SUCCESS] Database updates finalized for Session: ${session.id}`);

      // 3. Firestore Order Backup (Non-blocking, executed after main atomic writes)
      try {
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
      } catch (backupErr: any) {
        console.error(`⚠️ [ASTRA_WEBHOOK] [BACKUP_WARN] Firestore write failed: ${backupErr.message}`);
      }

      // 4. Telegram Notification
      try {
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
          `🚀 _EAR OS GOLD V153: Leviathan Ledger Active._`
        );
      } catch (tgErr: any) {
        console.error(`⚠️ [ASTRA_WEBHOOK] [TELEGRAM_WARN] Notification delivery failed: ${tgErr.message}`);
      }

    } catch (transactionErr: any) {
      console.error('❌ [ASTRA_WEBHOOK] [ACID_TRANSACTION_FAILED] Fatal error in processing webhook:', transactionErr.message);
      return NextResponse.json({ error: 'Database transaction failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
