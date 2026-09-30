'use client';

import { useEffect } from 'react';
import { Home, RefreshCw, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('🛡️ [S-Class Resilience] Interceptada fluctuación en nodo servidor:', error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030305] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ecb613]/5 blur-[160px]" />

      <div className="relative z-10 w-full max-w-lg space-y-6 rounded-[2.5rem] border border-[#ecb613]/30 bg-[#09090d] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)] md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]">
          <ShieldAlert size={32} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
            S-Class Resilience Shield
          </span>
          <h2 className="font-syne text-2xl font-black uppercase text-white md:text-3xl">
            Fluctuación Técnica Interceptada
          </h2>
          <p className="text-xs leading-relaxed text-white/60">
            El nodo del servidor ha contenido la solicitud para proteger la integridad del sistema y evitar interrupciones de servicio.
          </p>
        </div>

        {error?.digest ? (
          <div className="rounded-xl border border-white/5 bg-black/60 px-3 py-1.5 font-mono text-[10px] text-white/40">
            Digest: {error.digest}
          </div>
        ) : null}

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-6 py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg transition-all hover:bg-amber-400 sm:w-auto"
          >
            <RefreshCw size={14} aria-hidden="true" />
            <span>Reintentar Nodo</span>
          </button>

          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 sm:w-auto"
          >
            <Home size={14} aria-hidden="true" />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}