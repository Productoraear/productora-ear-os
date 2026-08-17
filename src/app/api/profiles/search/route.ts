export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 🏛️ S-CLASS SOVEREIGN PROVIDER SEARCH & MATCHMAKING API
 * Búsqueda, conteo en tiempo real y paginación ultrarrápida sobre los 8.352 proveedores homologados.
 */
let cachedProviders: any[] | null = null;
let cachedCategoryCounts: Record<string, number> | null = null;

function loadMasterProviders(): any[] {
  if (cachedProviders) return cachedProviders;

  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'bodas-vendors-harvested.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      cachedProviders = JSON.parse(raw);
      
      // Calcular conteos de categorías
      const counts: Record<string, number> = { ALL: (cachedProviders || []).length };
      (cachedProviders || []).forEach((p: any) => {
        const cat = p.category || 'SERVICIOS_EVENTOS';
        counts[cat] = (counts[cat] || 0) + 1;
      });
      cachedCategoryCounts = counts;

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
    const rawCategory = (searchParams.get('category') || 'ALL').trim().toUpperCase();
    const rawProvince = (searchParams.get('province') || 'ALL').trim().toLowerCase();
    const maxBudget = parseInt(searchParams.get('maxBudget') || '15000', 10);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(6, parseInt(searchParams.get('limit') || '24', 10)));
    const sortBy = searchParams.get('sortBy') || 'MATCH';

    const all = loadMasterProviders();

    let filtered = all.filter((p: any) => {
      // 1. Filtro de Categoría
      if (rawCategory !== 'ALL') {
        const pCat = (p.category || 'SERVICIOS_EVENTOS').toUpperCase();
        if (pCat !== rawCategory) return false;
      }
      
      // 2. Filtro de Provincia / Ubicación
      if (rawProvince !== 'all' && rawProvince !== 'toda españa (nacional)') {
        const pLoc = `${p.location?.province || ''} ${p.location?.city || ''} ${p.location?.address || ''}`.toLowerCase();
        if (!pLoc.includes(rawProvince)) return false;
      }

      // 3. Filtro de Presupuesto
      const price = p.pricing?.rentalBasePrice || p.basePrice || p.price || 450;
      if (price > maxBudget) return false;

      // 4. Búsqueda por Texto
      if (q.length > 0) {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const cityMatch = (p.location?.city || '').toLowerCase().includes(q);
        const provMatch = (p.location?.province || '').toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !cityMatch && !provMatch) return false;
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
      categoryCounts: cachedCategoryCounts || {},
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
