'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MoveDown } from 'lucide-react';
import { CINEMATIC_SCENES } from './cinematic/cinematicScenes';
import { CinematicActRail } from './cinematic/CinematicActRail';
import { CinematicAudioToggle } from './cinematic/CinematicAudioToggle';
import { CinematicCopyStage } from './cinematic/CinematicCopyStage';
import { CinematicKeyframeStage } from './cinematic/CinematicKeyframeStage';
import { useCinematicTimeline } from './cinematic/useCinematicTimeline';

/**
 * Motor Canvas 2D cargado SÓLO en cliente (`ssr: false`). El `loading` es un
 * div con la geometría exacta del stage: el hueco ya está reservado por el
 * contenedor, por lo que el montaje no produce CLS (INV-11 · G-7).
 */
const CinematicCanvasStage = dynamic(
  () =>
    import('./cinematic/CinematicCanvasStage').then(
      (module) => module.CinematicCanvasStage
    ),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#030305]" aria-hidden="true" />,
  }
);

/**
 * ════════════════════════════════════════════════════════════════════════════
 * HERO CINEMATOGRÁFICO "TASTE ENGINE VELOCITY" · 4 ACTOS
 * ════════════════════════════════════════════════════════════════════════════
 * Escritorio · scrubbing de scroll sobre un track de 300 dvh con stage sticky
 * de 100 dvh y motor Canvas 2D (Web Worker + OffscreenCanvas).
 * Móvil / prefers-reduced-motion · keyframes WebP con cross-fade y autoplay
 * ambiental, sin canvas ni animación de cámara (ahorro de batería y datos).
 *
 * Geometría inmutable: el stage mide 100 dvh desde el primer byte de HTML, el
 * canvas y los paneles son capas absolutas y el copy sólo muta `opacity` /
 * `translate3d` ⇒ CLS 0.000 (INV-11, INV-18, G-7).
 * ════════════════════════════════════════════════════════════════════════════
 */
export function CinematicHeroSpot(): React.JSX.Element {
  const { trackRef, bus, engineMode, activeAct, reducedMotion, compact, hydrated, jumpToAct } =
    useCinematicTimeline();

  return (
    <section
      className="relative w-full min-h-[100dvh] overflow-x-clip bg-[#030305] isolate"
      aria-label="Hero cinematográfico de las cuatro verticales de Productora EAR"
    >
      <div ref={trackRef} className="relative h-[100dvh] w-full md:h-[300dvh]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#030305]">
          {/* Capa base: keyframes WebP (siempre presente, también como poster) */}
          <CinematicKeyframeStage bus={bus} scenes={CINEMATIC_SCENES} />

          {/* Capa de motor: canvas sólo tras hidratar y en escritorio sin AA */}
          {hydrated && engineMode === 'canvas-2d' && (
            <div
              className="absolute inset-0 z-0"
              data-cinematic-engine="canvas-2d"
              aria-hidden="true"
            >
              <CinematicCanvasStage bus={bus} scenes={CINEMATIC_SCENES} />
            </div>
          )}

          {/* Scrim de legibilidad: negro OLED, nunca color de acento */}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_18%_86%,rgba(3,3,5,0.94)_0%,rgba(3,3,5,0.62)_34%,rgba(3,3,5,0)_66%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-[#030305]/85 via-[#030305]/25 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58%] bg-gradient-to-t from-[#030305]/95 via-[#030305]/55 to-transparent"
            aria-hidden="true"
          />

          {/* Capa tipográfica de los 4 actos */}
          <CinematicCopyStage bus={bus} scenes={CINEMATIC_SCENES} />

          {/* Controles discretos: audio inmersivo + pista de scroll */}
          <div className="absolute bottom-24 right-6 z-30 flex flex-col items-end gap-3 sm:bottom-28 sm:right-10 lg:right-16">
            {!compact && !reducedMotion && (
              <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40 md:inline-flex">
                Scroll
                <MoveDown size={12} strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}
            <CinematicAudioToggle />
          </div>

          {/* Rail de actos + hairline de progreso */}
          <CinematicActRail
            bus={bus}
            scenes={CINEMATIC_SCENES}
            activeAct={activeAct}
            onJump={jumpToAct}
          />
        </div>
      </div>
    </section>
  );
}

export default CinematicHeroSpot;