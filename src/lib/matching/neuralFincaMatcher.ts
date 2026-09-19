/**
 * 🏛️ MOTOR NEURAL BIDIRECCIONAL AIRBNB + TINDER // FINCASPARABODA
 * Evaluación de afinidad matemática en 50 dimensiones y Categorías Grand Slam (Hormozi).
 * Cero menciones a 'S-Class' (Doctrina de la Vanguardia Demostrada).
 */

import {
  CALIBRATION_DIMENSIONS,
  COUPLE_TO_PROVIDER_PAIRS,
  NEUTRAL_SELECT_VALUES,
  getDimensionById,
  type BilateralMatchResult,
  type CalibrationDimension,
  type CoupleCalibration,
  type DimensionMatchDetail,
  type DimensionType,
  type DimensionValue,
  type ProviderCalibration
} from './calibratorTypes';

export interface HormoziCategory {
  id: string;
  slug: string;
  title: string;
  headline: string;
  subtitle: string;
  badge: string;
  icon: string;
  accentColor: string;
}

export const HORMOZI_GRAND_SLAM_CATEGORIES: HormoziCategory[] = [
  {
    id: 'cat-exclusividad-fin-de-semana',
    slug: 'exclusividad-fin-de-semana',
    title: 'Colección Privada 1 Boda/Fin de Semana',
    headline: 'Exclusividad Absoluta Sin Prisas',
    subtitle: 'Solo 1 evento por fin de semana. Montaje desde el viernes y fiesta hasta el amanecer.',
    badge: '1 Boda / 48h',
    icon: '👑',
    accentColor: '#ecb613'
  },
  {
    id: 'cat-palacios-historicos',
    slug: 'palacios-historicos',
    title: 'Palacios & Castillos con Validez Legal',
    headline: 'Ceremonia Real e Inmortal',
    subtitle: 'Espacios monumentales protegidos con firma notarial o concejal in situ y salones abovedados.',
    badge: 'Patrimonio Histórico',
    icon: '🏰',
    accentColor: '#e0a82e'
  },
  {
    id: 'cat-oasis-botanicos-invernaderos',
    slug: 'oasis-botanicos-invernaderos',
    title: 'Oasis Botánicos & Invernaderos 360°',
    headline: 'Garantía Lluvia Cero & Luz Natural',
    subtitle: 'Estructuras de cristal climatizadas rodeadas de jardines centenarios. Plan B sin carpas provisionales.',
    badge: 'Plan B Blindado',
    icon: '🌿',
    accentColor: '#10b981'
  },
  {
    id: 'cat-bodegas-vinedos-autor',
    slug: 'bodegas-vinedos-autor',
    title: 'Bodegas Centenarias & Viñedos de Autor',
    headline: 'Gastronomía de Cosecha & Esencia',
    subtitle: 'Cenas entre barricas francesas y catas privadas de gala bajo atardeceres dorados.',
    badge: 'Enoturismo de Gala',
    icon: '🍷',
    accentColor: '#9333ea'
  },
  {
    id: 'cat-panoramicas-sin-limite',
    slug: 'panoramicas-sin-limite',
    title: 'Vistas Panorámicas & Fiesta Sin Toque de Queda',
    headline: 'Cóctel en el Horizonte & Salón Insonorizado',
    subtitle: 'Retirada a sala acoplada con limitador acústico calibrado para bailar hasta que salga el sol.',
    badge: 'Hasta las 6:00 AM',
    icon: '🌅',
    accentColor: '#00E5FF'
  },
  {
    id: 'cat-finca-con-alojamiento-48h',
    slug: 'finca-con-alojamiento-48h',
    title: 'Fincas con Alojamiento para 30+ Invitados',
    headline: 'Tu Boda de Fin de Semana Completo',
    subtitle: 'Habitaciones de ensueño para tus familiares directos. Desayuno y piscina al día siguiente.',
    badge: 'Alojamiento In Situ',
    icon: '💎',
    accentColor: '#f59e0b'
  }
];

export interface CouplePreferences {
  guestCount: number;
  totalBudget: number;
  preferredProvince: string;
  atmosphereTag?: string;
  requiresAccommodation?: boolean;
  requiresCivilLegalInSitu?: boolean;
  requiresOwnKitchen?: boolean;
  requiresAllNightParty?: boolean;
  maxMenuBudget?: number;
  allowsMusicCanon?: boolean;
}

export interface FincaNeuralSpecs {
  id: string;
  name: string;
  province: string;
  address?: string;
  basePrice?: number; // Menú o precio base por persona
  rentalFee?: number; // Alquiler íntegro
  capacidadMaxPax?: number;
  capacidadMinPax?: number;
  hasOwnKitchen?: boolean;
  hasAccommodation?: boolean;
  accommodationPax?: number;
  hasCivilLegalCeremony?: boolean;
  hasConsecratedChapel?: boolean;
  maxPartyHour?: string; // ej "05:00"
  hasAcousticLimiterCert?: boolean;
  musicCanonEur?: number;
  photoCanonEur?: number;
  categorySlug?: string;
  atmosphereTags?: string[];
  rating?: number;
  reviewsCount?: number;
}

export interface MatchScoreResult {
  score: number; // 0 a 100
  affinityTier: 'EXACT_MATCH' | 'HIGH_COMPATIBILITY' | 'POTENTIAL_FIT' | 'DISMISSED';
  strengths: string[];
  warnings: string[];
  estimatedTotalWithCanons: number;
  costPerGuestEur: number;
}

/**
 * ⚡ Algoritmo de compatibilidad neural multidimensional
 */
export function calculateNeuralMatchScore(
  finca: FincaNeuralSpecs,
  couple: CouplePreferences
): MatchScoreResult {
  let score = 100;
  const strengths: string[] = [];
  const warnings: string[] = [];

  // 1. AFINO DE AFORO (Peso: 25%)
  const maxPax = finca.capacidadMaxPax || 350;
  const minPax = finca.capacidadMinPax || 60;
  if (couple.guestCount > maxPax) {
    score -= 40;
    warnings.push(`Capacidad máxima superada (${maxPax} pax vs ${couple.guestCount} invitados)`);
  } else if (couple.guestCount < minPax) {
    score -= 25;
    warnings.push(`No alcanza el aforo mínimo sugerido (${minPax} pax)`);
  } else {
    strengths.push(`Aforo ideal para ${couple.guestCount} comensales (margen ${minPax}-${maxPax})`);
  }

  // 2. PRESUPUESTO Y SOBRECOSTES OCULTOS (Peso: 30%)
  const menuPrice = finca.basePrice || 120;
  const rentalFee = finca.rentalFee || 0;
  const musicCanon = finca.musicCanonEur || 0;
  const photoCanon = finca.photoCanonEur || 0;

  const estimatedTotal = (menuPrice * couple.guestCount) + rentalFee + musicCanon + photoCanon;
  const costPerGuest = Math.round(estimatedTotal / Math.max(couple.guestCount, 1));

  if (couple.totalBudget > 0) {
    if (estimatedTotal > couple.totalBudget * 1.15) {
      score -= 30;
      warnings.push(`Supera el presupuesto objetivo en un ${Math.round(((estimatedTotal - couple.totalBudget) / couple.totalBudget) * 100)}%`);
    } else if (estimatedTotal <= couple.totalBudget) {
      strengths.push(`Presupuesto en rango óptimo (~${costPerGuest} €/invitado con cánones incluidos)`);
    }
  }

  // 3. CANONES Y PENALIZACIONES DE PROVEEDORES
  if (musicCanon > 0) {
    warnings.push(`Aplica canon de música externa (${musicCanon} €) salvo homologación`);
    if (couple.allowsMusicCanon === false) {
      score -= 15;
    }
  } else {
    strengths.push('Libertad de música en vivo sin canon de exclusividad');
  }

  if (photoCanon > 0) {
    warnings.push(`Canon de fotógrafo ajeno: ${photoCanon} €`);
  }

  // 4. ALOJAMIENTO IN SITU
  if (couple.requiresAccommodation) {
    if (finca.hasAccommodation && (finca.accommodationPax || 0) >= 10) {
      strengths.push(`Alojamiento para ${finca.accommodationPax} personas in situ`);
      score += 5;
    } else {
      score -= 20;
      warnings.push('Alojamiento in situ limitado o no disponible');
    }
  }

  // 5. CEREMONIA CIVIL LEGAL
  if (couple.requiresCivilLegalInSitu) {
    if (finca.hasCivilLegalCeremony) {
      strengths.push('Ceremonia civil con validez legal oficial in situ');
    } else {
      score -= 15;
      warnings.push('Ceremonia in situ únicamente simbólica');
    }
  }

  // 6. COCINA PROPIA VS CATERING
  if (couple.requiresOwnKitchen) {
    if (finca.hasOwnKitchen) {
      strengths.push('Cocina propia y brigada de fogones in situ');
    } else {
      score -= 10;
      warnings.push('Servicio mediante catering homologado transportado');
    }
  }

  // 7. TOQUE DE QUEDA / HORARIO DE FIESTA
  if (couple.requiresAllNightParty) {
    const partyHour = finca.maxPartyHour || '05:00';
    if (partyHour >= '05:00' || partyHour === '06:00') {
      strengths.push(`Fin de fiesta extendido hasta las ${partyHour}`);
    } else {
      score -= 15;
      warnings.push(`Cierre obligatorio temprano (${partyHour})`);
    }
  }

  // Normalización final (0 - 100)
  const finalScore = Math.max(10, Math.min(100, Math.round(score)));

  let affinityTier: MatchScoreResult['affinityTier'] = 'POTENTIAL_FIT';
  if (finalScore >= 90) affinityTier = 'EXACT_MATCH';
  else if (finalScore >= 75) affinityTier = 'HIGH_COMPATIBILITY';
  else if (finalScore < 50) affinityTier = 'DISMISSED';

  return {
    score: finalScore,
    affinityTier,
    strengths,
    warnings,
    estimatedTotalWithCanons: Math.round(estimatedTotal),
    costPerGuestEur: costPerGuest
  };
}

/* ═══════════════════════════════════════════════════════════════════
   🏛️ MOTOR BILATERAL 200 DIMENSIONES — Finca ↔ Pareja
   Score Bilateral = (coupleScore × 0.5) + (providerScore × 0.5)
   Knockout ⇒ Score 0 inmediato. Visibilidad ⇒ >= 65. WhatsApp ⇒ >= 85.
   ═══════════════════════════════════════════════════════════════════ */

const clampScore = (n: number, lo = 0, hi = 100): number =>
  Math.max(lo, Math.min(hi, Math.round(n)));

function isBlankDimensionValue(v: DimensionValue): boolean {
  return v === undefined || v === null || v === '';
}

function isNeutralSelectValue(v: DimensionValue): boolean {
  return typeof v === 'string' && NEUTRAL_SELECT_VALUES.has(v);
}

function matchDimensionValues(
  coupleValue: DimensionValue,
  providerValue: DimensionValue,
  type: DimensionType,
  dimension: Pick<CalibrationDimension, 'min' | 'max'>
): number {
  if (isBlankDimensionValue(coupleValue)) return 100;
  if (isNeutralSelectValue(coupleValue)) return 100;
  if (isBlankDimensionValue(providerValue)) return 50;

  switch (type) {
    case 'toggle': {
      if (coupleValue === true) return providerValue === true ? 100 : 0;
      return 100; // La pareja no lo exige
    }

    case 'select': {
      if (String(coupleValue) === String(providerValue)) return 100;
      return 30;
    }

    case 'multi-select': {
      const c = Array.isArray(coupleValue) ? coupleValue.map(String) : [];
      const p = Array.isArray(providerValue) ? providerValue.map(String) : [];
      if (c.length === 0) return 100;
      if (p.length === 0) return 20;
      const overlap = c.filter((x) => p.includes(x)).length;
      if (overlap === 0) return 10;
      return clampScore((overlap / Math.min(c.length, 3)) * 100);
    }

    case 'scale': {
      const c = Number(coupleValue);
      const p = Number(providerValue);
      if (!Number.isFinite(c) || !Number.isFinite(p)) return 50;
      const min = dimension.min ?? 1;
      const max = dimension.max ?? 5;
      return clampScore(100 - (Math.abs(c - p) / Math.max(max - min, 1)) * 100);
    }

    case 'slider': {
      const c = Number(coupleValue);
      const p = Number(providerValue);
      if (!Number.isFinite(c) || !Number.isFinite(p)) return 50;
      const min = dimension.min ?? 0;
      const max = dimension.max ?? 100;
      return clampScore(100 - (Math.abs(c - p) / Math.max(max - min, 1)) * 100);
    }

    case 'date':
    case 'text':
    default:
      return 50;
  }
}

export interface BilateralMatchInput {
  coupleCalibration: CoupleCalibration;
  providerCalibration: ProviderCalibration;
  /** Invitados declarados por la pareja (fuera de las 100 dimensiones de pareja) */
  guestCount: number;
  /** Presupuesto total declarado por la pareja (€) */
  totalBudget: number;
  /** ¿La pareja abonó el micro-depósito de 1 € verificado? */
  hasVerifiedDeposit: boolean;
  /** ¿La pareja confirmó fecha de boda? */
  hasConfirmedDate: boolean;
}

export function calculateBilateralMatch(input: BilateralMatchInput): BilateralMatchResult {
  const {
    coupleCalibration,
    providerCalibration,
    guestCount,
    totalBudget,
    hasVerifiedDeposit,
    hasConfirmedDate
  } = input;

  const breakdown: DimensionMatchDetail[] = [];
  const coupleStrengths: string[] = [];
  const warnings: string[] = [];
  const knockouts: string[] = [];

  /* ── LADO PAREJA (100 dimensiones) sobre contraparte de la finca ── */
  const coupleDims = CALIBRATION_DIMENSIONS.filter((d) => d.side === 'couple');
  let coupleWeightedSum = 0;
  let coupleTotalWeight = 0;

  for (const cDim of coupleDims) {
    const coupleValue = coupleCalibration.dimensions[cDim.id];
    const providerId = COUPLE_TO_PROVIDER_PAIRS[cDim.id];
    const providerDim = providerId != null ? getDimensionById(providerId) : undefined;
    const providerValue =
      providerId != null ? providerCalibration.dimensions[providerId] ?? undefined : undefined;

    if (isBlankDimensionValue(coupleValue)) {
      breakdown.push({
        dimensionId: cDim.id,
        label: cDim.label,
        coupleValue: null,
        providerValue: providerValue ?? null,
        matchPercent: 100,
        isKnockout: cDim.isKnockout,
        passed: true
      });
      continue;
    }

    const matchPercent = matchDimensionValues(coupleValue, providerValue, cDim.type, cDim);
    const passed = matchPercent >= 100;

    if (cDim.isKnockout && matchPercent < 100) {
      knockouts.push(cDim.label);
      warnings.push(`${cDim.label}: requisito no cubierto por la finca`);
    } else if (providerDim && matchPercent >= 80) {
      coupleStrengths.push(cDim.label);
    } else if (providerDim && matchPercent < 50) {
      warnings.push(`${cDim.label}: afinidad baja (${matchPercent}%)`);
    }

    breakdown.push({
      dimensionId: cDim.id,
      label: cDim.label,
      coupleValue,
      providerValue: providerValue ?? null,
      matchPercent,
      isKnockout: cDim.isKnockout,
      passed
    });

    coupleWeightedSum += matchPercent * cDim.weight;
    coupleTotalWeight += cDim.weight;
  }

  const coupleScore =
    coupleTotalWeight > 0 ? clampScore(coupleWeightedSum / coupleTotalWeight) : 50;

  /* ── LADO PROVEEDOR / FINCA (compuertas de negocio) ── */
  const providerStrengths: string[] = [];
  let providerScore = 100;

  const dim = (id: number): DimensionValue => providerCalibration.dimensions[id];
  const num = (id: number, fallback: number): number => {
    const v = dim(id);
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const bool = (id: number): boolean => dim(id) === true;

  const maxPax = num(114, 600);
  const minPax = num(113, 0);
  const sweetSpot = num(115, guestCount);
  const ticketMin = num(101, 0);
  const ticketMax = num(102, 999999);
  const menuAdult = num(103, 120);
  const minBudgetGate = num(194, 0);
  const minGuestsGate = num(195, 0);

  const penalizeProvider = (amount: number, reason: string, isKnockout = false) => {
    providerScore = Math.max(0, providerScore - amount);
    warnings.push(reason);
    if (isKnockout) knockouts.push(reason);
  };

  // 1. Aforo máximo legal — knockout duro
  if (maxPax > 0 && guestCount > maxPax) {
    penalizeProvider(
      100,
      `Aforo máximo legal superado (${guestCount} pax vs ${maxPax} pax)`,
      true
    );
  } else if (minPax > 0 && guestCount < minPax) {
    penalizeProvider(40, `No alcanza el aforo mínimo rentable (${guestCount} pax vs ${minPax} pax)`);
  } else if (guestCount <= 60 && !bool(116)) {
    penalizeProvider(20, 'La pareja es íntima (<60 pax) y la finca no acepta bodas íntimas');
  } else if (guestCount > 300 && !bool(117)) {
    penalizeProvider(20, 'La pareja supera 300 pax y la finca no admite multitudinarias');
  } else {
    providerStrengths.push(`Aforo admitido: ${guestCount} pax dentro de rango ${minPax}-${maxPax}`);
  }

  // 2. Sweet spot
  const sweetDelta = Math.abs(guestCount - sweetSpot);
  const sweetPenalty = Math.min(30, Math.round((sweetDelta / Math.max(sweetSpot, 1)) * 100));
  if (sweetPenalty > 0) {
    penalizeProvider(sweetPenalty, `Distancia al aforo sweet spot de ${sweetSpot} pax`);
  } else {
    providerStrengths.push(`Aforo en sweet spot exacto (${sweetSpot} pax)`);
  }

  // 3. Ticket económico
  if (totalBudget > 0) {
    if (totalBudget < ticketMin) {
      penalizeProvider(35, `Presupuesto declarado (${totalBudget} €) por debajo del ticket mínimo (${ticketMin} €)`);
    } else if (totalBudget > ticketMax) {
      penalizeProvider(10, `Presupuesto declarado (${totalBudget} €) muy por encima del ticket máximo`);
    } else {
      providerStrengths.push(`Presupuesto en ticket óptimo (${ticketMin}-${ticketMax} €)`);
    }

    const statedPerGuest = totalBudget / Math.max(guestCount, 1);
    if (menuAdult > 0 && statedPerGuest < menuAdult * 0.85) {
      penalizeProvider(15, `Ratio presupuesto/invitado (${Math.round(statedPerGuest)} €) por debajo del menú de ${menuAdult} €/pax`);
    }
  }

  // 4. Filtro anti-lead-basura
  if (minBudgetGate > 0 && totalBudget < minBudgetGate) {
    penalizeProvider(
      100,
      `Presupuesto declarado (${totalBudget} €) menor que el filtro anti-lead (${minBudgetGate} €)`,
      true
    );
  }
  if (minGuestsGate > 0 && guestCount < minGuestsGate) {
    penalizeProvider(
      100,
      `Invitados declarados (${guestCount}) menores que el filtro anti-lead (${minGuestsGate})`,
      true
    );
  }
  if (bool(191) && !hasVerifiedDeposit) {
    penalizeProvider(
      100,
      'La finca solo acepta leads con depósito 1 € verificado y esta pareja no lo ha abonado',
      true
    );
  }
  if (bool(192) && !hasConfirmedDate) {
    penalizeProvider(
      100,
      'La finca solo acepta leads con fecha confirmada y esta pareja no tiene fecha fija',
      true
    );
  }

  providerScore = clampScore(providerScore);

  /* ── FUSIÓN BILATERAL ── */
  const bilateralRaw = clampScore(coupleScore * 0.5 + providerScore * 0.5);
  const bilateralScore = knockouts.length > 0 ? 0 : bilateralRaw;

  let affinityTier: BilateralMatchResult['affinityTier'] = 'POTENTIAL_FIT';
  if (bilateralScore >= 85) affinityTier = 'EXACT_MATCH';
  else if (bilateralScore >= 65) affinityTier = 'HIGH_COMPATIBILITY';
  else if (bilateralScore >= 50) affinityTier = 'POTENTIAL_FIT';
  else affinityTier = 'DISMISSED';

  const rentalFee = num(105, 0);
  const estimatedTotalEur = Math.round(menuAdult * guestCount + rentalFee);
  const costPerGuestEur = clampScore(estimatedTotalEur / Math.max(guestCount, 1));

  return {
    coupleScore,
    providerScore,
    bilateralScore,
    affinityTier,
    coupleStrengths,
    providerStrengths,
    warnings,
    knockouts,
    estimatedTotalEur,
    costPerGuestEur,
    dimensionBreakdown: breakdown
  };
}
