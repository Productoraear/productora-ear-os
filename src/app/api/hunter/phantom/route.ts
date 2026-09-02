import { NextResponse } from 'next/server';
import { runCazadorFantasma } from '@/lib/services/scrapers/cazador_fantasma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ⚡ PHANTOM HUNTER API (S-CLASS)
 * High-end extraction engine with Puppeteer Stealth & HTTP Fallback.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const targetUrl = body.targetUrl || 'https://www.bodas.net/bodas/proveedores';
        const depth = body.depth || 'Alpha';

        console.log(`🕵️ [API PHANTOM HUNTER] Infiltrando ${targetUrl} [Profundidad: ${depth}]...`);

        // Ejecución del motor S-Class
        const result = await runCazadorFantasma(targetUrl, depth);

        return NextResponse.json({ 
            success: true, 
            message: 'Infiltración completada con éxito.',
            data: result 
        });

    } catch (error: any) {
        console.error('❌ PHANTOM_HUNTER_EXECUTION_ERROR:', error);
        return NextResponse.json({ error: error.message || 'Error en el puente S-Class' }, { status: 500 });
    }
}
