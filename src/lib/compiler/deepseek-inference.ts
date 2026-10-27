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
    /**
     * Turnos previos del hilo en orden cronológico (multi-turno real).
     * Permite al modelo recordar lo dicho minutos atrás en la misma conversación.
     */
    history?: ReadonlyArray<{ role: 'user' | 'assistant'; content: string }>;
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

interface DeepSeekApiChoice {
    message?: { role?: string; content?: string };
    finish_reason?: string | null;
}

interface DeepSeekApiResponse {
    choices?: DeepSeekApiChoice[];
    model?: string;
}

interface DeepSeekRequestBody {
    model: DeepSeekModel;
    messages: DeepSeekApiMessage[];
    stream: false;
    temperature: number;
    max_tokens: number;
    response_format?: { type: 'json_object' };
}

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const DEFAULT_MODEL: DeepSeekModel = 'deepseek-chat';
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_TOKENS = 2048;

export function isDeepSeekConfigured(): boolean {
    const key = process.env.DEEPSEEK_API_KEY;
    return typeof key === 'string' && key.trim().length > 0;
}

/**
 * Ejecuta una inferencia contra la API cloud de DeepSeek.
 * Devuelve `available: false` si no hay clave o la API no responde,
 * permitiendo al llamador aplicar el fallback GPU/determinístico.
 */
export async function runDeepSeekChat(req: DeepSeekChatRequest): Promise<DeepSeekChatResult> {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
        return {
            available: false,
            content: '',
            model: 'unconfigured',
            latencyMs: 0,
            finishReason: null
        };
    }

    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    const abortHandler = (): void => controller.abort();
    req.signal?.addEventListener('abort', abortHandler, { once: true });

    const messages: DeepSeekApiMessage[] = [];
    if (typeof req.system === 'string' && req.system.trim().length > 0) {
        messages.push({ role: 'system', content: req.system.trim() });
    }
    if (Array.isArray(req.history)) {
        for (const turn of req.history) {
            const content = typeof turn.content === 'string' ? turn.content.trim().slice(0, 4000) : '';
            if (content.length === 0) continue;
            if (turn.role !== 'user' && turn.role !== 'assistant') continue;
            messages.push({ role: turn.role, content });
        }
    }
    messages.push({ role: 'user', content: req.prompt });

    const selectedModel: DeepSeekModel = req.model ?? DEFAULT_MODEL;

    const body: DeepSeekRequestBody = {
        model: selectedModel,
        messages,
        stream: false,
        temperature: req.temperature ?? DEFAULT_TEMPERATURE,
        max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS
    };

    if (req.json === true) {
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
            return {
                available: false,
                content: '',
                model: 'deepseek-error',
                latencyMs: Date.now() - startedAt,
                finishReason: `http_${res.status}`
            };
        }

        const data = (await res.json()) as DeepSeekApiResponse;
        const firstChoice: DeepSeekApiChoice | undefined = data.choices?.[0];
        const content: string = firstChoice?.message?.content ?? '';

        return {
            available: content.length > 0,
            content,
            model: data.model ?? selectedModel,
            latencyMs: Date.now() - startedAt,
            finishReason: firstChoice?.finish_reason ?? null
        };
    } catch {
        return {
            available: false,
            content: '',
            model: 'deepseek-timeout',
            latencyMs: Date.now() - startedAt,
            finishReason: null
        };
    } finally {
        clearTimeout(timeout);
        req.signal?.removeEventListener('abort', abortHandler);
    }
}

/* ==================================================================== */
/* SEARCH & FETCH API — GROUNDING WEB EN VIVO (S-CLASS)                  */
/* ==================================================================== */
/**
 * Endpoints oficiales verificados en https://api-docs.deepseek.com/guides/search
 *   POST https://api.deepseek.com/v1/tools/search
 *   POST https://api.deepseek.com/v1/tools/fetch
 *
 * DOCTRINA:
 *  - Misma autenticación Bearer que el resto de la API.
 *  - Facturación: 0,75 $/1.000 peticiones EXITOSAS (las fallidas no se cobran).
 *    Por eso `available: true` solo cuando hay resultados/contenido real.
 *  - QPS de cuenta: Search 100 · Fetch 25. El 429 se propaga como `rate_limited`.
 *  - NUNCA lanza excepción al llamador: devuelve un sobre tipado (fail-open).
 */

const DEEPSEEK_TOOLS_BASE = 'https://api.deepseek.com/v1/tools';
const DEFAULT_SEARCH_TIMEOUT_MS = 6000;
const DEFAULT_FETCH_TIMEOUT_MS = 12000;
const MAX_SEARCH_QUERY_CHARS = 128;
const MAX_FETCH_URL_CHARS = 8192;
const MAX_FETCH_CONTENT_CHARS = 6000;
const MAX_SEARCH_COUNT = 50;
const MIN_SEARCH_COUNT = 1;

export type DeepSeekToolsFailure =
    | 'unconfigured'
    | 'invalid_query'
    | 'invalid_url'
    | 'insufficient_balance'
    | 'rate_limited'
    | 'blocked_by_policy'
    | 'no_content'
    | 'invalid_request'
    | 'timeout'
    | 'network_error'
    | `http_${number}`;

/** Un resultado individual del Search API. */
export interface DeepSeekSearchResult {
    readonly title: string;
    readonly url: string;
    readonly summary: string;
    /** Markdown de la página; cadena vacía salvo que `needContent` sea true. */
    readonly content: string;
}

export interface DeepSeekSearchResponse {
    /** true solo si hay al menos un resultado (único caso facturable). */
    readonly available: boolean;
    readonly reason: DeepSeekToolsFailure | null;
    readonly results: readonly DeepSeekSearchResult[];
    readonly latencyMs: number;
}

export interface DeepSeekFetchResponse {
    readonly available: boolean;
    readonly reason: DeepSeekToolsFailure | null;
    readonly title: string;
    readonly content: string;
    readonly latencyMs: number;
}

export interface DeepSeekSearchOptions {
    readonly count?: number;
    readonly needContent?: boolean;
    readonly oriQuestion?: string;
    readonly timeoutMs?: number;
    readonly signal?: AbortSignal;
}

interface DeepSeekApiErrorBody {
    error?: { message?: string; type?: string; code?: string };
}

/* ── Internos ──────────────────────────────────────────────────────────── */

function toolsApiKey(): string | null {
    const key = process.env.DEEPSEEK_API_KEY;
    return typeof key === 'string' && key.trim().length > 0 ? key.trim() : null;
}

function mapHttpStatus(status: number): DeepSeekToolsFailure {
    if (status === 402) return 'insufficient_balance';
    if (status === 403) return 'blocked_by_policy';
    if (status === 404) return 'no_content';
    if (status === 429) return 'rate_limited';
    if (status === 400) return 'invalid_request';
    return `http_${status}`;
}

/** POST autenticado a los endpoints de tools con timeout y sin excepciones. */
async function postDeepSeekTool(
    endpoint: 'search' | 'fetch',
    body: Readonly<Record<string, unknown>>,
    timeoutMs: number,
    externalSignal?: AbortSignal,
): Promise<{ ok: true; data: unknown } | { ok: false; reason: DeepSeekToolsFailure }> {
    const apiKey = toolsApiKey();
    if (apiKey === null) return { ok: false, reason: 'unconfigured' };

    const controller = new AbortController();
    const timer: ReturnType<typeof setTimeout> = setTimeout((): void => controller.abort(), timeoutMs);
    const abortHandler = (): void => controller.abort();
    externalSignal?.addEventListener('abort', abortHandler, { once: true });

    try {
        const res = await fetch(`${DEEPSEEK_TOOLS_BASE}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!res.ok) {
            return { ok: false, reason: mapHttpStatus(res.status) };
        }

        const data: unknown = await res.json();
        return { ok: true, data };
    } catch {
        // Abort programado => timeout; el resto => error de red. Ambos fail-open.
        return { ok: false, reason: controller.signal.aborted ? 'timeout' : 'network_error' };
    } finally {
        clearTimeout(timer);
        externalSignal?.removeEventListener('abort', abortHandler);
    }
}

/** Valida la query conforme al contrato oficial (1-128 caracteres, no vacía). */
export function isValidSearchQuery(query: unknown): query is string {
    if (typeof query !== 'string') return false;
    const trimmed = query.trim();
    return trimmed.length >= 1 && trimmed.length <= MAX_SEARCH_QUERY_CHARS;
}

/** Error normalizado del cuerpo de error (OpenAI-compatible) para logs forenses. */
export function describeDeepSeekError(body: unknown): string {
    const parsed = (body ?? {}) as DeepSeekApiErrorBody;
    const message = parsed.error?.message;
    return typeof message === 'string' ? message : 'error desconocido';
}

/* ── Search ────────────────────────────────────────────────────────────── */

/**
 * Busca en la web viva y devuelve resultados estructurados (título, URL,
 * resumen y, opcionalmente, el contenido en Markdown de cada página).
 */
export async function searchWebDeepSeek(
    query: string,
    options: DeepSeekSearchOptions = {},
): Promise<DeepSeekSearchResponse> {
    const startedAt = Date.now();

    if (!isValidSearchQuery(query)) {
        return { available: false, reason: 'invalid_query', results: [], latencyMs: 0 };
    }

    const requested: number = options.count ?? 5;
    const count: number = Math.min(MAX_SEARCH_COUNT, Math.max(MIN_SEARCH_COUNT, Math.trunc(requested)));

    const payload: Record<string, unknown> = {
        query: query.trim(),
        count,
        need_content: options.needContent === true,
    };
    if (typeof options.oriQuestion === 'string' && isValidSearchQuery(options.oriQuestion)) {
        payload.ori_question = options.oriQuestion.trim();
    }

    const response = await postDeepSeekTool(
        'search',
        payload,
        options.timeoutMs ?? DEFAULT_SEARCH_TIMEOUT_MS,
        options.signal,
    );

    if (!response.ok) {
        return { available: false, reason: response.reason, results: [], latencyMs: Date.now() - startedAt };
    }

    const rawResults: unknown = (response.data as { results?: unknown } | null)?.results;
    if (!Array.isArray(rawResults)) {
        return { available: false, reason: 'no_content', results: [], latencyMs: Date.now() - startedAt };
    }

    const results: DeepSeekSearchResult[] = [];
    for (const item of rawResults as unknown[]) {
        if (!item || typeof item !== 'object') continue;
        const record = item as { title?: unknown; url?: unknown; summary?: unknown; content?: unknown };
        const url = typeof record.url === 'string' ? record.url : '';
        if (url.length === 0) continue; // Sin URL no hay provenance: se descarta.
        results.push({
            title: typeof record.title === 'string' ? record.title : '',
            url,
            summary: typeof record.summary === 'string' ? record.summary : '',
            content: typeof record.content === 'string' ? record.content : '',
        });
    }

    return {
        available: results.length > 0,
        reason: results.length > 0 ? null : 'no_content',
        results,
        latencyMs: Date.now() - startedAt,
    };
}

/* ── Fetch ─────────────────────────────────────────────────────────────── */

/**
 * Descarga una página y la devuelve como Markdown limpio para el LLM.
 * El contenido se recorta a `MAX_FETCH_CONTENT_CHARS` para proteger la ventana
 * de contexto: una página real puede superar los 100 KB de Markdown.
 */
export async function fetchWebDeepSeek(
    url: string,
    timeoutMs: number = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<DeepSeekFetchResponse> {
    const startedAt = Date.now();

    if (typeof url !== 'string' || url.length === 0 || url.length > MAX_FETCH_URL_CHARS) {
        return { available: false, reason: 'invalid_url', title: '', content: '', latencyMs: 0 };
    }

    const response = await postDeepSeekTool('fetch', { url }, timeoutMs);
    if (!response.ok) {
        return {
            available: false,
            reason: response.reason,
            title: '',
            content: '',
            latencyMs: Date.now() - startedAt,
        };
    }

    const record = (response.data ?? {}) as { title?: unknown; content?: unknown };
    const title: string = typeof record.title === 'string' ? record.title : '';
    const content: string = typeof record.content === 'string' ? record.content : '';

    return {
        available: content.trim().length > 0,
        reason: content.trim().length > 0 ? null : 'no_content',
        title,
        content: content.slice(0, MAX_FETCH_CONTENT_CHARS),
        latencyMs: Date.now() - startedAt,
    };
}

/** ¿Hay clave configurada para los endpoints de Search & Fetch? */
export function isDeepSeekToolsConfigured(): boolean {
    return toolsApiKey() !== null;
}
