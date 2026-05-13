import { NextResponse } from 'next/server';
// Importación dinámica para evitar el crash del servidor en despliegues sin Puppeteer nativo
const runCazadorFantasma = async (url: string) => {
    const { runCazadorFantasma: execute } = await import('@/lib/services/scrapers/cazador_fantasma');
    return execute(url);
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ⚡ PHANTOM HUNTER API (S-CLASS)
 * High-end Node.js scraping engine using Puppeteer & Cheerio.
 */

export async function POST(req: Request) {
    try {
        const { targetUrl } = await req.json();

        if (!targetUrl) {
            return NextResponse.json({ error: 'URL de objetivo requerida' }, { status: 400 });
        }


        // Ejecución del motor S-Class
        const result = await runCazadorFantasma(targetUrl);

        if (result.success) {
            return NextResponse.json({ 
                success: true, 
                message: 'Infiltración completada con éxito.',
                data: result 
            });
        } else {
            return NextResponse.json({ 
                success: false, 
                error: result.error || 'Fallo desconocido en el motor' 
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('❌ PHANTOM_HUNTER_EXECUTION_ERROR:', error);
        return NextResponse.json({ error: 'Error interno en el puente S-Class' }, { status: 500 });
    }
}
