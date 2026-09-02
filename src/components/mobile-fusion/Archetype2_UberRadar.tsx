'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation, Radio, Zap, Clock, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Sliders, Truck,
  Volume2, Users, ArrowRight
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype2_UberRadar({ onDispatch }: { onDispatch?: (data: any) => void }) {
  const [selectedFormatId, setSelectedFormatId] = useState('cuarteto-imperial');
  const [distanceKm, setDistanceKm] = useState(45);
  const [paxCount, setPaxCount] = useState(130);
  const [isSlideUnlocked, setIsSlideUnlocked] = useState(false);
  const [cityTarget, setCityTarget] = useState('Madrid / Alrededores');

  const activeFormat = ARTIST_FORMATS.find(f => f.id === selectedFormatId) || ARTIST_FORMATS[0];
  const quote = calculateQuote({
    basePrice: activeFormat.basePrice,
    extraMusicians: 0,
    distanceKm,
    pax: paxCount,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const etaMinutes = Math.round(25 + (distanceKm * 0.8));
  const wattsNeeded = paxCount * 12;

  const handleSlideComplete = () => {
    setIsSlideUnlocked(true);
    const text = encodeURIComponent(
      `🚨 DESPACHO UBER S-CLASS EAR OS\n- Formato: ${activeFormat.name}\n- Destino: ${cityTarget} (${distanceKm} km)\n- Asistentes: ${paxCount} pax (${wattsNeeded}W Acústicos)\n- Total Estimado: ${quote.total}€\n- Depósito Stripe: 100€\nSolicito confirmación de unidad móvil.`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4">
      
      {/* 📡 TOP TELEMETRY STATUS BAR */}
      <div className="flex items-center justify-between bg-black/60 border border-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            GPS LOGÍSTICA EN VIVO
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-white/60">
          <Clock size={12} className="text-[#ecb613]" />
          <span>ETA: {etaMinutes} MIN</span>
        </div>
      </div>

      {/* 🧭 ANIMATED UBER-STYLE RADAR DISPATCH MAP */}
      <div className="relative w-full h-56 rounded-3xl overflow-hidden border border-[#ecb613]/30 bg-[#09090d] flex items-center justify-center shadow-2xl">
        {/* Radar concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-[#ecb613]/20 animate-ping opacity-25" />
          <div className="w-36 h-36 rounded-full border border-white/10" />
          <div className="w-24 h-24 rounded-full border border-dashed border-[#ecb613]/40" />
          <div className="w-12 h-12 rounded-full border border-white/20" />
          {/* Radar sweeping scan needle */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-transparent via-[#ecb613]/10 to-transparent border-t border-[#ecb613]/60"
          />
        </div>

        {/* Central Vehicle / Unit Pin */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#ecb613] text-black flex items-center justify-center shadow-lg shadow-[#ecb613]/40 border-2 border-white">
            <Truck size={22} className="text-black stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-black/80 px-2 py-0.5 rounded-full border border-white/20 mt-1 text-[#ecb613]">
            Unidad Móvil EAR 01
          </span>
        </div>

        {/* Peripheral Hotspots */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[9px] font-mono">
          <span className="text-white/40 block">ORIGEN</span>
          <span className="font-bold text-white">Hub Central Madrid</span>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#ecb613]/40 text-[9px] font-mono text-right">
          <span className="text-[#ecb613] block">POTENCIA REQUERIDA</span>
          <span className="font-black text-emerald-400">{wattsNeeded}W @ 12W/pax</span>
        </div>
      </div>

      {/* 🎛️ FORMAT SELECTION CAROUSEL (UBER VEHICLE TIERS) */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">
          SELECCIONA TIER DE ESCUADRA
        </span>
        <div className="grid grid-cols-2 gap-2">
          {ARTIST_FORMATS.map(fmt => {
            const isSelected = fmt.id === selectedFormatId;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormatId(fmt.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'bg-gradient-to-b from-[#ecb613]/15 to-[#15151c] border-[#ecb613] shadow-lg shadow-[#ecb613]/10' 
                    : 'bg-[#101014] border-white/10 hover:border-white/20 text-white/70'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ecb613] shadow-[0_0_8px_#ecb613]" />
                )}
                <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-[#ecb613] block">
                  {fmt.musiciansCount === 1 ? 'Solista' : `${fmt.musiciansCount} Músicos`}
                </span>
                <h4 className="text-xs font-black text-white truncate">{fmt.name}</h4>
                <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-white/5">
                  <span className="text-sm font-black text-white">{fmt.basePrice}€</span>
                  <span className="text-[9px] text-white/40 font-mono">{fmt.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📏 LIVE LOGISTIC SLIDERS (KM & GUESTS) */}
      <div className="bg-[#111116] border border-white/10 p-4 rounded-3xl space-y-4">
        {/* Distance Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/60 flex items-center gap-1">
              <MapPin size={12} className="text-[#ecb613]" /> Distancia desde Madrid
            </span>
            <span className="font-black text-[#ecb613]">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="350"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
          />
          <div className="flex justify-between text-[9px] font-mono text-white/40">
            <span>0 km (Radio Urbano)</span>
            <span>150 km (Regional)</span>
            <span>350 km (Nacional)</span>
          </div>
        </div>

        {/* Pax Guests Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/60 flex items-center gap-1">
              <Users size={12} className="text-[#ecb613]" /> Asistentes (Pax)
            </span>
            <span className="font-black text-emerald-400">{paxCount} Invitados</span>
          </div>
          <input
            type="range"
            min="30"
            max="500"
            step="10"
            value={paxCount}
            onChange={(e) => setPaxCount(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-white/40">
            <span>30 pax (Íntimo)</span>
            <span>200 pax (Boda Media)</span>
            <span>500 pax (Gran Gala)</span>
          </div>
        </div>

        {/* Live Acoustic Guarantee Badge */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-[#ecb613]" />
            <div>
              <span className="font-bold text-white block text-[11px]">Sonorización Bose F1 Incluida</span>
              <span className="text-[9px] text-white/50 font-mono">12 W/pax Homologados con Técnico in situ</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
            0 FALLOS
          </span>
        </div>
      </div>

      {/* 💳 PRICING BREAKDOWN & INSTANT SLIDE-TO-DISPATCH */}
      <div className="bg-gradient-to-b from-[#181820] to-[#0c0c10] border border-[#ecb613]/40 p-4 rounded-3xl space-y-3">
        <div className="flex justify-between items-end border-b border-white/10 pb-2.5">
          <div>
            <span className="text-[9px] font-mono text-white/50 block">PRESUPUESTO TOTAL CERRADO</span>
            <span className="text-2xl font-black text-white">{quote.total} €</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-[#ecb613] block">DEPÓSITO STRIPE</span>
            <span className="text-base font-black text-[#ecb613]">100 €</span>
          </div>
        </div>

        {/* Uber Slide to Dispatch Simulated Slider */}
        <div className="relative w-full h-14 bg-black/80 rounded-2xl p-1 border border-white/15 overflow-hidden flex items-center">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 230 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x > 180) {
                handleSlideComplete();
              }
            }}
            className="w-12 h-12 rounded-xl bg-[#ecb613] text-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-20"
          >
            <ArrowRight size={20} className="stroke-[3]" />
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-white/70 font-mono animate-pulse">
              Desliza para Despachar Unidad ➔
            </span>
          </div>
        </div>

        <p className="text-[9px] text-center text-white/40 font-mono">
          Bloqueo de agenda en tiempo real vía WhatsApp y Stripe Price-Lock.
        </p>
      </div>

    </div>
  );
}
