import type React from 'react';
import { requireAdminFromHeaders } from '@/lib/security/adminGuard';
import { ConciergeScraperGate } from './ConciergeScraperGate';

export async function AdminConciergeBridge(): Promise<React.JSX.Element | null> {
  const auth = await requireAdminFromHeaders();
  if (!auth.ok) {
    return null;
  }
  return <ConciergeScraperGate />;
}
