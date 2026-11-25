/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS V2 — ESTÁNDAR "ASIN" DE CATÁLOGO DESACOPLADO (SINGLE SOURCE CATALOG)
 * ────────────────────────────────────────────────────────────────────────────
 * Doctrina Jeff Bezos de Marketplace & Caballo de Troya Bodas.net:
 * Cada proveedor, finca, artista o activo de iluminación posee una identidad
 * universal e inmutable (EAR_ASIN_ID).
 * 
 * Estructura Canónica:
 * EAR-ASIN-[CATEGORIA]-[IDENTIFICADOR_CANONICO]
 * Ejemplos:
 *   - Edwin Agudelo (1P Anchor Artista): EAR-ASIN-ART-E78903
 *   - Restaurante Otzarreta (1P Anchor Finca): EAR-ASIN-FNC-OTZARRETA
 *   - Catálogo Iluminación 2026 (1P Anchor Técnica): EAR-ASIN-TEC-LUCES2026
 *   - Proveedores 3P Bodas.net: EAR-ASIN-[CAT]-[HASH_DETERMINISTA]
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

export type AsinCategoryCode = 'ART' | 'FNC' | 'CAT' | 'TEC' | 'FOT' | 'B2G' | 'GEN';

export const AsinCategoryCodeSchema = z.enum(['ART', 'FNC', 'CAT', 'TEC', 'FOT', 'B2G', 'GEN']);

export const EarAsinSchema = z.string().regex(/^EAR-ASIN-[A-Z]{3}-[A-Z0-9_-]{3,64}$/, {
  message: 'Formato de ASIN inválido. Debe cumplir: EAR-ASIN-[CAT]-[IDENTIFICADOR]',
});

export type EarAsin = z.infer<typeof EarAsinSchema>;

/**
 * 1P Anchor Entities fijan el estándar de oro en el catálogo
 */
export const ANCHOR_1P_ASINS = Object.freeze({
  EDWIN_AGUDELO: 'EAR-ASIN-ART-E78903',
  OTZARRETA: 'EAR-ASIN-FNC-OTZARRETA',
  LUCES_NAVIDAD_2026: 'EAR-ASIN-TEC-LUCES2026',
  AYUNTAMIENTO_B2G: 'EAR-ASIN-B2G-LCSP118',
} as const);

/**
 * Mapeo de categorías y gremios a prefijos ASIN de 3 letras
 */
export function resolveCategoryCode(categoryOrGremio?: string): AsinCategoryCode {
  if (!categoryOrGremio) return 'GEN';
  const c = categoryOrGremio.toLowerCase();

  if (c.includes('music') || c.includes('artist') || c.includes('solista') || c.includes('mariachi') || c.includes('dj') || c.includes('orquesta') || c.includes('banda')) {
    return 'ART';
  }
  if (c.includes('finca') || c.includes('espacio') || c.includes('hotel') || c.includes('masia') || c.includes('pazo') || c.includes('salon') || c.includes('restaurante')) {
    return 'FNC';
  }
  if (c.includes('cater') || c.includes('gastro') || c.includes('banquete') || c.includes('comida')) {
    return 'CAT';
  }
  if (c.includes('tecnic') || c.includes('sonido') || c.includes('iluminac') || c.includes('luz') || c.includes('efecto') || c.includes('luces')) {
    return 'TEC';
  }
  if (c.includes('foto') || c.includes('video') || c.includes('cinema')) {
    return 'FOT';
  }
  if (c.includes('b2g') || c.includes('licit') || c.includes('ayuntam') || c.includes('public')) {
    return 'B2G';
  }
  return 'GEN';
}

/**
 * Generador determinista de ASIN
 */
export function generateEarAsin(categoryOrGremio: string, rawSlugOrId: string): string {
  const code = resolveCategoryCode(categoryOrGremio);
  const cleanId = rawSlugOrId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 32);

  // Check 1P Anchor Entities
  if (cleanId === 'E78903' || cleanId.includes('EDWIN')) return ANCHOR_1P_ASINS.EDWIN_AGUDELO;
  if (cleanId.includes('OTZARRETA')) return ANCHOR_1P_ASINS.OTZARRETA;
  if (cleanId.includes('LUCES') || cleanId.includes('NAVIDAD')) return ANCHOR_1P_ASINS.LUCES_NAVIDAD_2026;

  const asin = `EAR-ASIN-${code}-${cleanId || 'UNKNOWN'}`;
  return asin;
}

/**
 * Resolución polimórfica de ASIN para cualquier entidad del ecosistema
 */
export function resolveEarAsin(entity: {
  id?: string;
  slug?: string;
  asin?: string;
  category?: string;
  categoria?: string;
  gremio?: string;
  name?: string;
}): string {
  if (entity.asin && EarAsinSchema.safeParse(entity.asin).success) {
    return entity.asin;
  }

  const category = entity.category || entity.categoria || entity.gremio || '';
  const identifier = entity.slug || entity.id || entity.name || 'item';
  return generateEarAsin(category, identifier);
}

/**
 * Contrato Zod de Ficha de Catálogo ASIN
 */
export const AsinCatalogEntitySchema = z.object({
  asin: EarAsinSchema,
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  categoryCode: AsinCategoryCodeSchema,
  is1pAnchor: z.boolean().default(false),
  verifiedSsot: z.boolean().default(false),
  bodasNetNormalized: z.boolean().default(true),
  contactGateActive: z.boolean().default(true),
  fulfillmentGuaranteeReady: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AsinCatalogEntity = z.infer<typeof AsinCatalogEntitySchema>;
