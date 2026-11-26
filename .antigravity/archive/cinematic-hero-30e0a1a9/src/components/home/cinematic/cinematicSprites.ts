/**
 * ════════════════════════════════════════════════════════════════════════════
 * SPRITES PROCEDURALES DEL MOTOR CINEMÁTICO
 * ════════════════════════════════════════════════════════════════════════════
 * Genera en un Web Worker con OffscreenCanvas (donde exista) los cuatro
 * sprites que consume el compositor: brasa, humo volumétrico, grano de película
 * y haz anamórfico. Si OffscreenCanvas/Worker no están disponibles o el worker
 * no responde en 1,2 s, se generan en el hilo principal con la misma geometría.
 *
 * Cero librerías, cero assets descargados, cero `any`.
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface CinematicSprites {
  readonly ember: CanvasImageSource;
  readonly smoke: CanvasImageSource;
  readonly grain: CanvasImageSource;
  readonly flare: CanvasImageSource;
}

const WORKER_TIMEOUT_MS = 1200;

/**
 * Fuente del worker inline. Se serializa a un Blob URL en runtime: no requiere
 * configuración del bundler (`new Worker(new URL(...))`), de modo que el build
 * de Next/Docker no puede romperse por esta pieza.
 */
const SPRITE_WORKER_SOURCE = `
'use strict';

function radial(size, stops) {
  const surface = new OffscreenCanvas(size, size);
  const ctx = surface.getContext('2d');
  if (!ctx) throw new Error('offscreen-2d-unavailable');
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  for (let i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(stops[i][0], stops[i][1]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return surface.transferToImageBitmap();
}

function ellipse(size, stops) {
  const surface = new OffscreenCanvas(size, size);
  const ctx = surface.getContext('2d');
  if (!ctx) throw new Error('offscreen-2d-unavailable');
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(1, 0.42);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
  for (let i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(stops[i][0], stops[i][1]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
  return surface.transferToImageBitmap();
}

function grain(size) {
  const surface = new OffscreenCanvas(size, size);
  const ctx = surface.getContext('2d');
  if (!ctx) throw new Error('offscreen-2d-unavailable');
  const image = ctx.createImageData(size, size);
  const data = image.data;
  let seed = 0x9e3779b9;
  for (let i = 0; i < data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = seed >>> 24;
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = value >>> 1;
  }
  ctx.putImageData(image, 0, 0);
  return surface.transferToImageBitmap();
}

self.onmessage = function onMessage(event) {
  try {
    const options = event.data || {};
    const emberSize = options.emberSize || 64;
    const grainSize = options.grainSize || 160;

    const sprites = {
      ember: radial(emberSize, [
        [0, 'rgba(255, 236, 196, 1)'],
        [0.28, 'rgba(255, 176, 84, 0.72)'],
        [0.62, 'rgba(255, 122, 42, 0.28)'],
        [1, 'rgba(255, 96, 20, 0)'],
      ]),
      smoke: radial(256, [
        [0, 'rgba(255, 255, 255, 0.30)'],
        [0.45, 'rgba(255, 255, 255, 0.12)'],
        [1, 'rgba(255, 255, 255, 0)'],
      ]),
      grain: grain(grainSize),
      flare: ellipse(320, [
        [0, 'rgba(255, 255, 255, 1)'],
        [0.22, 'rgba(255, 226, 168, 0.55)'],
        [0.6, 'rgba(255, 200, 120, 0.14)'],
        [1, 'rgba(255, 190, 110, 0)'],
      ]),
    };

    self.postMessage(sprites, [
      sprites.ember,
      sprites.smoke,
      sprites.grain,
      sprites.flare,
    ]);
  } catch (error) {
    self.postMessage({ error: String(error) });
  }
};
`;

/** Generación en hilo principal (fallback determinista, misma geometría). */
function buildSpritesOnMainThread(): CinematicSprites {
  const surface = (size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2d-context-unavailable');
    return { canvas, ctx };
  };

  const radial = (size: number, stops: ReadonlyArray<readonly [number, string]>) => {
    const { canvas, ctx } = surface(size);
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    for (const [position, color] of stops) gradient.addColorStop(position, color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return canvas;
  };

  const ember = radial(64, [
    [0, 'rgba(255, 236, 196, 1)'],
    [0.28, 'rgba(255, 176, 84, 0.72)'],
    [0.62, 'rgba(255, 122, 42, 0.28)'],
    [1, 'rgba(255, 96, 20, 0)'],
  ]);

  const smoke = radial(256, [
    [0, 'rgba(255, 255, 255, 0.30)'],
    [0.45, 'rgba(255, 255, 255, 0.12)'],
    [1, 'rgba(255, 255, 255, 0)'],
  ]);

  const flare = radial(320, [
    [0, 'rgba(255, 255, 255, 1)'],
    [0.22, 'rgba(255, 226, 168, 0.55)'],
    [0.6, 'rgba(255, 200, 120, 0.14)'],
    [1, 'rgba(255, 190, 110, 0)'],
  ]);

  const { canvas: grainCanvas, ctx: grainCtx } = surface(160);
  const image = grainCtx.createImageData(160, 160);
  let seed = 0x9e3779b9;
  for (let i = 0; i < image.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    image.data[i] = 255;
    image.data[i + 1] = 255;
    image.data[i + 2] = 255;
    image.data[i + 3] = (seed >>> 24) >>> 1;
  }
  grainCtx.putImageData(image, 0, 0);

  return { ember, smoke, grain: grainCanvas, flare };
}

/**
 * Intenta el pipeline Worker + OffscreenCanvas. Resuelve siempre: si algo falla
 * (o tarda > 1,2 s) devuelve los sprites del hilo principal.
 */
export async function createCinematicSprites(): Promise<CinematicSprites> {
  if (typeof window === 'undefined') {
    return buildSpritesOnMainThread();
  }

  const supportsOffscreen = typeof OffscreenCanvas !== 'undefined';

  if (!supportsOffscreen || typeof Worker === 'undefined') {
    return buildSpritesOnMainThread();
  }

  return new Promise<CinematicSprites>((resolve) => {
    let settled = false;
    let worker: Worker | null = null;
    let objectUrl = '';

    const finish = (sprites: CinematicSprites) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (worker) worker.terminate();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(sprites);
    };

    const fail = () => finish(buildSpritesOnMainThread());

    const timer = window.setTimeout(fail, WORKER_TIMEOUT_MS);

    try {
      objectUrl = URL.createObjectURL(new Blob([SPRITE_WORKER_SOURCE], { type: 'text/javascript' }));
      worker = new Worker(objectUrl);

      worker.onmessage = (event: MessageEvent) => {
        const data = event.data as Partial<CinematicSprites> & { error?: string };
        if (data && !data.error && data.ember && data.smoke && data.grain && data.flare) {
          finish({
            ember: data.ember,
            smoke: data.smoke,
            grain: data.grain,
            flare: data.flare,
          });
          return;
        }
        fail();
      };

      worker.onerror = fail;
      worker.postMessage({ emberSize: 64, grainSize: 160 });
    } catch {
      fail();
    }
  });
}