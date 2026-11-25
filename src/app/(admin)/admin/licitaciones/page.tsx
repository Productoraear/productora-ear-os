"use client";

import { useState, Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import {
  Landmark,
  Volume2,
  FileCheck,
  TrendingUp,
  Search,
  Sparkles,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { z } from 'zod';
import {
  SAFE_LCSP_CEILING_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  VAT_RATE,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeExportFacturae,
  executeEidasContract,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

/* ========================================================================== */
/* CONTRATO DE DATOS ZOD ESTRICTO (NIVEL 5)                                   */
/* ========================================================================== */

export const TenderZodSchema = z
  .object({
    id: z.string(),
    municipality: z.string(),
    event: z.string(),
    budgetMaxEur: z.number().max(SAFE_LCSP_CEILING_EUR),
    budgetMax: z.string(),
    status: z.string(),
    legalArticle: z.string(),
    soundLimitDb: z.number().max(LIMITE_SPL_DB),
    soundLimit: z.string(),
    dir3: z.string(),
  })
  .strict();

export type Tender = z.infer<typeof TenderZodSchema>;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/* ========================================================================== */
/* EXPEDIENTES CANÓNICOS B2G (VALORES ANCLADOS A SSOT)                        */
/* ========================================================================== */

const RAW_TENDERS = [
  {
    id: "B2G-TO-2026-04",
    municipality: "Ayuntamiento de Méntrida (Toledo)",
    event: "Concierto Fiestas Patronales // Gala Solista",
    budgetMaxEur: 12500.0,
    budgetMax: "12.500,00 €",
    status: "EN PLAZO",
    legalArticle: `Art. 118 LCSP (< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €)`,
    soundLimitDb: 68,
    soundLimit: `68 dBA (Cumple <${LIMITE_SPL_DB} dB)`,
    dir3: "L01451025"
  },
  {
    id: "B2G-MA-2026-11",
    municipality: "Ayuntamiento de Navalcarnero (Madrid)",
    event: "Festival Tradición & Memoria VIMUME",
    budgetMaxEur: 14200.0,
    budgetMax: "14.200,00 €",
    status: "DOCUMENTACIÓN LISTA",
    legalArticle: `Art. 118 LCSP (< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €)`,
    soundLimitDb: 72,
    soundLimit: `72 dBA (Cumple <${LIMITE_SPL_DB} dB)`,
    dir3: "L01280961"
  },
  {
    id: "B2G-GU-2026-08",
    municipality: "Ayuntamiento de Sigüenza (Guadalajara)",
    event: "Noches Musicales en la Plaza Mayor",
    budgetMaxEur: 9800.0,
    budgetMax: "9.800,00 €",
    status: "EN REVISIÓN",
    legalArticle: `Art. 118 LCSP (< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €)`,
    soundLimitDb: 70,
    soundLimit: `70 dBA (Cumple <${LIMITE_SPL_DB} dB)`,
    dir3: "L01192570"
  },
  {
    id: "B2G-TO-2026-09",
    municipality: "Ayuntamiento de Illescas (Toledo)",
    event: "Gala Lírica Senior Día del Mayor",
    budgetMaxEur: 13800.0,
    budgetMax: "13.800,00 €",
    status: "EN PLAZO",
    legalArticle: `Art. 118 LCSP (< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €)`,
    soundLimitDb: 65,
    soundLimit: `65 dBA (Cumple <${LIMITE_SPL_DB} dB)`,
    dir3: "L01450812"
  }
];

const TENDERS: readonly Tender[] = RAW_TENDERS.map((t) => TenderZodSchema.parse(t));

/* ========================================================================== */
/* ERROR BOUNDARY (S-Class)                                                   */
/* ========================================================================== */

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[EAR-OS][ErrorBoundary]', this.props.label ?? 'unknown', error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="rounded-3xl bg-[#09090d]/80 border border-red-500/30 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-bold text-white font-syne uppercase">
                Error en módulo {this.props.label ?? 'desconocido'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono break-all">
                {this.state.error?.message ?? 'Error desconocido'}
              </p>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ecb613] hover:text-[#ecb613]/80 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ========================================================================== */
/* FALLBACKS DE SUSPENSE                                                      */
/* ========================================================================== */

function KpiSkeleton(): ReactNode {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between pb-2">
            <div className="h-3 w-24 bg-zinc-800 rounded" />
            <div className="w-8 h-8 rounded-lg bg-zinc-800" />
          </div>
          <div className="h-7 w-32 bg-zinc-800 rounded mt-2" />
          <div className="h-3 w-40 bg-zinc-800 rounded mt-3" />
          <div className="h-3 w-36 bg-zinc-800 rounded mt-3" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton(): ReactNode {
  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="space-y-2">
          <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-80 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-8 w-72 bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-900 space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-zinc-800 rounded" />
              <div className="h-5 w-24 bg-zinc-800 rounded" />
            </div>
            <div className="h-4 w-56 bg-zinc-800 rounded" />
            <div className="h-3 w-48 bg-zinc-800 rounded" />
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900">
              <div className="h-8 bg-zinc-800 rounded" />
              <div className="h-8 bg-zinc-800 rounded" />
              <div className="h-8 bg-zinc-800 rounded" />
              <div className="h-8 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineLoader({ label }: { label: string }): ReactNode {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-xs font-mono text-zinc-500">
      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ecb613]" />
      <span>Cargando {label}…</span>
    </div>
  );
}

/* ========================================================================== */
/* SUBCOMPONENTES KPI (ENLAZADOS CON SSOT)                                    */
/* ========================================================================== */

function KpiCards(): ReactNode {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-400">Tope Preventivo Legal</span>
          <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-[#ecb613]" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          &lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          Art. 118 LCSP (Límite legal {LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} € con margen 750 €)
        </p>
        <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          Adjudicación Directa Sin Concurso
        </div>
      </div>

      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-400">Blindaje Acústico</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">&lt; {LIMITE_SPL_DB} dB SPL</div>
        <p className="text-[11px] text-zinc-400 mt-1">Bose F1 con limitador y dBA certificado</p>
        <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          Cero Sanciones Municipales
        </div>
      </div>

      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-400">Retorno Social VIMUME</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-400">SROI 4.85x</div>
        <p className="text-[11px] text-zinc-400 mt-1">Impacto cognitivo geriátrico certificado</p>
        <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          Modelo 182 AEAT Incluido
        </div>
      </div>

      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-purple-500/50 transition-all">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-400">Facturación Electrónica</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">FacturaE 3.2.2</div>
        <p className="text-[11px] text-zinc-400 mt-1">Compatibilidad FACe y código DIR3</p>
        <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          Cobro en 30 Días Garantizado
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* LISTADO DE EXPEDIENTES CON DISPARADORES MULTI-RAIL CONECTADOS              */
/* ========================================================================== */

interface TenderListProps {
  search: string;
  onSearchChange: (value: string) => void;
  onTriggerFacturae: (tender: Tender) => void;
  onTriggerEidas: (tender: Tender) => void;
}

function TenderList({
  search,
  onSearchChange,
  onTriggerFacturae,
  onTriggerEidas,
}: TenderListProps): ReactNode {
  const filteredTenders: readonly Tender[] = TENDERS.filter(
    (t) =>
      t.municipality.toLowerCase().includes(search.toLowerCase()) ||
      t.event.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
        <div>
          <h2 className="text-base font-bold font-syne text-white uppercase">
            Expedientes de Contratación Menor Activos (Art. 118 LCSP)
          </h2>
          <p className="text-xs text-zinc-500">
            Radar municipal en Castilla-La Mancha y Comunidad de Madrid · Techo legal {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar ayuntamiento o pliego..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {filteredTenders.map((tender) => (
          <div
            key={tender.id}
            className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#ecb613] font-bold bg-[#ecb613]/10 px-2 py-0.5 rounded border border-[#ecb613]/20">
                  {tender.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                  {tender.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors">
                {tender.municipality}
              </h3>
              <p className="text-xs text-zinc-300 font-light">{tender.event}</p>
            </div>

            <div className="pt-3 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">PRESUPUESTO MÁX.</span>
                <span className="font-bold text-white">{tender.budgetMax}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">LÍMITE ACÚSTICO</span>
                <span className="text-emerald-400">{tender.soundLimit}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">RÉGIMEN LEGAL</span>
                <span className="text-zinc-400 truncate block">{tender.legalArticle}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">CÓDIGO DIR3</span>
                <span className="text-cyan-400 font-bold">{tender.dir3}</span>
              </div>
            </div>

            {/* Acciones Multi-Rail Conectadas */}
            <div className="pt-3 border-t border-zinc-900/80 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onTriggerFacturae(tender)}
                className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Exportar Facturae 3.2.2</span>
              </button>

              <button
                type="button"
                onClick={() => onTriggerEidas(tender)}
                className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contrato eIDAS</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* MODAL VISOR DE RESULTADO MULTI-RAIL                                        */
/* ========================================================================== */

function ExecutionResultModal({
  result,
  onClose,
}: {
  result: MultiRailExecutionResult;
  onClose: () => void;
}): ReactNode {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
              {result.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
            <span className="text-zinc-400">Archivo:</span>
            <span className="text-white font-bold">{result.filename}</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
            <span className="text-zinc-500 text-[10px] block">SELLO CRIPTOGRÁFICO SHA-256</span>
            <span className="text-[#ecb613] text-[11px] break-all">{result.sha256}</span>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px]">Vista Previa del Artefacto:</span>
            <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
              {result.previewContent}
            </pre>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
          >
            Cerrar
          </button>
          {result.downloadUrl && (
            <a
              href={result.downloadUrl}
              download={result.filename}
              className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Artefacto</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* PÁGINA PRINCIPAL                                                           */
/* ========================================================================== */

export default function LicitacionesAdminCatminPage(): ReactNode {
  const [search, setSearch] = useState<string>("");
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  const handleTriggerFacturae = (tender: Tender): void => {
    const res = executeExportFacturae({
      eventId: tender.id,
      clientName: tender.municipality,
      clientTaxId: tender.dir3,
      venue: tender.municipality,
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: tender.budgetMaxEur,
      dimensionId: 'B2G_AYUNTAMIENTOS',
      entityContext: resolveEntityContext(tender.id, 'B2G_AYUNTAMIENTOS'),
      pepitaDeOro: `Expediente ${tender.id} Art. 118 LCSP`,
      rawVision: `${tender.event} en ${tender.municipality}`,
    });
    setActiveResult(res);
  };

  const handleTriggerEidas = (tender: Tender): void => {
    const res = executeEidasContract({
      eventId: tender.id,
      clientName: tender.municipality,
      clientTaxId: tender.dir3,
      venue: tender.municipality,
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: tender.budgetMaxEur,
      dimensionId: 'B2G_AYUNTAMIENTOS',
      entityContext: resolveEntityContext(tender.id, 'B2G_AYUNTAMIENTOS'),
      pepitaDeOro: `Pliego ${tender.id} homologado < ${LIMITE_SPL_DB} dB`,
      rawVision: tender.event,
    });
    setActiveResult(res);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Finanzas &amp; Legal</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">B2G &amp; Licitaciones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            B2G &amp; Contratación Menor (&lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €)
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Homologado &lt;{LIMITE_SPL_DB} dB SPL</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI LEGALES (SUSPENSE + ERROR BOUNDARY)   */}
      {/* ===================================================================== */}
      <ErrorBoundary label="KPI-Legales">
        <Suspense fallback={<KpiSkeleton />}>
          <KpiCards />
        </Suspense>
      </ErrorBoundary>

      {/* ===================================================================== */}
      {/* 3. LISTADO DE EXPEDIENTES Y PLIEGOS MENORES (SUSPENSE + ERROR BOUND)  */}
      {/* ===================================================================== */}
      <ErrorBoundary label="Expedientes-Contratación-Menor">
        <Suspense fallback={<ListSkeleton />}>
          <TenderList
            search={search}
            onSearchChange={setSearch}
            onTriggerFacturae={handleTriggerFacturae}
            onTriggerEidas={handleTriggerEidas}
          />
        </Suspense>
      </ErrorBoundary>

      {/* ===================================================================== */}
      {/* 4. MODAL MULTI-RAIL ARTIFACT                                          */}
      {/* ===================================================================== */}
      {activeResult && (
        <ExecutionResultModal
          result={activeResult}
          onClose={() => setActiveResult(null)}
        />
      )}

      {/* ===================================================================== */}
      {/* 5. LOADER INLINE (reserva para futuros fetch asíncronos)              */}
      {/* ===================================================================== */}
      <Suspense fallback={<InlineLoader label="sincronización B2G" />}>
        <div aria-hidden="true" />
      </Suspense>
    </div>
  );
}
