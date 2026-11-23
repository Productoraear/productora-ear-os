import React from 'react';

/** Tonos semánticos del SSOT visual: dinero, bloqueo de fecha, acústica, brasa. */
export type AtmosphereTone = 'oro' | 'rubi' | 'cian' | 'brasa';

const TONE_RGB: Readonly<Record<AtmosphereTone, string>> = {
  oro: '236,182,19', // #ecb613 Oro Mate · dinero
  rubi: '255,43,68', // #FF2B44 · bloqueo de fecha
  cian: '0,229,255', // #00E5FF · acústica
  brasa: '255,120,40', // parrilla de carbón
};

export interface AtmosphericGlowLayersProps {
  tone: AtmosphereTone;
  className?: string;
}

/**
 * Capa 1 · Atmósfera. Solo gradientes y opacidad (GPU). La "refracción térmica" es una
 * aproximación con un halo que pulsa en opacidad; no es refracción óptica real.
 */
export default function AtmosphericGlowLayers({ tone, className }: AtmosphericGlowLayersProps): React.JSX.Element {
  const rgb = TONE_RGB[tone];
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[5] overflow-hidden ${className ?? ''}`}>
      <div
        className="absolute inset-x-[15%] -top-1/4 h-[120%] blur-3xl motion-safe:animate-pulse"
        style={{ background: `radial-gradient(ellipse at top, rgba(${rgb},0.18), transparent 70%)` }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: `linear-gradient(to top, rgba(${rgb},0.12), transparent)` }}
      />
    </div>
  );
}
