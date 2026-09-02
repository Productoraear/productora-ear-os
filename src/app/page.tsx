'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Building2, Music2, ShieldCheck, HeartPulse, 
  ArrowRight, PhoneCall, Sliders, Database, 
  Search, SlidersHorizontal, CreditCard, ChevronRight, CheckCircle2,
  Volume2, Shield, Calendar, Users, Zap, X, Lock, Flame, Award, ExternalLink
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { useSharedContext } from '@/app/context/SharedContext';
import MultiPricer from '@/components/pricing/MultiPricer';
import TinderMatcherClient from '@/components/pricing/TinderMatcherClient';
import DiscoverySearch from '@/components/search/DiscoverySearch';

export default function HomePage() {
  const { isSearchOpen, setIsSearchOpen, isPricerOpen, setIsPricerOpen } = useSharedContext();
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [isVimumeOpen, setIsVimumeOpen] = useState(false);
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  // Escucha global de teclado para atajo Ctrl+K / Cmd+K y tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsPricerOpen(false);
        setIsMatcherOpen(false);
        setIsSearchOpen(false);
        setIsVimumeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen, setIsPricerOpen]);

  return (
    <main className="min-h-screen max-h-screen h-screen w-screen bg-[#020617] text-zinc-100 overflow-hidden flex flex-col justify-between relative selection:bg-amber-500 selection:text-black font-sans">
      
      {/* ── MALLA DE LUZ ISOMÉTRICA OBSIDIANA & ORO ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,85,0.07)_0%,rgba(2,6,23,0.95)_75%,#020617_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      {/* ── CABECERA MINIMALISTA S-CLASS ── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between gap-4 border-b border-zinc-900/60 backdrop-blur-sm">
        {/* Isotipo Monocromo / Oro Oficial de Productora EAR */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400/20 via-zinc-900 to-black border border-amber-500/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(245,197,56,0.15)] group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(245,197,56,0.3)] transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform">
              <polygon points="12 2 22 12 12 22 2 12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-widest text-sm text-white group-hover:text-amber-400 transition-colors font-mono">
              PRODUCTORA EAR
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
              S-CLASS KERNEL · EAR OS
            </span>
          </div>
        </Link>

        {/* Acceso Buscador Discovery y Acciones Rápidas */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trigger Buscador Discovery (Ctrl+K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-xs font-mono text-zinc-300 transition-all shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Discovery</span>
            <kbd className="hidden md:inline-block text-[10px] bg-black/60 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
              Ctrl+K
            </kbd>
          </button>

          {/* The Oracle */}
          <Link
            href="/oraculo"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-amber-400/90 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Oráculo</span>
          </Link>

          {/* Vampirizador */}
          <Link
            href="/vampiro"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-cyan-400/90 transition-colors"
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Vampirizador</span>
          </Link>

          {/* Centralita Telefónica */}
          <a
            href={CENTRALITA.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span className="hidden xl:inline">{CENTRALITA.display}</span>
          </a>
        </div>
      </header>

      {/* ── CUERPO CENTRAL: EL DIAMANTE ISOMÉTRICO INTERACTIVO ── */}
      <section className="relative z-10 flex-1 flex items-center justify-center p-2 sm:p-4 max-h-[calc(100vh-140px)]">
        <div className="relative w-full max-w-[660px] aspect-square flex items-center justify-center">
          
          {/* Geometría Vectorial SVG del Diamante EAR con Facetas y Destellos */}
          <svg 
            viewBox="0 0 700 700" 
            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_25px_rgba(212,168,85,0.12)]"
          >
            <defs>
              <linearGradient id="diamondGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#d97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="facetLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>
              <radialGradient id="sapphirePulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#0369a1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Aura Central de VIMUME */}
            <circle cx="350" cy="350" r="160" fill="url(#sapphirePulse)" />

            {/* Polígono Exterior del Diamante */}
            <polygon 
              points="350,50 650,350 350,650 50,350" 
              fill="rgba(15, 23, 42, 0.4)" 
              stroke="url(#diamondGold)" 
              strokeWidth="2"
              strokeDasharray="6 3"
              className="animate-pulse"
              style={{ animationDuration: '6s' }}
            />

            {/* Líneas de Faceta Isométricas hacia el Corazón */}
            <line x1="350" y1="50" x2="350" y2="240" stroke="url(#facetLine)" strokeWidth="1.5" />
            <line x1="650" y1="350" x2="460" y2="350" stroke="url(#facetLine)" strokeWidth="1.5" />
            <line x1="350" y1="650" x2="350" y2="460" stroke="url(#facetLine)" strokeWidth="1.5" />
            <line x1="50" y1="350" x2="240" y2="350" stroke="url(#facetLine)" strokeWidth="1.5" />

            {/* Polígono Interior Secundario */}
            <polygon 
              points="350,240 460,350 350,460 240,350" 
              fill="rgba(3, 105, 161, 0.08)" 
              stroke="#d4a855" 
              strokeWidth="1.5" 
              opacity="0.8"
            />

            {/* Anillos de Frecuencia 40Hz en el Centro */}
            <circle cx="350" cy="350" r="90" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="350" cy="350" r="110" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />
          </svg>

          {/* ── 1. VÉRTICE NORTE (ROJO): ARTISTAS ── */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center group z-20 cursor-pointer"
            onMouseEnter={() => setActiveHoverNode('artistas')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            <div 
              onClick={() => setIsMatcherOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-zinc-950/90 border border-purple-500/40 hover:border-purple-400 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all transform hover:-translate-y-1 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  ROSTER S-CLASS
                </span>
              </div>
              <h2 className="text-base font-black font-serif text-white tracking-wider flex items-center justify-center gap-1.5">
                <Music2 className="w-4 h-4 text-purple-400" />
                <span>ARTISTAS</span>
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                EDWIN AGUDELO · 80% NETO
              </p>
            </div>
            
            {/* Botones de Acción Directa */}
            <div className="flex items-center gap-1.5 mt-2 opacity-90 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsMatcherOpen(true)}
                className="px-2.5 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500 hover:text-white border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 transition-colors shadow-sm"
              >
                Matcher Swipe
              </button>
              <Link 
                href="/artistas"
                className="p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Ver Roster Completo"
              >
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* ── 2. VÉRTICE OESTE (ÁMBAR): EVENTOS ── */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start group z-20 cursor-pointer"
            onMouseEnter={() => setActiveHoverNode('eventos')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            <div 
              onClick={() => setIsPricerOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-zinc-950/90 border border-amber-500/40 hover:border-amber-400 backdrop-blur-xl shadow-[0_0_25px_rgba(245,197,56,0.2)] hover:shadow-[0_0_35px_rgba(245,197,56,0.35)] transition-all transform hover:-translate-x-1 text-left"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  B2C ÉLITE
                </span>
              </div>
              <h2 className="text-base font-black font-serif text-white tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>EVENTOS</span>
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                BODAS & PRICE-LOCK 72h
              </p>
            </div>

            {/* Botones de Acción Directa */}
            <div className="flex items-center gap-1.5 mt-2 opacity-90 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsPricerOpen(true)}
                className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 transition-colors shadow-sm"
              >
                Cotizador S-Class
              </button>
              <Link 
                href="/bodas"
                className="p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Ver Catálogo Nupcial"
              >
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* ── 3. VÉRTICE ESTE (CIAN): INSTITUCIONES ── */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end group z-20 cursor-pointer"
            onMouseEnter={() => setActiveHoverNode('instituciones')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            <Link 
              href="/contratacion/ayuntamientos"
              className="px-4 py-2.5 rounded-2xl bg-zinc-950/90 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all transform hover:translate-x-1 text-right"
            >
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  B2G PÚBLICO
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <h2 className="text-base font-black font-serif text-white tracking-wider flex items-center justify-end gap-1.5">
                <span>INSTITUCIONES</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                AYUNTAMIENTOS · ART. 118 LCSP
              </p>
            </Link>

            {/* Botones de Acción Directa */}
            <div className="flex items-center gap-1.5 mt-2 opacity-90 group-hover:opacity-100 transition-opacity">
              <Link 
                href="/contratacion/ayuntamientos/navalcarnero"
                className="px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 transition-colors shadow-sm"
              >
                Corredor B2G
              </Link>
              <Link 
                href="/contratacion/ayuntamientos"
                className="p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Pliegos B2G"
              >
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* ── 4. VÉRTICE SUR (ESMERALDA): EMPRESAS ── */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center group z-20 cursor-pointer"
            onMouseEnter={() => setActiveHoverNode('empresas')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            {/* Botones de Acción Directa Superiores */}
            <div className="flex items-center gap-1.5 mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
              <Link 
                href="/ocasiones/corporativo"
                className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 transition-colors shadow-sm"
              >
                Arsenal B2B
              </Link>
              <Link 
                href="/ocasiones/corporativo"
                className="p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Portal Corporativo"
              >
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <Link 
              href="/ocasiones/corporativo"
              className="px-4 py-2.5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 hover:border-emerald-400 backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all transform hover:translate-y-1 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  B2B CORPORATIVO
                </span>
              </div>
              <h2 className="text-base font-black font-serif text-white tracking-wider flex items-center justify-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>EMPRESAS</span>
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                PANTALLAS P2.6 · COMISIÓN 10%
              </p>
            </Link>
          </div>

          {/* ── 5. NÚCLEO CENTRAL (CORAZÓN DEL DIAMANTE - AZUL ZAFIRO / ORO): PROYECTO VIMUME ── */}
          <div 
            onClick={() => setIsVimumeOpen(true)}
            className="relative z-30 cursor-pointer group"
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-sky-900/60 via-zinc-950 to-amber-950/40 border-2 border-amber-400/60 p-4 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(56,189,248,0.3),0_0_20px_rgba(245,197,56,0.2)] group-hover:scale-105 group-hover:border-amber-300 group-hover:shadow-[0_0_55px_rgba(56,189,248,0.45)] transition-all backdrop-blur-2xl">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mb-1 text-sky-400 group-hover:rotate-12 transition-transform">
                <HeartPulse className="w-4 h-4 text-amber-300" />
              </div>

              <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-0.5">
                BUQUE INSIGNIA
              </span>
              
              <h2 className="text-xs sm:text-sm font-black font-serif text-white tracking-wider uppercase">
                PROYECTO VIMUME
              </h2>

              <p className="text-[8px] font-mono text-sky-300/80 mt-0.5">
                40Hz NEUROACÚSTICA
              </p>

              <span className="mt-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[8px] font-mono text-amber-300 font-bold uppercase">
                ODS 2030
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── BASE TRANSVERSAL FLOTANTE (HUD DE CABINA S-CLASS) ── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 border-t border-zinc-900/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* Indicador de Disponibilidad y Price-Lock SHA-256 */}
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold text-[11px]">DISPONIBILIDAD ACTIVA</span>
          <span className="text-zinc-600 hidden md:inline">|</span>
          <span className="text-[10px] text-zinc-500 hidden md:inline font-mono">
            PRICE-LOCK 72h SHA-256: 0xEAR72H99...
          </span>
        </div>

        {/* Botonera de Acciones Inmediatas (HUD Central) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <button
            onClick={() => setIsPricerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold tracking-wider text-[11px] uppercase transition-all shadow-[0_0_15px_rgba(245,197,56,0.25)] active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Cotizar Gala / Evento</span>
          </button>

          <button
            onClick={() => setIsMatcherOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 hover:text-white border border-purple-500/40 text-purple-300 font-bold tracking-wider text-[11px] uppercase transition-all active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Matcher Artistas</span>
          </button>

          <Link
            href="/cotizador"
            className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] transition-colors"
          >
            <span>Cotizador Full</span>
          </Link>

          <Link
            href="/matcher"
            className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] transition-colors"
          >
            <span>Matcher Full</span>
          </Link>

          <Link
            href="/ecosistema"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] transition-colors"
          >
            <span>Ecosistema</span>
          </Link>
        </div>

        {/* Depósito Smart-Lock 100€ */}
        <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Depósito Reserva: <strong className="text-white">100 €</strong></span>
        </div>
      </footer>

      {/* ── OVERLAYS INTERACTIVOS S-CLASS (SIN ABANDONAR LA EXPERIENCIA) ── */}

      {/* 1. OVERLAY MULTIPRICER S-CLASS */}
      <AnimatePresence>
        {isPricerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-6xl max-h-[92vh] bg-[#09090d] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header del Modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase">
                      MultiPricer S-Class · Calculadora Paramétrica
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Ajuste dinámico a 12 W/pax · Split 80/10/10 · Price-Lock 72h garantizado
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/cotizador"
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-mono font-bold transition-colors"
                  >
                    <span>Pantalla Completa</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setIsPricerOpen(false)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido con Scroll Interno */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <MultiPricer />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. OVERLAY TINDER MATCHER DE ARTISTAS */}
      <AnimatePresence>
        {isMatcherOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-5xl max-h-[92vh] bg-[#09090d] border border-purple-500/30 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header del Modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase">
                      Tinder Matcher · Asignación Artística por Aforo y Sala
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Capacidad 20 a 1.200 pax · Selección de formato · Edwin Agudelo & Solistas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/matcher"
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-xs font-mono font-bold transition-colors"
                  >
                    <span>Pantalla Completa</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setIsMatcherOpen(false)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido con Scroll Interno */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <TinderMatcherClient />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. OVERLAY BUSCADOR DISCOVERY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-[#09090d] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-4 text-center">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  Búsqueda Predictiva Hiperlocal
                </span>
                <h3 className="text-xl font-serif font-black text-white uppercase mt-0.5">
                  Discovery Search S-Class
                </h3>
              </div>

              <DiscoverySearch />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. OVERLAY PROYECTO VIMUME (BUQUE INSIGNIA) */}
      <AnimatePresence>
        {isVimumeOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#081226] border border-sky-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.3)] relative text-center"
            >
              <button
                onClick={() => setIsVimumeOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mx-auto mb-4 text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                <HeartPulse className="w-7 h-7 text-amber-300" />
              </div>

              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                BUQUE INSIGNIA · IMPACTO SOCIAL
              </span>

              <h3 className="text-2xl font-serif font-black text-white uppercase mt-1">
                PROYECTO VIMUME
              </h3>

              <p className="text-xs sm:text-sm text-sky-200/90 font-mono mt-3 leading-relaxed max-w-lg mx-auto">
                Metodología neurocognitiva y estimulación acústica sincronizada a <strong className="text-white">40Hz Gamma</strong> para personas mayores y centros residenciales. Gala Anual "Nuestros Héroes".
              </p>

              <div className="grid grid-cols-2 gap-3 my-6 text-left">
                <div className="p-3 rounded-xl bg-black/40 border border-sky-500/20">
                  <span className="text-[9px] font-mono text-sky-400 uppercase">Frecuencia Sonora</span>
                  <p className="text-xs font-mono font-bold text-white mt-0.5">40Hz Gamma Sincronizada</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-sky-500/20">
                  <span className="text-[9px] font-mono text-sky-400 uppercase">Alineación Estratégica</span>
                  <p className="text-xs font-mono font-bold text-white mt-0.5">ODS 2030 Salud y Bienestar</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/vimume"
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Conocer Metodología Completa
                </Link>
                <button
                  onClick={() => setIsVimumeOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
