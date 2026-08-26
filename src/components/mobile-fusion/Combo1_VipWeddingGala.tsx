'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, ShieldCheck, Zap, Volume2, 
  Users, Calendar, Clock, Star, Award, CheckCircle2, 
  ArrowRight, ChevronDown, ChevronUp, Music, Sliders
} from 'lucide-react';
import { 
  ARTIST_FORMATS, 
  SOVEREIGN_ARTIST, 
  WEDDING_MILESTONES_DEFAULT, 
  calculateQuote, 
  WeddingMilestone 
} from './types';

export default function Combo1_VipWeddingGala() {
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [milestones, setMilestones] = useState<WeddingMilestone[]>(WEDDING_MILESTONES_DEFAULT);
  const [paxCount, setPaxCount] = useState(130);
  const [distanceKm, setDistanceKm] = useState(30);
  const [isSlideUnlocked, setIsSlideUnlocked] = useState(false);
  const [showSplitDrawer, setShowSplitDrawer] = useState(false);

  const currentFormat = ARTIST_FORMATS[selectedFormatIndex % ARTIST_FORMATS.length];
  
  // Calculate total across selected timeline milestones or active format
  const activeMilestones = milestones.filter(m => m.selectedFormatId !== null);
  const milestoneSum = activeMilestones.reduce((acc, m) => {
    const fmt = ARTIST_FORMATS.find(f => f.id === m.selectedFormatId);
    return acc + (fmt ? fmt.basePrice : 0);
  }, 0);

  const basePriceToUse = milestoneSum > 0 ? milestoneSum : currentFormat.basePrice;
  const quote = calculateQuote({
    basePrice: basePriceToUse,
    extraMusicians: 0,
    distanceKm,
    pax: paxCount,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const toggleMilestone = (id: string, formatId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          selectedFormatId: m.selectedFormatId === formatId ? null : formatId
        };
      }
      return m;
    }));
  };

  const handleSlideComplete = () => {
    setIsSlideUnlocked(true);
    const agendaSummary = activeMilestones.map(m => {
      const f = ARTIST_FORMATS.find(item => item.id === m.selectedFormatId);
      return `• ${m.name}: ${f?.name} (${f?.basePrice}€)`;
    }).join('\n');

    const text = encodeURIComponent(
      `👑 COMBO 1: THE VIP WEDDING GALA 360° (EAR OS)\n` +
      `Artista Principal: ${SOVEREIGN_ARTIST.name}\n` +
      `Invitados: ${paxCount} pax (${paxCount * 12}W Bose F1 Homologados)\n` +
      `Distancia: ${distanceKm} km desde Madrid\n\n` +
      `CRONOGRAMA NUPCIAL:\n${agendaSummary || `• Show Principal: ${currentFormat.name}`}\n\n` +
      `PRESUPUESTO TOTAL: ${quote.total} €\n` +
      `DEPÓSITO STRIPE: 100 € (Price-Lock Atómico)\n` +
      `Solicito confirmar disponibilidad en agenda oficial.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4 pb-28">
      
      {/* 🏝️ 1. DYNAMIC ISLAND TOP STATUS PILL (iOS 18+ STYLE) */}
      <motion.div 
        layout
        className="w-full bg-[#121218]/90 border border-white/15 backdrop-blur-2xl rounded-full p-2 px-3.5 flex items-center justify-between shadow-2xl z-20"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
            COMBO 1 · VIP GALA 360°
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-emerald-400 font-bold">{paxCount * 12}W RMS</span>
          <span className="text-white/40">|</span>
          <span className="text-[#ecb613] font-bold">100€ STRIPE LOCK</span>
        </div>
      </motion.div>

      {/* 🎴 2. TINDER-STYLE ARTIST DISCOVERY DECK WITH AUDIO WAVEFORM */}
      <div className="rounded-3xl overflow-hidden relative border border-[#ecb613]/40 bg-gradient-to-b from-[#161622] to-[#0a0a0f] shadow-2xl p-4 space-y-3">
        <div 
          className="h-44 rounded-2xl bg-cover bg-center relative overflow-hidden border border-white/10 flex flex-col justify-between p-3"
          style={{ backgroundImage: `url(${currentFormat.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          
          <div className="relative z-10 flex justify-between items-center">
            <span className="px-2 py-0.5 rounded-full bg-[#ecb613] text-black text-[9px] font-mono font-black uppercase">
              {currentFormat.matchScore}% AFINIDAD NUPCIAL
            </span>
            <span className="text-xs font-black text-white bg-black/70 px-2.5 py-0.5 rounded-lg border border-white/10 font-mono">
              {currentFormat.basePrice}€
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase text-white font-syne">{currentFormat.name}</h3>
            <p className="text-xs text-[#ecb613] line-clamp-1">{currentFormat.subtitle}</p>
          </div>
        </div>

        {/* Audio Waveform Bar */}
        <div className="bg-black/50 p-2 rounded-2xl border border-white/10 flex items-center justify-between">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#ecb613] transition-colors"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isPlayingAudio ? 'bg-[#ecb613] text-black animate-pulse' : 'bg-white/10 text-white'}`}>
              <Volume2 size={12} />
            </div>
            <span className="text-[10px] font-mono">
              {isPlayingAudio ? 'Reproduciendo demo lírica...' : 'Escuchar Voz en Directo'}
            </span>
          </button>

          <div className="flex items-center gap-0.5 h-3">
            {[30, 80, 100, 60, 90, 45, 75].map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: isPlayingAudio ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] : '20%' }}
                transition={{ repeat: Infinity, duration: 0.7 + i * 0.1, ease: 'easeInOut' }}
                className="w-1 bg-[#ecb613] rounded-full"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Next/Prev Format Selector */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          {ARTIST_FORMATS.map((fmt, i) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormatIndex(i)}
              className={`py-1.5 px-1 rounded-xl text-center text-[9px] font-mono transition-all truncate ${
                selectedFormatIndex === i 
                  ? 'bg-[#ecb613] text-black font-bold shadow-md' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {fmt.musiciansCount === 1 ? 'Solista' : `${fmt.musiciansCount} Pax`}
            </button>
          ))}
        </div>
      </div>

      {/* 👰 3. BODAS.NET 360° WEDDING TIMELINE ORCHESTRATOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">
            CRONOGRAMA NUPCIAL (BODAS.NET ARCHITECT)
          </span>
          <span className="text-[9px] text-[#ecb613] font-mono font-bold">
            {activeMilestones.length} Momentos Asignados
          </span>
        </div>

        <div className="space-y-2">
          {milestones.map((m, idx) => {
            const isAssigned = m.selectedFormatId !== null;
            return (
              <div 
                key={m.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isAssigned 
                    ? 'bg-[#15151c] border-[#ecb613]/50 shadow-md' 
                    : 'bg-[#0d0d10] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black uppercase text-white">{m.name}</h5>
                    <span className="text-[9px] text-white/40 font-mono">{m.timeSlot} · Máx {m.volumeLimitDb} dB</span>
                  </div>

                  <button
                    onClick={() => toggleMilestone(m.id, currentFormat.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all ${
                      isAssigned 
                        ? 'bg-[#ecb613] text-black' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {isAssigned ? '✓ Incluido' : '+ Asignar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 👑 4. AIRBNB SUPERHOST CARD & TRANSPARENT SPLIT */}
      <div className="p-3.5 rounded-3xl bg-[#111116] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[#ecb613]">
              <img src={SOVEREIGN_ARTIST.avatar} alt="Edwin Agudelo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black uppercase text-white">{SOVEREIGN_ARTIST.name}</h4>
                <span className="px-1.5 py-0.2 rounded bg-[#ecb613] text-black text-[8px] font-mono font-bold">
                  PACIENTE CERO
                </span>
              </div>
              <span className="text-[9px] text-white/50 font-mono block">37+ Giras · Método VIMUME</span>
            </div>
          </div>

          <button
            onClick={() => setShowSplitDrawer(!showSplitDrawer)}
            className="text-[10px] font-mono text-[#ecb613] hover:underline flex items-center gap-1"
          >
            <span>Split 80/10/10</span>
            {showSplitDrawer ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {showSplitDrawer && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-2 border-t border-white/10 space-y-1.5 text-xs font-mono"
          >
            <div className="flex justify-between text-white/70">
              <span>Músicos & Voz Lírica (80%)</span>
              <span className="text-white font-bold">{quote.split.artist} €</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>EAR OS Infraestructura FOH (10%)</span>
              <span className="text-white font-bold">{quote.split.ear} €</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Fondo Social VIMUME Residencias (10%)</span>
              <span className="text-emerald-400 font-bold">{quote.split.vimume} €</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 🚀 5. UBER SLIDE-TO-LOCK BOTTOM BAR (STRIPE 100€ & WHATSAPP DISPATCH) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-black/95 backdrop-blur-2xl border-t border-white/15 z-40 max-w-[420px] mx-auto space-y-2">
        <div className="flex justify-between items-baseline px-1">
          <div>
            <span className="text-[9px] font-mono text-white/50 block">PRESUPUESTO TOTAL</span>
            <span className="text-xl font-black text-white">{quote.total} €</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-[#ecb613] block">DEPÓSITO STRIPE</span>
            <span className="text-sm font-black text-[#ecb613]">100 € (Price-Lock)</span>
          </div>
        </div>

        {isSlideUnlocked ? (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-center">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 size={14} /> BLOQUEO ENVIADO A EDWIN (+34 693 693 048)
            </span>
          </div>
        ) : (
          <div className="relative w-full h-13 bg-[#13131a] rounded-2xl p-1 border border-[#ecb613]/40 overflow-hidden flex items-center">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 220 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 160) {
                  handleSlideComplete();
                }
              }}
              className="w-11 h-11 rounded-xl bg-[#ecb613] text-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-20"
            >
              <ArrowRight size={18} className="stroke-[3]" />
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/80 font-mono animate-pulse">
                Desliza para Bloquear Fecha (100€) ➔
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
