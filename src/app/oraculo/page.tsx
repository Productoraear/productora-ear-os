import React from 'react';
import type { Metadata } from 'next';
import AdminOraculoPage from '@/app/admin/oraculo/page';
import { ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Oráculo Astra | Inteligencia Operativa, Diplomacia B2G & Cotizador Inmediato',
  description: 'Canal público de inteligencia de Productora EAR. Cotizaciones instantáneas, protocolos FITUR 2026 para consulados y embajadas, y cálculo de riders homologados en tiempo real.',
  keywords: ['oraculo astra', 'productora ear', 'fitur 2026', 'edwin agudelo', 'contrato menor lcsp', 'cotizador bodas madrid', 'bose f1']
};

export default function PublicOraculoPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 sm:pt-32 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Banner Superior de Garantía y Acceso Público */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-white font-bold">Canal Público Abierto</span>
          <span className="text-zinc-500">|</span>
          <span>Instituciones · Clientes · Artistas · Proveedores</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#ecb613]" /> Póliza RC 1.000.000 €
          </span>
          <span className="flex items-center gap-1">
            <Zap size={13} className="text-emerald-400" /> Price-Lock SHA-256
          </span>
        </div>
      </div>

      {/* Montaje del Oráculo Central */}
      <AdminOraculoPage />
    </main>
  );
}
