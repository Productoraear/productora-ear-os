'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * QUANTUM ROLE MORPHING COCKPIT — Selector Multirol Inmersivo S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * 4 Arquetipos Soberanos de EAR OS, alternables sin recarga de página, con:
 *  - Transiciones hápticas (feedback auditivo vía Web Audio API).
 *  - Paletas OLED adaptativas por rol (Oro / Cyan / Rubí / Esmeralda).
 *  - `layoutId` de Framer Motion para el pill activo (cero layout shift).
 *  - Consumo 100% de constantes SSOT. Tipado estricto sin `any`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  AJUSTE_PREVENTIVO_B2G_EUR,
  SPLIT_SOBERANO,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

/* ─── Tipado estricto del dominio (cero `any` implícito) ─── */

type RoleId =
  | 'COUPLE_WEDDING'
  | 'TOWNHALL_B2G'
  | 'SOVEREIGN_ARTIST'
  | 'VENDOR_PARTNER';

interface RoleMetric {
  label: string;
  value: string;
}

interface RoleSpec {
  id: RoleId;
  label: string;
  shortLabel: string;
  subtitle: string;
  badge: string;
  accentHex: string;
  bgGlow: string;
  freqHz: number;
  metrics: RoleMetric[];
  valueProposition: string;
  ctaLabel: string;
  ctaHref: string;
}

/* ─── SSOT consumido (fuente única de verdad, jamás re-hardcodeado) ─── */

const artistPct: number = Math.round(SPLIT_SOBERANO.artista * 100);
const earPct: number = Math.round(SPLIT_SOBERANO.earOs * 100);
const vimumePct: number = Math.round(SPLIT_SOBERANO.vimume * 100);

const TEL_HREF: string = `tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`;
const WHATSAPP_HREF: string = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

/* ─── Los 4 Arquetipos Soberanos (frecuencias solfeggio: 432/528/639/741) ─── */

const ROLES: readonly RoleSpec[] = Object.freeze([
  {
    id: 'COUPLE_WEDDING',
    label: 'Bodas & Fincas',
    shortLabel: 'Novios',
    subtitle: 'Emoción que sella el "sí, quiero"',
    badge: 'COUPLE_WEDDING',
    accentHex: '#ecb613',
    bgGlow: 'rgba(236,182,19,0.16)',
    freqHz: 432,
    metrics: [
      { label: 'Solista Premium', value: `${TARIFA_BASE_SOLISTA_EUR} €` },
      { label: 'Fianza Stripe', value: `${DEPOSITO_STRIPE_EUR} € deducible` },
      { label: 'Acústica', value: `${WATTS_PER_PAX} W/pax` },
    ],
    valueProposition:
      'Tenor Edwin Agudelo con sonido Bose F1 a medida de tu finca, con fianza 100% deducible y fecha bloqueada sin riesgo.',
    ctaLabel: 'Reservar Fecha',
    ctaHref: '/reservar/solista',
  },
  {
    id: 'TOWNHALL_B2G',
    label: 'Ayuntamientos & B2G',
    shortLabel: 'Ayuntamientos',
    subtitle: 'Soberanía cultural de tu municipio',
    badge: 'TOWNHALL_B2G',
    accentHex: '#00E5FF',
    bgGlow: 'rgba(0,229,255,0.16)',
    freqHz: 528,
    metrics: [
      { label: 'Contrato Menor', value: `< ${AJUSTE_PREVENTIVO_B2G_EUR} €` },
      { label: 'Marco Legal', value: 'Art. 118 LCSP' },
      { label: 'VIMUME Social', value: 'SROI 4.85x' },
    ],
    valueProposition:
      'Fiestas Patronales, alumbrado y neuroacústica senior VIMUME con retorno social medible y blindaje jurídico completo.',
    ctaLabel: 'Abrir Licitación',
    ctaHref: '/vimume/b2g',
  },
  {
    id: 'SOVEREIGN_ARTIST',
    label: 'Artistas Diamante',
    shortLabel: 'Artistas',
    subtitle: 'De emergente a Océano Azul',
    badge: 'SOVEREIGN_ARTIST',
    accentHex: '#FF2B44',
    bgGlow: 'rgba(255,43,68,0.16)',
    freqHz: 639,
    metrics: [
      { label: 'Split Soberano', value: `${artistPct}/${earPct}/${vimumePct}` },
      { label: 'Contratos', value: 'SHA-256' },
      { label: 'Cuota Fija', value: '0 €' },
    ],
    valueProposition:
      'Salta de emergente a Océano Azul con liquidación directa 80/10/10, sin intermediarios y con contratos cifrados SHA-256.',
    ctaLabel: 'Unirme al Diamante',
    ctaHref: '/artistas',
  },
  {
    id: 'VENDOR_PARTNER',
    label: 'Proveedores & Fincas B2B',
    shortLabel: 'Proveedores',
    subtitle: 'Ocupa tus horas muertas con IA',
    badge: 'VENDOR_PARTNER',
    accentHex: '#10B981',
    bgGlow: 'rgba(16,185,129,0.16)',
    freqHz: 741,
    metrics: [
      { label: 'Leads Swarm', value: '< 15s vía WhatsApp' },
      { label: 'Fianza', value: 'Congelada' },
      { label: 'Radar', value: 'Horas Muertas' },
    ],
    valueProposition:
      'Swarm de leads IA que te despacha oportunidades por WhatsApp en menos de 15 segundos, con fianza congelada y radar de horas muertas.',
    ctaLabel: 'Activar Radar',
    ctaHref: '/fincas/portal-demostrativo',
  },
]);

const INITIAL_INDEX: number = 0;

/* ─── Sintetizador háptico Web Audio API (oscilador 40ms + envolvente exp) ─── */

function playTactileFeedback(freqHz: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  type AudioContextCtor = typeof AudioContext;
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext;
  if (!Ctor) {
    return;
  }

  const ctx: AudioContext = new Ctor();
  const osc: OscillatorNode = ctx.createOscillator();
  const gain: GainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freqHz, ctx.currentTime);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);

  osc.onended = (): void => {
    void ctx.close();
  };
}

/* ─── Componente QuantumRoleCockpit (use client) ─── */

export function QuantumRoleCockpit(): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(INITIAL_INDEX);
  const audioUnlockedRef = useRef<boolean>(false);

  const handleSelect = useCallback((nextIndex: number): void => {
    const role: RoleSpec = ROLES[nextIndex];
    setActiveIndex(nextIndex);
    if (!audioUnlockedRef.current) {
      audioUnlockedRef.current = true;
    }
    playTactileFeedback(role.freqHz);
  }, []);

  const activeRole: RoleSpec = ROLES[activeIndex];

  return (
    <section
      aria-label="Selector de rol EAR OS"
      className="relative w-full overflow-x-hidden px-4 sm:px-6"
    >
      <div className="relative max-w-5xl mx-auto rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.55)] transition-all duration-300 ease-out">
        {/* Resplandor OLED adaptativo por rol */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl -z-10 transition-all duration-500 ease-out"
          style={{
            background: `radial-gradient(circle at 30% 0%, ${activeRole.bgGlow}, transparent 55%)`,
          }}
        />

        {/* ─── Tabs (grid con layoutId, cero layout shift) ─── */}
        <div
          role="tablist"
          aria-label="Arquetipos Soberanos EAR OS"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
        >
          {ROLES.map((role, index) => {
            const isActive: boolean = index === activeIndex;
            return (
              <button
                key={role.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`quantum-role-panel-${role.id}`}
                id={`quantum-role-tab-${role.id}`}
                onClick={() => handleSelect(index)}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    handleSelect((index + 1) % ROLES.length);
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    handleSelect((index - 1 + ROLES.length) % ROLES.length);
                  }
                }}
                className="relative px-3 py-3 rounded-2xl text-center transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer select-none"
              >
                {isActive && (
                  <motion.span
                    layoutId="quantum-role-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl border"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    style={{
                      backgroundColor: `${activeRole.accentHex}1a`,
                      borderColor: activeRole.accentHex,
                      boxShadow: `0 0 22px ${activeRole.bgGlow}`,
                    }}
                  />
                )}
                <span
                  className="relative z-10 block text-[11px] sm:text-xs font-bold font-mono tracking-tight transition-colors duration-300"
                  style={{
                    color: isActive
                      ? activeRole.accentHex
                      : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {role.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── Panel inmersivo del rol activo ─── */}
        <div
          role="tabpanel"
          id={`quantum-role-panel-${activeRole.id}`}
          aria-labelledby={`quantum-role-tab-${activeRole.id}`}
          className="mt-6 sm:mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-5 sm:gap-8 items-start">
            {/* Columna narrativa */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300"
                style={{
                  color: activeRole.accentHex,
                  borderColor: `${activeRole.accentHex}55`,
                }}
              >
                {activeRole.badge}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-3 mb-1">
                {activeRole.label}
              </h2>
              <p
                className="text-sm font-medium mb-3 transition-colors duration-300"
                style={{ color: activeRole.accentHex }}
              >
                {activeRole.subtitle}
              </p>
              <p className="text-xs sm:text-sm opacity-75 leading-relaxed text-white/80 mb-5 max-w-xl">
                {activeRole.valueProposition}
              </p>

              <a
                href={activeRole.ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm font-mono text-black transition-all duration-300 ease-out hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: activeRole.accentHex,
                  boxShadow: `0 0 24px ${activeRole.bgGlow}`,
                }}
              >
                {activeRole.ctaLabel}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Columna de métricas SSOT */}
            <div className="grid grid-cols-1 gap-3">
              {activeRole.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors duration-300"
                >
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/50">
                    {metric.label}
                  </span>
                  <span
                    className="text-sm sm:text-base font-bold font-mono whitespace-nowrap transition-colors duration-300"
                    style={{ color: activeRole.accentHex }}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}

              {/* Contacto directo: WhatsApp + centralita */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  WhatsApp {CENTRALITA_EAR_OS}
                </a>
                <a
                  href={TEL_HREF}
                  className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuantumRoleCockpit;
