/**
 * ════════════════════════════════════════════════════════════════════════════
 * 💍 EAR OS — FACETAS DEL ROSTER DE PROVEEDORES (CAPA PURA, CLIENTE + SERVIDOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Funciones puras y tipos del grid facetado de /bodas/[provincia]/[servicio].
 *
 * DOCTRINA DEL DATO VERIFICADO (CERO FACHADAS):
 *  - Solo se filtra por dimensiones con dato real presente en el proveedor:
 *    · Precio  → `priceRange` (string) parseado a número y clasificado en tier.
 *    · Momento → `category` mapeada a momentos del evento (heurística documentada).
 *  - NO se simulan calendarios (Fecha) ni coordenadas GPS (Radio). Esas facetas
 *    persisten en la URL y contextualizan el flujo, pero jamás filtran con datos
 *    inventados. La disponibilidad real vive en `atomicDateLockEngine` (Zona Cero).
 *
 * Este módulo usa SOLO imports de tipo → 0 dependencias en runtime → apto para
 * empaquetarse en el bundle del cliente sin arrastrar datasets geográficos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type {
  PriceTierId,
  WeddingMomentId,
  WeddingFacetState,
} from '@/lib/constants/wedding-taxonomy';

/** Tarjeta de proveedor enriquecida para el grid facetado (serializable). */
export interface WeddingProviderCardData {
  id: string;
  /** Slug canónico de la ficha /proveedores/[slug] (shaHash único → id). */
  slug: string;
  name: string;
  category: string;
  municipality: string | null;
  province: string;
  priceRange: string | null;
  /** Precio en euros parseado desde `priceRange`. null → sin dato fiable. */
  priceEur: number | null;
  /** Tier de UX derivado del ancla SSOT (clasificación, no motor financiero). */
  priceTier: PriceTierId | null;
  rating: number;
  description: string | null;
  imageUrl: string;
  /** Momentos del evento nupcial que sirve esta categoría. */
  momentIds: WeddingMomentId[];
}

const ALL_MOMENTS: readonly WeddingMomentId[] = [
  'ceremonia-civil',
  'coctel',
  'banquete',
  'barra-libre',
];

/**
 * Mapeo documentado categoría → momentos del evento (heurística de taxonomía).
 * No es un motor de dinero ni de disponibilidad: solo orienta el filtro de UX.
 */
const CATEGORY_MOMENT_MAP: Record<string, readonly WeddingMomentId[]> = {
  dj: ['barra-libre', 'banquete'],
  discoteca: ['barra-libre'],
  mariachi: ['ceremonia-civil', 'coctel', 'banquete'],
  mariachis: ['ceremonia-civil', 'coctel', 'banquete'],
  solista: ['ceremonia-civil', 'coctel'],
  solistas: ['ceremonia-civil', 'coctel'],
  musica: ['ceremonia-civil', 'coctel', 'banquete'],
  'musica-ceremonia': ['ceremonia-civil'],
  cuerda: ['ceremonia-civil'],
  cuerdas: ['ceremonia-civil'],
  sonido: ['banquete', 'barra-libre'],
  sonorizacion: ['banquete', 'barra-libre'],
  iluminacion: ['banquete', 'barra-libre'],
  'pantallas-led': ['banquete', 'barra-libre'],
  pantallas: ['banquete', 'barra-libre'],
  catering: ['coctel', 'banquete'],
  brasas: ['coctel', 'banquete'],
  finca: ['ceremonia-civil', 'coctel', 'banquete', 'barra-libre'],
  fincas: ['ceremonia-civil', 'coctel', 'banquete', 'barra-libre'],
  espacio: ['ceremonia-civil', 'coctel', 'banquete', 'barra-libre'],
  foto: ['ceremonia-civil', 'coctel', 'banquete'],
  fotografia: ['ceremonia-civil', 'coctel', 'banquete'],
  video: ['ceremonia-civil', 'coctel', 'banquete'],
  videografia: ['ceremonia-civil', 'coctel', 'banquete'],
  decoracion: ['ceremonia-civil', 'banquete'],
  flores: ['ceremonia-civil', 'banquete'],
  transporte: ['ceremonia-civil'],
  coches: ['ceremonia-civil'],
  animacion: ['barra-libre', 'banquete'],
  'hora-loca': ['barra-libre'],
  'wedding-planner': ['ceremonia-civil', 'coctel', 'banquete', 'barra-libre'],
  organizador: ['ceremonia-civil', 'coctel', 'banquete', 'barra-libre'],
};

/** Devuelve los momentos del evento que sirve una categoría de proveedor. */
export function getMomentsForCategory(category: string | null | undefined): WeddingMomentId[] {
  const key = (category ?? '').toLowerCase().trim();
  if (!key) return [...ALL_MOMENTS];

  const exact = CATEGORY_MOMENT_MAP[key];
  if (exact && exact.length > 0) return [...exact];

  // Coincidencia por subcadena para categorías compuestas ("dj-premium" → "dj").
  for (const [mapKey, moments] of Object.entries(CATEGORY_MOMENT_MAP)) {
    if (key.includes(mapKey)) return [...moments];
  }

  return [...ALL_MOMENTS];
}

/** Parsea el precio numérico de un `priceRange` (ej. "Desde 750 €" → 750). */
export function parsePriceEur(priceRange: string | null | undefined): number | null {
  if (!priceRange) return null;
  const match = priceRange.replace(/\./g, '').match(/\d+(?:,\d+)?/);
  if (!match) return null;
  const value = Number.parseFloat(match[0].replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

/**
 * Filtro puro del roster según facetas con dato real (Precio y Momento).
 * Fecha y Radio se gestionan en la capa UI como contexto de conversión,
 * nunca como filtro de disponibilidad o distancia simulados.
 */
export function filterWeddingProviders(
  cards: readonly WeddingProviderCardData[],
  facet: WeddingFacetState,
): WeddingProviderCardData[] {
  return cards.filter((card) => {
    if (facet.precio !== 'all') {
      if (card.priceTier === null) return false;
      if (card.priceTier !== facet.precio) return false;
    }

    if (facet.momento !== 'all' && !card.momentIds.includes(facet.momento as WeddingMomentId)) {
      return false;
    }

    return true;
  });
}
