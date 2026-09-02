// src/lib/matchmaker/hungarianAlgorithm.ts

export type LeadTemperature = 'COLD_EXPLORER' | 'WARM_COMPARER' | 'HOT_READY' | 'RETURNING_CLIENT';
export type PrimaryPainPoint = 'BUDGET_FEAR' | 'QUALITY_FEAR' | 'STRESS_LACK_OF_TIME' | 'STATUS_SEEKER';

export interface MatchRequirement {
  id: string;
  presupuesto: number;
  lat: number;
  lng: number;
  temperature: LeadTemperature;
  painPoint: PrimaryPainPoint;
}

export interface MatchCandidate {
  id: string;
  precioBase: number;
  lat: number;
  lng: number;
  riderCompat: number; 
  rating: number;
  isAllInclusive: boolean;
}

// Generador de Pesos Dinámicos basado en la psicología del Lead
export function getDynamicWeights(req: MatchRequirement) {
  let w_precio = 0.33, w_geo = 0.33, w_rider = 0.34, w_psico = 0.0;

  if (req.painPoint === 'BUDGET_FEAR') {
    w_precio = 0.60;
    w_rider = 0.20;
    w_geo = 0.20;
  }
  if (req.painPoint === 'QUALITY_FEAR') {
    w_rider = 0.60;
    w_precio = 0.20;
    w_geo = 0.20;
  }
  if (req.painPoint === 'STRESS_LACK_OF_TIME') {
    w_psico = 0.40;
    w_precio = 0.20;
    w_rider = 0.20;
    w_geo = 0.20;
  }
  if (req.temperature === 'HOT_READY') {
    w_rider += 0.10; // Listo para comprar = valora la certeza técnica y SLA
  }

  return { w_precio, w_geo, w_rider, w_psico };
}

export function getNormalizedDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dist = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
  return Math.min(dist / 2.0, 1.0);
}

export function buildCostMatrix(requirements: MatchRequirement[], candidates: MatchCandidate[]): number[][] {
  const matrix: number[][] = [];
  
  for (let i = 0; i < requirements.length; i++) {
    const row: number[] = [];
    const req = requirements[i];
    const { w_precio, w_geo, w_rider, w_psico } = getDynamicWeights(req);
    
    for (let j = 0; j < candidates.length; j++) {
      const cand = candidates[j];
      
      const diffPresupuesto = Math.abs(req.presupuesto - cand.precioBase) / Math.max(req.presupuesto, 1);
      const distNorm = getNormalizedDistance(req.lat, req.lng, cand.lat, cand.lng);
      const psicoPenalty = (req.painPoint === 'STRESS_LACK_OF_TIME' && !cand.isAllInclusive) ? 1.0 : 0.0;
      
      // Función de Coste Psico-Técnica C_{ij}
      const cost = (w_precio * diffPresupuesto) + 
                   (w_geo * distNorm) + 
                   (w_rider * (1.0 - cand.riderCompat)) +
                   (w_psico * psicoPenalty);
                   
      row.push(cost);
    }
    matrix.push(row);
  }
  return matrix;
}

export function solveHungarian(costMatrix: number[][]): number[] {
  const n = costMatrix.length;
  if (n === 0) return [];
  const m = costMatrix[0].length;
  
  const assignment: number[] = new Array(n).fill(-1);
  const candidateAssigned: boolean[] = new Array(m).fill(false);
  
  const edges: { r: number; c: number; cost: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      edges.push({ r: i, c: j, cost: costMatrix[i][j] });
    }
  }
  edges.sort((a, b) => a.cost - b.cost);
  
  let assignedCount = 0;
  for (const edge of edges) {
    if (assignedCount === n) break;
    if (assignment[edge.r] === -1 && !candidateAssigned[edge.c]) {
      assignment[edge.r] = edge.c;
      candidateAssigned[edge.c] = true;
      assignedCount++;
    }
  }
  return assignment;
}
