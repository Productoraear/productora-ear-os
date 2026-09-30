import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid JSON body',
      },
      { status: 400 },
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Payload must be an object',
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    savedAt: new Date().toISOString(),
    payload,
  });
}