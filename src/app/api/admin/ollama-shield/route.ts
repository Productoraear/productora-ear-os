import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { requireAdmin } from '@/lib/security/adminGuard';

const execAsync = promisify(exec);

/**
 * B0.21 — VRAM-SHIELD OLLAMA CONSOLE
 * Puente seguro entre /admin/command-center y el host bare-metal RX 7900 XTX.
 * Expone únicamente acciones blancas y no destructivas sobre la flota Ollama.
 *
 * GET  /api/admin/ollama-shield?action=status  -> flota activa + VRAM
 * POST /api/admin/ollama-shield                -> build | purge | activate
 */

type OllamaPsRow = {
    name: string;
    id: string;
    size: string;
    processor: string;
    context: string;
    until: string;
};

type ShieldStatusBody = {
    action: 'status';
    ts: string;
    online: boolean;
    models: OllamaPsRow[];
    totalRows: number;
    rawError?: string;
};

type ShieldActionBody = {
    action: 'build' | 'purge' | 'activate';
    ts: string;
    status: 'ok' | 'error';
    message: string;
    detail?: string;
};

const MODELFILES: Record<string, string> = {
    'ear-14b-textos-sclass': 'Modelfile_14B_Textos_SClass',
    'ear-27b-apis-sclass': 'Modelfile_27B_APIs_SClass',
    'ear-32b-arquitecto-sclass': 'Modelfile_32B_Arquitecto_SClass',
};

function parsePsRows(raw: string): OllamaPsRow[] {
    const lines = raw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    const headerIndex = lines.findIndex((l) =>
        /^NAME\s+ID\s+SIZE\s+PROCESSOR\s+CONTEXT\s+UNTIL/.test(l)
    );
    if (headerIndex === -1) return [];

    return lines.slice(headerIndex + 1).map((line) => {
        const [name, id, size, processor, context, until] = line
            .split(/\s{2,}/)
            .map((part) => part.trim());

        return {
            name: name || '',
            id: id || '',
            size: size || '',
            processor: processor || '',
            context: context || '',
            until: until || '',
        };
    });
}

async function runOllama(command: string): Promise<string> {
    const { stdout, stderr } = await execAsync(command, {
        timeout: 60000,
        windowsHide: true,
    });

    if (stderr && stderr.trim()) {
        console.warn('[ollama-shield] stderr:', stderr.trim());
    }

    return stdout;
}

async function readStatus(): Promise<ShieldStatusBody> {
    try {
        const raw = await runOllama('ollama ps');
        const models = parsePsRows(raw);
        return {
            action: 'status',
            ts: new Date().toISOString(),
            online: true,
            models,
            totalRows: models.length,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        return {
            action: 'status',
            ts: new Date().toISOString(),
            online: false,
            models: [],
            totalRows: 0,
            rawError: message,
        };
    }
}

async function buildProfiles(): Promise<ShieldActionBody> {
    const results: string[] = [];

    for (const [tag, modelfile] of Object.entries(MODELFILES)) {
        const filePath = path.join(process.cwd(), modelfile);
        const output = await runOllama(
            `ollama create ${tag} -f "${filePath}"`
        );
        results.push(`${tag}: ${output.trim() || 'ok'}`);
    }

    return {
        action: 'build',
        ts: new Date().toISOString(),
        status: 'ok',
        message: 'Perfiles VRAM-Shield construidos.',
        detail: results.join('\n'),
    };
}

async function purgeVram(): Promise<ShieldActionBody> {
    const output = await runOllama('ollama stop ear-27b-apis-ctx20480:latest');
    return {
        action: 'purge',
        ts: new Date().toISOString(),
        status: 'ok',
        message: 'Modelo de contexto 100k detenido y VRAM liberada.',
        detail: output.trim(),
    };
}

export async function GET(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const body = await readStatus();
    return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    let action: 'build' | 'purge' | 'activate' = 'activate';
    try {
        const payload = (await request.json()) as {
            action?: 'build' | 'purge' | 'activate';
        };
        if (
            payload?.action === 'build' ||
            payload?.action === 'purge' ||
            payload?.action === 'activate'
        ) {
            action = payload.action;
        }
    } catch {
        // sin cuerpo -> action por defecto
    }

    try {
        let body: ShieldActionBody;

        if (action === 'build') {
            body = await buildProfiles();
        } else if (action === 'purge') {
            body = await purgeVram();
        } else {
            const status = await readStatus();
            body = {
                action: 'activate',
                ts: status.ts,
                status: status.online ? 'ok' : 'error',
                message: status.online
                    ? `Flota activa: ${status.totalRows} modelo(s) en GPU.`
                    : 'Ollama no responde en 127.0.0.1:11434.',
            };
        }

        return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        return NextResponse.json(
            {
                action,
                ts: new Date().toISOString(),
                status: 'error',
                message: 'Fallo al ejecutar la acción VRAM-Shield.',
                detail: message,
            } satisfies ShieldActionBody,
            { status: 500 }
        );
    }
}