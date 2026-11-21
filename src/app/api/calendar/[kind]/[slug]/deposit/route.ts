import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import type Stripe from 'stripe';
import { z } from 'zod';

import {
  checkDateAvailability,
  lockDateAtomically,
  unlockDateAtomically,
} from '@/lib/availability/atomicDateLockEngine';
import { getEntityDayAvailability, toIsoDateLocal } from '@/lib/calendar/entity-calendar-engine';
import {
  getEntityCalendar,
  isValidIsoDate,
  releaseEntitySlot,
  sanitizeEntitySlug,
} from '@/lib/calendar/entity-calendar-store';
import { findTimeSlot } from '@/lib/calendar/entity-calendar-types';
import { parseCalendarEntityKindParam, resolveCalendarEntity } from '@/lib/calendar/entity-registry';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { classifyDbFailure } from '@/lib/db/dbFailureClassifier';
import { getStripe } from '@/lib/payments';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEPOSIT_CENTS = Math.round(DEPOSITO_STRIPE_EUR * 100);
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' } as const;

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

const DepositPayloadSchema = z.object({
  eventDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD).'),
  timeSlot: z.string().trim().max(16).optional(),
  clientName: z
    .string()
    .trim()
    .min(2, 'Indica nombre y apellidos (mínimo 2 caracteres).')
    .max(120, 'Nombre demasiado largo.'),
  clientEmail: z
    .string()
    .trim()
    .email('Correo electrónico inválido.')
    .max(160, 'Correo electrónico demasiado largo.'),
  clientPhone: z.string().trim().max(32).optional(),
  intent: z.enum(['bloquear', 'ver']).optional(),
  idempotencyKey: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{8,128}$/, 'Clave de idempotencia inválida.'),
});

function sanitizeText(value: string, maxLength: number): string {
  let clean = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    clean += code < 32 || code === 127 ? ' ' : char;
  }
  return clean.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function resolveOrigin(req: NextRequest): string {
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured) && !configured.includes('0.0.0.0')) {
    return configured.replace(/\/+$/, '');
  }
  const reqOrigin = req.nextUrl.origin;
  if (reqOrigin && /^https?:\/\//i.test(reqOrigin) && !reqOrigin.includes('0.0.0.0')) {
    return reqOrigin.replace(/\/+$/, '');
  }
  return 'https://productoraear.com';
}

interface StripeErrorView {
  readonly type: string;
  readonly code: string;
}

function asStripeError(error: unknown): StripeErrorView | null {
  if (typeof error !== 'object' || error === null) return null;
  const record = error as Record<string, unknown>;
  const type = record.type;
  if (typeof type !== 'string' || !type.startsWith('Stripe')) return null;
  const code = record.code;
  return { type, code: typeof code === 'string' ? code : '' };
}

export async function POST(req: NextRequest, context: RouteContext) {
  const rawParams = await context.params;
  const kind = parseCalendarEntityKindParam(rawParams.kind);
  const slug = sanitizeEntitySlug(rawParams.slug);
  if (!kind || !slug) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_ENTITY', error: 'Entidad de calendario inválida (kind/slug).' },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'MALFORMED_JSON', error: 'Cuerpo JSON malformado.' },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const parsed = DepositPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_PAYLOAD',
        error: firstIssue?.message ?? 'Datos de reserva inválidos.',
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const { eventDate, idempotencyKey, intent } = parsed.data;
  const todayIso = toIsoDateLocal(new Date());
  if (!isValidIsoDate(eventDate) || eventDate < todayIso) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_DATE',
        error: 'La fecha debe ser un día válido y no estar en el pasado.',
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const rawTimeSlot = parsed.data.timeSlot?.trim() ?? '';
  let normalizedTimeSlot: string | undefined;
  if (rawTimeSlot.length > 0) {
    const canonicalSlot = findTimeSlot(rawTimeSlot);
    if (!canonicalSlot) {
      return NextResponse.json(
        {
          ok: false,
          code: 'INVALID_TIME_SLOT',
          error: 'Franja horaria no reconocida.',
        },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }
    normalizedTimeSlot = canonicalSlot.startTime;
  }

  const clientName = sanitizeText(parsed.data.clientName, 120);
  if (clientName.length < 2) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_PAYLOAD',
        error: 'Indica un nombre de contacto válido.',
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }
  const clientEmail = sanitizeText(parsed.data.clientEmail, 160).toLowerCase();
  const rawPhone = parsed.data.clientPhone ? sanitizeText(parsed.data.clientPhone, 32) : '';
  const clientPhone = rawPhone.length > 0 ? rawPhone : undefined;

  // Fail-closed HMAC & Stripe check BEFORE acquiring any lock
  const hmacSecret =
    process.env.PRICE_LOCK_HMAC_SECRET?.trim() || process.env.STRIPE_SECRET_KEY?.trim();
  if (!hmacSecret || hmacSecret.startsWith('sk_test_dummy')) {
    return NextResponse.json(
      {
        ok: false,
        error: 'SIGNING_KEY_MISSING',
        message: `Pasarela de firma no configurada. Contacta con la Centralita (${CENTRALITA_EAR_OS}).`,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'STRIPE_UNCONFIGURED',
        message: `Stripe Checkout no está configurado en el servidor. Contacta en ${CENTRALITA_EAR_OS}.`,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const entity = resolveCalendarEntity(kind, slug);
  const priceLockHash = crypto
    .createHmac('sha256', hmacSecret)
    .update(
      `CAL:${kind}:${entity.slug}:${eventDate}:${normalizedTimeSlot ?? ''}:${DEPOSIT_CENTS}:${idempotencyKey}`,
    )
    .digest('hex');

  try {
    const calendarRecord = await getEntityCalendar(kind, entity.slug, entity.displayName);
    const dayAvailability = getEntityDayAvailability(calendarRecord, eventDate, todayIso);

    if (dayAvailability.status === 'PASADO') {
      return NextResponse.json(
        { ok: false, code: 'INVALID_DATE', error: 'No se puede bloquear una fecha pasada.' },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }

    if (
      dayAvailability.status === 'BLOQUEADO' ||
      (normalizedTimeSlot && dayAvailability.bookedSlots.includes(normalizedTimeSlot))
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          error: 'La fecha o franja seleccionada ya está comprometida en esta agenda.',
        },
        { status: 409, headers: NO_STORE_HEADERS },
      );
    }

    const scopeKey = kind === 'artista' ? entity.slug : `${kind}:${entity.slug}`;
    const availability = await checkDateAvailability({
      eventDate,
      artistProfileId: scopeKey,
      entityKind: kind,
      entitySlug: entity.slug,
      timeSlot: normalizedTimeSlot,
    });

    if (!availability.available) {
      if (availability.reason === 'INVALID_DATE') {
        return NextResponse.json(
          { ok: false, code: 'INVALID_DATE', error: 'Fecha inválida en el motor de bloqueo.' },
          { status: 400, headers: NO_STORE_HEADERS },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          reason: availability.reason,
          error: 'La fecha solicitada acaba de ser comprometida. Elige otro día o franja.',
        },
        { status: 409, headers: NO_STORE_HEADERS },
      );
    }

    const lockTicket = `cal_${priceLockHash.slice(0, 24)}_${crypto.randomUUID().slice(0, 8)}`;
    const lockResult = await lockDateAtomically({
      eventDate,
      artistProfileId: scopeKey,
      entityKind: kind,
      entitySlug: entity.slug,
      timeSlot: normalizedTimeSlot,
      clientName,
      clientEmail,
      clientPhone,
      stripeSessionId: lockTicket,
      priceLockSha256: priceLockHash,
      depositAmountEur: DEPOSITO_STRIPE_EUR,
      status: 'PENDING_DEPOSIT',
      location: `Agenda ${entity.displayName}`,
    });

    if (!lockResult.success) {
      const isInvalid = lockResult.reason === 'INVALID_DATE';
      return NextResponse.json(
        {
          ok: false,
          code: isInvalid ? 'INVALID_DATE' : 'DATE_LOCK_CONTENTION',
          reason: lockResult.reason,
          error: isInvalid
            ? 'Fecha inválida en el motor de bloqueo.'
            : 'Otro cliente acaba de bloquear este tramo. Selecciona otra fecha o franja.',
        },
        { status: isInvalid ? 400 : 409, headers: NO_STORE_HEADERS },
      );
    }

    const compensateLock = async (): Promise<void> => {
      try {
        await unlockDateAtomically({
          lockId: lockResult.lockId,
          stripeSessionId: lockTicket,
        });
      } catch (unlockError: unknown) {
        console.error(
          '[CALENDAR DEPOSIT] No se pudo liberar el candado tras fallo de Stripe:',
          classifyDbFailure(unlockError),
        );
      }
      if (normalizedTimeSlot) {
        try {
          await releaseEntitySlot(kind, entity.slug, eventDate, normalizedTimeSlot);
        } catch (slotError: unknown) {
          console.error('[CALENDAR DEPOSIT] No se pudo liberar la franja tras fallo:', slotError);
        }
      }
    };

    const baseUrl = resolveOrigin(req);
    const calendarPath = `/calendario/${kind}/${encodeURIComponent(entity.slug)}`;

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          mode: 'payment',
          customer_email: clientEmail,
          success_url: `${baseUrl}${calendarPath}?deposit=confirmado&date=${encodeURIComponent(eventDate)}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}${calendarPath}?deposit=cancelado&date=${encodeURIComponent(eventDate)}`,
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: `Depósito Deducible EAR OS — ${entity.displayName}`,
                  description: `Bloqueo HMAC-SHA256 para el ${eventDate}${normalizedTimeSlot ? ` (${normalizedTimeSlot})` : ''}`,
                },
                unit_amount: DEPOSIT_CENTS,
              },
              quantity: 1,
            },
          ],
          metadata: {
            tipo: 'CALENDAR_ENTITY_DEPOSIT_100',
            entityKind: kind,
            entitySlug: entity.slug,
            entityName: entity.displayName,
            eventDate,
            timeSlot: normalizedTimeSlot ?? '',
            clientName,
            clientEmail,
            clientPhone: clientPhone ?? '',
            intent: intent ?? 'bloquear',
            priceLockHash,
            quoteHash: priceLockHash,
            lockTicket,
            idempotencyKey,
          },
        },
        { idempotencyKey: priceLockHash },
      );
    } catch (stripeError: unknown) {
      await compensateLock();
      throw stripeError;
    }

    if (!session.url) {
      await compensateLock();
      return NextResponse.json(
        {
          ok: false,
          code: 'STRIPE_NO_CHECKOUT_URL',
          error: `Stripe no devolvió enlace de pago. Contacta en ${CENTRALITA_EAR_OS}.`,
        },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    fireAndForgetN8n('stripe-price-lock', {
      event: 'calendar_deposit_session_created',
      entityKind: kind,
      entitySlug: entity.slug,
      entityName: entity.displayName,
      eventDate,
      timeSlot: normalizedTimeSlot ?? null,
      depositCents: DEPOSIT_CENTS,
      priceLockHash,
      sessionId: session.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        ok: true,
        url: session.url,
        sessionId: session.id,
        priceLockHash,
        depositCents: DEPOSIT_CENTS,
        entityKind: kind,
        entitySlug: entity.slug,
        eventDate,
        timeSlot: normalizedTimeSlot ?? null,
      },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error: unknown) {
    const report = classifyDbFailure(error);
    const stripeError = asStripeError(error);
    const stripeType = stripeError?.type ?? '';
    const stripeCode = stripeError?.code ?? '';

    console.error('[CALENDAR DEPOSIT ERROR]', {
      errorCode: report.code,
      dbKind: report.kind,
      stripeType: stripeType || null,
      stripeCode: stripeCode || null,
    });

    if (
      stripeType === 'StripeRateLimitError' ||
      stripeCode === 'rate_limit' ||
      stripeType === 'StripeConnectionError'
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          reason: 'STRIPE_RATE_LIMIT',
          error: `Saturación puntual de pasarela. Reintenta en unos segundos o llama al ${CENTRALITA_EAR_OS}.`,
        },
        { status: 429, headers: { ...NO_STORE_HEADERS, 'Retry-After': '30' } },
      );
    }

    if (report.code === 'P2002') {
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          error: 'Ya existe un bloqueo activo para esta selección.',
        },
        { status: 409, headers: NO_STORE_HEADERS },
      );
    }

    if (
      report.kind === 'DB_POOL_TIMEOUT' ||
      report.kind === 'DB_CONNECTION_CLOSED' ||
      report.kind === 'DB_UNREACHABLE' ||
      report.code === 'P2034' ||
      report.code === 'P2024' ||
      report.code === '40001' ||
      report.code === '40P01'
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          reason: report.kind,
          error: `Contención de bloqueo en este instante. Reintenta en unos segundos o llama al ${CENTRALITA_EAR_OS}.`,
        },
        { status: 409, headers: { ...NO_STORE_HEADERS, 'Retry-After': '10' } },
      );
    }

    if (stripeType !== '') {
      return NextResponse.json(
        {
          ok: false,
          code: 'STRIPE_SESSION_REJECTED',
          reason: stripeType,
          error: `Stripe rechazó la sesión de pago. Contacta en ${CENTRALITA_EAR_OS}.`,
        },
        { status: 422, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: 'DEPOSIT_UNAVAILABLE',
        error: `Servicio de depósito temporalmente no disponible. Contacta en ${CENTRALITA_EAR_OS}.`,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}
