'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, MapPin, Calendar, Heart, ShieldCheck, 
  Sparkles, Award, Music, Building2, Zap, ArrowRight, 
  CheckCircle2, Volume2, Globe, Clock, ChevronRight,
  Share2, Lock, Play, Pause, ArrowUpRight, BarChart3, Users
} from 'lucide-react';
import Link from 'next/link';

interface TourMilestone {
  year: string;
  location: string;
  title: string;
  type: string;
  tag: string;
  watts: string;
}

const TOUR_JOURNEYS: TourMilestone[] = [
  {
    year: '2026',
    location: 'Madrid / Barcelona / Marbella',
    title: 'Temporada Galas Nupciales & Licitaciones B2G',
    type: 'PRODUCCIÓN MAESTRA',
    tag: 'ACTIVA',
    watts: '2000W - 8000W RMS'
  },
  {
    year: '2025',
    location: 'Sevilla / Valencia / Bilbao',
    title: 'Gira Nacional Cuarteto Imperial & Festivales',
    type: 'ALTA DISTINCIÓN',
    tag: 'COMPLETADA',
    watts: '12 W/pax Homologado'
  },
  {
    year: '2024',
    location: 'París / Miami / México / Madrid',
    title: 'Gira Internacional Tenor Lírico Edwin Agudelo',
    type: 'PACIENTE CERO',
    tag: 'HISTÓRICO',
    watts: '37+ Conciertos'
  }
];

const CURATED_VERTICALS = [
  {
    id: 'unio',
    name: 'UNIO Nupcial',
    badge: 'B2C VIP',
    subtitle: 'Música de Conservatorio & Sonido Hi-Fi',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    price: 'Desde 350 €',
    affinity: '99% Match',
    accentColor: '#ecb613'
  },
  {
    id: 'arsenal',
    name: 'Arsenal B2B',
    badge: 'HARDWARE S-CLASS',
    subtitle: 'Pantallas LED P2.9 HDR & Novastar UHD',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
    price: 'Desde 1.200 €',
    affinity: '100% Cero Fallos',
    accentColor: '#3b82f6'
  },
  {
    id: 'signal',
    name: 'The Signal',
    badge: 'ARTISTAS SOBERANOS',
    subtitle: 'Split Soberano Inmutable 80/10/10',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    price: 'Tarifa Directa',
    affinity: '80% Artista',
    accentColor: '#ec4899'
  },
  {
    id: 'vimume',
    name: 'VIMUME 40Hz',
    badge: 'NEURO-ESTIMULACIÓN',
    subtitle: 'Protocolo Acústico <75 dB para Mayores',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    price: 'Subvencionado B2G',
    affinity: 'Impacto Social',
    accentColor: '#10b981'
  }
];

export default function AcousticAtlasSClassExperience({ isSimulator = false }: { isSimulator?: boolean }) {
  const [activeTab, setActiveTab] = useState<'atlas' | 'timeline' | 'catalog' | 'stats'>('atlas');
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});
  const [locked, setLocked] = useState(false);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`w-full bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden ${isSimulator ? 'p-3.5 h-full' : 'p-4 sm:p-8 min-h-[90vh]'}`}>
      
      {/* Dynamic Ambient Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[350px] rounded-full blur-[130px] bg-[#ecb613]/15 pointer-events-none" />

      {/* 🧭 TOP S-CLASS NAVIGATION PILLS */}
      <div className="w-full max-w-md mx-auto mb-4 relative z-20">
        <div className="grid grid-cols-4 bg-[#111118] p-1 rounded-2xl border border-white/10 shadow-xl">
          {[
            { id: 'atlas', label: 'Atlas', icon: Globe },
            { id: 'timeline', label: 'Trayectoria', icon: Calendar },
            { id: 'catalog', label: 'Verticales', icon: Sparkles },
            { id: 'stats', label: 'Garantías', icon: BarChart3 }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1.5 rounded-xl text-[10px] font-mono font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isSelected 
                    ? 'bg-[#ecb613] text-black shadow-md scale-[1.02]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={13} />
                <span className="truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 1. SCREEN 1: THE ACOUSTIC ATLAS (MAP & KEY METRICS)                */}
      {/* ================================================================= */}
      {activeTab === 'atlas' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between space-y-4"
        >
          {/* Main Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono tracking-widest">
                PACIENTE CERO // ATLAS S-CLASS
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                ● 100% Cero Fallos
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-syne">
              Producción Musical & Arte Soberano
            </h1>
            <p className="text-xs text-white/60 font-light mt-1">
              Descubre el ecosistema técnico y artístico de Edwin Agudelo. Cobertura acústica homologada en toda España y plazas internacionales.
            </p>
          </div>

          {/* Interactive Radar Map Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#161622] via-[#0e0e15] to-[#07070a] border border-white/15 p-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Madrid Central · Despacho Activo
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded-full border border-[#ecb613]/30">
                +34 693 693 048
              </span>
            </div>

            {/* Map Visual Graphic */}
            <div className="relative h-32 rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-3">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ecb613_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Highlight Points */}
              <div className="relative z-10 w-full flex items-center justify-around text-center">
                <div className="space-y-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#ecb613] mx-auto block shadow-[0_0_8px_#ecb613]" />
                  <span className="text-[9px] font-mono text-white/80 block">Madrid</span>
                  <span className="text-[7px] font-mono text-emerald-400">Hub Central</span>
                </div>
                <div className="space-y-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mx-auto block shadow-[0_0_8px_#60a5fa]" />
                  <span className="text-[9px] font-mono text-white/80 block">Barcelona</span>
                  <span className="text-[7px] font-mono text-white/40">Gala 360°</span>
                </div>
                <div className="space-y-0.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 mx-auto block shadow-[0_0_8px_#f472b6]" />
                  <span className="text-[9px] font-mono text-white/80 block">Sevilla</span>
                  <span className="text-[7px] font-mono text-white/40">Charro VIP</span>
                </div>
                <div className="space-y-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mx-auto block shadow-[0_0_8px_#34d399]" />
                  <span className="text-[9px] font-mono text-white/80 block">Marbella</span>
                  <span className="text-[7px] font-mono text-white/40">Luxury</span>
                </div>
              </div>
            </div>

            {/* Stats Metric Boxes */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                <span className="text-[8px] font-mono text-white/40 block uppercase">Conciertos</span>
                <span className="text-sm font-black text-[#ecb613]">37+ Giras</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                <span className="text-[8px] font-mono text-white/40 block uppercase">Potencia</span>
                <span className="text-sm font-black text-white">12 W/pax</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                <span className="text-[8px] font-mono text-white/40 block uppercase">Split Artista</span>
                <span className="text-sm font-black text-emerald-400">80% Neto</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className="w-full py-3.5 px-6 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:bg-[#ecb613] transition-all active:scale-95"
            >
              <span>Explorar los 4 Perfiles Soberanos</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* 2. SCREEN 2: JOURNEYS OVER TIME (TIMELINE 2026 - 2024)            */}
      {/* ================================================================= */}
      {activeTab === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#ecb613] block">
              CRONOLOGÍA & HITOS // EDWIN AGUDELO
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-syne mt-0.5">
              Trayectoria Ininterrumpida
            </h2>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-2.5 flex-1">
            {TOUR_JOURNEYS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-[#14141e] to-[#0c0c12] border border-white/10 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#ecb613] text-black font-mono font-black text-[9px]">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-mono text-white/50">{item.location}</span>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-xs font-black uppercase text-white font-syne">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mt-2 pt-1.5 border-t border-white/5">
                  <span>{item.type}</span>
                  <span className="text-[#ecb613] font-bold">{item.watts}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('catalog')}
            className="w-full py-3 px-4 rounded-2xl bg-[#1a1a24] hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Ver Formatos Disponibles</span>
            <ChevronRight size={14} />
          </button>
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* 3. SCREEN 3: CURATED 4 VERTICALS (BENTO CARDS)                    */}
      {/* ================================================================= */}
      {activeTab === 'catalog' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#ecb613] block">
                CATÁLOGO DE ALTA DISTINCIÓN
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
                4 Perfiles Soberanos
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Disponibilidad 2026</span>
          </div>

          {/* Vertical Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 flex-1">
            {CURATED_VERTICALS.map(v => {
              const isLiked = likedCards[v.id];
              return (
                <div
                  key={v.id}
                  className="rounded-2xl bg-gradient-to-b from-[#161622] to-[#0c0c12] border border-white/10 p-3 shadow-lg flex flex-col justify-between group hover:border-white/25 transition-all"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[#ecb613] text-[8px] font-mono font-bold uppercase truncate max-w-[90px]">
                      {v.badge}
                    </span>
                    <button
                      onClick={(e) => toggleLike(v.id, e)}
                      className={`p-1 rounded-full ${isLiked ? 'text-rose-400' : 'text-white/30'}`}
                    >
                      <Heart size={11} className={isLiked ? 'fill-rose-400' : ''} />
                    </button>
                  </div>

                  <div className="h-20 rounded-xl overflow-hidden mb-2 bg-black/40 relative">
                    <img 
                      src={v.image} 
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-[#ecb613]">
                      {v.affinity}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black uppercase text-white truncate font-syne">
                      {v.name}
                    </h4>
                    <p className="text-[8px] text-white/50 truncate font-light mb-2">
                      {v.subtitle}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                      <span className="text-[10px] font-mono font-bold text-[#ecb613]">
                        {v.price}
                      </span>
                      <Link
                        href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20cotizar%20${encodeURIComponent(v.name)}.`}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#ecb613] hover:text-black text-white text-[8px] font-mono font-bold flex items-center gap-0.5"
                      >
                        <span>Cotizar</span>
                        <ArrowUpRight size={8} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <Link
            href="/mobile-fusion"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#d99f0b] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 hover:brightness-110 active:scale-95"
          >
            <Sparkles size={14} />
            <span>Abrir Cotizador Combo 1 VIP</span>
          </Link>
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* 4. SCREEN 4: STATS & SLIDE-TO-LOCK 100€ (INSTANT CLOSING)         */}
      {/* ================================================================= */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 block">
              BLINDAJE CONTRACTUAL & RETENCIÓN
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
              Garantías S-Class 360°
            </h2>
          </div>

          <div className="space-y-2 bg-[#0c0c14] p-4 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono text-white/70">Presión Acústica Homologada</span>
              <span className="text-xs font-black text-[#ecb613] font-mono">12 W/pax</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono text-white/70">Seguro de Responsabilidad Civil</span>
              <span className="text-xs font-black text-emerald-400 font-mono">1.000.000 €</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono text-white/70">Firma Digital Criptográfica</span>
              <span className="text-xs font-black text-blue-400 font-mono">eIDAS SHA-256</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/70">Split Soberano</span>
              <span className="text-xs font-black text-white font-mono">80% / 10% / 10%</span>
            </div>
          </div>

          {/* Slide-to-Lock CTA */}
          <div className="space-y-2">
            <div 
              onClick={() => setLocked(!locked)}
              className={`w-full py-4 px-5 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all ${
                locked 
                  ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-[#ecb613] to-[#d99f0b] text-black shadow-xl shadow-[#ecb613]/25 hover:brightness-110 active:scale-95'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={16} />
                <span>{locked ? '✓ FECHA BLOQUEADA 72H' : 'DESLIZAR PARA BLOQUEAR'}</span>
              </div>
              <span className="font-mono font-black text-sm">100 €</span>
            </div>

            <p className="text-[9px] font-mono text-white/40 text-center">
              Depósito 100% reembolsable según condiciones S-Class
            </p>
          </div>
        </motion.div>
      )}

    </div>
  );
}
