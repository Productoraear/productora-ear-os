import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (typeof raw !== 'object' || raw === null) {
    return NextResponse.json(
      { success: false, error: 'Request body must be a JSON object.' },
      { status: 400 },
    );
  }

  const data = raw as Record<string, unknown>;
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const password = typeof data.password === 'string' ? data.password : '';
  const name = typeof data.name === 'string' ? data.name.trim() : '';

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'A valid email is required.' },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }

  const user: RegisterPayload = {
    email,
    password,
    ...(name ? { name } : {}),
  };

  const localPart = user.email.split('@')[0] ?? 'user';

  return NextResponse.json(
    {
      success: true,
      message: 'Registration accepted.',
      user: {
        id: randomUUID(),
        email: user.email,
        name: user.name ?? localPart,
      },
    },
    { status: 201 },
  );
}