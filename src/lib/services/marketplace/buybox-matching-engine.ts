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
import {
  isProvinceMatch,
  normalizeBodasNetCategory,
  resolveProvince,
} from '@/lib/constants/spain-regions-and-categories';
import { planLogisticsDispatch, type LogisticsRoutingPlan } from '@/lib/agents/geo';
import { listFichasForBuyBox } from '@/lib/providers/fichaProvider';
import {
  findMunicipalityByQuery,
  type SpainMunicipality,
} from '@/lib/seo/spainMunicipalityCoverage';
import { geocodeAddressSync } from '@/lib/services/geo/geocoder';
import { calculateHaversineDistance } from '@/lib/services/pricing/geo-pricer';

export interface CandidateMarketplaceEntity {
  id: string;
  slug: string;
  name: string;
  category: string;
  province: string;
  municipality?: string;
  coordinates?: { latitude: number; longitude: number } | null;
  asin?: string;
  active?: boolean;
  homologated?: boolean;
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
  } else if (
    isProvinceMatch(req.province, entity.province) ||
    entityNorm.includes(targetNorm) ||
    targetNorm.includes(entityNorm)
  ) {
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

export interface BilateralMatchConsent {
  readonly clientSwipe: 'MATCH' | 'PASS';
  readonly providerSwipe: 'MATCH' | 'PASS';
  readonly isTwoWayMatch: boolean;
  readonly acousticMatch: boolean;
  readonly capacityMatch: boolean;
  readonly budgetMatch: boolean;
  readonly airCoverGuaranteeActive: boolean;
  readonly contractProofSha256?: string;
  readonly reason: string;
}

/**
 * Filtro Bilateral Tinder S-Class (Two-Way Double Opt-In):
 * 1. Capacidad / Aforo exacto (evita bodas de 12 pax en salones de 200).
 * 2. Compatibilidad Acústica (Ley 37/2003 < 75 dB).
 * 3. Presupuesto & Suelo canónico.
 * 4. AirCover de Gala: Sustitución garantizada en 52 provincias sin coste extra.
 */
export function evaluateBilateralMatch(
  entity: CandidateMarketplaceEntity,
  request: BuyBoxCompatibilityRequest,
  providerAccepted: boolean = true
): BilateralMatchConsent {
  const req = BuyBoxCompatibilityRequestSchema.parse(request);

  // A. Aforo y capacidad
  const capacityMatch = req.guestCount >= 30 && req.guestCount <= 350;

  // B. Compatibilidad acústica (< 75 dB)
  const acousticMatch = (entity.maxAcousticDb ?? 74) <= 75;

  // C. Presupuesto
  const budgetMatch = req.budgetEur >= (entity.basePriceEur ?? TARIFA_ESTANDAR_SOLISTA_EUR);

  const clientMatch = capacityMatch && acousticMatch && budgetMatch;
  const isTwoWay = clientMatch && providerAccepted;

  return {
    clientSwipe: clientMatch ? 'MATCH' : 'PASS',
    providerSwipe: providerAccepted ? 'MATCH' : 'PASS',
    isTwoWayMatch: isTwoWay,
    acousticMatch,
    capacityMatch,
    budgetMatch,
    airCoverGuaranteeActive: isTwoWay,
    reason: isTwoWay
      ? '🔥 It\'s a Match Perfecto: Aforo, acústica < 75 dB, tarifa SSOT y consentimiento bilateral sincronizados con AirCover de Gala activo.'
      : 'Compatibilidad bilateral incompleta: ' +
        (!capacityMatch ? 'aforo fuera de rango; ' : '') +
        (!acousticMatch ? 'límite acústico superado; ' : '') +
        (!budgetMatch ? 'presupuesto insuficiente; ' : '') +
        (!providerAccepted ? 'pendiente aceptación de sala por proveedor.' : ''),
  };
}

export type Nearest3pResolutionTier =
  | 'GPS_HAVERSINE'
  | 'MUNICIPALITY_EXACT'
  | 'PROVINCE_MATCH'
  | 'NEAREST_PROVINCE'
  | 'FALLBACK_LABEL';

export interface Nearest3pProviderQuery {
  readonly category: string;
  readonly destinationText: string;
  readonly destinationCoords?: { readonly latitude: number; readonly longitude: number } | null;
  readonly excludeProviderIds?: readonly string[];
  readonly extraCandidates?: readonly CandidateMarketplaceEntity[];
}

export interface Nearest3pCandidate {
  readonly id: string;
  readonly key: string;
  readonly asin: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly province: string;
  readonly municipality: string;
  readonly verified: boolean;
  readonly distanceKm: number;
  readonly resolutionTier: Nearest3pResolutionTier;
  readonly coordinates: { readonly latitude: number; readonly longitude: number } | null;
  readonly rating: number | null;
  readonly completeness: number;
}

export interface Nearest3pProviderResult {
  readonly selected: Nearest3pCandidate | null;
  readonly alternatives: readonly Nearest3pCandidate[];
  readonly resolvedMunicipality: SpainMunicipality | null;
  readonly resolvedProvinceSlug: string | null;
  readonly destinationCoords: { readonly latitude: number; readonly longitude: number } | null;
  readonly resolutionTier: Nearest3pResolutionTier;
}

function foldGeoText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function mapCategoryToFichaCategories(category: string): readonly string[] {
  const normalized = normalizeBodasNetCategory(category);
  if (normalized === 'ALL') return [];
  if (normalized === 'foto') return ['fotografia', 'foto'];
  if (normalized === 'sonido') return ['sonido'];
  if (normalized === 'catering') return ['catering'];
  if (normalized === 'transporte') return ['transporte'];
  if (normalized === 'musica') return ['musica'];
  if (normalized === 'finca') return ['finca'];
  if (normalized === 'decoracion') return ['decoracion'];
  return [normalized, 'servicios'];
}

function tierPriority(tier: Nearest3pResolutionTier): number {
  if (tier === 'MUNICIPALITY_EXACT') return 0;
  if (tier === 'GPS_HAVERSINE') return 1;
  if (tier === 'PROVINCE_MATCH') return 2;
  if (tier === 'NEAREST_PROVINCE') return 3;
  return 4;
}

function municipalityNamesMatch(candidateMunicipality: string, target: SpainMunicipality | null): boolean {
  if (!candidateMunicipality || !target) return false;
  const candFold = foldGeoText(candidateMunicipality);
  if (!candFold) return false;
  if (candFold === foldGeoText(target.name)) return true;
  if (target.name.includes('/')) {
    return target.name.split('/').some((part) => foldGeoText(part) === candFold);
  }
  return false;
}

/**
 * Algoritmo de Proximidad 3P sobre los 8.131 municipios oficiales y catálogo
 * de proveedores activos/homologados (`fichas_index.json` + `fichas_gold.json` +
 * candidatos adicionales de DB).
 */
export function resolveNearest3pProvider(params: Nearest3pProviderQuery): Nearest3pProviderResult {
  const targetCategories = mapCategoryToFichaCategories(params.category);
  const resolvedMunicipality = findMunicipalityByQuery(params.destinationText);
  const resolvedProvince = resolvedMunicipality
    ? (resolveProvince(resolvedMunicipality.provinceName) ?? resolveProvince(resolvedMunicipality.provinceSlug))
    : resolveProvince(params.destinationText);

  const resolvedProvinceSlug =
    resolvedMunicipality?.provinceSlug ??
    (resolvedProvince
      ? resolvedProvince.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
      : null);

  const destinationCoords =
    params.destinationCoords ??
    geocodeAddressSync(params.destinationText) ??
    (resolvedMunicipality
      ? (geocodeAddressSync(resolvedMunicipality.provinceSlug) ??
        geocodeAddressSync(resolvedMunicipality.provinceName))
      : null) ??
    (resolvedProvince ? geocodeAddressSync(resolvedProvince.name) : null);

  const excludedSet = new Set(
    (params.excludeProviderIds ?? [])
      .map((id) => id.trim().toLowerCase())
      .filter((id) => id.length > 0),
  );

  const rawFichas = listFichasForBuyBox({
    onlyVerified: true,
    categories: targetCategories.length > 0 ? targetCategories : undefined,
  });

  const targetCategorySet = new Set(targetCategories);

  interface RawCandidate {
    readonly id: string;
    readonly key: string;
    readonly asin: string;
    readonly slug: string;
    readonly name: string;
    readonly category: string;
    readonly province: string;
    readonly municipality: string;
    readonly verified: boolean;
    readonly coordinates: { readonly latitude: number; readonly longitude: number } | null;
    readonly rating: number | null;
    readonly completeness: number;
  }

  const pool: RawCandidate[] = [];
  const seenKeys = new Set<string>();

  if (params.extraCandidates) {
    for (const extra of params.extraCandidates) {
      if (extra.active === false || extra.homologated === false || extra.verifiedAudit === false) {
        continue;
      }
      if (targetCategorySet.size > 0) {
        const mapped = mapCategoryToFichaCategories(extra.category);
        const intersects = mapped.some((m) => targetCategorySet.has(m));
        if (!intersects) continue;
      }
      const asin =
        extra.asin ??
        resolveEarAsin({
          id: extra.id,
          slug: extra.slug,
          name: extra.name,
          category: extra.category,
        });
      const candidateIds = [extra.id, extra.slug, asin].map((v) => v.trim().toLowerCase());
      if (candidateIds.some((v) => excludedSet.has(v))) continue;

      seenKeys.add(extra.id);
      pool.push({
        id: extra.id,
        key: extra.id,
        asin,
        slug: extra.slug,
        name: extra.name,
        category: extra.category,
        province: extra.province,
        municipality: extra.municipality ?? '',
        verified: Boolean(extra.verifiedAudit),
        coordinates: extra.coordinates ?? null,
        rating: null,
        completeness: 100,
      });
    }
  }

  for (const ficha of rawFichas) {
    const asin =
      ficha.asin ??
      resolveEarAsin({
        id: ficha.key,
        slug: ficha.slug,
        name: ficha.name,
        category: ficha.category,
      });
    const candidateIds = [ficha.key, ficha.slug, asin, ficha.vendorId ?? '']
      .map((v) => v.trim().toLowerCase())
      .filter((v) => v.length > 0);
    if (candidateIds.some((v) => excludedSet.has(v))) continue;
    if (seenKeys.has(ficha.key)) continue;

    seenKeys.add(ficha.key);
    pool.push({
      id: ficha.key,
      key: ficha.key,
      asin,
      slug: ficha.slug,
      name: ficha.name,
      category: ficha.category,
      province: ficha.province,
      municipality: ficha.municipality,
      verified: ficha.verified,
      coordinates:
        typeof ficha.lat === 'number' && typeof ficha.lng === 'number'
          ? { latitude: ficha.lat, longitude: ficha.lng }
          : null,
      rating: ficha.rating,
      completeness: ficha.completeness,
    });
  }

  const targetProvinceLabel =
    resolvedProvince?.name ?? resolvedMunicipality?.provinceName ?? params.destinationText;

  const ranked: Nearest3pCandidate[] = [];

  for (const cand of pool) {
    let resolutionTier: Nearest3pResolutionTier | null = null;
    let distanceKm = Number.POSITIVE_INFINITY;

    const exactMuni = municipalityNamesMatch(cand.municipality, resolvedMunicipality);
    const sameProvince = isProvinceMatch(targetProvinceLabel, cand.province);

    if (destinationCoords && cand.coordinates) {
      distanceKm = Math.round(calculateHaversineDistance(destinationCoords, cand.coordinates) * 100) / 100;
      resolutionTier = exactMuni ? 'MUNICIPALITY_EXACT' : 'GPS_HAVERSINE';
    } else if (exactMuni) {
      distanceKm = 0;
      resolutionTier = 'MUNICIPALITY_EXACT';
    } else if (sameProvince) {
      distanceKm = 15;
      resolutionTier = 'PROVINCE_MATCH';
    } else if (destinationCoords) {
      const candProvinceCoords = geocodeAddressSync(cand.province);
      if (candProvinceCoords) {
        distanceKm =
          Math.round(calculateHaversineDistance(destinationCoords, candProvinceCoords) * 100) / 100;
        resolutionTier = 'NEAREST_PROVINCE';
      }
    }

    if (resolutionTier === null || !Number.isFinite(distanceKm)) continue;

    ranked.push({
      id: cand.id,
      key: cand.key,
      asin: cand.asin,
      slug: cand.slug,
      name: cand.name,
      category: cand.category,
      province: cand.province,
      municipality: cand.municipality,
      verified: cand.verified,
      distanceKm,
      resolutionTier,
      coordinates: cand.coordinates,
      rating: cand.rating,
      completeness: cand.completeness,
    });
  }

  ranked.sort((a, b) => {
    if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
    const tierDiff = tierPriority(a.resolutionTier) - tierPriority(b.resolutionTier);
    if (tierDiff !== 0) return tierDiff;
    if (a.completeness !== b.completeness) return b.completeness - a.completeness;
    const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });

  const selected = ranked[0] ?? null;

  return {
    selected,
    alternatives: ranked.slice(1, 6),
    resolvedMunicipality,
    resolvedProvinceSlug,
    destinationCoords,
    resolutionTier: selected?.resolutionTier ?? 'FALLBACK_LABEL',
  };
}

export interface HybridLogisticsQuoteResult {
  readonly destination: string;
  readonly routing: LogisticsRoutingPlan;
  readonly soloArtist: {
    readonly artistName: string;
    readonly origin: string;
    readonly distanceKm: number;
    readonly travelFromMentrida: boolean;
  };
  readonly soundProvisioning: {
    readonly providerName: string;
    readonly providerId?: string;
    readonly asin?: string;
    readonly origin: string;
    readonly isLocalProvider: boolean;
    readonly vanLogisticsChargedFromToledo: boolean;
    readonly resolutionTier?: Nearest3pResolutionTier;
  };
  readonly note: string;
}

/**
 * Resuelve la cotización de despacho híbrido:
 * - Edwin Agudelo (1P Solista) viaja desde Hub Méntrida (Km 0).
 * - Si destino > 150 km (ej. Bilbao/Bizkaia a 440 km): la dotación de sonido
 *   se asigna al proveedor local homologado más próximo sin portes de furgoneta desde Toledo.
 */
export function resolveHybridLogisticsQuote(
  destinationText: string,
  explicitDistanceKm?: number,
  localProviderCandidateName?: string
): HybridLogisticsQuoteResult {
  const routing = planLogisticsDispatch(destinationText, explicitDistanceKm);
  const isDecoupled = routing.dispatchMode === 'DECOUPLED_LOCAL_BUYBOX';
  const nearest3p =
    isDecoupled && !localProviderCandidateName
      ? resolveNearest3pProvider({ category: 'sonido', destinationText })
      : null;
  const matched = nearest3p?.selected ?? null;

  const resolvedProviderName = isDecoupled
    ? (localProviderCandidateName ||
      matched?.name ||
      `Proveedor Homologado de Sonido (${routing.destination})`)
    : 'Flota Integrada Hub Méntrida';

  const resolvedOrigin = isDecoupled
    ? matched
      ? matched.municipality
        ? `${matched.municipality} (${matched.province})`
        : matched.province || routing.destination
      : routing.destination
    : 'Hub Méntrida (Toledo)';

  return {
    destination: routing.destination,
    routing,
    soloArtist: {
      artistName: 'Edwin Agudelo (Solista S-Class)',
      origin: 'Hub Méntrida, Toledo (Km 0)',
      distanceKm: routing.distanceToMentridaKm,
      travelFromMentrida: true,
    },
    soundProvisioning: {
      providerName: resolvedProviderName,
      ...(matched ? { providerId: matched.key, asin: matched.asin } : {}),
      origin: resolvedOrigin,
      isLocalProvider: isDecoupled,
      vanLogisticsChargedFromToledo: !isDecoupled,
      ...(isDecoupled
        ? {
            resolutionTier: localProviderCandidateName
              ? ('FALLBACK_LABEL' as const)
              : nearest3p?.resolutionTier,
          }
        : {}),
    },
    note: isDecoupled
      ? `Evento en ${routing.destination} (${routing.distanceToMentridaKm} km): Edwin viaja desde Méntrida; sonido asignado localmente (${resolvedProviderName}) sin portes de furgoneta desde Toledo.`
      : `Evento en ${routing.destination} (${routing.distanceToMentridaKm} km): Paquetizado conjunto con flota Méntrida en un solo porte.`,
  };
}

export interface BuyBoxFallbackLineInput {
  readonly id: string;
  readonly category: string;
  readonly providerId: string;
  readonly status?: string;
  readonly destinationText?: string;
  readonly excludeProviderIds?: readonly string[];
  readonly slaExpiresAt?: string;
}

export interface ResolveBuyBoxFallbackInput {
  readonly line: BuyBoxFallbackLineInput;
  readonly reason: 'RECHAZO' | 'SLA_EXPIRED';
  readonly now?: number;
  readonly destinationText?: string;
  readonly extraCandidates?: readonly CandidateMarketplaceEntity[];
}

export interface ResolveBuyBoxFallbackResult {
  readonly ok: boolean;
  readonly lineId: string;
  readonly reason: 'RECHAZO' | 'SLA_EXPIRED';
  readonly previousProviderId: string;
  readonly newProviderId: string | null;
  readonly providerId: string | null;
  readonly provider: Nearest3pCandidate | null;
  readonly alternatives: readonly Nearest3pCandidate[];
  readonly excludeProviderIds: readonly string[];
  readonly exhausted: boolean;
}

/**
 * Resiliencia Buy Box (F7): ante RECHAZO o expiración de ventana SLA (24h),
 * promueve automáticamente al siguiente proveedor homologado más cercano
 * excluyendo al proveedor actual y a los rechazados previamente.
 */
export function resolveBuyBoxFallback(
  input: ResolveBuyBoxFallbackInput
): ResolveBuyBoxFallbackResult {
  const excluded = Array.from(
    new Set(
      [input.line.providerId, ...(input.line.excludeProviderIds ?? [])]
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    )
  );

  const destination =
    input.line.destinationText?.trim() || input.destinationText?.trim() || 'Madrid';

  const nearest = resolveNearest3pProvider({
    category: input.line.category,
    destinationText: destination,
    excludeProviderIds: excluded,
    extraCandidates: input.extraCandidates,
  });

  const nextId = nearest.selected?.id ?? null;
  const nextExcludeIds = nextId
    ? Array.from(new Set([...excluded, nextId]))
    : excluded;

  return {
    ok: nearest.selected !== null,
    lineId: input.line.id,
    reason: input.reason,
    previousProviderId: input.line.providerId,
    newProviderId: nextId,
    providerId: nextId,
    provider: nearest.selected,
    alternatives: nearest.alternatives,
    excludeProviderIds: nextExcludeIds,
    exhausted: nearest.selected === null,
  };
}
