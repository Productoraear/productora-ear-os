'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import { Budget } from '@/types/budget';

interface Props {
  budget: Budget;
}

export default function BudgetOverview({ budget }: Props) {
  const totalSpent = budget.categories?.reduce((sum, cat) => sum + cat.finalCost, 0) || budget.finalCost;
  const percentageUsed = budget.totalBudget > 0 ? (totalSpent / budget.totalBudget) * 100 : 0;
  const remaining = budget.totalBudget - totalSpent;
  const isOverBudget = totalSpent > budget.totalBudget && budget.totalBudget > 0;

  const stats = [
    {
      title: 'Presupuesto Total',
      value: budget.totalBudget,
      icon: DollarSign,
      color: 'from-[#ecb613]/20 to-[#ecb613]/5',
      textColor: 'text-[#ecb613]',
      borderColor: 'border-[#ecb613]/30',
      badge: budget.totalBudget > 0 ? 'Objetivo Fijado' : 'Sin Definir',
      badgeStyle: 'bg-[#ecb613]/10 text-[#ecb613] border-[#ecb613]/20'
    },
    {
      title: 'Comprometido / Gastado',
      value: totalSpent,
      icon: CreditCard,
      color: isOverBudget ? 'from-red-500/20 to-red-500/5' : 'from-emerald-500/20 to-emerald-500/5',
      textColor: isOverBudget ? 'text-red-400' : 'text-emerald-400',
      borderColor: isOverBudget ? 'border-red-500/30' : 'border-emerald-500/30',
      badge: `${percentageUsed.toFixed(1)}% Usado`,
      badgeStyle: isOverBudget ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      title: remaining >= 0 ? 'Margen Disponible' : 'Desviación / Excedido',
      value: Math.abs(remaining),
      icon: remaining >= 0 ? TrendingDown : TrendingUp,
      color: remaining >= 0 ? 'from-purple-500/20 to-purple-500/5' : 'from-red-600/20 to-red-600/5',
      textColor: remaining >= 0 ? 'text-purple-300' : 'text-red-400 font-bold',
      borderColor: remaining >= 0 ? 'border-purple-500/30' : 'border-red-600/50',
      badge: remaining >= 0 ? `${(budget.totalBudget > 0 ? (remaining / budget.totalBudget) * 100 : 0).toFixed(1)}% Libre` : 'ALERTA',
      badgeStyle: remaining >= 0 ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
    },
    {
      title: 'Liquidado / Pagado',
      value: budget.paidAmount,
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-blue-500/5',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      badge: `${totalSpent > 0 ? ((budget.paidAmount / totalSpent) * 100).toFixed(1) : 0}% Pagado`,
      badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`relative overflow-hidden bg-[#09090d] rounded-2xl p-5 border ${stat.borderColor} shadow-xl hover:border-white/30 transition-all duration-300 group`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-40 group-hover:opacity-70 transition-opacity`} />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${stat.textColor}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${stat.badgeStyle}`}>
                {stat.badge}
              </span>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-1">{stat.title}</p>
              <p className={`text-2xl lg:text-3xl font-black font-jetbrains tracking-tight ${stat.textColor}`}>
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stat.value)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
