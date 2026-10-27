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
  /**
   * Tipología de la entidad dueña de la agenda (`artista`, `catering`, `finca`…).
   * Sin esto, el lock comparaba TODAS las agendas del ecosistema entre sí.
   */
  entityKind?: string;
  /** Slug canónico de la entidad dueña de la agenda (`edwin-agudelo`, `abc-espacio-71015`…). */
  entitySlug?: string;
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
  /** Entidad efectivamente evaluada (auditoría: nunca "global" por accidente). */
  entityScope?: string;
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

/** Clave de aislamiento de la entidad evaluada (`kind:slug`) o `null`. */
function entityScope(input: { entityKind?: string; entitySlug?: string }): string | null {
  if (!input.entitySlug) return null;
  const kind = (input.entityKind || 'servicios').trim().toLowerCase();
  return `${kind}:${input.entitySlug.trim().toLowerCase()}`;
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
  const scope = entityScope(input);

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
      timeSlot: input.timeSlot,
      entityScope: scope ?? undefined
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
  // AISLAMIENTO POR ENTIDAD: sin este filtro, la reserva de un catering
  // bloqueaba la agenda de un mariachi en la misma fecha (colisión cruzada).
  if (scope && input.entitySlug) {
    productionWhere.metadata = {
      path: ['entitySlug'],
      equals: input.entitySlug.trim().toLowerCase()
    };
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
      dailyGigsBooked: dailyCount,
      entityScope: scope ?? undefined
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
        dailyGigsBooked: dailyCount,
        entityScope: scope ?? undefined
      };
    }
  } else if (activeProductions.length > 0) {
    // Si no especificó tramo y ya hay eventos, se evalúa colisión
    return {
      available: false,
      reason: 'PRODUCTION_COLLISION',
      conflictingProductionId: activeProductions[0].id,
      normalizedDate: start.toISOString(),
      dailyGigsBooked: dailyCount,
      entityScope: scope ?? undefined
    };
  }

  return {
    available: true,
    reason: 'AVAILABLE',
    normalizedDate: start.toISOString(),
    timeSlot: input.timeSlot,
    dailyGigsBooked: dailyCount,
    entityScope: scope ?? undefined
  };
}

/**
 * Bloquea una fecha y tramo horario de forma ATÓMICA dentro de una transacción Prisma.
 * Re-verifica disponibilidad y materializa el evento con metadatos JSON para evitar migraciones destructivas.
 */
export async function lockDateAtomically(input: {
  eventDate: string;
  artistProfileId?: string;
  /** Tipología de la entidad dueña de la agenda (aislamiento por rol). */
  entityKind?: string;
  /** Slug canónico de la entidad dueña de la agenda. */
  entitySlug?: string;
  productionEventId?: string;
  timeSlot?: string;
  bufferMinutes?: number;
  clientName?: string;
  location?: string;
  stripeSessionId?: string;
}): Promise<{ success: boolean; blockId?: string; reason: string; productionId?: string }> {
  const range = getDayRange(input.eventDate);
  if (!range) {
    return { success: false, reason: 'INVALID_DATE' };
  }

  const { start, end } = range;
  const scope = entityScope(input);
  const normalizedEntitySlug = input.entitySlug?.trim().toLowerCase() ?? null;

  return prisma.$transaction(async (tx) => {
    // 0. Idempotencia Stripe: si ya se materializó un bloqueo para esta sesión, devolver éxito (evita duplicados ante retries del webhook).
    if (input.stripeSessionId) {
      const existingBySession = await tx.productionEvent.findFirst({
        where: { metadata: { path: ['stripeSessionId'], equals: input.stripeSessionId } }
      });
      if (existingBySession) {
        return { success: true, reason: 'LOCKED', productionId: existingBySession.id };
      }
    }

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

    // 2. Re-verificar colisión de tramos en ProductionEvent (aislada por entidad)
    const activeEvents = await tx.productionEvent.findMany({
      where: {
        eventDate: { gte: start, lte: end },
        status: { notIn: ['CANCELLED', 'DRAFT'] },
        ...(input.productionEventId ? { id: { not: input.productionEventId } } : {}),
        // Sin este filtro la reserva de un proveedor colisionaba con TODAS las
        // agendas del ecosistema (causa raíz de las incoherencias multi-rol).
        ...(normalizedEntitySlug
          ? { metadata: { path: ['entitySlug'], equals: normalizedEntitySlug } }
          : {})
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
          entityKind: input.entityKind || null,
          entitySlug: normalizedEntitySlug,
          entityScope: scope,
          stripeSessionId: input.stripeSessionId || null,
          lockedAt: new Date().toISOString()
        }
      }
    });

    return { success: true, reason: 'LOCKED', productionId: prod.id };
  });
}
