"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic2, Activity, Music, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Adjusted the import path
import Link from 'next/link';
import { useSharedContext } from '@/app/context/SharedContext';
import { SERVICIOS } from '@/lib/constants/seo-data';
import { ROUTES } from '@/lib/routes';

export default function OmniSearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useSharedContext();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRODUCCION' | 'ARTISTAS' | 'VIMUME'>('ALL');

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Global Shortcut Listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Gatillo de Apertura
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        return;
      }

      // 2. Escape para Abortar
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Forzar foco en apertura
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Pre-calculated Quick Links for Zero-Friction
  const quickLinks = [
    { id: 1, type: 'VIMUME', icon: <Activity size={16}/>, title: 'Fundamento VIMUME (Ciencia)', href: ROUTES.fundacion },
    { id: 2, type: 'VIMUME', icon: <Activity size={16}/>, title: 'Protocolo de Intervención', href: ROUTES.protocolo },
    { id: 3, type: 'VIMUME', icon: <Activity size={16}/>, title: 'Roadmap y Despliegue', href: ROUTES.roadmap },
    { id: 4, type: 'ARTISTAS', icon: <Music size={16}/>, title: 'Gestión de Artistas Élite', href: '/artistas' },
    { id: 5, type: 'PRODUCCION', icon: <Calendar size={16}/>, title: 'Infraestructura para Eventos', href: '/eventos' },
  ];



  // 🔍 MOTOR DE BÚSQUEDA S-CLASS
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(() => {
      const searchTerms = query.toLowerCase();
      
      // Mapeo de tipos para el filtro
      const typeMap: Record<string, string> = {
        'PRODUCCION': 'EVENTO',
        'ARTISTAS': 'ARTISTA',
        'VIMUME': 'VIMUME'
      };

      const filtered = SERVICIOS.filter(s => {
        const matchesQuery = s.nombre.toLowerCase().includes(searchTerms) || 
                            s.descripcion.toLowerCase().includes(searchTerms) ||
                            s.slug.toLowerCase().includes(searchTerms) ||
                            (s.keywords && s.keywords.some(k => k.toLowerCase().includes(searchTerms)));
        
        if (activeFilter === 'ALL') return matchesQuery;
        
        // Lógica de filtrado por categoría
        if (activeFilter === 'ARTISTAS') return matchesQuery && (s.id.includes('edwin') || s.id.includes('mariachi'));
        if (activeFilter === 'VIMUME') return matchesQuery && s.id.includes('innovacion');
        if (activeFilter === 'PRODUCCION') return matchesQuery && !s.id.includes('edwin') && !s.id.includes('innovacion');
        
        return matchesQuery;
      }).map(s => ({
        id: s.id,
        title: s.nombre,
        desc: s.descripcion,
        href: s.id.includes('edwin') ? `/artistas/edwin-agudelo` : `/servicios/${s.slug}/madrid`,
        type: s.id.includes('innovacion') ? 'VIMUME' : (s.id.includes('edwin') ? 'ARTISTAS' : 'PRODUCCION'),
        icon: s.id.includes('innovacion') ? <Activity size={16}/> : (s.id.includes('edwin') ? <Mic2 size={16}/> : <Calendar size={16}/>)
      }));

      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, activeFilter]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsSearchOpen(false)}
            className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#ecb613]/30 rounded-2xl shadow-[0_0_80px_rgba(236,182,19,0.2)] overflow-hidden"
          >
            <div className="flex items-center px-6 py-5 border-b border-white/10">
              <Search className="text-[#ecb613] mr-4" size={22} />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Consultar el ecosistema VIMUME OS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-xl placeholder:text-white/20 focus:outline-none font-medium"
              />
              <div className="flex items-center gap-3">
                <kbd className="hidden md:inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40 font-mono">ESC</kbd>
                <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 px-6 py-4 bg-white/[0.02] border-b border-white/5 overflow-x-auto hide-scrollbar">
              <FilterBadge label="TODO" isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
              <FilterBadge label="PRODUCCIÓN" icon={<Calendar size={14}/>} isActive={activeFilter === 'PRODUCCION'} onClick={() => setActiveFilter('PRODUCCION')} />
              <FilterBadge label="ARTISTAS" icon={<Music size={14}/>} isActive={activeFilter === 'ARTISTAS'} onClick={() => setActiveFilter('ARTISTAS')} />
              <FilterBadge label="VIMUME" icon={<Activity size={14}/>} isActive={activeFilter === 'VIMUME'} onClick={() => setActiveFilter('VIMUME')} highlight />
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {query.length < 2 ? (
                <div className="p-6">
                  <span className="text-[10px] font-black text-[#ecb613] tracking-[0.4em] mb-6 block uppercase opacity-50">Navegación Institucional</span>
                  <div className="grid gap-2">
                    {quickLinks.filter(link => activeFilter === 'ALL' || link.type === activeFilter).map(link => (
                      <Link key={link.id} href={link.href} onClick={() => setIsSearchOpen(false)} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl group transition-all border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-xl", link.type === 'VIMUME' ? "bg-[#ecb613]/10 text-[#ecb613]" : "bg-white/5 text-white/40")}>
                            {link.icon}
                          </div>
                          <span className="text-white/70 font-bold uppercase tracking-tight group-hover:text-white transition-colors">{link.title}</span>
                        </div>
                        <ChevronRight size={16} className="text-white/10 group-hover:text-[#ecb613] group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2">
                  {isSearching ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-2 border-[#ecb613] border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Buscando en NUCLEO_DATA V173...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="grid gap-1">
                      {results.map((res) => (
                        <Link key={res.id} href={res.href} onClick={() => setIsSearchOpen(false)} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl group transition-all">
                          <div className="flex items-center gap-5">
                            <div className={cn("p-4 rounded-2xl", res.type === 'V3' ? "bg-[#ecb613]/10 text-[#ecb613]" : "bg-white/5 text-white/40")}>
                              {res.icon}
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-white font-black uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">{res.title}</h4>
                              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest line-clamp-1">{res.desc}</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-white/10 group-hover:text-[#ecb613] group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center flex flex-col items-center justify-center">
                      <Search size={40} className="text-white/5 mb-4" />
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Sin resultados para "{query}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="px-6 py-3 bg-black border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20">
              <span>VIMUME OS • NEURAL SEARCH INFRASTRUCTURE • V174</span>
              <span className="flex items-center gap-2">RESULTADOS: {results.length}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function FilterBadge({ label, icon, isActive, onClick, highlight = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
        isActive 
          ? highlight ? "bg-[#ecb613] text-black shadow-[0_0_10px_rgba(236,182,19,0.5)]" : "bg-white text-black" 
          : "bg-transparent border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
      )}
    >
      {icon} {label}
    </button>
  );
}