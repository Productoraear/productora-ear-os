/**
 * ══════════════════════════════════════════════════════════════════════════════
 * Ω-SPATIAL KERNEL — CAPACIDAD GPU Y PRESUPUESTO DE RENDER (SSOT WebGL)
 * ══════════════════════════════════════════════════════════════════════════════
 * Doctrina de Fricción Cero (§7 .clinerules):
 *   - Un canvas WebGL sin gobernanza es una fuga de batería y de CLS.
 *   - El tier se resuelve con señales reales del dispositivo, nunca por gusto.
 *   - SSR devuelve siempre `STATIC_BUDGET`: HTML del servidor y primer render
 *     del cliente son idénticos → cero hydration mismatch, cero CLS.
 *
 * Este módulo es PURO (sin React, sin 'use client'): importable desde Server
 * Components, Server Actions, scripts de auditoría y tests de Node.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Escalafón de potencia gráfica. TIER_STATIC = no se pinta WebGL, solo póster. */
export type GpuTier = 'TIER_S' | 'TIER_A' | 'TIER_B' | 'TIER_STATIC';

/** Señales crudas del dispositivo. Varias son opcionales: Safari las niega. */
export interface SpatialSignals {
  readonly webgl1: boolean;
  readonly webgl2: boolean;
  readonly reducedMotion: boolean;
  readonly saveData: boolean;
  readonly deviceMemoryGb: number | null;
  readonly hardwareConcurrency: number;
  readonly viewportWidth: number;
}

/**
 * Presupuesto de render. Es un contrato: ningún componente WebGL puede pedir
 * más de lo que aquí se concede (partículas, octavas de shader, DPR, FPS).
 */
export interface SpatialBudget {
  readonly tier: GpuTier;
  readonly allowRender: boolean;
  readonly maxDevicePixelRatio: number;
  readonly maxParticles: number;
  readonly fbmOctaves: number;
  readonly targetFps: number;
  /** Motivo legible del veredicto. Telemetría y soporte, no decoración. */
  readonly reason: string;
}

/** Extensiones de `navigator` que lib.dom todavía no declara. */
interface NavigatorCapabilityExtensions {
  readonly deviceMemory?: number;
  readonly connection?: { readonly saveData?: boolean };
}

/** Presupuesto determinista para SSR y para el primer frame del cliente. */
export const STATIC_BUDGET: SpatialBudget = Object.freeze({
  tier: 'TIER_STATIC',
  allowRender: false,
  maxDevicePixelRatio: 1,
  maxParticles: 0,
  fbmOctaves: 0,
  targetFps: 0,
  reason: 'ssr-no-device-signals',
});

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Señales asumidas cuando no hay `window` (SSR / Node). */
export const SSR_SIGNALS: SpatialSignals = Object.freeze({
  webgl1: false,
  webgl2: false,
  reducedMotion: true,
  saveData: false,
  deviceMemoryGb: null,
  hardwareConcurrency: 0,
  viewportWidth: 0,
});

interface WebGLProbe {
  readonly webgl1: boolean;
  readonly webgl2: boolean;
}

let cachedProbe: WebGLProbe | null = null;

/**
 * Sondea WebGL una sola vez y libera el contexto inmediatamente con
 * `WEBGL_lose_context`. Sin esta liberación cada montaje deja un contexto
 * colgado y Chrome acaba matando contextos ajenos (pantalla en negro).
 */
export function probeWebGL(): WebGLProbe {
  if (cachedProbe !== null) return cachedProbe;
  if (typeof document === 'undefined') return { webgl1: false, webgl2: false };

  const unavailable: WebGLProbe = { webgl1: false, webgl2: false };
  let canvas: HTMLCanvasElement | null = null;

  try {
    canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const gl2: WebGL2RenderingContext | null = canvas.getContext('webgl2');
    const gl1: WebGL2RenderingContext | WebGLRenderingContext | null =
      gl2 ?? canvas.getContext('webgl');

    cachedProbe = { webgl1: gl1 !== null, webgl2: gl2 !== null };

    const losable: { loseContext?: () => void } | null = gl2
      ? gl2.getExtension('WEBGL_lose_context')
      : gl1
        ? gl1.getExtension('WEBGL_lose_context')
        : null;
    losable?.loseContext?.();

    return cachedProbe;
  } catch {
    cachedProbe = unavailable;
    return unavailable;
  } finally {
    if (canvas !== null) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}

/** Lee las señales reales del navegador. Nunca lanza. */
export function readSpatialSignals(): SpatialSignals {
  if (typeof window === 'undefined') return SSR_SIGNALS;

  const capabilityNavigator = navigator as unknown as NavigatorCapabilityExtensions;
  const probe = probeWebGL();

  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches;

  const memory = capabilityNavigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;

  return {
    webgl1: probe.webgl1,
    webgl2: probe.webgl2,
    reducedMotion,
    saveData: capabilityNavigator.connection?.saveData === true,
    deviceMemoryGb:
      typeof memory === 'number' && Number.isFinite(memory) ? memory : null,
    hardwareConcurrency:
      typeof cores === 'number' && Number.isFinite(cores) ? cores : 0,
    viewportWidth: window.innerWidth,
  };
}

/**
 * Resuelve el presupuesto. Criterio: primero lo que PROTEGE al usuario
 * (accesibilidad, ahorro de datos, ausencia de GPU); después la potencia.
 */
export function resolveSpatialBudget(signals: SpatialSignals): SpatialBudget {
  // SSR por identidad: el servidor JAMÁS concede render. Se devuelve el objeto
  // canónico intacto para que la telemetría distinga "servidor" de "sin GPU".
  if (signals === SSR_SIGNALS) return STATIC_BUDGET;

  if (!signals.webgl1 && !signals.webgl2) {
    return { ...STATIC_BUDGET, reason: 'no-webgl-context' };
  }
  if (signals.reducedMotion) {
    return { ...STATIC_BUDGET, reason: 'prefers-reduced-motion' };
  }
  if (signals.saveData) {
    return { ...STATIC_BUDGET, reason: 'save-data-enabled' };
  }

  const memory = signals.deviceMemoryGb;
  const cores = signals.hardwareConcurrency;

  const isTierS =
    signals.webgl2 &&
    signals.viewportWidth >= 1024 &&
    (memory === null || memory >= 8) &&
    (cores === 0 || cores >= 8);

  if (isTierS) {
    return {
      tier: 'TIER_S',
      allowRender: true,
      maxDevicePixelRatio: 1.75,
      maxParticles: 2200,
      fbmOctaves: 5,
      targetFps: 60,
      reason: 'webgl2+high-memory',
    };
  }

  const isTierA =
    signals.viewportWidth >= 768 &&
    (memory === null || memory >= 4) &&
    (cores === 0 || cores >= 4);

  if (isTierA) {
    return {
      tier: 'TIER_A',
      allowRender: true,
      maxDevicePixelRatio: 1.5,
      maxParticles: 900,
      fbmOctaves: 4,
      targetFps: 45,
      reason: 'webgl1-2+mid-memory',
    };
  }

  return {
    tier: 'TIER_B',
    allowRender: true,
    maxDevicePixelRatio: 1,
    maxParticles: 260,
    fbmOctaves: 3,
    targetFps: 30,
    reason: 'low-end-conservative',
  };
}

/** Compara presupuestos para evitar re-render en cada evento `resize`. */
export function budgetsEqual(a: SpatialBudget, b: SpatialBudget): boolean {
  return (
    a.tier === b.tier &&
    a.allowRender === b.allowRender &&
    a.maxDevicePixelRatio === b.maxDevicePixelRatio &&
    a.maxParticles === b.maxParticles &&
    a.fbmOctaves === b.fbmOctaves &&
    a.targetFps === b.targetFps
  );
}

/**
 * DPR efectivo ya recortado al presupuesto. Es la ÚNICA fuente autorizada:
 * ningún componente debe leer `window.devicePixelRatio` por su cuenta.
 */
export function effectiveDevicePixelRatio(
  budget: SpatialBudget,
  rawDevicePixelRatio: number,
): number {
  if (!Number.isFinite(rawDevicePixelRatio) || rawDevicePixelRatio <= 0) {
    return 1;
  }
  return Math.min(Math.max(rawDevicePixelRatio, 1), budget.maxDevicePixelRatio);
}

/**
 * Presupuesto de instancias geométricas: degrada en móvil para no reventar
 * GPUs integradas. Suelo de 60 instancias para que la escena nunca se vea vacía.
 */
export function scaledParticleCount(
  budget: SpatialBudget,
  viewportWidth: number,
): number {
  if (!budget.allowRender) return 0;
  if (viewportWidth <= 0) return budget.maxParticles;
  const mobileFactor = viewportWidth < 768 ? 0.55 : 1;
  return Math.max(60, Math.round(budget.maxParticles * mobileFactor));
}
