'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Heart, Building2, Music2, ShieldCheck, HeartPulse, 
  ArrowRight, Network, PhoneCall, Sliders, Database, 
  Search, SlidersHorizontal, CreditCard, ChevronRight, CheckCircle2,
  Volume2, Shield, Calendar, Users, Zap
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import MultiPricer from '@/components/pricing/MultiPricer';
import TinderMatcherClient from '@/components/pricing/TinderMatcherClient';
import DiscoverySearch from '@/components/search/DiscoverySearch';

interface AccessCard {
  id: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string; highlight?: boolean }[];
  ctaText: string;
  ctaHref: string;
  accentBorder: string;
  accentGlow: string;
}

const FIVE_ACCESS_CARDS: AccessCard[] = [
  // 1. EVENTOS (B2C Élite)
  {
    id: 'acceso-eventos',
    badge: 'B2C ÉLITE',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    icon: Heart,
    iconColor: 'text-amber-400',
    title: 'EVENTOS',
    subtitle: 'MÚSICA, BODAS & FECHAS SEÑALADAS',
    description: 'Músicos de conservatorio y acústica de alta fidelidad para parejas y enlaces inolvidables. Serenatas sorpresa, aniversarios de gala y festividades privadas con presupuesto cerrado y Price-Lock 72h.',
    metrics: [
      { label: 'GARANTÍA ACÚSTICA', value: '12 W/pax', highlight: true },
      { label: 'PRICE-LOCK', value: '72h SHA-256', highlight: true }
    ],
    ctaText: 'ACTIVAR TÚNEL DE COTIZACIÓN',
    ctaHref: '/bodas',
    accentBorder: 'hover:border-amber-500/50',
    accentGlow: 'group-hover:shadow-[0_0_30px_rgba(245,197,56,0.15)]'
  },
  // 2. ARTISTAS (Talento & Roster S-Class)
  {
    id: 'acceso-artistas',
    badge: 'ROSTER S-CLASS',
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    icon: Music2,
    iconColor: 'text-purple-400',
    title: 'ARTISTAS',
    subtitle: 'THE SIGNAL & EDWIN AGUDELO',
    description: 'Accede a producciones vocales de primer nivel sin intermediarios. Roster de solistas, mariachi y ensambles de gala con el 80% de honorarios directos al artista, EAR Studio y hojas de ruta (Waybills).',
    metrics: [
      { label: 'SPLIT ARTISTA', value: '80% Neto' },
      { label: 'PACIENTE CERO', value: 'Edwin Agudelo', highlight: true }
    ],
    ctaText: 'ENTRAR A THE SIGNAL',
    ctaHref: '/artistas',
    accentBorder: 'hover:border-purple-500/50',
    accentGlow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
  },
  // 3. INSTITUCIONES (B2G Sector Público)
  {
    id: 'acceso-instituciones',
    badge: 'B2G SECTOR PÚBLICO',
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    title: 'INSTITUCIONES',
    subtitle: 'AYUNTAMIENTOS, GOBIERNOS & FUNDACIONES',
    description: 'Solvencia técnica para contratación pública sin fricción burocrática. Fiestas patronales, alumbrado navideño, FITUR, cenas de estado y corredor preferente comarcal (Navalcarnero - Méntrida).',
    metrics: [
      { label: 'TRAMITACIÓN', value: 'Art. 118 LCSP', highlight: true },
      { label: 'MEMORIA TÉCNICA', value: 'Lista en 24h' }
    ],
    ctaText: 'DESPLEGAR PROTOCOLO B2G',
    ctaHref: '/contratacion/ayuntamientos',
    accentBorder: 'hover:border-emerald-500/50',
    accentGlow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  },
  // 4. EMPRESAS (B2B Corporativo & Arsenal)
  {
    id: 'acceso-empresas',
    badge: 'B2B CORPORATIVO',
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    icon: Building2,
    iconColor: 'text-blue-400',
    title: 'EMPRESAS',
    subtitle: 'GALAS, PROVEEDORES & AFILIADOS',
    description: 'Producción ejecutiva para eventos corporativos, congresos y ferias IFEMA. Red de proveedores homologados (sonido, pantallas LED, catering, transporte VIP) con sistema de afiliación y comisiones 2FA.',
    metrics: [
      { label: 'COMISIÓN PARTNER', value: '10% Directo', highlight: true },
      { label: 'VERIFICACIÓN', value: '2FA Activo' }
    ],
    ctaText: 'DIRECTORIO & ARSENAL B2B',
    ctaHref: '/ocasiones/corporativo',
    accentBorder: 'hover:border-blue-500/50',
    accentGlow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
  },
  // 5. PROYECTO VIMUME (Impacto Social)
  {
    id: 'acceso-vimume',
    badge: '40HZ NEUROACÚSTICA',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    icon: HeartPulse,
    iconColor: 'text-cyan-400',
    title: 'VIMUME',
    subtitle: 'ESTIMULACIÓN COGNITIVA & ODS 2030',
    description: 'Protocolo de neuroestimulación acústica sincronizada a 40Hz para centros residenciales y personas mayores. Sistema neuronal para familiares y terapeutas, y evento anual "Nuestros Héroes".',
    metrics: [
      { label: 'NEUROFRECUENCIA', value: '40Hz Gamma', highlight: true },
      { label: 'IMPACTO SOCIAL', value: 'Agenda 2030' }
    ],
    ctaText: 'CONOCER PROTOCOLO VIMUME',
    ctaHref: '/vimume',
    accentBorder: 'hover:border-cyan-500/50',
    accentGlow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
  }
];

export default function HomePage() {
  // Pestaña activa en la Consola Interactiva S-Class
  const [activeTab, setActiveTab] = useState<'pricer' | 'matcher' | 'search' | 'oracle'>('pricer');

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Luces de Fondo Ambientales S-Class */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* ── BARRA SUPERIOR VANGUARDISTA CON ACCESOS VITALES ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black border border-amber-500/40 p-2 flex items-center justify-center shadow-lg group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,197,56,0.25)] transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform">
              <path d="M2 12h2l3-7 4 14 3-8 2 5 2-4h4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-base text-white group-hover:text-amber-400 transition-colors font-mono">
              PRODUCTORA EAR
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              S-Class Ecosystem · EAR OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Cotizador MultiPricer */}
          <Link
            href="/cotizador"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/40 text-xs font-mono tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(245,197,56,0.15)]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Cotizador S-Class</span>
          </Link>

          {/* Tinder Matcher */}
          <Link
            href="/matcher"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500 hover:text-white text-purple-300 border border-purple-500/30 text-xs font-mono tracking-wider font-bold transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matcher Artistas</span>
            <span className="sm:hidden">Matcher</span>
          </Link>

          {/* The Oracle */}
          <Link
            href="/oraculo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-800 text-xs font-mono tracking-wider font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Oráculo</span>
          </Link>

          {/* Vampirizador */}
          <Link
            href="/vampiro"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-zinc-800 text-xs font-mono tracking-wider font-semibold transition-all shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Vampirizador</span>
          </Link>

          {/* Mapa Mental Ecosistema */}
          <Link
            href="/ecosistema"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono tracking-wider transition-all shadow-sm"
          >
            <Network className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden lg:inline">Ecosistema</span>
          </Link>

          <a
            href={CENTRALITA.href}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span className="hidden xl:inline">{CENTRALITA.display}</span>
          </a>
        </div>
      </header>

      {/* ── BLOQUE SUPERIOR: LOS 5 ACCESOS S-CLASS DEL MAPA MENTAL ── */}
      <section className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Soberanía Técnica & Producción Ejecutiva</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase font-serif">
            Arquitectura del <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Espectáculo</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Selecciona el canal operativo para acceder a contratación de alta distinción, talento soberano, licitación pública y bienestar cognitivo.
          </p>
        </div>

        {/* Las 5 Tarjetas en Grid Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-5 items-stretch">
          {FIVE_ACCESS_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative flex flex-col justify-between rounded-2xl bg-[#0d0d10]/95 border border-zinc-800/80 p-5 sm:p-6 transition-all duration-300 ${card.accentBorder} ${card.accentGlow} backdrop-blur-xl hover:-translate-y-1.5 shadow-2xl`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white tracking-wide font-serif mb-1 group-hover:text-amber-300 transition-colors uppercase">
                    {card.title}
                  </h2>
                  <h3 className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-semibold mb-4 line-clamp-1">
                    {card.subtitle}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4 mb-6">
                    {card.description}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-900 mb-4">
                    {card.metrics.map((metric, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                          {metric.label}
                        </span>
                        <span className={`text-[10px] font-mono font-bold truncate ${metric.highlight ? 'text-amber-400' : 'text-zinc-200'}`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={card.ctaHref}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900/90 group-hover:bg-amber-500 group-hover:text-black text-zinc-200 border border-zinc-800 group-hover:border-amber-400 text-xs font-mono font-bold tracking-wider transition-all duration-200 shadow-md"
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── BLOQUE INMEDIATO INFERIOR: CONSOLA INTERACTIVA S-CLASS (99%+) ── */}
      <section className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-10 my-4">
        {/* Selector de Pestañas de la Consola Interactiva */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Motores Dinámicos & Deslizadores en Tiempo Real</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-serif tracking-tight text-center">
            Consola de <span className="text-amber-400">Cotización & Matching</span> S-Class
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl text-center mt-2 font-mono">
            Ajusta los deslizadores de aforo, selecciona la ocasión o explora el matching de artistas sin salir de la plataforma.
          </p>

          {/* Botonera de Navegación entre Motores */}
          <div className="flex items-center justify-center gap-2 mt-6 p-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex-wrap shadow-xl">
            <button
              onClick={() => setActiveTab('pricer')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pricer'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>MultiPricer (Cotizador Airbnb)</span>
            </button>

            <button
              onClick={() => setActiveTab('matcher')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'matcher'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Tinder Matcher de Artistas</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Discovery Search</span>
            </button>

            <button
              onClick={() => setActiveTab('oracle')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'oracle'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>The Oracle (12 W/pax)</span>
            </button>
          </div>
        </div>

        {/* ── CONTENEDOR REACTIVO SEGÚN LA PESTAÑA SELECCIONADA ── */}
        <div className="rounded-3xl bg-[#09090d]/90 border border-zinc-800/80 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {activeTab === 'pricer' && (
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono uppercase">
                      Calculadora Interactiva de Inversión & Arsenal S-Class
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Ajusta ocasión, artistas y equipamiento. Price-Lock 72h garantizado con firma SHA-256.
                    </p>
                  </div>
                </div>
                <Link
                  href="/cotizador"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-amber-400 font-bold transition-colors"
                >
                  <span>Pantalla Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Inyección Directa del MultiPricer S-Class (1.093 líneas) */}
              <MultiPricer />
            </div>
          )}

          {activeTab === 'matcher' && (
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono uppercase">
                      Tinder Matcher · Asignación de Formatos por Aforo y Acústica
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Desliza entre formatos artísticos, evalúa capacidad (20 - 1.200 pax) y reserva directa.
                    </p>
                  </div>
                </div>
                <Link
                  href="/matcher"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-purple-300 font-bold transition-colors"
                >
                  <span>Pantalla Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Inyección Directa del Tinder Matcher (551 líneas) */}
              <TinderMatcherClient />
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <div className="text-center max-w-xl mx-auto mb-6">
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  Buscador Predictivo Discovery Search
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Localiza de inmediato disponibilidad por provincia, fechas de evento y tipo de ocasión.
                </p>
              </div>

              {/* Inyección Directa del Discovery Search */}
              <DiscoverySearch />
            </div>
          )}

          {activeTab === 'oracle' && (
            <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-spin" style={{ animationDuration: '10s' }} />
              <h3 className="text-2xl font-bold text-white font-serif uppercase">
                The Oracle · Simulador Acústico & Precios
              </h3>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto mt-2 leading-relaxed font-mono">
                Audita la probabilidad de éxito acústico de tu celebración, ajusta los vatios por asistente (mínimo 12 W/pax con Bose F1) y chatea con la IA protegida contra inyecciones.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Link
                  href="/oraculo"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Abrir Simulador The Oracle
                </Link>
                <Link
                  href="/vampiro"
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Ver Arsenal Vampirizado
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PIE DE PÁGINA VANGUARDISTA ── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>EAR OS Bare-Metal · Despliegue Soberano 2026</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
          <Link href="/cotizador" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">Cotizador</Link>
          <Link href="/matcher" className="text-purple-400 hover:text-purple-300 transition-colors font-bold">Matcher</Link>
          <Link href="/oraculo" className="text-amber-300 hover:text-amber-200 transition-colors">The Oracle</Link>
          <Link href="/vampiro" className="text-cyan-400 hover:text-cyan-300 transition-colors">Vampirizador</Link>
          <Link href="/ecosistema" className="hover:text-amber-400 transition-colors">Ecosistema</Link>
          <Link href="/contratacion/ayuntamientos" className="hover:text-amber-400 transition-colors">B2G</Link>
          <Link href="/artistas/edwin-agudelo" className="hover:text-amber-400 transition-colors">Paciente Cero</Link>
          <Link href="/vimume" className="hover:text-amber-400 transition-colors">VIMUME</Link>
        </div>
      </footer>
    </main>
  );
}
