"use client";

/**
 * ⚡ VELOCITY FUNNEL CALCULATOR — OYENTE -> FAN -> COMPRADOR (LTV)
 * Simulador de conversión y proyección de ingresos por etapas del funnel.
 */

import React, { useMemo, useState } from 'react';
import { ArrowDown, TrendingUp, Users } from 'lucide-react';
import {
  projectVelocityFunnel,
  VELOCITY_FUNNEL,
} from '@/lib/academia/oraculoEngine';

const eur = (n: number): string =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export default function VelocityFunnelCalculator() {
  const [monthlyListeners, setMonthlyListeners] = useState<number>(25000);

  const projection = useMemo(
    () => projectVelocityFunnel(monthlyListeners),
    [monthlyListeners],
  );

  const counts = [projection.oyentes, projection.fans, projection.compradores];

  return (
    <div className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]">
          <TrendingUp size={18} />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-white">
            Funnel Velocity — Proyección LTV
          </h3>
          <p className="text-[11px] text-white/40">
            De oyente a fan y de fan a comprador. Cada etapa, un activo.
          </p>
        </div>
      </div>

      <label className="mb-6 block space-y-2">
        <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
          Oyentes mensuales
          <span className="text-[#FF2B44]">{monthlyListeners.toLocaleString('es-ES')}</span>
        </span>
        <input
          type="range"
          min={1000}
          max={250000}
          step={1000}
          value={monthlyListeners}
          onChange={(e) => setMonthlyListeners(Number(e.target.value))}
          className="w-full accent-[#FF2B44]"
          aria-label="Oyentes mensuales"
        />
      </label>

      <div className="space-y-3">
        {VELOCITY_FUNNEL.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-[#FF2B44]" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-white/40">{stage.lever}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-white">
                  {counts[idx].toLocaleString('es-ES')}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {stage.conversionRate}% conversión
                </p>
              </div>
            </div>
            {idx < VELOCITY_FUNNEL.length - 1 && (
              <div className="flex justify-center text-[#FF2B44]/50">
                <ArrowDown size={16} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 font-mono">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            LTV por oyente
          </span>
          <div className="mt-2 text-xl font-bold text-[#00E5FF]">
            {eur(projection.ltvPorOyente)}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            Ingresos proyectados
          </span>
          <div className="mt-2 text-xl font-bold text-[#FF2B44]">
            {eur(projection.ingresosProyectados)}
          </div>
        </div>
      </div>
    </div>
  );
}