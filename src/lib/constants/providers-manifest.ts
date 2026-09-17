/**
 * SSOT DE CONTADORES DEL DATA LAKE PÚBLICO (TRAZABILIDAD REAL)
 * ─────────────────────────────────────────────────────────────
 * Fuente de verdad: `public/data/providers/manifest.json`
 * Generado por `scripts/sync_providers_manifest.ps1` y servido por CDN/Edge.
 *
 * REGLA INMUTABLE:
 * - Los contadores mostrados en el frontend DEBEN derivar de este módulo.
 * - Prohibido hardcodear cifras de catálogo en vistas (dato genérico/desincronizado).
 * - Si el manifest cambia, actualizar ÚNICAMENTE este archivo.
 *
 * `all_featured` (150) se excluye del total porque es un subconjunto curado
 * duplicado de los gremios completos, no un gremio independiente.
 */

export const PROVIDERS_MANIFEST_TOTALS = {
  finca: 9559,
  catering: 4096,
  decoracion: 1650,
  musica: 5359,
  sonido: 8963,
  foto: 35153,
  wedding: 1011,
  moda: 8777,
  transporte: 1961,
  servicios: 8617,
  senior_care: 800,
} as const;

/** Gremios mostrados en el directorio B2C de bodas (sin senior_care ni all_featured). */
export const B2C_DIRECTORY_GREMIO_TOTALS: Record<string, number> = {
  finca: PROVIDERS_MANIFEST_TOTALS.finca,
  catering: PROVIDERS_MANIFEST_TOTALS.catering,
  decoracion: PROVIDERS_MANIFEST_TOTALS.decoracion,
  musica: PROVIDERS_MANIFEST_TOTALS.musica,
  sonido: PROVIDERS_MANIFEST_TOTALS.sonido,
  foto: PROVIDERS_MANIFEST_TOTALS.foto,
  wedding: PROVIDERS_MANIFEST_TOTALS.wedding,
  moda: PROVIDERS_MANIFEST_TOTALS.moda,
  transporte: PROVIDERS_MANIFEST_TOTALS.transporte,
  servicios: PROVIDERS_MANIFEST_TOTALS.servicios,
};

/**
 * Total agregado de registros del directorio B2C.
 * NOTA DE TRAZABILIDAD: es la suma de registros por gremio del manifest,
 * no un recuento de entidades únicas (los datasets por gremio pueden
 * compartir proveedores multi-servicio).
 */
export const PROVIDERS_B2C_TOTAL = Object.values(B2C_DIRECTORY_GREMIO_TOTALS).reduce(
  (acc, n) => acc + n,
  0,
);

/**
 * TOTAL CANÓNICO DE LA RED (SSOT ÚNICO).
 * Suma de TODOS los gremios del manifest (incluye senior_care VIMUME).
 * Es el número que deben mostrar los contadores de la red nacional.
 * PROHIBIDO hardcodear este valor en cualquier vista: importar SIEMPRE esta constante.
 */
export const PROVIDERS_GRAND_TOTAL = Object.values(PROVIDERS_MANIFEST_TOTALS).reduce(
  (acc, n) => acc + n,
  0,
);

/** Formateador canónico en español (punto de miles). Ej: 85.946 */
export const formatProviderCount = (n: number): string => n.toLocaleString('es-ES');

/** Etiqueta compacta para badges de sidebar. Ej: 85.9K */
export const formatProviderBadge = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/** Conteo real de fincas homologadas S-Class (SSOT Bloque 5). */
export const FINCAS_S_CLASS_TOTAL = 12;

// ─────────────────────────────────────────────────────────────────
// MODELO SOBERANO DE MONETIZACIÓN (directiva 8)
// ─────────────────────────────────────────────────────────────────
// Cero cuotas mensuales. Split 80/10/10 por reserva cerrada + Reclamación
// de Perfil (Claim). El perfil verificado/reclamado desbloquea la
// visibilidad de contacto directo y la certificación acústica.
export type EstadoHomologacion =
  | 'CERTIFICADA_GOLD_MASTER'
  | 'AUDITORIA_VIGENTE'
  | 'ASOCIADO_STANDARD';

/** Estado por defecto de todo registro del Data Lake sin reclamar. */
export const DEFAULT_ESTADO_HOMOLOGACION: EstadoHomologacion = 'ASOCIADO_STANDARD';

/** Campos canónicos de monetización que deben acompañar a cada proveedor. */
export interface ProviderMonetizationFields {
  isClaimed: boolean;
  estadoHomologacion: EstadoHomologacion;
}
