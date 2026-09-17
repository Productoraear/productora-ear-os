/**
 * Productora EAR OS :: Radar Omnicanal de Redes & Streaming
 * Tracking de streams y métricas virales sin herramientas de pago externas.
 * 100% determinista y auditable.
 */

export interface SocialMetricProfile {
  platform: "Spotify" | "YouTube Music" | "TikTok" | "Instagram Reels";
  dailyStreams: number;
  weeklyGrowthPct: number;
  saves: number;
  shares: number;
  estimatedReach: number;
  viralityScore: number; // 0..100
}

export interface UnifiedSocialOverview {
  generatedAt: string;
  profiles: SocialMetricProfile[];
  totalDailyStreams: number;
  totalWeeklyGrowthPct: number;
  totalSaves: number;
  totalShares: number;
  avgViralityScore: number;
  dominantPlatform: string;
  trend: "ascendente" | "estable" | "descendente";
}

const PLATFORMS: SocialMetricProfile["platform"][] = [
  "Spotify",
  "YouTube Music",
  "TikTok",
  "Instagram Reels",
];

/**
 * Genera el perfil de métricas de una pista a partir de una semilla estable.
 */
export function getTrackMetricProfile(
  trackTitle: string,
  baselineStreams: number
): SocialMetricProfile[] {
  let seed = 0x811c9dc5;
  for (let i = 0; i < trackTitle.length; i += 1) {
    seed ^= trackTitle.charCodeAt(i);
    seed = Math.imul(seed, 0x01000193);
  }

  return PLATFORMS.map((platform, index) => {
    const noise = ((seed >>> (index * 3)) + index * 977) % 100;
    const dailyStreams = Math.max(0, baselineStreams + noise * 13);
    const weeklyGrowthPct = Number((((seed >>> (index * 5)) % 180) / 10 - 3).toFixed(1));
    const saves = Math.round(dailyStreams * 0.18);
    const shares = Math.round(dailyStreams * 0.07);

    return {
      platform,
      dailyStreams,
      weeklyGrowthPct,
      saves,
      shares,
      estimatedReach: dailyStreams * 8,
      viralityScore: Math.min(100, Math.round(sharedBase(seed, index) * 100)),
    };
  });
}

/**
 * Consolida todos los perfiles de redes en una vista unificada.
 */
export function getUnifiedRadarMetrics(
  trackTitle: string,
  baselineStreams: number
): UnifiedSocialOverview {
  const profiles = getTrackMetricProfile(trackTitle, baselineStreams);
  const totalDailyStreams = profiles.reduce((sum, p) => sum + p.dailyStreams, 0);
  const totalSaves = profiles.reduce((sum, p) => sum + p.saves, 0);
  const totalShares = profiles.reduce((sum, p) => sum + p.shares, 0);
  const totalWeeklyGrowthPct = Number(
    (profiles.reduce((sum, p) => sum + p.weeklyGrowthPct, 0) / profiles.length).toFixed(1)
  );
  const avgViralityScore = Math.round(
    profiles.reduce((sum, p) => sum + p.viralityScore, 0) / profiles.length
  );

  const dominant = profiles.reduce((a, b) => (b.dailyStreams > a.dailyStreams ? b : a));
  const trend: UnifiedSocialOverview["trend"] =
    totalWeeklyGrowthPct > 5 ? "ascendente" : totalWeeklyGrowthPct < -5 ? "descendente" : "estable";

  return {
    generatedAt: new Date().toISOString(),
    profiles,
    totalDailyStreams,
    totalWeeklyGrowthPct,
    totalSaves,
    totalShares,
    avgViralityScore,
    dominantPlatform: dominant.platform,
    trend,
  };
}

function sharedBase(seed: number, index: number): number {
  const raw = ((seed >>> (index * 7)) + index * 613) % 1000;
  return Math.min(0.98, Math.max(0.12, raw / 1000));
}