'use client';

import React, { useState } from 'react';
import {
  Activity,
  Bot,
  Terminal,
  Clock,
  Coins,
  ListTodo,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Database,
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

interface AgentSession {
  id: string;
  name: string;
  targetRole: 'ceo' | 'proveedor' | 'artista' | 'finca';
  status: 'running' | 'waiting_approval' | 'idle' | 'failed';
  costEur: number;
  tokensCount: number;
  activeTask: string;
  progressPercent: number;
}

export function AgentMonitorCeoWorkspace() {
  const [sessions, setSessions] = useState<AgentSession[]>([
    {
      id: 'sess-01',
      name: 'OmniAgent Orquestador S-Class',
      targetRole: 'ceo',
      status: 'waiting_approval',
      costEur: 0.142,
      tokensCount: 14200,
      activeTask: 'Despacho de cotización B2G Art. 118 LCSP a Ayuntamiento de Toledo (< 14.250 €)',
      progressPercent: 78,
    },
    {
      id: 'sess-02',
      name: 'Calibrador de Proveedores & Fincas',
      targetRole: 'finca',
      status: 'running',
      costEur: 0.086,
      tokensCount: 8600,
      activeTask: 'Auditoría de licencia acústica Ley 37/2003 (< 75 dB) en Finca Los Arcos',
      progressPercent: 45,
    },
    {
      id: 'sess-03',
      name: 'Centinela de Artistas & Riders',
      targetRole: 'artista',
      status: 'idle',
      costEur: 0.024,
      tokensCount: 2400,
      activeTask: 'Verificación de Split 80/10/10 en liquidación de bolo Edwin Agudelo',
      progressPercent: 100,
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('sess-01');
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleApprove = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'running', progressPercent: 90 } : s))
    );
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner de Telemetría Global */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
          <div className="flex items-center gap-2 text-zinc-400 mb-1 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sesiones Activas</span>
          </div>
          <div className="text-xl font-bold text-white">3 Agentes</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">1 requiere aprobación humana</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
          <div className="flex items-center gap-2 text-zinc-400 mb-1 text-[11px]">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Medidor de Costes</span>
          </div>
          <div className="text-xl font-bold text-white">0,252 €</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">25.200 tokens consumidos</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
          <div className="flex items-center gap-2 text-zinc-400 mb-1 text-[11px]">
            <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cola de Tareas</span>
          </div>
          <div className="text-xl font-bold text-white">0 en tasks_queue</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Slot único serie gobernado</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
          <div className="flex items-center gap-2 text-zinc-400 mb-1 text-[11px]">
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Checkpoints ACID</span>
          </div>
          <div className="text-xl font-bold text-white">S-Class b57da5</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Restaurable en 1 clic</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Lista de Sesiones (Col-span 4) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-2.5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 px-1 mb-2 font-bold">
            Lista de Sesiones Agénticas:
          </div>
          {sessions.map((sess) => {
            const isSelected = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => setActiveSessionId(sess.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(236,182,19,0.15)]'
                    : 'border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-xs truncate">{sess.name}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${
                      sess.status === 'waiting_approval'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        : sess.status === 'running'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {sess.status === 'waiting_approval' ? 'Aprobar' : sess.status}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1 font-sans">{sess.activeTask}</p>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2 pt-1.5 border-t border-white/5">
                  <span>Rol: {sess.targetRole.toUpperCase()}</span>
                  <span className="text-zinc-300 font-bold">{sess.costEur.toFixed(3)} €</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Área de Detalle, Puerta de Aprobación & Registro en Vivo (Col-span 8) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-sm">{activeSession.name}</span>
                <span className="text-zinc-500">[{activeSession.id}]</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">{activeSession.activeTask}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block">Consumo</span>
              <span className="text-xs text-emerald-400 font-bold">{activeSession.costEur.toFixed(3)} €</span>
            </div>
          </div>

          {/* Puerta de Aprobación Humana (Approval Gate) */}
          {activeSession.status === 'waiting_approval' && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Puerta de Aprobación Humana Requerida (Gate G-8)</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                El agente solicita autorización para emitir contrato menor formal B2G al Ayuntamiento por importe de{' '}
                <strong className="text-white">14.250,00 €</strong> con split soberano 80/10/10 y CPV 92312000-1.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleApprove(activeSession.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Autorizar Despacho Inmediato
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  Rechazar / Modificar
                </button>
              </div>
            </div>
          )}

          {/* Línea de Tiempo de Acciones */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
              Línea de Tiempo de Acciones:
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-300">1. Consulta al SSOT financiero (ear-os-ssot.ts)</span>
                <span className="text-emerald-400 text-[10px]">PASS · Exit 0</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-300">2. Cálculo de presupuesto en céntimos enteros (budget-allocator)</span>
                <span className="text-emerald-400 text-[10px]">PASS · 13.022 iter.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-300">3. Verificación de firma SHA-256 Price-Lock</span>
                <span className="text-emerald-400 text-[10px]">PASS · Idempotente</span>
              </div>
            </div>
          </div>

          {/* Registro en Vivo (Live Log Output) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
              <span>Registro en Vivo (Stdout / Webhook):</span>
              <span className="text-emerald-400 text-[10px]">● Live Stream</span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/90 border border-white/10 font-mono text-[11px] text-zinc-400 space-y-1 overflow-x-auto">
              <div>[2026-11-05 16:15:02] [RUN] POST /webhook/b2b-quote -&gt; 200 OK (54ms)</div>
              <div>[2026-11-05 16:15:05] [GATE] verify:pricing -&gt; Exit Code 0 (PASS)</div>
              <div>[2026-11-05 16:15:09] [ACID] atomicDateLockEngine.ts locked slot for Edwin Agudelo</div>
              <div className="text-amber-400">[2026-11-05 16:15:12] [WAIT] Waiting for human approval on session {activeSession.id}...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

