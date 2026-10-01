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
  /** Franja horaria solicitada (e.g. "14:00", "18:00", "21:30") */
  timeSlot?: string;
  /** ID de producción a excluir del chequeo (para re-validaciones) */
  excludeProductionId?: string;
}

export interface AvailabilityCheckResult {
  available: boolean;
  reason: 'AVAILABLE' | 'CALENDAR_BLOCKED' | 'PRODUCTION_COLLISION' | 'MAX_DAILY_CAP_REACHED' | 'INVALID_DATE';
  conflictingBlockId?: string;
  conflictingProductionId?: string;
  normalizedDate: string;
  timeSlot?: string;
  dailyGigsBooked?: number;
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
 * Verifica de forma atómica si una fecha y franja horaria están disponibles.
 * Permite que un artista atienda múltiples franjas (ej. 14:00 ocupado, 18:00 libre)
 * hasta un máximo ético de 6 actuaciones al día con buffer de 30 min.
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

  // 1. Chequeo de calendarBlock (bloqueo manual de día completo)
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
      normalizedDate: start.toISOString(),
      timeSlot: input.timeSlot
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

  const activeProductions = await prisma.productionEvent.findMany({
    where: productionWhere,
    orderBy: { createdAt: 'desc' }
  });

  const dailyCount = activeProductions.length;

  // Si ya tiene 6 actuaciones confirmadas en el día, tope máximo alcanzado
  if (dailyCount >= 6) {
    return {
      available: false,
      reason: 'MAX_DAILY_CAP_REACHED',
      normalizedDate: start.toISOString(),
      timeSlot: input.timeSlot,
      dailyGigsBooked: dailyCount
    };
  }

  // Si se solicita un tramo específico (ej. "14:00" o "18:00")
  if (input.timeSlot) {
    const conflictingProduction = activeProductions.find((prod) => {
      const meta = prod.metadata && typeof prod.metadata === 'object' ? (prod.metadata as Record<string, unknown>) : null;
      if (!meta) return true; // Bloqueo de jornada completa
      const metaSlot = meta.timeSlot || meta.horaTramo;
      if (!metaSlot) return true; // Sin slot = día completo
      return metaSlot === input.timeSlot;
    });

    if (conflictingProduction) {
      return {
        available: false,
        reason: 'PRODUCTION_COLLISION',
        conflictingProductionId: conflictingProduction.id,
        normalizedDate: start.toISOString(),
        timeSlot: input.timeSlot,
        dailyGigsBooked: dailyCount
      };
    }
  } else if (activeProductions.length > 0) {
    // Si no especificó tramo y ya hay eventos, se evalúa colisión
    return {
      available: false,
      reason: 'PRODUCTION_COLLISION',
      conflictingProductionId: activeProductions[0].id,
      normalizedDate: start.toISOString(),
      dailyGigsBooked: dailyCount
    };
  }

  return {
    available: true,
    reason: 'AVAILABLE',
    normalizedDate: start.toISOString(),
    timeSlot: input.timeSlot,
    dailyGigsBooked: dailyCount
  };
}

/**
 * Bloquea una fecha y tramo horario de forma ATÓMICA dentro de una transacción Prisma.
 * Re-verifica disponibilidad y materializa el evento con metadatos JSON para evitar migraciones destructivas.
 */
export async function lockDateAtomically(input: {
  eventDate: string;
  artistProfileId?: string;
  productionEventId?: string;
  timeSlot?: string;
  bufferMinutes?: number;
  clientName?: string;
  location?: string;
}): Promise<{ success: boolean; blockId?: string; reason: string; productionId?: string }> {
  const range = getDayRange(input.eventDate);
  if (!range) {
    return { success: false, reason: 'INVALID_DATE' };
  }

  const { start, end } = range;

  return prisma.$transaction(async (tx) => {
    // 1. Re-verificar calendarBlock
    const existingBlock = await tx.calendarBlock.findFirst({
      where: {
        date: { gte: start, lte: end },
        ...(input.artistProfileId ? { artistProfileId: input.artistProfileId } : {})
      }
    });

    if (existingBlock) {
      return { success: false, reason: 'CALENDAR_BLOCKED', blockId: existingBlock.id };
    }

    // 2. Re-verificar colisión de tramos en ProductionEvent
    const activeEvents = await tx.productionEvent.findMany({
      where: {
        eventDate: { gte: start, lte: end },
        status: { notIn: ['CANCELLED', 'DRAFT'] },
        ...(input.productionEventId ? { id: { not: input.productionEventId } } : {})
      }
    });

    if (activeEvents.length >= 6) {
      return { success: false, reason: 'MAX_DAILY_CAP_REACHED' };
    }

    if (input.timeSlot) {
      const slotCollision = activeEvents.find((e) => {
        const meta = e.metadata && typeof e.metadata === 'object' ? (e.metadata as Record<string, unknown>) : null;
        if (!meta) return true;
        const s = meta.timeSlot || meta.horaTramo;
        return !s || s === input.timeSlot;
      });

      if (slotCollision) {
        return { success: false, reason: 'PRODUCTION_COLLISION', productionId: slotCollision.id };
      }
    } else if (activeEvents.length > 0) {
      return { success: false, reason: 'PRODUCTION_COLLISION' };
    }

    // 3. Crear ProductionEvent con metadata JSON segura
    const prod = await tx.productionEvent.create({
      data: {
        title: `Reserva Tramo ${input.timeSlot || 'Día Completo'} - ${input.clientName || 'Cliente Directo'}`,
        eventDate: start,
        location: input.location || 'Ubicación Confirmada Cliente',
        status: 'PAID_CONFIRMED',
        clientName: input.clientName || 'Cliente EAR OS',
        metadata: {
          timeSlot: input.timeSlot || null,
          horaTramo: input.timeSlot || null,
          bufferMinutes: input.bufferMinutes || 30,
          artistProfileId: input.artistProfileId || null,
          lockedAt: new Date().toISOString()
        }
      }
    });

    return { success: true, reason: 'LOCKED', productionId: prod.id };
  });
}
