export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { searchProvidersServer } from '@/lib/providers/directory-search-server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category =
    searchParams.get('category') || searchParams.get('cat') || searchParams.get('categoria');
  const province =
    searchParams.get('province') ||
    searchParams.get('provincia') ||
    searchParams.get('prov') ||
    searchParams.get('location');
  const subcategory =
    searchParams.get('subcategory') || searchParams.get('subcat') || searchParams.get('sub');
  const maxPriceParam = searchParams.get('maxPrice');
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : null;
  const q = (searchParams.get('q') || searchParams.get('search') || '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(2000, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));

  try {
    const result = await searchProvidersServer({
      category,
      province,
      subcategory,
      maxPrice,
      q,
      page,
      limit,
      requestUrl: request.url,
    });

    return NextResponse.json({
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      providers: result.providers,
      items: result.items,
      source: result.source,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error en búsqueda de proveedores';
    console.error('[PROFILES-SEARCH] Error en búsqueda de proveedores:', err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
