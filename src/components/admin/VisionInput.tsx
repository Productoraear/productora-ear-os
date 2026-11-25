'use client';

import React, { useState, useMemo } from 'react';
import {
  Heart,
  Building2,
  Mic,
  Sparkles,
  Landmark,
  DollarSign,
  Truck,
  Shield,
  Zap,
  RotateCcw,
  CheckCircle2,
  Sliders,
  FileText,
  Copy,
  Check,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import {
  CEO_OPERATIONAL_DIMENSIONS,
  type CeoOperationalDimensionId,
  type CeoOperationalDimension,
  getCeoDimension,
} from '@/lib/compiler/ceo-operational-matrix';
import {
  refineWithVelocityOracle,
  type OracleRefinedOutput,
} from '@/lib/oraculo/oracle-refiner';

const DIMENSION_ICONS: Record<CeoOperationalDimensionId, LucideIcon> = {
  CLIENTES_NOVIOS: Heart,
  HOSTELERIA_FINCAS: Building2,
  ARTISTAS_ESCENARIO: Mic,
  PROVEEDORES_CATALOGO: Sparkles,
  B2G_AYUNTAMIENTOS: Landmark,
  TESORERIA_SPLIT: DollarSign,
  LOGISTICA_FLEET: Truck,
  GOBERNANZA_SRE: Shield,
};

export interface VisionInputProps {
  readonly selectedDimension: CeoOperationalDimensionId;
  readonly onSelectDimension: (dimId: CeoOperationalDimensionId) => void;
  readonly rawVision: string;
  readonly onChangeRawVision: (val: string) => void;
  readonly onRefineComplete?: (output: OracleRefinedOutput) => void;
  readonly showRefinerOutput?: boolean;
  readonly title?: string;
  readonly subtitle?: string;
}

export default function VisionInput({
  selectedDimension,
  onSelectDimension,
  rawVision,
  onChangeRawVision,
  onRefineComplete,
  showRefinerOutput = false,
  title = 'COCKPIT CEO · MATRIZ MULTI-ROL DE 8 DIMENSIONES',
  subtitle = 'Selecciona la dimensión de negocio para preconfigurar invariantes canónicos y compilar la visión en un Megaprompt S-Class.',
}: VisionInputProps): React.JSX.Element {
  const currentDimension = useMemo(() => getCeoDimension(selectedDimension), [selectedDimension]);
  const [copiedPepita, setCopiedPepita] = useState<boolean>(false);
  const [copiedMegaprompt, setCopiedMegaprompt] = useState<boolean>(false);

  // Refinamiento en tiempo real con el motor del oráculo
  const refinedOutput = useMemo<OracleRefinedOutput>(() => {
    const res = refineWithVelocityOracle({
      rawVision,
      objective: selectedDimension,
    });
    if (onRefineComplete) {
      onRefineComplete(res);
    }
    return res;
  }, [rawVision, selectedDimension, onRefineComplete]);

  const handlePreloadTemplate = () => {
    onChangeRawVision(currentDimension.defaultSeedVision);
  };

  const handleClear = () => {
    onChangeRawVision('');
  };

  const handleCopyPepita = async () => {
    try {
      await navigator.clipboard.writeText(refinedOutput.pepitaDeOro);
      setCopiedPepita(true);
      setTimeout(() => setCopiedPepita(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const handleCopyMegaprompt = async () => {
    try {
      await navigator.clipboard.writeText(refinedOutput.megaprompt);
      setCopiedMegaprompt(true);
      setTimeout(() => setCopiedMegaprompt(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header de la Matriz */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              {title}
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            8 EJES DISPONIBLES
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            [{currentDimension.id}]
          </span>
        </div>
      </div>

      {/* 2. Grid de 8 Dimensiones Canónicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CEO_OPERATIONAL_DIMENSIONS.map((dim) => {
          const Icon = DIMENSION_ICONS[dim.id];
          const isSelected = dim.id === selectedDimension;

          return (
            <button
              key={dim.id}
              type="button"
              onClick={() => onSelectDimension(dim.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                  : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      #{dim.code}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-neutral-900 text-neutral-500'
                      }`}
                    >
                      {dim.badge}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {dim.label}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 mb-2">
                  [{dim.id}]
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                  {dim.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono">
                <span className="text-neutral-500">
                  {dim.canonicalRuleIds.length} Reglas AST
                </span>
                {isSelected ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVO
                  </span>
                ) : (
                  <span className="text-neutral-600 group-hover:text-neutral-400 flex items-center">
                    Seleccionar <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Panel de Entrada de Visión y Controles de Precarga */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase font-mono">
              Visión Bruta del CEO ({currentDimension.label})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
              {rawVision.length} caracteres
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreloadTemplate}
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" /> Precargar Plantilla Canónica
            </button>
            {rawVision && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar
              </button>
            )}
          </div>
        </div>

        <textarea
          value={rawVision}
          onChange={(e) => onChangeRawVision(e.target.value)}
          placeholder={`Introduce aquí la orden, instrucción o visión ejecutiva para [${currentDimension.id}]... O haz clic en "Precargar Plantilla Canónica".`}
          rows={4}
          className="w-full bg-neutral-900/60 border border-neutral-800 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono leading-relaxed resize-y"
        />

        {/* 4. Resumen de Invariantes & Reglas precargadas para la dimensión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-neutral-900 text-xs">
          <div className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="font-bold text-neutral-300">INVARIANTES INYECTADOS:</span>
              <span className="text-amber-400">{currentDimension.canonicalInvariants.length} Reglas SSOT</span>
            </div>
            <ul className="space-y-1 text-[11px] text-neutral-400">
              {currentDimension.canonicalInvariants.map((inv, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span className="line-clamp-1">{inv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="font-bold text-neutral-300">REGLAS CANÓNICAS AST ASIGNADAS:</span>
              <span className="text-emerald-400">{currentDimension.canonicalRuleIds.length} Reglas</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentDimension.canonicalRuleIds.map((rId) => (
                <span
                  key={rId}
                  className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-300"
                >
                  RULE-{rId}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Vista Previa Opcional de Salida Refinada (Pepita de Oro + Megaprompt) */}
      {showRefinerOutput && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* Pepita de Oro */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Pepita de Oro (Alta Conversión)
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPepita}
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-800 flex items-center gap-1 transition-colors"
              >
                {copiedPepita ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPepita ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="p-3 bg-black/60 border border-neutral-900 rounded-lg text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
              {refinedOutput.pepitaDeOro}
            </div>
          </div>

          {/* Megaprompt para Obrero */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Megaprompt Obrero (Cline / DeepSeek)
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyMegaprompt}
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-800 flex items-center gap-1 transition-colors"
              >
                {copiedMegaprompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMegaprompt ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="p-3 bg-black/60 border border-neutral-900 rounded-lg text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
              {refinedOutput.megaprompt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
