'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  CinematicActIndex,
  CinematicEngineMode,
  CinematicTimeline,
} from '@/types/cinematic-hero';
import {
  CINEMATIC_ACT_COUNT,
  createCinematicSignalBus,
  progressForAct,
  resolveAct,
} from './cinematicSignal';
import { clamp01 } from './cinematicMath';

/** Duración de cada acto en el autoplay ambiental (móvil / reduced-motion). */
const AUTOPLAY_ACT_MS = 8200;

/** Tope de delta por frame: si la pestaña vuelve del background no salta. */
const MAX_DELTA_MS = 64;

/**
 * ════════════════════════════════════════════════════════════════════════════
 * RELOJ DEL HERO CINEMÁTICO
 * ════════════════════════════════════════════════════════════════════════════
 * Dos relojes, un único bus:
 *  · Escritorio: scrubbing de scroll sobre el track de 300 dvh (sticky stage).
 *  · Móvil / prefers-reduced-motion: autoplay ambiental por keyframes WebP,
 *    sin animación de cámara y con parada cuando el hero sale del viewport.
 *
 * El progreso se publica por frame sin setState (sólo cambia `activeAct`,
 * 4 veces por recorrido) para mantener el INP dentro de presupuesto (INV-11).
 * ════════════════════════════════════════════════════════════════════════════
 */
export function useCinematicTimeline(): CinematicTimeline {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bus = useMemo(() => createCinematicSignalBus(), []);

  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [compact, setCompact] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [activeAct, setActiveAct] = useState<CinematicActIndex>(0);

  const activeActRef = useRef<CinematicActIndex>(0);
  const progressRef = useRef<number>(0);
  const autoplayElapsedRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(true);

  const engineMode: CinematicEngineMode =
    reducedMotion || compact ? 'keyframe' : 'canvas-2d';

  /* ── Preferencias del sistema y montaje diferido del motor ─────────────── */
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = window.matchMedia('(max-width: 767px)');

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setCompact(compactQuery.matches);
    };

    sync();
    setHydrated(true);

    motionQuery.addEventListener('change', sync);
    compactQuery.addEventListener('change', sync);

    return () => {
      motionQuery.removeEventListener('change', sync);
      compactQuery.removeEventListener('change', sync);
    };
  }, []);

  /* ── Reloj principal: un único requestAnimationFrame ───────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const autoplay = engineMode === 'keyframe';
    const autoplayTotalMs = AUTOPLAY_ACT_MS * CINEMATIC_ACT_COUNT;

    let rafId = 0;
    let lastFrame = 0;

    const publish = (progress: number, velocity: number) => {
      const { activeAct: nextAct, actProgress } = resolveAct(progress);
      if (nextAct !== activeActRef.current) {
        activeActRef.current = nextAct;
        setActiveAct(nextAct);
      }
      bus.publish({ progress, actProgress, activeAct: nextAct, velocity });
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);

      const delta = lastFrame === 0 ? 16.7 : Math.min(now - lastFrame, MAX_DELTA_MS);
      const booted = lastFrame === 0;
      lastFrame = now;

      if (!visibleRef.current || document.hidden) return;

      let next = progressRef.current;

      if (autoplay) {
        autoplayElapsedRef.current = (autoplayElapsedRef.current + delta) % autoplayTotalMs;
        next = autoplayElapsedRef.current / autoplayTotalMs;
      } else {
        const rect = track.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        next = span > 8 ? clamp01(-rect.top / span) : 0;
      }

      const velocity = next - progressRef.current;
      progressRef.current = next;

      if (booted || velocity !== 0) publish(next, velocity);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      progressRef.current = 0;
      autoplayElapsedRef.current = 0;
      activeActRef.current = 0;
      setActiveAct(0);
    };
  }, [bus, engineMode]);

  /* ── Pausa del reloj fuera de viewport (batería y CPU) ─────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visibleRef.current = entry ? entry.isIntersecting : true;
      },
      { rootMargin: '120px 0px', threshold: 0 }
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  /* ── Salto a acto (rail de progreso) ────────────────────────────────────── */
  const jumpToAct = useCallback(
    (index: CinematicActIndex) => {
      const target = progressForAct(index);

      if (engineMode === 'keyframe') {
        autoplayElapsedRef.current = target * AUTOPLAY_ACT_MS * CINEMATIC_ACT_COUNT;
        return;
      }

      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const top = window.scrollY + rect.top + span * target;

      window.scrollTo({
        top,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [engineMode, reducedMotion]
  );

  return {
    trackRef,
    bus,
    engineMode,
    activeAct,
    reducedMotion,
    compact,
    hydrated,
    jumpToAct,
  };
}