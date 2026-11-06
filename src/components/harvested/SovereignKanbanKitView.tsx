'use client';

import React, { useState } from 'react';
import {
  Kanban,
  List,
  Clock,
  User,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface KanbanTask {
  id: string;
  title: string;
  category: string;
  assignee: string;
  time: string;
  status: 'montaje' | 'soundcheck' | 'directo' | 'liquidacion';
}

const DEFAULT_TASKS: KanbanTask[] = [
  {
    id: 'k-1',
    title: 'Despliegue Hardware Bose F1 (2.000W)',
    category: 'Sonorización',
    assignee: 'Técnico EAR',
    time: '16:00',
    status: 'montaje',
  },
  {
    id: 'k-2',
    title: 'Calibración Acústica Ley 37/2003 (< 75 dB SPL)',
    category: 'Ingeniería',
    assignee: 'Técnico de Sala',
    time: '17:30',
    status: 'soundcheck',
  },
  {
    id: 'k-3',
    title: 'Directo Solista Edwin Agudelo (Tenor Gala)',
    category: 'Música en Vivo',
    assignee: 'Edwin Agudelo',
    time: '21:30',
    status: 'directo',
  },
  {
    id: 'k-4',
    title: 'Reparto Soberano 80/10/10 & Cierre de Expediente',
    category: 'Finanzas ACID',
    assignee: 'Sistema Autónomo',
    time: '02:00',
    status: 'liquidacion',
  },
];

export function SovereignKanbanKitView() {
  const [tasks, setTasks] = useState<KanbanTask[]>(DEFAULT_TASKS);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const columns: { key: KanbanTask['status']; label: string; color: string }[] = [
    { key: 'montaje', label: '01. Montaje & Carga', color: 'border-zinc-500' },
    { key: 'soundcheck', label: '02. Soundcheck Acústico', color: 'border-cyan-500' },
    { key: 'directo', label: '03. En Directo (Gala)', color: 'border-amber-400' },
    { key: 'liquidacion', label: '04. Liquidación 80/10/10', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-display">Tablero de Producción de Eventos (Kanban)</h3>
          <p className="text-xs text-zinc-400 font-mono">Trazabilidad operativa desde la llegada hasta el split de liquidación</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'board' ? 'bg-[#ecb613] text-zinc-950 font-bold' : 'text-zinc-400'}`}
          >
            Tablero
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#ecb613] text-zinc-950 font-bold' : 'text-zinc-400'}`}
          >
            Lista
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-mono font-bold text-white">{col.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/10">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2 shadow-lg"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#ecb613] font-bold">{task.category}</span>
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.time}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white leading-snug">{task.title}</div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-cyan-400" /> {task.assignee}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-zinc-950 border border-white/10 divide-y divide-white/5">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <div className="text-white font-bold">{task.title}</div>
                <div className="text-[10px] text-zinc-500">{task.category} · Responsable: {task.assignee}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-amber-400">{task.time}</span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 uppercase text-[10px]">
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

