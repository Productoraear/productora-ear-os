"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Flag,
  Calendar,
  User,
  Link2,
} from "lucide-react";
import {
  getChecklist,
  upsertChecklist,
  toggleTaskStatus,
  deleteChecklistItem,
  type ChecklistItem,
  type ChecklistStatus,
} from "../actions/server-actions";

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-neutral-800 text-neutral-400 border-neutral-700",
  medium: "bg-blue-950/40 text-blue-400 border-blue-800/50",
  high: "bg-amber-950/40 text-amber-400 border-amber-800/50",
  critical: "bg-red-950/40 text-red-400 border-red-800/50",
};

const STATUS_STYLES: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Circle className="w-4 h-4" />, label: "Pendiente", color: "text-neutral-400" },
  in_progress: { icon: <Clock className="w-4 h-4" />, label: "En Progreso", color: "text-blue-400" },
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, label: "Completado", color: "text-emerald-400" },
};

type SortMode = "status" | "deadline" | "priority";

export default function ProductionChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("status");

  // Form
  const [formTask, setFormTask] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formPriority, setFormPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [formAssigned, setFormAssigned] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  const [formDependsOn, setFormDependsOn] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    const res = await getChecklist();
    if (res.success && res.data) {
      setItems(res.data);
    } else {
      setError(res.error ?? "Error al cargar checklist");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // ─── PROGRESO ──────────────────────────────────────────────────────────────

  const total = items.length;
  const completed = items.filter((i) => i.status === "completed").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;
  const pending = items.filter((i) => i.status === "pending").length;
  const progressPct = total > 0 ? (completed / total) * 100 : 0;

  // ─── ORDENACIÓN ────────────────────────────────────────────────────────────

  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const sorted = [...items].sort((a, b) => {
    if (sortMode === "status") {
      const statusOrder: Record<string, number> = { in_progress: 0, pending: 1, completed: 2 };
      return (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
    }
    if (sortMode === "deadline") {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    }
    return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
  });

  // ─── FORM ──────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setEditingId(null);
    setFormTask("");
    setFormCategory("general");
    setFormPriority("medium");
    setFormAssigned("");
    setFormDeadline("");
    setFormDependsOn("");
    setShowForm(false);
  };

  const openEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setFormTask(item.task_name);
    setFormCategory(item.category);
    setFormPriority(item.priority);
    setFormAssigned(item.assigned_to ?? "");
    setFormDeadline(item.deadline ?? "");
    setFormDependsOn(item.depends_on ?? "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertChecklist({
      id: editingId ?? undefined,
      task_name: formTask,
      category: formCategory,
      priority: formPriority,
      assigned_to: formAssigned || null,
      deadline: formDeadline || null,
      depends_on: formDependsOn || null,
    });
    setSaving(false);
    if (res.success) {
      resetForm();
      await loadItems();
    } else {
      setError(res.error ?? "Error al guardar");
    }
  };

  const handleToggle = async (id: string, status: ChecklistStatus) => {
    await toggleTaskStatus(id, status);
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await deleteChecklistItem(id);
    await loadItems();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── PROGRESO GLOBAL ── */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono">PROGRESO DE PRODUCCIÓN</h3>
            <p className="text-xs text-neutral-400 font-mono">
              {completed} de {total} tareas completadas
            </p>
          </div>
          <span className={`text-2xl font-black font-mono ${progressPct === 100 ? "text-emerald-400" : "text-amber-400"}`}>
            {progressPct.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? "bg-emerald-400" : "bg-amber-400"}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <Circle className="w-3 h-3" /> {pending} Pendientes
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
            <Clock className="w-3 h-3" /> {inProgress} En Progreso
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {completed} Completadas
          </span>
        </div>
      </div>

      {/* ── CONTROLES ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">Ordenar por:</span>
          {(["status", "deadline", "priority"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                sortMode === mode
                  ? "bg-amber-400 text-neutral-950 font-bold"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700"
              }`}
            >
              {mode === "status" ? "Estado" : mode === "deadline" ? "Fecha" : "Prioridad"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva Tarea
        </button>
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono">
            {editingId ? "Editar Tarea" : "Nueva Tarea de Producción"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-mono text-neutral-400 block mb-1">Tarea</label>
              <input
                value={formTask}
                onChange={(e) => setFormTask(e.target.value)}
                placeholder="Ej: Homologación de generador eléctrico"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Categoría</label>
              <input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Ej: Permisos, Rider, Seating"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Prioridad</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as "low" | "medium" | "high" | "critical")}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Asignado a</label>
              <input
                value={formAssigned}
                onChange={(e) => setFormAssigned(e.target.value)}
                placeholder="Ej: Edwin Agudelo"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Fecha Límite</label>
              <input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Depende de (ID)</label>
              <input
                value={formDependsOn}
                onChange={(e) => setFormDependsOn(e.target.value)}
                placeholder="UUID de tarea dependiente (opcional)"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Tarea"}
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

      {/* ── LISTA DE TAREAS ── */}
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 font-mono text-sm">
            Sin tareas de producción. Crea la primera puerta de producción.
          </div>
        ) : (
          sorted.map((item) => {
            const statusInfo = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;
            const isOverdue = item.deadline && item.status !== "completed" && new Date(item.deadline) < new Date();
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all group ${
                  item.status === "completed"
                    ? "bg-emerald-950/20 border-emerald-800/30"
                    : isOverdue
                      ? "bg-red-950/20 border-red-800/40"
                      : "bg-neutral-900 border-neutral-800 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* ── TOGGLE ── */}
                  <button
                    onClick={() => handleToggle(item.id, item.status)}
                    className={`shrink-0 mt-0.5 cursor-pointer transition-colors ${statusInfo.color}`}
                    title={`Cambiar a ${item.status === "pending" ? "En Progreso" : item.status === "in_progress" ? "Completado" : "Pendiente"}`}
                  >
                    {statusInfo.icon}
                  </button>

                  {/* ── CONTENIDO ── */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold ${item.status === "completed" ? "text-neutral-500 line-through" : "text-white"}`}>
                        {item.task_name}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.medium}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/50 text-red-400 border border-red-800/50">
                          <AlertTriangle className="w-3 h-3" /> VENCIDA
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-neutral-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Flag className="w-3 h-3" /> {item.category}
                      </span>
                      {item.assigned_to && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {item.assigned_to}
                        </span>
                      )}
                      {item.deadline && (
                        <span className={`flex items-center gap-1 ${isOverdue ? "text-red-400" : ""}`}>
                          <Calendar className="w-3 h-3" /> {new Date(item.deadline).toLocaleDateString("es-ES")}
                        </span>
                      )}
                      {item.depends_on && (
                        <span className="flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> Depende de otra tarea
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── ACCIONES ── */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-950/50 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
