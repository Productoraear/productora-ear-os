'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, ShieldCheck, Heart, Share2, Calendar, 
  Users, CheckCircle2, ChevronRight, Award, Music, 
  ArrowRight, Sparkles, MapPin
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype3_AirbnbBento() {
  const [selectedFormat, setSelectedFormat] = useState(ARTIST_FORMATS[0]);
  const [guestCount, setGuestCount] = useState(120);
  const [eventDate, setEventDate] = useState('2026-09-19');
  const [showSplitDetails, setShowSplitDetails] = useState(false);

  const quote = calculateQuote({
    basePrice: selectedFormat.basePrice,
    extraMusicians: 0,
    distanceKm: 35,
    pax: guestCount,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const handleBooking = () => {
    const text = encodeURIComponent(
      `Hola Edwin, deseo reservar la Experiencia Airbnb S-Class:\n- Formato: ${selectedFormat.name} (${selectedFormat.basePrice}€)\n- Fecha: ${eventDate}\n- Asistentes: ${guestCount} pax\n- Total con Sonorización Bose F1: ${quote.total}€\n- Depósito de Reserva: 100€`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-5 pb-24">
      
      {/* 🏷️ TOP AIRBNB HEADER & HOST BADGE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono tracking-widest">
            EXPERIENCIA S-CLASS VERIFICADA
          </span>
          <div className="flex items-center gap-1 text-xs font-mono text-[#ecb613]">
            <Star size={14} className="fill-[#ecb613]" />
            <span className="font-bold">4.99</span>
            <span className="text-white/40">(47 reseñas)</span>
          </div>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-tight text-white font-syne leading-tight">
          Recital Lírico & Mariachi XXI de Gran Gala
        </h2>
        <p className="text-xs text-white/60 flex items-center gap-1.5 font-mono">
          <MapPin size={12} className="text-[#ecb613]" /> Cobertura en toda España · Sonorización Bose F1
        </p>
      </div>

      {/* 🖼️ BENTO GALLERY GRID */}
      <div className="grid grid-cols-3 gap-2 h-52 rounded-3xl overflow-hidden border border-white/10">
        <div 
          className="col-span-2 h-full bg-cover bg-center relative group"
          style={{ backgroundImage: `url(${selectedFormat.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-mono text-white/80 border border-white/10">
            {selectedFormat.name}
          </span>
        </div>
        <div className="grid grid-rows-2 gap-2 h-full">
          <div 
            className="bg-cover bg-center rounded-r-xl relative"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80)` }}
          />
          <div 
            className="bg-cover bg-center rounded-r-xl relative flex items-center justify-center bg-black/60"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80)` }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            <span className="relative z-10 text-[10px] font-mono font-bold text-[#ecb613] text-center">
              +14 Fotos<br/>y Riders
            </span>
          </div>
        </div>
      </div>

      {/* 👑 SUPERHOST / PACIENTE CERO PROFILE CARD */}
      <div className="p-4 rounded-3xl bg-[#111116] border border-white/10 flex items-center gap-3.5">
        <div className="relative">
          <div className="w-13 h-13 w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#ecb613]">
            <img src={SOVEREIGN_ARTIST.avatar} alt="Edwin Agudelo" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ecb613] text-black flex items-center justify-center">
            <Award size={12} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-black uppercase text-white">{SOVEREIGN_ARTIST.name}</h4>
            <span className="px-1.5 py-0.5 rounded bg-[#ecb613]/20 text-[#ecb613] text-[8px] font-mono font-bold">SUPERHOST</span>
          </div>
          <p className="text-[10px] text-white/50">{SOVEREIGN_ARTIST.title}</p>
          <span className="text-[9px] text-[#ecb613] font-mono font-semibold block mt-0.5">
            37+ Giras Internacionales · Método VIMUME
          </span>
        </div>
      </div>

      {/* 📅 AIRBNB-STYLE DATE & GUEST SELECTOR WIDGET */}
      <div className="grid grid-cols-2 gap-2 bg-[#0e0e13] p-3 rounded-2xl border border-white/10">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-white/40 uppercase block">FECHA DEL EVENTO</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Calendar size={14} className="text-[#ecb613]" />
            <input 
              type="date" 
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-transparent text-white text-xs font-mono outline-none w-full"
            />
          </div>
        </div>

        <div className="space-y-1 border-l border-white/10 pl-3">
          <span className="text-[9px] font-mono text-white/40 uppercase block">INVITADOS (PAX)</span>
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-[#ecb613]" />
              <span className="font-mono">{guestCount} pax</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setGuestCount(Math.max(20, guestCount - 10))}
                className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs"
              >-</button>
              <button 
                onClick={() => setGuestCount(guestCount + 10)}
                className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎼 FORMAT TIERS BENTO CARDS */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">
          FORMATOS DE ESPECTÁCULO DISPONIBLES
        </span>
        <div className="space-y-2">
          {ARTIST_FORMATS.map(fmt => {
            const isSelected = fmt.id === selectedFormat.id;
            return (
              <div
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#15151c] border-[#ecb613] shadow-lg shadow-[#ecb613]/10' 
                    : 'bg-[#0d0d10] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613]">
                      {fmt.musiciansCount === 1 ? 'Solista Especial' : `${fmt.musiciansCount} Músicos en Escena`}
                    </span>
                    <h4 className="text-sm font-black text-white">{fmt.name}</h4>
                    <p className="text-[10px] text-white/60 mt-0.5">{fmt.subtitle}</p>
                  </div>
                  <span className="text-base font-black text-white font-mono">{fmt.basePrice}€</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ⚖️ TRANSPARENT SPLIT BREAKDOWN (AIRBNB TRANSPARENCY) */}
      <div className="p-4 rounded-3xl bg-[#111116] border border-white/10 space-y-3">
        <div 
          onClick={() => setShowSplitDetails(!showSplitDetails)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#ecb613]" />
            <span className="text-xs font-mono font-bold uppercase text-white">
              Desglose Soberano Transparente
            </span>
          </div>
          <ChevronRight size={14} className={`transform transition-transform ${showSplitDetails ? 'rotate-90' : ''}`} />
        </div>

        {showSplitDetails && (
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div className="flex justify-between text-white/70">
              <span>Honorario Músicos (80%)</span>
              <span className="font-bold text-white">{quote.split.artist} €</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>EAR OS Infraestructura & FOH (10%)</span>
              <span className="font-bold text-white">{quote.split.ear} €</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Fondo Social VIMUME Residencias (10%)</span>
              <span className="font-bold text-emerald-400">{quote.split.vimume} €</span>
            </div>
            <div className="text-[9px] text-white/40 pt-1">
              * Cumplimiento estricto de Régimen de Artistas y Seguro RC 1M€.
            </div>
          </div>
        )}
      </div>

      {/* 📌 STICKY AIRBNB BOTTOM BOOKING BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-2xl border-t border-white/15 z-40 max-w-[420px] mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{quote.total}€</span>
            <span className="text-[10px] text-white/50 font-mono">total evento</span>
          </div>
          <span className="text-[9px] text-[#ecb613] font-mono block">100€ Depósito Stripe</span>
        </div>

        <button
          onClick={handleBooking}
          className="py-3 px-5 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/25 active:scale-95 transition-all"
        >
          <span>Reservar Fecha</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
