'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertOctagon, Check, CheckCircle2, ChevronDown, Volume2, Landmark, Zap, Sliders } from 'lucide-react';

export function QronosGuardrails({ className = '' }: { className?: string }) {
  const [approvalMode, setApprovalMode] = useState<'monitor' | 'require' | 'block'>('require');
  const [budgetMode, setBudgetMode] = useState<string>('zero-token');
  const [timeoutLimit, setTimeoutLimit] = useState<string>('15m');
  const [retryLimit, setRetryLimit] = useState<string>('2-retries');
  const [concurrency, setConcurrency] = useState<string>('max-2');

  return (
    <div className={`relative flex flex-col gap-6 rounded-xl border border-white/[0.09] bg-[linear-gradient(145deg,rgba(19,19,21,0.98),rgba(7,7,8,0.98))] p-6 shadow-2xl ${className}`}>
      
      {/* HEADER DE GUARDRAILS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Guardarraíles & Blindaje Jurídico Inmutable
            </h3>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Límites computacionales, acústicos y de contratación pública que ningún agente puede desobedecer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ESCUDO ACTIVO
          </span>
        </div>
      </div>

      {/* CUERPO PRINCIPAL EN DOS COLUMNAS */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DINÁMICA DE GUARDARRAÍLES */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Fila 1: Presupuesto de Tokens & API */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div>
              <span className="text-sm font-semibold text-white block">Presupuesto Diario de Modelos</span>
              <span className="text-xs text-zinc-400">Previene consumo descontrolado de tokens o APIs externas</span>
            </div>
            <select
              value={budgetMode}
              onChange={(e) => setBudgetMode(e.target.value)}
              className="w-48 bg-black/80 border border-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-200 font-mono focus:border-[#ecb613] focus:outline-none"
            >
              <option value="zero-token">0€ Bare-Metal (Ollama Local)</option>
              <option value="hybrid-10">Máx 10,00 € / día (Híbrido)</option>
              <option value="unlimited">Ilimitado (Sólo Root)</option>
            </select>
          </div>

          {/* Fila 2: Timeout de Ejecución */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div>
              <span className="text-sm font-semibold text-white block">Timeout Estricto de Tarea</span>
              <span className="text-xs text-zinc-400">Detiene tareas colgadas o bucles infinitos en Cline/Qwen</span>
            </div>
            <select
              value={timeoutLimit}
              onChange={(e) => setTimeoutLimit(e.target.value)}
              className="w-48 bg-black/80 border border-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-200 font-mono focus:border-[#ecb613] focus:outline-none"
            >
              <option value="15m">15 minutos (Recomendado)</option>
              <option value="30m">30 minutos</option>
              <option value="5m">5 minutos (Rápido)</option>
            </select>
          </div>

          {/* Fila 3: Herramientas Sensibles (Stripe / WhatsApp / Scraping) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div>
              <span className="text-sm font-semibold text-white block">Acciones Sensibles & Pasarelas</span>
              <span className="text-xs text-zinc-400">Retiene envíos de WhatsApp y cobros Stripe hasta confirmación</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setApprovalMode('monitor')}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  approvalMode === 'monitor'
                    ? 'bg-zinc-700 border-zinc-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monitorear
              </button>
              <button
                onClick={() => setApprovalMode('require')}
                className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
                  approvalMode === 'require'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Check className="w-3 h-3" /> Exigir Aprobación
              </button>
              <button
                onClick={() => setApprovalMode('block')}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  approvalMode === 'block'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Bloquear
              </button>
            </div>
          </div>

          {/* Fila 4: Concurrencia de GPU (AMD RX 7900 XTX) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div>
              <span className="text-sm font-semibold text-white block">Concurrencia VRAM GPU (24GB)</span>
              <span className="text-xs text-zinc-400">Reserva 4.8 GB de memoria de video para la inferencia de voz</span>
            </div>
            <select
              value={concurrency}
              onChange={(e) => setConcurrency(e.target.value)}
              className="w-48 bg-black/80 border border-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-200 font-mono focus:border-[#ecb613] focus:outline-none"
            >
              <option value="max-2">Máximo 2 agentes simultáneos</option>
              <option value="solo">1 agente a la vez (Solo Mode)</option>
              <option value="burst">Modo Ráfaga (4 agentes)</option>
            </select>
          </div>
        </div>

        {/* COLUMNA DERECHA: REGLAS INMUTABLES SSOT (CANONICAL) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="rounded-xl border border-[#ecb613]/30 bg-[#ecb613]/5 p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-[#ecb613]">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Reglas Inmutables SSOT</span>
            </div>

            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Tarifa Base Solista:</strong> 350,00 € fija (Edwin Agudelo).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Split Soberano:</strong> 80% Artista / 10% EAR / 10% VIMUME.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Depósito Stripe:</strong> 100,00 € Price-Lock con SHA-256.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Límite B2G:</strong> &lt; 14.250,00 € (Art. 118 LCSP).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Límite Acústico:</strong> &lt; 75 dB SPL (12 W/pax Bose).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Logística:</strong> 1,50 €/km desde Méntrida a partir de km 50.</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-[#ecb613]/20 text-[10px] text-zinc-400 font-mono">
              Cualquier intento de alteración por IA activa el Veto Estratégico automático.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
