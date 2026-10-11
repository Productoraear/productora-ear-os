import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import ManualOperationsBoundary from '@/components/admin/ManualOperationsBoundary';

export const metadata: Metadata = {
  title: 'Manual de Operaciones EAR OS 2030-2050 | Omni-Cockpit',
  description: 'Doctrina de inducción y protocolos operativos militares para agentes, marketing, rodaje 4K y CEO.'
};

export default function ManualOperacionesPage(): ReactElement {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>Gobernanza</span>
        <span>/</span>
        <span className="text-[#ecb613]">Manual de Operaciones 360</span>
      </div>

      <ManualOperationsBoundary />
    </div>
  );
}