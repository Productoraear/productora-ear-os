'use client';

import React, { useEffect, useRef } from 'react';

export type SpatialDomain = 'gastronomia' | 'musica' | 'b2g';

export interface DomainParallaxStageProps {
  domain: SpatialDomain;
}

const LERP = 0.1;
const SETTLE_EPSILON = 0.05;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Capa 2 · Activos geométricos con parallax inercial (lerp sobre scroll).
 * Solo `transform` (translate3d). Las siluetas son ilustrativas: no son planos ni medidas reales.
 */
export default function DomainParallaxStage({ domain }: DomainParallaxStageProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return undefined;

    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'));
    let top = root.getBoundingClientRect().top + window.scrollY;
    let target = 0;
    let current = 0;
    let frame = 0;
    let running = false;

    const tick = (): void => {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < SETTLE_EPSILON) current = target;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? 0);
        layer.style.transform = `translate3d(0, ${(current * depth).toFixed(2)}px, 0)`;
      }
      if (current === target) {
        running = false;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = (): void => {
      target = window.scrollY - top;
      if (!running) {
        running = true;
        frame = window.requestAnimationFrame(tick);
      }
    };
    const onResize = (): void => {
      top = root.getBoundingClientRect().top + window.scrollY;
      onScroll();
    };

    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [domain]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[20] overflow-hidden"
    >
      <style>{`@media (prefers-reduced-motion: no-preference){.ear-string-vibrate{animation:ear-string-vibrate 2.4s ease-in-out infinite;will-change:transform}}@keyframes ear-string-vibrate{0%,100%{transform:translateX(0)}50%{transform:translateX(0.6px)}}`}</style>

      {domain === 'gastronomia' && (
        <div data-depth="0.12" className="absolute right-[6%] top-[18%] w-[min(42vw,320px)]">
          <svg viewBox="0 0 200 160" className="h-auto w-full" fill="none" stroke="#ecb613" strokeOpacity="0.35" strokeWidth="1.2">
            <path d="M20 150 V80 L100 20 L180 80 V150 Z" />
            <path d="M84 150 V110 H116 V150" />
            <rect x="34" y="96" width="30" height="24" />
            <rect x="136" y="96" width="30" height="24" />
          </svg>
        </div>
      )}

      {domain === 'musica' && (
        <div data-depth="0.25" className="absolute left-[8%] top-[20%] h-[60%] w-[min(40vw,280px)]">
          <div className="ear-string-vibrate h-full w-full">
            <svg viewBox="0 0 120 240" preserveAspectRatio="none" className="h-full w-full" fill="none" stroke="#ecb613" strokeOpacity="0.4" strokeWidth="0.8">
              <line x1="20" y1="0" x2="20" y2="240" />
              <line x1="40" y1="0" x2="40" y2="240" />
              <line x1="60" y1="0" x2="60" y2="240" />
              <line x1="80" y1="0" x2="80" y2="240" />
              <line x1="100" y1="0" x2="100" y2="240" />
            </svg>
          </div>
        </div>
      )}

      {domain === 'b2g' && (
        <div data-depth="0.4" className="absolute right-[8%] top-[12%] h-[70%] w-[min(22vw,160px)]">
          <svg viewBox="0 0 120 240" className="h-full w-full" fill="none" stroke="#00E5FF" strokeOpacity="0.45" strokeWidth="1">
            <rect x="20" y="10" width="80" height="30" />
            <rect x="20" y="50" width="80" height="30" />
            <rect x="20" y="90" width="80" height="30" />
            <rect x="20" y="130" width="80" height="30" />
            <rect x="20" y="170" width="80" height="30" />
            <rect x="20" y="210" width="80" height="20" />
          </svg>
        </div>
      )}
    </div>
  );
}
