'use client';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN WEBGL STAGE — escenario gobernado S-Class
 * ══════════════════════════════════════════════════════════════════════════════
 * Envuelve CUALQUIER escena WebGL (three, R3F, shadergradient) con las cuatro
 * garantías que separan una demo de un activo comercial:
 *
 *   1. CLS 0 — el contenedor reserva espacio con `aspect-ratio` y los hijos van
 *      en `absolute inset-0`. Nada empuja el layout al montar el canvas.
 *   2. LCP honesto — el póster está SIEMPRE debajo. Si el tier es STATIC,
 *      `prefers-reduced-motion`, `save-data` o no hay GPU, el póster es lo único
 *      que se pinta: el usuario ve contenido, no un hueco negro.
 *   3. Cero rAF zombi — el canvas sólo existe si está en viewport Y la pestaña
 *      está visible (IntersectionObserver + Page Visibility).
 *   4. Trazabilidad — `data-spatial-tier` y `data-spatial-active` quedan en el
 *      DOM: la telemetría de campo puede demostrar el ahorro sin adivinar.
 *
 * Uso:
 *   <SovereignWebGLStage
 *     aspectRatio="16 / 9"
 *     poster={<Image src={poster} width={1600} height={900} alt="…" />}
 *     ariaLabel="Anillo de logística nacional en tiempo real"
 *   >
 *     {(budget) => <MiEscena maxParticles={budget.maxParticles} dpr={…} />}
 *   </SovereignWebGLStage>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Suspense, type CSSProperties, type ReactNode } from 'react';
import { useSpatialBudget } from '@/lib/hooks/useSpatialBudget';
import { useStageActivation } from '@/lib/hooks/useStageActivation';
import type { SpatialBudget } from '@/lib/spatial/gpuCapability';

export interface SovereignWebGLStageProps {
  /** Render de la escena. Recibe el presupuesto aprobado, no lo adivina. */
  readonly children: (budget: SpatialBudget) => ReactNode;
  /** Póster de respaldo: DEBE declarar width/height propios (LCP sin CLS). */
  readonly poster: ReactNode;
  /** Relación de aspecto CSS, p. ej. `"16 / 9"` o `"4 / 5"`. */
  readonly aspectRatio?: string;
  /** Clases del contenedor exterior. El ancho completo se hereda, nunca de viewport. */
  readonly className?: string;
  /** Etiqueta accesible. Sin ella, el escenario se considera decorativo. */
  readonly ariaLabel?: string;
  /** `true` desactiva IntersectionObserver (solo héroes above-the-fold). */
  readonly eager?: boolean;
  /** `true` (por defecto) oculta la escena a lectores de pantalla. */
  readonly decorative?: boolean;
}

export default function SovereignWebGLStage({
  children,
  poster,
  aspectRatio = '16 / 9',
  className,
  ariaLabel,
  eager = false,
  decorative = true,
}: SovereignWebGLStageProps): ReactNode {
  const budget = useSpatialBudget();
  const { ref, active } = useStageActivation({ eager });

  const shouldRenderScene = budget.allowRender && (eager || active);

  const containerStyle: CSSProperties = {
    aspectRatio,
    contain: 'paint',
  };

  const isDecorative = decorative || typeof ariaLabel !== 'string';

  return (
    <div
      ref={ref}
      data-spatial-tier={budget.tier}
      data-spatial-active={shouldRenderScene ? '1' : '0'}
      data-spatial-reason={budget.reason}
      className={`relative w-full overflow-hidden ${className ?? ''}`}
      style={containerStyle}
    >
      {/* Capa 0: póster. Siempre presente → fallback y LCP estable. */}
      <div className="absolute inset-0">{poster}</div>

      {/* Capa 1: escena. Montada sólo bajo contrato de presupuesto. */}
      {shouldRenderScene ? (
        <div
          className="absolute inset-0"
          aria-hidden={isDecorative ? 'true' : undefined}
          role={isDecorative ? undefined : 'img'}
          aria-label={isDecorative ? undefined : ariaLabel}
        >
          <Suspense fallback={null}>{children(budget)}</Suspense>
        </div>
      ) : null}
    </div>
  );
}
