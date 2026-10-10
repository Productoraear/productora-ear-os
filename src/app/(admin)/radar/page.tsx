import React, { Suspense } from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface MatrixItem {
  Type: string;
  Signature: string;
  Status: string;
  Diagnostics: string;
}

interface ReportData {
  audit_date: string;
  total_signatures: number;
  implemented_count: number;
  missing_count: number;
  coverage_ratio: number;
  matrix: MatrixItem[];
}

const DEFAULT_REPORT: ReportData = {
  audit_date: 'No auditada',
  total_signatures: 0,
  implemented_count: 0,
  missing_count: 0,
  coverage_ratio: 0,
  matrix: [],
};

function loadReportData(): ReportData {
  const matrixPath = path.join(
    process.cwd(),
    'docs',
    'architecture',
    'HISTORIC_FORENSIC_GAP_MATRIX.json'
  );

  if (!fs.existsSync(matrixPath)) {
    return DEFAULT_REPORT;
  }

  try {
    const raw = fs.readFileSync(matrixPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ReportData>;
    return {
      audit_date: typeof parsed.audit_date === 'string' ? parsed.audit_date : DEFAULT_REPORT.audit_date,
      total_signatures:
        typeof parsed.total_signatures === 'number' ? parsed.total_signatures : DEFAULT_REPORT.total_signatures,
      implemented_count:
        typeof parsed.implemented_count === 'number' ? parsed.implemented_count : DEFAULT_REPORT.implemented_count,
      missing_count:
        typeof parsed.missing_count === 'number' ? parsed.missing_count : DEFAULT_REPORT.missing_count,
      coverage_ratio:
        typeof parsed.coverage_ratio === 'number' ? parsed.coverage_ratio : DEFAULT_REPORT.coverage_ratio,
      matrix: Array.isArray(parsed.matrix) ? (parsed.matrix as MatrixItem[]) : DEFAULT_REPORT.matrix,
    };
  } catch (e) {
    console.error('Error leyendo matriz forense:', e);
    return DEFAULT_REPORT;
  }
}

function RadarSkeleton(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#030305] text-[#FFFFFF] p-6 font-sans">
      <header className="border-b border-[#1a1a1a] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#258DCD] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#258DCD]">
              EAR_OS // COGNITIVE RADAR HUD
            </span>
          </div>
          <div className="h-7 w-72 bg-zinc-900/60 rounded mt-2 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-32 bg-zinc-900/60 rounded-xl animate-pulse" />
          <div className="h-9 w-44 bg-zinc-900/60 rounded-xl animate-pulse" />
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 animate-pulse"
          >
            <div className="h-3 w-24 bg-zinc-900/60 rounded" />
            <div className="h-8 w-20 bg-zinc-900/60 rounded mt-3" />
            <div className="h-2 w-full bg-zinc-900/60 rounded mt-4" />
          </div>
        ))}
      </section>
      <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 animate-pulse">
        <div className="h-5 w-64 bg-zinc-900/60 rounded mb-4" />
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-full bg-zinc-900/60 rounded" />
          ))}
        </div>
      </section>
    </main>
  );
}

function RadarErrorFallback({ error }: { error: Error }): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#030305] text-[#FFFFFF] p-6 font-sans flex items-center justify-center">
      <div className="max-w-lg w-full rounded-3xl bg-[#09090d]/80 border border-[#FF455B]/30 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-[#FF455B] mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white font-syne mb-2">
          Fallo en el Radar Cognitivo
        </h1>
        <p className="text-sm text-zinc-400 mb-4">
          No se pudo cargar la matriz forense de cobertura histórica.
        </p>
        <pre className="text-[11px] font-mono text-[#FF455B]/80 bg-black/40 border border-[#FF455B]/20 rounded-xl p-3 overflow-x-auto text-left">
          {error.message}
        </pre>
        <Link
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono transition-colors"
        >
          Volver a la Home
        </Link>
      </div>
    </main>
  );
}

class RadarErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: (error: Error) => React.ReactElement },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: (error: Error) => React.ReactElement }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('RadarErrorBoundary caught:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

function RadarContent(): React.ReactElement {
  const reportData = loadReportData();
  const missingItems = reportData.matrix.filter((item) => item.Status === 'MISSING_IN_REPO');
  const safeRatio = Math.min(Math.max(reportData.coverage_ratio, 0), 100);

  return (
    <main className="min-h-screen bg-[#030305] text-[#FFFFFF] p-6 font-sans">
      {/* HUD Header */}
      <header className="border-b border-[#1a1a1a] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#258DCD] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#258DCD]">
              EAR_OS // COGNITIVE RADAR HUD
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-white font-syne">
            Monitor de Soberanía y Cobertura Histórica
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono transition-colors"
          >
            Volver a la Home
          </Link>
          <a
            href="tel:+34693693048"
            className="px-4 py-2 bg-[#258DCD]/10 border border-[#258DCD]/30 text-[#258DCD] hover:bg-[#258DCD]/20 rounded-xl text-xs font-mono transition-colors"
          >
            Centralita: +34 693 693 048
          </a>
        </div>
      </header>

      {/* Tarjetas Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Coverage Ratio</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#258DCD] font-mono">
              {reportData.coverage_ratio}%
            </span>
            <span className="text-xs text-zinc-500">objetivo 100%</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#258DCD] h-full transition-all duration-500"
              style={{ width: `${safeRatio}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Total Firmas Auditadas</span>
          <span className="text-3xl font-extrabold text-white font-mono mt-2 block">
            {reportData.total_signatures}
          </span>
          <span className="text-xs text-zinc-500 mt-2 block">Extraídas de Bóveda y Chats</span>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Implementadas Activas</span>
          <span className="text-3xl font-extrabold text-[#AAD6CD] font-mono mt-2 block">
            {reportData.implemented_count}
          </span>
          <span className="text-xs text-emerald-500/80 mt-2 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Compilando en src/
          </span>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Brechas Pendientes</span>
          <span className="text-3xl font-extrabold text-[#FF455B] font-mono mt-2 block">
            {reportData.missing_count}
          </span>
          <span className="text-xs text-[#FF455B]/80 mt-2 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Faltan por absorber
          </span>
        </div>
      </section>

      {/* Lista de Deuda Técnica / Missing Signatures */}
      <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6">
        <div className="border-b border-[#1a1a1a] pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#258DCD]" />
              Entidades Pendientes de Absorción (Filtro ZTM)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Firmas técnicas detectadas en sesiones de IA que aún no residen en el código físico activo.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
            {missingItems.length} requeridas
          </span>
        </div>

        {missingItems.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-[#AAD6CD] mx-auto mb-2" />
            <p className="text-sm text-zinc-300 font-semibold">Soberanía Absoluta Alcanzada</p>
            <p className="text-xs text-zinc-500 mt-1">
              El 100% de los activos históricos están implementados y verificados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a1a] max-h-[500px] overflow-y-auto font-mono text-xs">
            {missingItems.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                    {item.Type}
                  </span>
                  <span className="text-zinc-200 font-semibold">{item.Signature}</span>
                </div>
                <span className="text-zinc-500 text-[11px]">{item.Diagnostics}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function RadarCoveragePage(): React.ReactElement {
  return (
    <RadarErrorBoundary fallback={(error) => <RadarErrorFallback error={error} />}>
      <Suspense fallback={<RadarSkeleton />}>
        <RadarContent />
      </Suspense>
    </RadarErrorBoundary>
  );
}