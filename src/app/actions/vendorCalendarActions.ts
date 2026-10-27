'use server';

/**
 * 📅 VENDOR CALENDAR ACTIONS — EAR OS S-CLASS
 *
 * ANTES (fachada + fuga de agenda cruzada):
 *   · Guardaba todo en un `Map` en memoria → los bloqueos desaparecían en cada
 *     cold start del servidor.
 *   · Sembraba a TODOS los proveedores con las fechas de Edwin Agudelo
 *     (`2026-10-12`, `2026-10-25`, `2026-11-15`).
 *   · Publicaba `/api/vendor/[slug]/ical`, endpoint que NO EXISTE (404).
 *
 * AHORA:
 *   · Cada proveedor escribe en su propio calendario aislado (`kind:slug`).
 *   · Persistencia durable y escritura atómica (entity-calendar-store).
 *   · El feed .ics apunta al endpoint real `/api/calendar/[kind]/[slug]/ical`.
 */

import { buildEntityIcalHref } from '@/lib/calendar/entity-calendar-engine';
import {
  getEntityCalendar,
  sanitizeEntitySlug,
  setEntityBlockedDates,
  setEntityDateBlock,
  setEntityExternalIcal,
} from '@/lib/calendar/entity-calendar-store';
import {
  inferCalendarEntityKind,
  resolveCalendarEntity,
} from '@/lib/calendar/entity-registry';

function resolveVendor(slug: string) {
  const clean = sanitizeEntitySlug(slug);
  if (!clean) return null;
  const kind = inferCalendarEntityKind(clean);
  const entity = resolveCalendarEntity(kind, clean);
  return { kind, entity };
}

/**
 * Devuelve fechas bloqueadas y estado del calendario del proveedor.
 * NUNCA inyecta fechas de terceros.
 */
export async function getVendorCalendarAction(vendorSlug: string) {
  const resolved = resolveVendor(vendorSlug);
  if (!resolved) {
    return { blockedDates: [] as string[], externalIcalUrl: null, displayName: vendorSlug };
  }

  const record = await getEntityCalendar(
    resolved.kind,
    resolved.entity.slug,
    resolved.entity.displayName,
  );

  return {
    blockedDates: record.blockedDates,
    externalIcalUrl: record.externalIcalUrl,
    displayName: record.displayName,
  };
}

/**
 * Fija el estado de bloqueo de una fecha concreta del proveedor (idempotente).
 * Sin `toggle` ciego: dos llamadas con el mismo estado no se contradicen.
 */
export async function toggleDateBlockAction(vendorSlug: string, dateStr: string) {
  const resolved = resolveVendor(vendorSlug);
  if (!resolved) {
    return { success: false, blockedDates: [] as string[], error: 'Slug de proveedor inválido.' };
  }

  const current = await getEntityCalendar(
    resolved.kind,
    resolved.entity.slug,
    resolved.entity.displayName,
  );
  const shouldBlock = !current.blockedDates.includes(dateStr);

  const record = await setEntityDateBlock(
    resolved.kind,
    resolved.entity.slug,
    dateStr,
    shouldBlock,
    resolved.entity.displayName,
  );

  if (!record) {
    return { success: false, blockedDates: current.blockedDates, error: 'Fecha inválida.' };
  }

  return { success: true, blockedDates: record.blockedDates, blocked: shouldBlock };
}

/** Reemplaza la lista completa de bloqueos (import de .ics / conciliación). */
export async function replaceVendorBlockedDatesAction(vendorSlug: string, dates: string[]) {
  const resolved = resolveVendor(vendorSlug);
  if (!resolved) {
    return { success: false, blockedDates: [] as string[], error: 'Slug de proveedor inválido.' };
  }

  const record = await setEntityBlockedDates(
    resolved.kind,
    resolved.entity.slug,
    dates,
    resolved.entity.displayName,
  );
  return { success: true, blockedDates: record.blockedDates };
}

/**
 * Devuelve la URL canónica del feed .ics REAL de esta entidad
 * (y el atajo para suscribirse desde Google Calendar).
 */
export async function exportIcalUrlAction(vendorSlug: string) {
  const resolved = resolveVendor(vendorSlug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://productoraear.com';

  if (!resolved) {
    return {
      icalUrl: '',
      googleCalendarUrl: '',
      calendarPageUrl: '',
      error: 'Slug de proveedor inválido.',
    };
  }

  const icalPath = buildEntityIcalHref(resolved.kind, resolved.entity.slug);
  const icalUrl = `${baseUrl}${icalPath}`;

  return {
    icalUrl,
    googleCalendarUrl: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(icalUrl)}`,
    calendarPageUrl: `/calendario/${resolved.kind}/${resolved.entity.slug}`,
  };
}

/** Guarda la URL externa de Google/Apple Calendar para sincronización. */
export async function syncExternalIcalAction(vendorSlug: string, icalUrl: string) {
  const resolved = resolveVendor(vendorSlug);
  if (!resolved) {
    return { success: false, externalIcalUrl: null, error: 'Slug de proveedor inválido.' };
  }

  const record = await setEntityExternalIcal(
    resolved.kind,
    resolved.entity.slug,
    icalUrl,
    resolved.entity.displayName,
  );

  return { success: true, externalIcalUrl: record.externalIcalUrl };
}
