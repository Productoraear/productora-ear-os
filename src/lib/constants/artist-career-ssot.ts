/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SSOT DE GESTIÓN DE CARRERAS ARTÍSTICAS (360° MULTINACIONAL)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de las reglas de negocio de la División 6 (Artist Career
 * Management). Vive en su propio módulo para NO tocar la Zona Cero
 * (`ear-os-ssot.ts`). Todo agente de la división consume estas constantes.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Etapa de carrera de un artista (escala A&R multinacional). */
export type ArtistCareerStage = 'emerging' | 'developing' | 'established' | 'elite';

export interface StageBand {
  readonly stage: ArtistCareerStage;
  readonly label: string;
  readonly minMonthlyListeners: number;
  readonly maxMonthlyListeners: number;
  readonly managementCommissionPct: number;
  readonly estimatedAdvanceEur: number;
  readonly releaseCadencePerYear: number;
}

/** Bandas canónicas de carrera (umbrales de oyentes mensuales). */
export const CAREER_STAGE_BANDS: readonly StageBand[] = [
  {
    stage: 'emerging',
    label: 'Artista Emergente',
    minMonthlyListeners: 0,
    maxMonthlyListeners: 5_000,
    managementCommissionPct: 20,
    estimatedAdvanceEur: 3_000,
    releaseCadencePerYear: 4,
  },
  {
    stage: 'developing',
    label: 'Artista en Desarrollo',
    minMonthlyListeners: 5_000,
    maxMonthlyListeners: 50_000,
    managementCommissionPct: 20,
    estimatedAdvanceEur: 12_000,
    releaseCadencePerYear: 3,
  },
  {
    stage: 'established',
    label: 'Artista Consolidado',
    minMonthlyListeners: 50_000,
    maxMonthlyListeners: 500_000,
    managementCommissionPct: 15,
    estimatedAdvanceEur: 50_000,
    releaseCadencePerYear: 2,
  },
  {
    stage: 'elite',
    label: 'Artista Élite',
    minMonthlyListeners: 500_000,
    maxMonthlyListeners: Number.POSITIVE_INFINITY,
    managementCommissionPct: 10,
    estimatedAdvanceEur: 150_000,
    releaseCadencePerYear: 1,
  },
] as const;

/** Pilares del servicio 360° (estructura departamental de multinacional). */
export const CAREER_PILLARS_360 = Object.freeze([
  'A&R / Repertorio',
  'Desarrollo Artístico',
  'Release & Distribución (DDEX)',
  'Touring & Directo',
  'Brand Partnerships',
  'Catálogo, Publishing & Regalías',
  'Sync Licensing',
  'Marketing Digital & Fanbase',
  'Business Affairs',
] as const);

/** Ingreso estimado por cada 1.000 reproducciones (blended DSP). */
export const STREAMING_REVENUE_PER_1000_EUR: number = 3.5;

/** Ratios de regalías según titularidad del máster. */
export const ROYALTY_RATES = Object.freeze({
  ownsMasters: 0.7,
  licensedMasters: 0.25,
  featured: 0.05,
} as const);

/** Caché por bolo según etapa (€). */
export const LIVE_FEE_BY_STAGE = Object.freeze({
  emerging: 500,
  developing: 1_500,
  established: 5_000,
  elite: 20_000,
} as const);

/** Ancla de licencia de sincronización (TV/ads/cine) según etapa (€). */
export const SYNC_LICENSE_BY_STAGE = Object.freeze({
  emerging: 1_500,
  developing: 5_000,
  established: 15_000,
  elite: 60_000,
} as const);

/** Ancla de campaña de marca (endorsement) según etapa (€). */
export const BRAND_DEAL_BY_STAGE = Object.freeze({
  emerging: 2_000,
  developing: 8_000,
  established: 25_000,
  elite: 100_000,
} as const);

/** Bloque canónico e inmutable de la gestión de carreras artísticas. */
export const ARTIST_CAREER_SSOT = Object.freeze({
  CAREER_STAGE_BANDS,
  CAREER_PILLARS_360,
  STREAMING_REVENUE_PER_1000_EUR,
  ROYALTY_RATES,
  LIVE_FEE_BY_STAGE,
  SYNC_LICENSE_BY_STAGE,
  BRAND_DEAL_BY_STAGE,
} as const);

export type ArtistCareerSsot = typeof ARTIST_CAREER_SSOT;
