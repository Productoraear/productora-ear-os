"use client";

import { Component } from 'react';
import type { ErrorInfo, ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

function RadarErrorFallback({ error }: { error: Error }): ReactElement {
    return (
        <main className="min-h-screen bg-[#030305] text-[#FFFFFF] p-6 font-sans flex items-center justify-center">
            <div className="max-w-lg w-full rounded-3xl bg-[#09090d]/80 border border-[#FF455B]/30 p-8 text-center">
                <AlertTriangle className="w-10 h-10 text-[#FF455B] mx-auto mb-4" />
                <h1 className="text-xl font-bold text-white font-syne mb-2">
                    Fallo en el Radar Cognitivo
                </h1>
                <p className="text-sm text-zinc-400 mb-4">
                    No se pudo cargar la matriz forense de cobertura histórica.
                </p>
                <pre className="text-[11px] font-mono text-[#FF455B]/80 bg-black/40 border border-[#FF455B]/20 rounded-xl p-3 overflow-x-auto text-left">
                    {error.message}
                </pre>
                <Link
                    href="/"
                    className="inline-block mt-6 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono transition-colors"
                >
                    Volver a la Home
                </Link>
            </div>
        </main>
    );
}

interface RadarErrorBoundaryState {
    error: Error | null;
}

class RadarErrorBoundary extends Component<
    { children: ReactNode },
    RadarErrorBoundaryState
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error): RadarErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('RadarErrorBoundary caught:', error, info);
    }

    render(): ReactNode {
        if (this.state.error) {
            return <RadarErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

export default RadarErrorBoundary;