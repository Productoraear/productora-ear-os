/**
 * ════════════════════════════════════════════════════════════════════════════
 * SSOT DE CAPACIDADES REALES POR PLATAFORMA — COCKPIT DEL ARTISTA
 * ════════════════════════════════════════════════════════════════════════════
 * Ley Anti-Fachada (AF-1/AF-5): la UI NUNCA puede ofrecer una acción que la
 * plataforma no expone por API. Si no hay API pública, se declara
 * `sin_api_publica` y el panel muestra la vía real (distribuidor / import CSV
 * / exportación manual). Cero botones de "publicar" donde no existe endpoint.
 *
 * Este fichero NO inventa plataformas: reutiliza `src/lib/career/platform-registry.ts`
 * como fuente de ids/labels y añade la capa de CAPACIDAD verificable.
 *
 * Convenciones del repo:
 *   · Tipos readonly + `as const` (cero `any` implícito).
 *   · Toda capacidad declara su vía real cuando no hay API.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { PLATFORMS, type PlatformDef } from '../career/platform-registry';

/** Qué puede hacer el sistema contra la plataforma, sin mentir. */
export type CapabilityState =
  /** Endpoint público verificado: el sistema puede leer y/o escribir de verdad. */
  | 'conectada'
  /** Sólo lectura por API (métricas). Escribir/publicar NO es posible vía API. */
  | 'solo_lectura'
  /** No existe API pública para la función: la vía es distribuidor / CSV / manual. */
  | 'sin_api_publica';

/** Estado de conexión del artista concreto (persistido por artista). */
export type ConnectionState = 'no_conectada' | 'pendiente_oauth' | 'activa' | 'error';

export type CapabilityAction = 'publicar' | 'leer_metricas' | 'editar_metadatos' | 'cobrar';

export interface PlatformCapability {
  /** Id canónico de `platform-registry.ts`. */
  readonly platformId: string;
  readonly label: string;
  readonly state: CapabilityState;
  /** Acciones REALMENTE disponibles por API. Si está vacío, no hay botón. */
  readonly actions: readonly CapabilityAction[];
  /** Vía real cuando `state === 'sin_api_publica'` o para escritura sin API. */
  readonly fallbackPath: string | null;
  /** Motivo técnico exacto y verificable (sin marketing). */
  readonly reason: string;
  /** Documentación oficial de referencia. */
  readonly docs: string;
}

/**
 * Matriz canónica. Sólo plataformas con contrato de API conocido se listan
 * aquí; el resto del registry se considera `sin_api_publica` por defecto
 * (default-deny, SEC-1) hasta que exista conector verificado.
 *
 * Honestidad declarada (no es opinión: es el contrato público de cada API):
 *   · Spotify Web API entrega catálogo y perfiles; la analítica de artistas
 *     vive en Spotify for Artists, sin API pública de subida. La subida va por
 *     distribuidor => `solo_lectura`.
 *   · YouTube Data API v3 permite lectura y subida con OAuth del canal propio.
 *   · Instagram Graph API exige cuenta profesional y app revisada: métricas de
 *     sólo lectura; publicar necesita el permiso adicional `content_publish`.
 */
export const PLATFORM_CAPABILITIES: readonly PlatformCapability[] = [
  {
    platformId: 'spotify',
    label: 'Spotify for Artists',
    state: 'solo_lectura',
    actions: ['leer_metricas'],
    fallbackPath: 'Subida vía distribuidor · métricas privadas por exportación',
    reason:
      'Spotify for Artists no expone API pública de subida ni de analítica de artista. La Web API entrega catálogo y metadatos públicos.',
    docs: 'https://developer.spotify.com/documentation/web-api',
  },
  {
    platformId: 'youtube',
    label: 'YouTube',
    state: 'conectada',
    actions: ['publicar', 'leer_metricas', 'editar_metadatos'],
    fallbackPath: null,
    reason:
      'YouTube Data API v3 permite subida y edición con OAuth del canal propio, y lectura de YouTube Analytics con el scope yt-analytics.readonly.',
    docs: 'https://developers.google.com/youtube/v3',
  },
  {
    platformId: 'instagram',
    label: 'Instagram',
    state: 'solo_lectura',
    actions: ['leer_metricas'],
    fallbackPath: 'Publicación manual desde la app · métricas por Graph API con cuenta profesional',
    reason:
      'Instagram Graph API exige cuenta profesional vinculada a una página y app revisada. Las métricas son de lectura; publicar requiere el permiso content_publish.',
    docs: 'https://developers.facebook.com/docs/instagram-platform',
  },
  {
    platformId: 'tiktok',
    label: 'TikTok',
    state: 'solo_lectura',
    actions: ['leer_metricas'],
    fallbackPath: 'Publicación manual desde la app · métricas por Display API',
    reason:
      'La Display API entrega perfil y vídeos del usuario. La publicación automática exige la Content Posting API con auditoría aprobada.',
    docs: 'https://developers.tiktok.com/doc/content-posting-api-get-started',
  },
  {
    platformId: 'apple-music',
    label: 'Apple Music for Artists',
    state: 'sin_api_publica',
    actions: [],
    fallbackPath: 'Importación CSV de Apple Music for Artists · subida vía distribuidor',
    reason:
      'Apple Music for Artists no publica API de analítica para terceros. MusicKit JS cubre catálogo y reproducción del usuario, no métricas de artista.',
    docs: 'https://developer.apple.com/documentation/applemusicapi',
  },
  {
    platformId: 'bandcamp',
    label: 'Bandcamp',
    state: 'sin_api_publica',
    actions: [],
    fallbackPath: 'Exportación manual de ventas en CSV',
    reason: 'Bandcamp no ofrece API pública de ventas ni de catálogo para terceros.',
    docs: 'https://bandcamp.com',
  },
  {
    platformId: 'distrokid',
    label: 'DistroKid / Distribuidor',
    state: 'sin_api_publica',
    actions: [],
    fallbackPath: 'Importación CSV del informe de regalías del distribuidor',
    reason:
      'Los distribuidores no exponen API de subida para managers. La vía real es el panel del distribuidor más importación CSV.',
    docs: 'https://distrokid.com',
  },
  {
    platformId: 'sgae',
    label: 'SGAE / Sociedades de gestión',
    state: 'sin_api_publica',
    actions: [],
    fallbackPath: 'Liquidaciones en PDF/CSV revisadas manualmente con firma SHA-256',
    reason:
      'Las sociedades de gestión no publican API de reparto de derechos. El expediente se construye con el documento original y su hash.',
    docs: 'https://www.sgae.es',
  },
];

/** Default-deny (SEC-1): lo no declarado nunca se presume conectable. */
const UNKNOWN_CAPABILITY: Omit<PlatformCapability, 'platformId' | 'label' | 'docs'> = {
  state: 'sin_api_publica',
  actions: [],
  fallbackPath: 'Registro manual en el panel del artista',
  reason: 'Sin contrato de API verificado para esta plataforma en el SSOT de capacidades.',
};

function findDefinition(platformId: string): PlatformDef | undefined {
  return PLATFORMS.find((platform) => platform.id === platformId);
}

/**
 * Capacidad de una plataforma. Nunca lanza: si el id no está declarado devuelve
 * `undefined` para que el llamante decida (la UI filtra, no revienta).
 */
export function getPlatformCapability(platformId: string): PlatformCapability | undefined {
  return PLATFORM_CAPABILITIES.find((capability) => capability.platformId === platformId);
}

/** Capacidad efectiva con default-deny aplicado sobre el registry canónico. */
export function resolveCapability(platformId: string): PlatformCapability {
  const declared = getPlatformCapability(platformId);
  if (declared) return declared;

  const definition = findDefinition(platformId);
  return {
    platformId,
    label: definition?.label ?? platformId,
    docs: definition?.docs ?? '',
    ...UNKNOWN_CAPABILITY,
  };
}

/**
 * Cero clics muertos (INV-09): la acción sólo se ofrece si es real.
 * `publicar` sobre Spotify for Artists devuelve `false` por contrato.
 */
export function canPerform(platformId: string, action: CapabilityAction): boolean {
  return resolveCapability(platformId).actions.includes(action);
}

/** El panel sólo pinta el botón de publicar cuando la API lo permite. */
export function isPublishAvailable(platformId: string): boolean {
  return canPerform(platformId, 'publicar');
}

/** Etiqueta honesta para la UI (cero ambigüedad para el artista). */
export function stateLabel(state: CapabilityState): string {
  switch (state) {
    case 'conectada':
      return 'Conectada';
    case 'solo_lectura':
      return 'Solo lectura';
    case 'sin_api_publica':
      return 'Sin API pública';
    default:
      return 'Sin API pública';
  }
}

/** Plataformas ordenadas para el cockpit: primero las que permiten publicar. */
export function orderedCapabilities(): readonly PlatformCapability[] {
  const weight: Record<CapabilityState, number> = {
    conectada: 0,
    solo_lectura: 1,
    sin_api_publica: 2,
  };
  return [...PLATFORM_CAPABILITIES].sort((a, b) => weight[a.state] - weight[b.state]);
}
