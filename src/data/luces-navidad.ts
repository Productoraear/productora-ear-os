import demetrioData from './demetrio_luces_navidad_2025.json';

export interface ChristmasLightingProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  targetSector: string;
  description: string;
  priceNumeric: number | null;
  priceDisplay: string;
  unitType: string;
  powerWatts: number | null;
  weightKg: string | null;
  voltage: string;
  dimensions: string;
  ipRating: string;
  specialTransport: boolean;
  hasVideo: boolean;
  cataloguePage: number;
  provider: string;
  canonicalUrl: string;
}

export const CHRISTMAS_LIGHTING_PRODUCTS: ChristmasLightingProduct[] = demetrioData as ChristmasLightingProduct[];

export const CHRISTMAS_LIGHTING_CATEGORIES = [
  "Motivos 3D Gigantes",
  "Conos y Árboles Gigantes 3D",
  "Motivos Plásticos / Biodegradables",
  "Esferas 3D Plegables",
  "Árboles y Almendros LED",
  "Motivos 2D y Arcos de Calle",
  "Elementos Decorativos y Bolas",
  "Twinkly Pro Smart LED",
  "Guirnaldas Profesionales",
  "Cortinas y Mallas LED",
  "Accesorios y Montaje"
] as const;

/**
 * Obtener productos por categoría
 */
export function getChristmasProductsByCategory(category: string): ChristmasLightingProduct[] {
  return CHRISTMAS_LIGHTING_PRODUCTS.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Obtener productos destacados para Ayuntamientos / B2G (Pliegos LCSP)
 */
export function getB2GFeaturedLighting(): ChristmasLightingProduct[] {
  return CHRISTMAS_LIGHTING_PRODUCTS.filter(
    p => p.priceNumeric !== null && (p.priceNumeric >= 1000 || p.category.includes("3D") || p.category.includes("Arcos"))
  ).slice(0, 24);
}

/**
 * Obtener producto por SKU o ID
 */
export function getChristmasProductByIdOrSku(identifier: string): ChristmasLightingProduct | undefined {
  const norm = identifier.toLowerCase();
  return CHRISTMAS_LIGHTING_PRODUCTS.find(
    p => p.id.toLowerCase() === norm || p.sku.toLowerCase() === norm || p.canonicalUrl.endsWith(`/${norm}`)
  );
}
