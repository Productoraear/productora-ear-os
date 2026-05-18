'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PublicErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registra el error en sistemas de monitoreo externo si existe
    console.error('🚨 [PUBLIC_BOUNDARY_ERROR] Fallo crítico detectado:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center dark:bg-zinc-900 dark:border-zinc-800">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-red-900/30">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-white">Interrupción de Servicio</h2>
        <p className="text-gray-600 mb-8 dark:text-zinc-400">
          Ha ocurrido una anomalía inesperada al procesar su solicitud. El Escudo S-Class ha protegido su sesión.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-100"
          >
            Reintentar Operación
          </button>
          <Link
            href="/"
            className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
