'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { TensorComponent } from './astraTensorMatch';

/**
 * POLÍGONO SAGRADO — ROMBO DE AFINIDAD CUÁNTICA (RADAR SPIDER CHART SVG)
 * Sustituye los textos planos de porcentaje por una malla holográfica de 4 ejes
 * (Estilo · Acústica · Logística · Disponibilidad ACID). Cada vértice es la señal
 * real 0..1 del `astraTensorMatch.ts` (cero datos inventados).
 *  - Los scores se interpolan con easeOutCubic a 60 fps (requestAnimationFrame).
 *  - Cuando el score es Élite (>95%), el rombo se ilumina y pulsa suavemente.
 */

/** Ejes N·E·S·O formando un rombo (diamante) holográfico. */
const AXES: ReadonlyArray<{ xDir: number; yDir: number }> = [
  { xDir: 0, yDir: -1 }, // Norte — ESTILO
  { xDir: 1, yDir: 0 }, // Este  — ACÚSTICA
  { xDir: 0, yDir: 1 }, // Sur   — LOGÍSTICA
  { xDir: -1, yDir: 0 }, // Oeste — DISP. ACID
];

const CX = 100;
const CY = 100;
const RADIUS = 58;
const LABEL_RADIUS = 82;

const GOLD = '#ecb613';
const GOLD_BRIGHT = '#f5c538';
const CYAN = '#00E5FF';

interface Vec2 {
  readonly x: number;
  readonly y: number;
}

function pointAt(radius: number, xDir: number, yDir: number): Vec2 {
  return { x: CX + radius * xDir, y: CY + radius * yDir };
}

function polygonPoints(radii: ReadonlyArray<number>): string {
  return radii
    .map((r, i) => {
      const axis = AXES[i] ?? AXES[0];
      const p = pointAt(r, axis.xDir, axis.yDir);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(' ');
}

function ringPoints(radius: number): string {
  return AXES.map((axis) => {
    const p = pointAt(radius, axis.xDir, axis.yDir);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(' ');
}

/** Interpola los 4 scores del tensor con easeOutCubic a 60 fps. */
function useAnimatedScores(
  components: readonly TensorComponent[],
  durationMs = 700
): ReadonlyArray<number> {
  const [display, setDisplay] = useState<ReadonlyArray<number>>(() =>
    components.map((c) => c.score)
  );
  const fromRef = useRef<ReadonlyArray<number>>(components.map((c) => c.score));

  useEffect(() => {
    const targets = components.map((c) => c.score);
    const from = fromRef.current;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = targets.map((target, i) => {
        const a = from[i] ?? 0;
        return a + (target - a) * eased;
      });
      fromRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [components, durationMs]);

  return display;
}

export default function AstraTensorSpiderChart({
  components,
  isElite,
  percent,
  className = '',
}: {
  components: readonly TensorComponent[];
  isElite: boolean;
  percent: number;
  className?: string;
}) {
  const scores = useAnimatedScores(components);
  const radii = scores.map((s) => Math.max(0.02, Math.min(1, s)) * RADIUS);

  const dataPoints = radii.map((r, i) => {
    const axis = AXES[i] ?? AXES[0];
    return pointAt(r, axis.xDir, axis.yDir);
  });

  const labelAnchors: ReadonlyArray<'middle' | 'start' | 'end'> = [
    'middle',
    'start',
    'middle',
    'end',
  ];

  const labelPositions = components.map((_, i) => {
    const axis = AXES[i] ?? AXES[0];
    return pointAt(LABEL_RADIUS, axis.xDir, axis.yDir);
  });

  return (
    <div
      className={`relative rounded-2xl bg-[#09090d]/80 border backdrop-blur-md p-2.5 transition-all duration-300 ease-out ${
        isElite ? 'border-[#ecb613]/50' : 'border-white/10'
      } ${className}`}
      style={isElite ? { boxShadow: '0 0 28px rgba(236,182,19,0.22)' } : undefined}
    >
      <style>{`
        @keyframes sagrado-breathe {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        .sagrado-breathe { animation: sagrado-breathe 2.6s ease-in-out infinite; }
      `}</style>

      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={`Polígono Sagrado de afinidad cuántica: ${percent}% (${isElite ? 'élite' : 'en análisis'})`}
        className="w-full h-auto select-none"
      >
        <defs>
          <radialGradient id="sagrado-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.28" />
            <stop offset="70%" stopColor={GOLD} stopOpacity="0.06" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <filter id="sagrado-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Núcleo radial */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="url(#sagrado-core)" />

        {/* Anillos (malla holográfica) */}
        {[0.33, 0.66, 1].map((f) => (
          <polygon
            key={f}
            points={ringPoints(RADIUS * f)}
            fill="none"
            stroke={isElite ? 'rgba(236,182,19,0.28)' : 'rgba(255,255,255,0.10)'}
            strokeWidth={f === 1 ? 1 : 0.6}
            strokeDasharray={f === 1 ? '2 3' : undefined}
          />
        ))}

        {/* Ejes */}
        {AXES.map((axis, i) => {
          const tip = pointAt(RADIUS, axis.xDir, axis.yDir);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={tip.x}
              y2={tip.y}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={0.6}
            />
          );
        })}

        {/* Resplandor del polígono cuando es élite */}
        {isElite && (
          <polygon
            points={polygonPoints(radii)}
            fill="none"
            stroke={GOLD}
            strokeWidth={3}
            filter="url(#sagrado-glow)"
            className="sagrado-breathe"
            opacity={0.7}
          />
        )}

        {/* Polígono de datos (rombo dorado) */}
        <polygon
          points={polygonPoints(radii)}
          fill={isElite ? 'rgba(236,182,19,0.22)' : 'rgba(236,182,19,0.10)'}
          stroke={isElite ? GOLD_BRIGHT : GOLD}
          strokeWidth={1.6}
          strokeLinejoin="round"
          style={{ transition: 'fill 300ms ease-out, stroke 300ms ease-out' }}
        />

        {/* Vértices */}
        {dataPoints.map((p, i) => {
          const hot = (components[i]?.score ?? 0) >= 0.9;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hot ? 3.4 : 2.4}
              fill={hot ? GOLD_BRIGHT : GOLD}
              stroke={isElite ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)'}
              strokeWidth={0.6}
              className={isElite ? 'sagrado-breathe' : undefined}
            />
          );
        })}

        {/* Centro */}
        <circle cx={CX} cy={CY} r={2} fill={isElite ? GOLD_BRIGHT : CYAN} opacity={0.9} />

        {/* Etiquetas de ejes con score real */}
        {components.map((component, i) => {
          const pos = labelPositions[i] ?? { x: CX, y: CY };
          const anchor = labelAnchors[i] ?? 'middle';
          const hot = component.score >= 0.9;
          const labelColor = hot ? GOLD_BRIGHT : 'rgba(255,255,255,0.55)';
          const pct = Math.round(component.score * 100);
          return (
            <text
              key={component.key}
              x={pos.x}
              y={pos.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={7.5}
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontWeight={700}
              fill={labelColor}
              letterSpacing="0.02em"
            >
              {component.label} {pct}%
            </text>
          );
        })}
      </svg>
    </div>
  );
}
