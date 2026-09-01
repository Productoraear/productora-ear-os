'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { Budget } from '@/types/budget';

interface Props {
  budget: Budget;
}

export default function BudgetOverview({ budget }: Props) {
  const totalSpent = budget.categories?.reduce((sum, cat) => sum + cat.finalCost, 0) || budget.finalCost;
  const percentageUsed = budget.totalBudget > 0 ? (totalSpent / budget.totalBudget) * 100 : 0;
  const remaining = budget.totalBudget - totalSpent;
  const isOverBudget = totalSpent > budget.totalBudget;

  const stats = [
    {
      title: 'Presupuesto Total',
      value: budget.totalBudget,
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      change: '+0%',
    },
    {
      title: 'Gastado',
      value: totalSpent,
      icon: CreditCard,
      color: isOverBudget ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500',
      change: `${percentageUsed.toFixed(1)}%`,
    },
    {
      title: remaining >= 0 ? 'Restante' : 'Excedido',
      value: Math.abs(remaining),
      icon: remaining >= 0 ? TrendingDown : TrendingUp,
      color: remaining >= 0 ? 'from-purple-500 to-violet-500' : 'from-red-500 to-orange-500',
      change: remaining >= 0 ? `${((remaining / budget.totalBudget) * 100).toFixed(1)}%` : 'ALERTA',
    },
    {
      title: 'Pagado',
      value: budget.paidAmount,
      icon: CreditCard,
      color: 'from-indigo-500 to-blue-500',
      change: `${totalSpent > 0 ? ((budget.paidAmount / totalSpent) * 100).toFixed(1) : 0}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-8 -mt-8`} />
          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                stat.change === 'ALERTA' 
                  ? 'bg-red-100 text-red-700 animate-pulse' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stat.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
