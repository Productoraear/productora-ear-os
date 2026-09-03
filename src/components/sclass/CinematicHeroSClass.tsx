'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Calendar, 
  Building2, 
  Landmark, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface ProfileJourney {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  ctaText: string;
  href: string;
  icon?: React.ElementType;
  isColibri?: boolean;
  accentColor: string;
  bgImage: string;
  stats: { label: string; value: string }[];
}

const PROFILES: ProfileJourney[] = [
  {
    id: 'artistas',
    name: 'ARTISTAS',
    badge: 'ROSTER S-CLASS // THE SIGNAL',
    subtitle: 'REPRESENTACIÓN & BOLSA DE EMPLEO',
    description: 'Accede a producciones de primer nivel sin intermediarios abusivos. Retén el 80% de tus honorarios bajo contrato soberano homologado y auditoría acústica continua.',
    ctaText: 'Acceder a Roster Artistas',
    href: '/artistas',
    icon: Mic,
    accentColor: '#f43f5e',
    bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Split Artista', value: '80% Neto' },
      { label: 'Paciente Cero', value: 'Edwin Agudelo' }
    ]
  },
  {
    id: 'eventos',
    name: 'EVENTOS',
    badge: 'B2C ÉLITE // UNIO',
    subtitle: 'BODAS & GRANDES CELEBRACIONES',
    description: 'Músicos profesionales y sonido de alta fidelidad para ceremonias, aniversarios y veladas memorables. Presupuesto cerrado al instante con Price-Lock de 72h garantizado.',
    ctaText: 'Ver Ocasiones & Celebraciones',
    href: '/eventos',
    icon: Calendar,
    accentColor: '#f59e0b',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Garantía Acústica', value: '12 W/pax' },
      { label: 'Price-Lock', value: '72h SHA-256' }
    ]
  },
  {
    id: 'empresas',
    name: 'EMPRESAS',
    badge: 'B2B PARTNERS // PLANNERS',
    subtitle: 'RED DE FINCAS & PROVEEDORES',
    description: 'Eleva el estándar sonoro recomendando producción técnica de máxima solvencia. Directorio homologado y gestión de perfil verificado en 2 pasos.',
    ctaText: 'Directorio B2B Homologado',
    href: '/proveedores',
    icon: Building2,
    accentColor: '#10b981',
    bgImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Comisión Partner', value: '10% Directo' },
      { label: 'Verificación', value: '2FA Activo' }
    ]
  },
  {
    id: 'instituciones',
    name: 'INSTITUCIONES',
    badge: 'B2G // GOBIERNOS & MUNICIPIOS',
    subtitle: 'LICITACIONES & CATÁLOGO 360',
    description: 'Servicios municipales, fiestas patronales y recepciones de estado. Tramitación directa por contrato menor conforme al Art. 118 LCSP sin fricción.',
    ctaText: 'Catálogo Institucional B2G',
    href: '/ayuntamientos',
    icon: Landmark,
    accentColor: '#06b6d4',
    bgImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Tramitación LCSP', value: 'Art. 118 LCSP' },
      { label: 'Presupuesto Máx', value: '< 15.000 €' }
    ]
  },
  {
    id: 'vimume',
    name: 'PROYECTO VIMUME',
    badge: 'NEUROACÚSTICA // 40 HZ',
    subtitle: 'VIAJE MUSICAL POR LA MEMORIA',
    description: 'Protocolo neuroacústico a 40 Hz Gamma (<75 dB SPL) para residencias de mayores y centros de día. El colibrí que poliniza recuerdos y bienestar emocional.',
    ctaText: 'Desplegar Protocolo VIMUME',
    href: '/vimume',
    isColibri: true,
    accentColor: '#8b5cf6',
    bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Frecuencia Gamma', value: '40 Hz Sonora' },
      { label: 'Límite Acústico', value: '< 75 dB SPL' }
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
    <section className="relative w-full min-h-[85vh] bg-[#030305] text-white flex flex-col justify-between overflow-hidden selection:bg-[#ecb613] selection:text-black pb-12">
      
      {/* 👑 ENCABEZADO MINIMALISTA CON CENTRO GRAVITACIONAL DIAMANTE */}
      <div className="pt-24 sm:pt-28 pb-8 px-4 z-20 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-black/70 border border-[#00E5FF]/30 rounded-full backdrop-blur-2xl shadow-[0_0_25px_rgba(0,229,255,0.2)]">
          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#FF1A2A]/60 shadow-[0_0_10px_rgba(255,26,42,0.6)] shrink-0">
            <Image
              src="/images/brand/ear_diamante_central.png"
              alt="Productora EAR Diamante Central"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-white">
            PRODUCTORA EAR // CENTRO GRAVITACIONAL
          </span>
        </div>

        <h1 className="mt-5 text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-syne max-w-4xl leading-[1.15]">
          CENTRO GRAVITACIONAL // <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1A2A] via-[#00E5FF] to-white italic">5 EJES SOBERANOS</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mt-3 leading-relaxed">
          Selecciona tu eje operativo para acceder a la infraestructura especializada, tarifas homologadas y gestión soberana.
        </p>
      </div>

      {/* 🎴 LOS 5 EJES PRINCIPALES SOBERANOS */}
      <div className="w-full flex-1 px-4 lg:px-6 pb-4 z-20 max-w-[1500px] mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 h-full min-h-[490px]">
          {PROFILES.map((p) => {
            const Icon = p.icon;
            const isHovered = hoveredId === p.id;

            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardNavigation(p.href)}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between p-5 sm:p-6 cursor-pointer group ${
                  isHovered 
                    ? 'shadow-[0_0_50px_rgba(0,0,0,0.8)] scale-[1.02]' 
                    : 'border-white/10 hover:border-white/20 bg-[#08090d]/90'
                }`}
                style={{
                  borderColor: isHovered ? p.accentColor : undefined,
                  background: isHovered 
                    ? `linear-gradient(180deg, ${p.accentColor}18 0%, #050507 100%)` 
                    : undefined
                }}
              >
                {/* Fondo sutil con viñeta oscura */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none mix-blend-luminosity"
                  style={{ backgroundImage: `url(${p.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/80 to-transparent pointer-events-none" />

                {/* Sección Superior: Icono (o Colibrí) & Badge */}
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div 
                      className="p-2.5 rounded-2xl border transition-transform duration-300 group-hover:scale-110 flex items-center justify-center min-w-[44px] min-h-[44px]"
                      style={{ 
                        backgroundColor: `${p.accentColor}15`, 
                        borderColor: `${p.accentColor}40`,
                        color: p.accentColor 
                      }}
                    >
                      {p.isColibri ? (
                        <div className="relative w-7 h-7">
                          <Image
                            src="/images/brand/colibri_isotipo.png"
                            alt="Colibrí VIMUME - Sebastián Díaz"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : Icon ? (
                        <Icon size={20} />
                      ) : null}
                    </div>

                    <span 
                      className="text-[8px] font-mono font-bold tracking-wider px-2 py-1 rounded-full border uppercase truncate max-w-[120px]"
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
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-syne">
                      {p.name}
                    </h3>
                    <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 mt-0.5 font-semibold line-clamp-1">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Sección Media: Descripción & Métricas */}
                <div className="relative z-10 space-y-3 my-3">
                  <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-3">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
                    {p.stats.map((s, idx) => (
                      <div key={idx} className="bg-black/60 p-2 rounded-xl border border-white/5">
                        <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-wider block truncate">{s.label}</span>
                        <span className="text-[10.5px] font-bold font-mono text-white mt-0.5 block truncate" style={{ color: p.accentColor }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección Inferior: Botón de Acción Directo */}
                <div className="relative z-10 pt-2">
                  <Link
                    href={p.href}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full py-3 px-3.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-all duration-300 shadow-md group-hover:shadow-lg active:scale-95 text-center cursor-pointer"
                    style={{
                      backgroundColor: isHovered ? p.accentColor : 'rgba(255,255,255,0.06)',
                      color: isHovered ? '#000' : '#fff',
                      border: `1px solid ${isHovered ? p.accentColor : 'rgba(255,255,255,0.12)'}`
                    }}
                  >
                    <span className="truncate pr-1">{p.ctaText}</span>
                    <ArrowRight size={14} className={`shrink-0 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
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
