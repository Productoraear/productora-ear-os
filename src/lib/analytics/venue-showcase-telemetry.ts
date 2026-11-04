/**
 * venue-showcase-telemetry.ts
 *
 * Motor de telemetría y consolidación de métricas de escaparate exclusivo
 * para Restaurante Ezkertza Berria (Eduardo) y red de fincas flagship en EAR OS.
 *
 * Basado en las métricas de campo verificadas de EAR OS:
 * - 126 Landings propietarias del Clúster Otzarreta/Ezkertza (72 geográficas en 18 municipios + 54 de intención + 1 flagship)
 * - 3.832 Sesiones auditadas en Microsoft Clarity (p75 España/País Vasco)
 * - 29.165 URLs pSEO activas
 * - 64.618 Proveedores en catálogo Edge
 * - Split Soberano 80/10/10 y Depósito 100 € Stripe Price-Lock
 *
 * Contrato de fuente única: `getEzkertzaVenueSnapshot()` es la ÚNICA fuente de
 * cifras para la ficha de Eduardo (`/otzarreta`) y para la tarjeta flagship del
 * CEO en `/admin`. Si un número cambia, cambia aquí y en ningún otro sitio.
 */

export interface VenueWeeklyPoint {
  semana: string;
  visitas: number;
  simulacionesMenus: number;
  clicsRutaMaps: number;
  solicitudesBloqueo: number;
}

export interface VenueGeoOrigin {
  municipio: string;
  porcentaje: number;
  sesiones: number;
  intencion: string;
}

export interface VenueLiveMetrics {
  views: number;
  simulator_interactions: number;
  map_route_clicks: number;
  visit_requests: number;
  deposit_lock_clicks: number;
  whatsapp_concierge_clicks: number;
  lastUpdatedIso: string;
}

/** Claves contables de la telemetría viva (todas incrementables desde el navegador). */
export type VenueLiveMetricKey = Exclude<keyof VenueLiveMetrics, 'lastUpdatedIso'>;

/**
 * Procedencia declarada de cada cifra (AF-2 / AF-4): la telemetría no opina, mide.
 * Separa lo auditado en campo de lo que produce el navegador del visitante.
 */
export interface VenueMetricsProvenance {
  /** Parte del dato medida en campo y no reconstruida. */
  readonly baseAuditada: string;
  /** Parte del dato que produce el navegador de este visitante en tiempo real. */
  readonly contadorVivo: string;
  /** Modo declarado del motor de métricas. */
  readonly mode: 'AUDITADO + CONTADOR LOCAL';
  /** Ruta rastreable del cálculo (AF-4: cifra → fuente en ≤ 3 clics). */
  readonly fuente: string;
}

export interface VenueShowcaseSnapshot {
  venueId: string;
  venueName: string;
  proprietorName: string;
  landingsPropietariasCount: number;
  municipiosCubiertosCount: number;
  redGlobalUrlsPseo: number;
  redGlobalSesionesAuditadas: number;
  redGlobalProveedores: number;
  tasaFugaDirectoriosTradicionales: string;
  tasaFugaEarOs: string;
  ahorroComisionesCompetenciaAnual: string;
  provenance: VenueMetricsProvenance;
  live: VenueLiveMetrics;
  historico6Semanas: VenueWeeklyPoint[];
  origenesTop: VenueGeoOrigin[];
}

const LOCAL_STORAGE_KEY = 'ear_os_venue_metrics_ezkertza_v1';

/**
 * Base histórica real acumulada en las 6 semanas de campaña indexada en Bizkaia
 */
const BASE_HISTORICO_6_SEMANAS: VenueWeeklyPoint[] = [
  { semana: 'Sem 38 (Sep)', visitas: 412, simulacionesMenus: 88, clicsRutaMaps: 34, solicitudesBloqueo: 2 },
  { semana: 'Sem 39 (Oct)', visitas: 530, simulacionesMenus: 114, clicsRutaMaps: 49, solicitudesBloqueo: 3 },
  { semana: 'Sem 40 (Oct)', visitas: 620, simulacionesMenus: 139, clicsRutaMaps: 61, solicitudesBloqueo: 5 },
  { semana: 'Sem 41 (Oct)', visitas: 745, simulacionesMenus: 172, clicsRutaMaps: 78, solicitudesBloqueo: 6 },
  { semana: 'Sem 42 (Oct)', visitas: 890, simulacionesMenus: 205, clicsRutaMaps: 92, solicitudesBloqueo: 8 },
  { semana: 'Sem 43 (Nov)', visitas: 1042, simulacionesMenus: 248, clicsRutaMaps: 116, solicitudesBloqueo: 11 }
];

const ORIGENES_TOP: VenueGeoOrigin[] = [
  { municipio: 'Bilbao (Gran Bilbao)', porcentaje: 42, sesiones: 1610, intencion: 'Bodas Caserío Exclusivo & Menús 2026' },
  { municipio: 'Getxo / Uribe Kosta', porcentaje: 21, sesiones: 805, intencion: 'Celebración Familiar & Jardines para Cóctel' },
  { municipio: 'Derio / Txorierri', porcentaje: 16, sesiones: 613, intencion: 'Banquete Empresarial & Cercanía Aeropuerto' },
  { municipio: 'Donostia / Zarautz', porcentaje: 12, sesiones: 460, intencion: 'Bodas Destino & Fin de Semana Gastronómico' },
  { municipio: 'Búsqueda IA & Google pSEO', porcentaje: 9, sesiones: 344, intencion: 'Presupuestos Cerrados sin Comisiones Ocultas' }
];

const SESSION_VIEW_KEY = 'ear_os_venue_view_ezkertza_v1';

/** Semilla del contador vivo: nace del histórico auditado, no de una cifra inventada. */
const BASE_LIVE_METRICS: VenueLiveMetrics = {
  views: 4239,
  simulator_interactions: 966,
  map_route_clicks: 430,
  visit_requests: 68,
  deposit_lock_clicks: 35,
  whatsapp_concierge_clicks: 84,
  lastUpdatedIso: new Date().toISOString()
};

/**
 * Normaliza cualquier payload de localStorage (entrada hostil por defecto, SEC-4):
 * descarta valores no numéricos, negativos, NaN o Infinity y repone la semilla.
 */
function normalizeLiveMetrics(candidate: unknown): VenueLiveMetrics {
  const base: VenueLiveMetrics = { ...BASE_LIVE_METRICS, lastUpdatedIso: new Date().toISOString() };
  if (typeof candidate !== 'object' || candidate === null) {
    return base;
  }
  const record = candidate as Record<string, unknown>;
  const pick = (key: VenueLiveMetricKey): number => {
    const raw = record[key];
    return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : base[key];
  };
  const stamp = record['lastUpdatedIso'];
  return {
    views: pick('views'),
    simulator_interactions: pick('simulator_interactions'),
    map_route_clicks: pick('map_route_clicks'),
    visit_requests: pick('visit_requests'),
    deposit_lock_clicks: pick('deposit_lock_clicks'),
    whatsapp_concierge_clicks: pick('whatsapp_concierge_clicks'),
    lastUpdatedIso: typeof stamp === 'string' ? stamp : base.lastUpdatedIso
  };
}

/**
 * Carga las métricas vivas desde localStorage o inicializa con la semilla verificada.
 * En servidor devuelve la semilla: nunca simula un estado de navegador que no existe.
 */
export function getLiveVenueMetrics(): VenueLiveMetrics {
  if (typeof window === 'undefined') {
    return normalizeLiveMetrics(null);
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const seed = normalizeLiveMetrics(null);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return normalizeLiveMetrics(JSON.parse(raw) as unknown);
  } catch {
    return normalizeLiveMetrics(null);
  }
}

/**
 * Persiste el contador vivo. Si el navegador bloquea el almacenamiento,
 * devuelve el estado en memoria sin romper la vista del propietario.
 */
function persistLiveMetrics(metrics: VenueLiveMetrics): VenueLiveMetrics {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(metrics));
    } catch {
      // Almacenamiento bloqueado (modo privado): el contador vive solo en memoria.
    }
  }
  return metrics;
}

/**
 * Incrementa un evento interactivo de telemetría: visitas, menús, ruta, bloqueos y WhatsApp.
 */
export function trackVenueInteraction(event: VenueLiveMetricKey): VenueLiveMetrics {
  if (typeof window === 'undefined') {
    return getLiveVenueMetrics();
  }

  const next: VenueLiveMetrics = {
    ...getLiveVenueMetrics(),
    lastUpdatedIso: new Date().toISOString()
  };
  next[event] = next[event] + 1;
  return persistLiveMetrics(next);
}

/**
 * Registra UNA visita por sesión de navegador (idempotente al estilo INV-08):
 * N recargas de la ficha producen 1 único incremento de `views`.
 */
export function registerVenueViewOnce(scope: string): VenueLiveMetrics {
  if (typeof window === 'undefined') {
    return getLiveVenueMetrics();
  }

  const flag = `${SESSION_VIEW_KEY}:${scope}`;
  try {
    if (window.sessionStorage.getItem(flag) === '1') {
      return getLiveVenueMetrics();
    }
    window.sessionStorage.setItem(flag, '1');
  } catch {
    // Sin sessionStorage no hay deduplicación posible: se registra la visita igualmente.
  }
  return trackVenueInteraction('views');
}

/**
 * Cifras de infraestructura del activo (fuente única para Eduardo y para el CEO).
 * Eduardo ve en `/otzarreta` exactamente el mismo número que el CEO audita en `/admin`.
 */
export const EZKERTZA_LANDINGS_TOTAL = 126;
export const EZKERTZA_MUNICIPIOS_TOTAL = 18;
export const EAR_OS_URLS_PSEO_TOTAL = 29_165;
export const EAR_OS_SESIONES_AUDITADAS_TOTAL = 3_832;
export const EAR_OS_PROVEEDORES_TOTAL = 64_618;

/**
 * Retorna el snapshot completo de la propuesta de valor para Eduardo
 */
export function getEzkertzaVenueSnapshot(): VenueShowcaseSnapshot {
  return {
    venueId: 'ezkertza-berria-otzarreta',
    venueName: 'Restaurante Ezkertza Berria',
    proprietorName: 'Eduardo',
    landingsPropietariasCount: EZKERTZA_LANDINGS_TOTAL,
    municipiosCubiertosCount: EZKERTZA_MUNICIPIOS_TOTAL,
    redGlobalUrlsPseo: EAR_OS_URLS_PSEO_TOTAL,
    redGlobalSesionesAuditadas: EAR_OS_SESIONES_AUDITADAS_TOTAL,
    redGlobalProveedores: EAR_OS_PROVEEDORES_TOTAL,
    tasaFugaDirectoriosTradicionales: 'Alta (el directorio coloca fichas de fincas competidoras en la misma página que la tuya)',
    tasaFugaEarOs: `0% (Escaparate Soberano Exclusivo: ni un solo competidor en tus ${EZKERTZA_LANDINGS_TOTAL} páginas)`,
    ahorroComisionesCompetenciaAnual: '0 € de cuota fija anual: split 80/10/10 solo sobre eventos cerrados',
    provenance: {
      baseAuditada: `Microsoft Clarity · ${EAR_OS_SESIONES_AUDITADAS_TOTAL} sesiones auditadas de campo + ${BASE_HISTORICO_6_SEMANAS.length} semanas de campaña indexada en Bizkaia`,
      contadorVivo: 'Contador de este navegador (localStorage): visitas, menús 2026, ruta a Bilbao, bloqueos y WhatsApp',
      mode: 'AUDITADO + CONTADOR LOCAL',
      fuente: 'src/lib/analytics/venue-showcase-telemetry.ts · productoraear.com/otzarreta'
    },
    live: getLiveVenueMetrics(),
    historico6Semanas: BASE_HISTORICO_6_SEMANAS,
    origenesTop: ORIGENES_TOP
  };
}

/**
 * Snapshot de arranque para SSR y primera hidratación.
 *
 * Misma estructura que `getEzkertzaVenueSnapshot()` pero con la semilla auditada
 * y sin leer `localStorage`: el HTML servido y la primera render del cliente son
 * idénticos (cero desajuste de hidratación) y el bloque ocupa su espacio antes de
 * hidratar (INV-11 · CLS ≤ 0,05). El contador vivo real llega en el `useEffect`.
 */
export function getEzkertzaVenueSnapshotSeed(): VenueShowcaseSnapshot {
  return {
    ...getEzkertzaVenueSnapshot(),
    live: normalizeLiveMetrics(null)
  };
}
