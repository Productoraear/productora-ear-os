'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING BOARD — PLANO INTERACTIVO (ARRASTRE + EDICIÓN PRECISA)
 * ════════════════════════════════════════════════════════════════════════════
 * Extraído de `SeatingPlanner` para respetar el presupuesto estructural de la
 * directiva §5.4 (CC ≤ 15 · ≤ 200 líneas por función): el auditor CISQ midió el
 * componente monolítico en CC=27 / 442 líneas y obligó a esta partición.
 *
 * Geometría fija (INV-18): el tablero se dimensiona desde el propio estado, de
 * modo que mover una mesa nunca reflota el layout de la página.
 * Arrastre con Pointer Events: un solo código para ratón y dedo.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { TABLE_METRICS, type SeatingPlan, type SeatingTable, type TableShape } from '@/lib/seating/seating-plan';

export interface SeatingBoardProps {
  readonly plan: SeatingPlan;
  readonly metersToPx: number;
  readonly paddingM: number;
  readonly shapeLabel: Readonly<Record<TableShape, string>>;
  readonly onMove: (id: string, x: number, y: number) => void;
  readonly onChangeSeats: (id: string, delta: number) => void;
  readonly onChangeShape: (id: string, shape: TableShape) => void;
  readonly onRemove: (id: string) => void;
}

export default function SeatingBoard({
  plan,
  metersToPx,
  paddingM,
  shapeLabel,
  onMove,
  onChangeSeats,
  onChangeShape,
  onRemove,
}: SeatingBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const maxX = useMemo(
    () => Math.max(8, ...plan.tables.map((table) => table.x + TABLE_METRICS[table.shape].width + paddingM)),
    [plan.tables, paddingM],
  );
  const maxY = useMemo(
    () => Math.max(6, ...plan.tables.map((table) => table.y + TABLE_METRICS[table.shape].height + paddingM)),
    [plan.tables, paddingM],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, table: SeatingTable) => {
      const board = boardRef.current;
      if (board === null) return;
      board.setPointerCapture(event.pointerId);
      const rect = board.getBoundingClientRect();
      dragRef.current = {
        id: table.id,
        offsetX: event.clientX - rect.left - table.x * metersToPx,
        offsetY: event.clientY - rect.top - table.y * metersToPx,
      };
    },
    [metersToPx],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const board = boardRef.current;
      if (drag === null || board === null) return;
      const rect = board.getBoundingClientRect();
      const x = Math.max(0, Math.round(((event.clientX - rect.left - drag.offsetX) / metersToPx) * 10) / 10);
      const y = Math.max(0, Math.round(((event.clientY - rect.top - drag.offsetY) / metersToPx) * 10) / 10);
      onMove(drag.id, x, y);
    },
    [metersToPx, onMove],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const boardStyle = {
    width: Math.round((maxX + paddingM) * metersToPx),
    height: Math.round((maxY + paddingM) * metersToPx),
  };

  return (
    <div className="space-y-4">
      <section className="overflow-x-auto rounded-2xl border border-white/10 bg-[#08080b] p-3">
        <div
          ref={boardRef}
          data-testid="seating-board"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative mx-auto touch-none select-none rounded-xl bg-[#030305]"
          style={boardStyle}
        >
          {/* Rejilla métrica: 1 m por celda. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: `${metersToPx}px ${metersToPx}px`,
            }}
          />

          {plan.tables.map((table) => {
            const metrics = TABLE_METRICS[table.shape];
            return (
              <div
                key={table.id}
                className="absolute"
                style={{
                  left: table.x * metersToPx,
                  top: table.y * metersToPx,
                  width: Math.round(metrics.width * metersToPx),
                  height: Math.round(metrics.height * metersToPx),
                }}
              >
                <button
                  type="button"
                  aria-label={`Mover ${table.label}`}
                  onPointerDown={(event) => handlePointerDown(event, table)}
                  className={`flex h-full w-full cursor-grab flex-col items-center justify-center border transition-colors active:cursor-grabbing ${
                    table.shape === 'round' ? 'rounded-full' : 'rounded-lg'
                  } ${
                    table.seats === 0
                      ? 'border-[#FF2B44]/60 bg-[#FF2B44]/10'
                      : 'border-[#00E5FF]/50 bg-[#00E5FF]/10'
                  }`}
                >
                  <span className="px-1 text-center font-mono text-[10px] font-bold uppercase leading-tight text-white">
                    {table.label}
                  </span>
                  <span className="font-mono text-[9px] text-[#00E5FF]">{table.seats} asientos</span>
                </button>
              </div>
            );
          })}

          {plan.tables.length === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">
              Sin mesas. Añade una redonda, rectangular o presidencial.
            </p>
          ) : null}
        </div>
      </section>

      {/* Edición precisa sin arrastrar: teclado y móvil. */}
      <section className="rounded-2xl border border-white/10">
        <ul className="divide-y divide-white/5">
          {plan.tables.map((table) => (
            <li key={table.id} className="flex flex-wrap items-center gap-3 p-3">
              <span className="min-w-[9rem] text-xs font-bold text-white">{table.label}</span>
              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Tipo
                <select
                  aria-label={`Tipo de ${table.label}`}
                  value={table.shape}
                  onChange={(event) => onChangeShape(table.id, event.target.value as TableShape)}
                  className="rounded-lg border border-white/15 bg-black/60 px-2 py-1 text-[11px] text-white outline-none focus:border-[#00E5FF]"
                >
                  {(['round', 'rectangular', 'presidential'] as const).map((shape) => (
                    <option key={shape} value={shape}>
                      {shapeLabel[shape]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-1.5 print:hidden">
                <button
                  type="button"
                  aria-label={`Quitar un asiento a ${table.label}`}
                  onClick={() => onChangeSeats(table.id, -1)}
                  className="rounded-md border border-white/15 p-1 text-zinc-300 transition-colors hover:border-white/40"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center font-mono text-xs text-white">{table.seats}</span>
                <button
                  type="button"
                  aria-label={`Añadir un asiento a ${table.label}`}
                  onClick={() => onChangeSeats(table.id, 1)}
                  className="rounded-md border border-white/15 p-1 text-zinc-300 transition-colors hover:border-white/40"
                >
                  <Plus size={12} />
                </button>
              </div>
              <span className="font-mono text-[10px] text-zinc-600">
                x {table.x.toFixed(1)} m · y {table.y.toFixed(1)} m
              </span>
              <button
                type="button"
                aria-label={`Eliminar ${table.label}`}
                onClick={() => onRemove(table.id)}
                className="ml-auto rounded-md border border-[#FF2B44]/40 p-1 text-[#FF2B44] transition-colors hover:border-[#FF2B44] print:hidden"
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
        </ul>
        {plan.tables.length === 0 ? (
          <p className="p-4 text-xs text-zinc-500">Todavía no hay mesas en el plano.</p>
        ) : null}
      </section>
    </div>
  );
}
