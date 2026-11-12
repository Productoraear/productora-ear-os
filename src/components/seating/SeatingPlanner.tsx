'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING PLANNER PRO — ORQUESTADOR DEL LEAD MAGNET (T1)
 * ════════════════════════════════════════════════════════════════════════════
 * Skill rectora: `.antigravity/skills/marketing-leadmagnet-seating.md`.
 * Resolución CEO 2026-11-11: HÍBRIDO SIN BD → `localStorage` + hash `#plan=`.
 *
 * Este componente NO calcula nada: es el pegamento entre el estado y el motor
 * puro `src/lib/seating/seating-plan.ts`. Toda mutación pasa por una función
 * del motor, así que la UI no puede inventarse un plano que el motor no valide.
 *
 * Piezas:
 *   · SeatingHeaderActions — las DOS acciones de cabecera (descarga / bloqueo).
 *   · Toolbar de alta       — mesas por tipología y zonas de evento.
 *   · SeatingBoard          — lienzo interactivo (drag + snap + sillas).
 *   · SeatToolbar           — rotación, escala, plazas y etiqueta del elemento.
 *   · SeatingGuestPanel     — lista retráctil con etiquetas y RSVP en vivo.
 *   · SeatingPrintSheet     — hoja A4 (plano + lista alfabética), sólo al imprimir.
 *
 * Anti-fachada (AF-1): si `localStorage` no está disponible, la UI lo declara y
 * sigue en memoria. No se simula "guardado en la nube".
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, CircleDot, Copy, Link2, Plus, RotateCcw, Users } from 'lucide-react';
import {
  FIXTURE_KINDS,
  FIXTURE_SPEC,
  addFixture,
  addGuest,
  addTable,
  autoSeatGuests,
  buildDefaultPlan,
  moveElement,
  nudgeTableSeats,
  removeFixture,
  removeGuest,
  removeTable,
  renameTable,
  rotateElement,
  scaleElement,
  seatGuest,
  setTableShape,
  tallyGuests,
  unseatGuest,
  updateGuest,
  validatePlan,
  type FixtureKind,
  type GuestTag,
  type SeatingPlan,
  type SeatingTable,
  type TableShape,
} from '@/lib/seating/seating-plan';
import {
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  buildShareUrl,
  decodePlan,
  encodePlan,
  readTokenFromHash,
} from '@/lib/seating/seating-codec';

import SeatingBoard from './SeatingBoard';
import SeatingGuestPanel from './SeatingGuestPanel';
import SeatingHeaderActions from './SeatingHeaderActions';
import SeatingPrintSheet from './SeatingPrintSheet';
import SeatToolbar, { type SelectionDescriptor } from './SeatToolbar';

export interface SeatingPlannerProps {
  /** Aforo pre-rellenado desde el presupuesto sellado (`?pax=`). */
  readonly initialPax: number;
  /** Aforo máximo del espacio desde la ficha de la finca (`?aforo=`). */
  readonly initialVenueCapacity: number;
  /** Tipología inicial (`?tipo=`). */
  readonly initialShape: TableShape;
  /** Nombre del evento: tipo de celebración, nunca dato personal (INV-14). */
  readonly initialEventName: string;
  /** Valor de catálogo de la herramienta, formateado desde la ruta. */
  readonly catalogValueEur: string;
  /** Depósito canónico del SSOT, formateado. */
  readonly depositEur: string;
  /** Centralita oficial del SSOT (sin duplicar el literal). */
  readonly phoneE164: string;
}

const SHAPE_LABEL: Readonly<Record<TableShape, string>> = Object.freeze({
  round: 'Redonda',
  rectangular: 'Rectangular',
  presidential: 'Presidencial',
});

const SHAPE_HINT: Readonly<Record<TableShape, string>> = Object.freeze({
  round: 'Banquete clásico, conversación cerrada',
  rectangular: 'Mesas largas de amigos y primos',
  presidential: 'Novios y familia directa, cara al salón',
});

/**
 * Hidratación: enlace compartido (`#plan=`) manda; si no, autoguardado; si no,
 * migración desde la clave v1. Devuelve el plano y el aviso que la UI declara.
 */
function hydrateFromBrowser(fallback: SeatingPlan): { plan: SeatingPlan; notice: string | null } {
  try {
    const token = readTokenFromHash(window.location.hash);
    if (token !== null) {
      return { plan: decodePlan(token), notice: 'Plano cargado desde el enlace compartido.' };
    }
  } catch {
    return { plan: fallback, notice: 'El enlace traía un plano ilegible: se ha abierto el plano base.' };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return { plan: decodePlan(stored), notice: 'Plano restaurado de este navegador.' };
    }
    // Migración silenciosa desde v1: el cliente conserva su trabajo anterior.
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy !== null) {
      const migrated = decodePlan(legacy);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return { plan: migrated, notice: 'Plano restaurado y actualizado al nuevo formato.' };
    }
  } catch {
    return { plan: fallback, notice: null };
  }

  return { plan: fallback, notice: null };
}

export default function SeatingPlanner({
  initialPax,
  initialVenueCapacity,
  initialShape,
  initialEventName,
  catalogValueEur,
  depositEur,
  phoneE164,
}: SeatingPlannerProps) {
  const [plan, setPlan] = useState<SeatingPlan>(() =>
    buildDefaultPlan({
      pax: initialPax,
      venueCapacity: initialVenueCapacity,
      eventName: initialEventName,
      shape: initialShape,
    }),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guestPanelOpen, setGuestPanelOpen] = useState(true);
  const [storageState, setStorageState] = useState<'pending' | 'saved' | 'unavailable'>('pending');
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [hydrateNotice, setHydrateNotice] = useState<string | null>(null);

  // Hidratación en el cliente: el SSR no puede leer el hash ni localStorage.
  useEffect(() => {
    const hydrated = hydrateFromBrowser(plan);
    setPlan(hydrated.plan);
    if (hydrated.notice !== null) setHydrateNotice(hydrated.notice);
    // Se ejecuta UNA vez: `plan` es sólo el respaldo inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoguardado: cada cambio se persiste sin tocar la red.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, encodePlan(plan));
      setStorageState('saved');
    } catch {
      setStorageState('unavailable');
    }
  }, [plan]);

  const validation = useMemo(() => validatePlan(plan), [plan]);
  const tally = useMemo(() => tallyGuests(plan), [plan]);

  /** Aplica una función PURA del motor al plano actual. */
  const apply = useCallback((mutate: (current: SeatingPlan) => SeatingPlan) => {
    setPlan((current) => mutate(current));
  }, []);

  const selection = useMemo<SelectionDescriptor | null>(() => {
    if (selectedId === null) return null;
    const table = plan.tables.find((candidate) => candidate.id === selectedId);
    if (table !== undefined) {
      return { kind: 'table', id: table.id, label: table.label, rotation: table.rotation, scale: table.scale };
    }
    const fixture = plan.fixtures.find((candidate) => candidate.id === selectedId);
    if (fixture !== undefined) {
      return {
        kind: 'fixture',
        id: fixture.id,
        label: fixture.label,
        rotation: fixture.rotation,
        scale: fixture.scale,
      };
    }
    return null;
  }, [plan.fixtures, plan.tables, selectedId]);

  const selectedTable = useMemo<SeatingTable | null>(
    () => (selection?.kind === 'table' ? (plan.tables.find((t) => t.id === selection.id) ?? null) : null),
    [plan.tables, selection],
  );
  const selectedFixture = useMemo(
    () => (selection?.kind === 'fixture' ? (plan.fixtures.find((f) => f.id === selection.id) ?? null) : null),
    [plan.fixtures, selection],
  );

  /* ── Handlers de elemento (todos delegan en el motor puro) ─────────────── */

  const handleAddTable = useCallback((shape: TableShape) => apply((current) => addTable(current, shape)), [apply]);
  const handleAddFixture = useCallback((kind: FixtureKind) => apply((current) => addFixture(current, kind)), [apply]);
  const handleMove = useCallback(
    (id: string, x: number, y: number) => apply((current) => moveElement(current, id, x, y)),
    [apply],
  );
  const handleRotate = useCallback(
    (id: string, deg: number) => apply((current) => rotateElement(current, id, deg)),
    [apply],
  );
  const handleScale = useCallback(
    (id: string, scale: number) => apply((current) => scaleElement(current, id, scale)),
    [apply],
  );
  const handleChangeSeats = useCallback(
    (id: string, delta: number) => apply((current) => nudgeTableSeats(current, id, delta)),
    [apply],
  );
  const handleChangeShape = useCallback(
    (id: string, shape: TableShape) => apply((current) => setTableShape(current, id, shape)),
    [apply],
  );
  const handleRename = useCallback(
    (id: string, label: string) => apply((current) => renameTable(current, id, label)),
    [apply],
  );

  /**
   * Giro relativo: se lee la rotación VIGENTE del plano (no de una copia
   * capturada en el render) para que dos clics seguidos sumen 90° y no 45°.
   */
  const handleRotateBy = useCallback(
    (id: string, delta: number) => {
      apply((current) => {
        const element =
          current.tables.find((table) => table.id === id) ?? current.fixtures.find((fixture) => fixture.id === id);
        if (element === undefined) return current;
        return rotateElement(current, id, element.rotation + delta);
      });
    },
    [apply],
  );

  const handleRemoveSelected = useCallback(() => {
    if (selectedId === null) return;
    apply((current) =>
      current.tables.some((table) => table.id === selectedId)
        ? removeTable(current, selectedId)
        : removeFixture(current, selectedId),
    );
    setSelectedId(null);
  }, [apply, selectedId]);

  /* ── Handlers de invitados ─────────────────────────────────────────────── */

  const handleAddGuest = useCallback(
    (name: string, tag: GuestTag) => apply((current) => addGuest(current, { name, tag })),
    [apply],
  );
  const handleRemoveGuest = useCallback((id: string) => apply((current) => removeGuest(current, id)), [apply]);
  const handleToggleRsvp = useCallback(
    (guest: { readonly id: string; readonly rsvp: 'pending' | 'confirmed' }) =>
      apply((current) => updateGuest(current, guest.id, { rsvp: guest.rsvp === 'confirmed' ? 'pending' : 'confirmed' })),
    [apply],
  );
  const handleUnseat = useCallback((id: string) => apply((current) => unseatGuest(current, id)), [apply]);
  const handleAutoSeat = useCallback(() => apply((current) => autoSeatGuests(current)), [apply]);
  const handleSeatInFirstFree = useCallback(
    (guestId: string, tableId: string) => {
      apply((current) => {
        const table = current.tables.find((candidate) => candidate.id === tableId);
        if (table === undefined) return current;
        for (let seat = 0; seat < table.seats; seat += 1) {
          const occupied = current.guests.some(
            (guest) => guest.tableId === tableId && guest.seatIndex === seat,
          );
          if (!occupied) return seatGuest(current, guestId, tableId, seat);
        }
        return current;
      });
    },
    [apply],
  );
  const handleDropGuest = useCallback(
    (guestId: string, tableId: string, seatIndex: number) =>
      apply((current) => seatGuest(current, guestId, tableId, seatIndex)),
    [apply],
  );

  /**
   * Clic en una silla: si está ocupada se libera al invitado; si está libre se
   * sienta al primero de la lista que no tenga mesa (el orden de alta manda).
   */
  const handleSeatClick = useCallback(
    (tableId: string, seatIndex: number) => {
      apply((current) => {
        const occupant = current.guests.find(
          (guest) => guest.tableId === tableId && guest.seatIndex === seatIndex,
        );
        if (occupant !== undefined) return unseatGuest(current, occupant.id);
        const pending = current.guests.find((guest) => guest.tableId === null);
        if (pending === undefined) return current;
        return seatGuest(current, pending.id, tableId, seatIndex);
      });
    },
    [apply],
  );

  const resetPlan = useCallback(() => {
    setPlan(
      buildDefaultPlan({
        pax: plan.pax,
        venueCapacity: plan.venueCapacity,
        eventName: plan.eventName,
        shape: initialShape,
      }),
    );
    setSelectedId(null);
  }, [initialShape, plan.eventName, plan.pax, plan.venueCapacity]);

  const share = useCallback(async () => {
    try {
      const url = buildShareUrl(window.location.origin, window.location.pathname, plan);
      window.history.replaceState(null, '', url);
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 4000);
    } catch {
      // Sin portapapeles (permiso denegado o contexto no seguro) el usuario
      // copia desde la barra: se declara, no se finge haber copiado.
      setShareState('error');
    }
  }, [plan]);

  const whatsappHref = `https://wa.me/${phoneE164.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Quiero vincular mi plano de mesas a la fecha del evento',
  )}`;

  const downloadBaseName = `plano-mesas-${plan.pax}-pax`;

  return (
    <div className="space-y-5">
      {/* ── CABECERA: las DOS acciones + cortesía declarada al lado del CTA ── */}
      <SeatingHeaderActions
        plan={plan}
        toolValueEur={catalogValueEur}
        depositEur={depositEur}
        downloadBaseName={downloadBaseName}
      />

      {/* ── Barra de aforo en vivo: asientos montados vs pedido vs RSVP ────── */}
      <section
        aria-live="polite"
        className={`flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border p-4 font-mono text-xs ${
          validation.ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#FF2B44]/40 bg-[#FF2B44]/5'
        }`}
      >
        <span className="flex items-center gap-1.5 text-white">
          <Users size={14} className="text-[#00E5FF]" aria-hidden="true" />
          {validation.seats} asientos · objetivo {plan.pax} pax
        </span>
        <span className="flex items-center gap-1.5 text-[#00E5FF]">
          <CircleDot size={13} aria-hidden="true" />
          {tally.seated} sentados · {tally.freeSeats} libres
        </span>
        <span className="flex items-center gap-1.5 text-[#57d99a]">
          <Check size={13} aria-hidden="true" />
          {tally.confirmed} RSVP confirmados ({tally.confirmedSeated} ya sentados)
        </span>

        {validation.missingSeats > 0 ? (
          <span className="flex items-center gap-1.5 text-[#FF2B44]">
            <AlertTriangle size={14} aria-hidden="true" /> faltan {validation.missingSeats} asientos
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Check size={14} aria-hidden="true" /> aforo cubierto
          </span>
        )}

        {validation.unseatedGuests > 0 ? (
          <span className="flex items-center gap-1.5 text-[#ecb613]">
            <AlertTriangle size={14} aria-hidden="true" /> {validation.unseatedGuests} invitados sin asiento
          </span>
        ) : null}

        {validation.exceedsVenue ? (
          <span className="flex items-center gap-1.5 text-[#FF2B44]">
            <AlertTriangle size={14} aria-hidden="true" /> el espacio admite {plan.venueCapacity} · sobran{' '}
            {validation.overflow}
          </span>
        ) : null}

        <span className="ml-auto text-zinc-500">
          {storageState === 'saved'
            ? 'Autoguardado en este navegador'
            : storageState === 'unavailable'
              ? 'Sin almacenamiento local: el plano no se guardará al cerrar'
              : 'Guardando…'}
        </span>
      </section>

      {hydrateNotice !== null ? <p className="text-xs text-zinc-500 print:hidden">{hydrateNotice}</p> : null}

      {/* ── CAJA DE HERRAMIENTAS: mesas y zonas de evento ─────────────────── */}
      <section className="flex flex-wrap items-center gap-2 print:hidden">
        {(['round', 'rectangular', 'presidential'] as const).map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => handleAddTable(shape)}
            title={SHAPE_HINT[shape]}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#00E5FF]/60"
          >
            <Plus size={13} strokeWidth={2} aria-hidden="true" /> {SHAPE_LABEL[shape]}
          </button>
        ))}

        <span className="mx-1 h-6 w-px bg-white/10" aria-hidden="true" />

        {FIXTURE_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => handleAddFixture(kind)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-[#ecb613]/60 hover:text-white"
          >
            <Plus size={11} strokeWidth={2} aria-hidden="true" /> {FIXTURE_SPEC[kind].label}
          </button>
        ))}

        <span className="mx-1 h-6 w-px bg-white/10" aria-hidden="true" />

        <button
          type="button"
          onClick={resetPlan}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/40"
        >
          <RotateCcw size={13} strokeWidth={1.75} aria-hidden="true" /> Recalcular
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#00E5FF]/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#00E5FF] transition-colors hover:border-[#00E5FF]"
        >
          <Link2 size={13} strokeWidth={1.75} aria-hidden="true" />
          {shareState === 'copied' ? 'Enlace copiado' : 'Compartir plano'}
        </button>
        {shareState === 'error' ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#FF2B44]">
            <Copy size={12} aria-hidden="true" /> El navegador bloqueó el portapapeles: copia la barra de direcciones.
          </span>
        ) : null}
      </section>

      {/* ── LIENZO + PANEL DE INVITADOS ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start print:hidden">
        <div className="min-w-0 flex-1 space-y-4">
          <SeatingBoard
            plan={plan}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={handleMove}
            onSeatClick={handleSeatClick}
            onDropGuest={handleDropGuest}
          />

          <SeatToolbar
            selection={selection}
            table={selectedTable}
            fixture={selectedFixture}
            shapeLabel={SHAPE_LABEL}
            onRotate={handleRotate}
            onRotateBy={handleRotateBy}
            onScale={handleScale}
            onChangeSeats={handleChangeSeats}
            onChangeShape={handleChangeShape}
            onRename={handleRename}
            onRemove={handleRemoveSelected}
            onDeselect={() => setSelectedId(null)}
          />
        </div>

        <SeatingGuestPanel
          plan={plan}
          tally={tally}
          open={guestPanelOpen}
          onToggle={() => setGuestPanelOpen((open) => !open)}
          onAddGuest={handleAddGuest}
          onRemoveGuest={handleRemoveGuest}
          onToggleRsvp={handleToggleRsvp}
          onUnseat={handleUnseat}
          onAutoSeat={handleAutoSeat}
          onSeatInFirstFree={handleSeatInFirstFree}
        />
      </div>

      {/* ── Pie comercial: canal directo sin barrera económica ─────────────── */}
      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 print:hidden">
        <p className="text-xs text-zinc-400">
          El plano vive en tu navegador y en el enlace que generes. Guardarlo vinculado a tu fecha exige el depósito
          de <span className="font-mono text-white">{depositEur} €</span>, deducible del total del evento.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white/40"
        >
          Consultar por WhatsApp
        </a>
      </section>

      {/* ── HOJA A4: sólo existe al imprimir (plano + lista alfabética) ────── */}
      <SeatingPrintSheet plan={plan} shapeLabel={SHAPE_LABEL} />
    </div>
  );
}