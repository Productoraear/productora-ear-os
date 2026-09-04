// components/budget/CategoryCard.tsx
'use client';

import { useState } from 'react';
import { Plus, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { BudgetCategory, Expense } from '@/types/budget';

interface Props {
  category: BudgetCategory;
  onAddExpense: (categoryId: string) => void;
  onEditCategory: (category: BudgetCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function CategoryCard({ category, onAddExpense, onEditCategory, onDeleteCategory }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const percentage = (category.finalCost / category.estimatedCost) * 100;
  const isOverBudget = percentage > 100;
  const isNearBudget = percentage > 80 && percentage <= 100;

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
      isOverBudget ? 'border-red-300' : isNearBudget ? 'border-yellow-300' : 'border-gray-100'
    }`}>
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.finalCost)} 
                <span className="mx-2">de</span>
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(category.estimatedCost)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddExpense(category.id);
              }}
              className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditCategory(category);
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('¿Eliminar esta categoría?')) {
                  onDeleteCategory(category.id);
                }
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{percentage.toFixed(1)}% utilizado</span>
            <span className={`font-bold ${isOverBudget ? 'text-red-600' : isNearBudget ? 'text-yellow-600' : 'text-green-600'}`}>
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                category.estimatedCost - category.finalCost
              )} restantes
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                  : isNearBudget 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Expenses */}
      {isExpanded && category.expenses && category.expenses.length > 0 && (
        <div className="border-t bg-gray-50 p-4 animate-in slide-in-from-top-2">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Gastos Recientes</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {category.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}