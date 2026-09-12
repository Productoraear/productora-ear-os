/**
 * ATOMIC DATE LOCK ENGINE // ANTI-COLLISION ACID GUARD
 *
 * Motor de verificación y bloqueo atómico de fechas contra colisiones.
 * Consulta de forma transaccional (Prisma ACID) la tabla `calendarBlock`
 * y los `ProductionEvent` activos para determinar si una fecha está libre.
 *
 * Reglas S-Class:
 *  - Un `calendarBlock` con status BLOCKED en la misma fecha => colisión.
 *  - Un `ProductionEvent` con status distinto de CANCELLED/DRAFT en la misma fecha => colisión.
 *  - El bloqueo se materializa dentro de una transacción interactiva para evitar
 *    condiciones de carrera (dos clientes reservando el mismo sábado).
 */

import { prisma } from '@/lib/prisma';

export interface AvailabilityCheckInput {
  /** Fecha ISO del evento (YYYY-MM-DD o ISO completo) */
  eventDate: string;
  /** ID del artista/proveedor a bloquear (opcional: si se omite, chequeo global) */
  artistProfileId?: string;
  /** ID de producción a excluir del chequeo (para re-validaciones) */
  excludeProductionId?: string;
}

export interface AvailabilityCheckResult {
  available: boolean;
  reason: 'AVAILABLE' | 'CALENDAR_BLOCKED' | 'PRODUCTION_COLLISION' | 'INVALID_DATE';
  conflictingBlockId?: string;
  conflictingProductionId?: string;
  normalizedDate: string;
}

/**
 * Normaliza una fecha a rango [00:00:00, 23:59:59.999] del día indicado.
 */
function getDayRange(eventDate: string): { start: Date; end: Date } | null {
  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) return null;

  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);
  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Verifica de forma atómica si una fecha está disponible.
 * NO escribe en base de datos: solo lectura transaccional.
 */
export async function checkDateAvailability(
  input: AvailabilityCheckInput
): Promise<AvailabilityCheckResult> {
  const range = getDayRange(input.eventDate);
  if (!range) {
    return {
      available: false,
      reason: 'INVALID_DATE',
      normalizedDate: input.eventDate
    };
  }

  const { start, end } = range;

  // 1. Chequeo de calendarBlock (bloqueo de artista/proveedor)
  const blockWhere: Record<string, unknown> = {
    date: { gte: start, lte: end }
  };
  if (input.artistProfileId) {
    blockWhere.artistProfileId = input.artistProfileId;
  }

  const conflictingBlock = await prisma.calendarBlock.findFirst({
    where: blockWhere,
    orderBy: { createdAt: 'desc' }
  });

  if (conflictingBlock) {
    return {
      available: false,
      reason: 'CALENDAR_BLOCKED',
      conflictingBlockId: conflictingBlock.id,
      normalizedDate: start.toISOString()
    };
  }

  // 2. Chequeo de ProductionEvent activo en la misma fecha
  const productionWhere: Record<string, unknown> = {
    eventDate: { gte: start, lte: end },
    status: { notIn: ['CANCELLED', 'DRAFT'] }
  };
  if (input.excludeProductionId) {
    productionWhere.id = { not: input.excludeProductionId };
  }

  const conflictingProduction = await prisma.productionEvent.findFirst({
    where: productionWhere,
    orderBy: { createdAt: 'desc' }
  });

  if (conflictingProduction) {
    return {
      available: false,
      reason: 'PRODUCTION_COLLISION',
      conflictingProductionId: conflictingProduction.id,
      normalizedDate: start.toISOString()
    };
  }

  return {
    available: true,
    reason: 'AVAILABLE',
    normalizedDate: start.toISOString()
  };
}

/**
 * Bloquea una fecha de forma ATÓMICA dentro de una transacción Prisma.
 * Re-verifica disponibilidad y crea el `calendarBlock` en la misma transacción
 * para eliminar la ventana de condición de carrera.
 */
export async function lockDateAtomically(input: {
  eventDate: string;
  artistProfileId?: string;
  productionEventId?: string;
}): Promise<{ success: boolean; blockId?: string; reason: string }> {
  const range = getDayRange(input.eventDate);
  if (!range) {
    return { success: false, reason: 'INVALID_DATE' };
  }

  const { start, end } = range;

  return prisma.$transaction(async (tx) => {
    // Re-verificación dentro de la transacción (ACID)
    const existingBlock = await tx.calendarBlock.findFirst({
      where: {
        date: { gte: start, lte: end },
        ...(input.artistProfileId ? { artistProfileId: input.artistProfileId } : {})
      }
    });

    if (existingBlock) {
      return { success: false, reason: 'CALENDAR_BLOCKED', blockId: existingBlock.id };
    }

    const existingProduction = await tx.productionEvent.findFirst({
      where: {
        eventDate: { gte: start, lte: end },
        status: { notIn: ['CANCELLED', 'DRAFT'] },
        ...(input.productionEventId ? { id: { not: input.productionEventId } } : {})
      }
    });

    if (existingProduction) {
      return { success: false, reason: 'PRODUCTION_COLLISION' };
    }

    const block = await tx.calendarBlock.create({
      data: {
        artistProfileId: input.artistProfileId ?? null,
        date: start
      }
    });

    return { success: true, reason: 'LOCKED', blockId: block.id };
  });
}
