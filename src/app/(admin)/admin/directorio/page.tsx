"use client";

import React, { useState, Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Cpu,
  Database,
  Building,
  Volume2,
  Lock,
  ArrowRight,
  Download,
  AlertTriangle,
  UtensilsCrossed,
  FileCheck,
  Car,
  X,
} from 'lucide-react';
import { z } from 'zod';
import { Cult3StageEnrichmentPipeline } from '@/app/components/cult-directory/Cult3StageEnrichmentPipeline';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import {
  PROVIDERS_MANIFEST_TOTALS,
  PROVIDERS_GRAND_TOTAL,
} from '@/lib/constants/providers-manifest';
import { MetricProvenanceBadge } from '@/components/admin/MetricProvenanceBadge';
import { staticMetric } from '@/lib/admin/metrics-provenance';
import {
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  DEPOSITO_STRIPE_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  OTZARRETA_WEDDING_MENUS,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';
import {
  executeOrdenSalaCocina,
  executeEidasContract,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

/* ========================================================================== */
/* CONTRATO DE DATOS ZOD ESTRICTO (NIVEL 5)                                   */
/* ========================================================================== */

export const FincaVenueZodSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    provincia: z.string(),
    location: z.string(),
    capacidadMaxPax: z.number(),
    tomaElectrica: z.string(),
    limiteAcusticoDba: z.number().max(LIMITE_SPL_DB),
    polizaRCEuros: z.number(),
    estadoHomologacion: z.string(),
    isOtzarretaIsolated: z.boolean(),
  })
  .strict();

export type FincaVenue = z.infer<typeof FincaVenueZodSchema>;

/* -------------------------------------------------------------------------- */
/*  ERROR BOUNDARY — S-Class sealed                                            */
/* -------------------------------------------------------------------------- */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SectionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error(
        `[EAR-OS][ErrorBoundary${this.props.label ? `:${this.props.label}` : ''}]`,
        error,
        errorInfo,
      );
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="rounded-3xl bg-[#09090d]/80 border border-red-500/30 p-6 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Fallo en módulo {this.props.label ?? 'desconocido'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {this.state.error?.message ?? 'Error inesperado en el subsistema.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-[#ecb613]/50 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>Reintentar</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/*  SUSPENSE FALLBACKS                                                         */
/* -------------------------------------------------------------------------- */

function PipelineSkeleton(): ReactNode {
  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 space-y-4 animate-pulse font-mono">
      <div className="flex items-center gap-2 text-zinc-500">
        <Cpu className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider">Cargando pipeline IA…</span>
      </div>
      <div className="h-3 w-2/3 rounded bg-zinc-800/70" />
      <div className="h-3 w-1/2 rounded bg-zinc-800/70" />
      <div className="h-3 w-3/4 rounded bg-zinc-800/70" />
    </div>
  );
}

function FincasSkeleton(): ReactNode {
  return (
    <div className="rounded-3xl bg-[#09090b] border border-zinc-800 p-6 space-y-4 animate-pulse font-mono">
      <div className="flex items-center gap-2 text-zinc-500">
        <Building className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider">Cargando matriz de fincas…</span>
      </div>
      <div className="h-3 w-1/3 rounded bg-zinc-800/70" />
      <div className="h-3 w-2/3 rounded bg-zinc-800/70" />
      <div className="h-3 w-1/2 rounded bg-zinc-800/70" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE PRINCIPAL DIRECTORY (NIVEL 5)                                         */
/* -------------------------------------------------------------------------- */

export default function AdminCultDirectoryPage(): ReactNode {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'fincas' | 'otzarreta'>('pipeline');
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  const otzarretaContext = resolveEntityContext('otzarreta-finca', 'HOSTELERIA_FINCAS');

  const handleTriggerOrdenSala = () => {
    const res = executeOrdenSalaCocina({
      eventId: `OTZARRETA-SALA-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Pareja VIP / Banquete Otzarreta 2026',
      venue: otzarretaContext.displayName,
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 18500.0,
      dimensionId: 'HOSTELERIA_FINCAS',
      entityContext: otzarretaContext,
      pepitaDeOro: 'Orden Oficial de Sala y Cocina Caserío Ezkertza Berria',
      rawVision: `Distribución de mesas, 120 plazas párking, límite < ${LIMITE_SPL_DB} dB y menús ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} sin suplemento de intolerancias`,
    });
    setActiveResult(res);
  };

  const handleTriggerEidasContrato = () => {
    const res = executeEidasContract({
      eventId: `OTZARRETA-AGREEMENT-2026`,
      clientName: 'Eduardo Martínez / Restaurante Otzarreta',
      venue: 'Derio (Bizkaia · Txorierri)',
      eventDate: new Date().toISOString().slice(0, 10),
      dimensionId: 'HOSTELERIA_FINCAS',
      entityContext: otzarretaContext,
      pepitaDeOro: 'Acuerdo Soberano de Exclusividad Comarcal 100 km (Regla 91)',
      rawVision: `Contrato eIDAS marco para preservación de menús y blindaje de tarifas 2026`,
    });
    setActiveResult(res);
  };

  const artistPct = Math.round(SPLIT_SOBERANO.artista * 100);
  const earOsPct = Math.round(SPLIT_SOBERANO.earOs * 100);
  const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      {/* Breadcrumb & Top Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
            <span>/</span>
            <span>Expansión &amp; Ventas</span>
            <span>/</span>
            <span className="text-[#ecb613]">Directorio &amp; IA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-syne uppercase tracking-tight text-white flex items-center gap-3">
            Directorio &amp; Pipeline IA S-Class
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">
              Cult UI v1.2
            </span>
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Control de homologación de nodos • Ficha aislada Otzarreta • Límite acústico &lt; {LIMITE_SPL_DB} dB SPL
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/directorio"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ecb613]/50 flex items-center gap-2 transition-colors"
          >
            <span>Ver Directorio Público</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ecb613]" />
          </Link>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GPU LOCAL ONLINE</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <SectionErrorBoundary label="kpi-strip">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Nodos Homologados
              </span>
              <div className="text-2xl font-bold text-white mt-1">
                {PROVIDERS_GRAND_TOTAL.toLocaleString('es-ES')}
              </div>
              <span className="text-[10px] text-zinc-400">100% Sincronizados Edge CDN</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <MetricProvenanceBadge
                metric={staticMetric('directorio_nodos', 'Nodos Homologados', PROVIDERS_GRAND_TOTAL, 'providers-manifest.ts', 'nodos')}
                size="sm"
              />
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Red Fincas S-Class
              </span>
              <div className="text-2xl font-bold text-[#ecb613] mt-1">
                {SCLASS_12_FINCAS_HOMOLOGADAS.length} Fincas
              </div>
              <span className="text-[10px] text-zinc-400">CETAC 32A / 16A Auditado</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <MetricProvenanceBadge
                metric={staticMetric('directorio_fincas', 'Fincas S-Class', SCLASS_12_FINCAS_HOMOLOGADAS.length, 'fincas-catalog.ts', 'fincas')}
                size="sm"
              />
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Rider Bose 12W/pax
              </span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                &lt; {LIMITE_SPL_DB} dB SPL
              </div>
              <span className="text-[10px] text-zinc-400">Certificación acústica SSOT</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <MetricProvenanceBadge
                metric={staticMetric('directorio_rider_db', 'Límite Acústico', LIMITE_SPL_DB, 'ear-os-ssot.ts', 'dB SPL')}
                size="sm"
              />
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Split Soberano
              </span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                {artistPct} / {earOsPct} / {vimumePct}
              </div>
              <span className="text-[10px] text-zinc-400">80% IRPF Deducible VIMUME</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <MetricProvenanceBadge
                metric={staticMetric('directorio_split', 'Split Soberano', artistPct, 'ear-os-ssot.ts', '%')}
                size="sm"
              />
            </div>
          </div>
        </div>
      </SectionErrorBoundary>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3 font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'pipeline'
              ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Pipeline de Enriquecimiento IA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fincas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'fincas'
              ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Red de 12 Fincas Homologadas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('otzarreta')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'otzarreta'
              ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
          <span>Paciente Cero Otzarreta (Derio)</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <SectionErrorBoundary label="pipeline-ia">
            <Suspense fallback={<PipelineSkeleton />}>
              <Cult3StageEnrichmentPipeline />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {activeTab === 'fincas' && (
        <SectionErrorBoundary label="fincas-matrix">
          <Suspense fallback={<FincasSkeleton />}>
            <div className="rounded-3xl bg-[#09090b] border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-syne font-bold text-base text-white uppercase tracking-tight">
                  Matriz Técnica de Fincas Homologadas S-Class
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  {SCLASS_12_FINCAS_HOMOLOGADAS.length} espacios certificados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-500 text-[10px] uppercase border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Finca / Espacio</th>
                      <th className="p-4">Ubicación</th>
                      <th className="p-4">Capacidad</th>
                      <th className="p-4">Acometida</th>
                      <th className="p-4">Límite Acústico</th>
                      <th className="p-4">Póliza RC</th>
                      <th className="p-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {SCLASS_12_FINCAS_HOMOLOGADAS.map((finca) => (
                      <tr key={finca.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4 font-bold text-white">{finca.name}</td>
                        <td className="p-4 text-zinc-400">{finca.provincia} ({finca.location})</td>
                        <td className="p-4">{finca.capacidadMaxPax} pax</td>
                        <td className="p-4 text-emerald-400">{finca.tomaElectrica}</td>
                        <td className="p-4 text-[#ecb613]">&lt; {finca.limiteAcustico.exteriorDBA} dBA</td>
                        <td className="p-4 text-cyan-300">{(finca.polizaRC.coberturaEuros / 1000).toFixed(0)}k €</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">
                            {finca.estadoHomologacion === 'CERTIFICADA_GOLD_MASTER' ? 'GOLD MASTER' : 'HOMOLOGADA'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Suspense>
        </SectionErrorBoundary>
      )}

      {activeTab === 'otzarreta' && (
        <div className="rounded-3xl bg-[#09090d]/90 border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Paciente Cero B2B Fincas
                </span>
                <span className="text-zinc-500 text-xs">• Eduardo Martínez</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-syne text-white uppercase mt-1">
                {otzarretaContext.displayName}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {otzarretaContext.locationBase} • {otzarretaContext.legalProvenance}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleTriggerOrdenSala}
                className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
              >
                <UtensilsCrossed className="w-4 h-4 text-purple-400" />
                <span>Orden Sala &amp; Cocina</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerEidasContrato}
                className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Contrato eIDAS</span>
              </button>
            </div>
          </div>

          {/* Tarjetas Invariantes Otzarreta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase block">Aparcamiento Privado</span>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-[#ecb613]" />
                <span>{otzarretaContext.parkingSpaces} plazas</span>
              </div>
              <span className="text-[10px] text-zinc-400">Gratuitas y vigiladas en Caserío</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase block">Blindaje Acústico</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>&lt; {otzarretaContext.acousticLimitDb} dB SPL</span>
              </div>
              <span className="text-[10px] text-zinc-400">Ley 37/2003 del Ruido garantizada</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase block">Exclusividad Comarcal</span>
              <div className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>100 km blindados</span>
              </div>
              <span className="text-[10px] text-zinc-400">Regla 91 de no-competencia</span>
            </div>
          </div>

          {/* Menús Oficiales 2026 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Menús Oficiales Temporada 2026 (Dossier Sellado)
              </h3>
              <span className="text-[10px] text-emerald-400">Intolerancias y celíacos a 0,00 € sin recargo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OTZARRETA_WEDDING_MENUS.map((menu) => (
                <div
                  key={menu.name}
                  className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-850 hover:border-[#ecb613]/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{menu.name}</span>
                    <span className="font-extrabold text-[#ecb613] text-sm">
                      {formatOtzarretaMenuPrice(menu.priceEur)} + IVA
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {menu.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Multi-Rail Artifact */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Artefacto:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Vista Previa:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors"
              >
                Cerrar
              </button>
              {activeResult.downloadUrl && (
                <a
                  href={activeResult.downloadUrl}
                  download={activeResult.filename}
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
