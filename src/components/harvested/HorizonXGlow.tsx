"use client";

import React, { useRef, useState, useCallback } from 'react';

interface HorizonXGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'cyan' | 'ruby' | 'emerald';
  intensity?: 'subtle' | 'medium' | 'high';
  bordered?: boolean;
}

const GLOW_COLORS = {
  gold: {
    radial: 'rgba(236, 182, 19, 0.18)',
    border: 'rgba(236, 182, 19, 0.4)',
    beam: 'from-amber-400 via-[#ecb613] to-transparent',
  },
  cyan: {
    radial: 'rgba(0, 229, 255, 0.18)',
    border: 'rgba(0, 229, 255, 0.4)',
    beam: 'from-cyan-400 via-sky-500 to-transparent',
  },
  ruby: {
    radial: 'rgba(255, 43, 68, 0.18)',
    border: 'rgba(255, 43, 68, 0.4)',
    beam: 'from-rose-500 via-red-600 to-transparent',
  },
  emerald: {
    radial: 'rgba(16, 185, 129, 0.18)',
    border: 'rgba(16, 185, 129, 0.4)',
    beam: 'from-emerald-400 via-green-500 to-transparent',
  },
};

/**
 * ⚡ HorizonX Glow Container (Harvested S-Class Architecture)
 * Genera un halo cinemático de puntero sobre fondos OLED sin dependencias externas.
 */
export function HorizonXGlow({
  children,
  className = '',
  glowColor = 'gold',
  intensity = 'medium',
  bordered = true,
}: HorizonXGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const config = GLOW_COLORS[glowColor];
  const radius = intensity === 'subtle' ? 180 : intensity === 'medium' ? 260 : 360;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl bg-[#08080d]/90 backdrop-blur-xl transition-all duration-300 ${
        bordered ? 'border border-white/10 hover:border-white/20' : ''
      } ${className}`}
    >
      {/* Dynamic Cursor Reactive Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, ${config.radial}, transparent 70%)`,
        }}
      />

      {/* Specular border accent on hover */}
      {bordered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: `inset 0 0 0 1px ${config.border}`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

