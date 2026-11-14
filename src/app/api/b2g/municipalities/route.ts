import { NextRequest, NextResponse } from 'next/server';
import spainMunicipalities from '@/data/geo/spain-8131-municipalities.json';
import { resolveB2GInfo, POPULAR_B2G_MUNICIPALITIES, B2GMunicipalityEntry } from '@/lib/geo/b2g-municipal-resolver';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface RawMun {
  ineCode: string;
  name: string;
  slug: string;
  provinceCode: string;
  province: string;
  provinceSlug: string;
  autonomousCommunity: string;
}

const rawList = spainMunicipalities as RawMun[];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || searchParams.get('query') || '').trim().toLowerCase();
    const limit = Math.min(25, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        query,
        results: POPULAR_B2G_MUNICIPALITIES.slice(0, limit)
      });
    }

    // Algoritmo de ranking prioritario:
    // 1. Coincidencia exacta de nombre
    // 2. Comienza por la consulta
    // 3. Contiene la consulta en el nombre
    // 4. Contiene la consulta en la provincia
    const exactMatches: RawMun[] = [];
    const startsWithMatches: RawMun[] = [];
    const containsMatches: RawMun[] = [];
    const provinceMatches: RawMun[] = [];

    for (const mun of rawList) {
      const munNameLower = mun.name.toLowerCase();
      const provLower = mun.province.toLowerCase();

      if (munNameLower === query) {
        exactMatches.push(mun);
      } else if (munNameLower.startsWith(query)) {
        startsWithMatches.push(mun);
      } else if (munNameLower.includes(query)) {
        containsMatches.push(mun);
      } else if (provLower.includes(query)) {
        provinceMatches.push(mun);
      }

      if (exactMatches.length + startsWithMatches.length >= limit * 2) {
        break;
      }
    }

    const combined = [...exactMatches, ...startsWithMatches, ...containsMatches, ...provinceMatches].slice(0, limit);

    const results: B2GMunicipalityEntry[] = combined.map(m =>
      resolveB2GInfo(m.name, m.province, m.provinceCode, m.ineCode)
    );

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error in /api/b2g/municipalities:', error);
    return NextResponse.json(
      { success: false, error: 'Error procesando catálogo municipal.' },
      { status: 500 }
    );
  }
}

