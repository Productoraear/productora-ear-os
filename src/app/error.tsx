'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

/**
 * 🛡️ ERROR BOUNDARY DE RESILIENCIA S-CLASS (EAR OS V2)
 * Intercepta y aisla cualquier excepción de servidor en tiempo de ejecución, erradicando los errores 5xx en Search Console.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Telemetría silenciosa de resiliencia
    console.error('🛡️ [S-Class Resilience] Interceptada fluctuación en nodo servidor:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Halo de fondo atmosférico */}
      <div className="absolute w-[500px] h-[500px] bg-[#ecb613]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 border border-[#ecb613]/30 bg-[#09090d] p-8 md:p-12 rounded-[2.5rem] max-w-lg shadow-[0_20px_70px_rgba(0,0,0,0.9)] space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] mx-auto">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#ecb613]">
            S-Class Resilience Shield
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase text-white font-syne">
            Fluctuación Técnica Interceptada
          </h2>
          <p className="text-xs text-white/60 leading-relaxed">
            El nodo del servidor ha contenido la solicitud para proteger la integridad del sistema y evitar interrupciones de servicio.
          </p>
        </div>

        {error?.digest && (
          <div className="bg-black/60 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] font-mono text-white/40">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCw size={14} />
            <span>Reintentar Nodo</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
