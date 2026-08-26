'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Zap, Building2, ShieldCheck, ArrowRight, 
  Sparkles, Award, ChevronRight, Music, Users, 
  Layers, Sliders, Volume2, Star, CheckCircle2,
  Phone, MessageCircle, Play, Pause, Radio, Bell, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';

export interface EditorialConfig {
  themeStyle: 'dark-luxury' | 'champagne-gold' | 'minimal-noir';
  parallaxEnabled: boolean;
  activeDefaultProfile: 'unio' | 'arsenal' | 'signal' | 'vimume';
  ctaAction: 'slide-lock' | 'cotizador' | 'whatsapp';
}

interface CuratedCardItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  image: string;
  audioPreview?: string;
  specs: string[];
}

const PROFILE_CATEGORIES = [
  {
    id: 'unio',
    name: 'UNIO Nupcial',
    pill: 'Bodas & Galas',
    icon: Heart,
    color: '#ecb613',
    coverTitle: 'CURATED WEDDING LUXURY',
    coverSubtitle: 'Descubre la selección más refinada de música en vivo y acústica de alta fidelidad, calibrada para elevar el día más memorable de tu vida.',
    items: [
      {
        id: 'solista-piano',
        title: 'Edwin Agudelo (Solista)',
        subtitle: 'Tenor Lírico & Piano Imperial',
        price: '350 €',
        tag: 'PACIENTE CERO',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
        specs: ['Voz Lírica de Alta Escuela', 'Sonido Bose 2000W Homologado', 'Repertorio Personalizado']
      },
      {
        id: 'cuarteto-imperial',
        title: 'Cuarteto de Gala Charro',
        subtitle: 'Voz, 2 Trompetas, Vihuela y Guitarrón',
        price: '950 €',
        tag: 'MÁS POPULAR',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
        specs: ['4 Músicos de Conservatorio', 'Trajes de Charro de Gran Gala', 'Entrada Triunfal']
      },
      {
        id: 'gran-gala-mariachi',
        title: 'Ensamble Monumental (6+)',
        subtitle: 'Orquesta Nupcial Completa',
        price: '1.450 €',
        tag: 'ALTA DISTINCIÓN',
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop',
        specs: ['6 a 16 Músicos en Escena', 'Show Ecuestre Compatible', 'Sonorización 12 W/pax']
      }
    ]
  },
  {
    id: 'arsenal',
    name: 'Arsenal B2B',
    pill: 'Infraestructura',
    icon: Building2,
    color: '#3b82f6',
    coverTitle: 'HIGH-END B2B INFRASTRUCTURE',
    coverSubtitle: 'Ingeniería audiovisual y pantallas LED de ultra-definición con redundancia N+1 y garantía estricta de Cero Fallos para eventos corporativos.',
    items: [
      {
        id: 'pantalla-led-p29',
        title: 'Pantallas LED P2.9 HDR',
        subtitle: 'Controladores Novastar UHD 4K',
        price: 'Desde 1.200 €',
        tag: 'HARDWARE S-CLASS',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
        specs: ['Tasa de refresco >3840Hz', 'Montaje con Técnico In-Situ', 'Seguro RC 1.000.000 €']
      },
      {
        id: 'line-array-db',
        title: 'Rider Acústico dB Technologies',
        subtitle: 'Presión Sonora 12 W/pax Homologada',
        price: 'Desde 850 €',
        tag: 'CALIBRACIÓN PRO',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
        specs: ['12 W por Asistente', 'Microfonía Shure Axient Digital', 'Certificación de Ruido']
      }
    ]
  },
  {
    id: 'signal',
    name: 'The Signal',
    pill: 'Red Soberana',
    icon: Music,
    color: '#ec4899',
    coverTitle: 'SOVEREIGN ARTIST ECOSYSTEM',
    coverSubtitle: 'El primer ecosistema de contratación artística con Split Soberano inmutable (80% Artista / 10% EAR OS / 10% Fondo Social VIMUME).',
    items: [
      {
        id: 'edwin-soberano',
        title: 'Edwin Agudelo & Banda',
        subtitle: '37+ Giras y Conciertos Internacionales',
        price: 'Tarifa Directa',
        tag: 'MASTER ARTIST',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
        specs: ['Split 80% Artista Garantizado', 'Liquidación en 24 Horas', 'Firma Contrato eIDAS']
      },
      {
        id: 'sax-deep-house',
        title: 'Saxofón Live & DJ Set',
        subtitle: 'Fusión Deep House & Jazz Gala',
        price: '550 €',
        tag: 'COCKTAIL TREND',
        image: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=800&auto=format&fit=crop',
        specs: ['Inalámbrico en Toda la Finca', 'Improvisación con DJ', 'Iluminación Beam S-Class']
      }
    ]
  },
  {
    id: 'vimume',
    name: 'VIMUME',
    pill: 'Impacto Social',
    icon: Zap,
    color: '#10b981',
    coverTitle: 'NEURO-ESTIMULACIÓN 40Hz',
    coverSubtitle: 'Protocolos acústicos controlados (<75 dB) para residencias de mayores y centros de día. Estimulación sensorial con retorno biográfico directo.',
    items: [
      {
        id: 'sesion-vimume-40hz',
        title: 'Concierto Biográfico VIMUME',
        subtitle: 'Frecuencias Gammas 40Hz & Memoria',
        price: 'Subvencionado / B2G',
        tag: 'MÉTODO PATENTADO',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
        specs: ['Límite <75 dB Homologado', 'Repertorio de Época Emocional', 'Financiado 10% Split EAR OS']
      }
    ]
  }
];

export default function EditorialCuratedHeroSClass() {
  const [activeProfileId, setActiveProfileId] = useState<'unio' | 'arsenal' | 'signal' | 'vimume'>('unio');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [step, setStep] = useState<'cover' | 'bento'>('cover');

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

  return (
    <div className="relative w-full min-h-[92vh] bg-[#050505] text-white flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: activeCategory.color }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Main Luxury Frame (Editorial Dual Mockup) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: EDITORIAL MAGAZINE COVER (MOMENTUM WOW)          */}
        {/* ============================================================ */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative rounded-[3rem] p-8 sm:p-12 bg-gradient-to-b from-[#141418]/90 via-[#0c0c10]/95 to-[#060608] border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden group min-h-[580px] flex flex-col justify-between"
        >
          {/* Subtle Corner Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-widest font-mono">
                S-CLASS EDITORIAL
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-mono border border-white/10">
                PRODUCCIÓN SOBERANA
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
              <Sparkles size={14} className="text-[#ecb613]" />
            </div>
          </div>

          {/* Editorial Big Typography */}
          <div className="space-y-4 my-8">
            <motion.h1 
              key={activeCategory.coverTitle}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white font-syne"
            >
              {activeCategory.coverTitle.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 italic">
                {activeCategory.coverTitle.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>

            <motion.p 
              key={activeCategory.coverSubtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-sm sm:text-base leading-relaxed font-light max-w-md"
            >
              {activeCategory.coverSubtitle}
            </motion.p>
          </div>

          {/* Action Row */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/mobile-fusion"
                className="py-4 px-8 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:bg-[#ecb613] hover:text-black transition-all active:scale-95 group/btn"
              >
                <span>Descubrir Catálogo</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/checkout/presupuesto"
                className="py-4 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck size={16} className="text-[#ecb613]" />
                <span>Price-Lock 72h</span>
              </Link>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/10">
              <span>● Garantía 12 W/pax Homologada</span>
              <span>Split 80/10/10 Inmutable</span>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: BENTO INTERACTIVE SUITE (4 SOVEREIGN PROFILES)  */}
        {/* ============================================================ */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative rounded-[3rem] p-6 sm:p-8 bg-[#0a0a0f] border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[580px]"
        >
          {/* Top User / Brand Chip & Dynamic Island Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] font-bold text-sm font-syne">
                  EA
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-wide flex items-center gap-1.5">
                    Edwin Agudelo <CheckCircle2 size={12} className="text-[#ecb613]" />
                  </h3>
                  <span className="text-[10px] text-white/40 font-mono">Dirección de Producción · España</span>
                </div>
              </div>

              <Link
                href="/admin/mobile-studio"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 transition-all"
                title="Configurador Admin Studio"
              >
                <Sliders size={14} />
              </Link>
            </div>

            {/* Category Selector Pills (4 Sovereign Profiles) */}
            <div className="grid grid-cols-4 gap-2">
              {PROFILE_CATEGORIES.map(cat => {
                const isSelected = cat.id === activeProfileId;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveProfileId(cat.id as any)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isSelected 
                        ? 'bg-white text-black font-black border-white shadow-xl scale-[1.03]' 
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComp size={18} className={isSelected ? 'text-black' : 'text-white/70'} />
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold truncate max-w-full">
                      {cat.pill}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Bento Grid Cards */}
          <div className="space-y-3 my-4 flex-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Selección Curada // {activeCategory.name}
              </span>
              <span className="text-[10px] text-[#ecb613] font-mono font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Cero Fallos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCategory.items.map(item => {
                const isLiked = likedItems[item.id];
                const isAudioPlaying = isPlayingAudio === item.id;

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0d0d12] border border-white/10 p-3.5 hover:border-white/25 transition-all shadow-lg flex flex-col justify-between"
                  >
                    {/* Top Tag & Like Button */}
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#ecb613] text-[9px] font-mono font-black uppercase">
                        {item.tag}
                      </span>
                      <button
                        onClick={(e) => toggleLike(item.id, e)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isLiked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-white/5 text-white/40 hover:text-white'
                        }`}
                      >
                        <Heart size={13} className={isLiked ? 'fill-rose-400' : ''} />
                      </button>
                    </div>

                    {/* Image / Thumbnail Preview */}
                    <div className="relative h-24 rounded-xl overflow-hidden mb-2.5 bg-black/40">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      {/* Audio Play Button Overlay */}
                      <button
                        onClick={(e) => toggleAudio(item.id, e)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[9px] font-mono flex items-center gap-1.5 hover:bg-[#ecb613] hover:text-black transition-all"
                      >
                        {isAudioPlaying ? <Pause size={10} /> : <Play size={10} />}
                        <span>{isAudioPlaying ? '0:45' : 'Audio'}</span>
                      </button>
                    </div>

                    {/* Item Details */}
                    <div>
                      <h4 className="text-xs font-black uppercase text-white truncate font-syne">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-white/50 truncate font-light mb-2">
                        {item.subtitle}
                      </p>

                      {/* Specs */}
                      <div className="space-y-0.5 mb-2.5">
                        {item.specs.slice(0, 2).map((spec, i) => (
                          <div key={i} className="text-[9px] text-white/60 flex items-center gap-1">
                            <span className="text-[#ecb613]">✓</span>
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-sm font-black text-[#ecb613] font-mono">
                          {item.price}
                        </span>
                        <Link
                          href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20reservar%20${encodeURIComponent(item.title)}.`}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#ecb613] hover:text-black text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                        >
                          <span>Bloquear</span>
                          <ArrowUpRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Fast Action Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-white/60">Disponibilidad 2026 Abierta</span>
            </div>

            <Link
              href="/mobile-fusion"
              className="text-xs font-mono font-bold text-[#ecb613] hover:underline flex items-center gap-1"
            >
              <span>Ver los 10 Arquetipos</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
