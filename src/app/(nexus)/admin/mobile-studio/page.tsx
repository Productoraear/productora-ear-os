'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  Sparkles, 
  Layers, 
  Sliders, 
  Home as HomeIcon, 
  Palette, 
  Compass,
  Zap,
  Flame,
  LayoutGrid
} from 'lucide-react';
import MobileExperienceSelectorOLED from '@/components/admin/MobileExperienceSelectorOLED';
import MobileFusionAdminStudio from '@/components/admin/MobileFusionAdminStudio';

type MobileStudioTab = 'TRAJES' | 'PRESETS' | 'CUSTOM_LEGO' | 'HOMEPAGE' | 'EDITORIAL' | 'CATALOG';

export default function MobileStudioPage() {
  const [activeTab, setActiveTab] = useState<MobileStudioTab>('TRAJES');

  const handleNavigateFromOrchestrator = (subTab: 'presets' | 'custom' | 'homepage' | 'editorial-lego' | 'catalog') => {
    switch (subTab) {
      case 'presets':
        setActiveTab('PRESETS');
        break;
      case 'custom':
        setActiveTab('CUSTOM_LEGO');
        break;
      case 'homepage':
        setActiveTab('HOMEPAGE');
        break;
      case 'editorial-lego':
        setActiveTab('EDITORIAL');
        break;
      case 'catalog':
        setActiveTab('CATALOG');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 👑 MASTER COMMAND RIBBON: TODAS LAS OPCIONES DE PERSONALIZACIÓN VISIBLES Y ACCESIBLES */}
      <div className="p-4 rounded-3xl bg-[#0a0a14] border border-[#ecb613]/20 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#ecb613] text-black flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <h2 className="text-sm font-bold font-syne uppercase tracking-wider text-white">
                Mobile Experience & Architectural Fusion Studio
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                Soberanía Visual · Runtime Routing · 5 Combos 360° · Mezclador Lego · 7 Portadas Home
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 w-fit">
            SSOT S-CLASS COMPLIANT
          </span>
        </div>

        {/* CINTA DE PESTAÑAS S-CLASS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('TRAJES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'TRAJES'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
            }`}
          >
            <Smartphone size={15} />
            <span>1. Trajes Base & Runtime</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESETS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'PRESETS'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
            }`}
          >
            <Sparkles size={15} />
            <span>2. 5 Combos Maestros 360°</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOM_LEGO')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'CUSTOM_LEGO'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
            }`}
          >
            <Layers size={15} />
            <span>3. Mezclador Modular Lego</span>
          </button>

          <button
            onClick={() => setActiveTab('HOMEPAGE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'HOMEPAGE'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
            }`}
          >
            <HomeIcon size={15} />
            <span>4. 7 Portadas Home</span>
          </button>

          <button
            onClick={() => setActiveTab('EDITORIAL')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'EDITORIAL'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
            }`}
          >
            <Palette size={15} />
            <span>5. Editorial Bento S-Class</span>
          </button>

          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'CATALOG'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
            }`}
          >
            <LayoutGrid size={15} />
            <span>6. Catálogo 10 Arquetipos</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
      {activeTab === 'TRAJES' && (
        <MobileExperienceSelectorOLED onNavigateToTab={handleNavigateFromOrchestrator} />
      )}

      {activeTab === 'PRESETS' && (
        <MobileFusionAdminStudio initialTab="presets" />
      )}

      {activeTab === 'CUSTOM_LEGO' && (
        <MobileFusionAdminStudio initialTab="custom" />
      )}

      {activeTab === 'HOMEPAGE' && (
        <MobileFusionAdminStudio initialTab="homepage" />
      )}

      {activeTab === 'EDITORIAL' && (
        <MobileFusionAdminStudio initialTab="editorial-lego" />
      )}

      {activeTab === 'CATALOG' && (
        <MobileFusionAdminStudio initialTab="catalog" />
      )}

    </div>
  );
}
