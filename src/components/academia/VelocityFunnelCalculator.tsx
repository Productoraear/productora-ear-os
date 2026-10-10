"use client";

/**
 * ⚡ QUANTUM GROWTH FUNNEL — OYENTE -> FAN -> COMPRADOR (LTV)
 * Simulador de conversión y proyección de ingresos por etapas del funnel soberano.
 *
 * PERF (W09-004):
 *  - Componente pesado aislado para lazy loading vía next/dynamic desde páginas consumidoras.
 *  - Render diferido del bloque de proyección financiera con `useDeferredValue` para
 *    mantener el slider a 60fps incluso en dispositivos de gama baja.
 *  - Memoización estricta de formateadores Intl (evita reinstanciar NumberFormat por render).
 *  - Subárboles estáticos extraídos a componentes memoizados para minimizar reconciliación.
 */

import React, { memo, useDeferredValue, useMemo, useState } from 'react';
import { ArrowDown, TrendingUp, Users } from 'lucide-react';
import {
  projectQuantumGrowthFunnel,
  QUANTUM_GROWTH_FUNNEL,
} from '@/lib/academia/oraculoEngine';

/* ------------------------------------------------------------------ */
/* Formatters (singleton, memoizados a nivel de módulo)                */
/* ------------------------------------------------------------------ */

const EUR_FORMATTER: Intl.NumberFormat = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const INT_FORMATTER: Intl.NumberFormat = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
});

const eur = (n: number): string => EUR_FORMATTER.format(n);
const int = (n: number): string => INT_FORMATTER.format(n);

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

interface FunnelStage {
  readonly id: string;
  readonly label: string;
  readonly lever: string;
  readonly conversionRate: number;
}

interface FunnelProjection {
  readonly oyentes: number;
  readonly fans: number;
  readonly compradores: number;
  readonly ltvPorOyente: number;
  readonly ingresosProyectados: number;
}

interface StageRowProps {
  readonly stage: FunnelStage;
  readonly count: number;
  readonly index: number;
  readonly total: number;
}

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly accent: string;
  readonly ariaLabel: string;
}

/* ------------------------------------------------------------------ */
/* Subcomponentes memoizados                                           */
/* ------------------------------------------------------------------ */

const StageRow = memo(function StageRow({
  stage,
  count,
  index,
  total,
}: StageRowProps): React.ReactElement {
  const formattedCount = int(count);
  return (
    <li
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"
      aria-label={`Etapa ${index + 1} de ${total}: ${stage.label}`}
    >
      <div className="flex items-center gap-3">
        <Users
          size={18}
          className="text-[#FF2B44]"
          aria-hidden="true"
          focusable="false"
        />
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            {stage.label}
          </p>
          <p className="text-[11px] text-white/40">{stage.lever}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className="font-mono text-lg font-bold text-white"
          aria-label={`${formattedCount} personas en etapa ${stage.label}`}
        >
          {formattedCount}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          {stage.conversionRate}% conversión
        </p>
      </div>
    </li>
  );
});

const StageConnector = memo(function StageConnector(): React.ReactElement {
  return (
    <li
      className="flex justify-center text-[#FF2B44]/50"
      aria-hidden="true"
      role="presentation"
    >
      <ArrowDown size={16} aria-hidden="true" focusable="false" />
    </li>
  );
});

const MetricCard = memo(function MetricCard({
  label,
  value,
  accent,
  ariaLabel,
}: MetricCardProps): React.ReactElement {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-black/40 p-5"
      role="group"
      aria-label={ariaLabel}
    >
      <span
        className="text-[10px] uppercase tracking-widest text-white/40"
        aria-hidden="true"
      >
        {label}
      </span>
      <div className="mt-2 text-xl font-bold" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export default function VelocityFunnelCalculator(): React.ReactElement {
  const [monthlyListeners, setMonthlyListeners] = useState<number>(25000);

  // Diferimos el valor para que el slider permanezca fluido mientras
  // se recalcula la proyección (que puede ser costosa en datasets grandes).
  const deferredListeners = useDeferredValue(monthlyListeners);

  const projection: FunnelProjection = useMemo(
    () => projectQuantumGrowthFunnel(deferredListeners) as FunnelProjection,
    [deferredListeners],
  );

  const counts: readonly number[] = useMemo(
    () => [projection.oyentes, projection.fans, projection.compradores],
    [projection.oyentes, projection.fans, projection.compradores],
  );

  const formattedListeners = useMemo(
    () => int(monthlyListeners),
    [monthlyListeners],
  );

  const stages = QUANTUM_GROWTH_FUNNEL as readonly FunnelStage[];
  const totalStages = stages.length;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setMonthlyListeners(Number(e.target.value));
    },
    [],
  );

  return (
    <section
      aria-labelledby="velocity-funnel-title"
      aria-describedby="velocity-funnel-desc"
      className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]"
          aria-hidden="true"
        >
          <TrendingUp size={18} aria-hidden="true" focusable="false" />
        </div>
        <div>
          <h3
            id="velocity-funnel-title"
            className="font-mono text-sm font-bold uppercase tracking-widest text-white"
          >
            Quantum Growth Funnel — Proyección LTV Soberano
          </h3>
          <p id="velocity-funnel-desc" className="text-[11px] text-white/40">
            De oyente a fan y de fan a comprador. Cada etapa, un activo.
          </p>
        </div>
      </div>

      <div className="mb-6 block space-y-2">
        <label
          htmlFor="velocity-funnel-listeners"
          className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50"
        >
          <span>Oyentes mensuales</span>
          <span className="text-[#FF2B44]" aria-hidden="true">
            {formattedListeners}
          </span>
        </label>
        <input
          id="velocity-funnel-listeners"
          type="range"
          min={1000}
          max={250000}
          step={1000}
          value={monthlyListeners}
          onChange={handleChange}
          className="w-full accent-[#FF2B44]"
          aria-label="Oyentes mensuales"
          aria-valuemin={1000}
          aria-valuemax={250000}
          aria-valuenow={monthlyListeners}
          aria-valuetext={`${formattedListeners} oyentes mensuales`}
        />
      </div>

      <ol
        className="space-y-3"
        aria-label="Etapas del funnel de crecimiento"
        role="list"
      >
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <StageRow
              stage={stage}
              count={counts[idx] ?? 0}
              index={idx}
              total={totalStages}
            />
            {idx < totalStages - 1 && <StageConnector />}
          </React.Fragment>
        ))}
      </ol>

      <div
        className="mt-6 grid grid-cols-2 gap-4 font-mono"
        role="group"
        aria-label="Métricas financieras proyectadas"
      >
        <MetricCard
          label="LTV por oyente"
          value={eur(projection.ltvPorOyente)}
          accent="#00E5FF"
          ariaLabel={`LTV por oyente: ${eur(projection.ltvPorOyente)}`}
        />
        <MetricCard
          label="Ingresos proyectados"
          value={eur(projection.ingresosProyectados)}
          accent="#FF2B44"
          ariaLabel={`Ingresos proyectados: ${eur(projection.ingresosProyectados)}`}
        />
      </div>
    </section>
  );
}