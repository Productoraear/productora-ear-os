'use client';

import React, { useEffect, useRef } from 'react';
import type {
  CinematicCanvasStageProps,
  CinematicFrame,
  CinematicParticleSystem,
} from '@/types/cinematic-hero';
import { CINEMATIC_FRAMES } from './cinematicScenes';
import { clamp01, createSeededRandom, easeInOutSine, lerp, smoothstep } from './cinematicMath';
import { createCinematicSprites, type CinematicSprites } from './cinematicSprites';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR VISUAL CANVAS 2D · TASTE ENGINE VELOCITY
 * ════════════════════════════════════════════════════════════════════════════
 * Compositor de 8 fotogramas WebP reales con:
 *   · cámara continua (travelling / whip-pan / macro / grúa) interpolada por scroll,
 *   · etalonaje cinematográfico por placa,
 *   · partículas procedurales (brasas, haces, refracción, bloom),
 *   · viñeta anamórfica, grano de película y barras de proyección sutiles.
 *
 * Este módulo SIEMPRE se carga con `next/dynamic` y render de servidor
 * deshabilitado: no toca `document` durante el SSR de Node/Docker. El canvas
 * tiene tamaño reservado por CSS (`absolute inset-0`), por lo que su montaje no
 * desplaza una sola caja (CLS 0.000).
 *
 * Presupuesto: ≤ 45 fps, DPR tope 1.5, sprites generados en Worker con
 * OffscreenCanvas cuando existe, blur de refracción cacheado por viewport.
 * ════════════════════════════════════════════════════════════════════════════
 */

const MAX_DPR = 1.5;
const FRAME_INTERVAL_MS = 1000 / 45;
const BLUR_CACHE_RATIO = 0.6;
const BASE_VOID = '#030305';

interface Particle {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly speed: number;
  readonly phase: number;
  readonly drift: number;
}

interface PlateVisual {
  readonly source: CanvasImageSource;
  readonly width: number;
  readonly height: number;
}

/** Semillas fijas: el mismo frame produce siempre la misma constelación. */
const emberRandom = createSeededRandom(0x51e1a7);
const EMBERS: readonly Particle[] = Object.freeze(
  Array.from({ length: 64 }, () => ({
    x: emberRandom(),
    y: emberRandom(),
    size: 0.35 + emberRandom() * 1.5,
    speed: 0.1 + emberRandom() * 0.32,
    phase: emberRandom() * Math.PI * 2,
    drift: 0.4 + emberRandom() * 1.2,
  }))
);

const moteRandom = createSeededRandom(0x2c9f13);
const MOTES: readonly Particle[] = Object.freeze(
  Array.from({ length: 34 }, () => ({
    x: moteRandom(),
    y: moteRandom(),
    size: 0.25 + moteRandom() * 0.7,
    speed: 0.02 + moteRandom() * 0.06,
    phase: moteRandom() * Math.PI * 2,
    drift: 0.3 + moteRandom(),
  }))
);

export function CinematicCanvasStage({ bus, scenes }: CinematicCanvasStageProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;

    const canvas: HTMLCanvasElement = canvasNode;
    const context2d = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context2d) return;

    // Anotación explícita no-nula: las funciones internas (hoisted) no heredan
    // el narrowing del `if (!ctx) return` y TypeScript las marca como `null`.
    const ctx: CanvasRenderingContext2D = context2d;

    let disposed = false;
    let sprites: CinematicSprites | null = null;
    let grainPattern: CanvasPattern | null = null;
    let lastDraw = 0;
    const timeOrigin = performance.now();

    const images = new Map<string, HTMLImageElement>();
    const blurredPlates = new Map<string, HTMLCanvasElement>();
    const gradients = new Map<string, CanvasGradient | null>();

    let width = 0;
    let height = 0;

    const viewportArea = () => Math.max(1, width * height);

    /* ── Caché de placas difuminadas (refracción del Acto III) ───────────── */
    const blurPlate = (frame: CinematicFrame, image: HTMLImageElement): PlateVisual | null => {
      if (frame.blurPx <= 0) {
        return { source: image, width: image.naturalWidth, height: image.naturalHeight };
      }

      const key = `${frame.id}:${width}x${height}`;
      const cached = blurredPlates.get(key);
      if (cached) {
        return { source: cached, width: cached.width, height: cached.height };
      }

      const surface = document.createElement('canvas');
      surface.width = Math.max(1, Math.round(width * BLUR_CACHE_RATIO));
      surface.height = Math.max(1, Math.round(height * BLUR_CACHE_RATIO));
      const surfaceCtx = surface.getContext('2d');
      if (!surfaceCtx) return null;

      const scale = Math.max(surface.width / image.naturalWidth, surface.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      surfaceCtx.filter = `blur(${Math.round(frame.blurPx / BLUR_CACHE_RATIO)}px)`;
      surfaceCtx.drawImage(
        image,
        (surface.width - drawWidth) / 2,
        (surface.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      surfaceCtx.filter = 'none';

      blurredPlates.set(key, surface);
      return { source: surface, width: surface.width, height: surface.height };
    };

    const resolvePlate = (frame: CinematicFrame): PlateVisual | null => {
      const image = images.get(frame.src);
      if (!image || !image.complete || image.naturalWidth === 0) return null;
      return blurPlate(frame, image);
    };

    /* ── Estilos y superficies geométricas cacheadas por viewport ───────── */
    const gradient = (
      key: string,
      build: (context: CanvasRenderingContext2D) => CanvasGradient
    ): CanvasGradient | null => {
      if (gradients.has(key)) return gradients.get(key) ?? null;
      const created = build(ctx);
      gradients.set(key, created);
      return created;
    };
/* ── Composición de una placa con su cámara ──────────────────────────── */
    function drawPlate(
      frame: CinematicFrame,
      plate: PlateVisual,
      cameraT: number,
      alpha: number
    ): void {
      if (width === 0 || height === 0 || alpha <= 0.002) return;

      const eased = easeInOutSine(clamp01(cameraT));
      const zoom = lerp(frame.from.scale, frame.to.scale, eased);
      const offsetX = lerp(frame.from.offsetX, frame.to.offsetX, eased);
      const offsetY = lerp(frame.from.offsetY, frame.to.offsetY, eased);
      const rotation = lerp(frame.from.rotate, frame.to.rotate, eased);

      const coverScale = Math.max(width / plate.width, height / plate.height);
      const drawWidth = plate.width * coverScale * zoom;
      const drawHeight = plate.height * coverScale * zoom;

      ctx.save();
      ctx.globalAlpha = clamp01(alpha);
      ctx.translate(width / 2 + offsetX * width, height / 2 + offsetY * height);
      ctx.rotate(rotation);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(plate.source, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    }

    /* ── Etalonaje (color grade) de la placa ─────────────────────────────── */
    function drawGrade(frame: CinematicFrame, alpha: number): void {
      if (width === 0 || height === 0 || alpha <= 0.002) return;

      const tint = gradient(`tint:${frame.id}`, (context) => {
        const radius = Math.max(width, height) * 0.8;
        const fill = context.createRadialGradient(
          width * 0.5,
          height * 0.42,
          0,
          width * 0.5,
          height * 0.42,
          radius
        );
        fill.addColorStop(0, frame.grade.tint);
        fill.addColorStop(0.55, 'rgba(120, 90, 40, 0.25)');
        fill.addColorStop(1, 'rgba(3, 3, 5, 0)');
        return fill;
      });

      if (tint) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = clamp01(frame.grade.strength * alpha);
        ctx.fillStyle = tint;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      const horizon = gradient(`horizon:${frame.id}`, (context) => {
        const fill = context.createLinearGradient(0, height * 0.45, 0, height);
        fill.addColorStop(0, 'rgba(3, 3, 5, 0)');
        fill.addColorStop(1, frame.grade.horizon);
        return fill;
      });

      if (horizon) {
        ctx.save();
        ctx.globalAlpha = 0.55 * alpha;
        ctx.fillStyle = horizon;
        ctx.fillRect(0, height * 0.45, width, height * 0.55);
        ctx.restore();
      }
    }

    /* ── Brasas de encina (Acto I) ───────────────────────────────────────── */
    function drawEmbers(elapsed: number, alpha: number): void {
      if (!sprites) return;
      const unit = Math.sqrt(viewportArea()) * 0.001;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const particle of EMBERS) {
        const cycle = (particle.y + elapsed * particle.speed) % 1;
        const y = height * (1.08 - cycle * 1.18);
        const x = width * particle.x + Math.sin(elapsed * 0.6 + particle.phase) * width * 0.02 * particle.drift;
        const size = particle.size * unit * (0.6 + cycle * 0.7);
        ctx.globalAlpha = clamp01(Math.sin(cycle * Math.PI)) * 0.55 * alpha;
        ctx.drawImage(sprites.ember, x - size / 2, y - size / 2, size, size);
      }
      ctx.restore();

      // Humo volumétrico: tres masas lentas con 'screen' muy bajo.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 3; i += 1) {
        const drift = (elapsed * (0.014 + i * 0.006) + i * 0.33) % 1;
        const size = Math.max(width, height) * (0.55 + i * 0.16);
        ctx.globalAlpha = 0.1 * alpha * (1 - drift * 0.6);
        ctx.drawImage(
          sprites.smoke,
          width * (0.25 + i * 0.24) - size / 2,
          height * (0.72 - drift * 0.55) - size / 2,
          size,
          size
        );
      }
      ctx.restore();
    }

/* ── Haces de luz y polvo suspendido (Acto II) ───────────────────────── */
    function drawBeams(elapsed: number, alpha: number): void {
      if (!sprites) return;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i += 1) {
        const length = height * 1.5;
        const beamFill = gradient(`beam:${i}:${Math.round(length)}`, (context) => {
          const fill = context.createLinearGradient(0, 0, 0, length);
          fill.addColorStop(0, 'rgba(255, 214, 140, 0.5)');
          fill.addColorStop(0.45, 'rgba(236, 182, 19, 0.16)');
          fill.addColorStop(1, 'rgba(236, 182, 19, 0)');
          return fill;
        });
        if (!beamFill) continue;

        const angle = -0.46 + i * 0.31 + Math.sin(elapsed * 0.18 + i) * 0.05;
        const spread = width * (0.05 + i * 0.012);

        ctx.save();
        ctx.translate(width * (0.14 + i * 0.24), -height * 0.12);
        ctx.rotate(angle);
        ctx.globalAlpha = 0.24 * alpha;
        ctx.fillStyle = beamFill;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-spread, length);
        ctx.lineTo(spread, length);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const mote of MOTES) {
        const cycle = (mote.y + elapsed * mote.speed) % 1;
        const x = width * mote.x + Math.sin(elapsed * 0.3 + mote.phase) * width * 0.03 * mote.drift;
        const y = height * cycle;
        const size = mote.size * Math.min(width, height) * 0.006;
        ctx.globalAlpha = clamp01(Math.sin(cycle * Math.PI)) * 0.5 * alpha;
        ctx.fillStyle = 'rgba(255, 232, 186, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    /* ── Refracción de cristal + retícula de plano (Acto III) ─────────────── */
    function drawRefraction(elapsed: number, alpha: number): void {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      for (let i = 0; i < 3; i += 1) {
        const sweep = (elapsed * 0.03 + i * 0.33) % 1;
        const band = gradient(`sweep:${i}:${width}x${height}`, (context) => {
          const fill = context.createLinearGradient(0, 0, width, height);
          fill.addColorStop(0, 'rgba(255, 255, 255, 0)');
          fill.addColorStop(0.5, 'rgba(255, 255, 255, 0.16)');
          fill.addColorStop(1, 'rgba(255, 255, 255, 0)');
          return fill;
        });
        if (!band) continue;
        ctx.globalAlpha = 0.35 * alpha;
        ctx.save();
        ctx.translate(width * (sweep - 0.35), 0);
        ctx.rotate(-0.24);
        ctx.fillStyle = band;
        ctx.fillRect(-width * 0.2, -height * 0.4, width * 0.28, height * 1.8);
        ctx.restore();
      }
      ctx.restore();

      // Retícula fina del plano de mesas (8 px), sin saturar la lectura.
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.1 * alpha;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = Math.max(1, Math.round(Math.min(width, height) * 0.0009));
      const cell = Math.max(18, Math.round(Math.min(width, height) * 0.028));
      for (let x = 0; x <= width; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* ── Bloom institucional (Acto IV) ───────────────────────────────────── */
    function drawBloom(elapsed: number, alpha: number): void {
      if (!sprites) return;
      const pulse = 0.72 + Math.sin(elapsed * 0.7) * 0.12;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 2; i += 1) {
        const cx = width * (0.16 + i * 0.68);
        const cy = height * (0.3 + i * 0.06);
        const size = Math.max(width, height) * (0.5 + i * 0.12) * pulse;
        ctx.globalAlpha = 0.2 * alpha;
        ctx.drawImage(sprites.flare, cx - size / 2, cy - size / 2, size, size);
      }
      ctx.restore();
    }

    function drawAtmosphere(system: CinematicParticleSystem, elapsed: number, alpha: number): void {
      switch (system) {
        case 'embers':
          drawEmbers(elapsed, alpha);
          return;
        case 'beams':
          drawBeams(elapsed, alpha);
          return;
        case 'refraction':
          drawRefraction(elapsed, alpha);
          return;
        case 'bloom':
          drawBloom(elapsed, alpha);
          return;
        default:
          return;
      }
    }

/* ── Viñeta, grano y barras de proyección ────────────────────────────── */
    function drawVignette(): void {
      const fill = gradient('vignette', (context) => {
        const fillStyle = context.createRadialGradient(
          width / 2,
          height * 0.48,
          Math.min(width, height) * 0.24,
          width / 2,
          height * 0.48,
          Math.max(width, height) * 0.8
        );
        fillStyle.addColorStop(0, 'rgba(3, 3, 5, 0)');
        fillStyle.addColorStop(0.62, 'rgba(3, 3, 5, 0.16)');
        fillStyle.addColorStop(1, 'rgba(3, 3, 5, 0.7)');
        return fillStyle;
      });

      if (!fill) return;
      ctx.save();
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    function drawFilmBars(): void {
      const bandHeight = Math.max(1, Math.round(height * 0.055));
      const topFill = gradient('bar-top', (context) => {
        const fillStyle = context.createLinearGradient(0, 0, 0, bandHeight);
        fillStyle.addColorStop(0, 'rgba(3, 3, 5, 0.92)');
        fillStyle.addColorStop(1, 'rgba(3, 3, 5, 0)');
        return fillStyle;
      });
      const bottomFill = gradient('bar-bottom', (context) => {
        const fillStyle = context.createLinearGradient(0, height - bandHeight, 0, height);
        fillStyle.addColorStop(0, 'rgba(3, 3, 5, 0)');
        fillStyle.addColorStop(1, 'rgba(3, 3, 5, 0.95)');
        return fillStyle;
      });

      ctx.save();
      if (topFill) {
        ctx.fillStyle = topFill;
        ctx.fillRect(0, 0, width, bandHeight);
      }
      if (bottomFill) {
        ctx.fillStyle = bottomFill;
        ctx.fillRect(0, height - bandHeight, width, bandHeight);
      }
      ctx.restore();
    }

    function drawGrain(elapsed: number): void {
      if (!grainPattern) return;
      const offset = Math.floor((elapsed * 47) % 160);

      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.06;
      ctx.translate(-offset, -offset);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, width + 160, height + 160);
      ctx.restore();
    }
/* ── Frame completo ──────────────────────────────────────────────────── */
    function draw(signal: {
      progress: number;
      actProgress: number;
      activeAct: number;
      velocity: number;
    }): void {
      if (disposed || width === 0 || height === 0) return;

      const now = performance.now();
      if (now - lastDraw < FRAME_INTERVAL_MS) return;
      lastDraw = now;

      const elapsed = (now - timeOrigin) / 1000;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = BASE_VOID;
      ctx.fillRect(0, 0, width, height);

      const lastIndex = CINEMATIC_FRAMES.length - 1;
      const position = clamp01(signal.progress) * lastIndex;
      const index = Math.min(lastIndex, Math.floor(position));
      const local = position - index;
      const frameA = CINEMATIC_FRAMES[index];

      const plateA = frameA ? resolvePlate(frameA) : null;
      if (frameA && plateA) {
        drawPlate(frameA, plateA, clamp01(local / 0.62), 1);
        drawGrade(frameA, 1);
      }

      if (index < lastIndex) {
        const frameB = CINEMATIC_FRAMES[index + 1];
        const blend = smoothstep(0.55, 1, local);
        const plateB = frameB && blend > 0.001 ? resolvePlate(frameB) : null;
        if (frameB && plateB) {
          drawPlate(frameB, plateB, 0, blend);
          drawGrade(frameB, blend);
        }
      }

      const scene = scenes[signal.activeAct] ?? scenes[0];
      if (scene) {
        const fadeIn = smoothstep(0, 0.16, signal.actProgress);
        const fadeOut = 1 - smoothstep(0.86, 1, signal.actProgress);
        const ambientAlpha = clamp01(fadeIn * fadeOut);
        if (ambientAlpha > 0.001) {
          drawAtmosphere(scene.particles, elapsed, ambientAlpha);
        }
      }

      drawVignette();
      drawGrain(elapsed);
      drawFilmBars();
    }

/* ── Viewport: DPR tope 1.5, cachés invalidadas al cambiar tamaño ────── */
    function resize(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cssWidth = canvas.clientWidth || window.innerWidth;
      const cssHeight = canvas.clientHeight || window.innerHeight;
      const nextWidth = Math.max(1, Math.round(cssWidth * dpr));
      const nextHeight = Math.max(1, Math.round(cssHeight * dpr));

      if (nextWidth === width && nextHeight === height) return;

      width = nextWidth;
      height = nextHeight;
      canvas.width = width;
      canvas.height = height;

      gradients.clear();
      blurredPlates.clear();
      grainPattern = sprites ? ctx.createPattern(sprites.grain, 'repeat') : null;
      lastDraw = 0;
      draw(bus.read());
    }

    /* ── Carga de placas reales (WebP generados por el pipeline) ─────────── */
    for (const frame of CINEMATIC_FRAMES) {
      if (images.has(frame.src)) continue;
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (disposed) return;
        lastDraw = 0;
        draw(bus.read());
      };
      image.src = frame.src;
      images.set(frame.src, image);
    }

    /* ── Sprites procedurales (Worker + OffscreenCanvas, con fallback) ───── */
    void createCinematicSprites().then((set) => {
      if (disposed) return;
      sprites = set;
      grainPattern = ctx.createPattern(set.grain, 'repeat');
      lastDraw = 0;
      draw(bus.read());
    });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
    resizeObserver?.observe(canvas);
    window.addEventListener('resize', resize, { passive: true });

    resize();
    const unsubscribe = bus.subscribe((signal) =>
      draw({
        progress: signal.progress,
        actProgress: signal.actProgress,
        activeAct: signal.activeAct,
        velocity: signal.velocity,
      })
    );

    return () => {
      disposed = true;
      unsubscribe();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      images.clear();
      blurredPlates.clear();
      gradients.clear();
      if (sprites) {
        for (const source of [sprites.ember, sprites.smoke, sprites.grain, sprites.flare]) {
          if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
            source.close();
          }
        }
      }
    };
  }, [bus, scenes]);

  return (
    <div className="absolute inset-0 z-0 bg-[#030305]" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030305_95%)]" />
    </div>
  );
}

export default CinematicCanvasStage;