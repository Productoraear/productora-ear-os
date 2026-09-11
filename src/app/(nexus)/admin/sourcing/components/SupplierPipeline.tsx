"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Star,
  Mail,
  Phone,
  Search,
  GripVertical,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import {
  getSuppliers,
  upsertSupplier,
  updateSupplierStage,
  deleteSupplier,
  type Supplier,
  type SupplierStage,
} from "../actions/server-actions";

const STAGES: { id: SupplierStage; label: string; color: string; bg: string }[] = [
  { id: "identified", label: "Identificado", color: "text-neutral-400", bg: "bg-neutral-800" },
  { id: "contacted", label: "Contactado", color: "text-blue-400", bg: "bg-blue-950/40" },
  { id: "shortlisted", label: "Shortlist", color: "text-amber-400", bg: "bg-amber-950/40" },
  { id: "approved", label: "Aprobado", color: "text-emerald-400", bg: "bg-emerald-950/40" },
  { id: "contracted", label: "Contratado", color: "text-violet-400", bg: "bg-violet-950/40" },
  { id: "rejected", label: "Descartado", color: "text-red-400", bg: "bg-red-950/40" },
];

const CATEGORIES = [
  "Espacio",
  "Catering",
  "Producción Musical",
  "Foto & Vídeo",
  "Decoración",
  "Organización",
  "Transporte",
  "Otro",
];

const fmt = (n: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export default function SupplierPipeline() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formStage, setFormStage] = useState<SupplierStage>("identified");
  const [formRating, setFormRating] = useState(5);
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formQuoted, setFormQuoted] = useState(0);
  const [formProjected, setFormProjected] = useState(0);
  const [formPaid, setFormPaid] = useState(0);
  const [formSource, setFormSource] = useState("");

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    const res = await getSuppliers();
    if (res.success && res.data) {
      setSuppliers(res.data);
    } else {
      setError(res.error ?? "Error al cargar proveedores");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormCategory(CATEGORIES[0]);
    setFormStage("identified");
    setFormRating(5);
    setFormEmail("");
    setFormPhone("");
    setFormQuoted(0);
    setFormProjected(0);
    setFormPaid(0);
    setFormSource("");
    setShowForm(false);
  };

  const openEdit = (s: Supplier) => {
    setEditingId(s.id);
    setFormName(s.name);
    setFormCategory(s.category);
    setFormStage(s.stage);
    setFormRating(s.rating);
    setFormEmail(s.contact_email ?? "");
    setFormPhone(s.phone_number ?? "");
    setFormQuoted(s.quoted_price);
    setFormProjected(s.projected_cost);
    setFormPaid(s.paid_amount);
    setFormSource(s.lead_source ?? "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertSupplier({
      id: editingId ?? undefined,
      name: formName,
      category: formCategory,
      stage: formStage,
      rating: formRating,
      contact_email: formEmail || null,
      phone_number: formPhone || null,
      quoted_price: formQuoted,
      projected_cost: formProjected,
      paid_amount: formPaid,
      lead_source: formSource || null,
    });
    setSaving(false);
    if (res.success) {
      resetForm();
      await loadSuppliers();
    } else {
      setError(res.error ?? "Error al guardar");
    }
  };

  const handleStageChange = async (id: string, stage: SupplierStage) => {
    await updateSupplierStage(id, stage);
    await loadSuppliers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proveedor?")) return;
    await deleteSupplier(id);
    await loadSuppliers();
  };

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar proveedor o categoría..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Nuevo Proveedor
        </button>
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono">
            {editingId ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Nombre</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej: Finca La Alquería"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Categoría</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Etapa</label>
              <select
                value={formStage}
                onChange={(e) => setFormStage(e.target.value as SupplierStage)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="contacto@finca.com"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Teléfono</label>
              <input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={formRating}
                onChange={(e) => setFormRating(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Precio Cotizado (€)</label>
              <input
                type="number"
                value={formQuoted}
                onChange={(e) => setFormQuoted(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Coste Proyectado (€)</label>
              <input
                type="number"
                value={formProjected}
                onChange={(e) => setFormProjected(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Pagado (€)</label>
              <input
                type="number"
                value={formPaid}
                onChange={(e) => setFormPaid(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Fuente del Lead</label>
              <input
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                placeholder="Ej: Bodas.net, Referido, SEO"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Proveedor"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono text-neutral-300 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* ── KANBAN BOARD ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAGES.map((stage) => {
          const stageSuppliers = filtered.filter((s) => s.stage === stage.id);
          return (
            <div key={stage.id} className="space-y-3">
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${stage.bg} border border-neutral-800`}>
                <span className={`text-xs font-mono font-bold ${stage.color}`}>{stage.label}</span>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full">
                  {stageSuppliers.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {stageSuppliers.length === 0 ? (
                  <div className="text-center py-6 text-neutral-600 text-xs font-mono">
                    Vacío
                  </div>
                ) : (
                  stageSuppliers.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{s.name}</p>
                          <p className="text-[10px] font-mono text-neutral-500">{s.category}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className={`w-3 h-3 ${s.rating >= 4 ? "text-amber-400" : "text-neutral-600"}`} />
                          <span className="text-[10px] font-mono text-neutral-400">{s.rating}</span>
                        </div>
                      </div>

                      {s.quoted_price > 0 && (
                        <p className="text-xs font-mono text-amber-400 mt-2">{fmt(s.quoted_price)}</p>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-neutral-500">
                        {s.contact_email && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <Mail className="w-3 h-3 shrink-0" /> {s.contact_email.slice(0, 15)}...
                          </span>
                        )}
                        {s.phone_number && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 shrink-0" /> {s.phone_number}
                          </span>
                        )}
                      </div>

                      {/* ── ACCIONES ── */}
                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-neutral-800">
                        <select
                          value={s.stage}
                          onChange={(e) => handleStageChange(s.id, e.target.value as SupplierStage)}
                          className="flex-1 bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-[10px] font-mono text-neutral-300 focus:border-amber-400 focus:outline-none cursor-pointer"
                        >
                          {STAGES.map((st) => (
                            <option key={st.id} value={st.id}>{st.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <GripVertical className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-md hover:bg-red-950/50 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── RESUMEN FINANCIERO ── */}
      {suppliers.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <p className="text-xs font-mono text-neutral-400 mb-1">TOTAL COTIZADO</p>
            <p className="text-lg font-bold text-white font-mono">
              {fmt(suppliers.reduce((s, x) => s + x.quoted_price, 0))}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <p className="text-xs font-mono text-neutral-400 mb-1">PROYECTADO</p>
            <p className="text-lg font-bold text-amber-400 font-mono">
              {fmt(suppliers.reduce((s, x) => s + x.projected_cost, 0))}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <p className="text-xs font-mono text-neutral-400 mb-1">PAGADO</p>
            <p className="text-lg font-bold text-emerald-400 font-mono">
              {fmt(suppliers.reduce((s, x) => s + x.paid_amount, 0))}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <p className="text-xs font-mono text-neutral-400 mb-1">CONTRATADOS</p>
            <p className="text-lg font-bold text-violet-400 font-mono">
              {suppliers.filter((s) => s.stage === "contracted").length}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs font-mono">
          <XCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
