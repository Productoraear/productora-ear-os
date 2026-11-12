'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * FIXTURE GLYPH — MOBILIARIO Y ZONAS DE EVENTO
 * ════════════════════════════════════════════════════════════════════════════
 * Cuatro objetos esenciales de boda (pista, tarta/regalos, barra, escenario).
 * Se dibujan con trama propia para que en una impresión en blanco y negro se
 * distingan sin depender del color: la pista lleva damero, el escenario líneas
 * verticales, la barra líneas horizontales y la tarta un rombo central.
 *
 * Sin emojis (UNSLOP §2): la identidad visual es geometría, no pictogramas.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useId } from 'react';
import { FIXTURE_SPEC, type FixtureKind, type SeatingFixture } from '@/lib/seating/seating-plan';

export interface FixtureGlyphProps {
  readonly fixture: SeatingFixture;
  readonly metersToPx: number;
  readonly selected: boolean;
  readonly onSelect: (id: string) => void;
}

/** Acento por objeto: un solo color, sin degradados (UNSLOP §4). */
const FIXTURE_ACCENT: Readonly<Record<FixtureKind, string>> = Object.freeze({
  dancefloor: '#00E5FF',
  cakeTable: '#f4a1c0',
  bar: '#ecb613',
  stage: '#8b8bf5',
});

export default function FixtureGlyph({ fixture, metersToPx, selected, onSelect }: FixtureGlyphProps) {
  const spec = FIXTURE_SPEC[fixture.kind];
  const boxW = Math.round(spec.width * fixture.scale * metersToPx);
  const boxH = Math.round(spec.height * fixture.scale * metersToPx);
  const accent = FIXTURE_ACCENT[fixture.kind];
  const patternId = useId().replace(/:/g, '');

  return (
    <svg
      viewBox={`-4 -4 ${boxW + 8} ${boxH + 8}`}
      width={boxW + 8}
      height={boxH + 8}
      className="overflow-visible"
      role="group"
      aria-label={`${fixture.label} (${Math.round(spec.width * fixture.scale * 10) / 10} × ${Math.round(spec.height * fixture.scale * 10) / 10} m)`}
    >
      <defs>
        {fixture.kind === 'dancefloor' ? (
          <pattern id={patternId} width={8} height={8} patternUnits="userSpaceOnUse">
            <rect width={8} height={8} fill="rgba(0,229,255,0.10)" />
            <rect width={4} height={4} fill="rgba(0,229,255,0.22)" />
          </pattern>
        ) : null}
        {fixture.kind === 'stage' ? (
          <pattern id={patternId} width={6} height={6} patternUnits="userSpaceOnUse">
            <rect width={6} height={6} fill="rgba(139,139,245,0.10)" />
            <rect width={2} height={6} fill="rgba(139,139,245,0.30)" />
          </pattern>
        ) : null}
        {fixture.kind === 'bar' ? (
          <pattern id={patternId} width={6} height={6} patternUnits="userSpaceOnUse">
            <rect width={6} height={6} fill="rgba(236,182,19,0.10)" />
            <rect width={6} height={2} fill="rgba(236,182,19,0.30)" />
          </pattern>
        ) : null}
      </defs>

      <g transform={`rotate(${fixture.rotation} ${boxW / 2} ${boxH / 2})`}>
        <rect
          x={0}
          y={0}
          width={boxW}
          height={boxH}
          rx={fixture.kind === 'dancefloor' ? 3 : 4}
          fill={fixture.kind === 'cakeTable' ? 'rgba(244,161,192,0.10)' : `url(#${patternId})`}
          stroke={selected ? '#ffffff' : accent}
          strokeWidth={selected ? 2 : 1.5}
          strokeDasharray={fixture.kind === 'cakeTable' ? '4 3' : undefined}
        />
        {fixture.kind === 'cakeTable' ? (
          <path
            d={`M ${boxW / 2} ${boxH / 2 - 7} L ${boxW / 2 + 7} ${boxH / 2} L ${boxW / 2} ${boxH / 2 + 7} L ${boxW / 2 - 7} ${boxH / 2} Z`}
            fill="rgba(244,161,192,0.35)"
            stroke="#f4a1c0"
            strokeWidth={1}
          />
        ) : null}
        <rect
          x={0}
          y={0}
          width={boxW}
          height={boxH}
          fill="transparent"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={() => onSelect(fixture.id)}
          role="presentation"
        />
      </g>

      <text
        x={boxW / 2}
        y={boxH - 6}
        textAnchor="middle"
        className="pointer-events-none font-mono uppercase"
        fontSize={Math.max(7, Math.min(10, boxW / 16))}
        fill="#e4e4e7"
        letterSpacing="0.08em"
      >
        {fixture.label.length > 22 ? `${fixture.label.slice(0, 21)}…` : fixture.label}
      </text>
    </svg>
  );
}