"use client";

import React, { useState } from 'react';
import { UserRole, ImpactNugget } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  ShieldExclamationIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  TrashIcon, 
  BookmarkIcon 
} from '@heroicons/react/24/outline';

interface SWOTToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const SWOTTool: React.FC<SWOTToolProps> = ({ userRole, onComplete, onSaveNugget }) => {
  const { t } = useTranslations();
  const [strengths, setStrengths] = useState<string[]>([
    'Alta fidelización y valoración 5.0★ en Bodas.net (100% recomendado por parejas)',
    'Repertorio de autor, tenor lírico y sonorización Bose 2.000W calibrada a 12 W/pax'
  ]);
  const [weaknesses, setWeaknesses] = useState<string[]>([
    'Límite físico de 52 fechas anuales para el Show Solista Premium',
    'Dependencia de la atención manual en WhatsApp en picos de demanda'
  ]);
  const [opportunities, setOpportunities] = useState<string[]>([
    'Licitaciones B2G de contratación menor en ayuntamientos (<15.000€ Art. 118 LCSP)',
    'Alianzas con wedding planners y fincas exclusivas con Split Soberano 80/10/10'
  ]);
  const [threats, setThreats] = useState<string[]>([
    'Competencia informal sin seguro de responsabilidad civil ni rider calibrado',
    'Volatilidad de costes de combustible y desplazamiento en temporada alta'
  ]);

  const [inputS, setInputS] = useState('');
  const [inputW, setInputW] = useState('');
  const [inputO, setInputO] = useState('');
  const [inputT, setInputT] = useState('');

  const addPoint = (type: 'S' | 'W' | 'O' | 'T') => {
    if (type === 'S' && inputS.trim()) {
      setStrengths(prev => [...prev, inputS.trim()]);
      setInputS('');
    } else if (type === 'W' && inputW.trim()) {
      setWeaknesses(prev => [...prev, inputW.trim()]);
      setInputW('');
    } else if (type === 'O' && inputO.trim()) {
      setOpportunities(prev => [...prev, inputO.trim()]);
      setInputO('');
    } else if (type === 'T' && inputT.trim()) {
      setThreats(prev => [...prev, inputT.trim()]);
      setInputT('');
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-rose-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <ShieldExclamationIcon className="w-5 h-5" />
            {t('tools.swotAnalysis_title', 'Matriz DAFO / SWOT Dinámica')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Análisis DAFO Estratégico & Contramedidas</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Audita el apalancamiento interno (Fortalezas, Debilidades) frente a fuerzas del mercado (Oportunidades, Amenazas) para formular movimientos asimétricos.
          </p>
        </div>
        <button
          onClick={() => onComplete({ strengths, weaknesses, opportunities, threats })}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Matriz DAFO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-bold text-emerald-400 text-base font-syne">Fortalezas (Strengths)</h3>
            <span className="text-xs font-mono text-zinc-500">{strengths.length} Elementos</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {strengths.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start bg-black/40 p-2.5 rounded-lg text-sm text-zinc-200">
                <span className="leading-relaxed">{item}</span>
                <button onClick={() => setStrengths(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-500 hover:text-rose-400 ml-2 cursor-pointer">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputS}
              onChange={e => setInputS(e.target.value)}
              placeholder="Nueva Fortaleza..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              onKeyDown={e => e.key === 'Enter' && addPoint('S')}
            />
            <button onClick={() => addPoint('S')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer font-mono">
              <PlusIcon className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-bold text-amber-400 text-base font-syne">Debilidades (Weaknesses)</h3>
            <span className="text-xs font-mono text-zinc-500">{weaknesses.length} Elementos</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {weaknesses.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start bg-black/40 p-2.5 rounded-lg text-sm text-zinc-200">
                <span className="leading-relaxed">{item}</span>
                <button onClick={() => setWeaknesses(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-500 hover:text-rose-400 ml-2 cursor-pointer">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputW}
              onChange={e => setInputW(e.target.value)}
              placeholder="Nueva Debilidad..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              onKeyDown={e => e.key === 'Enter' && addPoint('W')}
            />
            <button onClick={() => addPoint('W')} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer font-mono">
              <PlusIcon className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-zinc-900/80 border border-blue-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-bold text-blue-400 text-base font-syne">Oportunidades (Opportunities)</h3>
            <span className="text-xs font-mono text-zinc-500">{opportunities.length} Elementos</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {opportunities.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start bg-black/40 p-2.5 rounded-lg text-sm text-zinc-200">
                <span className="leading-relaxed">{item}</span>
                <button onClick={() => setOpportunities(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-500 hover:text-rose-400 ml-2 cursor-pointer">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputO}
              onChange={e => setInputO(e.target.value)}
              placeholder="Nueva Oportunidad..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              onKeyDown={e => e.key === 'Enter' && addPoint('O')}
            />
            <button onClick={() => addPoint('O')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer font-mono">
              <PlusIcon className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
        </div>

        {/* Threats */}
        <div className="bg-zinc-900/80 border border-rose-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-bold text-rose-400 text-base font-syne">Amenazas (Threats)</h3>
            <span className="text-xs font-mono text-zinc-500">{threats.length} Elementos</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {threats.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start bg-black/40 p-2.5 rounded-lg text-sm text-zinc-200">
                <span className="leading-relaxed">{item}</span>
                <button onClick={() => setThreats(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-500 hover:text-rose-400 ml-2 cursor-pointer">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputT}
              onChange={e => setInputT(e.target.value)}
              placeholder="Nueva Amenaza..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
              onKeyDown={e => e.key === 'Enter' && addPoint('T')}
            />
            <button onClick={() => addPoint('T')} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer font-mono">
              <PlusIcon className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
