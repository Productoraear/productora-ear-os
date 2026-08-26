'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, Zap, ShieldCheck, ChevronUp, Music, 
  Volume2, Users, MapPin, Sparkles, Check, ArrowRight 
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype5_CyberGlassDock() {
  const [activeTierIndex, setActiveTierIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pax, setPax] = useState(120);

  const currentTier = ARTIST_FORMATS[activeTierIndex];
  const quote = calculateQuote({
    basePrice: currentTier.basePrice,
    extraMusicians: 0,
    distanceKm: 20,
    pax,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const handleStripeLock = () => {
    const text = encodeURIComponent(
      `⚡ CYBER-LUXE DOCK S-CLASS:\n- Formato: ${currentTier.name}\n- Tarifa Base: ${currentTier.basePrice}€\n- Asistentes: ${pax} pax\n- Potencia: ${pax * 12}W Bose\n- Depósito Stripe: 100€`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-hidden">
      
      {/* 🏝️ DYNAMIC ISLAND TOP PILL (iOS 18+ STYLE) */}
      <motion.div 
        layout
        className="w-full bg-[#121218]/90 border border-white/15 backdrop-blur-2xl rounded-full p-2 px-4 flex items-center justify-between shadow-2xl z-20"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
            EAR OS LIVE · S-CLASS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-emerald-400 font-bold">{pax * 12}W RMS</span>
          <span className="text-white/40">|</span>
          <span className="text-[#ecb613] font-bold">100€ LOCK</span>
        </div>
      </motion.div>

      {/* 🔮 HERO HOLOGRAPHIC ARTIST CARD */}
      <div className="flex-1 my-4 rounded-3xl overflow-hidden relative border border-white/10 flex flex-col justify-end p-5 bg-[#0a0a0f]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${currentTier.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono tracking-widest">
              NIVEL {activeTierIndex + 1}
            </span>
            <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
              {currentTier.duration}
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tight text-white font-syne">
            {currentTier.name}
          </h3>
          <p className="text-xs text-[#ecb613] font-medium line-clamp-1">
            {currentTier.subtitle}
          </p>

          {/* Micro stats grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <span className="text-[8px] font-mono text-white/50 block">MÚSICOS</span>
              <span className="text-xs font-black text-white">{currentTier.musiciansCount}</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <span className="text-[8px] font-mono text-white/50 block">PRESIÓN</span>
              <span className="text-xs font-black text-emerald-400">{currentTier.acousticPowerWatts}W</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <span className="text-[8px] font-mono text-white/50 block">TARIFA</span>
              <span className="text-xs font-black text-[#ecb613]">{currentTier.basePrice}€</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎛️ FROSTED SEGMENTED GLASS DOCK (iOS STYLE SWITCHER) */}
      <div className="bg-[#111116]/80 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl grid grid-cols-4 gap-1 z-10">
        {ARTIST_FORMATS.map((tier, idx) => {
          const isActive = idx === activeTierIndex;
          return (
            <button
              key={tier.id}
              onClick={() => setActiveTierIndex(idx)}
              className={`py-2 px-1 rounded-xl text-center transition-all ${
                isActive 
                  ? 'bg-[#ecb613] text-black font-black shadow-lg shadow-[#ecb613]/20 scale-[1.02]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-[9px] font-mono block uppercase">
                {idx === 0 ? 'Solista' : idx === 1 ? 'Cuarteto' : idx === 2 ? 'Gala 6' : 'Orquesta'}
              </span>
              <span className="text-xs font-bold block">{tier.basePrice}€</span>
            </button>
          );
        })}
      </div>

      {/* 🚀 QUICK ACTION EXPANDER BUTTON */}
      <div className="mt-3 flex items-center gap-2 z-10">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase font-mono flex items-center justify-center gap-1.5 transition-all"
        >
          <ChevronUp size={16} className="text-[#ecb613]" />
          <span>Configurar Rider</span>
        </button>

        <button
          onClick={handleStripeLock}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#ecb613]/30 active:scale-95 transition-all"
        >
          <span>Bloquear 100€</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 📱 PULL-UP GLASS CONFIGURATION DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-16 bg-[#0c0c12]/95 backdrop-blur-3xl border-t border-[#ecb613]/40 rounded-t-[2.5rem] p-6 z-50 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-black uppercase text-white font-syne">
                  Ajustes de Sonorización S-Class
                </h4>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono"
                >✕</button>
              </div>

              {/* Pax Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Asistentes previstos</span>
                  <span className="font-bold text-[#ecb613]">{pax} personas</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                />
              </div>

              {/* Rider specs */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50 font-mono">Potencia homol. (12W/pax)</span>
                  <span className="font-mono font-bold text-emerald-400">{pax * 12} Watts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 font-mono">Equipo principal</span>
                  <span className="font-mono text-white">Bose F1 Model 812</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 font-mono">Microfonía</span>
                  <span className="font-mono text-white">Shure Axient Digital</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStripeLock}
              className="w-full py-4 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20"
            >
              <span>Confirmar Bloqueo y Cerrar Rider</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
