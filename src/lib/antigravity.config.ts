/**
 * antigravity.config.ts
 * -----------------------------------------------------------------------------
 * EAR OS v2 — S-Class Antigravity Configuration
 *
 * Wave 6 · LIB-AUDIT · TAREA ID: W06-018
 *
 * Objetivo de la auditoría:
 *   - Eliminar exports muertos (dead exports) sin consumidores conocidos.
 *   - Aplicar tipado estricto (cero `any` implícitos, literales `as const`).
 *   - Congelar el objeto de configuración para garantizar inmutabilidad en runtime.
 *   - Mantener el 100% de los símbolos públicos previamente exportados.
 *
 * Nota de compatibilidad:
 *   Los tres exports originales (`ANTIGRAVITY_LEVEL`, `TOKEN_PHOTOSYNTHESIS`,
 *   `DOMINANCE_HORIZON`) se conservan intactos para no romper consumidores
 *   existentes. Se añade un agregado `ANTIGRAVITY_CONFIG` tipado y congelado
 *   como fuente única de verdad para nuevos consumidores.
 * -----------------------------------------------------------------------------
 */

/** Nivel de clasificación operativa del sistema. */
export const ANTIGRAVITY_LEVEL = 'S-CLASS' as const;

/** Bandera de habilitación de fotosíntesis de tokens. */
export const TOKEN_PHOTOSYNTHESIS = true as const;

/** Horizonte de dominancia declarado por el sistema. */
export const DOMINANCE_HORIZON = '20 YEARS' as const;

/** Tipo literal del nivel de antigravedad. */
export type AntigravityLevel = typeof ANTIGRAVITY_LEVEL;

/** Tipo literal del horizonte de dominancia. */
export type DominanceHorizon = typeof DOMINANCE_HORIZON;

/**
 * Forma estricta del agregado de configuración de antigravedad.
 * Todos los campos son `readonly` para reforzar la inmutabilidad en compilación.
 */
export interface AntigravityConfig {
  readonly level: AntigravityLevel;
  readonly tokenPhotosynthesis: typeof TOKEN_PHOTOSYNTHESIS;
  readonly dominanceHorizon: DominanceHorizon;
}

/**
 * Agregado inmutable de configuración de antigravedad.
 * Fuente única de verdad para consumidores nuevos.
 */
export const ANTIGRAVITY_CONFIG: Readonly<AntigravityConfig> = Object.freeze({
  level: ANTIGRAVITY_LEVEL,
  tokenPhotosynthesis: TOKEN_PHOTOSYNTHESIS,
  dominanceHorizon: DOMINANCE_HORIZON,
} satisfies AntigravityConfig);

export default ANTIGRAVITY_CONFIG;