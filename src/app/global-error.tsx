'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#030305] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="relative z-10 w-full max-w-lg space-y-6 rounded-[2.5rem] border border-[#ecb613]/30 bg-[#09090d] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)] md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]">
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
              S-Class Resilience Shield
            </span>
            <h2 className="text-2xl font-black uppercase text-white md:text-3xl">
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
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              <span>Reintentar Nodo</span>
            </button>

            <a
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Inicio</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
