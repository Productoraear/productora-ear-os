'use client';

import React from 'react';
import { BudgetCategory } from '@/types/budget';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  categories: BudgetCategory[];
}

interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

interface TooltipEntry {
  name?: string;
  value?: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

function CustomTooltip({ active, payload }: CustomTooltipProps): React.ReactElement | null {
  if (active && payload && payload.length > 0) {
    const entry = payload[0];
    const formattedValue = currencyFormatter.format(Number(entry.value));
    return (
      <div
        className="bg-[#0e0e14] p-3 rounded-xl border border-white/10 shadow-2xl"
        role="tooltip"
        aria-live="polite"
      >
        <p className="text-xs font-bold text-white font-syne uppercase">{entry.name}</p>
        <p className="text-sm font-jetbrains font-black text-[#ecb613] mt-0.5">
          {formattedValue}
        </p>
      </div>
    );
  }
  return null;
}

export default function BudgetChart({ categories }: Props): React.ReactElement {
  const data: ChartDatum[] = categories
    .filter((cat) => cat.finalCost > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.finalCost,
      color: cat.color || '#ecb613',
    }));

  if (data.length === 0) {
    return (
      <section
        className="bg-[#09090d] rounded-2xl border border-white/10 p-6 mb-8 text-center"
        aria-labelledby="budget-chart-empty-title"
        role="region"
      >
        <h3
          id="budget-chart-empty-title"
          className="text-sm font-bold font-syne uppercase tracking-wider text-white mb-1"
        >
          Distribución de Gastos
        </h3>
        <p className="text-xs font-mono text-white/40" role="status">
          Aún no hay gastos registrados. Registra tu primer gasto para generar la gráfica interactiva.
        </p>
      </section>
    );
  }

  const total = data.reduce((acc, d) => acc + d.value, 0);

  const ariaLabel = `Gráfico circular de distribución de gastos por ${data.length} categorías. Total: ${currencyFormatter.format(
    total
  )}. Detalle: ${data
    .map((d) => `${d.name} ${currencyFormatter.format(d.value)}`)
    .join(', ')}`;

  const chartDescriptionId = 'budget-chart-description';

  return (
    <section
      className="bg-[#09090d] rounded-2xl border border-white/10 p-6 mb-8 shadow-xl"
      aria-labelledby="budget-chart-title"
      role="region"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          id="budget-chart-title"
          className="text-sm font-bold font-syne uppercase tracking-wider text-white flex items-center gap-2"
        >
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#ecb613]" /> Distribución
          Financiera por Partidas
        </h3>
        <span
          className="text-[10px] font-mono text-white/40"
          aria-label={`${data.length} categorías activas`}
        >
          {data.length} Categorías Activas
        </span>
      </div>
      <p id={chartDescriptionId} className="sr-only">
        {ariaLabel}
      </p>
      <div
        className="h-72"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={chartDescriptionId}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#050505"
                  strokeWidth={2}
                  aria-label={`${entry.name}: ${currencyFormatter.format(entry.value)}`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs font-mono text-white/70">{value}</span>
              )}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only" aria-label="Detalle de categorías del gráfico">
        {data.map((entry, index) => (
          <li key={`sr-item-${index}`}>
            {entry.name}: {currencyFormatter.format(entry.value)}
          </li>
        ))}
      </ul>
    </section>
  );
}