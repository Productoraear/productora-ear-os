import catalog2026Data from './luces_navidad_2026_ear.json';

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
  ledColor?: string;
  ipRating: string;
  material?: string;
  specialTransport: boolean;
  hasVideo: boolean;
  cataloguePage: number;
  provider: string;
  canonicalUrl: string;
  image?: string;
}

/**
 * Catálogo Oficial 2026 EAR OS Vampirizado al 100% (530 Productos, 497 Precios Exactos, 196 Páginas)
 */
export const CHRISTMAS_LIGHTING_PRODUCTS: ChristmasLightingProduct[] = catalog2026Data as ChristmasLightingProduct[];

export const CHRISTMAS_LIGHTING_CATEGORIES = [
  "Motivos 3D Gigantes",
  "Motivos 2D y Arcos de Calle",
  "Iluminación de Farolas y Columnas",
  "Guirnaldas, Cortinas y Cielo LED",
  "Árboles Gigantes y Estructuras Cónicas",
  "Portales y Esculturas Transitables"
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
 * Obtener productos destacados para Ayuntamientos / B2G (Pliegos LCSP < 14.250€)
 */
export function getB2GFeaturedLighting(): ChristmasLightingProduct[] {
  return CHRISTMAS_LIGHTING_PRODUCTS.filter(
    p => p.priceNumeric !== null && (p.priceNumeric >= 250 || p.category.includes("3D") || p.category.includes("Arcos"))
  ).slice(0, 36);
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
