/**
 * 🏛️ MATRIZ pSEO HIDRATADA DE 30 NIVELES SEMÁNTICOS (52 PROVINCIAS DE ESPAÑA)
 * ELEVACIÓN METODOLÓGICA: ROMUALD FONS (TSA / SEO ORBITAL) ──> EAR OS V2 S-CLASS 2026
 * CAC = 0 | GRAPH ENTITY SEO | SCHEMA.ORG GRAPH | LCSP ART. 118 | 12 W/PAX
 */

export interface GeoProvinceEntity {
  slug: string;
  name: string;
  capital: string;
  community: string;
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
  'almeria': {
    slug: 'almeria',
    name: 'Almería',
    capital: 'Almería',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 408,
    deliveryCostBase: 537,
    featuredVenuesCount: 410,
    topIntents: ['bodas almeria', 'mariachi para bodas almeria', 'alquiler sonido almeria', 'fiestas patronales almeria'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Almería',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Almería',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Almería',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Almería'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'cadiz': {
    slug: 'cadiz',
    name: 'Cádiz',
    capital: 'Cádiz',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 451,
    deliveryCostBase: 602,
    featuredVenuesCount: 680,
    topIntents: ['bodas cadiz', 'mariachi para bodas cadiz', 'alquiler sonido cadiz', 'fiestas patronales cadiz'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Cádiz',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Cádiz',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Cádiz',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Cádiz'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'cordoba': {
    slug: 'cordoba',
    name: 'Córdoba',
    capital: 'Córdoba',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 266,
    deliveryCostBase: 324,
    featuredVenuesCount: 540,
    topIntents: ['bodas cordoba', 'mariachi para bodas cordoba', 'alquiler sonido cordoba', 'fiestas patronales cordoba'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Córdoba',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Córdoba',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Córdoba',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Córdoba'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'granada': {
    slug: 'granada',
    name: 'Granada',
    capital: 'Granada',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 345,
    deliveryCostBase: 442,
    featuredVenuesCount: 620,
    topIntents: ['bodas granada', 'mariachi para bodas granada', 'alquiler sonido granada', 'fiestas patronales granada'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Granada',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Granada',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Granada',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Granada'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'huelva': {
    slug: 'huelva',
    name: 'Huelva',
    capital: 'Huelva',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 408,
    deliveryCostBase: 537,
    featuredVenuesCount: 390,
    topIntents: ['bodas huelva', 'mariachi para bodas huelva', 'alquiler sonido huelva', 'fiestas patronales huelva'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Huelva',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Huelva',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Huelva',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Huelva'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'jaen': {
    slug: 'jaen',
    name: 'Jaén',
    capital: 'Jaén',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 276,
    deliveryCostBase: 339,
    featuredVenuesCount: 370,
    topIntents: ['bodas jaen', 'mariachi para bodas jaen', 'alquiler sonido jaen', 'fiestas patronales jaen'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Jaén',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Jaén',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Jaén',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Jaén'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'malaga': {
    slug: 'malaga',
    name: 'Málaga',
    capital: 'Málaga',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 392,
    deliveryCostBase: 513,
    featuredVenuesCount: 980,
    topIntents: ['bodas malaga', 'mariachi para bodas malaga', 'alquiler sonido malaga', 'fiestas patronales malaga'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Málaga',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Málaga',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Málaga',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Málaga'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'sevilla': {
    slug: 'sevilla',
    name: 'Sevilla',
    capital: 'Sevilla',
    community: 'Andalucía',
    region: 'SUR',
    distanceFromHubKm: 353,
    deliveryCostBase: 454,
    featuredVenuesCount: 920,
    topIntents: ['bodas sevilla', 'mariachi para bodas sevilla', 'alquiler sonido sevilla', 'fiestas patronales sevilla'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Sevilla',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Sevilla',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Sevilla',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Sevilla'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'huesca': {
    slug: 'huesca',
    name: 'Huesca',
    capital: 'Huesca',
    community: 'Aragón',
    region: 'NORTE',
    distanceFromHubKm: 381,
    deliveryCostBase: 496,
    featuredVenuesCount: 310,
    topIntents: ['bodas huesca', 'mariachi para bodas huesca', 'alquiler sonido huesca', 'fiestas patronales huesca'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Huesca',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Huesca',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Huesca',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Huesca'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'teruel': {
    slug: 'teruel',
    name: 'Teruel',
    capital: 'Teruel',
    community: 'Aragón',
    region: 'NORTE',
    distanceFromHubKm: 262,
    deliveryCostBase: 318,
    featuredVenuesCount: 220,
    topIntents: ['bodas teruel', 'mariachi para bodas teruel', 'alquiler sonido teruel', 'fiestas patronales teruel'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Teruel',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Teruel',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Teruel',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Teruel'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'zaragoza': {
    slug: 'zaragoza',
    name: 'Zaragoza',
    capital: 'Zaragoza',
    community: 'Aragón',
    region: 'NORTE',
    distanceFromHubKm: 319,
    deliveryCostBase: 404,
    featuredVenuesCount: 520,
    topIntents: ['bodas zaragoza', 'mariachi para bodas zaragoza', 'alquiler sonido zaragoza', 'fiestas patronales zaragoza'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Zaragoza',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Zaragoza',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Zaragoza',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Zaragoza'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'asturias': {
    slug: 'asturias',
    name: 'Asturias',
    capital: 'Oviedo',
    community: 'Principado de Asturias',
    region: 'NORTE',
    distanceFromHubKm: 373,
    deliveryCostBase: 484,
    featuredVenuesCount: 590,
    topIntents: ['bodas asturias', 'mariachi para bodas asturias', 'alquiler sonido asturias', 'fiestas patronales asturias'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Asturias',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Asturias',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Asturias',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Asturias'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'baleares': {
    slug: 'baleares',
    name: 'Islas Baleares',
    capital: 'Palma de Mallorca',
    community: 'Islas Baleares',
    region: 'INSULAR',
    distanceFromHubKm: 589,
    deliveryCostBase: 808,
    featuredVenuesCount: 780,
    topIntents: ['bodas baleares', 'mariachi para bodas baleares', 'alquiler sonido baleares', 'fiestas patronales baleares'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Islas Baleares',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Islas Baleares',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Islas Baleares',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Islas Baleares'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'las-palmas': {
    slug: 'las-palmas',
    name: 'Las Palmas',
    capital: 'Las Palmas de Gran Canaria',
    community: 'Canarias',
    region: 'INSULAR',
    distanceFromHubKm: 1695,
    deliveryCostBase: 2468,
    featuredVenuesCount: 510,
    topIntents: ['bodas las-palmas', 'mariachi para bodas las-palmas', 'alquiler sonido las-palmas', 'fiestas patronales las-palmas'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Las Palmas',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Las Palmas',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Las Palmas',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Las Palmas'
    },
    logisticsSpecs: { soundSlaHours: 5, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'santa-cruz-de-tenerife': {
    slug: 'santa-cruz-de-tenerife',
    name: 'Santa Cruz de Tenerife',
    capital: 'Santa Cruz de Tenerife',
    community: 'Canarias',
    region: 'INSULAR',
    distanceFromHubKm: 1711,
    deliveryCostBase: 2492,
    featuredVenuesCount: 490,
    topIntents: ['bodas santa-cruz-de-tenerife', 'mariachi para bodas santa-cruz-de-tenerife', 'alquiler sonido santa-cruz-de-tenerife', 'fiestas patronales santa-cruz-de-tenerife'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Santa Cruz de Tenerife',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Santa Cruz de Tenerife',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Santa Cruz de Tenerife',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Santa Cruz de Tenerife'
    },
    logisticsSpecs: { soundSlaHours: 5, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'cantabria': {
    slug: 'cantabria',
    name: 'Cantabria',
    capital: 'Santander',
    community: 'Cantabria',
    region: 'NORTE',
    distanceFromHubKm: 360,
    deliveryCostBase: 465,
    featuredVenuesCount: 440,
    topIntents: ['bodas cantabria', 'mariachi para bodas cantabria', 'alquiler sonido cantabria', 'fiestas patronales cantabria'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Cantabria',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Cantabria',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Cantabria',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Cantabria'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'avila': {
    slug: 'avila',
    name: 'Ávila',
    capital: 'Ávila',
    community: 'Castilla y León',
    region: 'CENTRO',
    distanceFromHubKm: 63,
    deliveryCostBase: 20,
    featuredVenuesCount: 340,
    topIntents: ['bodas avila', 'mariachi para bodas avila', 'alquiler sonido avila', 'fiestas patronales avila'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Ávila',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Ávila',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Ávila',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Ávila'
    },
    logisticsSpecs: { soundSlaHours: 2, wattsPerPax: 12, guaranteeType: 'Despliegue Exprés desde Hub Central' }
  },
  'burgos': {
    slug: 'burgos',
    name: 'Burgos',
    capital: 'Burgos',
    community: 'Castilla y León',
    region: 'NORTE',
    distanceFromHubKm: 238,
    deliveryCostBase: 282,
    featuredVenuesCount: 380,
    topIntents: ['bodas burgos', 'mariachi para bodas burgos', 'alquiler sonido burgos', 'fiestas patronales burgos'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Burgos',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Burgos',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Burgos',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Burgos'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'leon': {
    slug: 'leon',
    name: 'León',
    capital: 'León',
    community: 'Castilla y León',
    region: 'NORTE',
    distanceFromHubKm: 286,
    deliveryCostBase: 354,
    featuredVenuesCount: 420,
    topIntents: ['bodas leon', 'mariachi para bodas leon', 'alquiler sonido leon', 'fiestas patronales leon'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en León',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en León',
      brasas: 'Catering de brasas y showcooking a fuego vivo en León',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de León'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'palencia': {
    slug: 'palencia',
    name: 'Palencia',
    capital: 'Palencia',
    community: 'Castilla y León',
    region: 'NORTE',
    distanceFromHubKm: 199,
    deliveryCostBase: 224,
    featuredVenuesCount: 260,
    topIntents: ['bodas palencia', 'mariachi para bodas palencia', 'alquiler sonido palencia', 'fiestas patronales palencia'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Palencia',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Palencia',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Palencia',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Palencia'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'salamanca': {
    slug: 'salamanca',
    name: 'Salamanca',
    capital: 'Salamanca',
    community: 'Castilla y León',
    region: 'CENTRO',
    distanceFromHubKm: 148,
    deliveryCostBase: 147,
    featuredVenuesCount: 450,
    topIntents: ['bodas salamanca', 'mariachi para bodas salamanca', 'alquiler sonido salamanca', 'fiestas patronales salamanca'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Salamanca',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Salamanca',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Salamanca',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Salamanca'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'segovia': {
    slug: 'segovia',
    name: 'Segovia',
    capital: 'Segovia',
    community: 'Castilla y León',
    region: 'CENTRO',
    distanceFromHubKm: 78,
    deliveryCostBase: 42,
    featuredVenuesCount: 460,
    topIntents: ['bodas segovia', 'mariachi para bodas segovia', 'alquiler sonido segovia', 'fiestas patronales segovia'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Segovia',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Segovia',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Segovia',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Segovia'
    },
    logisticsSpecs: { soundSlaHours: 2, wattsPerPax: 12, guaranteeType: 'Despliegue Exprés desde Hub Central' }
  },
  'soria': {
    slug: 'soria',
    name: 'Soria',
    capital: 'Soria',
    community: 'Castilla y León',
    region: 'NORTE',
    distanceFromHubKm: 223,
    deliveryCostBase: 260,
    featuredVenuesCount: 210,
    topIntents: ['bodas soria', 'mariachi para bodas soria', 'alquiler sonido soria', 'fiestas patronales soria'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Soria',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Soria',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Soria',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Soria'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'valladolid': {
    slug: 'valladolid',
    name: 'Valladolid',
    capital: 'Valladolid',
    community: 'Castilla y León',
    region: 'CENTRO',
    distanceFromHubKm: 163,
    deliveryCostBase: 170,
    featuredVenuesCount: 530,
    topIntents: ['bodas valladolid', 'mariachi para bodas valladolid', 'alquiler sonido valladolid', 'fiestas patronales valladolid'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Valladolid',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Valladolid',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Valladolid',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Valladolid'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'zamora': {
    slug: 'zamora',
    name: 'Zamora',
    capital: 'Zamora',
    community: 'Castilla y León',
    region: 'CENTRO',
    distanceFromHubKm: 192,
    deliveryCostBase: 213,
    featuredVenuesCount: 270,
    topIntents: ['bodas zamora', 'mariachi para bodas zamora', 'alquiler sonido zamora', 'fiestas patronales zamora'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Zamora',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Zamora',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Zamora',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Zamora'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'albacete': {
    slug: 'albacete',
    name: 'Albacete',
    capital: 'Albacete',
    community: 'Castilla-La Mancha',
    region: 'CENTRO',
    distanceFromHubKm: 243,
    deliveryCostBase: 290,
    featuredVenuesCount: 350,
    topIntents: ['bodas albacete', 'mariachi para bodas albacete', 'alquiler sonido albacete', 'fiestas patronales albacete'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Albacete',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Albacete',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Albacete',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Albacete'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'ciudad-real': {
    slug: 'ciudad-real',
    name: 'Ciudad Real',
    capital: 'Ciudad Real',
    community: 'Castilla-La Mancha',
    region: 'CENTRO',
    distanceFromHubKm: 141,
    deliveryCostBase: 136,
    featuredVenuesCount: 380,
    topIntents: ['bodas ciudad-real', 'mariachi para bodas ciudad-real', 'alquiler sonido ciudad-real', 'fiestas patronales ciudad-real'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Ciudad Real',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Ciudad Real',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Ciudad Real',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Ciudad Real'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'cuenca': {
    slug: 'cuenca',
    name: 'Cuenca',
    capital: 'Cuenca',
    community: 'Castilla-La Mancha',
    region: 'CENTRO',
    distanceFromHubKm: 176,
    deliveryCostBase: 189,
    featuredVenuesCount: 290,
    topIntents: ['bodas cuenca', 'mariachi para bodas cuenca', 'alquiler sonido cuenca', 'fiestas patronales cuenca'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Cuenca',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Cuenca',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Cuenca',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Cuenca'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'guadalajara': {
    slug: 'guadalajara',
    name: 'Guadalajara',
    capital: 'Guadalajara',
    community: 'Castilla-La Mancha',
    region: 'CENTRO',
    distanceFromHubKm: 98,
    deliveryCostBase: 72,
    featuredVenuesCount: 330,
    topIntents: ['bodas guadalajara', 'mariachi para bodas guadalajara', 'alquiler sonido guadalajara', 'fiestas patronales guadalajara'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Guadalajara',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Guadalajara',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Guadalajara',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Guadalajara'
    },
    logisticsSpecs: { soundSlaHours: 2, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'toledo': {
    slug: 'toledo',
    name: 'Toledo',
    capital: 'Toledo',
    community: 'Castilla-La Mancha',
    region: 'CENTRO',
    distanceFromHubKm: 44,
    deliveryCostBase: 0,
    featuredVenuesCount: 680,
    topIntents: ['bodas toledo', 'mariachi para bodas toledo', 'alquiler sonido toledo', 'fiestas patronales toledo'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Toledo',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Toledo',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Toledo',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Toledo'
    },
    logisticsSpecs: { soundSlaHours: 2, wattsPerPax: 12, guaranteeType: 'Despliegue Exprés desde Hub Central' }
  },
  'barcelona': {
    slug: 'barcelona',
    name: 'Barcelona',
    capital: 'Barcelona',
    community: 'Cataluña',
    region: 'ESTE',
    distanceFromHubKm: 551,
    deliveryCostBase: 752,
    featuredVenuesCount: 1150,
    topIntents: ['bodas barcelona', 'mariachi para bodas barcelona', 'alquiler sonido barcelona', 'fiestas patronales barcelona'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Barcelona',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Barcelona',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Barcelona',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Barcelona'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'girona': {
    slug: 'girona',
    name: 'Girona',
    capital: 'Girona',
    community: 'Cataluña',
    region: 'ESTE',
    distanceFromHubKm: 619,
    deliveryCostBase: 854,
    featuredVenuesCount: 580,
    topIntents: ['bodas girona', 'mariachi para bodas girona', 'alquiler sonido girona', 'fiestas patronales girona'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Girona',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Girona',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Girona',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Girona'
    },
    logisticsSpecs: { soundSlaHours: 5, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'lleida': {
    slug: 'lleida',
    name: 'Lleida',
    capital: 'Lleida',
    community: 'Cataluña',
    region: 'ESTE',
    distanceFromHubKm: 432,
    deliveryCostBase: 573,
    featuredVenuesCount: 340,
    topIntents: ['bodas lleida', 'mariachi para bodas lleida', 'alquiler sonido lleida', 'fiestas patronales lleida'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Lleida',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Lleida',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Lleida',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Lleida'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'tarragona': {
    slug: 'tarragona',
    name: 'Tarragona',
    capital: 'Tarragona',
    community: 'Cataluña',
    region: 'ESTE',
    distanceFromHubKm: 469,
    deliveryCostBase: 628,
    featuredVenuesCount: 490,
    topIntents: ['bodas tarragona', 'mariachi para bodas tarragona', 'alquiler sonido tarragona', 'fiestas patronales tarragona'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Tarragona',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Tarragona',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Tarragona',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Tarragona'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'alicante': {
    slug: 'alicante',
    name: 'Alicante',
    capital: 'Alicante',
    community: 'Comunidad Valenciana',
    region: 'ESTE',
    distanceFromHubKm: 383,
    deliveryCostBase: 500,
    featuredVenuesCount: 790,
    topIntents: ['bodas alicante', 'mariachi para bodas alicante', 'alquiler sonido alicante', 'fiestas patronales alicante'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Alicante',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Alicante',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Alicante',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Alicante'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'castellon': {
    slug: 'castellon',
    name: 'Castellón',
    capital: 'Castellón de la Plana',
    community: 'Comunidad Valenciana',
    region: 'ESTE',
    distanceFromHubKm: 354,
    deliveryCostBase: 456,
    featuredVenuesCount: 360,
    topIntents: ['bodas castellon', 'mariachi para bodas castellon', 'alquiler sonido castellon', 'fiestas patronales castellon'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Castellón',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Castellón',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Castellón',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Castellón'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'valencia': {
    slug: 'valencia',
    name: 'Valencia',
    capital: 'Valencia',
    community: 'Comunidad Valenciana',
    region: 'ESTE',
    distanceFromHubKm: 337,
    deliveryCostBase: 430,
    featuredVenuesCount: 890,
    topIntents: ['bodas valencia', 'mariachi para bodas valencia', 'alquiler sonido valencia', 'fiestas patronales valencia'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Valencia',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Valencia',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Valencia',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Valencia'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'badajoz': {
    slug: 'badajoz',
    name: 'Badajoz',
    capital: 'Badajoz',
    community: 'Extremadura',
    region: 'SUR',
    distanceFromHubKm: 282,
    deliveryCostBase: 348,
    featuredVenuesCount: 380,
    topIntents: ['bodas badajoz', 'mariachi para bodas badajoz', 'alquiler sonido badajoz', 'fiestas patronales badajoz'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Badajoz',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Badajoz',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Badajoz',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Badajoz'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'caceres': {
    slug: 'caceres',
    name: 'Cáceres',
    capital: 'Cáceres',
    community: 'Extremadura',
    region: 'SUR',
    distanceFromHubKm: 204,
    deliveryCostBase: 231,
    featuredVenuesCount: 390,
    topIntents: ['bodas caceres', 'mariachi para bodas caceres', 'alquiler sonido caceres', 'fiestas patronales caceres'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Cáceres',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Cáceres',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Cáceres',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Cáceres'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'a-coruna': {
    slug: 'a-coruna',
    name: 'A Coruña',
    capital: 'A Coruña',
    community: 'Galicia',
    region: 'NORTE',
    distanceFromHubKm: 492,
    deliveryCostBase: 663,
    featuredVenuesCount: 610,
    topIntents: ['bodas a-coruna', 'mariachi para bodas a-coruna', 'alquiler sonido a-coruna', 'fiestas patronales a-coruna'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en A Coruña',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en A Coruña',
      brasas: 'Catering de brasas y showcooking a fuego vivo en A Coruña',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de A Coruña'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'lugo': {
    slug: 'lugo',
    name: 'Lugo',
    capital: 'Lugo',
    community: 'Galicia',
    region: 'NORTE',
    distanceFromHubKm: 416,
    deliveryCostBase: 549,
    featuredVenuesCount: 320,
    topIntents: ['bodas lugo', 'mariachi para bodas lugo', 'alquiler sonido lugo', 'fiestas patronales lugo'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Lugo',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Lugo',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Lugo',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Lugo'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'ourense': {
    slug: 'ourense',
    name: 'Ourense',
    capital: 'Ourense',
    community: 'Galicia',
    region: 'NORTE',
    distanceFromHubKm: 385,
    deliveryCostBase: 502,
    featuredVenuesCount: 290,
    topIntents: ['bodas ourense', 'mariachi para bodas ourense', 'alquiler sonido ourense', 'fiestas patronales ourense'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Ourense',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Ourense',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Ourense',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Ourense'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'pontevedra': {
    slug: 'pontevedra',
    name: 'Pontevedra',
    capital: 'Pontevedra',
    community: 'Galicia',
    region: 'NORTE',
    distanceFromHubKm: 444,
    deliveryCostBase: 591,
    featuredVenuesCount: 580,
    topIntents: ['bodas pontevedra', 'mariachi para bodas pontevedra', 'alquiler sonido pontevedra', 'fiestas patronales pontevedra'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Pontevedra',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Pontevedra',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Pontevedra',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Pontevedra'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'madrid': {
    slug: 'madrid',
    name: 'Madrid',
    capital: 'Madrid',
    community: 'Comunidad de Madrid',
    region: 'CENTRO',
    distanceFromHubKm: 46,
    deliveryCostBase: 0,
    featuredVenuesCount: 1420,
    topIntents: ['bodas madrid', 'mariachi para bodas madrid', 'alquiler sonido madrid', 'fiestas patronales madrid'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Madrid',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Madrid',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Madrid',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Madrid'
    },
    logisticsSpecs: { soundSlaHours: 2, wattsPerPax: 12, guaranteeType: 'Despliegue Exprés desde Hub Central' }
  },
  'murcia': {
    slug: 'murcia',
    name: 'Murcia',
    capital: 'Murcia',
    community: 'Región de Murcia',
    region: 'ESTE',
    distanceFromHubKm: 364,
    deliveryCostBase: 471,
    featuredVenuesCount: 560,
    topIntents: ['bodas murcia', 'mariachi para bodas murcia', 'alquiler sonido murcia', 'fiestas patronales murcia'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Murcia',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Murcia',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Murcia',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Murcia'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'navarra': {
    slug: 'navarra',
    name: 'Navarra',
    capital: 'Pamplona',
    community: 'Comunidad Foral de Navarra',
    region: 'NORTE',
    distanceFromHubKm: 356,
    deliveryCostBase: 459,
    featuredVenuesCount: 390,
    topIntents: ['bodas navarra', 'mariachi para bodas navarra', 'alquiler sonido navarra', 'fiestas patronales navarra'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Navarra',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Navarra',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Navarra',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Navarra'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'alava': {
    slug: 'alava',
    name: 'Álava',
    capital: 'Vitoria-Gasteiz',
    community: 'País Vasco',
    region: 'NORTE',
    distanceFromHubKm: 316,
    deliveryCostBase: 399,
    featuredVenuesCount: 310,
    topIntents: ['bodas alava', 'mariachi para bodas alava', 'alquiler sonido alava', 'fiestas patronales alava'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Álava',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Álava',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Álava',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Álava'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'guipuzcoa': {
    slug: 'guipuzcoa',
    name: 'Guipúzcoa',
    capital: 'San Sebastián',
    community: 'País Vasco',
    region: 'NORTE',
    distanceFromHubKm: 388,
    deliveryCostBase: 507,
    featuredVenuesCount: 470,
    topIntents: ['bodas guipuzcoa', 'mariachi para bodas guipuzcoa', 'alquiler sonido guipuzcoa', 'fiestas patronales guipuzcoa'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Guipúzcoa',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Guipúzcoa',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Guipúzcoa',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Guipúzcoa'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'vizcaya': {
    slug: 'vizcaya',
    name: 'Vizcaya',
    capital: 'Bilbao',
    community: 'País Vasco',
    region: 'NORTE',
    distanceFromHubKm: 352,
    deliveryCostBase: 453,
    featuredVenuesCount: 590,
    topIntents: ['bodas vizcaya', 'mariachi para bodas vizcaya', 'alquiler sonido vizcaya', 'fiestas patronales vizcaya'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Vizcaya',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Vizcaya',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Vizcaya',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Vizcaya'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'la-rioja': {
    slug: 'la-rioja',
    name: 'La Rioja',
    capital: 'Logroño',
    community: 'La Rioja',
    region: 'NORTE',
    distanceFromHubKm: 287,
    deliveryCostBase: 356,
    featuredVenuesCount: 310,
    topIntents: ['bodas la-rioja', 'mariachi para bodas la-rioja', 'alquiler sonido la-rioja', 'fiestas patronales la-rioja'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en La Rioja',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en La Rioja',
      brasas: 'Catering de brasas y showcooking a fuego vivo en La Rioja',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de La Rioja'
    },
    logisticsSpecs: { soundSlaHours: 3, wattsPerPax: 12, guaranteeType: 'Garantía 0 Fallos y Técnico In Situ' }
  },
  'ceuta': {
    slug: 'ceuta',
    name: 'Ceuta',
    capital: 'Ceuta',
    community: 'Ceuta',
    region: 'SUR',
    distanceFromHubKm: 494,
    deliveryCostBase: 666,
    featuredVenuesCount: 110,
    topIntents: ['bodas ceuta', 'mariachi para bodas ceuta', 'alquiler sonido ceuta', 'fiestas patronales ceuta'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Ceuta',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Ceuta',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Ceuta',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Ceuta'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
  'melilla': {
    slug: 'melilla',
    name: 'Melilla',
    capital: 'Melilla',
    community: 'Melilla',
    region: 'SUR',
    distanceFromHubKm: 561,
    deliveryCostBase: 766,
    featuredVenuesCount: 105,
    topIntents: ['bodas melilla', 'mariachi para bodas melilla', 'alquiler sonido melilla', 'fiestas patronales melilla'],
    localKeywords: {
      mariachi: 'Mariachi de gala y repertorio de conservatorio para bodas en Melilla',
      sonido: 'Sonorización Bose F1 Model 812 y microfonía Shure para fincas y salones en Melilla',
      brasas: 'Catering de brasas y showcooking a fuego vivo en Melilla',
      ayuntamientos: 'Contratación artística institucional Art. 118 LCSP para municipios de Melilla'
    },
    logisticsSpecs: { soundSlaHours: 4, wattsPerPax: 12, guaranteeType: 'Rider Homologado con Transporte Dedicado' }
  },
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
