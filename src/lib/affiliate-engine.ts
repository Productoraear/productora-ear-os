// EAR OS V2.4 // Deterministic Affiliate Engine

export type AffiliateTier = 'S_CLASS' | 'TIER_1' | 'TIER_2' | 'AMBASSADOR';

export interface CommissionCalculationResult {
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  lifetimeBonusAmount: number;
  totalPayout: number;
}

const TIER_RATES: Record<AffiliateTier, number> = {
  S_CLASS: 0.1,
  TIER_1: 0.08,
  TIER_2: 0.05,
  AMBASSADOR: 0.06,
};

const DEFAULT_TIER_RATE = 0.05;
const SECONDARY_EVENT_BONUS_RATE = 0.05;
const DEFAULT_CUSTOM_DOMAIN = 'https://productoraear.com';

export function calculateDeterministicCommission(
  tier: AffiliateTier,
  baseEventAmount: number,
  isSecondaryEvent: boolean = false,
): CommissionCalculationResult {
  const rate = TIER_RATES[tier] ?? DEFAULT_TIER_RATE;
  const primaryCommission = Number((baseEventAmount * rate).toFixed(2));
  const lifetimeBonus = isSecondaryEvent
    ? Number((baseEventAmount * SECONDARY_EVENT_BONUS_RATE).toFixed(2))
    : 0;

  return {
    baseAmount: baseEventAmount,
    commissionRate: rate,
    commissionAmount: primaryCommission,
    lifetimeBonusAmount: lifetimeBonus,
    totalPayout: Number((primaryCommission + lifetimeBonus).toFixed(2)),
  };
}

export function buildSovereignTrackingUrl(
  partnerSlug: string,
  customDomain: string = DEFAULT_CUSTOM_DOMAIN,
): string {
  return `${customDomain}/proveedores?ref=${encodeURIComponent(partnerSlug)}`;
}

/* ------------------------------------------------------------------ */
/* Descuento Profesional S-Class (Organizadores / Wedding Planners)     */
/* ------------------------------------------------------------------ */

export type ProfessionalRole =
  | 'WEDDING_PLANNER'
  | 'EVENT_ORGANIZER'
  | 'VENUE_COORDINATOR'
  | 'NOT_VERIFIED';

export const PROFESSIONAL_DISCOUNT_RATE = 0.05; // 5% al momento de pagar, con acreditación previa.

export interface ProfessionalDiscountResult {
  role: ProfessionalRole;
  isVerified: boolean;
  requiresProof: boolean;
  originalTotal: number;
  discountRate: number;
  discountAmount: number;
  discountedTotal: number;
}

const VALID_ROLE_KEYWORDS: readonly string[] = [
  'wedding',
  'planner',
  'organizador',
  'organizadora',
  'coordinador',
  'coordinadora',
  'eventos',
  'boda',
] as const;

/**
 * Verifica la elegibilidad de un profesional del sector (organizadora de bodas,
 * wedding planner, coordinadora de eventos/recinto) para acceder al descuento.
 * La acreditación (proofProvided) es OBLIGATORIA: sin demostración no hay descuento.
 */
export function verifyProfessionalEligibility(
  role: string,
  proofProvided: boolean,
): boolean {
  if (!proofProvided) {
    return false;
  }
  const normalized = role.toLowerCase();
  return VALID_ROLE_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function resolveProfessionalRole(role: string, isVerified: boolean): ProfessionalRole {
  if (!isVerified) {
    return 'NOT_VERIFIED';
  }
  const normalized = role.toLowerCase();
  if (normalized.includes('coord') || normalized.includes('recinto')) {
    return 'VENUE_COORDINATOR';
  }
  if (normalized.includes('organizador') || normalized.includes('organizadora')) {
    return 'EVENT_ORGANIZER';
  }
  return 'WEDDING_PLANNER';
}

/**
 * Aplica el 5% de descuento profesional al total del presupuesto SOLO si
 * la acreditación es válida. Cero descuento sin verificación (regla inmutable).
 */
export function applyProfessionalDiscount(
  total: number,
  role: string,
  proofProvided: boolean,
): ProfessionalDiscountResult {
  const isVerified = verifyProfessionalEligibility(role, proofProvided);
  const discountRate = isVerified ? PROFESSIONAL_DISCOUNT_RATE : 0;
  const discountAmount = Number((total * discountRate).toFixed(2));
  const professionalRole = resolveProfessionalRole(role, isVerified);

  return {
    role: professionalRole,
    isVerified,
    requiresProof: true,
    originalTotal: Number(total.toFixed(2)),
    discountRate,
    discountAmount,
    discountedTotal: Number((total - discountAmount).toFixed(2)),
  };
}