"use client";

/**
 * 🗓️ GANTT CHRONOGRAM 61/99 — CRONOGRAMA DINÁMICO INTERACTIVO
 * Visualiza los ciclos "99 Días Haciendo Clic" y su versión agresiva de 61 días.
 */

import React, { useMemo, useState } from 'react';
import { CalendarRange, Flag } from 'lucide-react';
import {
  getChronogram61,
  getChronogram99,
  type ChronogramPhase,
} from '@/lib/academia/oraculoEngine';

type Cycle = 61 | 99;

export default function GanttChronogram6199() {
  const [cycle, setCycle] = useState<Cycle>(99);

  const phases: ChronogramPhase[] = useMemo(
    () => (cycle === 99 ? getChronogram99() : getChronogram61()),
    [cycle],
  );

  const totalDays = cycle;

  return (
    <div className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]">
            <CalendarRange size={18} />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-white">
              Cronograma {cycle} Días Haciendo Clic
            </h3>
            <p className="text-[11px] text-white/40">
              Ruta ejecutable semana a semana hasta el sellado del ciclo.
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1">
          {([61, 99] as Cycle[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCycle(c)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all ${
                cycle === c
                  ? 'bg-[#FF2B44] text-black font-bold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {c} días
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {phases.map((phase, idx) => {
          const widthPct = Math.max(
            10,
            Math.round((phase.day / totalDays) * 100),
          );
          return (
            <div key={`${cycle}-${idx}`} className="flex items-center gap-4">
              <div className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#FF2B44]">
                {phase.window}
              </div>
              <div className="relative h-12 flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                <div
                  className="absolute inset-y-0 left-0 flex items-center rounded-xl border border-[#FF2B44]/30 bg-gradient-to-r from-[#FF2B44]/25 to-[#FF2B44]/5 pl-3"
                  style={{ width: `${Math.min(100, widthPct + 12)}%` }}
                >
                  <span className="truncate text-xs font-bold text-white">
                    {phase.title}
                  </span>
                </div>
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-white/40">
                  <Flag size={10} /> {phase.kpi}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-[11px] italic text-white/40">
        Cada hito entrega un activo medible. Si un KPI no se cierra, el ciclo no avanza:
        no se escala sobre cimientos frágiles.
      </p>
    </div>
  );
}