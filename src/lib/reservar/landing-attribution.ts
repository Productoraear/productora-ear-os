/**
 * ════════════════════════════════════════════════════════════════════════════
 * ATRIBUCIÓN DE LANDING → CONFIGURADOR → STRIPE (CADENA DE PROCEDENCIA)
 * ════════════════════════════════════════════════════════════════════════════
 * Cierra el agujero P1 detectado en auditoría: las 488 landings enviaban
 * `?formato=` y `?landing=` al embudo de dinero y `/reservar/solista` los
 * DESCARTABA. Resultado: el depósito se cobraba, pero nadie sabía desde qué URL
 * había llegado el cliente y el formato elegido no se preseleccionaba.
 *
 * Este módulo es PURO y CLIENT-SAFE (sólo importa catálogos puros):
 *   · sanea slugs/tokens con allow-list estricta (OWASP ASVS L3, anti-XSS),
 *   · resuelve el clúster de origen (cerrado, nunca texto libre),
 *   · homologa el formato SSOT de la landing con el perfil del configurador.
 *
 * Degradación garantizada: entrada inválida → `EMPTY_LANDING_ATTRIBUTION`.
 * Jamás lanza, jamás bloquea una venta por un parámetro sucio.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { getMariachiFormat, type MariachiFormatId } from '../mariachi/mariachi-formats';
import { ARTIST_FORMAT_BY_SSOT_ID, getArtistFormat } from './solista-catalog';

/** Clústeres con malla de landings activa. Lista cerrada: no admite texto libre. */
export const LANDING_CLUSTERS = [
  'centralita-mariachis',
  'productora-ear',
  'otzarreta',
] as const;

export type LandingCluster = (typeof LANDING_CLUSTERS)[number];

/** Tráfico sin clúster (orgánico directo, WhatsApp, campañas). */
export const DIRECT_CLUSTER = 'directo' as const;

export type AttributionCluster = LandingCluster | typeof DIRECT_CLUSTER;

export interface LandingAttribution {
  readonly cluster: AttributionCluster;
  readonly landingSlug: string | null;
  readonly formatId: MariachiFormatId | null;
  readonly artistProfileId: string | null;
}

/** Atribución neutra: tráfico directo sin procedencia declarada. */
export const EMPTY_LANDING_ATTRIBUTION: LandingAttribution = Object.freeze({
  cluster: DIRECT_CLUSTER,
  landingSlug: null,
  formatId: null,
  artistProfileId: null,
});

/** Límites de longitud: el slug real más largo del catálogo no llega a 90. */
const MAX_SLUG_CHARS = 120;
/** Allow-list de slug: minúsculas, dígitos y guiones simples (sin `--`, sin `/`). */
const LANDING_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Elimina caracteres de control (incluye NUL y DEL) antes de cualquier
 * comparación o persistencia. Misma técnica que el saneador del endpoint de
 * depósito: iteración por code point, sin regex costosa.
 */
function stripControlChars(value: string): string {
  let clean = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    clean += code < 32 || code === 127 ? '' : char;
  }
  return clean;
}

/**
 * Valida un slug de landing. Devuelve `null` ante cualquier anomalía
 * (mayúsculas, espacios, rutas, HTML, longitud excesiva).
 */
export function sanitizeLandingSlug(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const candidate = stripControlChars(value).trim().toLowerCase();
  if (candidate.length < 3 || candidate.length > MAX_SLUG_CHARS) return null;
  return LANDING_SLUG_PATTERN.test(candidate) ? candidate : null;
}

/** Type-guard de clúster: sólo los tres clústeres sancionados. */
export function isLandingCluster(value: unknown): value is LandingCluster {
  return (
    typeof value === 'string' &&
    (LANDING_CLUSTERS as readonly string[]).includes(value)
  );
}

/** Normaliza el clúster declarado; cualquier otra cosa cae a tráfico directo. */
export function resolveCluster(value: unknown): AttributionCluster {
  if (typeof value !== 'string') return DIRECT_CLUSTER;
  const key = stripControlChars(value).trim().toLowerCase();
  return isLandingCluster(key) ? key : DIRECT_CLUSTER;
}

/**
 * Homologación formato-de-landing → perfil-del-configurador.
 * Acepta tanto el id canónico del SSOT (`gala`) como un id nativo de perfil
 * (`mariachi-imperial`), porque hay enlaces históricos con ambos.
 */
export function resolveArtistProfileId(
  formatId: string | null | undefined,
): string | null {
  const mariachiFormat = getMariachiFormat(formatId);
  if (mariachiFormat) {
    return ARTIST_FORMAT_BY_SSOT_ID[mariachiFormat.id].id;
  }
  return getArtistFormat(formatId)?.id ?? null;
}

/**
 * Lee `?cluster=`, `?landing=` y `?formato=` de un query string no confiable.
 * Acepta tanto `'?a=b'` como `'a=b'` (por si el llamador ya recortó la `?`).
 */
export function readLandingAttribution(search: string): LandingAttribution {
  if (typeof search !== 'string' || search.length === 0) {
    return EMPTY_LANDING_ATTRIBUTION;
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  } catch {
    return EMPTY_LANDING_ATTRIBUTION;
  }

  const cluster = resolveCluster(params.get('cluster'));
  const landingSlug = sanitizeLandingSlug(params.get('landing'));
  const formatId = getMariachiFormat(params.get('formato'))?.id ?? null;
  const artistProfileId = resolveArtistProfileId(params.get('formato'));

  if (!landingSlug && !artistProfileId) {
    return EMPTY_LANDING_ATTRIBUTION;
  }

  return Object.freeze({ cluster, landingSlug, formatId, artistProfileId });
}

/**
 * Construye el query string de un CTA de landing con la procedencia completa.
 * Única fuente del contrato: si mañana se añade un parámetro, se añade aquí y
 * todas las landings lo heredan sin tocar plantillas.
 */
export function buildReserveQuery(input: {
  cluster: LandingCluster;
  landingSlug: string;
  formatId?: string | null;
}): string {
  const params = new URLSearchParams();
  const formatId = getMariachiFormat(input.formatId)?.id;
  if (formatId) params.set('formato', formatId);
  const landingSlug = sanitizeLandingSlug(input.landingSlug);
  if (landingSlug) params.set('landing', landingSlug);
  params.set('cluster', input.cluster);
  return `?${params.toString()}`;
}

/** `true` cuando la atribución aporta información vendible (no es tráfico directo). */
export function hasLandingProvenance(attribution: LandingAttribution): boolean {
  return attribution.landingSlug !== null || attribution.formatId !== null;
}
