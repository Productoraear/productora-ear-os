import React from 'react';
import AdminDashboardClient from './AdminDashboardClient';
import { prisma } from '@/lib/prisma';
import { PROVIDERS_GRAND_TOTAL } from '@/lib/constants/providers-manifest';
import { EAR_OS_SSOT } from '@/lib/constants/ear-os-ssot';
import { classifyDbFailure, type DbFailureReport } from '@/lib/db/dbFailureClassifier';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type LockRow = { vertical: string | null; createdAt: Date; amountCents: number; status: string };
type BudgetRow = { finalCost: number };
type ProposalRow = { totalCents: number; status: string; createdAt: Date };

export default async function AdminDashboardPage() {
  let locks: LockRow[] = [];
  let budgets: BudgetRow[] = [];
  let proposals: ProposalRow[] = [];
  let dbProvidersCount = 0;
  let shadowProvidersCount = 0;

  // ── SONDEO REAL DE POSTGRESQL (AF-1 / AF-2 / INV-16) ──────────────────────
  // Si la DB no responde, las cifras de tesorería van a CERO y se declara
  // `dataMode: 'DB_OFFLINE'`. Antes este catch inyectaba 2 locks de 100 €,
  // 12.450 € de presupuesto y 14.200 € de propuesta aprobada como si fueran
  // dinero cobrado: una fachada de telemetría que el CEO leía como real.
  let dbProbed = false;
  /** Causa clasificada del fallo (null si la DB respondió). Nunca lleva mensaje crudo. */
  let dbFailure: DbFailureReport | null = null;

  try {
    [locks, budgets, proposals, dbProvidersCount, shadowProvidersCount] = await Promise.all([
      prisma.smartLock.findMany({
        where: { status: { in: ['ACTIVE_LOCKED', 'CONVERTED_CONTRACT'] } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.budget.findMany(),
      prisma.proposal.findMany({
        where: { status: 'aprobado' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.providerProfile.count(),
      prisma.vendorShadowProfile.count(),
    ]);
    dbProbed = true;
  } catch (err) {
    // Se registra SOLO el código CLASIFICADO: nunca el mensaje crudo (puede
    // arrastrar host, usuario y parámetros de conexión — SEC-3 / INV-14).
    // Antes se leía `err.code`, que Prisma 6 deja `undefined` en los fallos de
    // arranque (`errorCode`), y el log colapsaba a un `code=UNKNOWN` inútil.
    dbFailure = classifyDbFailure(err);
    console.error(
      `[AdminDashboardPage][DB_OFFLINE] ${dbFailure.kind} (code=${dbFailure.code}). ${dbFailure.action} KPIs a cero; sin telemetría de demostración.`,
    );
    locks = [];
    budgets = [];
    proposals = [];
    dbProvidersCount = 0;
    shadowProvidersCount = 0;
  }

  const stripeCustody = locks.reduce((acc, lock) => acc + ((lock.amountCents || 10000) / 100), 0);

  let totalRevenue = 0;
  budgets.forEach((b) => {
    totalRevenue += (b.finalCost || 0);
  });

  proposals.forEach((p) => {
    totalRevenue += ((p.totalCents || 0) / 100);
  });

  const totalTransactions = locks.length + budgets.length + proposals.length;
  const totalProviders = PROVIDERS_GRAND_TOTAL + dbProvidersCount + shadowProvidersCount;

  // Split Soberano 80/10/10 (SSOT)
  const baseRevenue = totalRevenue + stripeCustody;
  const artistCache = baseRevenue * EAR_OS_SSOT.SPLIT_SOBERANO.artista;
  const earOsFee = baseRevenue * EAR_OS_SSOT.SPLIT_SOBERANO.earOs;
  const vimumeFee = baseRevenue * EAR_OS_SSOT.SPLIT_SOBERANO.vimume;

  // B2G Total (Licitaciones menores < 14.250€ Art. 118 LCSP)
  const b2gProposals = proposals.filter((p) => ((p.totalCents || 0) / 100) < 14250);
  const b2gTotal = b2gProposals.reduce((acc, p) => acc + ((p.totalCents || 0) / 100), 0);

  const latestTransactions = [
    ...locks.map((l) => ({
      vertical: l.vertical || 'Depósito Stripe Price-Lock',
      createdAt: l.createdAt instanceof Date ? l.createdAt : new Date(l.createdAt),
      amountCents: l.amountCents || 10000,
      status: l.status || 'ACTIVE_LOCKED',
    })),
    ...proposals.map((p) => ({
      vertical: 'Propuesta Aprobada S-Class',
      createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
      amountCents: p.totalCents || 10000,
      status: p.status || 'aprobado',
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  const dataMode: 'REAL' | 'DB_OFFLINE' = dbProbed ? 'REAL' : 'DB_OFFLINE';

  const data = {
    dataMode,
    dbProbed,
    dbFailure,
    totalRevenue: baseRevenue,
    totalTransactions,
    providerCount: totalProviders,
    activeStripeLocksCount: locks.length,
    b2gTotal,
    artistCache,
    earOsFee,
    vimumeFee,
    stripeCustody,
    latestTransactions,
  };

  return <AdminDashboardClient data={data} />;
}
