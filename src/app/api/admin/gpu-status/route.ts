import { NextRequest, NextResponse } from 'next/server';
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

const SELECTABLE_MODELS: Array<{ id: GpuModelId; label: string; paramSize: string }> = [
    { id: 'qwen3.8-27b-fast:latest', label: 'Qwen3.8 27B FAST', paramSize: '27B' },
    { id: 'ear-32b-architect:latest', label: 'EAR-32B Architect', paramSize: '32B' },
    { id: 'ear-14b-speed:latest', label: 'EAR-14B Speed', paramSize: '14B' }
];

export async function GET(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const status = await probeGpu(2000);
    return NextResponse.json({
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
    });
}

export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    let body: { model?: unknown };
    try {
        body = (await req.json()) as { model?: unknown };
    } catch {
        return NextResponse.json({ ok: false, error: 'Cuerpo JSON requerido.' }, { status: 400 });
    }

    const model =
        typeof body?.model === 'string' && body.model.trim() ? body.model.trim() : 'qwen3.8-27b-fast:latest';

    const startedAt = Date.now();
    const preload = await preloadGpuModel(model);
    const status = await probeGpu(2000);

    return NextResponse.json({
        ok: preload.loaded,
        preload: {
            ...preload,
            latencyMs: Date.now() - startedAt
        },
        gpu: status
    });
}