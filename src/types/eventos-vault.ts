/**
 * EVENTOS VAULT SSOT // INTERFACES DE CONTRATACIÓN, PRODUCCIÓN Y OPERACIONES 360
 * Taxonomía oficial y modelos de datos para el nodo Eventos de EAR OS.
 */

export type EventoClusterKey =
  | 'eventos_propios'
  | 'terceros_parejas_bodas'
  | 'fechas_senaladas'
  | 'riders_logistica_tecnica';

export type PaqueteBodaTier = 'silver' | 'gold' | 'diamond_sclass';

export interface TimingMinutoAMinuto {
  fase: 'ceremonia' | 'coctel' | 'banquete' | 'barra_libre' | 'fin_de_fiesta';
  hora_inicio: string;
  hora_fin: string;
  descripcion: string;
  rider_activo: string;
  volumen_spl_db: number;
}

export interface AddonServicio {
  id: string;
  nombre: string;
  categoria: 'iluminacion' | 'fuegos_frios' | 'pantallas_led' | 'musica_en_vivo';
  precio_eur: number;
  margen_bruto_pct: number;
}

export interface EventoPropio {
  id: string;
  nombre: string;
  fecha: string;
  recinto: string;
  aforo_boutique: number; // 150 a 400 asistentes
  precio_entrada_eur: number;
  presupuesto_base_eur: number;
  punto_equilibrio_entradas: number; // Preventa requerida a D-21
  sponsors_confirmados: Array<{
    empresa: string;
    aportacion_eur: number;
    contraprestacion: string;
  }>;
  rentabilidad_neta_estimada_eur: number;
  viabilidad_confirmada: boolean;
}

export interface EventoParejaBoda {
  id: string;
  pareja: string;
  fecha: string;
  finca_espacio: string;
  paquete: PaqueteBodaTier;
  precio_base_eur: number; // Mínimo 3.800 €
  addons_seleccionados: AddonServicio[];
  precio_total_eur: number;
  costes_directos_eur: number; // Personal, músicos, kilometraje y dietas
  margen_bruto_pct: number; // Umbral mínimo: >= 58%
  timings: TimingMinutoAMinuto[];
  repertorio_preferente: string[];
}

export interface FechaSenalada {
  id: string;
  campana: 'dia_de_la_madre' | 'dia_del_padre' | 'aniversarios' | 'navidad_campanadas' | 'galas_estivales';
  temporada: string;
  multiplicador_tarifa: number; // 1.8x a 2.5x en fechas críticas
  cache_base_eur: number;
  tipo_experiencia: 'serenata_privada' | 'micro_concierto' | 'cotillon_gala' | 'gala_corporativa';
  protocolo_fidelizacion: {
    recordatorio_automatico_dias_previos: number;
    incentivo_recontratacion_pct: number;
    canal_contacto: 'whatsapp_vip' | 'llamada_directa';
  };
}

export interface RiderTecnicoEvento {
  id: string;
  evento_id: string;
  potencia_pa_vatios: number; // 12 W/pax en interiores, 18 W/pax exteriores
  canales_microfonia_rf: string[]; // Shure Beta 87A, Axient, GLXD4
  monitoreo: 'in_ear' | 'cunyas_suelo' | 'hibrido';
  iluminacion_dmx: string[]; // Focos robotizados, barras LED arquitectónicas
  tiempos_montaje: {
    hora_llegada_furgon: string;
    hora_prueba_sonido: string;
    hora_apertura_puertas: string;
    tiempo_desmontaje_minutos: number;
  };
  checklist_montaje: Array<{
    tarea: string;
    responsable: string;
    completada: boolean;
    hora_limite: string;
  }>;
}

export interface EventoKnowledgeItem {
  id: string;
  source_file: string;
  sha256: string;
  cluster: EventoClusterKey;
  title: string;
  summary: string;
  content_clean: string;
  affinity_score: number;
  tags: string[];
  operational_rules?: string[];
  ingestion_timestamp: string;
}

export interface EventosKnowledgeBase {
  metadata: {
    system: string;
    version: string;
    last_updated: string;
    total_entries: number;
    cluster_counts: Record<EventoClusterKey, number>;
  };
  operational_thresholds: {
    ticket_suelo_bodas_eur: number; // 3.800 €
    margen_bruto_base_pct: number; // 0.58 (58%)
    tasa_recontratacion_anual_pct: number; // 0.30 (30%)
    coste_desplazamiento_km_eur: number; // 0.45 €/km convoy
    tiempo_limite_preventa_propios_dias: number; // 21 días
    max_eventos_simultaneos_dia: number; // 3 eventos
  };
  clusters_definition: Record<
    EventoClusterKey,
    {
      name: string;
      description: string;
      seed_keywords: string[];
    }
  >;
  items: EventoKnowledgeItem[];
}
