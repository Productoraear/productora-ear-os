"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { userCan } from "@/lib/auth/permissions";

export interface WaybillData {
  id: string;
  referenceCode: string;
  status: string;
  originLabel: string;
  destinationLabel: string;
  distanceMeters: number | null;
  createdAt: Date;
  notes: string | null;
  artistName: string | null;
  providerName: string | null;
  clientName: string | null;
}

export interface WalletLedgerData {
  balance: number;
  currency: string;
  walletAddress: string | null;
  ledgerEntries: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reference: string | null;
    sourceEvent: string | null;
    notes: string | null;
    createdAt: Date;
  }[];
}

/**
 * 👑 S-CLASS AUDIT FUNCTION: SECURE ROLE GATE
 * Validates if the user exists and possesses ADMIN or ARTIST roles in the central DB.
 */
async function authorizeUser(email: string): Promise<{ authorized: boolean; role: Role; userId: string; artistProfileId: string | null }> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { artistProfile: true }
  });

  if (!user) {
    return { authorized: false, role: Role.EXPLORADOR, userId: "", artistProfileId: null };
  }

  const isAuthorized = userCan(user.role, "write:waybill") || userCan(user.role, "read:all_waybills") || user.role === Role.ARTIST;

  return {
    authorized: isAuthorized,
    role: user.role,
    userId: user.id,
    artistProfileId: user.artistProfile?.id || null
  };
}

/**
 * 🚚 FLEET LOGISTICS ACTION: GET WAYBILLS
 * Retrieves active waybills sorted chronologically by creation time.
 */
export async function getWaybills(email: string): Promise<WaybillData[]> {
  const auth = await authorizeUser(email);
  if (!auth.authorized) {
    throw new Error("UNAUTHORIZED_ACCESS: Clearance level S-Class required.");
  }

  // If user is Admin/Commander, return all waybills. If Artist, return only their waybills.
  const whereClause = (auth.role === Role.ADMIN || auth.role === Role.COMMANDER)
    ? {}
    : { artistProfileId: auth.artistProfileId || undefined };

  const waybills = await prisma.waybill.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      artistProfile: { select: { displayName: true } },
      providerProfile: { select: { name: true } },
      clientProfile: { select: { companyName: true, user: { select: { displayName: true } } } },
      unit: true
    }
  });

  return waybills.map(w => ({
    id: w.id,
    referenceCode: w.referenceCode ?? "",
    status: w.status,
    originLabel: w.originLabel ?? "",
    destinationLabel: w.destinationLabel ?? "",
    distanceMeters: w.distanceMeters ?? 0,
    createdAt: w.createdAt,
    notes: w.notes ?? "",
    artistName: w.artistProfile?.displayName || null,
    providerName: w.providerProfile?.name || null,
    clientName: w.clientProfile?.companyName || w.clientProfile?.user.displayName || null
  }));
}

/**
 * 🪙 AURA WALLET LEDGER ACTION: GET BALANCE AND MOVEMENTS
 * Retrieves current wallet balance and dynamic ledger transactions.
 */
export async function getAuraWalletAndLedgers(email: string): Promise<WalletLedgerData> {
  const auth = await authorizeUser(email);
  if (!auth.authorized) {
    throw new Error("UNAUTHORIZED_ACCESS: Clearance level S-Class required.");
  }

  // Find the target user wallet
  const wallet = await prisma.auraWallet.findUnique({
    where: { userId: auth.userId }
  });

  // Find all commission ledger entries for the user
  const ledgerEntries = await prisma.commissionLedger.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" }
  });

  return {
    balance: wallet?.balance || 0,
    currency: wallet?.currency || "EUR",
    walletAddress: wallet?.walletAddress || null,
    ledgerEntries: ledgerEntries.map(entry => ({
      id: entry.id,
      amount: entry.amount,
      currency: entry.currency,
      status: entry.status,
      reference: entry.reference,
      sourceEvent: entry.sourceEvent,
      notes: entry.notes,
      createdAt: entry.createdAt
    }))
  };
}

/**
 * 📊 GENERAL SYSTEM BALANCES ACTION: FOR ADMINS ONLY
 * For commander dashboard global insight, returns aggregated system ledger entries and wallet states.
 */
export async function getSystemFinancials(email: string) {
  const auth = await authorizeUser(email);
  if (!userCan(auth.role, "read:system_financials")) {
    throw new Error("UNAUTHORIZED_ACCESS: Global administrator role required.");
  }

  const wallets = await prisma.auraWallet.findMany({
    include: { user: { select: { displayName: true, email: true } } }
  });

  const ledgerEntries = await prisma.commissionLedger.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { displayName: true } } }
  });

  return {
    wallets: wallets.map(w => ({
      id: w.id,
      displayName: w.user.displayName || w.user.email,
      balance: w.balance,
      currency: w.currency
    })),
    ledgerEntries: ledgerEntries.map(e => ({
      id: e.id,
      displayName: e.user?.displayName || "Usuario Anonimo",
      amount: e.amount,
      currency: e.currency,
      status: e.status,
      reference: e.reference,
      sourceEvent: e.sourceEvent,
      notes: e.notes,
      createdAt: e.createdAt
    }))
  };
}

/**
 * 🔮 ASTRA AI INTEGRATION ACTION: RUN PREDICTIVE ANALYSIS
 * Fetches real historical logged context and evaluates it server-side.
 */
export async function runAstraPrediction(
  email: string,
  input: { origin: string; destination: string; eventDate: string }
) {
  const auth = await authorizeUser(email);
  if (!userCan(auth.role, "read:astra_oracle")) {
    throw new Error("UNAUTHORIZED_ACCESS: Global administrator role required.");
  }

  const { astraPredictiveEngine } = await import("@/lib/ai/astra/predictive-engine");

  // Query real database logged parameters
  const whereClause = (auth.role === Role.ADMIN || auth.role === Role.COMMANDER)
    ? {}
    : { artistProfileId: auth.artistProfileId || undefined };

  const historicalWaybills = await prisma.waybill.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const historicalWalletMoves = await prisma.commissionLedger.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return astraPredictiveEngine.predict({
    origin: input.origin,
    destination: input.destination,
    eventDate: input.eventDate,
    providerId: auth.artistProfileId || undefined,
    historicalWaybills,
    historicalWalletMoves
  });
}
