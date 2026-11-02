"use client";

import React, { useEffect, useState } from 'react';

interface AudioReactiveVisualizerProps {
  isPlaying?: boolean;
  barsCount?: number;
  className?: string;
  theme?: 'gold' | 'cyan' | 'matrix';
  peakDba?: number;
}

/**
 * 🎵 AudioReactiveVisualizer (Telemetry S-Class Ley 37/2003)
 * Muestra el espectro sonoro en tiempo real simulando la calibración 12 W/pax
 * con barras reactivas orgánicas calculadas matemáticamente.
 */
export function AudioReactiveVisualizer({
  isPlaying = true,
  barsCount = 24,
  className = '',
  theme = 'gold',
  peakDba = 82.4,
}: AudioReactiveVisualizerProps) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barsCount }, () => Math.floor(Math.random() * 40) + 15)
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setHeights(prev =>
        prev.map((_, i) => {
          // Curva tipo campana gaussiana centrada con variabilidad
          const center = barsCount / 2;
          const dist = Math.abs(i - center) / center;
          const base = (1 - dist * 0.5) * 65;
          const noise = (Math.sin(Date.now() / 200 + i * 0.7) + 1) * 20;
          return Math.max(10, Math.min(95, Math.floor(base + noise)));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, barsCount]);

  const barColor =
    theme === 'gold'
      ? 'from-[#ecb613] via-amber-300 to-amber-500'
      : theme === 'cyan'
      ? 'from-cyan-400 via-sky-300 to-blue-500'
      : 'from-emerald-400 via-green-300 to-emerald-600';

  return (
    <div
      className={`flex flex-col rounded-2xl border border-white/10 bg-[#060609]/90 p-4 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-mono">
        <span className="flex items-center gap-1.5 text-white/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Telemetría Acústica Ley 37/2003
        </span>
        <span className="font-bold text-[#ecb613]">{peakDba.toFixed(1)} dBA SPL</span>
      </div>

      <div className="mt-3 flex h-14 items-end justify-between gap-1">
        {heights.map((h, idx) => (
          <div
            key={idx}
            className="w-full rounded-t-sm bg-gradient-to-t transition-all duration-150 ease-out"
            style={{
              height: `${h}%`,
              backgroundImage: `linear-gradient(to top, var(--tw-gradient-stops))`,
            }}
          >
            <div
              className={`h-full w-full rounded-t-sm bg-gradient-to-t ${barColor} opacity-85 hover:opacity-100`}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-white/40">
        <span>20 Hz</span>
        <span>Protocolo 12 W/pax · Bose F1</span>
        <span>20 kHz</span>
      </div>
    </div>
  );
}
