'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Printer, AlertCircle, Edit3, Sparkles, Check, X } from 'lucide-react';
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
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState('');

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
        setNewTotalBudget(String(budgetData.totalBudget || 0));
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

  const handleUpdateTotalBudget = async () => {
    if (!budget) return;
    try {
      const res = await fetch('/api/budget', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetId: budget.id,
          totalBudget: Number(newTotalBudget) || 0,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBudget(updated);
        setIsEditingTotal(false);
      }
    } catch (error) {
      console.error('Error updating total budget:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ecb613]" />
      </div>
    );
  }

  const totalSpent = budget.categories?.reduce((sum, cat) => sum + cat.finalCost, 0) || 0;
  const isOverBudget = totalSpent > budget.totalBudget && budget.totalBudget > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#09090d] border border-white/10 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase mb-2">
              <Sparkles size={13} /> GESTIÓN FINANCIERA & CRUCE DE PROVEEDORES
            </div>
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-syne">
              Control de Presupuesto <span className="text-[#ecb613] italic">Nupcial</span>
            </h1>
            <p className="text-xs font-mono text-white/50 mt-1">
              Seguimiento transparente de costes, depósitos Hold 100 € y liquidaciones 80/10/10.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Modal de edición rápida del presupuesto objetivo */}
            {isEditingTotal ? (
              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-[#ecb613]/40">
                <input
                  type="number"
                  value={newTotalBudget}
                  onChange={(e) => setNewTotalBudget(e.target.value)}
                  placeholder="Presupuesto Total (€)"
                  className="w-36 px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-jetbrains text-white focus:outline-none focus:border-[#ecb613]"
                  autoFocus
                />
                <button
                  onClick={handleUpdateTotalBudget}
                  className="p-2 bg-[#ecb613] hover:bg-amber-400 text-black rounded-xl font-bold transition-all"
                  title="Guardar"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditingTotal(false)}
                  className="p-2 bg-white/10 text-white/70 hover:text-white rounded-xl transition-all"
                  title="Cancelar"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTotal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white/80 hover:text-white transition-all"
              >
                <Edit3 size={14} className="text-[#ecb613]" />
                Fijar Presupuesto Total
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white/80 hover:text-white transition-all"
            >
              <Printer size={14} />
              Imprimir
            </button>

            <button
              onClick={() => {
                setSelectedCategoryId(undefined);
                setIsExpenseModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/20 transition-all transform hover:scale-[1.02]"
            >
              <Plus size={15} />
              Nuevo Gasto
            </button>
          </div>
        </div>

        {/* Alerta de Desviación */}
        {isOverBudget && (
          <div className="bg-red-950/20 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-300 uppercase tracking-wider font-mono">Presupuesto Excedido</p>
              <p className="text-xs text-red-400/80 font-mono">
                La suma de gastos supera en {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalSpent - budget.totalBudget)} el límite fijado.
              </p>
            </div>
          </div>
        )}

        {/* KPIs Principales */}
        <BudgetOverview budget={budget} />

        {/* Gráfica Recharts */}
        <BudgetChart categories={budget.categories || []} />

        {/* Cuadrícula de Categorías */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-syne uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Partidas del Presupuesto
            </h2>
            <span className="text-xs font-mono text-white/40">13 Categorías Estándar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budget.categories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onAddExpense={(catId) => {
                  setSelectedCategoryId(catId);
                  setIsExpenseModalOpen(true);
                }}
                onEditCategory={(cat) => {
                  const val = prompt(`Fijar presupuesto estimado para "${cat.name}":`, String(cat.estimatedCost));
                  if (val !== null) {
                    const parsed = Number(val);
                    if (!isNaN(parsed)) {
                      fetch('/api/budget/expenses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          budgetId: budget.id,
                          categoryId: cat.id,
                          description: 'Ajuste de Estimación',
                          amount: 0,
                          date: new Date().toISOString().split('T')[0],
                          notes: `Estimación fijada en ${parsed} €`
                        })
                      }).then(() => fetchData());
                    }
                  }
                }}
                onDeleteCategory={handleDeleteCategory}
              />
            ))}
          </div>
        </div>

        {/* Modal de Registro */}
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
