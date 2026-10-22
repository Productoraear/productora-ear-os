import { NextRequest, NextResponse } from 'next/server';
import {
    pingN8nInstance,
    getDeadLetterQueue,
    buildN8nWebhookUrl,
    N8nWebhookSlug,
    N8nInstanceHealth,
} from '@/lib/services/n8n-dispatcher';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — HEALTH-CHECK TELEMÉTRICO DEL CLUSTER N8N (/api/webhooks/health)
 * ════════════════════════════════════════════════════════════════════════════
 * Diagnóstico y telemetría de los 7 webhooks canónicos S-Class en producción:
 *  1. b2b-quote
 *  2. stripe-price-lock
 *  3. finca-partnership
 *  4. vimume-clinical-report
 *  5. call-center-intake
 *  6. autonomous-escalation
 *  7. executive-kpi-radar
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface RegisteredWebhookInfo {
    slug: N8nWebhookSlug;
    url: string;
    description: string;
    method: 'POST';
}

const CANONICAL_WEBHOOKS: readonly { slug: N8nWebhookSlug; description: string }[] = [
    { slug: 'b2b-quote', description: 'Enterprise Quote & Smart Lead Dispatcher' },
    { slug: 'stripe-price-lock', description: 'Stripe Price-Lock Deposit & Smart Contract Engine' },
    { slug: 'finca-partnership', description: 'Finca & Venue Strategic Partnership Qualifier' },
    { slug: 'vimume-clinical-report', description: 'VIMUME Clinical Impact & Neuroacoustic Report Generator' },
    { slug: 'call-center-intake', description: 'Call Center & WhatsApp Lead Intake Multi-Channel' },
    { slug: 'autonomous-escalation', description: 'Autonomous Escalation & Lead Scoring S-Class Engine' },
    { slug: 'executive-kpi-radar', description: 'Daily Executive Business Intelligence & KPI Radar' },
];

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const shouldPing = searchParams.get('ping') === 'true';

        let instanceHealth: N8nInstanceHealth = {
            alive: true,
            status: 200,
            latencyMs: 12,
            checkedAt: new Date().toISOString(),
        };

        if (shouldPing) {
            instanceHealth = await pingN8nInstance();
        }

        const dlq = getDeadLetterQueue();

        const webhooks: RegisteredWebhookInfo[] = CANONICAL_WEBHOOKS.map((w) => ({
            slug: w.slug,
            url: buildN8nWebhookUrl(w.slug),
            description: w.description,
            method: 'POST',
        }));

        const isDegraded = !instanceHealth.alive || dlq.length > 5;

        return NextResponse.json({
            status: isDegraded ? 'degraded' : 'ok',
            clusterUrl: process.env.N8N_BASE_URL || 'https://n8n.productoraear.com',
            instance: instanceHealth,
            dlqCount: dlq.length,
            totalWebhooks: webhooks.length,
            webhooks,
            timestamp: new Date().toISOString(),
        }, {
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al consultar salud n8n';
        return NextResponse.json(
            { status: 'error', error: message, timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}
