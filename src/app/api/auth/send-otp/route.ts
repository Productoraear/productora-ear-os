import { NextResponse, type NextRequest } from 'next/server';
import { randomInt } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type OtpRecord = {
  code: string;
  expiresAt: number;
  attempts: number;
};

const otpStore = new Map<string, OtpRecord>();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const email = value.trim().toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : null;
}

function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

function pruneExpired(now: number): void {
  for (const [key, record] of otpStore.entries()) {
    if (record.expiresAt <= now) {
      otpStore.delete(key);
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid JSON body.',
      },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Request body must be an object.',
      },
      { status: 400 },
    );
  }

  const email = normalizeEmail(body.email);

  if (!email) {
    return NextResponse.json(
      {
        ok: false,
        error: 'A valid email is required.',
      },
      { status: 400 },
    );
  }

  const now = Date.now();
  pruneExpired(now);

  const existing = otpStore.get(email);

  if (existing && existing.expiresAt > now && existing.attempts >= 5) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many attempts. Try again later.',
      },
      { status: 429 },
    );
  }

  const code = generateOtp();
  const expiresAt = now + 5 * 60 * 1000;

  otpStore.set(email, {
    code,
    expiresAt,
    attempts: 0,
  });

  return NextResponse.json({
    ok: true,
    message: 'OTP sent.',
    expiresInSeconds: 300,
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: 'Method not allowed.',
    },
    { status: 405 },
  );
}