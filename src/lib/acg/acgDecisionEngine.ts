/**
 * EAR OS — AUTONOMOUS COMMERCE GRID (ACG) · DECISION ENGINE
 * ==================================================================
 * Motor matemático PURO del Autonomous Commerce Grid. Sin `crypto` de
 * Node para poder ejecutarse de forma segura en el bundle del cliente.
 *
 * REGLAS DE NEGOCIO INMUTABLES (SSOT S-CLASS — reflejadas, no duplicadas):
 * - Tarifa Base Solista (Edwin Agudelo): 350,00 €.
 * - Logística: 1,50 €/km desde Méntrida a partir del km 50.
 * - Suplemento hotelero: +120,00 € si hora de fin >= 03:00 AM o distancia > 200 km.
 * - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
 * - Cierre: Depósito de 100,00 € en Stripe (Price-Lock SHA-256 válido 24h-72h).
 * - Rider Acústico: 12 W/pax (Bose F1 812 / S1 Pro, Shure Beta 87A).
 * - Límite B2G (Art. 118 LCSP): < 15.000 € y < 75 dB SPL.
 *
 * La fuente canónica de la firma SHA-256 se delega en el endpoint servidor
 * `/api/quote/generate-lock`: este módulo SOLO genera el payload canónico.
 */

/* ------------------------------------------------------------------ */
/* Constantes SSOT (espejo seguro de cliente)                          */
/* ------------------------------------------------------------------ */

export const ACG_SSOT = {
  HUB_MENTRIDA: 'Méntrida, Toledo (Hub Central EAR)',
  BASE_SOLISTA_EUR: 350,
  LOGISTICA_EUR_KM: 1.5,
  KM_EXENTO: 50,
  SUPLEMENTO_HOTELERO_EUR: 120,
  HOTEL_KM_UMBRAL: 200,
  HORA_LIMITE_NOCTURNA: 3, // 03:00 AM
  DEPOSITO_STRIPE_EUR: 100,
  SPLIT: { artista: 0.8, earOs: 0.1, vimume: 0.1 },
  WATTS_PER_PAX: 12,
  SPL_B2G_MAX_DB: 75,
} as const;

export const ACG_ACCENT = {
  oro: '#ecb613',
  rubi: '#FF2B44',
  cyan: '#00E5FF',
  esmeralda: '#10B981',
} as const;

/* ------------------------------------------------------------------ */
/* Tipos de dominio                                                    */
/* ------------------------------------------------------------------ */

export type DecisionStepId = 'ruta' | 'match' | 'espacio' | 'plan';

export interface DecisionStep {
  id: DecisionStepId;
  index: number;
  label: string;
  nickname: string;
  accent: string;
  hint: string;
}

export const DECISION_STEPS: readonly DecisionStep[] = [
  {
    id: 'ruta',
    index: 0,
    label: 'Ruta',
    nickname: 'Uber',
    accent: ACG_ACCENT.oro,
    hint: 'Logística exacta desde Méntrida',
  },
  {
    id: 'match',
    index: 1,
    label: 'Sintonía',
    nickname: 'Tinder',
    accent: ACG_ACCENT.rubi,
    hint: 'Match acústico con dopamina',
  },
  {
    id: 'espacio',
    index: 2,
    label: 'Espacio',
    nickname: 'Airbnb',
    accent: ACG_ACCENT.cyan,
    hint: 'Reserva inmutable con Price-Lock',
  },
  {
    id: 'plan',
    index: 3,
    label: 'Plan',
    nickname: 'Bodas.net',
    accent: ACG_ACCENT.esmeralda,
    hint: 'Presupuesto y acústica de mesas',
  },
] as const;

export type AcgVenueType =
  | 'SALON_BODA'
  | 'FINCA_EXTERIOR'
  | 'IGLESIA'
  | 'RESIDENCIA_MAYORES'
  | 'PLAZA_PUBLICA';

export interface AcgArtistOffer {
  id: string;
  name: string;
  formatLabel: string;
  basePriceEur: number;
  tagline: string;
  musiciansCount: number;
  splCompatible: boolean;
  incompatibleVenueTypes: AcgVenueType[];
}

/** Catálogo real de formatos SSOT (no simulado): base 350 / dúo 480 / quinteto 750. */
export const ACG_ARTIST_OFFERS: readonly AcgArtistOffer[] = [
  {
    id: 'solista-edwin-agudelo',
    name: 'Edwin Agudelo',
    formatLabel: 'Solista Premium',
    basePriceEur: 350,
    tagline: 'Voz tenor + pistas de alta fidelidad. Bose S1 Pro + Shure Beta 87A.',
    musiciansCount: 1,
    splCompatible: true,
    incompatibleVenueTypes: ['RESIDENCIA_MAYORES'],
  },
  {
    id: 'duo-armonico',
    name: 'Dúo Armónico',
    formatLabel: 'Dúo Acústico',
    basePriceEur: 480,
    tagline: 'Edwin Agudelo + vihuela / guitarra. Cócteles y ceremonias.',
    musiciansCount: 2,
    splCompatible: true,
    incompatibleVenueTypes: [],
  },
  {
    id: 'mariachi-quinteto-pro',
    name: 'Quinteto Pro Mariachi',
    formatLabel: 'Mariachi de Gala',
    basePriceEur: 750,
    tagline: '5 músicos de conservatorio. Trompetas, vihuela y guitarrón.',
    musiciansCount: 5,
    splCompatible: false,
    incompatibleVenueTypes: ['RESIDENCIA_MAYORES', 'IGLESIA'],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Interfaces de estado / acciones (Reductor puro)                     */
/* ------------------------------------------------------------------ */

export interface AcgFincaSelection {
  fincaId: string | null;
  province: string;
  distanceKm: number;
}

export interface AcgMatchSelection {
  selectedArtistId: string | null;
  likedProviderIds: string[];
  rejectedProviderIds: string[];
}

export interface AcgSpaceSelection {
  eventDate: string | null;
  endHour: number;
  pax: number;
  venueType: AcgVenueType;
  clientName: string;
  clientPhone: string;
  priceLockPayload: string | null;
  priceLockHash: string | null;
}

export interface AcgSeatingZone {
  id: string;
  label: string;
  x: number;
  y: number;
  distanceToStageM: number;
  isSeniorZone: boolean;
}

export interface AcgPlanSelection {
  totalBudget: number;
  allocations: { artista: number; earOs: number; vimume: number };
  seatingZones: AcgSeatingZone[];
}

export interface AcgState {
  currentStepIndex: number;
  direction: 'forward' | 'backward' | null;
  finca: AcgFincaSelection;
  match: AcgMatchSelection;
  space: AcgSpaceSelection;
  plan: AcgPlanSelection;
}

export type AcgAction =
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'GO_NEXT' }
  | { type: 'GO_BACK' }
  | { type: 'SELECT_FINCA'; payload: { fincaId: string | null; province: string; distanceKm: number } }
  | { type: 'SELECT_ARTIST'; payload: string }
  | { type: 'LIKE_PROVIDER'; payload: string }
  | { type: 'REJECT_PROVIDER'; payload: string }
  | { type: 'SET_SPACE'; payload: Partial<AcgSpaceSelection> }
  | { type: 'SET_PLAN'; payload: Partial<AcgPlanSelection> }
  | { type: 'SET_PRICE_LOCK'; payload: { priceLockPayload: string; priceLockHash: string } }
  | { type: 'RESET' };

export const ACG_INITIAL_STATE: AcgState = {
  currentStepIndex: 0,
  direction: null,
  finca: { fincaId: null, province: 'Toledo', distanceKm: 0 },
  match: { selectedArtistId: 'solista-edwin-agudelo', likedProviderIds: [], rejectedProviderIds: [] },
  space: {
    eventDate: null,
    endHour: 23,
    pax: 150,
    venueType: 'FINCA_EXTERIOR',
    clientName: '',
    clientPhone: '',
    priceLockPayload: null,
    priceLockHash: null,
  },
  plan: {
    totalBudget: 0,
    allocations: { artista: 0, earOs: 0, vimume: 0 },
    seatingZones: buildDefaultSeatingZones(),
  },
};

/* ------------------------------------------------------------------ */
/* Reductor puro — máquina de estado de la Cinta de Decisión           */
/* ------------------------------------------------------------------ */

export function acgReducer(state: AcgState, action: AcgAction): AcgState {
  switch (action.type) {
    case 'GO_TO_STEP': {
      const nextIndex = Math.min(Math.max(action.payload, 0), DECISION_STEPS.length - 1);
      return {
        ...state,
        currentStepIndex: nextIndex,
        direction: nextIndex > state.currentStepIndex ? 'forward' : nextIndex < state.currentStepIndex ? 'backward' : null,
      };
    }
    case 'GO_NEXT': {
      const nextIndex = Math.min(state.currentStepIndex + 1, DECISION_STEPS.length - 1);
      return { ...state, currentStepIndex: nextIndex, direction: 'forward' };
    }
    case 'GO_BACK': {
      const nextIndex = Math.max(state.currentStepIndex - 1, 0);
      return { ...state, currentStepIndex: nextIndex, direction: 'backward' };
    }
    case 'SELECT_FINCA':
      return {
        ...state,
        finca: {
          fincaId: action.payload.fincaId,
          province: action.payload.province,
          distanceKm: action.payload.distanceKm,
        },
        space: { ...state.space, priceLockPayload: null, priceLockHash: null },
      };
    case 'SELECT_ARTIST':
      return { ...state, match: { ...state.match, selectedArtistId: action.payload } };
    case 'LIKE_PROVIDER':
      return {
        ...state,
        match: {
          ...state.match,
          likedProviderIds: [...state.match.likedProviderIds, action.payload],
          rejectedProviderIds: state.match.rejectedProviderIds.filter((id) => id !== action.payload),
        },
      };
    case 'REJECT_PROVIDER':
      return {
        ...state,
        match: {
          ...state.match,
          rejectedProviderIds: [...state.match.rejectedProviderIds, action.payload],
          likedProviderIds: state.match.likedProviderIds.filter((id) => id !== action.payload),
        },
      };
    case 'SET_SPACE':
      return { ...state, space: { ...state.space, ...action.payload } };
    case 'SET_PLAN':
      return { ...state, plan: { ...state.plan, ...action.payload } };
    case 'SET_PRICE_LOCK':
      return {
        ...state,
        space: {
          ...state.space,
          priceLockPayload: action.payload.priceLockPayload,
          priceLockHash: action.payload.priceLockHash,
        },
      };
    case 'RESET':
      return ACG_INITIAL_STATE;
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Cálculo logístico SSOT (1,50 €/km desde km 50 + hotel 120 €)        */
/* ------------------------------------------------------------------ */

export interface LogisticsBreakdown {
  distanceKm: number;
  billableKm: number;
  kmCost: number;
  hotelSurcharge: number;
  requiresAccommodation: boolean;
  totalLogistics: number;
}

export function calculateLogisticsAcg(distanceKm: number, endHour: number = 2): LogisticsBreakdown {
  const billableKm = Math.max(0, distanceKm - ACG_SSOT.KM_EXENTO);
  const kmCost = Math.round(billableKm * ACG_SSOT.LOGISTICA_EUR_KM * 100) / 100;
  const requiresAccommodation =
    distanceKm > ACG_SSOT.HOTEL_KM_UMBRAL || endHour >= ACG_SSOT.HORA_LIMITE_NOCTURNA;
  const hotelSurcharge = requiresAccommodation ? ACG_SSOT.SUPLEMENTO_HOTELERO_EUR : 0;
  const totalLogistics = Math.round((kmCost + hotelSurcharge) * 100) / 100;

  return { distanceKm, billableKm, kmCost, hotelSurcharge, requiresAccommodation, totalLogistics };
}

/* ------------------------------------------------------------------ */
/* Cálculo acústico SSOT (12 W/pax + asignación de sistema)            */
/* ------------------------------------------------------------------ */

export interface AcousticBreakdown {
  totalWatts: number;
  wattsPerPax: number;
  recommendedSystem: string;
  microphones: string;
  maxSplDb: number;
  isB2GCompliant: boolean;
}

export function calculateAcousticAcg(pax: number, venueType: AcgVenueType): AcousticBreakdown {
  const safePax = Math.max(10, pax);
  const wattsPerPax = ACG_SSOT.WATTS_PER_PAX;
  const totalWatts = safePax * wattsPerPax;

  const recommendedSystem =
    totalWatts <= 600 ? 'Bose S1 Pro System' : 'Bose F1 Model 812 + Subwoofer Array';

  const maxSplDb = venueType === 'RESIDENCIA_MAYORES' ? 74 : venueType === 'IGLESIA' ? 80 : 92;

  return {
    totalWatts,
    wattsPerPax,
    recommendedSystem,
    microphones: 'Shure Beta 87A / Axient RF',
    maxSplDb,
    isB2GCompliant: maxSplDb < ACG_SSOT.SPL_B2G_MAX_DB,
  };
}

/* ------------------------------------------------------------------ */
/* Split Soberano inmutable 80 / 10 / 10                               */
/* ------------------------------------------------------------------ */

export interface SovereignSplit {
  artista: number;
  earOs: number;
  vimume: number;
}

export function calculateSovereignSplitAcg(totalBudget: number): SovereignSplit {
  const artista = Math.round(totalBudget * ACG_SSOT.SPLIT.artista * 100) / 100;
  const earOs = Math.round(totalBudget * ACG_SSOT.SPLIT.earOs * 100) / 100;
  const vimume = Math.round((totalBudget - artista - earOs) * 100) / 100;
  return { artista, earOs, vimume };
}

/* ------------------------------------------------------------------ */
/* Cotización integral ACG                                             */
/* ------------------------------------------------------------------ */

export interface AcgQuote {
  artistBasePrice: number;
  logistics: LogisticsBreakdown;
  acoustic: AcousticBreakdown;
  totalBase: number;
  split: SovereignSplit;
  deposit: number;
}

export function computeAcgQuote(
  artistBasePrice: number,
  distanceKm: number,
  endHour: number,
  pax: number,
  venueType: AcgVenueType,
): AcgQuote {
  const logistics = calculateLogisticsAcg(distanceKm, endHour);
  const acoustic = calculateAcousticAcg(pax, venueType);
  const totalBase = Math.round((artistBasePrice + logistics.totalLogistics) * 100) / 100;
  const split = calculateSovereignSplitAcg(totalBase);

  return {
    artistBasePrice,
    logistics,
    acoustic,
    totalBase,
    split,
    deposit: ACG_SSOT.DEPOSITO_STRIPE_EUR,
  };
}

/* ------------------------------------------------------------------ */
/* Payload canónico para firma Price-Lock SHA-256                      */
/* ------------------------------------------------------------------ */

export function buildPriceLockPayload(quote: AcgQuote, eventDate: string, venueName: string): string {
  return [
    'ACG_PRICE_LOCK',
    `ART:${quote.artistBasePrice}`,
    `KM:${quote.logistics.distanceKm}`,
    `LOG:${quote.logistics.totalLogistics}`,
    `W:${quote.acoustic.totalWatts}`,
    `TOTAL:${quote.totalBase}`,
    `DEP:${quote.deposit}`,
    `DATE:${eventDate}`,
    `VENUE:${venueName}`,
  ].join('|');
}

/* ------------------------------------------------------------------ */
/* Plano de mesas acústico (simulación isofónica heurística)           */
/* ------------------------------------------------------------------ */

export interface AcgSeatingEvaluation extends AcgSeatingZone {
  splExposureDb: number;
  isTooLoud: boolean;
}

export function buildDefaultSeatingZones(): AcgSeatingZone[] {
  return Array.from({ length: 12 }, (_, index) => {
    const zoneId = index + 1;
    const col = index % 4;
    const row = Math.floor(index / 4);
    return {
      id: `mesa-${zoneId}`,
      label: `Mesa ${zoneId}`,
      x: 12 + col * 24,
      y: 20 + row * 26,
      distanceToStageM: 4 + row * 3 + (col % 2) * 1.5,
      isSeniorZone: zoneId <= 4,
    };
  });
}

export function evaluateAcousticZones(
  zones: AcgSeatingZone[],
  stageMaxSplDb: number,
): AcgSeatingEvaluation[] {
  return zones.map((zone) => {
    const attenuation = Math.max(0, 20 * Math.log10(Math.max(1, zone.distanceToStageM / 3)));
    const splExposureDb = Math.round(stageMaxSplDb - attenuation);
    const isTooLoud = splExposureDb > ACG_SSOT.SPL_B2G_MAX_DB;
    return { ...zone, splExposureDb, isTooLoud };
  });
}

/* ------------------------------------------------------------------ */
/* Helpers de formato                                                  */
/* ------------------------------------------------------------------ */

export function formatEur(value: number): string {
  return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getSelectedArtist(artistId: string | null): AcgArtistOffer {
  return ACG_ARTIST_OFFERS.find((a) => a.id === artistId) ?? ACG_ARTIST_OFFERS[0];
}