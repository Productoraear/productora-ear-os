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
