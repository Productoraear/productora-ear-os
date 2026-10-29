'use client';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * useStageActivation — interruptor físico del rAF
 * ══════════════════════════════════════════════════════════════════════════════
 * Un bucle `requestAnimationFrame` que sigue vivo fuera del viewport o con la
 * pestaña en segundo plano es batería robada y CPU que el cliente paga.
 * Esta puerta combina IntersectionObserver + Page Visibility en una sola señal.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';

export interface StageActivationOptions {
  /** `true` ignora el IntersectionObserver (héroe above-the-fold). */
  readonly eager?: boolean;
  /** Margen de anticipación del observer. Por defecto 200 px. */
  readonly rootMargin?: string;
  /** Umbral de intersección. Por defecto 0.01. */
  readonly threshold?: number;
}

export interface StageActivation {
  readonly ref: React.RefObject<HTMLDivElement | null>;
  /** `true` solo si el nodo está en pantalla Y la pestaña está visible. */
  readonly active: boolean;
  readonly inView: boolean;
  readonly documentVisible: boolean;
}

export function useStageActivation(
  options: StageActivationOptions = {},
): StageActivation {
  const { eager = false, rootMargin = '200px', threshold = 0.01 } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(eager);
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
      setInView(true);
      return;
    }

    const node = ref.current;
    if (node === null) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Sin observer no se puede ahorrar, pero NUNCA se deja el escenario muerto.
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [eager, rootMargin, threshold]);

  return {
    ref,
    active: inView && documentVisible,
    inView,
    documentVisible,
  };
}

export default useStageActivation;
