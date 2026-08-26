'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Flame, Music, ShieldCheck, Heart, 
  MapPin, Clock, Star, Sliders, Lock, CheckCircle2,
  ArrowRight, MessageCircle, ChevronRight, Share2,
  Tv, Award, Zap, Compass, Search, Filter, Layers
} from 'lucide-react';
import Link from 'next/link';

export interface LuxuryItem {
  id: string;
  category: 'music' | 'bbq' | 'arsenal' | 'vimume';
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  basePrice: number;
  unit: string;
  image: string;
  rating: number;
  reviewsCount: number;
  affinity: string;
  specs: {
    acousticPower?: string;
    capacity?: string;
    duration?: string;
    chefLevel?: string;
    split: string;
  };
  highlights: string[];
}

export const LUXURY_CATALOG: LuxuryItem[] = [
  // 1. MÚSICA & ARTE SOBERANO
  {
    id: 'music-solista-gala',
    category: 'music',
    title: 'Solista Imperial & Tenor',
    subtitle: 'Edwin Agudelo · Paciente Cero',
    tagline: 'Voz lírica en directo, repertorio charro refinado y sonido Hi-Fi Bose F1.',
    badge: 'TOP EVENTOS NUPCIALES',
    basePrice: 350,
    unit: 'Evento Completo',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    rating: 4.99,
    reviewsCount: 52,
    affinity: '99% Afinidad',
    specs: {
      acousticPower: '2000W RMS (12 W/pax)',
      duration: '2 pases de 30 min',
      split: '80% Artista / 10% EAR / 10% VIMUME'
    },
    highlights: [
      'Garantía Cero Fallos y Seguro RC 1.000.000 €',
      'Traje charro de gala con botonadura de plata',
      'Sonorización Bose F1 calibrada para exterior o interior',
      'Bono EDWIN150 aplicable para complementos VIP'
    ]
  },
  {
    id: 'music-cuarteto-imperial',
    category: 'music',
    title: 'Cuarteto Imperial & Mariachi XXI',
    subtitle: 'Ensamble de Conservatorio',
    tagline: '4 músicos solistas: 2 violines, vihuela, guitarrón y voces líricas.',
    badge: 'MÁXIMA DISTINCIÓN',
    basePrice: 950,
    unit: 'Evento Completo',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewsCount: 38,
    affinity: '98% Afinidad',
    specs: {
      acousticPower: '4000W RMS (12 W/pax)',
      duration: '3 pases de 30 min',
      split: '80% Músicos / 10% EAR / 10% VIMUME'
    },
    highlights: [
      'Arreglos sinfónicos exclusivos de gala',
      'Microfonía inalámbrica Shure Beta para libertad escénica',
      'Recepción de invitados y acompañamiento durante banquete',
      'Photocall con sombreros charros artesanales'
    ]
  },

  // 2. GASTRONOMÍA & BRASAS LIVE FIRE
  {
    id: 'bbq-ritual-iberico',
    category: 'bbq',
    title: 'Catering de Brasas: Ritual Ibérico',
    subtitle: 'Fuego Vivo & Cortes Seleccionados',
    tagline: 'Secreto, pluma y presa ibérica madurada a la brasa de encina con showcooking.',
    badge: 'EXPERIENCIA GASTRONÓMICA',
    basePrice: 45,
    unit: 'Por Comensal',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    rating: 4.97,
    reviewsCount: 41,
    affinity: '100% Producto Top',
    specs: {
      capacity: 'Desde 30 hasta 400+ comensales',
      chefLevel: 'Maestros Parrilleros Certificados',
      split: '80% Chef Parrillero / 10% EAR / 10% VIMUME'
    },
    highlights: [
      'Estación móvil de fuego en directo con registro sanitario RGEAA',
      'Carbón de quebracho y leña de encina de alta densidad',
      'Verduras de huerto al rescoldo y salsas caseras de autor',
      'Sonorización acústica Bose F1 de cortesía para el cóctel'
    ]
  },
  {
    id: 'bbq-asado-argentino',
    category: 'bbq',
    title: 'Catering: Asado Argentino Tradicional',
    subtitle: 'Cortes Nobles & Espadas al Carbón',
    tagline: 'Asado de tira, entraña, vacío, choripanes criollos y mollejas crocantes.',
    badge: 'ALTA CONVIVENCIA',
    basePrice: 55,
    unit: 'Por Comensal',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewsCount: 29,
    affinity: '99% Afinidad',
    specs: {
      capacity: 'Desde 40 hasta 500 comensales',
      chefLevel: 'Asadores de Campeonato Mundial',
      split: '80% Asadores / 10% EAR / 10% VIMUME'
    },
    highlights: [
      'Espadas criollas y parrillas en uve con desgrasador',
      'Chimichurri artesano y salsa criolla macerada 48h',
      'Mollejas al limón y provolone fundido al carbón',
      'Montaje de gala rústica y servicio ágil por tiempos'
    ]
  },
  {
    id: 'bbq-ancestral-cruz',
    category: 'bbq',
    title: 'Asado Ancestral a la Cruz & Estaca',
    subtitle: 'Fuego Lento de 8 Horas',
    tagline: 'Cordero lechal y costillares enteros en domo de leña viva para grandes galas.',
    badge: 'ESPECTÁCULO VISUAL',
    basePrice: 65,
    unit: 'Por Comensal',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 22,
    affinity: 'Monumento Gastronómico',
    specs: {
      capacity: 'Desde 60 hasta 600 comensales',
      duration: 'Cocción lenta 8 horas in situ',
      split: '80% Maestros / 10% EAR / 10% VIMUME'
    },
    highlights: [
      'Estructura de cruces de hierro forjado en círculo de fuego',
      'Cordero lechal nacional D.O. y costillares Black Angus',
      'Hortalizas enterradas en cenizas y papas al rescoldo',
      'Impacto visual supremo para bodas en fincas y festivales'
    ]
  },

  // 3. ARSENAL B2B & HARDWARE
  {
    id: 'arsenal-led-p29',
    category: 'arsenal',
    title: 'Pantallas LED P2.9 Novastar UHD',
    subtitle: 'Hardware Escénico S-Class',
    tagline: 'Módulos LED de alto brillo exterior 4500 nits con procesado Novastar HDR.',
    badge: 'HARDWARE B2B',
    basePrice: 1200,
    unit: 'Montaje 3x2m con Técnico',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewsCount: 35,
    affinity: '100% Cero Fallos',
    specs: {
      capacity: 'Resolución UHD 4K Nativa',
      duration: 'Jornada completa con operador',
      split: '80% Proveedor / 10% EAR / 10% VIMUME'
    },
    highlights: [
      'Pixel pitch ultra fino P2.9 mm para visión nítida a corta distancia',
      'Procesador de vídeo Novastar VX1000 con backup redundante',
      'Estructura truss homologada y seguro de montaje profesional',
      'Entrega y calibración en menos de 3 horas'
    ]
  },

  // 4. VIMUME NEURO-ESTIMULACIÓN
  {
    id: 'vimume-terapia-40hz',
    category: 'vimume',
    title: 'Sesión Reminiscencia & Frecuencia 40Hz',
    subtitle: 'Protocolo VIMUME Senior',
    tagline: 'Estimulación neuroacústica suave a <75 dB para centros de día y mayores.',
    badge: 'IMPACTO SOCIAL',
    basePrice: 450,
    unit: 'Sesión Terapéutica',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 46,
    affinity: 'Bienestar Comprobado',
    specs: {
      acousticPower: 'SPL <75 dB Protegido',
      duration: '60 min de estimulación activa',
      split: '100% Financiado / Subvención B2G'
    },
    highlights: [
      'Canciones de la memoria histórica y juventud de los residentes',
      'Estimulación de memoria episódica y reducción de ansiedad',
      'Informes de respuesta anímica validados para familias y médicos',
      'Subvencionable mediante fondos de impacto social y 0,7% IRPF'
    ]
  }
];

export default function LuxuryMarketplaceExperience({ isSimulator = false }: { isSimulator?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'music' | 'bbq' | 'arsenal' | 'vimume'>('all');
  const [selectedItem, setSelectedItem] = useState<LuxuryItem>(LUXURY_CATALOG[0]);
  const [paxCount, setPaxCount] = useState(80);
  const [distanceKm, setDistanceKm] = useState(25);
  const [isLocked, setIsLocked] = useState(false);

  const filteredItems = selectedCategory === 'all' 
    ? LUXURY_CATALOG 
    : LUXURY_CATALOG.filter(i => i.category === selectedCategory);

  // Dynamic Quote Calculation
  const isPerPax = selectedItem.unit.includes('Comensal');
  const calculatedTotal = isPerPax
    ? Math.round(selectedItem.basePrice * paxCount + (distanceKm > 30 ? (distanceKm - 30) * 0.95 : 0))
    : Math.round(selectedItem.basePrice + (distanceKm > 30 ? (distanceKm - 30) * 0.95 : 0));

  const deposit = 100;
  const watts = paxCount * 12;

  return (
    <div className={`w-full bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden font-sans select-none ${isSimulator ? 'p-3 h-full' : 'p-4 sm:p-8 min-h-screen'}`}>
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] rounded-full blur-[140px] bg-[#ecb613]/10 pointer-events-none" />

      {/* 👑 TOP LUXURY HEADER */}
      <div className="w-full max-w-md mx-auto mb-3 relative z-20 space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            <span className="text-[9px] font-mono font-black uppercase text-white tracking-widest">
              S-CLASS MARKETPLACE
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Split 80/10/10
          </span>
        </div>

        {/* 🎛️ LUXURY CATEGORY SWITCHER (DRIBBLE STYLE) */}
        <div className="grid grid-cols-4 gap-1 bg-[#111118] p-1 rounded-2xl border border-white/10 shadow-lg">
          {[
            { id: 'all', label: 'Todo', icon: Layers },
            { id: 'music', label: 'Música', icon: Music },
            { id: 'bbq', label: 'Brasas', icon: Flame },
            { id: 'arsenal', label: 'Hardware', icon: Tv }
          ].map(cat => {
            const isSel = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`py-2 px-1 rounded-xl text-[9px] font-mono font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isSel 
                    ? 'bg-[#ecb613] text-black shadow-md scale-[1.02]' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={12} />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 CAROUSEL / GRID OF LUXURY CARDS */}
      <div className="w-full max-w-md mx-auto space-y-2.5 flex-1 overflow-y-auto no-scrollbar py-1">
        {filteredItems.map(item => {
          const isSelected = selectedItem.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`rounded-3xl border p-3.5 transition-all cursor-pointer relative overflow-hidden ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#181824] via-[#12121a] to-[#0c0c12] border-[#ecb613] shadow-xl shadow-[#ecb613]/10 scale-[1.01]' 
                  : 'bg-[#0d0d14] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#ecb613] text-black text-[8px] font-mono font-black uppercase tracking-wider">
                  {item.badge}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                  <Star size={10} className="fill-amber-400" />
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-white/40">({item.reviewsCount})</span>
                </div>
              </div>

              {/* Card Main Info */}
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/50 shrink-0 border border-white/10 relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[7px] font-mono text-[#ecb613]">
                    {item.affinity}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="text-xs font-black uppercase text-white truncate font-syne">
                    {item.title}
                  </h3>
                  <p className="text-[9px] font-mono text-[#ecb613] truncate">
                    {item.subtitle}
                  </p>
                  <p className="text-[8px] text-white/50 line-clamp-2 font-light leading-snug">
                    {item.tagline}
                  </p>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5">
                <div>
                  <span className="text-[8px] font-mono text-white/40 block">Tarifa Oficial</span>
                  <span className="text-xs font-black text-[#ecb613] font-mono">
                    {item.basePrice} € <span className="text-[8px] font-normal text-white/50">/ {item.unit}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    {item.specs.split.split('/')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-white/80 px-2 py-1 rounded-xl bg-white/5 border border-white/10">
                    {isSelected ? '✓ Seleccionado' : 'Configurar'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎚️ INTERACTIVE SPEC CALCULATOR DRAWER */}
      <div className="w-full max-w-md mx-auto mt-3 bg-[#0e0e16] p-3.5 rounded-3xl border border-white/15 space-y-2.5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613]">
            Cotizador en Vivo // {selectedItem.title}
          </span>
          <span className="text-[9px] font-mono text-white/60">
            {isPerPax ? `${paxCount} Invitados` : 'Formato Fijo'}
          </span>
        </div>

        {/* Sliders: Pax & KM */}
        <div className="space-y-2">
          {isPerPax && (
            <div>
              <div className="flex justify-between text-[9px] font-mono text-white/70 mb-0.5">
                <span>Número de Asistentes</span>
                <span className="text-[#ecb613] font-bold">{paxCount} PAX</span>
              </div>
              <input 
                type="range" 
                min={20} 
                max={350} 
                value={paxCount} 
                onChange={e => setPaxCount(Number(e.target.value))}
                className="w-full accent-[#ecb613] h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between text-[9px] font-mono text-white/70 mb-0.5">
              <span>Desplazamiento desde Madrid</span>
              <span className="text-[#ecb613] font-bold">{distanceKm} KM</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={250} 
              value={distanceKm} 
              onChange={e => setDistanceKm(Number(e.target.value))}
              className="w-full accent-[#ecb613] h-1 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Total Price & Telemetry */}
        <div className="bg-black/50 p-2.5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-mono text-white/50 uppercase block">Presupuesto Cerrado</span>
            <span className="text-sm font-black text-[#ecb613] font-mono">
              {calculatedTotal} €
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono text-white/50 uppercase block">Depósito Stripe</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{deposit} €</span>
          </div>
        </div>

        {/* Closing Trigger: Slide-to-Lock or WhatsApp */}
        <div className="space-y-1.5 pt-1">
          <div 
            onClick={() => setIsLocked(!isLocked)}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all ${
              isLocked 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25' 
                : 'bg-gradient-to-r from-[#ecb613] to-[#d99f0b] text-black shadow-lg shadow-[#ecb613]/25 hover:brightness-110 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Lock size={14} />
              <span>{isLocked ? '✓ FECHA BLOQUEADA 72H' : 'DESLIZAR PARA BLOQUEAR'}</span>
            </div>
            <span className="font-mono text-xs">{deposit} €</span>
          </div>

          <a
            href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20deseo%20reservar%20${encodeURIComponent(selectedItem.title)}%20para%20${paxCount}%20personas%20(${calculatedTotal}€).`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
          >
            <MessageCircle size={12} className="text-[#25D366]" />
            <span>Consultar por WhatsApp (+34 693 693 048)</span>
          </a>
        </div>
      </div>

    </div>
  );
}
