"use server";

import { prisma } from "@/lib/prisma";
import { CommissionStatus, KycStatus, Role } from "@prisma/client";
import {
    AFFILIATE_TIER_CONFIG,
    computeSplit,
    resolveTier,
    upsertAffiliateProfile,
    registerAttribution,
    convertReferralToCommission,
    settleCommission,
    requestPayout,
} from "@/lib/affiliate/affiliateCommissionEngine";
import { AffiliateTier } from "@prisma/client";

async function assertAdminOrThrow(adminEmail: string): Promise<void> {
    const admin = await prisma.user.findUnique({
        where: { email: adminEmail.trim().toLowerCase() },
    });
    if (!admin || (admin.role !== Role.ADMIN && admin.role !== Role.COMMANDER)) {
        throw new Error("UNAUTHORIZED_ACCESS");
    }
}

const VALID_TIERS = new Set<string>(["BRONZE", "SILVER", "GOLD", "PLATINUM"]);

function assertCommissionRate(rate: number): number {
    const n = Number(rate);
    if (!Number.isFinite(n) || n < 0 || n > 100) {
        throw new Error("INVALID_COMMISSION_RATE");
    }
    return n;
}

// ════════════════════════════════════════════════════════════════════════════
// S-CLASS AFFILIATE DASHBOARD ACTIONS (V2 · SSOT 80/10/10 · Datos Reales)
// ════════════════════════════════════════════════════════════════════════════

export interface AffiliateV2DashboardDTO {
    profile: {
        id: string;
        name: string | null;
        displayName: string | null;
        email: string;
        affiliateCode: string;
        companyName: string | null;
        cifNif: string | null;
        phone: string | null;
        tier: string;
        tierName: string;
        commissionRate: number;
        totalSalesGenerated: number;
        kycStatus: string;
        payoutMethod: string;
        isActive: boolean;
    } | null;
    wallet: {
        balance: number;
        currency: string;
        walletAddress: string | null;
    };
    referralLink: string;
    metrics: {
        totalCommissionPaid: number;
        totalCommissionPending: number;
        totalCommissionApproved: number;
        activeReferralsCount: number;
        convertedReferralsCount: number;
        nextTier: { name: string; minSales: number; rate: number } | null;
        projectedNextCommission: number;
    };
    ledgers: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        reference: string | null;
        sourceEvent: string | null;
        notes: string | null;
        createdAt: Date;
    }[];
    referrals: {
        id: string;
        referralCode: string;
        customerEmail: string | null;
        status: string;
        conversionAmount: number;
        commissionDue: number;
        attributedAt: Date;
        convertedAt: Date | null;
    }[];
    payouts: {
        id: string;
        amount: number;
        status: string;
        scheduledFor: Date | null;
        reference: string | null;
        createdAt: Date;
    }[];
    tierConfig: { tier: string; name: string; commissionRate: number; minSales: number }[];
}

function tierName(tier: string): string {
    return AFFILIATE_TIER_CONFIG.find((t) => t.tier === tier)?.name ?? tier;
}

export async function getAffiliateV2Dashboard(email: string): Promise<AffiliateV2DashboardDTO> {
    const normalizedEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
            auraWallet: true,
            affiliateProfile: {
                include: {
                    ledgers: { orderBy: { createdAt: "desc" } },
                    referrals: { orderBy: { attributedAt: "desc" } },
                    payouts: { orderBy: { createdAt: "desc" } },
                },
            },
            commissionLedgers: { orderBy: { createdAt: "desc" } },
        },
    });

    // Auto-provisión express (< 10 min) si no existe
    if (!user) {
        const provisioned = await upsertAffiliateProfile({
            email: normalizedEmail,
            name: normalizedEmail.split("@")[0],
        });
        user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: {
                auraWallet: true,
                affiliateProfile: {
                    include: {
                        ledgers: { orderBy: { createdAt: "desc" } },
                        referrals: { orderBy: { attributedAt: "desc" } },
                        payouts: { orderBy: { createdAt: "desc" } },
                    },
                },
                commissionLedgers: { orderBy: { createdAt: "desc" } },
            },
        });
        void provisioned;
    }

    const profile = user?.affiliateProfile ?? null;
    const wallet = user?.auraWallet ?? null;

    const ledgers = user?.commissionLedgers ?? [];
    const totalPaid = ledgers.filter((l) => l.status === CommissionStatus.PAID).reduce((a, l) => a + l.amount, 0);
    const totalApproved = ledgers.filter((l) => l.status === CommissionStatus.APPROVED).reduce((a, l) => a + l.amount, 0);
    const totalPending = ledgers
        .filter((l) => l.status === CommissionStatus.PENDING || l.status === CommissionStatus.APPROVED)
        .reduce((a, l) => a + l.amount, 0);

    const currentTier = profile ? resolveTier(profile.totalSalesGenerated) : AFFILIATE_TIER_CONFIG[0];
    const nextTier = AFFILIATE_TIER_CONFIG.find((t) => t.minSales > currentTier.minSales) ?? null;

    const projectedNextCommission = profile
        ? computeSplit(350, nextTier?.commissionRate ?? currentTier.commissionRate).affiliateAmount
        : computeSplit(350, AFFILIATE_TIER_CONFIG[0].commissionRate).affiliateAmount;

    return {
        profile: profile
            ? {
                id: profile.id,
                name: user!.name,
                displayName: user!.displayName,
                email: user!.email,
                affiliateCode: profile.affiliateCode,
                companyName: profile.companyName,
                cifNif: profile.cifNif,
                phone: profile.phone,
                tier: profile.tier,
                tierName: tierName(profile.tier),
                commissionRate: profile.commissionRate,
                totalSalesGenerated: profile.totalSalesGenerated,
                kycStatus: profile.kycStatus,
                payoutMethod: profile.payoutMethod,
                isActive: profile.isActive,
            }
            : null,
        wallet: {
            balance: wallet?.balance ?? 0,
            currency: wallet?.currency ?? "EUR",
            walletAddress: wallet?.walletAddress ?? null,
        },
        referralLink: profile
            ? `https://productoraear.com/?ref=${profile.affiliateCode}`
            : "",
        metrics: {
            totalCommissionPaid: totalPaid,
            totalCommissionPending: totalPending,
            totalCommissionApproved: totalApproved,
            activeReferralsCount: profile?.referrals.filter((r) => r.status === "REGISTERED").length ?? 0,
            convertedReferralsCount: profile?.referrals.filter((r) => r.status === "CONVERTED" || r.status === "PAID").length ?? 0,
            nextTier: nextTier ? { name: nextTier.name, minSales: nextTier.minSales, rate: nextTier.commissionRate } : null,
            projectedNextCommission,
        },
        ledgers: ledgers.map((l) => ({
            id: l.id,
            amount: l.amount,
            currency: l.currency,
            status: l.status,
            reference: l.reference,
            sourceEvent: l.sourceEvent,
            notes: l.notes,
            createdAt: l.createdAt,
        })),
        referrals: (profile?.referrals ?? []).map((r) => ({
            id: r.id,
            referralCode: r.referralCode,
            customerEmail: r.customerEmail,
            status: r.status,
            conversionAmount: r.conversionAmount,
            commissionDue: r.commissionDue,
            attributedAt: r.attributedAt,
            convertedAt: r.convertedAt,
        })),
        payouts: (profile?.payouts ?? []).map((p) => ({
            id: p.id,
            amount: p.amount,
            status: p.status,
            scheduledFor: p.scheduledFor,
            reference: p.reference,
            createdAt: p.createdAt,
        })),
        tierConfig: AFFILIATE_TIER_CONFIG.map((t) => ({
            tier: t.tier,
            name: t.name,
            commissionRate: t.commissionRate,
            minSales: t.minSales,
        })),
    };
}

export async function registerAffiliateV2Action(input: {
    name: string;
    email: string;
    companyName?: string;
    cifNif?: string;
    phone?: string;
    category?: string;
    payoutMethod?: string;
    payoutDetails?: string;
}) {
    const result = await upsertAffiliateProfile({
        email: input.email,
        name: input.name,
        companyName: input.companyName,
        cifNif: input.cifNif,
        phone: input.phone,
        category: input.category,
        payoutMethod: input.payoutMethod,
        payoutDetails: input.payoutDetails,
    });

    return { success: true, ...result };
}

export async function trackAffiliateVisitAction(input: {
    referralCode: string;
    customerEmail?: string;
    customerPhone?: string;
    source?: string;
}) {
    const referral = await registerAttribution(input);
    return { success: true, referralId: referral.id };
}

export async function convertAffiliateCommissionAction(input: {
    referralId: string;
    grossAmountEur: number;
    bookingReference: string;
}) {
    const result = await convertReferralToCommission(input);
    return {
        success: true,
        affiliateAmount: result.split.affiliateAmount,
        split: result.split,
        ledgerId: result.ledger.id,
    };
}

export async function settleAffiliateCommissionAction(ledgerId: string) {
    return settleCommission(ledgerId);
}

export async function requestAffiliatePayoutV2Action(email: string, amount: number) {
    return requestPayout({ email, amount });
}

export async function approveAllPendingCommissionsAction(adminEmail: string) {
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin || (admin.role !== Role.ADMIN && admin.role !== Role.COMMANDER)) {
        throw new Error("UNAUTHORIZED_ACCESS");
    }

    const result = await prisma.commissionLedger.updateMany({
        where: { status: CommissionStatus.PENDING },
        data: { status: CommissionStatus.APPROVED },
    });

    return { success: true, updatedCount: result.count };
}

// ════════════════════════════════════════════════════════════════════════════
// PANEL ADMIN · ALTA / BAJA / % COMISIÓN / AJUSTE DE TIER (Indie Affiliates Pro)
// ════════════════════════════════════════════════════════════════════════════

export async function adminListAffiliatesAction(adminEmail: string) {
    await assertAdminOrThrow(adminEmail);

    const affiliates = await prisma.affiliateProfile.findMany({
        include: {
            user: { select: { name: true, email: true, auraWallet: { select: { balance: true } } } },
            ledgers: true,
            referrals: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return affiliates.map((a) => {
        const paid = a.ledgers
            .filter((l) => l.status === CommissionStatus.PAID)
            .reduce((acc, l) => acc + l.amount, 0);
        const pending = a.ledgers
            .filter((l) => l.status === CommissionStatus.PENDING || l.status === CommissionStatus.APPROVED)
            .reduce((acc, l) => acc + l.amount, 0);

        return {
            id: a.id,
            affiliateCode: a.affiliateCode,
            companyName: a.companyName,
            name: a.user.name,
            email: a.user.email,
            phone: a.phone,
            category: a.category,
            tier: a.tier,
            commissionRate: a.commissionRate,
            totalSalesGenerated: a.totalSalesGenerated,
            kycStatus: a.kycStatus,
            isActive: a.isActive,
            walletBalance: a.user.auraWallet?.balance ?? 0,
            commissionsPaid: paid,
            commissionsPending: pending,
            referralsCount: a.referrals.length,
            conversionsCount: a.referrals.filter((r) => r.status === "CONVERTED" || r.status === "PAID").length,
            payoutMethod: a.payoutMethod,
            createdAt: a.createdAt,
        };
    });
}

export async function adminUpdateAffiliateAction(input: {
    adminEmail: string;
    profileId: string;
    commissionRate?: number;
    tier?: string;
    isActive?: boolean;
    companyName?: string;
    phone?: string;
    payoutMethod?: string;
    payoutDetails?: string;
}) {
    await assertAdminOrThrow(input.adminEmail);

    const data: Record<string, unknown> = {};

    if (input.commissionRate !== undefined) {
        data.commissionRate = assertCommissionRate(input.commissionRate);
    }
    if (input.tier !== undefined) {
        if (!VALID_TIERS.has(input.tier)) {
            throw new Error("INVALID_TIER");
        }
        data.tier = input.tier as AffiliateTier;
    }
    if (input.isActive !== undefined) {
        data.isActive = Boolean(input.isActive);
    }
    if (input.companyName !== undefined) {
        data.companyName = input.companyName.trim() || null;
    }
    if (input.phone !== undefined) {
        data.phone = input.phone.trim() || null;
    }
    if (input.payoutMethod !== undefined) {
        data.payoutMethod = input.payoutMethod.trim() || "IBAN";
    }
    if (input.payoutDetails !== undefined) {
        data.payoutDetails = input.payoutDetails.trim() || null;
    }

    if (Object.keys(data).length === 0) {
        return { success: true, message: "Sin cambios que aplicar." };
    }

    await prisma.affiliateProfile.update({
        where: { id: input.profileId },
        data,
    });

    return { success: true, message: "Afiliado actualizado correctamente." };
}

export async function adminDeactivateAffiliateAction(input: {
    adminEmail: string;
    profileId: string;
}) {
    await assertAdminOrThrow(input.adminEmail);
    await prisma.affiliateProfile.update({
        where: { id: input.profileId },
        data: { isActive: false },
    });
    return { success: true, message: "Afiliado dado de baja (isActive = false)." };
}

export async function adminReactivateAffiliateAction(input: {
    adminEmail: string;
    profileId: string;
}) {
    await assertAdminOrThrow(input.adminEmail);
    await prisma.affiliateProfile.update({
        where: { id: input.profileId },
        data: { isActive: true },
    });
    return { success: true, message: "Afiliado reactivado (isActive = true)." };
}
