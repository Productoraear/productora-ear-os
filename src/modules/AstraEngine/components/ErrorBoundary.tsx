import React from "react";
import * as Sentry from "@sentry/react";
import { Icon } from "./Icon";

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId?: string;
  errorInfo?: string;
}

// Fixed inheritance by using React.Component directly to ensure setState and props are inherited and correctly recognized by the type checker.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state directly as a class property which is standard for modern React classes
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(_: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, { extra: errorInfo as any });
    // Fix: Accessing setState from the inherited React.Component class.
    this.setState({ 
        errorId: eventId,
        errorInfo: error.message
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleHardReset = () => {
      // Clear all storage to remove corrupted state
      localStorage.clear();
      sessionStorage.clear();
      // Force reload ignoring cache
      window.location.href = '/';
  };

  public render() {
    // Fix: Accessing state and props inherited from React.Component.
    const { hasError, errorId, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Icon className="w-12 h-12 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12V8.25Z" /></Icon>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Error Crítico del Sistema</h1>
            <p className="text-zinc-400 mb-8 max-w-md">El núcleo de Astra ha encontrado una anomalía inesperada. Nuestros ingenieros han sido notificados.</p>
            
            {errorId && (
                <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 mb-8 font-mono text-xs text-zinc-500 max-w-lg overflow-hidden text-left">
                    <p>ID del Incidente: <span className="text-blue-400">{errorId}</span></p>
                    {errorInfo && <p className="mt-2 text-red-400 truncate">Error: {errorInfo}</p>}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors border border-zinc-700"
                >
                    Reintentar
                </button>
                <button
                    onClick={this.handleHardReset}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2 justify-center"
                >
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" /></Icon>
                    Restablecimiento de Fábrica
                </button>
            </div>
            <p className="mt-4 text-xs text-zinc-600">Usar "Restablecimiento de Fábrica" si el error persiste. Borrará datos locales.</p>
        </div>
      );
    }

    return children;
  }
}