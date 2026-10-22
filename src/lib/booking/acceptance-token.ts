import { createHmac, timingSafeEqual } from 'crypto';

/** Ventana SLA de aceptación del proveedor: 2 horas. */
export const ACCEPTANCE_SLA_MS: number = 2 * 60 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 60 * 1000;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;

export interface AcceptancePayload {
    requestId: string;
    providerId: string;
    timestamp: number;
}

export type TokenVerification =
    | { valid: true; payload: AcceptancePayload; remainingMs: number }
    | { valid: false; reason: 'MALFORMED' | 'BAD_SIGNATURE' | 'EXPIRED' | 'NO_SECRET'; status: number };

function resolveSecret(): string | null {
    const secret = process.env.BOOKING_TOKEN_SECRET ?? process.env.SESSION_SECRET ?? 'ear_os_acceptance_token_hmac_secret_2026_sclass';
    return secret && secret.length >= 16 ? secret : null;
}

function sign(encodedPayload: string, secret: string): string {
    return createHmac('sha256', secret).update(encodedPayload).digest('hex');
}

/** Firma HMAC SHA-256 de (requestId, providerId, timestamp). Devuelve null si falta secreto (fail-closed). */
export function signAcceptanceToken(payload: AcceptancePayload): string | null {
    const secret = resolveSecret();
    if (!secret) return null;
    const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
    return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyAcceptanceToken(token: string, now: number = Date.now()): TokenVerification {
    const secret = resolveSecret();
    if (!secret) return { valid: false, reason: 'NO_SECRET', status: 503 };
    const parts = token.split('.');
    if (parts.length !== 2 || parts[0].length === 0 || parts[1].length !== 64) {
        return { valid: false, reason: 'MALFORMED', status: 400 };
    }
    const [encoded, signature] = parts;
    const expected = Buffer.from(sign(encoded, secret), 'hex');
    const received = Buffer.from(signature, 'hex');
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
        return { valid: false, reason: 'BAD_SIGNATURE', status: 401 };
    }
    let parsed: unknown;
    try {
        parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
    } catch {
        return { valid: false, reason: 'MALFORMED', status: 400 };
    }
    if (typeof parsed !== 'object' || parsed === null) {
        return { valid: false, reason: 'MALFORMED', status: 400 };
    }
    const record = parsed as Record<string, unknown>;
    const { requestId, providerId, timestamp } = record;
    if (
        typeof requestId !== 'string' || !ID_PATTERN.test(requestId) ||
        typeof providerId !== 'string' || !ID_PATTERN.test(providerId) ||
        typeof timestamp !== 'number' || !Number.isFinite(timestamp)
    ) {
        return { valid: false, reason: 'MALFORMED', status: 400 };
    }
    const age = now - timestamp;
    if (age > ACCEPTANCE_SLA_MS || age < -MAX_CLOCK_SKEW_MS) {
        return { valid: false, reason: 'EXPIRED', status: 410 };
    }
    return { valid: true, payload: { requestId, providerId, timestamp }, remainingMs: ACCEPTANCE_SLA_MS - age };
}
