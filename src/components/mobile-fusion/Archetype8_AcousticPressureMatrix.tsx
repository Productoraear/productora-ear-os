'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sliders, Volume2, ShieldCheck, Activity, 
  Zap, CheckCircle2, ArrowRight, Gauge
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';

export default function Archetype8_AcousticPressureMatrix() {
  const [pax, setPax] = useState(160);
  const [isVimumeProtected, setIsVimumeProtected] = useState(false);
  const [selectedFormatId, setSelectedFormatId] = useState('cuarteto-imperial');

  const activeFormat = ARTIST_FORMATS.find(f => f.id === selectedFormatId) || ARTIST_FORMATS[0];
  const wattsRequired = pax * 12; // 12 W/pax
  const maxDbLevel = isVimumeProtected ? 74 : 96;

  const quote = calculateQuote({
    basePrice: activeFormat.basePrice,
    extraMusicians: 0,
    distanceKm: 30,
    pax,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const handleBookMatrix = () => {
    const text = encodeURIComponent(
      `📊 MATRIZ ACÚSTICA S-CLASS (12 W/PAX):\n- Formato: ${activeFormat.name}\n- Asistentes: ${pax} pax\n- Potencia Calculada: ${wattsRequired}W RMS\n- Límite dB: ${maxDbLevel} dB ${isVimumeProtected ? '(Modo VIMUME Activo)' : ''}\n- Presupuesto Total: ${quote.total}€\n- Depósito Stripe: 100€`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4 pb-20">
      
      {/* 📊 ENGINEERING TELEMETRY HEADER */}
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-black uppercase font-mono tracking-widest">
          INGENIERÍA ACÚSTICA HOMOLOGADA
        </span>
        <h2 className="text-xl font-black uppercase tracking-tight text-white font-syne">
          Matriz de Presión Acústica (12 W/pax)
        </h2>
        <p className="text-xs text-white/50">
          Cálculo milimétrico de potencia sonométrica sin distorsión ni acoples.
        </p>
      </div>

      {/* 🎛️ LIVE GAUGE TELEMETRY PANEL */}
      <div className="p-4 rounded-3xl bg-[#111116] border border-white/10 space-y-4">
        {/* Watts Meter */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-mono text-white/60">POTENCIA REQUERIDA (12 W/PAX)</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{wattsRequired} W</span>
          </div>

          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (wattsRequired / 3600) * 100)}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 via-[#ecb613] to-amber-500 rounded-full"
            />
          </div>
        </div>

        {/* Pax Interactive Slider */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/60">Aforo de Asistentes</span>
            <span className="font-bold text-white">{pax} personas</span>
          </div>
          <input
            type="range"
            min="40"
            max="350"
            step="10"
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* VIMUME Protected Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className={isVimumeProtected ? 'text-emerald-400' : 'text-white/40'} />
            <div>
              <span className="text-xs font-bold text-white block">Protocolo VIMUME &lt;75 dB</span>
              <span className="text-[9px] text-white/40">Para jardines históricos y bienestar</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isVimumeProtected}
            onChange={(e) => setIsVimumeProtected(e.target.checked)}
            className="w-5 h-5 accent-emerald-400 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 🛠️ HARDWARE RIDER SELECTION */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">
          FORMATO MUSICAL ASIGNADO
        </span>
        <div className="grid grid-cols-2 gap-2">
          {ARTIST_FORMATS.slice(0, 2).map(fmt => {
            const isSelected = fmt.id === selectedFormatId;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormatId(fmt.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-[#15151c] border-[#ecb613] text-white' 
                    : 'bg-[#0e0e12] border-white/10 text-white/60'
                }`}
              >
                <span className="text-[9px] font-mono text-[#ecb613] block uppercase font-bold">{fmt.musiciansCount} Músicos</span>
                <h4 className="text-xs font-black text-white truncate">{fmt.name}</h4>
                <span className="text-xs font-mono font-bold text-white block mt-1">{fmt.basePrice}€</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚀 ACTION BUTTON */}
      <button
        onClick={handleBookMatrix}
        className="w-full py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
      >
        <span>Validar y Bloquear Ingeniería ({quote.total}€)</span>
        <ArrowRight size={16} />
      </button>

    </div>
  );
}
