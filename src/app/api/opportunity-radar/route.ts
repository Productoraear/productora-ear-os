import { NextRequest, NextResponse } from 'next/server';
import { runOpportunityRadar, getRadarStore } from '@/lib/services/opportunity-radar/opportunity-radar';
import type { OpportunityCategory, OpportunityRecord } from '@/lib/services/opportunity-radar/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 🎯 API OPPORTUNITY RADAR // GESTIÓN Y CONSULTA EN TIEMPO REAL
 *
 * GET  -> Consulta las oportunidades reales persistidas con filtros.
 * POST -> Dispara un barrido activo bajo demanda (Google Alerts + BOE + TED).
 */

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryFilter = searchParams.get('category') as OpportunityCategory | null;
        const minScore = searchParams.get('minScore') ? Number(searchParams.get('minScore')) : 0;
        const vimumeOnly = searchParams.get('vimumeOnly') === 'true';
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

        const store = await getRadarStore();

        let filtered: OpportunityRecord[] = store.opportunities;

        if (categoryFilter) {
            filtered = filtered.filter((item) => item.categories.includes(categoryFilter));
        }

        if (minScore > 0) {
            filtered = filtered.filter((item) => item.matchScore >= minScore);
        }

        if (vimumeOnly) {
            filtered = filtered.filter((item) => item.vimumeCompatible);
        }

        // Ordenar por fecha o primer avistamiento descendente
        filtered = filtered.sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.firstSeenAt).getTime();
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.firstSeenAt).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({
            success: true,
            total: filtered.length,
            storedTotal: store.opportunities.length,
            lastScanAt: store.lastScanAt,
            scanCount: store.scanCount,
            opportunities: filtered.slice(0, limit),
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

export async function POST(_req: NextRequest) {
    try {
        console.log('🎯 [API OPPORTUNITY RADAR] Iniciando escaneo manual bajo demanda...');
        const result = await runOpportunityRadar();

        return NextResponse.json({
            success: result.ok,
            scanResult: result,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ [API OPPORTUNITY RADAR ERROR]:', message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
