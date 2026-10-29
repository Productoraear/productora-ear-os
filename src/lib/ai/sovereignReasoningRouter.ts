/**
 * ══════════════════════════════════════════════════════════════════════════════
 * Ω-SOVEREIGN REASONING ROUTER — cascada de inferencia con provenance
 * ══════════════════════════════════════════════════════════════════════════════
 * NO sustituye motores existentes: los ORDENA. Reutiliza
 *   · `runDeepSeekChat`  (src/lib/compiler/deepseek-inference.ts)  → nube
 *   · `callAbacusLLM`    (src/lib/ai/abacusRouteLLM.ts)            → Claude 3.5
 *   · Ollama local       (OLLAMA_HOST, por defecto :11434)         → VRAM propia
 *
 * Cascada: deepseek → abacus-claude → ollama-local → deterministic(notice)
 * Garantías:
 *   · Cada intento queda registrado con latencia y motivo (auditoría real).
 *   · El resultado viaja con `provenance` SHA-256: quién respondió, con qué
 *     modelo y con qué contenido. Sin provenance no hay caso de estudio.
 *   · `allowCloud: false` corta TODA salida a Internet (RGPD / modo demo).
 *   · Cero precios, comisiones o teléfonos embebidos: el prompt obliga a leer
 *     el SSOT. Hardcodear cifras aquí sería violar el Veto §11.1.
 *
 * ⚠️ MÓDULO SERVER-ONLY (`node:crypto`). Jamás importar desde un componente
 * con 'use client': se consume desde route handlers o Server Actions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createHash } from 'node:crypto';
import {
  isDeepSeekConfigured,
  runDeepSeekChat,
} from '@/lib/compiler/deepseek-inference';
import {
  ABACUS_MODELS,
  callAbacusLLM,
  type AbacusChatMessage,
} from '@/lib/ai/abacusRouteLLM';

export type ReasoningProvider =
  | 'deepseek'
  | 'abacus-claude'
  | 'ollama-local'
  | 'deterministic';

export interface ReasoningTurn {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export interface ReasoningRequest {
  readonly prompt: string;
  readonly system?: string;
  readonly history?: ReadonlyArray<ReasoningTurn>;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly signal?: AbortSignal;
  /** `false` prohíbe salir a la nube. Por defecto `true`. */
  readonly allowCloud?: boolean;
}

export interface ReasoningAttempt {
  readonly provider: ReasoningProvider;
  readonly ok: boolean;
  readonly latencyMs: number;
  readonly detail: string;
}

export interface ReasoningResult {
  readonly ok: boolean;
  readonly content: string;
  readonly provider: ReasoningProvider;
  readonly model: string;
  readonly latencyMs: number;
  readonly attempts: ReadonlyArray<ReasoningAttempt>;
  readonly provenance: string;
  /** `true` si se usó un escalón inferior al primario. */
  readonly degraded: boolean;
}

export interface ReasoningStackStatus {
  readonly deepseek: boolean;
  readonly abacus: boolean;
  readonly ollamaHost: string;
  readonly ollamaModel: string;
}

const ABACUS_TIMEOUT_MS = 9000;
const OLLAMA_TIMEOUT_MS = 9000;
const DEFAULT_TEMPERATURE = 0.3;
const DEFAULT_MAX_TOKENS = 1024;

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:latest';

/**
 * Preámbulo soberano. No contiene cifras a propósito: cualquier número debe
 * salir del SSOT verificado por SHA-256, nunca del modelo.
 */
const SOVEREIGN_SYSTEM_FALLBACK =
  'Operas dentro de EAR OS. No inventes precios, comisiones, depósitos, ' +
  'teléfonos ni disponibilidad: esos datos proceden exclusivamente del SSOT ' +
  'del sistema. Si no tienes el dato, dilo con claridad y ofrece el canal oficial.';

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'unknown-error';
  }
}

function hashProvenance(parts: ReadonlyArray<string>): string {
  const digest = createHash('sha256');
  for (const part of parts) digest.update(part);
  return digest.digest('hex').slice(0, 32);
}

export function isAbacusConfigured(): boolean {
  const key = process.env.ABACUS_API_KEY;
  return typeof key === 'string' && key.trim().length > 0;
}

/** Estado del stack para paneles de telemetría admin. */
export function describeReasoningStack(): ReasoningStackStatus {
  return {
    deepseek: isDeepSeekConfigured(),
    abacus: isAbacusConfigured(),
    ollamaHost: OLLAMA_HOST,
    ollamaModel: OLLAMA_MODEL,
  };
}

interface OllamaGenerateResponse {
  readonly response?: unknown;
  readonly model?: unknown;
  readonly error?: unknown;
}

interface OllamaCallOutcome {
  readonly ok: boolean;
  readonly content: string;
  readonly model: string;
  readonly detail: string;
}

/**
 * Inferencia en la GPU local (RX 7900 XTX, 24 GB). Se ejecuta también cuando
 * `allowCloud` es `false`: es el único proveedor que no sale a Internet.
 */
async function runOllamaLocal(
  prompt: string,
  system: string,
  temperature: number,
  maxTokens: number,
  externalSignal?: AbortSignal,
): Promise<OllamaCallOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
  const forwardAbort = (): void => controller.abort();
  externalSignal?.addEventListener('abort', forwardAbort, { once: true });

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        system,
        stream: false,
        options: { temperature, num_predict: maxTokens },
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        content: '',
        model: OLLAMA_MODEL,
        detail: `http-${response.status}`,
      };
    }

    const raw: unknown = await response.json();
    const record: OllamaGenerateResponse =
      typeof raw === 'object' && raw !== null ? (raw as OllamaGenerateResponse) : {};

    const content = typeof record.response === 'string' ? record.response.trim() : '';
    const model = typeof record.model === 'string' ? record.model : OLLAMA_MODEL;
    const errorDetail = typeof record.error === 'string' ? record.error : '';
    const detail = content.length > 0 ? 'ok' : errorDetail || 'empty-completion';

    return { ok: content.length > 0, content, model, detail };
  } catch (error) {
    return {
      ok: false,
      content: '',
      model: OLLAMA_MODEL,
      detail: toErrorMessage(error),
    };
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', forwardAbort);
  }
}

/**
 * Carrera contra reloj. `callAbacusLLM` no acepta `AbortSignal`, así que la
 * petición subyacente puede seguir viva en segundo plano; lo que SÍ garantiza
 * esto es que la cascada del usuario nunca queda bloqueada por un proveedor
 * mudo. La latencia real queda registrada en `attempts`.
 */
async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const guard = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label}-timeout-${timeoutMs}ms`)),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([operation, guard]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

function buildResult(
  provider: Exclude<ReasoningProvider, 'deterministic'>,
  model: string,
  content: string,
  startedAt: number,
  attempts: ReadonlyArray<ReasoningAttempt>,
): ReasoningResult {
  return {
    ok: true,
    content,
    provider,
    model,
    latencyMs: Date.now() - startedAt,
    attempts,
    provenance: hashProvenance([provider, model, content, String(attempts.length)]),
    degraded: provider !== 'deepseek',
  };
}

/**
 * Ejecuta la cascada completa. Nunca lanza: toda excepción se convierte en un
 * intento fallido y se continúa al escalón siguiente.
 */
export async function runSovereignReasoning(
  request: ReasoningRequest,
): Promise<ReasoningResult> {
  const startedAt = Date.now();
  const attempts: ReasoningAttempt[] = [];

  const prompt = request.prompt.trim();
  const allowCloud = request.allowCloud !== false;
  const temperature = request.temperature ?? DEFAULT_TEMPERATURE;
  const maxTokens = request.maxTokens ?? DEFAULT_MAX_TOKENS;
  const system = request.system?.trim() || SOVEREIGN_SYSTEM_FALLBACK;

  if (prompt.length === 0) {
    return {
      ok: false,
      content: '',
      provider: 'deterministic',
      model: 'none',
      latencyMs: 0,
      attempts: [
        { provider: 'deterministic', ok: false, latencyMs: 0, detail: 'empty-prompt' },
      ],
      provenance: hashProvenance(['empty-prompt']),
      degraded: true,
    };
  }

  // ── Escalón 1: DeepSeek (primario cloud) ─────────────────────────────────
  if (allowCloud && isDeepSeekConfigured()) {
    const attemptStart = Date.now();
    try {
      const outcome = await runDeepSeekChat({
        system,
        prompt,
        history: request.history,
        temperature,
        maxTokens,
        signal: request.signal,
      });
      const content = outcome.content.trim();
      const ok = outcome.available && content.length > 0;

      attempts.push({
        provider: 'deepseek',
        ok,
        latencyMs: Date.now() - attemptStart,
        detail: ok ? (outcome.finishReason ?? 'ok') : 'unavailable',
      });

      if (ok) {
        return buildResult('deepseek', outcome.model, content, startedAt, attempts);
      }
    } catch (error) {
      attempts.push({
        provider: 'deepseek',
        ok: false,
        latencyMs: Date.now() - attemptStart,
        detail: toErrorMessage(error),
      });
    }
  } else {
    attempts.push({
      provider: 'deepseek',
      ok: false,
      latencyMs: 0,
      detail: allowCloud ? 'not-configured' : 'cloud-disabled',
    });
  }

  // ── Escalón 2: Claude 3.5 Sonnet vía Abacus RouteLLM ─────────────────────
  if (allowCloud && isAbacusConfigured()) {
    const attemptStart = Date.now();
    try {
      const messages: AbacusChatMessage[] = [
        { role: 'system', content: system },
        ...(request.history ?? []).map(
          (turn): AbacusChatMessage => ({ role: turn.role, content: turn.content }),
        ),
        { role: 'user', content: prompt },
      ];

      const outcome = await withTimeout(
        callAbacusLLM(messages, {
          model: ABACUS_MODELS.CLAUDE_3_5_SONNET,
          temperature,
          maxTokens,
        }),
        ABACUS_TIMEOUT_MS,
        'abacus',
      );
      const content = outcome.content.trim();
      const ok = content.length > 0;

      attempts.push({
        provider: 'abacus-claude',
        ok,
        latencyMs: Date.now() - attemptStart,
        detail: ok ? 'ok' : 'empty-completion',
      });

      if (ok) {
        return buildResult(
          'abacus-claude',
          outcome.model || ABACUS_MODELS.CLAUDE_3_5_SONNET,
          content,
          startedAt,
          attempts,
        );
      }
    } catch (error) {
      attempts.push({
        provider: 'abacus-claude',
        ok: false,
        latencyMs: Date.now() - attemptStart,
        detail: toErrorMessage(error),
      });
    }
  } else {
    attempts.push({
      provider: 'abacus-claude',
      ok: false,
      latencyMs: 0,
      detail: allowCloud ? 'not-configured' : 'cloud-disabled',
    });
  }

  // ── Escalón 3: GPU local (Ollama) ────────────────────────────────────────
  const ollamaStart = Date.now();
  const ollama = await runOllamaLocal(
    prompt,
    system,
    temperature,
    maxTokens,
    request.signal,
  );
  attempts.push({
    provider: 'ollama-local',
    ok: ollama.ok,
    latencyMs: Date.now() - ollamaStart,
    detail: ollama.detail,
  });

  if (ollama.ok) {
    return buildResult('ollama-local', ollama.model, ollama.content, startedAt, attempts);
  }

  // ── Escalón 4: aviso determinístico (honesto, NO simula IA) ──────────────
  const notice =
    'Ningún proveedor de razonamiento respondió en este intento ' +
    `(${attempts.map((a) => a.provider).join(' → ')}). ` +
    'No se genera respuesta inventada: reintenta o abre el canal oficial.';

  return {
    ok: false,
    content: notice,
    provider: 'deterministic',
    model: 'deterministic',
    latencyMs: Date.now() - startedAt,
    attempts,
    provenance: hashProvenance([
      'deterministic',
      notice,
      attempts.map((a) => a.detail).join('|'),
    ]),
    degraded: true,
  };
}
