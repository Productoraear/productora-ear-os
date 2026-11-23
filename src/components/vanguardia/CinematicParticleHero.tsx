'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import AmbientGlowOrb from './AmbientGlowOrb';
import MagneticCta from './MagneticCta';
import ParticleField from './ParticleField';
import { getVanguardiaTheme } from './vanguardia-theme';
import type { VanguardiaVariant } from './vanguardia-theme';

export interface CinematicParticleHeroProps {
  variant?: VanguardiaVariant;
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  badges?: readonly string[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Numero de particulas (por defecto 56; acotado a 8..120). */
  particleCount?: number;
  className?: string;
}

const DEFAULT_BADGES: readonly string[] = [
  'Sonido certificado',
  'Rider acustico Ley 37/2003',
  'Contrato con ficha verificable',
];

export default function CinematicParticleHero({
  variant = 'oro',
  eyebrow = 'Productora EAR',
  title = 'El sonido de tu evento,',
  highlight = 'con contrato y sin sorpresas',
  subtitle = 'Reserva directa con deposito deducible y precio bloqueado. Sin intermediarios.',
  badges = DEFAULT_BADGES,
  ctaLabel = 'Reservar fecha ahora',
  ctaHref = '/reservar',
  secondaryLabel = 'Calcular presupuesto',
  secondaryHref = '/cotizador',
  particleCount = 56,
  className,
}: CinematicParticleHeroProps) {
  const theme = getVanguardiaTheme(variant);

  return (
    <section
      className={`relative isolate flex min-h-[560px] w-full items-center overflow-hidden rounded-3xl border ${theme.border} ${theme.canvas} ${className ?? ''}`}
      aria-label={eyebrow}
    >
      <ParticleField count={particleCount} rgb={theme.accentRgb} />
      <AmbientGlowOrb variant={variant} position="top-right" size={420} intensity={theme.isDark ? 0.22 : 0.18} />
      <AmbientGlowOrb variant={variant} position="bottom-left" size={340} intensity={theme.isDark ? 0.14 : 0.12} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
        <p className={`mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] ${theme.accentText}`}>{eyebrow}</p>

        <h1 className={`text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl ${theme.text}`}>
          {title} <span className={theme.accentText}>{highlight}</span>
        </h1>

        <p className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${theme.muted}`}>{subtitle}</p>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {badges.map((badge) => (
            <li
              key={badge}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${theme.badge}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {badge}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <MagneticCta href={ctaHref} label={ctaLabel} className={theme.cta} />
          <Link
            href={secondaryHref}
            className={`inline-flex min-h-[48px] items-center rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${theme.ghost}`}
          >
            {secondaryLabel}
          </Link>
        </div>

        <p className={`mt-4 font-mono text-xs ${theme.muted}`}>
          Deposito Price-Lock {DEPOSITO_STRIPE_EUR.toFixed(0)} EUR, 100% deducible del total.
        </p>
      </div>
    </section>
  );
}
