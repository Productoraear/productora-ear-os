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

export interface FinancialSplit {
  grossAmount: number;
  supplierShare: number;
  earOsShare: number;
  vimumeShare: number;
}

const WATTS_PER_GUEST_BASE: number = 12;
const OUTDOOR_MULTIPLIER: number = 1.4;
const INDOOR_MULTIPLIER: number = 1.0;
const DENSITY_WARNING_THRESHOLD: number = 3;
const DENSITY_COMPATIBILITY_THRESHOLD: number = 4;
const SUBWOOFER_WATT_RATIO: number = 1000;
const TOP_SPEAKER_WATT_RATIO: number = 500;
const DB_BASE: number = 102;
const DB_REFERENCE_WATTS: number = 100;
const SUPPLIER_SHARE_RATIO: number = 0.8;
const EAR_OS_SHARE_RATIO: number = 0.1;

export function calculateAtmosphereMatch(specs: VenueSpecs): AtmosphereMatchResult {
  const warnings: string[] = [];
  const density: number =
    specs.areaSquareMeters > 0 ? specs.guestsCount / specs.areaSquareMeters : 0;

  if (density > DENSITY_WARNING_THRESHOLD) {
    warnings.push('Alta densidad de aforo (>3 personas/m²). Revisa evacuación.');
  }

  const multiplier: number = specs.isOutdoor ? OUTDOOR_MULTIPLIER : INDOOR_MULTIPLIER;
  const totalWatts: number = Math.ceil(specs.guestsCount * WATTS_PER_GUEST_BASE * multiplier);
  const subwoofers: number = Math.ceil(totalWatts / SUBWOOFER_WATT_RATIO);
  const tops: number = Math.ceil(totalWatts / TOP_SPEAKER_WATT_RATIO);
  const estimatedDb: number = Math.round(
    DB_BASE + 10 * Math.log10(Math.max(totalWatts, DB_REFERENCE_WATTS) / DB_REFERENCE_WATTS),
  );

  return {
    isCompatible: density <= DENSITY_COMPATIBILITY_THRESHOLD,
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

export function calculateSovereignSplit(totalAmount: number): FinancialSplit {
  const supplierShare: number = Number((totalAmount * SUPPLIER_SHARE_RATIO).toFixed(2));
  const earOsShare: number = Number((totalAmount * EAR_OS_SHARE_RATIO).toFixed(2));
  const vimumeShare: number = Number((totalAmount - supplierShare - earOsShare).toFixed(2));

  return {
    grossAmount: totalAmount,
    supplierShare,
    earOsShare,
    vimumeShare,
  };
}