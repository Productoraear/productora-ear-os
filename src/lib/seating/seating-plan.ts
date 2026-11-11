/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING PLANNER PRO — MOTOR DE LAYOUT (PURO, SIN DOM, SIN I/O)
 * ════════════════════════════════════════════════════════════════════════════
 * Skill rectora: `.antigravity/skills/marketing-leadmagnet-seating.md`
 *   · El plano organiza, NO cotiza (FASE 3.4). Cero importes aquí.
 *   · Se rellena con el aforo y la provincia del presupuesto sellado (FASE 3.3).
 *   · Validación de aforo contra la ficha del espacio (FASE 2).
 *
 * Leyes de implementación:
 *   1. Determinista: sin `Math.random`, sin `Date.now`. Mismo estado de entrada
 *      ⇒ mismo plano. El enlace compartible (`#plan=`) sólo es fiable así.
 *   2. Cero `any`: todo tipado, cerrado y exhaustivo.
 *   3. La capacidad de cada mesa se calcula por geometría, no por una tabla
 *      mágica: radio utilizable / radio por comensal (60 cm de ancho de servicio).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Tipologías admitidas por la skill (FASE 2 · segmentación). */
export type TableShape = 'round' | 'rectangular' | 'presidential';

/** Ancho de servicio por comensal en metros (estándar de banquete). */
export const GUEST_PITCH_M = 0.6;

/** Capacidad máxima por tipología. Un aforo mayor exige dos mesas. */
export const MAX_SEATS_BY_SHAPE: Readonly<Record<TableShape, number>> = Object.freeze({
  round: 12,
  rectangular: 10,
  presidential: 24,
});

/** Dimensiones nominales en metros: `width` × `height` del rectángulo del plano. */
export const TABLE_METRICS: Readonly<Record<TableShape, { readonly width: number; readonly height: number }>> =
  Object.freeze({
    round: { width: 1.8, height: 1.8 },
    rectangular: { width: 2.4, height: 0.9 },
    presidential: { width: 4.8, height: 0.9 },
  });

export interface SeatingTable {
  readonly id: string;
  readonly label: string;
  readonly shape: TableShape;
  readonly seats: number;
  /** Centro en metros desde el origen del plano (esquinas de 0,1 m). */
  readonly x: number;
  readonly y: number;
}

export interface SeatingPlan {
  /** Versión del formato: un enlace viejo no se hidrata con un esquema nuevo. */
  readonly version: 1;
  readonly eventName: string;
  readonly pax: number;
  /** Aforo declarado del espacio (0 = sin aforo declarado, sin validación). */
  readonly venueCapacity: number;
  readonly tables: readonly SeatingTable[];
}

/** Vocabulario cerrado de errores del motor. */
export type SeatingErrorCode =
  | 'INVALID_PAX'
  | 'INVALID_SEATS'
  | 'DUPLICATE_TABLE_ID'
  | 'PLAN_OVERFLOW'
  | 'UNKNOWN_SCHEMA';

export class SeatingPlanError extends Error {
  readonly code: SeatingErrorCode;

  constructor(code: SeatingErrorCode, message: string) {
    super(`[SeatingPlan/${code}] ${message}`);
    this.name = 'SeatingPlanError';
    this.code = code;
  }
}

/** Asientos que caben en una mesa según su tipología y sus metros útiles. */
export function seatCapacity(shape: TableShape): number {
  const metrics = TABLE_METRICS[shape];
  // Mesa redonda: comensales alrededor de la circunferencia.
  // Mesa rectangular/presidencial: largo por los dos lados largos + una cabecera.
  const seats =
    shape === 'round'
      ? Math.floor((Math.PI * metrics.width) / GUEST_PITCH_M)
      : Math.floor(metrics.width / GUEST_PITCH_M) * 2 + 2;
  return Math.min(MAX_SEATS_BY_SHAPE[shape], Math.max(2, seats));
}

/**
 * Rejilla determinista de mesas para un aforo.
 *
 * No hay colocación "al azar": se reparte en columnas de 4 como máximo, con
 * separación fija de 3,2 m entre centros (1,2 m de pasillo de servicio a cada
 * lado de una mesa de 2,4 m). Un plano que cambia entre recargas rompería el
 * enlace compartible.
 */
export function buildDefaultPlan(input: {
  readonly pax: number;
  readonly venueCapacity?: number;
  readonly eventName?: string;
  readonly shape?: TableShape;
}): SeatingPlan {
  const pax = Math.trunc(input.pax);
  if (!Number.isFinite(pax) || pax < 1) {
    throw new SeatingPlanError('INVALID_PAX', `aforo no válido: ${String(input.pax)}`);
  }

  const shape: TableShape = input.shape ?? 'round';
  const seatsPerTable = seatCapacity(shape);
  const tableCount = Math.ceil(pax / seatsPerTable);

  const tables: SeatingTable[] = [];
  const columns = Math.min(4, tableCount);
  for (let index = 0; index < tableCount; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    tables.push({
      id: `mesa-${index + 1}`,
      label: shape === 'presidential' && index === 0 ? 'Mesa presidencial' : `Mesa ${index + 1}`,
      shape,
      seats: seatsPerTable,
      x: round2(1.5 + column * 3.2),
      y: round2(1.5 + row * 3.2),
    });
  }

  return Object.freeze({
    version: 1 as const,
    eventName: (input.eventName ?? '').slice(0, 80),
    pax,
    venueCapacity: Math.max(0, Math.trunc(input.venueCapacity ?? 0)),
    tables: Object.freeze(tables),
  });
}

/** Aforo total sentado del plano (suma de asientos). */
export function totalSeats(plan: SeatingPlan): number {
  return plan.tables.reduce((acc, table) => acc + table.seats, 0);
}

export interface PlanValidation {
  readonly ok: boolean;
  readonly seats: number;
  readonly missingSeats: number;
  /** `true` si el plano excede el aforo declarado del espacio. */
  readonly exceedsVenue: boolean;
  readonly overflow: number;
}

/** Valida el plano contra el aforo del evento y la ficha del espacio. */
export function validatePlan(plan: SeatingPlan): PlanValidation {
  const seats = totalSeats(plan);
  const exceedsVenue = plan.venueCapacity > 0 && seats > plan.venueCapacity;
  return {
    ok: seats >= plan.pax && !exceedsVenue,
    seats,
    missingSeats: Math.max(0, plan.pax - seats),
    exceedsVenue,
    overflow: exceedsVenue ? seats - plan.venueCapacity : 0,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
