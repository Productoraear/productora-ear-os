'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, SlidersHorizontal, 
  Search, ShieldCheck, Sparkles, X, Check,
  Volume2, Compass, AlertCircle, RefreshCcw, DollarSign
} from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAirbnbBookingFiltersStore, EventType } from './stores/useAirbnbBookingFiltersStore';
import { PROVINCE_COORDINATES } from './utils/mentridaDistanceEngine';

const CATEGORIES_LIST = [
  'DJ', 'Solista', 'Catering', 'Luces / LED', 
  'Chauffeur VIP', 'Fotografía', 'Fincas', 'Animación', 'Mariachis'
];

export const AirbnbNeuralBookingBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'date' | 'location' | 'pax' | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    eventDate,
    province,
    municipality,
    pax,
    endHour,
    eventType,
    selectedCategories,
    priceRange,
    sClassOnly,
    b2gMode,
    setEventDate,
    setLocation,
    setPax,
    setEndHour,
    setEventType,
    toggleCategory,
    setPriceRange,
    setSClassOnly,
    setB2gMode,
    resetFilters,
    getDistanceKm,
    getLogisticsBreakdown,
    getAcousticDiagnostic
  } = useAirbnbBookingFiltersStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const distanceKm = getDistanceKm();
  const logistics = getLogisticsBreakdown();
  const acoustic = getAcousticDiagnostic();

  const handleSearchTrigger = () => {
    setActiveSegment(null);
    const params = new URLSearchParams(searchParams.toString());
    if (eventDate) params.set('date', eventDate);
    if (province) params.set('province', province);
    if (municipality) params.set('municipality', municipality);
    if (pax) params.set('pax', pax.toString());
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (sClassOnly) params.set('sclass', '1');
    if (b2gMode) params.set('b2g', '1');
    params.set('priceMax', priceRange[1].toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full relative z-40">
      
      {/* 🚀 AIRBNB STYLE BAR CONTAINING 4 SEGMENTS */}
      <div className="bg-[#030305]/95 border border-white/15 rounded-3xl p-2 sm:p-3 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          
          {/* 1. CALENDARIO / FECHA */}
          <div 
            onClick={() => setActiveSegment(activeSegment === 'date' ? null : 'date')}
            className={`md:col-span-3 p-3 rounded-2xl cursor-pointer transition-all border ${
              activeSegment === 'date' 
                ? 'bg-white/10 border-[#ecb613]/50 shadow-inner' 
                : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613]">
                <Calendar size={16} />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Cualquier Fecha
                </span>
                <span className="text-xs font-bold text-white font-syne truncate block">
                  {eventDate ? new Date(eventDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Añadir Fecha'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. UBICACIÓN & GPS MÉNTRIDA */}
          <div 
            onClick={() => setActiveSegment(activeSegment === 'location' ? null : 'location')}
            className={`md:col-span-3 p-3 rounded-2xl cursor-pointer transition-all border ${
              activeSegment === 'location' 
                ? 'bg-white/10 border-[#00E5FF]/50 shadow-inner' 
                : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]">
                <MapPin size={16} />
              </div>
              <div className="truncate">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Ubicación (GPS)
                  </span>
                  <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.2 rounded font-bold">
                    {distanceKm} km Méntrida
                  </span>
                </div>
                <span className="text-xs font-bold text-white font-syne truncate block">
                  {province || 'Seleccionar Provincia'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. INVITADOS (PAX) & DIAGNÓSTICO ACÚSTICO */}
          <div 
            onClick={() => setActiveSegment(activeSegment === 'pax' ? null : 'pax')}
            className={`md:col-span-3 p-3 rounded-2xl cursor-pointer transition-all border ${
              activeSegment === 'pax' 
                ? 'bg-white/10 border-emerald-500/50 shadow-inner' 
                : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Users size={16} />
              </div>
              <div className="truncate">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Invitados & Audio
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                    {acoustic.wattsRms}W (12W/pax)
                  </span>
                </div>
                <span className="text-xs font-bold text-white font-syne truncate block">
                  {pax} Invitados
                </span>
              </div>
            </div>
          </div>

          {/* 4. FILTROS AVANZADOS & BOTÓN BÚSQUEDA */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex-1 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-syne font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <SlidersHorizontal size={16} className="text-[#ecb613]" />
              <span>Filtros ({selectedCategories.length + (sClassOnly ? 1 : 0) + (b2gMode ? 1 : 0)})</span>
            </button>

            <button
              onClick={handleSearchTrigger}
              className="p-3.5 rounded-2xl bg-[#ecb613] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2"
            >
              <Search size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* 🧭 EXPANDED POPUP SEGMENT DRAWERS */}
      <AnimatePresence>
        {activeSegment === 'date' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-3 p-5 bg-[#0a0a0f] border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl z-50 w-full max-w-md space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-xs font-bold font-syne uppercase text-white">Seleccionar Fecha del Evento</span>
              <button onClick={() => setActiveSegment(null)}><X size={14} className="text-zinc-400" /></button>
            </div>
            <input 
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white font-mono focus:outline-none focus:border-[#ecb613]"
            />
            <p className="text-[10px] text-zinc-400 font-mono">
              * La fecha bloquea la exclusividad del artista mediante depósito SHA-256 Stripe.
            </p>
          </motion.div>
        )}

        {activeSegment === 'location' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 md:left-[25%] mt-3 p-5 bg-[#0a0a0f] border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl z-50 w-full max-w-md space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-xs font-bold font-syne uppercase text-white">Ubicación & Calculadora Méntrida</span>
              <button onClick={() => setActiveSegment(null)}><X size={14} className="text-zinc-400" /></button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 block">Provincia de España:</label>
              <select 
                value={province}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white font-mono focus:outline-none focus:border-[#00E5FF]"
              >
                {Object.keys(PROVINCE_COORDINATES).map(p => (
                  <option key={p} value={p} className="bg-black text-white">{p}</option>
                ))}
              </select>
            </div>

            {/* Telemetría Logística */}
            <div className="p-3 rounded-2xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-xs font-mono space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Distancia desde Méntrida:</span>
                <strong className="text-[#00E5FF]">{distanceKm} km</strong>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Tarifa de Transporte (1,50 €/km &gt;50km):</span>
                <strong>{logistics.kmCost} €</strong>
              </div>
              {logistics.requiresLodging && (
                <div className="flex justify-between text-amber-400">
                  <span>Suplemento Hotel (Fin &gt;= 3AM o &gt;200km):</span>
                  <strong>+120 €</strong>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSegment === 'pax' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 md:left-[50%] mt-3 p-5 bg-[#0a0a0f] border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl z-50 w-full max-w-md space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-xs font-bold font-syne uppercase text-white">Número de Invitados & Acústica</span>
              <button onClick={() => setActiveSegment(null)}><X size={14} className="text-zinc-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-syne">{pax} Asistentes</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPax(pax - 25)}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => setPax(pax + 25)}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <input 
                type="range"
                min="20"
                max="1000"
                step="10"
                value={pax}
                onChange={(e) => setPax(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Diagnóstico Acústico */}
            <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Potencia Requerida (12 W/pax):</span>
                <strong className="text-emerald-400">{acoustic.wattsRms} W RMS</strong>
              </div>
              <p className="text-[10px] text-zinc-400 pt-1">
                Hardware recomendado: <strong>{acoustic.setupDescription}</strong>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎛️ DRAWER MODAL DE FILTROS INTELEVENTES AVANZADOS S-CLASS */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#030305] border border-white/15 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-[#ecb613]" size={20} />
                  <h2 className="text-lg font-bold font-syne uppercase">Filtros Inteligentes S-Class</h2>
                </div>
                <button onClick={() => setIsFilterModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400">
                  <X size={18} />
                </button>
              </div>

              {/* Categorías / Gremios Multi-Select */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-400 block">Gremios & Servicios:</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_LIST.map((cat) => {
                    const selected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold transition-all border ${
                          selected 
                            ? 'bg-[#ecb613] text-black border-[#ecb613] shadow' 
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de Evento */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-400 block">Tipo de Evento:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 font-syne font-bold text-xs">
                  {(['BODA', 'CORPORATIVO', 'B2G', 'PRIVADO', 'CONCIERTO'] as EventType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setEventType(type)}
                      className={`p-2 rounded-xl text-center transition-all border ${
                        eventType === type 
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF]' 
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Switches de Certificación y B2G */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => setSClassOnly(!sClassOnly)}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    sClassOnly 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' 
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} />
                    <div className="text-left">
                      <span className="text-xs font-bold font-syne block">Sólo Perfiles S-Class</span>
                      <span className="text-[10px] font-mono text-zinc-400">Verificados Split 80/10/10</span>
                    </div>
                  </div>
                  {sClassOnly && <Check size={18} />}
                </button>

                <button
                  onClick={() => setB2gMode(!b2gMode)}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    b2gMode 
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Compass size={20} />
                    <div className="text-left">
                      <span className="text-xs font-bold font-syne block">Modo B2G (LCSP)</span>
                      <span className="text-[10px] font-mono text-zinc-400">&lt;14.250€ | &lt;75 dB SPL</span>
                    </div>
                  </div>
                  {b2gMode && <Check size={18} />}
                </button>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 flex items-center gap-1"
                >
                  <RefreshCcw size={12} />
                  <span>Restablecer Filtros</span>
                </button>

                <button
                  onClick={() => {
                    setIsFilterModalOpen(false);
                    handleSearchTrigger();
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#ecb613] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-[#ecb613]/20"
                >
                  Aplicar Filtros Inteligentes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
