'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING VALUE PANEL — DESGLOSE DE COBRO DEL PLANO (CONTROL TOTAL)
 * ════════════════════════════════════════════════════════════════════════════
 * Consume el motor puro `seating-pricing.ts` y expone, elemento a elemento, lo
 * que el plano cuesta. Tres piezas de UI para mantener el presupuesto
 * estructural CISQ §5.4 (CC ≤ 15 · ≤ 200 líneas por función).
 *
 * Reglas que respeta:
 *   · Cero aritmética de dinero en el componente: sólo `formatCents`. Un total
 *     calculado dos veces acaba divergiendo en un céntimo.
 *   · Los importes canónicos los inyecta la RUTA; aquí no se escribe ni un
 *     precio (INV-10) ni se toca la Zona Cero (INV-05).
 *   · AF-2: los avisos de aforo y de geometría se muestran siempre, sin
 *     maquillaje. Si el plano no cabe, se dice antes de cobrar.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import {
  DEFAULT_SEATING_TARIFF,
  auditPlanElements,
  formatCents,
  hashValuation,
  valuateSeating,
  type PlacingPayer,
  type SeatingPrintOptions,
  type SeatingTariff,
  type SeatingValuation,
} from '@/lib/seating/seating-pricing';
import type { SeatingPlan } from '@/lib/seating/seating-plan';

export interface SeatingValuePanelProps {
  readonly plan: SeatingPlan;
  readonly print: SeatingPrintOptions;
  readonly payer: PlacingPayer;
  /** Tarifario inyectado por la ruta; por defecto, el de marketing. */
  readonly tariff?: SeatingTariff;
  /** Depósito canónico YA formateado desde el SSOT (no se recalcula aquí). */
  readonly depositEur: string;
}

/** Titularidad: qué se cobra y qué queda cubierto por el depósito. */
function OwnershipNotice({
  payer,
  depositEur,
  tariff,
}: {
  readonly payer: PlacingPayer;
  readonly depositEur: string;
  readonly tariff: SeatingTariff;
}) {
  if (payer === 'client') {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <Info size={14} className="mt-0.5 shrink-0 text-[#00E5FF]" aria-hidden="true" />
        <p className="text-[11px] leading-relaxed text-zinc-400">
          <span className="font-bold text-white">Ruta sin depósito.</span> El acceso al plano se
          factura a <span className="font-mono text-white">{formatCents(tariff.plannerToolCents)} EUR</span>. Con el
          depósito de <span className="font-mono text-white">{depositEur} EUR</span> (100 % deducible)
          queda cubierto y deja de facturarse.
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-[#ecb613]/30 bg-[#ecb613]/5 p-3">
      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#ecb613]" aria-hidden="true" />
      <p className="text-[11px] leading-relaxed text-zinc-300">
        <span className="font-bold text-white">Plano cubierto por tu depósito.</span> Sin segunda
        compra: el depósito de <span className="font-mono text-white">{depositEur} EUR</span> se resta
        íntegro de la liquidación del evento.
      </p>
    </div>
  );
}

/** Avisos del estado del plano. Se pintan siempre que existan (AF-2). */
function PlanWarnings({ plan, valuation }: { readonly plan: SeatingPlan; readonly valuation: SeatingValuation }) {
  const issues = auditPlanElements(plan);
  const warnings: string[] = [
    ...(valuation.exceedsVenue
      ? [`${valuation.overflowGuests} asientos por encima del aforo del espacio (${plan.venueCapacity}).`]
      : []),
    ...(valuation.seats < valuation.pax
      ? [`Faltan ${valuation.pax - valuation.seats} asientos para ${valuation.pax} comensales.`]
      : []),
    ...issues.map((issue) => `${issue.tableId}: ${issue.detail}`),
  ];

  if (warnings.length === 0) {
    return (
      <p className="flex items-center gap-2 text-[11px] font-bold text-[#00E5FF]">
        <CheckCircle2 size={13} aria-hidden="true" /> Plano válido: cubre el aforo y respeta la
        geometría.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {warnings.map((warning) => (
        <li key={warning} className="flex items-start gap-2 text-[11px] leading-relaxed text-[#FF2B44]">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{warning}</span>
        </li>
      ))}
    </ul>
  );
}

/** Tabla del desglose: una fila por concepto cobrado. */
function BreakdownTable({ valuation }: { readonly valuation: SeatingValuation }) {
  const { breakdown } = valuation;
  const headings = ['Concepto', 'Ud.', 'Precio', 'Importe'] as const;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Desglose del coste del plano de mesas</caption>
        <thead>
          <tr className="border-b border-white/10">
            {headings.map((heading, index) => (
              <th
                key={heading}
                scope="col"
                className={`py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 ${index === 0 ? '' : 'text-right'}`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {breakdown.lines.map((line) => (
            <tr key={line.key} className="border-b border-white/5">
              <th scope="row" className="py-2 pr-3 text-[11px] font-medium text-zinc-300">
                {line.label}
              </th>
              <td className="py-2 text-right font-mono text-[11px] text-zinc-500">{line.quantity}</td>
              <td className="py-2 text-right font-mono text-[11px] text-zinc-500">
                {formatCents(line.unitCents)}
              </td>
              <td className="py-2 text-right font-mono text-[11px] text-white">
                {formatCents(line.amountCents)}
              </td>
            </tr>
          ))}
          {breakdown.lines.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-3 text-center text-[11px] text-zinc-500">
                Sin conceptos: el plano no tiene mesas todavía.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}


export default function SeatingValuePanel({ plan, print, payer, tariff, depositEur }: SeatingValuePanelProps) {
  const activeTariff = tariff ?? DEFAULT_SEATING_TARIFF;
  const valuation = valuateSeating({ plan, print, tariff: activeTariff, payer });
  const { breakdown } = valuation;

  return (
    <section
      aria-labelledby="seating-value-title"
      className="space-y-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-5"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ecb613]">
            Valor del plano · vinculado al cobro
          </p>
          <h3
            id="seating-value-title"
            className="font-syne text-sm font-black uppercase tracking-tight text-white"
          >
            Desglose elemento a elemento
          </h3>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
          huella <span className="text-[#00E5FF]">{hashValuation(valuation)}</span>
        </span>
      </header>

      <OwnershipNotice payer={payer} depositEur={depositEur} tariff={activeTariff} />
      <BreakdownTable valuation={valuation} />

      <dl className="space-y-1.5 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-[11px]">
          <dt className="text-zinc-500">Subtotal</dt>
          <dd className="font-mono text-zinc-300">{formatCents(breakdown.subtotalCents)}</dd>
        </div>
        {breakdown.discountApplied ? (
          <div className="flex items-center justify-between text-[11px]">
            <dt className="text-[#00E5FF]">
              Descuento por volumen ({activeTariff.volumeDiscountPct} % desde{' '}
              {activeTariff.volumeThresholdTables} mesas)
            </dt>
            <dd className="font-mono text-[#00E5FF]">-{formatCents(breakdown.discountCents)}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Total del plano
          </dt>
          <dd className="font-mono text-lg font-bold text-white">{formatCents(breakdown.totalCents)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-wider text-zinc-600">
        <span>{valuation.tables} mesas</span>
        <span aria-hidden="true">·</span>
        <span>{valuation.seats} asientos montados</span>
        <span aria-hidden="true">·</span>
        <span>{valuation.pax} comensales</span>
      </div>

      <PlanWarnings plan={plan} valuation={valuation} />
    </section>
  );
}
