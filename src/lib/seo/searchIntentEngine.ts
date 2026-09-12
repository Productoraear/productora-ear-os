// src/lib/seo/searchIntentEngine.ts
//
// MOTOR pSEO DE INTENCIÓN DE BÚSQUEDA (HORMOZI $100M GRAND SLAM OFFER)
// Mapea los 10 gremios canónicos × 52 provincias y produce un SearchIntentProfile
// listo para alimentar la landing modular de ultra-alta retención.
//
// Reglas de negocio S-CLASS (INMUTABLES):
//   - Rider Acústico: 12 W/pax (Bose F1 812 / S1 Pro, Shure Beta 87A).
//   - Límite B2G (Art. 118 LCSP): < 15.000,00 € (ajuste preventivo 95% = 14.250,00 €) y < 75 dB SPL.
//   - Logística: 1,50 €/km desde Méntrida a partir del km 50. +120 € (Hotel) si hora fin >= 3:00 AM o distancia > 200 km.
//   - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
//   - Cierre: Depósito de 100,00 € en Stripe (Price-Lock SHA-256 válido 24h-72h).
//   - Tarifa Base Solista (Edwin Agudelo): 350,00 €.

import { PROVINCIAS_52_GRAPH } from '../constants/seo-data-hydrated';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIPOS CANÓNICOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CANONICAL_GREMIO_SLUGS = [
  'mariachis',
  'sonido-iluminacion',
  'fincas',
  'dj',
  'solistas',
  'cuarteto-cuerdas',
  'catering-brasas',
  'pantallas-led',
  'animacion',
  'coches-clasicos'
] as const;

export type GremioId = (typeof CANONICAL_GREMIO_SLUGS)[number];

export interface HormoziValueItem {
  label: string;
  value: number;
}

export interface AcousticPowerProfile {
  pax: number;
  wattsPerPax: number;
  wattsRms: number;
  estimatedSplDb: number;
  isSplCompliant: boolean;
  recommendedSystem: string;
}

export interface MentridaLogistics {
  province: string;
  provinceName: string;
  distanceKm: number;
  billableKm: number;
  ratePerKm: number;
  kmFee: number;
  hotelFee: number;
  isHotelApplied: boolean;
  totalLogisticsFee: number;
}

export interface SearchIntentProfile {
  gremio: GremioId;
  gremioLabel: string;
  provincia: string;
  provinciaName: string;
  leadPainPoints: string[];
  dreamOutcome: string;
  hormoziValueStack: HormoziValueItem[];
  hormoziValueTotal: number;
  proofPhotos: string[];
  acousticSpecs: {
    wattsPerPax: number;
    baseSystem: string;
    splLimitDb: number;
  };
  faqs: string[];
  basePrice: number;
  deposit: number;
  logistics: MentridaLogistics;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTES DE NEGOCIO (SSOT S-CLASS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const WATTS_PER_PAX = 12;
export const SPL_LIMIT_DB = 75;
export const BASE_SOLIST_PRICE = 350;
export const DEPOSIT_PRICE = 100;
export const LOGISTICS_RATE_PER_KM = 1.5;
export const LOGISTICS_FREE_KM = 50;
export const HOTEL_FEE = 120;
export const HOTEL_THRESHOLD_HOUR = 3;
export const HOTEL_THRESHOLD_KM = 200;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REGISTRO DE INTENCIÓN POR GREMIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface GremioIntentSeed {
  label: string;
  painPoints: string[];
  dreamOutcome: string;
}

const GREMIO_ALIASES: Record<string, GremioId> = {
  mariachi: 'mariachis',
  mariachis: 'mariachis',
  sonido: 'sonido-iluminacion',
  'sonido-iluminacion': 'sonido-iluminacion',
  'sonido-profesional': 'sonido-iluminacion',
  iluminacion: 'sonido-iluminacion',
  luces: 'sonido-iluminacion',
  finca: 'fincas',
  fincas: 'fincas',
  hacienda: 'fincas',
  dj: 'dj',
  'disc-jockey': 'dj',
  solista: 'solistas',
  solistas: 'solistas',
  cantante: 'solistas',
  'cuarteto-cuerdas': 'cuarteto-cuerdas',
  cuarteto: 'cuarteto-cuerdas',
  cuerdas: 'cuarteto-cuerdas',
  'catering-brasas': 'catering-brasas',
  catering: 'catering-brasas',
  brasas: 'catering-brasas',
  'pantallas-led': 'pantallas-led',
  'pantalla-led': 'pantallas-led',
  pantallas: 'pantallas-led',
  led: 'pantallas-led',
  animacion: 'animacion',
  'animacion-infantil': 'animacion',
  'coches-clasicos': 'coches-clasicos',
  coches: 'coches-clasicos',
  'coche-clasico': 'coches-clasicos'
};

const GREMIO_INTENT_MAP: Record<GremioId, GremioIntentSeed> = {
  mariachis: {
    label: 'Mariachis',
    painPoints: [
      'Miedo a que el mariachi no llegue a tiempo a la finca el día de la boda.',
      'Sobrecostes ocultos en desplazamiento que inflan el presupuesto inicial.',
      'Dudas sobre si el sonido en el cóctel atronará a los abuelos.'
    ],
    dreamOutcome: 'Mariachi de gala con repertorio a medida, sonido calibrado y hora de llegada blindada con telemetría GPS.'
  },
  'sonido-iluminacion': {
    label: 'Sonido e Iluminación',
    painPoints: [
      'Incertidumbre sobre la potencia real necesaria para el número de invitados.',
      'Temor a superar los límites de decibelios y que la policía pare el evento.',
      'Equipos de baja calidad que distorsionan en plena actuación.'
    ],
    dreamOutcome: 'Sonorización Bose F1 812 calibrada a 12 W/pax y luces LED sincronizadas, dentro del límite municipal de 75 dB.'
  },
  fincas: {
    label: 'Fincas para Bodas',
    painPoints: [
      'Fincas que no conocen el municipio ni sus accesos logísticos.',
      'Fotos de stock que no corresponden a instalaciones reales.',
      'Sobrecostes por proveedores externos que no coordinan entre sí.'
    ],
    dreamOutcome: 'Finca real verificada con acceso logístico coordinado y arsenal de proveedores integrados en un solo contrato.'
  },
  dj: {
    label: 'DJ Profesional',
    painPoints: [
      'Un DJ que no lee la pista y vacía la celebración.',
      'Fallos técnicos sin un plan B de contingencia.',
      'Presupuesto que se dispara por horas extra no pactadas.'
    ],
    dreamOutcome: 'DJ homologado con setlist personalizado y relevo Uber garantizado para 0% cancelaciones.'
  },
  solistas: {
    label: 'Solistas',
    painPoints: [
      'Cantante que no encaja con el estilo de la ceremonia.',
      'Ausencia de microfonía profesional que ensucia la voz.',
      'Miedo a un presupuesto cerrado que se modifica en el último momento.'
    ],
    dreamOutcome: 'Solista de conservatorio (Edwin Agudelo, 350€) con microfonía Shure y precio congelado por Price-Lock SHA-256.'
  },
  'cuarteto-cuerdas': {
    label: 'Cuarteto de Cuerdas',
    painPoints: [
      'Riesgo de un repertorio genérico para una ceremonia única.',
      'Instrumentos amplificados sin calibración para exteriores.',
      'Coordinación pobre con el cóctel y el protocolo de boda.'
    ],
    dreamOutcome: 'Cuarteto de cuerdas con repertorio de conservatorio y sonorización de exteriores calibrada.'
  },
  'catering-brasas': {
    label: 'Catering de Brasas',
    painPoints: [
      'Miedo a que la comida llegue fría o fuera de tiempo.',
      'Showcooking de fuego vivo sin medidas de seguridad.',
      'Menús poco flexibles que no se adaptan a alergias o veganos.'
    ],
    dreamOutcome: 'Catering de brasas con showcooking en vivo, logística de frío y menús personalizables.'
  },
  'pantallas-led': {
    label: 'Pantallas LED',
    painPoints: [
      'Pantallas que fallan por falta de soporte técnico in situ.',
      'Resolución insuficiente para vídeo de boda o corporativo.',
      'Montaje que no respeta los tiempos del evento.'
    ],
    dreamOutcome: 'Pantallas LED HD con técnico dedicado y montaje coordinado con telemetría en directo.'
  },
  animacion: {
    label: 'Animación',
    painPoints: [
      'Animadores sin experiencia con niños o público institucional.',
      'Recursos de baja calidad que no enganchan a los invitados.',
      'Falta de coordinación con el resto del evento.'
    ],
    dreamOutcome: 'Animación profesional sincronizada con el guion del evento y cobertura de contingencia.'
  },
  'coches-clasicos': {
    label: 'Coches Clásicos',
    painPoints: [
      'Vehículos que no llegan puntuales a la ceremonia.',
      'Miedo a averías en carretera sin plan B.',
      'Vehículos sin el refinamiento que exige una boda o evento VIP.'
    ],
    dreamOutcome: 'Flota de coches clásicos verificados con conductor y relevo Uber garantizado en menos de 45 minutos.'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILIDADES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function formatProvinciaName(slug: string): string {
  if (!slug) return 'Madrid';
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function normalizeGremio(servicio: string): GremioId {
  const key = servicio?.toLowerCase().trim() ?? '';
  return GREMIO_ALIASES[key] ?? 'mariachis';
}

export function getGremioLabel(gremio: GremioId): string {
  return GREMIO_INTENT_MAP[gremio].label;
}

function resolveProvince(provincia: string): { slug: string; name: string; distanceKm: number } {
  const slug = provincia?.toLowerCase().trim() ?? 'madrid';
  const entity = PROVINCIAS_52_GRAPH[slug];
  if (entity) {
    return { slug, name: entity.name, distanceKm: entity.distanceFromHubKm };
  }
  return { slug, name: formatProvinciaName(slug), distanceKm: 0 };
}

function buildProofPhotos(provincia: string, gremio: GremioId): string[] {
  // Deterministic local candidates servidas desde disco (public/assets/shadow_vendors).
  const base = `/assets/shadow_vendors/${provincia}-${gremio}`;
  return [`${base}-1.jpg`, `${base}-2.jpg`, `${base}-3.jpg`, `${base}-4.jpg`];
}

function buildFaqs(gremio: GremioId, provinciaName: string): string[] {
  const label = getGremioLabel(gremio);
  return [
    `¿Cuánto cuesta contratar ${label.toLowerCase()} en ${provinciaName}?`,
    `¿Llegan a tiempo a nuestro municipio desde la base de Méntrida?`,
    `¿Cómo se congela la fecha y se garantiza que el precio no subirá?`,
    `¿Qué equipo de sonido utilizáis para 150 invitados en ${provinciaName}?`,
    `¿Qué ocurre si el evento se alarga o hay una avería en carretera?`
  ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTORES PÚBLICOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function calculateAcousticPower(pax: number): AcousticPowerProfile {
  const safePax = Math.max(1, Math.round(pax));
  const wattsRms = safePax * WATTS_PER_PAX;
  const rawSpl = 62 + 8 * Math.log10(Math.max(0.5, safePax / 100));
  const estimatedSplDb = Number(Math.min(rawSpl, SPL_LIMIT_DB - 0.5).toFixed(1));
  return {
    pax: safePax,
    wattsPerPax: WATTS_PER_PAX,
    wattsRms,
    estimatedSplDb,
    isSplCompliant: estimatedSplDb < SPL_LIMIT_DB,
    recommendedSystem: safePax <= 180 ? 'Bose S1 Pro + Subwoofer' : 'Bose F1 812 Array + Subwoofers'
  };
}

export function calculateMentridaLogistics(provincia: string, eventEndHour?: number): MentridaLogistics {
  const { slug, name, distanceKm } = resolveProvince(provincia);
  const billableKm = Math.max(0, distanceKm - LOGISTICS_FREE_KM);
  const kmFee = Number((billableKm * LOGISTICS_RATE_PER_KM).toFixed(2));
  const isHotelApplied =
    (eventEndHour !== undefined && eventEndHour >= HOTEL_THRESHOLD_HOUR) || distanceKm > HOTEL_THRESHOLD_KM;
  const hotelFee = isHotelApplied ? HOTEL_FEE : 0;
  const totalLogisticsFee = Number((kmFee + hotelFee).toFixed(2));

  return {
    province: slug,
    provinceName: name,
    distanceKm,
    billableKm,
    ratePerKm: LOGISTICS_RATE_PER_KM,
    kmFee,
    hotelFee,
    isHotelApplied,
    totalLogisticsFee
  };
}

function buildHormoziValueStack(gremio: GremioId): HormoziValueItem[] {
  const hero = getGremioLabel(gremio);
  return [
    { label: 'Equipo de sonido Bose F1 812 + Microfonía Shure', value: 1200 },
    { label: `${hero} homologado con repertorio a medida`, value: 850 },
    { label: 'Cobertura de contingencia y relevo Uber (0% cancelaciones)', value: 600 },
    { label: 'Telemetría en directo y contacto de cabina 1-clic', value: 250 }
  ];
}

export function resolveSearchIntent(servicio: string, provincia: string): SearchIntentProfile {
  const gremio = normalizeGremio(servicio);
  const seed = GREMIO_INTENT_MAP[gremio];
  const { slug, name } = resolveProvince(provincia);
  const hormoziValueStack = buildHormoziValueStack(gremio);
  const hormoziValueTotal = hormoziValueStack.reduce((sum, item) => sum + item.value, 0);
  const logistics = calculateMentridaLogistics(slug);

  return {
    gremio,
    gremioLabel: seed.label,
    provincia: slug,
    provinciaName: name,
    leadPainPoints: seed.painPoints,
    dreamOutcome: seed.dreamOutcome,
    hormoziValueStack,
    hormoziValueTotal,
    proofPhotos: buildProofPhotos(slug, gremio),
    acousticSpecs: {
      wattsPerPax: WATTS_PER_PAX,
      baseSystem: 'Bose F1 812 + S1 Pro',
      splLimitDb: SPL_LIMIT_DB
    },
    faqs: buildFaqs(gremio, name),
    basePrice: BASE_SOLIST_PRICE,
    deposit: DEPOSIT_PRICE,
    logistics
  };
}