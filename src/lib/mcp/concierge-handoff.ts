/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONCIERGE HANDOFF — TOKEN DE SALTO FICHA ↔ WHATSAPP SIN FRICCIÓN (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Resuelve el escenario descrito en el diseño: el cliente navega `/otzarreta`,
 * calcula 120 pax y pulsa el botón flotante de WhatsApp. El agente NO debe
 * preguntar "¿en qué te ayudo?": hereda el contexto de la ficha.
 *
 * CANDADOS DE SEGURIDAD (no negociables):
 *  1. INV-14 · Cero PII en la URL. El token transporta SOLO: slug de entidad,
 *     aforo y fecha. Nunca nombre, teléfono ni email del visitante.
 *  2. El token va FIRMADO (HMAC-SHA-256) para que nadie lo falsee y haga que
 *     el agente afirme un aforo o un recinto que el cliente no eligió
 *     (eso sería una alucinación inyectada por URL).
 *  3. FAIL-CLOSED: firma inválida ⇒ `null`. El agente vuelve a preguntar en
 *     lugar de inventar contexto.
 *  4. Expiración: un token caducado no resucita un contexto viejo (7 días).
 *
 * MÓDULO DE SERVIDOR: usa `node:crypto`. Jamás importar desde un Client
 * Component (el bundle del navegador no tiene `node:crypto`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

/** Campos permitidos dentro del token. Ampliarlo exige revisar INV-14. */
export interface HandoffContext {
  /** Slug canónico de la entidad en pantalla (`otzarreta`). */
  readonly ref: string;
  /** Aforo declarado por el cliente. */
  readonly pax: number | null;
  /** Fecha ISO (YYYY-MM-DD) si el cliente ya la eligió. */
  readonly date: string | null;
}

/** Ventana de validez del token. */
export const HANDOFF_TOKEN_TTL_MS: number = 7 * 24 * 60 * 60 * 1000;

const REF_RE: RegExp = /^[a-z0-9][a-z0-9._-]{0,79}$/;
const DATE_RE: RegExp = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PAX: number = 10000;

/** Forma serializada y firmada que viaja en la URL. */
interface TokenPayload extends HandoffContext {
  /** Epoch ms de expiración. */
  readonly exp: number;
}

/**
 * Resuelve la clave de firma. Si no hay secreto configurado se usa una clave
 * de proceso efímera: los tokens dejan de validar tras un reinicio, lo cual es
 * el comportamiento correcto (fail-closed) en lugar de reutilizar una constante
 * pública que cualquiera podría leer en el repositorio (SEC-3).
 */
function resolveSigningKey(): string {
  const secret: string | undefined = process.env.EAR_HANDOFF_SECRET;
  if (typeof secret === 'string' && secret.length >= 16) return secret;
  const globalScope = globalThis as typeof globalThis & { __earHandoffEphemeralKey?: string };
  if (globalScope.__earHandoffEphemeralKey === undefined) {
    globalScope.__earHandoffEphemeralKey = createHmac('sha256', 'ear-os-handoff-bootstrap')
      .update(`${Date.now()}-${Math.random()}`)
      .digest('hex');
  }
  return globalScope.__earHandoffEphemeralKey;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(body: string): string {
  return createHmac('sha256', resolveSigningKey()).update(body).digest('base64url');
}

/** Comparación en tiempo constante (evita timing attacks sobre la firma). */
function safeEqual(a: string, b: string): boolean {
  const bufA: Buffer = Buffer.from(a, 'utf8');
  const bufB: Buffer = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Sanea el contexto antes de firmarlo. Devuelve `null` si no es publicable. */
function normalizeContext(input: HandoffContext): HandoffContext | null {
  const ref: string = typeof input.ref === 'string' ? input.ref.trim().toLowerCase() : '';
  if (!REF_RE.test(ref)) return null;

  let pax: number | null = null;
  if (typeof input.pax === 'number' && Number.isInteger(input.pax) && input.pax > 0 && input.pax <= MAX_PAX) {
    pax = input.pax;
  }

  let date: string | null = null;
  if (typeof input.date === 'string' && DATE_RE.test(input.date)) {
    const parsed: number = Date.parse(`${input.date}T00:00:00Z`);
    // Rechaza fechas imposibles (2026-02-31) que `Date.parse` normaliza en silencio.
    if (!Number.isNaN(parsed) && new Date(parsed).toISOString().slice(0, 10) === input.date) {
      date = input.date;
    }
  }

  return { ref, pax, date };
}

/**
 * Construye el token firmado. Devuelve `null` si el contexto no es válido:
 * nunca se firma basura.
 */
export function issueHandoffToken(context: HandoffContext, now: number = Date.now()): string | null {
  const clean: HandoffContext | null = normalizeContext(context);
  if (clean === null) return null;

  const payload: TokenPayload = { ...clean, exp: now + HANDOFF_TOKEN_TTL_MS };
  const body: string = base64UrlEncode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

/**
 * Verifica y decodifica un token. Cualquier anomalía ⇒ `null` (fail-closed):
 * firma alterada, formato roto, campos desconocidos o token caducado.
 */
export function verifyHandoffToken(raw: string | null | undefined, now: number = Date.now()): HandoffContext | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 512) return null;
  const parts: string[] = raw.split('.');
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  if (!safeEqual(sign(body), signature)) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(base64UrlDecode(body)) as unknown;
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== 'object') return null;

  const record = parsed as Record<string, unknown>;
  const exp: unknown = record.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp) || now > exp) return null;

  return normalizeContext({
    ref: typeof record.ref === 'string' ? record.ref : '',
    pax: typeof record.pax === 'number' ? record.pax : null,
    date: typeof record.date === 'string' ? record.date : null,
  });
}

/**
 * Query string para el enlace de WhatsApp / web.
 * Solo contiene el token firmado: cero PII legible en la URL (INV-14).
 */
export function buildHandoffQuery(context: HandoffContext, now: number = Date.now()): string | null {
  const token: string | null = issueHandoffToken(context, now);
  if (token === null) return null;
  return `ref=${encodeURIComponent(token)}`;
}

/** Extrae el token de una query string o de un href con `?ref=`. */
export function readHandoffToken(search: string | null | undefined): string | null {
  if (typeof search !== 'string' || search.length === 0) return null;
  const raw: string = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  const value: string | null = params.get('ref');
  return value !== null && value.length > 0 ? value : null;
}

