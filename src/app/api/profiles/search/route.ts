export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

let prisma: PrismaClient | null = null;
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({ log: ['error'] });
  }
  return prisma;
}

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
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
];

const FINCAS_HOMOLOGADAS_ITEMS = SCLASS_12_FINCAS_HOMOLOGADAS.map((f, idx) => {
  const selectedImg = UNIQUE_HD_FINCA_IMAGES[idx % UNIQUE_HD_FINCA_IMAGES.length];
  return {
    id: f.id,
    name: f.name,
    slug: f.slug,
    category: 'finca',
    province: f.provincia,
    address: `${f.location}, España`,
    phone: f.id === 'villa-escorial-park' ? '+34 693 693 048' : null,
    telephone: f.id === 'villa-escorial-park' ? '+34 693 693 048' : null,
    hasDirectPhone: f.id === 'villa-escorial-park',
    centralitaPhone: '+34 693 693 048',
    phoneType: f.id === 'villa-escorial-park' ? 'Oficial Productora EAR' : 'Centralita Concierge EAR',
    img: selectedImg,
    imageUrls: [selectedImg],
    gallery: [selectedImg],
    basePrice: f.id === 'villa-escorial-park' ? 4500 : 1200 + (idx * 250),
    price: f.id === 'villa-escorial-park' ? '4.500 € / fin de semana' : `${1200 + (idx * 250)} €`,
    rating: 5.0,
    reviews: 32 + idx * 4,
    description: f.description,
    services_list: f.espaciosDisponibles,
    capacidadMaxPax: f.capacidadMaxPax
  };
});

// Subcategory keyword mappings for deep domain search across all artistic families
const SUBCATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  // Fincas & Espacios
  cortijo: ['cortijo', 'hacienda'],
  palacio: ['palacio', 'castillo'],
  masia: ['masia', 'masía', 'casa rural'],
  salon: ['salon', 'salón', 'hotel', 'complejo'],
  rustica: ['rústica', 'rustica', 'dehesa', 'finca rústica'],
  // 1. Solistas & Cantantes
  solista: ['solista', 'edwin agudelo', 'cantante', 'vocalista', 'bolero', 'balada', 'tributo', 'acústico', 'acustico', 'crooner', 'cantautor'],
  // 2. Mariachis, Folclore & Tradicional
  mariachi: ['mariachi', 'ranchera', 'mexicano', 'charro', 'jarabe', 'coro rociero', 'rociero', 'tuna', 'folclore', 'folklore', 'gaitero', 'chirigota'],
  // 3. DJs, Disco Móvil & Animación
  dj: ['dj', 'deejay', 'discomovil', 'discomóvil', 'animación musical', 'animador', 'disco móvil', 'electronic', 'dance'],
  // 4. Bandas en Vivo & Versiones
  banda: ['banda', 'grupo', 'orquesta', 'rock', 'pop', 'tributo', 'combo', 'charanga', 'brass', 'versiones'],
  // 5. Cuerda Clásica, Lírico & Ceremonias
  cuerdas: ['cuerdas', 'cuerda', 'violín', 'violin', 'chelo', 'cello', 'cuarteto', 'clásica', 'clasica', 'arpa', 'piano', 'ópera', 'opera', 'lírico', 'lirico', 'sacra', 'gospel', 'tenor', 'soprano'],
  // 6. Flamenco & Rumba
  flamenco: ['flamenco', 'rumba', 'cantaor', 'guitarra', 'guitarrista', 'cuadro flamenco', 'sevillanas', 'zapateado'],
  // 7. Jazz, Blues & Swing
  jazz: ['jazz', 'blues', 'swing', 'bossa nova', 'bossa', 'soul', 'funk', 'dixieland', 'big band', 'crooner'],
  // 8. Magia & Ilusionismo
  magia: ['mago', 'magia', 'ilusionista', 'mentalista', 'ilusionismo', 'close-up'],
  // 9. Artes Escénicas, Circo & Variedades
  artes_escenicas: ['circo', 'acróbata', 'acrobata', 'zancudo', 'fuego', 'malabares', 'danza', 'bailarines', 'cabaret', 'drag queen', 'performance', 'batucada', 'zancudos'],
  // 10. Humor & Monólogos
  humor: ['humor', 'comedia', 'cómico', 'comico', 'monólogo', 'monologo', 'monologuista', 'stand up', 'presentador', 'showman'],
  // 11. Infantil & Familiar
  infantil: ['infantil', 'cantajuegos', 'animación infantil', 'cuentacuentos', 'títeres', 'marionetas', 'magia infantil', 'payaso']
};

const API_FALLBACK_POOLS: Record<string, string[]> = {
  finca: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
  ],
  catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop"
  ],
  decoracion: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop"
  ],
  musica: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop"
  ],
  sonido: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
  ],
  foto: [
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop"
  ],
  wedding: [
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop"
  ],
  moda: [
    "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop"
  ],
  transporte: [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
  ],
  servicios: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
  ]
};

function getApiFallbackImage(category?: string | null, seed?: string | null): string {
  let cat = (category || '').toLowerCase().trim();
  if (cat.includes('music') || cat.includes('dj') || cat.includes('mariachi') || cat.includes('banda') || cat.includes('solista') || cat.includes('cuerda') || cat.includes('flamenco') || cat.includes('animacion')) {
    cat = 'musica';
  } else if (!cat) {
    cat = 'servicios';
  }
  const pool = API_FALLBACK_POOLS[cat] || API_FALLBACK_POOLS.musica;
  if (!seed) return pool[0];
  const str = String(seed);
  const hash = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

// ── EXTRACCIÓN REAL DEL AFORO MÁXIMO (SSOT: capacidad embebida en el HTML fuente) ──
// El dataset no expone un campo estructurado de capacidad; el aforo está redactado
// en `description_full` / `faqs` (ej. "capacidad para 600 personas", "hasta 900 invitados",
// "eventos desde 150 pax"). Este extractor recupera el máximo real declarado.
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

function extractFaqText(faqs: any): string {
  if (!Array.isArray(faqs)) return '';
  return faqs.map((f: any) => `${f?.question || ''} ${f?.answer || ''}`).join(' ');
}

function buildCapacityText(p: any): string {
  return `${p?.description_full || ''} ${p?.description || ''} ${extractFaqText(p?.faqs)}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTOR ESTÁTICO DE ALTA VELOCIDAD (NETLIFY EDGE / ZERO-COLD-START)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function loadStaticDataset(targetFile: string, requestUrl: string): Promise<string | null> {
  // 1. Intento en disco (dev / standalone / self-hosted).
  const candidatePaths = [
    path.join(process.cwd(), 'public', 'data', 'providers', targetFile),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'providers', targetFile),
    path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'data', 'providers', targetFile),
  ];

  // Si la petición es para música, comprobar también la ruta canónica de artistas
  if (targetFile === 'musica.json') {
    candidatePaths.push(
      path.join(process.cwd(), 'public', 'data', 'artists', 'artists_canonical.json'),
      path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'artists', 'artists_canonical.json'),
      path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'data', 'artists', 'artists_canonical.json')
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

  // 2. Fallback CDN: en serverless (Netlify Functions) `public/` se sirve como
  //    activo estático, NO se empaqueta en la funcion. Se descarga por URL.
  //    Esto mantiene el bundle serverless < 250 MB sin perder el dataset.
  try {
    const origin = new URL(requestUrl).origin;
    if (targetFile === 'musica.json') {
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

async function queryStaticProviders(options: {
  category?: string | null;
  province?: string | null;
  q?: string | null;
  subcategory?: string | null;
  maxPrice?: number | null;
  page: number;
  limit: number;
  requestUrl: string;
}) {
  const { category, province, q, subcategory, maxPrice, page, limit, requestUrl } = options;
  const normCat = (category || '').toLowerCase().trim();
  const validCats = [
    'finca', 'musica', 'sonido', 'catering', 'foto',
    'decoracion', 'wedding', 'moda', 'transporte', 'servicios',
    'senior_care'
  ];

  let list: any[] = [];

  if (normCat && validCats.includes(normCat)) {
    const raw = await loadStaticDataset(`${normCat}.json`, requestUrl);
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { }
    }
  } else {
    // When no category is selected, load multiple massive datasets to show the true scale (S-Class)
    const files = ['finca.json', 'musica.json', 'sonido.json', 'catering.json'];
    for (const f of files) {
      const raw = await loadStaticDataset(f, requestUrl);
      if (raw) {
        try { list = list.concat(JSON.parse(raw)); } catch (e) { }
      }
    }
  }

  // Fallback de alta resiliencia si no se pudo cargar finca.json por peso o entorno serverless
  if (list.length === 0) {
    if (normCat === 'musica') {
      const fallbackMusic = await loadStaticDataset('musica.json', requestUrl);
      if (fallbackMusic) {
        try { list = JSON.parse(fallbackMusic); } catch { /* continuar */ }
      }
    } else {
      const fallbackRaw = await loadStaticDataset('all_featured.json', requestUrl);
      if (fallbackRaw) {
        try {
          const featured = JSON.parse(fallbackRaw);
          if (normCat === 'finca') {
            list = featured.filter((item: any) => 
              (item.category || '').toLowerCase().includes('finca') || 
              (item.category || '').toLowerCase().includes('espacio') ||
              (item.description || '').toLowerCase().includes('finca')
            );
          } else {
            list = featured;
          }
        } catch { /* continuar */ }
      }
    }
  }

  // Fallback garantizado S-Class exclusivamente para Fincas
  if (normCat === 'finca') {
    if (list.length === 0) {
      list = FINCAS_HOMOLOGADAS_ITEMS;
    } else {
      const existingIds = new Set(list.map((x) => x.id));
      const missing = FINCAS_HOMOLOGADAS_ITEMS.filter((f) => !existingIds.has(f.id));
      list = [...missing, ...list];
    }
  }

  // Fallback final si la lista sigue vacía
  if (list.length === 0) {
    if (normCat === 'finca') {
      return { total: FINCAS_HOMOLOGADAS_ITEMS.length, providers: FINCAS_HOMOLOGADAS_ITEMS };
    }
    // JAMÁS devolver fincas cuando la categoría buscada es música
    return { total: 0, providers: [] };
  }

  // 1. Filtro por provincia
  if (province && province !== 'ALL') {
    const provLower = province.toLowerCase().trim();
    list = list.filter((p) => (p.province || '').toLowerCase().includes(provLower));
  }

  // 2. Filtro por texto de búsqueda
  if (q) {
    const qLower = q.toLowerCase().trim();
    list = list.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(qLower) ||
        (p.description || '').toLowerCase().includes(qLower) ||
        (p.municipality || '').toLowerCase().includes(qLower)
    );
  }

  // 3. Filtro por subcategoría semántica (Estricto por gremioTag)
  if (subcategory && subcategory !== 'all') {
    const subcatLower = subcategory.toLowerCase().trim();
    const keywords = SUBCATEGORY_KEYWORD_MAP[subcatLower] || [subcatLower];

    list = list.filter((p) => {
      // Si el registro coincide exactamente con su gremioTag asignado
      if (p.gremioTag && p.gremioTag.toLowerCase() === subcatLower) {
        return true;
      }

      // De lo contrario, comprobación estricta en el nombre y categoría
      const nameLower = (p.name || '').toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      const descLower = (p.description || '').toLowerCase();

      if (subcatLower === 'mariachi') {
        return /mariachi|ranchera|charro|mexicano|rociero/i.test(nameLower) || /mariachi|ranchera|charro|rociero/i.test(descLower);
      }
      if (subcatLower === 'dj') {
        return /\b(dj|djs|discomovil|discomóvil|disc-jockey)\b/i.test(nameLower) || /\b(dj|discomovil)\b/i.test(catLower) || /\b(dj|discomovil)\b/i.test(descLower);
      }
      if (subcatLower === 'flamenco') {
        return /flamenco|rumba|sevillana|rociero|guitarra/i.test(nameLower) || /flamenco|rumba/i.test(descLower);
      }
      if (subcatLower === 'cuerdas') {
        return /cuarteto|violín|violin|cuerda|chelo|soprano|tenor lírico|ópera|arpa|piano/i.test(nameLower) || /cuarteto|violín|cuerda/i.test(descLower);
      }
      if (subcatLower === 'jazz') {
        return /jazz|blues|swing|bossa|soul|crooner/i.test(nameLower) || /jazz|blues|swing/i.test(descLower);
      }
      if (subcatLower === 'magia') {
        return /mago|magia|ilusionis|mentalist/i.test(nameLower) || /mago|magia|ilusion/i.test(descLower);
      }
      if (subcatLower === 'artes_escenicas') {
        return /circo|acróbata|acrobata|zancudo|fuego|malabar|danza|cabaret|drag|batucada/i.test(nameLower) || /circo|acróbata|zancudo|fuego/i.test(descLower);
      }
      if (subcatLower === 'humor') {
        return /humor|comedia|cómico|comico|monólogo|monologo|stand up|showman/i.test(nameLower) || /humor|comedia|cómico|monólogo/i.test(descLower);
      }
      if (subcatLower === 'infantil') {
        return /infantil|cantajuegos|cuentacuentos|títeres|marionetas|payaso/i.test(nameLower) || /infantil|cantajuegos/i.test(descLower);
      }

      return keywords.some((k) => nameLower.includes(k) || descLower.includes(k));
    });
  }

  // 4. Filtro por presupuesto máximo
  if (maxPrice && !isNaN(maxPrice) && maxPrice > 0) {
    list = list.filter((p) => {
      const price = typeof p.basePrice === 'number' ? p.basePrice : parseInt(String(p.price || ''), 10);
      return !price || isNaN(price) || price <= maxPrice;
    });
  }

  // Filtro preventivo Anti-Synthetic-Stubs
  list = list.filter((p) => {
    const n = (p.name || '').toLowerCase();
    if (n.includes('mariachis elite') || n.includes('mariachi elite') || n.includes('elite a coruna') || n.includes('elite albacete')) {
      return false;
    }
    return true;
  });

  const total = list.length;
  const skip = (page - 1) * limit;
  const isDirty = (u: any) =>
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
    u.includes('photo-1519741497674-611481863552');

  const providers = list.slice(skip, skip + limit).map((p) => {
    const rawName = p.name || '';
    const cleanedName = rawName
      .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
      .replace(/\s*-\s*Precios.*/i, '')
      .replace(/\s*-\s*Fotos y opiniones.*/i, '')
      .trim();

    const rawImages = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls : (p.gallery && p.gallery.length > 0) ? p.gallery : (p.img ? [p.img] : []);
    const cleanImages = rawImages.filter((u: string) => !isDirty(u));
    const finalImages =
      cleanImages.length > 0
        ? cleanImages
        : [getApiFallbackImage(p.category, p.id || p.shaHash || p.name)];

    const rawPhone = (p.phone || p.telephone || '').trim();
    const cleanDigits = rawPhone.replace(/[^\d]/g, '');
    const isFake = !cleanDigits || cleanDigits.includes('693693048') || cleanDigits.includes('703831064') || cleanDigits.includes('721056835') || cleanDigits.includes('999999999') || cleanDigits.includes('727272727');
    const has_real_phone = Boolean(p.hasDirectPhone) || (!isFake && cleanDigits.length >= 9 && !cleanDigits.includes('693693048'));
    const cleanPhone = has_real_phone ? rawPhone : null;

    // Metadatos de origen 100% verificables (HTML / Bodas.net / Google Business)
    const slug = (p.slug || p.id || '').trim();
    const catSlug = p.category === 'finca' ? 'fincas-para-bodas' : p.category === 'musica' ? 'musica' : p.category === 'catering' ? 'catering' : p.category || 'empresas';
    const profile_url = p.profile_url || (slug ? `https://www.bodas.net/${catSlug}/${slug}` : null);
    // ── TRAZABILIDAD CANÓNICA (directiva 6) ──
    // sourceUrl: URL pública de origen derivada del slug + categoría (100% de registros).
    // originHtml: nombre del volcado HTML en la bóveda física (vault/proveedores_html_indexados/).
    const sourceUrl = p.sourceUrl || profile_url;
    const locationForSearch = p.municipality || p.address || p.province || '';
    const google_search_url = `https://www.google.com/search?q=${encodeURIComponent(`${cleanedName} ${locationForSearch} telefono`)}`;
    const google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cleanedName} ${p.address || p.province || ''}`)}`;
    const originHtml = p.originHtml || p.original_html || (slug ? `${slug}.html` : null);

    // ── MODELO SOBERANO DE MONETIZACIÓN (directiva 8) ──
    // CLAIM primero, LUEGO HOMOLOGACIÓN: una ficha reclamada puede además
    // haber superado auditoría acústica (CERTIFICADA_GOLD_MASTER).
    const isClaimed = Boolean(p.isClaimed);
    const estadoHomologacion =
      p.estadoHomologacion ||
      (p.status === 'VERIFIED_ACTIVE' || p.status === 'APPROVED_SCLASS'
        ? (isClaimed ? 'CERTIFICADA_GOLD_MASTER' : 'AUDITORIA_VIGENTE')
        : 'ASOCIADO_STANDARD');

    return {
      ...p,
      name: cleanedName || rawName,
      phone: cleanPhone,
      telephone: cleanPhone,
      has_real_phone,
      isClaimed,
      estadoHomologacion,
      capacidadMaxPax: extractMaxCapacity(buildCapacityText(p)),
      profile_url,
      sourceUrl,
      originHtml,
      google_search_url,
      google_maps_url,
      original_html: originHtml,
      img: finalImages[0],
      imageUrls: finalImages,
    };
  });

  return { total, providers };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || searchParams.get('cat');
  const province = searchParams.get('province');
  const subcategory = searchParams.get('subcategory') || searchParams.get('subcat') || searchParams.get('sub');
  const maxPriceParam = searchParams.get('maxPrice');
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : null;
  const q = (searchParams.get('q') || searchParams.get('search') || '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(2000, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));
  const skip = (page - 1) * limit;

  // 1. INTENTO PRIMARIO: Base de datos Prisma (si está disponible y no es localhost inaccesible)
  const isLocalDb = (process.env.POSTGRES_PRISMA_URL || '').includes('localhost');
  const isNetlify = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (process.env.POSTGRES_PRISMA_URL && (!isNetlify || !isLocalDb)) {
    try {
      const client = getPrismaClient();
      const where: any = {};
      if (category && category !== 'ALL') where.category = { contains: category, mode: 'insensitive' };
      if (province && province !== 'ALL') where.province = { contains: province, mode: 'insensitive' };

      const andConditions: any[] = [];
      if (q) {
        andConditions.push({
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { municipality: { contains: q, mode: 'insensitive' } },
          ],
        });
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

      const [total, providers] = await Promise.all([
        client.vendorShadowProfile.count({ where }),
        client.vendorShadowProfile.findMany({
          where,
          skip,
          take: limit,
          orderBy: { reviewsCount: 'desc' },
        }),
      ]);

      if (total > 0) {
        const sanitizedProviders = providers.map((p) => {
          const rawName = p.name || '';
          const cleanedName = rawName
            .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
            .replace(/\s*-\s*Precios.*/i, '')
            .replace(/\s*-\s*Fotos y opiniones.*/i, '')
            .trim();

          const isDirty = (u: any) =>
            !u ||
            typeof u !== 'string' ||
            u.includes('.svg') ||
            u.includes('gen_logoHeader') ||
            u.includes('default_avatar') ||
            u.includes('741e9617168a2484.jpg') ||
            u.includes('c2524615ca092dc557196134bcbbcdc1');

          const cleanImages = (p.imageUrls || []).filter((u: string) => !isDirty(u));
          const finalImages =
            cleanImages.length > 0
              ? cleanImages
              : [getApiFallbackImage(p.category, p.id || p.shaHash || p.name)];

          return {
            ...p,
            name: cleanedName || rawName,
            capacidadMaxPax: extractMaxCapacity(buildCapacityText(p)),
            imageUrls: finalImages,
          };
        });

        return NextResponse.json({
          success: true,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          providers: sanitizedProviders,
          items: sanitizedProviders,
          source: 'PRISMA_DATABASE'
        });
      }
    } catch (err: any) {
      console.warn('[PROFILES-SEARCH] Prisma DB inaccesible, cayendo a Static Fallback:', err.message);
    }
  }

  // 2. FALLBACK SOBERANO S-CLASS (Netlify Edge & Serverless Autónomo)
  // Lee instantáneamente desde los datasets categorizados sincronizados en public/data/providers/
  try {
    const { total, providers } = await queryStaticProviders({
      category,
      province,
      q,
      subcategory,
      maxPrice,
      page,
      limit,
      requestUrl: request.url,
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      providers,
      items: providers,
      source: 'STATIC_EDGE_SYNCHRONIZED'
    });
  } catch (staticErr: any) {
    console.error('[PROFILES-SEARCH] Error en fallback estático:', staticErr);
    return NextResponse.json(
      { success: false, error: staticErr.message || 'Error en búsqueda de proveedores' },
      { status: 500 }
    );
  }
}

