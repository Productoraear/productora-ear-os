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
  const providers = list.slice(skip, skip + limit);

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
        return NextResponse.json({
          success: true,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          providers,
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
