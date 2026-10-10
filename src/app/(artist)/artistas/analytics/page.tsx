'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { ArtistAnalytics } from '@/app/components/artists/ArtistAnalytics';

/* -------------------------------------------------------------------------- */
/*  Error Boundary                                                            */
/* -------------------------------------------------------------------------- */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AnalyticsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ArtistAnalyticsPage] ErrorBoundary caught:', error, errorInfo);
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
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-300"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
            Analytics Error
          </p>
          <p className="mt-2 text-sm text-red-200/80">
            {this.state.error?.message ?? 'No se pudieron cargar las analíticas.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-200 transition hover:bg-red-500/20"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/*  Suspense Fallback                                                         */
/* -------------------------------------------------------------------------- */

function AnalyticsSkeleton(): ReactNode {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-6 animate-pulse"
    >
      <div className="h-6 w-40 rounded-full bg-white/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-28 rounded-2xl bg-white/5" />
        <div className="h-28 rounded-2xl bg-white/5" />
        <div className="h-28 rounded-2xl bg-white/5" />
      </div>
      <div className="h-64 rounded-2xl bg-white/5" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ArtistAnalyticsPage(): ReactNode {
  const artist = SEED_ARTISTS[0]; // Edwin Agudelo

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            DSPs &amp; Streams
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Analytics OS
          </span>
        </div>

        <AnalyticsErrorBoundary>
          <Suspense fallback={<AnalyticsSkeleton />}>
            <ArtistAnalytics analytics={artist.analytics} />
          </Suspense>
        </AnalyticsErrorBoundary>
      </div>
    </main>
  );
}