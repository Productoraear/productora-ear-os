'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Heart, Share2, MessageCircle, 
  Volume2, ShieldCheck, ChevronUp, Sparkles, ArrowRight 
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST } from './types';

export default function Archetype9_StorysellingStream() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);

  const format = ARTIST_FORMATS[0]; // Solista / Edwin Agudelo

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleContact = () => {
    const text = encodeURIComponent(
      `🎬 Vengo de ver el Reel Storyselling de Edwin Agudelo en EAR OS. Deseo consultar disponibilidad para mi evento.`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-black text-white select-none relative overflow-hidden">
      
      {/* 📱 FULLSCREEN STORY CARD REEL BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${format.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
      </div>

      {/* 🔝 TOP STORY BAR */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#ecb613] overflow-hidden">
            <img src={SOVEREIGN_ARTIST.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">{SOVEREIGN_ARTIST.name}</h4>
            <span className="text-[9px] text-[#ecb613] font-mono font-bold">PACIENTE CERO · EN VIVO</span>
          </div>
        </div>

        <span className="px-2 py-1 rounded-full bg-black/60 border border-white/20 text-[9px] font-mono text-emerald-400">
          ● 2026 DISPONIBLE
        </span>
      </div>

      {/* 侧 SIDE ACTION BAR (TIKTOK / REELS STYLE) */}
      <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4">
        {/* Like */}
        <button 
          onClick={handleLike}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md ${hasLiked ? 'bg-rose-500 text-white' : 'bg-black/50 border border-white/20'}`}>
            <Heart size={20} className={hasLiked ? 'fill-white' : ''} />
          </div>
          <span className="text-[10px] font-mono">{likes}</span>
        </button>

        {/* WhatsApp Direct */}
        <button 
          onClick={handleContact}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
            <MessageCircle size={20} className="fill-black" />
          </div>
          <span className="text-[10px] font-mono">Chat</span>
        </button>

        {/* Audio Toggle */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-md">
            {isPlaying ? <Volume2 size={20} className="text-[#ecb613]" /> : <Pause size={20} />}
          </div>
        </button>
      </div>

      {/* 📜 BOTTOM STORYSELLING DRAWER */}
      <div className="relative z-10 p-4 mt-auto space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="space-y-1 pr-12">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono">
              HISTORIA DE IMPACTO
            </span>
            <span className="text-[10px] font-mono text-white/70">350€ Tarifa Base</span>
          </div>

          <h3 className="text-lg font-black uppercase tracking-tight text-white font-syne">
            El poder de la voz lírica en tu gran día
          </h3>
          <p className="text-xs text-white/80 font-light line-clamp-2">
            "No vendemos música de fondo; creamos el recuerdo acústico imborrable que conmueve a cada generación de tu familia."
          </p>
        </div>

        {/* Direct CTA */}
        <button
          onClick={handleContact}
          className="w-full py-3.5 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
        >
          <span>Cotizar Directo con Edwin</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
