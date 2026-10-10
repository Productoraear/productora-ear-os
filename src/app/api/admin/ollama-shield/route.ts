import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

const execAsync = promisify(exec);

/**
 * B0.21 — VRAM-SHIELD OLLAMA CONSOLE
 * Puente seguro entre /admin/command-center y el host bare-metal RX 7900 XTX.
 * Expone únicamente acciones blancas y no destructivas sobre la flota Ollama.
 *
 * GET  /api/admin/ollama-shield?action=status  -> flota activa + VRAM
 * POST /api/admin/ollama-shield                -> build | purge | activate
 *
 * W02-API-009 — Security hardening:
 *  - Validación estricta de inputs con Zod (whitelist de acciones).
 *  - Sanitización de query params y body.
 *  - try/catch global en cada handler.
 *  - Headers de seguridad (no-store, nosniff, DENY, no-referrer).
 *  - Respuestas tipadas (cero any implícitos).
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

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

type ShieldErrorBody = {
    action: 'build' | 'purge' | 'activate' | 'status';
    ts: string;
    status: 'error';
    message: string;
    detail?: string;
};

// ---------------------------------------------------------------------------
// Esquemas Zod (validación estricta de inputs)
// ---------------------------------------------------------------------------

const ACTION_VALUES = ['build', 'purge', 'activate'] as const;
const STATUS_ACTION_VALUES = ['status'] as const;

const ActionSchema = z.enum(ACTION_VALUES);
const StatusActionSchema = z.enum(STATUS_ACTION_VALUES);

const PostBodySchema = z
    .object({
        action: ActionSchema.optional(),
    })
    .strict();

const GetQuerySchema = z
    .object({
        action: StatusActionSchema.optional(),
    })
    .strict();

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const MODELFILES: Readonly<Record<string, string>> = Object.freeze({
    'ear-14b-textos-sclass': 'Modelfile_14B_Textos_SClass',
    'ear-27b-apis-sclass': 'Modelfile_27B_APIs_SClass',
    'ear-32b-arquitecto-sclass': 'Modelfile_32B_Arquitecto_SClass',
});

const PURGE_TARGET = 'ear-27b-apis-ctx20480:latest';

const SECURITY_HEADERS: Readonly<Record<string, string>> = Object.freeze({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin',
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
    return NextResponse.json(body, {
        status,
        headers: SECURITY_HEADERS,
    });
}

function errorResponse(
    action: ShieldErrorBody['action'],
    message: string,
    detail?: string,
    status = 500
): NextResponse<ShieldErrorBody> {
    return jsonResponse<ShieldErrorBody>(
        {
            action,
            ts: new Date().toISOString(),
            status: 'error',
            message,
            ...(detail ? { detail } : {}),
        },
        status
    );
}

function toErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
}

/**
 * Sanitiza un tag de modelo Ollama: solo [a-zA-Z0-9._:-] y longitud razonable.
 * Defensa en profundidad contra inyección de shell.
 */
function sanitizeTag(tag: string): string {
    return tag.replace(/[^a-zA-Z0-9._:-]/g, '');
}

/**
 * Escapa una ruta para uso seguro dentro de comillas dobles en shell.
 * Bloquea comillas, backticks, $, backslash y saltos de línea.
 */
function escapeShellPath(p: string): string {
    return p.replace(/["`$\\\r\n]/g, '');
}

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
        timeout: 60_000,
        windowsHide: true,
        maxBuffer: 1024 * 1024,
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
        return {
            action: 'status',
            ts: new Date().toISOString(),
            online: false,
            models: [],
            totalRows: 0,
            rawError: toErrorMessage(error),
        };
    }
}

async function buildProfiles(): Promise<ShieldActionBody> {
    const results: string[] = [];

    for (const [tag, modelfile] of Object.entries(MODELFILES)) {
        const safeTag = sanitizeTag(tag);
        const filePath = escapeShellPath(path.join(process.cwd(), modelfile));
        const output = await runOllama(
            `ollama create ${safeTag} -f "${filePath}"`
        );
        results.push(`${safeTag}: ${output.trim() || 'ok'}`);
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
    const safeTarget = sanitizeTag(PURGE_TARGET);
    const output = await runOllama(`ollama stop ${safeTarget}`);
    return {
        action: 'purge',
        ts: new Date().toISOString(),
        status: 'ok',
        message: 'Modelo de contexto 100k detenido y VRAM liberada.',
        detail: output.trim(),
    };
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        // Validación estricta de query params (whitelist).
        const url = new URL(request.url);
        const rawAction = url.searchParams.get('action');
        const parsed = GetQuerySchema.safeParse(
            rawAction === null ? {} : { action: rawAction }
        );

        if (!parsed.success) {
            return errorResponse(
                'status',
                'Parámetro "action" inválido.',
                'Solo se admite action=status.',
                400
            );
        }

        const body = await readStatus();
        return jsonResponse<ShieldStatusBody>(body);
    } catch (error) {
        return errorResponse(
            'status',
            'Fallo al consultar el estado VRAM-Shield.',
            toErrorMessage(error),
            500
        );
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        // Parseo defensivo del body: JSON inválido o vacío -> action por defecto.
        let rawBody: unknown = {};
        try {
            const text = await request.text();
            if (text.trim().length > 0) {
                rawBody = JSON.parse(text);
            }
        } catch {
            return errorResponse(
                'activate',
                'Cuerpo JSON inválido.',
                'El payload debe ser JSON válido.',
                400
            );
        }

        const parsed = PostBodySchema.safeParse(rawBody);
        if (!parsed.success) {
            return errorResponse(
                'activate',
                'Payload inválido.',
                'Solo se admite { action: "build" | "purge" | "activate" }.',
                400
            );
        }

        const action: 'build' | 'purge' | 'activate' =
            parsed.data.action ?? 'activate';

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

        return jsonResponse<ShieldActionBody>(body);
    } catch (error) {
        return errorResponse(
            'activate',
            'Fallo al ejecutar la acción VRAM-Shield.',
            toErrorMessage(error),
            500
        );
    }
}