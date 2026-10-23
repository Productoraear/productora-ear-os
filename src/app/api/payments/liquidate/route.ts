import { NextResponse } from 'next/server';
import { NexusPayments } from '@/lib/services/nexus_payments';

export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

// ============================================================================
// 💰 API LIQUIDACIONES S-CLASS
// ============================================================================
export async function POST(req: Request) {
  try {
    const { artistId, secretKey } = await req.json();

    // Seguridad básica (Protocolo S-Class)
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'No autorizado. Se requiere llave maestra.' }, { status: 401 });
    }

    if (!artistId) {
      return NextResponse.json({ error: 'Falta artistId' }, { status: 400 });
    }

    const result = await NexusPayments.executeLiquidation(artistId);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Liquidación de €${result.amount} ejecutada con éxito.`,
        data: result
      });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido en liquidación';
    console.error('❌ [LIQUIDATION API ERROR]', error);
    return NextResponse.json({ error: 'Fallo crítico en el nexo de liquidación', details: message }, { status: 500 });
  }
}
