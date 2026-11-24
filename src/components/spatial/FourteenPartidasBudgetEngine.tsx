'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Unlock, Plus, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';
import {
  type PartidaItem,
  centsToEur,
} from '@/lib/budget/budget-allocator-engine';

interface FourteenPartidasBudgetEngineProps {
  readonly totalBudgetEur: number;
  readonly partidas: readonly PartidaItem[];
  readonly onTotalBudgetChange: (newTotalEur: number) => void;
  readonly onPartidaAmountChange: (id: string, newAmountEur: number) => void;
  readonly onToggleLock: (id: string) => void;
  readonly onAddCustomPartida: (name: string) => void;
}

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

export default function FourteenPartidasBudgetEngine({
  totalBudgetEur,
  partidas,
  onTotalBudgetChange,
  onPartidaAmountChange,
  onToggleLock,
  onAddCustomPartida,
}: FourteenPartidasBudgetEngineProps): React.JSX.Element {
  const [customNameInput, setCustomNameInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const totalCalculatedCents = partidas.reduce((acc, p) => acc + p.amountCents, 0);
  const totalCalculatedEur = centsToEur(totalCalculatedCents);
  const isPerfectMatch = Math.abs(totalCalculatedEur - totalBudgetEur) < 0.001;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNameInput.trim()) {
      onAddCustomPartida(customNameInput.trim());
      setCustomNameInput('');
      setIsAddingCustom(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#09090d]/90 border border-white/10 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-4">
      {/* Cabecera del Configurador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#ecb613]" />
            <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Motor de las 14 Partidas Cardinales (Rebalanceo con Candados 🔒)
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
            Bloquea cualquier partida para congelar su cuota al céntimo. El resto se reequilibra automáticamente sin descuadre.
          </p>
        </div>

        {/* Total General & Verificación al Céntimo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Presupuesto Total
            </span>
            <span className="font-mono text-lg font-black text-[#ecb613]">
              {formatEur(totalBudgetEur)}
            </span>
          </div>
          <div
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
              isPerfectMatch
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Σ {formatEur(totalCalculatedEur)}</span>
          </div>
        </div>
      </div>

      {/* Control Maestro de Presupuesto Global */}
      <div className="px-3 py-2.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <label htmlFor="master-budget-slider" className="text-xs font-mono text-zinc-300 uppercase tracking-wider shrink-0">
          Ajustar Presupuesto Global:
        </label>
        <div className="flex items-center gap-3 w-full sm:w-2/3">
          <input
            id="master-budget-slider"
            type="range"
            min={10000}
            max={75000}
            step={500}
            value={totalBudgetEur}
            onChange={(e) => onTotalBudgetChange(Number(e.target.value))}
            className="w-full accent-[#ecb613] cursor-pointer"
          />
          <span className="font-mono text-xs font-bold text-white shrink-0 min-w-[70px] text-right">
            {formatEur(totalBudgetEur)}
          </span>
        </div>
      </div>

      {/* Cuadrícula de las 14 Partidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {partidas.map((item) => {
          const amountEur = centsToEur(item.amountCents);
          const percent = totalBudgetEur > 0 ? ((amountEur / totalBudgetEur) * 100).toFixed(1) : '0';

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-2xl border transition-all ${
                item.locked
                  ? 'bg-[#ecb613]/[0.06] border-[#ecb613]/40'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleLock(item.id)}
                    title={item.locked ? 'Partida bloqueada (clic para liberar)' : 'Bloquear partida al céntimo'}
                    className={`p-1 rounded-lg transition-colors ${
                      item.locked
                        ? 'bg-[#ecb613] text-black shadow-[0_0_10px_rgba(236,182,19,0.4)]'
                        : 'text-zinc-500 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                  <span className="font-sans text-xs font-semibold text-white truncate" title={item.name}>
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400">{percent}%</span>
                  <span className="font-mono text-xs font-bold text-[#ecb613]">
                    {formatEur(amountEur)}
                  </span>
                </div>
              </div>

              {/* Slider de Partida */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={Math.max(totalBudgetEur, 1000)}
                  step={50}
                  disabled={item.locked}
                  value={amountEur}
                  onChange={(e) => onPartidaAmountChange(item.id, Number(e.target.value))}
                  className={`w-full accent-[#ecb613] cursor-pointer ${
                    item.locked ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                />
                <Link
                  href={item.catalogHref}
                  className="shrink-0 text-[10px] font-mono text-zinc-400 hover:text-[#ecb613] flex items-center gap-0.5 transition-colors"
                >
                  <span>{item.ctaLabel}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón: ¿Necesitas una partida especial? + Añadir Partida Personalizada */}
      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
        {isAddingCustom ? (
          <form onSubmit={handleAddSubmit} className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Ej: Carroza de Época, Fuegos Artificiales..."
              value={customNameInput}
              onChange={(e) => setCustomNameInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ffd24d] transition-colors"
            >
              Añadir
            </button>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-zinc-400 font-mono text-xs hover:text-white"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-[#ecb613] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>¿Necesitas una partida especial? + Añadir Partida Personalizada</span>
          </button>
        )}

        <div className="text-[10px] font-mono text-zinc-500">
          Catálogo Homologado EAR OS · Fianza deducible de 5 € protegida
        </div>
      </div>
    </div>
  );
}
