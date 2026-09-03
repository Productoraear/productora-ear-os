/**
 * ARTISTAS VAULT SSOT // INTERFACES DE CONOCIMIENTO Y OPERACIONES 360
 * Taxonomía oficial y modelos de datos para el nodo Artistas de EAR OS.
 */

export type ArtistaClusterKey =
  | 'dani_aragon_crecimiento'
  | 'metodologia_61_99_dias'
  | 'logistica_giras_14pax'
  | 'produccion_tecnica_audiovisual'
  | 'emanager_legal_monetizacion';

export interface ArtistaKnowledgeItem {
  id: string;
  source_file: string;
  sha256: string;
  cluster: ArtistaClusterKey;
  title: string;
  summary: string;
  content_clean: string;
  affinity_score: number; // 0.0 a 1.0 (Umbral mínimo: 0.70)
  tags: string[];
  operational_rules?: string[];
  ingestion_timestamp: string;
}

export interface ArtistasKnowledgeBase {
  metadata: {
    system: string;
    version: string;
    last_updated: string;
    total_entries: number;
    cluster_counts: Record<ArtistaClusterKey, number>;
  };
  operational_thresholds: {
    logistica_min_pax: number; // 14 plazas, 85% ocupación (12 pax)
    logistica_margen_bruto: number; // 0.42
    habito_automatizacion_dias: number; // 61 días
    habito_identidad_clic_dias: number; // 99 días
    emanager_fee_base_mrr: number; // 1500 €
  };
  clusters_definition: Record<
    ArtistaClusterKey,
    {
      name: string;
      description: string;
      seed_keywords: string[];
    }
  >;
  items: ArtistaKnowledgeItem[];
}
