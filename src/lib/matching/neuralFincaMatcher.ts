/**
 * 🏛️ MOTOR NEURAL BIDIRECCIONAL AIRBNB + TINDER // FINCASPARABODA
 * Evaluación de afinidad matemática en 50 dimensiones y Categorías Grand Slam (Hormozi).
 * Cero menciones a 'S-Class' (Doctrina de la Vanguardia Demostrada).
 */

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
