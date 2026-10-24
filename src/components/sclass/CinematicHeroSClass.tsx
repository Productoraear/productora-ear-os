'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Mic,
  Calendar,
  Building2,
  Landmark,
  ArrowRight,
  Heart,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSharedContext } from '@/app/context/SharedContext';

export interface ProfileJourney {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  ctaText: string;
  href: string;
  icon?: any;
  accentColor: string;
  bgImage: string;
  stats: { label: string; value: string }[];
}

const PROFILES: ProfileJourney[] = [
  {
    id: 'artistas',
    name: 'MARIACHIS & SOLISTA',
    badge: 'artistaseuropa.com',
    subtitle: 'ARTISTASEUROPA.COM // BOOKING S-CLASS',
    description: 'Voz lírica y catálogo de mariachis de primer nivel para bodas, aniversarios y grandes recepciones con Edwin Agudelo (Tenor). Máxima emoción sin intermediarios.',
    ctaText: 'Ver Repertorio & Contratar',
    href: '/reservar/solista',
    icon: Mic,
    accentColor: '#ecb613',
    bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Artista Insignia', value: 'Edwin Agudelo (Tenor)' },
      { label: 'Garantía Acústica', value: '12 W/pax Bose' }
    ]
  },
  {
    id: 'eventos',
    name: 'BODAS & EVENTOS',
    badge: 'productoraear.com',
    subtitle: 'COTIZADOR EN 1 CLIC // PRECIOS OFICIALES',
    description: 'Ceremonia, cóctel y fiesta de barra libre con sonido de alta fidelidad sin acoples. Presupuesto cerrado al instante con fianza protegida de 100 €.',
    ctaText: 'Cotizar Evento al Instante',
    href: '/calculadora',
    icon: Calendar,
    accentColor: '#f59e0b',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Fianza Protegida', value: '100 € Stripe' },
      { label: 'Despacho Rápido', value: 'Confirmación 24h' }
    ]
  },
  {
    id: 'empresas',
    name: 'FINCAS & EMPRESAS',
    badge: 'fincasparaboda.com',
    subtitle: 'FINCASPARABODA.COM // PROTECCIÓN <75 dB',
    description: 'Directorio homologado en fincasparaboda.com. Blindaje acústico contra sanciones vecinales y comisiones del 10% directo para el espacio colaborador.',
    ctaText: 'FincasParaBoda.com & Alianzas',
    href: '/fincas/portal-demostrativo',
    icon: Building2,
    accentColor: '#10b981',
    bgImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Comisión Partner', value: '10% Directo' },
      { label: 'Certificado Acústico', value: '< 75 dB SPL' }
    ]
  },
  {
    id: 'instituciones',
    name: 'AYUNTAMIENTOS',
    badge: 'sector público b2g',
    subtitle: 'CONTRATACIÓN MENOR ART. 118 LCSP',
    description: 'Espectáculos para fiestas patronales, pregones y día del mayor. Tramitación administrativa directa acotada a pliego técnico menor sin fricción (< 14.250 €).',
    ctaText: 'Catálogo Institucional B2G',
    href: '/ayuntamientos',
    icon: Landmark,
    accentColor: '#00E5FF',
    bgImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Régimen Jurídico', value: 'Art. 118 LCSP' },
      { label: 'Presupuesto Máx', value: '< 14.250 €' }
    ]
  },
  {
    id: 'vimume',
    name: 'IMPACTO SOCIAL VIMUME',
    badge: 'viajemusicalporlamemoria.com',
    subtitle: 'VIAJEMUSICALPORLAMEMORIA.COM · 40 HZ',
    description: 'Protocolo neuroacústico a 40 Hz Gamma para centros de mayores. Deducción fiscal de hasta el 80% en IRPF o Sociedades (Ley 49/2002) y SROI 4.85x.',
    ctaText: 'ViajeMusicalPorLaMemoria.com',
    href: '/vimume',
    icon: Heart,
    accentColor: '#00E5FF',
    bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Deducción Fiscal', value: 'Hasta 80% Ley 49' },
      { label: 'Retorno Social', value: 'SROI 4.85x' }
    ]
  }
];

const QUICK_CATEGORIES: { label: string; href: string }[] = [
  { label: 'Fincas', href: '/fincas' },
  { label: 'Mariachis', href: '/simulacion-mariachis' },
  { label: 'DJs', href: '/artistas/djs' },
  { label: 'Catering', href: '/proveedores' },
  { label: 'Solista 350 €', href: '/reservar/solista' },
  { label: 'Ayuntamientos', href: '/ayuntamientos' },
  { label: 'VIMUME', href: '/vimume' }
];

export default function CinematicHeroSClass() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();
  const { setIsSearchOpen } = useSharedContext();

  const handleCardNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <section className="relative w-full min-h-[85vh] bg-[#030305] text-white flex flex-col justify-between overflow-hidden selection:bg-[#ecb613] selection:text-black pb-12">

      {/* 👑 HERO COMERCIAL DE ALTA GAMA PRODUCTORA EAR */}
      <div className="pt-8 sm:pt-12 pb-6 px-4 z-20 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/70 border border-[#ecb613]/30 rounded-full backdrop-blur-2xl shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#ecb613]">
            PRODUCCIÓN MUSICAL & ESPECTÁCULOS EN DIRECTO
          </span>
        </div>

        <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-syne max-w-4xl leading-tight">
          MÚSICA EN DIRECTO DE ALTA GALA // <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c538] via-[#ecb613] to-[#b38805] italic">EVENTOS INOLVIDABLES</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-200 font-sans font-normal max-w-2xl mt-3 leading-relaxed">
          Mariachis de gala, solistas líricos y producción técnica de alta fidelidad para bodas, celebraciones exclusivas y recepciones oficiales. Presupuesto garantizado con reserva inmediata.
        </p>

        {/* 🔍 BARRA DE BÚSQUEDA CENTRAL (PATRÓN BODAS.NET / ZOLA) */}
        <div className="mt-6 w-full max-w-2xl px-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Abrir buscador global de proveedores y servicios"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#ecb613]/50 backdrop-blur-xl transition-all duration-300 group text-left shadow-lg shadow-black/40"
          >
            <Search className="w-5 h-5 text-[#ecb613] shrink-0" />
            <span className="flex-1 text-sm text-zinc-200 group-hover:text-white truncate">
              Busca fincas, mariachis, DJs, catering, sonido…
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-zinc-300 border border-white/15 rounded-md px-2 py-1">
              Ctrl&nbsp;K
            </span>
            <span className="shrink-0 bg-[#ecb613] text-black font-bold text-xs px-4 py-2 rounded-full group-hover:brightness-110 transition-all">
              Buscar
            </span>
          </button>

          {/* Píldoras de categoría (acceso directo multirrol) */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {QUICK_CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 hover:border-[#ecb613] text-xs font-semibold text-zinc-200 transition-all duration-300"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 🎴 LOS 5 EJES PRINCIPALES SOBERANOS */}
      <div className="w-full flex-1 px-4 lg:px-6 pb-4 z-20 max-w-[1500px] mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 h-full min-h-[490px]">
          {PROFILES.map((p, index) => {
            const Icon = p.icon;
            const isHovered = hoveredId === p.id;

            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardNavigation(p.href)}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between p-5 sm:p-6 cursor-pointer group ${isHovered
                  ? 'shadow-[0_0_50px_rgba(0,0,0,0.8)] scale-[1.02]'
                  : 'border-white/10 hover:border-white/30 bg-[#0a0a0f]/70'
                  }`}
                style={{
                  borderColor: isHovered ? p.accentColor : undefined,
                  background: isHovered
                    ? `linear-gradient(180deg, ${p.accentColor}18 0%, #050507 100%)`
                    : undefined
                }}
              >
                {/* Fondo sutil con viñeta oscura */}
                <Image
                  src={p.bgImage}
                  alt=""
                  aria-hidden="true"
                  fill
                  unoptimized
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 20vw"
                  className="object-cover opacity-100 transition-all duration-700 pointer-events-none group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/95 via-[#050507]/55 to-[#050507]/30 pointer-events-none" />

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
                      {Icon && <Icon size={20} />}
                    </div>

                    <span
                      className="text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded-full border uppercase truncate max-w-[140px]"
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
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 mt-0.5 font-semibold line-clamp-1">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Sección Media: Descripción & Métricas */}
                <div className="relative z-10 space-y-3 my-3">
                  <p className="text-[13px] text-zinc-100 leading-relaxed font-normal line-clamp-3">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
                    {p.stats.map((s, idx) => (
                      <div key={idx} className="bg-black/60 p-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider block truncate">{s.label}</span>
                        <span className="text-xs font-bold font-mono mt-0.5 block truncate" style={{ color: p.accentColor }}>
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
                    className="w-full py-3 px-3.5 rounded-xl font-bold text-sm font-mono uppercase tracking-wider flex items-center justify-between transition-all duration-300 shadow-md group-hover:shadow-lg active:scale-95 text-center cursor-pointer"
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
