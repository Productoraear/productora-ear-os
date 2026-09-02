export interface GeoLocation {
  id: string;
  name: string;
  cityName?: string;
  province: string;
  region: string;
  slug: string;
}

export interface SemanticSeed {
  coreTerm: string;
  modifiers: string[];
}

export interface SemanticPageData {
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  location?: GeoLocation;
}

export const GEO_DATABASE: Record<string, GeoLocation> = {
  madrid: { id: "1", name: "Madrid", cityName: "Madrid", province: "Madrid", region: "Comunidad de Madrid", slug: "madrid" },
  "el-escorial": { id: "2", name: "El Escorial", cityName: "El Escorial", province: "Madrid", region: "Comunidad de Madrid", slug: "el-escorial" },
  toledo: { id: "3", name: "Toledo", cityName: "Toledo", province: "Toledo", region: "Castilla-La Mancha", slug: "toledo" },
  mentrida: { id: "4", name: "Méntrida", cityName: "Méntrida", province: "Toledo", region: "Castilla-La Mancha", slug: "mentrida" },
  aranjuez: { id: "5", name: "Aranjuez", cityName: "Aranjuez", province: "Madrid", region: "Comunidad de Madrid", slug: "aranjuez" },
  "alcala-de-henares": { id: "6", name: "Alcalá de Henares", cityName: "Alcalá de Henares", province: "Madrid", region: "Comunidad de Madrid", slug: "alcala-de-henares" }
};

export function resolveGeoLocation(slugs: string[] | string): GeoLocation {
  const target = Array.isArray(slugs) ? slugs[slugs.length - 1] : slugs;
  if (!target) return { id: "0", name: "Madrid", cityName: "Madrid", province: "Madrid", region: "Comunidad de Madrid", slug: "madrid" };
  const normalized = target.toLowerCase().trim();
  if (GEO_DATABASE[normalized]) {
    return { ...GEO_DATABASE[normalized], cityName: GEO_DATABASE[normalized].name };
  }
  const formatted = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return {
    id: normalized,
    name: formatted,
    cityName: formatted,
    province: formatted,
    region: formatted,
    slug: normalized
  };
}

export function generateSemanticPageData(slugs: string[] | string): SemanticPageData {
  const geo = resolveGeoLocation(slugs);
  const locationName = geo ? geo.name : "España";
  
  return {
    title: `Productora EAR | Servicios de Eventos y Música en ${locationName}`,
    h1: `Producción de Eventos y Música en Directo en ${locationName}`,
    description: `Servicio integral de producción, fincas y música en directo para bodas y eventos en ${locationName}. Presupuestos transparentes.`,
    keywords: ["bodas", "musica en directo", "mariachis", "fincas", locationName],
    location: geo || undefined
  };
}

export const SECOND_SEED_BODAS: SemanticSeed = {
  coreTerm: "musica en directo para bodas",
  modifiers: [
    "mariachis",
    "protocolo musical",
    "canciones para banquetes",
    "sorpresas para novios",
    "presupuesto"
  ]
};

export function getSuperQuery(seed: SemanticSeed): string {
  return `${seed.coreTerm} (${seed.modifiers.join(', ')})`;
}
