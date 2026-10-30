import { NextRequest, NextResponse } from 'next/server';
import { runOpportunityRadar } from '@/lib/services/opportunity-radar/opportunity-radar';
import { describeCronAuthFailure, verifyCronSecret } from '@/lib/security/cronSecretGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 🎯 CRON OPPORTUNITY RADAR — CONECTOR REAL (Google Alerts + RSS + TED)
 *
 * Barrido programado de oportunidades (convocatorias de artistas, concursos,
 * comisiones de fiestas, subvenciones, plenos municipales y servicios sociales
 * para mayores VIMUME). Solo despacha datos REALES; sin fuentes => 0 avisos.
 *
 * Fuentes (server-only):
 *  - OPPORTUNITY_RADAR_FEEDS  (JSON array de feeds RSS/Atom)
 *  - GOOGLE_ALERTS_RSS        (URLs de Google Alerts separadas por comas)
 *  - TED_API_KEY              (licitaciones UE)
 */
export async function GET(req: NextRequest) {
    // 🔒 P0: antes `if (cronSecret && authHeader !== ...)` FALLABA ABIERTO con
    // `CRON_SECRET` ausente (cron público en producción). Ahora el veredicto es
    // el SSOT `cronSecretGuard`: fail-closed (503) sin secreto y comparación en
    // tiempo constante con huellas públicas en el 401.
    const verdict = verifyCronSecret(req);
    if (!verdict.ok) {
        return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
    }

    try {
        console.log('🎯 [CRON OPPORTUNITY RADAR] Barrido de fuentes reales...');
        const result = await runOpportunityRadar();

        const status = result.ok ? 200 : result.source === 'FAIL_CLOSED' ? 503 : 502;
        return NextResponse.json(result, { status });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ [CRON OPPORTUNITY RADAR ERROR]:', message);
        return NextResponse.json(
            {
                ok: false,
                source: 'OPPORTUNITY_RADAR',
                scannedFeeds: 0,
                fetchedCount: 0,
                newCount: 0,
                highMatchCount: 0,
                telegramDispatched: 0,
                n8nDispatched: 0,
                error: message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 },
        );
    }
}
