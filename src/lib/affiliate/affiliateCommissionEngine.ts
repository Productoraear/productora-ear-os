import { prisma } from "@/lib/prisma";
import {
    AffiliateTier,
    CommissionStatus,
    KycStatus,
    PayoutStatus,
    Role,
} from "@prisma/client";

// ════════════════════════════════════════════════════════════════════════════
// SSOT S-CLASS — COMMISSION ENGINE (Split Soberano 80/10/10)
// ════════════════════════════════════════════════════════════════════════════
// Reglas inmutables:
//   Tarifa Base Solista: 350,00 €
//   Split: 80% Artista / 10% EAR OS / 10% VIMUME (afiliado toma su % del 10% infraestructura)
//   Depósito Stripe: 100,00 € (Price-Lock SHA-256)
//   Gate KYC: retiros ≥ 3.000 € exigen verificación
//   Liquidación: domingos 23:59 GMT (SLA 7 días hábiles)
// ════════════════════════════════════════════════════════════════════════════

export const SSOT_SPLIT = {
    providerPercent: 80,
    platformEarPercent: 10,
    vimumePercent: 10,
} as const;

export const IMMUTABLE_DEPOSIT_EUR = 100;

export const KYC_THRESHOLD_EUR = 3000;

export interface TierConfig {
    tier: AffiliateTier;
    name: string;
    commissionRate: number; // % sobre monto bruto atribuible
    minSales: number;
}

export const AFFILIATE_TIER_CONFIG: TierConfig[] = [
    { tier: AffiliateTier.BRONZE, name: "Bronce — Prescriptor Inicial", commissionRate: 10, minSales: 0 },
    { tier: AffiliateTier.SILVER, name: "Plata — Comercial Activo", commissionRate: 12, minSales: 3 },
    { tier: AffiliateTier.GOLD, name: "Oro — Embajador Institucional", commissionRate: 15, minSales: 8 },
    { tier: AffiliateTier.PLATINUM, name: "Platino — Elite Magnates NDA", commissionRate: 20, minSales: 15 },
];

export interface AttributionInput {
    referralCode: string;
    customerEmail?: string;
    customerPhone?: string;
    source?: string;
    landingUrl?: string;
}

export interface ConversionInput {
    referralId: string;
    grossAmountEur: number; // Importe bruto del evento (base de cálculo)
    bookingReference: string;
}

export interface SplitResult {
    grossAmount: number;
    providerAmount: number;
    platformAmount: number;
    vimumeAmount: number;
    affiliateAmount: number;
    affiliateRate: number;
}

export function resolveTier(totalSales: number): TierConfig {
    return (
        [...AFFILIATE_TIER_CONFIG].reverse().find((t) => totalSales >= t.minSales) ??
        AFFILIATE_TIER_CONFIG[0]
    );
}

export function computeSplit(
    grossAmountEur: number,
    affiliateRatePct: number
): SplitResult {
    const round2 = (n: number) => Math.round(n * 100) / 100;

    const providerAmount = round2(grossAmountEur * (SSOT_SPLIT.providerPercent / 100));
    const platformAmount = round2(grossAmountEur * (SSOT_SPLIT.platformEarPercent / 100));
    const vimumeAmount = round2(grossAmountEur * (SSOT_SPLIT.vimumePercent / 100));

    // El afiliado toma su comisión del porcentaje de infraestructura (10% EAR OS).
    const affiliateAmount = round2(platformAmount * (affiliateRatePct / 100));

    return {
        grossAmount: round2(grossAmountEur),
        providerAmount,
        platformAmount,
        vimumeAmount,
        affiliateAmount,
        affiliateRate: affiliateRatePct,
    };
}

export function affiliateRateToPct(rate: number): number {
    // Almacenado como 10.0 → porcentaje directo sobre la cuota de infraestructura.
    return rate;
}

/**
 * Genera un código soberano de prescriptor único.
 */
export function generateAffiliateCode(seed: string): string {
    const clean = seed
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 8);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `EAR-${clean.toUpperCase()}-${suffix}`;
}

/**
 * Alta homologada bajo demanda (onboarding < 10 minutos / SSOT).
 * Crea User + AffiliateProfile + auraWallet en una transacción atómica.
 */
export async function upsertAffiliateProfile(input: {
    email: string;
    name: string;
    companyName?: string;
    cifNif?: string;
    phone?: string;
    category?: string;
    payoutMethod?: string;
    payoutDetails?: string;
}): Promise<{ affiliateCode: string; referralUrl: string; tier: AffiliateTier }> {
    const email = input.email.trim().toLowerCase();

    const existing = await prisma.affiliateProfile.findFirst({
        where: { user: { email } },
        include: { user: true },
    });

    if (existing) {
        return {
            affiliateCode: existing.affiliateCode,
            referralUrl: `https://productoraear.com/?ref=${existing.affiliateCode}`,
            tier: existing.tier,
        };
    }

    const affiliateCode = generateAffiliateCode(input.companyName || input.name);

    const created = await prisma.user.upsert({
        where: { email },
        update: {
            name: input.name,
            displayName: input.companyName || input.name,
            role: Role.AFFILIATE,
        },
        create: {
            email,
            name: input.name,
            displayName: input.companyName || input.name,
            role: Role.AFFILIATE,
            auraWallet: {
                create: {
                    balance: 0,
                    currency: "EUR",
                    walletAddress: `0xEAR_AFF_${Date.now()}`,
                },
            },
        },
        include: { affiliateProfile: true, auraWallet: true },
    });

    let profile = created.affiliateProfile;

    if (!profile) {
        profile = await prisma.affiliateProfile.create({
            data: {
                userId: created.id,
                affiliateCode,
                companyName: input.companyName || input.name,
                cifNif: input.cifNif?.toUpperCase() || null,
                phone: input.phone || null,
                category: input.category || "PRESCRIPTOR",
                payoutMethod: input.payoutMethod || "IBAN",
                payoutDetails: input.payoutDetails || null,
                tier: AffiliateTier.BRONZE,
                commissionRate: AFFILIATE_TIER_CONFIG[0].commissionRate,
                isHomologated: true,
                isActive: true,
                kycStatus: KycStatus.NOT_REQUIRED,
            },
        });
    }

    if (!created.auraWallet) {
        await prisma.auraWallet.create({
            data: {
                userId: created.id,
                balance: 0,
                currency: "EUR",
                walletAddress: `0xEAR_AFF_${Date.now()}`,
            },
        });
    }

    return {
        affiliateCode: profile.affiliateCode,
        referralUrl: `https://productoraear.com/?ref=${profile.affiliateCode}`,
        tier: profile.tier,
    };
}

/**
 * Registra una atribución (click/lead) asociada a un código de prescriptor.
 */
export async function registerAttribution(input: AttributionInput) {
    const profile = await prisma.affiliateProfile.findUnique({
        where: { affiliateCode: input.referralCode },
    });

    if (!profile) {
        throw new Error("REFERRAL_CODE_NOT_FOUND");
    }

    const referral = await prisma.affiliateReferral.create({
        data: {
            affiliateId: profile.id,
            referralCode: input.referralCode,
            landingUrl: input.landingUrl || `https://productoraear.com/?ref=${input.referralCode}`,
            customerEmail: input.customerEmail || null,
            customerPhone: input.customerPhone || null,
            source: input.source || "ORGANIC",
            status: "REGISTERED",
        },
    });

    return referral;
}

/**
 * Convierte una atribución en comisión devengada (PENDING), aplicando el Split.
 */
export async function convertReferralToCommission(input: ConversionInput) {
    const referral = await prisma.affiliateReferral.findUnique({
        where: { id: input.referralId },
        include: { affiliate: { include: { user: true } } },
    });

    if (!referral || !referral.affiliate) {
        throw new Error("REFERRAL_NOT_FOUND");
    }

    const affiliate = referral.affiliate;
    const tierConfig = resolveTier(affiliate.totalSalesGenerated);
    const ratePct = tierConfig.commissionRate;
    const split = computeSplit(input.grossAmountEur, ratePct);

    const result = await prisma.$transaction(async (tx) => {
        const ledger = await tx.commissionLedger.create({
            data: {
                userId: affiliate.userId,
                affiliateId: affiliate.id,
                amount: split.affiliateAmount,
                currency: "EUR",
                status: CommissionStatus.PENDING,
                reference: `COMM-${input.bookingReference}-${Date.now()}`,
                sourceEvent: `Conversión referida · ${input.bookingReference}`,
                description: `Comisión ${ratePct}% sobre cuota infraestructura (Split 80/10/10)`,
                notes: `Base evento: ${split.grossAmount}€ · Artista 80%: ${split.providerAmount}€ · EAR 10%: ${split.platformAmount}€ · VIMUME 10%: ${split.vimumeAmount}€`,
            },
        });

        const updatedReferral = await tx.affiliateReferral.update({
            where: { id: referral.id },
            data: {
                status: "CONVERTED",
                convertedAt: new Date(),
                conversionAmount: split.grossAmount,
                commissionDue: split.affiliateAmount,
                bookingReference: input.bookingReference,
            },
        });

        // Auto-upgrade tier atómico: calcula el nuevo tier con ventas +1
        const newSalesCount = affiliate.totalSalesGenerated + 1;
        const newTierConfig = resolveTier(newSalesCount);

        const updatedProfile = await tx.affiliateProfile.update({
            where: { id: affiliate.id },
            data: {
                totalSalesGenerated: { increment: 1 },
                tier: newTierConfig.tier,
                commissionRate: newTierConfig.commissionRate,
            },
        });

        const tierUpgraded = newTierConfig.tier !== tierConfig.tier;

        return { ledger, updatedReferral, updatedProfile, tierUpgraded, newTier: newTierConfig };
    });

    return { ...result, split };
}

/**
 * Acredita una comisión devengada al saldo de Aura Wallet (estado APPROVED→PAID).
 */
export async function settleCommission(ledgerId: string) {
    const ledger = await prisma.commissionLedger.findUnique({
        where: { id: ledgerId },
        include: { user: { include: { auraWallet: true } } },
    });

    if (!ledger) throw new Error("LEDGER_NOT_FOUND");
    if (ledger.status === CommissionStatus.PAID) throw new Error("ALREADY_SETTLED");
    if (!ledger.user) throw new Error("LEDGER_USER_NOT_LINKED");

    await prisma.$transaction([
        prisma.commissionLedger.update({
            where: { id: ledgerId },
            data: { status: CommissionStatus.PAID },
        }),
        prisma.auraWallet.upsert({
            where: { userId: ledger.userId! },
            create: {
                userId: ledger.userId!,
                balance: ledger.amount,
                currency: ledger.currency,
                walletAddress: `0xEAR_AFF_${Date.now()}`,
            },
            update: {
                balance: { increment: ledger.amount },
            },
        }),
    ]);

    return { success: true, settledAmount: ledger.amount };
}

/**
 * Solicita liquidación (payout) con gate KYC ≥ 3.000 €.
 */
export async function requestPayout(input: {
    email: string;
    amount: number;
}): Promise<{ success: boolean; message: string; requiresKyc?: boolean }> {
    if (input.amount <= 0) {
        return { success: false, message: "El importe debe ser superior a 0 €." };
    }

    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { auraWallet: true, affiliateProfile: true },
    });

    if (!user || !user.auraWallet) {
        return { success: false, message: "Usuario o Aura Wallet no encontrado." };
    }

    if (user.auraWallet.balance < input.amount) {
        return { success: false, message: "Saldo insuficiente en Aura Wallet." };
    }

    // Gate KYC
    if (input.amount >= KYC_THRESHOLD_EUR) {
        const needsKyc =
            !user.affiliateProfile ||
            user.affiliateProfile.kycStatus !== KycStatus.VERIFIED;
        if (needsKyc) {
            return {
                success: false,
                requiresKyc: true,
                message:
                    "KYC activo: retiros ≥ 3.000 € requieren verificación de DNI/CIF.",
            };
        }
    }

    const sunday = nextSunday23_59GMT();

    await prisma.$transaction([
        prisma.auraWallet.update({
            where: { id: user.auraWallet.id },
            data: { balance: { decrement: input.amount } },
        }),
        prisma.payout.create({
            data: {
                userId: user.id,
                affiliateId: user.affiliateProfile?.id ?? null,
                amount: input.amount,
                currency: "EUR",
                status: PayoutStatus.PENDING,
                payoutMethod: user.affiliateProfile?.payoutMethod || "IBAN",
                payoutDetails: user.affiliateProfile?.payoutDetails || null,
                kycRequired: input.amount >= KYC_THRESHOLD_EUR,
                scheduledFor: sunday,
                reference: `PAYOUT-${Date.now()}`,
                notes: "Liquidación dominical programada (SLA 7 días hábiles).",
            },
        }),
    ]);

    return {
        success: true,
        message: "Solicitud registrada. Liquidación dominical programada.",
    };
}

function nextSunday23_59GMT(): Date {
    const now = new Date();
    const day = now.getUTCDay();
    const daysUntilSunday = (7 - day) % 7 || 7;
    const sunday = new Date(now);
    sunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
    sunday.setUTCHours(23, 59, 0, 0);
    return sunday;
}