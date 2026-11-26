'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CircleDot, LayoutGrid, ShieldCheck } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * PANEL DE CRISTAL · EL MAÎTRE DIGITAL (ACTO III)
 * ════════════════════════════════════════════════════════════════════════════
 * Vista previa del Seating Planner sobre cristal esmerilado con geometría
 * RESERVADA (ancho y alto fijos): aparece y desaparece por opacidad, nunca
 * desplaza el layout (CLS 0.000). Se declara `PREVIEW` de forma explícita
 * (anti-fachada AF-2): las cifras de mesas son una muestra visual, no una
 * reserva real; el único CTA es la ruta viva `/seating-planner`.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface TableCell {
  readonly id: string;
  readonly pax: number;
  readonly tone: 'libre' | 'reservada' | 'fijada';
}

/** Muestra determinista de 12 mesas × 8 pax = 96 comensales (sin aleatoriedad). */
const TABLES: readonly TableCell[] = Object.freeze([
  { id: 'M01', pax: 8, tone: 'fijada' },
  { id: 'M02', pax: 8, tone: 'reservada' },
  { id: 'M03', pax: 8, tone: 'reservada' },
  { id: 'M04', pax: 8, tone: 'libre' },
  { id: 'M05', pax: 8, tone: 'fijada' },
  { id: 'M06', pax: 8, tone: 'reservada' },
  { id: 'M07', pax: 8, tone: 'fijada' },
  { id: 'M08', pax: 8, tone: 'libre' },
  { id: 'M09', pax: 8, tone: 'reservada' },
  { id: 'M10', pax: 8, tone: 'libre' },
  { id: 'M11', pax: 8, tone: 'reservada' },
  { id: 'M12', pax: 8, tone: 'fijada' },
]);

const TONE_CLASS: Readonly<Record<TableCell['tone'], string>> = {
  fijada: 'border-[#ecb613]/45 bg-[#ecb613]/[0.12] text-[#f5d97a]',
  reservada: 'border-white/15 bg-white/[0.05] text-white/75',
  libre: 'border-white/10 bg-white/[0.015] text-white/40',
};

export function CinematicMaitrePanel(): React.JSX.Element {
  return (
    <div
      className="relative flex h-[21rem] w-full max-w-[23rem] flex-col rounded-2xl border border-white/12 bg-white/[0.045] p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150"
      aria-label="Vista previa del Seating Planner"
    >
      {/* Filo de luz superior: refracción del cristal */}
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
        aria-hidden="true"
      />

      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[#ecb613]">
          <LayoutGrid size={15} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
            Seating Planner
          </span>
        </div>
        <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
          Preview
        </span>
      </header>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
        Sala palatina · 12 mesas · 96 pax
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2" role="presentation">
        {TABLES.map((table) => (
          <div
            key={table.id}
            className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-lg border transition-colors duration-200 ${TONE_CLASS[table.tone]}`}
          >
            <span className="font-mono text-[10px] font-semibold tracking-[0.08em]">{table.id}</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] opacity-70">
              {table.pax} pax
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
        <span className="inline-flex items-center gap-1.5">
          <CircleDot size={10} strokeWidth={1.5} className="text-[#ecb613]" aria-hidden="true" />
          Fijada
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CircleDot size={10} strokeWidth={1.5} className="text-white/60" aria-hidden="true" />
          Reservada
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CircleDot size={10} strokeWidth={1.5} className="text-white/25" aria-hidden="true" />
          Libre
        </span>
      </div>

      <footer className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div>
          <p className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-300/85">
            <ShieldCheck size={11} strokeWidth={1.5} aria-hidden="true" />
            Fianza {DEPOSITO_STRIPE_EUR} € deducible
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
            Price-Lock · un clic
          </p>
        </div>

        <Link
          href="/seating-planner"
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-[#ecb613]/50 hover:text-[#f5d97a]"
        >
          Abrir plano real
          <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}