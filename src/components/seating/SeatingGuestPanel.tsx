'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING GUEST PANEL — LISTA DE INVITADOS RETRÁCTIL
 * ════════════════════════════════════════════════════════════════════════════
 * Entrada rápida (Enter añade), etiqueta por color y RSVP en un clic.
 *
 * Lo que hace de verdad:
 *   · Alta de invitado con etiqueta (`Novia / Novio / Amigos / Niños / VIP`).
 *   · Contador de aforo EN VIVO: asientos montados · sentados · confirmados.
 *   · Asignación directa al asiento elegido en el plano y arrastre al asiento
 *     (HTML5 DnD sobre el tablero, `dataTransfer` con el id del invitado).
 *   · Auto-colocación determinista de todos los que están sin asiento.
 *
 * Anti-fachada (AF-1): si un invitado no cabe, se declara el sobrante exacto.
 * Ningún número de esta pieza es estimado: todos salen de `tallyGuests`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Users, Wand2, X } from 'lucide-react';
import {
  GUEST_TAGS,
  GUEST_TAG_STYLE,
  type GuestTag,
  type SeatingGuest,
  type SeatingPlan,
  type SeatingTable,
} from '@/lib/seating/seating-plan';

export interface SeatingGuestPanelProps {
  readonly plan: SeatingPlan;
  readonly tally: {
    readonly listed: number;
    readonly seated: number;
    readonly confirmed: number;
    readonly confirmedSeated: number;
    readonly freeSeats: number;
  };
  readonly open: boolean;
  readonly onToggle: () => void;
  readonly onAddGuest: (name: string, tag: GuestTag) => void;
  readonly onRemoveGuest: (id: string) => void;
  readonly onToggleRsvp: (guest: SeatingGuest) => void;
  readonly onUnseat: (id: string) => void;
  readonly onAutoSeat: () => void;
  /** Sentar al invitado en el primer hueco libre de la mesa indicada. */
  readonly onSeatInFirstFree: (guestId: string, tableId: string) => void;
}

/** Punto de color de la etiqueta. Un solo color por categoría. */
function TagDot({ tag }: { readonly tag: GuestTag }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: GUEST_TAG_STYLE[tag].hex }}
    />
  );
}

/** Contador de aforo en vivo. Cuatro cifras, ninguna estimada. */
function TallyBar({ tally }: { readonly tally: SeatingGuestPanelProps['tally'] }) {
  const items = [
    { label: 'Asientos', value: tally.seated + tally.freeSeats, tone: 'text-white' },
    { label: 'Sentados', value: tally.seated, tone: 'text-[#00E5FF]' },
    { label: 'RSVP', value: tally.confirmed, tone: 'text-[#57d99a]' },
    { label: 'Libres', value: tally.freeSeats, tone: 'text-zinc-400' },
  ];
  return (
    <dl className="grid grid-cols-4 gap-2 rounded-xl border border-white/10 bg-black/40 p-2.5">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <dd className={`font-mono text-sm font-bold ${item.tone}`}>{item.value}</dd>
          <dt className="font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-500">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Formulario de alta rápida: nombre + etiqueta, Enter para añadir. */
function QuickAddForm({ onAddGuest }: { readonly onAddGuest: (name: string, tag: GuestTag) => void }) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState<GuestTag>('amigos');

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (name.trim().length === 0) return;
    onAddGuest(name, tag);
    setName('');
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-1.5">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre del invitado"
          maxLength={40}
          aria-label="Nombre del invitado"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-[#00E5FF]"
        />
        <button
          type="submit"
          aria-label="Añadir invitado a la lista"
          className="rounded-lg bg-[#00E5FF] px-2.5 py-1.5 text-black transition-colors hover:bg-[#5cf0ff]"
        >
          <Plus size={13} strokeWidth={2} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {GUEST_TAGS.map((candidate) => (
          <button
            key={candidate}
            type="button"
            onClick={() => setTag(candidate)}
            aria-pressed={tag === candidate}
            className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
              tag === candidate ? 'border-white/50 text-white' : 'border-white/10 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TagDot tag={candidate} />
            {GUEST_TAG_STYLE[candidate].label}
          </button>
        ))}
      </div>
    </form>
  );
}

/** Fila de invitado: etiqueta, RSVP, asiento actual y asignación directa. */
function GuestRow({
  guest,
  tables,
  onRemoveGuest,
  onToggleRsvp,
  onUnseat,
  onSeatInFirstFree,
}: {
  readonly guest: SeatingGuest;
  readonly tables: readonly SeatingTable[];
  readonly onRemoveGuest: (id: string) => void;
  readonly onToggleRsvp: (guest: SeatingGuest) => void;
  readonly onUnseat: (id: string) => void;
  readonly onSeatInFirstFree: (guestId: string, tableId: string) => void;
}) {
  const seatedTable = tables.find((table) => table.id === guest.tableId) ?? null;
  const isConfirmed = guest.rsvp === 'confirmed';

  return (
    <li
      draggable
      onDragStart={(event) => {
        // El tablero lee este id en `onDrop` y sienta al invitado en la silla.
        event.dataTransfer.setData('text/ear-guest-id', guest.id);
        event.dataTransfer.effectAllowed = 'move';
      }}
      className="flex cursor-grab flex-wrap items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5 active:cursor-grabbing"
    >
      <TagDot tag={guest.tag} />
      <span className="min-w-0 flex-1 truncate text-[11px] text-white">{guest.name}</span>

      <button
        type="button"
        onClick={() => onToggleRsvp(guest)}
        aria-label={`Marcar RSVP de ${guest.name} como ${isConfirmed ? 'pendiente' : 'confirmado'}`}
        aria-pressed={isConfirmed}
        className={`rounded border px-1 py-0.5 font-mono text-[8px] uppercase tracking-wider transition-colors ${
          isConfirmed ? 'border-[#57d99a] text-[#57d99a]' : 'border-white/15 text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {isConfirmed ? 'RSVP' : 'Pend.'}
      </button>

      {seatedTable !== null ? (
        <button
          type="button"
          onClick={() => onUnseat(guest.id)}
          aria-label={`Liberar el asiento de ${guest.name} en ${seatedTable.label}`}
          className="inline-flex items-center gap-1 rounded border border-[#00E5FF]/40 px-1 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#00E5FF] transition-colors hover:border-[#00E5FF]"
        >
          {seatedTable.label}
          <X size={8} strokeWidth={2} />
        </button>
      ) : (
        <select
          aria-label={`Sentar a ${guest.name} en la primera plaza libre`}
          value=""
          onChange={(event) => {
            if (event.target.value !== '') onSeatInFirstFree(guest.id, event.target.value);
          }}
          className="rounded border border-white/15 bg-black/60 px-1 py-0.5 font-mono text-[9px] text-white outline-none focus:border-[#00E5FF]"
        >
          <option value="">Sentar en…</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.label}
            </option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={() => onRemoveGuest(guest.id)}
        aria-label={`Quitar a ${guest.name} de la lista`}
        className="rounded p-0.5 text-zinc-600 transition-colors hover:text-[#FF2B44]"
      >
        <Trash2 size={10} strokeWidth={1.75} />
      </button>
    </li>
  );
}

/** Cuerpo del panel: contador, alta rápida y lista. */
function PanelBody(props: SeatingGuestPanelProps) {
  const { plan, tally } = props;
  const sorted = [...plan.guests].sort((left, right) => left.name.localeCompare(right.name, 'es'));
  const pending = plan.guests.filter((guest) => guest.tableId === null).length;

  return (
    <div className="space-y-3">
      <TallyBar tally={tally} />
      <QuickAddForm onAddGuest={props.onAddGuest} />

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={props.onAutoSeat}
          disabled={pending === 0 || plan.tables.length === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-[#ecb613]/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[#ecb613] transition-colors hover:border-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Wand2 size={10} strokeWidth={1.75} /> Sentar automáticamente
        </button>
        {pending > 0 ? (
          <span className="font-mono text-[9px] text-[#FF2B44]">{pending} sin asiento</span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#57d99a]">
            <Check size={10} strokeWidth={2} /> todos colocados
          </span>
        )}
      </div>

      <ul className="max-h-[22rem] space-y-1 overflow-y-auto pr-1">
        {sorted.map((guest) => (
          <GuestRow
            key={guest.id}
            guest={guest}
            tables={plan.tables}
            onRemoveGuest={props.onRemoveGuest}
            onToggleRsvp={props.onToggleRsvp}
            onUnseat={props.onUnseat}
            onSeatInFirstFree={props.onSeatInFirstFree}
          />
        ))}
        {sorted.length === 0 ? (
          <li className="rounded-lg border border-dashed border-white/10 px-2 py-4 text-center text-[11px] text-zinc-600">
            Sin invitados. Añade el primero o arrastra nombres al plano.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

/**
 * Panel retráctil. Plegado ocupa 2,5 rem de ancho; desplegado, 20 rem.
 * La transición es `width` (no `transform`) porque el tablero debe re-fluír
 * dejando sitio: un panel flotante taparía las mesas del borde.
 */
export default function SeatingGuestPanel(props: SeatingGuestPanelProps) {
  const { open, onToggle, tally } = props;

  return (
    <aside
      aria-label="Lista de invitados"
      className={`shrink-0 print:hidden ${open ? 'w-full lg:w-80' : 'w-full lg:w-10'}`}
    >
      {open ? (
        <section className="space-y-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-3">
          <header className="flex items-center gap-2">
            <Users size={13} strokeWidth={1.75} className="text-[#00E5FF]" aria-hidden="true" />
            <h2 className="font-syne text-xs font-black uppercase tracking-tight text-white">Lista de invitados</h2>
            <span className="ml-auto font-mono text-[9px] text-zinc-500">{tally.listed} anotados</span>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Plegar la lista de invitados"
              aria-expanded
              className="rounded p-0.5 text-zinc-500 transition-colors hover:text-white"
            >
              <ChevronLeft size={14} strokeWidth={1.75} />
            </button>
          </header>
          <PanelBody {...props} />
        </section>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Desplegar la lista de invitados (${tally.listed} anotados)`}
          aria-expanded={false}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#0a0a0a] px-2 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white lg:h-full lg:flex-col lg:py-4"
        >
          <ChevronRight size={14} strokeWidth={1.75} />
          <span className="lg:[writing-mode:vertical-rl]">Invitados · {tally.listed}</span>
        </button>
      )}
    </aside>
  );
}