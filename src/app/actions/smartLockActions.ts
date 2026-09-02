'use server';

import { prisma } from '@/lib/prisma';
import { PriceLockEngine } from '@/features/finance/engine/PriceLockEngine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface SmartLockCheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  smartLockId?: string;
  token?: string;
  urgencyBypassed?: boolean;
  error?: string;
}

export interface SmartLockStatusResult {
  success: boolean;
  isUnlocked: boolean;
  reason: 'PAID' | 'URGENCY_BYPASS' | 'LOCKED' | 'EXPIRED_WALLET' | 'NOT_FOUND';
  walletBalance?: number;
  expiresAt?: string;
  error?: string;
}

export interface LeadMagnetResult {
  success: boolean;
  eligible: boolean;
  message: string;
}

export interface PostExpiryChoiceResult {
  success: boolean;
  choice: 'WALLET_CREDIT' | 'EXTEND_24H';
  newExpiresAt?: string;
  walletBalance?: number;
  error?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// URGENCY CONSTANTS & HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CRISIS_KEYWORDS_REGEX = /cancelaci[oó]n|urgente|emergencia|sustituci[oó]n|fallo\s?dj|último\s?momento/i;

function isUrgencyP0(daysUntilEvent: number, rawText: string): boolean {
  return daysUntilEvent <= 7 || CRISIS_KEYWORDS_REGEX.test(rawText);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. CREATE SMART-LOCK CHECKOUT (Stripe 10 € Express / 150 € High-Ticket)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function createSmartLockCheckoutAction(input: {
  email: string;
  phone?: string;
  vertical: string;
  intentSlug: string;
  ipAddress?: string;
  daysUntilEvent?: number;
  rawText?: string;
  depositAmount?: number; // 10 EUR or 150 EUR
  eventDate?: string;
  location?: string;
  totalBudget?: number;
}): Promise<SmartLockCheckoutResult> {
  try {
    const daysUntilEvent = input.daysUntilEvent ?? 30;
    const rawText = input.rawText ?? '';
    const depositCents = Math.round((input.depositAmount || 150) * 100);
    const eventDate = input.eventDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    // Generate PriceLock quote token
    const quote = PriceLockEngine.generateQuote({
      serviceName: input.intentSlug,
      location: input.location || 'Madrid',
      eventDate,
      baseAmount: input.totalBudget || 1500,
      clientEmail: input.email,
      clientPhone: input.phone,
    });

    // ── URGENCY BYPASS P0: Si el evento es en < 7 días o es crisis, eliminar barrera ──
    if (isUrgencyP0(daysUntilEvent, rawText)) {
      try {
        const smartLock = await prisma.smartLock.create({
          data: {
            email: input.email,
            phone: input.phone,
            ipAddress: input.ipAddress,
            vertical: input.vertical,
            intentSlug: input.intentSlug,
            amountCents: 0,
            status: 'ACTIVE_LOCKED',
            urgencyBypassed: true,
            lockedAt: new Date(),
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72h
          },
        });

        return {
          success: true,
          smartLockId: smartLock.id,
          token: quote.token,
          urgencyBypassed: true,
        };
      } catch (dbErr) {
        console.warn('⚠️ [SMART_LOCK] Prisma bypass fallback:', dbErr);
        return {
          success: true,
          smartLockId: `URGENCY-${Date.now()}`,
          token: quote.token,
          urgencyBypassed: true,
        };
      }
    }

    // ── STANDARD FLOW: Create Stripe Checkout Session ──
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

    if (stripeApiKey && !stripeApiKey.includes('dummy')) {
      const stripe = (await import('stripe')).default;
      const stripeClient = new stripe(stripeApiKey, {
        apiVersion: '2025-06-30' as any,
      });

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: input.email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              unit_amount: depositCents,
              product_data: {
                name: 'EAR OS — Price-Lock 72h & Depósito de Bloqueo',
                description: `Bloqueo de agenda y reserva garantizada (72h) para ${input.vertical}/${input.intentSlug}. Descontable de la liquidación final con Split 80/10/10.`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: 'SMART_LOCK',
          vertical: input.vertical,
          intentSlug: input.intentSlug,
          email: input.email,
          phone: input.phone || '',
          quoteHash: quote.hash,
        },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&vertical=${encodeURIComponent(input.vertical)}&intent=${encodeURIComponent(input.intentSlug)}&token=${quote.token}`,
        cancel_url: `${baseUrl}/${encodeURIComponent(input.vertical)}/${encodeURIComponent(input.intentSlug)}?lock=cancelled`,
      });

      let smartLockId = `SL-${Date.now()}`;
      try {
        const smartLock = await prisma.smartLock.create({
          data: {
            email: input.email,
            phone: input.phone,
            ipAddress: input.ipAddress,
            vertical: input.vertical,
            intentSlug: input.intentSlug,
            stripeSessionId: session.id,
            amountCents: depositCents,
            status: 'PENDING_PAYMENT',
          },
        });
        smartLockId = smartLock.id;
      } catch (dbErr) {
        console.warn('⚠️ [SMART_LOCK] Prisma persist fallback:', dbErr);
      }

      return {
        success: true,
        checkoutUrl: session.url || undefined,
        smartLockId,
        token: quote.token,
        urgencyBypassed: false,
      };
    }

    // Direct fallback if Stripe key is in test/mock mode
    return {
      success: true,
      checkoutUrl: `${baseUrl}/checkout/presupuesto?token=${quote.token}`,
      smartLockId: `MOCK-${Date.now()}`,
      token: quote.token,
      urgencyBypassed: false,
    };
  } catch (error: any) {
    console.error('❌ createSmartLockCheckoutAction:', error);
    return { success: false, error: error.message };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. CONFIRM SMART-LOCK (After checkout or webhook)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function confirmSmartLockAction(
  stripeSessionId: string
): Promise<SmartLockStatusResult> {
  try {
    const lock = await prisma.smartLock.findUnique({
      where: { stripeSessionId },
    });

    if (!lock) {
      return { success: false, isUnlocked: false, reason: 'NOT_FOUND' };
    }

    if (lock.status === 'ACTIVE_LOCKED') {
      return {
        success: true,
        isUnlocked: true,
        reason: lock.urgencyBypassed ? 'URGENCY_BYPASS' : 'PAID',
        expiresAt: lock.expiresAt?.toISOString(),
      };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000); // +72h

    await prisma.smartLock.update({
      where: { stripeSessionId },
      data: {
        status: 'ACTIVE_LOCKED',
        lockedAt: now,
        expiresAt,
      },
    });

    return {
      success: true,
      isUnlocked: true,
      reason: 'PAID',
      expiresAt: expiresAt.toISOString(),
    };
  } catch (error: any) {
    console.error('❌ confirmSmartLockAction:', error);
    return { success: false, isUnlocked: false, reason: 'NOT_FOUND', error: error.message };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. CHECK SMART-LOCK STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function checkSmartLockStatusAction(
  email: string,
  vertical: string,
  intentSlug: string
): Promise<SmartLockStatusResult> {
  try {
    const lock = await prisma.smartLock.findFirst({
      where: {
        email,
        vertical,
        intentSlug,
        status: { in: ['ACTIVE_LOCKED', 'EXPIRED_WALLET', 'EXPIRED_EXTENDED'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!lock) {
      return { success: true, isUnlocked: false, reason: 'NOT_FOUND' };
    }

    if (lock.urgencyBypassed) {
      return { success: true, isUnlocked: true, reason: 'URGENCY_BYPASS' };
    }

    if (lock.expiresAt && new Date() > lock.expiresAt) {
      if (lock.walletBalance > 0) {
        return {
          success: true,
          isUnlocked: false,
          reason: 'EXPIRED_WALLET',
          walletBalance: lock.walletBalance,
        };
      }
      return { success: true, isUnlocked: false, reason: 'LOCKED' };
    }

    return {
      success: true,
      isUnlocked: true,
      reason: 'PAID',
      expiresAt: lock.expiresAt?.toISOString(),
    };
  } catch (error: any) {
    console.error('❌ checkSmartLockStatusAction:', error);
    return { success: false, isUnlocked: false, reason: 'NOT_FOUND', error: error.message };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. LEAD MAGNET DELIVERY (Anti-Abuse)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function deliverLeadMagnetAction(input: {
  email: string;
  ipAddress: string;
  vertical?: string;
}): Promise<LeadMagnetResult> {
  try {
    const existingByEmail = await prisma.leadMagnetLog.findUnique({
      where: { email: input.email },
    });

    if (existingByEmail) {
      return {
        success: true,
        eligible: false,
        message: 'Este email ya ha recibido el dossier acústico S-Class. Límite: 1 descarga por email.',
      };
    }

    const existingByIp = await prisma.leadMagnetLog.findUnique({
      where: { ipAddress: input.ipAddress },
    });

    if (existingByIp) {
      return {
        success: true,
        eligible: false,
        message: 'Esta dirección IP ya ha descargado el dossier. Límite: 1 descarga por dispositivo.',
      };
    }

    await prisma.leadMagnetLog.create({
      data: {
        email: input.email,
        ipAddress: input.ipAddress,
        vertical: input.vertical,
      },
    });

    await prisma.smartLock.updateMany({
      where: { email: input.email, status: 'PENDING_PAYMENT' },
      data: { recoveryEmailSent: true },
    });

    return {
      success: true,
      eligible: true,
      message: 'Dossier Acústico S-Class enviado al email. Lead Magnet entregado con éxito.',
    };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        success: true,
        eligible: false,
        message: 'Límite de Lead Magnet alcanzado para este email o IP.',
      };
    }
    console.error('❌ deliverLeadMagnetAction:', error);
    return { success: false, eligible: false, message: error.message };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. POST-EXPIRY FIDELIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function handlePostExpiryChoiceAction(
  smartLockId: string,
  choice: 'WALLET_CREDIT' | 'EXTEND_24H'
): Promise<PostExpiryChoiceResult> {
  try {
    const lock = await prisma.smartLock.findUnique({
      where: { id: smartLockId },
    });

    if (!lock) {
      return { success: false, choice, error: 'SmartLock no encontrado.' };
    }

    if (choice === 'WALLET_CREDIT') {
      const walletExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const creditAmount = lock.amountCents > 0 ? lock.amountCents / 100 : 10.0;

      await prisma.smartLock.update({
        where: { id: smartLockId },
        data: {
          status: 'EXPIRED_WALLET',
          walletBalance: creditAmount,
          walletExpiresAt,
        },
      });

      return {
        success: true,
        choice: 'WALLET_CREDIT',
        walletBalance: creditAmount,
      };
    }

    if (choice === 'EXTEND_24H') {
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.smartLock.update({
        where: { id: smartLockId },
        data: {
          status: 'EXPIRED_EXTENDED',
          expiresAt: newExpiresAt,
        },
      });

      return {
        success: true,
        choice: 'EXTEND_24H',
        newExpiresAt: newExpiresAt.toISOString(),
      };
    }

    return { success: false, choice, error: 'Opción no reconocida.' };
  } catch (error: any) {
    console.error('❌ handlePostExpiryChoiceAction:', error);
    return { success: false, choice, error: error.message };
  }
}
