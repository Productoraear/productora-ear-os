'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Maximize2, Minimize2, Sparkles, 
  ChevronLeft, ChevronRight, CheckCircle2, Layers, 
  Share2, ArrowUpRight, Crown, Flame, Sliders
} from 'lucide-react';
import Link from 'next/link';

import Combo1_VipWeddingGala from './Combo1_VipWeddingGala';
import LeadTemperatureRouter, { LeadTemperature } from './LeadTemperatureRouter';
import Archetype1_TinderDeck from './Archetype1_TinderDeck';
import Archetype2_UberRadar from './Archetype2_UberRadar';
import Archetype3_AirbnbBento from './Archetype3_AirbnbBento';
import Archetype4_BodasTimeline from './Archetype4_BodasTimeline';
import Archetype5_CyberGlassDock from './Archetype5_CyberGlassDock';
import Archetype6_FastMatchDispatch from './Archetype6_FastMatchDispatch';
import Archetype7_WeddingMoodboardConcierge from './Archetype7_WeddingMoodboardConcierge';
import Archetype8_AcousticPressureMatrix from './Archetype8_AcousticPressureMatrix';
import Archetype9_StorysellingStream from './Archetype9_StorysellingStream';
import Archetype10_SovereignFusionMaster from './Archetype10_SovereignFusionMaster';

export const ARCHETYPES = [
  { id: 1, name: "The Neural Tinder-Deck", tag: "Tinder", desc: "Swipe táctil de formatos y medidor de afinidad nupcial" },
  { id: 2, name: "The Uber-Dispatch Radar", tag: "Uber", desc: "Radar GPS, cálculo KM y despacho de furgón técnico" },
  { id: 3, name: "The Airbnb Bento Stays", tag: "Airbnb", desc: "Experiencias curadas, Superhost y desglose 80/10/10" },
  { id: 4, name: "The Bodas.net 360° Architect", tag: "Bodas.net", desc: "Cronograma nupcial por hitos y cálculo de pack" },
  { id: 5, name: "The Cyber-Luxe Glass Dock", tag: "iOS 18+", desc: "Segmented dock flotante y Dynamic Island" },
  { id: 6, name: "Fast-Match & 1-Tap Dispatch", tag: "Tinder+Uber", desc: "Speed matching y slider de confirmación de rider" },
  { id: 7, name: "Wedding Moodboard Concierge", tag: "Bodas+Airbnb", desc: "Filtro por estética visual y acústica emparejada" },
  { id: 8, name: "Acoustic Pressure Matrix", tag: "Uber Engineering", desc: "Slider de pax, 12 W/pax y limitador <75 dB VIMUME" },
  { id: 9, name: "Storyselling Reel Stream", tag: "Social Reel", desc: "Historias audiovisuales inmersivas y drawer de cotización" },
  { id: 10, name: "EAR OS Master Sovereign Fusion", tag: "All-in-One", desc: "Síntesis total 360° de las 4 plataformas de élite" },
];

export default function MobileFusionContainer() {
  const [activeMode, setActiveMode] = useState<'combo1' | 'archetypes'>('combo1');
  const [selectedArchetype, setSelectedArchetype] = useState(1);
  const [isSimulatorMode, setIsSimulatorMode] = useState(true);
  const [leadTemp, setLeadTemp] = useState<LeadTemperature>('WARM');
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  const activeMeta = ARCHETYPES.find(a => a.id === selectedArchetype) || ARCHETYPES[0];

  const handlePrev = () => {
    setSelectedArchetype(prev => (prev > 1 ? prev - 1 : ARCHETYPES.length));
  };

  const handleNext = () => {
    setSelectedArchetype(prev => (prev < ARCHETYPES.length ? prev + 1 : 1));
  };

  const handleNavigateByTemp = (stageId: string) => {
    if (stageId === 'story-reel') {
      setActiveMode('archetypes');
      setSelectedArchetype(9);
    } else if (stageId === 'combo-1') {
      setActiveMode('combo1');
    } else if (stageId === 'instant-lock') {
      setActiveMode('archetypes');
      setSelectedArchetype(6);
    }
  };

  const renderActiveScreen = () => {
    if (activeMode === 'combo1') {
      return <Combo1_VipWeddingGala />;
    }

    switch (selectedArchetype) {
      case 1: return <Archetype1_TinderDeck />;
      case 2: return <Archetype2_UberRadar />;
      case 3: return <Archetype3_AirbnbBento />;
      case 4: return <Archetype4_BodasTimeline />;
      case 5: return <Archetype5_CyberGlassDock />;
      case 6: return <Archetype6_FastMatchDispatch />;
      case 7: return <Archetype7_WeddingMoodboardConcierge />;
      case 8: return <Archetype8_AcousticPressureMatrix />;
      case 9: return <Archetype9_StorysellingStream />;
      case 10: return <Archetype10_SovereignFusionMaster />;
      default: return <Combo1_VipWeddingGala />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-[#ecb613] selection:text-black flex flex-col items-center justify-start py-4 px-2 sm:px-4 relative overflow-x-hidden">
      
      {/* 🌌 AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ecb613]/5 blur-[140px] pointer-events-none" />

      {/* 🚀 TOP COMMAND BAR */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0d12]/90 border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-2xl shadow-2xl z-30 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ecb613] text-black flex items-center justify-center font-black text-sm shadow-lg shadow-[#ecb613]/25">
            S-10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-white font-syne">
                Laboratorio Mobile-First S-Class
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613] text-[9px] font-mono font-bold">
                COMBO 1 ACTIVO
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Fusión Airbnb + Uber + Tinder + Bodas.net · Termómetro de Lead y Configuración en Vivo
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/mobile-studio"
            className="py-2 px-3 rounded-xl bg-[#ecb613]/15 hover:bg-[#ecb613]/25 border border-[#ecb613]/40 text-[11px] font-mono text-[#ecb613] flex items-center gap-1.5 transition-all font-bold"
          >
            <Sliders size={14} />
            <span>Estudio Admin</span>
          </Link>

          <button
            onClick={() => setIsSimulatorMode(!isSimulatorMode)}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/80 flex items-center gap-1.5 transition-all"
          >
            <Smartphone size={14} className="text-[#ecb613]" />
            <span>{isSimulatorMode ? 'Marco iPhone' : 'Modo Fluido'}</span>
          </button>
        </div>
      </header>

      {/* 🧭 MODE SWITCHER & ARCHETYPE CONTROLLER */}
      <div className="w-full max-w-3xl mx-auto mb-4 z-20 space-y-3">
        
        {/* Main Mode Pill: Combo 1 (Elegido) vs 10 Arquetipos Raw */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveMode('combo1')}
            className={`py-2 px-5 rounded-2xl text-xs font-mono font-black uppercase transition-all flex items-center gap-2 ${
              activeMode === 'combo1' 
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 scale-105' 
                : 'bg-[#121218] border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <Crown size={15} />
            <span>Combo 1: VIP Wedding Gala (Selección CEO)</span>
          </button>

          <button
            onClick={() => setActiveMode('archetypes')}
            className={`py-2 px-4 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeMode === 'archetypes' 
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 scale-105' 
                : 'bg-[#121218] border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <Layers size={15} />
            <span>Ver los 10 Arquetipos</span>
          </button>
        </div>

        {/* Lead Temperature Dynamic Customer Journey Router */}
        <div className="max-w-md mx-auto">
          <LeadTemperatureRouter
            currentTemp={leadTemp}
            onTempChange={setLeadTemp}
            onNavigateToStage={handleNavigateByTemp}
          />
        </div>

        {/* 10 Archetypes Dock (if mode is archetypes) */}
        {activeMode === 'archetypes' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121218]/90 border border-white/15 p-2 rounded-2xl backdrop-blur-2xl shadow-xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar"
          >
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all shrink-0"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {ARCHETYPES.map((arch) => {
                const isSelected = arch.id === selectedArchetype;
                return (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArchetype(arch.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/25 scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                      {arch.id}
                    </span>
                    <span className="hidden sm:inline text-[11px] uppercase tracking-tight">{arch.tag}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </div>

      {/* 📱 ACTIVE VIEWPORT FRAME */}
      <main className="w-full flex items-center justify-center z-10">
        {isSimulatorMode ? (
          <div className="relative w-full max-w-[400px] h-[780px] rounded-[3.2rem] bg-[#0c0c12] border-[8px] border-[#22222d] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10">
            {/* Dynamic Island Bar */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c24] mr-2" />
              <div className="w-2 h-2 rounded-full bg-[#101018]" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-hidden pt-6 relative flex flex-col bg-[#050505]">
              {renderActiveScreen()}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
          </div>
        ) : (
          <div className="w-full max-w-md h-[740px] rounded-3xl bg-[#050505] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
            {renderActiveScreen()}
          </div>
        )}
      </main>

    </div>
  );
}
