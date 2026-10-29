/**
 * 📡 CLIENTE DE INGESTA — habla con `/api/agents/intake` sin romper la UX.
 * ----------------------------------------------------------------------------
 * Contrato de tolerancia a fallos: si la flota no responde (timeout, 429, red
 * caída), devuelve `null` y el formulario sigue su curso normal. La venta nunca
 * se bloquea por un agente; la telemetría se pierde, el lead ya está guardado
 * por el endpoint original del formulario.
 * ----------------------------------------------------------------------------
 */
import type { FormIntakeResult, IntakeFields, IntakeFormType } from './formIntakeTypes';

const INTAKE_ENDPOINT = '/api/agents/intake';
const DEFAULT_TIMEOUT_MS = 5_000;
const MIN_TIMEOUT_MS = 800;

export interface SubmitIntakeOptions {
  /** Corta la espera y devuelve `null` (la UI no queda colgada). */
  readonly timeoutMs?: number;
  /** Clave estable por apertura de formulario: garantiza idempotencia real. */
  readonly idempotencyKey?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIntakeResult(value: unknown): value is FormIntakeResult {
  if (!isRecord(value)) return false;
  return (
    typeof value.intakeId === 'string' &&
    typeof value.formType === 'string' &&
    typeof value.qualified === 'boolean' &&
    typeof value.score === 'number' &&
    typeof value.agentUsed === 'string' &&
    Array.isArray(value.steps) &&
    isRecord(value.nextAction)
  );
}

/** Genera una clave de idempotencia válida (`[A-Za-z0-9:_-]{6,64}`). */
export function createIntakeKey(): string {
  const cryptoApi: Crypto | undefined = typeof globalThis.crypto === 'undefined' ? undefined : globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return `intake_${cryptoApi.randomUUID()}`;
  }
  const random: string = Math.random().toString(36).slice(2, 12);
  return `intake_${Date.now().toString(36)}${random}`;
}

/**
 * Envía un formulario a la flota. Nunca lanza.
 * @returns el recibo tipado, o `null` si la flota no pudo responder.
 */
export async function submitFormToAgents(
  formType: IntakeFormType,
  fields: IntakeFields,
  options: SubmitIntakeOptions = {},
): Promise<FormIntakeResult | null> {
  if (typeof fetch !== 'function') return null;

  const timeoutMs: number = Math.max(MIN_TIMEOUT_MS, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const controller: AbortController = new AbortController();
  const timer: ReturnType<typeof setTimeout> = setTimeout((): void => controller.abort(), timeoutMs);

  try {
    const response: Response = await fetch(INTAKE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, fields, idempotencyKey: options.idempotencyKey }),
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
      keepalive: true,
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    return isIntakeResult(payload) ? payload : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
