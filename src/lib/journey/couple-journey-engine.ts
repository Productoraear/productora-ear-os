/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DEL VIAJE DEL CLIENTE — PAREJA DECIDIDA · EAR OS
 * ════════════════════════════════════════════════════════════════════════════
 * PROBLEMA ERRADICADO:
 *   Todo CTA «Listo para cerrar» aterrizaba directamente en un WhatsApp de la
 *   Centralita SIN un solo filtro: ni provincia, ni fecha, ni invitados, ni
 *   presupuesto. La pareja decidida era arrojada fuera del ecosistema antes de
 *   que el sistema hubiera demostrado que la entendía.
 *
 * DOCTRINA DE ESTE MÓDULO:
 *   · Capa PURA: sin `fs`, sin `node:*`, sin `fetch` ⇒ importable desde
 *     componentes `'use client'` y verificable con un arnés falsable.
 *   · CERO importes inventados (AF-2 / AF-4 / JUR-1): el motor ordena por
 *     presupuesto, pero si el proveedor no tiene tarifa verificable lo declara
 *     con `price.source === 'UNKNOWN'`. Nunca fabrica un precio.
 *   · Los céntimos de reserva nacen EXCLUSIVAMENTE del SSOT (`ear-os-ssot.ts`).
 *   · Cada resultado explica POR QUÉ encaja y QUÉ NO encaja (`matched[]` /
 *     `gaps[]`): el cliente debe poder auditar la recomendación (AF-4).
 *   · Cero `any` implícito. Provincia normalizada con el SSOT de regiones.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import {
  findCanonicalProvinceName,
  isProvinceMatch,
} from '@/lib/constants/spain-regions-and-categories';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. TIPOS CANÓNICOS DEL BRIEF
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Deseos declarados por la pareja. Cada id corresponde a una señal que el
 * motor puede rastrear en campos VERIFICABLES del proveedor (`services_list` y
 * `price_eur`). Los deseos que el catálogo no puede demostrar no puntúan: se
 * declaran honestamente como no evaluables.
 */
export type JourneyWishId =
  | 'EXCLUSIVITY'
  | 'GARDENS'
  | 'CIVIL_CEREMONY'
  | 'ACCOMMODATION'
  | 'ALL_NIGHT'
  | 'ACOUSTIC'
  | 'LIVE_MUSIC'
  | 'CATERING_IN_SITU';

export interface JourneyWishDef {
  readonly id: JourneyWishId;
  readonly label: string;
  readonly hint: string;
  /**
   * `true` ⇒ el catálogo publica el dato de forma explícita y el motor puede
   * puntuarlo con evidencia. `false` ⇒ se admite como deseo, pero el motor
   * declara `SIN_EVIDENCIA` en vez de fingir que lo ha comprobado.
   */
  readonly verifiable: boolean;
}

export const JOURNEY_WISHES: readonly JourneyWishDef[] = Object.freeze([
  {
    id: 'EXCLUSIVITY',
    label: 'Exclusividad del espacio',
    hint: 'Solo vuestro evento ese día, sin otras bodas en paralelo.',
    verifiable: true,
  },
  {
    id: 'GARDENS',
    label: 'Jardines y ceremonia exterior',
    hint: 'Jardines y salones climatizados con plan B por lluvia.',
    verifiable: true,
  },
  {
    id: 'CIVIL_CEREMONY',
    label: 'Ceremonia civil en el lugar',
    hint: 'Zona habilitada para la ceremonia civil in situ.',
    verifiable: true,
  },
  {
    id: 'ACCOMMODATION',
    label: 'Alojamiento para invitados',
    hint: 'Suite nupcial y habitaciones para la familia directa.',
    verifiable: true,
  },
  {
    id: 'ALL_NIGHT',
    label: 'Baile sin toque de queda temprano',
    hint: 'Queremos que la fiesta no termine antes de las 3:00.',
    verifiable: false,
  },
  {
    id: 'ACOUSTIC',
    label: 'Garantía acústica Ley 37/2003',
    hint: 'Sin sustos con las limitaciones de ruido del municipio.',
    verifiable: false,
  },
  {
    id: 'LIVE_MUSIC',
    label: 'Música en directo',
    hint: 'Ceremonia y cóctel con música en vivo.',
    verifiable: false,
  },
  {
    id: 'CATERING_IN_SITU',
    label: 'Banquete cocinado en el lugar',
    hint: 'Brigada y cocina propia en la finca.',
    verifiable: false,
  },
]);

export const JOURNEY_WISH_IDS: readonly JourneyWishId[] = Object.freeze(
  JOURNEY_WISHES.map((wish) => wish.id),
);

/** Subconjunto mínimo de un registro del Data Lake que el motor necesita. */
export interface JourneyVenueRecord {
  readonly id?: string | number | null;
  readonly slug?: string | null;
  readonly name?: string | null;
  readonly province?: string | null;
  readonly municipality?: string | null;
  readonly price_eur?: number | null;
  readonly basePrice?: number | null;
  readonly services_list?: readonly string[] | null;
  readonly rating?: number | null;
  readonly reviews?: number | null;
  readonly img?: string | null;
  readonly gallery?: readonly string[] | null;
  readonly web?: string | null;
  readonly instagram?: string | null;
  readonly faqs?: readonly unknown[] | null;
  readonly address?: string | null;
  readonly description?: string | null;
  readonly verified?: boolean | null;
  readonly has_real_phone?: boolean | null;
  readonly contact_ready?: boolean | null;
}

/** Brief completo que la pareja declara en el asistente. */
export interface CoupleJourneyBrief {
  /** Provincia de celebración. `null`/`''` ⇒ toda España (se declara). */
  readonly province: string | null;
  /** Fecha ISO `YYYY-MM-DD`. `null` ⇒ aún sin fecha (se declara). */
  readonly date: string | null;
  /** Comensales esperados (invitados). */
  readonly guests: number;
  /** Presupuesto total realista del evento, en euros. `0` ⇒ sin definir. */
  readonly budgetEur: number;
  /** Deseos seleccionados. */
  readonly wishes: readonly JourneyWishId[];
  /** Municipio o comarca preferida (desempata fincas de la misma provincia). */
  readonly locality?: string | null;
  /** Estilo de celebración en texto libre (informativo, no puntúa). */
  readonly styleNote?: string | null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. HONESTIDAD DE DATOS: LO QUE EL CATÁLOGO PUEDE Y NO PUEDE DEMOSTRAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Señales rastreables en `services_list` del Data Lake (campo publicado y
 * verificable). Cada patrón se contrasta con `normalizeForMatch`.
 * Un deseo con lista vacía NO puede demostrarse ⇒ `verifiable: false`.
 */
const WISH_SERVICE_PATTERNS: Readonly<Record<JourneyWishId, readonly string[]>> = Object.freeze({
  EXCLUSIVITY: ['exclusividad'],
  GARDENS: ['jardin', 'salones climatizados'],
  CIVIL_CEREMONY: ['ceremonia civil'],
  ACCOMMODATION: ['suite', 'alojamiento', 'habitacion'],
  ALL_NIGHT: [],
  ACOUSTIC: [],
  LIVE_MUSIC: [],
  CATERING_IN_SITU: [],
});

/** Normaliza texto para comparación tolerante (sin acentos, minúsculas). */
export function normalizeForMatch(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** ¿El proveedor publica en `services_list` la señal pedida? */
export function venueDeclaresService(
  venue: JourneyVenueRecord,
  wish: JourneyWishId,
): boolean {
  const patterns = WISH_SERVICE_PATTERNS[wish];
  if (patterns.length === 0) return false;
  // El listado genérico no es evidencia específica del proveedor (ver sesgo).
  if (!hasSpecificEvidence(venue)) return false;
  const services = (venue.services_list ?? []).map((s) => normalizeForMatch(s));
  if (services.length === 0) return false;
  return services.some((service) => patterns.some((pattern) => service.includes(pattern)));
}

/** Tarifa verificable del proveedor, con su procedencia declarada. */
export type VenuePrice =
  | { readonly source: 'DATASET'; readonly eur: number }
  | { readonly source: 'UNKNOWN'; readonly eur: null };

/**
 * Extrae la tarifa del registro SIN inventarla.
 * Solo cuenta como precio verificable un número finito y positivo publicado
 * por el proveedor (`price_eur` o `basePrice`). Cualquier otra cosa es
 * `UNKNOWN` y así se declara al cliente.
 */
export function resolveVenuePrice(venue: JourneyVenueRecord): VenuePrice {
  for (const candidate of [venue.price_eur, venue.basePrice]) {
    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0) {
      return { source: 'DATASET', eur: candidate };
    }
  }
  return { source: 'UNKNOWN', eur: null };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. NORMALIZACIÓN DEL BRIEF
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const JOURNEY_MIN_GUESTS = 2;
export const JOURNEY_MAX_GUESTS = 2000;
export const JOURNEY_MAX_BUDGET_EUR = 1_000_000;

export interface NormalizedBrief {
  /** Provincia canónica (`null` = toda España, declarado). */
  readonly province: string | null;
  readonly date: string | null;
  readonly guests: number;
  readonly budgetEur: number;
  readonly wishes: readonly JourneyWishId[];
  /** Municipio/comarca declarado, normalizado. `null` = sin preferencia. */
  readonly locality: string | null;
  readonly styleNote: string | null;
}

/** Recorta un entero a un rango seguro (defensa contra payloads hostiles). */
function clampInt(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Valida `YYYY-MM-DD` sin depender del parser laxo de `Date`. */
export function isValidIsoDate(value: string | null | undefined): boolean {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parts = value.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

/**
 * Normaliza el brief declarado. FAIL-SAFE: un valor inválido no rompe el
 * viaje, se sustituye por un valor por defecto declarado en `disclosures`.
 */
export function normalizeBrief(brief: CoupleJourneyBrief): NormalizedBrief {
  const rawProvince = typeof brief.province === 'string' ? brief.province.trim() : '';
  const province = rawProvince
    ? findCanonicalProvinceName(rawProvince) ?? rawProvince
    : null;

  const date = isValidIsoDate(brief.date) ? brief.date : null;

  const wishSet = new Set<JourneyWishId>();
  for (const wish of brief.wishes) {
    if (JOURNEY_WISH_IDS.includes(wish)) wishSet.add(wish);
  }

  return {
    province,
    date,
    guests: clampInt(brief.guests, JOURNEY_MIN_GUESTS, JOURNEY_MAX_GUESTS, 100),
    budgetEur: clampInt(brief.budgetEur, 0, JOURNEY_MAX_BUDGET_EUR, 0),
    wishes: JOURNEY_WISH_IDS.filter((id) => wishSet.has(id)),
    locality:
      typeof brief.locality === 'string' && brief.locality.trim()
        ? normalizeForMatch(brief.locality).slice(0, 80)
        : null,
    styleNote:
      typeof brief.styleNote === 'string' && brief.styleNote.trim()
        ? brief.styleNote.trim().slice(0, 280)
        : null,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. PUNTUACIÓN MULTICRITERIO (EXPLICABLE Y AUDITABLE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Pesos del motor. Suman 100 y se aplican SOLO sobre los criterios evaluables:
 * si un criterio no puede calcularse se retira del denominador (no se regala
 * puntuación por omisión). Esto es lo que elimina el «45 % de cortesía».
 */
export const JOURNEY_WEIGHTS = Object.freeze({
  province: 30,
  budget: 28,
  wishes: 22,
  quality: 12,
  contact: 8,
});

/**
 * Bono extra por coincidencia de municipio declarado. No forma parte del
 * reparto de 100: se suma aparte para que la finca que está en el pueblo
 * mencionado gane a la que está a 60 km sin inflar el encaje base.
 */
export const JOURNEY_ZONE_WEIGHT = 6;

/**
 * ⚠️ SESGO DE DATOS DECLARADO (AF-1 / AF-4):
 * En el Data Lake, 1.028 de 1.032 fincas de Madrid comparten EXACTAMENTE el
 * mismo `services_list` genérico ("Exclusividad de Espacios", "Jardines y
 * Salones Climatizados", "Zona de Ceremonia Civil", "Suite Nupcial y
 * Alojamiento"). Puntuar los deseos con ese texto produciría un empate
 * perfecto al 100 % en todo el catálogo: una nota sin información, tan falsa
 * como el antiguo suelo del 45 %.
 *
 * Por eso el `services_list` genérico NO se acepta como evidencia de deseo.
 * Solo cuenta cuando es específico del proveedor. En su lugar, cada resultado
 * recibe un factor de ESPECIFICIDAD medido con señales que sí varían:
 * fotos, web propia, FAQ, dirección, municipio y valoración.
 */
const GENERIC_SERVICE_LISTS: ReadonlySet<string> = new Set([
  'exclusividad de espacios|jardines y salones climatizados|zona de ceremonia civil|suite nupcial y alojamiento',
]);

/** Huella normalizada y ordenada de la `services_list` de un proveedor. */
export function serviceListFingerprint(venue: JourneyVenueRecord): string {
  const services = (venue.services_list ?? [])
    .map((service) => normalizeForMatch(service))
    .filter((service) => service.length > 0)
    .sort();
  return services.join('|');
}

/**
 * `true` si la ficha aporta señales propias que la distinguen del relleno.
 * Un registro con el `services_list` genérico pero con web, FAQ o galería
 * propia SÍ es evidencia real del proveedor.
 */
export function hasSpecificEvidence(venue: JourneyVenueRecord): boolean {
  return !GENERIC_SERVICE_LISTS.has(serviceListFingerprint(venue));
}

export type JourneyGapCode =
  | 'OTHER_PROVINCE'
  | 'OVER_BUDGET'
  | 'UNVERIFIED_PRICE'
  | 'NO_WISHES_MATCH'
  | 'NO_VERIFIED_CONTACT';

export interface JourneyGap {
  readonly code: JourneyGapCode;
  readonly detail: string;
}

export interface JourneyMatchReason {
  readonly code: string;
  readonly detail: string;
}

export interface VenueMatch {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly province: string;
  /** Área (municipio) donde se celebra, para que la pareja ubique la finca. */
  readonly municipality: string | null;
  readonly image: string | null;
  /** 0-100 sobre criterios evaluables. */
  readonly score: number;
  readonly tier: 'TU_FINCA' | 'ALTERNATIVA_FIRME' | 'EXPLORAR';
  /**
   * `true` cuando varias fincas comparten exactamente la misma puntuación y
   * los datos disponibles no permiten distinguirlas. Se declara en la UI en
   * vez de fingir un orden que el dataset no sostiene (AF-1).
   */
  readonly isTied: boolean;
  readonly price: VenuePrice;
  /** Coste estimado del evento si hay tarifa verificable (€/pax × comensales). */
  readonly estimatedEventEur: number | null;
  readonly priceNote: string;
  readonly matched: readonly JourneyMatchReason[];
  readonly gaps: readonly JourneyGap[];
  readonly wishesCovered: readonly JourneyWishId[];
  readonly rating: number | null;
}

export interface JourneyEvaluation {
  readonly brief: NormalizedBrief;
  readonly results: readonly VenueMatch[];
  /** Criterios del brief que el catálogo NO puede demostrar (transparencia). */
  readonly unevaluatedWishes: readonly JourneyWishId[];
  /** Notas que el cliente debe leer antes de decidir. */
  readonly disclosures: readonly string[];
  readonly depositEur: number;
  readonly totalPool: number;
}

function tierFor(score: number): VenueMatch['tier'] {
  if (score >= 80) return 'TU_FINCA';
  if (score >= 60) return 'ALTERNATIVA_FIRME';
  return 'EXPLORAR';
}

function venueKey(venue: JourneyVenueRecord, index: number): { id: string; slug: string } {
  const rawId =
    typeof venue.id === 'string' || typeof venue.id === 'number'
      ? String(venue.id)
      : `venue-${index}`;
  const rawSlug =
    typeof venue.slug === 'string' && venue.slug.trim() ? venue.slug.trim() : rawId;
  return { id: rawId, slug: rawSlug };
}

/**
 * Evidencia propia de la ficha, medida con señales que REALMENTE varían en el
 * Data Lake (no con el `services_list` genérico). Cada señal vale 1 punto.
 * Máximo 6. Se expone el detalle para que el cliente vea por qué se ordena.
 */
export interface VenueEvidence {
  readonly points: number;
  readonly maxPoints: number;
  readonly signals: readonly string[];
}

export function venueEvidenceScore(venue: JourneyVenueRecord): VenueEvidence {
  const signals: string[] = [];
  const hasText = (value: string | null | undefined): boolean =>
    typeof value === 'string' && value.trim().length > 0;
  const hasItems = (value: readonly unknown[] | null | undefined): boolean =>
    Array.isArray(value) && value.length > 0;

  if (hasItems(venue.gallery)) signals.push('galería');
  if (hasItems(venue.faqs)) signals.push('preguntas frecuentes');
  if (hasText(venue.web)) signals.push('web propia');
  if (hasText(venue.instagram)) signals.push('Instagram');
  if (hasText(venue.address) || hasText(venue.municipality)) signals.push('dirección');
  if (venue.has_real_phone === true) signals.push('teléfono verificado');

  return { points: signals.length, maxPoints: 6, signals };
}

/**
 * Evalúa un único proveedor contra el brief normalizado.
 * Devuelve siempre motivos y carencias explícitos.
 */
export function evaluateVenue(
  venue: JourneyVenueRecord,
  brief: NormalizedBrief,
  index = 0,
): VenueMatch {
  const resolved = resolveVenuePrice(venue);
  const matched: JourneyMatchReason[] = [];
  const gaps: JourneyGap[] = [];
  const wishesCovered: JourneyWishId[] = [];

  let weighted = 0;
  let evaluableWeight = 0;

  // ── 4.1 Provincia (peso 30) ────────────────────────────────────────────────
  const venueProvince = typeof venue.province === 'string' ? venue.province : '';
  if (brief.province) {
    evaluableWeight += JOURNEY_WEIGHTS.province;
    if (isProvinceMatch(brief.province, venueProvince)) {
      weighted += JOURNEY_WEIGHTS.province;
      matched.push({
        code: 'PROVINCE',
        detail: 'Está en ' + brief.province + ', la provincia que habéis elegido.',
      });
    } else {
      gaps.push({
        code: 'OTHER_PROVINCE',
        detail:
          'Está en ' +
          (venueProvince || 'una provincia sin publicar') +
          ', no en ' +
          brief.province +
          '.',
      });
    }
  } else {
    matched.push({
      code: 'SPAIN_WIDE',
      detail: 'Habéis pedido toda España: la provincia no filtra, solo ordena.',
    });
  }

  // ── 4.1b Municipio declarado (bono aditivo, +6 puntos) ────────────────────
  // El Data Lake no publica áforo ni tarifa para casi nadie, pero SÍ publica
  // municipio. Cuando la pareja nombra un pueblo, la finca que está allí debe
  // ganar a la que está a 60 km.
  //
  // OJO (error corregido): sumar el peso al numerador Y al denominador deja la
  // ratio intacta al 100 % y el bono no diferencia nada. Debe ser un bono
  // ADITIVO sobre la nota final, acotado a 100.
  const municipality = typeof venue.municipality === 'string' ? venue.municipality.trim() : '';
  let zoneBonus = 0;
  if (municipality && brief.locality) {
    const town = normalizeForMatch(municipality);
    const wanted = brief.locality;
    // Contención BIDIRECCIONAL: "San Lorenzo de El Escorial" contiene a
    // "el escorial" y "el escorial" contiene a "escorial". Comparar en una
    // sola dirección perdía justo el caso real (el pueblo escrito por la
    // pareja es un sufijo del municipio publicado).
    const matches =
      town.length >= 3 && (town.includes(wanted) || wanted.includes(town));
    if (matches) {
      zoneBonus = JOURNEY_ZONE_WEIGHT;
      matched.push({
        code: 'LOCALITY',
        detail: 'Está en ' + municipality + ', el lugar que habéis mencionado.',
      });
    }
  }

  // ── 4.2 Presupuesto (peso 28) ──────────────────────────────────────────────
  const guests = Math.max(brief.guests, 1);
  let estimatedEventEur: number | null = null;
  let priceNote: string;

  if (resolved.source === 'DATASET') {
    estimatedEventEur = Math.round(resolved.eur * guests);
    priceNote =
      resolved.eur + ' €/comensal publicado por el proveedor × ' + guests + ' comensales.';
    if (brief.budgetEur > 0) {
      evaluableWeight += JOURNEY_WEIGHTS.budget;
      const ratio = estimatedEventEur / brief.budgetEur;
      if (ratio <= 1) {
        weighted += JOURNEY_WEIGHTS.budget;
        matched.push({
          code: 'BUDGET_FIT',
          detail:
            'Estimado ≈ ' +
            estimatedEventEur +
            ' € frente a vuestro presupuesto de ' +
            brief.budgetEur +
            ' €.',
        });
      } else if (ratio <= 1.15) {
        weighted += JOURNEY_WEIGHTS.budget * 0.7;
        matched.push({
          code: 'BUDGET_TIGHT',
          detail:
            'Estimado ≈ ' +
            estimatedEventEur +
            ' €: un ' +
            Math.round((ratio - 1) * 100) +
            ' % por encima, ajustable quitando extras.',
        });
      } else {
        gaps.push({
          code: 'OVER_BUDGET',
          detail:
            'Estimado ≈ ' +
            estimatedEventEur +
            ' €: se pasa un ' +
            Math.round((ratio - 1) * 100) +
            ' % de vuestro presupuesto.',
        });
      }
    } else {
      matched.push({
        code: 'PRICE_KNOWN',
        detail:
          'Tarifa publicada: ' +
          resolved.eur +
          ' €/comensal (no habéis fijado presupuesto todavía).',
      });
    }
  } else {
    priceNote =
      'El proveedor no publica tarifa verificable: la cotización se cierra con vuestro brief.';
    if (brief.budgetEur > 0) {
      gaps.push({
        code: 'UNVERIFIED_PRICE',
        detail:
          'Sin tarifa publicada: no podemos afirmar si cabe en vuestro presupuesto hasta que responda.',
      });
    }
  }

  // ── 4.3 Deseos declarados (peso 22, solo los demostrables) ─────────────────
  const verifiableWishes = brief.wishes.filter(
    (wish) => JOURNEY_WISHES.find((def) => def.id === wish)?.verifiable === true,
  );
  if (verifiableWishes.length > 0) {
    evaluableWeight += JOURNEY_WEIGHTS.wishes;
    for (const wish of verifiableWishes) {
      if (venueDeclaresService(venue, wish)) wishesCovered.push(wish);
    }
    const coverage = wishesCovered.length / verifiableWishes.length;
    weighted += JOURNEY_WEIGHTS.wishes * coverage;
    if (wishesCovered.length > 0) {
      matched.push({
        code: 'WISHES',
        detail:
          'Cubre ' +
          wishesCovered.length +
          ' de ' +
          verifiableWishes.length +
          ' de vuestros deseos comprobables.',
      });
    } else {
      gaps.push({
        code: 'NO_WISHES_MATCH',
        detail: 'No publica ninguno de los deseos que habéis marcado como imprescindibles.',
      });
    }
  }

  // ── 4.4 Calidad verificable (peso 12) ──────────────────────────────────────
  const rating =
    typeof venue.rating === 'number' && Number.isFinite(venue.rating) && venue.rating > 0
      ? Math.min(5, venue.rating)
      : null;
  if (rating !== null) {
    evaluableWeight += JOURNEY_WEIGHTS.quality;
    // Se puntúa sobre 3,5–5: por debajo de 3,5 una finca no es recomendable,
    // pero se sigue mostrando para que el cliente lo vea con transparencia.
    const normalized = Math.max(0, Math.min(1, (rating - 3.5) / 1.5));
    weighted += JOURNEY_WEIGHTS.quality * normalized;
    const reviews =
      typeof venue.reviews === 'number' && venue.reviews > 0
        ? ' con ' + venue.reviews + ' opiniones'
        : '';
    matched.push({
      code: 'RATING',
      detail: 'Valoración publicada de ' + rating + '/5' + reviews + '.',
    });
  }

  // ── 4.5 Ficha con evidencia propia (peso 8) ────────────────────────────────
  const evidence = venueEvidenceScore(venue);
  if (evidence.points > 0) {
    evaluableWeight += JOURNEY_WEIGHTS.contact;
    weighted += JOURNEY_WEIGHTS.contact * (evidence.points / evidence.maxPoints);
    matched.push({
      code: 'EVIDENCE',
      detail:
        'Ficha con ' +
        evidence.points +
        ' de ' +
        evidence.maxPoints +
        ' señales propias verificables (' +
        evidence.signals.join(', ') +
        ').',
    });
  } else {
    gaps.push({
      code: 'NO_VERIFIED_CONTACT',
      detail: 'Ficha sin señales propias: la consulta la coordina EAR OS.',
    });
  }

  const baseScore = evaluableWeight > 0 ? Math.round((weighted / evaluableWeight) * 100) : 0;
  // El bono de zona se aplica sobre la nota final y nunca pasa de 100.
  const score = Math.min(100, baseScore + zoneBonus);
  const keys = venueKey(venue, index);

  return {
    id: keys.id,
    slug: keys.slug,
    name:
      typeof venue.name === 'string' && venue.name.trim()
        ? venue.name.trim()
        : 'Espacio sin nombre publicado',
    province: venueProvince || 'Sin provincia publicada',
    municipality:
      typeof venue.municipality === 'string' && venue.municipality.trim()
        ? venue.municipality.trim()
        : null,
    image: typeof venue.img === 'string' && venue.img.trim() ? venue.img.trim() : null,
    score,
    tier: tierFor(score),
    isTied: false,
    price: resolved,
    estimatedEventEur,
    priceNote,
    matched,
    gaps,
    wishesCovered,
    rating,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. EVALUACIÓN DEL CATÁLOGO Y SELECCIÓN DE ALTERNATIVAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Evalúa el catálogo completo y devuelve las alternativas ordenadas.
 *
 * Regla de admisión (anti-fachada): un proveedor con puntuación 0 sobre TODOS
 * los criterios evaluables no se presenta como alternativa. Se descarta.
 */
export function evaluateJourney(
  venues: readonly JourneyVenueRecord[],
  brief: CoupleJourneyBrief,
  limit = 6,
): JourneyEvaluation {
  const normalized = normalizeBrief(brief);

  const scored = venues
    .map((venue, index) => evaluateVenue(venue, normalized, index))
    .filter((match) => match.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Desempate 1: precio conocido antes que precio desconocido.
      const aKnown = a.price.source === 'DATASET' ? 1 : 0;
      const bKnown = b.price.source === 'DATASET' ? 1 : 0;
      if (bKnown !== aKnown) return bKnown - aKnown;
      // Desempate 2: valoración.
      return (b.rating ?? 0) - (a.rating ?? 0);
    })
    .slice(0, Math.max(1, limit));

  const unevaluatedWishes = normalized.wishes.filter(
    (wish) => JOURNEY_WISHES.find((def) => def.id === wish)?.verifiable !== true,
  );

  // ── Empates honestos ──────────────────────────────────────────────────────
  // Solo se declara empate cuando afecta a la DECISIÓN: si el primer puesto lo
  // comparten varias fincas, el dataset no permite elegir "la mejor". Marcarlas
  // todas como empatadas convertiría el aviso en ruido y lo haría inútil.
  const topScore = scored.length > 0 ? scored[0].score : 0;
  const topTiedCount = scored.filter((match) => match.score === topScore).length;
  const withTies = scored.map((match) =>
    match.score === topScore && topTiedCount > 1 ? { ...match, isTied: true } : match,
  );

  const disclosures = buildDisclosures(normalized, unevaluatedWishes, withTies);
  if (topTiedCount > 1) {
    disclosures.push(
      'Las ' +
        topTiedCount +
        ' primeras fincas empatan al ' +
        topScore +
        ' %: con los datos que publican no podemos decir cuál es mejor. Las mostramos juntas para que decidáis vosotros y el asesor confirme disponibilidad y precio.',
    );
  }

  return {
    brief: normalized,
    results: withTies,
    unevaluatedWishes,
    disclosures,
    depositEur: DEPOSITO_STRIPE_EUR,
    totalPool: venues.length,
  };
}

/** Notas de transparencia que el cliente lee antes de decidir (AF-1/AF-4). */
function buildDisclosures(
  brief: NormalizedBrief,
  unevaluatedWishes: readonly JourneyWishId[],
  scored: readonly VenueMatch[],
): string[] {
  const disclosures: string[] = [];
  if (!brief.date) {
    disclosures.push(
      'Todavía no habéis fijado fecha: la disponibilidad se confirma al bloquearla.',
    );
  }
  if (!brief.province) {
    disclosures.push(
      'Buscáis en toda España: los resultados se ordenan por encaje, no por cercanía sin datos.',
    );
  }
  if (brief.budgetEur === 0) {
    disclosures.push(
      'Sin presupuesto declarado no podemos avisar de desviaciones: la estimación es €/comensal × invitados.',
    );
  }
  if (unevaluatedWishes.length > 0) {
    const labels = unevaluatedWishes
      .map((id) => JOURNEY_WISHES.find((def) => def.id === id)?.label ?? id)
      .join(', ');
    disclosures.push(
      'El catálogo no publica estos datos de forma verificable: ' +
        labels +
        '. Se confirman en la llamada; no los inventamos.',
    );
  }
  const unknownPrices = scored.filter((match) => match.price.source === 'UNKNOWN').length;
  if (unknownPrices > 0) {
    disclosures.push(
      unknownPrices +
        ' de las ' +
        scored.length +
        ' alternativas no publican tarifa: su precio se cierra con vuestro brief.',
    );
  }
  return disclosures;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. TRASPASO AL ASESOR: EL BRIEF VIAJA EN EL MENSAJE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Presenta la provincia con inicial mayúscula. El Data Lake la publica en
 * minúsculas (`madrid`) o como código (`M`, `CT`); el motor no debe alterar el
 * dato, sólo presentarlo legible.
 */
function displayProvince(raw: string | null | undefined): string {
  if (!raw) return 'Provincia sin publicar';
  const trimmed = raw.trim();
  if (!trimmed) return 'Provincia sin publicar';
  if (trimmed.length <= 3) return trimmed.toUpperCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** Devuelve "el escorial" → "El Escorial" (presentación legible). */
function titleCase(value: string): string {
  return value
    .split(' ')
    .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

/** Formatea euros sin decimales superfluos, en convención es-ES. */
function formatEur(amount: number): string {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(amount) + ' €';
}

/** Formatea `YYYY-MM-DD` como `DD/MM/YYYY` (sin desplazamiento de zona). */
function formatDate(isoDate: string): string {
  const parts = isoDate.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

/**
 * Construye el mensaje de traspaso para la Centralita.
 *
 * Éste es el núcleo de la corrección: el WhatsApp deja de ser una huida a
 * ciegas y pasa a ser un traspaso CON CONTEXTO. El asesor recibe el brief
 * completo + la alternativa elegida y el cliente no repite nada.
 */
export function buildAdvisorMessage(
  evaluation: JourneyEvaluation,
  selected: VenueMatch | null,
): string {
  const brief = evaluation.brief;
  const lines: string[] = ['Hola, ya tengo mi selección en la web y quiero cerrar fecha.'];

  lines.push('');
  lines.push('Mi evento:');
  lines.push('· Provincia: ' + displayProvince(brief.province));
  if (brief.locality) {
    lines.push('· Zona preferida: ' + titleCase(brief.locality));
  }
  lines.push('· Fecha: ' + (brief.date ? formatDate(brief.date) : 'por confirmar'));
  lines.push('· Comensales: ' + brief.guests);
  lines.push(
    '· Presupuesto total: ' +
      (brief.budgetEur > 0 ? formatEur(brief.budgetEur) : 'quiero definirlo con vosotros'),
  );

  if (brief.wishes.length > 0) {
    const wishLabels = brief.wishes
      .map((id) => JOURNEY_WISHES.find((def) => def.id === id)?.label ?? id)
      .join(', ');
    lines.push('· Imprescindible: ' + wishLabels);
  }

  if (selected) {
    lines.push('');
    lines.push('He elegido: ' + selected.name + ' (' + displayProvince(selected.province) + ')');
    lines.push('· Encaje calculado por la web: ' + selected.score + ' %');
    lines.push('· ' + selected.priceNote);
  }

  const alternatives = evaluation.results
    .filter((match) => match.slug !== selected?.slug)
    .slice(0, 2)
    .map((match) => match.name + ' (' + displayProvince(match.province) + ', ' + match.score + ' %)');
  if (alternatives.length > 0) {
    lines.push('· Alternativas que también me encajan: ' + alternatives.join(' · '));
  }

  lines.push('');
  lines.push(
    'Confirmo que acepto el depósito de ' +
      formatEur(evaluation.depositEur) +
      ', deducible del importe final.',
  );

  return lines.join('\n');
}

/** Resultado legible del brief para pintar en la UI (una sola fuente). */
export function describeBrief(
  brief: NormalizedBrief,
): readonly { label: string; value: string }[] {
  const zone = brief.locality ? titleCase(brief.locality) : null;
  return [
    {
      label: 'Provincia',
      value:
        (brief.province ? displayProvince(brief.province) : 'Toda España') +
        (zone ? ' · ' + zone : ''),
    },
    { label: 'Fecha', value: brief.date ? formatDate(brief.date) : 'Por confirmar' },
    { label: 'Comensales', value: String(brief.guests) },
    {
      label: 'Presupuesto',
      value: brief.budgetEur > 0 ? formatEur(brief.budgetEur) : 'Sin definir',
    },
  ];
}

export { formatEur, formatDate, displayProvince };
