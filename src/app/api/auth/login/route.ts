import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { ok: false, error: 'Request body must be a JSON object' },
      { status: 400 },
    );
  }

  const email = isNonEmptyString(body.email) ? body.email.trim() : '';
  const password = isNonEmptyString(body.password) ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: 'Email and password are required' },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { ok: true, message: 'Login endpoint is available' },
    { status: 200 },
  );
}