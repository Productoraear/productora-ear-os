'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
} from 'lucide-react';
import { TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export function SovereignAiChatAndToolCallsKitView() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hola Edwin, soy el Arquitecto IA Forense de EAR OS. He auditado la disponibilidad de Restaurante Ezkertza Berria y los contratos de sonido Bose F1. ¿Deseas consolidar el expediente de reserva?',
      sources: ['src/lib/constants/ear-os-ssot.ts', 'src/lib/constants/ezkertza-derio-venue.ts'],
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const toolCallSample = {
    toolName: 'atomicDateLockEngine.lockDateExclusive',
    status: 'approved',
    payload: {
      venueId: 'restaurante-ezkertza-berria',
      fechaEvento: '2026-11-20',
      depositoStripeEur: DEPOSITO_STRIPE_EUR,
      split: '80/10/10 Inmutable',
    },
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: inputVal, sources: [] },
      {
        role: 'assistant',
        text: `Entendido. Verificado contra el SSOT canónico: Tarifa Base Solista ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €, depósito Price-Lock ${DEPOSITO_STRIPE_EUR.toFixed(2)} € deducible al 100%. Expediente listo para formalización.`,
        sources: ['src/lib/constants/ear-os-ssot.ts'],
      },
    ]);
    setInputVal('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
      {/* 1. Kit de Chat de IA (Streaming & Citaciones SSOT) */}
      <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 flex flex-col justify-between h-[420px]">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">Concierge IA Soberano</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            En Directo
          </span>
        </div>

        {/* Mensajes */}
        <div className="space-y-3 overflow-y-auto pr-2 my-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === 'assistant'
                  ? 'bg-zinc-900 border border-white/5 text-zinc-200'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-200 ml-6'
              }`}
            >
              <p>{m.text}</p>
              {m.sources.length > 0 && (
                <div className="mt-2 pt-1 border-t border-white/5 flex flex-wrap gap-1 text-[9px] font-mono text-zinc-500">
                  <span className="text-zinc-400">Fuentes SSOT:</span>
                  {m.sources.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <input
            type="text"
            placeholder="Pregunta sobre tarifas o aforos..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="button"
            onClick={handleSend}
            className="p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Kit de Llamadas de Herramientas (Tool Calls & Approval Gate) */}
      <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 flex flex-col justify-between h-[420px] font-mono text-xs">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold">Puerta de Aprobación de Herramienta</span>
            </div>
            <span className="text-[10px] text-zinc-500">ACID Idempotent</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold">{toolCallSample.toolName}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                ✓ Aprobado por el CEO
              </span>
            </div>

            <pre className="p-3 rounded-xl bg-black/60 text-[11px] text-zinc-300 overflow-x-auto border border-white/5">
              {JSON.stringify(toolCallSample.payload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Verificado en disco (ledger.jsonl)</span>
          <span className="text-emerald-400 font-bold">Exit Code 0</span>
        </div>
      </div>
    </div>
  );
}

