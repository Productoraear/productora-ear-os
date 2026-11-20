/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · SHA-256 CANÓNICO UTF-8
 * ════════════════════════════════════════════════════════════════════════════
 * Un único punto de hashing para no confundir «UTF-16 code units» con bytes:
 * `crypto.createHash().update(string)` codifica en UTF-8, mientras que
 * `string.length` cuenta unidades UTF-16. Medir sin saber cuál se usa es una
 * fuente clásica de "hash que no cuadra en producción".
 *
 *   sha256Text()      → hash del texto codificado UTF-8 (paridad `node:crypto`).
 *   sha256Utf16()     → hash de las unidades UTF-16 (disponible en navegador sin
 *                       cargar `node:crypto`; identificado como tal, nunca
 *                       presentado como SHA-256 de fichero).
 *   byteLengthUtf8()  → tamaño real de los bytes que viajarían por la red.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';

export function sha256OfBytes(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Hash SHA-256 canónico de un texto (codificación UTF-8, igual que el SO). */
export function sha256OfText(text: string): string {
  return sha256OfBytes(new TextEncoder().encode(text));
}

export function byteLengthUtf8(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}
