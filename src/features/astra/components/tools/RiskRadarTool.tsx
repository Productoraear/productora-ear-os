"use client";

import React, { useState } from 'react';
import { UserRole, ImpactNugget, RiskAnalysis } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';

interface RiskRadarToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
}

export const RiskRadarTool: React.FC<RiskRadarToolProps> = ({ userRole, onComplete, onSaveNugget }) => {
  const { t } = useTranslations();
  const [risks, setRisks] = useState<RiskAnalysis[]>([
    {
      risk: 'Ambigüedad contractual en la cláusula de reversión de propiedad intelectual',
      severity: 8,
      mitigation: 'Añadir anexo explícito de reversión de derechos a 3 años por no explotación comercial (Split Soberano 80/10/10).'
    },
    {
      risk: 'Dependencia crítica de personal clave en la dirección técnica y artística',
      severity: 7,
      mitigation: 'Implementar documentación asíncrona rigurosa, protocolos de relevo en vivo y redundancia de equipamiento in situ.'
    },
    {
      risk: 'Saturación del mercado por opciones low-cost sin rider profesional',
      severity: 6,
      mitigation: 'Diferenciación radical: Sonorización Bose 2.000W a 12 W/pax, Shure Axient Digital, póliza RC de 1M€ y garantía por escrito.'
    }
  ]);

  const [newRisk, setNewRisk] = useState('');
  const [newSeverity, setNewSeverity] = useState<number>(7);
  const [newMitigation, setNewMitigation] = useState('');

  const handleAdd = () => {
    if (!newRisk.trim()) return;
    setRisks(prev => [
      ...prev,
      {
        risk: newRisk.trim(),
        severity: newSeverity,
        mitigation: newMitigation.trim() || 'Establecer puntos de control y supervisión periódica.'
      }
    ]);
    setNewRisk('');
    setNewMitigation('');
    setNewSeverity(7);
  };

  const handleDelete = (index: number) => {
    setRisks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-amber-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold tracking-wide uppercase font-mono">
            <ExclamationTriangleIcon className="w-5 h-5" />
            {t('tools.riskRadar_title', 'Radar de Riesgos Estratégicos')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Radar de Vulnerabilidades Operativas y Sistémicas</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Somete a prueba de estrés cuellos de botella operativos, riesgos legales y contingencias antes de comprometer capital o fechas.
          </p>
        </div>
        <button
          onClick={() => onComplete(risks)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Evaluación
        </button>
      </div>

      <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono">Añadir Nuevo Riesgo Sistémico</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={newRisk}
            onChange={e => setNewRisk(e.target.value)}
            placeholder="Riesgo detectado (ej. Plazo de pago en licitación)"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          />
          <input
            type="text"
            value={newMitigation}
            onChange={e => setNewMitigation(e.target.value)}
            placeholder="Protocolo de Mitigación / Cortafuegos"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-400 font-mono">Severidad ({newSeverity}/10):</label>
            <input
              type="range"
              min={1}
              max={10}
              value={newSeverity}
              onChange={e => setNewSeverity(Number(e.target.value))}
              className="flex-1 accent-red-500 cursor-pointer"
            />
            <button
              onClick={handleAdd}
              disabled={!newRisk.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-mono"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-red-500/30 transition-all"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  item.severity >= 8 ? 'bg-rose-950 text-rose-300 border-rose-800' :
                  item.severity >= 6 ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  Severidad {item.severity}/10
                </span>
                <h4 className="text-sm font-bold text-white">{item.risk}</h4>
              </div>
              <p className="text-xs text-zinc-300 pl-1 leading-relaxed">
                <strong className="text-emerald-400">Mitigación:</strong> {item.mitigation}
              </p>
            </div>

            <button
              onClick={() => handleDelete(idx)}
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Eliminar Riesgo"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
