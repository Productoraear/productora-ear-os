"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-[#030305] text-white min-h-screen flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full border border-red-500/20 bg-black/60 backdrop-blur-xl rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 font-mono text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Error Crítico del Sistema
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Se ha producido una intercepción inesperada en el núcleo del sistema S-Class.
          </p>
          {error?.digest && (
            <p className="font-mono text-xs text-gray-500 bg-black/40 py-2 px-3 rounded-lg border border-white/5 overflow-hidden text-ellipsis">
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold tracking-wide hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            Reintentar Ejecución
          </button>
        </div>
      </body>
    </html>
  );
}
