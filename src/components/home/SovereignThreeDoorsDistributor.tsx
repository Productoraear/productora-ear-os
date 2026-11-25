'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Music,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Crown,
  Zap,
} from 'lucide-react';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';

interface DoorItem {
  readonly id: string;
  readonly code: string;
  readonly href: string;
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
  readonly highlights: readonly string[];
  readonly cta: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly accentBorder: string;
  readonly accentGlow: string;
  readonly badgeBg: string;
  readonly badgeText: string;
}

const DOORS_CONFIG: readonly DoorItem[] = Object.freeze([
  {
    id: 'door-fincas',
    code: 'ESPACIOS',
    href: '/fincas',
    kicker: 'PUERTA 01 · 52 PROVINCIAS',
    title: 'Fincas, Caseríos & Alta Restauración',
    subtitle: 'Buscador y recomendador asistido en toda España con filtros dinámicos de aforo, estilo y menús oficiales.',
    highlights: [
      'Aforos homologados de 50 a 350 comensales',
      'Nodo destacado: Otzarreta (Derio · Bizkaia)',
      `Confort acústico Ley 37/2003 (< ${LIMITE_SPL_DB} dB SPL)`,
    ],
    cta: 'Explorar Fincas y Asadores',
    icon: Building2,
    accentBorder: 'hover:border-amber-500/60',
    accentGlow: 'hover:shadow-[0_0_30px_rgba(236,182,19,0.2)]',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  {
    id: 'door-artistas',
    code: 'ARTISTAS',
    href: '/artistas',
    kicker: 'PUERTA 02 · ROSTER NACIONAL',
    title: 'Música en Directo & Roster S-Class',
    subtitle: 'Catálogo nacional de agrupaciones de gala, solistas líricos, mariachis, clásica y DJs en las 52 provincias.',
    highlights: [
      `Edwin Agudelo (Solista Lírico ${TARIFA_BASE_SOLISTA_EUR} € / 100 km)`,
      'Mariachis, cuerdas, pop y DJs de gala',
      'Rider sonoro Shure Axient & Bose incluido',
    ],
    cta: 'Ver Catálogo de Artistas',
    icon: Music,
    accentBorder: 'hover:border-cyan-500/60',
    accentGlow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-400',
  },
  {
    id: 'door-produccion',
    code: 'TECNICA',
    href: '/produccion',
    kicker: 'PUERTA 03 · INGENIERÍA ESCÉNICA',
    title: 'Producción Técnica & Audiovisuales',
    subtitle: 'Configurador de sonido Line Array, iluminación monumental y pantallas LED con cálculo de potencia acústica.',
    highlights: [
      'Presión sonora lineal 12 W/pax homologada',
      'Cálculo de acometida mono y trifásica',
      `Licitaciones B2G Art. 118 LCSP (< ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €)`,
    ],
    cta: 'Configurar Producción Técnica',
    icon: Sliders,
    accentBorder: 'hover:border-purple-500/60',
    accentGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-400',
  },
]);

/**
 * ════════════════════════════════════════════════════════════════════════════
 * DISTRIBUIDOR SOBERANO DE 3 PUERTAS · EXPERIENCIA CINEMATOGRÁFICA HOME
 * ════════════════════════════════════════════════════════════════════════════
 * Erradica todo apilamiento vertical mono-proveedor. Presenta el punto de
 * entrada canónico de Productora EAR sobre fondo Onyx (#030305).
 * ════════════════════════════════════════════════════════════════════════════
 */
export function SovereignThreeDoorsDistributor(): React.JSX.Element {
  const artistPct = Math.round(SPLIT_SOBERANO.artista * 100);
  const earOsPct = Math.round(SPLIT_SOBERANO.earOs * 100);
  const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16">
      {/* ── HERO INSTITUCIONAL SOBRIO ───────────────────────────────────── */}
      <div className="text-center space-y-5 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
          <Sparkles size={13} />
          <span>Distribuidor Soberano de Contratación Directa · 52 Provincias</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white font-syne tracking-tight leading-[1.08]">
          Arquitectura Operativa para Grandes Celebraciones, Fincas y Espectáculos
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
          Sin intermediarios inflados. Acceso directo a espacios homologados, artistas en exclusiva y técnica de concierto con fianza deducible de{' '}
          <strong className="text-white font-medium">{DEPOSITO_STRIPE_EUR} €</strong> y split soberano{' '}
          <strong className="text-[#ecb613] font-mono font-medium">{artistPct}/{earOsPct}/{vimumePct}</strong>.
        </p>

        {/* Cintas de Garantía SRE */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Fianza Deducible {DEPOSITO_STRIPE_EUR} €</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#ecb613]" />
            <span>52 Provincias Homologadas</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1.5">
            <Zap size={14} className="text-cyan-400" />
            <span>Acústica Ley 37/2003</span>
          </span>
          <a
            href={`tel:${CENTRALITA_EAR_OS}`}
            className="px-3 py-1.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] hover:bg-[#ecb613]/20 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Phone size={13} />
            <span>Centralita: {CENTRALITA_EAR_OS}</span>
          </a>
        </div>
      </div>

      {/* ── SELECTOR EXCLUSIVO DE LAS 3 PUERTAS ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {DOORS_CONFIG.map((door) => {
          const Icon = door.icon;
          return (
            <Link
              key={door.id}
              href={door.href}
              className={`group flex flex-col justify-between rounded-3xl bg-[#09090d]/90 border border-white/10 p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 ${door.accentBorder} ${door.accentGlow} hover:-translate-y-1`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${door.badgeBg} flex items-center justify-center ${door.badgeText} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${door.badgeBg} ${door.badgeText}`}>
                    {door.kicker}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-syne text-white uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">
                    {door.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                    {door.subtitle}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-white/5 text-xs font-mono text-zinc-300">
                  {door.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#ecb613] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-white group-hover:text-[#ecb613] transition-colors">
                  {door.cta}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-[#ecb613] group-hover:text-black group-hover:border-[#ecb613] transition-all">
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── MATRIZ DE LOS 4 PILARES: AIRBNB + UBER + TINDER + CABALLO DE TROYA ── */}
      <div className="pt-6 border-t border-white/10 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ecb613] font-bold">
            DOCTRINA OPERACIONAL TRIPARTITA &amp; CATÁLOGO NORMALIZADO
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-syne text-white uppercase tracking-tight">
            Arquitectura de Confianza, Despacho y Afinidad Matemática
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. AIRBNB */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3 font-mono text-xs hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                🏡 AIRBNB
              </span>
              <span className="text-[10px] text-zinc-500">Confianza &amp; Sede</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">Ficha de Alta Fidelidad</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li>• Calendario atómico con bloqueo 1 clic</li>
              <li>• Fianza deducible de {DEPOSITO_STRIPE_EUR} € (Price-Lock)</li>
              <li>• Contrato eIDAS firmado con SHA-256</li>
              <li>• Menús auditados con celíacos a 0 €</li>
            </ul>
          </div>

          {/* 2. UBER */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3 font-mono text-xs hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                🚗 UBER
              </span>
              <span className="text-[10px] text-zinc-500">Despacho &amp; Flota</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">Logística Determinista</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li>• 100 km incluidos desde Méntrida</li>
              <li>• Waybill técnico: montaje 2h antes</li>
              <li>• Acometida trifásica 32A/63A garantizada</li>
              <li>• Split Soberano {artistPct}/{earOsPct}/{vimumePct} automático</li>
            </ul>
          </div>

          {/* 3. TINDER */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3 font-mono text-xs hover:border-pink-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30">
                🔥 TINDER
              </span>
              <span className="text-[10px] text-zinc-500">Match &amp; Afinidad</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">Buy Box S-Class</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li>• Triaje en 3 pasos (Fecha + Aforo + Presupuesto)</li>
              <li>• Fin del scroll infinito de 500 opciones</li>
              <li>• Ecuación de compatibilidad ponderada</li>
              <li>• Top 3 de máxima afinidad (It's a Match)</li>
            </ul>
          </div>

          {/* 4. BODAS.NET */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3 font-mono text-xs hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                🏰 BODAS.NET
              </span>
              <span className="text-[10px] text-zinc-500">Caballo de Troya</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">Censo Normalizado ASIN</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li>• Identificador universal EAR_ASIN_ID</li>
              <li>• 380 campos tipados en esquema Zod</li>
              <li>• 0% comisión a la comida de banquetes</li>
              <li>• Contact-Gate Centralita ({CENTRALITA_EAR_OS})</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── FOOTER DE INFRAESTRUCTURA Y SALVAGUARDAS ─────────────────────── */}
      <footer className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <Crown size={14} className="text-[#ecb613]" />
          <span>EAR OS Tier-1 · Distribuidor Soberano de Contratación Directa</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/fincas" className="hover:text-zinc-300 transition-colors">Fincas</Link>
          <Link href="/artistas" className="hover:text-zinc-300 transition-colors">Artistas</Link>
          <Link href="/produccion" className="hover:text-zinc-300 transition-colors">Producción</Link>
          <Link href="/presupuesto" className="hover:text-zinc-300 transition-colors">Cotizador</Link>
          <Link href="/seating-planner" className="hover:text-zinc-300 transition-colors">Seating Planner</Link>
          <Link href="/confianza" className="hover:text-zinc-300 transition-colors">Garantías</Link>
          <Link href="/portal/proveedor" className="hover:text-zinc-300 transition-colors">Área Proveedor</Link>
        </div>
      </footer>
    </div>
  );
}
