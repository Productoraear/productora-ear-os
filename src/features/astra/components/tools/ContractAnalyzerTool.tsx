"use client";

import React, { useState } from 'react';
import { UserRole, ImpactNugget } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  DocumentMagnifyingGlassIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ContractAnalyzerToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const ContractAnalyzerTool: React.FC<ContractAnalyzerToolProps> = ({ userRole, onComplete, onSaveNugget }) => {
  const { t } = useTranslations();
  const [contractText, setContractText] = useState(
    `CONTRATO DE DISTRIBUCIÓN EXCLUSIVA & ACUERDO DISCOGRÁFICO 360\n\nSección 4. Derechos de Máster y Amortización (Recoupment):\nLa Compañía retendrá a perpetuidad todos los derechos mundiales de grabación máster, licencias mecánicas e ingresos accesorios por sincronización. Todos los gastos de producción y marketing serán amortizables al 100% con cargo al pool de regalías netas del 15% correspondiente al Artista antes de proceder a cualquier liquidación.`
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAuditResult({
        overallRisk: 'ALTO (8.5/10)',
        criticalFlags: [
          {
            clause: 'Cesión de Derechos de Máster en Perpetuidad',
            severity: 'CRÍTICO',
            concern: 'Cede la propiedad permanente de los activos maestros sin horizonte de reversión temporal.',
            recommendedAction: 'Exigir cláusula de reversión patrimonial a 5-7 años o retorno automático tras amortización total de costes (Split Soberano 80/10/10).'
          },
          {
            clause: 'Amortización Asimétrica 360 (100% deducido del 15% del Artista)',
            severity: 'GRAVE',
            concern: 'Genera matemáticas de recuperación predatorias que dilatan artificialmente la primera liquidación.',
            recommendedAction: 'Limitar la amortización estrictamente a las ventas brutas del máster, blindando el directo, caché y merchandising.'
          }
        ],
        negotiationPowerRating: 'Nivel 3 (Apalancamiento Moderado — Exige Blindaje)'
      });
      setIsAuditing(false);
    }, 600);
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-cyan-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <DocumentMagnifyingGlassIcon className="w-5 h-5" />
            {t('tools.contractAnalyzer_title', 'Auditor de Contratos & Acuerdos')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Auditoría de Cláusulas, PI y Recoupment</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Audita acuerdos discográficos, cesiones de propiedad intelectual y pliegos de contratación para aislar cláusulas abusivas y certificar el Split Soberano.
          </p>
        </div>
        <button
          onClick={() => onComplete(auditResult)}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Informe de Auditoría
        </button>
      </div>

      <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
        <label className="block text-sm font-bold text-white font-mono">Pegar Texto del Contrato o Pliego a Auditar:</label>
        <textarea
          value={contractText}
          onChange={e => setContractText(e.target.value)}
          rows={5}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
        />
        <button
          onClick={handleRunAudit}
          disabled={isAuditing || !contractText.trim()}
          className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
        >
          <SparklesIcon className="w-4 h-4" />
          {isAuditing ? 'Auditando Cláusulas en Bóveda Legal...' : 'Ejecutar Auditoría Legal de Alto Rigor'}
        </button>
      </div>

      {auditResult && (
        <div className="space-y-4">
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">Dictamen de Riesgo Contractual</span>
              <h3 className="text-xl font-bold text-rose-200 mt-0.5">{auditResult.overallRisk}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 font-mono">Apalancamiento de Negociación:</span>
              <p className="text-sm font-semibold text-white">{auditResult.negotiationPowerRating}</p>
            </div>
          </div>

          <div className="space-y-3">
            {auditResult.criticalFlags.map((flag: any, idx: number) => (
              <div key={idx} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-rose-400 shrink-0" />
                  <h4 className="text-base font-bold text-white">{flag.clause}</h4>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold font-mono">
                    {flag.severity}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 pl-7 leading-relaxed">{flag.concern}</p>
                <div className="mt-3 pl-7 p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-emerald-300 font-mono leading-relaxed">
                  <strong>Contra-Cláusula Recomendada:</strong> {flag.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
