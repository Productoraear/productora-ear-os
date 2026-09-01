'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Printer, AlertCircle } from 'lucide-react';
import BudgetOverview from '@/components/budget/BudgetOverview';
import CategoryCard from '@/components/budget/CategoryCard';
import AddExpenseModal from '@/components/budget/AddExpenseModal';
import BudgetChart from '@/components/budget/BudgetChart';
import { Budget, Vendor } from '@/types/budget';

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

      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        setBudget(budgetData);
      }
      if (vendorsRes.ok) {
        const vendorsData = await vendorsRes.json();
        setVendors(vendorsData);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
      </div>
    );
  }

  const totalSpent = budget.categories?.reduce((sum, cat) => sum + cat.finalCost, 0) || 0;
  const isOverBudget = totalSpent > budget.totalBudget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Presupuesto</h1>
              <p className="text-gray-600">Control total de gastos y liquidación de proveedores</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
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

          {isOverBudget && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900">¡Has excedido tu presupuesto!</p>
                <p className="text-sm text-red-700">
                  Estás {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalSpent - budget.totalBudget)} por encima del límite establecido.
                </p>
              </div>
            </div>
          )}
        </div>

        <BudgetOverview budget={budget} />

        <BudgetChart categories={budget.categories || []} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {budget.categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddExpense={(catId) => {
                setSelectedCategoryId(catId);
                setIsExpenseModalOpen(true);
              }}
              onEditCategory={(cat) => console.log('Edit Category:', cat)}
              onDeleteCategory={handleDeleteCategory}
            />
          ))}
        </div>

        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          categories={budget.categories || []}
          vendors={vendors}
          budgetId={budget.id}
          preselectedCategoryId={selectedCategoryId}
          onSave={handleAddExpense}
        />
      </div>
    </div>
  );
}
