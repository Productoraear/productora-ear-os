'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, ShieldCheck, Heart, Sparkles, 
  Clock, MapPin, CheckCircle2, RotateCcw, Volume2
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype6_FastMatchDispatch() {
  const [formatIndex, setFormatIndex] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [distance, setDistance] = useState(30);

  const activeFormat = ARTIST_FORMATS[formatIndex % ARTIST_FORMATS.length];
  const quote = calculateQuote({
    basePrice: activeFormat.basePrice,
    extraMusicians: 0,
    distanceKm: distance,
    pax: 100,
    hasBoseSound: true,
    hasPhotocall: false
  });

  const handleNextFormat = () => {
    setFormatIndex(prev => prev + 1);
  };

  const handleSlideLock = () => {
    setIsLocked(true);
    const text = encodeURIComponent(
      `⚡ BLOQUEO RÁPIDO 1-TAP (TINDER+UBER):\n- Formato: ${activeFormat.name}\n- Tarifa: ${quote.total}€\n- Depósito de Bloqueo: 100€ Stripe\n- Garantía: Acústica 12W/pax y RC 1M€\nPor favor confirmar disponibilidad en agenda.`
    );
    setTimeout(() => {
      window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-hidden justify-between">
      
      {/* 🚀 TOP FAST-MATCH SPEED BAR */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <Zap size={14} className="text-[#ecb613] fill-[#ecb613]" />
          <span className="text-[10px] font-mono font-black text-[#ecb613] uppercase tracking-wider">
            FAST-MATCH & DISPATCH
          </span>
        </div>
        <button 
          onClick={handleNextFormat}
          className="flex items-center gap-1 text-[10px] font-mono text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-full transition-all"
        >
          <RotateCcw size={12} />
          <span>Siguiente Formato</span>
        </button>
      </div>

      {/* 🎴 FAST MATCH ARTIST CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFormat.id}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ duration: 0.25 }}
          className="my-auto rounded-3xl overflow-hidden border border-[#ecb613]/40 bg-gradient-to-b from-[#14141c] to-[#09090d] shadow-2xl relative p-5 space-y-4"
        >
          <div 
            className="h-44 rounded-2xl bg-cover bg-center relative overflow-hidden border border-white/10"
            style={{ backgroundImage: `url(${activeFormat.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1 text-[10px] font-mono text-[#ecb613]">
              <Sparkles size={12} />
              <span>{activeFormat.matchScore}% MATCH</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <div>
                <span className="text-[9px] font-mono text-[#ecb613] uppercase font-bold block">
                  {activeFormat.musiciansCount} Músicos de Gala
                </span>
                <h3 className="text-xl font-black uppercase text-white font-syne truncate">
                  {activeFormat.name}
                </h3>
              </div>
              <span className="text-xl font-black text-white font-mono bg-black/80 px-3 py-1 rounded-xl border border-white/10">
                {activeFormat.basePrice}€
              </span>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed font-light">
            {activeFormat.description}
          </p>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#ecb613] shrink-0" />
              <span className="text-white/80">Seguro RC 1M€</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center gap-2">
              <Volume2 size={14} className="text-emerald-400 shrink-0" />
              <span className="text-white/80">Bose F1 12 W/pax</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 🏎️ UBER 1-TAP SLIDE-TO-LOCK BOTTOM BAR */}
      <div className="space-y-2 z-10">
        {isLocked ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs font-mono">
              <CheckCircle2 size={16} />
              <span>BLOQUEO ATÓMICO ACTIVO · SHA-256</span>
            </div>
            <span className="text-[10px] text-white/70 font-mono block">
              Abriendo WhatsApp para validación inmediata...
            </span>
          </motion.div>
        ) : (
          <div className="relative w-full h-14 bg-[#121218] rounded-2xl p-1 border border-white/15 overflow-hidden flex items-center">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 230 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 170) {
                  handleSlideLock();
                }
              }}
              className="w-12 h-12 rounded-xl bg-[#ecb613] text-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-20"
            >
              <Zap size={20} className="fill-black stroke-black" />
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-8">
              <span className="text-[11px] font-black uppercase tracking-wider text-white/80 font-mono">
                Desliza para Bloquear 100€ ➔
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
