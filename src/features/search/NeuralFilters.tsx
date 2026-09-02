"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSovereignContext } from '@/shared/context/SovereignContext';
import { deriveIntentClass, calculateIntentScore } from '@/shared/context/sovereignDecisionEngine';
import { reportHighGravityIntent } from '@/services/telemetry/SovereignIntentService';

/**
 * NeuralFilters - Motor de Filtrado Neural (V127.1)
 * Lógica: Financial Gravity + S-Class Authority + Astra Semantic Sync.
 */
export const NeuralFilters: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { signal, updateSignal, isMounted } = useSovereignContext();

  // State Sync with URL
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [price, setPrice] = useState(Number(searchParams.get('priceMin')) || 1000);
  const [sClassOnly, setSClassOnly] = useState(searchParams.get('sclass') === '1');
  const [astraSuggestion, setAstraSuggestion] = useState<string | null>(null);
  const [isAstraLoading, setIsAstraLoading] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  // 🏛️ S-CLASS FORMULA: I_total = (P_base * M_provincia) + Delta_S-Class
  const M_PROVINCIA = 1.12; // Multiplicador de Zona Premium
  const DELTA_SCLASS = sClassOnly ? 1500 : 0;
  const totalInvestment = (price * M_PROVINCIA) + DELTA_SCLASS;

  // Terminology Mutation (B2G Switch)
  const labels = {
    search: signal.isB2G ? "Localizar Protocolo de Impacto Cultural" : "¿Qué hito tecnológico orquestamos hoy?",
    gravity: signal.isB2G ? "Inversión Social Bonificable VIMUME" : "Gravidad Financiera",
    authority: signal.isB2G ? "Validación Institucional B2G" : "Certificación S-Class",
    price_suffix: signal.isB2G ? " (Impacto Estimado)" : ""
  };

  // Sync state with URL params
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Handle Slider Change with Kinetic Vibration
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setPrice(newVal);
    updateParams({ priceMin: e.target.value });
    
    // Trigger kinetic vibration
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 150);
  };

  // Intent Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 3) {
        setIsAstraLoading(true);
        try {
          const response = await fetch('/api/astra/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: query, context: [] })
          });
          const data = await response.json();
          if (data.recommendations && data.recommendations.length > 0) {
            setAstraSuggestion(data.recommendations[0]);
            
            // 🛰️ Actualizar Contexto Soberano
            if (isMounted) {
              const nextSearches = [query, ...signal.lastSearches.filter(s => s !== query)].slice(0, 5);
              const nextScore = calculateIntentScore(signal, query);
              const nextIntentClass = deriveIntentClass(signal, query);
              
              updateSignal({ 
                lastSearches: nextSearches,
                intentScore: nextScore,
                intentClass: nextIntentClass
              });

              // 👻 Ghost Tracking - Telemetría de Alta Gravedad
              reportHighGravityIntent('NEURAL_SEARCH', signal, { query, route: pathname });
            }
          }
        } catch (err) {
          console.error("Astra Latency Fallback Active");
        } finally {
          setIsAstraLoading(false);
        }
      } else {
        setAstraSuggestion(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, signal, isMounted, updateSignal, pathname]);

  return (
    <motion.div 
      animate={isVibrating ? { x: [-1, 1, -1, 1, 0], y: [-1, 1, -1, 1, 0] } : {}}
      transition={{ duration: 0.1 }}
      className={`w-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 ${signal.isB2G ? 'border-blue-500/20 shadow-blue-500/5' : 'border-white/5'}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Semantic Intent Search */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 transition-colors ${isAstraLoading ? 'text-[#d4a855] animate-pulse' : 'text-white/20 group-focus-within:text-[#d4a855]'}`} />
          </div>
          <input 
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateParams({ q: e.target.value || null });
            }}
            placeholder={labels.search}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-sm font-medium focus:outline-none focus:border-[#d4a855]/50 focus:bg-white/10 transition-all placeholder:text-white/10"
          />
          <AnimatePresence>
            {astraSuggestion && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 w-full mt-3 p-4 bg-[#d4a855]/10 border border-[#d4a855]/20 rounded-xl flex items-center gap-3"
              >
                <Sparkles size={14} className="text-[#d4a855]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#d4a855]/80">Astra Sugiere:</span>
                <span className="text-[10px] text-white/60 italic">"{astraSuggestion}"</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Financial Gravity Slider */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
              <SlidersHorizontal size={12} /> {labels.gravity}
            </span>
            <motion.span 
              key={totalInvestment}
              initial={{ scale: 1.1, color: '#fff' }}
              animate={{ scale: 1, color: '#d4a855' }}
              className="text-xs font-black"
            >
              €{Math.round(totalInvestment).toLocaleString()}{labels.price_suffix}
            </motion.span>
          </div>
          <div className="relative">
            <input 
              type="range"
              min="1000"
              max="100000"
              step="500"
              value={price}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4a855]"
            />
            {/* Range Exit Particles (Simplified representation via glow) */}
            {price > 80000 && (
              <div className="absolute top-0 right-0 w-4 h-1.5 bg-[#d4a855] blur-sm animate-pulse rounded-full" />
            )}
          </div>
          <div className="flex justify-between text-[8px] font-bold text-white/10 uppercase tracking-widest px-1">
            <span>Protocolo Base</span>
            <span>Máxima Exponencial</span>
          </div>
        </div>

        {/* Authority Toggle */}
        <div className="lg:col-span-3 flex justify-end">
          <button 
            onClick={() => {
              const newVal = !sClassOnly;
              setSClassOnly(newVal);
              updateParams({ sclass: newVal ? '1' : null });
            }}
            className={`flex items-center gap-4 px-8 py-5 rounded-2xl border transition-all ${
              sClassOnly 
                ? 'bg-[#d4a855] border-[#d4a855] text-white shadow-[0_0_30px_rgba(212,168,85,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
            }`}
          >
            <ShieldCheck size={18} className={sClassOnly ? 'animate-bounce' : ''} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{labels.authority}</span>
          </button>
        </div>

      </div>
      
      {/* Search Metadata Info */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-white/10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><AlertCircle size={10} /> Latencia Astra: {isAstraLoading ? 'Procesando...' : '< 180ms'}</span>
          <span>•</span>
          <span>Contexto: {signal.isB2G ? 'Mesa de Contratación Pública' : 'Global V2'}</span>
        </div>
        <div className={`italic transition-colors ${signal.isB2G ? 'text-blue-400/40' : 'text-[#d4a855]/40'}`}>
          {signal.isB2G ? 'Resultados validados por el Protocolo VIMUME B2G' : 'Resultados auditados por el protocolo EAR GOLD'}
        </div>
      </div>
    </motion.div>
  );
};
