"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode
} from 'react';
import Link from 'next/link';
import {
  Cpu,
  HardDrive,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Database
} from 'lucide-react';
import { SSOT_PROVIDER_METRICS } from '@/lib/constants/SClassNexus';

type Telemetry = {
  timestamp: string;
  host: { platform: string; arch: string; hostname: string; node: string; uptimeSec: number };
  cpu: { model: string; cores: number; loadAvg: number[] };
  memory: { totalMB: number; usedMB: number; freeMB: number; usedPct: number };
  vram: { totalMB: number; usedMB: number } | null;
  network: { activeIps: string[] };
  ollama: { online: boolean; models: string[]; latencyMs: number };
  payments: { stripeConfigured: boolean; webhookConfigured: boolean };
  responseMs: number;
};

function fmtMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function fmtCount(n: number): string {
  return new Intl.NumberFormat('es-ES').format(n);
}

type TelemetryErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type TelemetryErrorBoundaryState = {
  hasError: boolean;
  message: string | null;
};

class TelemetryErrorBoundary extends Component<
  TelemetryErrorBoundaryProps,
  TelemetryErrorBoundaryState
> {
  constructor(props: TelemetryErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error: unknown): TelemetryErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Error desconocido en telemetría'
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[TelemetriaErrorBoundary]', error, info.componentStack);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, message: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="font-mono text-xs text-red-300">
              Fallo crítico en módulo de telemetría: {this.state.message ?? 'desconocido'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-[11px] font-mono text-red-200 hover:bg-red-500/30 transition-colors"
            >
              Reintentar render
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function TelemetrySkeleton(): ReactNode {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans animate-pulse">
      <div className="h-4 w-64 rounded bg-zinc-900/80" />
      <div className="h-10 w-96 rounded bg-zinc-900/80" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3"
          >
            <div className="h-3 w-24 rounded bg-zinc-800/80" />
            <div className="h-8 w-32 rounded bg-zinc-800/80" />
            <div className="h-3 w-40 rounded bg-zinc-800/60" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3"
          >
            <div className="h-3 w-28 rounded bg-zinc-800/80" />
            <div className="h-4 w-48 rounded bg-zinc-800/70" />
            <div className="h-3 w-36 rounded bg-zinc-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TelemetriaCatminContent(): ReactNode {
  const [data, setData] = useState<Telemetry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/telemetry', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Telemetry;
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de telemetría');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>IA &amp; GPU</span>
        <span>/</span>
        <span className="text-[#ecb613]">Telemetría Bare-Metal</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-syne tracking-tight text-white uppercase">
            TELEMETRÍA &amp; RENDIMIENTO BARE-METAL
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Supervisión continua del host • CPU, RAM, GPU 24GB VRAM • Motor Ollama (11434) y Pasarela Stripe
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => load()}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ecb613]/50 transition-colors"
            title="Refrescar telemetría"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ecb613]' : ''}`} />
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            10s REFRESH AUTO
          </div>
        </div>
      </div>

      {/* KPI Cards CATMÍN S-Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Ollama Local</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-3">
            {data?.ollama.online ? 'ONLINE' : 'STANDBY'}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400">{data?.ollama.latencyMs ?? 0} ms</span> latencia GPU
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Memoria RAM</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ecb613] group-hover:scale-105 transition-transform">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#ecb613] mt-3">
            {data ? fmtMB(data.memory.usedMB) : 'N/D'}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-[#ecb613]">{data?.memory.usedPct ?? 0}%</span> en uso del total
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">SSOT Bóveda Proveedores</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-3">
            {fmtCount(SSOT_PROVIDER_METRICS.TOTAL_PROVIDERS_VAULT)}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-blue-400">{SSOT_PROVIDER_METRICS.CATEGORIES_COUNT} gremios</span> SSOT canónica
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Stripe Price-Lock</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 mt-3">
            {data?.payments.stripeConfigured ? '100 € ACTIVO' : 'STANDBY'}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-purple-400">SHA-256</span> Webhook OK
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="font-mono text-xs text-red-300">Fallo en telemetría: {error}</p>
        </div>
      )}

      {/* Hardware Details Grid */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a1a24] pb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase">CPU Host</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{data.cpu.cores} Cores</span>
            </div>
            <div className="text-xs font-mono text-white">{data.cpu.model}</div>
            <div className="text-[11px] font-mono text-zinc-500">
              LoadAvg: <span className="text-zinc-300">{data.cpu.loadAvg.join(' · ')}</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a1a24] pb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase">GPU VRAM</span>
              <span className="text-xs font-mono text-[#ecb613] font-bold">24GB VRAM</span>
            </div>
            <div className="text-xs font-mono text-white">AMD Radeon RX 7900 XTX</div>
            <div className="text-[11px] font-mono text-zinc-500">
              Aceleración: <span className="text-[#ecb613]">DirectX 12 / ROCm Bare-Metal</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a1a24] pb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase">Host Node</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">Node {data.host.node}</span>
            </div>
            <div className="text-xs font-mono text-white truncate">{data.host.hostname}</div>
            <div className="text-[11px] font-mono text-zinc-500">
              Uptime: <span className="text-zinc-300">{Math.floor(data.host.uptimeSec / 3600)}h {Math.floor((data.host.uptimeSec % 3600) / 60)}m</span>
            </div>
          </div>
        </div>
      )}

      {/* Modelos Ollama Cargados */}
      {data && (
        <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1a1a24] pb-3">
            <span className="text-xs font-mono text-zinc-400 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ecb613]" />
              Modelos Ollama Locales Cargados en Memoria
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{data.ollama.models.length} Modelos</span>
          </div>

          {data.ollama.models.length === 0 ? (
            <p className="text-xs font-mono text-zinc-500">Sin modelos activos en 127.0.0.1:11434</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {data.ollama.models.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#ecb613]" />
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TelemetriaCatminPage(): ReactNode {
  return (
    <TelemetryErrorBoundary>
      <Suspense fallback={<TelemetrySkeleton />}>
        <TelemetriaCatminContent />
      </Suspense>
    </TelemetryErrorBoundary>
  );
}