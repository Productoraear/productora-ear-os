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
  S_CLASS: 0.10,
  TIER_1: 0.08,
  TIER_2: 0.05,
  AMBASSADOR: 0.06
};

export function calculateDeterministicCommission(
  tier: AffiliateTier,
  baseEventAmount: number,
  isSecondaryEvent: boolean = false
): CommissionCalculationResult {
  const rate = TIER_RATES[tier] || 0.05;
  const primaryCommission = Number((baseEventAmount * rate).toFixed(2));
  const lifetimeBonus = isSecondaryEvent ? Number((baseEventAmount * 0.05).toFixed(2)) : 0;
  
  return {
    baseAmount: baseEventAmount,
    commissionRate: rate,
    commissionAmount: primaryCommission,
    lifetimeBonusAmount: lifetimeBonus,
    totalPayout: Number((primaryCommission + lifetimeBonus).toFixed(2))
  };
}

export function buildSovereignTrackingUrl(partnerSlug: string, customDomain: string = 'https://productoraear.com'): string {
  return `${customDomain}/proveedores?ref=${encodeURIComponent(partnerSlug)}`;
}

/* ------------------------------------------------------------------ */
/* Descuento Profesional S-Class (Organizadores / Wedding Planners)     */
/* ------------------------------------------------------------------ */

export type ProfessionalRole = 'WEDDING_PLANNER' | 'EVENT_ORGANIZER' | 'VENUE_COORDINATOR' | 'NOT_VERIFIED';

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

/**
 * Verifica la elegibilidad de un profesional del sector (organizadora de bodas,
 * wedding planner, coordinadora de eventos/recinto) para acceder al descuento.
 * La acreditación (proofProvided) es OBLIGATORIA: sin demostración no hay descuento.
 */
export function verifyProfessionalEligibility(role: string, proofProvided: boolean): boolean {
  const normalized = role.toLowerCase();
  const validRole =
    normalized.includes('wedding') ||
    normalized.includes('planner') ||
    normalized.includes('organizador') ||
    normalized.includes('organizadora') ||
    normalized.includes('coordinador') ||
    normalized.includes('coordinadora') ||
    normalized.includes('eventos') ||
    normalized.includes('boda');
  return validRole && proofProvided;
}

/**
 * Aplica el 5% de descuento profesional al total del presupuesto SOLO si
 * la acreditación es válida. Cero descuento sin verificación (regla inmutable).
 */
export function applyProfessionalDiscount(
  total: number,
  role: string,
  proofProvided: boolean
): ProfessionalDiscountResult {
  const isVerified = verifyProfessionalEligibility(role, proofProvided);
  const discountRate = isVerified ? PROFESSIONAL_DISCOUNT_RATE : 0;
  const discountAmount = Number((total * discountRate).toFixed(2));
  const professionalRole: ProfessionalRole = isVerified
    ? role.toLowerCase().includes('coord') || role.toLowerCase().includes('recinto')
      ? 'VENUE_COORDINATOR'
      : role.toLowerCase().includes('organizador') || role.toLowerCase().includes('organizadora')
        ? 'EVENT_ORGANIZER'
        : 'WEDDING_PLANNER'
    : 'NOT_VERIFIED';

  return {
    role: professionalRole,
    isVerified,
    requiresProof: true,
    originalTotal: Number(total.toFixed(2)),
    discountRate,
    discountAmount,
    discountedTotal: Number((total - discountAmount).toFixed(2))
  };
}
