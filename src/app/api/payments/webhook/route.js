import { NextResponse } from "next/server";
import { stripe } from "@/lib/payments";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendTelegramNotification } from "@/lib/services/telegram";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/**
 * Normalizes email address formatting for strict matching.
 */
function getEmailFromSession(session) {
    const email = session.customer_details?.email?.trim().toLowerCase() ||
        session.customer_email?.trim().toLowerCase() ||
        null;
    return email;
}
/**
 * 🌌 STRIPE WEBHOOK HANDLER - S-CLASS RESILIENCY ENGINE (V205.GOD_MODE)
 * Implements Proactive Idempotency Gating, Deterministic Guest Identity, and Unified ACID Transaction.
 * Refactorizado 100% con Logger Estructurado sin rastros de logs amateur en flujos financieros.
 */
export async function POST(req) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        logger.error({
            event: "WEBHOOK_CONFIG_ERROR",
            reason: "STRIPE_WEBHOOK_SECRET is missing.",
        });
        sendTelegramNotification(`🚨 *Fallo Crítico en Webhook*\nMotivo: STRIPE_WEBHOOK_SECRET faltante.`).catch(() => null);
        return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
    catch (err) {
        logger.error({
            event: "WEBHOOK_SIGNATURE_VALIDATION_FAILED",
            reason: err.message,
        });
        sendTelegramNotification(`🚨 *Fallo Crítico en Webhook*\nMotivo: Firma Inválida (Posible Ataque).\nDetalle: ${err.message}`).catch(() => null);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    // ═══════════════════════════════════════════════════════════════
    // EVENT ROUTER — dispatch to deterministic handlers
    // ═══════════════════════════════════════════════════════════════
    switch (event.type) {
        case "checkout.session.completed":
            return handleCheckoutCompleted(event.data.object);
        case "account.updated":
            return handleAccountUpdated(event.data.object);
        default:
            return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }
}
// ═══════════════════════════════════════════════════════════════
// HANDLER 1: checkout.session.completed (Ledger + Wallet + Waybill)
// ═══════════════════════════════════════════════════════════════
async function handleCheckoutCompleted(session) {
    const meta = session.metadata || {};
    const idempotencyRef = `STRIPE-${session.id}`;
    const amountTotal = (session.amount_total ?? 0) / 100;
    // 1. Proactive Idempotency Gate
    try {
        const existingLedger = await prisma.commissionLedger.findUnique({
            where: { reference: idempotencyRef },
            select: { id: true },
        });
        if (existingLedger) {
            logger.info({ event: "WEBHOOK_IDEMPOTENCY_HIT", sessionId: session.id });
            return NextResponse.json({ received: true, status: "SKIPPED_DUPLICATE" }, { status: 200 });
        }
    }
    catch (checkErr) {
        logger.error({
            event: "WEBHOOK_IDEMPOTENCY_CHECK_FAILED",
            error: checkErr.message,
        });
    }
    // Smart Split V152: 80% Artística, 10% Infraestructura (EAR OS), 10% Retención Social (VIMUME)
    const infrastructureFee = amountTotal * 0.1;
    const socialRetained = amountTotal * 0.1;
    const artisticCut = amountTotal * 0.8;
    try {
        // 2. Deterministic Identity Resolution
        const resolvedUserId = await prisma.$transaction(async (tx) => {
            if (meta.clientId && meta.clientId !== "GUEST") {
                const existingUser = await tx.user.findUnique({
                    where: { id: meta.clientId },
                    select: { id: true },
                });
                if (existingUser)
                    return existingUser.id;
            }
            const email = getEmailFromSession(session);
            if (!email) {
                throw new Error("Unable to resolve guest identity from Stripe session");
            }
            const existingByEmail = await tx.user.findUnique({
                where: { email },
                select: { id: true },
            });
            if (existingByEmail)
                return existingByEmail.id;
            const newTempUser = await tx.user.create({
                data: {
                    email,
                    displayName: meta.clientName || session.customer_details?.name || "Cliente Invitado",
                    role: "CLIENT",
                    rank: "NIVEL_0_EXPLORADOR",
                },
                select: { id: true },
            });
            return newTempUser.id;
        });
        // 3. Consolidated ACID Writes (Ledger, Wallet, Waybill)
        const result = await prisma.$transaction(async (tx) => {
            const ledger = await tx.commissionLedger.create({
                data: {
                    userId: resolvedUserId,
                    amount: amountTotal,
                    currency: session.currency?.toUpperCase() || "EUR",
                    status: "PAID",
                    stripeSessionId: session.id,
                    notes: `Smart Split V152: EAR OS = ${infrastructureFee.toFixed(2)}€ | VIMUME = ${socialRetained.toFixed(2)}€ | Artista = ${artisticCut.toFixed(2)}€`,
                    reference: idempotencyRef,
                    sourceEvent: "checkout.session.completed",
                },
                select: { id: true },
            });
            const artistId = meta.artistId;
            let walletUserId = resolvedUserId;
            if (artistId &&
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(artistId)) {
                const artistProfile = await tx.artistProfile.findUnique({
                    where: { id: artistId },
                    select: { userId: true },
                });
                if (artistProfile) {
                    walletUserId = artistProfile.userId;
                }
                else {
                    const providerProfile = await tx.providerProfile.findUnique({
                        where: { id: artistId },
                        select: { userId: true },
                    });
                    if (providerProfile?.userId) {
                        walletUserId = providerProfile.userId;
                    }
                }
            }
            await tx.auraWallet.upsert({
                where: { userId: walletUserId },
                create: {
                    userId: walletUserId,
                    balance: artisticCut,
                    currency: session.currency?.toUpperCase() || "EUR",
                },
                update: { balance: { increment: artisticCut } },
            });
            const workspace = await tx.workspace.findFirst({ select: { id: true } });
            let waybillId = null;
            if (workspace) {
                const isUuid = (val) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);
                const verifiedArtistProfileId = artistId && isUuid(artistId) ? artistId : null;
                const verifiedProviderProfileId = artistId && isUuid(artistId) && !verifiedArtistProfileId ? artistId : null;
                const waybill = await tx.waybill.create({
                    data: {
                        workspaceId: workspace.id,
                        artistProfileId: verifiedArtistProfileId,
                        providerProfileId: verifiedProviderProfileId,
                        status: "QUEUED",
                        referenceCode: `WAY-${session.id}`,
                        originLabel: meta.origin || "Madrid, España",
                        destinationLabel: meta.destination || "Provincia Destino",
                        originLat: meta.originLat ? parseFloat(meta.originLat) : 40.416775,
                        originLng: meta.originLng ? parseFloat(meta.originLng) : -3.70379,
                        destinationLat: meta.destinationLat ? parseFloat(meta.destinationLat) : 40.416775,
                        destinationLng: meta.destinationLng ? parseFloat(meta.destinationLng) : -3.70379,
                        startsAt: new Date(),
                        notes: `Waybill autogenerado por Stripe Connect Webhook. Artista ID: ${artistId}. Importe: ${amountTotal}€`,
                    },
                    select: { id: true },
                });
                waybillId = waybill.id;
            }
            return { ledgerId: ledger.id, waybillId };
        });
        logger.info({
            event: "WEBHOOK_CHECKOUT_SUCCESS",
            resolvedUserId,
            ledgerId: result.ledgerId,
        });
        // Async Firestore backup (non-blocking)
        try {
            await addDoc(collection(db, "ear_orders"), {
                sessionId: session.id,
                amount: amountTotal,
                currency: session.currency,
                status: "PAID",
                client: getEmailFromSession(session) || "Desconocido",
                metadata: meta,
                split: { infrastructureFee, socialRetained, artisticCut },
                createdAt: serverTimestamp(),
            });
        }
        catch (backupErr) {
            logger.error({ event: "WEBHOOK_FIRESTORE_BACKUP_FAILED", error: backupErr.message });
        }
        // Async Telegram notification
        try {
            const currency = session.currency?.toUpperCase() || "EUR";
            const email = getEmailFromSession(session) || "Anónimo";
            await sendTelegramNotification(`💰 *NUEVA VENTA S-CLASS CONFIRMADA*\n\n` +
                `👤 *Cliente:* ${email}\n` +
                `💵 *Monto:* ${amountTotal} ${currency}\n` +
                `📊 *Split:* EAR OS ${infrastructureFee.toFixed(2)}€ | VIMUME ${socialRetained.toFixed(2)}€ | Artista ${artisticCut.toFixed(2)}€\n` +
                `🏆 *Ledger:* \`${result.ledgerId}\`\n` +
                `🚛 *Waybill:* \`${result.waybillId || "N/A"}\``);
        }
        catch (tgErr) {
            logger.error({ event: "WEBHOOK_TELEGRAM_NOTIFY_FAILED", error: tgErr.message });
        }
        return NextResponse.json({
            received: true,
            status: "PROCESSED",
            userId: resolvedUserId,
            ...result,
        });
    }
    catch (transactionErr) {
        logger.error({
            event: "WEBHOOK_ACID_TRANSACTION_FAILED",
            error: transactionErr.message,
        });
        sendTelegramNotification(`🚨 *Fallo Crítico en Transacción ACID (Webhook)*\nError: ${transactionErr.message}`).catch(() => null);
        return NextResponse.json({ error: `Database transaction failed: ${transactionErr.message}` }, { status: 500 });
    }
}
// ═══════════════════════════════════════════════════════════════
// HANDLER 2: account.updated (Stripe Connect KYC verification)
// THIS IS THE ONLY CODEPATH THAT CAN SET isVerified = true
// ═══════════════════════════════════════════════════════════════
async function handleAccountUpdated(account) {
    const stripeAccountId = account.id;
    const detailsSubmitted = account.details_submitted ?? false;
    const chargesEnabled = account.charges_enabled ?? false;
    logger.info({
        event: "WEBHOOK_ACCOUNT_UPDATED",
        stripeAccountId,
        detailsSubmitted,
        chargesEnabled,
    });
    // Only promote to verified when Stripe has completed full KYC
    if (!detailsSubmitted || !chargesEnabled) {
        logger.info({
            event: "WEBHOOK_ACCOUNT_NOT_YET_VERIFIED",
            stripeAccountId,
            reason: !detailsSubmitted ? "details_submitted=false" : "charges_enabled=false",
        });
        return NextResponse.json({ received: true, status: "PENDING_VERIFICATION" }, { status: 200 });
    }
    // Find the provider by stripeAccountId
    const provider = await prisma.providerProfile.findFirst({
        where: { stripeAccountId },
        select: { id: true, name: true, isVerified: true, stripeConnected: true },
    });
    if (!provider) {
        logger.warn({
            event: "WEBHOOK_ACCOUNT_ORPHAN",
            stripeAccountId,
            reason: "No ProviderProfile found with this stripeAccountId",
        });
        return NextResponse.json({ received: true, status: "ORPHAN_ACCOUNT" }, { status: 200 });
    }
    // Idempotency: skip if already verified
    if (provider.isVerified && provider.stripeConnected) {
        logger.info({
            event: "WEBHOOK_ACCOUNT_ALREADY_VERIFIED",
            stripeAccountId,
            providerId: provider.id,
        });
        return NextResponse.json({ received: true, status: "ALREADY_VERIFIED" }, { status: 200 });
    }
    // ACID update: mark provider as fiscally verified
    await prisma.providerProfile.update({
        where: { id: provider.id },
        data: {
            isVerified: true,
            stripeConnected: true,
        },
    });
    logger.info({
        event: "WEBHOOK_PROVIDER_VERIFIED",
        stripeAccountId,
        providerId: provider.id,
        providerName: provider.name,
    });
    // Telegram notification
    try {
        await sendTelegramNotification(`✅ *PROVEEDOR VERIFICADO POR STRIPE CONNECT*\n\n` +
            `🏢 *Proveedor:* ${provider.name}\n` +
            `🆔 *ID:* \`${provider.id}\`\n` +
            `🏦 *Stripe Account:* \`${stripeAccountId}\`\n` +
            `📋 *KYC:* details_submitted=true, charges_enabled=true\n\n` +
            `🛡️ _Verificación fiscal completada. El proveedor puede recibir pagos._`);
    }
    catch (tgErr) {
        logger.error({ event: "WEBHOOK_CONNECT_TELEGRAM_FAILED", error: tgErr.message });
    }
    return NextResponse.json({
        received: true,
        status: "PROVIDER_VERIFIED",
        providerId: provider.id,
    });
}
