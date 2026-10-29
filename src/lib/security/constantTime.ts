/**
 * ════════════════════════════════════════════════════════════════════════════
 * COMPARACIÓN EN TIEMPO CONSTANTE — SSOT DE AUTENTICACIÓN (P0)
 * ════════════════════════════════════════════════════════════════════════════
 * Un `===` sobre un secreto filtra por temporización cuántos bytes iniciales
 * coinciden: basta iterar para reconstruir un PIN de 4-6 cifras. Toda
 * comparación de credencial (PIN maestro, OTP, firma HMAC) pasa por aquí.
 *
 * `crypto.timingSafeEqual` exige buffers de igual longitud: la longitud se
 * compara primero para no lanzar excepción y no filtrar el tamaño del secreto.
 *
 * Módulo PURO de servidor (`node:crypto`): jamás importar en Client Component.
 * ════════════════════════════════════════════════════════════════════════════
 */
import crypto from 'node:crypto';

/** Compara dos cadenas en tiempo constante. Fail-closed ante cualquier anomalía. */
export function safeEqual(candidate: string, expected: string): boolean {
  if (expected.length === 0 || candidate.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(candidate, 'utf8'), Buffer.from(expected, 'utf8'));
  } catch {
    return false;
  }
}
