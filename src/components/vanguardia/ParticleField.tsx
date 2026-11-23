'use client';

import React, { useEffect, useRef } from 'react';

export interface ParticleFieldProps {
  /** Numero de particulas (acotado a 8..120). */
  count: number;
  /** Canales RGB "r,g,b" del color de las particulas. */
  rgb: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

function createParticles(count: number, width: number, height: number): Particle[] {
  const list: Particle[] = [];
  for (let i = 0; i < count; i += 1) {
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
}

/**
 * Lienzo de particulas sutiles. Pausa fuera de viewport (IntersectionObserver),
 * en pestana oculta y con prefers-reduced-motion (render estatico de un solo frame).
 */
export default function ParticleField({ count, rgb }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const total = Math.min(120, Math.max(8, Math.round(count)));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;

    const draw = (animate: boolean): void => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -4) p.y = height + 4;
          if (p.x < -4) p.x = width + 4;
          if (p.x > width + 4) p.x = -4;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.a})`;
        ctx.fill();
      }
    };

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(total, width, height);
      draw(false);
    };

    const loop = (): void => {
      if (visible && !document.hidden) draw(true);
      frame = window.requestAnimationFrame(loop);
    };

    resize();
    if (!reduceMotion) frame = window.requestAnimationFrame(loop);

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [count, rgb]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
