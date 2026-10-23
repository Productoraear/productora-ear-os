import { appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

/** Webhooks permitidos (allowlist). Cualquier otro destino se rechaza. */
export type N8nWebhook =
  | 'b2b-quote'
  | 'stripe-price-lock'
  | 'finca-partnership'
  | 'vimume-clinical-report'
  | 'call-center-intake'
  | 'autonomous-escalation'
  | 'executive-kpi-radar';

const ALLOWED: readonly N8nWebhook[] = [
  'b2b-quote',
  'stripe-price-lock',
  'finca-partnership',
  'vimume-clinical-report',
  'call-center-intake',
  'autonomous-escalation',
  'executive-kpi-radar',
];

const DLQ_FILE: string = join(process.cwd(), '.antigravity', 'dlq.jsonl');
const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 5_000;

export type N8nBody = Readonly<Record<string, string | number | boolean>>;

export interface DispatchResult {
  readonly delivered: boolean;
  readonly attempts: number;
  readonly deadLettered: boolean;
}

function baseUrl(): string {
  const raw: string = process.env.N8N_BASE_URL ?? 'https://n8n.productoraear.com';
  return raw.replace(/\/+$/, '');
}

function deadLetter(webhook: N8nWebhook, body: N8nBody, reason: string): void {
  try {
    mkdirSync(dirname(DLQ_FILE), { recursive: true });
    const line: string = JSON.stringify({ at: new Date().toISOString(), webhook, body, reason });
    appendFileSync(DLQ_FILE, `${line}\n`, 'utf8');
  } catch {
    // Último recurso: el fallo de DLQ no debe tumbar al agente.
  }
}

async function postOnce(url: string, body: N8nBody): Promise<boolean> {
  const controller = new AbortController();
  const timer: NodeJS.Timeout = setTimeout((): void => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    const res: Response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Envía a n8n con reintentos y, si falla, a la DLQ local (.antigravity/dlq.jsonl): 0 leads huérfanos. */
export async function dispatchToN8n(webhook: N8nWebhook, body: N8nBody): Promise<DispatchResult> {
  if (!ALLOWED.includes(webhook)) {
    deadLetter(webhook, body, 'WEBHOOK_NOT_ALLOWED');
    return { delivered: false, attempts: 0, deadLettered: true };
  }
  const url = `${baseUrl()}/webhook/${webhook}`;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (await postOnce(url, body)) return { delivered: true, attempts: attempt, deadLettered: false };
    await new Promise<void>((resolve): void => {
      setTimeout(resolve, 300 * attempt);
    });
  }
  deadLetter(webhook, body, 'MAX_ATTEMPTS_EXCEEDED');
  return { delivered: false, attempts: MAX_ATTEMPTS, deadLettered: true };
}
