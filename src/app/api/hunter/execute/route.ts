import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * 💣 HUNTER EXECUTION ENGINE
 * Secure bridge to execute Python scrapers from the UI.
 */

const WHITELIST_SCRIPTS = [
    'extractor.py',
    'extraer_correos_gmail.py',
    'substack_scraper.py',
    'wallapop_bot.py'
];

export async function POST(req: Request) {
    try {
        const { script } = await req.json();

        if (!WHITELIST_SCRIPTS.includes(script)) {
            return NextResponse.json({ error: 'Script no autorizado' }, { status: 403 });
        }

        const scriptPath = path.join(process.cwd(), 'src/lib/services/scrapers', script);

        if (!fs.existsSync(scriptPath)) {
            return NextResponse.json({ error: 'Script no encontrado en el sistema' }, { status: 404 });
        }


        // Ejecución asíncrona (no esperamos a que termine para no bloquear el request)
        // En un entorno real, usaríamos WebSockets o Server-Sent Events para emitir logs.
        const childProcess = exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error al ejecutar ${script}:`, error);
                return;
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: `Protocolo ${script} iniciado en segundo plano.`,
            pid: childProcess.pid 
        });

    } catch (error) {
        console.error('❌ HUNTER_EXECUTION_ERROR:', error);
        return NextResponse.json({ error: 'Error interno del motor de ejecución' }, { status: 500 });
    }
}
