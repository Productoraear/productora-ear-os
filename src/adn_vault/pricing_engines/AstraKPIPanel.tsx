'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ShieldAlert, Award, Crown, Zap, BarChart3, MessageSquareText } from 'lucide-react';
import { generateAstraVerdict, calculateAlphaScore } from '@/lib/utils/AstraCore';

/**
 * 🏛️ ASTRA KPI PANEL S-CLASS
 * Monitor de Probabilidad y Veredictos IA Astra.
 * Estética: Aura Onyx & S-Class Gold (#d4af37).
 */

export default function AstraKPIPanel() {
  const [alphaScore, setAlphaScore] = useState(0);
  const [verdict, setVerdict] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de datos de pedidos para Astra (Basado en el motor de 15,000 registros)
  const mockOrders = [
    { status: 'completed', amount: 5000 },
    { status: 'pending', amount: 1200 },
    { status: 'completed', amount: 3500 },
  ];

  useEffect(() => {
    // Generación de métricas IA con datos simulados S-Class
    const latestOrder = { title: 'Boda Premium Madrid', location: 'Madrid' };
    const latestFleet = { name: 'Vampire Symphony' };
    const score = calculateAlphaScore(mockOrders);
    const text = generateAstraVerdict(latestOrder, latestFleet, mockOrders);
    
    setTimeout(() => {
      setAlphaScore(score);
      setVerdict(text);
      setIsLoading(false);
    }, 1200); 
  }, []);

  return (
    <div className="bg-[#050505]/80 backdrop-blur-3xl border border-[#d4af37]/20 rounded-[3rem] p-10 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
      {/* 🌌 EFECTO "THE GREAT DIVIDE" */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#d4af37]/10 blur-[120px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 space-y-8">
        {/* HEADER ASTRA */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-2 block">
              Neural Twin // Astra v2.1
            </span>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Probabilidad <span className="text-[#d4af37]">Alpha</span>
            </h2>
          </div>
          <div className="p-4 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/30">
            <Zap className="text-[#d4af37] animate-pulse" size={24} />
          </div>
        </div>

        {/* PROBABILITY DISPLAY */}
        <div className="flex items-center gap-8 py-6 border-y border-white/5">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            {isLoading ? '...' : `${alphaScore}%`}
          </motion.div>
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Estado de Dominancia</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-tight">Sincronía Total</span>
            </div>
          </div>
        </div>

        {/* NEURAL VERDICT BOX */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <MessageSquareText size={14} className="text-[#d4af37]" /> Veredicto Astra
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 min-h-[100px] flex items-center">
            {isLoading ? (
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
                  />
                ))}
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium leading-relaxed italic text-zinc-300 first-letter:text-2xl first-letter:font-black first-letter:text-[#d4af37] first-letter:mr-1"
              >
                {verdict}
              </motion.p>
            )}
          </div>
        </div>

        {/* STORYSELLING BADGES */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Authority', icon: Crown },
            { label: 'The Great Divide', icon: Award },
            { label: 'Midnight Luxury', icon: ShieldAlert }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-full hover:border-[#d4af37]/40 transition-colors cursor-default group/badge">
              <badge.icon size={12} className="text-[#d4af37] group-hover/badge:scale-125 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover/badge:text-white transition-colors">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
