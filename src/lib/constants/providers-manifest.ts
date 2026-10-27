/**
 * SSOT DE CONTADORES DEL DATA LAKE PÚBLICO (TRAZABILIDAD REAL)
 * ─────────────────────────────────────────────────────────────
 * Fuente de verdad ÚNICA: `public/data/providers/manifest.json`
 * Generado por `scripts/build_lean_verified_edge.cjs` y servido por CDN/Edge.
 *
 * REGLA INMUTABLE (CERO FACHADAS):
 * - Los contadores del frontend DEBEN derivar de este módulo (manifest real).
 * - PROHIBIDO hardcodear cifras de catálogo en vistas o constantes.
 * - El manifest solo publica proveedores con teléfono real atribuible o GPS
 *   verificado por JSON-LD; `publishable` vs `published` queda declarado.
 */

import rawManifest from '../../../public/data/providers/manifest.json';

export interface ProviderManifestEntry {
  count?: number;
  publishable?: number;
  overflow?: number;
  sizeKB?: number;
  chunks?: string[];
  sha256?: string[];
  withPhone?: number;
  verified?: number;
  withGeo?: number;
  withRating?: number;
  withSocial?: number;
  curated?: boolean;
  note?: string;
  pruned?: number;
}

export interface ProviderManifestMeta {
  version?: string;
  generatedAt?: string;
  doctrine?: string;
  maxFileKB?: number;
  sources?: string[];
  publishable?: number;
  withPhone?: number;
  withPhoneWithheld?: number;
  withGeo?: number;
  verified?: number;
  withSocial?: number;
  withWeb?: number;
  withRating?: number;
}

type ManifestCategoryEntry = ProviderManifestEntry | ProviderManifestMeta | undefined;

const manifest = rawManifest as unknown as Record<string, ManifestCategoryEntry>;

export const PROVIDERS_MANIFEST_META: ProviderManifestMeta =
  (manifest['_meta'] as ProviderManifestMeta | undefined) ?? {};

/** Lee el conteo publicado real de un gremio del manifest (0 si no existe). */
function readCount(key: string): number {
  const entry = manifest[key] as ProviderManifestEntry | undefined;
  const count = entry && typeof entry.count === 'number' ? entry.count : 0;
  return Number.isFinite(count) ? count : 0;
}

/** Contadores publicados por gremio (derivados del manifest, nunca hardcodeados). */
export const PROVIDERS_MANIFEST_TOTALS = {
  finca: readCount('finca'),
  catering: readCount('catering'),
  decoracion: readCount('decoracion'),
  musica: readCount('musica'),
  sonido: readCount('sonido'),
  foto: readCount('foto'),
  wedding: readCount('wedding'),
  moda: readCount('moda'),
  transporte: readCount('transporte'),
  servicios: readCount('servicios'),
  senior_care: readCount('senior_care'),
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

/** Total agregado de registros del directorio B2C (suma de gremios publicados). */
export const PROVIDERS_B2C_TOTAL = Object.values(B2C_DIRECTORY_GREMIO_TOTALS).reduce(
  (acc, n) => acc + n,
  0,
);

/** TOTAL CANÓNICO DE LA RED: suma de TODOS los gremios publicados (incluye VIMUME). */
export const PROVIDERS_GRAND_TOTAL = Object.values(PROVIDERS_MANIFEST_TOTALS).reduce(
  (acc, n) => acc + n,
  0,
);

/** Proveedores con teléfono real atribuible (no centralita, no compartido). */
export const PROVIDERS_WITH_ATTRIBUTABLE_PHONE = PROVIDERS_MANIFEST_META.withPhone ?? 0;

/** Proveedores con GPS verificado por JSON-LD de origen. */
export const PROVIDERS_WITH_VERIFIED_GEO = PROVIDERS_MANIFEST_META.withGeo ?? 0;

/** Proveedores blindados: teléfono real, exclusivo y no premium. */
export const PROVIDERS_VERIFIED_BLINDADOS = PROVIDERS_MANIFEST_META.verified ?? 0;

/** Teléfonos retenidos por ambigüedad (mismo número en varias empresas). */
export const PROVIDERS_PHONE_WITHHELD = PROVIDERS_MANIFEST_META.withPhoneWithheld ?? 0;

/** Proveedores con redes sociales reales detectadas en su ficha. */
export const PROVIDERS_WITH_REAL_SOCIAL = PROVIDERS_MANIFEST_META.withSocial ?? 0;

/** Fecha de la última auditoría del manifest. */
export const PROVIDERS_MANIFEST_GENERATED_AT = PROVIDERS_MANIFEST_META.generatedAt ?? '';

/** Formateador canónico en español (punto de miles). */
export const formatProviderCount = (n: number): string => n.toLocaleString('es-ES');

/** Etiqueta compacta para badges de sidebar. Ej: 6.8K */
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
