/**
 * 🛰️ DISCOVERY HERO - S-CLASS MARKETPLACE ENGINE
 * Purpose: Transition from generic branding to high-utility discovery.
 * Style: Silicon Valley / Airbnb / Premium Marketplace.
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Zap, Sparkles, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';

export const DiscoveryHero: React.FC = () => {
  const router = useRouter();
  const [occasion, setOccasion] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const occasions = [
    { id: 'boda', label: 'Boda Premium', icon: '💍' },
    { id: 'corporativo', label: 'Corporativo S-Class', icon: '🏢' },
    { id: 'ayuntamiento', label: 'Institucional B2G', icon: '🏛️' },
    { id: 'concierto', label: 'Gran Formato', icon: '🎸' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (occasion) params.set('type', occasion);
    if (location) params.set('location', location);
    if (date) params.set('date', date);

    // 🛰️ SIGNAL ACQUISITION
    marketplaceFeedback.track('search_submitted', {
      occasion,
      province: location,
      date
    });

    router.push(`/descubrir?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a855]/10 border border-[#d4a855]/30 text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em] mb-8"
        >
          <Sparkles size={12} />
          Protocolo de Descubrimiento Activo
        </motion.div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-8">
          Diseña tu <br />
          <span className="text-[#d4a855] italic">Impacto Perfecto</span>
        </h1>
        <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.4em] font-bold max-w-2xl mx-auto leading-relaxed">
          No busques servicios. Localiza infraestructuras de dominancia emocional certificadas por EAR GOLD.
        </p>
      </div>

      {/* DISCOVERY ENGINE - GLASS PANEL */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-2 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* OCCASION SELECT */}
          <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-white/5 relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-left flex flex-col gap-1 group"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-[#d4a855] transition-colors">¿Qué orquestamos?</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-tight">
                  {occasion ? occasions.find(o => o.id === occasion)?.label : 'Seleccionar Ocasión'}
                </span>
                <ChevronDown size={14} className={`text-white/20 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-4 bg-[#111] border border-white/10 rounded-2xl p-2 z-[100] shadow-2xl"
                >
                  {occasions.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setOccasion(o.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-lg">{o.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-wider">{o.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LOCATION */}
          <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                <MapPin size={10} /> Territorio
              </span>
              <input 
                type="text" 
                placeholder="Ciudad o Provincia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-bold uppercase tracking-tight focus:ring-0 placeholder:text-white/10"
              />
            </div>
          </div>

          {/* DATE */}
          <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                <Calendar size={10} /> Cuándo
              </span>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-bold uppercase tracking-tight focus:ring-0 text-white/60 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* ACTION */}
          <div className="md:col-span-3 p-4">
            <button 
              onClick={handleSearch}
              className="w-full h-16 bg-[#d4a855] text-black rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <Search size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Localizar</span>
            </button>
          </div>

        </div>
      </motion.div>

      {/* TRENDING HUB LINKS */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Tendencias S-Class:</span>
        {['Madrid', 'Sevilla', 'Málaga', 'Valencia'].map((city) => (
          <button key={city} onClick={() => setLocation(city)} className="text-[9px] font-black uppercase tracking-widest hover:text-[#d4a855] transition-colors">{city}</button>
        ))}
      </div>
    </div>
  );
};
