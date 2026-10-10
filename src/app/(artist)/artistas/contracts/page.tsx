'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { ArtistContractsPanel } from '@/app/components/artists/ArtistContractsPanel';

/* ------------------------------------------------------------------ */
/*  Error Boundary                                                     */
/* ------------------------------------------------------------------ */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ContractsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ArtistContractsPage] ErrorBoundary caught:', error, errorInfo);
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
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-3"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
            Error al cargar contratos
          </p>
          <p className="text-sm text-white/60 font-mono break-all">
            {this.state.error?.message ?? 'Error desconocido'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 hover:bg-[#ecb613]/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Suspense Fallback                                                  */
/* ------------------------------------------------------------------ */

function ContractsSkeleton(): ReactNode {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="h-6 w-40 rounded-full bg-white/5" />
      <div className="h-32 w-full rounded-2xl bg-white/5" />
      <div className="h-32 w-full rounded-2xl bg-white/5" />
      <div className="h-32 w-full rounded-2xl bg-white/5" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ArtistContractsPage(): ReactNode {
  const artist = SEED_ARTISTS[0]; // Edwin Agudelo

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Contratos
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Legal OS
          </span>
        </div>

        <ContractsErrorBoundary>
          <Suspense fallback={<ContractsSkeleton />}>
            <ArtistContractsPanel contracts={artist.contracts} />
          </Suspense>
        </ContractsErrorBoundary>
      </div>
    </main>
  );
}