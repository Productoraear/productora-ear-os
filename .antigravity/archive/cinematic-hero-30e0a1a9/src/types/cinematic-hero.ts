/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIPOS · HERO CINEMATOGRÁFICO "TASTE ENGINE VELOCITY" (4 ACTOS)
 * ════════════════════════════════════════════════════════════════════════════
 * Contrato tipado entre el reloj de scroll, el motor visual (Canvas 2D /
 * keyframes WebP) y la capa de copy. Sin `any`, sin valores duplicados: el copy
 * comercial y las cifras viven en `src/components/home/cinematic/cinematicScenes.ts`
 * y las cifras, a su vez, se leen del SSOT canónico (`ear-os-ssot`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { RefObject } from 'react';

/** Índice interno de acto (0-based) usado por el motor y la barra de progreso. */
export type CinematicActIndex = 0 | 1 | 2 | 3;

export type CinematicSceneId =
  | 'acto-01-fincas'
  | 'acto-02-escena'
  | 'acto-03-maitre'
  | 'acto-04-institucional';

/** Gramática de cámara del storyboard (se imprime en el slate técnico). */
export type CinematicCameraMove =
  | 'travelling-rasante'
  | 'whip-pan'
  | 'macro-refraccion'
  | 'grua-cenital';

/** Motor activo: canvas acelerado (escritorio) o keyframes WebP (móvil/AA). */
export type CinematicEngineMode = 'canvas-2d' | 'keyframe';

/** Familia de partículas procedurales por acto. */
export type CinematicParticleSystem = 'embers' | 'beams' | 'refraction' | 'bloom';

/** Acción de CTA que no navega: abre el dock del asistente (Maître Digital). */
export type CinematicCtaAction = 'open-maitre';

/** Transformación de cámara aplicada a un fotograma (espacio normalizado). */
export interface CinematicFrameTransform {
  /** Escala de destino (1 = encaje exacto "cover"). */
  readonly scale: number;
  /** Desplazamiento horizontal normalizado (-1..1 del ancho del lienzo). */
  readonly offsetX: number;
  /** Desplazamiento vertical normalizado (-1..1 del alto del lienzo). */
  readonly offsetY: number;
  /** Rotación en radianes (travelling inclinado / horizonte holandés sutil). */
  readonly rotate: number;
}

/** Etalonaje (color grading) por fotograma. */
export interface CinematicGrade {
  /** Tinte maestro aplicado con `soft-light`. */
  readonly tint: string;
  /** Color del degradado de atmósfera inferior. */
  readonly horizon: string;
  /** Intensidad 0..1 del etalonaje. */
  readonly strength: number;
}

/** Fotograma cinematográfico: placa WebP real + movimiento de cámara. */
export interface CinematicFrame {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  /** Blur de refracción en px (0 = nítido). Se usa en el macro del Acto III. */
  readonly blurPx: number;
  readonly grade: CinematicGrade;
  readonly from: CinematicFrameTransform;
  readonly to: CinematicFrameTransform;
}

/** Dato verificable impreso en el slate técnico (trazable al SSOT). */
export interface CinematicTelemetryItem {
  readonly label: string;
  readonly value: string;
}

/** CTA del cierre (Acto IV) o de un acto concreto. */
export interface CinematicCta {
  readonly id: string;
  readonly label: string;
  /** Ruta interna real. Ausente cuando la acción es un disparador de dock. */
  readonly href?: string;
  readonly action?: CinematicCtaAction;
  readonly emphasis: 'primary' | 'ghost';
}

/** Acto del storyboard: copy, placas, cámara, partículas y telemetría. */
export interface CinematicScene {
  readonly id: CinematicSceneId;
  readonly index: 1 | 2 | 3 | 4;
  readonly label: string;
  readonly claim: string;
  readonly detail: string;
  readonly camera: CinematicCameraMove;
  readonly particles: CinematicParticleSystem;
  readonly frames: readonly [CinematicFrame, CinematicFrame];
  readonly telemetry: readonly CinematicTelemetryItem[];
  readonly ctas?: readonly CinematicCta[];
}

/**
 * Señal publicada en cada frame por el reloj del hero. Se consume de forma
 * imperativa (refs) para NO re-renderizar React 60 veces por segundo (INP).
 */
export interface CinematicSignal {
  /** Progreso global 0..1 a lo largo de los 4 actos. */
  readonly progress: number;
  /** Progreso 0..1 dentro del acto activo. */
  readonly actProgress: number;
  /** Acto activo (0-based). */
  readonly activeAct: CinematicActIndex;
  /** Variación de progreso por frame (para el "whip-pan" reactivo). */
  readonly velocity: number;
}

export type CinematicSignalListener = (signal: CinematicSignal) => void;

/** Bus síncrono mínimo: un solo reloj, N suscriptores, cero librerías. */
export interface CinematicSignalBus {
  publish(signal: CinematicSignal): void;
  subscribe(listener: CinematicSignalListener): () => void;
  read(): CinematicSignal;
}

/** Props del renderizador Canvas 2D (cargado con `ssr: false`). */
export interface CinematicCanvasStageProps {
  readonly bus: CinematicSignalBus;
  readonly scenes: readonly CinematicScene[];
}

/** Props de la degradación por keyframes WebP (SSR-safe, cero canvas). */
export interface CinematicKeyframeStageProps {
  readonly bus: CinematicSignalBus;
  readonly scenes: readonly CinematicScene[];
}

/** Props de la capa tipográfica + panel de cristal del Maître. */
export interface CinematicCopyStageProps {
  readonly bus: CinematicSignalBus;
  readonly scenes: readonly CinematicScene[];
}

/** Resultado del reloj del hero. */
export interface CinematicTimeline {
  readonly trackRef: RefObject<HTMLDivElement | null>;
  readonly bus: CinematicSignalBus;
  readonly engineMode: CinematicEngineMode;
  readonly activeAct: CinematicActIndex;
  readonly reducedMotion: boolean;
  readonly compact: boolean;
  /**
   * `false` durante el render de servidor y la primera pasada de hidratación:
   * sólo entonces se monta el motor Canvas (evita descargar WebGL/canvas en
   * móvil y garantiza markup idéntico servidor ↔ cliente).
   */
  readonly hydrated: boolean;
  readonly jumpToAct: (index: CinematicActIndex) => void;
}

/** Estado de audio ambiental S-Class (sintetizado, sin assets de terceros). */
export type CinematicAudioState = 'muted' | 'ambient';