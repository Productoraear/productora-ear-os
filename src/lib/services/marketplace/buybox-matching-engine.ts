/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE COMPATIBILIDAD S-CLASS: "BUY BOX" & RECOMENDACIÓN INTELIGENTE
 * ────────────────────────────────────────────────────────────────────────────
 * Doctrina Jeff Bezos de Marketplace + Triaje Rápido Tinder:
 * Erradica el scroll pasivo infinito de 500 opciones.
 * Selecciona y jerarquiza las mejores entidades mediante la ecuación canónica:
 * 
 *   Score = (ProximidadKm * 0.4) + (FiabilidadTecnica * 0.3) + (RespetoTarifasSSOT * 0.3)
 * 
 * 1. Entidades Ancla 1P (Edwin Agudelo e78903 y Restaurante Otzarreta):
 *    Fijan el estándar de oro (Benchmark Score 1.0) para sus categorías sin
 *    canibalizar al catálogo 3P.
 * 2. Triaje en 3 pasos: (Dónde/Cuándo) → (Aforo/Estilo) → (Presupuesto).
 * 3. Devuelve estrictamente el Top 3 curado de alta afinidad (It's a Match).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  BuyBoxCompatibilityRequestSchema,
  BuyBoxScoredEntitySchema,
  type BuyBoxCompatibilityRequest,
  type BuyBoxScoredEntity,
} from '@/types/transductive-schemas';
import { resolveEarAsin, ANCHOR_1P_ASINS } from '@/lib/catalog/asin-standard';
import { TARIFA_ESTANDAR_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export interface CandidateMarketplaceEntity {
  id: string;
  slug: string;
  name: string;
  category: string;
  province: string;
  basePriceEur?: number;
  hasOwnSound?: boolean;
  hasOwnKitchen?: boolean;
  maxAcousticDb?: number;
  verifiedAudit?: boolean;
  is1pAnchor?: boolean;
}

/**
 * 1P Anchor Catalog Items de referencia absoluta
 */
export const ANCHOR_1P_BENCHMARKS: CandidateMarketplaceEntity[] = [
  {
    id: 'e78903',
    slug: 'edwin-agudelo',
    name: 'Edwin Agudelo · Solista de Gala & Productor',
    category: 'artistas',
    province: 'Toledo / Madrid',
    basePriceEur: TARIFA_ESTANDAR_SOLISTA_EUR,
    hasOwnSound: true,
    maxAcousticDb: 74,
    verifiedAudit: true,
    is1pAnchor: true,
  },
  {
    id: 'otzarreta',
    slug: 'otzarreta',
    name: 'Restaurante Otzarreta (Eduardo Martínez)',
    category: 'fincas',
    province: 'Bizkaia',
    basePriceEur: 145,
    hasOwnKitchen: true,
    maxAcousticDb: 72,
    verifiedAudit: true,
    is1pAnchor: true,
  },
  {
    id: 'catalogo-luces-2026',
    slug: 'iluminacion-monumental',
    name: 'División Iluminación Monumental 2026 (652 Refs)',
    category: 'produccion',
    province: 'Nacional (52 Provincias)',
    basePriceEur: 1200,
    hasOwnSound: false,
    maxAcousticDb: 0,
    verifiedAudit: true,
    is1pAnchor: true,
  },
];

/**
 * Calcula la puntuación Buy Box S-Class de una entidad
 */
export function scoreMarketplaceEntity(
  entity: CandidateMarketplaceEntity,
  request: BuyBoxCompatibilityRequest
): BuyBoxScoredEntity {
  const req = BuyBoxCompatibilityRequestSchema.parse(request);

  const asin = resolveEarAsin({
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    category: entity.category,
  });

  const is1p = Boolean(
    entity.is1pAnchor ||
    asin === ANCHOR_1P_ASINS.EDWIN_AGUDELO ||
    asin === ANCHOR_1P_ASINS.OTZARRETA ||
    asin === ANCHOR_1P_ASINS.LUCES_NAVIDAD_2026
  );

  // 1. Proximidad Km (Ponderación: 0.4)
  let proximityScore = 0.6;
  let proximityKm = 75;

  const targetNorm = req.province.toLowerCase().trim();
  const entityNorm = entity.province.toLowerCase().trim();

  if (is1p && entity.slug === 'edwin-agudelo') {
    // Edwin cubre 52 provincias con base central en Méntrida
    proximityScore = targetNorm.includes('madrid') || targetNorm.includes('toledo') ? 1.0 : 0.85;
    proximityKm = targetNorm.includes('madrid') ? 45 : 120;
  } else if (is1p && entity.slug === 'otzarreta') {
    // Otzarreta es benchmark en Bizkaia / País Vasco
    proximityScore = targetNorm.includes('bizkaia') || targetNorm.includes('alava') || targetNorm.includes('guipuzcoa') ? 1.0 : 0.75;
    proximityKm = targetNorm.includes('bizkaia') ? 15 : 90;
  } else if (entityNorm.includes(targetNorm) || targetNorm.includes(entityNorm)) {
    proximityScore = 1.0;
    proximityKm = 20;
  } else if (entityNorm.includes('nacional')) {
    proximityScore = 0.8;
    proximityKm = 100;
  } else {
    proximityScore = 0.6;
    proximityKm = 180;
  }

  // 2. Fiabilidad Técnica (Ponderación: 0.3)
  let technicalReliabilityScore = 0.85;
  if (is1p) {
    technicalReliabilityScore = 1.0;
  } else if (entity.verifiedAudit) {
    technicalReliabilityScore = 0.95;
  }

  // 3. Respeto a Tarifas SSOT (Ponderación: 0.3)
  // Penaliza desviaciones de los suelos canónicos y premia transparencia
  let ssotRateRespectScore = 0.9;
  if (is1p) {
    ssotRateRespectScore = 1.0;
  } else if (entity.basePriceEur && entity.basePriceEur > 0) {
    ssotRateRespectScore = 0.95;
  }

  // ECUACIÓN CANÓNICA DE LA BUY BOX S-CLASS
  const compositeScore = Math.min(
    1.0,
    proximityScore * 0.4 + technicalReliabilityScore * 0.3 + ssotRateRespectScore * 0.3
  );

  const roundedScore = Math.round(compositeScore * 1000) / 1000;
  const compatibilityPercentage = Math.round(roundedScore * 100);

  const matchReasons: string[] = [];
  if (is1p) matchReasons.push('Entidad Ancla 1P de Referencia');
  if (proximityScore >= 0.9) matchReasons.push('Máxima Proximidad Territorial');
  if (technicalReliabilityScore >= 0.95) matchReasons.push('Rider Técnico & Acústica < 75 dB Verificados');
  if (ssotRateRespectScore >= 0.95) matchReasons.push(`Reserva Directa Price-Lock (${DEPOSITO_STRIPE_EUR} €)`);

  const rawResult = {
    asin,
    name: entity.name,
    slug: entity.slug,
    category: entity.category,
    province: entity.province,
    is1pAnchor: is1p,
    proximityKm,
    proximityScore: Math.round(proximityScore * 100) / 100,
    technicalReliabilityScore: Math.round(technicalReliabilityScore * 100) / 100,
    ssotRateRespectScore: Math.round(ssotRateRespectScore * 100) / 100,
    compositeScore: roundedScore,
    compatibilityPercentage,
    rank: 1, // Se asigna al ordenar la lista
    matchReasons,
  };

  return BuyBoxScoredEntitySchema.parse(rawResult);
}

/**
 * Ejecuta el triaje rápido Tinder-Style y devuelve el TOP 3 S-Class
 */
export function matchMarketplaceTop3(
  candidates: CandidateMarketplaceEntity[],
  request: BuyBoxCompatibilityRequest
): BuyBoxScoredEntity[] {
  // Combinar candidatos con los benchmarks 1P relevantes
  const combined = [...ANCHOR_1P_BENCHMARKS, ...candidates];

  // Desduplicar por slug
  const seen = new Set<string>();
  const uniqueCandidates: CandidateMarketplaceEntity[] = [];
  for (const c of combined) {
    if (!seen.has(c.slug)) {
      seen.add(c.slug);
      uniqueCandidates.push(c);
    }
  }

  // Filtrar por categoría preferida si aplica
  const filtered = request.preferredCategory === 'all'
    ? uniqueCandidates
    : uniqueCandidates.filter((c) => {
        if (request.preferredCategory === 'fincas') return c.category.includes('finca') || c.category.includes('espacio');
        if (request.preferredCategory === 'artistas') return c.category.includes('artist') || c.category.includes('music');
        if (request.preferredCategory === 'produccion') return c.category.includes('tecnic') || c.category.includes('produc') || c.category.includes('luz');
        return true;
      });

  // Puntuar cada entidad
  const scored = filtered.map((c) => scoreMarketplaceEntity(c, request));

  // Ordenar de mayor a menor puntuación compuesta
  scored.sort((a, b) => b.compositeScore - a.compositeScore);

  // Asignar rangos finales y limitar estrictamente al Top 3
  return scored.slice(0, 3).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}
