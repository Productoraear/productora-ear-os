'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Zap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Award, 
  ChevronRight,
  TrendingUp,
  Music,
  Users,
  Layers
} from 'lucide-react';
import Link from 'next/link';

interface ProfileJourney {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  ctaText: string;
  href: string;
  icon: any;
  accentColor: string;
  bgGradient: string;
  bgImage: string;
  stats: { label: string; value: string }[];
}

const PROFILES: ProfileJourney[] = [
  {
    id: 'unio',
    name: 'UNIO',
    badge: 'B2C NOVIOS & PARTICULARES',
    subtitle: 'EVENTOS S-CLASS & CLIENTES',
    description: 'Experiencia nupcial y galas privadas de alta gama. Presupuesto exacto sin costes ocultos con Price-Lock SHA-256 (72h), sonorización Bose/Shure a 12 W/pax y Plan B redundante in situ.',
    ctaText: 'Diseñar mi Boda S-Class',
    href: '/bodas',
    icon: Heart,
    accentColor: '#ecb613',
    bgGradient: 'from-amber-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Garantía Acústica', value: '12 W/pax' },
      { label: 'Price-Lock', value: '72 Horas' }
    ]
  },
  {
    id: 'planners',
    name: 'PLANNERS & FINCAS',
    badge: 'B2B PARTNERS & FINCAS',
    subtitle: 'RED DE AFILIADOS & ATRIBUCIÓN',
    description: 'Portal para fincas de Madrid/Toledo, wedding planners y directores de eventos. Enlace canónico ?ref=, liquidaciones dominicales 23:59 GMT (Split 80/10/10) y Gate KYC ≥ 3.000 €.',
    ctaText: 'Acceso Partner / Fincas',
    href: '/panel/afiliado',
    icon: Building2,
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Split Soberano', value: '80 / 10 / 10' },
      { label: 'Nodos en Red', value: '842+ Nodos' }
    ]
  },
  {
    id: 'astra',
    name: 'ASTRA',
    badge: 'TALENTO, ARTISTAS & ROYALTIES',
    subtitle: 'SUITE ESTRATÉGICA & PRODUCCIÓN',
    description: 'Plataforma para artistas y directores técnicos. Gestión de riders (Axient Digital, XR18), cálculo determinista de royalties y acceso al Test de 10 Fases para Diamantes Rojos.',
    ctaText: 'Unirse al Ecosistema',
    href: '/artistas/dashboard',
    icon: Zap,
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Herramientas IA', value: '8 Módulos' },
      { label: 'Split Artista', value: '80% Neto' }
    ]
  },
  {
    id: 'vimume',
    name: 'VIMUME',
    badge: 'B2G / SILVER ECONOMY',
    subtitle: 'SECTOR PÚBLICO & ESTIMULACIÓN',
    description: 'Ayuntamientos, residencias de mayores y consorcios sociosanitarios. Contratación simplificada Art. 118 LCSP (<15.000 €), fondos europeos NextGenEU y protocolos sonoros 40Hz.',
    ctaText: 'Portal Institucional',
    href: '/vimume',
    icon: ShieldCheck,
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Adjudicación Directa', value: '<24 Horas' },
      { label: 'Protocolo Cognitivo', value: '40 Hz RAG' }
    ]
  }
];

export default function CinematicHeroSClass() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative w-full min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-hidden selection:bg-[#ecb613] selection:text-black">
      
      {/* 👑 TOP BADGE: MARKET CAP OBJECTIVE */}
      <div className="pt-28 sm:pt-32 pb-6 px-4 z-20 flex flex-col items-center justify-center text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-6 py-2.5 bg-black/80 border border-[#ecb613]/50 rounded-2xl sm:rounded-full shadow-[0_0_35px_rgba(236,182,19,0.2)] backdrop-blur-xl group hover:border-[#ecb613] transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
              MARKET CAP OBJECTIVE
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black font-syne text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white tracking-tight">
            250.000.000 €
          </span>
        </div>

        <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-white font-syne max-w-5xl leading-[0.95]">
          SISTEMA OPERATIVO DE <span className="text-[#ecb613]">EVENTOS & MATCHMAKING</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-2xl mt-2">
          Selecciona tu arquetipo para activar tu viaje del cliente con ingeniería acústica, precios sin costes ocultos y liquidación en tiempo real.
        </p>
      </div>

      {/* 🎴 4-COLUMN SPLIT SCREEN EXPERIENCE (DESKTOP) & TOUCH CARDS (MOBILE) */}
      <div className="w-full flex-1 px-4 lg:px-8 pb-16 z-20 max-w-7xl mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-[500px]">
          {PROFILES.map((p) => {
            const Icon = p.icon;
            const isHovered = hoveredId === p.id;

            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between p-6 sm:p-8 cursor-pointer group ${
                  isHovered 
                    ? 'border-[#ecb613] shadow-[0_0_40px_rgba(236,182,19,0.25)] scale-[1.02]' 
                    : 'border-white/10 hover:border-white/30 bg-[#09090d]/80'
                }`}
                style={{
                  background: isHovered 
                    ? `linear-gradient(180deg, ${p.accentColor}15 0%, #050505 100%)` 
                    : undefined
                }}
              >
                {/* Background Image with Dark Vignette */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none mix-blend-luminosity"
                  style={{ backgroundImage: `url(${p.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none" />

                {/* Top Section: Icon & Badge */}
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div 
                      className="p-3.5 rounded-2xl border transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${p.accentColor}15`, 
                        borderColor: `${p.accentColor}40`,
                        color: p.accentColor 
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <span 
                      className="text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase"
                      style={{ 
                        backgroundColor: `${p.accentColor}10`, 
                        borderColor: `${p.accentColor}30`,
                        color: p.accentColor 
                      }}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne">
                      {p.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-400 mt-1 font-bold">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Middle Section: Description & Stats */}
                <div className="relative z-10 space-y-4 my-6">
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    {p.stats.map((s, idx) => (
                      <div key={idx} className="bg-black/50 p-2 rounded-xl border border-white/5">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">{s.label}</span>
                        <span className="text-xs font-bold font-mono text-white" style={{ color: p.accentColor }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Section: Action CTA Button */}
                <div className="relative z-10 pt-2">
                  <Link
                    href={p.href}
                    className="w-full py-3.5 px-5 rounded-2xl font-black text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      backgroundColor: isHovered ? p.accentColor : 'rgba(255,255,255,0.06)',
                      color: isHovered ? '#000' : '#fff',
                      border: `1px solid ${isHovered ? p.accentColor : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
