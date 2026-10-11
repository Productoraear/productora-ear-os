"use client";

import { Component, Suspense } from 'react';
import type { ErrorInfo, ReactElement, ReactNode } from 'react';
import OperationalTrainingManual from '@/components/admin/OperationalTrainingManual';

function ManualSkeleton(): ReactElement {
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

interface ManualErrorBoundaryState {
    hasError: boolean;
    message: string | null;
}

class ManualErrorBoundary extends Component<
    { children: ReactNode },
    ManualErrorBoundaryState
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, message: null };
    }

    static getDerivedStateFromError(error: Error): ManualErrorBoundaryState {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        if (typeof console !== 'undefined') {
            console.error('[ManualOperacionesPage] ErrorBoundary caught:', error, info);
        }
    }

    private handleReset = (): void => {
        this.setState({ hasError: false, message: null });
    };

    render(): ReactNode {
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

export default function ManualOperationsBoundary(): ReactElement {
    return (
        <ManualErrorBoundary>
            <Suspense fallback={<ManualSkeleton />}>
                <OperationalTrainingManual />
            </Suspense>
        </ManualErrorBoundary>
    );
}