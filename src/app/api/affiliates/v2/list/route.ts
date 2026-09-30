import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
    try {
        const affiliates = await prisma.affiliateProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        auraWallet: { select: { balance: true } },
                    },
                },
                ledgers: true,
                referrals: true,
                payouts: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const items = affiliates.map((a) => {
            const paid = a.ledgers
                .filter((l) => l.status === "PAID")
                .reduce((acc, l) => acc + l.amount, 0);
            const pending = a.ledgers
                .filter((l) => l.status === "PENDING" || l.status === "APPROVED")
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

        return NextResponse.json({ success: true, count: items.length, affiliates: items });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || "Error cargando afiliados." },
            { status: 500 }
        );
    }
}