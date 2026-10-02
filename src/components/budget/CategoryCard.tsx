'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { BudgetCategory } from '@/types/budget';

interface Props {
  category: BudgetCategory;
  onAddExpense: (categoryId: string) => void;
  onEditCategory: (category: BudgetCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function CategoryCard({ category, onAddExpense, onEditCategory, onDeleteCategory }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = category.estimatedCost > 0 ? (category.finalCost / category.estimatedCost) * 100 : (category.finalCost > 0 ? 100 : 0);
  const isOverBudget = category.estimatedCost > 0 && category.finalCost > category.estimatedCost;
  const isNearBudget = category.estimatedCost > 0 && percentage > 80 && !isOverBudget;

  return (
    <div className={`bg-[#09090d] rounded-2xl border transition-all duration-300 overflow-hidden group shadow-lg ${isOverBudget
      ? 'border-[#FF2B44]/40 bg-[#FF2B44]/10'
      : isNearBudget
        ? 'border-yellow-500/30'
        : 'border-white/10 hover:border-[#ecb613]/40'
      }`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${category.name}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.finalCost)} de ${category.estimatedCost > 0 ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.estimatedCost) : 'Sin estimar'}. Pulsa para expandir detalles.`}
        className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 rounded-2xl"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border border-white/10 bg-white/5"
              style={{ borderColor: `${category.color}40`, backgroundColor: `${category.color}15` }}
            >
              {category.icon || '📦'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-syne uppercase tracking-wide group-hover:text-[#ecb613] transition-colors">
                {category.name}
              </h3>
              <p className="text-xs font-mono text-white/50 mt-0.5">
                <span className="text-white/90 font-semibold font-jetbrains">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.finalCost)}
                </span>
                <span className="mx-1.5 text-white/30">/</span>
                <span>
                  {category.estimatedCost > 0
                    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.estimatedCost)
                    : 'Sin estimar'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onAddExpense(category.id)}
              aria-label={`Añadir gasto a la categoría ${category.name}`}
              className="p-2 bg-[#ecb613] hover:bg-[#d9a60e] text-black rounded-lg font-bold transition-transform hover:scale-105 shadow-md shadow-[#ecb613]/10"
              title="Añadir Gasto"
            >
              <Plus size={15} aria-hidden="true" />
            </button>
            <button
              onClick={() => onEditCategory(category)}
              aria-label={`Editar estimación de ${category.name}`}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Editar Estimación"
            >
              <Edit2 size={14} aria-hidden="true" />
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
                  onDeleteCategory(category.id);
                }
              }}
              aria-label={`Eliminar categoría ${category.name}`}
              className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Eliminar Categoría"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/40">
              {category.estimatedCost > 0 ? `${percentage.toFixed(0)}% utilizado` : 'Presupuesto dinámico'}
            </span>
            <span className={`font-bold font-jetbrains ${isOverBudget ? 'text-[#FF2B44]' : 'text-[#ecb613]'}`}>
              {category.estimatedCost > 0
                ? `${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.estimatedCost - category.finalCost)} disp.`
                : `${category.expenses?.length || 0} gastos`}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round(Math.min(percentage, 100))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Porcentaje utilizado de ${category.name}`}
            className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOverBudget
                ? 'bg-[#FF2B44] shadow-[0_0_8px_rgba(255,43,68,0.5)]'
                : isNearBudget
                  ? 'bg-[#ecb613]'
                  : 'bg-gradient-to-r from-[#ecb613] to-amber-500 shadow-[0_0_8px_rgba(236,182,19,0.3)]'
                }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lista Desplegable de Gastos */}
      {isExpanded && (
        <div className="border-t border-white/5 bg-black/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase">
            <span>Partidas Registradas ({category.expenses?.length || 0})</span>
            <span>Importe</span>
          </div>

          {category.expenses && category.expenses.length > 0 ? (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {category.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-white/90 truncate">{expense.description}</p>
                    <p className="text-[10px] font-mono text-white/40">
                      {new Date(expense.date).toLocaleDateString('es-ES')} {expense.notes ? `• ${expense.notes}` : ''}
                    </p>
                  </div>
                  <p className="text-xs font-bold font-jetbrains text-[#ecb613] shrink-0">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-white/30 text-center py-3">
              No hay gastos en esta categoría. Pulsa '+' para añadir.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
