"use client";

/**
 * 🗓️ GANTT CHRONOGRAM 61/99 — CRONOGRAMA DINÁMICO INTERACTIVO
 * Visualiza los ciclos "99 Días Haciendo Clic" y su versión agresiva de 61 días.
 *
 * PERF (Wave 9 · W09-001):
 *  - Componente pesado aislado para carga diferida vía next/dynamic desde el shell.
 *  - Render memoizado por fase para evitar re-renders innecesarios al alternar ciclo.
 *  - Sin dependencias de imágenes externas; iconografía vectorial tree-shakeable.
 */

import { memo, useCallback, useMemo, useState } from 'react';
import { CalendarRange, Flag } from 'lucide-react';
import {
  getChronogram61,
  getChronogram99,
  type ChronogramPhase,
} from '@/lib/academia/oraculoEngine';

type Cycle = 61 | 99;

const CYCLE_OPTIONS: readonly Cycle[] = [61, 99] as const;

interface PhaseRowProps {
  readonly phase: ChronogramPhase;
  readonly totalDays: number;
  readonly cycle: Cycle;
  readonly index: number;
}

const PhaseRow = memo(function PhaseRow({
  phase,
  totalDays,
  cycle,
  index,
}: PhaseRowProps) {
  const widthPct = Math.max(10, Math.round((phase.day / totalDays) * 100));
  const barWidth = Math.min(100, widthPct + 12);

  return (
    <div
      role="listitem"
      className="flex items-center gap-4"
      data-cycle={cycle}
      data-index={index}
    >
      <div
        className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#FF2B44]"
        aria-hidden="true"
      >
        {phase.window}
      </div>
      <div
        role="progressbar"
        aria-label={`${phase.title}: ${phase.window}`}
        aria-valuemin={0}
        aria-valuemax={totalDays}
        aria-valuenow={phase.day}
        aria-valuetext={`Día ${phase.day} de ${totalDays}. ${phase.title}. Ventana ${phase.window}. KPI: ${phase.kpi}`}
        className="relative h-12 flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 flex items-center rounded-xl border border-[#FF2B44]/30 bg-gradient-to-r from-[#FF2B44]/25 to-[#FF2B44]/5 pl-3"
          style={{ width: `${barWidth}%` }}
        >
          <span className="truncate text-xs font-bold text-white">
            {phase.title}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-white/40"
        >
          <Flag size={10} aria-hidden="true" focusable="false" /> {phase.kpi}
        </div>
      </div>
    </div>
  );
});

export default function GanttChronogram6199() {
  const [cycle, setCycle] = useState<Cycle>(99);

  const phases: ChronogramPhase[] = useMemo(
    () => (cycle === 99 ? getChronogram99() : getChronogram61()),
    [cycle],
  );

  const totalDays = cycle;

  const handleSelect = useCallback((next: Cycle) => {
    setCycle((prev) => (prev === next ? prev : next));
  }, []);

  return (
    <section
      aria-labelledby="gantt-chronogram-title"
      aria-describedby="gantt-chronogram-desc"
      className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]"
          >
            <CalendarRange size={18} aria-hidden="true" focusable="false" />
          </div>
          <div>
            <h3
              id="gantt-chronogram-title"
              className="font-mono text-sm font-bold uppercase tracking-widest text-white"
            >
              Cronograma {cycle} Días Haciendo Clic
            </h3>
            <p
              id="gantt-chronogram-desc"
              className="text-[11px] text-white/40"
            >
              Ruta ejecutable semana a semana hasta el sellado del ciclo.
            </p>
          </div>
        </div>

        <div
          role="group"
          aria-label="Seleccionar duración del ciclo"
          className="inline-flex rounded-full border border-white/10 bg-black/40 p-1"
        >
          {CYCLE_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleSelect(c)}
              aria-pressed={cycle === c}
              aria-label={`Cronograma de ${c} días`}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2B44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] ${
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

      <div
        role="list"
        aria-label={`Fases del cronograma de ${cycle} días`}
        className="space-y-3"
      >
        {phases.map((phase, idx) => (
          <PhaseRow
            key={`${cycle}-${idx}`}
            phase={phase}
            totalDays={totalDays}
            cycle={cycle}
            index={idx}
          />
        ))}
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-[11px] italic text-white/40">
        Cada hito entrega un activo medible. Si un KPI no se cierra, el ciclo no avanza:
        no se escala sobre cimientos frágiles.
      </p>
    </section>
  );
}