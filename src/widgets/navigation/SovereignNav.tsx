"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Shield, Zap, Globe, Users, Briefcase, Activity } from 'lucide-react';
import { SERVICIOS, PROVINCIAS } from '@/lib/constants/seo-data';
import { ROUTES } from '@/lib/routes';

/**
 * SovereignNav - Mega-Menu de Alta Densidad (V127.1)
 * Estética: Aura Onyx + Glassmorphism Pro.
 */
export const SovereignNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'EVENTOS', icon: <Zap size={14} />, services: SERVICIOS.filter(s => !['mariachis', 'innovacion-social'].includes(s.id)) },
    { label: 'ARTISTAS', icon: <Users size={14} />, services: SERVICIOS.filter(s => s.id === 'mariachis') },
    { label: 'VIMUME', icon: <Globe size={14} />, services: SERVICIOS.filter(s => s.id === 'innovacion-social') },
    { label: 'B2G', icon: <Briefcase size={14} />, services: SERVICIOS.filter(s => s.id === 'configurador-bespoke') },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out ${
        scrolled ? 'py-6' : 'py-10'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-8 transition-all duration-700 ${scrolled ? 'scale-95' : 'scale-100'}`}>
        <div className={`glass-panel p-6 flex justify-between items-center ${scrolled ? 'rounded-[2.5rem]' : 'rounded-[3rem] border-transparent bg-transparent'}`}>
          {/* Logo S-Class */}
          <Link href="/" className="text-2xl font-black tracking-tighter group flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d4a855] group-hover:scale-150 transition-transform" />
            VIMUME<span className="text-[#d4a855]">OS</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <div 
                key={item.label}
                onMouseEnter={() => setActiveTab(item.label)}
                onMouseLeave={() => setActiveTab(null)}
                className="relative"
              >
                <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors py-2">
                  {item.label}
                  <ChevronDown size={10} className={`transition-transform duration-500 ${activeTab === item.label ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeTab === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[450px] mt-6 p-8 glass-panel rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                    >
                      <div className="grid gap-6">
                        {item.label === 'ARTISTAS' && (
                          <Link 
                            href="/artistas/edwin-agudelo"
                            className="group flex flex-col gap-1 p-4 bg-[#d4a855]/5 border border-[#d4a855]/20 rounded-2xl mb-4"
                          >
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4a855]">Dossier Edwin Agudelo</h4>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest leading-none">Autoridad VIMUME OS • Mariachi / Banda / Corridos</p>
                          </Link>
                        )}
                        {item.services.map((s) => (
                          <Link 
                            key={s.id} 
                            href={`/servicios/${s.slug}/madrid`}
                            className="group flex flex-col gap-1"
                          >
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/60 group-hover:text-[#d4a855] transition-colors">{s.nombre}</h4>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest leading-none opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">{s.descripcion}</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <Link 
              href="/centro-mando"
              className="hidden xl:flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
              DASHBOARD <Activity size={14} className="text-[#d4a855]" />
            </Link>

            <Link 
              href={ROUTES.contacto}
              className="hidden sm:flex items-center gap-3 px-8 py-4 bg-white text-black text-[10px] font-black tracking-0.3em uppercase rounded-2xl hover:bg-[#d4a855] hover:text-white transition-all active:scale-95 shadow-xl"
            >
              CONTACTO <Shield size={14} />
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[90] bg-[#050505]/95 backdrop-blur-3xl lg:hidden pt-40 px-10"
          >
            <div className="grid gap-12">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855] opacity-40">
                    {item.label}
                  </div>
                  <div className="grid gap-4">
                    {item.services.map((s) => (
                      <Link 
                        key={s.id} 
                        href={`/servicios/${s.slug}/madrid`}
                        onClick={() => setIsOpen(false)}
                        className="text-4xl font-black uppercase tracking-tighter text-white/60 hover:text-white"
                      >
                        {s.nombre}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
