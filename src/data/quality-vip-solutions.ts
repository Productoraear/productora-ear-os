import vipCatalogData from './qualityvipsolutions_catalog.json';

export interface VipServiceProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  vehicle: string;
  capacityPax: string;
  duration: string;
  priceDisplay: string;
  priceNumeric: number;
  originalPrice?: number;
  description: string;
  specs: string[];
  image: string;
  availability: string;
  provider: string;
  canonicalUrl: string;
}

export const VIP_SERVICES: VipServiceProduct[] = vipCatalogData as VipServiceProduct[];

export const VIP_CATEGORIES = [
  "Disposiciones por Horas",
  "Transfers Aeropuerto",
  "Transfers Interurbanos",
  "Bodas & Eventos Sociales",
  "Producción & Backstage",
  "Concierge & Lifestyle",
  "Temporada Baleares & Costa del Sol"
] as const;

export const QUALITY_VIP_PROVIDER_INFO = {
  name: "QUALITY VIP SOLUTIONS, SL",
  cif: "B87910311",
  address: "Plaza Patricio Aguado 2, 1C, 28043 Madrid, España",
  phoneCentral: "+34 91 675 87 29",
  phoneMobile: "+34 682 141 077",
  email: "reservas@qualityvipsolutions.com",
  bases: ["Madrid", "Ibiza", "Marbella", "Valencia", "Barcelona"],
  fleet: [
    "Mercedes-Benz Clase S (Lujo & Representación)",
    "Mercedes-Benz Clase V Extra Larga (Minivan VIP 7 PAX)",
    "Mercedes-Benz Clase E (Business Executive)",
    "Mercedes-Maybach & SUV Premium (G-Class / Range Rover)",
    "Minibuses VIP 16-30 PAX"
  ]
};

/**
 * Obtener servicios VIP por categoría
 */
export function getVipServicesByCategory(category: string): VipServiceProduct[] {
  return VIP_SERVICES.filter(
    s => s.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Obtener servicio VIP por ID o canonical URL
 */
export function getVipServiceById(idOrUrl: string): VipServiceProduct | undefined {
  const norm = idOrUrl.toLowerCase().trim();
  return VIP_SERVICES.find(
    s => s.id.toLowerCase() === norm || s.canonicalUrl.toLowerCase() === norm || s.canonicalUrl.endsWith(`/${norm}`)
  );
}
