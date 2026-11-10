/**
 * ══════════════════════════════════════════════════════════════════════════════
 * Ω-SPATIAL LIFECYCLE — DECISIÓN PURA DEL CICLO DE VIDA DE UN CANVAS WebGL
 * ══════════════════════════════════════════════════════════════════════════════
 * Hallazgo F-4 de auditoría (viewport + accesibilidad 3D). El kernel
 * `gpuCapability.ts` ya decide CUÁNTA potencia se concede, pero no decidía si
 * un canvas concreto debe existir, pausarse o reanudarse. Sin esa segunda
 * decisión, un bucle `requestAnimationFrame` puede sobrevivir fuera del
 * viewport y seguir quemando CPU/GPU (batería medida en móvil) aunque el
 * usuario no vea nada.
 *
 * Tres estados, excluyentes:
 *   · 'static'   → NO se crea contexto WebGL. Se sirve la alternativa 2D
 *                  (póster o render estático). Motivo en `reason`.
 *   · 'paused'   → El contexto YA existe y se conserva (reanudar es barato),
 *                  pero el bucle rAF está detenido: 0 frames = 0% CPU/GPU.
 *   · 'running'  → Único estado que puede pedir `requestAnimationFrame`.
 *
 * Este módulo es PURO (sin React, sin 'use client', sin `window`):
 * importable desde Server Components, scripts de auditoría y tests de Node.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Estado del ciclo de vida de una escena WebGL. Cerrado y excluyente. */
export type WebglLifecycleState = 'static' | 'paused' | 'running';

/** Motivo del veredicto. Nunca se inventa: se deriva de una señal medida. */
export type WebglLifecycleReason =
  | 'running'
  | 'static-budget'
  | 'static-ssr'
  | 'static-reduced-motion'
  | 'static-no-webgl'
  | 'static-save-data'
  | 'static-fallback-requested'
  | 'paused-out-of-viewport'
  | 'paused-document-hidden';

/** Señales de entrada al decisor. Todas obligatorias: nada se asume. */
export interface WebglLifecycleSignals {
  /** `allowRender` del `SpatialBudget` resuelto. */
  readonly allowRender: boolean;
  /** `reason` del `SpatialBudget` (se propaga para trazabilidad). */
  readonly budgetReason: string;
  /** `true` si el usuario pidió explícitamente el modo estático. */
  readonly staticFallback: boolean;
  /** `IntersectionObserver` sobre el contenedor del canvas. */
  readonly inViewport: boolean;
  /** `document.visibilityState === 'visible'`. */
  readonly documentVisible: boolean;
}

/** Presupuesto de frames efectivo del estado actual. `fps: 0` = sin bucle. */
export interface WebglFrameBudget {
  readonly fps: number;
  /** Presupuesto de partículas/instancias concedido en este estado. */
  readonly maxParticles: number;
}

/** Veredicto: estado + motivo + si este render puede crear el canvas. */
export interface WebglLifecycleDecision {
  readonly state: WebglLifecycleState;
  readonly reason: WebglLifecycleReason;
  /** `true` sólo si el contexto WebGL debe existir (nunca en 'static'). */
  readonly shouldMountCanvas: boolean;
  /** `true` sólo en 'running'. Es el ÚNICO permiso para pedir un frame. */
  readonly shouldAnimate: boolean;
  /** `true` si hay que servir la alternativa 2D/estática en lugar del canvas. */
  readonly shouldRenderStaticAlternative: boolean;
  /** Techo de frames y de instancias. Derivado del estado, no adivinado. */
  readonly animateBudget: WebglFrameBudget;
}

/** Motivos del budget que fuerzan modo estático, en orden de precedencia. */
const STATIC_BUDGET_REASONS: ReadonlyArray<readonly [string, WebglLifecycleReason]> = [
  ['ssr-no-device-signals', 'static-ssr'],
  ['prefers-reduced-motion', 'static-reduced-motion'],
  ['no-webgl-context', 'static-no-webgl'],
  ['save-data-enabled', 'static-save-data'],
];

/** Potencia concedida por el `SpatialBudget` (entrada del decisor). */
export interface WebglAnimationBudget {
  readonly targetFps: number;
  readonly maxParticles: number;
}

/** Fallback conservador: 30 fps y 260 instancias (suelo TIER_B de gpuCapability). */
export const DEFAULT_ANIMATION_BUDGET: WebglAnimationBudget = Object.freeze({
  targetFps: 30,
  maxParticles: 260,
});

function staticDecision(reason: WebglLifecycleReason): WebglLifecycleDecision {
  return {
    state: 'static',
    reason,
    shouldMountCanvas: false,
    shouldAnimate: false,
    shouldRenderStaticAlternative: true,
    animateBudget: { fps: 0, maxParticles: 0 },
  };
}

/**
 * Resuelve el ciclo de vida. Precedencia deliberada: primero lo que PROTEGE al
 * usuario (accesibilidad → red → GPU), después el viewport. Un canvas fuera de
 * pantalla nunca justifica `static` (destruir y recrear el contexto en cada
 * scroll produce tirones y pérdida de contexto WebGL): se pausa, no se destruye.
 *
 * `targetFps` y `maxParticles` vienen del `SpatialBudget` ya resuelto: este
 * módulo no decide cuánta potencia existe, sólo si se puede GASTAR ahora.
 */
export function resolveWebglLifecycle(
  signals: WebglLifecycleSignals,
  budget: WebglAnimationBudget = DEFAULT_ANIMATION_BUDGET,
): WebglLifecycleDecision {
  const animateBudget: WebglFrameBudget = {
    fps: Math.max(0, Math.trunc(budget.targetFps)),
    maxParticles: Math.max(0, Math.trunc(budget.maxParticles)),
  };

  if (signals.budgetReason === 'ssr-no-device-signals') {
    return staticDecision('static-ssr');
  }

  // `prefers-reduced-motion` gana a cualquier otro motivo: es una preferencia
  // declarada por el usuario, no una carencia técnica.
  if (signals.budgetReason === 'prefers-reduced-motion') {
    return staticDecision('static-reduced-motion');
  }

  if (signals.staticFallback) {
    return staticDecision('static-fallback-requested');
  }

  if (!signals.allowRender) {
    const matched = STATIC_BUDGET_REASONS.find(([key]) => key === signals.budgetReason);
    return staticDecision(matched === undefined ? 'static-budget' : matched[1]);
  }

  if (!signals.documentVisible) {
    return {
      state: 'paused',
      reason: 'paused-document-hidden',
      shouldMountCanvas: true,
      shouldAnimate: false,
      shouldRenderStaticAlternative: false,
      animateBudget: { fps: 0, maxParticles: animateBudget.maxParticles },
    };
  }

  if (!signals.inViewport) {
    return {
      state: 'paused',
      reason: 'paused-out-of-viewport',
      shouldMountCanvas: true,
      shouldAnimate: false,
      shouldRenderStaticAlternative: false,
      animateBudget: { fps: 0, maxParticles: animateBudget.maxParticles },
    };
  }

  return {
    state: 'running',
    reason: 'running',
    shouldMountCanvas: true,
    shouldAnimate: true,
    shouldRenderStaticAlternative: false,
    animateBudget,
  };
}

/**
 * Presupuesto de frames por segundo realmente aplicable. Un multiplicador
 * basado en `elapsedMs`: 0 significa "toca pintar este frame". Permite bajar de
 * 60 fps a `budget.targetFps` (30/45 en TIER_B/TIER_A) sin relojes nuevos.
 */
export function shouldRenderFrame(
  elapsedMs: number,
  targetFps: number,
): boolean {
  if (!Number.isFinite(targetFps) || targetFps <= 0) return false;
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return true;
  return elapsedMs >= 1000 / targetFps;
}

/** Etiqueta estable para el DOM (`data-webgl-state`): telemetría sin adivinar. */
export function describeWebglLifecycle(decision: WebglLifecycleDecision): string {
  return `${decision.state}:${decision.reason}`;
}
