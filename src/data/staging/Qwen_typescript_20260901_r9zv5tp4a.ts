// app/budget/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Printer, TrendingUp, AlertCircle } from 'lucide-react';
import BudgetOverview from '@/components/budget/BudgetOverview';
import CategoryCard from '@/components/budget/CategoryCard';
import AddExpenseModal from '@/components/budget/AddExpenseModal';
import BudgetChart from '@/components/budget/BudgetChart';
import { Budget, BudgetCategory, Vendor } from '@/types/budget';

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetRes, vendorsRes] = await Promise.all([
        fetch('/api/budget'),
        fetch('/api/vendors'),
      ]);

      const budgetData = await budgetRes.json();
      const vendorsData = await vendorsRes.json();

      setBudget(budgetData);
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: any) => {
    try {
      const res = await fetch('/api/budget/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAddCategory = async (categoryData: any) => {
    try {
      const res = await fetch('/api/budget/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetId: budget?.id,
          ...categoryData,
        }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await fetch(`/api/budget/categories/${categoryId}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading || !budget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
      </div>
    );
  }

  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.finalCost, 0);
  const isOverBudget = totalSpent > budget.totalBudget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Presupuesto</h1>
              <p className="text-gray-600">Control total de tus gastos nupciales</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5" />
                Exportar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                <Printer className="w-5 h-5" />
                Imprimir
              </button>
              <button
                onClick={() => {
                  setSelectedCategoryId(undefined);
                  setIsExpenseModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                Nuevo Gasto
              </button>
            </div>
          </div>

          {/* Alert Banner */}
          {isOverBudget && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-top-2">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900">¡Has excedido tu presupuesto!</p>
                <p className="text-sm text-red-700">
                  Estás {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalSpent - budget.totalBudget)} por encima del límite
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Overview Stats */}
        <BudgetOverview budget={budget} />

        {/* Chart */}
        <BudgetChart categories={budget.categories} />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {budget.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddExpense={(catId) => {
                setSelectedCategoryId(catId);
                setIsExpenseModalOpen(true);
              }}
              onEditCategory={(cat) => console.log('Edit:', cat)}
              onDeleteCategory={handleDeleteCategory}
            />
          ))}

          {/* Add Category Card */}
          <div
            onClick={() => {
              const name = prompt('Nombre de la nueva categoría:');
              if (name) {
                handleAddCategory({
                  name,
                  estimatedCost: 0,
                  icon: '📦',
                  color: '#6B7280',
                });
              }
            }}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-rose-600" />
            </div>
            <p className="text-gray-600 font-semibold group-hover:text-rose-600">Nueva Categoría</p>
          </div>
        </div>

        {/* Expense Modal */}
        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          categories={budget.categories}
          vendors={vendors}
          budgetId={budget.id}
          preselectedCategoryId={selectedCategoryId}
          onSave={handleAddExpense}
        />
      </div>
    </div>
  );
}