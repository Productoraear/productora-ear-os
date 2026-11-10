'use client';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * useWebglLifecycle — puerta física del canvas 3D (hallazgo F-4)
 * ══════════════════════════════════════════════════════════════════════════════
 * Une las tres señales que un canvas WebGL necesita para no ser una fuga:
 *   1. `useSpatialBudget`  → accesibilidad (prefers-reduced-motion), red y GPU.
 *   2. `IntersectionObserver` → sólo anima mientras el nodo está en pantalla.
 *   3. `Page Visibility`   → sólo anima con la pestaña visible.
 *
 * El efecto observable es duro: fuera de viewport no se pide ni un frame, así
 * que el coste de CPU/GPU del bucle rAF es 0% (el contexto WebGL se conserva
 * para que reanudar no cueste una reconstrucción de escena).
 *
 * SSR: el primer render devuelve SIEMPRE `static-ssr` (igual que
 * `useSpatialBudget`), así el HTML del servidor y la hidratación coinciden y no
 * hay CLS ni hydration mismatch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import { useSpatialBudget } from '@/lib/hooks/useSpatialBudget';
import { STATIC_BUDGET } from '@/lib/spatial/gpuCapability';
import {
  describeWebglLifecycle,
  resolveWebglLifecycle,
  type WebglLifecycleDecision,
} from '@/lib/spatial/webglLifecycle';

export interface WebglLifecycleOptions {
  /** `true` desactiva el IntersectionObserver (héroe above-the-fold). */
  readonly eager?: boolean;
  /** `true` fuerza la alternativa 2D: el canvas WebGL no se crea nunca. */
  readonly staticFallback?: boolean;
  /** Margen de anticipación del observer. Por defecto 200 px. */
  readonly rootMargin?: string;
  /** Umbral de intersección. Por defecto 0.01. */
  readonly threshold?: number;
}

export interface WebglLifecycleGate {
  /** Ref sobre el contenedor observado. Obligatorio para el viewport pause. */
  readonly ref: React.RefObject<HTMLDivElement | null>;
  /** Veredicto completo: estado, motivo y permisos. */
  readonly decision: WebglLifecycleDecision;
  /** Etiqueta `estado:motivo`, lista para `data-webgl-state`. */
  readonly label: string;
  /** `true` sólo cuando este render puede crear el contexto WebGL. */
  readonly shouldMountCanvas: boolean;
  /** `true` sólo cuando el bucle rAF tiene permiso para existir. */
  readonly shouldAnimate: boolean;
  /** `true` si toca pintar la alternativa estática en vez del canvas. */
  readonly shouldRenderStaticAlternative: boolean;
}

export function useWebglLifecycle(
  options: WebglLifecycleOptions = {},
): WebglLifecycleGate {
  const {
    eager = false,
    staticFallback = false,
    rootMargin = '200px',
    threshold = 0.01,
  } = options;

  const budget = useSpatialBudget();
  const ref = useRef<HTMLDivElement | null>(null);
  const [inViewport, setInViewport] = useState<boolean>(eager);
  const [documentVisible, setDocumentVisible] = useState<boolean>(false);

  useEffect(() => {
    setDocumentVisible(document.visibilityState === 'visible');

    const handleVisibility = (): void => {
      setDocumentVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (eager) {
      setInViewport(true);
      return;
    }

    const node = ref.current;
    if (node === null) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Sin observer no se puede ahorrar, pero NUNCA se deja el escenario muerto.
      setInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInViewport(entry.isIntersecting);
        }
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [eager, rootMargin, threshold]);

  const decision = resolveWebglLifecycle(
    {
      allowRender: budget.allowRender,
      budgetReason: budget.reason,
      staticFallback,
      inViewport,
      documentVisible,
    },
    { targetFps: budget.targetFps, maxParticles: budget.maxParticles },
  );

  return {
    ref,
    decision,
    label: describeWebglLifecycle(decision),
    shouldMountCanvas: decision.shouldMountCanvas,
    shouldAnimate: decision.shouldAnimate,
    shouldRenderStaticAlternative: decision.shouldRenderStaticAlternative,
  };
}

/** Re-export defensivo: el primer render es siempre el presupuesto estático. */
export const WEBGL_SSR_BUDGET_REASON = STATIC_BUDGET.reason;

export default useWebglLifecycle;
