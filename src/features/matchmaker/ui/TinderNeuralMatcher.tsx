'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, X, ShieldCheck, Zap, Sparkles, MapPin, 
  Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  RotateCcw, Lock, DollarSign, Calendar
} from 'lucide-react';
import { 
  calculateFullTaxBreakdown, 
  checkScheduleFeasibility, 
  triggerUberFailoverCascade, 
  TimeSlotBooking 
} from '@/lib/matchmaker/uberDispatchScheduleEngine';

interface CandidateProfile {
  id: string;
  name: string;
  category: string;
  province: string;
  basePrice: number;
  rating: number;
  reviews: number;
  img: string;
  badge: string;
  description: string;
  paxCapacity: number;
}

const SAMPLE_CANDIDATES: CandidateProfile[] = [
  {
    id: 'mariachi-sover-01',
    name: 'Mariachi Guadalupano S-Class',
    category: 'Mariachis & Solistas',
    province: 'Madrid',
    basePrice: 450,
    rating: 5.0,
    reviews: 84,
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    badge: 'HOMOLOGADO S-CLASS',
    description: 'Mariachi auténtico de 4 integrantes con vestuario de gala, sonorización Bose S1 Pro e itinerancia flexible.',
    paxCapacity: 200
  },
  {
    id: 'mariachi-sover-02',
    name: 'Mariachi México Real (Grupo de Relevo #2)',
    category: 'Mariachis & Solistas',
    province: 'Madrid',
    basePrice: 420,
    rating: 4.9,
    reviews: 62,
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    badge: 'RELEVO UBER S-CLASS',
    description: 'Ensamble de mariachi profesional homologado para reemplazo rápido con 0% cancelaciones.',
    paxCapacity: 250
  },
  {
    id: 'edwin-agudelo-01',
    name: 'Productora EAR • Edwin Agudelo',
    category: 'Solista S-Class',
    province: 'Madrid',
    basePrice: 350,
    rating: 5.0,
    reviews: 128,
    img: 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
    badge: 'PRIORIDAD S-CLASS #1',
    description: 'Show solista 1 hora (2 pases de 30 min), Bose F1 812 / S1 Pro, micro Shure Beta 87A y ramo de flores en vivo.',
    paxCapacity: 150
  }
];

export const TinderNeuralMatcher: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchSuccess, setMatchSuccess] = useState<CandidateProfile | null>(null);
  const [overtimeHours, setOvertimeHours] = useState(0);

  const candidate = SAMPLE_CANDIDATES[currentIndex % SAMPLE_CANDIDATES.length];
  const financial = calculateFullTaxBreakdown(candidate.basePrice, candidate.province, 3);

  // 🚴 CASO DE USO REAL: Alcorcón (09:00 - 1h) ➔ Algete (16:30)
  const gig1BaseDuration = 60; // 1 hora contratada base
  const gig1TotalDuration = gig1BaseDuration + (overtimeHours * 60);

  const gig1: TimeSlotBooking = {
    id: 'booking-alcorcon-01',
    vendorId: candidate.id,
    vendorName: candidate.name,
    date: '2026-09-20',
    startTime: '09:00',
    durationMinutes: gig1TotalDuration,
    location: 'Alcorcón, Madrid',
    lat: 40.3458,
    lng: -3.8249
  };

  const gig2: TimeSlotBooking = {
    id: 'booking-algete-02',
    vendorId: candidate.id,
    vendorName: candidate.name,
    date: '2026-09-20',
    startTime: '16:30',
    durationMinutes: 90,
    location: 'Algete, Madrid',
    lat: 40.5975,
    lng: -3.5002
  };

  const scheduleCheck = checkScheduleFeasibility(gig1, gig2);
  const failover = !scheduleCheck.isFeasible 
    ? triggerUberFailoverCascade(gig2, SAMPLE_CANDIDATES) 
    : null;

  const handleSwipeRight = () => {
    setMatchSuccess(candidate);
  };

  const handleSwipeLeft = () => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-white font-sans">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
          <Sparkles size={14} className="animate-pulse" />
          TINDER NEURAL MATCHER // UBER DISPATCH ENGINE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-syne">
          MATCH PERFECTO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white italic">ARTISTAS S-CLASS</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto">
          Cálculo exacto con IVA 21%, verificación de franja horaria con buffer de 60 min y cascada de relevo tipo Uber.
        </p>
      </div>

      {/* 🎴 TINDER SWIPEABLE CARD CONTAINER */}
      <div className="relative max-w-md mx-auto min-h-[560px]">
        <AnimatePresence mode="wait">
          {!matchSuccess ? (
            <motion.div
              key={candidate.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: -200 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#030305]/95 border border-white/15 rounded-3xl p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5 relative overflow-hidden"
            >
              {/* Photo & Badge */}
              <div className="relative h-64 rounded-2xl overflow-hidden group">
                <img 
                  src={candidate.img} 
                  alt={candidate.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-[#ecb613] text-black font-syne font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  {candidate.badge}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-syne text-white">{candidate.name}</h2>
                    <p className="text-xs text-zinc-300 font-mono flex items-center gap-1">
                      <MapPin size={12} className="text-[#00E5FF]" /> {candidate.province} • ★ {candidate.rating} ({candidate.reviews})
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial & Tax Breakdown Box (IVA 21% INCLUIDO) */}
              <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Precio Base:</span>
                  <strong className="text-white">{financial.basePrice} €</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>IVA (21% Incluido):</span>
                  <strong className="text-amber-400">+{financial.vatAmount} €</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Logística S-Class ({financial.distanceKm} km):</span>
                  <strong className="text-[#00E5FF]">+{financial.logisticsFee} €</strong>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-syne font-bold">
                  <span className="text-white">PRESUPUESTO FINAL TOTAL:</span>
                  <span className="text-2xl text-[#ecb613]">{financial.totalGrossPrice} €</span>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1 pt-1">
                  <Lock size={12} className="text-emerald-400" />
                  <span>Depósito de Reserva: <strong>100,00 € Stripe SHA-256</strong></span>
                </div>
              </div>

              {/* Tinder Buttons Row */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  onClick={handleSwipeLeft}
                  className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <X size={24} />
                </button>

                <button
                  onClick={handleSwipeRight}
                  className="w-16 h-16 rounded-full bg-[#ecb613] text-black hover:bg-amber-300 transition-all flex items-center justify-center shadow-xl shadow-[#ecb613]/30 cursor-pointer hover:scale-110"
                >
                  <Heart size={28} fill="currentColor" />
                </button>
              </div>

            </motion.div>
          ) : (
            /* 💖 MATCH CONFIRMED MODAL */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#030305] border border-[#ecb613]/50 rounded-3xl p-6 text-center space-y-6 shadow-[0_0_80px_rgba(236,182,19,0.2)]"
            >
              <div className="w-16 h-16 rounded-full bg-[#ecb613]/20 border border-[#ecb613] text-[#ecb613] flex items-center justify-center mx-auto animate-bounce">
                <Heart size={32} fill="currentColor" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block mb-1">MATCH PERFECTO S-CLASS</span>
                <h2 className="text-2xl font-black font-syne text-white">{matchSuccess.name}</h2>
                <p className="text-xs text-zinc-400 mt-2 font-mono">
                  Presupuesto Final Con IVA (21%): <strong className="text-white">{financial.totalGrossPrice} €</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono space-y-1 text-left">
                <div className="flex justify-between"><span>Depósito Lock:</span><strong className="text-emerald-400">100,00 € Stripe</strong></div>
                <div className="flex justify-between"><span>Exclusividad:</span><strong className="text-[#00E5FF]">Garantizada SHA-256</strong></div>
                <div className="flex justify-between"><span>Garantía Acústica:</span><strong className="text-amber-400">12 W/pax Bose/Shure</strong></div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setMatchSuccess(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300"
                >
                  Seguir Explorando
                </button>
                <a
                  href={`/checkout/presupuesto?proveedor=${encodeURIComponent(matchSuccess.name)}&base=${matchSuccess.basePrice}`}
                  className="flex-1 py-3 rounded-2xl bg-[#ecb613] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-amber-300 flex items-center justify-center gap-1 shadow-lg"
                >
                  <span>1-Click Confirmar</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🚴 SIMULADOR DE DESPACHO HORA Y CASCADA RELEVO UBER */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#00E5FF]" />
            <h3 className="text-base font-bold font-syne text-white uppercase">
              Simulador de Despacho & Buffer de Tránsito Uber (Caso Mariachi Real)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/20">
            BUFFER MÍNIMO: 60 MINUTOS
          </span>
        </div>

        {/* Dynamic Overtime Slider Controls */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Horas Extra Solicitadas en Gig 1 (Alcorcón 09:00 AM):</span>
            <strong className="text-[#ecb613]">+{overtimeHours} h extra (Duración Total: {gig1TotalDuration} min)</strong>
          </div>
          <input 
            type="range"
            min="0"
            max="6"
            step="1"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(Number(e.target.value))}
            className="w-full accent-[#ecb613] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>0h (Fin 10:00)</span>
            <span>+2h (Fin 12:00)</span>
            <span>+6h (Fin 16:00 - Buffer Insuficiente)</span>
          </div>
        </div>

        {/* Simulation Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          {/* Gig 1 Alcorcon Status */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-syne">1. Alcorcón (09:00 AM)</span>
              <span className="text-[10px] text-zinc-400">Duración: {gig1TotalDuration} min</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              Proveedor Original: <strong>{candidate.name}</strong>
            </p>
            <p className="text-[10px] text-zinc-400">
              Hora estimada de finalización: <strong>{0 + Math.floor((540 + gig1TotalDuration)/60)}:{(540 + gig1TotalDuration)%60 === 0 ? '00' : (540 + gig1TotalDuration)%60}</strong>
            </p>
          </div>

          {/* Gig 2 Algete Status + Failover Logic */}
          <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
            scheduleCheck.isFeasible 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-rose-500/10 border-rose-500/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-syne">2. Algete (16:30 PM)</span>
              {scheduleCheck.isFeasible ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> APTO (MARGEN OK)
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle size={12} /> CASCADA UBER ACTIVADA
                </span>
              )}
            </div>

            {scheduleCheck.isFeasible ? (
              <p className="text-zinc-300 text-[11px]">
                Asignado a: <strong>{candidate.name}</strong> ({scheduleCheck.marginMinutes} min libres vs {scheduleCheck.requiredBufferMinutes} min requeridos).
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-rose-300 text-[11px]">
                  {scheduleCheck.reason}
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-[#ecb613]/30 text-[11px] text-[#ecb613]">
                  ⚡ Reasignado Automáticamente a: <strong>{failover?.assignedVendorName}</strong>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
