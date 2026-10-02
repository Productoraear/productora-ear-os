import { NextRequest, NextResponse } from 'next/server';
import { calculateLeadScore } from '@/lib/scoring/leadScoreEngine';

type LeadDispatchPayload = {
  leadId?: string;
  email?: string;
  name?: string;
  phone?: string;
  source?: string;
  notes?: string;
  organizationName?: string;
  budgetEur?: number;
  isInstitutional?: boolean;
  eventDate?: string;
  province?: string;
};

type DispatchResult = {
  ok: boolean;
  dispatchedAt: string;
  leadId: string;
  leadScore: number;
  tier: string;
};

type LowScoreResult = {
  ok: boolean;
  dispatched: boolean;
  reason: 'LOW_SCORE';
  leadId: string;
  leadScore: number;
  tier: string;
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
        organizationName: toOptionalString(body.organizationName),
        budgetEur: typeof body.budgetEur === 'number' && Number.isFinite(body.budgetEur) ? body.budgetEur : undefined,
        isInstitutional: typeof body.isInstitutional === 'boolean' ? body.isInstitutional : undefined,
        eventDate: toOptionalString(body.eventDate),
        province: toOptionalString(body.province),
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

  // ====================================================================
  // 🎯 LEAD SCORING — Filtro anti-saturación del CEO (umbral: 30)
  // ====================================================================
  const scoreResult = calculateLeadScore({
    email: payload.email,
    phone: payload.phone,
    name: payload.name,
    organizationName: payload.organizationName,
    budgetEur: payload.budgetEur,
    isInstitutional: payload.isInstitutional,
    eventDate: payload.eventDate,
    province: payload.province,
    notes: payload.notes,
  });

  if (scoreResult.score < 30) {
    const lowScoreResult: LowScoreResult = {
      ok: true,
      dispatched: false,
      reason: 'LOW_SCORE',
      leadId,
      leadScore: scoreResult.score,
      tier: scoreResult.tier,
    };
    return NextResponse.json(lowScoreResult, { status: 200 });
  }

  const result: DispatchResult = {
    ok: true,
    dispatchedAt: new Date().toISOString(),
    leadId,
    leadScore: scoreResult.score,
    tier: scoreResult.tier,
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