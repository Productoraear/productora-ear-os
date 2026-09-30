import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ClaimResponse = {
  ok: boolean;
  message: string;
  data?: {
    code: string | null;
    profileId: string | null;
  };
};

function json(payload: ClaimResponse, status: number): NextResponse {
  return NextResponse.json(payload, { status });
}

export async function GET(): Promise<NextResponse> {
  return json({ ok: true, message: 'Profile claim endpoint' }, 200);
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: 'Invalid JSON body' }, 400);
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return json({ ok: false, message: 'Request body must be a JSON object' }, 400);
  }

  const record = payload as Record<string, unknown>;
  const code = typeof record.code === 'string' ? record.code.trim() : '';
  const profileId = typeof record.profileId === 'string' ? record.profileId.trim() : '';

  if (!code && !profileId) {
    return json({ ok: false, message: 'Provide code or profileId' }, 400);
  }

  return json(
    {
      ok: true,
      message: 'Profile claim accepted',
      data: {
        code: code || null,
        profileId: profileId || null,
      },
    },
    200,
  );
}