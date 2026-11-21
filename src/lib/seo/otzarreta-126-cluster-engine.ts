/**
 * ══════════════════════════════════════════════════════════════════════════════
 * OTZARRETA TRANSACCIÓN SOBERANA — CLÚSTER 126 LANDINGS (BIZKAIA / TXORIERRI)
 * ══════════════════════════════════════════════════════════════════════════════
 * Generador de las 126 Landings de alta rentabilidad para Otzarreta / Ezkertza Berria.
 * Matriz: 18 Municipios de Bizkaia y Txorierri × 7 Ocasiones de Consumo.
 *
 * Características de Entidad:
 * - Parrilla vasca de brasa al carbón de encina y sarmiento de Eduardo Martínez.
 * - Parking privado cerrado para 150 vehículos.
 * - Aforo acristalado de 50 a 200 comensales (hasta 350 en carpa/jardín).
 * - 4 Menús de Gala oficiales sanción 2027 (145 € a 185 € + IVA). Cero literales:
 *   cada importe de esta matriz se DERIVA de `OTZARRETA_WEDDING_MENUS`, de modo
 *   que subir el suelo en la entidad mueve las 126 landings a la vez (INV-10).
 * - Maître Digital 24/7 integrado en cada landing.
 * ══════════════════════════════════════════════════════════════════════════════
 */

import {
  OTZARRETA_ENTITY,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
} from '../constants/otzarreta-entity';

/** Importe es-ES con coma decimal y IVA declarado (`145,00 € + IVA`). */
function euroLabel(priceEur: number | null): string {
  if (priceEur === null) return 'a consultar';
  return `${priceEur.toFixed(2).replace('.', ',')} € + IVA`;
}

/** Menú de gala por posición en la carta sancionada (`null` si no existe). */
function weddingMenu(index: number): string {
  return OTZARRETA_WEDDING_MENUS[index]?.name ?? 'Menú de gala';
}

/**
 * Reclamo de horquilla que publica cada landing.
 *
 * Se DERIVA de la carta vigente: si el CEO cambia el suelo o el techo en
 * `otzarreta-entity.ts`, las 126 landings lo publican al día siguiente sin tocar
 * Publicar aquí un literal de 2026 era el bug: la matriz seguía prometiendo el
 * suelo derogado mientras la ficha ya vendía desde 145 € (INV-10 / AF-4).
 */
export const OTZARRETA_126_MENU_RANGE: string = (() => {
  const floor = OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? null;
  const ceiling = OTZARRETA_WEDDING_MENUS[OTZARRETA_WEDDING_MENUS.length - 1]?.priceEur ?? null;
  if (floor === null || ceiling === null) return OTZARRETA_WEDDING_MENUS_CLAIM;
  if (floor === ceiling) return `Menú de gala único a ${euroLabel(floor)}`;
  return `Menús de Gala de ${euroLabel(floor)} a ${euroLabel(ceiling)}`;
})();

export interface OtzarretaBizkaiaMunicipality {
  readonly slug: string;
  readonly name: string;
  readonly distanceKm: number;
  readonly minutesFromDerio: number;
  readonly highway: string;
  readonly landmark: string;
}

export interface OtzarretaOccasion {
  readonly slugPrefix: string;
  readonly occasionName: string;
  readonly h1Pattern: string;
  readonly priority: number;
  readonly targetAudience: string;
  readonly menuRecommendation: string;
  readonly capacityRange: string;
  readonly keyBenefit: string;
}

export interface OtzarretaClusterLanding {
  readonly slug: string;
  readonly municipalitySlug: string;
  readonly municipalityName: string;
  readonly occasionSlug: string;
  readonly occasionName: string;
  readonly title: string;
  readonly description: string;
  readonly h1: string;
  readonly priority: number;
  readonly distanceKm: number;
  readonly minutesFromDerio: number;
  readonly highway: string;
  readonly landmark: string;
  readonly parkingInfo: string;
  readonly grillInfo: string;
  readonly capacityInfo: string;
  readonly menuRange: string;
}

/** 1. LOS 18 MUNICIPIOS DE BIZKAIA / TXORIERRI */
export const OTZARRETA_BIZKAIA_MUNICIPALITIES: readonly OtzarretaBizkaiaMunicipality[] = Object.freeze([
  { slug: 'derio', name: 'Derio', distanceKm: 0, minutesFromDerio: 1, highway: 'Santo Domingo Hiribidea / N-637', landmark: 'en el propio corazón de Derio junto al Parque Tecnológico' },
  { slug: 'loiu', name: 'Loiu', distanceKm: 4, minutesFromDerio: 5, highway: 'BI-631', landmark: 'a 5 minutos del Aeropuerto de Bilbao Loiu' },
  { slug: 'zamudio', name: 'Zamudio', distanceKm: 4, minutesFromDerio: 5, highway: 'N-637 Corredor del Txorierri', landmark: 'junto al Parque Tecnológico de Zamudio' },
  { slug: 'lezama', name: 'Lezama', distanceKm: 7, minutesFromDerio: 7, highway: 'BI-737', landmark: 'a 7 minutos del Valle del Txorierri y sus viñedos de txakoli' },
  { slug: 'larrabetzu', name: 'Larrabetzu', distanceKm: 11, minutesFromDerio: 10, highway: 'N-637', landmark: 'enlace directo con el Txorierri oriental' },
  { slug: 'sondika', name: 'Sondika', distanceKm: 5, minutesFromDerio: 6, highway: 'BI-737', landmark: 'acceso directo por el túnel de Santo Domingo' },
  { slug: 'bilbao', name: 'Bilbao', distanceKm: 8, minutesFromDerio: 8, highway: 'Túneles de Artxanda / N-637', landmark: 'a 8 minutos del centro de Bilbao sin problemas de aparcamiento' },
  { slug: 'getxo', name: 'Getxo', distanceKm: 16, minutesFromDerio: 14, highway: 'A-8 / N-637', landmark: 'conexión rápida desde Las Arenas, Neguri y Algorta' },
  { slug: 'erandio', name: 'Erandio', distanceKm: 9, minutesFromDerio: 9, highway: 'La Avanzada / N-637', landmark: 'conexión inmediata desde la margen derecha' },
  { slug: 'mungia', name: 'Mungia', distanceKm: 12, minutesFromDerio: 11, highway: 'BI-631', landmark: 'enlace directo por autovía de Mungia a Derio' },
  { slug: 'barakaldo', name: 'Barakaldo', distanceKm: 14, minutesFromDerio: 12, highway: 'Puente Rontegi / N-637', landmark: 'a 12 minutos cruzando Rontegi hacia el Txorierri' },
  { slug: 'basauri', name: 'Basauri', distanceKm: 12, minutesFromDerio: 12, highway: 'N-637 / AP-68', landmark: 'acceso directo por la circunvalación de Bilbao' },
  { slug: 'galdakao', name: 'Galdakao', distanceKm: 13, minutesFromDerio: 12, highway: 'N-637', landmark: 'conexión ágil desde el corredor del Ibaizabal' },
  { slug: 'durango', name: 'Durango', distanceKm: 32, minutesFromDerio: 22, highway: 'AP-8 / N-637', landmark: 'a 22 minutos del Duranguesado por autopista' },
  { slug: 'amorebieta', name: 'Amorebieta', distanceKm: 21, minutesFromDerio: 16, highway: 'AP-8 / N-637', landmark: 'conexión rápida por el corredor del Txorierri' },
  { slug: 'portugalete', name: 'Portugalete', distanceKm: 17, minutesFromDerio: 15, highway: 'Rontegi / N-637', landmark: 'acceso directo desde la margen izquierda' },
  { slug: 'santurtzi', name: 'Santurtzi', distanceKm: 19, minutesFromDerio: 16, highway: 'A-8 / N-637', landmark: 'comunicación directa sin entrar en el núcleo urbano' },
  { slug: 'uribe-kosta', name: 'Uribe Kosta', distanceKm: 18, minutesFromDerio: 16, highway: 'BI-634 / N-637', landmark: 'la comarca costera de Sopela, Plentzia, Gorliz y Getxo' },
]);

/** 2. LAS 7 OCASIONES DE CONSUMO TRANSACCIONALES */
export const OTZARRETA_OCCASIONS: readonly OtzarretaOccasion[] = Object.freeze([
  {
    slugPrefix: 'bodas-caserio',
    occasionName: 'Bodas en Caserío Tradicional Vasco',
    h1Pattern: 'Bodas en Caserío cerca de {municipio} con Exclusividad y Párking',
    priority: 0.95,
    targetAudience: 'Parejas que buscan caserío vasco auténtico, 1 evento al día y cocina de brasa.',
    menuRecommendation: `${weddingMenu(1)} (${euroLabel(OTZARRETA_WEDDING_MENUS[1]?.priceEur ?? null)}) con chuletón de 1 Kg y 1/2 bogavante.`,
    capacityRange: '50 a 200 comensales (hasta 350 en carpa botánica)',
    keyBenefit: `Solo 1 boda al día en exclusiva, párking privado de ${OTZARRETA_ENTITY.parkingSpaces} plazas y parrilla al carbón.`,
  },
  {
    slugPrefix: 'ceremonia-civil-jardin',
    occasionName: 'Ceremonias Civiles en Jardines Botánicos',
    h1Pattern: 'Ceremonias Civiles con Jardín y Carpa a minutos de {municipio}',
    priority: 0.92,
    targetAudience: 'Novios que desean ceremonia civil oficial al aire libre con cóctel en jardín.',
    menuRecommendation: `Cóctel en jardín y banquete con ${weddingMenu(0)} (${euroLabel(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? null)}) o ${weddingMenu(3)} (${euroLabel(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? null)}).`,
    capacityRange: '50 a 350 invitados en exteriores ajardinados',
    keyBenefit: 'Jardines botánicos con carpa climatizada, sonido Bose y sin cortes acústicos.',
  },
  {
    slugPrefix: 'comidas-empresa-parque-tecnologico',
    occasionName: 'Comidas de Empresa y Parque Tecnológico',
    h1Pattern: `Comidas de Empresa cerca de {municipio} con Párking Privado para ${OTZARRETA_ENTITY.parkingSpaces} Vehículos`,
    priority: 0.90,
    targetAudience: 'Empresas, comités de dirección y reuniones corporativas de Zamudio, Bilbao y Bizkaia.',
    menuRecommendation: `${weddingMenu(1)} (${euroLabel(OTZARRETA_WEDDING_MENUS[1]?.priceEur ?? null)}) en salones reservados con factura homologada B2B.`,
    capacityRange: 'Salones reservados desde 20 hasta 200 personas',
    keyBenefit: 'Párking cerrado para toda la flota, privacidad total y factura homologada B2B.',
  },
  {
    slugPrefix: 'eventos-corporativos-parking',
    occasionName: 'Eventos Corporativos y Presentaciones',
    h1Pattern: 'Espacio para Eventos Corporativos con Párking a un paso de {municipio}',
    priority: 0.88,
    targetAudience: 'Agencias, marcas y empresas que necesitan presentar productos o celebrar aniversarios.',
    menuRecommendation: 'Formatos cóctel con estaciones de brasa en vivo y mariscos nobles.',
    capacityRange: 'Hasta 350 asistentes en recinto integral',
    keyBenefit: 'Acceso por autovía N-637, sin congestión de tráfico urbano y acústica S-Class.',
  },
  {
    slugPrefix: 'comuniones-restaurante-jardin',
    occasionName: 'Comuniones y Celebraciones Familiares',
    h1Pattern: 'Comuniones con Jardines y Espacio Infantil cerca de {municipio}',
    priority: 0.89,
    targetAudience: 'Familias que buscan celebrar la primera comunión en un entorno seguro y campestre.',
    menuRecommendation: `${weddingMenu(0)} (${euroLabel(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? null)}) o ${weddingMenu(2)} con animación infantil.`,
    capacityRange: '30 a 150 comensales familiares',
    keyBenefit: 'Jardines botánicos seguros para niños, menú infantil artesanal y párking vigilado.',
  },
  {
    slugPrefix: 'bodas-de-oro-plata-caserio',
    occasionName: 'Bodas de Oro y Plata en Caserío',
    h1Pattern: 'Bodas de Oro y Plata en Caserío Vasco a minutos de {municipio}',
    priority: 0.87,
    targetAudience: 'Homenajes y aniversarios de matrimonio con gastronomía tradicional de producto noble.',
    menuRecommendation: `${weddingMenu(2)} (${euroLabel(OTZARRETA_WEDDING_MENUS[2]?.priceEur ?? null)}) con txangurro y parrilla al sarmiento.`,
    capacityRange: '25 a 120 comensales íntimos',
    keyBenefit: 'Accesibilidad para mayores, salones climatizados, sonido cálido y trato señorial.',
  },
  {
    slugPrefix: 'asador-parrilla-grupos',
    occasionName: 'Asador y Parrilla Vasca para Grupos',
    h1Pattern: 'Asador Vasco con Parrilla al Carbón de Encina para Grupos desde {municipio}',
    priority: 0.91,
    targetAudience: 'Grupos gastronómicos, cuadrillas y amantes de la carne madurada y pescado a la brasa.',
    menuRecommendation: 'Chuletón de 1 Kg de ganado mayor y rodaballo salvaje al sarmiento.',
    capacityRange: 'Mesas y comedores de 15 a 180 personas',
    keyBenefit: 'Brasa viva de carbón de encina dirigida por Eduardo Martínez al momento.',
  },
]);

/** Construcción determinista de las 126 Landings */
function generateOtzarreta126Landings(): readonly OtzarretaClusterLanding[] {
  const landings: OtzarretaClusterLanding[] = [];

  for (const occasion of OTZARRETA_OCCASIONS) {
    for (const muni of OTZARRETA_BIZKAIA_MUNICIPALITIES) {
      const slug = `${occasion.slugPrefix}-${muni.slug}`;
      const h1 = occasion.h1Pattern.replace('{municipio}', muni.name);
      const title = `${h1} | Otzarreta Caserío`;
      const description = `Celebra tu evento en Caserío Ezkertza Berria & Otzarreta (Derio), a ${muni.minutesFromDerio} min de ${muni.name} por ${muni.highway}. Párking privado de ${OTZARRETA_ENTITY.parkingSpaces} plazas, parrilla al carbón de Eduardo Martínez y exclusividad.`;

      landings.push(
        Object.freeze({
          slug,
          municipalitySlug: muni.slug,
          municipalityName: muni.name,
          occasionSlug: occasion.slugPrefix,
          occasionName: occasion.occasionName,
          title,
          description,
          h1,
          priority: occasion.priority,
          distanceKm: muni.distanceKm,
          minutesFromDerio: muni.minutesFromDerio,
          highway: muni.highway,
          landmark: muni.landmark,
          parkingInfo: `Párking propio cerrado y vigilado para ${OTZARRETA_ENTITY.parkingSpaces} vehículos.`,
          grillInfo: 'Parrilla vasca tradicional de carbón de encina y sarmiento dirigida por Eduardo Martínez.',
          capacityInfo: occasion.capacityRange,
          menuRange: OTZARRETA_126_MENU_RANGE,
        })
      );
    }
  }

  return Object.freeze(landings);
}

/** Catálogo oficial de las 126 Landings de Otzarreta / Ezkertza Berria */
export const OTZARRETA_126_LANDINGS: readonly OtzarretaClusterLanding[] = generateOtzarreta126Landings();

/** Índice rápido por slug */
const OTZARRETA_126_BY_SLUG: ReadonlyMap<string, OtzarretaClusterLanding> = new Map(
  OTZARRETA_126_LANDINGS.map((l) => [l.slug, l] as const)
);

export function getOtzarreta126Landing(slug: string): OtzarretaClusterLanding | null {
  return OTZARRETA_126_BY_SLUG.get(slug) ?? null;
}

export function getOtzarreta126Slugs(): readonly string[] {
  return OTZARRETA_126_LANDINGS.map((l) => l.slug);
}
