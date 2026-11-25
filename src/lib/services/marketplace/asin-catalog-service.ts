/**
 * ════════════════════════════════════════════════════════════════════════════
 * SERVICIO DE CATÁLOGO DESACOPLADO (SINGLE SOURCE CATALOG SERVICE) · S-CLASS
 * ────────────────────────────────────────────────────────────────────────────
 * Doctrina Jeff Bezos de Marketplace:
 * Provee acceso desacoplado y estrictamente tipado al catálogo unificado
 * (1P Anchor + 3P Bodas.net Corpus Normalizado).
 * 
 * Funcionalidades:
 *   1. Normalización de identidades bajo EAR_ASIN_ID.
 *   2. Enriquecimiento progresivo para Call Center en /admin/proveedores
 *      sin romper el esquema Zod de 380 campos.
 *   3. Blindaje de Contact-Gate (Centralita +34 693 693 048).
 *   4. Adjunción automática de Garantías de Fulfillment y Buy Box scoring.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  resolveEarAsin,
  type AsinCatalogEntity,
  AsinCatalogEntitySchema,
  resolveCategoryCode,
} from '@/lib/catalog/asin-standard';
import {
  issueSovereignFulfillmentGuarantee,
} from '@/lib/services/marketplace/sovereign-fulfillment-service';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export interface ProviderCallCenterEnrichment {
  internalPhone?: string;
  socialWeb?: string;
  hallNotes?: string;
  lastUpdated?: string;
}

/**
 * Almacén en memoria persistible de enriquecimiento progresivo
 */
const ENRICHMENT_STORE = new Map<string, ProviderCallCenterEnrichment>();

/**
 * Normaliza y emite una entidad desacoplada de catálogo
 */
export function buildAsinCatalogEntity(raw: {
  id?: string;
  slug: string;
  name: string;
  category: string;
  is1pAnchor?: boolean;
  verifiedSsot?: boolean;
  metadata?: Record<string, unknown>;
}): AsinCatalogEntity {
  const asin = resolveEarAsin({
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
  });

  const categoryCode = resolveCategoryCode(raw.category);
  const enrichment = ENRICHMENT_STORE.get(raw.slug);

  const rawEntity = {
    asin,
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
    categoryCode,
    is1pAnchor: Boolean(raw.is1pAnchor),
    verifiedSsot: Boolean(raw.verifiedSsot || raw.is1pAnchor),
    bodasNetNormalized: true,
    contactGateActive: true,
    fulfillmentGuaranteeReady: true,
    metadata: {
      ...raw.metadata,
      centralitaOficial: CENTRALITA_EAR_OS,
      ...enrichment,
    },
  };

  return AsinCatalogEntitySchema.parse(rawEntity);
}

/**
 * Aplica enriquecimiento progresivo de Call Center sin romper contratos
 */
export function applyCallCenterEnrichment(
  slug: string,
  update: ProviderCallCenterEnrichment
): ProviderCallCenterEnrichment {
  const existing = ENRICHMENT_STORE.get(slug) || {};
  const merged: ProviderCallCenterEnrichment = {
    ...existing,
    ...update,
    lastUpdated: new Date().toISOString(),
  };
  ENRICHMENT_STORE.set(slug, merged);
  return merged;
}

/**
 * Obtiene los metadatos de enriquecimiento de una ficha
 */
export function getCallCenterEnrichment(slug: string): ProviderCallCenterEnrichment | null {
  return ENRICHMENT_STORE.get(slug) ?? null;
}

/**
 * Genera el paquete completo de Ficha + Garantía de Gala
 */
export function getDecoupledEntityWithFulfillment(raw: {
  id?: string;
  slug: string;
  name: string;
  category: string;
  province?: string;
  distanceKm?: number;
}) {
  const catalogEntity = buildAsinCatalogEntity(raw);
  const fulfillment = issueSovereignFulfillmentGuarantee({
    entityId: raw.id || raw.slug,
    entityName: raw.name,
    category: raw.category,
    province: raw.province,
    distanceKm: raw.distanceKm,
  });

  return {
    catalogEntity,
    fulfillment,
  };
}
