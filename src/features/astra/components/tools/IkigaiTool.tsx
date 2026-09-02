"use client";

import React, { useState } from 'react';
import { UserRole, ImpactNugget, IkigaiInputs } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  HeartIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

interface IkigaiToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const IkigaiTool: React.FC<IkigaiToolProps> = ({ userRole, onComplete, onSaveNugget }) => {
  const { t } = useTranslations();
  const [ikigai, setIkigai] = useState<IkigaiInputs>({
    loves: 'Interpretar música de gala con voz de tenor lírico, diseñar experiencias acústicas inolvidables y crear valor asimétrico.',
    goodAt: 'Técnica vocal mariachi y lírica, protocolo de eventos de alta distinción y arquitectura de acuerdos comerciales de alta confianza.',
    worldNeeds: 'Música en vivo con calidad de concierto, eventos sin sobrecostes ocultos y estimulación neurocognitiva 40Hz (VIMUME).',
    paidFor: 'Packs nupciales de alta distinción (350€ a 10.000€), licitaciones municipales B2G (<15.000€) y planes de transformación empresarial B2B.',
    introspection: {
      milestones: 'Construir un ecosistema soberano (Split 80/10/10) con presencia en 52 provincias y 100% de satisfacción garantizada.',
      balance: 'Preservar la salud vocal, la calidez humana y la excelencia técnica en cada actuación.'
    }
  });

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-pink-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <HeartIcon className="w-5 h-5" />
            {t('tools.ikigai_title', 'Navegador de Propósito Ikigai')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Convergencia de Pasión, Misión, Vocación & Mercado</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Alinea tu energía creativa con una monetización duradera y una demanda real del mercado para garantizar tu soberanía profesional.
          </p>
        </div>
        <button
          onClick={() => onComplete(ikigai)}
          className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-pink-500/20 flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Protocolo Ikigai
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-2">
          <label className="block text-sm font-bold text-pink-400 font-syne">1. Lo que Amas (Pasión)</label>
          <p className="text-xs text-zinc-400">Las actividades que generan estado de flujo y curiosidad constante.</p>
          <textarea
            value={ikigai.loves}
            onChange={e => setIkigai({ ...ikigai, loves: e.target.value })}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-pink-500 leading-relaxed"
          />
        </div>

        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-2">
          <label className="block text-sm font-bold text-indigo-400 font-syne">2. En lo que Eres Extraordinario (Maestría)</label>
          <p className="text-xs text-zinc-400">Tus superpoderes técnicos, competencias forjadas y talento natural.</p>
          <textarea
            value={ikigai.goodAt}
            onChange={e => setIkigai({ ...ikigai, goodAt: e.target.value })}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-2">
          <label className="block text-sm font-bold text-emerald-400 font-syne">3. Lo que el Mundo Necesita (Misión)</label>
          <p className="text-xs text-zinc-400">Problemas reales del mercado y vacíos culturales que estás resolviendo.</p>
          <textarea
            value={ikigai.worldNeeds}
            onChange={e => setIkigai({ ...ikigai, worldNeeds: e.target.value })}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-2">
          <label className="block text-sm font-bold text-amber-400 font-syne">4. Por lo que Pueden Pagarte (Vocación / Monetización)</label>
          <p className="text-xs text-zinc-400">Intercambios de alto valor, servicios escalables y modelos de negocio viables.</p>
          <textarea
            value={ikigai.paidFor}
            onChange={e => setIkigai({ ...ikigai, paidFor: e.target.value })}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
