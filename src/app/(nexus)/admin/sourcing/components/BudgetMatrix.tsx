"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Target,
  PiggyBank,
  Clock,
} from "lucide-react";
import {
  getBudgets,
  upsertBudget,
  deleteBudget,
  type Budget,
  type BudgetStatus,
} from "../actions/server-actions";

// ─── CATEGORÍAS ESTÁNDAR S-CLASS (rango de control %) ───────────────────────

interface CategoryTemplate {
  name: string;
  minPct: number;
  maxPct: number;
  icon: string;
}

const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  { name: "Espacio & Exclusividad", minPct: 18, maxPct: 25, icon: "🏛️" },
  { name: "Catering & Bebida", minPct: 22, maxPct: 30, icon: "🍽️" },
  { name: "Producción & Espectáculo", minPct: 10, maxPct: 16, icon: "🎵" },
  { name: "Foto & Vídeo", minPct: 6, maxPct: 10, icon: "📷" },
  { name: "Diseño & Decoración", minPct: 10, maxPct: 16, icon: "🌸" },
  { name: "Organización & Contingencia", minPct: 15, maxPct: 22, icon: "📋" },
];

// ─── FORMATO MONEDA ──────────────────────────────────────────────────────────

const fmt = (n: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function BudgetMatrix() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetTotal, setTargetTotal] = useState(265000);
  const [guests, setGuests] = useState(150);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formCategory, setFormCategory] = useState("");
  const [formItem, setFormItem] = useState("");
  const [formTarget, setFormTarget] = useState(0);
  const [formEstimated, setFormEstimated] = useState(0);
  const [formActual, setFormActual] = useState(0);
  const [formPaid, setFormPaid] = useState(0);
  const [formStatus, setFormStatus] = useState<BudgetStatus>("draft");
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // ─── CARGA INICIAL ─────────────────────────────────────────────────────────

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    const res = await getBudgets();
    if (res.success && res.data) {
      setBudgets(res.data);
    } else {
      setError(res.error ?? "Error al cargar presupuestos");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  // ─── TOTALES CALCULADOS ────────────────────────────────────────────────────

  const totalTarget = budgets.reduce((s, b) => s + (b.target_budget || 0), 0);
  const totalEstimated = budgets.reduce((s, b) => s + (b.estimated_cost || 0), 0);
  const totalActual = budgets.reduce((s, b) => s + (b.actual_cost || 0), 0);
  const totalPaid = budgets.reduce((s, b) => s + (b.paid_amount || 0), 0);
  const totalPending = totalActual - totalPaid;
  const deviation = totalTarget > 0 ? ((totalActual - totalTarget) / totalTarget) * 100 : 0;
  const isOverBudget = totalActual > totalTarget;

  // ─── RESET FORM ────────────────────────────────────────────────────────────

  const resetForm = () => {
    setEditingId(null);
    setFormCategory("");
    setFormItem("");
    setFormTarget(0);
    setFormEstimated(0);
    setFormActual(0);
    setFormPaid(0);
    setFormStatus("draft");
    setFormNotes("");
    setShowForm(false);
  };

  const openEdit = (b: Budget) => {
    setEditingId(b.id);
    setFormCategory(b.category);
    setFormItem(b.item_name);
    setFormTarget(b.target_budget);
    setFormEstimated(b.estimated_cost);
    setFormActual(b.actual_cost);
    setFormPaid(b.paid_amount);
    setFormStatus(b.status);
    setFormNotes(b.notes ?? "");
    setShowForm(true);
  };

  // ─── SUBMIT ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertBudget({
      id: editingId ?? undefined,
      category: formCategory,
      item_name: formItem,
      target_budget: formTarget,
      estimated_cost: formEstimated,
      actual_cost: formActual,
      paid_amount: formPaid,
      total_guests: guests,
      status: formStatus,
      notes: formNotes || null,
    });
    setSaving(false);
    if (res.success) {
      resetForm();
      await loadBudgets();
    } else {
      setError(res.error ?? "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta partida presupuestaria?")) return;
    await deleteBudget(id);
    await loadBudgets();
  };

  // ─── CARGAR PLANTILLA ESTÁNDAR ─────────────────────────────────────────────

  const loadStandardTemplate = async () => {
    setSaving(true);
    for (const tpl of CATEGORY_TEMPLATES) {
      const midPct = (tpl.minPct + tpl.maxPct) / 2;
      const amount = Math.round((targetTotal * midPct) / 100);
      await upsertBudget({
        category: tpl.name,
        item_name: `${tpl.icon} ${tpl.name} (${tpl.minPct}–${tpl.maxPct}%)`,
        target_budget: amount,
        estimated_cost: amount,
        actual_cost: 0,
        paid_amount: 0,
        total_guests: guests,
        status: "draft",
      });
    }
    setSaving(false);
    await loadBudgets();
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── KPI HEADER ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <Target className="w-3.5 h-3.5" /> OBJETIVO
          </div>
          <p className="text-xl font-bold text-white font-mono">{fmt(targetTotal)}</p>
          <p className="text-[10px] text-neutral-500 font-mono">{guests} invitados</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <Wallet className="w-3.5 h-3.5" /> REAL
          </div>
          <p className={`text-xl font-bold font-mono ${isOverBudget ? "text-red-400" : "text-emerald-400"}`}>
            {fmt(totalActual)}
          </p>
          <p className="text-[10px] text-neutral-500 font-mono">
            {deviation >= 0 ? "+" : ""}{deviation.toFixed(1)}% desviación
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <PiggyBank className="w-3.5 h-3.5" /> PAGADO
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono">{fmt(totalPaid)}</p>
          <p className="text-[10px] text-neutral-500 font-mono">
            {totalActual > 0 ? ((totalPaid / totalActual) * 100).toFixed(0) : 0}% cubierto
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <Clock className="w-3.5 h-3.5" /> PENDIENTE
          </div>
          <p className={`text-xl font-bold font-mono ${totalPending > 0 ? "text-orange-400" : "text-neutral-400"}`}>
            {fmt(Math.max(0, totalPending))}
          </p>
          <p className="text-[10px] text-neutral-500 font-mono">por liquidar</p>
        </div>
      </div>

      {/* ── ALERTA DESVIACIÓN ── */}
      {isOverBudget && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Desviación presupuestaria detectada</p>
            <p className="text-xs text-red-400/80">
              El gasto real excede el objetivo en {fmt(totalActual - totalTarget)}. Revisa las partidas críticas.
            </p>
          </div>
        </div>
      )}

      {/* ── CONTROLES ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-neutral-400">Objetivo:</label>
          <input
            type="number"
            value={targetTotal}
            onChange={(e) => setTargetTotal(Number(e.target.value))}
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm font-mono text-white w-32 focus:border-amber-400 focus:outline-none"
          />
          <label className="text-xs font-mono text-neutral-400">Invitados:</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm font-mono text-white w-20 focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadStandardTemplate}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono text-neutral-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Cargar Plantilla Estándar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Partida
          </button>
        </div>
      </div>

      {/* ── FORMULARIO ── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono">
            {editingId ? "Editar Partida" : "Nueva Partida Presupuestaria"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Categoría</label>
              <input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Ej: Catering & Bebida"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Concepto</label>
              <input
                value={formItem}
                onChange={(e) => setFormItem(e.target.value)}
                placeholder="Ej: Menú degustación 5 platos"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Presupuesto Objetivo (€)</label>
              <input
                type="number"
                value={formTarget}
                onChange={(e) => setFormTarget(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Coste Estimado (€)</label>
              <input
                type="number"
                value={formEstimated}
                onChange={(e) => setFormEstimated(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Coste Real (€)</label>
              <input
                type="number"
                value={formActual}
                onChange={(e) => setFormActual(Number(e.target.value))}
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
              <label className="text-xs font-mono text-neutral-400 block mb-1">Estado</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as BudgetStatus)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="approved">Aprobado</option>
                <option value="locked">Bloqueado</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Notas</label>
              <input
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Notas opcionales"
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
              {saving ? "Guardando..." : "Guardar Partida"}
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

      {/* ── TABLA DE PARTIDAS ── */}
      <div className="rounded-2xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900 border-b border-neutral-800">
              <th className="text-left px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Categoría</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Concepto</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Objetivo</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Real</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Pagado</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Δ</th>
              <th className="text-center px-4 py-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-neutral-500 font-mono text-sm">
                  Sin partidas presupuestarias. Carga la plantilla estándar o crea una nueva.
                </td>
              </tr>
            ) : (
              budgets.map((b) => {
                const delta = b.actual_cost - b.target_budget;
                const deltaPct = b.target_budget > 0 ? (delta / b.target_budget) * 100 : 0;
                const isOver = delta > 0;
                return (
                  <tr key={b.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{b.category}</td>
                    <td className="px-4 py-3 text-neutral-300 max-w-[200px] truncate">{b.item_name}</td>
                    <td className="px-4 py-3 text-right font-mono text-neutral-200">{fmt(b.target_budget)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${isOver ? "text-red-400" : "text-emerald-400"}`}>
                      {fmt(b.actual_cost)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-amber-400">{fmt(b.paid_amount)}</td>
                    <td className={`px-4 py-3 text-right font-mono text-xs ${isOver ? "text-red-400" : "text-emerald-400"}`}>
                      {deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        b.status === "locked"
                          ? "bg-red-950/50 text-red-400 border border-red-800/50"
                          : b.status === "approved"
                            ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/50"
                            : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                      }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(b)}
                          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded-lg hover:bg-red-950/50 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── RESUMEN POR CATEGORÍA ── */}
      {budgets.length > 0 && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4">Distribución por Categoría</h3>
          <div className="space-y-3">
            {CATEGORY_TEMPLATES.map((tpl) => {
              const catBudgets = budgets.filter((b) => b.category === tpl.name);
              const catTarget = catBudgets.reduce((s, b) => s + b.target_budget, 0);
              const catActual = catBudgets.reduce((s, b) => s + b.actual_cost, 0);
              const pct = targetTotal > 0 ? (catTarget / targetTotal) * 100 : 0;
              const inRange = pct >= tpl.minPct && pct <= tpl.maxPct;
              return (
                <div key={tpl.name} className="flex items-center gap-3">
                  <span className="text-lg w-8">{tpl.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-neutral-300">{tpl.name}</span>
                      <span className={`text-xs font-mono ${inRange ? "text-emerald-400" : "text-orange-400"}`}>
                        {pct.toFixed(1)}% ({tpl.minPct}–{tpl.maxPct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${inRange ? "bg-amber-400" : "bg-orange-500"}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-400 w-24 text-right">
                    {fmt(catActual)} / {fmt(catTarget)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
