export interface DetailedFinca {
  slug: string;
  name: string;
  location: string;
  provincia: string;
  distanciaHubMentridaKm: number;
  capacidadMinPax: number;
  capacidadMaxPax: number;
  precioMenuDesde: number;
  alquilerDesde?: number;
  description: string;
  images: string[];
  espacios: string[];
  serviciosCoordinados: string[];
  acusticaRecomendada: string;
  horarioBarraLibre: string;
}

export const CANONICAL_FINCAS_REGISTRY: Record<string, DetailedFinca> = {
  'finca-la-chopera': {
    slug: 'finca-la-chopera',
    name: 'Finca La Chopera',
    location: 'Illescas (Toledo / Madrid Sur)',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 42,
    capacidadMinPax: 80,
    capacidadMaxPax: 450,
    precioMenuDesde: 125,
    alquilerDesde: 3200,
    description: 'Finca histórica rodeada de jardines centenarios y salones acristalados. Ubicación estratégica entre Madrid y Toledo con amplios espacios exteriores para cóctel y banquete al aire libre.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop'
    ],
    espacios: ['Jardín de los Olivos', 'Salón Acristalado Central', 'Porche de Cóctel', 'Pérgola Ceremonial'],
    serviciosCoordinados: ['Música en Vivo S-Class', 'Sonorización Bose F1', 'Iluminación Escénica DMX', 'Catering Gourmet'],
    acusticaRecomendada: 'Sonorización de alta definición con columnas Bose F1 distribuidas para cobertura homogénea. Coordinación directa de horarios y niveles con la dirección del recinto.',
    horarioBarraLibre: 'Hasta las 05:30 h (según normativa municipal)'
  },
  'cigarral-del-angel': {
    slug: 'cigarral-del-angel',
    name: 'Cigarral del Ángel',
    location: 'Toledo Capital',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 54,
    capacidadMinPax: 100,
    capacidadMaxPax: 500,
    precioMenuDesde: 145,
    alquilerDesde: 4500,
    description: 'El cigarral más emblemático y antiguo de Toledo con vistas panorámicas privilegiadas sobre el río Tajo y el casco histórico. Jardines árabes, claustro y palacio del siglo XI.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
    ],
    espacios: ['Terraza Mirador del Tajo', 'Claustro de San Fructuoso', 'Jardines Árabes', 'Salón Panorámico'],
    serviciosCoordinados: ['Tenor Solista de Gala', 'Microfonía Shure Axient', 'Música de Conservatorio', 'Showcooking'],
    acusticaRecomendada: 'Equipamiento ultra-compacto Bose S1 Pro para ceremonia en claustro y sistema F1 modular para banquete.',
    horarioBarraLibre: 'Hasta las 05:00 h'
  },
  'finca-valduerna': {
    slug: 'finca-valduerna',
    name: 'Finca Valduerna (Productora EAR Hub)',
    location: 'Méntrida (Toledo)',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 0,
    capacidadMinPax: 50,
    capacidadMaxPax: 300,
    precioMenuDesde: 110,
    alquilerDesde: 2500,
    description: 'Sede central de operaciones y espacio rústico exclusivo en Méntrida. Viñedos propios, dehesa castellana y logística inmediata sin costes de desplazamiento adicional.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop'
    ],
    espacios: ['La Era de los Viñedos', 'Patio Central Castellano', 'Bodega de Barricas', 'Jardín de Césped'],
    serviciosCoordinados: ['Mariachi Imperial en Directo', 'Catering de Brasas al Sarmiento', 'Sonido Bose 12W/pax'],
    acusticaRecomendada: 'Acústica natural abierta. Configuración de 12 W/pax con limitación calibrada según especificaciones de la finca.',
    horarioBarraLibre: 'Sin límite estricto interior'
  },
  'soto-de-mozanaque': {
    slug: 'soto-de-mozanaque',
    name: 'Soto de Mozanaque',
    location: 'Algete (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 78,
    capacidadMinPax: 120,
    capacidadMaxPax: 600,
    precioMenuDesde: 150,
    alquilerDesde: 5000,
    description: 'Palacio ducal del siglo XVIII con pabellón acristalado diseñado por Pascua Ortega. Jardines franceses y praderas infinitas a 25 minutos del centro de Madrid.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop'
    ],
    espacios: ['Pabellón Pascua Ortega', 'Pradera Principal', 'Jardín Francés', 'Patio de Carruajes'],
    serviciosCoordinados: ['Voz Lírica y Boleros', 'Cuarteto de Cuerdas', 'Sonido Hi-Fi Bose'],
    acusticaRecomendada: 'Sonorización distribuida de alta definición para respetar la arquitectura patrimonial.',
    horarioBarraLibre: 'Hasta las 05:30 h'
  },
  'finca-el-regajal': {
    slug: 'finca-el-regajal',
    name: 'Finca El Regajal',
    location: 'Aranjuez (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 58,
    capacidadMinPax: 90,
    capacidadMaxPax: 350,
    precioMenuDesde: 135,
    alquilerDesde: 3800,
    description: 'Finca vinícola y reserva de mariposas singular en Aranjuez. Pérgolas entre viñedos, bodega de crianza y gastronomía de autor.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
    ],
    espacios: ['Cenador entre Viñedos', 'Plaza de la Bodega', 'Salón de Crianza'],
    serviciosCoordinados: ['Música en Vivo', 'Sonido para Ceremonia Civil'],
    acusticaRecomendada: 'Microfonía inalámbrica Shure Axient para ceremonia y sonido ambiental cálido.',
    horarioBarraLibre: 'Hasta las 05:00 h'
  },
  'finca-torre-valdeflores': {
    slug: 'finca-torre-valdeflores',
    name: 'Finca Torre Valdeflores',
    location: 'Toledo / Madrid Sur',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 48,
    capacidadMinPax: 70,
    capacidadMaxPax: 380,
    precioMenuDesde: 115,
    description: 'Torreón señorial con extensas praderas arboladas y fuentes ornamentales. Reconocida por su privacidad y fácil acceso logístico.',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop'],
    espacios: ['Jardín del Torreón', 'Salón de Celebraciones', 'Porche Acristalado'],
    serviciosCoordinados: ['Sonorización Integral Bose', 'Tenor Solista'],
    acusticaRecomendada: 'Diseño acústico centrado en la claridad vocal sin reverberación.',
    horarioBarraLibre: 'Hasta las 05:00 h'
  },
  'alqueria-balada': {
    slug: 'alqueria-balada',
    name: 'Alquería Balada',
    location: 'Valencia / Levante',
    provincia: 'Valencia',
    distanciaHubMentridaKm: 380,
    capacidadMinPax: 80,
    capacidadMaxPax: 320,
    precioMenuDesde: 110,
    description: 'Auténtica alquería valenciana rodeada de naranjales históricos y patios empedrados. Tradición mediterránea y espacios polivalentes.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'],
    espacios: ['Patio de los Naranjos', 'L’Almassera', 'Jardín Principal'],
    serviciosCoordinados: ['Mariachi y Solista', 'Sonido para Eventos'],
    acusticaRecomendada: 'Sonido focalizado en patio exterior respetando las zonas residenciales colindantes.',
    horarioBarraLibre: 'Hasta las 04:30 h'
  },
  'finca-alubian': {
    slug: 'finca-alubian',
    name: 'Finca Alubian',
    location: 'Castilla-La Mancha',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 52,
    capacidadMinPax: 60,
    capacidadMaxPax: 280,
    precioMenuDesde: 105,
    description: 'Entorno rústico exclusivo con encanto campestre toledano. Patios andaluces, jardines cuidados y cocina de brasas.',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'],
    espacios: ['Patio de la Fuente', 'Salón Rústico', 'Carpa Exterior'],
    serviciosCoordinados: ['Catering de Brasas', 'Música en Directo'],
    acusticaRecomendada: 'Sonorización adaptada a exteriores diáfanos.',
    horarioBarraLibre: 'Hasta las 05:00 h'
  },
  'finca-salvago': {
    slug: 'finca-salvago',
    name: 'Finca Salvago',
    location: 'Sevilla / Andalucía',
    provincia: 'Sevilla',
    distanciaHubMentridaKm: 490,
    capacidadMinPax: 100,
    capacidadMaxPax: 400,
    precioMenuDesde: 120,
    description: 'Hacienda tradicional sevillana con albero, arcadas encaladas y palmeras centenarias. El marco perfecto para enlaces de estilo andaluz.',
    images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop'],
    espacios: ['Patio de Caballos', 'Jardín de las Palmeras', 'Salón de Carruajes'],
    serviciosCoordinados: ['Ensamble Mariachi', 'Música Lírica'],
    acusticaRecomendada: 'Equipamiento acústico Bose con difusión envolvente en patio abierto.',
    horarioBarraLibre: 'Hasta las 06:00 h'
  },
  'finca-el-milagro': {
    slug: 'finca-el-milagro',
    name: 'Finca El Milagro',
    location: 'Toledo',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 46,
    capacidadMinPax: 90,
    capacidadMaxPax: 360,
    precioMenuDesde: 120,
    description: 'Espacio exclusivo para eventos situado en la vega del Tajo, rodeado de naturaleza salvaje y arquitectura castellana rehabilitada.',
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop'],
    espacios: ['Jardín del Tajo', 'Porche Principal', 'Salón Los Arcos'],
    serviciosCoordinados: ['Solista Edwin Agudelo', 'Sonido Bose F1'],
    acusticaRecomendada: 'Sonido directo calibrado para cóctel en jardín.',
    horarioBarraLibre: 'Hasta las 05:00 h'
  }
};

/**
 * 🏛️ Resuelve los datos de una finca canónica o genera un fallback ultra-realista
 */
export function resolveFincaData(slug: string): DetailedFinca {
  const cleanSlug = slug.toLowerCase();
  if (CANONICAL_FINCAS_REGISTRY[cleanSlug]) {
    return CANONICAL_FINCAS_REGISTRY[cleanSlug];
  }

  // Generación inteligente para cualquier slug de finca de España
  const readableName = cleanSlug
    .replace(/^finca-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const fullName = cleanSlug.startsWith('finca-') ? `Finca ${readableName}` : readableName;

  return {
    slug: cleanSlug,
    name: fullName,
    location: 'Comunidad de Madrid / Castilla-La Mancha',
    provincia: 'Toledo / Madrid',
    distanciaHubMentridaKm: 45,
    capacidadMinPax: 80,
    capacidadMaxPax: 350,
    precioMenuDesde: 115,
    alquilerDesde: 3000,
    description: `Espacio exclusivo para bodas y celebraciones privadas. Instalaciones de alta gama con jardines exteriores para cóctel y salones climatizados para banquete.`,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop'
    ],
    espacios: ['Jardín Exterior para Cóctel', 'Salón Principal de Banquete', 'Zona de Ceremonia Civil', 'Pista de Baile'],
    serviciosCoordinados: ['Música en Vivo S-Class', 'Sonorización Bose Hi-Fi', 'Microfonía Inalámbrica Shure'],
    acusticaRecomendada: 'Espacio adaptado para sonorización acústica de alta fidelidad con equipos Bose profesionales. Coordinación de potencia y horarios directamente con la dirección del recinto.',
    horarioBarraLibre: 'Hasta las 05:00 h'
  };
}
