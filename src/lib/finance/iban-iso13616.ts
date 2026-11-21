/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VALIDADOR FORMAL IBAN ISO 13616 (ISO/IEC 7064 MOD-97-10, BigInt)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de verdad del saneado y la validación de IBAN para toda la
 * plataforma (onboarding de proveedores, liquidación del Split Soberano y
 * pasarelas bancarias de la zona SEPA).
 *
 * DECISIÓN DE ARQUITECTURA (orden del Director Generalista — Opción 3, YAGNI):
 *   NO se construye conversor legacy BBAN/CCC. Los proveedores y pasarelas de
 *   la zona SEPA operan exclusivamente con IBAN formado (ISO 13616). Añadir un
 *   conversor CCC introduciría deuda muerta sin valor comercial.
 *
 * ALGORITMO (norma, sin atajos):
 *   1. Saneado: se eliminan espacios, guiones y puntos; se normaliza a mayúsculas.
 *   2. Longitud estricta por país (tabla ISO 13616; España = 24 caracteres).
 *   3. Reordenación: los 4 primeros caracteres (país + dígitos de control) van
 *      al final.
 *   4. Conversión alfanumérica: A=10 … Z=35 conservando los dígitos.
 *   5. Aritmética entera exacta: BigInt(numerico) % 97n === 1n.
 *      El número resultante tiene hasta 34 caracteres → hasta ~112 bits. Un
 *      `Number` de IEEE 754 (53 bits) perdería dígitos y validaría basura; de
 *      ahí la obligación de BigInt (invariante de rigor matemático).
 *
 * Sin dependencias externas salvo Zod. Cero `any`. Módulo puro e idempotente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

/**
 * Longitudes oficiales por país conforme al registro SWIFT/ISO 13616.
 * Un país ausente ⇒ se exige la ventana genérica 15–34 caracteres, nunca una
 * longitud inventada.
 */
export const IBAN_LENGTH_BY_COUNTRY: Readonly<Record<string, number>> = Object.freeze({
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22,
  BI: 27, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DJ: 27,
  DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FK: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22,
  IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32,
  LI: 21, LT: 20, LU: 20, LV: 21, LY: 25, MC: 27, MD: 24, ME: 22, MK: 19,
  MN: 20, MR: 27, MT: 31, MU: 30, NI: 28, NL: 18, NO: 15, OM: 23, PK: 24,
  PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, RU: 33, SA: 24, SC: 31,
  SD: 18, SE: 24, SI: 19, SK: 24, SM: 27, SO: 23, ST: 25, SV: 28, TL: 23,
  TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
} as const);

/** Longitud mínima absoluta admitida por ISO 13616 (Noruega, 15). */
export const IBAN_MIN_LENGTH = 15;

/** Longitud máxima absoluta admitida por ISO 13616 (34). */
export const IBAN_MAX_LENGTH = 34;

/**
 * Sanea una entrada de usuario: elimina espacios, guiones y puntos de
 * separación visual; fuerza mayúsculas. No valida: sólo normaliza.
 */
export function normalizeIban(iban: string): string {
  if (typeof iban !== 'string') return '';
  return iban.replace(/[\s\-.]/g, '').toUpperCase();
}

/**
 * Longitud estricta esperada para el país dado, o `null` si el prefijo no es
 * un código ISO 3166-1 alfabético de dos letras.
 */
export function expectedIbanLength(countryCode: string): number | null {
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return IBAN_LENGTH_BY_COUNTRY[code] ?? null;
}

/**
 * Convierte un tramo alfanumérico a su representación numérica de la norma:
 * A=10 … Z=35, los dígitos se conservan. Devuelve `null` si hay un carácter
 * fuera del alfabeto permitido.
 */
function toIso13616Numeric(input: string): string | null {
  let numeric = '';
  for (let i = 0; i < input.length; i += 1) {
    const charCode = input.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      numeric += String(charCode - 55);
    } else if (charCode >= 48 && charCode <= 57) {
      numeric += input[i];
    } else {
      return null;
    }
  }
  return numeric;
}

/**
 * Valida un IBAN según ISO 13616 con aritmética exacta MOD-97-10 (BigInt).
 *
 * Función pura y total: devuelve `false` ante cualquier entrada no conforme
 * (tipo distinto de string, longitud incorrecta, letras fuera de rango,
 * MOD ≠ 1). Jamás lanza excepción.
 */
export function isValidIBAN(iban: string): boolean {
  const raw = normalizeIban(iban);

  // 1. Ventana estructural mínima-máxima de la norma.
  if (raw.length < IBAN_MIN_LENGTH || raw.length > IBAN_MAX_LENGTH) return false;

  // 2. Gramática: 2 letras de país + 2 dígitos de control + BBAN alfanumérico.
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)) return false;

  // 3. Longitud estricta por país (España = 24 exactos).
  const requiredLength = expectedIbanLength(raw.slice(0, 2));
  if (requiredLength !== null && raw.length !== requiredLength) return false;

  // 4. Reordenación ISO 13616: país + DC pasan al final.
  const numeric = toIso13616Numeric(raw.slice(4) + raw.slice(0, 4));
  if (numeric === null) return false;

  // 5. Verificación formal ISO/IEC 7064 MOD-97-10 con precisión arbitraria:
  //    no existe pérdida de dígitos significativos.
  try {
    return BigInt(numeric) % 97n === 1n;
  } catch {
    return false;
  }
}

/**
 * Calcula los dos dígitos de control MOD-97 para un BBAN (cuerpo sin país ni
 * DC). Se emplea en tests de propiedad y en la generación de fixtures, nunca
 * para aceptar datos de usuario. Devuelve `null` si el BBAN no es válido.
 */
export function computeIbanCheckDigits(countryCode: string, bban: string): string | null {
  const country = countryCode.toUpperCase();
  const body = bban.toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) return null;
  if (!/^[A-Z0-9]+$/.test(body)) return null;

  const numeric = toIso13616Numeric(body + country + '00');
  if (numeric === null) return null;

  const check = 98n - (BigInt(numeric) % 97n);
  return check.toString().padStart(2, '0');
}

/**
 * Formatea un IBAN en bloques de 4 caracteres para copy público y recibos.
 * Devuelve `null` si el IBAN no supera ISO 13616.
 */
export function formatIban(iban: string): string | null {
  if (!isValidIBAN(iban)) return null;
  return normalizeIban(iban).replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Esquema Zod canónico de IBAN. Todo boundary externo (server actions,
 * webhooks y formularios de onboarding) valida con este esquema y NO con
 * expresiones ad-hoc (SEC-4).
 */
export const IbanSchema = z
  .string()
  .min(IBAN_MIN_LENGTH, 'IBAN demasiado corto para la norma ISO 13616')
  .max(IBAN_MAX_LENGTH, 'IBAN demasiado largo para la norma ISO 13616')
  .refine((value: string) => isValidIBAN(value), {
    message: 'Código de cuenta IBAN inválido según la norma ISO 13616 (MOD-97-10 BigInt)',
  });

export type Iban = z.infer<typeof IbanSchema>;
