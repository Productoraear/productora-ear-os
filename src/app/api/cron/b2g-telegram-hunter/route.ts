import { NextRequest, NextResponse } from 'next/server';
import { fetchTedNotices } from '@/lib/services/ted-connector';
import { sendB2GTelegramAlert, B2GTenderAlertPayload } from '@/lib/b2g/telegram-notifier';
import { SAFE_LCSP_CEILING_EUR } from '@/lib/constants/ear-os-ssot';
import { describeCronAuthFailure, verifyCronSecret } from '@/lib/security/cronSecretGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ⏰ VERCEL CRON / RADAR B2G — CONECTOR REAL TED API v3 (09:00 CEST)
 * Consulta avisos reales del Tenders Electronic Daily y despacha Telegram.
 * Fail-closed sin TED_API_KEY: 0 avisos, nunca fabrica expedientes.
 */
export async function GET(req: NextRequest) {
  // 🔒 P0: el guard anterior (`if (cronSecret && ...)`) FALLABA ABIERTO sin
  // `CRON_SECRET`: cualquiera podía disparar el despacho B2G a Telegram. Ahora
  // manda el SSOT `cronSecretGuard` (fail-closed 503 + tiempo constante).
  const verdict = verifyCronSecret(req);
  if (!verdict.ok) {
    return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
  }

  try {
    console.log('⏰ [CRON B2G HUNTER] Disparo automático — consultando TED API v3...');

    const scan = await fetchTedNotices(50);

    if (!scan.ok) {
      return NextResponse.json(
        {
          success: false,
          status: 'TED_API_FAIL_CLOSED',
          error: scan.error,
          timestamp: new Date().toISOString(),
        },
        { status: scan.source === 'FAIL_CLOSED' ? 503 : 502 }
      );
    }

    const alerts: B2GTenderAlertPayload[] = scan.notices.map((notice) => {
      const cpvCode = notice.classificationCpvs[0] ?? '92300000-4';
      const baseValue = notice.baseValueEur ?? 0;
      const isLCSP = baseValue > 0 && baseValue <= SAFE_LCSP_CEILING_EUR;
      return {
        id: `TED-${notice.publicationNumber || 'UNKNOWN'}`,
        expedienteRef: notice.publicationNumber || 'TED-PENDING',
        title: notice.subject,
        organoContratante: notice.buyer,
        municipio: notice.buyer,
        provincia: 'TED Unión Europea',
        cpvCode,
        cpvDescription: cpvCode.startsWith('8532')
          ? 'Servicios Sociales Comunitarios'
          : 'Servicios de Entretenimiento y Espectáculos',
        importeBase: baseValue,
        fechaLimite: notice.deadline ?? 'Consultar en TED',
        tipoContrato: isLCSP ? 'MENOR' : 'ABIERTO',
        isLCSPCompliant: isLCSP,
        vimumeCompatible: false,
        matchScore: 90,
        matchReasons: ['Fuente verificable TED UE'],
        status: 'TED_ES',
      };
    });

    // Enviar máximo 5 avisos por ejecución de cron para respetar el rate limit de Telegram y evitar spam
    const highMatch = alerts.filter((a) => a.matchScore >= 90).slice(0, 5);
    let dispatched = 0;
    for (const alert of highMatch) {
      const sent = await sendB2GTelegramAlert(alert);
      if (sent) dispatched += 1;
    }

    return NextResponse.json({
      success: true,
      status: 'RADAR_B2G_TED_V3_DISPATCHED',
      scannedCount: scan.total,
      eligibleCount: alerts.length,
      highMatchCount: highMatch.length,
      telegramNotificationsSent: dispatched,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ [CRON B2G HUNTER ERROR]:', message);
    return NextResponse.json({ error: 'Error interno del radar B2G' }, { status: 500 });
  }
}