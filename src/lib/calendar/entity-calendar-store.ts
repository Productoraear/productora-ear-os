/**
 * ════════════════════════════════════════════════════════════════════════════
 * PERSISTENCIA DEL CALENDARIO POR ENTIDAD · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Sustituye el `Map<string, ...>` volátil de `vendorCalendarActions.ts`, que:
 *   1. Sembraba a TODOS los proveedores con las fechas reservadas de Edwin
 *      (`['2026-10-12','2026-10-25','2026-11-15']`) — fuga de agenda cruzada.
 *   2. Perdía los bloqueos en cada cold start del servidor.
 *
 * Aquí:
 *   · Cada entidad vive bajo su clave `kind:slug` (aislamiento total).
 *   · Persistencia durable en disco (`.data/entity-calendars.json`), escritura
 *     atómica (tmp + rename) y mutaciones serializadas en proceso.
 *   · Cold start NUNCA inventa fechas: un registro nuevo nace vacío.
 *   · Fallback a memoria si el FS es de solo lectura (edge/CI) sin romper la UX.
 *
 * SOLO SERVIDOR. No importar desde componentes `'use client'`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type {
  CalendarEntityKind,
  EntityCalendarRecord,
  EntitySlotReservationResult,
} from '@/lib/calendar/entity-calendar-types';
import {
  CALENDAR_MAX_SERVICES_PER_DAY,
  findTimeSlot,
} from '@/lib/calendar/entity-calendar-types';

const STORE_FILE =
  process.env.EAR_ENTITY_CALENDAR_STORE?.trim() ||
  path.join(process.cwd(), '.data', 'entity-calendars.json');

type CalendarStoreShape = Record<string, EntityCalendarRecord>;

interface StoreCache {
  loaded: boolean;
  data: CalendarStoreShape;
}

const globalCache = globalThis as typeof globalThis & {
  __earEntityCalendarCache?: StoreCache;
  __earEntityCalendarQueue?: Promise<unknown>;
};

const cache: StoreCache = (globalCache.__earEntityCalendarCache ??= { loaded: false, data: {} });

/** Serializa mutaciones para erradicar lost-updates bajo concurrencia. */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = globalCache.__earEntityCalendarQueue ?? Promise.resolve();
  const next = previous.then(task, task);
  globalCache.__earEntityCalendarQueue = next.catch(() => undefined);
  return next;
}

/** Slug canónico: minúsculas, alfanumérico y guiones. `null` si es inseguro. */
export function sanitizeEntitySlug(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  const normalized = decoded.trim().toLowerCase();
  if (!normalized || normalized.length > 120) return null;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(normalized)) return null;
  return normalized;
}

/** Clave canónica de aislamiento. */
export function calendarKey(kind: CalendarEntityKind, slug: string): string {
  return `${kind}:${slug}`;
}

/** Valida `YYYY-MM-DD` real (rechaza 2026-02-31). */
export function isValidIsoDate(raw: string | null | undefined): raw is string {
  if (typeof raw !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  const parsed = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === raw;
}

function sortedUnique(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function emptyRecord(
  kind: CalendarEntityKind,
  slug: string,
  displayName: string,
): EntityCalendarRecord {
  return {
    kind,
    slug,
    displayName,
    blockedDates: [],
    reservedSlots: {},
    confirmedDates: [],
    externalIcalUrl: null,
    updatedAt: new Date().toISOString(),
  };
}

async function loadFromDisk(): Promise<void> {
  if (cache.loaded) return;
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const result: CalendarStoreShape = {};
      for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (!value || typeof value !== 'object') continue;
        const record = value as Partial<EntityCalendarRecord>;
        if (typeof record.kind !== 'string' || typeof record.slug !== 'string') continue;
        result[key] = {
          kind: record.kind as CalendarEntityKind,
          slug: record.slug,
          displayName: typeof record.displayName === 'string' ? record.displayName : record.slug,
          blockedDates: Array.isArray(record.blockedDates)
            ? sortedUnique(record.blockedDates.filter(isValidIsoDate))
            : [],
          reservedSlots:
            record.reservedSlots && typeof record.reservedSlots === 'object'
              ? Object.fromEntries(
                  Object.entries(record.reservedSlots)
                    .filter(([date]) => isValidIsoDate(date))
                    .map(([date, slots]) => [
                      date,
                      Array.isArray(slots)
                        ? sortedUnique(slots.filter((s): s is string => typeof s === 'string'))
                        : [],
                    ]),
                )
              : {},
          confirmedDates: Array.isArray(record.confirmedDates)
            ? sortedUnique(record.confirmedDates.filter(isValidIsoDate))
            : [],
          externalIcalUrl:
            typeof record.externalIcalUrl === 'string' ? record.externalIcalUrl : null,
          updatedAt:
            typeof record.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
        };
      }
      cache.data = result;
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      console.warn('[entityCalendarStore] store ilegible, se opera en memoria:', code ?? error);
    }
  } finally {
    cache.loaded = true;
  }
}

async function persistToDisk(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
    const tmp = `${STORE_FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(cache.data, null, 2), 'utf8');
    await fs.rename(tmp, STORE_FILE);
  } catch (error) {
    // FS de solo lectura (CI/edge): la memoria mantiene la sesión viva.
    console.warn('[entityCalendarStore] persistencia no disponible:', error);
  }
}

/**
 * Devuelve el calendario de una entidad. Crea el registro vacío si no existe.
 * NUNCA inyecta fechas ajenas (la semilla contaminante de Edwin queda erradicada).
 */
export async function getEntityCalendar(
  kind: CalendarEntityKind,
  slug: string,
  displayName?: string,
): Promise<EntityCalendarRecord> {
  await loadFromDisk();
  const key = calendarKey(kind, slug);
  const existing = cache.data[key];
  if (existing) {
    if (displayName && displayName.trim() && existing.displayName !== displayName) {
      existing.displayName = displayName.trim();
    }
    return existing;
  }

  const created = emptyRecord(kind, slug, displayName?.trim() || slug);
  cache.data[key] = created;
  await enqueue(persistToDisk);
  return created;
}

/** Alterna el bloqueo de una fecha (día completo) para UNA entidad. */
export async function toggleEntityDateBlock(
  kind: CalendarEntityKind,
  slug: string,
  date: string,
  displayName?: string,
): Promise<{ record: EntityCalendarRecord; action: 'block' | 'unblock'; date: string } | null> {
  if (!isValidIsoDate(date)) return null;
  const record = await getEntityCalendar(kind, slug, displayName);

  const action = await enqueue(async (): Promise<'block' | 'unblock'> => {
    const index = record.blockedDates.indexOf(date);
    if (index >= 0) {
      record.blockedDates.splice(index, 1);
      record.confirmedDates = record.confirmedDates.filter((d) => d !== date);
      record.updatedAt = new Date().toISOString();
      await persistToDisk();
      return 'unblock';
    }
    record.blockedDates = sortedUnique([...record.blockedDates, date]);
    record.updatedAt = new Date().toISOString();
    await persistToDisk();
    return 'block';
  });

  return { record, action, date };
}

/** Reemplaza la lista completa de bloqueos (importación iCal / conciliación). */
export async function setEntityBlockedDates(
  kind: CalendarEntityKind,
  slug: string,
  dates: readonly string[],
  displayName?: string,
): Promise<EntityCalendarRecord> {
  const record = await getEntityCalendar(kind, slug, displayName);
  await enqueue(async () => {
    record.blockedDates = sortedUnique(dates.filter(isValidIsoDate));
    record.updatedAt = new Date().toISOString();
    await persistToDisk();
  });
  return record;
}

/** Guarda la URL del feed externo Google/Apple Calendar de la entidad. */
export async function setEntityExternalIcal(
  kind: CalendarEntityKind,
  slug: string,
  icalUrl: string | null,
  displayName?: string,
): Promise<EntityCalendarRecord> {
  const record = await getEntityCalendar(kind, slug, displayName);
  await enqueue(async () => {
    const candidate = typeof icalUrl === 'string' ? icalUrl.trim() : '';
    record.externalIcalUrl = /^https:\/\/[^\s]+$/i.test(candidate) ? candidate.slice(0, 500) : null;
    record.updatedAt = new Date().toISOString();
    await persistToDisk();
  });
  return record;
}

/**
 * Reserva atómica de una franja de UNA entidad.
 * Reglas: día no bloqueado, franja canónica existente, sin duplicado,
 * tope de 6 servicios/día con buffer de 30 min.
 */
export async function reserveEntitySlot(
  kind: CalendarEntityKind,
  slug: string,
  date: string,
  timeSlot: string,
  displayName?: string,
): Promise<EntitySlotReservationResult> {
  const normalizedSlot = timeSlot.trim().slice(0, 5);
  const slot = findTimeSlot(normalizedSlot);
  if (!isValidIsoDate(date) || !slot) {
    return { success: false, date, timeSlot: normalizedSlot, reason: 'INVALID_INPUT', bookedSlots: [] };
  }

  const record = await getEntityCalendar(kind, slug, displayName);

  return enqueue(async (): Promise<EntitySlotReservationResult> => {
    const booked = record.reservedSlots[date] ?? [];

    if (record.blockedDates.includes(date)) {
      return { success: false, date, timeSlot: slot.startTime, reason: 'FULL_DAY_BLOCKED', bookedSlots: booked };
    }
    if (booked.includes(slot.startTime)) {
      return { success: false, date, timeSlot: slot.startTime, reason: 'ALREADY_RESERVED', bookedSlots: booked };
    }
    if (booked.length >= CALENDAR_MAX_SERVICES_PER_DAY) {
      return { success: false, date, timeSlot: slot.startTime, reason: 'MAX_DAILY_CAP_REACHED', bookedSlots: booked };
    }

    const next = sortedUnique([...booked, slot.startTime]);
    record.reservedSlots[date] = next;
    record.confirmedDates = sortedUnique([...record.confirmedDates, date]);
    record.updatedAt = new Date().toISOString();
    await persistToDisk();

    return { success: true, date, timeSlot: slot.startTime, reason: 'RESERVED', bookedSlots: next };
  });
}

/** Libera una reserva (cancelación / reembolso). */
export async function releaseEntitySlot(
  kind: CalendarEntityKind,
  slug: string,
  date: string,
  timeSlot: string,
): Promise<EntitySlotReservationResult> {
  const normalizedSlot = timeSlot.trim().slice(0, 5);
  if (!isValidIsoDate(date) || !findTimeSlot(normalizedSlot)) {
    return { success: false, date, timeSlot: normalizedSlot, reason: 'INVALID_INPUT', bookedSlots: [] };
  }
  const record = await getEntityCalendar(kind, slug);

  return enqueue(async (): Promise<EntitySlotReservationResult> => {
    const booked = record.reservedSlots[date] ?? [];
    const next = booked.filter((slot) => slot !== normalizedSlot);
    if (next.length === 0) {
      delete record.reservedSlots[date];
      record.confirmedDates = record.confirmedDates.filter((d) => d !== date);
    } else {
      record.reservedSlots[date] = next;
    }
    record.updatedAt = new Date().toISOString();
    await persistToDisk();
    return {
      success: true,
      date,
      timeSlot: normalizedSlot,
      reason: 'RESERVED' as const,
      bookedSlots: next,
    };
  });
}

/** Instantánea de todos los calendarios (telemetría / panel admin). */
export async function listEntityCalendars(): Promise<readonly EntityCalendarRecord[]> {
  await loadFromDisk();
  return Object.values(cache.data);
}

/** Borra un calendario (solo operaciones de soporte/admin). */
export async function deleteEntityCalendar(
  kind: CalendarEntityKind,
  slug: string,
): Promise<boolean> {
  await loadFromDisk();
  const key = calendarKey(kind, slug);
  if (!cache.data[key]) return false;
  return enqueue(async () => {
    delete cache.data[key];
    await persistToDisk();
    return true;
  });
}

/** Fija explícitamente el estado de bloqueo de una fecha (idempotente). */
export async function setEntityDateBlock(
  kind: CalendarEntityKind,
  slug: string,
  date: string,
  blocked: boolean,
  displayName?: string,
): Promise<EntityCalendarRecord | null> {
  if (!isValidIsoDate(date)) return null;
  const record = await getEntityCalendar(kind, slug, displayName);

  await enqueue(async () => {
    const isBlocked = record.blockedDates.includes(date);
    if (blocked && !isBlocked) {
      record.blockedDates = sortedUnique([...record.blockedDates, date]);
    } else if (!blocked && isBlocked) {
      record.blockedDates = record.blockedDates.filter((d) => d !== date);
      record.confirmedDates = record.confirmedDates.filter((d) => d !== date);
    }
    record.updatedAt = new Date().toISOString();
    await persistToDisk();
  });

  return record;
}
