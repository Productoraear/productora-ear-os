'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { ArtistTimeline } from '@/app/components/artists/ArtistTimeline';
import { ArtistBookingFlow } from '@/app/components/artists/ArtistBookingFlow';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class BookingErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
        `[BookingErrorBoundary${this.props.label ? `:${this.props.label}` : ''}]`,
        error,
        errorInfo
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
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
            Error en {this.props.label ?? 'módulo'}
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

function BookingSkeleton({ label }: { label: string }): React.JSX.Element {
  return (
    <div
      className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4 animate-pulse"
      aria-busy="true"
      aria-label={`Cargando ${label}`}
    >
      <div className="h-3 w-32 rounded-full bg-white/10" />
      <div className="h-3 w-48 rounded-full bg-white/5" />
      <div className="h-24 w-full rounded-xl bg-white/5" />
    </div>
  );
}

export default function ArtistBookingsPage(): React.JSX.Element {
  const artist = SEED_ARTISTS[0]; // Edwin Agudelo

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Reservas &amp; Directos
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Booking OS
          </span>
        </div>

        <BookingErrorBoundary label="Booking Flow">
          <Suspense fallback={<BookingSkeleton label="Booking Flow" />}>
            <ArtistBookingFlow />
          </Suspense>
        </BookingErrorBoundary>

        <BookingErrorBoundary label="Timeline">
          <Suspense fallback={<BookingSkeleton label="Timeline" />}>
            <ArtistTimeline events={artist.calendar} />
          </Suspense>
        </BookingErrorBoundary>
      </div>
    </main>
  );
}