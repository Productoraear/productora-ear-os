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
      color: cat.color || '#3B82F6',
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-bold text-gray-900">{payload[0].name}</p>
          <p className="text-rose-600 font-semibold">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center text-gray-500">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Distribución de Gastos</h3>
        <p className="text-sm">Aún no hay gastos registrados para generar el gráfico.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Distribución de Gastos</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
