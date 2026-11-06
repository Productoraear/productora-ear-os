/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🛡️ EAR OS — CENTINELA ANTI-FRAUDE, PACTO DE LEALTAD Y LISTA NEGRA (SHA-256)
 * ════════════════════════════════════════════════════════════════════════════
 * Blindaje algorítmico contra picaresca, elusión de comisiones y dobles registros.
 *
 * DOCTRINA DEL CEO:
 * 1. Hashes irreversibles SHA-256 de números de teléfono y emails infractores.
 * 2. Detección inmediata en tiempo de registro o edición de perfil (0 ms).
 * 3. Primer incumplimiento: Multa de 100,00 € vía Stripe Price-Lock y firma
 *    de compromiso para reactivación.
 * 4. Segundo incumplimiento: Expulsión definitiva e irreversible de EAR OS y
 *    de la red de alianzas.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'crypto';

export type InfractionLevel = 'WARNING' | 'PENALTY_PENDING_100' | 'PERMANENT_EXPULSION';

export interface BlacklistRecord {
  readonly id: string;
  readonly phoneHash: string;
  readonly emailHash: string;
  readonly maskedIdentifier: string; // ej. "658***211 / us***@dom.com"
  readonly level: InfractionLevel;
  readonly reason: string;
  readonly penaltyPaid: boolean;
  readonly penaltyStripeSessionId?: string;
  readonly registeredAt: string;
  readonly updatedAt: string;
}

/** Hasheado determinista y limpio de teléfono para evitar fugas y comparar identidades */
export function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // Extraer los últimos 9 dígitos estándar en España
  const canonical = digits.length >= 9 ? digits.slice(-9) : digits;
  return createHash('sha256').update(canonical).digest('hex');
}

/** Hasheado determinista de correo electrónico */
export function hashEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  return createHash('sha256').update(normalized).digest('hex');
}

/** Enmascarador de teléfono para auditoría segura sin exponer datos privados */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 5) return '***';
  return `${digits.slice(0, 3)}***${digits.slice(-3)}`;
}

/** Enmascarador de email */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain || local.length <= 2) return '***@***';
  return `${local.slice(0, 2)}***@${domain}`;
}

/** Registro de infractores en memoria / respaldo en disco */
export const SOVEREIGN_BLACKLIST_REGISTRY: BlacklistRecord[] = [
  {
    id: 'blk-sample-01',
    phoneHash: hashPhone('658963211'),
    emailHash: hashEmail('infractor.ejemplo@fraude.es'),
    maskedIdentifier: '658***211 / in***@fraude.es',
    level: 'PENALTY_PENDING_100',
    reason: 'Intento reiterado de elusión de fianza en evento nupcial y facturación paralela fuera de plataforma.',
    penaltyPaid: false,
    registeredAt: '2026-11-06T10:00:00Z',
    updatedAt: '2026-11-06T10:00:00Z',
  },
];

/**
 * Validador Centinela: comprueba si un teléfono o correo pertenece a un perfil expulsado
 */
export function checkSovereignBlacklist(phone?: string, email?: string): {
  isBlocked: boolean;
  record?: BlacklistRecord;
  penaltyRequired: boolean;
  message?: string;
} {
  const pHash = phone ? hashPhone(phone) : null;
  const eHash = email ? hashEmail(email) : null;

  const found = SOVEREIGN_BLACKLIST_REGISTRY.find(
    (b) => (pHash && b.phoneHash === pHash) || (eHash && b.emailHash === eHash)
  );

  if (!found) {
    return { isBlocked: false, penaltyRequired: false };
  }

  if (found.level === 'PERMANENT_EXPULSION') {
    return {
      isBlocked: true,
      record: found,
      penaltyRequired: false,
      message: 'Acceso denegado de forma definitiva e irreversible por incumplimiento grave del Pacto de Lealtad EAR OS.',
    };
  }

  if (found.level === 'PENALTY_PENDING_100' && !found.penaltyPaid) {
    return {
      isBlocked: true,
      record: found,
      penaltyRequired: true,
      message: 'Perfil suspendido por infracción de contratación. Se requiere regularización mediante abono de penalización de 100,00 € (Stripe Price-Lock).',
    };
  }

  return { isBlocked: false, penaltyRequired: false };
}

