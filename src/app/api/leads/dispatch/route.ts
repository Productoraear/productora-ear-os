import { NextRequest, NextResponse } from 'next/server';

type LeadDispatchPayload = {
  leadId?: string;
  email?: string;
  name?: string;
  phone?: string;
  source?: string;
  notes?: string;
};

type DispatchResult = {
  ok: boolean;
  dispatchedAt: string;
  leadId: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

export async function POST(request: NextRequest) {
  let payload: LeadDispatchPayload = {};

  try {
    const body = (await request.json()) as unknown;

    if (isRecord(body)) {
      payload = {
        leadId: toOptionalString(body.leadId),
        email: toOptionalString(body.email),
        name: toOptionalString(body.name),
        phone: toOptionalString(body.phone),
        source: toOptionalString(body.source),
        notes: toOptionalString(body.notes),
      };
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid JSON body',
      },
      { status: 400 },
    );
  }

  const leadId = payload.leadId ?? `lead_${Date.now()}`;

  const result: DispatchResult = {
    ok: true,
    dispatchedAt: new Date().toISOString(),
    leadId,
  };

  return NextResponse.json(result, { status: 202 });
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: 'Lead dispatch endpoint',
    },
    { status: 200 },
  );
}