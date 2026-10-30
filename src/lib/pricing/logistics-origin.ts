/**
 * ════════════════════════════════════════════════════════════════════════════
 * RESOLUTOR CANÓNICO DE ORIGEN LOGÍSTICO — MULTI-ORIGEN S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina inmutable (AGENTS.md §3 · Logística S-Class):
 *   · El Hub Méntrida aplica EXCLUSIVAMENTE a Edwin Agudelo y a empresas con
 *     base en Méntrida.
 *   · Para el resto de la red nacional el kilometraje se calcula por GPS /
 *     dirección fiscal del proveedor hasta el evento del cliente.
 *   · Fuera del Hub Méntrida NO existe franquicia de 50 km: `franchiseKm = 0`.
 *
 * Módulo isomorfo: sin `node:crypto`, sin Prisma, sin red. Importable desde
 * Server Actions, motores de precio y componentes cliente.
 *
 * FAIL-CLOSED: si la base física del sujeto no es resoluble se lanza
 * `LogisticsOriginError`. NUNCA se cae a "Madrid" ni a "Méntrida" por defecto:
 * una base inventada es una factura inventada (error de hasta 600 km).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { LOGISTICA_EUR_PER_KM, LOGISTICA_KM_EXENTOS } from '../constants/ear-os-ssot';
import { geocodeAddressSync, type GeoCoordinates } from '../services/geo/geocoder';

/**
 * Coordenadas canónicas del Hub S-Class (Méntrida, Toledo).
 * Provenance: idénticas a `BASE_HUBS.EDWIN_AGUDELO` de
 * `src/features/search/utils/mentridaDistanceEngine.ts` (única fuente de verdad
 * geográfica del Hub; se replica aquí para no invertir la capa de dependencias
 * `features/ -> lib/`).
 */
export const HUB_MENTRIDA = Object.freeze({
  id: 'hub-mentrida',
  label: 'Hub S-Class Méntrida (Toledo)',
  latitude: 40.2383,
  longitude: -4.1956,
});

/** Franquicia aplicable a la Red Nacional: CERO. El Hub no se hereda. */
export const NETWORK_FRANCHISE_KM = 0;

export type LogisticsOriginKind = 'HUB_MENTRIDA' | 'PROVIDER_GPS' | 'PROVIDER_FISCAL_BASE';

/** Nivel de precisión real con el que se ha resuelto la base física. */
export type LogisticsOriginScope = 'gps' | 'direccion-fiscal' | 'municipio' | 'provincia';

export interface LogisticsOrigin {
  readonly kind: LogisticsOriginKind;
  readonly scope: LogisticsOriginScope;
  readonly label: string;
  readonly franchiseKm: number;
  readonly ratePerKm: number;
  readonly coordinates: { readonly latitude: number; readonly longitude: number };
  /** Trazabilidad para el ledger de evidencia (EP-4). */
  readonly evidence: readonly string[];
}

/**
 * Sujeto facturable. Mapea 1:1 con los campos reales de `providerProfile` y
 * `artistProfile` en Prisma (`city`, `province`, `location`). `coordinates` es
 * opcional: hoy NO existe columna GPS en `providerProfile`; se acepta para que
 * cualquier telemetría futura la inyecte sin refactorizar este módulo.
 */
export interface LogisticsOriginSubject {
  readonly id?: string | null;
  readonly slug?: string | null;
  readonly name?: string | null;
  readonly city?: string | null;
  readonly province?: string | null;
  readonly location?: string | null;
  readonly coordinates?: GeoCoordinates | null;
}

export class LogisticsOriginError extends Error {
  readonly code = 'LOGISTICS_ORIGIN_UNRESOLVED' as const;
  readonly subjectLabel: string;
  readonly attempted: readonly string[];

  constructor(subjectLabel: string, attempted: readonly string[]) {
    super(
      `LOGISTICS_ORIGIN_UNRESOLVED: no se puede facturar kilometraje sin base física verificable para "${subjectLabel || 'sujeto sin identificar'}". Candidatos probados: ${attempted.join(' | ') || 'ninguno'}. Action: completar city/province/location del perfil.`,
    );
    this.name = 'LogisticsOriginError';
    this.subjectLabel = subjectLabel;
    this.attempted = attempted;
  }
}


/** Tokens que identifican al Hub Méntrida (identidad, NO geografía genérica). */
const HUB_IDENTITY_TOKENS: readonly string[] = Object.freeze(['mentrida', 'edwinagudelo']);

/**
 * Valores basura que Prisma devuelve por defecto (`providerProfile.province`
 * nace como "Madrid / Toledo"). Tratarlos como dato real atribuiría Madrid a
 * cualquier proveedor sin configurar: es exactamente la fachada que este
 * resolutor existe para impedir.
 */
const PLACEHOLDER_TOKENS: ReadonlySet<string> = new Set([
  'madridtoledo',
  'na',
  'nd',
  'none',
  'null',
  'sindefinir',
  'sindatos',
  'nodefinida',
  'pendiente',
  'desconocido',
  'xxx',
]);

/** Alias de topónimos que la matriz canónica del geocoder no reconoce. */
const PROVINCE_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  gipuzkoa: 'guipuzcoa',
  bizkaia: 'vizcaya',
  ourense: 'orense',
  castello: 'castellon',
  rioja: 'larioja',
  valenciana: 'valencia',
  baleares: 'baleares',
  alava: 'alava',
});

/** GPS real: exige 3+ decimales para no confundir "Calle 5, 28" con coordenadas. */
const GPS_PATTERN = /(-?\d{1,3}\.\d{3,})\s*,\s*(-?\d{1,3}\.\d{3,})/;

function fold(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function clean(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const folded = fold(trimmed);
  if (folded.length === 0) return null;
  if (PLACEHOLDER_TOKENS.has(folded)) return null;
  return trimmed;
}

function normalizeGps(
  coords: GeoCoordinates | null | undefined,
): { latitude: number; longitude: number } | null {
  if (!coords) return null;
  const latitude = coords.latitude ?? coords.lat;
  const longitude = coords.longitude ?? coords.lng;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}

function parseGps(text: string): { latitude: number; longitude: number } | null {
  const match = text.match(GPS_PATTERN);
  if (!match) return null;
  return normalizeGps({ latitude: Number(match[1]), longitude: Number(match[2]) });
}

/** Geocodificación estricta con alias de topónimo. `null` = no resoluble. */
function geocodeStrict(query: string): { latitude: number; longitude: number } | null {
  const direct = geocodeAddressSync(query);
  if (direct) return direct;
  const folded = fold(query);
  for (const key of Object.keys(PROVINCE_ALIASES)) {
    if (!folded.includes(key)) continue;
    const aliased = geocodeAddressSync(PROVINCE_ALIASES[key]);
    if (aliased) return aliased;
  }
  return null;
}

function subjectLabel(subject: LogisticsOriginSubject): string {
  return clean(subject.name) ?? clean(subject.slug) ?? clean(subject.id) ?? '';
}

/**
 * ¿El sujeto despacha desde el Hub Méntrida?
 * Solo identidad declarada (id/slug/name/city). Se excluyen a propósito
 * `location` y `province`: una calle "Méntrida" en Madrid no convierte a un
 * proveedor en Hub (le regalaría 50 km de franquicia que no le tocan).
 */
export function isMentridaHubSubject(subject: LogisticsOriginSubject): boolean {
  const haystack = [subject.id, subject.slug, subject.name, subject.city].map(fold).join(' ');
  return HUB_IDENTITY_TOKENS.some((token) => haystack.includes(token));
}

function providerOrigin(
  coordinates: { latitude: number; longitude: number },
  label: string,
  kind: LogisticsOriginKind,
  scope: LogisticsOriginScope,
  source: string,
): LogisticsOrigin {
  return {
    kind,
    scope,
    label: `${label || 'Base del proveedor'} · ${source}`,
    franchiseKm: NETWORK_FRANCHISE_KM,
    ratePerKm: LOGISTICA_EUR_PER_KM,
    coordinates,
    evidence: [
      `origin=${kind}`,
      `scope=${scope}`,
      `franchiseKm=${NETWORK_FRANCHISE_KM}`,
      `source=${source}`,
      'rule=AGENTS.md §3: sin franquicia de Méntrida fuera del Hub',
    ],
  };
}

function hubOrigin(label: string): LogisticsOrigin {
  return {
    kind: 'HUB_MENTRIDA',
    scope: 'gps',
    label: label ? `${HUB_MENTRIDA.label} · ${label}` : HUB_MENTRIDA.label,
    franchiseKm: LOGISTICA_KM_EXENTOS,
    ratePerKm: LOGISTICA_EUR_PER_KM,
    coordinates: { latitude: HUB_MENTRIDA.latitude, longitude: HUB_MENTRIDA.longitude },
    evidence: [
      'origin=HUB_MENTRIDA',
      `franchiseKm=${LOGISTICA_KM_EXENTOS}`,
      'source=AGENTS.md §3 Logística S-Class',
    ],
  };
}

/**
 * Resuelve la base física facturable del sujeto.
 * @throws {LogisticsOriginError} si no hay base verificable (fail-closed).
 */
export function resolveLogisticsOrigin(subject: LogisticsOriginSubject): LogisticsOrigin {
  const label = subjectLabel(subject);

  if (isMentridaHubSubject(subject)) return hubOrigin(label);

  const attempted: string[] = [];

  // 1. GPS declarado explícitamente (telemetría / columna futura).
  const declared = normalizeGps(subject.coordinates);
  if (declared) {
    return providerOrigin(
      declared,
      label,
      'PROVIDER_GPS',
      'gps',
      `GPS declarado (${declared.latitude}, ${declared.longitude})`,
    );
  }

  // 2. Coordenadas embebidas en `location` ("40.2383,-4.1956").
  const location = clean(subject.location);
  if (location) {
    attempted.push(`location:${location}`);
    const inline = parseGps(location);
    if (inline) {
      return providerOrigin(
        inline,
        label,
        'PROVIDER_GPS',
        'gps',
        `GPS en location (${inline.latitude}, ${inline.longitude})`,
      );
    }
  }

  // 3. Dirección fiscal -> municipio -> provincia (geocodificación estricta).
  const city = clean(subject.city);
  const province = clean(subject.province);
  const candidates: Array<{ scope: LogisticsOriginScope; query: string }> = [];
  if (location) candidates.push({ scope: 'direccion-fiscal', query: location });
  if (city) candidates.push({ scope: 'municipio', query: province ? `${city}, ${province}` : city });
  if (province) candidates.push({ scope: 'provincia', query: province });

  for (const candidate of candidates) {
    attempted.push(`${candidate.scope}:${candidate.query}`);
    const coords = geocodeStrict(candidate.query);
    if (coords) {
      return providerOrigin(
        coords,
        label,
        'PROVIDER_FISCAL_BASE',
        candidate.scope,
        `${candidate.scope} "${candidate.query}"`,
      );
    }
  }

  throw new LogisticsOriginError(label, attempted);
}

/**
 * Copy comercial canónico del despacho. Una sola fuente para landings, fichas y
 * dossieres: si el motor cambia, el copy cambia con él (AF-4).
 */
export const LOGISTICS_ORIGIN_COPY = Object.freeze({
  hub: `Despacho S-Class desde Hub Méntrida (Toledo) · ${LOGISTICA_KM_EXENTOS} km incluidos`,
  network:
    'Despacho directo desde la base local del proveedor · kilometraje real por GPS o dirección fiscal',
  networkNote:
    'Los proveedores de la Red Nacional no se despachan desde Méntrida: su kilometraje nace de su propia base fiscal y no heredan la franquicia de 50 km del Hub.',
});

