export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 🏛️ S-CLASS SOVEREIGN PROVIDER SEARCH & MATCHMAKING API
 * Búsqueda y paginación ultrarrápida sobre los 8.352 proveedores homologados.
 */
let cachedProviders: any[] | null = null;

function loadMasterProviders(): any[] {
  if (cachedProviders) return cachedProviders;

  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'bodas-vendors-harvested.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      cachedProviders = JSON.parse(raw);
      return cachedProviders || [];
    }
  } catch (e) {
    console.warn('[SEARCH_API] Error cargando bodas-vendors-harvested:', e);
  }
  return [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const category = (searchParams.get('category') || 'ALL').toUpperCase();
    const province = (searchParams.get('province') || 'ALL').toLowerCase();
    const maxBudget = parseInt(searchParams.get('maxBudget') || '10000', 10);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(6, parseInt(searchParams.get('limit') || '24', 10)));
    const sortBy = searchParams.get('sortBy') || 'MATCH';

    const all = loadMasterProviders();

    let filtered = all.filter((p: any) => {
      if (category !== 'ALL' && p.category !== category) return false;
      
      if (province !== 'ALL') {
        const pLoc = (p.location?.province || p.location?.city || p.location?.address || p.location || '').toLowerCase();
        if (!pLoc.includes(province)) return false;
      }

      const price = p.pricing?.rentalBasePrice || p.basePrice || p.price || 450;
      if (price > maxBudget) return false;

      if (q.length > 0) {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const cityMatch = (p.location?.city || '').toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !cityMatch) return false;
      }

      return true;
    });

    // Ordenación
    filtered.sort((a: any, b: any) => {
      const scoreA = (a.metrics?.rating || a.rating || 4.9) * 20;
      const scoreB = (b.metrics?.rating || b.rating || 4.9) * 20;
      const priceA = a.pricing?.rentalBasePrice || a.basePrice || 450;
      const priceB = b.pricing?.rentalBasePrice || b.basePrice || 450;

      if (sortBy === 'PRICE_ASC') return priceA - priceB;
      if (sortBy === 'PRICE_DESC') return priceB - priceA;
      if (sortBy === 'RATING') return (b.metrics?.rating || b.rating || 0) - (a.metrics?.rating || a.rating || 0);
      return scoreB - scoreA;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      providers: paginated
    });

  } catch (error: any) {
    console.error('🛑 [PROFILE_SEARCH_API_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Error en búsqueda de proveedores' },
      { status: 500 }
    );
  }
}
