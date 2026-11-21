import React from 'react';
import { redirect } from 'next/navigation';
import { AdminDashboardGate } from './AdminDashboardGate';
import { buildAdminCockpitSnapshot } from '@/lib/admin/cockpit-aggregator';
import { requireAdminFromHeaders } from '@/lib/security/adminGuard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const auth = await requireAdminFromHeaders();
  if (!auth.ok) {
    redirect('/login?from=/admin');
  }

  const snapshot = await buildAdminCockpitSnapshot();

  const data = {
    dataMode: snapshot.dataMode,
    dbProbed: snapshot.probed,
    dbFailure: snapshot.dbFailure,
    totalRevenue: snapshot.totalRevenueCents / 100,
    totalTransactions: snapshot.totalTransactions,
    providerCount: snapshot.providerCount,
    activeStripeLocksCount: snapshot.activeStripeLocksCount,
    b2gTotal: snapshot.b2gTotalCents / 100,
    artistCache: snapshot.splitCents.artista / 100,
    earOsFee: snapshot.splitCents.earOs / 100,
    vimumeFee: snapshot.splitCents.vimume / 100,
    stripeCustody: snapshot.stripeCustodyCents / 100,
    latestTransactions: snapshot.latestTransactions.map((t) => ({
      vertical: t.vertical,
      createdAt: new Date(t.createdAt),
      amountCents: t.amountCents,
      status: t.status,
    })),
  };

  return <AdminDashboardGate data={data} />;
}
