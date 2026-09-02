"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSovereignContext } from '@/shared/context/SovereignContext';
import { Shield, MapPin, HardHat, Heart, Gavel, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'artistas', label: 'EDWIN AGUDELO', sublabel: 'Master Artist', icon: Shield, color: '#d4a855', b2g_label: 'Protocolo Artístico', href: '/artistas/edwin-agudelo' },
  { id: 'venues', label: 'VENUES PREMIUM', sublabel: 'Golden Cohort', icon: MapPin, color: '#55d4a8', b2g_label: 'Espacios Estratégicos', href: '/venues' },
  { id: 'infraestructura', label: 'PRODUCCIÓN', sublabel: 'Logística Institucional', icon: HardHat, color: '#ecb613', b2g_label: 'Infraestructura Social', href: '/marketplace' },
  { id: 'social', label: 'VIMUME', sublabel: 'Impacto Clínico', icon: Heart, color: '#d455a8', b2g_label: 'Impacto Comunitario', href: '/vimume' },
  { id: 'b2g', label: 'LICITACIONES', sublabel: 'B2G Sovereign', icon: Gavel, color: '#d45555', b2g_label: 'Contratación Pública', href: '/ayuntamientospremium' },
];

export const PredatorNav: React.FC = () => {
  const { signal, updateSignal } = useSovereignContext();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeCategory = CATEGORIES.find(c => c.id === hoveredCategory);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 md:py-8 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between bg-black/40 backdrop-blur-3xl border border-white/5 rounded-full px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-4">
          <div className="w-12 h-12 bg-[#d4a855] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,168,85,0.3)] group-hover:scale-110 transition-all duration-500">
            <span className="text-black font-black text-2xl">EA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white uppercase">Edwin <span className="text-[#d4a855]">Agudelo</span></span>
            <span className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase">Sovereign OS Gold</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id}
              href={cat.href}
              className="relative group cursor-pointer py-2"
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex flex-col items-center transition-all group-hover:-translate-y-1">
                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
                  {signal.isB2G ? cat.b2g_label : cat.label}
                </span>
                <div className="h-1 w-0 bg-[#d4a855] mt-1 group-hover:w-full transition-all duration-500 rounded-full shadow-[0_0_10px_#d4a855]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          {/* B2G Toggle */}
          <button 
            onClick={() => updateSignal({ isB2G: !signal.isB2G })}
            className={`hidden sm:flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all duration-500 ${
              signal.isB2G 
                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${signal.isB2G ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {signal.isB2G ? 'PERFIL INSTITUCIONAL' : 'MODO B2B'}
            </span>
          </button>
          
          <Link href="/login">
            <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#d4a855] hover:text-white transition-all duration-500 shadow-xl active:scale-95">
              Access
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mega Menu Backdrop Layer (Tailwind/Framer Version) */}
      <AnimatePresence>
        {hoveredCategory && activeCategory && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[120px] left-0 w-full px-12 pointer-events-none"
          >
            <div className="max-w-[1600px] mx-auto bg-black/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex items-center justify-between overflow-hidden pointer-events-auto">
              <div className="flex-1">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#d4a855] text-xs font-black tracking-[0.8em] uppercase mb-4 block"
                >
                  {activeCategory.sublabel}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-8xl font-black tracking-tighter text-white mb-8"
                >
                  {activeCategory.label}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="max-w-xl text-lg font-medium leading-relaxed mb-12"
                >
                  Infraestructura de alto impacto diseñada para la excelencia operativa en {activeCategory.label.toLowerCase()}. 
                  Sistemas validados bajo el protocolo VIMUME OS.
                </motion.p>
                <Link href={activeCategory.href} className="group flex items-center gap-4 text-white font-black tracking-widest text-[10px] uppercase">
                  <span>Explorar Ecosistema</span>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              </div>

              {/* Visual Decoration (Tailwind CSS replacement for 3D) */}
              <div className="relative w-1/3 aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-[#d4a855]/10 blur-[120px] rounded-full animate-pulse" />
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-64 h-64 border-2 border-dashed border-[#d4a855]/20 rounded-full flex items-center justify-center p-8"
                >
                  <div className="w-full h-full border-2 border-[#d4a855]/40 rounded-full flex items-center justify-center p-8">
                    <activeCategory.icon size={80} className="text-[#d4a855] drop-shadow-[0_0_20px_rgba(212,168,85,0.5)]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-[110] flex flex-col p-12 lg:hidden"
          >
            <div className="flex justify-between items-center mb-24">
              <span className="text-white font-black tracking-tighter text-2xl">EA <span className="text-[#d4a855]">GOLD</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-12">
              {CATEGORIES.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/categorias/${cat.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group"
                >
                  <span className="text-5xl font-black text-white/20 group-hover:text-white transition-all duration-500 flex items-center gap-6">
                    {cat.label}
                    <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-[#d4a855]" size={32} />
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
