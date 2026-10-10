import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import type { ReactElement, ReactNode, ErrorInfo } from 'react';
import { Component } from 'react';
import SentinelAbsorptionRadar from '@/components/admin/SentinelAbsorptionRadar';

export const metadata: Metadata = {
  title: 'Sentinel — Consola de Absorción Bare-Metal | EAR OS',
  description:
    'Monitorización autónoma de archivos pendientes en H:\\, absorción en vivo y despliegue a ARCHIVO_HISTORICO_EAR sin gastar tokens de API.',
};

function SentinelRadarSkeleton(): ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="rounded-2xl border border-zinc-800/60 bg-[#07070b] p-6 sm:p-8 space-y-6 animate-pulse"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-48 rounded bg-zinc-800/70" />
        <div className="h-4 w-24 rounded bg-zinc-800/70" />
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-zinc-800/60 bg-[#030305]">
        <div className="absolute inset-6 rounded-full border border-zinc-800/40" />
        <div className="absolute inset-12 rounded-full border border-zinc-800/30" />
        <div className="absolute inset-20 rounded-full border border-zinc-800/20" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/40" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-16 rounded-xl bg-zinc-800/40" />
        <div className="h-16 rounded-xl bg-zinc-800/40" />
        <div className="h-16 rounded-xl bg-zinc-800/40" />
      </div>
      <span className="sr-only">Cargando radar de absorción Sentinel…</span>
    </div>
  );
}

function SentinelErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactElement {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-red-500/30 bg-[#0a0507] p-6 sm:p-8 space-y-4"
    >
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-red-400">
          Fallo en el radar de absorción Sentinel
        </h2>
      </div>
      <p className="text-xs font-mono text-zinc-400 leading-relaxed">
        El motor bare-metal no pudo inicializar la telemetría en vivo. Los archivos en{' '}
        <span className="text-zinc-300">H:\</span> permanecen intactos y no se ha consumido ningún
        token de API.
      </p>
      {error.digest ? (
        <p className="text-[10px] font-mono text-zinc-600">
          digest: <span className="text-zinc-500">{error.digest}</span>
        </p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono font-bold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        REINTENTAR ABSORCIÓN
      </button>
    </div>
  );
}

interface SentinelErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface SentinelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SentinelErrorBoundary extends Component<
  SentinelErrorBoundaryProps,
  SentinelErrorBoundaryState
> {
  constructor(props: SentinelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SentinelErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[SentinelErrorBoundary]', error, errorInfo);
    }
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const err = this.state.error ?? new Error('Sentinel radar unavailable');
      return <SentinelErrorFallback error={err} reset={this.reset} />;
    }
    return this.props.children;
  }
}

export default function SentinelPage(): ReactElement {
  return (
    <div className="min-h-screen bg-[#030305] text-white space-y-6 max-w-7xl mx-auto p-6 sm:p-10 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <span>IA &amp; GPU</span>
        <span>/</span>
        <span className="text-[#ecb613]">Consola Sentinel ZTM</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-syne tracking-tight text-white uppercase">
            CONSOLA SENTINEL // ZERO-TOKEN ABSORBER
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Motor de ingesta bare-metal • Ingesta de bóveda a Archivo Histórico •{' '}
            <span className="text-[#ecb613]">0 Tokens API consumidos</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
            ZERO-TOKEN MEMORY
          </div>
        </div>
      </div>

      {/* Radar interactivo con Suspense + ErrorBoundary boundary */}
      <SentinelErrorBoundary
        fallback={
          <SentinelErrorFallback
            error={new Error('Sentinel radar unavailable')}
            reset={() => {}}
          />
        }
      >
        <Suspense fallback={<SentinelRadarSkeleton />}>
          <SentinelAbsorptionRadar />
        </Suspense>
      </SentinelErrorBoundary>
    </div>
  );
}