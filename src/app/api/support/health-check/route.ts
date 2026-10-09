/**
 * 🩺 SUPPORT HEALTH-CHECK (S-CLASS — UPTIME MONITOR)
 * ----------------------------------------------------------------------------
 * Endpoint de vigilancia de infraestructura. Verifica:
 *   1. La instancia n8n (`/healthz`).
 *   2. El frontend de producción (`APP_URL`).
 *   3. La API crítica de pagos (`APP_URL/api/omega/heartbeat`).
 *
 * Si un componente cae, dispara alertas escalonadas vía SupportAlertEngine:
 *   CRITICAL → Telegram + WhatsApp + Email
 *   WARNING  → Telegram + WhatsApp
 *
 * Diseñado para ser invocado cada 5 minutos por un CRON de Vercel o por el
 * workflow n8n `support-health`. Protegido por token CRON_SECRET en producción.
 * ----------------------------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import {
    pingN8nInstance,
    type N8nInstanceHealth
} from '@/lib/services/n8n-dispatcher';
import {
    dispatchCriticalSupportAlert,
    dispatchWarningSupportAlert
} from '@/lib/services/support-alert-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APP_URL = process.env.APP_URL || process.env.VERCEL_URL || 'https://productoraear.com';
const CRON_SECRET = process.env.CRON_SECRET;

interface ProbeResult {
    name: string;
    alive: boolean;
    status: number | null;
    latencyMs: number | null;
}

async function probeHttp(name: string, url: string): Promise<ProbeResult> {
    const started = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(url, { method: 'GET', signal: controller.signal });
        clearTimeout(timeout);
        return {
            name,
            alive: res.ok || res.status === 200,
            status: res.status,
            latencyMs: Date.now() - started
        };
    } catch (reason) {
        clearTimeout(timeout);
        console.error(`[HEALTH-CHECK] ${name} caído:`, reason instanceof Error ? reason.message : String(reason));
        return { name, alive: false, status: null, latencyMs: null };
    }
}

export async function GET(request: Request): Promise<NextResponse> {
    const authHeader = request.headers.get('authorization');

    if (process.env.NODE_ENV === 'production' && CRON_SECRET) {
        if (authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
        }
    }

    const results: ProbeResult[] = [];
    const n8nHealth: N8nInstanceHealth = await pingN8nInstance();
    results.push({
        name: 'n8n-instance',
        alive: n8nHealth.alive,
        status: n8nHealth.status,
        latencyMs: n8nHealth.latencyMs
    });

    const frontend = await probeHttp('frontend', `${APP_URL.replace(/\/$/, '')}/`);
    results.push(frontend);

    const heartbeat = await probeHttp('omega-heartbeat', `${APP_URL.replace(/\/$/, '')}/api/omega/heartbeat`);
    results.push(heartbeat);

    const failed = results.filter((r) => !r.alive);

    if (failed.length > 0) {
        const failedNames = failed.map((f) => f.name).join(', ');
        const isCritical = failed.some((f) => f.name === 'frontend' || f.name === 'omega-heartbeat');

        if (isCritical) {
            void dispatchCriticalSupportAlert({
                title: 'Infraestructura crítica caída',
                detail: `Componentes sin respuesta: ${failedNames}`,
                source: 'support-health-check',
                metadata: Object.fromEntries(failed.map((f) => [f.name, f.status ?? 'timeout']))
            });
        } else {
            void dispatchWarningSupportAlert({
                title: 'Degradación de servicio detectada',
                detail: `Componentes sin respuesta: ${failedNames}`,
                source: 'support-health-check',
                metadata: Object.fromEntries(failed.map((f) => [f.name, f.status ?? 'timeout']))
            });
        }
    }

    return NextResponse.json(
        {
            success: true,
            checkedAt: new Date().toISOString(),
            healthy: failed.length === 0,
            results
        },
        {
            status: 200,
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        }
    );
}