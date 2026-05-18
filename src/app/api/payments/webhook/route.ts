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

      // 2. Transacción Prisma ACID S-Class (Fase 2: Real-time Wallet Ledger & Dispatch)
      try {
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

          // Si es un invitado ("GUEST") o no se encontró el usuario, y Stripe proporciona email
          if (!clientUser && session.customer_details?.email) {
            const customerEmail = session.customer_details.email;
            
            // Buscar si ya existe un usuario con ese email
            const existingUser = await tx.user.findUnique({
              where: { email: customerEmail },
              select: { id: true }
            });
            
            if (existingUser) {
              clientUser = existingUser;
              finalUserId = existingUser.id;
            } else {
              // Crear cliente temporal seguro en base de datos para trazabilidad limpia
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

          // Fallback a primer usuario de sistema si no hay email (resguardo para no romper la BD, sin alterar ledger)
          if (!clientUser) {
            const systemUser = await tx.user.findFirst({ select: { id: true } });
            if (systemUser) {
              finalUserId = systemUser.id;
            } else {
              // Creación de emergencia
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
              reference: `STRIPE-${session.id}`,
              sourceEvent: 'checkout.session.completed'
            }
          });

          // C. Actualizar Aura Wallet (ear_aura_wallets)
          const artistId = meta.artistId;
          let walletUserId = finalUserId; // Default al pagador
          
          if (artistId && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(artistId)) {
            // Es un UUID de base de datos
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

          // Upsert del Wallet asociado en PostgreSQL
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
          
          // Buscar primer Workspace activo para asignarlo obligatoriamente (evitar violaciones referenciales)
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
      } catch (ledgerErr) {
        console.error('❌ LEDGER_WRITE_TRANSACTION_FAILED:', ledgerErr);
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
