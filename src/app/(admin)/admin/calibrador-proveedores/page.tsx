import React, { Suspense } from 'react';
import { Metadata } from 'next';
import AdminCalibratorProxy from '@/components/admin/AdminCalibratorProxy';

export const metadata: Metadata = {
    title: 'Calibrador de Proveedores | EAR OS Admin',
    description: 'Gestión delegada de calibradores de captación para fincas y proveedores.'
};

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class CalibratorErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.error('[AdminCalibratorProxyPage] ErrorBoundary caught:', error, errorInfo);
        }
    }

    private handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="rounded-3xl bg-[#09090d]/80 border border-red-500/30 p-6 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[10px] font-mono text-red-400 font-bold uppercase">
                        ⚠️ Error en Calibrador
                    </div>
                    <p className="text-sm text-zinc-300 font-light">
                        No se pudo cargar el calibrador de proveedores. Intenta recargar el módulo.
                    </p>
                    {this.state.error && (
                        <pre className="text-[10px] font-mono text-zinc-500 whitespace-pre-wrap break-all">
                            {this.state.error.message}
                        </pre>
                    )}
                    <button
                        type="button"
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[11px] font-mono text-[#ecb613] font-bold uppercase hover:bg-[#ecb613]/20 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

function CalibratorSkeleton(): React.ReactElement {
    return (
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 space-y-4 animate-pulse">
            <div className="h-4 w-40 bg-white/5 rounded-full" />
            <div className="h-3 w-64 bg-white/5 rounded-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="h-24 bg-white/5 rounded-2xl" />
                <div className="h-24 bg-white/5 rounded-2xl" />
                <div className="h-24 bg-white/5 rounded-2xl" />
            </div>
            <div className="h-3 w-52 bg-white/5 rounded-full" />
        </div>
    );
}

export default function AdminCalibratorProxyPage(): React.ReactElement {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="border-b border-white/10 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[10px] font-mono text-[#ecb613] font-bold uppercase mb-3">
                    🎛️ Gestión Delegada · Motor Neural Bilateral
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
                    Calibradores de Proveedores
                </h1>
                <p className="text-sm text-zinc-400 font-light mt-2 max-w-2xl">
                    Configura por delegación el calibrador de 100 dimensiones de las fincas que aún no lo
                    han afinado. Cada finca nueva arranca con un preset inteligente por tipología.
                </p>
            </header>

            <CalibratorErrorBoundary>
                <Suspense fallback={<CalibratorSkeleton />}>
                    <AdminCalibratorProxy />
                </Suspense>
            </CalibratorErrorBoundary>

            {/* Nota de gobernanza */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-4 text-[11px] font-mono text-zinc-500 leading-relaxed">
                ⚠️ <span className="text-zinc-300 font-bold">Preconfiguración inteligente:</span> toda finca
                nueva se autoconfigura con el preset más cercano a su tipología (Palacio, Cortijo, Masía…).
                El admin puede ajustarlo manualmente o delegar su aprobación final al proveedor.
            </div>
        </div>
    );
}