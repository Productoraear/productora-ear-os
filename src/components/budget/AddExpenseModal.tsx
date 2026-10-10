'use client';

import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Building2 } from 'lucide-react';
import { BudgetCategory, Vendor } from '@/types/budget';

interface ExpenseFormData {
  description: string;
  amount: string;
  date: string;
  categoryId: string;
  vendorId: string;
  notes: string;
}

interface ExpensePayload extends Omit<ExpenseFormData, 'amount'> {
  amount: number;
  budgetId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: BudgetCategory[];
  vendors: Vendor[];
  budgetId: string;
  preselectedCategoryId?: string;
  onSave: (expense: ExpensePayload) => Promise<void>;
}

const buildInitialFormData = (preselectedCategoryId?: string): ExpenseFormData => ({
  description: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: preselectedCategoryId || '',
  vendorId: '',
  notes: '',
});

export default function AddExpenseModal({
  isOpen,
  onClose,
  categories,
  vendors,
  budgetId,
  preselectedCategoryId,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<ExpenseFormData>(() =>
    buildInitialFormData(preselectedCategoryId)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;

    await onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      budgetId,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData(buildInitialFormData(preselectedCategoryId));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
        aria-describedby="add-expense-description"
        className="bg-[#09090d] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="p-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]"
            >
              <DollarSign size={18} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="add-expense-title"
                className="text-lg font-bold text-white font-syne uppercase tracking-wider"
              >
                Nuevo Gasto / Reserva
              </h2>
              <p
                id="add-expense-description"
                className="text-[11px] font-mono text-white/40"
              >
                Vincula proveedores y partidas al presupuesto
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal de nuevo gasto"
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-label="Formulario de registro de nuevo gasto"
          className="p-6 space-y-4 max-h-[calc(90vh-180px)] overflow-y-auto"
        >
          <div>
            <label
              htmlFor="expense-description"
              className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5"
            >
              <FileText size={13} className="text-[#ecb613]" aria-hidden="true" /> Concepto del Gasto *
            </label>
            <input
              id="expense-description"
              name="description"
              type="text"
              required
              aria-required="true"
              aria-label="Concepto del gasto"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] text-white text-sm font-sans placeholder:text-white/20"
              placeholder="Ej: Señal Solista Edwin Agudelo (350 € Base)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="expense-amount"
                className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5"
              >
                <DollarSign size={13} className="text-[#ecb613]" aria-hidden="true" /> Importe (€) *
              </label>
              <input
                id="expense-amount"
                name="amount"
                type="number"
                required
                aria-required="true"
                aria-label="Importe en euros"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] text-white text-sm font-jetbrains placeholder:text-white/20"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="expense-date"
                className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5"
              >
                <Calendar size={13} className="text-[#ecb613]" aria-hidden="true" /> Fecha *
              </label>
              <input
                id="expense-date"
                name="date"
                type="date"
                required
                aria-required="true"
                aria-label="Fecha del gasto"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] text-white text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-category"
              className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5"
            >
              <Tag size={13} className="text-[#ecb613]" aria-hidden="true" /> Categoría del Presupuesto *
            </label>
            <select
              id="expense-category"
              name="categoryId"
              required
              aria-required="true"
              aria-label="Categoría del presupuesto"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-[#12121a] border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] text-white text-sm font-sans"
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="bg-[#12121a] text-white"
                >
                  {category.icon || '📦'} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="expense-vendor"
              className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5"
            >
              <Building2 size={13} className="text-[#a855f7]" aria-hidden="true" /> Proveedor Homologado (Directorio EAR OS)
            </label>
            <select
              id="expense-vendor"
              name="vendorId"
              aria-label="Proveedor homologado del directorio EAR OS"
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-4 py-3 bg-[#12121a] border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] text-white text-sm font-sans"
            >
              <option value="">Vincular Proveedor (Opcional)</option>
              {vendors.map((vendor) => (
                <option
                  key={vendor.id}
                  value={vendor.id}
                  className="bg-[#12121a] text-white"
                >
                  {vendor.name} ({vendor.category || 'Servicio'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="expense-notes"
              className="text-xs font-mono uppercase text-white/60 mb-1.5 block"
            >
              Notas / Observaciones del Rider
            </label>
            <textarea
              id="expense-notes"
              name="notes"
              aria-label="Notas y observaciones del rider"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] text-white text-xs font-sans placeholder:text-white/20"
              placeholder="Detalles sobre depósito Hold 100 €, acústica 12 W/pax o fechas..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cancelar y cerrar el formulario de nuevo gasto"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              aria-label="Registrar el nuevo gasto en el presupuesto"
              className="px-6 py-2.5 bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/20 transition-all transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
            >
              Registrar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}