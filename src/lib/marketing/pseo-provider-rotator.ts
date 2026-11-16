/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — ROTADOR DINÁMICO DE PROVEEDORES SOBRE 29.165 URLs pSEO
 * ════════════════════════════════════════════════════════════════════════════
 * Garantiza exposición equilibrada y cero clics muertos en landings territoriales:
 *  - Algoritmo determinista con rotación por semilla temporal (hora o día).
 *  - Fallback a Centralita (+34 693 693 048) en perfiles no reclamados.
 *  - En perfiles Sovereign / Claimed despacha el contacto validado del artista.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export interface PseoCandidateProvider {
  id: string;
  name: string;
  category: string;
  province: string;
  municipality?: string;
  isSovereign: boolean;
  phone?: string;
  rating?: number;
  reviewsCount?: number;
  slug: string;
}

export interface RotatorSelectionResult {
  selected: PseoCandidateProvider;
  displayPhone: string;
  isCentralitaProxy: boolean;
  rotationIndex: number;
  totalCandidatesInProvince: number;
  cacheKey: string;
}

export function rotatePseoProviders(
  province: string,
  candidates: PseoCandidateProvider[],
  seedHours: number = new Date().getUTCHours()
): RotatorSelectionResult | null {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  // Filter or prioritize providers belonging to the target province
  const matching = candidates.filter(
    c => c.province.toLowerCase() === province.toLowerCase()
  );
  const pool = matching.length > 0 ? matching : candidates;

  // Deterministic seed based on province string and hour/day
  let hashVal = 0;
  const hashTarget = `${province.toLowerCase()}:${seedHours}`;
  for (let i = 0; i < hashTarget.length; i++) {
    hashVal = (hashVal << 5) - hashVal + hashTarget.charCodeAt(i);
    hashVal |= 0;
  }

  const positiveHash = Math.abs(hashVal);
  const rotationIndex = positiveHash % pool.length;
  const selected = pool[rotationIndex];

  // AGENTS.md § 1.1 / § 3: In unclaimed or free profiles, dispatch through Centralita
  const isCentralitaProxy = !selected.isSovereign || !selected.phone;
  const displayPhone = isCentralitaProxy ? CENTRALITA_EAR_OS : (selected.phone ?? CENTRALITA_EAR_OS);

  return {
    selected,
    displayPhone,
    isCentralitaProxy,
    rotationIndex,
    totalCandidatesInProvince: pool.length,
    cacheKey: `pseo:${province.toLowerCase()}:${seedHours}`
  };
}
