/**
 * ════════════════════════════════════════════════════════════════════════════
 * PACK CABALLO DE TROYA — ESQUEMAS ZOD & VALIDACIÓN FORMAL DE PROVEEDORES
 * ════════════════════════════════════════════════════════════════════════════
 * Ficha Universal de Proveedor (380 campos tipados con esquemas Zod).
 * Interoperabilidad garantizada con el Catálogo SSOT de campos
 * (`src/lib/providers/provider-field-catalog.ts`) y la Doctrina de Mediación Soberana.
 *
 * DOCTRINA DE SEGURIDAD Y CERO FACHADAS:
 *   · Algoritmos matemáticos canónicos: Módulo 23 para DNI/NIE y Dígito de Control
 *     para CIF societario; ISO 13616 Módulo 97 (MOD-97-10) con aritmética BigInt.
 *   · Doctrina del Contact-Gate: Números directos en DIRECTORY_UNCLAIMED se
 *     enmascaran obligatoriamente a la Centralita Oficial (+34 693 693 048).
 *   · Anti-Fraude: Aceptación obligatoria con literal estricto `true`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import {
  buildProviderFieldSet,
  type ProviderFieldCategoryKey,
  type ProviderFieldDef,
} from './provider-field-catalog';

/**
 * Las 8 categorías universales del Caballo de Troya para incorporación de proveedores.
 */
export const ProviderProfileCategoryEnum = z.enum([
  'FINCA_ALQUILER',
  'RESTAURANTE_BODA',
  'CATERING_BODA',
  'MUSICA_DIRECTO',
  'FOTOGRAFIA_VIDEO',
  'FLORISTERIA_DECORACION',
  'WEDDING_PLANNER',
  'SERVICIOS_COMPLEMENTARIOS',
]);

export type ProviderProfileCategory = z.infer<typeof ProviderProfileCategoryEnum>;

/**
 * Esquema individual de campo de ficha universal.
 * Compatible con la persistencia en PostgreSQL 16 y el catálogo de 380 campos.
 */
export const ProviderProfileFieldSchema = z.object({
  key: z.string().min(2).max(120),
  category: ProviderProfileCategoryEnum,
  publicVisible: z.boolean().default(true),
  sensitive: z.boolean().default(false),
  label: z.string().min(2).max(160),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
  ]),
  verifiedByAdmin: z.boolean().default(false),
  updatedAt: z.string().datetime(),
});

export type ProviderProfileField = z.infer<typeof ProviderProfileFieldSchema>;

/**
 * Esquema de onboarding y sincronización soberana del Caballo de Troya.
 */
export const ProviderTrojanOnboardingSchema = z.object({
  providerSlug: z.string().regex(/^[a-z0-9-]+$/),
  businessName: z.string().min(2).max(160),
  cifNif: z.string().min(8).max(20),
  contactPhone: z.string().regex(/^\+?[0-9]{9,15}$/),
  billingIban: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/),
  membershipTier: z.enum([
    'DIRECTORY_UNCLAIMED',
    'CLAIMED_PRO',
    'SOVEREIGN_FOUNDER',
  ]),
  acceptsAntiFraudPolicy: z.literal(true),
  fields: z.array(ProviderProfileFieldSchema),
});

export type ProviderTrojanOnboarding = z.infer<typeof ProviderTrojanOnboardingSchema>;

/**
 * Mapeo canónico entre las 8 categorías del Caballo de Troya y las 12 claves del catálogo de campos.
 */
export const TROJAN_TO_CATALOG_CATEGORY_MAP: Readonly<Record<ProviderProfileCategory, ProviderFieldCategoryKey>> = Object.freeze({
  FINCA_ALQUILER: 'finca',
  RESTAURANTE_BODA: 'catering',
  CATERING_BODA: 'catering',
  MUSICA_DIRECTO: 'musica',
  FOTOGRAFIA_VIDEO: 'foto',
  FLORISTERIA_DECORACION: 'decoracion',
  WEDDING_PLANNER: 'wedding',
  SERVICIOS_COMPLEMENTARIOS: 'servicios',
});

/**
 * Resuelve la categoría canónica de catálogo a partir de la categoría del Caballo de Troya.
 */
export function mapTrojanCategoryToCatalog(category: ProviderProfileCategory): ProviderFieldCategoryKey {
  return TROJAN_TO_CATALOG_CATEGORY_MAP[category] ?? 'servicios';
}

/**
 * Obtiene los campos completos (~380 campos) del catálogo para una categoría del Caballo de Troya o de catálogo.
 */
export function getCategoryFields(category: ProviderProfileCategory | ProviderFieldCategoryKey): readonly ProviderFieldDef[] {
  const catalogKey = category in TROJAN_TO_CATALOG_CATEGORY_MAP
    ? TROJAN_TO_CATALOG_CATEGORY_MAP[category as ProviderProfileCategory]
    : (category as ProviderFieldCategoryKey);
  return buildProviderFieldSet(catalogKey);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ALGORITMOS MATEMÁTICOS DE VALIDACIÓN FORMAL (CERO VIBE-CODING)
 * ───────────────────────────────────────────────────────────────────────────── */

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const CIF_LETTERS = 'JABCDEFGHI';

/**
 * Validador formal de CIF, NIF y NIE según normativa tributaria española (AEAT).
 *
 * Algoritmos implementados:
 *   · DNI: Módulo 23 sobre 8 dígitos contra tabla canónica TRWAGMYFPDXBNJZSQVHLCKE.
 *   · NIE: Mapeo de prefijo (X=0, Y=1, Z=2) + 7 dígitos + módulo 23.
 *   · CIF societario: Suma ponderada de posiciones pares e impares (con reducción
 *     de dobles dígitos) + cálculo de dígito de control o letra de control según
 *     el tipo de entidad jurídica (A, B, C, D, E, F, G, H, J, N, P, Q, R, S, U, V, W).
 */
export function validateCifNif(val: string): boolean {
  if (typeof val !== 'string') return false;
  const raw = val.trim().replace(/[-\s]/g, '').toUpperCase();
  if (raw.length !== 9) return false;

  // 1. DNI: 8 dígitos + 1 letra canónica
  if (/^[0-9]{8}[A-Z]$/.test(raw)) {
    const num = parseInt(raw.slice(0, 8), 10);
    const expectedLetter = DNI_LETTERS[num % 23];
    return raw[8] === expectedLetter;
  }

  // 2. NIE: Letra inicial X, Y o Z + 7 dígitos + letra de control
  if (/^[XYZ][0-9]{7}[A-Z]$/.test(raw)) {
    const prefixMap: Record<string, string> = { X: '0', Y: '1', Z: '2' };
    const numStr = prefixMap[raw[0]] + raw.slice(1, 8);
    const num = parseInt(numStr, 10);
    const expectedLetter = DNI_LETTERS[num % 23];
    return raw[8] === expectedLetter;
  }

  // 3. CIF Societario: 1 letra de tipo + 7 dígitos centrales + 1 carácter de control (dígito o letra)
  if (/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(raw)) {
    const firstLetter = raw[0];
    const centralDigits = raw.slice(1, 8);
    const controlChar = raw[8];

    // Posiciones pares (índices 1, 3, 5 en 0-based): suma directa
    let evenSum = 0;
    for (let i = 1; i < 7; i += 2) {
      evenSum += parseInt(centralDigits[i], 10);
    }

    // Posiciones impares (índices 0, 2, 4, 6 en 0-based): multiplicar por 2 y sumar dígitos
    let oddSum = 0;
    for (let i = 0; i < 7; i += 2) {
      const prod = parseInt(centralDigits[i], 10) * 2;
      oddSum += Math.floor(prod / 10) + (prod % 10);
    }

    const totalSum = evenSum + oddSum;
    const controlUnit = totalSum % 10;
    const controlDigit = (10 - controlUnit) % 10;
    const controlLetter = CIF_LETTERS[controlDigit];

    // Clasificación legal de tipo de entidad:
    // P, Q, S, R, W: Estrictamente letra de control
    const strictlyLetter = ['P', 'Q', 'S', 'R', 'W'].includes(firstLetter);
    // A, B, E, H: Estrictamente número de control
    const strictlyDigit = ['A', 'B', 'E', 'H'].includes(firstLetter);

    if (strictlyLetter) {
      return controlChar === controlLetter;
    }
    if (strictlyDigit) {
      return controlChar === String(controlDigit);
    }
    // Entidades mixtas (C, D, F, G, J, N, U, V): Aceptan dígito o letra equivalente
    return controlChar === String(controlDigit) || controlChar === controlLetter;
  }

  return false;
}

/**
 * Validador bancario internacional de IBAN conforme a la norma ISO 13616.
 *
 * Emplea aritmética de enteros gigantes (BigInt) para computar el MOD-97-10
 * exacto sin sufrir pérdida de precisión por punto flotante de IEEE 754.
 * En España (ES) exige exactamente 24 caracteres alfanuméricos.
 */
export function validateIbanIso13616(val: string): boolean {
  if (typeof val !== 'string') return false;
  const raw = val.trim().replace(/[-\s]/g, '').toUpperCase();

  // Validación de longitud estructural según ISO 13616 (15 a 34 caracteres)
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(raw)) {
    return false;
  }

  // Cláusula territorial para España: exactamente 24 caracteres numéricos tras el país
  if (raw.startsWith('ES') && (!/^ES[0-9]{22}$/.test(raw) || raw.length !== 24)) {
    return false;
  }

  // Reorganización ISO 13616: Mover los 4 primeros caracteres al final
  const rearranged = raw.slice(4) + raw.slice(0, 4);

  // Conversión alfabética: A = 10, B = 11, ..., Z = 35
  let numericString = '';
  for (let i = 0; i < rearranged.length; i++) {
    const code = rearranged.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      numericString += String(code - 55);
    } else if (code >= 48 && code <= 57) {
      numericString += rearranged[i];
    } else {
      return false;
    }
  }

  // Verificación aritmética formal: numericString % 97 === 1
  try {
    const ibanBigInt = BigInt(numericString);
    return ibanBigInt % 97n === 1n;
  } catch {
    return false;
  }
}

/**
 * Formateador y guardián de la Doctrina del Contact-Gate.
 *
 * Para cuentas 'DIRECTORY_UNCLAIMED', el teléfono NUNCA se expone públicamente;
 * se canaliza obligatoriamente hacia la Centralita Oficial de EAR OS (+34 693 693 048).
 * En cuentas verificadas de pago ('CLAIMED_PRO', 'SOVEREIGN_FOUNDER'), se devuelve
 * el teléfono operativo formateado con código de país.
 */
export function formatContactGatePhone(phone: string, tier: string): string {
  if (tier === 'DIRECTORY_UNCLAIMED') {
    return CENTRALITA_EAR_OS;
  }

  if (typeof phone !== 'string') return CENTRALITA_EAR_OS;
  const cleaned = phone.trim().replace(/[\s-]/g, '');

  if (!/^\+?[0-9]{9,15}$/.test(cleaned)) {
    return CENTRALITA_EAR_OS;
  }

  // Formato español estándar si son 9 dígitos o empieza con +34
  if (/^[6789][0-9]{8}$/.test(cleaned)) {
    return `+34 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
  }
  if (/^\+34[6789][0-9]{8}$/.test(cleaned)) {
    const local = cleaned.slice(3);
    return `+34 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
  }

  return cleaned;
}
