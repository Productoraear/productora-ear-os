import { NextResponse } from 'next/server';
import { getDualEngineSystemStatus } from '@/lib/infrastructure/hostinger-dual-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getDualEngineSystemStatus();
    return NextResponse.json({
      success: true,
      ...status
    });
  } catch (error: any) {
    console.error('[DUAL ENGINE API ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener la telemetría dual de Hostinger'
      },
      { status: 500 }
    );
  }
}
