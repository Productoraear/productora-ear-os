'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Music, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Radio,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface ProfileJourney {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  ctaText: string;
  href: string;
  icon: any;
  accentColor: string;
  bgImage: string;
  stats: { label: string; value: string }[];
}

const PROFILES: ProfileJourney[] = [
  {
    id: 'unio',
    name: 'UNIO',
    badge: 'B2C ÉLITE // NOVIOS',
    subtitle: 'MÚSICA & SONORIZACIÓN NUPCIAL',
    description: 'Músicos de conservatorio y sonido de alta fidelidad para ceremonias y cócteles inolvidables. Configura tu presupuesto cerrado al instante con Price-Lock de 72 horas y sin sorpresas.',
    ctaText: 'Activar Túnel de Cotización',
    href: '/cotizador?mode=bespoke&role=cliente',
    icon: Heart,
    accentColor: '#ecb613',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Garantía Acústica', value: '12 W/pax' },
      { label: 'Price-Lock', value: '72h SHA-256' }
    ]
  },
  {
    id: 'planners',
    name: 'PLANNERS',
    badge: 'B2B PARTNERS // VENUES',
    subtitle: 'RED DE FINCAS & ESPACIOS EXCLUSIVOS',
    description: 'Eleva el estándar sonoro de tu espacio recomendando producción técnica de máxima solvencia. Accede a nuestro directorio homologado y gestiona tu perfil con verificación en 2 pasos.',
    ctaText: 'Directorio & Reclamar Ficha',
    href: '/proveedores',
    icon: Users,
    accentColor: '#10b981',
    bgImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Comisión Partner', value: '10% Directo' },
      { label: 'Verificación', value: '2FA Activo' }
    ]
  },
  {
    id: 'artist',
    name: 'THE SIGNAL',
    badge: 'ARTISTAS // ROSTER',
    subtitle: 'ROSTER S-CLASS & EDWIN AGUDELO',
    description: 'Accede a producciones de primer nivel sin intermediarios abusivos. Retén el 80% de tus honorarios bajo contrato soberano homologado y auditoría acústica continua.',
    ctaText: 'Entrar a The Signal',
    href: '/artistas/edwin-agudelo',
    icon: Music,
    accentColor: '#a855f7',
    bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Split Artista', value: '80% Neto' },
      { label: 'Paciente Cero', value: 'Edwin Agudelo' }
    ]
  },
  {
    id: 'b2g',
    name: 'VIMUME',
    badge: 'B2G // AYUNTAMIENTOS',
    subtitle: 'ESTIMULACIÓN 40HZ & LCSP ART. 118',
    description: 'Protocolo de neuroestimulación acústica <75 dB para residencias de mayores y centros de día. Tramitación directa por contrato menor LCSP sin fricción burocrática.',
    ctaText: 'Desplegar Protocolo B2G',
    href: '/ocasiones/ayuntamientos',
    icon: Building2,
    accentColor: '#3b82f6',
    bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Tramitación', value: 'Art. 118 LCSP' },
      { label: 'Memoria Técnica', value: 'Lista en 24h' }
    ]
  }
];

export default function CinematicHeroSClass() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  const handleCardNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <section className="relative w-full min-h-[85vh] bg-[#050505] text-white flex flex-col justify-between overflow-hidden selection:bg-[#ecb613] selection:text-black pb-8">
      
      {/* 👑 TOP BADGE & HERO HEADLINE */}
      <div className="pt-24 sm:pt-28 pb-6 px-4 z-20 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2.5 px-6 py-2 bg-black/80 border border-[#ecb613]/40 rounded-full shadow-[0_0_35px_rgba(236,182,19,0.15)] backdrop-blur-xl group hover:border-[#ecb613] transition-all">
          <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-zinc-300">
            PROTOCOLO S-CLASS // AUDITORÍA ACÚSTICA & CONVERSIÓN DIRECTA
          </span>
        </div>

        <h1 className="mt-5 text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-syne max-w-4xl leading-[1.1]">
          SISTEMA OPERATIVO DE <span className="text-[#ecb613] italic">EVENTOS & MATCHMAKING</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mt-3 leading-relaxed">
          Selecciona tu perfil para acceder directamente a la experiencia especializada con cálculo de potencia, tarifas homologadas y bloqueo de fecha.
        </p>
      </div>

      {/* 🎴 4 SOVEREIGN GATEWAYS (DIRECT 1-CLICK EXPERIENCE) */}
      <div className="w-full flex-1 px-4 lg:px-8 pb-8 z-20 max-w-7xl mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-[480px]">
          {PROFILES.map((p) => {
            const Icon = p.icon;
            const isHovered = hoveredId === p.id;

            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardNavigation(p.href)}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 cursor-pointer group ${
                  isHovered 
                    ? 'border-[#ecb613] shadow-[0_0_50px_rgba(236,182,19,0.3)] scale-[1.02]' 
                    : 'border-white/10 hover:border-white/30 bg-[#09090d]/80'
                }`}
                style={{
                  background: isHovered 
                    ? `linear-gradient(180deg, ${p.accentColor}18 0%, #050505 100%)` 
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
                <div className="relative z-10 space-y-3">
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
                      className="text-[8px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full border uppercase truncate max-w-[130px]"
                      style={{ 
                        backgroundColor: `${p.accentColor}10`, 
                        borderColor: `${p.accentColor}30`,
                        color: p.accentColor 
                      }}
                    >
                      {p.badge.split('//')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-syne">
                      {p.name}
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mt-1 font-bold">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Middle Section: Description & Stats */}
                <div className="relative z-10 space-y-3 my-4">
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
                    {p.stats.map((s, idx) => (
                      <div key={idx} className="bg-black/50 p-2 rounded-xl border border-white/5">
                        <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider block truncate">{s.label}</span>
                        <span className="text-[11px] font-bold font-mono text-white mt-0.5 block truncate" style={{ color: p.accentColor }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Section: Direct Action CTA Button */}
                <div className="relative z-10 pt-2">
                  <Link
                    href={p.href}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-all duration-300 shadow-md group-hover:shadow-lg active:scale-95 text-center cursor-pointer"
                    style={{
                      backgroundColor: isHovered ? p.accentColor : 'rgba(255,255,255,0.08)',
                      color: isHovered ? '#000' : '#fff',
                      border: `1px solid ${isHovered ? p.accentColor : 'rgba(255,255,255,0.15)'}`
                    }}
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight size={15} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
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
