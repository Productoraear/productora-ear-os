import type {
  CinematicActIndex,
  CinematicSignal,
  CinematicSignalBus,
  CinematicSignalListener,
} from '@/types/cinematic-hero';
import { CINEMATIC_FRAME_COUNT } from './cinematicScenes';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * BUS DE SEÑAL CINEMÁTICA (UN RELOJ, N SUSCRIPTORES)
 * ════════════════════════════════════════════════════════════════════════════
 * El reloj del hero publica una señal inmutable por frame. El motor Canvas, la
 * capa de keyframes y la capa tipográfica se suscriben y escriben estilos/DOM
 * directamente, evitando re-render de React a 60 fps (INV-11 · INP ≤ 200 ms).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Número de actos del storyboard. */
export const CINEMATIC_ACT_COUNT = 4;

/** Fotogramas por acto (2 placas por acto: A → B). */
const FRAMES_PER_ACT = CINEMATIC_FRAME_COUNT / CINEMATIC_ACT_COUNT;

/** Señal inicial (idéntica en servidor y cliente: cero hydration mismatch). */
export const CINEMATIC_INITIAL_SIGNAL: CinematicSignal = Object.freeze({
  progress: 0,
  actProgress: 0,
  activeAct: 0,
  velocity: 0,
});

/** Deriva el acto activo y su progreso local a partir del progreso global. */
export function resolveAct(progress: number): {
  activeAct: CinematicActIndex;
  actProgress: number;
} {
  const bounded = progress <= 0 ? 0 : progress >= 1 ? 1 : progress;
  const position = bounded * (CINEMATIC_FRAME_COUNT - 1);
  const rawAct = Math.floor(position / FRAMES_PER_ACT);
  const activeAct = (rawAct < 0 ? 0 : rawAct > 3 ? 3 : rawAct) as CinematicActIndex;
  const local = (position - activeAct * FRAMES_PER_ACT) / FRAMES_PER_ACT;
  return {
    activeAct,
    actProgress: local < 0 ? 0 : local > 1 ? 1 : local,
  };
}

/** Progreso global exacto donde arranca un acto (alineado con su primer frame). */
export function progressForAct(index: CinematicActIndex): number {
  const bounded = index < 0 ? 0 : index > 3 ? 3 : index;
  return (bounded * FRAMES_PER_ACT) / (CINEMATIC_FRAME_COUNT - 1);
}

/**
 * Crea un bus síncrono append-only: publicar recorre los suscriptores en orden
 * de registro; desuscribir es O(1) sobre un Set.
 */
export function createCinematicSignalBus(): CinematicSignalBus {
  const listeners = new Set<CinematicSignalListener>();
  let current: CinematicSignal = CINEMATIC_INITIAL_SIGNAL;

  return {
    publish(signal: CinematicSignal): void {
      current = signal;
      for (const listener of listeners) {
        listener(signal);
      }
    },
    subscribe(listener: CinematicSignalListener): () => void {
      listeners.add(listener);
      listener(current);
      return () => {
        listeners.delete(listener);
      };
    },
    read(): CinematicSignal {
      return current;
    },
  };
}