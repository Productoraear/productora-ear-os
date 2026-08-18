'use client';

import React from 'react';

/**
 * 🛡️ ROOT GLOBAL ERROR BOUNDARY (NEXT.JS APP ROUTER S-CLASS)
 * Atrapa cualquier excepción no controlada a nivel de Root Layout.
 */
export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="border border-[#ecb613]/30 bg-[#09090d] p-8 md:p-12 rounded-[2.5rem] max-w-lg shadow-[0_20px_70px_rgba(0,0,0,0.9)] space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#ecb613]">
              Productora EAR • Root Resilience
            </span>
            <h2 className="text-2xl font-black uppercase text-white">
              Sistema Protegido
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Se ha aislado una excepción en el núcleo del servidor para salvaguardar la sesión del usuario.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all"
          >
            Re-establecer Conexión
          </button>
        </div>
      </body>
    </html>
  );
}
