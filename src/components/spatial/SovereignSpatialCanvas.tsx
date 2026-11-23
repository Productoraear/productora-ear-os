'use client';

import React, { useEffect, useRef } from 'react';

export interface SovereignSpatialCanvasProps {
  /** NÃºmero de partÃ­culas. Se acota a 24..120 para acotar el presupuesto de CPU. */
  count?: number;
  /** Canales RGB "r,g,b" del color de las partÃ­culas. Por defecto Oro Mate. */
  rgb?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

const MIN_PARTICLES = 24;
const MAX_PARTICLES = 120;
const POINTER_RADIUS = 120;
const POINTER_FORCE = 0.6;
const MAX_DPR = 2;
const SCROLL_DRIFT = 0.15;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function clampCount(count: number): number {
  return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round(count)));
}

/**
 * Capa 0 Â· Lienzo volumÃ©trico 2D sobre #030305.
 * - Pausa el bucle rAF fuera de viewport (IntersectionObserver) y en pestaÃ±a oculta.
 * - prefers-reduced-motion: no arranca rAF y CSS (`motion-reduce:`) muestra un degradado estÃ¡tico.
 * - Solo escribe en canvas; ningÃºn cambio de geometrÃ­a del DOM (CLS 0).
 */
export default function SovereignSpatialCanvas({
  count = 80,
  rgb = '236,182,19',
  className,
}: SovereignSpatialCanvasProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const total = clampCount(count);
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let scrollOffset = 0;
    let frame = 0;
    let running = false;
    let inView = false;

    const createParticles = (): Particle[] => {
      const list: Particle[] = [];
      for (let i = 0; i < total; i += 1) {
        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -0.05 - Math.random() * 0.16,
          r: 0.6 + Math.random() * 1.4,
          a: 0.15 + Math.random() * 0.45,
        });
      }
      return list;
    };

    const paint = (): void => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < POINTER_RADIUS) {
            const force = (1 - dist / POINTER_RADIUS) * POINTER_FORCE;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) p.y = height + 4;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const shiftedY = p.y - scrollOffset * SCROLL_DRIFT;
        const drawY = ((shiftedY % height) + height) % height;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.a})`;
        ctx.fill();
      }
    };

    const tick = (): void => {
      if (!running) return;
      if (!inView || document.hidden) {
        running = false;
        return;
      }
      paint();
      frame = window.requestAnimationFrame(tick);
    };

    const start = (): void => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };

    const resize = (): void => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles();
      if (!running) paint();
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') return;
      const rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = (): void => {
      pointer.active = false;
    };
    const onScroll = (): void => {
      scrollOffset = window.scrollY;
    };
    const onVisibility = (): void => {
      if (!document.hidden && inView) start();
    };

    resize();

    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      if (inView) start();
    });
    observer.observe(container);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, rgb]);

  return (
    <div ref={containerRef} className={`absolute inset-0 z-0 overflow-hidden bg-[#030305] ${className ?? ''}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top,rgba(236,182,19,0.18),#030305_70%)] motion-reduce:block"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full motion-reduce:hidden" />
    </div>
  );
}
