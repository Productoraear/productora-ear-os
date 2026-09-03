/**
 * INSTITUCIONES VAULT SSOT // INTERFACES B2G, LICITACIONES LCSP Y CONCIERTOS PÚBLICOS
 * Taxonomía oficial y modelos de datos para el nodo Instituciones de EAR OS.
 */

export type InstitucionClusterKey =
  | 'gobiernos_y_protocolos_estado'
  | 'ayuntamientos_servicios_municipales'
  | 'fundaciones_y_socios_estrategicos'
  | 'pliegos_y_documentacion_lcsp';

export interface GobiernoProtocoloEstado {
  id: string;
  organismo_publico: string; // Ministerio, Embajada, Presidencia, FITUR
  tipo_evento: 'cumbre_internacional' | 'feria_fitur' | 'gala_estado' | 'recepcion_diplomatica';
  requisitos_seguridad: {
    acreditaciones_seguridad_estado: boolean;
    encriptacion_rf_microfonia: boolean; // Shure Axient Digital AES-256
    linea_audio_redundante: boolean;
    plan_evacuacion_coordinado: boolean;
  };
  transporte_vip_convoy: {
    requerido: boolean;
    vehiculos_14pax: number;
    escolta_autorizada: boolean;
    choferes_protocolo_etiqueta: boolean;
  };
  normativa_protocolaria: string;
  presupuesto_adjudicado_eur: number;
}

export interface ServicioMunicipalAyuntamiento {
  id: string;
  ayuntamiento: string;
  provincia: string;
  concejalia: 'cultura' | 'festejos' | 'bienestar_social' | 'turismo';
  servicio_tipo: 'fiestas_patronales_360' | 'cabalgata_reyes' | 'campanadas' | 'pantallas_led' | 'convenio_vimume';
  limitacion_acustica_homologada: {
    limite_db: number;
    registro_telematico_instalado: boolean;
    certificado_sonometrico_incluido: boolean;
  };
  integracion_vimume: {
    incluye_intervencion_senior: boolean;
    sesiones_programadas: number;
    centros_publicos_beneficiarios: string[];
  };
  importe_neto_eur: number; // Sujeto a límite < 14.999 € en contrato menor
  codigo_dir3: {
    organo_gestor: string;
    unidad_tramitadora: string;
    oficina_contable: string;
  };
}

export interface FundacionSocioEstrategico {
  id: string;
  nombre_fundacion: string;
  cif: string;
  ambito_actuacion: 'sociosanitario' | 'cultural' | 'envejecimiento_activo' | 'discapacidad';
  convenio_marco: {
    objeto_convenio: string;
    fecha_suscripcion: string;
    vigencia_anos: number;
    co_branding_autorizado: boolean;
  };
  justificaciones_ods_2030: {
    ods_3_salud_bienestar: boolean;
    ods_10_reduccion_desigualdades: boolean;
    ods_11_comunidades_sostenibles: boolean;
    indicadores_impacto_social: string[];
  };
  mecenazgo_ley_49_2002: {
    aplica_deduccion_80pct: boolean;
    modelo_182_aeat_certificado: boolean;
    certificado_donacion_emitido: boolean;
  };
}

export interface ExpedienteContratacionLCSP {
  id: string;
  numero_expediente: string;
  ente_contratante: string;
  tipo_contrato: 'menor_servicios_art118' | 'procedimiento_abierto_simplificado';
  objeto_del_contrato: string;
  presupuesto_base_licitacion_sin_iva: number; // Mínimo <= 14.990 € para contratos menores
  iva_aplicable_pct: number;
  plazo_ejecucion_dias: number;
  memoria_justificativa_necesidad: string;
  memoria_justificativa_precio: string;
  facturacion_electronica_face: {
    facturae_xml_emitida: boolean;
    acta_conformidad_firmada: boolean;
    fecha_presentacion: string;
    fecha_cobro_prevista: string;
    dias_ciclo_cobro: number; // <= 30 días hábiles
  };
}

export interface InstitucionKnowledgeItem {
  id: string;
  source_file: string;
  sha256: string;
  cluster: InstitucionClusterKey;
  title: string;
  summary: string;
  content_clean: string;
  affinity_score: number;
  tags: string[];
  operational_rules?: string[];
  ingestion_timestamp: string;
}

export interface InstitucionesKnowledgeBase {
  metadata: {
    system: string;
    version: string;
    last_updated: string;
    total_entries: number;
    cluster_counts: Record<InstitucionClusterKey, number>;
  };
  operational_thresholds: {
    techo_contrato_menor_eur: number; // 14.990 € (Art. 118 LCSP)
    margen_neto_b2g_pct: number; // 0.48 (48%)
    ciclo_cobro_max_face_dias: number; // 30 días hábiles
    max_facturacion_por_nif_publico_ano_eur: number; // 14.990 € por concejalía
    ratio_solvencia_pliegos: number; // 3.0x valor licitado
    tasa_conformidad_facturas_face_pct: number; // 1.0 (100%)
  };
  clusters_definition: Record<
    InstitucionClusterKey,
    {
      name: string;
      description: string;
      seed_keywords: string[];
    }
  >;
  items: InstitucionKnowledgeItem[];
}
