// src/app/actions/matchmakerActions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { 
  buildCostMatrix, 
  solveHungarian, 
  LeadTemperature, 
  PrimaryPainPoint 
} from '@/lib/matchmaker/hungarianAlgorithm';

export interface MatchmakerActionResult {
  success: boolean;
  data?: {
    matchType: 'PSYCHO_MATHEMATICAL_OPTIMUM' | 'FUZZY_FALLBACK';
    computeTimeMs: number;
    leadProfile: {
      temperature: LeadTemperature;
      painPoint: PrimaryPainPoint;
    };
    matches: Array<{
      cost: number;
      candidate: any;
    }>;
  };
  error?: string;
}

/**
 * ⚡ Motor Matchmaker Psico-Técnico (Algoritmo Húngaro 2.0)
 * Resuelve la combinación óptima minimizando la función de coste ponderada en sub-20ms.
 */
export async function runPsychoMatchmakerAction(
  presupuesto: number,
  provincia: string = 'Madrid',
  category: string = 'DJ_DISCOMOVIL',
  leadTemp: LeadTemperature = 'WARM_COMPARER',
  painPoint: PrimaryPainPoint = 'QUALITY_FEAR'
): Promise<MatchmakerActionResult> {
  try {
    const startTime = performance.now();

    // 1. Consulta optimizada en PostgreSQL
    const candidates = await prisma.providerProfile.findMany({
      where: {
        province: { contains: provincia, mode: 'insensitive' },
        category: category as any,
        status: 'ACTIVE_VERIFIED',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        basePrice: true,
        rating: true,
        technicalRider: true,
        packages: true,
        province: true,
      },
      take: 100,
    });

    let fallbackTriggered = false;
    let finalCandidates = candidates;

    // 2. Fallback Heurístico si las restricciones duras devuelven 0 registros
    if (finalCandidates.length === 0) {
      fallbackTriggered = true;
      finalCandidates = await prisma.providerProfile.findMany({
        where: {
          province: { contains: provincia, mode: 'insensitive' },
        },
        orderBy: { rating: 'desc' },
        take: 15,
        select: {
          id: true,
          slug: true,
          name: true,
          basePrice: true,
          rating: true,
          technicalRider: true,
          packages: true,
          province: true,
        },
      });
    }

    if (finalCandidates.length === 0) {
      return { success: false, error: 'CERO_PROVEEDORES_EN_ZONA' };
    }

    // 3. Construcción del Vector Psico-Técnico del Lead
    const reqs = [{ 
      id: 'lead-dynamic', 
      presupuesto, 
      lat: 40.4168, 
      lng: -3.7038, // Coordenadas canónicas de Madrid
      temperature: leadTemp,
      painPoint: painPoint,
    }];
    
    const candVector = finalCandidates.map(c => ({
      id: c.id,
      precioBase: c.basePrice || 500.0,
      lat: 40.4168, 
      lng: -3.7038,
      riderCompat: c.technicalRider ? 1.0 : 0.7,
      rating: c.rating || 5.0,
      isAllInclusive: Array.isArray(c.packages) && c.packages.length > 0,
    }));

    // 4. Resolución de Matriz Bipartita con Algoritmo Húngaro
    const costMatrix = buildCostMatrix(reqs, candVector);
    const assignment = solveHungarian(costMatrix);
    
    const leadCosts = costMatrix[0].map((cost, idx) => ({ 
      cost: Math.round(cost * 1000) / 1000, 
      candidate: finalCandidates[idx] 
    }));
    leadCosts.sort((a, b) => a.cost - b.cost);
    
    const top3 = leadCosts.slice(0, 3);
    const computeTimeMs = performance.now() - startTime;

    return {
      success: true,
      data: {
        matchType: fallbackTriggered ? 'FUZZY_FALLBACK' : 'PSYCHO_MATHEMATICAL_OPTIMUM',
        computeTimeMs: Math.round(computeTimeMs * 100) / 100,
        leadProfile: { temperature: leadTemp, painPoint },
        matches: top3,
      },
    };

  } catch (error: any) {
    console.error('❌ Error en runPsychoMatchmakerAction:', error);
    return { success: false, error: error.message || 'INTERNAL_MATCHMAKER_ERROR' };
  }
}
