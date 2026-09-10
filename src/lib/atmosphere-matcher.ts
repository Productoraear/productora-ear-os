// EAR OS V2.4 // AtmosphereMatcher Engine

export interface VenueSpecs {
  guestsCount: number;
  areaSquareMeters: number;
  isOutdoor: boolean;
  eventStyle: 'wedding' | 'corporate' | 'festival' | 'intimate';
}

export interface AcousticRequirement {
  totalWattsRMS: number;
  wattsPerGuest: number;
  recommendedSubwoofers: number;
  recommendedTopSpeakers: number;
  acousticPressureDb: number;
}

export interface AtmosphereMatchResult {
  isCompatible: boolean;
  densityPerSqm: number;
  acoustic: AcousticRequirement;
  warnings: string[];
}

const WATTS_PER_GUEST_BASE = 12;

export function calculateAtmosphereMatch(specs: VenueSpecs): AtmosphereMatchResult {
  const warnings: string[] = [];
  const density = specs.areaSquareMeters > 0 ? specs.guestsCount / specs.areaSquareMeters : 0;
  if (density > 3) {
    warnings.push("Alta densidad de aforo (>3 personas/m²). Revisa evacuación.");
  }

  const multiplier = specs.isOutdoor ? 1.4 : 1.0;
  const totalWatts = Math.ceil(specs.guestsCount * WATTS_PER_GUEST_BASE * multiplier);
  const subwoofers = Math.ceil(totalWatts / 1000);
  const tops = Math.ceil(totalWatts / 500);
  const estimatedDb = Math.round(102 + 10 * Math.log10(Math.max(totalWatts, 100) / 100));

  return {
    isCompatible: density <= 4,
    densityPerSqm: Number(density.toFixed(2)),
    acoustic: {
      totalWattsRMS: totalWatts,
      wattsPerGuest: WATTS_PER_GUEST_BASE,
      recommendedSubwoofers: subwoofers,
      recommendedTopSpeakers: tops,
      acousticPressureDb: estimatedDb,
    },
    warnings,
  };
}

export interface FinancialSplit {
  grossAmount: number;
  supplierShare: number;
  earOsShare: number;
  vimumeShare: number;
}

export function calculateSovereignSplit(totalAmount: number): FinancialSplit {
  const supplierShare = Number((totalAmount * 0.80).toFixed(2));
  const earOsShare = Number((totalAmount * 0.10).toFixed(2));
  const vimumeShare = Number((totalAmount - supplierShare - earOsShare).toFixed(2));

  return {
    grossAmount: totalAmount,
    supplierShare,
    earOsShare,
    vimumeShare,
  };
}
