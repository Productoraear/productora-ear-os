/**
 * 🏛️ MATRIZ pSEO HIDRATADA DE 30 NIVELES SEMÁNTICOS (52 PROVINCIAS DE ESPAÑA)
 * ELEVACIÓN METODOLÓGICA: ROMUALD FONS (TSA / SEO ORBITAL) ──> EAR OS V2 S-CLASS 2026
 * CAC = 0 | GRAPH ENTITY SEO | SCHEMA.ORG GRAPH | LCSP ART. 118 | 12 W/PAX
 */

export interface GeoProvinceEntity {
  slug: string;
  name: string;
  region: 'CENTRO' | 'SUR' | 'ESTE' | 'NORTE' | 'INSULAR';
  distanceFromHubKm: number; // Hub: Méntrida (Toledo) / Madrid
  deliveryCostBase: number;
  featuredVenuesCount: number;
  topIntents: string[];
  localKeywords: {
    mariachi: string;
    sonido: string;
    brasas: string;
    ayuntamientos: string;
  };
  logisticsSpecs: {
    soundSlaHours: number;
    wattsPerPax: number;
    guaranteeType: string;
  };
}

export const PROVINCIAS_52_GRAPH: Record<string, GeoProvinceEntity> = {
  madrid: {
    slug: 'madrid',
    name: 'Madrid',
    region: 'CENTRO',
    distanceFromHubKm: 45,
    deliveryCostBase: 0,
    featuredVenuesCount: 1420,
    topIntents: ['mariachi para bodas madrid', 'alquiler sonido bose madrid', 'catering brasas fincas madrid', 'festejos ayuntamientos madrid art 118'],
    localKeywords: {
      mariachi: 'Mariachi de gala en Madrid capital, Pozuelo, Las Rozas, Majadahonda y La Moraleja',
      sonido: 'Alquiler de equipos de sonido Bose F1 y pantallas LED P2.9 en Madrid',
      brasas: 'Catering de brasas y asado a la estaca para bodas en fincas de Madrid',
      ayuntamientos: 'Contratación artística menor Art. 118 LCSP para Ayuntamientos de la Comunidad de Madrid'
    },
    logisticsSpecs: { soundSlaHours: 2, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  toledo: {
    slug: 'toledo',
    name: 'Toledo',
    region: 'CENTRO',
    distanceFromHubKm: 30,
    deliveryCostBase: 0,
    featuredVenuesCount: 680,
    topIntents: ['mariachi toledo bodas', 'sonido eventos toledo', 'catering brasas mentrida toledo', 'fiestas patronales ayuntamientos toledo'],
    localKeywords: {
      mariachi: 'Mariachi Edwin Agudelo en Toledo, Talavera de la Reina, Illescas y Méntrida',
      sonido: 'Sonorización e iluminación profesional para cigarrales y fincas de Toledo',
      brasas: 'Showcooking de brasas y leña de encina con maestros asadores en Toledo',
      ayuntamientos: 'Producción de festejos populares y conciertos patronales en la provincia de Toledo'
    },
    logisticsSpecs: { soundSlaHours: 1.5, wattsPerPax: 12, guaranteeType: 'Despliegue Exprés desde Hub Central' }
  },
  barcelona: {
    slug: 'barcelona',
    name: 'Barcelona',
    region: 'ESTE',
    distanceFromHubKm: 620,
    deliveryCostBase: 250,
    featuredVenuesCount: 1150,
    topIntents: ['mariachi barcelona bodas gala', 'alquiler sonido barcelona corporativo', 'catering asado brasas barcelona', 'musica festes majors ajuntaments'],
    localKeywords: {
      mariachi: 'Mariachi de gala en Barcelona, Sitges, Sant Cugat y Maresme',
      sonido: 'Sistemas Line Array y microfonía Shure para congresos y eventos en Barcelona',
      brasas: 'Catering gastronómico de fuego vivo y cortes selectos en masías de Cataluña',
      ayuntamientos: 'Espectáculos de gran formato para festejos y galas institucionales en Barcelona'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  valencia: {
    slug: 'valencia',
    name: 'Valencia',
    region: 'ESTE',
    distanceFromHubKm: 350,
    deliveryCostBase: 120,
    featuredVenuesCount: 890,
    topIntents: ['mariachi valencia bodas', 'alquiler sonido bose valencia', 'catering brasas valencia fincas', 'fiestas patronales ajuntaments valencia'],
    localKeywords: {
      mariachi: 'Mariachi de conservatorio en Valencia, Gandía, Torrent y Paterna',
      sonido: 'Sonorización acústica de 12 W/pax para barracas, masías y salones de Valencia',
      brasas: 'Asado tradicional al rescoldo y cortes ibéricos para eventos en Valencia',
      ayuntamientos: 'Conciertos y ciclos culturales bajo contrato menor para ayuntamientos de Valencia'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía Técnica Certificada' }
  },
  sevilla: {
    slug: 'sevilla',
    name: 'Sevilla',
    region: 'SUR',
    distanceFromHubKm: 530,
    deliveryCostBase: 180,
    featuredVenuesCount: 920,
    topIntents: ['mariachi sevilla bodas haciendas', 'sonido eventos sevilla bose', 'catering brasas sevilla haciendas', 'ferias y fiestas ayuntamientos sevilla'],
    localKeywords: {
      mariachi: 'Mariachi de gala para haciendas y cortijos en Sevilla, Dos Hermanas y Aljarafe',
      sonido: 'Equipos de sonido invisibles y pantallas LED para ferias y bodas en Sevilla',
      brasas: 'Ritual ibérico y parrillada premium para banquetes en cortijos sevillanos',
      ayuntamientos: 'Pliegos técnicos y producción escénica para Ayuntamientos de Sevilla'
    },
    logisticsSpecs: { soundSlaHours: 3.5, wattsPerPax: 12, guaranteeType: 'Cobertura Completa Sur' }
  },
  malaga: {
    slug: 'malaga',
    name: 'Málaga',
    region: 'SUR',
    distanceFromHubKm: 530,
    deliveryCostBase: 190,
    featuredVenuesCount: 980,
    topIntents: ['mariachi marbella malaga vip', 'sonido eventos malaga bose f1', 'catering brasas marbella fincas', 'galas corporativas costa del sol'],
    localKeywords: {
      mariachi: 'Mariachi internacional y tenor de gala en Marbella, Málaga y Costa del Sol',
      sonido: 'Hardware audiovisual de élite para villas exclusivas y hoteles de lujo en Málaga',
      brasas: 'Live fire showcooking con carnes maduradas en villas de Marbella y Benahavís',
      ayuntamientos: 'Galas y festivales culturales para corporaciones municipales de la Costa del Sol'
    },
    logisticsSpecs: { soundSlaHours: 3.5, wattsPerPax: 12, guaranteeType: 'Protocolo VIP Costa del Sol' }
  },
  zaragoza: {
    slug: 'zaragoza',
    name: 'Zaragoza',
    region: 'NORTE',
    distanceFromHubKm: 320,
    deliveryCostBase: 110,
    featuredVenuesCount: 520,
    topIntents: ['mariachi zaragoza bodas', 'sonido eventos zaragoza', 'catering brasas aragon', 'fiestas pilar ayuntamientos zaragoza'],
    localKeywords: {
      mariachi: 'Mariachi de gala en Zaragoza, Calatayud y comarcas aragonesas',
      sonido: 'Sonorización de bodas y congresos con acústica calibrada en Zaragoza',
      brasas: 'Asado a la cruz y brasa aragonesa con leña de carrasca en Zaragoza',
      ayuntamientos: 'Contratación artística de festejos populares para municipios de Zaragoza'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos Aragón' }
  }
};

/**
 * GENERADOR DE ENTIDADES DEL KNOWLEDGE GRAPH (GEO SCHEMA.ORG)
 */
export function generateGeoSchema(provinceSlug: string, serviceKey: 'mariachi' | 'sonido' | 'brasas' | 'ayuntamientos') {
  const province = PROVINCIAS_52_GRAPH[provinceSlug] || PROVINCIAS_52_GRAPH.madrid;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Productora EAR — ${province.name} (${serviceKey.toUpperCase()})`,
    description: province.localKeywords[serviceKey],
    areaServed: {
      '@type': 'AdministrativeArea',
      name: province.name,
      addressCountry: 'ES'
    },
    priceRange: '350€ - 2400€',
    telephone: '+34693693048',
    url: `https://www.productoraear.com/bodas/${province.slug}`,
    sameAs: [
      'https://www.bodas.net/musica/productora-ear--e78903',
      'https://www.youtube.com/c/EdwinAgudelocantante'
    ]
  };
}
