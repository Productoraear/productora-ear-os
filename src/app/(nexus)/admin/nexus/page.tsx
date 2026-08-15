'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Activity } from 'lucide-react';
import NexusRealCockpit from '@/components/admin/NexusRealCockpit';

// 1. Inyección Segura: Carga diferida sin SSR para evitar bloqueos de hidratación
const OmegaCockpitPanel = dynamic(() => import('@/modules/SClassScreens/panels/OmegaCockpitPanel'), { 
  ssr: false, 
  loading: () => <PanelSkeleton title="Cargando Omega Cockpit..." /> 
});

const FinancialPanel = dynamic(() => import('@/modules/SClassScreens/panels/FinancialPanel'), { 
  ssr: false, 
  loading: () => <PanelSkeleton title="Calculando Commission Ledger..." /> 
});

const HunterPanel = dynamic(() => import('@/modules/SClassScreens/panels/HunterPanel'), { 
  ssr: false, 
  loading: () => <PanelSkeleton title="Sincronizando Alertas BOE / BOP / PLACSP..." /> 
});

// 2. Fallback S-Class (Aura Onyx)
const PanelSkeleton = ({ title }: { title: string }) => (
  <div className="h-96 w-full bg-[#0a0a0c] border border-[#ecb613]/20 rounded-2xl p-6 flex flex-col items-center justify-center animate-pulse shadow-[0_0_30px_rgba(236,182,19,0.05)]">
    <Activity className="w-8 h-8 text-[#ecb613] mb-4 opacity-50" />
    <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">{title}</span>
  </div>
);

// 3. Chasis de Cristal (Nexus Dashboard con Telemetría Real)
export default function NexusCommandCenter() {
  return (
    <div className="min-h-screen bg-[#050505] p-4 lg:p-8 text-white font-sans space-y-8">
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[#ecb613] text-xs font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-1 rounded-full bg-[#ecb613]/5">
            Centro de Mando Supremo :: Telemetría Real en Vivo
          </span>
          <h1 className="text-3xl font-extrabold mt-3 tracking-tight">NEXUS S-CLASS</h1>
          <p className="text-slate-400 text-sm mt-1">Telemetría Operativa, Licitaciones B2G y Flujo de Caja Soberano</p>
        </div>
      </div>

      {/* 📊 TELEMETRÍA 100% REAL Y FUNCIONAL (CERO DATOS VANIDOSOS) */}
      <NexusRealCockpit />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Celda Principal (Span 2) */}
        <div className="xl:col-span-2 space-y-6">
          <Suspense fallback={<PanelSkeleton title="Omega Cockpit" />}>
            <OmegaCockpitPanel />
          </Suspense>
          
          <Suspense fallback={<PanelSkeleton title="Hunter Radar" />}>
            <HunterPanel />
          </Suspense>
        </div>

        {/* Celda Lateral (Finanzas) */}
        <div className="xl:col-span-1">
          <Suspense fallback={<PanelSkeleton title="Financial Ledger" />}>
            <FinancialPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
