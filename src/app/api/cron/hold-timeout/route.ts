import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import { getProvidersByLocation } from '@/lib/data/vampire-service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 🏛️ CRON WORKER: TIMEOUT 24H PARA PROTOCOLO HOLD & PING
 * ======================================================
 * Ejecutado cada hora por Vercel Cron.
 * 1. Busca PaymentIntents con pre-autorización (capture_method: manual) > 24h sin capturar.
 * 2. Cancela el Hold en Stripe para liberar el cupo en la tarjeta del cliente (0 € coste/devolución).
 * 3. Recupera 2 fincas/proveedores alternativos de la misma provincia para reorientar al novio.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Validación de seguridad de cron en producción
    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const TWENTY_FOUR_HOURS_SECS = 24 * 60 * 60;
    const thresholdTimestamp = now - TWENTY_FOUR_HOURS_SECS;

    // 1. Listar PaymentIntents pendientes de captura en Stripe
    let processedHolds = 0;
    let releasedHolds: Array<{
      paymentIntentId: string;
      customerPhone?: string;
      province?: string;
      alternativesSuggested: Array<{ name: string; telephone?: string | null }>;
    }> = [];

    try {
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
      });

      for (const pi of paymentIntents.data) {
        const isHoldAndPing = pi.metadata?.hold_and_ping === 'true';
        const isUncaptured = pi.status === 'requires_capture';
        const isExpired = pi.created < thresholdTimestamp;

        if (isHoldAndPing && isUncaptured && isExpired) {
          // Cancelar hold en Stripe (0 comisión, 0 devolución manual)
          await stripe.paymentIntents.cancel(pi.id, {
            cancellation_reason: 'abandoned',
          });

          processedHolds++;

          const province = pi.metadata?.province || 'Madrid';
          const category = pi.metadata?.service_name || 'Fincas';

          // Obtener 2 alternativas del catálogo soberano
          const alternatives = await getProvidersByLocation(province, category, 2);

          releasedHolds.push({
            paymentIntentId: pi.id,
            customerPhone: pi.metadata?.venue_phone,
            province,
            alternativesSuggested: alternatives.map(a => ({
              name: a.name,
              telephone: a.telephone,
            })),
          });
        }
      }
    } catch (stripeErr: any) {
      console.warn('⚠️ [HOLD TIMEOUT CRON] Stripe API list notice:', stripeErr.message);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total_holds_released: processedHolds,
        threshold_hours: 24,
        details: releasedHolds,
      },
    });
  } catch (error: any) {
    console.error('❌ [HOLD TIMEOUT CRON ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
