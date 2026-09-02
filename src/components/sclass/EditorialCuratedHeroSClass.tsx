'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Zap, Building2, ShieldCheck, ArrowRight, 
  Sparkles, Award, ChevronRight, Music, Users, 
  Layers, Sliders, Volume2, Star, CheckCircle2,
  Phone, MessageCircle, Play, Pause, Radio, Bell, ArrowUpRight,
  Compass, LayoutGrid
} from 'lucide-react';
import Link from 'next/link';

export interface EditorialConfig {
  themeStyle: 'dark-luxury' | 'champagne-gold' | 'minimal-noir';
  parallaxEnabled: boolean;
  activeDefaultProfile: 'unio' | 'arsenal' | 'signal' | 'vimume';
  ctaAction: 'slide-lock' | 'cotizador' | 'whatsapp';
}

interface EditorialHeroProps {
  isSimulator?: boolean;
}

const PROFILE_CATEGORIES = [
  {
    id: 'unio',
    name: 'UNIO Nupcial',
    pill: 'Bodas',
    icon: Heart,
    color: '#ecb613',
    coverTitle: 'CURATED WEDDING LUXURY',
    coverSubtitle: 'Música en vivo de conservatorio y sonido de alta fidelidad para ceremonias y cócteles inolvidables con Price-Lock 72h.',
    items: [
      {
        id: 'solista-piano',
        title: 'Edwin Agudelo (Solista)',
        subtitle: 'Tenor Lírico & Piano Imperial',
        price: '350 €',
        tag: 'PACIENTE CERO',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
        specs: ['Voz Lírica de Alta Escuela', 'Sonido Bose 2000W Homologado']
      },
      {
        id: 'cuarteto-imperial',
        title: 'Cuarteto de Gala Charro',
        subtitle: 'Voz, 2 Trompetas, Vihuela y Guitarrón',
        price: '950 €',
        tag: 'MÁS POPULAR',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
        specs: ['4 Músicos de Conservatorio', 'Trajes de Gran Gala']
      },
      {
        id: 'gran-gala-mariachi',
        title: 'Ensamble Monumental (6+)',
        subtitle: 'Orquesta Nupcial Completa',
        price: '1.450 €',
        tag: 'ALTA DISTINCIÓN',
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop',
        specs: ['6 a 16 Músicos en Escena', 'Sonorización 12 W/pax']
      }
    ]
  },
  {
    id: 'arsenal',
    name: 'Arsenal B2B',
    pill: 'Arsenal',
    icon: Building2,
    color: '#3b82f6',
    coverTitle: 'HIGH-END B2B HARDWARE',
    coverSubtitle: 'Infraestructura técnica, pantallas LED P2.9 HDR Novastar UHD y sonido con garantía Cero Fallos para empresas.',
    items: [
      {
        id: 'pantalla-led-p29',
        title: 'Pantallas LED P2.9 HDR',
        subtitle: 'Controladores Novastar UHD 4K',
        price: 'Desde 1.200 €',
        tag: 'HARDWARE S-CLASS',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop',
        specs: ['Tasa de refresco >3840Hz', 'Seguro RC 1.000.000 €']
      },
      {
        id: 'line-array-db',
        title: 'Rider Acústico Bose / dB',
        subtitle: 'Presión Sonora 12 W/pax',
        price: 'Desde 850 €',
        tag: 'CALIBRACIÓN PRO',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
        specs: ['12 W por Asistente', 'Microfonía Shure Axient']
      }
    ]
  },
  {
    id: 'signal',
    name: 'The Signal',
    pill: 'Artistas',
    icon: Music,
    color: '#ec4899',
    coverTitle: 'SOVEREIGN ARTIST ECOSYSTEM',
    coverSubtitle: 'Contratación artística directa con Split Soberano inmutable (80% Artista / 10% EAR OS / 10% Fondo Social VIMUME).',
    items: [
      {
        id: 'edwin-soberano',
        title: 'Edwin Agudelo & Banda',
        subtitle: '37+ Giras Internacionales',
        price: 'Tarifa Directa',
        tag: 'MASTER ARTIST',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
        specs: ['Split 80% Artista', 'Firma Contrato eIDAS']
      },
      {
        id: 'sax-deep-house',
        title: 'Saxofón Live & DJ Set',
        subtitle: 'Fusión Deep House & Gala',
        price: '550 €',
        tag: 'COCKTAIL TREND',
        image: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=600&auto=format&fit=crop',
        specs: ['Inalámbrico en Toda la Finca', 'Iluminación Beam S-Class']
      }
    ]
  },
  {
    id: 'vimume',
    name: 'VIMUME',
    pill: '40Hz',
    icon: Zap,
    color: '#10b981',
    coverTitle: 'NEURO-ESTIMULACIÓN 40Hz',
    coverSubtitle: 'Protocolos acústicos controlados (<75 dB) para residencias de mayores. Estimulación sensorial con retorno biográfico.',
    items: [
      {
        id: 'sesion-vimume-40hz',
        title: 'Concierto VIMUME 40Hz',
        subtitle: 'Frecuencias Gammas & Memoria',
        price: 'B2G / Subvención',
        tag: 'MÉTODO PATENTADO',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
        specs: ['Límite <75 dB Homologado', 'Financiado 10% Split EAR']
      }
    ]
  }
];

export default function EditorialCuratedHeroSClass({ isSimulator = false }: EditorialHeroProps) {
  const [activeProfileId, setActiveProfileId] = useState<'unio' | 'arsenal' | 'signal' | 'vimume'>('unio');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  
  // Mobile View Switcher
  const [mobileViewTab, setMobileViewTab] = useState<'editorial' | 'bento'>('editorial');

  // Load configuration from localStorage if defined in Admin Studio
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('ear_editorial_hero_config');
      if (savedConfig) {
        const parsed: EditorialConfig = JSON.parse(savedConfig);
        if (parsed.activeDefaultProfile) {
          setActiveProfileId(parsed.activeDefaultProfile);
        }
      }
    } catch (e) {}
  }, []);

  const activeCategory = PROFILE_CATEGORIES.find(c => c.id === activeProfileId) || PROFILE_CATEGORIES[0];

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAudio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(prev => prev === id ? null : id);
  };

  // =========================================================================
  // 1. PURE MOBILE VIEW (FOR SIMULATOR & SCREENS < 1024PX)
  // =========================================================================
  if (isSimulator) {
    return (
      <div className="w-full h-full min-h-full bg-[#050505] text-white flex flex-col justify-between p-3.5 overflow-x-hidden overflow-y-auto no-scrollbar relative select-none">
        
        {/* Dynamic Glow */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[90px] opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: activeCategory.color }}
        />

        {/* Top Mini Switcher Pill */}
        <div className="w-full mb-3 relative z-20">
          <div className="grid grid-cols-2 bg-[#121218] p-1 rounded-2xl border border-white/15 shadow-lg">
            <button
              onClick={() => setMobileViewTab('editorial')}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                mobileViewTab === 'editorial' 
                  ? 'bg-[#ecb613] text-black shadow-md' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Compass size={12} />
              <span>1. Portada Editorial</span>
            </button>

            <button
              onClick={() => setMobileViewTab('bento')}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                mobileViewTab === 'bento' 
                  ? 'bg-[#ecb613] text-black shadow-md' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutGrid size={12} />
              <span>2. Catálogo Bento</span>
            </button>
          </div>
        </div>

        {/* 📱 TAB 1: EDITORIAL COVER */}
        {mobileViewTab === 'editorial' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between rounded-3xl p-5 bg-gradient-to-b from-[#14141a] via-[#0d0d12] to-[#060608] border border-white/15 shadow-2xl relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono tracking-widest">
                S-CLASS EDITORIAL
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                2026 GALA
              </span>
            </div>

            {/* Editorial Title */}
            <div className="my-6 space-y-3">
              <h2 className="text-2xl font-black uppercase tracking-tight leading-none text-white font-syne">
                {activeCategory.coverTitle.split(' ')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 italic">
                  {activeCategory.coverTitle.split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <p className="text-white/60 text-xs leading-relaxed font-light">
                {activeCategory.coverSubtitle}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => setMobileViewTab('bento')}
                className="w-full py-3.5 px-4 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:bg-[#ecb613] transition-all active:scale-95"
              >
                <span>Explorar los 4 Perfiles</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-between text-[9px] font-mono text-white/40 pt-1">
                <span>● 12 W/pax Homologados</span>
                <span>Split 80/10/10</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* 📱 TAB 2: BENTO CURATED CATALOG */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between rounded-3xl p-3.5 bg-[#0a0a0f] border border-white/15 shadow-2xl relative overflow-hidden"
          >
            {/* Top Brand Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] font-bold text-[10px] font-syne">
                    EA
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-white tracking-wide flex items-center gap-1">
                      Edwin Agudelo <CheckCircle2 size={10} className="text-[#ecb613]" />
                    </h4>
                    <span className="text-[8px] text-white/40 font-mono">Dirección de Producción</span>
                  </div>
                </div>

                <span className="text-[9px] text-[#ecb613] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck size={11} /> Cero Fallos
                </span>
              </div>

              {/* 4 Profile Category Pills */}
              <div className="grid grid-cols-4 gap-1">
                {PROFILE_CATEGORIES.map(cat => {
                  const isSelected = cat.id === activeProfileId;
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveProfileId(cat.id as any)}
                      className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                        isSelected 
                          ? 'bg-white text-black font-black border-white shadow-md scale-[1.02]' 
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <IconComp size={13} className={isSelected ? 'text-black' : 'text-white/70'} />
                      <span className="text-[8px] uppercase tracking-wider font-mono font-bold truncate max-w-full">
                        {cat.pill}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bento Card List (No Horizontal Overflow) */}
            <div className="space-y-2 my-2 flex-1 overflow-y-auto no-scrollbar max-h-[360px]">
              {activeCategory.items.map(item => {
                const isLiked = likedItems[item.id];
                const isAudioPlaying = isPlayingAudio === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0d0d12] border border-white/10 p-2.5 shadow-md flex items-center gap-2.5"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => toggleAudio(item.id, e)}
                        className="absolute bottom-1 right-1 p-1 rounded-full bg-black/80 text-white text-[8px]"
                      >
                        {isAudioPlaying ? <Pause size={8} /> : <Play size={8} />}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-[#ecb613] uppercase font-bold truncate">
                          {item.tag}
                        </span>
                        <button
                          onClick={(e) => toggleLike(item.id, e)}
                          className={`p-1 rounded-full ${isLiked ? 'text-rose-400' : 'text-white/30'}`}
                        >
                          <Heart size={10} className={isLiked ? 'fill-rose-400' : ''} />
                        </button>
                      </div>

                      <h5 className="text-[10px] font-black uppercase text-white truncate font-syne">
                        {item.title}
                      </h5>
                      <p className="text-[8px] text-white/50 truncate mb-1">
                        {item.subtitle}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-[#ecb613] font-mono">
                          {item.price}
                        </span>
                        <Link
                          href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20reservar%20${encodeURIComponent(item.title)}.`}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#ecb613] hover:text-black text-white text-[8px] font-mono font-bold flex items-center gap-0.5"
                        >
                          <span>Bloquear</span>
                          <ArrowUpRight size={8} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px]">
              <span className="text-white/50 font-mono">● Temporada 2026</span>
              <button
                onClick={() => setMobileViewTab('editorial')}
                className="text-[#ecb613] font-mono font-bold hover:underline"
              >
                ← Ver Portada
              </button>
            </div>
          </motion.div>
        )}

      </div>
    );
  }

  // =========================================================================
  // 2. FULL RESPONSIVE VIEW (FOR HOMEPAGE & LARGE SCREENS)
  // =========================================================================
  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-[#050505] text-white flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
      
      {/* Dynamic Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] lg:w-[900px] h-[350px] rounded-full blur-[100px] sm:blur-[140px] opacity-25 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: activeCategory.color }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

      {/* 📱 MOBILE NAVIGATION PILL (VISIBLE ON SMALL SCREENS ONLY) */}
      <div className="lg:hidden w-full max-w-[340px] mb-3 relative z-20">
        <div className="grid grid-cols-2 bg-[#121218] p-1 rounded-2xl border border-white/15 shadow-xl">
          <button
            onClick={() => setMobileViewTab('editorial')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileViewTab === 'editorial' 
                ? 'bg-[#ecb613] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Compass size={14} />
            <span>Portada Editorial</span>
          </button>

          <button
            onClick={() => setMobileViewTab('bento')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileViewTab === 'bento' 
                ? 'bg-[#ecb613] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <LayoutGrid size={14} />
            <span>Catálogo Bento</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Frame */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 items-stretch">
        
        {/* LEFT COLUMN: EDITORIAL MAGAZINE COVER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full lg:col-span-6 relative rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-10 bg-gradient-to-b from-[#141418]/95 via-[#0c0c10]/98 to-[#060608] border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[520px] ${
            mobileViewTab === 'editorial' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest font-mono">
                S-CLASS EDITORIAL
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[9px] font-mono border border-white/10">
                PRODUCCIÓN SOBERANA
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ecb613]">
              <Sparkles size={13} />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 my-4 sm:my-6">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] text-white font-syne break-words">
              {activeCategory.coverTitle.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 italic">
                {activeCategory.coverTitle.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              {activeCategory.coverSubtitle}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setMobileViewTab('bento')}
                className="py-3 px-5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:bg-[#ecb613] transition-all active:scale-95 group/btn lg:hidden"
              >
                <span>Ver Catálogo Bento</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/mobile-fusion"
                className="py-3 px-6 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hidden lg:flex items-center justify-center gap-2 shadow-2xl hover:bg-[#ecb613] transition-all active:scale-95 group/btn"
              >
                <span>Descubrir Catálogo</span>
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/checkout/presupuesto"
                className="py-3 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck size={14} className="text-[#ecb613]" />
                <span>Price-Lock 72h</span>
              </Link>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-2 border-t border-white/10">
              <span>● 12 W/pax Homologados</span>
              <span>Split 80/10/10</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: BENTO INTERACTIVE SUITE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full lg:col-span-6 relative rounded-3xl sm:rounded-[2.5rem] p-3.5 sm:p-6 lg:p-8 bg-[#0a0a0f] border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[520px] ${
            mobileViewTab === 'bento' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] font-bold text-xs font-syne">
                  EA
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-xs font-black uppercase text-white tracking-wide flex items-center gap-1">
                    Edwin Agudelo <CheckCircle2 size={11} className="text-[#ecb613]" />
                  </h3>
                  <span className="text-[9px] text-white/40 font-mono">Dirección de Producción</span>
                </div>
              </div>

              <Link
                href="/admin/mobile-studio"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 transition-all"
                title="Configurador Admin Studio"
              >
                <Sliders size={13} />
              </Link>
            </div>

            {/* Category Selector Pills */}
            <div className="grid grid-cols-4 gap-1.5">
              {PROFILE_CATEGORIES.map(cat => {
                const isSelected = cat.id === activeProfileId;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveProfileId(cat.id as any)}
                    className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected 
                        ? 'bg-white text-black font-black border-white shadow-lg scale-[1.02]' 
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComp size={15} className={isSelected ? 'text-black' : 'text-white/70'} />
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-mono font-bold truncate max-w-full">
                      {cat.pill}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Bento Grid */}
          <div className="space-y-2.5 my-3 flex-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 truncate max-w-[180px]">
                {activeCategory.name}
              </span>
              <span className="text-[9px] text-[#ecb613] font-mono font-bold flex items-center gap-1 shrink-0">
                <ShieldCheck size={11} /> Cero Fallos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeCategory.items.slice(0, 2).map(item => {
                const isLiked = likedItems[item.id];
                const isAudioPlaying = isPlayingAudio === item.id;

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0d0d12] border border-white/10 p-3 hover:border-white/25 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#ecb613] text-[8px] font-mono font-black uppercase truncate max-w-[120px]">
                        {item.tag}
                      </span>
                      <button
                        onClick={(e) => toggleLike(item.id, e)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          isLiked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-white/5 text-white/40 hover:text-white'
                        }`}
                      >
                        <Heart size={11} className={isLiked ? 'fill-rose-400' : ''} />
                      </button>
                    </div>

                    <div className="relative h-20 rounded-xl overflow-hidden mb-2 bg-black/40">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                      />
                      <button
                        onClick={(e) => toggleAudio(item.id, e)}
                        className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[8px] font-mono flex items-center gap-1 hover:bg-[#ecb613] hover:text-black transition-all"
                      >
                        {isAudioPlaying ? <Pause size={9} /> : <Play size={9} />}
                        <span>{isAudioPlaying ? '0:45' : 'Audio'}</span>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black uppercase text-white truncate font-syne">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-white/50 truncate font-light mb-1.5">
                        {item.subtitle}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                        <span className="text-xs font-black text-[#ecb613] font-mono">
                          {item.price}
                        </span>
                        <Link
                          href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20reservar%20${encodeURIComponent(item.title)}.`}
                          className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-[#ecb613] hover:text-black text-white text-[9px] font-mono font-bold flex items-center gap-1 transition-all"
                        >
                          <span>Bloquear</span>
                          <ArrowUpRight size={9} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-white/60">Disponibilidad 2026</span>
            </div>

            <Link
              href="/mobile-fusion"
              className="text-[10px] font-mono font-bold text-[#ecb613] hover:underline flex items-center gap-1"
            >
              <span>10 Arquetipos</span>
              <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
