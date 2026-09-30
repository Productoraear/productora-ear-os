'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Plus, Check, X, Calendar, DollarSign, Gift, Edit3 } from 'lucide-react';
import { getVendorPromotionsAction, togglePromotionAction, savePromotionAction, PromotionItem } from '@/app/actions/vendorActions';

export default function VendorPromocionesPage() {
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState<PromotionItem | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    const data = await getVendorPromotionsAction('edwin-agudelo');
    setPromotions(data);
    setLoading(false);
  };

  const handleToggle = async (id: string) => {
    const res = await togglePromotionAction('edwin-agudelo', id);
    if (res.success && res.promotions) {
      setPromotions(res.promotions);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    const res = await savePromotionAction('edwin-agudelo', editingPromo);
    if (res.success && res.promotions) {
      setPromotions(res.promotions);
      setEditingPromo(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
            <Tag size={12} />
            <span>Gestor de Ofertas & Regalos S-Class</span>
          </div>
          <h1 className="text-3xl font-black font-syne text-white tracking-tight">
            Promociones y Regalos Editables
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Activa plantillas pre-aprobadas o personaliza ofertas exclusivas para destacar en las búsquedas de parejas.
          </p>
        </div>

        <button
          onClick={() => setEditingPromo({
            id: `promo-${Date.now()}`,
            title: 'Nueva Oferta Personalizada',
            description: 'Describe tu promoción o ventaja exclusiva para parejas.',
            discountType: 'PERCENT',
            value: '10%',
            active: true,
            validUntil: '2026-12-31'
          })}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all self-start sm:self-auto shadow-lg shadow-amber-950/40"
        >
          <Plus size={14} />
          <span>Crear Promoción</span>
        </button>
      </header>

      {/* Grid de Promociones */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-500">Cargando catálogo de promociones...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`p-6 rounded-3xl border backdrop-blur-xl transition-all relative space-y-4 ${
                promo.active 
                  ? 'bg-[#09090d]/90 border-[#ecb613]/40 shadow-xl shadow-amber-500/5' 
                  : 'bg-[#09090d]/40 border-white/5 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase border ${
                    promo.discountType === 'GIFT' 
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {promo.discountType === 'GIFT' ? <Gift size={12} className="inline mr-1" /> : <DollarSign size={12} className="inline mr-1" />}
                    {promo.value}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    <Calendar size={10} />
                    Hasta {promo.validUntil}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPromo(promo)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Editar Promoción"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => handleToggle(promo.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all flex items-center gap-1 ${
                      promo.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-zinc-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {promo.active ? <Check size={12} /> : <X size={12} />}
                    <span>{promo.active ? 'ACTIVA' : 'INACTIVA'}</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-syne text-white">{promo.title}</h3>
                <p className="text-xs text-zinc-400 font-light mt-1 leading-relaxed">
                  {promo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Editor de Promoción */}
      {editingPromo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#09090d] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#ecb613]" />
                <span>Editar Promoción / Oferta</span>
              </h3>
              <button
                onClick={() => setEditingPromo(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Título de la Oferta</label>
                <input
                  type="text"
                  value={editingPromo.title}
                  onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Descripción Detallada</label>
                <textarea
                  rows={3}
                  value={editingPromo.description}
                  onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Tipo de Ventaja</label>
                  <select
                    value={editingPromo.discountType}
                    onChange={(e) => setEditingPromo({ ...editingPromo, discountType: e.target.value as any })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ecb613]"
                  >
                    <option value="PERCENT">Porcentaje (%)</option>
                    <option value="FIXED">Importe Fijo (€)</option>
                    <option value="GIFT">Regalo / Extra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Valor / Etiqueta</label>
                  <input
                    type="text"
                    value={editingPromo.value}
                    onChange={(e) => setEditingPromo({ ...editingPromo, value: e.target.value })}
                    placeholder="ej. 10% o Regalo"
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Válido Hasta</label>
                <input
                  type="date"
                  value={editingPromo.validUntil}
                  onChange={(e) => setEditingPromo({ ...editingPromo, validUntil: e.target.value })}
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPromo(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-bold uppercase hover:bg-amber-400"
                >
                  Guardar Promoción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
