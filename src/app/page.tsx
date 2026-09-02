import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Heart, Building2, Music2, ShieldCheck, HeartPulse, 
  ArrowRight, Network, Compass, PhoneCall, ChevronRight, CheckCircle2,
  Sliders, Database, Bot, Cpu, Zap, Volume2
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

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

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Herramienta Vital 1: The Oracle */}
          <Link
            href="/oraculo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/40 text-xs font-mono tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(245,197,56,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>The Oracle</span>
          </Link>

          {/* Herramienta Vital 2: El Vampirizador */}
          <Link
            href="/vampiro"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400 border border-cyan-500/30 text-xs font-mono tracking-wider font-semibold transition-all shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vampirizador</span>
            <span className="sm:hidden">Arsenal</span>
          </Link>

          {/* Botón Destacado: Mapa Mental Ecosistema */}
          <Link
            href="/ecosistema"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono tracking-wider transition-all shadow-sm"
          >
            <Network className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Ecosistema</span>
          </Link>

          <Link
            href="/contacto"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span className="hidden lg:inline">{CENTRALITA.display}</span>
          </Link>
        </div>
      </header>

      {/* ── SECCIÓN CENTRAL: LOS 5 ACCESOS S-CLASS ── */}
      <section className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-10 sm:py-14 my-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
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
                {/* Header de la Tarjeta */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}>
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

                {/* Métricas y Call to Action */}
                <div>
                  {/* Métricas fijas */}
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

                  {/* Botón CTA */}
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

        {/* ── CONSOLA DUAL DE HERRAMIENTAS VITALES S-CLASS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-10">
          {/* Herramienta 1: The Oracle */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Simulador Predictivo</span>
                </span>
                <span className="text-xs font-mono text-zinc-400">Audio 12 W/pax</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif mb-1 group-hover:text-amber-300 transition-colors">
                The Oracle · Simulador de Presupuesto S-Class
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Calcula en tiempo real la probabilidad de éxito de tu evento, ratio de potencia acústica para evitar la asfixia sonora y bloqueo de precio garantizado con Price-Lock 72h.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <span className="text-xs font-mono text-emerald-400 font-bold">● Simulación en Vivo Activa</span>
              <Link
                href="/oraculo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase transition-all shadow-md"
              >
                <span>Abrir The Oracle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Herramienta 2: El Vampirizador */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-zinc-900/90 to-zinc-950 border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex flex-col justify-between shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                  <Database className="w-3 h-3" />
                  <span>Crawler Forense de Mercado</span>
                </span>
                <span className="text-xs font-mono text-zinc-400">13.977 Registros</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif mb-1 group-hover:text-cyan-300 transition-colors">
                El Vampirizador · Arsenal & Proveedores Homologados
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Acceso a los catálogos técnicos de sonido Sonomusic, alumbrado monumental B2G Demetrio, flota de transporte VIP y tarifas soberanas con split 80/10/10 sin intermediarios.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <span className="text-xs font-mono text-cyan-400 font-bold">● Bóvedas Sincronizadas</span>
              <Link
                href="/vampiro"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase transition-all shadow-md"
              >
                <span>Explorar Arsenal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PIE DE PÁGINA VANGUARDISTA ── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>EAR OS Bare-Metal · Despliegue Soberano 2026</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
          <Link href="/oraculo" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">The Oracle</Link>
          <Link href="/vampiro" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">Vampirizador</Link>
          <Link href="/ecosistema" className="hover:text-amber-400 transition-colors">Ecosistema</Link>
          <Link href="/contratacion/ayuntamientos" className="hover:text-amber-400 transition-colors">B2G</Link>
          <Link href="/artistas/edwin-agudelo" className="hover:text-amber-400 transition-colors">Paciente Cero</Link>
          <Link href="/vimume" className="hover:text-amber-400 transition-colors">VIMUME</Link>
          <Link href="/contacto" className="hover:text-amber-400 transition-colors">Contacto 24/7</Link>
        </div>
      </footer>
    </main>
  );
}
