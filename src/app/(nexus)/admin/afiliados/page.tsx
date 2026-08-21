"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Users, Activity } from 'lucide-react';

const AffiliatesPanel = dynamic(() => import('@/modules/SClassScreens/panels/AffiliatesPanel'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-[#0a0a0c] border border-[#ecb613]/20 rounded-2xl p-6 flex flex-col items-center justify-center animate-pulse shadow-[0_0_30px_rgba(236,182,19,0.05)]">
      <Activity className="w-8 h-8 text-[#ecb613] mb-4 opacity-50" />
      <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Cargando Red de Afiliados...</span>
    </div>
  )
});

export default function AdminAfiliadosPage() {
  return (
    <div className="min-h-screen bg-[#050505] p-4 lg:p-8 text-white font-sans space-y-8">
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[#ecb613] text-xs font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-1 rounded-full bg-[#ecb613]/5">
            Módulo de Control :: Red de Embajadores & Liquidaciones
          </span>
          <h1 className="text-3xl font-extrabold mt-3 tracking-tight font-syne">GESTIÓN DE AFILIADOS & PARTNERS</h1>
          <p className="text-slate-400 text-sm mt-1">Supervisión de comisiones, aprobación por lotes y validación de KYC.</p>
        </div>
      </div>

      <div className="w-full">
        <Suspense fallback={<div>Cargando...</div>}>
          <AffiliatesPanel />
        </Suspense>
      </div>
    </div>
  );
}
