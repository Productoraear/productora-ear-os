import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Prisma } from '@prisma/client';

import type { ProviderItem } from '@/components/providers/BentoProviderCard';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';
import {
  findCanonicalProvinceName,
  getProvinceSearchVariants,
  isAllSpainProvince,
  isProvinceMatch,
  normalizeBodasNetCategory,
  resolveProvince,
} from '@/lib/constants/spain-regions-and-categories';
import { CENTRALITA } from '@/lib/phone-constants';
import { prisma } from '@/lib/prisma';
import { resolvePublicProviderDisplayName } from '@/lib/providers/contact-gate';

export type ProviderSearchSource = 'PRISMA_DATABASE' | 'STATIC_EDGE_SYNCHRONIZED';

export interface SearchProvidersServerParams {
  cat?: string | null;
  category?: string | null;
  subcat?: string | null;
  subcategory?: string | null;
  provincia?: string | null;
  province?: string | null;
  q?: string | null;
  maxPrice?: number | null;
  page?: number;
  limit?: number;
  /** Optional HTTP request URL for Netlify/serverless CDN fallback when disk files are absent. */
  requestUrl?: string;
}

export interface SearchProvidersServerResult {
  success: true;
  providers: ProviderItem[];
  items: ProviderItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  normalizedCategory: string;
  normalizedProvince: string | null;
  source: ProviderSearchSource;
}

type RawProviderRecord = Record<string, unknown> & {
  id?: string | number;
  vendorId?: string | number;
  shaHash?: string;
  name?: string;
  slug?: string;
  category?: string;
  province?: string;
  municipality?: string;
  address?: string;
  description?: string;
  description_full?: string;
  price?: string | number | null;
  priceLabel?: string;
  basePrice?: number;
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  img?: string;
  imageUrls?: string[];
  gallery?: string[];
  galleryReal?: string[];
  phone?: string | null;
  telephone?: string | null;
  has_real_phone?: boolean;
  hasDirectPhone?: boolean;
  verified?: boolean;
  isClaimed?: boolean;
  isPreferred?: boolean;
  estadoHomologacion?: 'CERTIFICADA_GOLD_MASTER' | 'AUDITORIA_VIGENTE' | 'ASOCIADO_STANDARD';
  status?: string;
  badge?: string | null;
  customUrl?: string | null;
  profile_url?: string | null;
  sourceUrl?: string | null;
  originHtml?: string | null;
  original_html?: string | null;
  google_search_url?: string;
  google_maps_url?: string;
  capacidadMaxPax?: number | null;
  services_list?: string[];
  faqs?: unknown;
  gremioTag?: string;
  genres?: string[];
};

interface ProviderManifestPartition {
  chunks?: string[];
  count?: number;
}

const globalForSearchCache = globalThis as typeof globalThis & {
  __earDirJsonChunkCache?: Map<string, readonly RawProviderRecord[]>;
  __earDirManifestCache?: Record<string, ProviderManifestPartition>;
};

const jsonChunkCache: Map<string, readonly RawProviderRecord[]> =
  (globalForSearchCache.__earDirJsonChunkCache ??= new Map());

const UNIQUE_HD_FINCA_IMAGES = [
  'https://cdn0.bodas.net/vendor/0530/3_2/1280/jpg/jardines-la-cartuja-grupo-la-cartuja-16_1_530.jpeg',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
];

const API_FALLBACK_POOLS: Record<string, string[]> = {
  finca: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
  ],
  catering: [
    'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
  ],
  decoracion: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  ],
  musica: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop',
  ],
  sonido: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop',
  ],
  foto: [
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
  ],
  wedding: [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
  ],
  moda: [
    'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
  ],
  transporte: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
  ],
  servicios: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
  ],
};

function resolveApiPool(category?: string | null): string[] {
  let cat = (category || '').toLowerCase().trim();
  if (
    cat.includes('music') ||
    cat.includes('dj') ||
    cat.includes('mariachi') ||
    cat.includes('banda') ||
    cat.includes('solista') ||
    cat.includes('cuerda') ||
    cat.includes('flamenco') ||
    cat.includes('animacion')
  ) {
    cat = 'musica';
  } else if (!cat) {
    cat = 'servicios';
  }
  return API_FALLBACK_POOLS[cat] || API_FALLBACK_POOLS.servicios;
}

function getRealGallery(category: string | null | undefined, images: string[] = []): string[] {
  const pool = resolveApiPool(category);
  return images.filter((u) => typeof u === 'string' && /^https?:\/\//.test(u) && !pool.includes(u));
}

function getApiAugmentedGallery(category?: string | null, cleanImages: string[] = []): string[] {
  const pool = resolveApiPool(category);
  const result = [...cleanImages];
  let poolIdx = 0;
  while (result.length < 6 && poolIdx < pool.length) {
    const candidate = pool[poolIdx];
    if (!result.includes(candidate)) {
      result.push(candidate);
    }
    poolIdx++;
  }
  return result.length > 0 ? result : pool;
}

function getApiFallbackImage(category?: string | null, seed?: string | null): string {
  const pool = resolveApiPool(category);
  if (!seed) return pool[0];
  const str = String(seed);
  const hash = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

const FINCAS_HOMOLOGADAS_ITEMS: RawProviderRecord[] = SCLASS_12_FINCAS_HOMOLOGADAS.map((f, idx) => {
  const selectedImg = UNIQUE_HD_FINCA_IMAGES[idx % UNIQUE_HD_FINCA_IMAGES.length];
  const enrichedGallery = getApiAugmentedGallery('finca', [selectedImg]);
  return {
    id: f.id,
    name: f.name,
    slug: f.slug,
    category: 'finca',
    province: f.provincia,
    address: `${f.location}, España`,
    centralitaPhone: CENTRALITA.display,
    phoneType: 'Centralita Concierge EAR (no es teléfono del proveedor)',
    img: selectedImg,
    imageUrls: enrichedGallery,
    gallery: enrichedGallery,
    galleryReal: [selectedImg],
    description: f.description,
    services_list: f.espaciosDisponibles,
    capacidadMaxPax: f.capacidadMaxPax,
  };
});

const OTZARRETA_CANONICAL_API = Object.freeze({
  name: `${OTZARRETA_ENTITY.commercialName} & Ezkertza Berria • Eduardo Martínez`,
  slug: OTZARRETA_ENTITY.slug,
  category: 'finca',
  province: OTZARRETA_ENTITY.provinceAlias,
  municipality: OTZARRETA_ENTITY.municipality,
  address: OTZARRETA_ENTITY.fullAddress,
  description: `Caserío tradicional vasco y asador en Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia · comarca Txorierri / Gran Bilbao): cocina de cazuela vasca y parrilla al carbón de encina dirigida por Eduardo Martínez. Salón acristalado de 50 a 200 comensales y capacidad total de hasta ${OTZARRETA_ENTITY.capacityPax} pax con jardines botánicos para ceremonias civiles, carpa climatizada y ${OTZARRETA_ENTITY.parkingSpaces} plazas de aparcamiento privado.`,
  price: `${new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(OTZARRETA_ENTITY.weddingPriceFromEur)} €`,
  priceLabel: 'Desde',
  basePrice: OTZARRETA_ENTITY.weddingPriceFromEur,
  capacidadMaxPax: OTZARRETA_ENTITY.capacityPax,
  phone: OTZARRETA_ENTITY.primaryPhone,
  telephone: OTZARRETA_ENTITY.primaryPhone,
  has_real_phone: true,
  hasDirectPhone: true,
  verified: true,
  img: OTZARRETA_ENTITY.scrapedAssets.facade,
  imageUrls: [OTZARRETA_ENTITY.scrapedAssets.facade, OTZARRETA_ENTITY.scrapedAssets.diningHall],
  gallery: [OTZARRETA_ENTITY.scrapedAssets.facade, OTZARRETA_ENTITY.scrapedAssets.diningHall],
  galleryReal: [OTZARRETA_ENTITY.scrapedAssets.facade, OTZARRETA_ENTITY.scrapedAssets.diningHall],
  has_real_gallery: true,
  galleryAugmented: false,
  isPreferred: true,
  badge: 'ALIANZA VIP S-CLASS · GRUPO OTZARRETA',
  customUrl: '/otzarreta',
});

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isOtzarretaRecord(record: { id?: unknown; slug?: unknown; name?: unknown }): boolean {
  const id = String(record.id ?? '');
  const slug = String(record.slug ?? '');
  const name = String(record.name ?? '');
  return id === 'v-32714' || slug === OTZARRETA_ENTITY.slug || /otzarreta/i.test(slug) || /otzarreta/i.test(name);
}

function buildCanonicalOtzarretaRecord(
  p: {
    id?: unknown;
    vendorId?: unknown;
    shaHash?: unknown;
    rating?: unknown;
    reviewsCount?: unknown;
  },
  meta: {
    isClaimed: boolean;
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER' | 'AUDITORIA_VIGENTE' | 'ASOCIADO_STANDARD';
  },
): ProviderItem {
  const canonicalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${OTZARRETA_CANONICAL_API.name} ${OTZARRETA_ENTITY.fullAddress}`,
  )}`;
  const canonicalSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${OTZARRETA_CANONICAL_API.name} ${OTZARRETA_ENTITY.municipality} ${OTZARRETA_ENTITY.province} telefono`,
  )}`;

  return {
    id: typeof p.id === 'string' && p.id.length > 0 ? p.id : 'v-32714',
    ...(typeof p.shaHash === 'string' ? { shaHash: p.shaHash } : {}),
    ...(typeof p.rating === 'number' ? { rating: p.rating } : {}),
    ...(typeof p.reviewsCount === 'number' ? { reviews: p.reviewsCount, reviewsCount: p.reviewsCount } : {}),
    isClaimed: meta.isClaimed,
    estadoHomologacion: meta.estadoHomologacion,
    ...OTZARRETA_CANONICAL_API,
    profile_url: OTZARRETA_ENTITY.website,
    sourceUrl: OTZARRETA_ENTITY.website,
    originHtml: null,
    original_html: null,
    google_search_url: canonicalSearchUrl,
    google_maps_url: canonicalMapsUrl,
    description_full: OTZARRETA_CANONICAL_API.description,
    faqs: [],
    services_list: [...OTZARRETA_ENTITY.affiliatedVenues[0].features],
  };
}

const SUBCATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  finca: ['finca', 'dehesa', 'huerta', 'campo', 'rústica', 'rustica', 'fincas'],
  cortijo: ['cortijo', 'cortijos', 'hacienda', 'haciendas', 'cigarral', 'cigarrales', 'rancho'],
  masia: ['masia', 'masía', 'masias', 'masías', 'caserio', 'caserío', 'caserios', 'pazo', 'pazos', 'casona', 'casa rural'],
  palacio: ['palacio', 'palacios', 'castillo', 'castillos', 'torre', 'fortaleza', 'alcazar', 'alcázar'],
  hotel: ['hotel', 'hoteles', 'parador', 'paradores', 'resort', 'suites'],
  restaurante: ['restaurante', 'restaurantes', 'asador', 'asadores', 'mesón', 'meson', 'posada'],
  salon: ['salon', 'salón', 'salones', 'complejo', 'banquetes'],
  bodega: ['bodega', 'bodegas', 'viñedo', 'viñedos', 'vinedo', 'enoturismo'],
  singular: ['singular', 'singulares', 'monumento', 'teatro', 'museo', 'invernadero', 'carpa', 'fábrica', 'fabrica'],
  playa: ['playa', 'playas', 'mar', 'costa', 'terraza', 'acantilado', 'puerto', 'bahía', 'bahia'],
  rustica: ['rústica', 'rustica', 'dehesa', 'finca rústica'],
  solista: ['solista', 'edwin agudelo', 'cantante', 'vocalista', 'bolero', 'balada', 'tributo', 'acústico', 'acustico', 'crooner', 'cantautor'],
  mariachi: ['mariachi', 'ranchera', 'mexicano', 'charro', 'jarabe', 'coro rociero', 'rociero', 'tuna', 'folclore', 'folklore', 'gaitero', 'chirigota'],
  dj: ['dj', 'deejay', 'discomovil', 'discomóvil', 'animación musical', 'animador', 'disco móvil', 'electronic', 'dance'],
  banda: ['banda', 'grupo', 'orquesta', 'rock', 'pop', 'tributo', 'combo', 'charanga', 'brass', 'versiones'],
  cuerdas: ['cuerdas', 'cuerda', 'violín', 'violin', 'chelo', 'cello', 'cuarteto', 'clásica', 'clasica', 'arpa', 'piano', 'ópera', 'opera', 'lírico', 'lirico', 'sacra', 'gospel', 'tenor', 'soprano'],
  flamenco: ['flamenco', 'rumba', 'cantaor', 'guitarra', 'guitarrista', 'cuadro flamenco', 'sevillanas', 'zapateado'],
  jazz: ['jazz', 'blues', 'swing', 'bossa nova', 'bossa', 'soul', 'funk', 'dixieland', 'big band', 'crooner'],
  magia: ['mago', 'magia', 'ilusionista', 'mentalista', 'ilusionismo', 'close-up'],
  artes_escenicas: ['circo', 'acróbata', 'acrobata', 'zancudo', 'fuego', 'malabares', 'danza', 'bailarines', 'cabaret', 'drag queen', 'performance', 'batucada', 'zancudos'],
  humor: ['humor', 'comedia', 'cómico', 'comico', 'monólogo', 'monologo', 'monologuista', 'stand up', 'presentador', 'showman'],
  infantil: ['infantil', 'cantajuegos', 'animación infantil', 'cuentacuentos', 'títeres', 'marionetas', 'magia infantil', 'payaso'],
};

function extractMaxCapacity(text?: string | null): number | null {
  if (!text || typeof text !== 'string') return null;
  const t = text.toLowerCase().replace(/\./g, '');
  const regex = /(\d{2,4})\s*(?:personas|invitados|comensales|pax|plazas|asistentes)/g;
  let max: number | null = null;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(t)) !== null) {
    const n = parseInt(m[1], 10);
    if (n >= 20 && n <= 12000) {
      if (max === null || n > max) max = n;
    }
  }
  return max;
}

function extractFaqText(faqs: unknown): string {
  if (!Array.isArray(faqs)) return '';
  return faqs
    .map((f) => {
      if (!f || typeof f !== 'object') return '';
      const entry = f as { question?: unknown; answer?: unknown };
      return `${String(entry.question ?? '')} ${String(entry.answer ?? '')}`;
    })
    .join(' ');
}

function buildCapacityText(p: {
  description_full?: string | null;
  description?: string | null;
  faqs?: unknown;
}): string {
  return `${p.description_full || ''} ${p.description || ''} ${extractFaqText(p.faqs)}`;
}

function resolveModuleDir(): string | null {
  try {
    if (typeof import.meta?.url === 'string' && import.meta.url.startsWith('file:')) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    /* entorno sin file:// import.meta.url */
  }
  return null;
}

async function loadStaticDataset(targetFile: string, requestUrl?: string): Promise<string | null> {
  const moduleDir = resolveModuleDir();
  const candidatePaths = [
    path.join(process.cwd(), 'public', 'data', 'providers', targetFile),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'providers', targetFile),
    ...(moduleDir ? [path.join(moduleDir, '..', '..', '..', '..', 'public', 'data', 'providers', targetFile)] : []),
    path.join(process.cwd(), 'public', 'data', 'artists', targetFile),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'artists', targetFile),
    ...(moduleDir ? [path.join(moduleDir, '..', '..', '..', '..', 'public', 'data', 'artists', targetFile)] : []),
  ];

  if (targetFile === 'musica.json') {
    candidatePaths.push(
      path.join(process.cwd(), 'public', 'data', 'artists', 'artists_canonical.json'),
      path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'artists', 'artists_canonical.json'),
      ...(moduleDir ? [path.join(moduleDir, '..', '..', '..', '..', 'public', 'data', 'artists', 'artists_canonical.json')] : []),
    );
  }

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        return fs.readFileSync(/*turbopackIgnore: true*/ p, 'utf-8');
      }
    } catch {
      /* continuar */
    }
  }

  if (!requestUrl) {
    return null;
  }

  try {
    const origin = new URL(requestUrl).origin;
    if (targetFile === 'musica.json' || targetFile === 'artists_canonical.json') {
      const artRes = await fetch(`${origin}/data/artists/artists_canonical.json`, { cache: 'no-store' });
      if (artRes.ok) return await artRes.text();
    }
    const res = await fetch(`${origin}/data/providers/${targetFile}`, {
      cache: 'no-store',
    });
    if (res.ok) return await res.text();
  } catch {
    /* sin conexion */
  }

  return null;
}

async function loadParsedJsonList(targetFile: string, requestUrl?: string): Promise<readonly RawProviderRecord[]> {
  const cached = jsonChunkCache.get(targetFile);
  if (cached) return cached;

  const raw = await loadStaticDataset(targetFile, requestUrl);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const typed = parsed as RawProviderRecord[];
    jsonChunkCache.set(targetFile, typed);
    return typed;
  } catch {
    return [];
  }
}

async function loadManifest(requestUrl?: string): Promise<Record<string, ProviderManifestPartition> | null> {
  if (globalForSearchCache.__earDirManifestCache) {
    return globalForSearchCache.__earDirManifestCache;
  }
  const manifestRaw = await loadStaticDataset('manifest.json', requestUrl);
  if (!manifestRaw) return null;
  try {
    const parsed = JSON.parse(manifestRaw) as Record<string, ProviderManifestPartition>;
    globalForSearchCache.__earDirManifestCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

async function loadCategoryPartition(category: string, requestUrl?: string): Promise<RawProviderRecord[]> {
  let chunks: string[] = [`${category}.json`];
  const manifest = await loadManifest(requestUrl);
  const entry = manifest?.[category];
  if (entry && Array.isArray(entry.chunks) && entry.chunks.length > 0) {
    chunks = entry.chunks;
  }

  const lists = await Promise.all(chunks.map((file) => loadParsedJsonList(file, requestUrl)));
  return lists.flat();
}

function isDirtyImage(u: unknown): boolean {
  return (
    !u ||
    typeof u !== 'string' ||
    u.includes('.svg') ||
    u.includes('gen_logoHeader') ||
    u.includes('default_avatar') ||
    u.includes('741e9617168a2484.jpg') ||
    u.includes('c2524615ca092dc557196134bcbbcdc1') ||
    u.includes('cobi%2fmedia%2fcct61%2fcache') ||
    u.includes('/cct61/cache/') ||
    u.includes('celebrents.s3.amazonaws.com') ||
    u.includes('photo-1519741497674-611481863552')
  );
}

function resolveEstadoHomologacion(
  p: { estadoHomologacion?: unknown; status?: unknown },
  isClaimed: boolean,
): 'CERTIFICADA_GOLD_MASTER' | 'AUDITORIA_VIGENTE' | 'ASOCIADO_STANDARD' {
  if (
    p.estadoHomologacion === 'CERTIFICADA_GOLD_MASTER' ||
    p.estadoHomologacion === 'AUDITORIA_VIGENTE' ||
    p.estadoHomologacion === 'ASOCIADO_STANDARD'
  ) {
    return p.estadoHomologacion;
  }
  if (p.status === 'VERIFIED_ACTIVE' || p.status === 'APPROVED_SCLASS') {
    return isClaimed ? 'CERTIFICADA_GOLD_MASTER' : 'AUDITORIA_VIGENTE';
  }
  return 'ASOCIADO_STANDARD';
}

async function queryStaticProviders(options: {
  category?: string | null;
  province?: string | null;
  q?: string | null;
  subcategory?: string | null;
  maxPrice?: number | null;
  page: number;
  limit: number;
  requestUrl?: string;
}): Promise<{ total: number; providers: ProviderItem[] }> {
  const { category, province, q, subcategory, maxPrice, page, limit, requestUrl } = options;
  const normCat = normalizeBodasNetCategory(category);
  const validCats = [
    'finca',
    'musica',
    'sonido',
    'catering',
    'foto',
    'decoracion',
    'wedding',
    'moda',
    'transporte',
    'servicios',
    'senior_care',
  ];

  let list: RawProviderRecord[] = [];

  if (normCat && validCats.includes(normCat)) {
    list = await loadCategoryPartition(normCat, requestUrl);
    if (normCat === 'musica') {
      const canonicalList = await loadParsedJsonList('artists_canonical.json', requestUrl);
      if (canonicalList.length > 0) {
        const seenIds = new Set(list.map((x) => x.id || x.slug));
        for (const item of canonicalList) {
          const key = item.id || item.slug;
          if (key && !seenIds.has(key)) {
            seenIds.add(key);
            list.push(item);
          }
        }
      }
    }
  } else {
    const files = [
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
    ];
    const partitions = await Promise.all(files.map((f) => loadCategoryPartition(f, requestUrl)));
    list = partitions.flat();
  }

  if (list.length === 0) {
    if (normCat === 'musica') {
      list = [...(await loadParsedJsonList('musica.json', requestUrl))];
    } else {
      const featured = await loadParsedJsonList('all_featured.json', requestUrl);
      if (featured.length > 0) {
        if (normCat && normCat !== 'ALL') {
          list = featured.filter((item) => {
            const itemCat = (item.category || '').toLowerCase().trim();
            if (normCat === 'finca') {
              return (
                itemCat.includes('finca') ||
                itemCat.includes('espacio') ||
                (item.description || '').toLowerCase().includes('finca')
              );
            }
            return itemCat === normCat;
          });
        } else {
          list = [...featured];
        }
      }
    }
  }

  if (normCat === 'finca') {
    if (list.length === 0) {
      list = [...FINCAS_HOMOLOGADAS_ITEMS];
    } else {
      const existingIds = new Set(list.map((x) => x.id));
      const missing = FINCAS_HOMOLOGADAS_ITEMS.filter((f) => !existingIds.has(f.id));
      if (missing.length > 0) {
        list = [...missing, ...list];
      }
    }
  }

  if (list.length === 0) {
    if (normCat === 'finca') {
      return {
        total: FINCAS_HOMOLOGADAS_ITEMS.length,
        providers: FINCAS_HOMOLOGADAS_ITEMS as unknown as ProviderItem[],
      };
    }
    return { total: 0, providers: [] };
  }

  if (province && province !== 'ALL' && province.trim() !== '') {
    list = list.filter((p) => {
      if (isOtzarretaRecord(p)) {
        return isProvinceMatch(province, OTZARRETA_ENTITY.province);
      }
      return isProvinceMatch(province, p.province || '');
    });
  }

  if (q) {
    const qNorm = normalizeSearchText(q);
    list = list.filter((p) => {
      if (isOtzarretaRecord(p)) {
        return (
          normalizeSearchText(OTZARRETA_CANONICAL_API.name).includes(qNorm) ||
          normalizeSearchText(OTZARRETA_CANONICAL_API.description).includes(qNorm) ||
          normalizeSearchText(OTZARRETA_CANONICAL_API.municipality).includes(qNorm)
        );
      }
      return (
        normalizeSearchText(p.name || '').includes(qNorm) ||
        normalizeSearchText(p.description || '').includes(qNorm) ||
        normalizeSearchText(p.municipality || '').includes(qNorm)
      );
    });
  }

  if (subcategory && subcategory !== 'all') {
    const subcatLower = subcategory.toLowerCase().trim();
    const keywords = SUBCATEGORY_KEYWORD_MAP[subcatLower] || [subcatLower];

    list = list.filter((p) => {
      if (p.gremioTag && p.gremioTag.toLowerCase() === subcatLower) {
        return true;
      }

      const nameLower = (p.name || '').toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      const descLower = (p.description || '').toLowerCase();

      if (subcatLower === 'mariachi') {
        const hasMariachiGenre = Array.isArray(p.genres) && p.genres.some((g) => /mariachi/i.test(g));
        return (
          hasMariachiGenre ||
          /mariachi|ranchera|charro|mexicano|rociero/i.test(nameLower) ||
          /mariachi|ranchera|charro|rociero/i.test(descLower)
        );
      }
      if (subcatLower === 'dj') {
        return (
          /\b(dj|djs|discomovil|discomóvil|disc-jockey)\b/i.test(nameLower) ||
          /\b(dj|discomovil)\b/i.test(catLower) ||
          /\b(dj|discomovil)\b/i.test(descLower)
        );
      }
      if (subcatLower === 'flamenco') {
        return /flamenco|rumba|sevillana|rociero|guitarra/i.test(nameLower) || /flamenco|rumba/i.test(descLower);
      }
      if (subcatLower === 'cuerdas') {
        return (
          /cuarteto|violín|violin|cuerda|chelo|soprano|tenor lírico|ópera|arpa|piano/i.test(nameLower) ||
          /cuarteto|violín|cuerda/i.test(descLower)
        );
      }
      if (subcatLower === 'jazz') {
        return /jazz|blues|swing|bossa|soul|crooner/i.test(nameLower) || /jazz|blues|swing/i.test(descLower);
      }
      if (subcatLower === 'magia') {
        return /mago|magia|ilusionis|mentalist/i.test(nameLower) || /mago|magia|ilusion/i.test(descLower);
      }
      if (subcatLower === 'artes_escenicas') {
        return (
          /circo|acróbata|acrobata|zancudo|fuego|malabar|danza|cabaret|drag|batucada/i.test(nameLower) ||
          /circo|acróbata|zancudo|fuego/i.test(descLower)
        );
      }
      if (subcatLower === 'humor') {
        return (
          /humor|comedia|cómico|comico|monólogo|monologo|stand up|showman/i.test(nameLower) ||
          /humor|comedia|cómico|monólogo/i.test(descLower)
        );
      }
      if (subcatLower === 'infantil') {
        return (
          /infantil|cantajuegos|cuentacuentos|títeres|marionetas|payaso/i.test(nameLower) ||
          /infantil|cantajuegos/i.test(descLower)
        );
      }

      return keywords.some((k) => nameLower.includes(k) || descLower.includes(k));
    });
  }

  if (maxPrice && !isNaN(maxPrice) && maxPrice > 0) {
    list = list.filter((p) => {
      const price = typeof p.basePrice === 'number' ? p.basePrice : parseInt(String(p.price || ''), 10);
      return !price || isNaN(price) || price <= maxPrice;
    });
  }

  list = list.filter((p) => {
    const n = (p.name || '').toLowerCase();
    if (
      n.includes('mariachis elite') ||
      n.includes('mariachi elite') ||
      n.includes('elite a coruna') ||
      n.includes('elite albacete')
    ) {
      return false;
    }
    return true;
  });

  const provStr = typeof province === 'string' ? province.trim() : '';
  const hasExplicitNonBasqueProvince =
    provStr.length > 0 &&
    provStr !== 'ALL' &&
    !isProvinceMatch(provStr, 'Bizkaia') &&
    !isProvinceMatch(provStr, 'Vizcaya');
  const isBasqueFilter =
    !hasExplicitNonBasqueProvince &&
    ((provStr.length > 0 && (isProvinceMatch(provStr, 'Bizkaia') || isProvinceMatch(provStr, 'Vizcaya'))) ||
      Boolean(
        q && /derio|bilbao|bizkaia|vizcaya|txorierri|uribe|mungia|getxo|leioa|barakaldo|otzarreta|ezkertza|eduardo/i.test(q),
      ));

  if (isBasqueFilter) {
    const otzList = list.filter((p) => isOtzarretaRecord(p));
    const nonOtzList = list.filter((p) => !isOtzarretaRecord(p));
    if (otzList.length > 0) {
      list = [otzList[0], ...nonOtzList];
    } else if (!normCat || normCat === 'ALL' || normCat === 'finca' || normCat === 'catering') {
      list = [{ id: 'v-32714', ...OTZARRETA_CANONICAL_API } as RawProviderRecord, ...nonOtzList];
    }
  }

  const total = list.length;
  const skip = (page - 1) * limit;
  const centralitaNine = CENTRALITA.raw.slice(-9);

  const providers: ProviderItem[] = list.slice(skip, skip + limit).map((p) => {
    const rawName = p.name || '';
    const cleanedName = rawName
      .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
      .replace(/\s*-\s*Precios.*/i, '')
      .replace(/\s*-\s*Fotos y opiniones.*/i, '')
      .trim();

    const rawImages =
      p.imageUrls && p.imageUrls.length > 0
        ? p.imageUrls
        : p.gallery && p.gallery.length > 0
          ? p.gallery
          : p.img
            ? [p.img]
            : [];
    const cleanImages = rawImages.filter((u): u is string => typeof u === 'string' && !isDirtyImage(u));
    const upstreamReal = p.galleryReal;
    const realGallery = Array.isArray(upstreamReal)
      ? upstreamReal.filter((u): u is string => typeof u === 'string')
      : getRealGallery(p.category, cleanImages);
    const finalImages =
      cleanImages.length >= 2
        ? cleanImages.slice(0, 2)
        : getApiAugmentedGallery(p.category, cleanImages).slice(0, 2);

    const rawPhone = (p.phone || p.telephone || '').trim();
    const cleanDigits = rawPhone.replace(/[^\d]/g, '');
    const isFake =
      !cleanDigits ||
      cleanDigits.includes(centralitaNine) ||
      cleanDigits.includes('703831064') ||
      cleanDigits.includes('721056835') ||
      cleanDigits.includes('999999999') ||
      cleanDigits.includes('727272727');
    const has_real_phone =
      Boolean(p.hasDirectPhone) || (!isFake && cleanDigits.length >= 9 && !cleanDigits.includes(centralitaNine));
    const cleanPhone = has_real_phone ? rawPhone : null;

    const slug = (p.slug || (p.id !== undefined ? String(p.id) : '')).trim();
    const catSlug =
      p.category === 'finca'
        ? 'fincas-para-bodas'
        : p.category === 'musica'
          ? 'musica'
          : p.category === 'catering'
            ? 'catering'
            : p.category || 'empresas';
    const profile_url = p.profile_url || (slug ? `https://www.bodas.net/${catSlug}/${slug}` : null);
    const sourceUrl = p.sourceUrl || profile_url;
    const locationForSearch = p.municipality || p.address || p.province || '';
    const google_search_url = `https://www.google.com/search?q=${encodeURIComponent(
      `${cleanedName} ${locationForSearch} telefono`,
    )}`;
    const google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${cleanedName} ${p.address || p.province || ''}`,
    )}`;
    const originHtml = p.originHtml || p.original_html || (slug ? `${slug}.html` : null);

    const isClaimed = Boolean(p.isClaimed);
    const estadoHomologacion = resolveEstadoHomologacion(p, isClaimed);

    if (isOtzarretaRecord(p)) {
      return buildCanonicalOtzarretaRecord(p, { isClaimed, estadoHomologacion });
    }

    const mapped = {
      ...p,
      id: p.id ?? slug ?? cleanedName,
      name: cleanedName || rawName,
      phone: cleanPhone,
      telephone: cleanPhone ?? undefined,
      has_real_phone,
      isClaimed,
      estadoHomologacion,
      capacidadMaxPax: p.capacidadMaxPax ?? extractMaxCapacity(buildCapacityText(p)) ?? undefined,
      price: p.price ?? undefined,
      isPreferred: Boolean(p.isPreferred),
      badge: p.badge || (p.isPreferred ? 'CASERÍO S-CLASS · ALIANZA VIP' : undefined),
      customUrl: p.customUrl || undefined,
      profile_url,
      sourceUrl,
      originHtml,
      google_search_url,
      google_maps_url,
      original_html: originHtml,
      img: finalImages[0] || p.img,
      imageUrls: finalImages,
      gallery: finalImages,
      galleryReal: realGallery.slice(0, 2),
      has_real_gallery: realGallery.length > 0,
      galleryAugmented: finalImages.length > realGallery.length,
    };

    return mapped as ProviderItem;
  });

  return { total, providers };
}

export async function searchProvidersServer(
  params: SearchProvidersServerParams,
): Promise<SearchProvidersServerResult> {
  const category = params.category ?? params.cat ?? null;
  const province = params.province ?? params.provincia ?? null;
  const subcategory = params.subcategory ?? params.subcat ?? null;
  const maxPrice = typeof params.maxPrice === 'number' && !isNaN(params.maxPrice) ? params.maxPrice : null;
  const q = (params.q || '').trim();
  const page = Math.max(1, typeof params.page === 'number' && !isNaN(params.page) ? Math.floor(params.page) : 1);
  const limit = Math.min(
    2000,
    Math.max(1, typeof params.limit === 'number' && !isNaN(params.limit) ? Math.floor(params.limit) : 24),
  );
  const skip = (page - 1) * limit;

  const normalizedCategory = normalizeBodasNetCategory(category);
  const canonicalProvinceObj = resolveProvince(province);
  const normalizedProvince = canonicalProvinceObj
    ? canonicalProvinceObj.name
    : province && province.trim() !== '' && !isAllSpainProvince(province)
      ? findCanonicalProvinceName(province) || province.trim()
      : null;

  const isLocalDb = (process.env.POSTGRES_PRISMA_URL || '').includes('localhost');
  const isNetlify = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (process.env.POSTGRES_PRISMA_URL && (!isNetlify || !isLocalDb)) {
    try {
      const where: Prisma.VendorShadowProfileWhereInput = {};
      if (normalizedCategory && normalizedCategory !== 'ALL') {
        where.category = { contains: normalizedCategory, mode: 'insensitive' };
      }

      const andConditions: Prisma.VendorShadowProfileWhereInput[] = [];
      if (canonicalProvinceObj) {
        const provinceVariants = getProvinceSearchVariants(canonicalProvinceObj.name);
        const matchesOtzarretaProvince = isProvinceMatch(canonicalProvinceObj.name, OTZARRETA_ENTITY.province);
        where.OR = [
          ...provinceVariants.map((variant) => ({
            province: { contains: variant, mode: 'insensitive' as const },
          })),
          { province: { equals: canonicalProvinceObj.code, mode: 'insensitive' } },
          ...(matchesOtzarretaProvince
            ? [
                { id: 'v-32714' },
                { name: { contains: 'otzarreta', mode: 'insensitive' as const } },
              ]
            : []),
        ];
        if (!matchesOtzarretaProvince) {
          andConditions.push(
            { id: { not: 'v-32714' } },
            { NOT: { name: { contains: 'otzarreta', mode: 'insensitive' } } },
          );
        }
      } else if (province && province.trim() !== '' && !isAllSpainProvince(province)) {
        where.province = { contains: province.trim(), mode: 'insensitive' };
        andConditions.push(
          { id: { not: 'v-32714' } },
          { NOT: { name: { contains: 'otzarreta', mode: 'insensitive' } } },
        );
      }

      if (q) {
        const qNorm = normalizeSearchText(q);
        const otzarretaMatchesCanonicalQ = [
          OTZARRETA_CANONICAL_API.name,
          OTZARRETA_CANONICAL_API.description,
          OTZARRETA_CANONICAL_API.municipality,
        ].some((field) => normalizeSearchText(field).includes(qNorm));

        andConditions.push({
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { municipality: { contains: q, mode: 'insensitive' } },
            ...(otzarretaMatchesCanonicalQ
              ? [
                  { id: 'v-32714' },
                  { name: { contains: 'otzarreta', mode: 'insensitive' as const } },
                ]
              : []),
          ],
        });

        if (!otzarretaMatchesCanonicalQ) {
          andConditions.push(
            { id: { not: 'v-32714' } },
            { NOT: { name: { contains: 'otzarreta', mode: 'insensitive' } } },
          );
        }
      }

      if (subcategory && subcategory !== 'all') {
        const keywords = SUBCATEGORY_KEYWORD_MAP[subcategory.toLowerCase()] || [subcategory];
        andConditions.push({
          OR: keywords.flatMap((kw) => [
            { name: { contains: kw, mode: 'insensitive' } },
            { description: { contains: kw, mode: 'insensitive' } },
          ]),
        });
      }

      if (andConditions.length > 0) where.AND = andConditions;

      const [total, dbProviders] = await Promise.all([
        prisma.vendorShadowProfile.count({ where }),
        prisma.vendorShadowProfile.findMany({
          where,
          skip,
          take: limit,
          orderBy: { reviewsCount: 'desc' },
        }),
      ]);

      if (total > 0) {
        const sanitizedProviders: ProviderItem[] = dbProviders.map((p) => {
          const rawName = p.name || '';
          const cleanedName = rawName
            .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
            .replace(/\s*-\s*Precios.*/i, '')
            .replace(/\s*-\s*Fotos y opiniones.*/i, '')
            .trim();

          const cleanImages = (p.imageUrls || []).filter((u) => !isDirtyImage(u));
          const realGallery = getRealGallery(p.category, cleanImages);
          const seededImages =
            cleanImages.length > 0
              ? cleanImages
              : [getApiFallbackImage(p.category, p.id || p.shaHash || p.name)];
          const finalImages = getApiAugmentedGallery(p.category, seededImages);

          if (isOtzarretaRecord(p)) {
            const isClaimed = Boolean((p as { isClaimed?: unknown }).isClaimed);
            const estadoHomologacion = resolveEstadoHomologacion(
              { status: p.status },
              isClaimed,
            );
            return buildCanonicalOtzarretaRecord(p, { isClaimed, estadoHomologacion });
          }

          const mappedRecord = {
            ...p,
            name: cleanedName || rawName,
            capacidadMaxPax: extractMaxCapacity(buildCapacityText(p)) ?? undefined,
            img: finalImages[0],
            imageUrls: finalImages,
            gallery: finalImages,
            galleryReal: realGallery,
            has_real_gallery: realGallery.length > 0,
            galleryAugmented: finalImages.length > realGallery.length,
          };

          return mappedRecord as unknown as ProviderItem;
        });

        return {
          success: true,
          providers: sanitizedProviders,
          items: sanitizedProviders,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          normalizedCategory,
          normalizedProvince,
          source: 'PRISMA_DATABASE',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[PROFILES-SEARCH] Prisma DB inaccesible, cayendo a Static Fallback:', msg);
    }
  }

  const { total, providers } = await queryStaticProviders({
    category,
    province,
    q,
    subcategory,
    maxPrice,
    page,
    limit,
    requestUrl: params.requestUrl,
  });

  return {
    success: true,
    providers,
    items: providers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    normalizedCategory,
    normalizedProvince,
    source: 'STATIC_EDGE_SYNCHRONIZED',
  };
}

/**
 * Projects raw search records into public-safe, lean `ProviderItem` objects
 * for SSR RSC serialization into `ProveedoresDirectoryClient` (strips `email`,
 * `enrichment_evidence`, `provenance`, `claimToken`, raw `description_full` bloat,
 * and applies `resolvePublicProviderDisplayName` + phone/verified gating).
 */
export function sanitizePublicDirectoryProviders(
  providers: readonly ProviderItem[],
): ProviderItem[] {
  const centralitaDigits = CENTRALITA.raw.slice(-9);

  return providers.map((p) => {
    const rawPhone = String(p.phone || p.telephone || '').trim();
    const digits = rawPhone.replace(/\D/g, '');
    const hasVerifiableServerPhone =
      p.has_real_phone === true &&
      digits.length >= 9 &&
      !digits.endsWith(centralitaDigits);
    const verified = p.verified === true && hasVerifiableServerPhone;
    const province = findCanonicalProvinceName(p.province || '') || (p.province || '');
    const displayName = resolvePublicProviderDisplayName({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      province,
      municipality: p.municipality,
      isClaimed: p.isClaimed,
      isPreferred: p.isPreferred,
    });
    const reviewCount = typeof p.reviews === 'number'
      ? p.reviews
      : typeof p.reviewsCount === 'number'
        ? p.reviewsCount
        : undefined;

    const cleanFaqs =
      p.faqs && !Array.isArray(p.faqs)
        ? p.faqs
        : undefined;

    return {
      id: p.id,
      name: displayName,
      ...(p.slug ? { slug: p.slug } : {}),
      ...(p.category ? { category: p.category } : {}),
      ...(province ? { province } : {}),
      ...(p.municipality ? { municipality: p.municipality } : {}),
      ...(p.description ? { description: p.description } : {}),
      ...(p.price !== undefined && p.price !== null ? { price: p.price } : {}),
      ...(p.priceLabel ? { priceLabel: p.priceLabel } : {}),
      ...(typeof p.basePrice === 'number' ? { basePrice: p.basePrice } : {}),
      ...(typeof p.rating === 'number' ? { rating: p.rating } : {}),
      ...(typeof reviewCount === 'number' ? { reviews: reviewCount } : {}),
      ...(p.img ? { img: p.img } : {}),
      ...(Array.isArray(p.gallery) ? { gallery: p.gallery.slice(0, 2) } : {}),
      ...(Array.isArray(p.imageUrls) ? { imageUrls: p.imageUrls.slice(0, 2) } : {}),
      isPreferred: Boolean(p.isPreferred),
      ...(p.badge ? { badge: p.badge } : {}),
      ...(p.customUrl ? { customUrl: p.customUrl } : {}),
      ...(p.address ? { address: p.address } : {}),
      ...(typeof p.capacidadMaxPax === 'number' ? { capacidadMaxPax: p.capacidadMaxPax } : {}),
      ...(Array.isArray(p.services_list) ? { services_list: p.services_list } : {}),
      ...(cleanFaqs ? { faqs: cleanFaqs } : {}),
      phone: null,
      has_real_phone: verified,
      verified,
      isClaimed: Boolean(p.isClaimed),
      ...(p.estadoHomologacion ? { estadoHomologacion: p.estadoHomologacion } : {}),
      ...(p.profile_url ? { profile_url: p.profile_url } : {}),
      ...(p.sourceUrl ? { sourceUrl: p.sourceUrl } : {}),
    };
  });
}
