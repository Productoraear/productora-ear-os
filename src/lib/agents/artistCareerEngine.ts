/**
 * 🎓 ARTIST CAREER ENGINE — Motor puro de la División 6 (Multinacional 360°).
 * ----------------------------------------------------------------------------
 * Funciones puras y deterministas para la gestión integral de carreras
 * artísticas, desde el artista emergente hasta el élite. Sin efectos
 * secundarios: los handlers de `artistCareerAgents.ts` orquestan el envío a n8n.
 * ----------------------------------------------------------------------------
 */
import {
  CAREER_STAGE_BANDS,
  STREAMING_REVENUE_PER_1000_EUR,
  ROYALTY_RATES,
  LIVE_FEE_BY_STAGE,
  SYNC_LICENSE_BY_STAGE,
  BRAND_DEAL_BY_STAGE,
} from '@/lib/constants/artist-career-ssot';
import type { ArtistCareerStage, StageBand } from '@/lib/constants/artist-career-ssot';
import { roundEur } from './pricing';

export interface ArtistMetrics {
  readonly monthlyListeners: number;
  readonly socialFollowers: number;
  readonly liveGigsPerYear: number;
  readonly catalogSize: number;
}

export interface ArtistProfile {
  readonly name: string;
  readonly discipline: string;
  readonly metrics: ArtistMetrics;
  readonly ownsMasters: boolean;
  readonly hasLegalEntity: boolean;
  readonly primaryTerritory: string;
}

export interface RoadmapMilestone {
  readonly pillar: string;
  readonly objective: string;
  readonly kpi: string;
  readonly cadence: string;
}

export interface ArtistRoadmap {
  readonly artistName: string;
  readonly stage: ArtistCareerStage;
  readonly stageLabel: string;
  readonly managementCommissionPct: number;
  readonly estimatedAdvanceEur: number;
  readonly releaseCadencePerYear: number;
  readonly milestones: readonly RoadmapMilestone[];
}

const STAGE_TIER: Readonly<Record<ArtistCareerStage, number>> = {
  emerging: 0,
  developing: 1,
  established: 2,
  elite: 3,
};

const COACHING_HOURS_PER_WEEK: readonly number[] = [8, 7, 5, 4];
const FANBASE_GROWTH_PCT: readonly number[] = [30, 25, 20, 15];
const CATALOG_TARGET: readonly number[] = [8, 16, 25, 40];

/** Devuelve la banda canónica de una etapa (fallback determinista a la primera). */
export function getStageBand(stage: ArtistCareerStage): StageBand {
  const band = CAREER_STAGE_BANDS.find((b: StageBand): boolean => b.stage === stage);
  return band ?? CAREER_STAGE_BANDS[0];
}

/** Predicado de tipo para validar una etapa desde payload no confiable. */
export function isArtistCareerStage(value: string): value is ArtistCareerStage {
  return CAREER_STAGE_BANDS.some((b: StageBand): boolean => b.stage === value);
}

/** Clasifica la etapa de carrera en función de los oyentes mensuales. */
export function classifyArtistStage(metrics: ArtistMetrics): ArtistCareerStage {
  const listeners = Math.max(0, metrics.monthlyListeners);
  const band = CAREER_STAGE_BANDS.find(
    (b: StageBand): boolean => listeners >= b.minMonthlyListeners && listeners < b.maxMonthlyListeners,
  );
  return band?.stage ?? 'elite';
}

/** Comisión de management 360° sobre ingresos brutos (según etapa). */
export function computeManagementFee(grossRevenueEur: number, stage: ArtistCareerStage): number {
  const band = getStageBand(stage);
  return roundEur(Math.max(0, grossRevenueEur) * (band.managementCommissionPct / 100));
}

/** Proyección de ingresos por streaming (blended DSP). */
export function computeStreamingRevenue(streams: number): number {
  return roundEur((Math.max(0, streams) * STREAMING_REVENUE_PER_1000_EUR) / 1000);
}

/** Regalía del artista según titularidad del máster. */
export function computeRoyaltyShare(grossEur: number, ownsMasters: boolean): number {
  const ratio = ownsMasters ? ROYALTY_RATES.ownsMasters : ROYALTY_RATES.licensedMasters;
  return roundEur(Math.max(0, grossEur) * ratio);
}

/** Caché por bolo según etapa. */
export function computeLiveFee(stage: ArtistCareerStage): number {
  return LIVE_FEE_BY_STAGE[stage];
}

/** Ancla de licencia de sincronización según etapa. */
export function computeSyncLicenseAnchor(stage: ArtistCareerStage): number {
  return SYNC_LICENSE_BY_STAGE[stage];
}

/** Ancla de campaña de marca según etapa. */
export function computeBrandDealAnchor(stage: ArtistCareerStage): number {
  return BRAND_DEAL_BY_STAGE[stage];
}

/** Construye el roadmap 360° de un artista según su etapa. */
export function buildArtistRoadmap(profile: ArtistProfile): ArtistRoadmap {
  const stage = classifyArtistStage(profile.metrics);
  const band = getStageBand(stage);
  const tier = STAGE_TIER[stage];

  const milestones: readonly RoadmapMilestone[] = [
    {
      pillar: 'A&R / Repertorio',
      objective: `Repertorio propio de ${CATALOG_TARGET[tier]} temas + estándares de gala.`,
      kpi: 'Retención de oyentes',
      cadence: 'Trimestral',
    },
    {
      pillar: 'Desarrollo Artístico',
      objective: `Coaching vocal/imagen de ${COACHING_HOURS_PER_WEEK[tier]} h/semana.`,
      kpi: 'Consistencia vocal',
      cadence: 'Mensual',
    },
    {
      pillar: 'Release & Distribución (DDEX)',
      objective: `${band.releaseCadencePerYear} release(s)/año con ISRC/UPC soberano y manifiesto DDEX.`,
      kpi: 'Streams incrementales',
      cadence: 'Semestral',
    },
    {
      pillar: 'Touring & Directo',
      objective: `Caché por bolo de ${computeLiveFee(stage)} €.`,
      kpi: 'Sell-out de fechas',
      cadence: 'Trimestral',
    },
    {
      pillar: 'Brand Partnerships',
      objective: `Ancla de campaña de ${computeBrandDealAnchor(stage)} €.`,
      kpi: 'Valor de campaña',
      cadence: 'Semestral',
    },
    {
      pillar: 'Catálogo, Publishing & Regalías',
      objective: `Regalía del ${profile.ownsMasters ? '70' : '25'}% según titularidad del máster.`,
      kpi: 'Regalías cobradas',
      cadence: 'Trimestral',
    },
    {
      pillar: 'Sync Licensing',
      objective: `Ancla de sincronización de ${computeSyncLicenseAnchor(stage)} € (TV/ads/cine).`,
      kpi: 'Placements firmados',
      cadence: 'Trimestral',
    },
    {
      pillar: 'Marketing Digital & Fanbase',
      objective: `Crecimiento del ${FANBASE_GROWTH_PCT[tier]}% trimestral.`,
      kpi: 'Followers/Listeners',
      cadence: 'Mensual',
    },
    {
      pillar: 'Business Affairs',
      objective: `Comisión de management del ${band.managementCommissionPct}% y anticipo de ${band.estimatedAdvanceEur} €.`,
      kpi: 'Contratos firmados',
      cadence: 'Anual',
    },
  ];

  return {
    artistName: profile.name,
    stage,
    stageLabel: band.label,
    managementCommissionPct: band.managementCommissionPct,
    estimatedAdvanceEur: band.estimatedAdvanceEur,
    releaseCadencePerYear: band.releaseCadencePerYear,
    milestones,
  };
}
