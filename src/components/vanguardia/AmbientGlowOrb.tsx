import React from 'react';
import { getVanguardiaTheme } from './vanguardia-theme';
import type { VanguardiaVariant } from './vanguardia-theme';

export type OrbPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface AmbientGlowOrbProps {
  variant?: VanguardiaVariant;
  position?: OrbPosition;
  /** Diametro en px (geometria fija, cero layout shift). */
  size?: number;
  /** Opacidad del nucleo, 0 a 1. */
  intensity?: number;
  className?: string;
}

function positionStyle(position: OrbPosition, size: number): React.CSSProperties {
  const offset = -Math.round(size / 2);
  switch (position) {
    case 'top-left':
      return { top: offset, left: offset };
    case 'top-right':
      return { top: offset, right: offset };
    case 'bottom-left':
      return { bottom: offset, left: offset };
    case 'bottom-right':
      return { bottom: offset, right: offset };
    case 'center':
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
}

/**
 * Iluminacion difusa por CSS puro: un unico gradiente radial estatico.
 * Sin filter:blur, sin animacion, sin canvas ni WebGL: no genera trabajo de GPU continuo en movil.
 * El contenedor padre debe ser `relative` (y normalmente `overflow-hidden`).
 */
export default function AmbientGlowOrb({
  variant = 'oro',
  position = 'top-right',
  size = 320,
  intensity = 0.28,
  className,
}: AmbientGlowOrbProps) {
  const theme = getVanguardiaTheme(variant);
  const core = Math.min(1, Math.max(0, intensity));

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, rgba(${theme.accentRgb},${core}) 0%, rgba(${theme.accentRgb},${(core * 0.35).toFixed(3)}) 38%, rgba(${theme.accentRgb},0) 70%)`,
        ...positionStyle(position, size),
      }}
    />
  );
}
