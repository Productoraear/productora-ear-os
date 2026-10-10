'use client';

import React, { Suspense, Component, type ErrorInfo, type ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*                              Error Boundary                                */
/* -------------------------------------------------------------------------- */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class JourneyHeatmapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
    // eslint-disable-next-line no-console
    console.error('[JourneyHeatmapErrorBoundary]', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-[#0a0507] p-8 text-center"
        >
          <h3 className="text-lg font-semibold text-red-400">
            Algo salió mal en Journey Heatmap
          </h3>
          <p className="max-w-md text-sm text-white/60">
            {this.state.error?.message ?? 'Error inesperado al renderizar el módulo.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-md border border-white/10 bg-[#050507] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0a0a0d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
/*                              Suspense Fallback                             */
/* -------------------------------------------------------------------------- */

const JourneyHeatmapSkeleton = (): React.JSX.Element => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex w-full flex-col gap-4"
    >
      <span className="sr-only">Cargando Journey Heatmap…</span>
      <div className="h-8 w-1/3 animate-pulse rounded-md bg-white/5" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-white/5" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-white/5" />
        <div className="h-24 animate-pulse rounded-lg bg-white/5" />
        <div className="h-24 animate-pulse rounded-lg bg-white/5" />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */

interface JourneyHeatmapLayoutProps {
  children: React.ReactNode;
}

const JourneyHeatmapLayout = ({ children }: JourneyHeatmapLayoutProps): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <header className="border-b border-white/5 bg-[#050507] p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </header>
      <main className="p-8">
        <JourneyHeatmapErrorBoundary>
          <Suspense fallback={<JourneyHeatmapSkeleton />}>{children}</Suspense>
        </JourneyHeatmapErrorBoundary>
      </main>
    </div>
  );
};

export default JourneyHeatmapLayout;
export { JourneyHeatmapErrorBoundary, JourneyHeatmapSkeleton };
export type { JourneyHeatmapLayoutProps, ErrorBoundaryProps, ErrorBoundaryState };