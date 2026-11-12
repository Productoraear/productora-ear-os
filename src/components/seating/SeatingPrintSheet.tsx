/**
 * SEATING PRINT SHEET — PLANO A4 + LISTA ALFABÉTICA DE MESAS
 * ════════════════════════════════════════════════════════════════════════════
 * Server Component puro (sin `"use client"`): se pinta en el servidor y sólo se
 * materializa al imprimir (`hidden print:block`). Sin estado, sin JS, sin
 * botones. Lo que el operador entrega a la finca es exactamente esto.
 *
 * Decisiones de impresión:
 *   · Fondo BLANCO con tinta oscura. Un plano en negro OLED se convierte en un
 *     rectángulo de tóner ilegible en A4.
 *   · Las mesas se dibujan con la MISMA geometría (rotación incluida) que en
 *     pantalla, para que el montaje no cambie entre el móvil y el papel.
 *   · La lista de mesas va ORDENADA ALFABÉTICAMENTE y cada mesa lista a sus
 *     comensales por número de asiento. Ese es el orden que se pega en las
 *     tarjetas de sitio.
 *
 * Cero emojis, cero colores de acento gritones en papel (UNSLOP §4).
 * ════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import {
  FIXTURE_SPEC,
  GUEST_TAG_STYLE,
  TABLE_METRICS,
  effectiveMetrics,
  guestsOfTable,
  rotatedBounds,
  type SeatingPlan,
  type TableShape,
} from '@/lib/seating/seating-plan';

export interface SeatingPrintSheetProps {
  readonly plan: SeatingPlan;
  readonly shapeLabel: Readonly<Record<TableShape, string>>;
}

/** Escala de impresión: 1 m ⇒ 12 mm de papel (una mesa redonda de 1,8 m cabe). */
const PRINT_PX_PER_M = 12;
const PRINT_MARGIN_M = 1;

/** `true` si hay algo que imprimir. Evita una hoja A4 en blanco. */
export function hasPrintableContent(plan: SeatingPlan): boolean {
  return plan.tables.length > 0 || plan.fixtures.length > 0 || plan.guests.length > 0;
}

function PlanDiagram({ plan }: { readonly plan: SeatingPlan }) {
  const tableExtents = plan.tables.map((table) => {
    const bounds = rotatedBounds(effectiveMetrics(table), table.rotation);
    return { right: table.x + bounds.width, bottom: table.y + bounds.height };
  });
  const fixtureExtents = plan.fixtures.map((fixture) => {
    const spec = FIXTURE_SPEC[fixture.kind];
    const bounds = rotatedBounds(
      { width: spec.width * fixture.scale, height: spec.height * fixture.scale },
      fixture.rotation,
    );
    return { right: fixture.x + bounds.width, bottom: fixture.y + bounds.height };
  });

  const widthM = Math.max(8, ...tableExtents.map((extent) => extent.right), ...fixtureExtents.map((e) => e.right)) + PRINT_MARGIN_M;
  const heightM = Math.max(6, ...tableExtents.map((extent) => extent.bottom), ...fixtureExtents.map((e) => e.bottom)) + PRINT_MARGIN_M;
  const svgW = Math.round(widthM * PRINT_PX_PER_M);
  const svgH = Math.round(heightM * PRINT_PX_PER_M);

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      role="img"
      aria-label={`Plano de mesas de ${plan.eventName || 'el evento'}`}
      className="max-h-[150mm] w-full"
    >
      <rect width={svgW} height={svgH} fill="#ffffff" />
      {/* Rejilla métrica tenue: se ve la escala real del salón. */}
      {Array.from({ length: Math.ceil(widthM) }, (_u, index) => (
        <line
          key={`v${index}`}
          x1={index * PRINT_PX_PER_M}
          y1={0}
          x2={index * PRINT_PX_PER_M}
          y2={svgH}
          stroke="#e4e4e7"
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: Math.ceil(heightM) }, (_u, index) => (
        <line
          key={`h${index}`}
          x1={0}
          y1={index * PRINT_PX_PER_M}
          x2={svgW}
          y2={index * PRINT_PX_PER_M}
          stroke="#e4e4e7"
          strokeWidth={0.5}
        />
      ))}

      {plan.fixtures.map((fixture) => {
        const spec = FIXTURE_SPEC[fixture.kind];
        const w = spec.width * fixture.scale * PRINT_PX_PER_M;
        const h = spec.height * fixture.scale * PRINT_PX_PER_M;
        const x = fixture.x * PRINT_PX_PER_M;
        const y = fixture.y * PRINT_PX_PER_M;
        return (
          <g key={fixture.id}>
            <g transform={`rotate(${fixture.rotation} ${x + w / 2} ${y + h / 2})`}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke="#52525b"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            </g>
            <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize={6} fill="#3f3f46" fontFamily="monospace">
              {fixture.label.length > 18 ? `${fixture.label.slice(0, 17)}…` : fixture.label}
            </text>
          </g>
        );
      })}

      {plan.tables.map((table) => {
        const metrics = TABLE_METRICS[table.shape];
        const w = metrics.width * table.scale * PRINT_PX_PER_M;
        const h = metrics.height * table.scale * PRINT_PX_PER_M;
        const x = table.x * PRINT_PX_PER_M;
        const y = table.y * PRINT_PX_PER_M;
        const cx = x + w / 2;
        const cy = y + h / 2;
        return (
          <g key={table.id}>
            <g transform={`rotate(${table.rotation} ${cx} ${cy})`}>
              {table.shape === 'round' ? (
                <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill="none" stroke="#18181b" strokeWidth={1.5} />
              ) : (
                <rect x={x} y={y} width={w} height={h} rx={2} fill="none" stroke="#18181b" strokeWidth={1.5} />
              )}
            </g>
            <text x={cx} y={cy - 1} textAnchor="middle" fontSize={7} fontWeight={700} fill="#18181b" fontFamily="monospace">
              {table.label.length > 16 ? `${table.label.slice(0, 15)}…` : table.label}
            </text>
            <text x={cx} y={cy + 7} textAnchor="middle" fontSize={6} fill="#52525b" fontFamily="monospace">
              {table.seats} plazas
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Lista alfabética de mesas con sus comensales por número de asiento. */
function TableIndex({ plan, shapeLabel }: SeatingPrintSheetProps) {
  const tables = [...plan.tables].sort((left, right) => left.label.localeCompare(right.label, 'es'));
  return (
    <table className="w-full border-collapse text-[9px] leading-snug text-black">
      <thead>
        <tr className="border-b border-black text-left">
          <th className="py-1 pr-2 font-bold uppercase tracking-wider">Mesa</th>
          <th className="py-1 pr-2 font-bold uppercase tracking-wider">Tipo</th>
          <th className="py-1 pr-2 text-right font-bold uppercase tracking-wider">Plazas</th>
          <th className="py-1 font-bold uppercase tracking-wider">Comensales (por asiento)</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => {
          const guests = guestsOfTable(plan, table.id);
          return (
            <tr key={table.id} className="border-b border-neutral-300 align-top">
              <td className="py-1 pr-2 font-mono font-bold">{table.label}</td>
              <td className="py-1 pr-2">{shapeLabel[table.shape]}</td>
              <td className="py-1 pr-2 text-right font-mono">
                {guests.length}/{table.seats}
              </td>
              <td className="py-1">
                {guests.length === 0 ? (
                  <span className="italic text-neutral-500">sin asignar</span>
                ) : (
                  guests
                    .map((guest) => `${(guest.seatIndex ?? 0) + 1}. ${guest.name}${guest.rsvp === 'confirmed' ? '' : ' (p)'}`)
                    .join(' · ')
                )}
              </td>
            </tr>
          );
        })}
        {tables.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-2 italic text-neutral-500">
              El plano no tiene mesas.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

/** Invitados que aún no tienen mesa: la lista que el operador debe cerrar. */
function UnseatedList({ plan }: { readonly plan: SeatingPlan }) {
  const unseated = plan.guests.filter((guest) => guest.tableId === null);
  if (unseated.length === 0) return null;
  return (
    <section className="mt-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-black">
        Sin mesa asignada ({unseated.length})
      </h3>
      <p className="mt-1 text-[9px] leading-snug text-neutral-700">
        {unseated.map((guest) => `${guest.name} (${GUEST_TAG_STYLE[guest.tag].label})`).join(' · ')}
      </p>
    </section>
  );
}

/**
 * Hoja imprimible completa. `hidden print:block` la mantiene fuera del flujo
 * en pantalla (cero CLS) y la hace aparecer sólo en el diálogo de impresión.
 */
export default function SeatingPrintSheet({ plan, shapeLabel }: SeatingPrintSheetProps) {
  if (!hasPrintableContent(plan)) return null;
  const tally = plan.guests.length;

  return (
    <div className="seating-print-sheet hidden bg-white p-8 text-black print:block">
      <header className="mb-4 border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold uppercase tracking-tight">
          Plano de mesas · {plan.eventName || 'Evento sin nombre'}
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-700">
          {plan.tables.length} mesas · {plan.pax} pax previstos · {tally} invitados anotados ·{' '}
          {plan.fixtures.length} zonas
        </p>
      </header>

      <PlanDiagram plan={plan} />

      <section className="mt-6">
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-black">
          Lista alfabética de mesas
        </h2>
        <TableIndex plan={plan} shapeLabel={shapeLabel} />
      </section>

      <UnseatedList plan={plan} />

      <footer className="mt-6 border-t border-neutral-400 pt-2 font-mono text-[8px] uppercase tracking-wider text-neutral-600">
        Productora EAR · plano organizativo, no cotiza · escala 1 m = 12 mm
      </footer>
    </div>
  );
}