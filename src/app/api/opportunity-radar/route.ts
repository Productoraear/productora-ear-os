import { NextRequest, NextResponse } from 'next/server';
import { runOpportunityRadar, getRadarStore, sendTelegramOpportunity } from '@/lib/services/opportunity-radar/opportunity-radar';
import type { OpportunityCategory, OpportunityRecord } from '@/lib/services/opportunity-radar/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 🎯 API OPPORTUNITY RADAR // GESTIÓN Y CONSULTA EN TIEMPO REAL
 *
 * GET  -> Consulta las oportunidades reales persistidas con filtros.
 * POST -> Dispara un barrido activo bajo demanda (Google Alerts + BOE + TED),
 *         o despacha una oportunidad individual a Telegram.
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

export async function POST(req: NextRequest) {
    try {
        let body: { action?: string; opportunityId?: string } = {};
        try {
            body = await req.json();
        } catch {
            // body vacío o no JSON => acción por defecto 'scan'
        }

        if (body.action === 'dispatch_telegram') {
            if (!body.opportunityId) {
                return NextResponse.json({ success: false, error: 'Falta opportunityId' }, { status: 400 });
            }
            const store = await getRadarStore();
            const target = store.opportunities.find((o) => o.id === body.opportunityId);
            if (!target) {
                return NextResponse.json({ success: false, error: 'Oportunidad no encontrada' }, { status: 404 });
            }
            const hasCreds = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
            if (!hasCreds) {
                return NextResponse.json({
                    success: false,
                    dispatched: false,
                    opportunityId: body.opportunityId,
                    message: 'Falta configurar TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en las variables de entorno de Coolify.',
                });
            }
            const sent = await sendTelegramOpportunity(target);
            return NextResponse.json({
                success: sent,
                dispatched: sent,
                opportunityId: body.opportunityId,
                message: sent ? 'Alerta enviada a Telegram con éxito' : 'Error de red con api.telegram.org (verifica validez de TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID)',
            });
        }

        if (body.action === 'dispatch_top_telegram') {
            const hasCreds = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
            if (!hasCreds) {
                return NextResponse.json({
                    success: false,
                    dispatchedCount: 0,
                    message: 'Falta configurar TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en las variables de entorno de Coolify.',
                });
            }
            const store = await getRadarStore();
            const top5 = [...store.opportunities]
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 5);
            let sentCount = 0;
            for (const opp of top5) {
                const ok = await sendTelegramOpportunity(opp);
                if (ok) sentCount++;
            }
            return NextResponse.json({
                success: sentCount > 0,
                dispatchedCount: sentCount,
                message: sentCount > 0
                    ? `¡${sentCount} oportunidades Top enviadas en vivo a tu Telegram!`
                    : 'No se pudo conectar con Telegram (verifica TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID).',
            });
        }

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
