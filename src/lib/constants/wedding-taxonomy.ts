/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🏛️ EAR OS — TAXONOMÍA CANÓNICA DE BODAS (bodas.net S-CLASS KILLER)
 * ════════════════════════════════════════════════════════════════════════════
 * SSOT único de la pirámide de categorías nupciales (pSEO + UX de conversión).
 *
 * ESTRUCTURA INVERSA (de la conversión al origen):
 *   [CONVERSIÓN] Stripe 100 € Price-Lock / WhatsApp / n8n
 *   [NIVEL 4]    Ficha canónica → /proveedores/[slug]
 *   [NIVEL 3]    Marketplace facetado → /bodas/[provincia]/[servicio]
 *   [NIVEL 2]    Intersección geográfica → /bodas/[provincia]
 *   [NIVEL 1]    Taxonomía de macro-gremios → /bodas
 *
 * REGLAS INMUTABLES (Omega Diamante):
 *  - CERO precios hardcodeados en la ruta de dinero. Los tiers €/€€/€€€ son
 *    clasificación de UX y derivan del ancla SSOT TARIFA_BASE_SOLISTA_EUR (350 €).
 *    El dinero real vive SIEMPRE en ear-os-ssot.ts (Zona Cero).
 *  - Cada categoría hoja pliega a un servicio canónico (CANONICAL_SERVICES) para
 *    consolidar la señal SEO y erradicar URLs doorway.
 *  - CERO `any`, tipado estricto, inmutabilidad con Object.freeze / as const.
 *  - CERO cifras inventadas: contadores por gremio derivan del manifest público.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { PROVIDERS_MANIFEST_TOTALS } from '@/lib/constants/providers-manifest';

/** IDs de los macro-gremios B2C de bodas (espejo bodas.net + EAR OS). */
export type WeddingGremioId =
  | 'musica'
  | 'fincas'
  | 'catering'
  | 'tecnica'
  | 'fotografia'
  | 'moda'
  | 'decoracion'
  | 'transporte'
  | 'wedding';

/** Tiers de precio facetados (clasificación de UX, no motor financiero). */
export type PriceTierId = 'economico' | 'premium' | 'lujo';

/** Momentos del evento nupcial (filtro de tipo de momento). */
export type WeddingMomentId = 'ceremonia-civil' | 'coctel' | 'banquete' | 'barra-libre';

export interface WeddingGremio {
  id: WeddingGremioId;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Acento OLED del gremio (un solo color por vista, sin degradados AI-slop). */
  accent: string;
  /** Clave de icono lucide (mapeada en la capa UI). */
  icon: string;
  /** Emoji de escaparate (renderizado directo, sin dependencia JSX). */
  emoji: string;
  /** true si pertenece al NIVEL 1 (macro-gremios del hub raíz). */
  isMacro: boolean;
}

export interface WeddingCategory {
  slug: string;
  gremioId: WeddingGremioId;
  name: string;
  aliases: readonly string[];
  description: string;
  priceTier: PriceTierId;
  /** Slug del servicio canónico /bodas/[provincia]/[servicio]. null → directorio B2C. */
  canonicalServiceSlug: string | null;
  emoji: string;
}

export interface PriceTier {
  id: PriceTierId;
  glyph: string;
  name: string;
  min: number;
  max: number | null;
  label: string;
}

export interface WeddingMoment {
  id: WeddingMomentId;
  name: string;
  description: string;
}

/** Estado agregado de la barra de filtros facetados (reactivo vía URL Search Params). */
export interface WeddingFacetState {
  gremio: WeddingGremioId;
  categoria: string | null;
  provincia: string;
  precio: PriceTierId | 'all';
  fecha: string | null;
  radioKm: number;
  momento: WeddingMomentId | 'all';
}

/**
 * 💎 TOKENS DE DISEÑO OMEGA DIAMANTE — "la inversa de diseño" de bodas.net.
 * Colores, tipografía, radios y transiciones del sub-tema nupcial EAR OS.
 */
export const WEDDING_DESIGN_TOKENS = Object.freeze({
  canvas: '#030305',
  surface: '#09090d',
  surfaceElevated: '#0c0a0e',
  border: 'rgba(255, 255, 255, 0.10)',
  accent: '#ecb613',
  accentGlow: 'rgba(236, 182, 19, 0.35)',
  ruby: '#FF2B44',
  cyan: '#00E5FF',
  emerald: '#34D399',
  radiusCard: '1.5rem',
  radiusPill: '9999px',
  fontDisplay: 'Syne',
  fontBody: 'Montserrat',
  fontMono: 'JetBrains Mono',
  transition: 'all 0.3s ease-out',
} as const);

export type WeddingDesignTokens = typeof WEDDING_DESIGN_TOKENS;

/** NIVEL 1 — TAXONOMÍA DE MACRO-GREMIOS (y gremios B2C del directorio). */
export const WEDDING_GREMIOS: readonly WeddingGremio[] = Object.freeze([
  {
    id: 'musica',
    slug: 'musica',
    name: 'Música & Animación',
    tagline: 'El alma sonora de vuestra boda',
    description: 'Mariachis, DJs, solistas acústicos, saxofonistas y orquestas con rider acústico calibrado por contexto (Ley 37/2003).',
    accent: '#ecb613',
    icon: 'music',
    emoji: '🎵',
    isMacro: true,
  },
  {
    id: 'fincas',
    slug: 'fincas-espacios',
    name: 'Fincas & Espacios',
    tagline: 'El escenario de vuestro "Sí, quiero"',
    description: 'Fincas rústicas, palacetes, masías y espacios al aire libre homologados con coordinación logística S-Class.',
    accent: '#34D399',
    icon: 'building',
    emoji: '🏛️',
    isMacro: true,
  },
  {
    id: 'catering',
    slug: 'catering-brasas',
    name: 'Catering & Brasas',
    tagline: 'Alta cocina y brasas de autor',
    description: 'Catering gourmet, brasas y food trucks con maridaje seleccionado y servicio de sala impecable.',
    accent: '#F97316',
    icon: 'utensils',
    emoji: '🍽️',
    isMacro: true,
  },
  {
    id: 'tecnica',
    slug: 'audiovisuales-led',
    name: 'Audiovisuales & LED',
    tagline: 'Técnica invisible, emoción visible',
    description: 'Sonorización de ceremonia, pantallas LED, iluminación decorativa arquitectónica y discoteca móvil.',
    accent: '#00E5FF',
    icon: 'monitor',
    emoji: '🖥️',
    isMacro: true,
  },
  {
    id: 'fotografia',
    slug: 'foto-video',
    name: 'Foto & Vídeo',
    tagline: 'Memoria cinematográfica',
    description: 'Fotografía y videografía de boda con entrega editorial S-Class y álbum de alta costura.',
    accent: '#FB7185',
    icon: 'camera',
    emoji: '📸',
    isMacro: false,
  },
  {
    id: 'moda',
    slug: 'moda-complementos',
    name: 'Moda & Complementos',
    tagline: 'La imagen del gran día',
    description: 'Vestidos de novia, trajes de novio y complementos de autor para una estética impecable.',
    accent: '#E7C6A5',
    icon: 'shirt',
    emoji: '👔',
    isMacro: false,
  },
  {
    id: 'decoracion',
    slug: 'decoracion-floristeria',
    name: 'Decoración & Floristería',
    tagline: 'Atmósfera de cuento',
    description: 'Decoración floral e integral con dirección de arte para un ambiente envolvente y coherente.',
    accent: '#FBBF24',
    icon: 'flower',
    emoji: '💐',
    isMacro: false,
  },
  {
    id: 'transporte',
    slug: 'transporte-logistica',
    name: 'Transporte & Logística',
    tagline: 'Llegada y logística impecable',
    description: 'Coches clásicos con chófer y autobuses para invitados con puntualidad garantizada.',
    accent: '#94A3B8',
    icon: 'car',
    emoji: '🚗',
    isMacro: false,
  },
  {
    id: 'wedding',
    slug: 'wedding-planners',
    name: 'Wedding Planners',
    tagline: 'Dirección integral 360',
    description: 'Wedding planners y maestros de ceremonia con protocolo de autor y narrativa emocional.',
    accent: '#F5C538',
    icon: 'heart',
    emoji: '💍',
    isMacro: false,
  },
]);

/** NIVEL 3 — CATEGORÍAS HOJA (cada una pliega a un servicio canónico). */
export const WEDDING_CATEGORIES: readonly WeddingCategory[] = Object.freeze([
  // Música & Animación
  { slug: 'mariachis', gremioId: 'musica', name: 'Mariachis', aliases: ['mariachi', 'mariachis-boda'], description: 'Agrupaciones de conservatorio y tenor solista para el momento álgido de la celebración.', priceTier: 'premium', canonicalServiceSlug: 'mariachis', emoji: '🎺' },
  { slug: 'djs-para-bodas', gremioId: 'musica', name: 'DJs para Bodas', aliases: ['dj', 'disc-jockey'], description: 'Ingeniería rítmica y barra libre musical con lectura de pista en tiempo real.', priceTier: 'economico', canonicalServiceSlug: 'dj', emoji: '🎧' },
  { slug: 'solistas-acusticos', gremioId: 'musica', name: 'Solistas Acústicos', aliases: ['solista', 'solista-premium'], description: 'Voz de tenor y repertorio de gala para ceremonia y cóctel (70-80 dBA).', priceTier: 'economico', canonicalServiceSlug: 'musica-ceremonia', emoji: '🎤' },
  { slug: 'duos-trios', gremioId: 'musica', name: 'Dúos & Tríos', aliases: ['duo', 'trio'], description: 'Formatos íntimos con arreglos vocales e instrumentales para espacios reducidos.', priceTier: 'economico', canonicalServiceSlug: 'musica-ceremonia', emoji: '🎸' },
  { slug: 'saxofonistas', gremioId: 'musica', name: 'Saxofonistas', aliases: ['saxo', 'saxofonista'], description: 'Saxo en directo con bases electrónicas para cócteles y entradas de gala.', priceTier: 'economico', canonicalServiceSlug: 'musica-ceremonia', emoji: '🎷' },
  { slug: 'coros-rocieros', gremioId: 'musica', name: 'Coros Rocieros', aliases: ['coro-rociero'], description: 'Coros rocieros y flamenco para bodas con raíz andaluza y emoción colectiva.', priceTier: 'premium', canonicalServiceSlug: 'musica-ceremonia', emoji: '🎼' },
  { slug: 'orquestas', gremioId: 'musica', name: 'Orquestas', aliases: ['orquesta'], description: 'Orquestas y grandes ensambles para banquetes monumentales de alto aforo.', priceTier: 'lujo', canonicalServiceSlug: 'musica-ceremonia', emoji: '🎻' },
  { slug: 'cuartetos-cuerdas', gremioId: 'musica', name: 'Cuartetos de Cuerdas', aliases: ['cuarteto', 'cuerdas'], description: 'Cuartetos de cuerda clásica para ceremonias civiles y religiosas elegantes.', priceTier: 'premium', canonicalServiceSlug: 'musica-ceremonia', emoji: '🎻' },
  { slug: 'bandas-grupos', gremioId: 'musica', name: 'Bandas & Grupos', aliases: ['banda', 'grupo'], description: 'Bandas en vivo y grupos de versiones para el baile y la fiesta final.', priceTier: 'premium', canonicalServiceSlug: 'animacion', emoji: '🥁' },
  // Fincas & Espacios
  { slug: 'fincas-rusticas', gremioId: 'fincas', name: 'Fincas Rústicas', aliases: ['finca-rustica'], description: 'Fincas rústicas y dehesas con encanto natural y logística S-Class.', priceTier: 'lujo', canonicalServiceSlug: 'fincas', emoji: '🌿' },
  { slug: 'palacetes', gremioId: 'fincas', name: 'Palacetes', aliases: ['palacio', 'castillo'], description: 'Palacetes, castillos y haciendas para bodas de etiqueta y protocolo de autor.', priceTier: 'lujo', canonicalServiceSlug: 'fincas', emoji: '🏰' },
  { slug: 'masias', gremioId: 'fincas', name: 'Masías', aliases: ['masia', 'casa-rural'], description: 'Masías y casas rurales con acústica cuidada y entorno natural íntimo.', priceTier: 'premium', canonicalServiceSlug: 'fincas', emoji: '🏡' },
  { slug: 'salones-hoteles', gremioId: 'fincas', name: 'Salones & Hoteles', aliases: ['salon', 'hotel'], description: 'Salones y hoteles urbanos con servicio integral para bodas de ciudad.', priceTier: 'premium', canonicalServiceSlug: 'fincas', emoji: '🥂' },
  { slug: 'restaurantes-para-bodas', gremioId: 'fincas', name: 'Restaurantes para Bodas', aliases: ['restaurante'], description: 'Restaurantes con espacio nupcial y maridaje de autor para celebraciones gourmet.', priceTier: 'premium', canonicalServiceSlug: 'fincas', emoji: '🍽️' },
  { slug: 'espacios-al-aire-libre', gremioId: 'fincas', name: 'Espacios al Aire Libre', aliases: ['aire-libre', 'jardin'], description: 'Jardines y espacios al aire libre con plan B de climatización y sonido homologado.', priceTier: 'premium', canonicalServiceSlug: 'fincas', emoji: '🌳' },
  // Catering & Brasas
  { slug: 'catering-gourmet', gremioId: 'catering', name: 'Catering Gourmet', aliases: ['catering-gourmet'], description: 'Alta cocina de autor con menús degustación y maridaje seleccionado.', priceTier: 'premium', canonicalServiceSlug: 'catering', emoji: '🍷' },
  { slug: 'catering-brasas', gremioId: 'catering', name: 'Catering de Brasas', aliases: ['brasa', 'asador'], description: 'Brasas y asadores en vivo para banquetes con sabor y espectáculo.', priceTier: 'economico', canonicalServiceSlug: 'catering', emoji: '🔥' },
  { slug: 'food-trucks', gremioId: 'catering', name: 'Food Trucks', aliases: ['food-truck'], description: 'Food trucks temáticos para cócteles informales y bodas desenfadadas.', priceTier: 'economico', canonicalServiceSlug: 'catering', emoji: '🚚' },
  // Audiovisuales & LED
  { slug: 'sonorizacion-ceremonia', gremioId: 'tecnica', name: 'Sonorización de Ceremonia', aliases: ['sonido', 'sonorizacion'], description: 'Sonido Bose y L-Acoustics calibrado 12 W/pax con montaje invisible.', priceTier: 'premium', canonicalServiceSlug: 'sonorizacion', emoji: '🔊' },
  { slug: 'pantallas-led', gremioId: 'tecnica', name: 'Pantallas LED', aliases: ['pantalla-led', 'led'], description: 'Pantallas LED de alta resolución para exteriores e interiores de gran impacto.', priceTier: 'premium', canonicalServiceSlug: 'pantallas-led', emoji: '🖥️' },
  { slug: 'iluminacion-decorativa', gremioId: 'tecnica', name: 'Iluminación Decorativa', aliases: ['iluminacion'], description: 'Iluminación arquitectónica y decorativa para atmósferas de ensueño.', priceTier: 'premium', canonicalServiceSlug: 'sonorizacion', emoji: '💡' },
  { slug: 'discoteca-movil', gremioId: 'tecnica', name: 'Discoteca Móvil', aliases: ['discoteca'], description: 'Discoteca móvil con láser, humo y DJ residente para la fiesta final.', priceTier: 'economico', canonicalServiceSlug: 'dj', emoji: '🪩' },
  { slug: 'animacion-hora-loca', gremioId: 'tecnica', name: 'Animación Hora Loca', aliases: ['hora-loca', 'animacion'], description: 'Animación con atrezo, percusión y performers para la hora loca del banquete.', priceTier: 'economico', canonicalServiceSlug: 'animacion', emoji: '🎉' },
  // Foto & Vídeo
  { slug: 'fotografia-boda', gremioId: 'fotografia', name: 'Fotografía de Boda', aliases: ['fotografo'], description: 'Fotografía editorial de boda con sesión pre-boda y álbum de alta costura.', priceTier: 'premium', canonicalServiceSlug: 'fotografia', emoji: '📸' },
  { slug: 'videografia-boda', gremioId: 'fotografia', name: 'Videografía de Boda', aliases: ['video', 'videografo'], description: 'Cine de boda con teaser cinematográfico y entrega en 4K.', priceTier: 'premium', canonicalServiceSlug: 'fotografia', emoji: '🎥' },
  // Moda & Complementos (directorio B2C)
  { slug: 'vestidos-novia', gremioId: 'moda', name: 'Vestidos de Novia', aliases: ['vestido'], description: 'Vestidos de novia de autor y alta costura con prueba personalizada.', priceTier: 'premium', canonicalServiceSlug: null, emoji: '👰' },
  { slug: 'trajes-novio', gremioId: 'moda', name: 'Trajes de Novio', aliases: ['traje'], description: 'Trajes de novio a medida e invitados con sastrería de precisión.', priceTier: 'economico', canonicalServiceSlug: null, emoji: '🤵' },
  // Decoración & Floristería
  { slug: 'decoracion-floral', gremioId: 'decoracion', name: 'Decoración Floral', aliases: ['flores', 'floristeria'], description: 'Floristería de autor y arreglos florales para ceremonia y banquete.', priceTier: 'premium', canonicalServiceSlug: 'decoracion', emoji: '💐' },
  { slug: 'decoracion-integral', gremioId: 'decoracion', name: 'Decoración Integral', aliases: ['decoracion'], description: 'Dirección de arte integral con escenografía y atrezo coordinado.', priceTier: 'lujo', canonicalServiceSlug: 'decoracion', emoji: '✨' },
  // Transporte & Logística
  { slug: 'coches-clasicos', gremioId: 'transporte', name: 'Coches Clásicos', aliases: ['coche-boda'], description: 'Coches clásicos y de lujo con chófer para la llegada de los novios.', priceTier: 'economico', canonicalServiceSlug: 'coches-boda', emoji: '🚗' },
  { slug: 'autobuses-invitados', gremioId: 'transporte', name: 'Autobuses para Invitados', aliases: ['autobus'], description: 'Autobuses y transfers para invitados con logística coordinada.', priceTier: 'economico', canonicalServiceSlug: null, emoji: '🚌' },
  // Wedding Planners
  { slug: 'wedding-planner', gremioId: 'wedding', name: 'Wedding Planner', aliases: ['organizador-bodas'], description: 'Dirección y coordinación integral 360 del enlace sin imprevistos.', priceTier: 'premium', canonicalServiceSlug: 'wedding-planner', emoji: '📋' },
  { slug: 'maestros-ceremonia', gremioId: 'wedding', name: 'Maestros de Ceremonia', aliases: ['oficiante'], description: 'Oficiantes y maestros de ceremonia con protocolo de autor y narrativa emotiva.', priceTier: 'economico', canonicalServiceSlug: 'maestros-ceremonia', emoji: '🎙️' },
]);
/** Ancla SSOT de entrada (Tarifa Base Solista). Los tiers facetados parten de aquí. */
export const WEDDING_ENTRY_PRICE_EUR: number = TARIFA_BASE_SOLISTA_EUR;

/** Tiers de precio facetados (clasificación de UX, no motor financiero). */
export const PRICE_TIERS: readonly PriceTier[] = Object.freeze([
  { id: 'economico', glyph: '€', name: 'Esencial', min: 0, max: 500, label: 'hasta 500 €' },
  { id: 'premium', glyph: '€€', name: 'Premium', min: 500, max: 1200, label: '500 – 1.200 €' },
  { id: 'lujo', glyph: '€€€', name: 'Gran Gala', min: 1200, max: null, label: '1.200 €+' },
]);

/** Momentos del evento nupcial (filtro de tipo de momento). */
export const WEDDING_MOMENTS: readonly WeddingMoment[] = Object.freeze([
  { id: 'ceremonia-civil', name: 'Ceremonia Civil', description: 'Oficiante, música en directo y sonorización de ceremonia.' },
  { id: 'coctel', name: 'Cóctel', description: 'Música de ambiente, catering y animación de bienvenida.' },
  { id: 'banquete', name: 'Banquete', description: 'Alta cocina, orquesta o banda y dirección de protocolo.' },
  { id: 'barra-libre', name: 'Barra Libre', description: 'DJ, discoteca móvil y hora loca para la fiesta final.' },
]);

/** Opciones de radio geográfico (km) para el filtro de ubicación. */
export const RADIO_OPTIONS: readonly number[] = Object.freeze([25, 50, 100, 200]);

/** NIVEL 1 — subconjunto de macro-gremios del hub raíz. */
export const WEDDING_MACRO_GREMIOS: readonly WeddingGremio[] = WEDDING_GREMIOS.filter((g) => g.isMacro);

export function getGremioById(id: string): WeddingGremio | null {
  return WEDDING_GREMIOS.find((g) => g.id === id) ?? null;
}

export function getGremioBySlug(slug: string): WeddingGremio | null {
  const s = slug.toLowerCase();
  return WEDDING_GREMIOS.find((g) => g.slug === s || g.id === s) ?? null;
}

export function getCategoriesByGremio(gremioId: WeddingGremioId): readonly WeddingCategory[] {
  return WEDDING_CATEGORIES.filter((c) => c.gremioId === gremioId);
}

export function getCategoryBySlug(slug: string): WeddingCategory | null {
  const s = slug.toLowerCase();
  return WEDDING_CATEGORIES.find((c) => c.slug === s || c.aliases.includes(s)) ?? null;
}

export function getPriceTierById(id: PriceTierId): PriceTier {
  return PRICE_TIERS.find((t) => t.id === id) ?? PRICE_TIERS[0];
}

export function getPriceTierForPrice(price: number): PriceTierId {
  if (price < 500) return 'economico';
  if (price < 1200) return 'premium';
  return 'lujo';
}

export function getMomentById(id: WeddingMomentId): WeddingMoment | null {
  return WEDDING_MOMENTS.find((m) => m.id === id) ?? null;
}

export function buildBodasProvinceHref(provincia: string): string {
  return `/bodas/${provincia.toLowerCase().trim()}`;
}

/** Construye la URL canónica de una categoría hoja (pliega a servicio canónico o directorio B2C). */
export function buildBodasCategoryHref(provincia: string, categoriaSlug: string): string {
  const cat = getCategoryBySlug(categoriaSlug);
  if (!cat) return buildBodasProvinceHref(provincia);
  if (cat.canonicalServiceSlug) {
    return `/bodas/${provincia.toLowerCase().trim()}/${cat.canonicalServiceSlug}`;
  }
  return `/proveedores?categoria=${cat.gremioId}`;
}

const GREMIO_MANIFEST_MAP: Record<WeddingGremioId, keyof typeof PROVIDERS_MANIFEST_TOTALS> = {
  musica: 'musica',
  fincas: 'finca',
  catering: 'catering',
  tecnica: 'sonido',
  fotografia: 'foto',
  moda: 'moda',
  decoracion: 'decoracion',
  transporte: 'transporte',
  wedding: 'wedding',
};

/** Conteo trazable de proveedores por gremio (deriva del manifest público del Data Lake). */
export function getGremioProviderCount(gremioId: WeddingGremioId): number {
  return PROVIDERS_MANIFEST_TOTALS[GREMIO_MANIFEST_MAP[gremioId]];
}

/** Objeto agregado de la taxonomía (único punto de importación para consumidores). */
export const WEDDING_TAXONOMY = Object.freeze({
  designTokens: WEDDING_DESIGN_TOKENS,
  gremios: WEDDING_GREMIOS,
  categories: WEDDING_CATEGORIES,
  priceTiers: PRICE_TIERS,
  moments: WEDDING_MOMENTS,
  radioOptions: RADIO_OPTIONS,
} as const);
