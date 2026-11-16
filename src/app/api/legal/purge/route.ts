import { NextRequest, NextResponse } from 'next/server';
import { executeSovereignRgpdPurge, PurgeRequestInput } from '@/lib/legal/purge/rgpd-purger';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PurgeSchema = z.object({
  targetPhone: z.string().optional(),
  targetEmail: z.string().email().optional(),
  targetTaxId: z.string().optional(),
  reason: z.enum(['RIGHT_TO_BE_FORGOTTEN', 'CONSENT_WITHDRAWAL', 'RETENTION_EXPIRED']),
  requestedBy: z.string().min(2)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PurgeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PURGE_REQUEST', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    if (!parsed.data.targetPhone && !parsed.data.targetEmail && !parsed.data.targetTaxId) {
      return NextResponse.json(
        { success: false, error: 'AT_LEAST_ONE_IDENTIFIER_REQUIRED' },
        { status: 400 }
      );
    }

    const report = await executeSovereignRgpdPurge(parsed.data as PurgeRequestInput);
    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (error) {
    console.error('[/api/legal/purge] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
