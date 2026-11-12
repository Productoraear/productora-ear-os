'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEAT TOOLBAR — CONTROL INDIVIDUAL DEL ELEMENTO SELECCIONADO
 * ════════════════════════════════════════════════════════════════════════════
 * Aparece SÓLO cuando hay un elemento seleccionado: la UI no enseña controles
 * que no aplican (menos ruido, menos clics muertos, INV-09).
 *
 * Controles de mesa:
 *   1. Rotación  — pasos de 45°, giro libre (slider 0–359) y vuelta a 0°.
 *   2. Plazas    — +/− de 2 a 12 (el motor acota; aquí sólo se pide).
 *   3. Tamaño    — −/+ de escala 0,60–1,80.
 *   4. Tipología — redonda / rectangular / presidencial (conserva plazas).
 *   5. Etiqueta  — renombrado en línea.
 *
 * Controles de mobiliario: rotación y tamaño (el tipo lo fija el botón que lo
 * crea; cambiarlo sería crear otro objeto).
 *
 * Cero aritmética de dinero. Cero emojis. Iconos `lucide-react` a 1.5 px.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { Minus, Plus, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import {
  ELEMENT_SCALE_STEP,
  MAX_ELEMENT_SCALE,
  MIN_ELEMENT_SCALE,
  type SeatingFixture,
  type SeatingTable,
  type TableShape,
  tableSeatRange,
} from '@/lib/seating/seating-plan';

export interface SelectionDescriptor {
  readonly kind: 'table' | 'fixture';
  readonly id: string;
  readonly label: string;
  readonly rotation: number;
  readonly scale: number;
}

export interface SeatToolbarProps {
  readonly selection: SelectionDescriptor | null;
  /** Mesa seleccionada (si la selección es una mesa). */
  readonly table: SeatingTable | null;
  /** Objeto de mobiliario seleccionado (si la selección es mobiliario). */
  readonly fixture: SeatingFixture | null;
  readonly shapeLabel: Readonly<Record<TableShape, string>>;
  readonly onRotate: (id: string, deg: number) => void;
  readonly onRotateBy: (id: string, delta: number) => void;
  readonly onScale: (id: string, scale: number) => void;
  readonly onChangeSeats: (id: string, delta: number) => void;
  readonly onChangeShape: (id: string, shape: TableShape) => void;
  readonly onRename: (id: string, label: string) => void;
  readonly onRemove: (id: string) => void;
  readonly onDeselect: () => void;
}

/** Botón de icono del grupo de control. Un solo tamaño, un solo radio. */
function IconButton({
  label,
  onClick,
  children,
  tone = 'neutral',
  disabled = false,
}: {
  readonly label: string;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
  readonly tone?: 'neutral' | 'danger';
  readonly disabled?: boolean;
}) {
  const palette =
    tone === 'danger'
      ? 'border-[#FF2B44]/40 text-[#FF2B44] hover:border-[#FF2B44]'
      : 'border-white/15 text-zinc-300 hover:border-white/40 hover:text-white';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${palette}`}
    >
      {children}
    </button>
  );
}

/** Cabecera común de la toolbar. */
function ToolbarHeader({ selection, onDeselect }: { readonly selection: SelectionDescriptor; readonly onDeselect: () => void }) {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-3">
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ecb613]">
        {selection.kind === 'table' ? 'Mesa seleccionada' : 'Zona seleccionada'}
      </span>
      <span className="font-syne text-sm font-black uppercase tracking-tight text-white">{selection.label}</span>
      <button
        type="button"
        onClick={onDeselect}
        className="ml-auto font-mono text-[10px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-white"
      >
        Cerrar
      </button>
    </header>
  );
}

/** Grupo rotulado de controles. */
function ControlGroup({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{title}</p>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

/** Bloque de rotación: giro absoluto + incremento + reset + giro libre. */
function RotationControls({
  id,
  rotation,
  onRotate,
  onRotateBy,
}: {
  readonly id: string;
  readonly rotation: number;
  readonly onRotate: (id: string, deg: number) => void;
  readonly onRotateBy: (id: string, delta: number) => void;
}) {
  return (
    <ControlGroup title={`Rotación · ${rotation}°`}>
      <IconButton label="Girar 45 grados a la izquierda" onClick={() => onRotateBy(id, -45)}>
        <RotateCcw size={12} strokeWidth={1.75} />
      </IconButton>
      {([0, 90, 180, 270] as const).map((deg) => (
        <button
          key={deg}
          type="button"
          onClick={() => onRotate(id, deg)}
          aria-pressed={rotation === deg}
          className={`rounded-md border px-2 py-1 font-mono text-[10px] transition-colors ${
            rotation === deg
              ? 'border-[#ecb613] text-[#ecb613]'
              : 'border-white/15 text-zinc-400 hover:border-white/40 hover:text-white'
          }`}
        >
          {deg}°
        </button>
      ))}
      <IconButton label="Girar 45 grados a la derecha" onClick={() => onRotateBy(id, 45)}>
        <RotateCw size={12} strokeWidth={1.75} />
      </IconButton>
      <label className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
        Libre
        <input
          type="range"
          min={0}
          max={359}
          step={15}
          value={rotation}
          onChange={(event) => onRotate(id, Number(event.target.value))}
          aria-label="Giro libre en grados"
          className="h-1 w-24 cursor-pointer accent-[#ecb613]"
        />
      </label>
    </ControlGroup>
  );
}

/** Bloque de tamaño: escala proporcional 0,60–1,80. */
function ScaleControls({
  id,
  scale,
  onScale,
}: {
  readonly id: string;
  readonly scale: number;
  readonly onScale: (id: string, scale: number) => void;
}) {
  const step = (delta: number): void => {
    // Se redondea a 2 decimales para no arrastrar error de coma flotante.
    onScale(id, Math.round((scale + delta) * 100) / 100);
  };
  return (
    <ControlGroup title="Tamaño">
      <IconButton label="Reducir tamaño" onClick={() => step(-ELEMENT_SCALE_STEP)} disabled={scale <= MIN_ELEMENT_SCALE}>
        <Minus size={12} strokeWidth={1.75} />
      </IconButton>
      <span className="w-12 text-center font-mono text-[11px] text-white">{Math.round(scale * 100)} %</span>
      <IconButton label="Aumentar tamaño" onClick={() => step(ELEMENT_SCALE_STEP)} disabled={scale >= MAX_ELEMENT_SCALE}>
        <Plus size={12} strokeWidth={1.75} />
      </IconButton>
    </ControlGroup>
  );
}

/** Bloque de plazas: +/− acotado al rango del elemento (2–12). */
function SeatControls({
  table,
  onChangeSeats,
}: {
  readonly table: SeatingTable;
  readonly onChangeSeats: (id: string, delta: number) => void;
}) {
  const range = tableSeatRange(table.shape);
  return (
    <ControlGroup title={`Plazas · ${range.min}–${range.max}`}>
      <IconButton
        label={`Quitar una plaza a ${table.label}`}
        onClick={() => onChangeSeats(table.id, -1)}
        disabled={table.seats <= range.min}
      >
        <Minus size={12} strokeWidth={1.75} />
      </IconButton>
      <span className="w-8 text-center font-mono text-[13px] font-bold text-white">{table.seats}</span>
      <IconButton
        label={`Añadir una plaza a ${table.label}`}
        onClick={() => onChangeSeats(table.id, 1)}
        disabled={table.seats >= range.max}
      >
        <Plus size={12} strokeWidth={1.75} />
      </IconButton>
    </ControlGroup>
  );
}

export default function SeatToolbar({
  selection,
  table,
  fixture,
  shapeLabel,
  onRotate,
  onRotateBy,
  onScale,
  onChangeSeats,
  onChangeShape,
  onRename,
  onRemove,
  onDeselect,
}: SeatToolbarProps) {
  if (selection === null) {
    return (
      <section
        aria-live="polite"
        className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 print:hidden"
      >
        <p className="text-xs text-zinc-500">
          Selecciona una mesa o una zona del plano para rotarla, cambiar sus plazas o su tamaño.
        </p>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="space-y-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 print:hidden">
      <ToolbarHeader selection={selection} onDeselect={onDeselect} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RotationControls id={selection.id} rotation={selection.rotation} onRotate={onRotate} onRotateBy={onRotateBy} />
        <ScaleControls id={selection.id} scale={selection.scale} onScale={onScale} />

        {table !== null ? (
          <>
            <SeatControls table={table} onChangeSeats={onChangeSeats} />
            <ControlGroup title="Tipología">
              {(['round', 'rectangular', 'presidential'] as const).map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => onChangeShape(table.id, shape)}
                  aria-pressed={table.shape === shape}
                  className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    table.shape === shape
                      ? 'border-[#00E5FF] text-[#00E5FF]'
                      : 'border-white/15 text-zinc-400 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {shapeLabel[shape]}
                </button>
              ))}
            </ControlGroup>
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
        {table !== null ? (
          <label className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Etiqueta</span>
            <input
              type="text"
              value={table.label}
              maxLength={40}
              onChange={(event) => onRename(table.id, event.target.value)}
              aria-label="Nombre de la mesa"
              className="w-44 rounded-md border border-white/15 bg-black/60 px-2 py-1 font-mono text-[11px] text-white outline-none focus:border-[#00E5FF]"
            />
          </label>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            {fixture !== null ? 'Zona de evento' : ''}
          </span>
        )}

        <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-zinc-600">
          giro {selection.rotation}° · escala {Math.round(selection.scale * 100)} %
        </span>
        <IconButton label={`Eliminar ${selection.label} del plano`} onClick={() => onRemove(selection.id)} tone="danger">
          <Trash2 size={12} strokeWidth={1.75} />
        </IconButton>
      </div>
    </section>
  );
}