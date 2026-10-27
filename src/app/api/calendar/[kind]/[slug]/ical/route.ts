import { NextRequest, NextResponse } from 'next/server';

import { buildEntityIcalFeed } from '@/lib/calendar/entity-calendar-engine';
import { getEntityCalendar, sanitizeEntitySlug } from '@/lib/calendar/entity-calendar-store';
import {
  parseCalendarEntityKindParam,
  resolveCalendarEntity,
} from '@/lib/calendar/entity-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

/**
 * GET /api/calendar/[kind]/[slug]/ical
 *
 * Feed iCalendar REAL (RFC 5545) del calendario de una entidad concreta.
 * Sustituye el enlace roto `/api/vendor/[slug]/ical` que devolvía 404 y que
 * toda la UI del proveedor publicaba como "sincronización Google/Apple".
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const kind = parseCalendarEntityKindParam(params.kind);
  const slug = sanitizeEntitySlug(params.slug);

  if (!kind || !slug) {
    return NextResponse.json({ error: 'Entidad de calendario inválida.' }, { status: 400 });
  }

  try {
    const entity = resolveCalendarEntity(kind, slug);
    const record = await getEntityCalendar(entity.kind, entity.slug, entity.displayName);
    const feed = buildEntityIcalFeed(record);

    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="${entity.kind}-${entity.slug}.ics"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    console.error('[CALENDAR_ICAL_ERROR]', error);
    return NextResponse.json({ error: 'Error generando el feed iCal.' }, { status: 500 });
  }
}
