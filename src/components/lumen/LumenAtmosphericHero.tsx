'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ArrowRight, PhoneCall, Disc } from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

/**
 * LumenAtmosphericHero
 * S-Class Awwwards-tier atmospheric hero section inspired by HorizonX Lumen.
 * Implements kinetic micro-badges, dual Sovereign CTA, and ambient focus.
 * Uses CSS staggered delays (animation-delay) for sequential entrance without JS thread blocking.
 */
export function LumenAtmosphericHero() {
  const formattedPhone = CENTRALITA_EAR_OS.replace(/\s+/g, '');

  return (
    <section className="relative z-10 pt-32 pb-24 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* 1. Kinetic Pill Badge (Entrance 0ms) */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-8 animate-fade-in shadow-[0_0_20px_rgba(236,182,19,0.15)] transition-all">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="text-xs font-mono font-medium tracking-wider uppercase text-amber-200">
          HorizonX Lumen Architecture · EAR OS v13.0
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
      </div>

      {/* 2. Hero Display Headline (Entrance 150ms delay) */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-display text-white max-w-5xl leading-[1.08] mb-8 animate-fade-in [animation-delay:150ms]">
        La Experiencia Acústica{' '}
        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(236,182,19,0.3)]">
          Soberana
        </span>{' '}
        para Alta Producción.
      </h1>

      {/* 3. Subtitle / Value Proposition (Entrance 300ms delay) */}
      <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-normal animate-fade-in [animation-delay:300ms]">
        Ingeniería sonora con limitador legal <span className="text-zinc-200 font-mono">Ley 37/2003</span>,
        directo solista de gala por <span className="text-amber-400 font-semibold font-mono">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</span> y
        blindaje de fecha atómico en calendario inmutable.
      </p>

      {/* 4. Dual Sovereign CTA Matrix (Entrance 450ms delay) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none animate-fade-in [animation-delay:450ms]">
        {/* VIP Lock Path (Stripe Price-Lock) */}
        <Link
          href="/booking?tier=vip"
          className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] active:scale-[0.98]"
        >
          <Disc className="w-4 h-4 text-zinc-950 group-hover:rotate-180 transition-transform duration-700" />
          <span>Blindar Fecha VIP ({DEPOSITO_STRIPE_EUR.toFixed(2)} € Deducibles)</span>
          <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Free Direct Channel (WhatsApp / Centralita) */}
        <a
          href={`https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent('Hola Edwin, solicito asesoría directa S-Class para evento premium.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-4 rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-md text-zinc-200 font-medium text-sm transition-all duration-300 hover:bg-zinc-800/80 hover:border-white/20 hover:text-white active:scale-[0.98]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>Asesoría Directa ({CENTRALITA_EAR_OS})</span>
        </a>
      </div>

      {/* 5. Micro Trust Proofs (Entrance 600ms delay) */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono animate-fade-in [animation-delay:600ms]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500/70" />
          <span>Price-Lock SHA-256 Garantizado</span>
        </div>
        <span className="hidden sm:inline text-zinc-700">·</span>
        <div>Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME</div>
        <span className="hidden sm:inline text-zinc-700">·</span>
        <div>Sello SROI 4.85x B2G</div>
      </div>
    </section>
  );
}
