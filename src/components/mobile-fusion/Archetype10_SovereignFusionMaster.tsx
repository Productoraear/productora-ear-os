'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Radio, Heart, ShieldCheck, Zap, 
  MapPin, Clock, Users, Calendar, Volume2, 
  ArrowRight, Star, Award, ChevronRight, Check
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote, WEDDING_MILESTONES_DEFAULT } from './types';

export default function Archetype10_SovereignFusionMaster() {
  const [selectedFormat, setSelectedFormat] = useState(ARTIST_FORMATS[0]);
  const [pax, setPax] = useState(130);
  const [distanceKm, setDistanceKm] = useState(35);
  const [activeTab, setActiveTab] = useState<'discover' | 'radar' | 'timeline' | 'checkout'>('discover');

  const quote = calculateQuote({
    basePrice: selectedFormat.basePrice,
    extraMusicians: 0,
    distanceKm,
    pax,
    hasBoseSound: true,
    hasPhotocall: true
  });

  const handleMasterCheckout = () => {
    const text = encodeURIComponent(
      `👑 EAR OS SOVEREIGN MASTER FUSION (ALL-IN-ONE):\n- Artista: ${SOVEREIGN_ARTIST.name} (${SOVEREIGN_ARTIST.badge})\n- Formato: ${selectedFormat.name} (${selectedFormat.basePrice}€)\n- Invitados: ${pax} pax (${pax * 12}W Bose F1)\n- Distancia: ${distanceKm} km\n- Total Evento: ${quote.total}€\n- Depósito Price-Lock Stripe: 100€\nSolicito bloqueo oficial de fecha en agenda.`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4 pb-24">
      
      {/* 👑 MASTER FUSION S-CLASS PILL & HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ecb613] text-black flex items-center justify-center font-black text-xs">
            Ω
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">EAR OS MASTER FUSION</h3>
            <span className="text-[9px] text-[#ecb613] font-mono">AIRBNB + UBER + TINDER + BODAS</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-emerald-400 font-bold">
          LIVE 100%
        </span>
      </div>

      {/* 🧭 HYBRID TABS (DISCOVER | RADAR | TIMELINE | SPLIT) */}
      <div className="grid grid-cols-4 gap-1 bg-[#111116] p-1 rounded-2xl border border-white/10 text-[10px] font-mono">
        {[
          { id: 'discover', label: 'Tinder' },
          { id: 'radar', label: 'Uber Radar' },
          { id: 'timeline', label: 'Bodas' },
          { id: 'checkout', label: 'Airbnb' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 rounded-xl text-center font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[#ecb613] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔀 TAB CONTENT CONTROLLER */}
      <div className="min-h-[320px]">
        {/* 1. DISCOVER TAB (TINDER STYLE) */}
        {activeTab === 'discover' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div 
              className="h-56 rounded-3xl bg-cover bg-center relative overflow-hidden border border-[#ecb613]/40 p-4 flex flex-col justify-between"
              style={{ backgroundImage: `url(${selectedFormat.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 flex justify-between">
                <span className="px-2 py-0.5 rounded bg-[#ecb613] text-black text-[9px] font-mono font-bold">
                  {selectedFormat.matchScore}% MATCH
                </span>
                <span className="text-xs font-mono font-black text-white bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {selectedFormat.basePrice}€
                </span>
              </div>

              <div className="relative z-10">
                <h4 className="text-lg font-black uppercase text-white font-syne">{selectedFormat.name}</h4>
                <p className="text-xs text-[#ecb613] line-clamp-1">{selectedFormat.subtitle}</p>
              </div>
            </div>

            {/* Quick format selector buttons */}
            <div className="grid grid-cols-2 gap-2">
              {ARTIST_FORMATS.map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedFormat.id === fmt.id 
                      ? 'bg-[#15151c] border-[#ecb613] text-white font-bold' 
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  <div className="truncate">{fmt.name}</div>
                  <div className="text-[10px] text-[#ecb613] font-mono">{fmt.basePrice}€</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 2. RADAR TAB (UBER STYLE) */}
        {activeTab === 'radar' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 rounded-3xl bg-[#111116] border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/60">Distancia logística</span>
                <span className="font-bold text-[#ecb613]">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/50">ETA Unidad Técnica</span>
                  <span className="text-emerald-400 font-bold">{Math.round(20 + distanceKm * 0.7)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Presión Acústica (12W/pax)</span>
                  <span className="text-white font-bold">{pax * 12} W Bose F1</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. TIMELINE TAB (BODAS STYLE) */}
        {activeTab === 'timeline' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {WEDDING_MILESTONES_DEFAULT.slice(0, 3).map((m, i) => (
              <div key={m.id} className="p-3 rounded-2xl bg-[#111116] border border-white/10 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase">{m.name}</h5>
                  <span className="text-[10px] text-white/50 font-mono">{m.timeSlot}</span>
                </div>
                <span className="text-[10px] font-mono text-[#ecb613] font-bold bg-white/5 px-2 py-1 rounded-lg">
                  {selectedFormat.name}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* 4. CHECKOUT / AIRBNB SPLIT TAB */}
        {activeTab === 'checkout' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-[#111116] border border-white/10 space-y-3 text-xs font-mono"
          >
            <h4 className="text-sm font-black uppercase text-white font-syne">Desglose Soberano 80/10/10</h4>
            <div className="flex justify-between text-white/70">
              <span>Músicos & Voz Lírica (80%)</span>
              <span className="font-bold text-white">{quote.split.artist} €</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>EAR OS Infraestructura (10%)</span>
              <span className="font-bold text-white">{quote.split.ear} €</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Fondo Social VIMUME (10%)</span>
              <span className="font-bold text-emerald-400">{quote.split.vimume} €</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
              <span className="text-white">Total con Sonorización</span>
              <span className="text-[#ecb613]">{quote.total} €</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 📌 STICKY MASTER CHECKOUT BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-2xl border-t border-white/15 z-40 max-w-[420px] mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white">{quote.total}€</span>
            <span className="text-[10px] text-white/50 font-mono">cerrado</span>
          </div>
          <span className="text-[9px] text-[#ecb613] font-mono block">100€ Depósito Stripe</span>
        </div>

        <button
          onClick={handleMasterCheckout}
          className="py-3 px-5 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/25 active:scale-95 transition-all"
        >
          <span>Bloquear Fecha</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
