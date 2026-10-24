'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Hook de odómetro a 60 fps (requestAnimationFrame). Anima el valor desde el
 * número actual hasta el objetivo con easeOutCubic, de modo que el porcentaje
 * de afinidad "rueda" dígito a dígito en lugar de saltar de golpe al hacer Swipe
 * o al cambiar pax/km en tiempo real.
 */
function useOdometerValue(target: number, durationMs = 650): number {
  const [display, setDisplay] = useState<number>(target);
  const currentRef = useRef<number>(target);

  useEffect(() => {
    if (currentRef.current === target) return;

    const from = currentRef.current;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // easeOutCubic: arranque rápido, aterrizaje sedoso.
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setDisplay(next);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return display;
}

/**
 * Medidor de afinidad con efecto odómetro. Cuando el valor supera el 95%,
 * tiñe el aura (borde + resplandor + tipografía) de dorado S-Class (#ecb613).
 */
export default function AstraMatchOdometer({
  value,
  isElite,
  className = '',
}: {
  value: number;
  isElite: boolean;
  className?: string;
}) {
  const animated = useOdometerValue(value);
  const display = Math.round(animated);

  return (
    <div
      className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md transition-all duration-300 ease-out ${className}`}
      style={{
        backgroundColor: isElite ? 'rgba(236,182,19,0.14)' : 'rgba(255,255,255,0.05)',
        borderColor: isElite ? 'rgba(236,182,19,0.55)' : 'rgba(255,255,255,0.1)',
        boxShadow: isElite
          ? '0 0 22px rgba(236,182,19,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
          : undefined,
      }}
      aria-live="polite"
      aria-label={`Afinidad ${display}%`}
    >
      <span
        className="relative w-1.5 h-1.5 rounded-full transition-colors duration-300"
        style={{ backgroundColor: isElite ? '#ecb613' : 'rgba(255,255,255,0.4)' }}
      />
      <span
        className="relative text-[10px] font-mono font-bold tabular-nums tracking-tight transition-colors duration-300"
        style={{ color: isElite ? '#f5c538' : '#ecb613' }}
      >
        {display}% AFINIDAD
      </span>
    </div>
  );
}
