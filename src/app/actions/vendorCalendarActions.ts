'use server';

/**
 * 📅 VENDOR CALENDAR ACTIONS — EAR OS S-CLASS
 * Persistencia ligera en memoria (sin modelos Prisma adicionales).
 * Cada fecha bloqueada se almacena como string YYYY-MM-DD.
 */

// Store en memoria por slug (migrar a Prisma cuando exista modelo VendorBlockedDate)
const calendarStore = new Map<string, {
  blockedDates: string[];
  externalIcalUrl: string | null;
}>();

function getOrCreateStore(vendorSlug: string) {
  if (!calendarStore.has(vendorSlug)) {
    calendarStore.set(vendorSlug, {
      blockedDates: ['2026-10-12', '2026-10-25', '2026-11-15'], // Fechas pre-reservadas de Edwin
      externalIcalUrl: null
    });
  }
  return calendarStore.get(vendorSlug)!;
}

/**
 * Devuelve fechas bloqueadas y estado del calendario del proveedor
 */
export async function getVendorCalendarAction(vendorSlug: string) {
  const store = getOrCreateStore(vendorSlug);
  return {
    blockedDates: store.blockedDates,
    externalIcalUrl: store.externalIcalUrl
  };
}

/**
 * Alterna el bloqueo manual de una fecha específica
 */
export async function toggleDateBlockAction(vendorSlug: string, dateStr: string) {
  const store = getOrCreateStore(vendorSlug);
  const index = store.blockedDates.indexOf(dateStr);

  if (index >= 0) {
    store.blockedDates.splice(index, 1);
  } else {
    store.blockedDates.push(dateStr);
  }

  return { success: true, blockedDates: store.blockedDates };
}

/**
 * Devuelve la URL canónica del feed .ics para Google/Apple Calendar
 */
export async function exportIcalUrlAction(vendorSlug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://productoraear.com';
  return {
    icalUrl: `${baseUrl}/api/vendor/${vendorSlug}/ical`,
    googleCalendarUrl: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(`${baseUrl}/api/vendor/${vendorSlug}/ical`)}`
  };
}

/**
 * Guarda la URL externa de Google/Apple Calendar para sincronización
 */
export async function syncExternalIcalAction(vendorSlug: string, icalUrl: string) {
  const store = getOrCreateStore(vendorSlug);
  store.externalIcalUrl = icalUrl;
  return { success: true, externalIcalUrl: icalUrl };
}