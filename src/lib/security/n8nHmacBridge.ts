/**
 * ════════════════════════════════════════════════════════════════════════════
 * PUENTE CRIPTOGRÁFICO N8N — FIRMA HMAC-SHA256 + RECEPCIÓN HITL (P0)
 * ════════════════════════════════════════════════════════════════════════════
 * El endpoint `/api/webhooks/n8n-dispatch` acepta órdenes de despacho desde n8n
 * (Telegram VIP, WhatsApp Centralita, pausa HITL). Sin firma, ese endpoint sería
 * un relé abierto: cualquiera podría ordenar un aviso al CEO o pausar un flujo.
 *
 * Contrato de firma (simétrico, verificable en n8n con un nodo Crypto):
 *   firma = HMAC-SHA256(secreto, `${timestamp}.${rawBody}`)  en hex minúsculas
 * Se firma el TIMESTAMP junto al cuerpo: sin él, un mensaje capturado se podría
 * reenviar indefinidamente (replay). El timestamp caduca por ventana.
 *
 * Reglas:
 *  · Fail-closed: sin `N8N_DISPATCH_SECRET` configurado → la ruta responde 503,
 *    nunca 200. Un puente sin secreto no es un puente, es una puerta abierta.
 *  · Comparación en TIEMPO CONSTANTE (`safeEqual`, INV-07/SEC-3).
 *  · Ventana anti-replay `N8N_SIGNATURE_TOLERANCE_SECONDS` (por defecto 300).
 *  · Cero PII en logs: sólo se registra el slug y el motivo del rechazo.
 *
 * Módulo PURO de servidor (`node:crypto`): jamás importar en Client Component.
 * ════════════════════════════════════════════════════════════════════════════
 */
import crypto from 'node:crypto';

import { safeEqual } from '@/lib/security/constantTime';

/** Cabeceras del contrato. `x-ear-signature` gana; `x-hub-signature-256` es alias. */
export const N8N_SIGNATURE_HEADER = 'x-ear-signature';
export const N8N_TIMESTAMP_HEADER = 'x-ear-timestamp';

/** Claves de entorno aceptadas en orden de precedencia (rotación sin caída). */
export const N8N_SECRET_ENV_KEYS = [
  'N8N_DISPATCH_SECRET',
  'N8N_DISPATCH_SECRET_SECONDARY',
] as const;

/** Ventana anti-replay por defecto: 5 minutos. */
export const N8N_DEFAULT_TOLERANCE_SECONDS = 300;

/** Órdenes que n8n puede disparar sobre el bus de EAR OS. */
export const N8N_DISPATCH_ACTIONS = [
  'STRIPE_PRICE_LOCK_CONFIRMED',
  'HITL_PAUSE',
  'HITL_RESUME',
  'TELEGRAM_VIP_ALERT',
  'WHATSAPP_CENTRALITA_ALERT',
] as const;

export type N8nDispatchAction = (typeof N8N_DISPATCH_ACTIONS)[number];

export function isN8nDispatchAction(value: string): value is N8nDispatchAction {
  return (N8N_DISPATCH_ACTIONS as readonly string[]).includes(value);
}

/** Firma canónica: HMAC-SHA256 hex de `${timestamp}.${rawBody}`. */
export function computeN8nSignature(secret: string, timestamp: string, rawBody: string): string {
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex');
}

/** Devuelve los secretos configurados, en orden de precedencia (sin vacíos). */
export function resolveN8nSecrets(
  env: Readonly<Record<string, string | undefined>> = process.env,
): readonly string[] {
  return N8N_SECRET_ENV_KEYS.map((key) => (env[key] ?? '').trim()).filter((value) => value.length > 0);
}

export type N8nSignatureVerdict =
  | { readonly ok: true; readonly ageSeconds: number }
  | {
      readonly ok: false;
      readonly reason: 'NO_SECRET' | 'MISSING_SIGNATURE' | 'MISSING_TIMESTAMP' | 'STALE_TIMESTAMP' | 'BAD_TIMESTAMP' | 'SIGNATURE_MISMATCH';
    };

export interface N8nVerifyInput {
  readonly rawBody: string;
  readonly signature: string | null;
  readonly timestamp: string | null;
  /** Inyectable para test determinista. */
  readonly nowMs?: number;
  readonly toleranceSeconds?: number;
  readonly env?: Readonly<Record<string, string | undefined>>;
}

/**
 * Verifica la firma de una orden. Fail-closed en todos los caminos: cualquier
 * anomalía devuelve `ok:false` con motivo tipado (nunca lanza excepción).
 */
export function verifyN8nSignature(input: N8nVerifyInput): N8nSignatureVerdict {
  const secrets = resolveN8nSecrets(input.env);
  if (secrets.length === 0) {
    return { ok: false, reason: 'NO_SECRET' };
  }

  const signature = (input.signature ?? '').trim().toLowerCase();
  if (signature.length === 0) {
    return { ok: false, reason: 'MISSING_SIGNATURE' };
  }

  const timestamp = (input.timestamp ?? '').trim();
  if (timestamp.length === 0) {
    return { ok: false, reason: 'MISSING_TIMESTAMP' };
  }

  const timestampSeconds = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(timestampSeconds) || timestampSeconds <= 0) {
    return { ok: false, reason: 'BAD_TIMESTAMP' };
  }

  const nowMs = input.nowMs ?? Date.now();
  const tolerance = input.toleranceSeconds ?? N8N_DEFAULT_TOLERANCE_SECONDS;
  const ageSeconds = Math.floor(nowMs / 1000) - timestampSeconds;

  // Rechaza futuros lejanos y pasados caducados: ambos son replay o reloj roto.
  if (ageSeconds > tolerance || ageSeconds < -tolerance) {
    return { ok: false, reason: 'STALE_TIMESTAMP' };
  }

  const matched = secrets.some((secret) => safeEqual(computeN8nSignature(secret, timestamp, input.rawBody), signature));
  if (!matched) {
    return { ok: false, reason: 'SIGNATURE_MISMATCH' };
  }

  return { ok: true, ageSeconds };
}
