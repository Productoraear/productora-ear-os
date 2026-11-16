import { NextResponse } from 'next/server';
import { releaseOrphanCalendarLocks } from '@/lib/finance/lock-release-saga';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await releaseOrphanCalendarLocks();
    return NextResponse.json({
      success: true,
      data: result
    }, { status: 200 });
  } catch (error) {
    console.error('[/api/cron/release-locks] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}
