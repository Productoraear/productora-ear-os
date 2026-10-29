'use client';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * useSpatialBudget — presupuesto GPU reactivo, sin hydration mismatch
 * ══════════════════════════════════════════════════════════════════════════════
 * Regla inquebrantable: el primer render (servidor e hidratación) devuelve
 * SIEMPRE `STATIC_BUDGET`. El sondeo real ocurre en `useEffect`, ya en el
 * cliente. Así el HTML servido y el DOM hidratado coinciden byte a byte.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import {
  budgetsEqual,
  readSpatialSignals,
  resolveSpatialBudget,
  REDUCED_MOTION_QUERY,
  STATIC_BUDGET,
  type SpatialBudget,
} from '@/lib/spatial/gpuCapability';

export function useSpatialBudget(): SpatialBudget {
  const [budget, setBudget] = useState<SpatialBudget>(STATIC_BUDGET);

  useEffect(() => {
    let frame = 0;

    const sync = (): void => {
      const next = resolveSpatialBudget(readSpatialSignals());
      setBudget((previous) => (budgetsEqual(previous, next) ? previous : next));
    };

    // Se difiere un frame para no competir con la hidratación (INP).
    frame = window.requestAnimationFrame(sync);

    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleMotionChange = (): void => sync();
    const handleResize = (): void => sync();
    const handleVisibility = (): void => {
      if (document.visibilityState === 'visible') sync();
    };

    motionQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return budget;
}

export default useSpatialBudget;
