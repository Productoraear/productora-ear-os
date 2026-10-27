/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE DISPONIBILIDAD POR ENTIDAD · CAPA PURA (cliente + servidor)
 * ════════════════════════════════════════════════════════════════════════════
 * Sin `node:fs`, sin Prisma, sin `any`: puede importarse desde componentes
 * `'use client'` y desde route handlers sin arrastrar dependencias de Node.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type {
  CalendarDayStatus,
  CalendarEntityKind,
  EntityCalendarRecord,
  EntityDayAvailability,
} from '@/lib/calendar/entity-calendar-types';
import {
  CALENDAR_MAX_SERVICES_PER_DAY,
  CALENDAR_TIME_SLOTS,
  getCalendarEntityKindMeta,
} from '@/lib/calendar/entity-calendar-types';

const MONTH_NAMES_ES: readonly string[] = Object.freeze([
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]);

export function getMonthNameEs(month: number): string {
  return MONTH_NAMES_ES[((month % 12) + 12) % 12];
}

/** Fecha local `YYYY-MM-DD` (sin desfase UTC, a diferencia de toISOString). */
export function toIsoDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * URL canónica del calendario de una entidad.
 * Es la ÚNICA fuente de verdad para todos los CTA de "Bloquear fecha":
 * artista → su agenda, catering → su agenda, finca → su agenda…
 */
export function buildEntityCalendarHref(
  kind: CalendarEntityKind,
  slug: string,
  options?: { date?: string | null; timeSlot?: string | null; intent?: 'bloquear' | 'ver' },
): string {
  const params = new URLSearchParams();
  if (options?.date) params.set('date', options.date.slice(0, 10));
  if (options?.timeSlot) params.set('slot', options.timeSlot.slice(0, 5));
  if (options?.intent) params.set('intent', options.intent);
  const query = params.toString();
  return `/calendario/${kind}/${encodeURIComponent(slug)}${query ? `?${query}` : ''}`;
}

/** Feed .ics canónico de la entidad (exportable a Google/Apple Calendar). */
export function buildEntityIcalHref(kind: CalendarEntityKind, slug: string): string {
  return `/api/calendar/${kind}/${encodeURIComponent(slug)}/ical`;
}

/** Resumen legible de ocupación de un registro. */
export interface EntityCalendarSummary {
  readonly blockedCount: number;
  readonly confirmedCount: number;
  readonly dailyCapacity: number;
  readonly occupancyPercent: number;
  readonly nextFreeDate: string | null;
}

export function summarizeEntityCalendar(
  record: EntityCalendarRecord,
  todayIso: string = toIsoDateLocal(new Date()),
): EntityCalendarSummary {
  const blocked = new Set(record.blockedDates);
  const confirmed = new Set(record.confirmedDates);

  let nextFreeDate: string | null = null;
  const cursor = new Date(`${todayIso}T00:00:00`);
  for (let i = 0; i < 365; i++) {
    const candidate = toIsoDateLocal(cursor);
    const booked = record.reservedSlots[candidate]?.length ?? 0;
    if (!blocked.has(candidate) && booked < CALENDAR_MAX_SERVICES_PER_DAY) {
      nextFreeDate = candidate;
      break;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const totalTracked = blocked.size + confirmed.size;
  const occupancyPercent = totalTracked === 0 ? 0 : Math.round((confirmed.size / totalTracked) * 100);

  return {
    blockedCount: blocked.size,
    confirmedCount: confirmed.size,
    dailyCapacity: CALENDAR_MAX_SERVICES_PER_DAY,
    occupancyPercent,
    nextFreeDate,
  };
}

/** Disponibilidad de la entidad en una fecha concreta. */
export function getEntityDayAvailability(
  record: EntityCalendarRecord,
  date: string,
  todayIso: string = toIsoDateLocal(new Date()),
): EntityDayAvailability {
  const fullDayBlocked = record.blockedDates.includes(date);
  const bookedSlots = record.reservedSlots[date] ?? [];
  const isPast = date < todayIso;

  let status: CalendarDayStatus;
  if (isPast) status = 'PASADO';
  else if (fullDayBlocked) status = 'BLOQUEADO';
  else if (bookedSlots.length === 0) status = 'LIBRE';
  else if (bookedSlots.length >= CALENDAR_MAX_SERVICES_PER_DAY) status = 'BLOQUEADO';
  else status = 'PARCIAL';

  const availableSlots = fullDayBlocked
    ? []
    : CALENDAR_TIME_SLOTS.map((slot) => slot.startTime).filter((slot) => !bookedSlots.includes(slot));

  return {
    date,
    status,
    fullDayBlocked,
    bookedSlots,
    availableSlots,
    reservedByClient: record.confirmedDates.includes(date),
    reason: isPast
      ? 'Fecha pasada'
      : fullDayBlocked
        ? 'Día bloqueado por el proveedor'
        : bookedSlots.length >= CALENDAR_MAX_SERVICES_PER_DAY
          ? 'Tope diario de 6 servicios alcanzado'
          : null,
  };
}

/** Construye la matriz mensual completa (todas las celdas del mes). */
export function buildMonthAvailability(
  record: EntityCalendarRecord,
  year: number,
  monthIndex: number,
  todayIso: string = toIsoDateLocal(new Date()),
): readonly EntityDayAvailability[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days: EntityDayAvailability[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateIso = toIsoDateLocal(new Date(year, monthIndex, day));
    days.push(getEntityDayAvailability(record, dateIso, todayIso));
  }
  return days;
}


/** Serializa un registro a feed iCalendar (RFC 5545, CRLF obligatorio). */
export function buildEntityIcalFeed(
  record: EntityCalendarRecord,
  now: Date = new Date(),
): string {
  const stamp = `${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
  const meta = getCalendarEntityKindMeta(record.kind);
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EAR OS//Calendario Soberano por Entidad//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${sanitizeIcsText(`${record.displayName} · ${meta.label}`)}`,
    'X-WR-TIMEZONE:Europe/Madrid',
  ];

  const pushEvent = (dateIso: string, summary: string, description: string): void => {
    const compact = dateIso.replace(/-/g, '');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${record.kind}-${record.slug}-${compact}-${summary.length}@ear-os.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact}`,
      `DTEND;VALUE=DATE:${nextDayCompact(dateIso)}`,
      `SUMMARY:${sanitizeIcsText(summary)}`,
      `DESCRIPTION:${sanitizeIcsText(description)}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    );
  };

  for (const date of record.blockedDates) {
    pushEvent(date, 'Bloqueado por el proveedor', `${meta.label} · bloqueo manual de día completo`);
  }
  for (const date of record.confirmedDates) {
    const slots = record.reservedSlots[date] ?? [];
    pushEvent(
      date,
      'Reserva confirmada EAR OS',
      slots.length > 0 ? `Franjas reservadas: ${slots.join(', ')}` : 'Reserva confirmada sin franja declarada',
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

function nextDayCompact(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return toIsoDateLocal(date).replace(/-/g, '');
}

/** Sanea texto para iCalendar (anti-inyección de líneas y comas). */
export function sanitizeIcsText(raw: string): string {
  return raw
    .replace(/[\r\n]+/g, ' ')
    .replace(/[,;]/g, ' ')
    .replace(/[^\w\sÀ-ÿ.:·()\-+]/g, '')
    .trim()
    .slice(0, 180);
}
