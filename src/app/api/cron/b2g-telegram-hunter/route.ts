import { NextRequest, NextResponse } from 'next/server';
import { runHunterB2GScan } from '@/../scripts/b2g_hunter_telegram';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ⏰ VERCEL CRON / RADAR B2G AUTOMATIZADO (09:00 CEST)
 * Escanea licitaciones públicas multiescala y envía alertas a Telegram sin límite presupuestario.
 */
export async function GET(req: NextRequest) {
  // Validación de seguridad opcional de Vercel Cron
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    console.log('⏰ [CRON B2G HUNTER] Disparo automático diario a las 09:00 CEST...');
    await runHunterB2GScan();
    return NextResponse.json({ 
      success: true, 
      status: 'RADAR_B2G_TELEGRAM_DISPATCHED',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('❌ [CRON B2G HUNTER ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
