'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Maximize2, Minimize2, Sparkles, 
  ChevronLeft, ChevronRight, CheckCircle2, Layers, 
  Share2, ArrowUpRight, HelpCircle
} from 'lucide-react';

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
  const [selectedArchetype, setSelectedArchetype] = useState(1);
  const [isSimulatorMode, setIsSimulatorMode] = useState(true);
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  const activeMeta = ARCHETYPES.find(a => a.id === selectedArchetype) || ARCHETYPES[0];

  const handlePrev = () => {
    setSelectedArchetype(prev => (prev > 1 ? prev - 1 : ARCHETYPES.length));
  };

  const handleNext = () => {
    setSelectedArchetype(prev => (prev < ARCHETYPES.length ? prev + 1 : 1));
  };

  const renderActiveArchetype = () => {
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
      default: return <Archetype1_TinderDeck />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-[#ecb613] selection:text-black flex flex-col items-center justify-start py-4 px-2 sm:px-4 relative overflow-x-hidden">
      
      {/* 🌌 AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ecb613]/5 blur-[140px] pointer-events-none" />

      {/* 🚀 TOP COMMAND BAR & S-CLASS SUITE CONTROLLER */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0d12]/90 border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-2xl shadow-2xl z-30 mb-6">
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
                10 PARADIGMAS
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Airbnb + Uber + Tinder + Bodas.net · Selecciona el diseño que deseas validar
            </p>
          </div>
        </div>

        {/* Action Controls & View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMatrixModal(true)}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/80 flex items-center gap-1.5 transition-all"
          >
            <Layers size={14} className="text-[#ecb613]" />
            <span>Matriz Comparativa</span>
          </button>

          <button
            onClick={() => setIsSimulatorMode(!isSimulatorMode)}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/80 flex items-center gap-1.5 transition-all"
          >
            <Smartphone size={14} className="text-[#ecb613]" />
            <span>{isSimulatorMode ? 'Modo Marco iPhone' : 'Modo Fluido Full'}</span>
          </button>
        </div>
      </header>

      {/* 🎛️ FLOATING ARCHETYPE SELECTOR DOCK (NUMBERS 1 TO 10) */}
      <div className="w-full max-w-3xl mx-auto mb-6 z-20">
        <div className="bg-[#121218]/90 border border-white/15 p-2 rounded-2xl backdrop-blur-2xl shadow-xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all shrink-0"
            title="Anterior"
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
            title="Siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Active Archetype High-Signal Badge */}
        <div className="mt-2 flex items-center justify-between px-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#ecb613] font-bold">Alternativa {selectedArchetype}:</span>
            <span className="text-white font-bold">{activeMeta.name}</span>
          </div>
          <span className="text-white/40 hidden sm:inline">{activeMeta.desc}</span>
        </div>
      </div>

      {/* 📱 ACTIVE VIEWPORT FRAME (SIMULATOR OR FLUID) */}
      <main className="w-full flex items-center justify-center z-10">
        {isSimulatorMode ? (
          /* iPhone 16 Pro Style High-End Frame */
          <div className="relative w-full max-w-[400px] h-[780px] rounded-[3.2rem] bg-[#0c0c12] border-[8px] border-[#22222d] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10">
            {/* Dynamic Island Speaker Bar */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c24] mr-2" />
              <div className="w-2 h-2 rounded-full bg-[#101018]" />
            </div>

            {/* Screen Content Container */}
            <div className="flex-1 overflow-hidden pt-6 relative flex flex-col bg-[#050505]">
              {renderActiveArchetype()}
            </div>

            {/* Home Indicator Pill */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
          </div>
        ) : (
          /* Fluid Native Mobile Full Width Viewport */
          <div className="w-full max-w-md h-[740px] rounded-3xl bg-[#050505] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
            {renderActiveArchetype()}
          </div>
        )}
      </main>

      {/* 📊 COMPARISON MATRIX MODAL */}
      <AnimatePresence>
        {showMatrixModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-50 p-4 sm:p-8 flex items-center justify-center"
          >
            <div className="bg-[#0e0e14] border border-[#ecb613]/40 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black uppercase text-white font-syne">
                    Matriz de los 10 Paradigmas Mobile-First
                  </h3>
                  <p className="text-xs text-white/50 font-mono">
                    Comparativa de arquitectura UX/UI para selección del CEO
                  </p>
                </div>
                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                >✕</button>
              </div>

              <div className="overflow-y-auto pr-2 py-4 space-y-2.5">
                {ARCHETYPES.map((arch) => {
                  const isCurrent = arch.id === selectedArchetype;
                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        setSelectedArchetype(arch.id);
                        setShowMatrixModal(false);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#ecb613]/15 border-[#ecb613] text-white'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-[#ecb613]">
                          {arch.id}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black uppercase">{arch.name}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-[#ecb613]">
                              {arch.tag}
                            </span>
                          </div>
                          <p className="text-xs text-white/50">{arch.desc}</p>
                        </div>
                      </div>

                      <button className="px-3 py-1 rounded-xl bg-[#ecb613] text-black text-xs font-black font-mono">
                        PROBAR ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
