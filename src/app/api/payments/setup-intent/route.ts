import { NextResponse } from 'next/server';
import { createProviderCardSetupSession } from '@/app/actions/vipCheckoutActions';

export const runtime = 'nodejs';

/**
 * 💳 API SETUP-INTENT: AUTORIZACIÓN DE TARJETA BANCARIA DE FINCA / PROVEEDOR
 * Facturación agrupada a final de mes sin fricción (10 € por cita confirmada en agenda).
 */
export async function POST(req: Request) {
  try {
    const { fincaId, fincaName, contactEmail } = await req.json();

    if (!fincaId || !fincaName) {
      return NextResponse.json({ error: 'fincaId y fincaName requeridos' }, { status: 400 });
    }

    const session = await createProviderCardSetupSession({
      fincaId,
      fincaName,
      contactEmail
    });

    return NextResponse.json({ url: session.url, sessionId: session.sessionId });
  } catch (error: any) {
    console.error('❌ [SETUP INTENT ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error generando SetupIntent' }, { status: 500 });
  }
}
