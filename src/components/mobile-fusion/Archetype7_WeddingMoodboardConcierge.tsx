'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Heart, ShieldCheck, Check, 
  ArrowRight, Music, Volume2, Camera
} from 'lucide-react';
import { MOODBOARD_AESTHETICS, ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype7_WeddingMoodboardConcierge() {
  const [selectedAestheticId, setSelectedAestheticId] = useState('black-tie');

  const currentAesthetic = MOODBOARD_AESTHETICS.find(a => a.id === selectedAestheticId) || MOODBOARD_AESTHETICS[0];
  const matchedFormat = ARTIST_FORMATS.find(f => f.id === currentAesthetic.recommendedFormat) || ARTIST_FORMATS[0];

  const quote = calculateQuote({
    basePrice: matchedFormat.basePrice + currentAesthetic.quoteBonus,
    extraMusicians: 0,
    distanceKm: 30,
    pax: 130,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const handleBookMoodboard = () => {
    const text = encodeURIComponent(
      `✨ CONCIERGE MOODBOARD S-CLASS:\n- Estética Elegida: ${currentAesthetic.name}\n- Formato Recomendado: ${matchedFormat.name}\n- Presión Acústica: ${currentAesthetic.acousticTarget}\n- Total Calculado: ${quote.total}€\n- Depósito Stripe: 100€`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4 pb-20">
      
      {/* 🎨 TOP MOODBOARD HEADER */}
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-[9px] font-black uppercase font-mono tracking-widest">
          AESTHETIC & MOODBOARD CONCIERGE
        </span>
        <h2 className="text-xl font-black uppercase tracking-tight text-white font-syne">
          Elige la Atmósfera Visual de tu Boda
        </h2>
        <p className="text-xs text-white/50">
          Sincronizamos repertorio, etiqueta y rider acústico a tu estilo nupcial.
        </p>
      </div>

      {/* 🖼️ 2x2 VISUAL MOODBOARD CARDS */}
      <div className="grid grid-cols-2 gap-2.5">
        {MOODBOARD_AESTHETICS.map(item => {
          const isSelected = item.id === selectedAestheticId;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedAestheticId(item.id)}
              className={`h-36 rounded-2xl overflow-hidden relative border cursor-pointer transition-all ${
                isSelected 
                  ? 'border-[#ecb613] shadow-lg shadow-[#ecb613]/20 scale-[1.02]' 
                  : 'border-white/10 opacity-70 hover:opacity-90'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ecb613] text-black flex items-center justify-center shadow-md">
                  <Check size={12} className="stroke-[3]" />
                </div>
              )}

              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-[8px] font-mono font-bold uppercase text-[#ecb613] block">
                  {item.badge}
                </span>
                <h4 className="text-xs font-black uppercase text-white truncate leading-tight">
                  {item.name}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔮 SYNCHRONIZED ARTIST & ACOUSTIC SPEC */}
      <div className="p-4 rounded-3xl bg-[#111116] border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="text-[9px] font-mono text-white/40 uppercase block">FORMATO EMPAREJADO</span>
            <h4 className="text-sm font-black text-white">{matchedFormat.name}</h4>
          </div>
          <span className="text-base font-black text-[#ecb613] font-mono">{matchedFormat.basePrice}€</span>
        </div>

        <div className="space-y-1.5 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px]">{currentAesthetic.acousticTarget}</span>
          </div>
          <div className="flex items-center gap-2">
            <Music size={14} className="text-[#ecb613] shrink-0" />
            <span className="font-mono text-[11px]">Repertorio Curado: {matchedFormat.repertoire.slice(0, 3).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* 🏷️ STICKY ACTION BUTTON */}
      <button
        onClick={handleBookMoodboard}
        className="w-full py-4 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/25 active:scale-95 transition-all"
      >
        <span>Bloquear Atmósfera ({quote.total}€)</span>
        <ArrowRight size={16} />
      </button>

    </div>
  );
}
