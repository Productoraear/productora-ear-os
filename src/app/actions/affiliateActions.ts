"use server";

import { prisma } from "@/lib/prisma";
import { Role, CommissionStatus } from "@prisma/client";
import { userCan } from "@/lib/auth/permissions";

export interface AffiliateDashboardDTO {
  user: {
    id: string;
    name: string | null;
    displayName: string | null;
    email: string;
    rank: string | null;
  };
  wallet: {
    balance: number;
    currency: string;
    walletAddress: string | null;
  };
  referralCode: string;
  referralLink: string;
  totalCommissionPaid: number;
  totalCommissionPending: number;
  activeReferralsCount: number;
  ledgers: {
    id: string;
    amount: number;
    currency: string;
    status: CommissionStatus;
    reference: string | null;
    sourceEvent: string | null;
    notes: string | null;
    createdAt: Date;
  }[];
}

/**
 * 👑 S-CLASS ACTION: GET AFFILIATE DASHBOARD DATA
 * Extrae de PostgreSQL el balance del wallet, el ledger de comisiones y el código de prescriptor.
 */
export async function getAffiliateDashboardData(email: string): Promise<AffiliateDashboardDTO> {
  let user = await prisma.user.findUnique({
    where: { email },
    include: {
      auraWallet: true,
      commissionLedgers: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  // Si no existe, crear usuario embajador bajo demanda
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        displayName: email.split('@')[0],
        role: Role.AFFILIATE,
        rank: 'Operative Junior',
        auraWallet: {
          create: {
            balance: 0.0,
            currency: 'EUR',
            walletAddress: `0xEAR_AFF_${Date.now()}`
          }
        }
      },
      include: {
        auraWallet: true,
        commissionLedgers: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  // Garantizar que tenga Aura Wallet
  let wallet = user.auraWallet;
  if (!wallet) {
    wallet = await prisma.auraWallet.create({
      data: {
        userId: user.id,
        balance: 0.0,
        currency: 'EUR',
        walletAddress: `0xEAR_AFF_${Date.now()}`
      }
    });
  }

  const ledgers = user.commissionLedgers || [];
  const totalCommissionPaid = ledgers
    .filter(l => l.status === CommissionStatus.PAID)
    .reduce((acc, l) => acc + l.amount, 0);

  const totalCommissionPending = ledgers
    .filter(l => l.status === CommissionStatus.PENDING)
    .reduce((acc, l) => acc + l.amount, 0);

  const referralCode = user.id.replace(/^usr-/, '').toUpperCase();
  const referralLink = `https://www.productoraear.com/?ref=${encodeURIComponent(referralCode)}`;

  return {
    user: {
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      rank: user.rank || 'Operative Junior'
    },
    wallet: {
      balance: wallet.balance,
      currency: wallet.currency,
      walletAddress: wallet.walletAddress
    },
    referralCode,
    referralLink,
    totalCommissionPaid,
    totalCommissionPending,
    activeReferralsCount: ledgers.length,
    ledgers: ledgers.map(l => ({
      id: l.id,
      amount: l.amount,
      currency: l.currency,
      status: l.status,
      reference: l.reference,
      sourceEvent: l.sourceEvent,
      notes: l.notes,
      createdAt: l.createdAt
    }))
  };
}

/**
 * ⚡ APPROVE BATCH COMMISSIONS (ADMIN ONLY)
 * Pasa las comisiones PENDING a PAID en una sola transacción atómica.
 */
export async function approveAffiliateBatchAction(adminEmail: string): Promise<{ success: boolean; updatedCount: number }> {
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminUser || (adminUser.role !== Role.ADMIN && adminUser.role !== Role.COMMANDER)) {
    throw new Error("UNAUTHORIZED_ACCESS: Se requiere rango ADMIN o COMMANDER.");
  }

  const result = await prisma.commissionLedger.updateMany({
    where: { status: CommissionStatus.PENDING },
    data: { status: CommissionStatus.PAID }
  });

  return {
    success: true,
    updatedCount: result.count
  };
}

/**
 * 💸 SOLICITAR LIQUIDACIÓN DE COMISIÓN (CON GATE KYC ≥ 3.000 €)
 */
export async function requestAffiliatePayoutAction(
  email: string,
  amount: number
): Promise<{ success: boolean; message: string; requiresKyc?: boolean }> {
  if (amount <= 0) {
    return { success: false, message: "El importe debe ser superior a 0 €." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { auraWallet: true }
  });

  if (!user || !user.auraWallet) {
    return { success: false, message: "Usuario o Billetera no encontrada." };
  }

  if (user.auraWallet.balance < amount) {
    return { success: false, message: "Saldo insuficiente en Aura Wallet." };
  }

  // 🛡️ REGLA KYC S-CLASS: Retiros ≥ 3.000 € exigen verificación de identidad
  if (amount >= 3000) {
    return {
      success: false,
      requiresKyc: true,
      message: "Requisito KYC activo: Los retiros iguales o superiores a 3.000 € requieren validación de DNI/CIF según el Estatuto de Afiliados."
    };
  }

  // Descontar balance y registrar en Ledger
  await prisma.$transaction([
    prisma.auraWallet.update({
      where: { id: user.auraWallet.id },
      data: { balance: { decrement: amount } }
    }),
    prisma.commissionLedger.create({
      data: {
        userId: user.id,
        amount,
        currency: 'EUR',
        status: CommissionStatus.PENDING,
        reference: `PAYOUT-${Date.now()}`,
        sourceEvent: 'Solicitud de Liquidación Dominical',
        notes: 'Liquidación programada para el próximo domingo 23:59 GMT'
      }
    })
  ]);

  return {
    success: true,
    message: "Solicitud registrada con éxito. Liquidación programada para el domingo a las 23:59 GMT."
  };
}
