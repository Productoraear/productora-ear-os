'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Flame, Music, ShieldCheck, Heart, 
  MapPin, Clock, Star, Sliders, Lock, CheckCircle2,
  ArrowRight, MessageCircle, ChevronRight, ChevronLeft, Share2,
  Tv, Award, Zap, Compass, Building2, Users, FileText,
  Calendar, Eye, Check, ArrowUpRight, Radio, Landmark
} from 'lucide-react';
import Link from 'next/link';
import { InstantNeuralTunnelModal, TunnelProfile } from './InstantNeuralTunnelModal';
import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';

export const SOVEREIGN_PROFILES = [
  {
    id: 'particulares',
    profileKey: 'solista' as TunnelProfile,
    name: 'Particulares & Bodas',
    tag: 'UNIO // B2C ÉLITE',
    badge: 'MÁS SOLICITADO',
    desc: 'Música de gala, serenatas de autor y catering de brasas para bodas exclusivas, cumpleaños y aniversarios.',
    href: '/bodas',
    directLinks: [
      { label: 'Bodas de Gala', href: '/bodas' },
      { label: 'Cumpleaños VIP', href: '/artistas/cumpleanos' },
      { label: 'Serenatas', href: '/artistas/edwin-agudelo' }
    ],
    accentColor: '#ecb613',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'diplomaticos',
    profileKey: 'b2b' as TunnelProfile,
    name: 'Diplomáticos & B2G',
    tag: 'INSTITUCIONAL // LCSP',
    badge: 'ART. 118 LCSP',
    desc: 'Producciones culturales para Ayuntamientos, Embajadas, Fiestas Patronales y recepciones de Estado.',
    href: '/ocasiones/ayuntamientos',
    directLinks: [
      { label: 'Licitaciones Ayuntamientos', href: '/ocasiones/ayuntamientos' },
      { label: 'Soberanía Técnica', href: '/soberania-tecnica' },
      { label: 'Memoria LCSP <15k€', href: '/vimume' }
    ],
    accentColor: '#3b82f6',
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'corporativo',
    profileKey: 'b2b' as TunnelProfile,
    name: 'Corporativo & Fincas',
    tag: 'PLANNERS // B2B PARTNERS',
    badge: 'SPLIT 10% PARTNER',
    desc: 'Soluciones 360° para Fincas, Wedding Planners y Congresos: Pantallas LED P2.9, Sonido Bose y Comisiones Semanales.',
    href: '/proveedores',
    directLinks: [
      { label: 'Fincas & Espacios', href: '/proveedores?cat=finca' },
      { label: 'Arsenal Pantallas LED', href: '/arsenal' },
      { label: 'Programa Alianzas B2B', href: '/empresarios' }
    ],
    accentColor: '#10b981',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vimume',
    profileKey: 'vimume' as TunnelProfile,
    name: 'VIMUME Neuroacústica',
    tag: 'SILVER ECONOMY // SALUD',
    badge: 'IMPACTO SOCIAL',
    desc: 'Protocolo clínico de estimulación cognitiva 40Hz a <75 dB para residencias de mayores y centros de día.',
    href: '/vimume',
    directLinks: [
      { label: 'Protocolo Clínico 40Hz', href: '/vimume' },
      { label: 'Centros de Día', href: '/vimume/conocimiento' },
      { label: 'Subvenciones IRPF', href: '/vimume' }
    ],
    accentColor: '#ec4899',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'
  }
];

export const ECOSYSTEM_ITEMS = [
  {
    id: 'bbq-iberico',
    category: 'bbq',
    title: 'Catering de Brasas: Ritual Ibérico',
    subtitle: 'Fuego Vivo & Showcooking de Alta Selección',
    price: 45,
    unit: 'Por Comensal',
    badge: 'BRASAS & LIVE FIRE',
    rating: 5.0,
    reviews: 48,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    description: 'Secreto, pluma, presa y panceta ibérica curada sobre brasas de carbón vegetal y leña de encina con tiempos de humo milimétricos.',
    specs: ['Registro Sanitario RGEAA', 'Sonorización Bose F1 de cortesía', 'Parrilleros titulados']
  },
  {
    id: 'bbq-argentino',
    category: 'bbq',
    title: 'Asado Argentino Tradicional & Espadas',
    subtitle: 'Cortes Nobles a la Brasa & Mollejas Crocantes',
    price: 55,
    unit: 'Por Comensal',
    badge: 'ALTA CONVIVENCIA',
    rating: 4.98,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    description: 'Asado de tira, entraña, vacío y choripanes artesanales con chimichurri casero macerado 48h y espadas criollas.',
    specs: ['Asadores de campeonato', 'Servicio ágil por tiempos', 'Guarniciones al rescoldo']
  },
  {
    id: 'bbq-ancestral',
    category: 'bbq',
    title: 'Asado Ancestral al Fuego & a la Cruz',
    subtitle: 'Cocción Lenta de 8 Horas en Domo de Leña',
    price: 65,
    unit: 'Por Comensal',
    badge: 'MONUMENTO VISUAL',
    rating: 5.0,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80',
    description: 'Cordero lechal y costillares enteros en cruces de hierro forjado al aire libre. Espectáculo visual para grandes fincas y bodas.',
    specs: ['Estructura monumental exterior', '8 horas de fuego lento', 'Hortalizas en ceniza']
  },
  {
    id: 'bbq-low-slow',
    category: 'bbq',
    title: 'Ahumados Americanos: Low & Slow',
    subtitle: 'Brisket Black Angus Ahumado 14h con Roble',
    price: 50,
    unit: 'Por Comensal',
    badge: 'SMOKER OFFSET',
    rating: 4.96,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80',
    description: 'Ternura suprema: Brisket Angus y Pulled Pork jugoso preparados en ahumadores offset con salsa barbacoa de bourbon.',
    specs: ['Ahumadores profesionales', 'Madera de roble natural', 'Mac & cheese ahumado']
  },
  {
    id: 'bbq-huerto',
    category: 'bbq',
    title: 'Huerto al Carbón & Vegetariano Puro',
    subtitle: 'Calçots, Alcachofas y Frutas Caramelizadas',
    price: 40,
    unit: 'Por Comensal',
    badge: '100% HUERTO',
    rating: 4.95,
    reviews: 22,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80',
    description: 'Hortalizas de temporada a la parrilla, berenjenas con miso y piña asada con canela y ron.',
    specs: ['Parrilla vegetal separada', 'Aceites infusionados', 'Romesco artesano']
  },
  {
    id: 'music-solista',
    category: 'music',
    title: 'Solista Imperial & Tenor Lírico',
    subtitle: 'Edwin Agudelo · Paciente Cero S-Class',
    price: 350,
    unit: 'Actuación Completa',
    badge: 'PACIENTE CERO',
    rating: 4.99,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    description: 'Voz lírica de gran gala, traje charro con botonadura de plata y sonido Hi-Fi Bose F1 homologado.',
    specs: ['Presión 12 W/pax', 'Seguro RC 1.000.000 €', 'Garantía Cero Fallos']
  },
  {
    id: 'music-cuarteto',
    category: 'music',
    title: 'Cuarteto Imperial de Conservatorio',
    subtitle: '4 Solistas: Voces, Violines y Guitarrón',
    price: 950,
    unit: 'Actuación Completa',
    badge: 'MÁXIMA DISTINCIÓN',
    rating: 4.98,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    description: 'Ensamble de cámara y mariachi refinado con arreglos sinfónicos exclusivos para ceremonias y cócteles.',
    specs: ['Microfonía Shure Beta', '4000W RMS Bose', 'Split 80/10/10']
  },
  {
    id: 'music-gala-monumental',
    category: 'music',
    title: 'Gran Gala Monumental Mariachi XXI',
    subtitle: '8 a 12 Músicos para Festivales y Ayuntamientos',
    price: 1450,
    unit: 'Gala Completa',
    badge: 'GRAN FORMATO',
    rating: 5.0,
    reviews: 44,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    description: 'La formación más imponente: trompetas de gala, sección completa de cuerdas y potencia escénica monumental.',
    specs: ['Line Array d&b 8000W', 'Iluminación robotizada', 'Rider homologado']
  },
  {
    id: 'arsenal-led',
    category: 'arsenal',
    title: 'Pantallas LED P2.9 Novastar HDR',
    subtitle: 'Módulos de Alto Brillo para Interior / Exterior',
    price: 1200,
    unit: 'Montaje 3x2m con Técnico',
    badge: 'HARDWARE S-CLASS',
    rating: 4.97,
    reviews: 35,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80',
    description: 'Brillo ultra potente 4500 nits, procesado Novastar VX1000 4K y estructura truss certificada.',
    specs: ['Montaje en <3 horas', 'Técnico operador in situ', 'Seguro de instalación']
  }
];

export function SovereignMasterEcosystemExperience() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'bbq' | 'music' | 'arsenal'>('all');
  const [selectedItem, setSelectedItem] = useState(ECOSYSTEM_ITEMS[0]);
  const [pax, setPax] = useState(80);
  const [distanceKm, setDistanceKm] = useState(25);
  const [locked, setLocked] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { openTunnel, isOpen } = useNeuralTunnelStore();

  const filteredItems = activeCategory === 'all' 
    ? ECOSYSTEM_ITEMS 
    : ECOSYSTEM_ITEMS.filter(i => i.category === activeCategory);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isPerPax = selectedItem.unit.includes('Comensal');
  const totalQuote = isPerPax 
    ? Math.round(selectedItem.price * pax + (distanceKm > 30 ? (distanceKm - 30) * 0.95 : 0))
    : Math.round(selectedItem.price + (distanceKm > 30 ? (distanceKm - 30) * 0.95 : 0));

  const acousticWatts = pax * 12;

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-[#ecb613] selection:text-black font-sans pb-24 relative overflow-hidden">
      {/* Dynamic Ambient Luminescence */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#ecb613]/10 via-[#258DCD]/5 to-transparent blur-[160px] pointer-events-none rounded-full" />

      {/* 1. HERO SECTION S-CLASS */}
      <section className="pt-24 sm:pt-28 pb-10 px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0d0d12]/90 border border-[#ecb613]/30 shadow-[0_0_35px_rgba(236,182,19,0.15)] backdrop-blur-xl mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse shadow-[0_0_10px_#ecb613]" />
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-zinc-200">
            PRODUCTORA EAR // ECOSISTEMA S-CLASS 360°
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-syne max-w-5xl mx-auto leading-[1.05]">
          Arquitectura de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">Eventos, Fuego & Música</span> de Gala
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-3xl mx-auto mt-4 leading-relaxed">
          Producción técnica integral, shows líricos de autor, catering de brasas vivas y protocolo clínico neuroacústico VIMUME con estándar de cero fallos.
        </p>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={openTunnel}
            className="px-9 py-4 bg-gradient-to-r from-[#ecb613] to-[#d4a00e] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(236,182,19,0.35)] flex items-center gap-2.5 border border-amber-300/40 cursor-pointer"
          >
            <Zap size={16} className="fill-black" />
            <span>{isOpen ? 'Túnel Neural Desplegado' : 'Desplegar Túnel Neural S-Class'}</span>
          </button>
        </div>

        {/* 2. 4 PROFILES BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 text-left">
          {SOVEREIGN_PROFILES.map((prof) => {
            const Icon = prof.icon;
            return (
              <div
                key={prof.id}
                className="p-6 rounded-[2rem] bg-gradient-to-b from-[#111118] via-[#0b0b10] to-[#07070a] border border-white/10 hover:border-[#ecb613]/50 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(236,182,19,0.15)] transition-all duration-400 group flex flex-col justify-between shadow-2xl relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center pointer-events-none mix-blend-luminosity duration-700"
                  style={{ backgroundImage: `url(${prof.image})` }}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="p-3 rounded-2xl border backdrop-blur-md"
                      style={{ 
                        backgroundColor: `${prof.accentColor}18`, 
                        borderColor: `${prof.accentColor}40`,
                        color: prof.accentColor 
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <span 
                      className="text-[9px] font-mono font-black uppercase px-3 py-1 rounded-full border backdrop-blur-md"
                      style={{ 
                        backgroundColor: `${prof.accentColor}12`, 
                        borderColor: `${prof.accentColor}35`,
                        color: prof.accentColor 
                      }}
                    >
                      {prof.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black uppercase text-white font-syne">{prof.name}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: prof.accentColor }}>
                      {prof.tag}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                    {prof.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-5 border-t border-white/10 mt-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {prof.directLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-[10px] font-mono text-zinc-300 transition-colors flex items-center gap-1 border border-white/5"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={10} className="opacity-60" />
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={prof.href}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 group-hover:bg-[#ecb613] group-hover:text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all mt-3 border border-white/10 group-hover:border-[#ecb613]"
                  >
                    <span>Entrar al Portal</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SLIDER CATALOGUE */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono font-bold text-[9px] uppercase tracking-wider">
                CATÁLOGO DE ALTA COSTURA
              </span>
              <span className="text-xs font-mono text-emerald-400">● Garantía 0 Fallos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne mt-2">
              Deslizador de Brasas, Música & Hardware
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-1.5 bg-[#0e0e14] p-1.5 rounded-2xl border border-white/10 shadow-lg">
              {[
                { id: 'all', label: 'Todo', icon: Sparkles },
                { id: 'bbq', label: 'Brasas', icon: Flame },
                { id: 'music', label: 'Música', icon: Music },
                { id: 'arsenal', label: 'LED', icon: Tv }
              ].map(cat => {
                const isSelected = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)] font-black' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollSlider('left')}
                className="w-10 h-10 rounded-xl bg-[#0e0e14] border border-white/10 hover:border-[#ecb613]/50 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                title="Deslizar a la izquierda"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                className="w-10 h-10 rounded-xl bg-[#0e0e14] border border-white/10 hover:border-[#ecb613]/50 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                title="Deslizar a la derecha"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-1 snap-x snap-mandatory scroll-smooth"
        >
          {filteredItems.map(item => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`min-w-[300px] sm:min-w-[350px] max-w-[350px] rounded-[2rem] p-5 transition-all duration-300 cursor-pointer snap-start flex flex-col justify-between border relative overflow-hidden group shadow-xl ${
                  isSelected 
                    ? 'bg-gradient-to-b from-[#181822] via-[#0f0f15] to-[#0a0a0e] border-[#ecb613] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9),0_0_30px_rgba(236,182,19,0.2)] scale-[1.02]' 
                    : 'bg-[#0b0b10] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-mono font-black uppercase shadow-sm">
                      {item.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                      <Star size={13} className="fill-amber-400" />
                      <span className="font-bold">{item.rating}</span>
                      <span className="text-zinc-500">({item.reviews})</span>
                    </div>
                  </div>

                  <div className="h-44 rounded-2xl overflow-hidden bg-black/60 relative mb-4 border border-white/10">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-white">
                      <span className="bg-black/80 px-2.5 py-1 rounded-lg border border-white/10 font-bold backdrop-blur-md">
                        {item.price} € / {item.unit.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black uppercase text-white font-syne line-clamp-1 group-hover:text-[#ecb613] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[#ecb613] truncate mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-zinc-400 font-light mt-2.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 mt-4 pt-3 border-t border-white/10">
                    {item.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-[10px] font-mono text-zinc-300">
                        <Check size={12} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-base font-black text-[#ecb613] font-mono">
                    {item.price} € <span className="text-[10px] font-light text-zinc-400">{item.unit}</span>
                  </span>

                  <button className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
                    isSelected 
                      ? 'bg-[#ecb613] text-black shadow-md font-black' 
                      : 'bg-white/5 text-white/80 hover:bg-white/15 border border-white/10'
                  }`}>
                    {isSelected ? '✓ Seleccionado' : 'Cotizar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE QUOTATION BOX S-CLASS */}
      <section className="py-8 px-4 sm:px-6 max-w-4xl mx-auto relative z-20">
        <div className="bg-gradient-to-b from-[#111118] via-[#0c0c12] to-[#07070a] p-7 sm:p-10 rounded-[2.5rem] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-7">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ecb613] block">
                COTIZACIÓN INSTANTÁNEA EN VIVO
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne mt-1">
                {selectedItem.title}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 font-bold">
                Split 80/10/10 Soberano
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {isPerPax && (
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-mono text-white">
                  <span>Número de Invitados / Comensales</span>
                  <span className="text-[#ecb613] font-black text-sm">{pax} PAX</span>
                </div>
                <input 
                  type="range" 
                  min={20} 
                  max={400} 
                  value={pax} 
                  onChange={e => setPax(Number(e.target.value))}
                  className="w-full accent-[#ecb613] h-2 bg-[#1a1a24] rounded-lg cursor-pointer border border-white/10"
                />
                <span className="text-[10px] font-mono text-zinc-400 block">
                  Potencia Acústica Calibrada: {acousticWatts}W RMS (12 W/pax)
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-mono text-white">
                <span>Distancia Desplazamiento desde Madrid</span>
                <span className="text-[#ecb613] font-black text-sm">{distanceKm} KM</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={300} 
                value={distanceKm} 
                onChange={e => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#ecb613] h-2 bg-[#1a1a24] rounded-lg cursor-pointer border border-white/10"
              />
              <span className="text-[10px] font-mono text-zinc-400 block">
                Radio Provincial: {distanceKm <= 30 ? 'Desplazamiento Incluido' : `+${Math.round((distanceKm - 30) * 0.95)}€ Km`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-black/60 p-5 rounded-2xl border border-white/10">
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Presupuesto Total</span>
              <span className="text-xl font-black text-[#ecb613] font-mono">{totalQuote} €</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Depósito Stripe</span>
              <span className="text-xl font-black text-emerald-400 font-mono">100 €</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Resto en Evento</span>
              <span className="text-xl font-black text-white font-mono">{totalQuote - 100} €</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Price-Lock SHA-256</span>
              <span className="text-xs font-bold text-blue-400 font-mono">Bloqueo 72h</span>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div 
              onClick={() => setLocked(!locked)}
              className={`w-full py-4.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all ${
                locked 
                  ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-[#ecb613] via-amber-400 to-[#d4a00e] text-black shadow-[0_0_40px_rgba(236,182,19,0.35)] hover:brightness-110 active:scale-98'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock size={18} />
                <span>{locked ? '✓ FECHA BLOQUEADA 72H EN STRIPE' : 'DESLIZAR PARA BLOQUEAR FECHA'}</span>
              </div>
              <span className="font-mono text-base font-black">100 €</span>
            </div>

            <a
              href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20reservar%20${encodeURIComponent(selectedItem.title)}%20para%20${pax}%20asistentes%20(${totalQuote}%E2%82%AC).`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all"
            >
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>Despachar Payload Directo a WhatsApp (+34 693 693 048)</span>
            </a>
          </div>
        </div>
      </section>

      <InstantNeuralTunnelModal />
    </div>
  );
}

export default SovereignMasterEcosystemExperience;
