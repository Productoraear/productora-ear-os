'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { ArtistBio } from '@/app/components/artists/ArtistBio';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ArtistBioErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ArtistBioErrorBoundary]', error, errorInfo);
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
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
            Error al cargar biografía
          </p>
          <p className="text-sm text-white/60 font-mono break-words">
            {this.state.error?.message ?? 'Error desconocido'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 hover:bg-[#ecb613]/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ArtistBioSkeleton(): ReactNode {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-6 animate-pulse"
    >
      <div className="h-8 w-2/3 rounded-lg bg-white/5" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-11/12 rounded bg-white/5" />
        <div className="h-4 w-10/12 rounded bg-white/5" />
        <div className="h-4 w-9/12 rounded bg-white/5" />
      </div>
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-10/12 rounded bg-white/5" />
        <div className="h-4 w-8/12 rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function ArtistBioPage(): ReactNode {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Biografía
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Credentials OS
          </span>
        </div>

        <ArtistBioErrorBoundary>
          <Suspense fallback={<ArtistBioSkeleton />}>
            <ArtistBio />
          </Suspense>
        </ArtistBioErrorBoundary>
      </div>
    </main>
  );
}