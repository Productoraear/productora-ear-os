import { NextResponse } from 'next/server';

type CheckoutItem = {
  id: string;
  quantity: number;
  price: number;
};

type CheckoutPayload = {
  email: string;
  items: CheckoutItem[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCheckoutItem(value: unknown): value is CheckoutItem {
  if (!isRecord(value)) {
    return false;
  }

  const { id, quantity, price } = value;

  return (
    typeof id === 'string' &&
    id.trim().length > 0 &&
    typeof quantity === 'number' &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    typeof price === 'number' &&
    Number.isFinite(price) &&
    price >= 0
  );
}

function isCheckoutPayload(value: unknown): value is CheckoutPayload {
  if (!isRecord(value)) {
    return false;
  }

  const { email, items } = value;

  return (
    typeof email === 'string' &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(isCheckoutItem)
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'JSON inválido',
      },
      { status: 400 }
    );
  }

  if (!isCheckoutPayload(payload)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Payload de checkout inválido',
      },
      { status: 400 }
    );
  }

  const total = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return NextResponse.json(
    {
      ok: true,
      orderId: `EAR-${Date.now()}`,
      email: payload.email.trim(),
      total,
      items: payload.items,
    },
    { status: 201 }
  );
}