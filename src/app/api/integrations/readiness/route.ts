import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getCapabilitiesRegistrySnapshot } from '@/lib/integrations/capabilities-registry';
import { requireAdmin } from '@/lib/security/adminGuard';
import {
  describeCronAuthFailure,
  verifyCronSecret,
} from '@/lib/security/cronSecretGuard';
import { consumeRateLimit } from '@/lib/security/rateLimitGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const readinessQuerySchema = z
  .object({
    adapter: z.enum(['gws', 'zapier-mcp', 'kling-fal']).optional(),
  })
  .strict();

function extractClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  return realIp || '127.0.0.1';
}

function parseQueryParams(request: NextRequest): Record<string, string> {
  const raw: Record<string, string> = {};
  const url = request.nextUrl ?? new URL(request.url);
  for (const [key, value] of url.searchParams.entries()) {
    raw[key] = value;
  }
  return raw;
}

function methodNotAllowed(): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed' },
    {
      status: 405,
      headers: {
        ...SECURITY_HEADERS,
        Allow: 'GET',
      },
    },
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = extractClientIp(request);
  const rate = consumeRateLimit(ip);
  if (!rate.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil(rate.retryAfterMs / 1000));
    return NextResponse.json(
      { ok: false, error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          'Retry-After': String(retryAfterSec),
        },
      },
    );
  }

  const adminAuth = await requireAdmin(request);
  if (!adminAuth.ok) {
    if (adminAuth.response.status === 403) {
      return NextResponse.json(
        { ok: false, error: 'Forbidden: Requires ADMIN role' },
        { status: 403, headers: SECURITY_HEADERS },
      );
    }
    const cronVerdict = verifyCronSecret(request);
    if (!cronVerdict.ok) {
      return NextResponse.json(describeCronAuthFailure(cronVerdict), {
        status: cronVerdict.status,
        headers: SECURITY_HEADERS,
      });
    }
  }

  const queryCheck = readinessQuerySchema.safeParse(parseQueryParams(request));
  if (!queryCheck.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid query parameters',
        issues: queryCheck.error.issues.map((i) => i.path.join('.') || 'query'),
      },
      {
        status: 400,
        headers: SECURITY_HEADERS,
      },
    );
  }

  const snapshot = getCapabilitiesRegistrySnapshot({
    adapterFilter: queryCheck.data.adapter,
  });

  return NextResponse.json(snapshot, {
    status: 200,
    headers: SECURITY_HEADERS,
  });
}

export async function POST(): Promise<NextResponse> {
  return methodNotAllowed();
}

export async function PUT(): Promise<NextResponse> {
  return methodNotAllowed();
}

export async function PATCH(): Promise<NextResponse> {
  return methodNotAllowed();
}

export async function DELETE(): Promise<NextResponse> {
  return methodNotAllowed();
}
