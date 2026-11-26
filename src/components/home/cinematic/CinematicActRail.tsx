'use client';

import React, { useEffect, useRef } from 'react';
import type { CinematicActIndex, CinematicScene, CinematicSignalBus } from '@/types/cinematic-hero';
import { clamp01 } from './cinematicMath';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * RAIL DE ACTOS + HAIRLINE DE PROGRESO
 * ════════════════════════════════════════════════════════════════════════════
 * La barra de progreso es un hairline de 1 px escalado con `scaleX` (capas
 * compuestas, cero layout thrash; la anchura NUNCA se anima — INV-18).
 * Los 4 botones numerados saltan al acto con scroll suave (teclado accesible).
 * ════════════════════════════════════════════════════════════════════════════
 */

interface CinematicActRailProps {
  readonly bus: CinematicSignalBus;
  readonly scenes: readonly CinematicScene[];
  readonly activeAct: CinematicActIndex;
  readonly onJump: (index: CinematicActIndex) => void;
}

export function CinematicActRail({
  bus,
  scenes,
  activeAct,
  onJump,
}: CinematicActRailProps): React.JSX.Element {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = bus.subscribe((signal) => {
      if (!barRef.current) return;
      barRef.current.style.transform = `scaleX(${clamp01(signal.progress).toFixed(4)})`;
    });
    return unsubscribe;
  }, [bus]);

  return (
    <>
      {/* Selector vertical de actos: capa compuesta, sin colisión con docks */}
      <nav
        aria-label="Actos del hero"
        className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 sm:right-5"
      >
        {scenes.map((scene, index) => {
          const actIndex = index as CinematicActIndex;
          const isActive = activeAct === actIndex;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onJump(actIndex)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Ir al acto ${scene.index}: ${scene.claim}`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border font-mono text-[10px] font-semibold tracking-[0.12em] transition-colors duration-200 ${
                isActive
                  ? 'border-[#ecb613]/70 bg-[#ecb613]/[0.16] text-[#f5d97a]'
                  : 'border-white/10 bg-black/35 text-white/45 hover:border-white/30 hover:text-white/80'
              }`}
            >
              {String(scene.index).padStart(2, '0')}
            </button>
          );
        })}
      </nav>

      {/* Hairline de progreso global del hero (scaleX, nunca width) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px w-full bg-white/10"
        aria-hidden="true"
      >
        <div
          ref={barRef}
          className="h-px w-full origin-left bg-[#ecb613] will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </>
  );
}