/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — PREFERENCIA DE EXPERIENCIA MARIACHI (CATÁLOGO ↔ DESCUBRIMIENTO)
 * ════════════════════════════════════════════════════════════════════════════
 * Capa pura, client-safe y sin dependencias de Node (`crypto`) para que la
 * landing de venta pueda resolver su vista por defecto en servidor y el
 * conmutador cliente pueda validar el mismo contrato.
 *
 * Contrato inmutable:
 *  1. `resolveMariachiViewDefault()` lee el flag soberano de plataforma
 *     `MARIACHI_DEFAULT_VIEW` (editable desde el panel de Coolify sin
 *     recompilar). Cualquier valor no reconocido degrada a `catalog`: un flag
 *     corrupto JAMÁS deja la landing de venta sin catálogo.
 *  2. La preferencia explícita del visitante vive en `localStorage`
 *     (`MARIACHI_VIEW_STORAGE_KEY`) y tiene prioridad sobre el flag de
 *     plataforma: la decisión del usuario manda.
 *  3. Este módulo NO importa Prisma ni Node: es serializable en el bundle
 *     cliente.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Únicas dos experiencias comerciales publicadas en `/mariachis`. */
export type MariachiExperienceView = 'catalog' | 'discovery';

/** Clave de persistencia de la preferencia del visitante. */
export const MARIACHI_VIEW_STORAGE_KEY = 'ear:mariachis:view';

/** Fallback inmutable: la vista que vende (catálogo tipo Airbnb) es la primera. */
export const MARIACHI_VIEW_FALLBACK: MariachiExperienceView = 'catalog';

/** Type-guard estricto: evita `as` en fronteras de datos externos. */
export function isMariachiExperienceView(
  value: unknown,
): value is MariachiExperienceView {
  return value === 'catalog' || value === 'discovery';
}

/**
 * Resuelve la vista por defecto desde el flag de plataforma.
 * Acepta el flag como parámetro para poder testearlo sin tocar `process.env`.
 */
export function resolveMariachiViewDefault(
  rawFlag: string | undefined = process.env.MARIACHI_DEFAULT_VIEW,
): MariachiExperienceView {
  if (typeof rawFlag !== 'string') return MARIACHI_VIEW_FALLBACK;
  const normalized = rawFlag.trim().toLowerCase();
  return isMariachiExperienceView(normalized) ? normalized : MARIACHI_VIEW_FALLBACK;
}
