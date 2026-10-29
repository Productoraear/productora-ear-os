/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · RESOLUCIÓN DEL SUJETO CONTRACTUAL (SOLO SERVIDOR)
 * ════════════════════════════════════════════════════════════════════════════
 * El expediente `/reservar/contrato` recibía el nombre del titular como texto
 * libre (`?provider=`) con un default ficticio: cualquiera podía imprimir un
 * contrato con un titular inventado. Aquí se resuelve el nombre comercial REAL
 * desde el mismo registro que alimenta el calendario, en este orden:
 *   1. Data Lake de proveedores (particiones edge verificadas).
 *   2. Roster soberano de artistas / formatos.
 *   3. Sin coincidencia → `displayName: null` (la vista dice «por confirmar»;
 *      jamás inventa una razón social).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { resolveCalendarEntity } from '@/lib/calendar/entity-registry';
import {
  inferCalendarKindFromCategory,
  type CalendarEntityKind,
} from '@/lib/calendar/entity-calendar-types';
import { findEdgeProviderBySlug } from '@/lib/providers/edge-partition-loader';
import { normalizeProviderSlug } from '@/lib/providers/provider-cta-engine';

export interface ProviderContractSubject {
  readonly slug: string;
  /** `null` ⇒ no hay razón social verificable: se muestra «por confirmar». */
  readonly displayName: string | null;
  readonly category: string | null;
  readonly kind: CalendarEntityKind;
  readonly source: 'provider' | 'artist' | 'unresolved';
}

/**
 * Resuelve el sujeto contractual a partir del slug recibido por query string.
 * Devuelve `null` solo cuando el slug no es publicable (vacío/inválido).
 */
export function resolveProviderContractSubject(
  rawSlug: string | null | undefined,
): ProviderContractSubject | null {
  const slug = normalizeProviderSlug({ slug: rawSlug ?? null });
  if (!slug) return null;

  const record = findEdgeProviderBySlug(slug);
  if (record) {
    return {
      slug,
      displayName: record.name,
      category: record.category,
      kind: inferCalendarKindFromCategory(record.category),
      source: 'provider',
    };
  }

  const artist = resolveCalendarEntity('artista', slug);
  if (artist.source === 'artist') {
    return {
      slug: artist.slug,
      displayName: artist.displayName,
      category: null,
      kind: 'artista',
      source: 'artist',
    };
  }

  return {
    slug,
    displayName: null,
    category: null,
    kind: 'servicios',
    source: 'unresolved',
  };
}
