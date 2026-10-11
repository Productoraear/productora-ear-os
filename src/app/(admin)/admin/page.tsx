import React from 'react';
import AdminDashboardClient from './AdminDashboardClient';
import { prisma } from '@/lib/prisma';
import { PROVIDERS_GRAND_TOTAL } from '@/lib/constants/providers-manifest';
import { EAR_OS_SSOT } from '@/lib/constants/ear-os-ssot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Fetch real data from Prisma for a non-mocked dashboard

  // 1. Fetch Stripe Locks (Price-Locks)
  const locks = await prisma.smartLock.findMany({
    where: {
      status: { in: ['ACTIVE_LOCKED', 'CONVERTED_CONTRACT'] }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stripeCustody = locks.reduce((acc, lock) => acc + (lock.amountCents / 100), 0);

  // 2. Fetch Budgets & Proposals to calculate real Revenue
  const budgets = await prisma.budget.findMany();
  let totalRevenue = 0;
  budgets.forEach(b => { totalRevenue += b.finalCost });

  const proposals = await prisma.proposal.findMany({
    where: {
      status: 'aprobado'
    },
    orderBy: { createdAt: 'desc' }
  });

  proposals.forEach(p => { totalRevenue += (p.totalCents / 100) });

  const totalTransactions = locks.length + budgets.length + proposals.length;

  // 3. Provider Counting (Real DB vs Shadows)
  const dbProvidersCount = await prisma.providerProfile.count();
  const shadowProvidersCount = await prisma.vendorShadowProfile.count();

  // Scraped constants + real in DB
  const totalProviders = PROVIDERS_GRAND_TOTAL + dbProvidersCount + shadowProvidersCount;

  // 4. Split 80/10/10 Logic (SSOT)
  const baseRevenue = totalRevenue + stripeCustody;
  const artistCache = baseRevenue * EAR_OS_SSOT.SPLIT_SOBERANO.artista;
  const earOsFee = baseRevenue * EAR_OS_SSOT.SPLIT_SOBERANO.earOs;
  const vimumeFee = baseRevenue * EAR_OS_SSOT.SPLIT_SOBERANO.vimume;

  // 5. B2G Total (Licitaciones)
  const b2gProposals = proposals.filter(p => (p.totalCents / 100) < 14250);
  const b2gTotal = b2gProposals.reduce((acc, p) => acc + (p.totalCents / 100), 0);

  // 6. Latest Transactions mapped to a universal format for the dashboard
  const latestTransactions = [
    ...locks.map(l => ({
      vertical: l.vertical || 'Depósito Stripe Price-Lock',
      createdAt: l.createdAt,
      amountCents: l.amountCents,
      status: l.status
    })),
    ...proposals.map(p => ({
      vertical: 'Propuesta Aprobada',
      createdAt: p.createdAt,
      amountCents: p.totalCents,
      status: p.status
    }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

  const data = {
    totalRevenue: baseRevenue,
    totalTransactions,
    providerCount: totalProviders,
    activeStripeLocksCount: locks.length,
    b2gTotal,
    artistCache,
    earOsFee,
    vimumeFee,
    stripeCustody,
    latestTransactions
  };

  return <AdminDashboardClient data={data} />;
}
