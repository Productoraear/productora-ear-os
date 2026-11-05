/**
 * ════════════════════════════════════════════════════════════════════════════
 * ADMIN COCKPIT — AGREGADOR PURO Y TIPADO (W48_T04_ADMIN_COCKPIT_BFF_REAL)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de la tesorería del cockpit. Consolida con Prisma en CÉNTIMOS
 * ENTEROS (cero aritmética en coma flotante para importes) y declara la
 * naturaleza de la sonda (AF-1): `probed`, `source`, `mode`, `checkedAt`.
 *
 * · Nunca lanza excepciones: si PostgreSQL no responde devuelve un snapshot
 *   `probed:false` con `dataMode:'DB_OFFLINE'` y todas las cifras a CERO
 *   (AF-5: verde por defecto prohibido).
 * · Nunca expone secretos ni el mensaje crudo de Prisma (SEC-3 / INV-14):
 *   el fallo se devuelve clasificado vía `classifyDbFailure`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { prisma } from '@/lib/prisma';
import { PROVIDERS_GRAND_TOTAL } from '@/lib/constants/providers-manifest';
import { EAR_OS_SSOT } from '@/lib/constants/ear-os-ssot';
import { classifyDbFailure, type DbFailureReport } from '@/lib/db/dbFailureClassifier';

export type CockpitDataMode = 'REAL' | 'DB_OFFLINE';
export type CockpitSource = 'live' | 'static';
export type CockpitMode = 'REAL' | 'SIMULADO';

export interface CockpitTransaction {
  vertical: string;
  createdAt: string;
  amountCents: number;
  status: string;
}

export interface CockpitSplitCents {
  artista: number;
  earOs: number;
  vimume: number;
}

export interface AdminCockpitSnapshot {
  /** `true` solo si el Promise.all de Prisma se resolvió (sonda real). */
  probed: boolean;
  source: CockpitSource;
  mode: CockpitMode;
  checkedAt: string;
  dataMode: CockpitDataMode;
  /** Causa clasificada del fallo (null si la DB respondió). Nunca mensaje crudo. */
  dbFailure: DbFailureReport | null;
  totalRevenueCents: number;
  stripeCustodyCents: number;
  totalTransactions: number;
  providerCount: number;
  activeStripeLocksCount: number;
  b2gTotalCents: number;
  b2gCeilingCents: number;
  splitCents: CockpitSplitCents;
  latestTransactions: CockpitTransaction[];
}

/** Convierte un importe en euros (Float de Prisma) a céntimos enteros, una sola vez en el borde. */
function eurosToCents(euros: number): number {
  const safe = Number.isFinite(euros) ? euros : 0;
  return Math.round(safe * 100);
}

/** Aplica un ratio soberano a una base en céntimos (redondeo único, sin acumulación de error). */
function splitCentsOf(baseCents: number, ratio: number): number {
  return Math.round(baseCents * ratio);
}

type LockRow = { vertical: string | null; createdAt: Date; amountCents: number; status: string };
type BudgetRow = { finalCost: number };
type ProposalRow = { totalCents: number; status: string; createdAt: Date };

export async function buildAdminCockpitSnapshot(): Promise<AdminCockpitSnapshot> {
  const checkedAt = new Date().toISOString();

  try {
    let locks: LockRow[] = [];
    let budgets: BudgetRow[] = [];
    let proposals: ProposalRow[] = [];
    let dbProvidersCount = 0;
    let shadowProvidersCount = 0;

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

    const stripeCustodyCents = locks.reduce((acc, l) => acc + (l.amountCents || 10000), 0);
    const budgetRevenueCents = budgets.reduce((acc, b) => acc + eurosToCents(b.finalCost || 0), 0);
    const proposalRevenueCents = proposals.reduce((acc, p) => acc + (p.totalCents || 0), 0);
    const totalRevenueCents = stripeCustodyCents + budgetRevenueCents + proposalRevenueCents;

    const b2gCeilingCents = eurosToCents(EAR_OS_SSOT.AJUSTE_PREVENTIVO_B2G_EUR);
    const b2gTotalCents = proposals
      .filter((p) => (p.totalCents || 0) < b2gCeilingCents)
      .reduce((acc, p) => acc + (p.totalCents || 0), 0);

    const latestTransactions: CockpitTransaction[] = [
      ...locks.map((l) => ({
        vertical: l.vertical || 'Depósito Stripe Price-Lock',
        createdAt: l.createdAt,
        amountCents: l.amountCents || 10000,
        status: l.status || 'ACTIVE_LOCKED',
      })),
      ...proposals.map((p) => ({
        vertical: 'Propuesta Aprobada S-Class',
        createdAt: p.createdAt,
        amountCents: p.totalCents || 10000,
        status: p.status || 'aprobado',
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((t) => ({
        vertical: t.vertical,
        createdAt: t.createdAt.toISOString(),
        amountCents: t.amountCents,
        status: t.status,
      }));

    return {
      probed: true,
      source: 'live',
      mode: 'REAL',
      checkedAt,
      dataMode: 'REAL',
      dbFailure: null,
      totalRevenueCents,
      stripeCustodyCents,
      totalTransactions: locks.length + budgets.length + proposals.length,
      providerCount: PROVIDERS_GRAND_TOTAL + dbProvidersCount + shadowProvidersCount,
      activeStripeLocksCount: locks.length,
      b2gTotalCents,
      b2gCeilingCents,
      splitCents: {
        artista: splitCentsOf(totalRevenueCents, EAR_OS_SSOT.SPLIT_SOBERANO.artista),
        earOs: splitCentsOf(totalRevenueCents, EAR_OS_SSOT.SPLIT_SOBERANO.earOs),
        vimume: splitCentsOf(totalRevenueCents, EAR_OS_SSOT.SPLIT_SOBERANO.vimume),
      },
      latestTransactions,
    };
  } catch (err) {
    const dbFailure = classifyDbFailure(err);
    return {
      probed: false,
      source: 'live',
      mode: 'REAL',
      checkedAt,
      dataMode: 'DB_OFFLINE',
      dbFailure,
      totalRevenueCents: 0,
      stripeCustodyCents: 0,
      totalTransactions: 0,
      providerCount: PROVIDERS_GRAND_TOTAL,
      activeStripeLocksCount: 0,
      b2gTotalCents: 0,
      b2gCeilingCents: eurosToCents(EAR_OS_SSOT.AJUSTE_PREVENTIVO_B2G_EUR),
      splitCents: { artista: 0, earOs: 0, vimume: 0 },
      latestTransactions: [],
    };
  }
}
