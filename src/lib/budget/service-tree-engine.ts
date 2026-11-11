/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE ÁRBOL DE SERVICIOS (ORDEN 2026-11-11 · CALCULADORA UNIFICADA)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el formulario NO admite «5 casillas rígidas». Cada ficha de
 * proveedor registra N servicios/extras, cada uno con su precio unitario, y
 * todos se agregan reactivamente a su macro-partida.
 *
 * ARQUITECTURA (dos niveles, dinero SIEMPRE en céntimos enteros):
 *
 *   Nivel 1 · Macro-partida → `budget-allocator-engine.ts` (Zona Cero, INV-05)
 *             Reparto 50/15/15/10/10 con candados pesimistas 🔒.
 *   Nivel 2 · Sub-servicio  → ESTE módulo. Ilimitado, dinámico, por proveedor.
 *             `precio unitario × cantidad` en céntimos, agregado al padre.
 *
 * REGLAS DURAS:
 *   · Cero `float` en el camino del dinero: se convierte a céntimos una vez en
 *     el boundary y se opera con enteros (tolerancia 0 al descuadre).
 *   · Un candado 🔒 congela una macro-partida: sus sub-servicios no pueden
 *     alterar el importe bloqueado (`LOCKED_MACRO`).
 *   · Σ sub-servicios de una partida vs importe asignado: el delta se declara,
 *     jamás se esconde.
 *   · Cero precios de negocio aquí: tarifa base, km, split y depósito salen de
 *     `ear-os-ssot.ts` / `pricing.ts` (INV-01..INV-03, INV-10).
 *
 * MÓDULO PURO: sin `node:fs`, sin Prisma, sin `next/*`. Importable desde
 * Client Components (el planner lo usa) y desde Route Handlers.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  BUDGET_CATEGORIES,
  createAllocation,
  type BudgetCategoryId,
} from '@/lib/budget/budget-allocator-engine';

/* ──────────────────────────────────────────────────────────────────────────── */
/* Contratos                                                                   */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Sub-servicio de una ficha de proveedor (hoja del árbol).
 * `unitPriceCents` es un ENTERO: la conversión desde euros ocurre en el boundary.
 */
export interface ServiceNode {
  /** Identificador estable y único en todo el árbol (idempotencia). */
  readonly id: string;
  /** Macro-partida a la que se agrega. Debe ser una de las 5 canónicas. */
  readonly category: BudgetCategoryId;
  readonly label: string;
  /** Precio unitario en céntimos enteros (≥ 0). */
  readonly unitPriceCents: number;
  /** Unidades (pax, horas, servicios). Entero ≥ 1. */
  readonly quantity: number;
  /** Proveedor de origen: trazabilidad del embudo (ficha → simulación). */
  readonly providerId: string | null;
  readonly providerSlug: string | null;
  /** Marcado/desmarcado de la casilla en el formulario. */
  readonly selected: boolean;
}

/** Agregado por macro-partida: qué servicios la componen y cuánto suman. */
export interface MacroPartida {
  readonly id: BudgetCategoryId;
  readonly label: string;
  /** Peso canónico sobre 100 (del motor de Zona Cero, no inventado). */
  readonly weight: number;
  /** Importe asignado por el motor de balanceo (céntimos). */
  readonly allocatedCents: number;
  /** Σ de los sub-servicios marcados (céntimos). */
  readonly servicesCents: number;
  /** `allocatedCents - servicesCents`: >0 sobra, <0 se pasa. Nunca se oculta. */
  readonly deltaCents: number;
  readonly locked: boolean;
  /** `false` si el candado impide absorber el cambio de sus servicios. */
  readonly acceptsServices: boolean;
  readonly services: readonly ServiceNode[];
}

/** Violación declarada, en vocabulario cerrado. Una violación es un dato. */
export type ServiceTreeViolationCode =
  | 'NEGATIVE_PRICE'
  | 'NEGATIVE_QUANTITY'
  | 'UNKNOWN_CATEGORY'
  | 'DUPLICATE_ID'
  | 'LOCKED_MACRO'
  | 'BALANCE_VIOLATION';

export interface ServiceTreeViolation {
  readonly code: ServiceTreeViolationCode;
  readonly detail: string;
  readonly nodeId: string | null;
}

/** Resultado completo del balanceo jerárquico. */
export interface ServiceTreeResult {
  readonly totalCents: number;
  /** Σ de sub-servicios marcados en TODAS las partidas. */
  readonly selectedServicesCents: number;
  readonly macroPartidas: readonly MacroPartida[];
  /** Céntimos sin asignar a ninguna partida (total - Σ asignado). */
  readonly unassignedCents: number;
  /** `true` ⇔ Σ asignado === total y ningún candado quedó violado. */
  readonly balanced: boolean;
  readonly violations: readonly ServiceTreeViolation[];
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Validación y conversión (el boundary del dinero)                            */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Techo técnico por servicio: 10 M € en céntimos (evita desbordes). */
export const MAX_UNIT_PRICE_CENTS: number = 1_000_000_000;
/** Techo de unidades por servicio (pax/horas razonables). */
export const MAX_QUANTITY: number = 100_000;

/**
 * Euros con 2 decimales → céntimos enteros.
 * Lanza `IMPORTE_NO_TIENE_CENTIMOS_EXACTOS` si el valor no es convertible sin
 * pérdida: tolerancia CERO al descuadre (un 350,001 € es un error, no un redondeo).
 */
export function eurToCentsExact(value: number): number {
  if (!Number.isFinite(value)) throw new Error('IMPORTE_NO_FINITO');
  const cents: number = Math.round(value * 100);
  // Sólo se admite el error de representación binaria (1e-9), nunca un céntimo.
  if (Math.abs(value * 100 - cents) > 1e-6) throw new Error('IMPORTE_NO_TIENE_CENTIMOS_EXACTOS');
  return cents;
}

/** Céntimos enteros → euros con 2 decimales (sólo para presentación). */
export function centsToEurExact(cents: number): number {
  return Math.round(cents) / 100;
}

/**
 * Valida el árbol y devuelve las violaciones (sin mutar nada).
 * Un nodo inválido NO se descarta en silencio: se declara.
 */
export function validateServiceTree(
  nodes: readonly ServiceNode[],
): readonly ServiceTreeViolation[] {
  const violations: ServiceTreeViolation[] = [];
  const seen: Set<string> = new Set<string>();

  for (const node of nodes) {
    if (seen.has(node.id)) {
      violations.push({ code: 'DUPLICATE_ID', detail: `id repetido: ${node.id}`, nodeId: node.id });
    }
    seen.add(node.id);

    if (!Number.isInteger(node.unitPriceCents) || node.unitPriceCents < 0) {
      violations.push({
        code: 'NEGATIVE_PRICE',
        detail: `precio unitario no es entero ≥ 0: ${String(node.unitPriceCents)}`,
        nodeId: node.id,
      });
    } else if (node.unitPriceCents > MAX_UNIT_PRICE_CENTS) {
      violations.push({
        code: 'NEGATIVE_PRICE',
        detail: `precio unitario sobre el techo técnico: ${String(node.unitPriceCents)}`,
        nodeId: node.id,
      });
    }

    if (!Number.isInteger(node.quantity) || node.quantity < 1 || node.quantity > MAX_QUANTITY) {
      violations.push({
        code: 'NEGATIVE_QUANTITY',
        detail: `cantidad fuera de rango [1, ${String(MAX_QUANTITY)}]: ${String(node.quantity)}`,
        nodeId: node.id,
      });
    }

    const known: boolean = BUDGET_CATEGORIES.some((rule) => rule.id === node.category);
    if (!known) {
      violations.push({
        code: 'UNKNOWN_CATEGORY',
        detail: `categoría fuera de la Zona Cero: ${String(node.category)}`,
        nodeId: node.id,
      });
    }
  }

  return violations;
}

/** Importe de un nodo en céntimos (`unitPriceCents × quantity`), entero. */
export function nodeTotalCents(node: ServiceNode): number {
  return node.unitPriceCents * node.quantity;
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Balanceo jerárquico (macro-partidas de Zona Cero + N sub-servicios)         */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Opciones del balanceo. `locked` son las macro-partidas con candado 🔒
 * (pesimista: su importe no se rebalancea).
 */
export interface ServiceTreeOptions {
  /** Presupuesto total del evento en céntimos enteros. */
  readonly totalCents: number;
  /** Macro-partidas congeladas por el usuario. */
  readonly locked?: readonly BudgetCategoryId[];
}

/**
 * Agrega el árbol de servicios sobre el reparto canónico.
 *
 * El reparto de las macro-partidas NO se recalcula aquí: se delega en
 * `createAllocation` (Zona Cero). Este módulo sólo reparte los sub-servicios
 * en su padre y declara el delta. Un candado se respeta siempre.
 *
 * `allocations` permite inyectar un reparto ya calculado (por ejemplo el que
 * proviene de `createAllocation`) para no repetir la aritmética: si no se
 * facilita, se calcula con el motor de Zona Cero.
 */
export function aggregateServiceTree(
  nodes: readonly ServiceNode[],
  options: ServiceTreeOptions,
  allocations?: Readonly<Record<BudgetCategoryId, number>>,
): ServiceTreeResult {
  const violations: ServiceTreeViolation[] = [...validateServiceTree(nodes)];

  if (!Number.isInteger(options.totalCents) || options.totalCents < 0) {
    violations.push({
      code: 'BALANCE_VIOLATION',
      detail: `total no es un entero de céntimos ≥ 0: ${String(options.totalCents)}`,
      nodeId: null,
    });
  }

  const locked: readonly BudgetCategoryId[] = options.locked ?? [];
  const allocatedByCategory: Readonly<Record<BudgetCategoryId, number>> =
    allocations ?? computeAllocations(options.totalCents, locked);

  let selectedServicesCents = 0;
  const macroPartidas: MacroPartida[] = [];

  for (const rule of BUDGET_CATEGORIES) {
    const services: readonly ServiceNode[] = nodes.filter((node) => node.category === rule.id);
    const selected: readonly ServiceNode[] = services.filter((node) => node.selected);
    const servicesCents: number = selected.reduce(
      (sum: number, node: ServiceNode) => sum + nodeTotalCents(node),
      0,
    );
    const isLocked: boolean = locked.includes(rule.id);
    const allocatedCents: number = allocatedByCategory[rule.id];

    // Un candado 🔒 congelado no puede ser «absorbido» por sus servicios: si los
    // servicios marcados exceden el importe bloqueado, se declara LOCKED_MACRO.
    const acceptsServices: boolean = !isLocked || servicesCents <= allocatedCents;
    if (isLocked && servicesCents > allocatedCents) {
      violations.push({
        code: 'LOCKED_MACRO',
        detail:
          `partida bloqueada ${rule.id}: servicios ${servicesCents} céntimos exceden ` +
          `el importe congelado ${allocatedCents}`,
        nodeId: null,
      });
    }

    selectedServicesCents += servicesCents;

    macroPartidas.push({
      id: rule.id,
      label: rule.label,
      weight: rule.weight,
      allocatedCents,
      servicesCents,
      deltaCents: allocatedCents - servicesCents,
      locked: isLocked,
      acceptsServices,
      services,
    });
  }

  const assignedCents: number = macroPartidas.reduce(
    (sum: number, partida: MacroPartida) => sum + partida.allocatedCents,
    0,
  );
  const unassignedCents: number = options.totalCents - assignedCents;

  if (unassignedCents !== 0) {
    violations.push({
      code: 'BALANCE_VIOLATION',
      detail: `el reparto deja ${unassignedCents} céntimos sin asignar sobre ${options.totalCents}`,
      nodeId: null,
    });
  }

  const balanced: boolean = unassignedCents === 0 && violations.length === 0;

  return {
    totalCents: options.totalCents,
    selectedServicesCents,
    macroPartidas,
    unassignedCents,
    balanced,
    violations,
  };
}

/**
 * Reparto canónico desde la Zona Cero (`createAllocation`).
 * El total ya es un entero de céntimos, por lo que `totalCents / 100` es exacto
 * y no introduce error de coma flotante en el reparto.
 */
function computeAllocations(
  totalCents: number,
  locked: readonly BudgetCategoryId[],
): Readonly<Record<BudgetCategoryId, number>> {
  const allocation = createAllocation(totalCents / 100, locked);
  return allocation.amountsCents;
}

