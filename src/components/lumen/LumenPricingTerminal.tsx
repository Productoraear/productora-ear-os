'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShieldAlert, Sparkles, Lock, ArrowRight } from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export function LumenPricingTerminal() {
  const formattedPhone = CENTRALITA_EAR_OS.replace(/\s+/g, '');

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Contratación Transparente y Garantizada
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-3 font-sans">
          Sin tarifas ocultas ni márgenes de agencia opacos. Cada céntimo auditado por el motor financiero de EAR OS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Tier 1: Consulta & Asesoría Directa */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Canal Libre</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-white/5">
                Sin Compromiso
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Asesoría Preliminar</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-6">
              Contacto directo con la dirección para evaluar disponibilidad de fechas, riders y viabilidad de espacios.
            </p>

            <div className="text-4xl font-black font-mono text-white mb-6">
              0,00 €
              <span className="text-xs font-sans font-normal text-zinc-500 ml-2">/ Consulta</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 mb-8 font-sans">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Atención ejecutiva ({CENTRALITA_EAR_OS})</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Estimación previa de kilometraje GPS</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Recomendación de repertorio y acústica</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-500">
                <ShieldAlert className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <span>No reserva ni bloquea fecha en calendario</span>
              </li>
            </ul>
          </div>

          <a
            href={`https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent('Hola Edwin, quiero consultar disponibilidad y presupuesto para un evento.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-sm transition-all"
          >
            <span>Contactar por WhatsApp</span>
          </a>
        </div>

        {/* Tier 2: VIP Price-Lock (Stripe Sovereign) */}
        <div className="relative rounded-3xl border border-amber-500/40 bg-zinc-950/90 backdrop-blur-2xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(236,182,19,0.15)] ring-1 ring-amber-500/30">
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-[10px] font-mono uppercase tracking-wider shadow-md">
            Recomendado · Blindaje Total
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Bloqueo VIP Inmutable
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Price-Lock SHA-256
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Reserva de Fecha & Contrato</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-6">
              Garantía mutua de doble vía. Bloqueo atómico de la fecha en calendario y congelación de tarifa sin incrementos.
            </p>

            <div className="text-4xl font-black font-mono text-white mb-2">
              {DEPOSITO_STRIPE_EUR.toFixed(2)} €
              <span className="text-xs font-sans font-normal text-amber-400 ml-2">/ 100% Deducible</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono mb-6">
              Se resta íntegro del suelo solista ({TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €) o del importe total acordado.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 mb-8 font-sans">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-semibold text-white">Bloqueo exclusivo de fecha en calendario</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Price-Lock SHA-256 garantizado</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>10% a impacto social VIMUME incluido</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Contrato digital y recibo oficial inmediato</span>
              </li>
            </ul>
          </div>

          <Link
            href="/booking?tier=vip"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:opacity-95 text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(236,182,19,0.35)]"
          >
            <Lock className="w-4 h-4" />
            <span>Bloquear Fecha VIP ({DEPOSITO_STRIPE_EUR.toFixed(2)} €)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

