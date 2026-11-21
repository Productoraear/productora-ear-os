'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * TABLE GLYPH — MESA CON SILUETAS DE ASIENTOS (SVG INTERACTIVO)
 * ════════════════════════════════════════════════════════════════════════════
 * Una mesa es un SVG, no un `div` redondeado:
 *   · Los asientos se reparten por geometría real (circunferencia en la redonda,
 *     lados largos + cabeceras en la rectangular/presidencial).
 *   · Cada asiento es una zona clicable cuando la mesa está seleccionada, de modo
 *     que se puede sentar a alguien con dedo o con ratón, sin arrastrar.
 *   · El giro se aplica al grupo SVG (`rotate`), así que las siluetas giran con
 *     la mesa y el asiento sigue siendo clicable en la posición correcta.
 *
 * Cero dependencias nuevas: SVG nativo + PointerEvents. Cero emojis (UNSLOP).
 * ════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import {
  DIETARY_INFO,
  GUEST_TAG_STYLE,
  TABLE_METRICS,
  type DietaryTag,
  type SeatingGuest,
  type SeatingTable,
  type TableShape,
} from '@/lib/seating/seating-plan';

export interface TableGlyphProps {
  readonly table: SeatingTable;
  /** Píxeles por metro del tablero. */
  readonly metersToPx: number;
  readonly selected: boolean;
  /** Invitado sentado en cada índice de asiento (`null` = silla libre). */
  readonly occupants: readonly (SeatingGuest | null)[];
  readonly onSelect: (id: string) => void;
  readonly onSeatClick: (tableId: string, seatIndex: number) => void;
  /** Dietas especiales sentadas en esta mesa: cocina de un vistazo en el lienzo. */
  readonly dietary?: readonly DietaryTag[];
}

/** Color sobrio por dieta: un solo tono, sin degradado ni icono (UNSLOP §4). */
const DIETARY_HEX: Readonly<Record<DietaryTag, string>> = Object.freeze({
  celiaco: '#E8B34B',
  vegano: '#7FC28A',
  vegetariano: '#8FC27F',
  'sin-lactosa': '#C9A2D6',
  'alergia-marisco': '#7FB0D6',
  'alergia-frutos-secos': '#D69A7F',
  embarazada: '#9AB8C9',
  infantil: '#A8A29A',
  otro: '#8E8A80',
});

/** Radio del asiento en píxeles. Constante: la silueta no cambia de tamaño. */
const SEAT_RADIUS_PX = 7;
/** Separación entre el borde de la mesa y el centro de su asiento. */
const SEAT_GAP_PX = 11;
/** Aire extra del viewBox para que ninguna silueta quede recortada. */
export const GLYPH_PAD_PX = SEAT_GAP_PX + SEAT_RADIUS_PX;

interface SeatGeometry {
  readonly cx: number;
  readonly cy: number;
}

/**
 * Posición de cada asiento dentro del viewBox de la mesa (sin rotación).
 * Determinista y simétrico: la redonda reparte por ángulo empezando arriba.
 */
export function seatPositions(
  shape: TableShape,
  seats: number,
  width: number,
  height: number,
): readonly SeatGeometry[] {
  if (seats <= 0) return [];
  const halfW = width / 2;
  const halfH = height / 2;

  if (shape === 'round') {
    const radius = halfW + SEAT_GAP_PX;
    return Array.from({ length: seats }, (_unused, index) => {
      // −90° = arriba; el reparto avanza en sentido horario.
      const angle = (index / seats) * Math.PI * 2 - Math.PI / 2;
      return { cx: halfW + Math.cos(angle) * radius, cy: halfH + Math.sin(angle) * radius };
    });
  }

  // Rectangular y presidencial: sillas por los dos lados largos + cabeceras.
  const perSide = Math.max(1, Math.floor((seats - 2) / 2));
  const hasHead = seats - perSide * 2 >= 1;
  const hasFoot = seats - perSide * 2 >= 2;
  const points: SeatGeometry[] = [];
  for (let index = 0; index < perSide; index += 1) {
    const x = ((index + 0.5) / perSide) * width;
    points.push({ cx: x, cy: -SEAT_GAP_PX });
    points.push({ cx: x, cy: height + SEAT_GAP_PX });
  }
  if (hasHead) points.push({ cx: -SEAT_GAP_PX, cy: halfH });
  if (hasFoot) points.push({ cx: width + SEAT_GAP_PX, cy: halfH });
  // Recorte defensivo: nunca más siluetas que plazas declaradas.
  return points.slice(0, seats);
}

export default function TableGlyph({
  table,
  metersToPx,
  selected,
  occupants,
  onSelect,
  onSeatClick,
  dietary = [],
}: TableGlyphProps) {
  const metrics = TABLE_METRICS[table.shape];
  const boxW = Math.round(metrics.width * table.scale * metersToPx);
  const boxH = Math.round(metrics.height * table.scale * metersToPx);
  const viewW = boxW + GLYPH_PAD_PX * 2;
  const viewH = boxH + GLYPH_PAD_PX * 2;
  const seats = seatPositions(table.shape, table.seats, boxW, boxH);

  const occupied = occupants.filter((guest) => guest !== null).length;
  const stroke = selected ? '#ecb613' : 'rgba(236,182,19,0.55)';
  const fill = selected ? 'rgba(236,182,19,0.14)' : 'rgba(236,182,19,0.05)';
  const labelRoom = boxW / 9;
  // Número de mesa: el ordinal de la etiqueta si lo tiene, si no el aforo.
  const tableNumber = table.label.match(/\d+/)?.[0] ?? null;

  return (
    <svg
      viewBox={`${-GLYPH_PAD_PX} ${-GLYPH_PAD_PX} ${viewW} ${viewH}`}
      width={viewW}
      height={viewH}
      className="overflow-visible"
      role="group"
      aria-label={`${table.label}: ${table.seats} plazas, giro ${table.rotation} grados, escala ${table.scale}`}
    >
      <g transform={`rotate(${table.rotation} ${boxW / 2} ${boxH / 2})`}>
        {table.shape === 'round' ? (
          <ellipse
            cx={boxW / 2}
            cy={boxH / 2}
            rx={boxW / 2}
            ry={boxH / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
        ) : (
          <rect
            x={0}
            y={0}
            width={boxW}
            height={boxH}
            rx={table.shape === 'presidential' ? 2 : 5}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
        )}

        {seats.map((seat, index) => {
          const guest = occupants[index] ?? null;
          const seatStroke = guest === null ? '#3f3f46' : GUEST_TAG_STYLE[guest.tag].hex;
          return (
            <g key={`seat-${index}`}>
              <circle
                cx={seat.cx}
                cy={seat.cy}
                r={SEAT_RADIUS_PX}
                fill={guest === null ? '#0a0a0a' : `${seatStroke}33`}
                stroke={seatStroke}
                strokeWidth={1.25}
                opacity={selected ? 1 : 0.8}
              />
              {selected ? (
                <circle
                  cx={seat.cx}
                  cy={seat.cy}
                  r={SEAT_RADIUS_PX + 4}
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerDown={(event) => {
                    // Se corta la propagación para que apuntar a una silla no
                    // inicie un arrastre de la mesa entera.
                    event.stopPropagation();
                    onSeatClick(table.id, index);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSeatClick(table.id, index);
                    }
                  }}
                  aria-label={
                    guest === null
                      ? `Asiento ${index + 1} de ${table.label}: libre`
                      : `Asiento ${index + 1} de ${table.label}: ${guest.name}`
                  }
                />
              ) : null}
            </g>
          );
        })}

        {/* Superficie de arrastre: cubre la mesa, por debajo de las sillas. */}
        <rect
          x={0}
          y={0}
          width={boxW}
          height={boxH}
          fill="transparent"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={() => onSelect(table.id)}
          role="presentation"
        />
      </g>

      {/* Etiqueta FUERA del grupo rotado: nunca se ladea, siempre legible. */}
      <text
        x={boxW / 2}
        y={boxH / 2 - 2}
        textAnchor="middle"
        className="pointer-events-none"
        fontSize={Math.max(9, Math.min(13, labelRoom))}
        fontWeight={800}
        fill="#F4F1EA"
      >
        {tableNumber !== null ? `Mesa ${tableNumber}` : table.label.length > 14 ? `${table.label.slice(0, 13)}…` : table.label}
      </text>
      {/* Aforo estricto y ocupación real: la cifra que usa la brigada de sala. */}
      <text
        x={boxW / 2}
        y={boxH / 2 + 10}
        textAnchor="middle"
        className="pointer-events-none tabular-nums"
        fontSize={Math.max(7, Math.min(9, labelRoom))}
        fill="#ecb613"
      >
        {table.seats} pax, {occupied} sentados
      </text>

      {/* Badges de cocina: dietas especiales de esta mesa, en columna a la izquierda. */}
      {dietary.length > 0
        ? dietary.slice(0, 4).map((tag, index) => (
            <g key={`diet-${tag}`} className="pointer-events-none">
              <rect
                x={2}
                y={2 + index * 12}
                width={14}
                height={11}
                rx={2}
                fill={DIETARY_HEX[tag]}
                fillOpacity={0.16}
                stroke={DIETARY_HEX[tag]}
                strokeWidth={0.75}
              />
              <text
                x={9}
                y={10.5 + index * 12}
                textAnchor="middle"
                fontSize={7}
                fontWeight={700}
                fill={DIETARY_HEX[tag]}
              >
                {DIETARY_INFO[tag].badge}
              </text>
            </g>
          ))
        : null}
    </svg>
  );
}