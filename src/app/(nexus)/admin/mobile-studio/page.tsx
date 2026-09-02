'use client';

import React, { useState } from 'react';
import { Smartphone, Sparkles, Layers, Sliders } from 'lucide-react';
import MobileExperienceSelectorOLED from '@/components/admin/MobileExperienceSelectorOLED';
import MobileFusionAdminStudio from '@/components/admin/MobileFusionAdminStudio';

export default function MobileStudioPage() {
  const [activeTab, setActiveTab] = useState<'ORCHESTRATOR' | 'LAB'>('ORCHESTRATOR');

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* TABS DE SELECCIÓN EN EL HEADER DE LA SALA */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('ORCHESTRATOR')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'ORCHESTRATOR'
              ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone size={15} />
          <span>Selector de Traje Móvil (Producción)</span>
        </button>

        <button
          onClick={() => setActiveTab('LAB')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'LAB'
              ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={15} />
          <span>Laboratorio de Arquetipos Lego & Combos</span>
        </button>
      </div>

      {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
      {activeTab === 'ORCHESTRATOR' ? (
        <MobileExperienceSelectorOLED />
      ) : (
        <MobileFusionAdminStudio />
      )}

    </div>
  );
}
