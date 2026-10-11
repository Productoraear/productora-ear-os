import { NextResponse } from 'next/server';
import { B2G_PRESETS } from '@/lib/vimume/b2g-tender-engine';
import { fetchTedNotices, TedNotice } from '@/lib/services/ted-connector';
import { SAFE_LCSP_CEILING_EUR } from '@/lib/constants/ear-os-ssot';

/**
 * 🏛️ B2G TENDER ALERT FEED — FUENTE REAL TED API v3 (CERO FACHADAS)
 *
 * Sustituye el feed simulado por una consulta en vivo al Tenders Electronic
 * Daily (UE). Sirve exclusivamente avisos reales, nunca expedientes fabricados.
 *
 * Doctrina del Dato Verificado:
 *  - Sin TED_API_KEY => fail-closed (feed vacío).
 *  - Sin importe declarado => importeBase 0 y NO se marca Art. 118 LCSP.
 */

export interface B2GTenderOpportunity {
  id: string;
  expedienteRef: string;
  title: string;
  organoContratante: string;
  municipio: string;
  provincia: string;
  dir3Code: string;
  cpvCode: string;
  cpvDescription: string;
  importeBase: number;
  importeConIVA: number;
  fechaPublicacion: string;
  fechaLimite: string;
  diasRestantes: number;
  tipoContrato: 'MENOR' | 'NEGOCIADO_SIN_PUB' | 'ABIERTO';
  isLCSPCompliant: boolean;
  vimumeCompatible: boolean;
  matchScore: number;
  matchReasons: string[];
  status: 'NUEVA' | 'ANALIZADA' | 'BORRADOR_EMITIDO' | 'PRESENTADA' | 'ADJUDICADA' | 'DESCARTADA';
}

export interface B2GAlertFeedResponse {
  success: boolean;
  timestamp: string;
  scanner: 'TED_V3' | 'FAIL_CLOSED';
  count: number;
  tenders: B2GTenderOpportunity[];
  presets: typeof B2G_PRESETS;
  error: string | null;
}

const VIMUME_CPV_PREFIXES: readonly string[] = Object.freeze(['8532', '85312', '853121']);

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

function isVimumeCompatible(notice: TedNotice): boolean {
  const text = `${notice.subject} ${notice.buyer}`.toLowerCase();
  if (notice.classificationCpvs.some((cpv) =>
    VIMUME_CPV_PREFIXES.some((prefix) => cpv.toUpperCase().startsWith(prefix))
  )) {
    return true;
  }
  return VIMUME_KEYWORDS.some((kw) => text.includes(kw));
}

function computeDaysRemaining(deadline: string | null): number {
  if (!deadline) return 0;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return 0;
  const ms = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

function computeMatchScore(notice: TedNotice, isLCSPCompliant: boolean): number {
  let score = 70;
  if (isLCSPCompliant) score += 15;
  if (isVimumeCompatible(notice)) score += 10;
  if (computeDaysRemaining(notice.deadline) > 0) score += 5;
  return Math.min(100, Math.max(0, score));
}

function mapTedNoticeToOpportunity(notice: TedNotice): B2GTenderOpportunity {
  const cpvCode = notice.classificationCpvs[0] ?? '92300000-4';
  const baseValue = notice.baseValueEur ?? 0;
  const isLCSPCompliant = baseValue > 0 && baseValue <= SAFE_LCSP_CEILING_EUR;
  const vimumeCompatible = isVimumeCompatible(notice);
  const diasRestantes = computeDaysRemaining(notice.deadline);

  return {
    id: `TED-${notice.publicationNumber || 'UNKNOWN'}`,
    expedienteRef: notice.publicationNumber || 'TED-PENDING',
    title: notice.subject,
    organoContratante: notice.buyer,
    municipio: notice.buyer,
    provincia: 'TED Unión Europea',
    dir3Code: 'TED_UE',
    cpvCode,
    cpvDescription: cpvCode.startsWith('8532')
      ? 'Servicios Sociales Comunitarios'
      : 'Servicios de Entretenimiento y Espectáculos',
    importeBase: baseValue,
    importeConIVA: baseValue > 0 ? Number((baseValue * 1.21).toFixed(2)) : 0,
    fechaPublicacion: notice.publicationDate ?? '',
    fechaLimite: notice.deadline ?? '',
    diasRestantes,
    tipoContrato: isLCSPCompliant ? 'MENOR' : 'ABIERTO',
    isLCSPCompliant,
    vimumeCompatible,
    matchScore: computeMatchScore(notice, isLCSPCompliant),
    matchReasons: [
      isLCSPCompliant ? 'Contrato Menor LCSP (< 14.250 €)' : 'Contrato supera techo Art. 118',
      vimumeCompatible ? 'VIMUME Compatible (<75 dB SPL)' : 'Estándar Festejos',
      'Fuente verificable TED UE',
    ],
    status: 'NUEVA',
  };
}

export async function GET() {
  try {
    const scan = await fetchTedNotices(30);

    if (!scan.ok) {
      const response: B2GAlertFeedResponse = {
        success: false,
        timestamp: new Date().toISOString(),
        scanner: scan.source,
        count: 0,
        tenders: [],
        presets: B2G_PRESETS,
        error: scan.error,
      };
      return NextResponse.json(response, {
        status: scan.source === 'FAIL_CLOSED' ? 503 : 502,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    const tenders = scan.notices.map(mapTedNoticeToOpportunity);

    const response: B2GAlertFeedResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      scanner: scan.source,
      count: tenders.length,
      tenders,
      presets: B2G_PRESETS,
      error: null,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('B2G_ALERTS_ERROR:', message);
    const response: B2GAlertFeedResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      scanner: 'TED_V3',
      count: 0,
      tenders: [],
      presets: B2G_PRESETS,
      error: message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}