/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING PRICING — MOTOR DE VALOR DEL PLANO (PURO, SIN DOM, SIN I/O)
 * ════════════════════════════════════════════════════════════════════════════
 * Sutura transaccional entre el plano y el cobro de `/presupuesto`.
 *
 * Reglas duras (Zona Cero respetada — INV-05/INV-10):
 *   · CERO importes canónicos aquí. No se importa ni se duplica `ear-os-ssot.ts`.
 *     Todas las tarifas entran por parámetro desde quien las posee (la ruta).
 *   · CERO decimales flotantes en dinero: enteros en CÉNTIMOS (mismo criterio
 *     que `budget-allocator-engine.ts`). Un `0.1 + 0.2` no mueve un cobro.
 *   · El plano ORGANIZA; este motor VALORA la organización. No cotiza el
 *     servicio del artista ni toca el depósito Price-Lock (INV-03).
 *
 * Por qué un modelo de "líneas" y no un único total:
 *   El cliente exige control TOTAL de cada elemento. Cada concepto que se cobra
 *   se declara con su precio unitario y su cantidad, de modo que el desglose en
 *   `/presupuesto` se audita concepto a concepto sin recalcular nada. Un total
 *   sin desglose es una cifra opaca.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  GUEST_PITCH_M,
  MAX_SEATS_BY_SHAPE,
  TABLE_METRICS,
  totalSeats,
  type SeatingPlan,
  type TableShape,
} from './seating-plan';

/**
 * Tarifario inyectado desde la ruta (marketing), nunca desde la Zona Cero.
 * Todos los valores en CÉNTIMOS enteros: 1800 = 18,00 €.
 */
export interface SeatingTariff {
  /** Cuota de planificación por mesa montada (mesa + sillas + mantelería). */
  readonly perTableCents: number;
  /** Valor declarado de la herramienta de plano (ancla del lead magnet). */
  readonly plannerToolCents: number;
  /** Precio por etiqueta de sitio impresa. */
  readonly seatCardCents: number;
  /** Precio por cartel de mesa. */
  readonly tableCardCents: number;
  /** Recargo por comensal que excede el aforo del espacio (gestión extra). */
  readonly overflowGuestCents: number;
  /** % de descuento por volumen sobre el subtotal, en puntos enteros (0..100). */
  readonly volumeDiscountPct: number;
  /** Umbral de mesas a partir del cual se aplica el descuento por volumen. */
  readonly volumeThresholdTables: number;
}

/** Tarifario por defecto: valores de marketing de la ruta, en céntimos. */
export const DEFAULT_SEATING_TARIFF: SeatingTariff = Object.freeze({
  perTableCents: 1800,
  plannerToolCents: 19000,
  seatCardCents: 90,
  tableCardCents: 250,
  overflowGuestCents: 400,
  volumeDiscountPct: 10,
  volumeThresholdTables: 10,
});

/** Qué se imprime. Las cantidades derivan del plano, nunca de un input libre. */
export interface SeatingPrintOptions {
  /** Etiqueta de sitio por comensal colocado. */
  readonly seatCards: boolean;
  /** Cartel por mesa. */
  readonly tableCards: boolean;
}

export const DEFAULT_PRINT_OPTIONS: SeatingPrintOptions = Object.freeze({
  seatCards: false,
  tableCards: false,
});

/** Quién paga el plano. Es una palanca comercial, no una suma de dinero. */
export type PlacingPayer = 'included' | 'client';

/**
 * Una línea del desglose. `unitCents × quantity` debe coincidir con
 * `amountCents`: el arnés lo verifica y falla si divergen.
 */
export interface SeatingCostLine {
  readonly key: SeatingCostLineKey;
  readonly label: string;
  readonly unitCents: number;
  readonly quantity: number;
  readonly amountCents: number;
}

/** Vocabulario CERRADO de conceptos (exhaustivo: la UI cubre cada clave). */
export type SeatingCostLineKey =
  | 'table-rental'
  | 'planner-tool'
  | 'seat-cards'
  | 'table-cards'
  | 'overflow-guest';

export interface SeatingCostBreakdown {
  readonly lines: readonly SeatingCostLine[];
  readonly subtotalCents: number;
  readonly discountCents: number;
  readonly totalCents: number;
  /** Cuándo se aplicó el descuento por volumen (auditoría del cobro). */
  readonly discountApplied: boolean;
}

/** Resultado completo: lo que el plano cuesta y por qué. */
export interface SeatingValuation {
  readonly breakdown: SeatingCostBreakdown;
  readonly tables: number;
  readonly seats: number;
  readonly pax: number;
  readonly overflowGuests: number;
  /** `true` si el plano excede el aforo del espacio declarado. */
  readonly exceedsVenue: boolean;
}

export interface ValuateSeatingInput {
  readonly plan: SeatingPlan;
  readonly print: SeatingPrintOptions;
  readonly tariff: SeatingTariff;
  /** `included` ⇒ la herramienta no se cobra; `client` ⇒ se cobra. */
  readonly payer: PlacingPayer;
}

/** Guarda de entrada: el tarifario no puede colar negativos, NaN ni %.

 */
function assertTariff(tariff: SeatingTariff): void {
  const money = [
    tariff.perTableCents,
    tariff.plannerToolCents,
    tariff.seatCardCents,
    tariff.tableCardCents,
    tariff.overflowGuestCents,
  ];
  for (const value of money) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(`[SeatingPricing] tarifa inválida: ${String(value)} (céntimos enteros ≥ 0)`);
    }
  }
  if (!Number.isInteger(tariff.volumeDiscountPct) || tariff.volumeDiscountPct < 0 || tariff.volumeDiscountPct > 100) {
    throw new RangeError(`[SeatingPricing] descuento fuera de 0..100: ${String(tariff.volumeDiscountPct)}`);
  }
  if (!Number.isInteger(tariff.volumeThresholdTables) || tariff.volumeThresholdTables < 1) {
    throw new RangeError(`[SeatingPricing] umbral de volumen inválido: ${String(tariff.volumeThresholdTables)}`);
  }
}

/**
 * Comensales que exceden el aforo del espacio.
 *
 * Se compara contra los ASIENTOS montados, no contra `pax`: si el cliente pide
 * 100 pax en un espacio de 80 y el plano monta 120 sillas, lo que hay que
 * gestionar de más son 40 asientos, no 20. `venueCapacity = 0` ⇒ sin validación.
 */
function overflowGuests(plan: SeatingPlan, seats: number): number {
  if (plan.venueCapacity <= 0) return 0;
  return Math.max(0, seats - plan.venueCapacity);
}

/** Líneas que el plano genera, en orden estable (el desglose no debe bailar). */
function buildLines(input: ValuateSeatingInput, seats: number, overflow: number): SeatingCostLine[] {
  const { plan, print, tariff, payer } = input;
  const lines: SeatingCostLine[] = [];

  const push = (key: SeatingCostLineKey, label: string, unitCents: number, quantity: number): void => {
    if (quantity <= 0) return;
    lines.push({ key, label, unitCents, quantity, amountCents: unitCents * quantity });
  };

  push('table-rental', 'Montaje de mesas y sillas', tariff.perTableCents, plan.tables.length);

  // La herramienta sólo se factura si el cliente NO llega con depósito.
  if (payer === 'client') {
    push('planner-tool', 'Seating Planner Pro (acceso completo)', tariff.plannerToolCents, 1);
  }
  if (print.seatCards) {
    push('seat-cards', 'Etiquetas de sitio impresas', tariff.seatCardCents, seats);
  }
  if (print.tableCards) {
    push('table-cards', 'Carteles de mesa', tariff.tableCardCents, plan.tables.length);
  }
  if (overflow > 0) {
    push('overflow-guest', 'Gestión de comensal sobre aforo', tariff.overflowGuestCents, overflow);
  }

  return lines;
}

/**
 * Valoración completa del plano: líneas + subtotal + descuento + total.
 *
 * Decimales: todo es aritmética entera hasta `Math.floor` del descuento, que
 * redondea HACIA ABAJO (a favor del cliente). No hay `toFixed` en el motor.
 */
export function valuateSeating(input: ValuateSeatingInput): SeatingValuation {
  assertTariff(input.tariff);

  const seats = totalSeats(input.plan);
  const overflow = overflowGuests(input.plan, seats);
  const lines = buildLines(input, seats, overflow);
  const subtotalCents = lines.reduce((acc, line) => acc + line.amountCents, 0);

  const discountApplied =
    input.tariff.volumeDiscountPct > 0 &&
    input.plan.tables.length >= input.tariff.volumeThresholdTables;

  const discountCents = discountApplied
    ? Math.floor((subtotalCents * input.tariff.volumeDiscountPct) / 100)
    : 0;

  return {
    breakdown: {
      lines,
      subtotalCents,
      discountCents,
      totalCents: subtotalCents - discountCents,
      discountApplied,
    },
    tables: input.plan.tables.length,
    seats,
    pax: input.plan.pax,
    overflowGuests: overflow,
    exceedsVenue: overflow > 0,
  };
}

/**
 * Huella de cobro: hash determinista del DESGLOSE, no de la geometría.
 *
 * Dos planos distintos pueden costar lo mismo (mover una mesa no cambia el
 * precio). Lo que el cobro debe congelar es la CIFRA, así que el hash se
 * calcula sobre las líneas y el total. Determinista y sincrónico (FNV-1a),
 * sin `crypto.subtle` para no obligar a `await` en el handler del clic.
 */
export function hashValuation(valuation: SeatingValuation): string {
  const canonical = [
    valuation.tables,
    valuation.seats,
    valuation.pax,
    valuation.breakdown.lines.map((line) => `${line.key}:${line.quantity}:${line.amountCents}`).join(','),
    valuation.breakdown.totalCents,
  ].join('|');

  let hash = 0x811c9dc5 >>> 0;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x21f0aaad) >>> 0;
  hash ^= hash >>> 15;
  return hash.toString(36);
}

/** Formatea céntimos como euros españoles. Único punto de formato del dinero. */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * ── CONTROL TOTAL POR ELEMENTO ──────────────────────────────────────────────
 * "Control total de cada elemento" exige que ningún elemento pueda quedar fuera
 * de rango en silencio: ni un asiento que no cabe en la geometría, ni una
 * coordenada negativa, ni una mesa sin etiqueta.
 */
export interface ElementIssue {
  readonly code: 'SEATS_EXCEED_GEOMETRY' | 'NEGATIVE_COORDINATE' | 'EMPTY_LABEL';
  readonly tableId: string;
  readonly detail: string;
}

/** Asientos máximos que la geometría admite para una tipología. */
export function maxSeatsForShape(shape: TableShape): number {
  return MAX_SEATS_BY_SHAPE[shape];
}

/**
 * Audita cada mesa del plano. Devuelve TODOS los problemas, no el primero:
 * el operador corrige de una pasada en lugar de fallar en bucle.
 */
export function auditPlanElements(plan: SeatingPlan): readonly ElementIssue[] {
  const issues: ElementIssue[] = [];
  for (const table of plan.tables) {
    const limit = maxSeatsForShape(table.shape);
    if (table.seats > limit) {
      issues.push({
        code: 'SEATS_EXCEED_GEOMETRY',
        tableId: table.id,
        detail: `${table.seats} asientos > ${limit} que admite la tipología ${table.shape}`,
      });
    }
    if (table.x < 0 || table.y < 0) {
      issues.push({
        code: 'NEGATIVE_COORDINATE',
        tableId: table.id,
        detail: `posición fuera del lienzo (${table.x}, ${table.y})`,
      });
    }
    if (table.label.trim().length === 0) {
      issues.push({ code: 'EMPTY_LABEL', tableId: table.id, detail: 'mesa sin etiqueta' });
    }
  }
  return issues;
}

/**
 * Utilización del perímetro: metros disponibles frente a los exigidos por la
 * separación de servicio (`GUEST_PITCH_M`). Devuelve 0..1.
 * Sirve para avisar "esta mesa va al límite" sin inventarse una tabla mágica.
 */
export function pitchUtilisation(shape: TableShape, seats: number): number {
  if (seats <= 0) return 0;
  const metrics = TABLE_METRICS[shape];
  const perimeter = shape === 'round' ? Math.PI * metrics.width : 2 * metrics.width + 2 * metrics.height;
  const needed = seats * GUEST_PITCH_M;
  return Math.min(1, perimeter / Math.max(needed, 0.0001));
}
