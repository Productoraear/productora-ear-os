'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { ArtistGallery } from '@/app/components/artists/ArtistGallery';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class MediaErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ArtistMediaPage] ErrorBoundary caught:', error, errorInfo);
    }
  }

  private handleRetry = (): void => {
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
            Error al cargar la galería
          </p>
          <p className="text-sm text-white/60 font-mono break-words">
            {this.state.error?.message ?? 'Error desconocido'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
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

function GallerySkeleton(): ReactNode {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function ArtistMediaPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Galería Media
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Audiovisual Assets
          </span>
        </div>

        <MediaErrorBoundary>
          <Suspense fallback={<GallerySkeleton />}>
            <ArtistGallery />
          </Suspense>
        </MediaErrorBoundary>
      </div>
    </main>
  );
}