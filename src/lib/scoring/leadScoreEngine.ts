/**
 * 🏛️ INSTITUTIONAL & B2G LEAD SCORE ENGINE (ART. 118 LCSP < 14.250 €)
 * Bloque B0.08 — Detección algorítmica de dominios gubernamentales y scoring de prioridad.
 */

export interface LeadInput {
  email?: string;
  phone?: string;
  name?: string;
  organizationName?: string;
  budgetEur?: number;
  isInstitutional?: boolean;
  eventDate?: string;
  province?: string;
  notes?: string;
}

export interface LeadScoreResult {
  score: number; // 0 - 100
  tier: 'CRITICAL_B2G' | 'VIP_PRIVATE' | 'STANDARD' | 'LOW';
  isGovDomain: boolean;
  govDomainDetected?: string;
  isContractorUnder15k: boolean;
  scoringFactors: string[];
  recommendedAction: string;
}

const GOV_DOMAIN_REGEX = /(?:\.gob\.es|\.es|ayto|ayuntamiento|diputacion|diputacio|junta|cabildo|consell|gobierno|madrid\.es|bcn\.cat|gencat\.cat|juntadeandalucia\.es)/i;

export function calculateLeadScore(input: LeadInput): LeadScoreResult {
  let score = 30; // Score base
  const factors: string[] = [];

  const email = (input.email || '').toLowerCase().trim();
  const org = (input.organizationName || '').toLowerCase();
  const notes = (input.notes || '').toLowerCase();
  const budget = Number(input.budgetEur || 0);

  // 1. Detección de dominio o entidad gubernamental / B2G
  const domainMatch = email.match(/@([\w.-]+\.[a-z]{2,})/i);
  const domain = domainMatch ? domainMatch[1] : '';

  const isGovDomain = GOV_DOMAIN_REGEX.test(domain) || GOV_DOMAIN_REGEX.test(org) || GOV_DOMAIN_REGEX.test(notes);

  if (isGovDomain) {
    score += 45;
    factors.push(`Dominio/Entidad Institucional B2G detectado: ${domain || org}`);
  }

  // 2. Encaje en Contrato Menor B2G (Art. 118 LCSP < 14.250 € sin IVA)
  const isContractorUnder15k = budget > 0 && budget <= 14250;
  if (isGovDomain && isContractorUnder15k) {
    score += 20;
    factors.push(`Presupuesto en rango de Adjudicación Directa B2G (${budget} € <= 14.250 €)`);
  } else if (budget >= 3000) {
    score += 15;
    factors.push(`Presupuesto alto (${budget} €)`);
  } else if (budget >= 350) {
    score += 10;
    factors.push(`Presupuesto estándar (${budget} €)`);
  }

  // 3. Teléfono verificado
  if (input.phone && input.phone.replace(/\D/g, '').length >= 9) {
    score += 10;
    factors.push('Teléfono de contacto verificado');
  }

  // 4. Ubicación prioritaria
  if (input.province && /(Madrid|Toledo|Guadalajara|Ciudad Real|Cuenca|Segovia|Ávila)/i.test(input.province)) {
    score += 5;
    factors.push(`Provincia de cobertura directa Hub Méntrida: ${input.province}`);
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let tier: LeadScoreResult['tier'] = 'STANDARD';
  let recommendedAction = 'Responder por email o WhatsApp estándar en < 24h.';

  if (finalScore >= 80 || isGovDomain) {
    tier = 'CRITICAL_B2G';
    recommendedAction = '🚨 ATENCIÓN INMEDIATA B2G: Llamar o enviar mensaje WhatsApp directo desde Centralita (+34 693 693 048) en < 15 min.';
  } else if (finalScore >= 65) {
    tier = 'VIP_PRIVATE';
    recommendedAction = '⭐ PRIORIDAD ALTA: Despachar propuesta formal con depósito Price-Lock 100 € en Stripe.';
  } else if (finalScore < 40) {
    tier = 'LOW';
    recommendedAction = 'Nivel de prioridad bajo. Enviar catálogo automatizado.';
  }

  return {
    score: finalScore,
    tier,
    isGovDomain,
    govDomainDetected: isGovDomain ? (domain || org) : undefined,
    isContractorUnder15k,
    scoringFactors: factors,
    recommendedAction
  };
}
