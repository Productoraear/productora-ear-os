'use client';

import React, { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SettingsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ArtistSettingsPage] ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="bg-[#0b0b0b] border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-red-400" aria-hidden="true" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white font-syne">
              Error en Configuración
            </h3>
          </div>
          <p className="text-[11px] text-white/50 uppercase tracking-widest font-bold">
            No se pudo cargar el módulo de ajustes. Intenta nuevamente.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 rounded-full bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#ecb613]/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SettingsSkeleton(): ReactNode {
  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-6 animate-pulse">
      <div className="h-6 w-64 bg-white/5 rounded-full" />
      <div className="space-y-4">
        <div className="h-20 w-full bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

function SecuritySettingsPanel(): ReactNode {
  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-6">
      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">
        Configuración de Seguridad
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl">
          <div>
            <span className="text-xs font-black uppercase text-white block">
              Doble Verificación MFA
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Código PIN 7777 activo
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
            ACTIVO
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ArtistSettingsPage(): ReactNode {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Ajustes
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Settings OS
          </span>
          <SettingsIcon className="w-4 h-4 text-white/20" aria-hidden="true" />
        </div>

        <SettingsErrorBoundary>
          <Suspense fallback={<SettingsSkeleton />}>
            <SecuritySettingsPanel />
          </Suspense>
        </SettingsErrorBoundary>
      </div>
    </main>
  );
}