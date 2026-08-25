'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  RotateCcw, 
  PieChart, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export function FinancialSimulatorPanel() {
  const [budget, setBudget] = useState(15000);
  const [productionPct, setProductionPct] = useState(40);
  const [talentPct, setTalentPct] = useState(40);
  const [contingencyPct, setContingencyPct] = useState(20);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const getVal = (pct: number) => (budget * pct) / 100;

  // Split Soberano 80/10/10 sobre el presupuesto de talento
  const talentBudget = getVal(talentPct);
  const artist80 = talentBudget * 0.8;
  const platform10 = talentBudget * 0.1;
  const vimume10 = talentBudget * 0.1;

  const handleReset = () => {
    setBudget(15000);
    setProductionPct(40);
    setTalentPct(40);
    setContingencyPct(20);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-white font-sans space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-2xl text-[#ecb613]">
            <Calculator size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#ecb613] uppercase tracking-widest">
              <Sparkles size={12} /> Motor de Simulación S-Class
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
              Simulador Financiero & Asignación de Recursos
            </h3>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="self-start sm:self-auto p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders de Asignación */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Presupuesto Global Disponible</span>
              <span className="font-bold text-[#ecb613] text-sm">{formatCurrency(budget)}</span>
            </div>
            <input 
              type="range"
              min={1000}
              max={100000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
            />
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Distribución de Partidas</h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Infraestructura Técnica ({productionPct}%)</span>
                <span className="font-bold text-white">{formatCurrency(getVal(productionPct))}</span>
              </div>
              <input 
                type="range" min={10} max={70} value={productionPct}
                onChange={(e) => setProductionPct(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Talento Artístico ({talentPct}%)</span>
                <span className="font-bold text-white">{formatCurrency(getVal(talentPct))}</span>
              </div>
              <input 
                type="range" min={10} max={70} value={talentPct}
                onChange={(e) => setTalentPct(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Seguridad & Contingencia ({contingencyPct}%)</span>
                <span className="font-bold text-white">{formatCurrency(getVal(contingencyPct))}</span>
              </div>
              <input 
                type="range" min={5} max={40} value={contingencyPct}
                onChange={(e) => setContingencyPct(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Resumen y Split Soberano */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-black/80 border border-[#ecb613]/30 space-y-4 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#ecb613] flex items-center gap-2">
              <ShieldCheck size={14} /> Split Soberano 80/10/10 en Talento
            </h4>

            <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-neutral-400">80% Artistas Directo:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(artist80)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">10% Infraestructura EAR:</span>
                <span className="text-neutral-200">{formatCurrency(platform10)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">10% Fondo VIMUME:</span>
                <span className="text-[#ecb613] font-bold">{formatCurrency(vimume10)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-neutral-400 leading-relaxed font-light">
              La arquitectura de reparto inmutable garantiza cero intermediarios parasitarios y reinversión automática del 10% en terapias neuroacústicas para mayores.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialSimulatorPanel;
