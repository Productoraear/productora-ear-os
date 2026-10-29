/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · MOTOR DE CTAs POR PROVEEDOR (CERO FACHADAS · CERO AGENDA AJENA)
 * ════════════════════════════════════════════════════════════════════════════
 * PROBLEMA ERRADICADO:
 *   Todo «Bloquear Fecha» del ecosistema aterrizaba en `/reservar/solista`, es
 *   decir, en la agenda de Edwin Agudelo — incluso desde la ficha de una finca,
 *   un catering o la landing de una alianza. Un proveedor bloqueaba la agenda
 *   del CEO y el cliente creía estar reservando al proveedor.
 *
 * DOCTRINA:
 *   · Visita / consulta   → `/calendario/<kind>/<slug>?intent=ver`
 *   · Bloqueo de fecha    → `/calendario/<kind>/<slug>?intent=bloquear`
 *   · Contrato + depósito → `/reservar/contrato?proveedor=<slug>` (SSOT manda)
 *   · Sin `node:fs`, sin `any`, sin importes: el dinero nace EXCLUSIVAMENTE de
 *     `src/lib/constants/ear-os-ssot.ts` en la página de contrato, jamás aquí.
 *   · Sin destino resoluble ⇒ `/proveedores` (ruta real, nunca `#` ni vacío).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { buildEntityCalendarHref } from '@/lib/calendar/entity-calendar-engine';
import {
  inferCalendarKindFromCategory,
  resolveCalendarEntityKind,
  type CalendarEntityKind,
} from '@/lib/calendar/entity-calendar-types';

/** Intención declarada del CTA (la consume `EntityCalendarBoard`). */
export type ProviderCtaIntent = 'ver' | 'bloquear';

/**
 * Subconjunto mínimo que cualquier registro de proveedor (Data Lake, ficha
 * gold, `all_providers_database.json`, HTML indexado) puede satisfacer sin
 * conversiones defensivas en la vista.
 */
export interface ProviderCtaSource {
  readonly slug?: string | null;
  readonly id?: string | number | null;
  readonly name?: string | null;
  readonly category?: string | null;
  /** `kind` ya resuelto por el registro (p. ej. `finca`, `catering`). */
  readonly calendarKind?: string | null;
}

export type ProviderCtaSourceLike = ProviderCtaSource | null | undefined;

/** Ruta real de socorro: existe en disco, nunca un enlace muerto. */
export const PROVIDER_CTA_FALLBACK_HREF = '/proveedores';

/** Ruta canónica del expediente contractual con depósito deducible. */
export const PROVIDER_CONTRACT_PATH = '/reservar/contrato';

const SLUG_SAFE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

/** Slug canónico (minúsculas, sin espacios). `null` si no es publicable. */
export function normalizeProviderSlug(source: ProviderCtaSourceLike): string | null {
  if (!source) return null;
  const candidates: readonly unknown[] = [source.slug, source.id];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const key = candidate.trim().toLowerCase();
    if (SLUG_SAFE.test(key)) return key;
  }
  return null;
}

/**
 * `kind` de calendario del proveedor: el explícito manda; si no, se infiere de
 * la categoría del Data Lake; último recurso `servicios` (nunca inventa finca).
 */
export function resolveProviderCalendarKind(source: ProviderCtaSourceLike): CalendarEntityKind {
  if (!source) return 'servicios';
  const explicit = resolveCalendarEntityKind(source.calendarKind);
  if (explicit) return explicit;
  return inferCalendarKindFromCategory(source.category);
}

export interface ProviderCalendarHrefOptions {
  readonly intent?: ProviderCtaIntent;
  readonly date?: string | null;
  readonly timeSlot?: string | null;
}

/**
 * Destino real del CTA de calendario del proveedor.
 * Devuelve siempre una ruta existente: o el calendario del proveedor, o el
 * directorio (jamás un `#` que simule acción).
 */
export function resolveProviderCalendarHref(
  source: ProviderCtaSourceLike,
  options?: ProviderCalendarHrefOptions,
): string {
  const slug = normalizeProviderSlug(source);
  if (!slug) return PROVIDER_CTA_FALLBACK_HREF;
  const kind = resolveProviderCalendarKind(source);
  return buildEntityCalendarHref(kind, slug, {
    intent: options?.intent ?? 'ver',
    date: options?.date ?? null,
    timeSlot: options?.timeSlot ?? null,
  });
}

/** Parámetros admitidos por el expediente contractual (`/reservar/contrato`). */
export interface ProviderContractQuery {
  readonly requestId?: string | null;
  readonly client?: string | null;
  readonly date?: string | null;
  readonly city?: string | null;
  /** Importe base. Solo se propaga si es finito y positivo (SSOT en destino). */
  readonly amount?: number | null;
}

function setIfPresent(params: URLSearchParams, key: string, value: string | null | undefined): void {
  if (typeof value !== 'string') return;
  const clean = value.trim();
  if (!clean) return;
  params.set(key, clean);
}

/**
 * Destino del CTA de contrato: el proveedor viaja como `proveedor=<slug>` y la
 * página de contrato resuelve el nombre comercial real contra el Data Lake.
 * Los importes NO se inventan aquí: se delega en el SSOT del destino.
 */
export function resolveProviderContractHref(
  source: ProviderCtaSourceLike,
  query?: ProviderContractQuery,
): string {
  const params = new URLSearchParams();
  const slug = normalizeProviderSlug(source);
  if (slug) params.set('proveedor', slug);
  setIfPresent(params, 'requestId', query?.requestId);
  setIfPresent(params, 'client', query?.client);
  setIfPresent(params, 'date', query?.date);
  setIfPresent(params, 'city', query?.city);
  const amount = query?.amount;
  if (typeof amount === 'number' && Number.isFinite(amount) && amount > 0) {
    params.set('amount', amount.toFixed(2));
  }
  const qs = params.toString();
  return qs ? `${PROVIDER_CONTRACT_PATH}?${qs}` : PROVIDER_CONTRACT_PATH;
}

/** Nombre comercial honesto para UI: nunca inventa una marca. */
export function resolveProviderDisplayName(source: ProviderCtaSourceLike): string {
  if (source && typeof source.name === 'string' && source.name.trim()) {
    return source.name.trim();
  }
  return 'Proveedor por confirmar';
}
