import { NextRequest, NextResponse } from 'next/server';
import {
  getConsolidatedAutomationConfig,
  patchConsolidatedAutomationConfig,
  AutomationConfigPatchSchema
} from '@/lib/admin/automation-config-ssot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getConsolidatedAutomationConfig();
    return NextResponse.json(
      {
        success: true,
        ...data,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[/api/admin/automation-config] Error GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AutomationConfigPatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PAYLOAD',
          issues: parsed.error.issues
        },
        { status: 400 }
      );
    }

    const result = await patchConsolidatedAutomationConfig(parsed.data);
    return NextResponse.json(
      {
        ...result,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[/api/admin/automation-config] Error PATCH:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}
