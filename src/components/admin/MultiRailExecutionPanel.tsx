'use client';

import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  CreditCard,
  FileCode2,
  Utensils,
  Truck,
  Send,
  Terminal,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronRight,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import {
  MULTI_RAIL_TRIGGERS,
  type MultiRailTriggerId,
  type MultiRailTriggerSpec,
  type MultiRailExecutionContext,
  type MultiRailExecutionResult,
  executeEidasContract,
  executeStripeCheckout,
  executeExportFacturae,
  executeOrdenSalaCocina,
  executeWaybillLogistica,
  executeWebhookN8n,
  executeMegapromptObrero,
} from '@/lib/compiler/multi-rail-execution';
import {
  resolveEntityContext,
  KNOWN_ENTITIES,
  type ResolvedEntityContext,
} from '@/lib/oraculo/entity-resolver';
import type { CeoOperationalDimensionId } from '@/lib/compiler/ceo-operational-matrix';

const TRIGGER_ICONS: Record<MultiRailTriggerId, LucideIcon> = {
  DISPARAR_CONTRATO_EIDAS: FileCheck2,
  DISPARAR_STRIPE_CHECKOUT: CreditCard,
  EXPORTAR_FACTURAE_B2G: FileCode2,
  ORDEN_SALA_COCINA: Utensils,
  WAYBILL_LOGISTICA: Truck,
  WEBHOOK_N8N_IDEMPOTENTE: Send,
  MEGAPROMPT_OBRERO_AST: Terminal,
};

export interface MultiRailExecutionPanelProps {
  readonly selectedDimension: CeoOperationalDimensionId;
  readonly rawVision: string;
  readonly pepitaDeOro: string;
  readonly onEntityChange?: (entity: ResolvedEntityContext) => void;
}

export default function MultiRailExecutionPanel({
  selectedDimension,
  rawVision,
  pepitaDeOro,
  onEntityChange,
}: MultiRailExecutionPanelProps): React.JSX.Element {
  // Estado de entidad seleccionada
  const [selectedEntityId, setSelectedEntityId] = useState<string>('otzarreta');

  // Contexto del evento
  const [eventId, setEventId] = useState<string>('EAR-2026-BODA-01');
  const [clientName, setClientName] = useState<string>('Marta López & Iñigo Etxebarria');
  const [clientTaxId, setClientTaxId] = useState<string>('12345678Z');
  const [eventDate, setEventDate] = useState<string>('2026-09-18');
  const [venue, setVenue] = useState<string>('Restaurante Otzarreta (Derio)');
  const [grossEur, setGrossEur] = useState<number>(9000);

  // Estados de ejecución
  const [activeTrigger, setActiveTrigger] = useState<MultiRailTriggerId>('DISPARAR_CONTRATO_EIDAS');
  const [executing, setExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<MultiRailExecutionResult | null>(null);
  const [copiedPreview, setCopiedPreview] = useState<boolean>(false);

  // Resolución de Entidad
  const entityContext = useMemo<ResolvedEntityContext>(() => {
    const res = resolveEntityContext(selectedEntityId, selectedDimension);
    if (onEntityChange) {
      onEntityChange(res);
    }
    return res;
  }, [selectedEntityId, selectedDimension, onEntityChange]);

  // Ejecución de Disparador
  const handleExecuteTrigger = async (triggerId: MultiRailTriggerId) => {
    setActiveTrigger(triggerId);
    setExecuting(true);
    setExecutionResult(null);

    const context: MultiRailExecutionContext = {
      eventId,
      clientName,
      clientTaxId,
      eventDate,
      venue: venue || entityContext.displayName,
      grossEur,
      dimensionId: selectedDimension,
      entityContext,
      pepitaDeOro,
      rawVision,
    };

    try {
      let res: MultiRailExecutionResult;
      switch (triggerId) {
        case 'DISPARAR_CONTRATO_EIDAS':
          res = executeEidasContract(context);
          break;
        case 'DISPARAR_STRIPE_CHECKOUT':
          res = executeStripeCheckout(context);
          break;
        case 'EXPORTAR_FACTURAE_B2G':
          res = executeExportFacturae(context);
          break;
        case 'ORDEN_SALA_COCINA':
          res = executeOrdenSalaCocina(context);
          break;
        case 'WAYBILL_LOGISTICA':
          res = executeWaybillLogistica(context);
          break;
        case 'WEBHOOK_N8N_IDEMPOTENTE':
          res = await executeWebhookN8n(context);
          break;
        case 'MEGAPROMPT_OBRERO_AST':
          res = executeMegapromptObrero(context);
          break;
        default:
          res = executeEidasContract(context);
      }
      setExecutionResult(res);
    } catch (err) {
      console.error('Error executing trigger:', err);
    } finally {
      setExecuting(false);
    }
  };

  const handleCopyPreview = async () => {
    if (!executionResult) return;
    try {
      await navigator.clipboard.writeText(executionResult.previewContent);
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!executionResult) return;
    if (executionResult.downloadUrl && executionResult.downloadUrl.startsWith('http')) {
      window.open(executionResult.downloadUrl, '_blank');
      return;
    }
    if (executionResult.downloadUrl) {
      const a = document.createElement('a');
      a.href = executionResult.downloadUrl;
      a.download = executionResult.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Si no hay URL directa pero hay texto plano
    const blob = new Blob([executionResult.previewContent], {
      type: executionResult.artifactKind === 'xml' ? 'application/xml' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = executionResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6 pt-4 border-t border-neutral-800">
      {/* 1. Header del Multi-Rail Execution Plane */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              FASE 3: MULTI-RAIL EXECUTION PLANE (7 DISPARADORES INDUSTRIALES)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Plano de mando de ejecución soberana. Emisión determinista de contratos, XML Facturae, sesión Stripe, órdenes de sala y rutas logísticas con cierre SHA-256.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            7 RAILS ACTIVOS
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            0 TOKENS EXTERNOS
          </span>
        </div>
      </div>

      {/* 2. Selector de Entidad y Configuración de Parámetros del Evento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
        <div className="lg:col-span-4 space-y-3">
          <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold block">
            Entidad Vinculada (Entity Resolver):
          </label>
          <div className="space-y-1.5">
            {KNOWN_ENTITIES.map((ent) => (
              <button
                key={ent.id}
                type="button"
                onClick={() => setSelectedEntityId(ent.id)}
                className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                  selectedEntityId === ent.id
                    ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                    : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span className="truncate">{ent.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {ent.kind}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-[10px] font-mono text-neutral-400 space-y-1">
            <div className="text-white font-bold">INVARIANTES DE ENTIDAD:</div>
            {entityContext.specificInvariants.slice(0, 3).map((inv, idx) => (
              <div key={idx} className="line-clamp-1 text-neutral-300">• {inv}</div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">
              ID Evento:
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">
              Fecha Evento:
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">
              Cliente / Órgano Contratante:
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">
              NIF / CIF / Código DIR3:
            </label>
            <input
              type="text"
              value={clientTaxId}
              onChange={(e) => setClientTaxId(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">
              Recinto / Localización:
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-bold">
              Importe Bruto Estimado (€):
            </label>
            <input
              type="number"
              value={grossEur}
              onChange={(e) => setGrossEur(Number(e.target.value))}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid de los 7 Disparadores Industriales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {MULTI_RAIL_TRIGGERS.map((trigger) => {
          const Icon = TRIGGER_ICONS[trigger.id];
          const isSelected = activeTrigger === trigger.id;

          return (
            <button
              key={trigger.id}
              type="button"
              onClick={() => handleExecuteTrigger(trigger.id)}
              disabled={executing}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    #{trigger.code}
                  </span>
                </div>
                <div className="text-xs font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors truncate">
                  {trigger.label}
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight line-clamp-2">
                  {trigger.summary}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-neutral-900 flex items-center justify-between text-[9px] font-mono">
                <span className="text-neutral-500 uppercase">{trigger.artifactType}</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  Disparar <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Visor de Salida del Rail Seleccionado */}
      {executing && (
        <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-xl text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
          <p className="text-xs font-mono text-neutral-400">Ejecutando rail determinista...</p>
        </div>
      )}

      {executionResult && !executing && (
        <div className="p-4 bg-neutral-950 border border-emerald-500/40 rounded-xl space-y-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-white font-mono uppercase">
                  {executionResult.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  EXIT CODE 0
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">
                Fichero: <span className="text-white font-bold">{executionResult.filename}</span> ({executionResult.byteLength} bytes) · SHA-256: <span className="text-amber-400">{executionResult.sha256.slice(0, 16)}...</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPreview}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPreview ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar {executionResult.artifactKind.toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Caja de previsualización de evidencia */}
          <div className="p-3 bg-black/70 border border-neutral-900 rounded-lg text-xs font-mono text-neutral-300 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap select-all">
            {executionResult.previewContent}
          </div>
        </div>
      )}
    </div>
  );
}
