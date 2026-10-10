'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { ArtistBioEditor } from '@/app/components/artists/ArtistBioEditor';
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

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

class ArtistProfileErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ArtistProfileErrorBoundary]', error, errorInfo);
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
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" aria-hidden="true" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-red-300">
              Error al cargar el perfil
            </h2>
          </div>
          <p className="text-xs text-white/50 font-mono leading-relaxed">
            {this.state.error?.message ?? 'Error desconocido en el módulo de identidad.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 transition-colors"
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

function ArtistProfileSkeleton(): ReactNode {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="h-6 w-32 rounded-full bg-white/5" />
        <div className="h-4 w-20 rounded bg-white/5" />
      </div>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 rounded bg-white/5" />
            <div className="h-3 w-1/4 rounded bg-white/5" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="h-3 w-5/6 rounded bg-white/5" />
          <div className="h-3 w-4/6 rounded bg-white/5" />
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] font-mono">
            Cargando identidad…
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner Content (data-fetching boundary)                             */
/* ------------------------------------------------------------------ */

function ArtistProfileContent(): ReactNode {
  const artist = SEED_ARTISTS[0]; // Edwin Agudelo

  if (!artist) {
    throw new Error('No se encontró el perfil del artista en el seed.');
  }

  return (
    <ArtistBioEditor
      artist={artist}
      canEdit={true}
      onSave={() => {
        if (typeof window !== 'undefined') {
          window.alert('Biografía guardada en Firestore');
        }
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ArtistProfilePage(): ReactNode {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Perfil Artístico
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Identity OS
          </span>
          <ShieldCheck
            className="w-3.5 h-3.5 text-[#ecb613]/60 ml-auto"
            aria-hidden="true"
          />
        </div>

        <ArtistProfileErrorBoundary>
          <Suspense fallback={<ArtistProfileSkeleton />}>
            <ArtistProfileContent />
          </Suspense>
        </ArtistProfileErrorBoundary>
      </div>
    </main>
  );
}