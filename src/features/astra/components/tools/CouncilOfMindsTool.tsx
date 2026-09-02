"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRole, Persona, ImpactNugget, Scenario } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { generatePersonaDebate } from '../../services/geminiService';
import { 
  SparklesIcon, 
  UserGroupIcon, 
  BookmarkIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';

interface CouncilOfMindsToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onLaunchTool?: (toolId: string) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const CouncilOfMindsTool: React.FC<CouncilOfMindsToolProps> = ({
  userRole,
  onComplete,
  onSaveNugget
}) => {
  const { t, language } = useTranslations();
  const [problemStatement, setProblemStatement] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([
    Persona.CREATIVE_ORACLE,
    Persona.MARKET_CONQUEROR,
    Persona.DEVILS_ADVOCATE
  ]);
  const [isDebating, setIsDebating] = useState(false);
  const [debateResults, setDebateResults] = useState<Record<string, { analysis: string; scenarios: Scenario[] }>>({});
  const [savedNuggets, setSavedNuggets] = useState<Record<string, boolean>>({});

  const allPersonas = Object.values(Persona);

  const togglePersona = (p: Persona) => {
    if (selectedPersonas.includes(p)) {
      if (selectedPersonas.length > 1) {
        setSelectedPersonas(selectedPersonas.filter(item => item !== p));
      }
    } else {
      if (selectedPersonas.length < 5) {
        setSelectedPersonas([...selectedPersonas, p]);
      }
    }
  };

  const handleRunDebate = async () => {
    if (!problemStatement.trim()) return;
    setIsDebating(true);
    const results: Record<string, { analysis: string; scenarios: Scenario[] }> = {};

    for (const persona of selectedPersonas) {
      try {
        const res = await generatePersonaDebate(problemStatement, persona, language || 'es');
        results[persona] = res;
      } catch (e) {
        console.error('Error con la persona', persona, e);
      }
    }

    setDebateResults(results);
    setIsDebating(false);
  };

  const handleCaptureNugget = async (persona: string, title: string, insight: string) => {
    const nuggetData = {
      title: `${persona.replace(/_/g, ' ')}: ${title}`,
      insight,
      category: 'CONSEJO_DE_MENTES',
      date: new Date().toISOString()
    };

    if (onSaveNugget) {
      onSaveNugget(nuggetData);
    }

    // Auto-ingesta en vivo a la Bóveda RAG
    try {
      await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: nuggetData.title,
          category: 'CONSEJO_DE_MENTES',
          content: nuggetData.insight,
          tags: ['Consejo de Mentes', 'Astra OS', persona.replace(/_/g, ' ')]
        })
      });
    } catch (e) {
      console.warn('Error auto-inyectando nugget a RAG:', e);
    }

    setSavedNuggets(prev => ({ ...prev, [`${persona}-${title}`]: true }));
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-zinc-900/60 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <UserGroupIcon className="w-5 h-5" />
            {t('tools.councilOfMinds_title', 'Consejo de Mentes')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Deliberación Estratégica Multi-Persona</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Somete tu dilema a debate entre arquetipos de IA especializados para exponer puntos ciegos y generar caminos de convicción óptima.
          </p>
        </div>
        <button
          onClick={() => onComplete(debateResults)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Sesión
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-300 font-mono">
          Dilema Estratégico / Desafío Central a Debatir:
        </label>
        <textarea
          value={problemStatement}
          onChange={e => setProblemStatement(e.target.value)}
          placeholder="Ej: ¿Debemos estructurar un nuevo formato de gira o licitación municipal B2G asegurando el Split 80/10/10 y reserva con anticipo?"
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 text-sm leading-relaxed"
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Seleccionar Arquetipos del Consejo (Elige de 1 a 5):
          </label>
          <div className="flex flex-wrap gap-2">
            {allPersonas.map(p => {
              const isSelected = selectedPersonas.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePersona(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-white/5'
                  }`}
                >
                  {p.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleRunDebate}
          disabled={isDebating || !problemStatement.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer font-mono"
        >
          {isDebating ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              El Consejo está deliberando en tiempo real...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Convocar al Consejo y Generar Debate
            </>
          )}
        </button>
      </div>

      {/* Results Grid */}
      {Object.keys(debateResults).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-syne">
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
            Perspectivas y Escenarios de la Deliberación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(debateResults).map(([persona, data]) => (
              <motion.div
                key={persona}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-md border border-blue-800/40 font-mono">
                      {persona.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
                    {data.analysis}
                  </p>

                  <div className="mt-4 space-y-3">
                    {data.scenarios.map((sc, idx) => {
                      const nuggetId = `${persona}-${sc.strategy}`;
                      const isSaved = savedNuggets[nuggetId];
                      return (
                        <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold text-white">{sc.strategy}</span>
                            <button
                              onClick={() => handleCaptureNugget(persona, sc.strategy, sc.pros.join('; '))}
                              className={`text-xs p-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer font-mono ${
                                isSaved ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <BookmarkIcon className="w-3.5 h-3.5" />
                              {isSaved ? '✅ Guardado en RAG' : 'Guardar Nugget'}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                            <div>
                              <span className="text-emerald-400 font-medium">Pros:</span> {sc.pros.slice(0, 2).join(', ')}
                            </div>
                            <div>
                              <span className="text-rose-400 font-medium">Contras:</span> {sc.cons.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs font-mono text-zinc-500 pt-1">
                            <span>Impacto: <strong className="text-zinc-300">{sc.potentialImpact}/10</strong></span>
                            <span>Confianza: <strong className="text-zinc-300">{sc.confidenceScore}/10</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
