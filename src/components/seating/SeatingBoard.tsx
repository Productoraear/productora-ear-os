'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING BOARD — PLANO INTERACTIVO (PATRÓN PULPETTI)
 * ════════════════════════════════════════════════════════════════════════════
 * El tablero es un lienzo métrico donde cada elemento se manipula por separado:
 *
 *   · ARRASTRE con Pointer Events (un solo código para ratón, dedo y lápiz) y
 *     `setPointerCapture`: el gesto no se pierde al salirse de la mesa.
 *   · SNAP a una rejilla de 0,5 m (sutil, no rígida: se suelta donde se quiera
 *     y el plano cierra a medio metro).
 *   · SELECCIÓN por clic: la mesa seleccionada se resalta y sus sillas pasan a
 *     ser clicables (asignar/liberar invitados sin salir del lienzo).
 *   · DROP de invitados: soltar un nombre sobre una mesa lo sienta en el primer
 *     hueco libre de esa mesa.
 *
 * Geometría fija (INV-18): el lienzo se dimensiona desde el propio estado, así
 * que mover o girar una mesa NUNCA reflota el layout de la página, y el
 * contenedor reserva un alto mínimo.
 *
 * Cero librerías de arrastre. Cero `any`. Cero emojis.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useMemo, useRef } from 'react';
import {
  effectiveMetrics,
  fixtureMetrics,
  guestAtSeat,
  rotatedBounds,
  type SeatingPlan,
} from '@/lib/seating/seating-plan';
import FixtureGlyph from './FixtureGlyph';
import TableGlyph, { GLYPH_PAD_PX } from './TableGlyph';

/** Rejilla de colocación en metros. 0,5 m = media losa del salón. */
export const SNAP_STEP_M = 0.5;
/** Densidad del tablero: píxeles por metro. */
export const METERS_TO_PX = 46;
/** Margen de respiro del lienzo, en metros. */
export const BOARD_PADDING_M = 2;
/** Alto mínimo reservado: geometría fija aunque el plano esté vacío (INV-18). */
const BOARD_MIN_HEIGHT_PX = 420;
/** Umbral de arrastre en píxeles: por debajo, el gesto es un clic. */
const DRAG_THRESHOLD_PX = 4;

export interface SeatingBoardProps {
  readonly plan: SeatingPlan;
  readonly selectedId: string | null;
  readonly onSelect: (id: string | null) => void;
  /** Movimiento absoluto en metros (el snap ya lo aplica el tablero). */
  readonly onMove: (id: string, x: number, y: number) => void;
  /** Clic sobre una silla de la mesa seleccionada. */
  readonly onSeatClick: (tableId: string, seatIndex: number) => void;
  /** Suelta un invitado sobre una mesa (arrastre desde la lista). */
  readonly onDropGuest: (guestId: string, tableId: string, seatIndex: number) => void;
}

/** Aplica snap a la rejilla. Función pura y exportada para el arnés. */
export function snapToGrid(valueM: number, step = SNAP_STEP_M): number {
  return Math.round(valueM / step) * step;
}

interface DragState {
  readonly id: string;
  /** Desfase puntero↔esquina del elemento, en píxeles. */
  readonly offsetX: number;
  readonly offsetY: number;
  readonly startX: number;
  readonly startY: number;
  moved: boolean;
}

/**
 * Caja del lienzo en píxeles. Se calcula con la caja ENVOLVENTE de cada elemento
 * tras rotar: una mesa a 90° ocupa lo que antes era su alto y, sin esto, el
 * contenedor la recortaría por la derecha.
 */
function boardExtent(plan: SeatingPlan): { readonly width: number; readonly height: number } {
  const boxes = [
    ...plan.tables.map((table) => {
      const bounds = rotatedBounds(effectiveMetrics(table), table.rotation);
      return { right: table.x + bounds.width, bottom: table.y + bounds.height };
    }),
    ...plan.fixtures.map((fixture) => {
      const bounds = rotatedBounds(fixtureMetrics(fixture), fixture.rotation);
      return { right: fixture.x + bounds.width, bottom: fixture.y + bounds.height };
    }),
  ];
  const maxRight = Math.max(8, ...boxes.map((box) => box.right));
  const maxBottom = Math.max(6, ...boxes.map((box) => box.bottom));
  return {
    width: Math.round((maxRight + BOARD_PADDING_M) * METERS_TO_PX),
    height: Math.max(BOARD_MIN_HEIGHT_PX, Math.round((maxBottom + BOARD_PADDING_M) * METERS_TO_PX)),
  };
}

export default function SeatingBoard({
  plan,
  selectedId,
  onSelect,
  onMove,
  onSeatClick,
  onDropGuest,
}: SeatingBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const extent = useMemo(() => boardExtent(plan), [plan]);

  /** Convierte coordenadas de puntero a metros absolutos del lienzo. */
  const pointerToMeters = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const board = boardRef.current;
      if (board === null) return null;
      const rect = board.getBoundingClientRect();
      return { x: (clientX - rect.left) / METERS_TO_PX, y: (clientY - rect.top) / METERS_TO_PX };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>, id: string) => {
      const board = boardRef.current;
      if (board === null) return;
      const spot = pointerToMeters(event.clientX, event.clientY);
      if (spot === null) return;
      onSelect(id);

      const table = plan.tables.find((candidate) => candidate.id === id);
      const fixture = plan.fixtures.find((candidate) => candidate.id === id);
      const originX = table?.x ?? fixture?.x ?? 0;
      const originY = table?.y ?? fixture?.y ?? 0;

      dragRef.current = {
        id,
        offsetX: spot.x - originX,
        offsetY: spot.y - originY,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
      board.setPointerCapture(event.pointerId);
    },
    [onSelect, plan.fixtures, plan.tables, pointerToMeters],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag === null) return;

      // Umbral: un clic con temblor de 2 px no debe mover la mesa.
      if (!drag.moved) {
        const travelled = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (travelled < DRAG_THRESHOLD_PX) return;
        drag.moved = true;
      }

      const spot = pointerToMeters(event.clientX, event.clientY);
      if (spot === null) return;
      // Snap en el propio tablero: el plano "cierra" a medio metro al soltar.
      onMove(
        drag.id,
        Math.max(0, snapToGrid(spot.x - drag.offsetX)),
        Math.max(0, snapToGrid(spot.y - drag.offsetY)),
      );
    },
    [onMove, pointerToMeters],
  );

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const board = boardRef.current;
    if (board !== null && board.hasPointerCapture(event.pointerId)) {
      board.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  }, []);

  /**
   * Drop de invitado sobre una mesa: se sienta en el primer asiento libre. Si la
   * mesa está completa, el motor no cambia nada y el invitado sigue en la lista
   * (no se pierde, no se duplica).
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, tableId: string) => {
      event.preventDefault();
      const guestId = event.dataTransfer.getData('text/ear-guest-id');
      if (guestId === '') return;
      const table = plan.tables.find((candidate) => candidate.id === tableId);
      if (table === undefined) return;
      for (let seat = 0; seat < table.seats; seat += 1) {
        if (guestAtSeat(plan, tableId, seat) === null) {
          onDropGuest(guestId, tableId, seat);
          return;
        }
      }
    },
    [onDropGuest, plan],
  );


  return (
    <section aria-label="Plano interactivo del salón" className="space-y-2 print:hidden">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#08080b] p-3">
        <div
          ref={boardRef}
          data-testid="seating-board"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerDown={(event) => {
            // Clic en el vacío = deseleccionar (gesto esperado en un lienzo).
            if (event.target === event.currentTarget) onSelect(null);
          }}
          className="relative mx-auto touch-none select-none rounded-xl bg-[#030305]"
          style={{ width: extent.width, height: extent.height }}
        >
          {/* Rejilla milimétrica: 1 m fuerte, 0,5 m tenue. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: [
                'linear-gradient(to right, rgba(255,255,255,0.13) 1px, transparent 1px)',
                'linear-gradient(to bottom, rgba(255,255,255,0.13) 1px, transparent 1px)',
                'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)',
                'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
              ].join(', '),
              backgroundSize: [
                `${METERS_TO_PX}px ${METERS_TO_PX}px`,
                `${METERS_TO_PX}px ${METERS_TO_PX}px`,
                `${METERS_TO_PX / 2}px ${METERS_TO_PX / 2}px`,
                `${METERS_TO_PX / 2}px ${METERS_TO_PX / 2}px`,
              ].join(', '),
            }}
          />

          {/* Mobiliario primero: queda por debajo de las mesas. */}
          {plan.fixtures.map((fixture) => (
            <div
              key={fixture.id}
              className="absolute"
              style={{ left: fixture.x * METERS_TO_PX - 4, top: fixture.y * METERS_TO_PX - 4 }}
              data-fixture-id={fixture.id}
              onPointerDown={(event) => handlePointerDown(event, fixture.id)}
            >
              <FixtureGlyph
                fixture={fixture}
                metersToPx={METERS_TO_PX}
                selected={selectedId === fixture.id}
                onSelect={onSelect}
              />
            </div>
          ))}

          {plan.tables.map((table) => {
            const occupants = Array.from({ length: table.seats }, (_unused, seat) =>
              guestAtSeat(plan, table.id, seat),
            );
            return (
              <div
                key={table.id}
                className="absolute"
                style={{
                  left: table.x * METERS_TO_PX - GLYPH_PAD_PX,
                  top: table.y * METERS_TO_PX - GLYPH_PAD_PX,
                }}
                data-table-id={table.id}
                onPointerDown={(event) => handlePointerDown(event, table.id)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(event) => handleDrop(event, table.id)}
              >
                <TableGlyph
                  table={table}
                  metersToPx={METERS_TO_PX}
                  selected={selectedId === table.id}
                  occupants={occupants}
                  onSelect={onSelect}
                  onSeatClick={onSeatClick}
                />
              </div>
            );
          })}

          {plan.tables.length === 0 && plan.fixtures.length === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-zinc-500">
              Sin mesas. Añade una redonda, rectangular o presidencial, o una zona de evento.
            </p>
          ) : null}
        </div>
      </div>

      <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
        arrastra para mover · snap {SNAP_STEP_M} m · selecciona una mesa para sentar invitados en sus sillas
      </p>
    </section>
  );
}

