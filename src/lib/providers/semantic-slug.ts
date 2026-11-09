/**
 * ============================================================================
 * EAR OS · CANONICAL SEMANTIC SLUG ENGINE FOR PROVIDERS & VENUES
 * ============================================================================
 * Erradica los slugs opacos `prov-XXXX` transformándolos en slugs semánticos
 * limpios orientados a intención de búsqueda (`nombre-empresa-provincia`),
 * manteniendo resolución retrocompatible O(1) para redirecciones 301/308.
 */

export interface ProviderSlugInput {
  readonly id?: string | null;
  readonly slug?: string | null;
  readonly name?: string | null;
  readonly province?: string | null;
  readonly location?: { readonly province?: string | null; readonly city?: string | null } | string | null;
  readonly category?: string | null;
}

/**
 * Normaliza un texto eliminando diacríticos (acentos, eñes -> n) y caracteres
 * no alfanuméricos, devolviendo un segmento kebab-case limpio.
 */
export function slugifySegment(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Detecta si un slug o identificador es un código opaco generado (`prov-4765`, `v-123`, numérico puro).
 */
export function isOpaqueProviderSlug(slug: string | null | undefined): boolean {
  if (!slug || typeof slug !== 'string') return true;
  const norm = slug.trim().toLowerCase();
  if (!norm) return true;
  return (
    /^prov-([a-z0-9]+-)*\d+$/i.test(norm) ||
    /^vendor-([a-z0-9]+-)*\d+$/i.test(norm) ||
    /^v-([a-z0-9]+-)*\d+$/i.test(norm) ||
    /^\d+$/.test(norm)
  );
}

/**
 * Calcula el slug semántico canónico de un proveedor o finca.
 * Si el proveedor ya tiene un slug semántico válido, lo respeta.
 * Si tiene `prov-XXXX`, construye `nombre-provincia` (o `nombre` si ya incluye la provincia).
 */
export function buildCanonicalProviderSlug(input: ProviderSlugInput): string {
  const currentSlug = typeof input.slug === 'string' ? input.slug.trim().toLowerCase() : '';
  if (currentSlug && !isOpaqueProviderSlug(currentSlug)) {
    return slugifySegment(currentSlug);
  }

  const rawName = typeof input.name === 'string' ? input.name.trim() : '';
  const nameSlug = slugifySegment(rawName);

  if (!nameSlug || isOpaqueProviderSlug(nameSlug)) {
    return slugifySegment(input.id || currentSlug || 'proveedor-homologado');
  }

  let rawProv = '';
  if (typeof input.province === 'string' && input.province.trim()) {
    rawProv = input.province.trim();
  } else if (input.location && typeof input.location === 'object') {
    rawProv = input.location.province || input.location.city || '';
  } else if (typeof input.location === 'string') {
    rawProv = input.location.split(',')[0] || '';
  }

  const provSlug = slugifySegment(rawProv);
  if (provSlug && provSlug !== 'espana' && provSlug !== 'spain' && !nameSlug.endsWith(`-${provSlug}`) && !nameSlug.includes(`-${provSlug}-`)) {
    return `${nameSlug}-${provSlug}`;
  }

  return nameSlug;
}
