/**
 * ⚡ QWEN GPU INFERENCE ENGINE (S-CLASS v1.0)
 * ----------------------------------------------------------------------------
 * Motor único y blindado de inferencia sobre la AMD Radeon RX 7900 XTX (24 GB).
 * Objetivo: máxima velocidad en GPU (RDNA3) evitando offload a RAM y recargas
 * de VRAM. Toda la familia Qwen (2.5 / 3.8) de 14B, 27B y 32B se orquesta aquí.
 *
 * DOCTRINA:
 *  - num_gpu = 999 -> fuerza TODAS las capas a la GPU (nunca CPU/offload).
 *  - keep_alive  -> mantiene el modelo precargado en VRAM (cero cold-start).
 *  - num_ctx     -> ventana equilibrada por tamaño de modelo (24 GB de techo).
 *  - Timeout largo en el PRIMER token (carga de 16-19 GB), corto después.
 * ----------------------------------------------------------------------------
 */

export type GpuModelId =
    | 'ear-32b-architect:latest'
    | 'qwen3.8-27b-fast:latest'
    | 'ear-27b-flow:latest'
    | 'ear-14b-speed:latest'
    | 'qwen2.5-coder-32b-local:latest';

export interface GpuModelProfile {
    id: GpuModelId;
    label: string;
    family: string;
    role: string;
    paramSize: string;
    vramGB: number;
    /** Ventana de contexto fijada para no desbordar los 24 GB de VRAM. */
    numCtx: number;
    numPredict: number;
    temperature: number;
    topP: number;
    /** Indica si el modelo es el recomendado para razonamiento arquitectónico. */
    architectTier: boolean;
    /** True si es un modelo Qwen3 "thinking" que necesita think:false para emitir directo. */
    thinkingModel?: boolean;
}

/**
 * Registro canónico de modelos reales instalados en el host bare-metal.
 * Los perfiles reflejan `ollama list` y el Modelfile maestro.
 */
export const GPU_MODELS: Readonly<Record<GpuModelId, GpuModelProfile>> = {
    'ear-32b-architect:latest': {
        id: 'ear-32b-architect:latest',
        label: 'EAR-32B Architect',
        family: 'qwen2.5-coder (32B)',
        role: 'Arquitectura S-Class, contratos, razonamiento profundo y DAG',
        paramSize: '32B',
        vramGB: 19,
        numCtx: 16384,
        numPredict: 8192,
        temperature: 0.15,
        topP: 0.9,
        architectTier: true
    },
    'qwen2.5-coder-32b-local:latest': {
        id: 'qwen2.5-coder-32b-local:latest',
        label: 'Qwen2.5-Coder 32B',
        family: 'qwen2.5-coder (32B)',
        role: 'Generación de código explícita y refactors quirúrgicos',
        paramSize: '32B',
        vramGB: 19,
        numCtx: 16384,
        numPredict: 8192,
        temperature: 0.15,
        topP: 0.9,
        architectTier: true
    },
    'qwen3.8-27b-fast:latest': {
        id: 'qwen3.8-27b-fast:latest',
        label: 'Qwen3.8 27B FAST',
        family: 'qwen3.8 (27B)',
        role: 'Razonamiento rápido, elevación de prompt y clasificación semántica',
        paramSize: '27B',
        vramGB: 16,
        numCtx: 20480,
        numPredict: 4096,
        temperature: 0.2,
        topP: 0.9,
        architectTier: false,
        thinkingModel: true
    },
    'ear-27b-flow:latest': {
        id: 'ear-27b-flow:latest',
        label: 'EAR-27B Flow',
        family: 'qwen2.5 (27B)',
        role: 'APIs, lógica intermedia, endpoints y scaffolds',
        paramSize: '27B',
        vramGB: 16,
        numCtx: 20480,
        numPredict: 4096,
        temperature: 0.2,
        topP: 0.9,
        architectTier: false
    },
    'ear-14b-speed:latest': {
        id: 'ear-14b-speed:latest',
        label: 'EAR-14B Speed',
        family: 'qwen2.5 (14B)',
        role: 'Redacción, títulos, copys y micro-cambios ultrarrápidos',
        paramSize: '14B',
        vramGB: 9,
        numCtx: 16384,
        numPredict: 2048,
        temperature: 0.3,
        topP: 0.95,
        architectTier: false
    }
};

export const GPU_MODEL_ORDER: readonly GpuModelId[] = [
    'ear-32b-architect:latest',
    'qwen3.8-27b-fast:latest',
    'ear-27b-flow:latest',
    'ear-14b-speed:latest'
];

/** Modelo por defecto: el 27B 3.8 es el sweet-spot velocidad/razonamiento. */
export const DEFAULT_GPU_MODEL: GpuModelId = 'qwen3.8-27b-fast:latest';

/** Modelo recomendado para forjar prompt maestro / arquitectura profunda. */
export const ARCHITECT_GPU_MODEL: GpuModelId = 'ear-32b-architect:latest';

/**
 * Alias de tags reales visibles en `ollama list`. Diferentes tags del mismo
 * checkpoint (32B/27B/14B) se resuelven a su perfil canónico.
 */
const GPU_MODEL_ALIASES: Readonly<Record<string, GpuModelId>> = {
    'ear-32b-arquitectura-ctx20480:latest': 'ear-32b-architect:latest',
    'ear-27b-apis-ctx20480:latest': 'ear-27b-flow:latest',
    'ear-14b-textos-ctx16384:latest': 'ear-14b-speed:latest',
    'qwen2.5-coder-14b-local:latest': 'ear-14b-speed:latest'
};

/**
 * Resuelve el ID REAL que debe enviarse a Ollama para la inferencia,
 * respetando el modelo solicitado por el CEO (corrige el bug de usar
 * siempre el perfil canónico e ignorar la selección).
 */
export function resolveGpuModelId(id?: string | null): GpuModelId | string {
    if (!id) return DEFAULT_GPU_MODEL;
    if (id in GPU_MODEL_ALIASES) return GPU_MODEL_ALIASES[id];
    if (id in GPU_MODELS) return id as GpuModelId;
    const lower = id.toLowerCase();
    if (lower.includes('32b')) return ARCHITECT_GPU_MODEL;
    if (lower.includes('27b')) return DEFAULT_GPU_MODEL;
    if (lower.includes('14b')) return 'ear-14b-speed:latest';
    return DEFAULT_GPU_MODEL;
}

export function resolveGpuModel(id?: string | null): GpuModelProfile {
    const key = resolveGpuModelId(id);
    if (typeof key === 'string' && key in GPU_MODELS) {
        return GPU_MODELS[key as GpuModelId];
    }
    return GPU_MODELS[DEFAULT_GPU_MODEL];
}

export function getOllamaHost(): string {
    return (
        process.env.OLLAMA_HOST ||
        process.env.OLLAMA_URL ||
        process.env.OLLAMA_ENDPOINT ||
        'http://127.0.0.1:11434'
    );
}

export interface GpuChatRequest {
    model: GpuModelId | string;
    prompt: string;
    system?: string;
    temperature?: number;
    numCtx?: number;
    numPredict?: number;
    /** Si es true, fuerza salida JSON válida (format: 'json'). */
    json?: boolean;
    /** Si es false, desactiva el modo thinking en modelos Qwen3. */
    think?: boolean;
    /** Tiempo de vida del modelo en VRAM tras la inferencia (ej. '30m'). */
    keepAlive?: string;
    signal?: AbortSignal;
}

export interface GpuChatResult {
    content: string;
    model: string;
    latencyMs: number;
    evalCount: number;
    tokensPerSecond: number;
    loadedOnGpu: boolean;
}

interface OllamaChatResponse {
    message?: { content?: string; thinking?: string };
    model?: string;
    eval_count?: number;
    eval_duration?: number;
    total_duration?: number;
}

/**
 * Ejecuta una inferencia completa en GPU con parámetros RDNA3 optimizados.
 * Fuerza num_gpu=999 (todas las capas a VRAM) y keep_alive para precarga.
 */
export async function runGpuChat(req: GpuChatRequest): Promise<GpuChatResult> {
    const profile = resolveGpuModel(req.model);
    const host = getOllamaHost();
    const startedAt = Date.now();

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
    if (req.system && req.system.trim()) {
        messages.push({ role: 'system', content: req.system.trim() });
    }
    messages.push({ role: 'user', content: req.prompt });

    const body: Record<string, unknown> = {
        model: resolveGpuModelId(req.model),
        messages,
        stream: false,
        keep_alive: req.keepAlive ?? '30m',
        options: {
            // Fuerza acelereación GPU completa: nunca offload a RAM en RDNA3.
            num_gpu: 999,
            num_ctx: req.numCtx ?? profile.numCtx,
            num_predict: req.numPredict ?? profile.numPredict,
            temperature: req.temperature ?? profile.temperature,
            top_p: profile.topP
        }
    };

    if (req.json) {
        body.format = 'json';
    }

    // Modelos Qwen3 "thinking": con think:false emiten directamente el contenido,
    // evitando que el razonamiento interno consuma todos los tokens de generación.
    if (profile.thinkingModel) {
        body.think = req.think ?? false;
    }

    const res = await fetch(`${host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: req.signal
    });

    if (!res.ok) {
        throw new Error(`Ollama respondió HTTP ${res.status} para ${profile.id}`);
    }

    const data = (await res.json()) as OllamaChatResponse;
    const latencyMs = Date.now() - startedAt;
    const evalCount = data.eval_count ?? 0;
    const evalSeconds = (data.eval_duration ?? 0) / 1e9;
    const tokensPerSecond = evalSeconds > 0 ? Math.round(evalCount / evalSeconds) : 0;

    return {
        content: data.message?.content ?? data.message?.thinking ?? '',
        model: data.model ?? profile.id,
        latencyMs,
        evalCount,
        tokensPerSecond,
        loadedOnGpu: true
    };
}

/**
 * Precarga un modelo en VRAM con una llamada mínima (num_predict=1).
 * Elimina el cold-start de 20-40s en el primer uso real.
 */
export async function preloadGpuModel(
    model: GpuModelId | string,
    signal?: AbortSignal
): Promise<{ loaded: boolean; model: string; latencyMs: number }> {
    const profile = resolveGpuModel(model);
    const host = getOllamaHost();
    const startedAt = Date.now();

    try {
        const res = await fetch(`${host}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: resolveGpuModelId(model),
                prompt: 'ok',
                stream: false,
                keep_alive: '30m',
                options: { num_gpu: 999, num_ctx: profile.numCtx, num_predict: 1 }
            }),
            signal
        });
        return { loaded: res.ok, model: profile.id, latencyMs: Date.now() - startedAt };
    } catch {
        return { loaded: false, model: profile.id, latencyMs: Date.now() - startedAt };
    }
}

export interface GpuLoadedModel {
    name: string;
    vramMB: number;
    contextSize: number;
}

export interface GpuStatus {
    online: boolean;
    loadedModels: GpuLoadedModel[];
    usedVramMB: number;
    totalVramMB: number;
    freeVramMB: number;
}

/**
 * Sondea el estado real de la GPU vía /api/ps (modelos cargados + VRAM).
 */
export async function probeGpu(timeoutMs = 1500): Promise<GpuStatus> {
    const host = getOllamaHost();
    const totalVramMB = 24576;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${host}/api/ps`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) {
            return { online: false, loadedModels: [], usedVramMB: 0, totalVramMB, freeVramMB: totalVramMB };
        }
        const data = (await res.json()) as {
            models?: Array<{ name?: string; size_vram?: number; size?: number; context_size?: number }>;
        };
        let used = 0;
        const loadedModels: GpuLoadedModel[] = (data.models ?? []).map((m) => {
            const vramMB = Math.round(((m.size_vram ?? m.size ?? 0) as number) / (1024 * 1024));
            used += vramMB;
            return {
                name: m.name ?? 'desconocido',
                vramMB,
                contextSize: m.context_size ?? 0
            };
        });
        return {
            online: true,
            loadedModels,
            usedVramMB: used,
            totalVramMB,
            freeVramMB: Math.max(0, totalVramMB - used)
        };
    } catch {
        clearTimeout(timeoutId);
        return { online: false, loadedModels: [], usedVramMB: 0, totalVramMB, freeVramMB: totalVramMB };
    }
}

/**
 * Extrae un objeto JSON de una respuesta de texto libre del modelo.
 * Defensa en profundidad: intenta parseo directo y luego regex acotada.
 */
export function extractJsonObject<T>(raw: string): T | null {
    const trimmed = raw.trim();
    const direct = tryParse<T>(trimmed);
    if (direct) return direct;

    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
        const fromFence = tryParse<T>(fenced[1].trim());
        if (fromFence) return fromFence;
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        return tryParse<T>(trimmed.slice(firstBrace, lastBrace + 1));
    }
    return null;
}

function tryParse<T>(value: string): T | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}
