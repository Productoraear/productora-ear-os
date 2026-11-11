'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING PLANNER PRO — ORGANIZADOR DE MESAS TRANSACCIONAL (LEAD MAGNET)
 * ════════════════════════════════════════════════════════════════════════════
 * Skill rectora: `.antigravity/skills/marketing-leadmagnet-seating.md` (T1).
 * Resolución CEO 2026-11-11: HÍBRIDO SIN BD → `localStorage` + hash `#plan=`.
 *
 * Lo que hace de verdad (y lo que NO):
 *   · Crea mesas (redonda / rectangular / presidencial) y las MUEVE arrastrando.
 *   · Valida el aforo contra `?pax=` y el aforo declarado del espacio.
 *   · Autoguarda en `localStorage` y genera un enlace compartible por hash.
 *   · Exporta: imprimir (CSS `@media print`) y descargar `.svg`.
 *   · NO cotiza: aquí no hay ni un importe de servicio. Las dos cifras de dinero
 *     que aparecen (valor de catálogo y depósito) llegan del SSOT por props.
 *
 * Anti-fachada (AF-1): si `localStorage` no está disponible (modo privado de
 * algunos navegadores), la UI lo declara y sigue en memoria. No se simula
 * "guardado en la nube": la nube se ofrece como acción comercial explícita.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Check,
  Download,
  Link2,
  Plus,
  Printer,
  RotateCcw,
  Users,
} from 'lucide-react';
import {
  TABLE_METRICS,
  buildDefaultPlan,
  seatCapacity,
  totalSeats,
  validatePlan,
  type SeatingPlan,
  type SeatingTable,
  type TableShape,
} from '@/lib/seating/seating-plan';
import {
  STORAGE_KEY,
  buildShareUrl,
  decodePlan,
  encodePlan,
  readTokenFromHash,
} from '@/lib/seating/seating-codec';
import SeatingBoard from './SeatingBoard';

export interface SeatingPlannerProps {
  /** Aforo pre-rellenado desde el presupuesto sellado (`?pax=`). */
  readonly initialPax: number;
  /** Aforo máximo del espacio desde la ficha de la finca (`?aforo=`). */
  readonly initialVenueCapacity: number;
  /** Tipología inicial (`?tipo=`). */
  readonly initialShape: TableShape;
  /** Nombre del evento: tipo de celebración, nunca dato personal (INV-14). */
  readonly initialEventName: string;
  /** Valor de catálogo de la herramienta, formateado desde el SSOT. */
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

const METERS_TO_PX = 46;
const PADDING_M = 1.2;
/** Techo de seguridad por mesa en la UI (el motor admite hasta 24). */
const MAX_SEATS_SOFT_LIMIT = 24;

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
  const [storageState, setStorageState] = useState<'pending' | 'saved' | 'unavailable'>('pending');
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [hydrateNotice, setHydrateNotice] = useState<string | null>(null);

  // Hidratación: primero el enlace compartido (manda), después el autoguardado.
  useEffect(() => {
    try {
      const token = readTokenFromHash(window.location.hash);
      if (token !== null) {
        setPlan(decodePlan(token));
        setHydrateNotice('Plano cargado desde el enlace compartido.');
        return;
      }
    } catch {
      setHydrateNotice('El enlace traía un plano ilegible: se ha abierto el plano base.');
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === null) return;
      setPlan(decodePlan(stored));
      setHydrateNotice('Plano restaurado de este navegador.');
    } catch {
      setStorageState('unavailable');
    }
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
  const seats = useMemo(() => totalSeats(plan), [plan]);

  const updatePlan = useCallback((mutate: (current: SeatingPlan) => SeatingPlan) => {
    setPlan((current) => mutate(current));
  }, []);

  const addTable = useCallback(
    (shape: TableShape) => {
      updatePlan((current) => {
        const index = current.tables.length;
        const next: SeatingTable = {
          id: `mesa-${index + 1}`,
          label: shape === 'presidential' ? 'Mesa presidencial' : `Mesa ${index + 1}`,
          shape,
          seats: seatCapacity(shape),
          x: Number((1.5 + (index % 4) * 3.2).toFixed(2)),
          y: Number((1.5 + Math.floor(index / 4) * 3.2).toFixed(2)),
        };
        return { ...current, tables: [...current.tables, next] };
      });
    },
    [updatePlan],
  );

  const removeTable = useCallback(
    (id: string) => {
      updatePlan((current) => ({ ...current, tables: current.tables.filter((table) => table.id !== id) }));
    },
    [updatePlan],
  );

  const changeSeats = useCallback(
    (id: string, delta: number) => {
      updatePlan((current) => ({
        ...current,
        tables: current.tables.map((table) =>
          table.id === id
            ? { ...table, seats: Math.max(0, Math.min(MAX_SEATS_SOFT_LIMIT, table.seats + delta)) }
            : table,
        ),
      }));
    },
    [updatePlan],
  );

  const changeShape = useCallback(
    (id: string, shape: TableShape) => {
      updatePlan((current) => ({
        ...current,
        tables: current.tables.map((table) => (table.id === id ? { ...table, shape } : table)),
      }));
    },
    [updatePlan],
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
  }, [initialShape, plan.eventName, plan.pax, plan.venueCapacity]);

  const moveTable = useCallback(
    (id: string, x: number, y: number) => {
      updatePlan((current) => ({
        ...current,
        tables: current.tables.map((table) => (table.id === id ? { ...table, x, y } : table)),
      }));
    },
    [updatePlan],
  );

  const share = useCallback(async () => {
    try {
      const url = buildShareUrl(window.location.origin, window.location.pathname, plan);
      window.history.replaceState(null, '', url);
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 4000);
    } catch {
      // Sin portapapeles (permiso denegado / contexto no seguro) el usuario
      // copia desde la barra: se declara, no se finge haber copiado.
      setShareState('error');
    }
  }, [plan]);

  const downloadSvg = useCallback(() => {
    const blob = new Blob([renderPlanSvg(plan)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `plano-mesas-${plan.pax}-pax.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [plan]);

  const whatsappHref = `https://wa.me/${phoneE164.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Quiero vincular mi plano de mesas a la fecha del evento',
  )}`;

  return (
    <div className="space-y-6">
      {/* Anclaje de valor: las DOS cifras vienen del SSOT por props. */}
      <section className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/5 p-5 print:hidden">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ecb613]">
          Valor de catálogo de esta herramienta
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-2xl font-bold text-white">{catalogValueEur} €</span>
          <span className="text-sm text-zinc-400">
            Incluida sin coste adicional al formalizar el depósito de{' '}
            <span className="font-mono text-[#ecb613]">{depositEur} €</span> de tu presupuesto, deducible del total
            del evento.
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-zinc-500">
          Este plano vive en tu navegador y en el enlace compartible que generes. Guardarlo de forma permanente y
          vinculado a tu fecha exige el depósito: es lo que lo incorpora a tu expediente.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/presupuesto"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ecb613] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#f5c94a]"
          >
            Vincular al depósito
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white/40"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </section>

      {/* Barra de estado: aforo real contra aforo pedido y aforo del espacio. */}
      <section
        aria-live="polite"
        className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 text-xs font-mono ${
          validation.ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#FF2B44]/40 bg-[#FF2B44]/5'
        }`}
      >
        <span className="flex items-center gap-1.5 text-white">
          <Users size={14} className="text-[#00E5FF]" />
          {seats} asientos · objetivo {plan.pax} pax
        </span>
        {validation.missingSeats > 0 ? (
          <span className="flex items-center gap-1.5 text-[#FF2B44]">
            <AlertTriangle size={14} /> faltan {validation.missingSeats} asientos
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Check size={14} /> aforo cubierto
          </span>
        )}
        {validation.exceedsVenue ? (
          <span className="flex items-center gap-1.5 text-[#FF2B44]">
            <AlertTriangle size={14} /> el espacio admite {plan.venueCapacity} · sobran {validation.overflow}
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

      {hydrateNotice !== null ? (
        <p className="text-xs text-zinc-500 print:hidden">{hydrateNotice}</p>
      ) : null}

      {/* Herramientas */}
      <section className="flex flex-wrap items-center gap-2 print:hidden">
        {(['round', 'rectangular', 'presidential'] as const).map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => addTable(shape)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#00E5FF]/60"
          >
            <Plus size={13} /> {SHAPE_LABEL[shape]}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-white/10" />
        <button
          type="button"
          onClick={resetPlan}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/40"
        >
          <RotateCcw size={13} /> Recalcular
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#00E5FF]/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#00E5FF] transition-colors hover:border-[#00E5FF]"
        >
          <Link2 size={13} /> {shareState === 'copied' ? 'Enlace copiado' : 'Compartir plano'}
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/40"
        >
          <Download size={13} /> Descargar SVG
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/40"
        >
          <Printer size={13} /> Imprimir
        </button>
        {shareState === 'error' ? (
          <span className="text-xs text-[#FF2B44]">
            El navegador bloqueó el portapapeles: copia la barra de direcciones.
          </span>
        ) : null}
      </section>

      {/* Plano interactivo + edición precisa: componente aislado para respetar
          el presupuesto estructural §5.4 (CC ≤ 15 por función). */}
      <SeatingBoard
        plan={plan}
        metersToPx={METERS_TO_PX}
        paddingM={PADDING_M}
        shapeLabel={SHAPE_LABEL}
        onMove={moveTable}
        onChangeSeats={changeSeats}
        onChangeShape={changeShape}
        onRemove={removeTable}
      />
    </div>
  );
}

/**
 * Render vectorial del plano (sin DOM, sin canvas).
 *
 * Sirve para dos entregables reales del lead magnet: la descarga `.svg` y la
 * impresión en papel. Se genera desde el MISMO estado que el tablero, así que
 * lo que el cliente ve, lo que descarga y lo que imprime no puede divergir.
 */
function renderPlanSvg(plan: SeatingPlan): string {
  const scale = METERS_TO_PX;
  const width = Math.max(8, ...plan.tables.map((table) => table.x + TABLE_METRICS[table.shape].width)) + 2;
  const height = Math.max(6, ...plan.tables.map((table) => table.y + TABLE_METRICS[table.shape].height)) + 2;
  const svgWidth = Math.round(width * scale);
  const svgHeight = Math.round(height * scale);

  const escape = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const shapes = plan.tables
    .map((table) => {
      const metrics = TABLE_METRICS[table.shape];
      const x = table.x * scale;
      const y = table.y * scale;
      const w = metrics.width * scale;
      const h = metrics.height * scale;
      const geometry =
        table.shape === 'round'
          ? `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="#00E5FF22" stroke="#00E5FF" stroke-width="1.5"/>`
          : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#00E5FF22" stroke="#00E5FF" stroke-width="1.5"/>`;
      const label = `<text x="${x + w / 2}" y="${y + h / 2}" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${escape(
        table.label,
      )}</text>`;
      const seats = `<text x="${x + w / 2}" y="${y + h / 2 + 14}" fill="#00E5FF" font-family="monospace" font-size="9" text-anchor="middle" dominant-baseline="middle">${table.seats} asientos</text>`;
      return geometry + label + seats;
    })
    .join('');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="Plano de mesas ${escape(plan.eventName || 'evento')}">`,
    `<rect width="100%" height="100%" fill="#030305"/>`,
    `<text x="12" y="20" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold">${escape(plan.eventName || 'Plano de mesas')} · ${plan.pax} pax · ${plan.tables.length} mesas</text>`,
    shapes,
    `</svg>`,
  ].join('');
}
