import { NextResponse } from 'next/server';
import { getDualEngineSystemStatus } from '@/lib/infrastructure/hostinger-dual-engine';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

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
