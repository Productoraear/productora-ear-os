"use client";

import React, { useState } from 'react';
import { UserRole, ImpactNugget } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface CampaignSimulatorToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const CampaignSimulatorTool: React.FC<CampaignSimulatorToolProps> = ({ userRole, onComplete, onSaveNugget }) => {
  const { t } = useTranslations();
  const [budget, setBudget] = useState(3000);
  const [expectedReachMultiplier, setExpectedReachMultiplier] = useState(3.5);

  const simulationData = [
    { day: 'Día 1', reach: Math.round(budget * 0.4), conversions: Math.round(budget * 0.02) },
    { day: 'Día 7', reach: Math.round(budget * 1.2 * expectedReachMultiplier * 0.4), conversions: Math.round(budget * 0.08) },
    { day: 'Día 14', reach: Math.round(budget * 2.1 * expectedReachMultiplier * 0.6), conversions: Math.round(budget * 0.18) },
    { day: 'Día 21', reach: Math.round(budget * 3.4 * expectedReachMultiplier * 0.8), conversions: Math.round(budget * 0.32) },
    { day: 'Día 30', reach: Math.round(budget * 4.8 * expectedReachMultiplier), conversions: Math.round(budget * 0.52) },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-teal-950/40 via-zinc-900/60 to-emerald-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <ChartBarIcon className="w-5 h-5" />
            {t('tools.campaignSimulator_title', 'Simulador de Mercado & Campañas')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Curva de Crecimiento & Proyección de Conversiones</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Modela la resonancia a 30 días, el coeficiente de conversión y los costes de adquisición de clientes (CAC / LTV).
          </p>
        </div>
        <button
          onClick={() => onComplete({ budget, expectedReachMultiplier, finalReach: simulationData[4].reach })}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Previsión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono">Parámetros de la Campaña</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                <span>Presupuesto Asignado (€ EUR)</span>
                <span className="text-white font-bold">{budget.toLocaleString()} €</span>
              </div>
              <input
                type="range"
                min="350"
                max="30000"
                step="250"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                <span>Multiplicador de Resonancia & Viralidad</span>
                <span className="text-white font-bold">{expectedReachMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={expectedReachMultiplier}
                onChange={e => setExpectedReachMultiplier(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-zinc-400 font-mono">Impresiones Totales Est.</span>
              <p className="text-lg font-bold text-teal-400 font-mono mt-0.5">
                {simulationData[4].reach.toLocaleString()}
              </p>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-zinc-400 font-mono">Conversiones / Leads Cualificados</span>
              <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {simulationData[4].conversions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-zinc-400 font-mono">Curva de Impacto Acumulado</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
              <span>Proyección a 30 Días</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData}>
                <defs>
                  <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#reachGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
