import { NextRequest, NextResponse } from 'next/server';
import { sendB2GTelegramAlert, B2GTenderAlertPayload } from '@/lib/b2g/telegram-notifier';
import { fetchTedNotices, TedNotice } from '@/lib/services/ted-connector';
import { SAFE_LCSP_CEILING_EUR } from '@/lib/constants/ear-os-ssot';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 🏛️ CRON RADAR B2G — CONECTOR REAL TED API v3 (CERO FACHADAS)
 *
 * Sustituye el radar hardcodeado por una consulta en vivo al Tenders Electronic
 * Daily (UE). Filtra por CPVs de alto valor para EAR OS, calcula un Match Score
 * honesto contra el SSOT y despacha Telegram SOLO cuando hay datos verificables.
 *
 * Doctrina del Dato Verificado:
 *  - Sin TED_API_KEY => FAIL-CLOSED (0 avisos, ninguna fabricación).
 *  - Sin importe declarado => NO se marca como Art. 118 LCSP.
 */

type CronScanBody = {
  success: boolean;
  timestamp: string;
  scanner: 'TED_API_V3';
  source: 'TED_V3' | 'FAIL_CLOSED';
  scannedCount: number;
  eligibleCount: number;
  highMatchCount: number;
  telegramNotificationsSent: number;
  error: string | null;
};

/** CPVs de servicios sociales (compatibles con protocolo VIMUME <75 dB). */
const VIMUME_CPV_PREFIXES: readonly string[] = Object.freeze([
  '8532',
  '85312',
  '853121',
]);

/** Palabras clave de envejecimiento activo / social para refinar VIMUME. */
const VIMUME_KEYWORDS: readonly string[] = Object.freeze([
  'mayor',
  'mayores',
  'senior',
  'envejecimiento',
  'social',
  'sociosanitario',
  'centro de dia',
  'centro de día',
  'musicoterapia',
  'residencia',
]);

function normalizeCpv(cpv: string): string {
  return cpv.trim().toUpperCase();
}

function isVimumeCompatible(notice: TedNotice): boolean {
  const text = `${notice.subject} ${notice.buyer}`.toLowerCase();
  if (notice.classificationCpvs.some((cpv) =>
    VIMUME_CPV_PREFIXES.some((prefix) => normalizeCpv(cpv).startsWith(prefix))
  )) {
    return true;
  }
  return VIMUME_KEYWORDS.some((kw) => text.includes(kw));
}

function computeMatchScore(notice: TedNotice): number {
  let score = 60;

  const hasTargetCpv = notice.classificationCpvs.some((cpv) =>
    normalizeCpv(cpv).startsWith('9230') ||
    normalizeCpv(cpv).startsWith('8532') ||
    normalizeCpv(cpv).startsWith('3152') ||
    normalizeCpv(cpv).startsWith('5131') ||
    normalizeCpv(cpv).startsWith('7995')
  );
  if (hasTargetCpv) score += 25;

  if (isVimumeCompatible(notice)) score += 10;

  if (notice.baseValueEur !== null && notice.baseValueEur > 0 && notice.baseValueEur <= SAFE_LCSP_CEILING_EUR) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

function mapTedNoticeToAlert(notice: TedNotice): B2GTenderAlertPayload {
  const cpvCode = notice.classificationCpvs[0] ?? '92300000-4';
  const cpvDescription = cpvCode.startsWith('8532') ? 'Servicios Sociales Comunitarios' : 'Servicios de Entretenimiento y Espectáculos';
  const baseValue = notice.baseValueEur ?? 0;
  const isLCSPCompliant = notice.baseValueEur !== null && notice.baseValueEur > 0 && notice.baseValueEur <= SAFE_LCSP_CEILING_EUR;
  const matchScore = computeMatchScore(notice);

  return {
    id: `TED-${notice.publicationNumber || 'UNKNOWN'}`,
    expedienteRef: notice.publicationNumber || 'TED-PENDING',
    title: notice.subject,
    organoContratante: notice.buyer,
    municipio: notice.buyer,
    provincia: 'TED Unión Europea',
    cpvCode,
    cpvDescription,
    importeBase: baseValue,
    importeConIVA: baseValue > 0 ? Number((baseValue * 1.21).toFixed(2)) : undefined,
    fechaPublicacion: notice.publicationDate ?? undefined,
    fechaLimite: notice.deadline ?? 'Consultar en TED',
    tipoContrato: isLCSPCompliant ? 'MENOR' : 'ABIERTO',
    isLCSPCompliant,
    vimumeCompatible: isVimumeCompatible(notice),
    matchScore,
    matchReasons: [
      isLCSPCompliant ? 'Contrato Menor LCSP (< 14.250 €)' : 'Contrato supera techo Art. 118',
      isVimumeCompatible(notice) ? 'VIMUME Compatible (<75 dB SPL)' : 'Estándar Festejos',
      'Fuente verificable TED UE',
    ],
    status: 'TED_ES',
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'UNAUTHORIZED_CRON_ACCESS' }, { status: 401 });
  }

  try {
    console.log('🏛️ [CRON B2G HUNTER] Consultando TED API v3 (fuente real)...');

    const scan = await fetchTedNotices(50);

    if (!scan.ok) {
      const body: CronScanBody = {
        success: false,
        timestamp: new Date().toISOString(),
        scanner: 'TED_API_V3',
        source: scan.source,
        scannedCount: 0,
        eligibleCount: 0,
        highMatchCount: 0,
        telegramNotificationsSent: 0,
        error: scan.error,
      };
      return NextResponse.json(body, { status: scan.source === 'FAIL_CLOSED' ? 503 : 502 });
    }

    const alerts = scan.notices.map(mapTedNoticeToAlert);
    const highMatch = alerts.filter((a) => a.matchScore >= 90).slice(0, 5);

    let telegramDispatchedCount = 0;
    for (const alert of highMatch) {
      const sent = await sendB2GTelegramAlert(alert);
      if (sent) telegramDispatchedCount += 1;
    }

    const body: CronScanBody = {
      success: true,
      timestamp: new Date().toISOString(),
      scanner: 'TED_API_V3',
      source: scan.source,
      scannedCount: scan.total,
      eligibleCount: alerts.length,
      highMatchCount: highMatch.length,
      telegramNotificationsSent: telegramDispatchedCount,
      error: null,
    };

    return NextResponse.json(body, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ [CRON B2G HUNTER ERROR]:', message);
    const body: CronScanBody = {
      success: false,
      timestamp: new Date().toISOString(),
      scanner: 'TED_API_V3',
      source: 'TED_V3',
      scannedCount: 0,
      eligibleCount: 0,
      highMatchCount: 0,
      telegramNotificationsSent: 0,
      error: message,
    };
    return NextResponse.json(body, { status: 500 });
  }
}