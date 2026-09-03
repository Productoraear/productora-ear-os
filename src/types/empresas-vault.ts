/**
 * EMPRESAS VAULT SSOT // INTERFACES B2B, HOMOLOGACIÓN DE FINCAS Y RED DE AFILIACIÓN
 * Taxonomía oficial y modelos de datos para el nodo Empresas de EAR OS.
 */

export type EmpresaClusterKey =
  | 'proveedores_y_fincas'
  | 'gestion_multimedia_b2b'
  | 'afiliados_y_comisiones';

export type PartnerType =
  | 'finca'
  | 'catering'
  | 'wedding_planner'
  | 'fotografo_videografo'
  | 'espacio_singular';

export interface ProveedorFinca {
  id: string;
  nombre_comercial: string;
  cif_nif: string;
  direccion_completa: string;
  provincia: string;
  potencia_electrica_kw: number; // Mínimo 15 kW trifásico para directos
  toma_corriente_tipo: 'cetac_32a' | 'cetac_16a' | 'schuko_reforzado';
  limite_sonoro_dba: number; // Ej. 85 dBA en exterior, 95 dBA en carpa
  limite_sonoro_dbc: number;
  limitador_homologado: boolean;
  horario_corte_musica: string;
  acceso_convoy_14pax: {
    apto: boolean;
    altura_max_metros: number;
    anchura_min_metros: number;
    zona_carga_descarga: string;
  };
  poliza_rc: {
    aseguradora: string;
    numero_poliza: string;
    cobertura_eur: number; // Mínimo 300.000 €
    valida_hasta: string;
    certificada: boolean;
  };
  estado_homologacion: 'homologada' | 'en_auditoria' | 'bloqueada';
}

export interface RecursoMultimediaB2B {
  id: string;
  titulo: string;
  partner_id: string;
  tipo_asset: 'video_4k' | 'press_kit_pdf' | 'galeria_fotos_hd' | 'plano_3d';
  url_externa_cdn: string; // Cloudflare R2 / S3 / Vimeo Pro
  peso_mb: number;
  derechos_imagen_firmados: boolean;
  co_branding_ear: boolean;
  permitir_descarga_publica: boolean;
}

export interface AreaPrivadaMultimedia {
  partner_id: string;
  nombre_partner: string;
  carpeta_hub_local: string; // H:\EAR_INGESTION_HUB\03_EMPRESAS\02_GESTION_MULTIMEDIA_B2B
  total_assets: number;
  recursos: RecursoMultimediaB2B[];
  fecha_ultima_sincronizacion: string;
}

export interface LiquidacionComision {
  id: string;
  evento_id: string;
  cliente_nombre: string;
  partner_id: string;
  tipo_partner: PartnerType;
  importe_evento_eur: number;
  porcentaje_comision: number; // 10% a 15%
  importe_comision_eur: number;
  estado_liquidacion: 'devengada' | 'liquidada' | 'en_espera_fianza';
  fecha_devengo: string;
  fecha_pago?: string;
  metodo_pago?: 'transferencia' | 'stripe_connect';
  factura_referencia?: string;
}

export interface AcuerdoAfiliado {
  id: string;
  partner_id: string;
  tipo_partner: PartnerType;
  porcentaje_comision_acordado: number; // 0.10 a 0.15
  scoring_partner: {
    puntuacion_confianza: number; // 0 a 100
    leads_enviados: number;
    leads_cerrados: number;
    ratio_conversion_pct: number; // >= 50%
    incidencias_tecnicas: number;
  };
  estado: 'activo' | 'pausado' | 'en_revision';
  fecha_firma_convenio: string;
}

export interface EmpresaKnowledgeItem {
  id: string;
  source_file: string;
  sha256: string;
  cluster: EmpresaClusterKey;
  title: string;
  summary: string;
  content_clean: string;
  affinity_score: number;
  tags: string[];
  operational_rules?: string[];
  ingestion_timestamp: string;
}

export interface EmpresasKnowledgeBase {
  metadata: {
    system: string;
    version: string;
    last_updated: string;
    total_entries: number;
    cluster_counts: Record<EmpresaClusterKey, number>;
  };
  operational_thresholds: {
    fincas_homologadas_objetivo: number; // 12 fincas
    comision_minima_afiliado_pct: number; // 0.10 (10%)
    comision_maxima_afiliado_pct: number; // 0.15 (15%)
    max_concentracion_facturacion_finca_pct: number; // 0.35 (35%)
    plazo_liquidacion_comision_dias: number; // 7 días hábiles
    sla_onboarding_express_minutos: number; // < 15 minutos
  };
  clusters_definition: Record<
    EmpresaClusterKey,
    {
      name: string;
      description: string;
      seed_keywords: string[];
    }
  >;
  items: EmpresaKnowledgeItem[];
}
