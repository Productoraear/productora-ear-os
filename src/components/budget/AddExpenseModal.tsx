'use client';

import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Building2 } from 'lucide-react';
import { BudgetCategory, Vendor } from '@/types/budget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: BudgetCategory[];
  vendors: Vendor[];
  budgetId: string;
  preselectedCategoryId?: string;
  onSave: (expense: any) => Promise<void>;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  categories,
  vendors,
  budgetId,
  preselectedCategoryId,
  onSave,
}: Props) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: preselectedCategoryId || '',
    vendorId: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    setFormData({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: preselectedCategoryId || '',
      vendorId: '',
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#09090d] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
              <DollarSign size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-syne uppercase tracking-wider">Nuevo Gasto / Reserva</h2>
              <p className="text-[11px] font-mono text-white/40">Vincula proveedores y partidas al presupuesto</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div>
            <label className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
              <FileText size={13} className="text-[#ecb613]" /> Concepto del Gasto *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none text-white text-sm font-sans placeholder:text-white/20"
              placeholder="Ej: Señal Solista Edwin Agudelo (350 € Base)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                <DollarSign size={13} className="text-[#ecb613]" /> Importe (€) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none text-white text-sm font-jetbrains placeholder:text-white/20"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                <Calendar size={13} className="text-[#ecb613]" /> Fecha *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none text-white text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
              <Tag size={13} className="text-[#ecb613]" /> Categoría del Presupuesto *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-[#12121a] border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none text-white text-sm font-sans"
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-[#12121a] text-white">
                  {category.icon || '📦'} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
              <Building2 size={13} className="text-[#a855f7]" /> Proveedor Homologado (Directorio EAR OS)
            </label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-4 py-3 bg-[#12121a] border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none text-white text-sm font-sans"
            >
              <option value="">Vincular Proveedor (Opcional)</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id} className="bg-[#12121a] text-white">
                  {vendor.name} ({vendor.category || 'Servicio'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">Notas / Observaciones del Rider</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-[#ecb613] focus:outline-none text-white text-xs font-sans placeholder:text-white/20"
              placeholder="Detalles sobre depósito Hold 100 €, acústica 12 W/pax o fechas..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/20 transition-all transform hover:scale-[1.02]"
            >
              Registrar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
