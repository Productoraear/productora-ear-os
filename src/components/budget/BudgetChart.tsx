'use client';

import React from 'react';
import { BudgetCategory } from '@/types/budget';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  categories: BudgetCategory[];
}

export default function BudgetChart({ categories }: Props) {
  const data = categories
    .filter((cat) => cat.finalCost > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.finalCost,
      color: cat.color || '#ecb613',
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0e0e14] p-3 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-xs font-bold text-white font-syne uppercase">{payload[0].name}</p>
          <p className="text-sm font-jetbrains font-black text-[#ecb613] mt-0.5">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="bg-[#09090d] rounded-2xl border border-white/10 p-6 mb-8 text-center">
        <h3 className="text-sm font-bold font-syne uppercase tracking-wider text-white mb-1">Distribución de Gastos</h3>
        <p className="text-xs font-mono text-white/40">
          Aún no hay gastos registrados. Registra tu primer gasto para generar la gráfica interactiva.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#09090d] rounded-2xl border border-white/10 p-6 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold font-syne uppercase tracking-wider text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ecb613]" /> Distribución Financiera por Partidas
        </h3>
        <span className="text-[10px] font-mono text-white/40">{data.length} Categorías Activas</span>
      </div>
      <div className="h-72">
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#050505" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-xs font-mono text-white/70">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
