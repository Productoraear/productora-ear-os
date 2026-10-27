import { NextRequest, NextResponse } from 'next/server';

import { buildEventCart, toEventCartJson } from '@/lib/events/event-cart-engine';
import { EVENT_SERVICE_TOTAL } from '@/lib/events/event-service-catalog';
import type { EventBrief } from '@/lib/events/event-provider-matcher';
import { loadFullProviderCatalog } from '@/lib/providers/edge-partition-loader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLOT = /^\d{2}:\d{2}$/;

interface BlueprintBody {
  province?: unknown;
  guests?: unknown;
  budgetEur?: unknown;
  eventDate?: unknown;
  timeSlot?: unknown;
}

function sanitizeProvince(raw: unknown): string {
  if (typeof raw !== 'string') return 'madrid';
  const clean = raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '');
  return clean.length > 0 ? clean.slice(0, 40) : 'madrid';
}

function sanitizeNumber(raw: unknown, fallback: number, min: number, max: number): number {
  const value = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function sanitizeDate(raw: unknown): string {
  if (typeof raw === 'string' && ISO_DATE.test(raw)) {
    const parsed = new Date(`${raw}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === raw) return raw;
  }
  const inNinetyDays = new Date();
  inNinetyDays.setDate(inNinetyDays.getDate() + 90);
  return inNinetyDays.toISOString().slice(0, 10);
}

function sanitizeSlot(raw: unknown): string {
  if (typeof raw === 'string' && SLOT.test(raw)) return raw.slice(0, 5);
  return '14:00';
}

/**
 * POST /api/events/blueprint
 * Briefing → carrito multi-proveedor con match ≥75 % sobre el Data Lake real.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody: unknown = await req.json().catch(() => ({}));
    const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as BlueprintBody;

    const brief: EventBrief = {
      province: sanitizeProvince(body.province),
      guests: sanitizeNumber(body.guests, 120, 2, 5000),
      budgetEur: sanitizeNumber(body.budgetEur, 25000, 500, 5_000_000),
      eventDate: sanitizeDate(body.eventDate),
      timeSlot: sanitizeSlot(body.timeSlot),
    };

    const catalog = loadFullProviderCatalog();
    if (catalog.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Data Lake no disponible: no hay proveedores publicados que evaluar.',
        },
        { status: 503 },
      );
    }

    const startedAt = Date.now();
    const cart = buildEventCart(brief, catalog);
    const elapsedMs = Date.now() - startedAt;

    return NextResponse.json(
      {
        ok: true,
        catalogServices: EVENT_SERVICE_TOTAL,
        providersEvaluated: catalog.length,
        executionTimeMs: elapsedMs,
        cart: toEventCartJson(cart),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error: unknown) {
    console.error('[EVENT_BLUEPRINT_ERROR]', error);
    return NextResponse.json(
      { ok: false, error: 'Error interno generando el plano del evento.' },
      { status: 500 },
    );
  }
}

/** GET de cortesía: mismo cálculo con query params. */
export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const fakeBody: BlueprintBody = {
    province: params.get('province') ?? 'madrid',
    guests: params.get('guests') ?? 120,
    budgetEur: params.get('budgetEur') ?? 25000,
    eventDate: params.get('eventDate') ?? undefined,
    timeSlot: params.get('timeSlot') ?? '14:00',
  };

  const forwarded = new Request(req.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fakeBody),
  });

  return POST(new NextRequest(forwarded));
}
