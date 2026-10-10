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
} from 'lucide-react';
import { Cult3StageEnrichmentPipeline } from '@/app/components/cult-directory/Cult3StageEnrichmentPipeline';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import {
  PROVIDERS_MANIFEST_TOTALS,
  PROVIDERS_GRAND_TOTAL,
} from '@/lib/constants/providers-manifest';

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
/*  PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminCultDirectoryPage(): ReactNode {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'fincas' | 'stats'>('pipeline');

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
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
            Control de homologación de nodos • Pipeline de enriquecimiento semántico en 3 etapas con GPU local
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
          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider block">
              Nodos Homologados
            </span>
            <div className="text-2xl font-bold text-white">
              {PROVIDERS_GRAND_TOTAL.toLocaleString('es-ES')}
            </div>
            <span className="text-[10px] text-zinc-400">100% Sincronizados Edge CDN</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider block">
              Red Fincas S-Class
            </span>
            <div className="text-2xl font-bold text-[#ecb613]">
              {SCLASS_12_FINCAS_HOMOLOGADAS.length} Fincas
            </div>
            <span className="text-[10px] text-zinc-400">CETAC 32A / 16A Auditado</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider block">
              Rider Bose 12W/pax
            </span>
            <div className="text-2xl font-bold text-emerald-400">
              &lt; 75 dB SPL
            </div>
            <span className="text-[10px] text-zinc-400">Certificación acústica SSOT</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider block">
              Split Soberano
            </span>
            <div className="text-2xl font-bold text-cyan-400">
              80 / 10 / 10
            </div>
            <span className="text-[10px] text-zinc-400">80% IRPF Deducible VIMUME</span>
          </div>
        </div>
      </SectionErrorBoundary>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'fincas'
              ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Red de 12 Fincas Homologadas</span>
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
    </div>
  );
}