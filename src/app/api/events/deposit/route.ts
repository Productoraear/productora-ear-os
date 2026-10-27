import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

import { EVENT_DEPOSIT_UNIT_CENTS } from '@/lib/events/event-cart-engine';
import { buildEntityIcalHref, buildEntityCalendarHref } from '@/lib/calendar/entity-calendar-engine';
import {
  reserveEntitySlot,
  sanitizeEntitySlug,
} from '@/lib/calendar/entity-calendar-store';
import {
  parseCalendarEntityKindParam,
  resolveCalendarEntity,
} from '@/lib/calendar/entity-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLOT = /^\d{2}:\d{2}$/;
const MAX_ITEMS = 200;

interface DepositItemInput {
  slug?: unknown;
  kind?: unknown;
  name?: unknown;
  serviceIds?: unknown;
}

interface SanitizedItem {
  readonly slug: string;
  readonly kind: 'artista' | 'musica' | 'finca' | 'catering' | 'tecnica' | 'fotografia' | 'moda' | 'decoracion' | 'transporte' | 'wedding' | 'servicios' | 'senior_care';
  readonly name: string;
  readonly serviceIds: readonly string[];
}

interface DepositReceipt {
  readonly slug: string;
  readonly kind: string;
  readonly name: string;
  readonly amountCents: number;
  readonly status: 'PAID_SIMULATED' | 'CHECKOUT_CREATED' | 'ALREADY_ACTIVE' | 'REJECTED';
  readonly reason: string | null;
  readonly priceLockHash: string;
  readonly sessionId: string | null;
  readonly checkoutUrl: string | null;
  readonly calendarHref: string;
  readonly icalHref: string;
}

function sanitizeText(raw: unknown, fallback: string, maxLength: number): string {
  if (typeof raw !== 'string') return fallback;
  let clean = '';
  for (const char of raw) {
    const code = char.codePointAt(0) ?? 0;
    clean += code < 32 || code === 127 ? ' ' : char;
  }
  const trimmed = clean.replace(/\s+/g, ' ').trim().slice(0, maxLength);
  return trimmed.length > 0 ? trimmed : fallback;
}

function parseIsoDate(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const candidate = raw.trim().slice(0, 10);
  if (!ISO_DATE.test(candidate)) return null;
  const parsed = new Date(`${candidate}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10) === candidate ? candidate : null;
}

function parseSlot(raw: unknown): string {
  if (typeof raw === 'string' && SLOT.test(raw.trim())) return raw.trim().slice(0, 5);
  return '14:00';
}

function normalizeItems(raw: unknown): readonly SanitizedItem[] {
  if (!Array.isArray(raw)) return [];
  const items: SanitizedItem[] = [];
  const seen = new Set<string>();

  for (const entry of raw.slice(0, MAX_ITEMS)) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as DepositItemInput;
    const slug = sanitizeEntitySlug(typeof item.slug === 'string' ? item.slug : null);
    if (!slug || seen.has(slug)) continue;
    const kind = parseCalendarEntityKindParam(typeof item.kind === 'string' ? item.kind : null) ?? 'servicios';
    const serviceIds = Array.isArray(item.serviceIds)
      ? item.serviceIds
          .filter((value): value is string => typeof value === 'string')
          .slice(0, 40)
          .map((value) => value.replace(/[^a-z0-9-]/gi, '').slice(0, 60))
      : [];
    seen.add(slug);
    items.push({
      slug,
      kind,
      name: sanitizeText(item.name, slug, 120),
      serviceIds,
    });
  }
  return items;
}

/** SHA-256 del contrato de reserva (trazabilidad e idempotencia). */
function buildPriceLockHash(input: {
  slug: string;
  kind: string;
  eventDate: string;
  timeSlot: string;
  amountCents: number;
  nonce: string;
}): string {
  return crypto
    .createHash('sha256')
    .update(
      `${input.kind}:${input.slug}:${input.eventDate}:${input.timeSlot}:${input.amountCents}:${input.nonce}`,
    )
    .digest('hex');
}

interface DepositBody {
  mode?: unknown;
  eventDate?: unknown;
  timeSlot?: unknown;
  clientEmail?: unknown;
  idempotencyKey?: unknown;
  items?: unknown;
}

/**
 * POST /api/events/deposit
 *
 * Cobra la GARANTÍA DE RESERVA (1,00 €) por cada proveedor del carrito y
 * materializa el bloqueo de franja en el calendario PROPIO de ese proveedor.
 *
 * Modos:
 *   · `simulate` (por defecto sin clave Stripe): marca el cobro como simulado,
 *     genera hash SHA-256 del contrato y bloquea la franja real en la agenda
 *     del proveedor. Sirve para validar el flujo completo sin mover dinero.
 *   · `stripe`: crea una sesión de Checkout real de 1,00 € por proveedor.
 *     El bloqueo definitivo se confirma al recibir el pago (webhook).
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody: unknown = await req.json().catch(() => ({}));
    const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as DepositBody;

    const eventDate = parseIsoDate(body.eventDate);
    if (!eventDate) {
      return NextResponse.json(
        { ok: false, error: 'Fecha del evento inválida (YYYY-MM-DD).' },
        { status: 400 },
      );
    }

    const timeSlot = parseSlot(body.timeSlot);
    const items = normalizeItems(body.items);
    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'El carrito no contiene proveedores válidos.' },
        { status: 400 },
      );
    }

    const requestedMode = body.mode === 'stripe' ? 'stripe' : 'simulate';
    const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
    if (requestedMode === 'stripe' && !stripeConfigured) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Stripe no configurado en el servidor: usa mode="simulate" o configura STRIPE_SECRET_KEY.',
        },
        { status: 503 },
      );
    }

    const idempotencyKey = sanitizeText(body.idempotencyKey, 'no-key', 80);
    const clientEmail = sanitizeText(body.clientEmail, 'cliente@ear-os.com', 160);
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

    const receipts: DepositReceipt[] = [];
    let stripeClient: import('stripe').default | null = null;

    if (requestedMode === 'stripe') {
      const { getStripe } = await import('@/lib/payments');
      stripeClient = getStripe();
    }

    let paidOrReserved = 0;
    let failed = 0;


    for (const item of items) {
      const entity = resolveCalendarEntity(item.kind, item.slug);
      const kind = entity.kind;
      const slug = entity.slug;
      const priceLockHash = buildPriceLockHash({
        slug,
        kind,
        eventDate,
        timeSlot,
        amountCents: EVENT_DEPOSIT_UNIT_CENTS,
        nonce: idempotencyKey,
      });

      const baseReceipt = {
        slug,
        kind,
        name: entity.displayName || item.name,
        amountCents: EVENT_DEPOSIT_UNIT_CENTS,
        priceLockHash,
        calendarHref: buildEntityCalendarHref(kind, slug, {
          date: eventDate,
          timeSlot,
          intent: 'bloquear',
        }),
        icalHref: buildEntityIcalHref(kind, slug),
      } satisfies Omit<DepositReceipt, 'status' | 'reason' | 'sessionId' | 'checkoutUrl'>;

      const reservation = await reserveEntitySlot(kind, slug, eventDate, timeSlot, entity.displayName);

      if (!reservation.success) {
        const tolerated = reservation.reason === 'ALREADY_RESERVED';
        if (tolerated) paidOrReserved += 1;
        else failed += 1;
        receipts.push({
          ...baseReceipt,
          status: tolerated ? 'ALREADY_ACTIVE' : 'REJECTED',
          reason: reservation.reason,
          sessionId: null,
          checkoutUrl: null,
        });
        continue;
      }

      if (requestedMode === 'simulate' || !stripeClient) {
        paidOrReserved += 1;
        receipts.push({
          ...baseReceipt,
          status: 'PAID_SIMULATED',
          reason: 'Cobro de 1,00 € simulado · franja bloqueada en la agenda del proveedor',
          sessionId: `sim_${priceLockHash.slice(0, 20)}`,
          checkoutUrl: null,
        });
        continue;
      }

      try {
        const session = await stripeClient.checkout.sessions.create(
          {
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: clientEmail,
            success_url: `${origin}/evento/confirmado?session_id={CHECKOUT_SESSION_ID}&slug=${encodeURIComponent(slug)}&kind=${encodeURIComponent(kind)}`,
            cancel_url: `${origin}/evento?cancelado=1`,
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: 'eur',
                  unit_amount: EVENT_DEPOSIT_UNIT_CENTS,
                  product_data: {
                    name: `Garantía de reserva 1,00 € · ${entity.displayName}`,
                    description: `Bloqueo de franja ${timeSlot} del ${eventDate} · ${item.serviceIds.length} servicio(s)`,
                  },
                },
              },
            ],
            metadata: {
              tipo: 'EVENT_CART_GUARANTEE',
              entityKind: kind,
              entitySlug: slug,
              eventDate,
              timeSlot,
              priceLockHash,
              idempotencyKey,
              serviceIds: item.serviceIds.join(',').slice(0, 480),
            },
          },
          { idempotencyKey: `${idempotencyKey}-${slug}-${eventDate}-${timeSlot}` },
        );

        paidOrReserved += 1;
        receipts.push({
          ...baseReceipt,
          status: 'CHECKOUT_CREATED',
          reason: 'Sesión Stripe de 1,00 € creada (el bloqueo se confirma al pagar)',
          sessionId: session.id,
          checkoutUrl: session.url,
        });
      } catch (error: unknown) {
        failed += 1;
        console.error('[EVENT_DEPOSIT_STRIPE_ERROR]', slug, error);
        receipts.push({
          ...baseReceipt,
          status: 'REJECTED',
          reason: 'Stripe rechazó la creación de la sesión de garantía',
          sessionId: null,
          checkoutUrl: null,
        });
      }
    }

    return NextResponse.json(
      {
        ok: failed === 0,
        mode: requestedMode,
        currency: 'eur',
        unitCents: EVENT_DEPOSIT_UNIT_CENTS,
        eventDate,
        timeSlot,
        requested: items.length,
        charged: paidOrReserved,
        failed,
        totalCents: paidOrReserved * EVENT_DEPOSIT_UNIT_CENTS,
        idempotencyKey,
        receipts,
      },
      { status: failed === 0 ? 201 : 207, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error: unknown) {
    console.error('[EVENT_DEPOSIT_ERROR]', error);
    return NextResponse.json(
      { ok: false, error: 'Error interno procesando la garantía de reserva.' },
      { status: 500 },
    );
  }
}
