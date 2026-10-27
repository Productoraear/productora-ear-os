/**
 * ════════════════════════════════════════════════════════════════════════════
 * MATCHER DE PROVEEDORES POR SERVICIO · CAPA PURA (0-100 determinista)
 * ════════════════════════════════════════════════════════════════════════════
 * Responde a: "¿qué proveedor real cubre este servicio con ≥75 % de afinidad?".
 *
 * No inventa datos: puntúa EXCLUSIVAMENTE atributos publicados del Data Lake
 * (gremio, teléfono real, verificación, provincia, rating, reseñas, tarifa).
 *
 * Pesos (suman 130 → se normalizan a 100):
 *   · Encaje de gremio ............ 30
 *   · Contactabilidad real ........ 25
 *   · Encaje geográfico ........... 25
 *   · Reputación .................. 20
 *   · Encaje comercial ............ 20
 *   · Relevancia semántica ........ 10
 *
 * Regla de honestidad: si el proveedor no está verificado NI coincide de
 * provincia, su score se topa a 74 → nunca supera el umbral del 75 %.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { EdgeProviderRecord } from '@/lib/providers/edge-partition-loader';
import type { EventServiceDefinition } from '@/lib/events/event-service-catalog';

/** Umbral comercial exigido por dirección: 75 % mínimo. */
export const PROVIDER_MATCH_THRESHOLD = 75;

export interface EventBrief {
  /** Provincia objetivo en minúsculas (`madrid`, `toledo`, `guipuzcoa`…). */
  readonly province: string;
  /** Nº de invitados (dimensiona catering/finca). */
  readonly guests: number;
  /** Presupuesto global orientativo del evento en EUR. */
  readonly budgetEur: number;
  /** Fecha objetivo `YYYY-MM-DD` (para disponibilidad real por entidad). */
  readonly eventDate: string;
  /** Hora de inicio de la partida principal (`14:00` por defecto). */
  readonly timeSlot: string;
}

export interface ProviderMatch {
  readonly service: EventServiceDefinition;
  readonly provider: EdgeProviderRecord;
  /** Afinidad con el EVENTO (0-100). Es la que decide el umbral del 75 %. */
  readonly score: number;
  /** Afinidad + desempate por servicio (0-120). Solo ordena candidatos. */
  readonly rankingScore: number;
  readonly passesThreshold: boolean;
  readonly reasons: readonly string[];
  readonly warnings: readonly string[];
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/** Normaliza texto para comparación semántica (minúsculas, sin acentos). */
function normalizeText(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

const STOP_WORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'y', 'o', 'para', 'con', 'por', 'en', 'del', 'al',
  'un', 'una', 'unos', 'unas', 'que', 'se', 'su', 'sus', 'mas', 'menos',
]);

function tokenize(raw: string): readonly string[] {
  return normalizeText(raw)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function serviceRelevance(service: EventServiceDefinition, provider: EdgeProviderRecord): number {
  const serviceTokens = new Set(tokenize(service.name));
  const providerTokens = new Set(tokenize(`${provider.name} ${provider.description ?? ''}`));
  let overlap = 0;
  for (const token of serviceTokens) {
    if (providerTokens.has(token)) overlap += 1;
  }
  if (serviceTokens.size === 0) return 0;
  return clamp((overlap / serviceTokens.size) * 100);
}

function contactabilityScore(provider: EdgeProviderRecord): number {
  if (provider.verified && provider.hasRealPhone) return 100;
  if (provider.hasRealPhone) return 55;
  if (provider.verified) return 45;
  return 0;
}

/**
 * Zona de cobertura núcleo (Hub Méntrida · Madrid/Toledo y corona de Castilla).
 * Un proveedor de Madrid cubre Toledo con la misma viabilidad logística que uno
 * local: la regla de negocio S-Class trata este bloque como un único mercado.
 */
const CORE_HUB_PROVINCES = new Set([
  'madrid',
  'toledo',
  'guadalajara',
  'segovia',
  'avila',
  'cuenca',
  'ciudad-real',
  'ciudadreal',
  'albacete',
]);

function geoScore(brief: EventBrief, provider: EdgeProviderRecord): number {
  const target = brief.province.trim().toLowerCase();
  const providerProvince = provider.province?.trim().toLowerCase() ?? '';
  if (!providerProvince) return 45;
  if (providerProvince === target) return 100;
  if (providerProvince.includes(target) || target.includes(providerProvince)) return 100;
  if (CORE_HUB_PROVINCES.has(target) && CORE_HUB_PROVINCES.has(providerProvince)) return 85;
  return 25;
}

function reputationScore(provider: EdgeProviderRecord): number {
  const rating = provider.rating;
  const reviews = provider.reviewsCount ?? 0;
  if (rating === null || rating <= 0) return reviews > 0 ? 40 : 25;
  const normalized = clamp(((rating - 3) / 2) * 100);
  const reviewBoost =
    reviews >= 100 ? 100 : reviews >= 30 ? 80 : reviews >= 10 ? 60 : reviews > 0 ? 45 : 30;
  return clamp(normalized * 0.7 + reviewBoost * 0.3);
}

function commercialScore(service: EventServiceDefinition, provider: EdgeProviderRecord): number {
  const reference = service.marketReferenceEur;
  const price = provider.basePrice;

  // Sin dato de tarifa no se penaliza: el dato ausente no es un defecto.
  if (price === null || price <= 0) return 55;
  if (reference <= 0) return 60;
  // Referencias < 500 € son por comensal/unidad: no comparables con tarifas globales.
  if (reference < 500) return 60;

  const ratio = price / reference;
  if (ratio >= 0.5 && ratio <= 1.5) return 100;
  if (ratio >= 0.3 && ratio < 0.5) return 75;
  if (ratio > 1.5 && ratio <= 2.5) return 70;
  return 40;
}

/** Evalúa la afinidad de un proveedor real con un servicio concreto. */
export function scoreProviderForService(
  service: EventServiceDefinition,
  provider: EdgeProviderRecord,
  brief: EventBrief,
): ProviderMatch {
  const reasons: string[] = [];
  const warnings: string[] = [];

  const categoryFit = provider.category === service.providerCategory ? 100 : 0;
  if (categoryFit === 100) reasons.push(`Gremio correcto (${service.providerCategory})`);

  const contact = contactabilityScore(provider);
  if (contact === 100) reasons.push('Teléfono real verificado');
  else if (provider.hasRealPhone) warnings.push('Teléfono sin verificación SSOT');
  else warnings.push('Sin teléfono real atribuible');

  const geo = geoScore(brief, provider);
  if (geo === 100) reasons.push(`Cobertura en ${brief.province}`);
  else if (geo === 45) warnings.push('Provincia no declarada');
  else warnings.push(`Provincia distinta (${provider.province ?? 'n/d'})`);

  const reputation = reputationScore(provider);
  if ((provider.rating ?? 0) >= 4.5) reasons.push(`Reputación ${provider.rating}★`);

  const commercial = commercialScore(service, provider);
  const relevance = serviceRelevance(service, provider);

  /**
   * GATE (0-100): afinidad del proveedor con el EVENTO. Es estable por gremio
   * y es la única cifra que decide si supera el umbral del 75 %.
   * Los factores por-servicio (encaje comercial y relevancia semántica) solo
   * ordenan candidatos: si se usaran como puerta, un proveedor excelente caería
   * del carrito por una diferencia de 1 punto en el nombre del servicio.
   */
  const gate =
    (categoryFit * 30 + contact * 25 + geo * 25 + reputation * 20) / 100;

  /** BONUS (0-20): desempate fino entre proveedores del mismo gremio. */
  const bonus = (commercial * 10 + relevance * 10) / 100;

  let score = clamp(gate);
  const rankingScore = Math.round((score + bonus) * 100) / 100;

  // Regla de honestidad: sin verificación NI cobertura geográfica, nunca ≥75.
  if (!(provider.verified && provider.hasRealPhone) && geo < 100) {
    score = Math.min(score, PROVIDER_MATCH_THRESHOLD - 1);
    warnings.push('Afinidad topada: falta verificación o cobertura geográfica');
  }

  return {
    service,
    provider,
    score,
    rankingScore,
    passesThreshold: score >= PROVIDER_MATCH_THRESHOLD,
    reasons,
    warnings,
  };
}

/**
 * Selecciona el mejor proveedor para un servicio.
 * Desempate determinista: mayor score → verificado → mejor rating → slug (a-z).
 */
export function matchServiceToProviders(
  service: EventServiceDefinition,
  providers: readonly EdgeProviderRecord[],
  brief: EventBrief,
): ProviderMatch | null {
  const ranked = rankProvidersForService(service, providers, brief, 1);
  return ranked[0] ?? null;
}

/** Top-N proveedores por servicio (alternativas para la UI). */
export function rankProvidersForService(
  service: EventServiceDefinition,
  providers: readonly EdgeProviderRecord[],
  brief: EventBrief,
  limit = 3,
): readonly ProviderMatch[] {
  const candidates = providers.filter(
    (provider) => provider.category === service.providerCategory,
  );
  if (candidates.length === 0) return [];

  return candidates
    .map((provider) => scoreProviderForService(service, provider, brief))
    .sort((a, b) => {
      if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
      if (b.score !== a.score) return b.score - a.score;
      const verifiedDelta = Number(b.provider.verified) - Number(a.provider.verified);
      if (verifiedDelta !== 0) return verifiedDelta;
      const ratingDelta = (b.provider.rating ?? 0) - (a.provider.rating ?? 0);
      if (ratingDelta !== 0) return ratingDelta;
      return a.provider.slug.localeCompare(b.provider.slug);
    })
    .slice(0, Math.max(1, limit));
}
