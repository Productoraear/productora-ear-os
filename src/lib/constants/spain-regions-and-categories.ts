/**
 * 🇪🇸 SSOT CANÓNICO: LAS 52 PROVINCIAS DE ESPAÑA Y CATEGORÍAS BODAS.NET
 * ──────────────────────────────────────────────────────────────────
 * Cobertura geográfica total 100% sobre las 50 provincias y 2 ciudades
 * autónomas de España, más las 10 verticales comerciales de bodas.net / EAR OS.
 */

export interface SpainProvince {
  name: string;
  code: string;
  region: string;
  popular?: boolean;
}

export const SPAIN_PROVINCES: SpainProvince[] = [
  { name: 'Álava', code: 'VI', region: 'País Vasco' },
  { name: 'Albacete', code: 'AB', region: 'Castilla-La Mancha' },
  { name: 'Alicante', code: 'A', region: 'Comunidad Valenciana', popular: true },
  { name: 'Almería', code: 'AL', region: 'Andalucía' },
  { name: 'Asturias', code: 'O', region: 'Principado de Asturias', popular: true },
  { name: 'Ávila', code: 'AV', region: 'Castilla y León' },
  { name: 'Badajoz', code: 'BA', region: 'Extremadura' },
  { name: 'Barcelona', code: 'B', region: 'Cataluña', popular: true },
  { name: 'Burgos', code: 'BU', region: 'Castilla y León' },
  { name: 'Cáceres', code: 'CC', region: 'Extremadura' },
  { name: 'Cádiz', code: 'CA', region: 'Andalucía', popular: true },
  { name: 'Cantabria', code: 'S', region: 'Cantabria', popular: true },
  { name: 'Castellón', code: 'CS', region: 'Comunidad Valenciana' },
  { name: 'Ciudad Real', code: 'CR', region: 'Castilla-La Mancha' },
  { name: 'Córdoba', code: 'CO', region: 'Andalucía', popular: true },
  { name: 'Cuenca', code: 'CU', region: 'Castilla-La Mancha' },
  { name: 'Girona', code: 'GI', region: 'Cataluña', popular: true },
  { name: 'Granada', code: 'GR', region: 'Andalucía', popular: true },
  { name: 'Guadalajara', code: 'GU', region: 'Castilla-La Mancha' },
  { name: 'Guipúzcoa', code: 'SS', region: 'País Vasco' },
  { name: 'Huelva', code: 'H', region: 'Andalucía' },
  { name: 'Huesca', code: 'HU', region: 'Aragón' },
  { name: 'Islas Baleares', code: 'PM', region: 'Islas Baleares', popular: true },
  { name: 'Jaén', code: 'J', region: 'Andalucía' },
  { name: 'La Coruña', code: 'C', region: 'Galicia', popular: true },
  { name: 'La Rioja', code: 'LO', region: 'La Rioja' },
  { name: 'Las Palmas', code: 'GC', region: 'Canarias', popular: true },
  { name: 'León', code: 'LE', region: 'Castilla y León' },
  { name: 'Lleida', code: 'L', region: 'Cataluña' },
  { name: 'Lugo', code: 'LU', region: 'Galicia' },
  { name: 'Madrid', code: 'M', region: 'Comunidad de Madrid', popular: true },
  { name: 'Málaga', code: 'MA', region: 'Andalucía', popular: true },
  { name: 'Murcia', code: 'MU', region: 'Región de Murcia', popular: true },
  { name: 'Navarra', code: 'NA', region: 'Comunidad Foral de Navarra' },
  { name: 'Ourense', code: 'OR', region: 'Galicia' },
  { name: 'Palencia', code: 'P', region: 'Castilla y León' },
  { name: 'Pontevedra', code: 'PO', region: 'Galicia', popular: true },
  { name: 'Salamanca', code: 'SA', region: 'Castilla y León' },
  { name: 'Santa Cruz de Tenerife', code: 'TF', region: 'Canarias', popular: true },
  { name: 'Segovia', code: 'SG', region: 'Castilla y León' },
  { name: 'Sevilla', code: 'SE', region: 'Andalucía', popular: true },
  { name: 'Soria', code: 'SO', region: 'Castilla y León' },
  { name: 'Tarragona', code: 'T', region: 'Cataluña' },
  { name: 'Teruel', code: 'TE', region: 'Aragón' },
  { name: 'Toledo', code: 'TO', region: 'Castilla-La Mancha', popular: true },
  { name: 'Valencia', code: 'V', region: 'Comunidad Valenciana', popular: true },
  { name: 'Valladolid', code: 'VA', region: 'Castilla y León' },
  { name: 'Vizcaya', code: 'BI', region: 'País Vasco', popular: true },
  { name: 'Zamora', code: 'ZA', region: 'Castilla y León' },
  { name: 'Zaragoza', code: 'Z', region: 'Aragón', popular: true },
  { name: 'Ceuta', code: 'CE', region: 'Ceuta' },
  { name: 'Melilla', code: 'ML', region: 'Melilla' },
];

export const ALL_SPANISH_PROVINCES: string[] = SPAIN_PROVINCES.map((p) => p.name).sort((a, b) =>
  a.localeCompare(b, 'es')
);

export const POPULAR_PROVINCES_NAMES: string[] = SPAIN_PROVINCES.filter((p) => p.popular).map((p) => p.name);

/** Elimina diacríticos preservando la letra base (Almería -> Almeria) */
export function stripProvinceAccents(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Elimina tildes, mayúsculas y prefijos para normalización fonética y tolerante */
export function normalizeProvinceName(str: string): string {
  if (!str) return '';
  return stripProvinceAccents(str)
    .toLowerCase()
    .replace(/^(la|el|las|los|illes|a)\s+/i, '')
    .trim();
}

/** Mapa canónico de alias, cooficialidades y códigos provinciales/autonómicos */
export const PROVINCE_ALIASES: Record<string, string[]> = {
  'alava': ['araba', 'alava', 'vi'],
  'albacete': ['albacete', 'ab'],
  'alicante': ['alacant', 'alicante', 'a'],
  'almeria': ['almeria', 'al'],
  'asturias': ['asturias', 'oviedo', 'gijon', 'o'],
  'avila': ['avila', 'av'],
  'badajoz': ['badajoz', 'ba'],
  'barcelona': ['barcelona', 'bcn', 'b'],
  'burgos': ['burgos', 'bu'],
  'caceres': ['caceres', 'cc'],
  'cadiz': ['cadiz', 'ca'],
  'cantabria': ['cantabria', 'santander', 's'],
  'castellon': ['castello', 'castellon', 'cs'],
  'ciudad real': ['ciudad real', 'cr'],
  'cordoba': ['cordoba', 'co'],
  'cuenca': ['cuenca', 'cu'],
  'girona': ['gerona', 'girona', 'gi'],
  'granada': ['granada', 'gr'],
  'guadalajara': ['guadalajara', 'gu'],
  'guipuzcoa': ['gipuzkoa', 'guipuzcoa', 'san sebastian', 'donostia', 'ss'],
  'huelva': ['huelva', 'h'],
  'huesca': ['huesca', 'hu'],
  'islas baleares': ['baleares', 'balears', 'illes balears', 'mallorca', 'menorca', 'ibiza', 'formentera', 'pm', 'ib'],
  'jaen': ['jaen', 'j'],
  'coruna': ['a coruna', 'la coruna', 'coruna', 'santiago', 'c'],
  'rioja': ['rioja', 'logrono', 'lo'],
  'palmas': ['las palmas', 'palmas', 'gran canaria', 'lanzarote', 'fuerteventura', 'gc'],
  'leon': ['leon', 'le'],
  'lleida': ['lerida', 'lleida', 'l'],
  'lugo': ['lugo', 'lu'],
  'madrid': ['madrid', 'm', 'md'],
  'malaga': ['malaga', 'marbella', 'ma'],
  'murcia': ['murcia', 'cartagena', 'mu'],
  'navarra': ['navarra', 'nafarroa', 'pamplona', 'na'],
  'ourense': ['orense', 'ourense', 'or'],
  'palencia': ['palencia', 'p'],
  'pontevedra': ['pontevedra', 'vigo', 'po'],
  'salamanca': ['salamanca', 'sa'],
  'santa cruz de tenerife': ['tenerife', 'santa cruz de tenerife', 'la palma', 'la gomera', 'el hierro', 'tf'],
  'segovia': ['segovia', 'sg'],
  'sevilla': ['sevilla', 'se'],
  'soria': ['soria', 'so'],
  'tarragona': ['tarragona', 't'],
  'teruel': ['teruel', 'te'],
  'toledo': ['toledo', 'mentrida', 'talavera', 'to'],
  'valencia': ['valencia', 'v'],
  'valladolid': ['valladolid', 'va'],
  'vizcaya': ['bizkaia', 'vizcaya', 'bilbao', 'bi'],
  'zamora': ['zamora', 'za'],
  'zaragoza': ['zaragoza', 'z'],
  'ceuta': ['ceuta', 'ce'],
  'melilla': ['melilla', 'ml'],
};


/** Índices O(1): código oficial, nombre normalizado y alias/cooficial */
const PROVINCE_BY_CODE = new Map<string, SpainProvince>(
  SPAIN_PROVINCES.map((p) => [p.code.toLowerCase(), p] as const)
);
const PROVINCE_BY_NORMALIZED_NAME = new Map<string, SpainProvince>(
  SPAIN_PROVINCES.map((p) => [normalizeProvinceName(p.name), p] as const)
);
const PROVINCE_BY_ALIAS = new Map<string, SpainProvince>();
for (const province of SPAIN_PROVINCES) {
  for (const alias of PROVINCE_ALIASES[normalizeProvinceName(province.name)] ?? []) {
    const key = normalizeProvinceName(alias);
    if (key && !PROVINCE_BY_ALIAS.has(key)) PROVINCE_BY_ALIAS.set(key, province);
  }
}

/**
 * Resuelve CUALQUIER entrada (nombre oficial, cooficial, alias comercial o código
 * de matrícula) a su provincia canónica. Devuelve null si no hay correspondencia.
 */
export function resolveProvince(rawProvince: string | null | undefined): SpainProvince | null {
  if (!rawProvince) return null;
  const trimmed = rawProvince.trim();
  if (!trimmed) return null;
  const normalized = normalizeProvinceName(trimmed);

  // 1. Código oficial exacto (A, AL, BI, SS, PM, CE...)
  const byCode = PROVINCE_BY_CODE.get(trimmed.toLowerCase());
  if (byCode) return byCode;

  // 2. Nombre canónico normalizado
  const byName = PROVINCE_BY_NORMALIZED_NAME.get(normalized);
  if (byName) return byName;

  // 3. Alias / cooficial / municipio de referencia (Bizkaia, Oviedo, Méntrida, A Coruña)
  const byAlias = PROVINCE_BY_ALIAS.get(normalized);
  if (byAlias) return byAlias;

  // 4. Contención de nombre largo ("Comunidad de Madrid" -> Madrid, "Tenerife" -> Santa Cruz)
  if (normalized.length >= 5) {
    for (const province of SPAIN_PROVINCES) {
      const provinceNorm = normalizeProvinceName(province.name);
      if (provinceNorm.length >= 5 && (normalized.includes(provinceNorm) || provinceNorm.includes(normalized))) {
        return province;
      }
    }
  }

  return null;
}

/** ¿La entrada significa "toda España" (sin filtro geográfico)? */
export function isAllSpainProvince(rawProvince: string | null | undefined): boolean {
  if (!rawProvince) return false;
  const normalized = normalizeProvinceName(rawProvince);
  return (
    rawProvince.trim().toUpperCase() === 'ALL' ||
    normalized === 'toda espana' ||
    normalized === 'todas' ||
    normalized === 'todo' ||
    normalized === 'espana'
  );
}

/**
 * Coincidencia precisa de provincia entre una selección y un registro (CERO CRUCES):
 * ambas entradas se resuelven a su provincia canónica y se comparan por código
 * oficial. `Valencia` jamás volverá a coincidir con `Almería` por contener "al".
 */
export function isProvinceMatch(targetProvince: string, candidateProvince: string): boolean {
  if (!targetProvince || !candidateProvince) return false;
  if (isAllSpainProvince(targetProvince)) return true;

  const target = resolveProvince(targetProvince);
  const candidate = resolveProvince(candidateProvince);
  if (!target || !candidate) return false;

  return target.code === candidate.code;
}

/**
 * Variantes de texto para filtrar por provincia en PostgreSQL/Prisma sin acentos.
 * Incluye nombre oficial, nombre sin diacríticos y alias de palabras completas
 * (se excluyen códigos de 1-2 letras para no contaminar comparaciones `contains`).
 */
export function getProvinceSearchVariants(rawProvince: string | null | undefined): string[] {
  const province = resolveProvince(rawProvince);
  if (!province) return [];

  const variants = new Set<string>();
  const add = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    variants.add(trimmed);
    variants.add(stripProvinceAccents(trimmed));
  };

  add(province.name);
  for (const alias of PROVINCE_ALIASES[normalizeProvinceName(province.name)] ?? []) {
    if (alias.length >= 3) add(alias);
  }

  return Array.from(variants);
}

/**
 * 💍 LAS 10 CATEGORÍAS OFICIALES DE BODAS.NET / DIRECTORIO NACIONAL EAR OS
 */
export interface BodasNetCategory {
  id: string;
  label: string;
  shortLabel: string;
  iconEmoji: string;
  bodasNetUrl: string;
  description: string;
}

export const BODAS_NET_CATEGORIES: BodasNetCategory[] = [
  {
    id: 'finca',
    label: 'Lugares para Boda (Fincas, Palacios, Hoteles & Cortijos)',
    shortLabel: 'Fincas & Espacios',
    iconEmoji: '🏰',
    bodasNetUrl: 'https://www.bodas.net/bodas/banquetes',
    description: 'Espacios singulares, fincas rústicas, castillos y salones de boda homologados con seguro de RC.'
  },
  {
    id: 'catering',
    label: 'Catering & Banquetes de Gala',
    shortLabel: 'Catering & Gastro',
    iconEmoji: '🍽️',
    bodasNetUrl: 'https://www.bodas.net/bodas/banquetes/catering',
    description: 'Showcooking de paellas en vivo, cortadores de jamón ibérico, barras libres y banquetes de autor.'
  },
  {
    id: 'foto',
    label: 'Fotografía & Vídeo Cinematográfico',
    shortLabel: 'Fotografía & Vídeo',
    iconEmoji: '📸',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/fotografos',
    description: 'Reportajes nupciales, cinematografía 4K con drones y sesiones de preboda y postboda.'
  },
  {
    id: 'musica',
    label: 'Música, Solistas & Animación en Vivo',
    shortLabel: 'Música & Artistas',
    iconEmoji: '🎤',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/musica',
    description: 'Edwin Agudelo Tenor Solista, mariachis de gala, cuartetos de cuerdas, DJs y orquestas en directo.'
  },
  {
    id: 'decoracion',
    label: 'Floristería & Decoración Nupcial',
    shortLabel: 'Decoración & Flores',
    iconEmoji: '💐',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/floristerias',
    description: 'Arcos florales ceremoniales, centros de mesa, iluminación ambiental y escenografía a medida.'
  },
  {
    id: 'wedding',
    label: 'Wedding Planners & Coordinación Integral',
    shortLabel: 'Wedding Planners',
    iconEmoji: '📋',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/organizacion-bodas',
    description: 'Diseño, planificación y coordinación el día del evento con protocolo y proveedores certificados.'
  },
  {
    id: 'moda',
    label: 'Moda Nupcial, Trajes & Belleza',
    shortLabel: 'Moda & Belleza',
    iconEmoji: '👗',
    bodasNetUrl: 'https://www.bodas.net/bodas/novias',
    description: 'Vestidos de novia, trajes de novio a medida, maquillaje profesional y peluquería nupcial.'
  },
  {
    id: 'transporte',
    label: 'Coches Clásicos & Transporte de Invitados',
    shortLabel: 'Coches & Transporte',
    iconEmoji: '🚗',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/coches-de-boda',
    description: 'Coches clásicos de época, limusinas, autobuses y minibuses para el traslado seguro de invitados.'
  },
  {
    id: 'sonido',
    label: 'Sonido Profesional, Iluminación & Pantallas LED',
    shortLabel: 'Sonido & Iluminación',
    iconEmoji: '🔊',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/animacion',
    description: 'Equipos Bose F1/S1 Pro, limitadores homologados Ley 37/2003, cabezas móviles y microfonía Shure.'
  },
  {
    id: 'servicios',
    label: 'Detalles, Recuerdos & Servicios para Bodas',
    shortLabel: 'Detalles & Recuerdos',
    iconEmoji: '🎁',
    bodasNetUrl: 'https://www.bodas.net/bodas/proveedores/detalles-de-boda',
    description: 'Invitaciones personalizadas, fotomatones 360°, recuerdos artesanales, carpas y animación infantil.'
  }
];

export const ALL_BODAS_NET_CATEGORY_IDS = [
  'finca',
  'catering',
  'foto',
  'musica',
  'decoracion',
  'wedding',
  'moda',
  'transporte',
  'sonido',
  'servicios',
] as const;

export type BodasNetCategoryId = (typeof ALL_BODAS_NET_CATEGORY_IDS)[number];

/** Busca el nombre oficial exacto de provincia dentro de las 52 canónicas */
export function findCanonicalProvinceName(rawProvince: string | null | undefined): string | null {
  if (!rawProvince) return null;
  const trimmed = rawProvince.trim();
  if (!trimmed || trimmed.toUpperCase() === 'ALL' || trimmed.toLowerCase() === 'toda españa' || trimmed.toLowerCase() === 'todas') {
    return null;
  }
  const match = ALL_SPANISH_PROVINCES.find(p => isProvinceMatch(trimmed, p));
  return match || trimmed;
}

export const BODAS_NET_CATEGORY_ALIASES: Record<string, BodasNetCategoryId> = {
  finca: 'finca',
  fincas: 'finca',
  banquetes: 'finca',
  espacios: 'finca',
  espacio: 'finca',
  cortijo: 'finca',
  cortijos: 'finca',
  hacienda: 'finca',
  haciendas: 'finca',
  palacio: 'finca',
  palacios: 'finca',
  castillo: 'finca',
  castillos: 'finca',
  masia: 'finca',
  masias: 'finca',
  catering: 'catering',
  caterings: 'catering',
  banquete: 'catering',
  gastro: 'catering',
  gastronomia: 'catering',
  restaurante: 'catering',
  restaurantes: 'catering',
  foto: 'foto',
  fotos: 'foto',
  fotografia: 'foto',
  fotografo: 'foto',
  fotografos: 'foto',
  video: 'foto',
  videos: 'foto',
  videografo: 'foto',
  videografos: 'foto',
  fotomaton: 'foto',
  fotomatones: 'foto',
  musica: 'musica',
  artistas: 'musica',
  artista: 'musica',
  solista: 'musica',
  solistas: 'musica',
  mariachi: 'musica',
  mariachis: 'musica',
  orquesta: 'musica',
  orquestas: 'musica',
  banda: 'musica',
  bandas: 'musica',
  grupo: 'musica',
  grupos: 'musica',
  decoracion: 'decoracion',
  flores: 'decoracion',
  floristeria: 'decoracion',
  floristerias: 'decoracion',
  arcos: 'decoracion',
  wedding: 'wedding',
  'wedding-planner': 'wedding',
  'wedding-planners': 'wedding',
  weddingplanner: 'wedding',
  weddingplanners: 'wedding',
  organizacion: 'wedding',
  'organizacion-bodas': 'wedding',
  coordinacion: 'wedding',
  moda: 'moda',
  novias: 'moda',
  novia: 'moda',
  novios: 'moda',
  novio: 'moda',
  vestidos: 'moda',
  vestido: 'moda',
  trajes: 'moda',
  traje: 'moda',
  belleza: 'moda',
  maquillaje: 'moda',
  peluqueria: 'moda',
  transporte: 'transporte',
  coches: 'transporte',
  coche: 'transporte',
  'coches-de-boda': 'transporte',
  autobus: 'transporte',
  autobuses: 'transporte',
  limusina: 'transporte',
  limusinas: 'transporte',
  sonido: 'sonido',
  luces: 'sonido',
  iluminacion: 'sonido',
  animacion: 'sonido',
  dj: 'sonido',
  djs: 'sonido',
  discomovil: 'sonido',
  discomóvil: 'sonido',
  servicios: 'servicios',
  detalles: 'servicios',
  'detalles-de-boda': 'servicios',
  invitaciones: 'servicios',
  recuerdos: 'servicios',
};

/** Normaliza de manera robusta cualquier entrada al ID canónico oficial de Bodas.net */
export function normalizeBodasNetCategory(
  inputCat: string | null | undefined,
  description?: string,
  name?: string
): string {
  const l = (inputCat || '').toLowerCase().trim();
  if (!l || l === 'all' || l === 'todos' || l === 'todo' || l === 'todas') {
    return 'ALL';
  }

  // 1. Coincidencia directa por ID o Alias
  if (BODAS_NET_CATEGORY_ALIASES[l]) {
    return BODAS_NET_CATEGORY_ALIASES[l];
  }

  const d = (description || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const full = `${l} ${d} ${n}`;

  // 2. Fotografía y Vídeo
  if (full.includes('fotograf') || full.includes('videograf') || full.includes('videomatón') || full.includes('fotomatón') || l.includes('foto') || l.includes('video')) {
    return 'foto';
  }
  // 3. Moda y Belleza
  if (full.includes('traje') || full.includes('vestid') || full.includes('madrina') || full.includes('joyer') || full.includes('joyas') || full.includes('tocado') || full.includes('atelier') || full.includes('peluquer') || full.includes('maquillaj') || l.includes('moda') || l.includes('belleza')) {
    return 'moda';
  }
  // 4. Transporte y Vehículos
  if (full.includes('coche') || full.includes('limusina') || full.includes('autobus') || full.includes('autobús') || full.includes('chofer') || l.includes('transporte')) {
    return 'transporte';
  }
  // 5. Música en Vivo
  if (full.includes('musica') || full.includes('música') || full.includes('mariachi') || full.includes('banda') || full.includes('orquesta') || full.includes('solista') || full.includes('cantante') || full.includes('violin') || full.includes('gospel') || full.includes('grupo musical')) {
    return 'musica';
  }
  // 6. Sonido, Luces & DJ
  if (full.includes('audio') || full.includes('sonido') || full.includes('luces') || full.includes('iluminac') || full.includes('dj') || full.includes('discomovil') || full.includes('discomóvil')) {
    return 'sonido';
  }
  // 7. Fincas & Espacios
  if (full.includes('finca') || full.includes('cortijo') || full.includes('hacienda') || full.includes('masía') || full.includes('masia') || full.includes('casa rural') || full.includes('salon') || full.includes('salón') || full.includes('palacio') || full.includes('castillo') || l.includes('espacio') || full.includes('banquete')) {
    return 'finca';
  }
  // 8. Wedding Planners
  if (full.includes('wedding') || full.includes('planner') || full.includes('organizac') || full.includes('coordinac')) {
    return 'wedding';
  }
  // 9. Decoración & Floristería
  if (full.includes('decor') || full.includes('flor') || full.includes('ambientac')) {
    return 'decoracion';
  }
  // 10. Catering & Gastronomía
  if (l.includes('cater') || full.includes('banquete') || full.includes('gastro') || full.includes('comida') || full.includes('paella') || full.includes('restaurante')) {
    return 'catering';
  }

  return 'servicios';
}

/**
 * 🏰 LAS 10 TIPOLOGÍAS OFICIALES DE ESPACIOS PARA BODAS (BODAS.NET / DIRECTIVAS SECTORIALES)
 */
export interface VenueTypology {
  id: string;
  label: string;
  shortLabel: string;
  iconEmoji: string;
  keywords: string[];
}

export const ALL_VENUE_TYPOLOGIES: VenueTypology[] = [
  { id: 'all', label: 'Todos los Espacios', shortLabel: 'Todos', iconEmoji: '🏰', keywords: [] },
  { id: 'finca', label: '🌿 Fincas, Dehesas & Huertas', shortLabel: 'Fincas', iconEmoji: '🌿', keywords: ['finca', 'dehesa', 'huerta', 'campo', 'rústica', 'rustica', 'fincas'] },
  { id: 'cortijo', label: '🏛️ Cortijos, Haciendas & Cigarrales', shortLabel: 'Cortijos', iconEmoji: '🏛️', keywords: ['cortijo', 'cortijos', 'hacienda', 'haciendas', 'cigarral', 'cigarrales', 'rancho'] },
  { id: 'masia', label: '🏡 Masías, Caseríos & Pazos', shortLabel: 'Masías & Pazos', iconEmoji: '🏡', keywords: ['masia', 'masía', 'masias', 'masías', 'caserio', 'caserío', 'caserios', 'pazo', 'pazos', 'casona', 'casa rural'] },
  { id: 'palacio', label: '👑 Palacios, Castillos & Torres', shortLabel: 'Palacios & Castillos', iconEmoji: '👑', keywords: ['palacio', 'palacios', 'castillo', 'castillos', 'torre', 'fortaleza', 'alcazar', 'alcázar'] },
  { id: 'hotel', label: '🏨 Hoteles para Bodas & Paradores', shortLabel: 'Hoteles', iconEmoji: '🏨', keywords: ['hotel', 'hoteles', 'parador', 'paradores', 'resort', 'suites'] },
  { id: 'restaurante', label: '🍽️ Restaurantes & Asadores de Boda', shortLabel: 'Restaurantes', iconEmoji: '🍽️', keywords: ['restaurante', 'restaurantes', 'asador', 'asadores', 'mesón', 'meson', 'posada'] },
  { id: 'salon', label: '🥂 Salones de Banquetes & Complejos', shortLabel: 'Salones', iconEmoji: '🥂', keywords: ['salon', 'salón', 'salones', 'complejo', 'banquetes'] },
  { id: 'bodega', label: '🍷 Bodegas & Viñedos', shortLabel: 'Bodegas', iconEmoji: '🍷', keywords: ['bodega', 'bodegas', 'viñedo', 'viñedos', 'vinedo', 'enoturismo'] },
  { id: 'singular', label: '✨ Espacios Singulares & Monumentos', shortLabel: 'Singulares', iconEmoji: '✨', keywords: ['singular', 'singulares', 'monumento', 'teatro', 'museo', 'invernadero', 'carpa', 'fábrica', 'fabrica'] },
  { id: 'playa', label: '🌊 Playas, Terrazas & Acantilados', shortLabel: 'Playa & Vistas', iconEmoji: '🌊', keywords: ['playa', 'playas', 'mar', 'costa', 'terraza', 'acantilado', 'puerto', 'bahía', 'bahia'] },
];
