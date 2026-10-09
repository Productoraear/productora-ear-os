// src/lib/navigation/canonical-taxonomy.ts
//
// SSOT ÚNICO DE TAXONOMÍA DE NAVEGACIÓN (pSEO / AEO / Search Intent).
// Propósito: consolidar todas las fuentes de verdad dispersas que hoy generan
// slugs incoherentes (dj, dj-premium, dj-eventos, mariachi-gala,
// edwin-agudelo-mariachi-6, bodas-lujo, sonorizacion-eventos, etc.) en un único
// vocabulario canónico alineado con la intención de búsqueda real capturada en
// Search Console.
//
// Reglas de negocio (INMUTABLES):
//   - 52 provincias canónicas (PROVINCIAS_52_GRAPH).
//   - Servicios canónicos alineados a queries con impresiones reales
//     (dj para bodas, mariachis + ciudad, alquiler pantallas led, wedding planner,
//      catering, fotógrafo, coches de boda, fincas, decoración, etc.).
//   - Cualquier slug legacy se normaliza y se sirve con 301 hacia el canónico.

import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { MUNICIPALITIES_DATASET } from '@/lib/constants/spanish-municipalities';
import type { GremioId } from '@/lib/seo/searchIntentEngine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. PROVINCIAS CANÓNICAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CANONICAL_PROVINCE_SLUGS: Set<string> = new Set(Object.keys(PROVINCIAS_52_GRAPH));

export function isCanonicalProvinceSlug(slug: string): boolean {
    return CANONICAL_PROVINCE_SLUGS.has(slug.toLowerCase());
}

interface ProvinceAlias {
    province: string;
    /** Municipio canónico asociado (omitido si el alias es la propia capital). */
    municipality?: string;
}

// Alias manuales para ciudades/capitales que NO coinciden con su slug de provincia
// (pamplona -> navarra, bilbao -> vizcaya, etc.) o errores de escritura.
const PROVINCE_ALIASES: Record<string, ProvinceAlias> = {
    'coruna': { province: 'a-coruna' },
    'la-coruna': { province: 'a-coruna' },
    'a-coru-a': { province: 'a-coruna' },
    'pamplona': { province: 'navarra' },
    'bilbao': { province: 'vizcaya' },
    'san-sebastian': { province: 'guipuzcoa' },
    'donostia': { province: 'guipuzcoa' },
    'vitoria': { province: 'alava' },
    'vitoria-gasteiz': { province: 'alava' },
    'logrono': { province: 'la-rioja' },
    'oviedo': { province: 'asturias' },
    'gijon': { province: 'asturias', municipality: 'gijon' },
    'santander': { province: 'cantabria' },
    'palma': { province: 'baleares' },
    'palma-de-mallorca': { province: 'baleares' },
    'vigo': { province: 'pontevedra', municipality: 'vigo' },
    'santiago': { province: 'a-coruna', municipality: 'santiago-de-compostela' },
    'jerez': { province: 'cadiz', municipality: 'jerez-de-la-frontera' },
    'getxo': { province: 'vizcaya', municipality: 'getxo' },
};

// Mapa inverso municipio -> provincia (auto-construido desde el dataset).
const MUNICIPALITY_TO_PROVINCE: Record<string, string> = {};
for (const [province, towns] of Object.entries(MUNICIPALITIES_DATASET)) {
    for (const town of towns) {
        if (!MUNICIPALITY_TO_PROVINCE[town.slug]) {
            MUNICIPALITY_TO_PROVINCE[town.slug] = province;
        }
    }
}

export interface ResolvedSegment {
    /** Provincia canónica o null si el segmento no es reconocible. */
    province: string | null;
    /** Municipio canónico si el segmento era una ciudad (no una provincia). */
    municipality: string | null;
}

/**
 * Resuelve el primer segmento de una ruta geo (provincia o ciudad) a su
 * provincia canónica. Devuelve además el municipio si el segmento era una ciudad.
 */
export function resolveGeoSegment(segment: string): ResolvedSegment {
    const seg = segment.toLowerCase().trim();
    if (!seg) return { province: null, municipality: null };

    if (CANONICAL_PROVINCE_SLUGS.has(seg)) {
        return { province: seg, municipality: null };
    }

    const alias = PROVINCE_ALIASES[seg];
    if (alias) {
        return { province: alias.province, municipality: alias.municipality ?? seg };
    }

    const province = MUNICIPALITY_TO_PROVINCE[seg];
    if (province) {
        return { province, municipality: seg };
    }

    return { province: null, municipality: null };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. SERVICIOS CANÓNICOS (ALINEADOS A INTENCIÓN DE BÚSQUEDA REAL)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CanonicalService {
    slug: string;
    label: string;
    aliases: string[];
    basePrice: number;
    /** Gremio del motor de intención legacy para renderizar pain points / dream outcome correctos. */
    intentGremio: GremioId;
}

export const CANONICAL_SERVICES: CanonicalService[] = [
    { slug: 'dj', label: 'DJ para Bodas', basePrice: 450, intentGremio: 'dj', aliases: ['dj-bodas', 'dj-eventos', 'dj-premium', 'djs-bodas', 'disc-jockey', 'dj-evento', 'dj-boda'] },
    { slug: 'mariachis', label: 'Mariachis', basePrice: 750, intentGremio: 'mariachis', aliases: ['mariachi', 'mariachi-gala', 'mariachi-boda', 'mariachis-boda', 'serenatas-aniversarios', 'serenata', 'edwin-agudelo-mariachi-6'] },
    { slug: 'wedding-planner', label: 'Wedding Planner', basePrice: 600, intentGremio: 'fincas', aliases: ['wedding-planners', 'wedding-planning', 'organizador-bodas', 'organizacion-bodas', 'organizadora-bodas'] },
    { slug: 'fotografia', label: 'Fotografía y Vídeo de Boda', basePrice: 850, intentGremio: 'animacion', aliases: ['fotografo-boda', 'fotografos-bodas', 'video-boda', 'videografo-bodas', 'foto-video', 'produccion-audiovisual'] },
    { slug: 'coches-boda', label: 'Coches de Boda y Chófer', basePrice: 500, intentGremio: 'coches-clasicos', aliases: ['coches-de-boda', 'coche-boda', 'coches-clasicos', 'chofer-vip', 'chofer-bodas', 'alquiler-coches-con-conductor'] },
    { slug: 'catering', label: 'Catering para Bodas', basePrice: 45, intentGremio: 'catering-brasas', aliases: ['catering-brasas', 'catering-gourmet', 'catering-boda', 'catering-bodas', 'catering-evento'] },
    { slug: 'decoracion', label: 'Decoración de Bodas', basePrice: 500, intentGremio: 'fincas', aliases: ['decoracion-espacios', 'decoracion-bodas', 'decoracion', 'decoracion-eventos'] },
    { slug: 'fincas', label: 'Fincas para Bodas', basePrice: 1200, intentGremio: 'fincas', aliases: ['finca', 'fincas', 'fincas-boda', 'hacienda'] },
    { slug: 'sonorizacion', label: 'Sonido e Iluminación', basePrice: 650, intentGremio: 'sonido-iluminacion', aliases: ['sonido-iluminacion', 'sonorizacion-eventos', 'sonorizacion-boda', 'alquiler-sonido', 'sonido', 'iluminacion', 'iluminacion-espectacular', 'sonido-bose', 'sonido-profesional'] },
    { slug: 'pantallas-led', label: 'Alquiler de Pantallas LED', basePrice: 250, intentGremio: 'pantallas-led', aliases: ['alquiler-pantallas-led', 'pantalla-led', 'pantallas', 'led', 'pantallas-led'] },
    { slug: 'animacion', label: 'Animación para Bodas', basePrice: 500, intentGremio: 'animacion', aliases: ['animacion-bodas', 'animacion-infantil', 'hora-loca', 'animacion'] },
    { slug: 'musica-ceremonia', label: 'Música en Directo para la Ceremonia', basePrice: 350, intentGremio: 'solistas', aliases: ['musica-bodas', 'musica-directo', 'solistas', 'solista-premium', 'solista', 'cuarteto-cuerdas', 'cuarteto', 'cuerdas', 'edwin-agudelo-solista', 'bodas-lujo'] },
    { slug: 'maestros-ceremonia', label: 'Maestros de Ceremonia', basePrice: 600, intentGremio: 'dj', aliases: ['maestros-de-ceremonia', 'maestro-ceremonias', 'oficiante-bodas', 'ceremoniante'] },
    { slug: 'produccion-integral', label: 'Producción Integral de Bodas', basePrice: 950, intentGremio: 'fincas', aliases: ['eventos', 'produccion-integral', 'full-production', 'banda-monumental', 'configurador-bespoke', 'bodas', 'innovacion-social'] },
];

const SERVICE_ALIASES: Map<string, string> = new Map();
for (const service of CANONICAL_SERVICES) {
    SERVICE_ALIASES.set(service.slug, service.slug);
    for (const alias of service.aliases) {
        const existing = SERVICE_ALIASES.get(alias);
        if (existing && existing !== service.slug) continue;
        SERVICE_ALIASES.set(alias, service.slug);
    }
}

export function isCanonicalServiceSlug(slug: string): boolean {
    return SERVICE_ALIASES.get(slug.toLowerCase()) === slug.toLowerCase();
}

/**
 * Normaliza un servicio legacy a su slug canónico. Devuelve null si el
 * segmento no es reconocible (se deja caer al hub de bodas).
 */
export function resolveServiceSlug(segment: string): string | null {
    const seg = segment.toLowerCase().trim();
    if (!seg) return null;
    return SERVICE_ALIASES.get(seg) ?? null;
}

export function getCanonicalServiceLabel(slug: string): string | null {
    const service = CANONICAL_SERVICES.find((s) => s.slug === slug);
    return service ? service.label : null;
}

export function getCanonicalService(slug: string): CanonicalService | null {
    return CANONICAL_SERVICES.find((s) => s.slug === slug) ?? null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. NORMALIZADORES DE RUTA (BODAS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CanonicalBodasRoute {
    /** Ruta canónica completa (sin host), ej: /bodas/madrid/dj */
    path: string;
    /** true si la ruta actual debe redirigir con 301. */
    needsRedirect: boolean;
    province: string;
    service: string;
    municipality?: string;
}

/**
 * Calcula la ruta canónica de 2 niveles (/bodas/{provincia}/{servicio}).
 * Si el primer segmento es una ciudad, la eleva a 3 niveles
 * (/bodas/{provincia}/{servicio}/{municipio}).
 * Si el servicio es un alias legacy, lo normaliza.
 */
export function resolveCanonicalBodasService(provinciaSeg: string, servicioSeg: string): CanonicalBodasRoute | null {
    const geo = resolveGeoSegment(provinciaSeg);
    if (!geo.province) return null;

    const service = resolveServiceSlug(servicioSeg);
    if (!service) return null;

    const province = geo.province;
    // Consolidación anti-doorway: la ruta canónica de servicio es SIEMPRE de 2 niveles
    // (/bodas/{provincia}/{servicio}). Un primer segmento que era una ciudad se normaliza
    // a su provincia; NUNCA se autogenera una variante de municipio de 3 niveles.
    const path = `/bodas/${province}/${service}`;

    const currentPath = `/bodas/${provinciaSeg.toLowerCase()}/${servicioSeg.toLowerCase()}`;

    return {
        path,
        needsRedirect: path !== currentPath,
        province,
        service,
        municipality: undefined,
    };
}

/**
 * Calcula la ruta canónica de 3 niveles (/bodas/{provincia}/{servicio}/{municipio}).
 * Corrige provincias equivocadas, servicios legacy y municipios capital.
 */
export function resolveCanonicalBodasMunicipio(
    provinciaSeg: string,
    servicioSeg: string,
    municipioSeg: string,
): CanonicalBodasRoute | null {
    const service = resolveServiceSlug(servicioSeg);
    if (!service) return null;

    const municipio = municipioSeg.toLowerCase().trim();
    if (!municipio) return null;

    const geo = resolveGeoSegment(provinciaSeg);
    if (!geo.province) return null;

    // Municipio mal anidado (pertenece a otra provincia): se consolida hacia la
    // provincia real del municipio.
    const realProvince = MUNICIPALITY_TO_PROVINCE[municipio];
    const province = realProvince && realProvince !== geo.province ? realProvince : geo.province;

    // Consolidación anti-doorway: las variantes por municipio no aportan contenido
    // diferencial real y se pliegan SIEMPRE (301 permanente) hacia el hub de
    // provincia/servicio de 2 niveles, unificando toda la señal SEO en un único URL.
    const path = `/bodas/${province}/${service}`;

    return {
        path,
        needsRedirect: true,
        province,
        service,
        municipality: municipio,
    };
}
