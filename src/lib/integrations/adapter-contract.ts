/**
 * ════════════════════════════════════════════════════════════════════════════
 * EXTERNAL INTEGRATIONS — SHARED ADAPTER CONTRACT & HITL GATE (M2)
 * ════════════════════════════════════════════════════════════════════════════
 * Módulo exclusivamente de servidor (`node:crypto` bloquea el bundle cliente
 * sin requerir el paquete `server-only`, ausente en `package.json`).
 *
 * REGLA PONYTAIL / AISLAMIENTO:
 *  · Importa únicamente de `@/lib/mcp/concierge-policy` (puro) y
 *    `@/lib/constants/ear-os-ssot` (Zona Cero inmutable, solo lectura).
 *  · Cero imports transitivos a `@/lib/prisma` o `node:fs`.
 *  · Cero `any`, cero `enum`, sintaxis TypeScript 100% erasable (Node 26).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import { z } from 'zod';

import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  HUMAN_HANDOFF_THRESHOLD_EUR,
  evaluateHumanHandoff,
  maskPhone,
  redactPii,
  type HandoffVerdict,
} from '@/lib/mcp/concierge-policy';

export const ADAPTER_TIMEOUT_MS = 8_000 as const;

export type EnvSource = Readonly<Record<string, string | undefined>>;

export type AdapterMode = 'REAL' | 'UNCONFIGURED' | 'HITL_BLOCKED' | 'ERROR';

export type AdapterStatusCode = 200 | 400 | 403 | 502 | 503;

export interface AdapterReadiness {
  readonly adapterId: string;
  readonly configured: boolean;
  readonly mode: 'READY' | 'UNCONFIGURED';
  readonly missingVars: readonly string[];
  readonly details?: string;
}

export interface AdapterEnvelope<T> {
  readonly ok: boolean;
  readonly mode: AdapterMode;
  readonly probed: true;
  readonly statusCode: AdapterStatusCode;
  readonly data: T | null;
  readonly errorCode?: string;
  readonly message?: string;
  readonly evidenceSha256: string;
}

export interface AdapterHttpRequest {
  readonly url: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string | null;
  readonly signal: AbortSignal;
}

export interface AdapterHttpResponse {
  readonly status: number;
  readonly headers: {
    get(name: string): string | null;
  };
  readonly text: string;
}

export interface AdapterTransport {
  send(request: AdapterHttpRequest): Promise<AdapterHttpResponse>;
}

export class AdapterTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdapterTimeoutError';
  }
}

const DUMMY_BUILD_SECRET = 'sk_test_dummy_key_for_build';
const PLACEHOLDER_SECRET_RE = /^your_[a-z0-9_]+_here$/i;
const CENTRALITA_DIGITS = CENTRALITA_EAR_OS.replace(/\D/g, '');

export function isPlaceholderEnvValue(raw: string): boolean {
  const trimmed = raw.trim();
  return (
    trimmed.length === 0 ||
    trimmed === DUMMY_BUILD_SECRET ||
    PLACEHOLDER_SECRET_RE.test(trimmed)
  );
}

export function readEnvVar(env: EnvSource, key: string): string {
  const raw = env[key];
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  return isPlaceholderEnvValue(trimmed) ? '' : trimmed;
}

export function checkEnvReadiness(
  adapterId: string,
  requiredVars: readonly string[],
  env: EnvSource = process.env,
  options?: { readonly optionalNote?: string },
): AdapterReadiness {
  const missingVars: string[] = [];
  for (const key of requiredVars) {
    if (readEnvVar(env, key).length === 0) {
      missingVars.push(key);
    }
  }
  const configured = missingVars.length === 0;
  return {
    adapterId,
    configured,
    mode: configured ? 'READY' : 'UNCONFIGURED',
    missingVars,
    ...(options?.optionalNote ? { details: options.optionalNote } : {}),
  };
}

export function createAdapterFetchTransport(
  fetchImpl: typeof fetch = fetch,
): AdapterTransport {
  return {
    async send(request: AdapterHttpRequest): Promise<AdapterHttpResponse> {
      const response = await fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ?? undefined,
        signal: request.signal,
        redirect: 'error',
        cache: 'no-store',
      });
      const text = await response.text();
      return {
        status: response.status,
        headers: response.headers,
        text,
      };
    },
  };
}

export function effectiveAdapterSignal(
  deadline?: Date,
  now: () => Date = () => new Date(),
  timeoutMs: number = ADAPTER_TIMEOUT_MS,
): AbortSignal {
  if (!deadline) {
    return AbortSignal.timeout(timeoutMs);
  }
  const remaining = deadline.getTime() - now().getTime();
  if (remaining <= 0) {
    throw new AdapterTimeoutError('El plazo máximo del adaptador ha expirado antes de abrir conexión.');
  }
  return AbortSignal.timeout(Math.min(remaining, timeoutMs));
}

function canonicalizeValue(value: unknown, seen: WeakSet<object>): unknown {
  if (value === undefined || value === null) return null;
  if (typeof value === 'bigint') return String(value);
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value !== 'object') {
    return String(value);
  }
  if (seen.has(value)) {
    return '[circular]';
  }
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      return value.map((item) => canonicalizeValue(item, seen));
    }
    if (value instanceof Date) {
      return Number.isFinite(value.getTime()) ? value.toISOString() : null;
    }
    const record = value as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const out: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      out[key] = canonicalizeValue(record[key], seen);
    }
    return out;
  } finally {
    seen.delete(value);
  }
}

export function computeEvidenceSha256(value: unknown): string {
  const canonical = canonicalizeValue(value, new WeakSet<object>());
  const serialized = JSON.stringify(canonical) ?? 'null';
  return createHash('sha256').update(serialized, 'utf8').digest('hex');
}

const AUTH_HEADER_SECRET_RE = /\b(Bearer|Basic|Key)\s+[A-Za-z0-9\-._~+/:]+=*/gi;
const URL_QUERY_SECRET_RE =
  /([?&#](?:token|access_token|refresh_token|api_key|apikey|key|secret|client_secret|auth|code)=)[^&\s#]+/gi;
const PROVIDER_KEY_PREFIX_RE =
  /\b(?:sk_(?:live|test)|pk_(?:live|test)|rk_(?:live|test)|ya29|GOCSPX|ghp|xox[bpa]|AIza)[A-Za-z0-9\-._]{8,}\b/g;
const PHONE_CANDIDATE_RE =
  /(?<![a-zA-Z0-9])(?:\+\d{1,3}[\s.-]?)?(?:\d[\s.-]?){9,13}(?![a-zA-Z0-9])/g;

/**
 * Capa INV-14: depura secretos, cabeceras de autorización, parámetros URL y
 * teléfonos no autorizados ANTES de que `redactPii` recorte a 600 caracteres.
 */
export function redactSecretsAndPii(
  text: string,
  knownSecrets: readonly string[] = [],
): string {
  if (typeof text !== 'string' || text.length === 0) return '';

  let scrubbed = text;
  for (const secret of knownSecrets) {
    if (typeof secret === 'string' && secret.length >= 4) {
      scrubbed = scrubbed.split(secret).join('[REDACTADO]');
    }
  }

  scrubbed = scrubbed
    .replace(AUTH_HEADER_SECRET_RE, '$1 [REDACTADO]')
    .replace(URL_QUERY_SECRET_RE, '$1[REDACTADO]')
    .replace(PROVIDER_KEY_PREFIX_RE, '[REDACTADO]')
    .replace(PHONE_CANDIDATE_RE, (candidate) => {
      const digits = candidate.replace(/\D/g, '');
      if (digits.length < 9 || digits === CENTRALITA_DIGITS) {
        return candidate;
      }
      return maskPhone(candidate) ?? '[REDACTADO]';
    });

  return redactPii(scrubbed);
}

export type SafeUrlResult =
  | { readonly ok: true; readonly url: URL }
  | { readonly ok: false; readonly reason: string };

function isPrivateOrReservedIpv4(host: string): boolean {
  const parts = host.split('.');
  if (parts.length !== 4) return false;
  const nums: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return false;
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return false;
    nums.push(n);
  }
  const [a, b] = nums;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // 127.0.0.0/8
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 (IMDS / link-local)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  if (a >= 224) return true; // 224.0.0.0/4 multicast + 240.0.0.0/4 reserved
  return false;
}

function isPrivateOrReservedIpv6(rawHost: string): boolean {
  const host = rawHost.replace(/^\[|\]$/g, '').toLowerCase();
  if (!host.includes(':')) return false;
  if (host.startsWith('::')) return true; // ::, ::1, ::ffff:*, IPv4-compatible ::127.0.0.1 / ::7f00:1, etc.
  if (/^fe[89ab][0-9a-f]?:/i.test(host)) return true; // fe80::/10 link-local
  if (/^f[cd][0-9a-f]{2}:/i.test(host)) return true; // fc00::/7 ULA
  if (/^ff[0-9a-f]{2}:/i.test(host)) return true; // ff00::/8 multicast
  if (/^64:ff9b:/i.test(host)) return true; // NAT64 64:ff9b::/96 & 64:ff9b:1::/48
  if (/^2002:/i.test(host)) return true; // 6to4 2002::/16
  if (/^2001:0?:/i.test(host)) return true; // Teredo 2001::/32
  if (/^100::/i.test(host)) return true; // Discard-only 100::/64
  return false;
}

/**
 * Validación estricta anti-SSRF compartida para URLs externas y medios públicos.
 * Solo permite HTTPS público en puerto estándar (443), sin credenciales ni IPs privadas.
 */
export function validateSafeHttpsPublicUrl(raw: string): SafeUrlResult {
  if (typeof raw !== 'string') {
    return { ok: false, reason: 'URL inválida: debe ser una cadena de texto.' };
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > 2048) {
    return { ok: false, reason: 'URL vacía o excede el máximo de 2048 caracteres.' };
  }
  if (/\s/.test(trimmed) || trimmed.startsWith('//')) {
    return { ok: false, reason: 'URL contiene espacios o esquema relativo no permitido.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, reason: 'URL sintácticamente malformada.' };
  }

  if (parsed.protocol !== 'https:') {
    return { ok: false, reason: `Protocolo no permitido (${parsed.protocol}): solo se admite https:.` };
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    return { ok: false, reason: 'No se permiten credenciales incrustadas en la URL.' };
  }
  if (parsed.port !== '' && parsed.port !== '443') {
    return { ok: false, reason: `Puerto no permitido (${parsed.port}): solo puerto HTTPS estándar.` };
  }

  const rawHost = parsed.hostname.toLowerCase();
  if (rawHost.includes('..')) {
    return { ok: false, reason: `Hostname malformado con puntos consecutivos (${rawHost}).` };
  }
  const host = rawHost.replace(/\.+$/, '');
  if (host.length === 0) {
    return { ok: false, reason: 'Hostname vacío.' };
  }
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localdomain') ||
    host === 'metadata.google.internal'
  ) {
    return { ok: false, reason: `Hostname interno o reservado bloqueado (${host}).` };
  }

  if (host.includes(':') || host.startsWith('[')) {
    if (isPrivateOrReservedIpv6(host)) {
      return { ok: false, reason: 'Dirección IPv6 privada o reservada bloqueada.' };
    }
    return { ok: true, url: parsed };
  }

  if (!host.includes('.') || /^\d+$/.test(host)) {
    return { ok: false, reason: `Hostname no calificado o numérico bloqueado (${host}).` };
  }
  if (isPrivateOrReservedIpv4(host)) {
    return { ok: false, reason: `Dirección IPv4 privada o reservada bloqueada (${host}).` };
  }

  return { ok: true, url: parsed };
}

export type HitlTier =
  | '5_HITL_TOTAL'
  | '25_REVIEW'
  | '60_SEMI_AUTO'
  | '90_AUTO'
  | '0_FORBIDDEN';

export type HitlActionKind =
  | 'read_only'
  | 'catalog_faq'
  | 'availability_check'
  | 'express_quote'
  | 'paid_provider_dossier'
  | 'lead_qualification'
  | 'draft_compose'
  | 'stripe_price_lock'
  | 'payment_deposit'
  | 'mutating_action'
  | 'b2g_contract'
  | 'litigation'
  | 'event_cancellation'
  | 'vimume_clinical'
  | 'contract_close';

export type ProviderTier =
  | 'SOVEREIGN'
  | 'CLAIMED'
  | 'DIRECTORY_UNCLAIMED'
  | 'BLACKLISTED';

export interface HitlGateInput {
  readonly actionKind: HitlActionKind;
  readonly amountEur?: number | null;
  readonly distanceKm?: number | null;
  readonly artistId?: string | null;
  readonly providerTier?: ProviderTier | null;
  readonly bilateralConsentConfirmed?: boolean;
  readonly humanApproved?: boolean;
  readonly technicalCustomization?: boolean;
  readonly acousticRejected?: boolean;
  readonly engineFailed?: boolean;
  readonly contextSummary?: string;
}

export interface HitlGateDecision {
  readonly allowed: boolean;
  readonly tier: HitlTier;
  readonly reason: string;
  readonly requiresHuman: boolean;
  readonly humanPhone: string | null;
  readonly handoffVerdict: HandoffVerdict;
}

/**
 * Puerta constitucional HITL (AGENTS.md §2 y §3 + concierge-policy.ts + ear-os-ssot.ts).
 */
export function evaluateHitlPolicyGate(input: HitlGateInput): HitlGateDecision {
  const handoffVerdict = evaluateHumanHandoff({
    amountEur: input.amountEur,
    technicalCustomization: input.technicalCustomization,
    acousticRejected: input.acousticRejected,
    engineFailed: input.engineFailed,
    contextSummary: input.contextSummary,
  });

  const amount =
    typeof input.amountEur === 'number' && Number.isFinite(input.amountEur)
      ? input.amountEur
      : null;
  const distance =
    typeof input.distanceKm === 'number' && Number.isFinite(input.distanceKm)
      ? input.distanceKm
      : null;

  // 1. 0_FORBIDDEN (inviolable, ignora humanApproved)
  if (input.actionKind === 'contract_close' && input.bilateralConsentConfirmed !== true) {
    return {
      allowed: false,
      tier: '0_FORBIDDEN',
      reason: 'Prohibición total (AGENTS.md §2): cierre contractual sin consentimiento bilateral.',
      requiresHuman: true,
      humanPhone: CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  if (
    input.artistId === 'e78903' &&
    amount !== null &&
    amount < TARIFA_BASE_SOLISTA_EUR
  ) {
    return {
      allowed: false,
      tier: '0_FORBIDDEN',
      reason: `Prohibición Paciente Cero (e78903): importe ${amount.toFixed(2)} € inferior al suelo SSOT (${TARIFA_BASE_SOLISTA_EUR} €).`,
      requiresHuman: true,
      humanPhone: CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  if (
    input.actionKind === 'paid_provider_dossier' &&
    input.providerTier !== 'SOVEREIGN' &&
    input.providerTier !== 'CLAIMED'
  ) {
    return {
      allowed: false,
      tier: '0_FORBIDDEN',
      reason: 'Prohibición §3: despacho externo de dossier reservado a proveedores SOVEREIGN o CLAIMED.',
      requiresHuman: true,
      humanPhone: CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  if (
    input.actionKind === 'b2g_contract' &&
    amount !== null &&
    amount > LIMITE_B2G_LCSP_EUR
  ) {
    return {
      allowed: false,
      tier: '0_FORBIDDEN',
      reason: `Límite legal B2G Art. 118 LCSP excedido (${amount.toFixed(2)} € > ${LIMITE_B2G_LCSP_EUR} €).`,
      requiresHuman: true,
      humanPhone: CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  // 2. 5_HITL_TOTAL (litigios, cancelaciones, VIMUME clínico, B2G > 5.000 € / > 14.250 €, handoff)
  if (
    input.actionKind === 'b2g_contract' &&
    amount !== null &&
    amount > AJUSTE_PREVENTIVO_B2G_EUR
  ) {
    return {
      allowed: false,
      tier: '5_HITL_TOTAL',
      reason: `Techo preventivo B2G superado (${amount.toFixed(2)} € > ${AJUSTE_PREVENTIVO_B2G_EUR} €): bloqueado para dirección.`,
      requiresHuman: true,
      humanPhone: CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  const isHitlTotalKind =
    input.actionKind === 'litigation' ||
    input.actionKind === 'event_cancellation' ||
    input.actionKind === 'vimume_clinical' ||
    (input.actionKind === 'b2g_contract' &&
      (amount === null || amount > HUMAN_HANDOFF_THRESHOLD_EUR)) ||
    (input.actionKind === 'contract_close' &&
      amount !== null &&
      amount > HUMAN_HANDOFF_THRESHOLD_EUR);

  if (isHitlTotalKind || handoffVerdict.requiresHuman) {
    const approved = input.humanApproved === true;
    return {
      allowed: approved,
      tier: '5_HITL_TOTAL',
      reason: approved
        ? 'Escalado HITL Total (5%) aprobado explícitamente por dirección.'
        : `Requiere HITL Total (5%): ${handoffVerdict.requiresHuman ? handoffVerdict.reason : input.actionKind}.`,
      requiresHuman: !approved,
      humanPhone: CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  // 3. 25_REVIEW (Stripe Price-Lock 100 €, depósitos, >300 km, mutaciones, cierre bilateral, B2G <= 5.000 €)
  const isReviewKind =
    input.actionKind === 'stripe_price_lock' ||
    input.actionKind === 'payment_deposit' ||
    input.actionKind === 'mutating_action' ||
    input.actionKind === 'contract_close' ||
    input.actionKind === 'b2g_contract' ||
    (distance !== null && distance > 300);

  if (isReviewKind) {
    const approved = input.humanApproved === true;
    const depositHint =
      input.actionKind === 'stripe_price_lock'
        ? ` (depósito canónico ${DEPOSITO_STRIPE_EUR} €)`
        : '';
    return {
      allowed: approved,
      tier: '25_REVIEW',
      reason: approved
        ? `Revisión humana obligatoria (25%) aprobada${depositHint}.`
        : `Bloqueado hasta revisión humana obligatoria (25%)${depositHint}.`,
      requiresHuman: !approved,
      humanPhone: approved ? null : CENTRALITA_EAR_OS,
      handoffVerdict,
    };
  }

  // 4. 60_SEMI_AUTO
  if (
    input.actionKind === 'express_quote' ||
    input.actionKind === 'paid_provider_dossier' ||
    input.actionKind === 'lead_qualification' ||
    input.actionKind === 'draft_compose'
  ) {
    return {
      allowed: true,
      tier: '60_SEMI_AUTO',
      reason: 'Operación semi-autónoma (60%) dentro de política.',
      requiresHuman: false,
      humanPhone: null,
      handoffVerdict,
    };
  }

  // 5. 90_AUTO (lista blanca explícita de solo lectura)
  if (
    input.actionKind === 'read_only' ||
    input.actionKind === 'catalog_faq' ||
    input.actionKind === 'availability_check'
  ) {
    return {
      allowed: true,
      tier: '90_AUTO',
      reason: 'Consulta autónoma supervisada (90%) de solo lectura.',
      requiresHuman: false,
      humanPhone: null,
      handoffVerdict,
    };
  }

  // 6. Fail-closed por defecto ante cualquier actionKind desconocido o no manejado
  const fallbackApproved = input.humanApproved === true;
  return {
    allowed: fallbackApproved,
    tier: '25_REVIEW',
    reason: fallbackApproved
      ? `Revisión humana obligatoria (25%) aprobada para acción no clasificada (${String(input.actionKind)}).`
      : `Acción no clasificada (${String(input.actionKind)}) bloqueada por defecto hasta revisión humana (25%).`,
    requiresHuman: !fallbackApproved,
    humanPhone: fallbackApproved ? null : CENTRALITA_EAR_OS,
    handoffVerdict,
  };
}

export function parseStrictWithSchema<T>(
  schema: z.ZodType<T>,
  raw: unknown,
):
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: string } {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const summary = parsed.error.issues
      .slice(0, 4)
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ');
    return { ok: false, error: summary || 'Validación Zod fallida.' };
  }
  return { ok: true, data: parsed.data };
}

export function envelopeOk<T>(
  data: T,
  evidenceContext?: unknown,
): AdapterEnvelope<T> {
  return {
    ok: true,
    mode: 'REAL',
    probed: true,
    statusCode: 200,
    data,
    evidenceSha256: computeEvidenceSha256(evidenceContext ?? data),
  };
}

export function envelopeUnconfigured<T = never>(
  readiness: AdapterReadiness,
): AdapterEnvelope<T> {
  const missing = readiness.missingVars.join(', ') || 'credenciales requeridas';
  const message = `Adaptador ${readiness.adapterId} no configurado (${missing}).`;
  return {
    ok: false,
    mode: 'UNCONFIGURED',
    probed: true,
    statusCode: 503,
    data: null,
    errorCode: 'UNCONFIGURED',
    message,
    evidenceSha256: computeEvidenceSha256({
      adapterId: readiness.adapterId,
      mode: 'UNCONFIGURED',
      missingVars: readiness.missingVars,
    }),
  };
}

export function envelopeHitlBlocked<T = never>(
  decision: HitlGateDecision,
): AdapterEnvelope<T> {
  return {
    ok: false,
    mode: 'HITL_BLOCKED',
    probed: true,
    statusCode: 403,
    data: null,
    errorCode: decision.tier,
    message: redactSecretsAndPii(decision.reason),
    evidenceSha256: computeEvidenceSha256({
      mode: 'HITL_BLOCKED',
      tier: decision.tier,
      requiresHuman: decision.requiresHuman,
    }),
  };
}

export function envelopeError<T = never>(
  statusCode: 400 | 403 | 502 | 503,
  errorCode: string,
  rawMessage: string,
  knownSecrets: readonly string[] = [],
): AdapterEnvelope<T> {
  const safeMessage = redactSecretsAndPii(rawMessage, knownSecrets);
  return {
    ok: false,
    mode: 'ERROR',
    probed: true,
    statusCode,
    data: null,
    errorCode,
    message: safeMessage,
    evidenceSha256: computeEvidenceSha256({
      mode: 'ERROR',
      statusCode,
      errorCode,
      message: safeMessage,
    }),
  };
}
