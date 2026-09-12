export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let prisma: PrismaClient | null = null;
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({ log: ['error'] });
  }
  return prisma;
}

// Subcategory keyword mappings for deep domain search
const SUBCATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  // Fincas & Espacios
  cortijo: ['cortijo', 'hacienda'],
  palacio: ['palacio', 'castillo'],
  masia: ['masia', 'masía', 'casa rural'],
  salon: ['salon', 'salón', 'hotel', 'complejo'],
  rustica: ['rústica', 'rustica', 'dehesa', 'finca rústica'],
  // Música & Espectáculos
  solista: ['solista', 'edwin agudelo', 'cantante', 'bolero', 'balada', 'tributo', 'acústico'],
  mariachi: ['mariachi', 'ranchera', 'mexicano', 'charro', 'jarabe'],
  dj: ['dj', 'deejay', 'discomovil', 'discomóvil', 'animación musical'],
  banda: ['banda', 'grupo', 'orquesta', 'rock', 'pop', 'tributo', 'combo'],
  cuerdas: ['cuerdas', 'violín', 'violin', 'chelo', 'cello', 'cuarteto', 'clásica', 'arpa'],
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
  const cat = (category || 'servicios').toLowerCase();
  const pool = API_FALLBACK_POOLS[cat] || API_FALLBACK_POOLS.servicios;
  if (!seed) return pool[0];
  const str = String(seed);
  const hash = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTOR ESTÁTICO DE ALTA VELOCIDAD (NETLIFY EDGE / ZERO-COLD-START)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function queryStaticProviders(options: {
  category?: string | null;
  province?: string | null;
  q?: string | null;
  subcategory?: string | null;
  page: number;
  limit: number;
}) {
  const { category, province, q, subcategory, page, limit } = options;
  const normCat = (category || '').toLowerCase().trim();
  const validCats = [
    'finca', 'musica', 'sonido', 'catering', 'foto',
    'decoracion', 'wedding', 'moda', 'transporte', 'servicios'
  ];

  let targetFile = 'all_featured.json';
  if (validCats.includes(normCat)) {
    targetFile = `${normCat}.json`;
  }

  // Candidatos de ruta según entorno de ejecución (Netlify Lambda / standalone / dev)
  const candidatePaths = [
    path.join(process.cwd(), 'public', 'data', 'providers', targetFile),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'providers', targetFile),
    path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'data', 'providers', targetFile),
  ];

  const filePath = candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];

  if (!fs.existsSync(filePath)) {
    return { total: 0, providers: [] };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let list: any[] = JSON.parse(raw);

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

  // 3. Filtro por subcategoría semántica
  if (subcategory && subcategory !== 'all') {
    const keywords = SUBCATEGORY_KEYWORD_MAP[subcategory.toLowerCase()] || [subcategory.toLowerCase()];
    list = list.filter((p) => {
      const text = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
      return keywords.some((k) => text.includes(k));
    });
  }

  const total = list.length;
  const skip = (page - 1) * limit;
  const isDirty = (u: any) =>
    !u ||
    typeof u !== 'string' ||
    u.includes('.svg') ||
    u.includes('gen_logoHeader') ||
    u.includes('default_avatar') ||
    u.includes('741e9617168a2484.jpg');

  const providers = list.slice(skip, skip + limit).map((p) => {
    const rawName = p.name || '';
    const cleanedName = rawName
      .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
      .replace(/\s*-\s*Precios.*/i, '')
      .replace(/\s*-\s*Fotos y opiniones.*/i, '')
      .trim();

    const cleanImages = (p.imageUrls || []).filter((u: string) => !isDirty(u));
    const finalImages =
      cleanImages.length > 0
        ? cleanImages
        : [getApiFallbackImage(p.category, p.id || p.shaHash || p.name)];

    return {
      ...p,
      name: cleanedName || rawName,
      imageUrls: finalImages,
    };
  });

  return { total, providers };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const province = searchParams.get('province');
  const q = searchParams.get('q');
  const subcategory = searchParams.get('subcategory') || searchParams.get('subcat');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));
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
            u.includes('741e9617168a2484.jpg');

          const cleanImages = (p.imageUrls || []).filter((u: string) => !isDirty(u));
          const finalImages =
            cleanImages.length > 0
              ? cleanImages
              : [getApiFallbackImage(p.category, p.id || p.shaHash || p.name)];

          return {
            ...p,
            name: cleanedName || rawName,
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
    const { total, providers } = queryStaticProviders({
      category,
      province,
      q,
      subcategory,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      providers,
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
