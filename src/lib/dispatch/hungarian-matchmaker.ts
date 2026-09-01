export interface ArtistCandidate {
  id: string;
  name: string;
  category: 'solista' | 'mariachi' | 'trio' | 'dj_sound';
  baseRateEur: number;
  location: { lat: number; lng: number; province: string };
  reliabilityScore: number; // 0 a 100
  hasBoseRider: boolean;
}

export interface EventDispatchRequirement {
  eventId: string;
  eventType: 'boda' | 'institucional_fitur' | 'concierto';
  location: { lat: number; lng: number };
  budgetEur: number;
  requiresBoseRider: boolean;
}

export interface MatchResult {
  assignedArtist: ArtistCandidate;
  distanceKm: number;
  travelCostEur: number;
  totalCostEur: number;
  split80_10_10: { artist: number; earOs: number; vimume: number };
  dispatchScore: number;
}

// Cálculo de distancia mediante fórmula de Haversine
export function calculateHaversineDistance(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function matchOptimalArtist(
  requirement: EventDispatchRequirement,
  candidates: ArtistCandidate[]
): MatchResult | null {
  const validCandidates = candidates.filter(c => 
    (!requirement.requiresBoseRider || c.hasBoseRider) &&
    c.baseRateEur <= requirement.budgetEur
  );

  if (validCandidates.length === 0) return null;

  let bestMatch: MatchResult | null = null;
  let highestScore = -Infinity;

  for (const artist of validCandidates) {
    const distance = calculateHaversineDistance(
      requirement.location.lat, requirement.location.lng,
      artist.location.lat, artist.location.lng
    );

    const travelCost = Math.round(distance * 0.35);
    const totalCost = artist.baseRateEur + travelCost;
    
    // Scoring ponderado: 40% Rating + 30% Proximidad + 30% Margen Económico
    const proximityScore = Math.max(0, 100 - distance);
    const budgetScore = Math.min(100, Math.round((requirement.budgetEur / totalCost) * 50));
    const compositeScore = (artist.reliabilityScore * 0.4) + (proximityScore * 0.3) + (budgetScore * 0.3);

    if (compositeScore > highestScore) {
      highestScore = compositeScore;
      const artistShare = Math.round(totalCost * 0.8);
      const earShare = Math.round(totalCost * 0.1);
      const vimumeShare = totalCost - artistShare - earShare;

      bestMatch = {
        assignedArtist: artist,
        distanceKm: distance,
        travelCostEur: travelCost,
        totalCostEur: totalCost,
        split80_10_10: { artist: artistShare, earOs: earShare, vimume: vimumeShare },
        dispatchScore: Math.round(compositeScore)
      };
    }
  }

  return bestMatch;
}
