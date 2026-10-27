import { cookies } from 'next/headers';

/**
 * Autorización server-side de mutación de un calendario de entidad.
 * Misma política que `POST /api/calendar/[kind]/[slug]`, centralizada para
 * que la UI (server component) pinte los controles correctos.
 */
export async function canMutateCalendarEntity(slug: string): Promise<boolean> {
  const adminToken = process.env.EAR_ADMIN_TOKEN?.trim();
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('ear_admin_token')?.value?.trim();
  if (adminToken && adminCookie && adminCookie === adminToken) return true;

  const sessionCookie = cookieStore.get('ear_vendor_session')?.value;
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie) as { vendorSlug?: unknown };
      if (typeof parsed.vendorSlug === 'string' && parsed.vendorSlug.trim().toLowerCase() === slug) {
        return true;
      }
    } catch {
      // Cookie corrupta: se ignora.
    }
  }

  return process.env.NODE_ENV !== 'production' && process.env.EAR_CALENDAR_ALLOW_ANON_WRITE !== '0';
}
