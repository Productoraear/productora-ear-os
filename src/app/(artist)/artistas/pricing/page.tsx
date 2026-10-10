'use client';

import React, { Suspense } from 'react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PricingErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[ArtistPricingPage] ErrorBoundary caught:', error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
            Error en Pricing OS
          </p>
          <p className="text-sm text-white/60 font-mono break-words">
            {this.state.error?.message ?? 'Error desconocido al cargar la matriz de tarifas.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 hover:bg-[#ecb613]/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PricingSkeleton(): React.ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-6 animate-pulse"
    >
      <div className="h-6 w-40 rounded-full bg-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl border border-white/5 bg-white/[0.02]"
          />
        ))}
      </div>
    </div>
  );
}

export default function ArtistPricingPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Cachés &amp; Tarifas
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Pricing OS
          </span>
        </div>

        <PricingErrorBoundary>
          <Suspense fallback={<PricingSkeleton />}>
            <ArtistPricingMatrix />
          </Suspense>
        </PricingErrorBoundary>
      </div>
    </main>
  );
}