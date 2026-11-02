"use client";

import React from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'frosted' | 'deep' | 'specular';
  accent?: 'gold' | 'cyan' | 'ruby';
}

const ACCENT_STYLES = {
  gold: 'border-[#ecb613]/20 shadow-[0_30px_90px_-20px_rgba(236,182,19,0.15)]',
  cyan: 'border-cyan-400/20 shadow-[0_30px_90px_-20px_rgba(0,229,255,0.15)]',
  ruby: 'border-rose-500/20 shadow-[0_30px_90px_-20px_rgba(255,43,68,0.15)]',
};

/**
 * 🧊 LiquidGlassCard (Harvested from HorizonX Liquid Glass Architecture)
 * Cristal líquido cinemático con reflejo especular sobre fondo OLED puro.
 */
export function LiquidGlassCard({
  children,
  className = '',
  variant = 'frosted',
  accent = 'gold',
}: LiquidGlassCardProps) {
  const accentClass = ACCENT_STYLES[accent];

  const variantClass =
    variant === 'frosted'
      ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl'
      : variant === 'deep'
      ? 'bg-gradient-to-b from-[#0c0c12]/90 to-[#050508]/95 backdrop-blur-3xl'
      : 'bg-gradient-to-tr from-white/[0.12] via-white/[0.04] to-transparent backdrop-blur-xl';

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border ${accentClass} ${variantClass} p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/30 ${className}`}
    >
      {/* Specular Top Reflection Bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
      />

      {/* Atmospheric Mesh Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl transition-transform duration-700 group-hover:scale-125"
      />

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
