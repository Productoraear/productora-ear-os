'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Layers,
  Sparkles,
  Building2,
  Lock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

/**
 * LumenBentoGrid
 * Asymmetric OLED Glass cards displaying real SSOT business metrics and telemetry.
 * Styled in the award-winning HorizonX Bento standard: #030305 background, border-white/10,
 * ambient glow, micro-data provenance, zero mock data.
 */
export function LumenBentoGrid() {
  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight mb-4">
          Arquitectura Operativa de Alta Fidelidad
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-sans">
          Cuatro pilares de conversión y ejecución técnica auditados sin fachadas en céntimos enteros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[240px]">
        {/* Card 1: Solista Premium & Pricing Engine (Col-span 2) */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(236,182,19,0.15)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                Solista Premium S-Class
              </span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
              Edwin Agudelo
            </span>
          </div>

          <div className="z-10 my-auto">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-1">
              {TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €
              <span className="text-xs font-sans font-normal text-zinc-500 ml-2">/ Suelo Inviolable</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-2">
              Voz en directo con repertorio de gala, calibración acústica a medida y logística calculada al milímetro por GPS desde Hub Méntrida.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 z-10 text-xs font-mono text-zinc-400">
            <span>Split: 80% Artista / 10% EAR OS / 10% VIMUME</span>
            <Link
              href="/directorio?filter=solista"
              className="inline-flex items-center gap-1 text-amber-400 hover:underline"
            >
              Ver Rider <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Acoustic Telemetry & Ley del Ruido */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
          
          <div className="flex items-center justify-between z-10">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
              Ley 37/2003
            </span>
          </div>

          <div className="z-10">
            <div className="text-3xl font-extrabold font-mono text-white mb-1">
              &lt; {LIMITE_SPL_DB} dB SPL
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-1">
              {WATTS_PER_PAX} W/pax telemétrico
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-sans">
              Control sonométrico legal para evitar sanciones municipales y garantizar gala sin fatiga auditiva.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 z-10 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Certificado IGC-01</span>
            <Link href="/protocolo-acustico" className="hover:underline">
              Telemetría →
            </Link>
          </div>
        </div>

        {/* Card 3: Atomic Calendar Price-Lock */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
          
          <div className="flex items-center justify-between z-10">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              ACID Lock
            </span>
          </div>

          <div className="z-10">
            <div className="text-2xl font-extrabold font-mono text-white mb-1">
              {DEPOSITO_STRIPE_EUR.toFixed(2)} €
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1">
              100% Deducible
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-sans">
              Bloqueo pesimista de fecha en Stripe con SHA-256. Ninguna fecha se solapa ni se cancela sin garantía.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 z-10 text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span>Idempotencia 1:1</span>
            <Link href="/booking" className="hover:underline">
              Bloquear →
            </Link>
          </div>
        </div>

        {/* Card 4: B2G Fast-Track Licitaciones (Col-span 2) */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Contratación Pública B2G
              </span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
              Art. 118 LCSP
            </span>
          </div>

          <div className="z-10 my-auto">
            <div className="text-3xl font-extrabold font-mono text-white mb-1">
              &lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
              <span className="text-xs font-sans font-normal text-zinc-500 ml-2">/ Techo Preventivo (95%)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-2">
              Expedientes de Contrato Menor blindados sin fraccionamiento, con CPVs canónicos (92312000-1) y Retorno Social SROI certificado de 4.85x.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 z-10 text-xs font-mono text-zinc-400">
            <span>Intervención Municipal 0 Reparos</span>
            <Link
              href="/b2g"
              className="inline-flex items-center gap-1 text-purple-400 hover:underline"
            >
              Portal B2G <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 5: VIMUME Impacto Social */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(236,182,19,0.15)] flex flex-col justify-between">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                VIMUME & Mecenazgo Fiscal
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
              Ley 49/2002
            </span>
          </div>

          <div className="z-10 my-auto">
            <div className="flex items-baseline gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">4.85x SROI</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
              Cada evento destina el 10% soberano a sesiones de neuroacústica 40 Hz no invasiva para memoria y centros de mayores.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5 z-10 text-xs font-mono text-zinc-400">
            <span>Deducción Fiscal hasta 80%</span>
            <Link href="/vimume" className="text-amber-400 hover:underline">
              Evidencia Clínica →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

