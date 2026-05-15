/**
 * 🏔️ DISCOVERY HERO - S-CLASS CINEMATIC ENGINE
 * Purpose: High-gravity entrance with multivariate search.
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';

export default function DiscoveryHero() {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    marketplaceFeedback.track('search_submitted', {
      query: 'global_search',
      path: window.location.pathname
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* 🌌 STABLE BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,182,19,0.05),transparent_70%)]" />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('/images/wedding.png')] bg-cover bg-center grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* 🎇 SUBTLE DECOR */}
      <div className="absolute inset-0 z-1 pointer-events-none" />

      <div className="container-custom relative z-10 text-center">
        {/* 🏆 AUTHORITY LABEL */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl"
        >
          <Zap size={14} className="text-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
            S-Class Marketplace OS <span className="text-[#ecb613]">V164.1</span>
          </span>
        </motion.div>

        {/* 🎭 THE VISION */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] text-white mb-8"
        >
          Diseña lo <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ecb613] to-white/20">
            Inevitable
          </span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-sm md:text-lg text-white/40 font-bold uppercase tracking-[0.2em] mb-16 px-4"
        >
          Descubrimiento de élite para eventos institucionales, corporativos y de gran lujo.
        </motion.p>

        {/* 🛸 MULTIVARIABLE SEARCH ENGINE */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`relative max-w-5xl mx-auto p-4 bg-white/5 backdrop-blur-3xl rounded-[3rem] border transition-all duration-700 ${
            isFocused ? 'border-[#ecb613]/40 shadow-[0_0_50px_rgba(212,168,85,0.15)] scale-105' : 'border-white/10'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Field: Occasion */}
            <div className="flex-1 w-full group/field px-8 py-4 border-r border-white/5 last:border-0 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-[#ecb613] mb-1">
                <Sparkles size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Ocasión</span>
              </div>
              <input 
                type="text" 
                placeholder="¿Qué celebras?" 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent text-white font-bold placeholder:text-white/20 focus:outline-none"
              />
            </div>

            {/* Field: Location */}
            <div className="flex-1 w-full group/field px-8 py-4 border-r border-white/5 last:border-0 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-[#ecb613] mb-1">
                <MapPin size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Territorio</span>
              </div>
              <input 
                type="text" 
                placeholder="Toda España" 
                className="w-full bg-transparent text-white font-bold placeholder:text-white/20 focus:outline-none"
              />
            </div>

            {/* Field: Date */}
            <div className="flex-1 w-full group/field px-8 py-4 border-r border-white/5 last:border-0 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-[#ecb613] mb-1">
                <Calendar size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Temporada</span>
              </div>
              <input 
                type="text" 
                placeholder="Seleccionar Fecha" 
                className="w-full bg-transparent text-white font-bold placeholder:text-white/20 focus:outline-none"
              />
            </div>

            {/* CTA: TRIGGER */}
            <button 
              type="submit"
              className="w-full md:w-auto h-20 px-12 bg-[#ecb613] text-black rounded-full flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ecb613]/20 group/btn"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">Discovery</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.form>

        {/* 📊 TRENDING INTENT */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Tendencias Actuales:</span>
          {['Gala Institucional', 'Incentivos B2B', 'Luxury Destination'].map((trend) => (
            <button key={trend} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[#ecb613] transition-colors">
              {trend}
            </button>
          ))}
        </motion.div>
      </div>

      {/* 🖱️ SCROLL INDICATOR */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#ecb613] to-transparent" />
      </motion.div>
    </section>
  );
}
