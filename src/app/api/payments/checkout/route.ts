import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CheckoutRequest = {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  metadata?: Record<string, string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseCheckoutRequest(payload: unknown): CheckoutRequest | null {
  if (!isRecord(payload)) {
    return null;
  }

  const orderId = payload.orderId;
  const amount = payload.amount;
  const currency = payload.currency;
  const customerEmail = payload.customerEmail;
  const metadata = payload.metadata;

  if (typeof orderId !== 'string' || orderId.trim().length === 0) {
    return null;
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  if (typeof currency !== 'string' || currency.trim().length !== 3) {
    return null;
  }

  if (!isValidEmail(customerEmail)) {
    return null;
  }

  const normalizedMetadata: Record<string, string> = {};

  if (metadata !== undefined) {
    if (!isRecord(metadata)) {
      return null;
    }

    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value !== 'string') {
        return null;
      }

      normalizedMetadata[key] = value;
    }
  }

  return {
    orderId: orderId.trim(),
    amount: Math.round(amount * 100) / 100,
    currency: currency.trim().toUpperCase(),
    customerEmail: customerEmail.trim().toLowerCase(),
    metadata: normalizedMetadata,
  };
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'INVALID_JSON',
      },
      { status: 400 },
    );
  }

  const checkout = parseCheckoutRequest(payload);

  if (!checkout) {
    return NextResponse.json(
      {
        ok: false,
        error: 'INVALID_CHECKOUT_REQUEST',
      },
      { status: 422 },
    );
  }

  const session = {
    id: `checkout_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
    status: 'pending' as const,
    orderId: checkout.orderId,
    amount: checkout.amount,
    currency: checkout.currency,
    customerEmail: checkout.customerEmail,
    createdAt: new Date().toISOString(),
    metadata: checkout.metadata,
  };

  return NextResponse.json(
    {
      ok: true,
      session,
    },
    { status: 201 },
  );
}