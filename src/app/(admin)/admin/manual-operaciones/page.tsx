import Link from 'next/link';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import OperationalTrainingManual from '@/components/admin/OperationalTrainingManual';

export const metadata: Metadata = {
  title: 'Manual de Operaciones EAR OS 2030-2050 | Omni-Cockpit',
  description: 'Doctrina de inducción y protocolos operativos militares para agentes, marketing, rodaje 4K y CEO.'
};

function ManualSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="h-8 w-2/3 rounded bg-zinc-900/60" />
      <div className="h-4 w-1/2 rounded bg-zinc-900/40" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-xl border border-zinc-900/60 bg-[#030305]"
          />
        ))}
      </div>
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

class ManualErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ManualOperacionesPage] ErrorBoundary caught:', error, info);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, message: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-xl border border-red-900/60 bg-[#030305] p-6 font-mono text-sm text-red-300"
        >
          <p className="mb-2 text-base font-semibold text-red-400">
            Error al cargar el Manual de Operaciones
          </p>
          <p className="mb-4 text-zinc-400">
            {this.state.message ?? 'Fallo desconocido en el módulo de entrenamiento.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-md border border-[#ecb613]/60 px-3 py-1.5 text-xs font-semibold text-[#ecb613] transition-colors hover:bg-[#ecb613]/10"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ManualOperacionesPage(): React.ReactElement {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>Gobernanza</span>
        <span>/</span>
        <span className="text-[#ecb613]">Manual de Operaciones 360</span>
      </div>

      <ManualErrorBoundary>
        <Suspense fallback={<ManualSkeleton />}>
          <OperationalTrainingManual />
        </Suspense>
      </ManualErrorBoundary>
    </div>
  );
}