'use client';

import dynamic from 'next/dynamic';
import type React from 'react';
import type { AdminDashboardData } from './AdminDashboardClient';

const AdminDashboardClient = dynamic(() => import('./AdminDashboardClient'), { ssr: false });

export function AdminDashboardGate({ data }: { data: AdminDashboardData }): React.JSX.Element {
  return <AdminDashboardClient data={data} />;
}
