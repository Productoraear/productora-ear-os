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
    badge: 'B2C ÉLITE // NOVIOS & PARTICULARES',
    subtitle: 'MÚSICA & SONORIZACIÓN NUPCIAL',
    description: 'Músicos de conservatorio y sonido de alta fidelidad para ceremonias y cócteles inolvidables. Configura tu presupuesto cerrado al instante con Price-Lock de 72 horas y sin sorpresas.',
    ctaText: 'Calcular mi Boda en 1 Minuto',
    href: '/bodas',
    icon: Heart,
    accentColor: '#ecb613',
    bgGradient: 'from-amber-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Garantía Acústica', value: '12 W/pax' },
      { label: 'Presupuesto', value: 'Precio Fijo (72h)' }
    ]
  },
  {
    id: 'planners',
    name: 'PLANNERS',
    badge: 'B2B PARTNERS // FINCAS & VENUES',
    subtitle: 'RED DE FINCAS & ESPACIOS EXCLUSIVOS',
    description: 'Eleva el estándar sonoro de tu espacio recomendando producción técnica de máxima solvencia. Obtén comisiones transparentes con liquidaciones automáticas cada domingo.',
    ctaText: 'Acceso Partner & Fincas',
    href: '/panel/afiliado',
    icon: Building2,
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Split Soberano', value: '80 / 10 / 10' },
      { label: 'Liquidación', value: 'Semanal Automática' }
    ]
  },
  {
    id: 'astra',
    name: 'ASTRA',
    badge: 'TALENTO // ARTISTAS & MÚSICOS',
    subtitle: 'BOOKING DIRECTO & RIDERS TÉCNICOS',
    description: 'Accede a eventos prémium con el 80% neto garantizado por contrato. Despreocúpate de la logística y la facturación para centrarte exclusivamente en tu interpretación escénica.',
    ctaText: 'Unirse a Diamantes Rojos',
    href: '/artistas/dashboard',
    icon: Zap,
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Retención Artista', value: '80% Neto' },
      { label: 'Equipamiento', value: 'Shure / Neumann' }
    ]
  },
  {
    id: 'vimume',
    name: 'VIMUME',
    badge: 'B2G INSTITUCIONAL // 40 HZ',
    subtitle: 'IMPACTO COGNITIVO & SECTOR PÚBLICO',
    description: 'Programas musicales terapéuticos y galas solemnes con base científica (40 Hz MIT). Contratación ágil mediante el Art. 118 LCSP (<15.000 €) con memoria técnica lista en 24 horas.',
    ctaText: 'Generar Memoria B2G',
    href: '/vimume',
    icon: ShieldCheck,
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-950/40 via-black/80 to-[#050505]',
    bgImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Tramitación', value: 'Art. 118 LCSP' },
      { label: 'Memoria Técnica', value: 'Lista en 24h' }
    ]
  }
];

export default function CinematicHeroSClass() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative w-full min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-hidden selection:bg-[#ecb613] selection:text-black">
      
      {/* 👑 TOP BADGE: PROTOCOLO S-CLASS DE CONFIANZA */}
      <div className="pt-28 sm:pt-32 pb-6 px-4 z-20 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2.5 px-6 py-2 bg-black/80 border border-[#ecb613]/40 rounded-full shadow-[0_0_35px_rgba(236,182,19,0.15)] backdrop-blur-xl group hover:border-[#ecb613] transition-all">
          <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-montserrat font-bold tracking-[0.25em] uppercase text-zinc-300">
            PROTOCOLO S-CLASS // AUDITORÍA ACÚSTICA & STRIPE PAYMENTS
          </span>
        </div>

        <h1 className="mt-5 text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-francia max-w-4xl leading-[1.1]">
          SISTEMA OPERATIVO DE <span className="text-[#ecb613] italic">EVENTOS & MATCHMAKING</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-normal font-montserrat max-w-2xl mt-3 leading-relaxed">
          Selecciona tu arquetipo para activar el túnel neural de cotización inmediata, ingeniería acústica sin fallos y liquidación en tiempo real.
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
                className={`relative rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 cursor-pointer group ${
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent pointer-events-none" />

                {/* Top Section: Icon & Badge */}
                <div className="relative z-10 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div 
                      className="p-3 rounded-2xl border transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${p.accentColor}15`, 
                        borderColor: `${p.accentColor}40`,
                        color: p.accentColor 
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <span 
                      className="text-[9px] font-montserrat font-bold tracking-wider px-2.5 py-1 rounded-full border uppercase"
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
                    <h3 className="text-2xl sm:text-[26px] font-black uppercase tracking-tight text-white font-francia">
                      {p.name}
                    </h3>
                    <p className="text-[11px] font-montserrat uppercase tracking-wider text-zinc-400 mt-1 font-bold">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Middle Section: Description & Stats */}
                <div className="relative z-10 space-y-4 my-5">
                  <p className="text-[13.5px] sm:text-[14px] text-zinc-300 leading-relaxed font-normal font-montserrat">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    {p.stats.map((s, idx) => (
                      <div key={idx} className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] font-montserrat font-medium text-zinc-400 uppercase tracking-wider block">{s.label}</span>
                        <span className="text-xs sm:text-[13px] font-bold font-mono text-white mt-0.5 block" style={{ color: p.accentColor }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Section: Action CTA Button */}
                <div className="relative z-10 pt-1">
                  <Link
                    href={p.href}
                    className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-[13px] font-montserrat uppercase tracking-wider flex items-center justify-between transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      backgroundColor: isHovered ? p.accentColor : 'rgba(255,255,255,0.06)',
                      color: isHovered ? '#000' : '#fff',
                      border: `1px solid ${isHovered ? p.accentColor : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
