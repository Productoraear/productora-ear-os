"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  MapPin, 
  Users, 
  Calendar, 
  ChevronRight, 
  Zap,
  Info,
  DollarSign,
  Coffee,
  Bed
} from 'lucide-react';

interface CalculationResult {
  distanciaKm: number;
  costeDesplazamiento: number;
  dietas: number;
  hospedaje: number;
  total: number;
}

export const CostCalculator: React.FC = () => {
  const [distance, setDistance] = useState<number>(0);
  const [artists, setArtists] = useState<number>(1);
  const [days, setDays] = useState<number>(1);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    // Tarifas EAR OS - S-Class Standard
    const PRECIO_KM = 0.45;
    const DIETA_DIA = 45;
    const HOSPEDAJE_NOCHE = 85;

    const costeDesp = distance * PRECIO_KM;
    const dietasTotal = artists * days * DIETA_DIA;
    const hospedajeTotal = artists * (days > 1 ? days - 1 : 0) * HOSPEDAJE_NOCHE;

    setResult({
      distanciaKm: distance,
      costeDesplazamiento: Math.round(costeDesp),
      dietas: dietasTotal,
      hospedaje: hospedajeTotal,
      total: Math.round(costeDesp + dietasTotal + hospedajeTotal)
    });
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gold-500/20 rounded-xl">
          <Calculator className="text-gold-500" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">Calculadora de Costes</h3>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Transparencia EAR OS // 0% Sorpresas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <MapPin size={12} /> Distancia (KM ida/vuelta)
          </label>
          <input 
            type="number" 
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-gold-500/50 transition-all outline-none"
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Users size={12} /> Nº de Artistas/Staff
          </label>
          <input 
            type="number" 
            value={artists}
            onChange={(e) => setArtists(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-gold-500/50 transition-all outline-none"
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Calendar size={12} /> Duración (Días)
          </label>
          <input 
            type="number" 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-gold-500/50 transition-all outline-none"
            placeholder="1"
          />
        </div>
      </div>

      <button 
        onClick={calculate}
        className="w-full py-5 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
      >
        Procesar Cálculo Predictivo <ChevronRight size={16} />
      </button>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-8 bg-black/60 border border-gold-500/20 rounded-3xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={10} className="text-gold-500" /> Desplazamiento
                </span>
                <span className="text-2xl font-black text-white">{result.costeDesplazamiento}€</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Coffee size={10} className="text-gold-500" /> Dietas (Pre-pago)
                </span>
                <span className="text-2xl font-black text-white">{result.dietas}€</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Bed size={10} className="text-gold-500" /> Hospedaje Estándar
                </span>
                <span className="text-2xl font-black text-white">{result.hospedaje}€</span>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-gold-500 uppercase tracking-[0.4em] mb-1">TOTAL ESTIMADO S-CLASS</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{result.total}€</span>
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">IVA No Incluido</span>
                </div>
              </div>
              <div className="max-w-[180px] text-right">
                <p className="text-[9px] text-white/40 italic leading-relaxed">
                  Cálculo basado en la matriz de logística EAR OS v2.4. Sujeto a cambios según disponibilidad de flota.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-3 p-4 bg-white/[0.03] rounded-xl border border-white/5">
        <Info size={14} className="text-gold-500/50" />
        <p className="text-[9px] text-white/30 font-medium uppercase tracking-widest">
          Este sistema elimina las sorpresas de último minuto. Transparencia total en el presupuesto.
        </p>
      </div>
    </div>
  );
};
