/**
 * 🐋 DEEPSEEK INFERENCE ENGINE (S-CLASS v1.0)
 * ----------------------------------------------------------------------------
 * Motor de inferencia cloud basado en DeepSeek (OpenAI-compatible).
 * Objetivo: máxima resiliencia para demos y reuniones. DeepSeek actúa como
 * primario cuando `DEEPSEEK_API_KEY` está presente; si la API no responde,
 * el llamador cae con elegancia a la GPU local Qwen y, finalmente, al
 * compilador determinístico. Así el sistema NUNCA queda sin respuesta.
 *
 * DOCTRINA:
 *  - Sin clave -> devuelve `available: false` (el fallback decide).
 *  - Timeout corto (8s) para no bloquear jamás la UX de una demo.
 *  - Salida tipada estricta, cero 'any' implícito.
 * ----------------------------------------------------------------------------
 */

export type DeepSeekModel = 'deepseek-chat' | 'deepseek-reasoner';

export interface DeepSeekChatRequest {
    model?: DeepSeekModel;
    system?: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    json?: boolean;
    signal?: AbortSignal;
}

export interface DeepSeekChatResult {
    available: boolean;
    content: string;
    model: string;
    latencyMs: number;
    finishReason: string | null;
}

interface DeepSeekApiMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface DeepSeekApiResponse {
    choices?: Array<{
        message?: { role?: string; content?: string };
        finish_reason?: string | null;
    }>;
    model?: string;
}

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const DEFAULT_MODEL: DeepSeekModel = 'deepseek-chat';
const DEFAULT_TIMEOUT_MS = 8000;

export function isDeepSeekConfigured(): boolean {
    return Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.trim());
}

/**
 * Ejecuta una inferencia contra la API cloud de DeepSeek.
 * Devuelve `available: false` si no hay clave o la API no responde,
 * permitiendo al llamador aplicar el fallback GPU/determinístico.
 */
export async function runDeepSeekChat(req: DeepSeekChatRequest): Promise<DeepSeekChatResult> {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey || !apiKey.trim()) {
        return { available: false, content: '', model: 'unconfigured', latencyMs: 0, finishReason: null };
    }

    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    const abortHandler = () => controller.abort();
    req.signal?.addEventListener('abort', abortHandler, { once: true });

    const messages: DeepSeekApiMessage[] = [];
    if (req.system && req.system.trim()) {
        messages.push({ role: 'system', content: req.system.trim() });
    }
    messages.push({ role: 'user', content: req.prompt });

    const body: Record<string, unknown> = {
        model: req.model ?? DEFAULT_MODEL,
        messages,
        stream: false,
        temperature: req.temperature ?? 0.2,
        max_tokens: req.maxTokens ?? 2048
    };

    if (req.json) {
        body.response_format = { type: 'json_object' };
    }

    try {
        const res = await fetch(DEEPSEEK_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!res.ok) {
            return { available: false, content: '', model: 'deepseek-error', latencyMs: Date.now() - startedAt, finishReason: `http_${res.status}` };
        }

        const data = (await res.json()) as DeepSeekApiResponse;
        const content = data.choices?.[0]?.message?.content ?? '';

        return {
            available: content.length > 0,
            content,
            model: data.model ?? (body.model as string),
            latencyMs: Date.now() - startedAt,
            finishReason: data.choices?.[0]?.finish_reason ?? null
        };
    } catch {
        return { available: false, content: '', model: 'deepseek-timeout', latencyMs: Date.now() - startedAt, finishReason: null };
    } finally {
        clearTimeout(timeout);
        req.signal?.removeEventListener('abort', abortHandler);
    }
}