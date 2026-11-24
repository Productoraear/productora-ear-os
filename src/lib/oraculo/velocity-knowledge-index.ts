/**
 * ════════════════════════════════════════════════════════════════════════════
 * ORÁCULO EAR OS — ÍNDICE DE INTELIGENCIA CORPORATIVA VELOCITY / INCUBADORA
 * ════════════════════════════════════════════════════════════════════════════
 * Expone la bóveda centralizada de `knowledge/vault_velocity_incubadora/`
 * para el compilador de `/admin/compiler` y motores de inferencia.
 * ════════════════════════════════════════════════════════════════════════════
 */

import rawManifesto from './vault-manifesto.json';

export type VelocityVaultCategory =
  | 'transcripciones'
  | 'documentos'
  | 'datos_esquemas'
  | 'multimedia_meta';

export interface VelocityVaultItem {
  readonly filename: string;
  readonly vault_ref: string;
  readonly sha256: string;
  readonly original_paths: readonly string[];
  readonly category: VelocityVaultCategory;
  readonly ext: string;
  readonly size_bytes: number;
  readonly word_count: number;
}

export interface VelocityVaultManifesto {
  readonly version: string;
  readonly generated_at: string;
  readonly vault_root: string;
  readonly total_files: number;
  readonly total_size_bytes: number;
  readonly total_size_mb: string;
  readonly total_size_gb: string;
  readonly files_by_extension: Readonly<Record<string, number>>;
  readonly inventory: readonly VelocityVaultItem[];
}

export const VELOCITY_VAULT_MANIFESTO: VelocityVaultManifesto = Object.freeze({
  version: rawManifesto.version,
  generated_at: rawManifesto.generated_at,
  vault_root: rawManifesto.vault_root,
  total_files: rawManifesto.total_files,
  total_size_bytes: rawManifesto.total_size_bytes,
  total_size_mb: rawManifesto.total_size_mb,
  total_size_gb: rawManifesto.total_size_gb,
  files_by_extension: Object.freeze(rawManifesto.files_by_extension),
  inventory: Object.freeze(rawManifesto.inventory as unknown as VelocityVaultItem[]),
});

export const VELOCITY_VAULT_ITEMS: readonly VelocityVaultItem[] = VELOCITY_VAULT_MANIFESTO.inventory;

/**
 * Consulta la bóveda de Velocity por término de búsqueda y filtros opcionales.
 */
export function queryVelocityVault(
  query: string,
  options?: {
    category?: VelocityVaultCategory;
    ext?: string;
  }
): readonly VelocityVaultItem[] {
  const normalizedQuery = query.toLowerCase().trim();

  return VELOCITY_VAULT_ITEMS.filter((item) => {
    if (options?.category && item.category !== options.category) {
      return false;
    }
    if (options?.ext && item.ext !== options.ext) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const matchesName = item.filename.toLowerCase().includes(normalizedQuery);
    const matchesRef = item.vault_ref.toLowerCase().includes(normalizedQuery);
    const matchesOriginal = item.original_paths.some((p) =>
      p.toLowerCase().includes(normalizedQuery)
    );

    return matchesName || matchesRef || matchesOriginal;
  });
}

/**
 * Obtiene un recurso de la bóveda por su hash SHA-256 inmutable.
 */
export function getVelocityVaultItemByHash(sha256: string): VelocityVaultItem | undefined {
  return VELOCITY_VAULT_ITEMS.find((item) => item.sha256 === sha256);
}

/**
 * Resumen de métricas de la bóveda para el compilador.
 */
export function getVelocityVaultStats() {
  return {
    totalFiles: VELOCITY_VAULT_MANIFESTO.total_files,
    totalSizeMb: VELOCITY_VAULT_MANIFESTO.total_size_mb,
    categoriesCount: {
      transcripciones: VELOCITY_VAULT_ITEMS.filter((i) => i.category === 'transcripciones').length,
      documentos: VELOCITY_VAULT_ITEMS.filter((i) => i.category === 'documentos').length,
      datos_esquemas: VELOCITY_VAULT_ITEMS.filter((i) => i.category === 'datos_esquemas').length,
      multimedia_meta: VELOCITY_VAULT_ITEMS.filter((i) => i.category === 'multimedia_meta').length,
    },
    extensions: VELOCITY_VAULT_MANIFESTO.files_by_extension,
    lastHarvestAt: VELOCITY_VAULT_MANIFESTO.generated_at,
  };
}
