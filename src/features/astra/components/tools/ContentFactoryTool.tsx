"use client";

import React, { useState } from 'react';
import { UserRole, ImpactNugget } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  PencilSquareIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  ClipboardDocumentIcon 
} from '@heroicons/react/24/outline';

interface ContentFactoryToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const ContentFactoryTool: React.FC<ContentFactoryToolProps> = ({ userRole, onComplete, onSaveNugget }) => {
  const { t } = useTranslations();
  const [theme, setTheme] = useState('Lanzamiento de Nueva Iniciativa Estratégica');
  const [contentType, setContentType] = useState<'MANIFESTO' | 'PRESS_RELEASE' | 'SOCIAL_THREAD'>('MANIFESTO');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (contentType === 'MANIFESTO') {
        setGeneratedOutput(
`### EL MANIFIESTO DEL ARQUITECTO: ${theme.toUpperCase()}

No construimos para métricas superficiales de vanidad. Diseñamos instituciones duraderas con apalancamiento compuesto.

1. **Sustancia sobre Ruido**: En un mercado saturado de contenido genérico de IA, la profundidad técnica, el repertorio de autor y la acústica 12 W/pax son el foso defensivo definitivo.
2. **Ejecución Soberana**: Cada decisión estratégica es un compromiso irreversible de energía y recursos (Split Soberano 80/10/10).
3. **Asimetría Compuesta**: Optimizamos exclusivamente para sistemas donde el riesgo a la baja está estrictamente acotado y la rentabilidad al alza es exponencial.

El estándar es la maestría sin concesiones.`
        );
      } else if (contentType === 'PRESS_RELEASE') {
        setGeneratedOutput(
`COMUNICADO OFICIAL DE PRENSA ESTRATÉGICA

[DESPACHO CORPORATIVO] — Presentación oficial de ${theme}: Un nuevo estándar en inteligencia operativa y producción de eventos de alta distinción.

Diseñado específicamente para directores y parejas de alta exigencia, este despliegue une ingeniería acústica de vanguardia (Bose / Shure Axient) con blindaje contractual y satisfacción garantizada por escrito.`
        );
      } else {
        setGeneratedOutput(
`1/ El mayor riesgo en los negocios no es cometer un error. Es tomar decisiones mediocres con lentitud desesperante.

Así es como estructuramos ${theme}: 🧵👇

2/ La mayoría optimiza para el beneficio inmediato. Los constructores soberanos optimizan para el apalancamiento compuesto a 10 años.

3/ Anclaje en primeros principios. Protección del capital. Ejecución con convicción absoluta.`
        );
      }
      setIsGenerating(false);
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-violet-950/40 via-zinc-900/60 to-fuchsia-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <PencilSquareIcon className="w-5 h-5" />
            {t('tools.contentFactory_title', 'Fábrica de Narrativa & Contenido')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Arquitecto de Narrativas de Alta Resonancia</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Convierte ideas estratégicas en manifiestos magnéticos, notas de prensa oficiales y secuencias de alta conversión sin clichés.
          </p>
        </div>
        <button
          onClick={() => onComplete({ theme, contentType, generatedOutput })}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Borrador
        </button>
      </div>

      <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1 font-mono">Concepto Central / Tema del Lanzamiento</label>
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1 font-mono">Formato de Contenido</label>
            <select
              value={contentType}
              onChange={(e: any) => setContentType(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
            >
              <option value="MANIFESTO">Manifiesto de Autor</option>
              <option value="PRESS_RELEASE">Nota de Prensa Oficial</option>
              <option value="SOCIAL_THREAD">Hilo Viral de Twitter / LinkedIn</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !theme.trim()}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
        >
          <SparklesIcon className="w-4 h-4" />
          {isGenerating ? 'Generando Narrativa Asimétrica...' : 'Sintetizar Contenido con IA'}
        </button>
      </div>

      {generatedOutput && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-3 relative">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold uppercase text-violet-400">Resultado Generado</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ClipboardDocumentIcon className="w-3.5 h-3.5 text-violet-400" />
              {copied ? '¡Copiado!' : 'Copiar Texto'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-200 leading-relaxed p-2">
            {generatedOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
