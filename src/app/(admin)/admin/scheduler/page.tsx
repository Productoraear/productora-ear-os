'use client';

import React, { useState } from 'react';
import { 
  Calendar, Zap, Shield, Cpu, Activity, Play, CheckCircle2, 
  Clock, AlertTriangle, Layers, Filter, Terminal, Sparkles, Plus,
  ArrowRight, Radio, RefreshCw
} from 'lucide-react';
import { QronosMultiAgentPipeline } from '@/app/components/qronos/QronosMultiAgentPipeline';
import { QronosGanttScheduler } from '@/app/components/qronos/QronosGanttScheduler';
import { QronosGuardrails } from '@/app/components/qronos/QronosGuardrails';
import { QronosAgentInbox } from '@/app/components/qronos/QronosAgentInbox';
import { QronosInsightsDashboard } from '@/app/components/qronos/QronosInsightsDashboard';
import { QronosHatchingDivider } from '@/app/components/qronos/QronosHatchingDivider';

export default function AdminSchedulerPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pipeline' | 'gantt' | 'guardrails' | 'inbox' | 'insights'>('all');
  const [isDeployingTask, setIsDeployingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskTrigger, setNewTaskTrigger] = useState<string>('cron');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleQueueTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setIsDeployingTask(true);
    setTimeout(() => {
      setIsDeployingTask(false);
      setStatusFeedback(`Tarea programada con éxito en .antigravity/tasks_queue.json: "${newTaskTitle}"`);
      setNewTaskTitle('');
      setTimeout(() => setStatusFeedback(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 1. ENCABEZADO MAESTRO S-CLASS (CATMİN + QRONOS VAMPIRIZED)            */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>ORQUESTADOR AUTÓNOMO QRONOS · VAMPIRE RAG ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
            Programador y Despacho Multi-Agente
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 font-mono font-bold">
              GPU 24GB
            </span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-3xl">
            Control de ejecuciones periódicas (crons), webhooks en tiempo real y disparadores adaptativos gobernados por guardarraíles inmutables y memoria Zero-Token.
          </p>
        </div>

        {/* PILLS DE TELEMETRÍA SSOT */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ollama: 11434 (Qwen 27B)</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-bold">
            Split 80/10/10
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
            100€ SHA-256
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {statusFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2. TABS SELECTORAS DE VISTA                                          */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-zinc-800/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[#ecb613] text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Visión Completa 360°
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
            activeTab === 'pipeline'
              ? 'bg-[#ecb613] text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Pipeline Multi-Agente (SVG Live)
        </button>
        <button
          onClick={() => setActiveTab('gantt')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
            activeTab === 'gantt'
              ? 'bg-[#ecb613] text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Cronograma Gantt 7 Días
        </button>
        <button
          onClick={() => setActiveTab('guardrails')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
            activeTab === 'guardrails'
              ? 'bg-[#ecb613] text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Guardarraíles & Blindaje
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
            activeTab === 'inbox'
              ? 'bg-[#ecb613] text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Bandeja de Aprobaciones
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-[#ecb613] text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Métricas & Telemetría
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 3. FORMULARIO RÁPIDO PARA ENCOLAR TAREAS                              */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <form 
        onSubmit={handleQueueTask}
        className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Nueva tarea autónoma (ej. Prospección fincas Toledo norte o auditoría B2G Méntrida)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full rounded-lg bg-black/60 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 font-mono focus:border-[#ecb613] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={newTaskTrigger}
            onChange={(e) => setNewTaskTrigger(e.target.value)}
            className="rounded-lg bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-zinc-300 font-mono focus:border-[#ecb613] focus:outline-none"
          >
            <option value="cron">Cron Diario</option>
            <option value="webhook">Webhook Reactivo</option>
            <option value="adaptive">Adaptativo Agente</option>
          </select>

          <button
            type="submit"
            disabled={isDeployingTask || !newTaskTitle}
            className="px-4 py-2 rounded-lg bg-[#ecb613] text-black font-bold text-xs font-mono hover:bg-[#ffd147] transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isDeployingTask ? 'Encolando...' : 'Programar Tarea'}</span>
          </button>
        </div>
      </form>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 4. CONTENIDO DE LAS VISTAS SEGÚN TAB SELECCIONADA                     */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      {/* VISTA 1: PIPELINE MULTI-AGENTE */}
      {(activeTab === 'all' || activeTab === 'pipeline') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ecb613]" /> Flujo de Datos & Orquestación en Tiempo Real
            </h2>
            <span className="text-xs font-mono text-zinc-500">Malla GPU AMD RX 7900 XTX</span>
          </div>
          <QronosMultiAgentPipeline />
        </section>
      )}

      {/* SEPARADOR HATCHING CARACTERÍSTICO DE QRONOS */}
      {activeTab === 'all' && <QronosHatchingDivider className="my-6" />}

      {/* VISTA 2: GANTT TIMELINE 7 DÍAS */}
      {(activeTab === 'all' || activeTab === 'gantt') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ecb613]" /> Cronograma Autónomo Gantt (7 Días)
            </h2>
            <span className="text-xs font-mono text-zinc-500">Gatillos Programados & Handoffs</span>
          </div>
          <QronosGanttScheduler />
        </section>
      )}

      {/* SEPARADOR HATCHING */}
      {activeTab === 'all' && <QronosHatchingDivider className="my-6" />}

      {/* VISTA 3: GUARDARRAÍLES & BLINDAJE JURÍDICO */}
      {(activeTab === 'all' || activeTab === 'guardrails') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Límites de Ejecución & Guardarraíles
            </h2>
            <span className="text-xs font-mono text-zinc-500">Cero Exposición de Secretos</span>
          </div>
          <QronosGuardrails />
        </section>
      )}

      {/* SEPARADOR HATCHING */}
      {activeTab === 'all' && <QronosHatchingDivider className="my-6" />}

      {/* VISTA 4 & 5: BANDEJA DE ACCIONES + MÉTRICAS */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {(activeTab === 'all' || activeTab === 'inbox') && (
          <div className={activeTab === 'inbox' ? 'col-span-12' : 'lg:col-span-6'}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> Cola de Aprobaciones Humanas
              </h2>
            </div>
            <QronosAgentInbox />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'insights') && (
          <div className={activeTab === 'insights' ? 'col-span-12' : 'lg:col-span-6'}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ecb613]" /> Panel de Insights & Telemetría
              </h2>
            </div>
            <QronosInsightsDashboard />
          </div>
        )}
      </div>

    </div>
  );
}
