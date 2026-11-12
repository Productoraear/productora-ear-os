import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';
import { CommercialEventCalculator } from '@/components/calculator/CommercialEventCalculator';
import { Sparkles, SlidersHorizontal, ArrowRight, LayoutList, ShieldCheck } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { isSeatingPlanHash } from '@/lib/seating/seating-codec';

export const metadata: Metadata = {
  title: 'Diseña tu Presupuesto & Matcher S-Class | Productora EAR',
  description: 'Sistema interactivo de cotización en tiempo real, perfilado de eventos y matching de artistas de alta gama.',
};

/**
 * VALOR DE CATÁLOGO DEL SEATING PLANNER (ancla del lead magnet).
 * Mismo criterio que `src/app/(public)/seating-planner/page.tsx`: la cifra vive
 * en la RUTA (marketing), nunca en la Zona Cero `ear-os-ssot.ts` (INV-05).
 * INV-03: la cortesía NO altera el depósito — sigue siendo `DEPOSITO_STRIPE_EUR`
 * y 100 % deducible; no existe un segundo cobro.
 */
const SEATING_PLANNER_CATALOG_VALUE_EUR = 190;

const EUR_FORMAT = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Next.js 16: `searchParams` es una promesa (resolución obligatoria). */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return null;
}

/**
 * ── SUTURA SEATING PLANNER → PRESUPUESTO (BLOQUE 3) ─────────────────────────
 * Detecta `?seatingPlan=<hash>` (con `leadMagnet=true`) y devuelve el banner de
 * valor. Sólo se pinta cuando el hash tiene forma válida: una query manipulada
 * (`?seatingPlan=<script>`) NO activa el banner (cero confianza en la URL).
 */
function SeatingPlanningBanner({ planHash }: { readonly planHash: string }) {
  return (
    <section
      aria-labelledby="seating-courtesy-title"
      className="rounded-2xl border border-[#ecb613]/40 bg-[#ecb613]/5 p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#ecb613]">
            <LayoutList size={12} aria-hidden="true" /> Plano de mesas vinculado
          </p>
          <h2
            id="seating-courtesy-title"
            className="font-syne text-lg font-black uppercase leading-tight text-white sm:text-xl"
          >
            Seating Planner Pro ({EUR_FORMAT.format(SEATING_PLANNER_CATALOG_VALUE_EUR)} €) incluido de
            cortesía con tu depósito de {EUR_FORMAT.format(DEPOSITO_STRIPE_EUR)} €
          </h2>
          <p className="max-w-3xl text-xs leading-relaxed text-zinc-400">
            Tu plano viaja con este presupuesto (referencia{' '}
            <span className="font-mono text-[#00E5FF]">{planHash}</span>). El depósito de{' '}
            <span className="font-mono text-white">{EUR_FORMAT.format(DEPOSITO_STRIPE_EUR)} €</span> es
            100 % deducible del importe total del evento: no hay un segundo cobro por el plano.
          </p>
        </div>
        <a
          href="#terminal-costes"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ecb613] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#f5c94a]"
        >
          Cotizar ahora <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
      <p className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
        <ShieldCheck size={13} className="text-emerald-400" aria-hidden="true" />
        El plano organiza la sala; el importe del evento nace siempre del presupuesto sellado.
      </p>
    </section>
  );
}

/**
 * RUTA CANÓNICA DEL COTIZADOR (ORDEN 2026-11-11 §1).
 *
 * Antes: `/presupuesto` sólo servía el matcher y el conmutador enviaba a
 * `/cotizador`, ruta que NO existía (enlace muerto = INV-09 roto). Ahora la
 * canónica sirve los DOS flujos en la misma página, con el estado en un único
 * formulario: el recomendador arriba y el terminal de costes debajo.
 * `/calculadora` y `/cotizador` redirigen aquí con 301 (next.config.ts).
 */
export default async function PresupuestoPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const seatingPlanHash = firstValue(params.seatingPlan);
  const showSeatingBanner = seatingPlanHash !== null && isSeatingPlanHash(seatingPlanHash);

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            MOTOR TÁCTICO DE COTIZACIÓN // EAR OS S-CLASS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            DISEÑA TU <span className="text-[#ecb613]">PRESUPUESTO</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Perfila el formato con el recomendador y desglosa cada servicio en el terminal de
            costes. Un solo estado: lo que marcas arriba se cotiza abajo, al céntimo.
          </p>

          {/* Anclas internas: misma página, cero rutas competidoras */}
          <div className="flex items-center justify-center pt-2">
            <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-2">
              <a
                href="#matcher"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Recomendador / Matcher</span>
              </a>
              <a
                href="#terminal-costes"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2"
              >
                <SlidersHorizontal size={14} />
                <span>Calculadora de Costes</span>
              </a>
            </div>
          </div>
        </div>

        {/* 0 · Banner de cortesía del Seating Planner (sólo si llega un plano válido) */}
        {showSeatingBanner && seatingPlanHash !== null ? (
          <SeatingPlanningBanner planHash={seatingPlanHash} />
        ) : null}

        {/* 1 · Recomendador / Matcher */}
        <section id="matcher" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 scroll-mt-32">
          <div className="p-6 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Inteligencia Conductual 50Q</span>
              <h3 className="text-xl font-black text-white uppercase font-syne">¿Prefieres que el Túnel Neural profile tu evento paso a paso?</h3>
              <p className="text-xs text-white/50">Simulador de presión acústica, compatibilidad de repertorio y congelación de tarifa en 4 pantallas.</p>
            </div>
            <Link
              href="/servicios"
              className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all whitespace-nowrap"
            >
              <span>Abrir Túnel Neural</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <TinderMatcherClient />
        </section>

        {/* 2 · Terminal de costes (mismo estado, misma página) */}
        <section id="terminal-costes" className="scroll-mt-32">
          <CommercialEventCalculator />
        </section>
      </div>
    </main>
  );
}

