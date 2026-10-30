import { NextRequest, NextResponse } from 'next/server';
import {
    pingN8nInstance,
    getDeadLetterQueue,
    buildN8nWebhookUrl,
    N8nWebhookSlug,
    N8nInstanceHealth,
} from '@/lib/services/n8n-dispatcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
        const pingRequested = searchParams.get('ping') === 'true';

        // AF-1 / AF-5 (§3 · .clinerules): la sonda se ejecuta SIEMPRE.
        // Antes esta ruta devolvía `alive:true, status:200, latencyMs:12` con un
        // `checkedAt` recién fabricado sin haber tocado n8n: un "verde por
        // defecto" que convertía la monitorización en una fachada (una caída se
        // detecta, una mentira se confía). `?ping=true` se conserva por
        // compatibilidad con los monitores, pero ya no decide si se mide o se finge.
        const instanceHealth: N8nInstanceHealth = await pingN8nInstance();

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
            // Campos obligatorios de la LEY ANTI-FACHADA (AF-1): quién midió,
            // de dónde sale el dato y en qué modo. Sin ellos, un OK no es prueba.
            probed: true,
            source: 'live',
            mode: 'REAL',
            checkedAt: instanceHealth.checkedAt,
            probeRequestedByQuery: pingRequested,
            clusterUrl: process.env.N8N_BASE_URL || 'https://n8n.productoraear.com',
            instance: instanceHealth,
            dlqCount: dlq.length,
            // La DLQ vive en memoria del proceso: no sobrevive a un redeploy y no
            // es compartida entre réplicas. Declararlo evita vender 0 como absoluto.
            dlqScope: 'process-local',
            totalWebhooks: webhooks.length,
            // Lista canónica de configuración, no una consulta a n8n (AF-2).
            webhookSource: 'canonical-config',
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
