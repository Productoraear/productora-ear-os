'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Heart, X, Sparkles, Volume2, ShieldCheck, 
  ChevronRight, ArrowRight, Share2, Info, Check, 
  Music, MapPin, Zap, Star
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype1_TinderDeck({ onBook }: { onBook?: (formatId: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likedList, setLikedList] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const currentFormat = ARTIST_FORMATS[currentIndex % ARTIST_FORMATS.length];
  const quote = calculateQuote({
    basePrice: currentFormat.basePrice,
    extraMusicians: 0,
    distanceKm: 25,
    pax: 120,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityNope = useTransform(x, [-150, -20], [1, 0]);
  const opacityLike = useTransform(x, [20, 150], [0, 1]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLikedList(prev => [...prev, currentFormat.id]);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola Edwin, vengo de probar el Tinder-Deck S-Class de EAR OS. Me interesa el formato ${currentFormat.name} (${currentFormat.basePrice}€). ¿Tenéis disponibilidad para mi fecha?`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-hidden">
      
      {/* 🧭 TOP BRAND & MATCH PILL */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] font-bold text-xs">
            EA
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-white">Tinder Discovery</span>
              <span className="px-1.5 py-0.5 rounded bg-[#ecb613]/20 text-[#ecb613] text-[9px] font-mono font-bold">VIBE-MATCH</span>
            </div>
            <span className="text-[10px] text-white/50 block">Desliza para descubrir formatos</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
          <Sparkles size={12} className="text-[#ecb613]" />
          <span className="text-[10px] font-mono font-bold text-[#ecb613]">
            {currentFormat.matchScore}% AFINIDAD
          </span>
        </div>
      </div>

      {/* 🎴 SWIPEABLE CARD CONTAINER */}
      <div className="relative flex-1 w-full min-h-[460px] max-h-[580px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentFormat.id + currentIndex}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleSwipe('right');
              else if (info.offset.x < -100) handleSwipe('left');
            }}
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/15 bg-gradient-to-b from-[#16161c] to-[#0a0a0d] shadow-2xl flex flex-col justify-end p-5 cursor-grab active:cursor-grabbing"
          >
            {/* Background Image with Cinematic Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${currentFormat.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

            {/* Stamp Overlays during Swipe */}
            <motion.div 
              style={{ opacity: opacityLike }}
              className="absolute top-8 right-6 rotate-12 border-2 border-emerald-400 bg-emerald-500/20 backdrop-blur-md text-emerald-400 font-black text-sm uppercase px-4 py-1.5 rounded-xl tracking-widest shadow-lg pointer-events-none"
            >
              ¡ME ENCANTA! 🔥
            </motion.div>
            <motion.div 
              style={{ opacity: opacityNope }}
              className="absolute top-8 left-6 -rotate-12 border-2 border-rose-500 bg-rose-500/20 backdrop-blur-md text-rose-400 font-black text-sm uppercase px-4 py-1.5 rounded-xl tracking-widest shadow-lg pointer-events-none"
            >
              SIGUIENTE ⏭️
            </motion.div>

            {/* Live Audio Waveform Simulation Bar */}
            <div className="relative z-10 mb-3 bg-black/50 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl flex items-center justify-between">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsPlayingAudio(!isPlayingAudio); }}
                className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#ecb613] transition-colors"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isPlayingAudio ? 'bg-[#ecb613] text-black animate-pulse' : 'bg-white/10 text-white'}`}>
                  <Volume2 size={14} />
                </div>
                <span className="text-[11px]">{isPlayingAudio ? 'Reproduciendo demo lírica...' : 'Escuchar Voz en Directo'}</span>
              </button>

              {/* Animated Equalizer Bars */}
              <div className="flex items-center gap-0.5 h-4">
                {[40, 75, 90, 50, 85, 60, 100, 45].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: isPlayingAudio ? [`${h * 0.2}%`, `${h}%`, `${h * 0.4}%`] : '20%' }}
                    transition={{ repeat: Infinity, duration: 0.8 + (i * 0.1), ease: 'easeInOut' }}
                    className="w-1 bg-[#ecb613] rounded-full"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Card Content & Authority */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono tracking-widest">
                  {currentFormat.musiciansCount === 1 ? 'SOLISTA ESTRELLA' : `${currentFormat.musiciansCount} MÚSICOS`}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white text-[9px] font-mono flex items-center gap-1">
                  <Star size={10} className="text-[#ecb613] fill-[#ecb613]" /> {currentFormat.rating} ({currentFormat.reviewCount})
                </span>
                <span className="text-[9px] text-white/70 font-mono">
                  {currentFormat.duration}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-syne flex items-center gap-2">
                  {currentFormat.name}
                </h3>
                <p className="text-xs text-[#ecb613] font-medium line-clamp-1">
                  {currentFormat.subtitle}
                </p>
              </div>

              <p className="text-[11px] text-white/75 line-clamp-2 leading-snug">
                {currentFormat.description}
              </p>

              {/* Repertoire Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                {currentFormat.repertoire.slice(0, 3).map((song, i) => (
                  <span key={i} className="shrink-0 text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-white/80 font-mono">
                    🎵 {song}
                  </span>
                ))}
              </div>

              {/* Price & Guarantee Footer in Card */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-white/50 block font-mono">TARIFA COMPLETA</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-white">{currentFormat.basePrice}€</span>
                    <span className="text-[10px] text-[#ecb613] font-mono">100€ Depósito</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-white/50 block font-mono">POTENCIA S-CLASS</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{currentFormat.acousticPowerWatts}W Homologados</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🎮 FLOATING TACTILE ACTION CONTROLS */}
      <div className="grid grid-cols-4 gap-2 pt-3 z-10">
        {/* Pass Button */}
        <button
          onClick={() => handleSwipe('left')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#121216] border border-white/10 hover:border-rose-500/50 text-white/70 hover:text-rose-400 active:scale-95 transition-all shadow-lg"
          title="Descartar"
        >
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
            <X size={18} />
          </div>
          <span className="text-[9px] font-mono font-bold mt-1">PASAR</span>
        </button>

        {/* Super Like / Match */}
        <button
          onClick={() => handleSwipe('right')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-[#ecb613]/20 to-[#121216] border border-[#ecb613]/50 text-[#ecb613] active:scale-95 transition-all shadow-lg shadow-[#ecb613]/10"
          title="Super-Like"
        >
          <div className="w-9 h-9 rounded-full bg-[#ecb613] text-black flex items-center justify-center">
            <Heart size={18} className="fill-black" />
          </div>
          <span className="text-[9px] font-mono font-black mt-1">MATCH</span>
        </button>

        {/* Info Dossier */}
        <button
          onClick={() => setShowDetailModal(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#121216] border border-white/10 hover:border-blue-500/50 text-white/70 hover:text-blue-400 active:scale-95 transition-all shadow-lg"
        >
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
            <Info size={18} />
          </div>
          <span className="text-[9px] font-mono font-bold mt-1">RIDER</span>
        </button>

        {/* Direct Stripe / WhatsApp Lock */}
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ecb613] text-black active:scale-95 transition-all shadow-lg shadow-[#ecb613]/30 font-black"
        >
          <div className="w-9 h-9 rounded-full bg-black text-[#ecb613] flex items-center justify-center">
            <Zap size={18} className="fill-[#ecb613]" />
          </div>
          <span className="text-[9px] font-mono uppercase tracking-tight mt-1">BLOQUEAR</span>
        </button>
      </div>

      {/* 📄 MODAL DETAIL / RIDER S-CLASS */}
      <AnimatePresence>
        {showDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl p-5 flex flex-col justify-between"
          >
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-[#ecb613] uppercase">Especificaciones de Concierto</span>
                  <h4 className="text-lg font-black text-white uppercase">{currentFormat.name}</h4>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-mono font-bold text-white/80 uppercase">Rider Técnico Homologado</h5>
                <ul className="space-y-1.5 text-xs text-white/70">
                  {currentFormat.riderEquipment.map((eq, i) => (
                    <li key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                      <ShieldCheck size={14} className="text-[#ecb613] shrink-0" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-mono font-bold text-white/80 uppercase">Repertorio Insignia</h5>
                <div className="flex flex-wrap gap-1.5">
                  {currentFormat.repertoire.map((song, i) => (
                    <span key={i} className="text-xs bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] px-2.5 py-1 rounded-lg font-mono">
                      {song}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50 font-mono">Depósito Price-Lock SHA-256</span>
                  <span className="font-bold text-[#ecb613]">100 €</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50 font-mono">Liquidación post-concierto</span>
                  <span className="font-bold text-white">{currentFormat.basePrice - 100} €</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono pt-1">
                  ✓ Reembolso íntegro hasta 15 días previos
                </div>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full py-3.5 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Confirmar Bloqueo con Edwin</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
