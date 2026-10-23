/**
 * ════════════════════════════════════════════════════════════════════════════
 * OPPORTUNITY RADAR — TIPOS CANÓNICOS (CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Contratos tipados estrictos del Radar de Oportunidades EAR OS.
 * Todo item nace de una fuente real (Google Alerts RSS, feed público o TED API).
 * Ningún registro puede fabricarse: si la fuente falla, el radar devuelve vacío.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Origen verificado del aviso. */
export type OpportunitySource =
    | 'GOOGLE_ALERTS_RSS'
    | 'RSS_FEED'
    | 'TED_API';

/** Categorías de negocio que el radar es capaz de cazar. */
export type OpportunityCategory =
    | 'CONVOCATORIA_ARTISTAS'
    | 'CONCURSO_PROYECTOS'
    | 'COMISION_FIESTAS'
    | 'SUBVENCION'
    | 'PLENO_MUNICIPAL'
    | 'VIMUME_SERVICIOS_SOCIALES'
    | 'LICITACION_B2G'
    | 'OTRO';

/** Registro normalizado de una oportunidad real detectada. */
export interface OpportunityRecord {
    /** Huella SHA-256 determinista (idempotencia de despacho). */
    id: string;
    source: OpportunitySource;
    /** URL canónica del feed/origen desde el que se obtuvo. */
    sourceUrl: string;
    title: string;
    description: string;
    /** Enlace directo a la convocatoria/pliego/noticia. */
    url: string;
    publishedAt: string | null;
    categories: OpportunityCategory[];
    /** 0..100 contra el SSOT EAR OS. */
    matchScore: number;
    matchReasons: string[];
    /** true si encaja con el protocolo VIMUME (servicios sociales mayores, <75 dB). */
    vimumeCompatible: boolean;
    firstSeenAt: string;
}

/** Estado persistido del radar (idempotencia entre ejecuciones). */
export interface RadarStore {
    opportunities: OpportunityRecord[];
    /** Huellas ya despachadas para no reenviar el mismo aviso. */
    seenHashes: string[];
    lastScanAt: string | null;
    scanCount: number;
}

/** Resultado agregado de un barrido del radar. */
export interface RadarScanResult {
    ok: boolean;
    source: 'OPPORTUNITY_RADAR' | 'FAIL_CLOSED';
    scannedFeeds: number;
    fetchedCount: number;
    newCount: number;
    highMatchCount: number;
    telegramDispatched: number;
    n8nDispatched: number;
    error: string | null;
    timestamp: string;
}
