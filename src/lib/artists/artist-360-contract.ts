/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST-360-CONTRACT.TS — CONTRATO DE AUTONOMÍA 360 PARA ARTISTAS EUROPA
 * ════════════════════════════════════════════════════════════════════════════
 * Misión: W49_T04_ARTIST_360_MULTINATIONAL_HUB
 * Erradica comisiones abusivas tradicionales (30%-50%) dando soberanía total:
 *  - Capa A: Caché individual por formato, km exentos desde sede fiscal y acústica.
 *  - Capa B: Distribución Digital 360 con validador y generador de ISRC.
 *  - Capa C: Liquidación automática Split Soberano 80/10/10 al céntimo.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SPLIT_SOBERANO,
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export type ArtistFormat = 'SOLISTA' | 'DUO' | 'MARIACHI' | 'ORQUESTA' | 'DJ';

export interface ArtistProfile360 {
  id: string;
  artistName: string;
  format: ArtistFormat;
  fiscalCity: string;
  fiscalProvince: string;
  baseCacheEur: number;
  exemptKm: number;
  ratePerKmEur: number;
  splLimitDb: number;
  wattsPerPax: number;
  officialStreamingUrl?: string;
  officialSocialUrl?: string;
  isrcCatalog: string[];
}

export interface AcousticRiderInfo {
  wattsTotal: number;
  maxSplDb: number;
  compliant: boolean;
  standard: string;
}

export interface QuoteCalculationRequest {
  format: ArtistFormat;
  distanceKm: number;
  endHour24?: number;
  customBaseCacheEur?: number;
  requestedBaseCacheEur?: number;
  audiencePax?: number;
}

export type ArtistQuoteRequest = QuoteCalculationRequest;

export interface QuoteCalculationResult {
  baseCacheEur: number;
  exemptKm: number;
  chargeableKm: number;
  kmRateEur: number;
  logisticsTotalEur: number;
  hotelSupplementEur: number;
  totalEventEur: number;
  depositDeductibleEur: number;
  pendingFinalSettlementEur: number;
  isEdwinAgudeloSovereignFloor: boolean;
  acousticRider: AcousticRiderInfo;
  b2gCeilingAlert: boolean;
  b2gSafeCeilingEur: number;
}

export type ArtistQuoteResponse = QuoteCalculationResult;

export interface SettlementSplitResult {
  totalGrossEur: number;
  artistAmountEur: number;
  earOsAmountEur: number;
  vimumeAmountEur: number;
  depositPaidEur: number;
  artistNetPendingEur: number;
  // Céntimos enteros exactos para invariantes transaccionales
  totalCents: number;
  artistCents: number;
  earOsCents: number;
  vimumeCents: number;
  depositDeductedCents: number;
  artistNetPendingCents: number;
  artistEur: number;
  earOsEur: number;
  vimumeEur: number;
}

export type ArtistSettlementSplit = SettlementSplitResult;

export interface IsrcValidationResult {
  valid: boolean;
  code: string;
  country: string;
  registrant: string;
  year: string;
  designation: string;
  normalized?: string;
  reason?: string;
  error?: string;
}

/** Formato oficial ISRC para Productora EAR: ES-EAR-YY-NNNNN */
export const ISRC_REGEX = /^ES-EAR-\d{2}-\d{5}$/;

/** Formato universal ISO 3901 */
export const ISO_3901_REGEX = /^[A-Z]{2}-?[A-Z0-9]{3}-?\d{2}-?\d{5}$/;

/** Mínimo legal por formato en el catálogo */
export const MIN_CACHE_BY_FORMAT: Record<ArtistFormat, number> = Object.freeze({
  SOLISTA: TARIFA_BASE_SOLISTA_EUR, // 350.0 €
  DUO: 500.0,
  MARIACHI: 650.0,
  ORQUESTA: 1800.0,
  DJ: 400.0,
});

/**
 * Valida un código ISRC contra la norma ISO 3901 y el prefijo de EAR OS.
 */
export function validateIsrc(code: string): IsrcValidationResult {
  const trimmed = (code || '').trim().toUpperCase();
  if (!ISRC_REGEX.test(trimmed)) {
    const errorMsg = 'El código debe cumplir el formato internacional ES-EAR-YY-NNNNN';
    return {
      valid: false,
      code: trimmed,
      country: '',
      registrant: '',
      year: '',
      designation: '',
      reason: errorMsg,
      error: errorMsg,
    };
  }

  const parts = trimmed.split('-');
  return {
    valid: true,
    code: trimmed,
    normalized: trimmed,
    country: parts[0],
    registrant: parts[1],
    year: parts[2],
    designation: parts[3],
  };
}

/**
 * Genera un código ISRC canónico determinista para distribución digital.
 */
export function generateCanonicalIsrc(yearTwoDigits: number, sequenceNumber: number): string {
  const yy = String(yearTwoDigits).padStart(2, '0').slice(-2);
  const nnnnn = String(sequenceNumber).padStart(5, '0').slice(-5);
  return `ES-EAR-${yy}-${nnnnn}`;
}

/**
 * Calcula el presupuesto individual del artista con blindaje del caché suelo.
 */
export function calculateArtistQuote(req: QuoteCalculationRequest): QuoteCalculationResult {
  const minBase = MIN_CACHE_BY_FORMAT[req.format];
  const requested = req.customBaseCacheEur ?? req.requestedBaseCacheEur;
  const requestedBase = requested !== undefined && !Number.isNaN(requested) ? requested : minBase;
  const baseCacheEur = Math.max(requestedBase, minBase);

  const exemptKm = LOGISTICA_KM_EXENTOS;
  const distance = Math.max(0, req.distanceKm || 0);
  const chargeableKm = Math.max(0, distance - exemptKm);
  const logisticsTotalEur = Math.round(chargeableKm * LOGISTICA_EUR_PER_KM * 100) / 100;

  const endHour = req.endHour24 ?? 0;
  const requiresHotel = endHour >= HORA_FIN_HOTEL || distance > LOGISTICA_KM_HOTEL;
  const hotelSupplementEur = requiresHotel ? SUPLEMENTO_HOTEL_EUR : 0;

  const totalEventEur = Math.round((baseCacheEur + logisticsTotalEur + hotelSupplementEur) * 100) / 100;
  const depositDeductibleEur = DEPOSITO_STRIPE_EUR;
  const pendingFinalSettlementEur = Math.max(0, Math.round((totalEventEur - depositDeductibleEur) * 100) / 100);

  const audiencePax = req.audiencePax && req.audiencePax > 0 ? req.audiencePax : 100;
  const wattsTotal = audiencePax * WATTS_PER_PAX;
  const compliantAcoustic = LIMITE_SPL_DB <= 75;

  const b2gCeilingAlert = totalEventEur >= AJUSTE_PREVENTIVO_B2G_EUR;

  return {
    baseCacheEur,
    exemptKm,
    chargeableKm,
    kmRateEur: LOGISTICA_EUR_PER_KM,
    logisticsTotalEur,
    hotelSupplementEur,
    totalEventEur,
    depositDeductibleEur,
    pendingFinalSettlementEur,
    isEdwinAgudeloSovereignFloor: req.format === 'SOLISTA' && baseCacheEur === TARIFA_BASE_SOLISTA_EUR,
    acousticRider: {
      wattsTotal,
      maxSplDb: LIMITE_SPL_DB,
      compliant: compliantAcoustic,
      standard: 'Ley 37/2003 (< 75 dB SPL, 12 W/pax)',
    },
    b2gCeilingAlert,
    b2gSafeCeilingEur: AJUSTE_PREVENTIVO_B2G_EUR,
  };
}

/**
 * Liquida el Split Soberano 80/10/10 al céntimo exacto sin redondeos acumulativos.
 */
export function settleArtistSplit(
  totalGrossEur: number,
  depositPaidEur: number = DEPOSITO_STRIPE_EUR
): SettlementSplitResult {
  const totalCents = Math.round(totalGrossEur * 100);
  const depositCents = Math.round(depositPaidEur * 100);

  const artistCents = Math.round(totalCents * SPLIT_SOBERANO.artista);
  const earOsCents = Math.round(totalCents * SPLIT_SOBERANO.earOs);
  const vimumeCents = totalCents - artistCents - earOsCents; // Ajuste residual de céntimo (absorbido por VIMUME)

  const artistNetPendingCents = Math.max(0, artistCents - depositCents);

  const artistAmountEur = artistCents / 100;
  const earOsAmountEur = earOsCents / 100;
  const vimumeAmountEur = vimumeCents / 100;
  const artistNetPendingEur = artistNetPendingCents / 100;

  return {
    totalGrossEur: totalCents / 100,
    artistAmountEur,
    earOsAmountEur,
    vimumeAmountEur,
    depositPaidEur: depositCents / 100,
    artistNetPendingEur,
    totalCents,
    artistCents,
    earOsCents,
    vimumeCents,
    depositDeductedCents: depositCents,
    artistNetPendingCents,
    artistEur: artistAmountEur,
    earOsEur: earOsAmountEur,
    vimumeEur: vimumeAmountEur,
  };
}

export interface Artist360Track {
  id: string;
  isrc: string;
  title: string;
  subtitle: string;
  duration: string;
  durationSeconds: number;
  year: string;
  genre: string;
  audioUrl?: string;
  youtubeId?: string;
  lyricsExcerpt: string;
  description: string;
}

/** Pistas canónicas del catálogo oficial de Edwin Agudelo con ISRC */
export const ARTIST_360_TRACKS: readonly Artist360Track[] = Object.freeze([
  {
    id: 'track-1',
    isrc: generateCanonicalIsrc(26, 1),
    title: 'AMANTES Y AMIGOS (BACHATA)',
    subtitle: 'Feat. Andriu Mathyun · Dir. Pablo Quispe',
    duration: '01:59',
    durationSeconds: 119,
    year: '2022',
    genre: 'Bachata Urbana / Fusión Latina',
    audioUrl: '/media/dani-aragon-vault/masterclass_preview_01.wav',
    youtubeId: 'tx3Jc5A-0Lk',
    lyricsExcerpt: '"Amantes y amigos en secreto... viviendo esta pasión que quema el alma y no pide permiso."',
    description: 'Hito de colaboración artística y diversificación hacia la Bachata Urbana. Masterizada con sonorización S-Class.',
  },
  {
    id: 'track-2',
    isrc: generateCanonicalIsrc(26, 2),
    title: 'MI PROPIA REALIDAD',
    subtitle: 'Himno de resiliencia del emigrante · Teatro La Latina',
    duration: '03:45',
    durationSeconds: 225,
    year: '2014',
    genre: 'Ranchera Lírica de Gala',
    audioUrl: '/media/edwin/podcast-cumpleanos-edwin.m4a',
    youtubeId: '7yybH70StV0',
    lyricsExcerpt: 'Y cuánto me dolió dejar mi casa y tierra, mi gente. Esta es mi propia realidad, ¿cuál es la tuya?',
    description: 'Obra emblemática interpretada ante el cuerpo diplomático hispano en Madrid.',
  },
  {
    id: 'track-3',
    isrc: generateCanonicalIsrc(26, 3),
    title: 'ALGÚN DÍA MAMÁ',
    subtitle: 'Homenaje universal a las madres · La Cubierta de Leganés',
    duration: '04:12',
    durationSeconds: 252,
    year: '2016',
    genre: 'Mariachi Tradicional Solemne',
    audioUrl: '/media/dani-aragon-vault/masterclass_preview_01.wav',
    youtubeId: '0DSEsWA9JsA',
    lyricsExcerpt: '"Algún día mamá, podré devolverte en besos y flores cada noche de desvelo... mientras mi canto sea el abrazo que te abrace el alma."',
    description: 'Clásico indispensable para serenatas, bodas de oro y aniversarios familiares.',
  },
  {
    id: 'track-4',
    isrc: generateCanonicalIsrc(26, 4),
    title: 'ACOMPÁÑAME',
    subtitle: 'Himno de esperanza y superación · Arreglos Over Vásquez',
    duration: '03:58',
    durationSeconds: 238,
    year: '2020',
    genre: 'Balada Sinfónica en Positivo',
    audioUrl: '/media/edwin/podcast-cumpleanos-edwin.m4a',
    youtubeId: 'jTU8aBsX2ik',
    lyricsExcerpt: '"Acompáñame en este vuelo, dame tu mano al caminar... que la tormenta pasará y juntos volveremos a cantar."',
    description: 'Producción de alta gama grabada con sección de metales y cuerda en Madrid.',
  },
  {
    id: 'track-5',
    isrc: generateCanonicalIsrc(26, 5),
    title: 'EDWIN AGUDELO EN DIRECTO (TOP 10 MARIACHI)',
    subtitle: 'Gala de San Valentín & Gran Presión Acústica',
    duration: '10:15',
    durationSeconds: 615,
    year: '2024',
    genre: 'Mariachi Live Session S-Class',
    audioUrl: '/media/dani-aragon-vault/masterclass_preview_01.wav',
    youtubeId: 'fLT4-kqfdI4',
    lyricsExcerpt: '"Si nos dejan, nos vamos a querer toda la vida... Si nos dejan, nos vamos a vivir a un mundo nuevo."',
    description: 'Sesión en vivo con mariachi completo interpretando clásicos rancheros.',
  },
  {
    id: 'track-6',
    isrc: generateCanonicalIsrc(26, 6),
    title: 'PIEL DE NIÑA (CANCIÓN PERSONALIZADA)',
    subtitle: 'Obra de encargo VIP a medida · Producción EAR',
    duration: '04:30',
    durationSeconds: 270,
    year: '2026',
    genre: 'Serenata Personalizada a Medida',
    audioUrl: '/media/edwin/podcast-cumpleanos-edwin.m4a',
    youtubeId: 'xf2Cv6BsCkw',
    lyricsExcerpt: '"Piel de niña, mirada de cielo... para Evelin con todo el amor de Fonsi en una serenata que durará para siempre."',
    description: 'Composición y orquestación original para dedicatorias líricas exclusivas.',
  },
]);

/** Perfil base canónico de Edwin Agudelo como Solista #1 Soberano */
export const EDWIN_AGUDELO_PROFILE_360: Readonly<ArtistProfile360> = Object.freeze({
  id: 'edwin-agudelo-solista-360',
  artistName: 'Edwin Agudelo',
  format: 'SOLISTA' as const,
  fiscalCity: 'Méntrida',
  fiscalProvince: 'Toledo',
  baseCacheEur: TARIFA_BASE_SOLISTA_EUR,
  exemptKm: LOGISTICA_KM_EXENTOS,
  ratePerKmEur: LOGISTICA_EUR_PER_KM,
  splLimitDb: LIMITE_SPL_DB,
  wattsPerPax: WATTS_PER_PAX,
  officialStreamingUrl: 'https://open.spotify.com/artist/edwin-agudelo',
  officialSocialUrl: 'https://instagram.com/edwinagudelomusic',
  isrcCatalog: [
    generateCanonicalIsrc(26, 1),
    generateCanonicalIsrc(26, 2),
    generateCanonicalIsrc(26, 3),
    generateCanonicalIsrc(26, 4),
    generateCanonicalIsrc(26, 5),
    generateCanonicalIsrc(26, 6),
  ],
});


