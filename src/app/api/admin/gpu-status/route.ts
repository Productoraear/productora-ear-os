import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';
import {
    probeGpu,
    preloadGpuModel,
    GPU_MODELS,
    type GpuModelId
} from '@/lib/compiler/qwen-gpu-inference';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * ⚡ TELEMETRÍA REAL DE LA GPU + PRECARGA DE MODELOS (Bare-Metal RX 7900 XTX)
 * ----------------------------------------------------------------------------
 * GET  -> /api/admin/gpu-status
 *   Devuelve el estado vivo de VRAM y qué modelos están precargados en VRAM.
 * POST -> { model } para precargar un modelo y eliminar el cold-start (20-40s)
 *   antes de la primera compilación. Mantiene el modelo en VRAM vía keep_alive.
 * ----------------------------------------------------------------------------
 */

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin'
};

const DEFAULT_MODEL_ID: GpuModelId = 'qwen3.8-27b-fast:latest';

const SELECTABLE_MODELS: ReadonlyArray<{ id: GpuModelId; label: string; paramSize: string }> = [
    { id: 'qwen3.8-27b-fast:latest', label: 'Qwen3.8 27B FAST', paramSize: '27B' },
    { id: 'ear-32b-architect:latest', label: 'EAR-32B Architect', paramSize: '32B' },
    { id: 'ear-14b-speed:latest', label: 'EAR-14B Speed', paramSize: '14B' }
];

const VALID_MODEL_IDS: ReadonlySet<string> = new Set(
    Object.values(GPU_MODELS).map((m) => m.id as string)
);

const PreloadBodySchema = z
    .object({
        model: z
            .string()
            .trim()
            .min(1, 'model no puede estar vacío')
            .max(128, 'model excede longitud máxima')
            .regex(/^[a-zA-Z0-9._:\-]+$/, 'model contiene caracteres inválidos')
            .optional()
    })
    .strict();

type PreloadBody = z.infer<typeof PreloadBodySchema>;

interface GpuStatusResponse {
    ok: true;
    endpoint: '/api/admin/gpu-status';
    gpu: Awaited<ReturnType<typeof probeGpu>>;
    selectableModels: ReadonlyArray<{ id: GpuModelId; label: string; paramSize: string }>;
    allModels: ReadonlyArray<{
        id: GpuModelId;
        label: string;
        paramSize: string;
        numCtx: number;
        role: string;
    }>;
}

interface PreloadResponse {
    ok: boolean;
    preload: Awaited<ReturnType<typeof preloadGpuModel>> & { latencyMs: number };
    gpu: Awaited<ReturnType<typeof probeGpu>>;
}

interface ErrorResponse {
    ok: false;
    error: string;
    details?: unknown;
}

function jsonResponse<T extends object>(
    payload: T,
    init?: { status?: number }
): NextResponse<T> {
    return NextResponse.json<T>(payload, {
        status: init?.status ?? 200,
        headers: SECURITY_HEADERS
    });
}

function errorResponse(
    message: string,
    status: number,
    details?: unknown
): NextResponse<ErrorResponse> {
    const payload: ErrorResponse = details === undefined
        ? { ok: false, error: message }
        : { ok: false, error: message, details };
    return jsonResponse(payload, { status });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        const status = await probeGpu(2000);

        const payload: GpuStatusResponse = {
            ok: true,
            endpoint: '/api/admin/gpu-status',
            gpu: status,
            selectableModels: SELECTABLE_MODELS,
            allModels: Object.values(GPU_MODELS).map((m) => ({
                id: m.id,
                label: m.label,
                paramSize: m.paramSize,
                numCtx: m.numCtx,
                role: m.role
            }))
        };

        return jsonResponse(payload);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido en GET gpu-status';
        return errorResponse(message, 500);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const auth = await requireAdmin(req);
        if (!auth.ok) return auth.response;

        let rawBody: unknown;
        try {
            rawBody = await req.json();
        } catch {
            return errorResponse('Cuerpo JSON requerido.', 400);
        }

        const parsed = PreloadBodySchema.safeParse(rawBody);
        if (!parsed.success) {
            return errorResponse(
                'Payload inválido.',
                400,
                parsed.error.flatten().fieldErrors
            );
        }

        const body: PreloadBody = parsed.data;
        const requestedModel = body.model ?? DEFAULT_MODEL_ID;

        if (!VALID_MODEL_IDS.has(requestedModel)) {
            return errorResponse(
                `Modelo no soportado: ${requestedModel}`,
                400,
                { allowed: Array.from(VALID_MODEL_IDS) }
            );
        }

        const model = requestedModel as GpuModelId;
        const startedAt = Date.now();
        const preload = await preloadGpuModel(model);
        const status = await probeGpu(2000);

        const payload: PreloadResponse = {
            ok: preload.loaded,
            preload: {
                ...preload,
                latencyMs: Date.now() - startedAt
            },
            gpu: status
        };

        return jsonResponse(payload, { status: preload.loaded ? 200 : 503 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido en POST gpu-status';
        return errorResponse(message, 500);
    }
}