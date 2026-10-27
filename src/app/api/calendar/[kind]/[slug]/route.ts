import { NextRequest, NextResponse } from 'next/server';

import {
  buildEntityIcalHref,
  buildMonthAvailability,
  getMonthNameEs,
  summarizeEntityCalendar,
  toIsoDateLocal,
} from '@/lib/calendar/entity-calendar-engine';
import {
  getEntityCalendar,
  releaseEntitySlot,
  reserveEntitySlot,
  sanitizeEntitySlug,
  setEntityBlockedDates,
  setEntityDateBlock,
  setEntityExternalIcal,
} from '@/lib/calendar/entity-calendar-store';
import {
  parseCalendarEntityKindParam,
  resolveCalendarEntity,
} from '@/lib/calendar/entity-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLOT = /^\d{2}:\d{2}$/;

interface CalendarRouteTarget {
  readonly kind: ReturnType<typeof parseCalendarEntityKindParam>;
  readonly slug: string;
}

async function resolveTarget(context: RouteContext): Promise<CalendarRouteTarget | null> {
  const params = await context.params;
  const kind = parseCalendarEntityKindParam(params.kind);
  const slug = sanitizeEntitySlug(params.slug);
  if (!kind || !slug) return null;
  return { kind, slug };
}

/**
 * Autorización de escritura: solo el titular de la agenda o soporte admin.
 * El calendario público es de solo lectura; bloquear fechas ajenas es sabotaje.
 */
function canMutateEntity(req: NextRequest, slug: string): boolean {
  const adminToken = process.env.EAR_ADMIN_TOKEN?.trim();
  const provided = req.headers.get('x-ear-admin-token')?.trim();
  if (adminToken && provided && adminToken === provided) return true;

  const sessionCookie = req.cookies.get('ear_vendor_session')?.value;
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie) as { vendorSlug?: unknown };
      if (typeof parsed.vendorSlug === 'string' && parsed.vendorSlug.trim().toLowerCase() === slug) {
        return true;
      }
    } catch {
      // Cookie corrupta: se ignora y se evalúa el resto de reglas.
    }
  }

  // Entorno no productivo: se permite para pruebas locales/automatizadas.
  return process.env.NODE_ENV !== 'production' && process.env.EAR_CALENDAR_ALLOW_ANON_WRITE !== '0';
}

export async function GET(req: NextRequest, context: RouteContext) {
  const target = await resolveTarget(context);
  if (!target || !target.kind) {
    return NextResponse.json(
      { ok: false, error: 'Entidad de calendario inválida (kind/slug).' },
      { status: 400 },
    );
  }

  try {
    const entity = resolveCalendarEntity(target.kind, target.slug);
    const record = await getEntityCalendar(entity.kind, entity.slug, entity.displayName);

    const today = new Date();
    const todayIso = toIsoDateLocal(today);
    let year = today.getFullYear();
    let monthIndex = today.getMonth();

    const monthParam = new URL(req.url).searchParams.get('month');
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [rawYear, rawMonth] = monthParam.split('-');
      const parsedYear = Number(rawYear);
      const parsedMonth = Number(rawMonth) - 1;
      if (Number.isFinite(parsedYear) && parsedMonth >= 0 && parsedMonth <= 11) {
        year = parsedYear;
        monthIndex = parsedMonth;
      }
    }

    return NextResponse.json(
      {
        ok: true,
        entity: {
          kind: entity.kind,
          slug: entity.slug,
          displayName: entity.displayName,
          source: entity.source,
          category: entity.category,
        },
        summary: summarizeEntityCalendar(record, todayIso),
        month: {
          year,
          monthIndex,
          monthName: getMonthNameEs(monthIndex),
          days: buildMonthAvailability(record, year, monthIndex, todayIso),
        },
        blockedDates: record.blockedDates,
        confirmedDates: record.confirmedDates,
        reservedSlots: record.reservedSlots,
        icalUrl: buildEntityIcalHref(entity.kind, entity.slug),
        externalIcalUrl: record.externalIcalUrl,
        updatedAt: record.updatedAt,
        today: todayIso,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error: unknown) {
    console.error('[CALENDAR_GET_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Error interno del calendario.' }, { status: 500 });
  }
}

interface ParsedMutation {
  readonly action: 'block' | 'unblock' | 'replace' | 'reserve' | 'release' | 'ical';
  readonly date: string | null;
  readonly dates: readonly string[];
  readonly timeSlot: string | null;
  readonly icalUrl: string | null;
}

/** Validación estricta del cuerpo de mutación (OWASP ASVS L3). */
function parseMutation(raw: unknown): ParsedMutation | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  const action = typeof body.action === 'string' ? body.action : '';
  const date = typeof body.date === 'string' && ISO_DATE.test(body.date) ? body.date : null;
  const timeSlot =
    typeof body.timeSlot === 'string' && SLOT.test(body.timeSlot) ? body.timeSlot : null;
  const dates = Array.isArray(body.dates)
    ? body.dates.filter((value): value is string => typeof value === 'string' && ISO_DATE.test(value)).slice(0, 400)
    : [];
  const icalUrl = typeof body.icalUrl === 'string' ? body.icalUrl.slice(0, 500) : null;

  switch (action) {
    case 'block':
    case 'unblock':
      return date ? { action, date, dates: [], timeSlot: null, icalUrl: null } : null;
    case 'replace':
      return { action, date: null, dates, timeSlot: null, icalUrl: null };
    case 'reserve':
    case 'release':
      return date && timeSlot ? { action, date, dates: [], timeSlot, icalUrl: null } : null;
    case 'ical':
      return { action, date: null, dates: [], timeSlot: null, icalUrl };
    default:
      return null;
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const target = await resolveTarget(context);
  if (!target || !target.kind) {
    return NextResponse.json(
      { ok: false, error: 'Entidad de calendario inválida (kind/slug).' },
      { status: 400 },
    );
  }

  const { kind, slug } = target;

  if (!canMutateEntity(req, slug)) {
    return NextResponse.json(
      { ok: false, error: 'No autorizado para modificar el calendario de otra entidad.' },
      { status: 403 },
    );
  }

  try {
    const rawBody: unknown = await req.json().catch(() => null);
    const payload = parseMutation(rawBody);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Cuerpo de mutación inválido o fecha fuera de formato.' },
        { status: 400 },
      );
    }

    const entity = resolveCalendarEntity(kind, slug);

    if (payload.action === 'block' || payload.action === 'unblock') {
      const record = await setEntityDateBlock(
        kind,
        entity.slug,
        payload.date ?? '',
        payload.action === 'block',
        entity.displayName,
      );
      if (!record) {
        return NextResponse.json({ ok: false, error: 'Fecha inválida.' }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        action: payload.action,
        date: payload.date,
        blockedDates: record.blockedDates,
        updatedAt: record.updatedAt,
      });
    }

    if (payload.action === 'replace') {
      const record = await setEntityBlockedDates(kind, entity.slug, payload.dates, entity.displayName);
      return NextResponse.json({
        ok: true,
        action: 'replace',
        blockedDates: record.blockedDates,
        updatedAt: record.updatedAt,
      });
    }

    if (payload.action === 'reserve' || payload.action === 'release') {
      const outcome =
        payload.action === 'reserve'
          ? await reserveEntitySlot(
              kind,
              entity.slug,
              payload.date ?? '',
              payload.timeSlot ?? '',
              entity.displayName,
            )
          : await releaseEntitySlot(kind, entity.slug, payload.date ?? '', payload.timeSlot ?? '');
      return NextResponse.json(
        { ok: outcome.success, ...outcome },
        { status: outcome.success ? 201 : 409 },
      );
    }

    const record = await setEntityExternalIcal(kind, entity.slug, payload.icalUrl, entity.displayName);
    return NextResponse.json({
      ok: true,
      action: 'ical',
      externalIcalUrl: record.externalIcalUrl,
      updatedAt: record.updatedAt,
    });
  } catch (error: unknown) {
    console.error('[CALENDAR_POST_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Error interno del calendario.' }, { status: 500 });
  }
}

