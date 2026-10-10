'use client';

import React, { useState, Suspense, Component, ErrorInfo, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface JourneyItem {
  readonly id: number;
  readonly name: string;
}

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/* ------------------------------------------------------------------ */
/*  Error Boundary                                                     */
/* ------------------------------------------------------------------ */

class JourneyErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[JourneyHeatmap] ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          className="bg-[#030305] text-white p-8 min-h-screen flex flex-col items-center justify-center gap-4"
        >
          <h2 className="text-xl font-bold font-syne tracking-tight text-[#FF2B44]">
            Algo salió mal en Journey Heatmap
          </h2>
          <p className="text-sm text-white/70 max-w-md text-center">
            {this.state.error?.message ?? 'Error desconocido'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="bg-[#ecb613] text-[#030305] font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity"
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
/*  Loading Fallback                                                   */
/* ------------------------------------------------------------------ */

const JourneyLoadingFallback = (): React.JSX.Element => (
  <div
    role="status"
    aria-live="polite"
    className="bg-[#030305] text-white p-8 min-h-screen flex items-center justify-center"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-[#ecb613] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-white/60 font-syne tracking-tight">
        Cargando Journey Heatmap…
      </span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Heatmap Content                                                    */
/* ------------------------------------------------------------------ */

const JourneyHeatmapContent = (): React.JSX.Element => {
  const router = useRouter();
  const [draggedItem, setDraggedItem] = useState<JourneyItem | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, item: JourneyItem): void => {
      e.dataTransfer.setData('text/plain', JSON.stringify(item));
      e.dataTransfer.effectAllowed = 'move';
      setDraggedItem(item);
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, target: JourneyItem): void => {
      e.preventDefault();
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (!raw) return;
        const data = JSON.parse(raw) as JourneyItem;
        // Implement logic to reassign the dragged item to the target
        // eslint-disable-next-line no-console
        console.log('Dropped', data, 'on', target);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[JourneyHeatmap] Failed to parse drop payload:', err);
      } finally {
        setDraggedItem(null);
      }
    },
    [],
  );

  const handleDragEnd = useCallback((): void => {
    setDraggedItem(null);
  }, []);

  const sourceItem: JourneyItem = { id: 1, name: 'Item 1' };
  const targetItem: JourneyItem = { id: 2, name: 'Target 1' };

  return (
    <div className="bg-[#030305] text-white p-8 min-h-screen">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-syne tracking-tight text-white">
          Journey Heatmap
        </h1>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="text-xs uppercase tracking-widest text-white/50 hover:text-[#ecb613] transition-colors"
        >
          Refresh
        </button>
      </header>

      <div className="flex flex-wrap gap-4">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, sourceItem)}
          onDragEnd={handleDragEnd}
          aria-grabbed={draggedItem?.id === sourceItem.id}
          className="bg-[#ecb613] text-[#030305] font-semibold p-4 m-2 rounded cursor-grab active:cursor-grabbing select-none"
        >
          {sourceItem.name}
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, targetItem)}
          className="bg-[#FF2B44] text-white font-semibold p-4 m-2 rounded min-w-[120px] min-h-[56px] flex items-center justify-center"
        >
          {targetItem.name}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const JourneyHeatmapPage = (): React.JSX.Element => {
  return (
    <JourneyErrorBoundary>
      <Suspense fallback={<JourneyLoadingFallback />}>
        <JourneyHeatmapContent />
      </Suspense>
    </JourneyErrorBoundary>
  );
};

export default JourneyHeatmapPage;
export { JourneyErrorBoundary, JourneyLoadingFallback, JourneyHeatmapContent };
export type { JourneyItem, ErrorBoundaryProps, ErrorBoundaryState };