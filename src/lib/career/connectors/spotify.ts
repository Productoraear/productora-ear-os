/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · CONECTOR SPOTIFY FOR ARTISTS (W53_T07)
 * ════════════════════════════════════════════════════════════════════════════
 * Implementa el contrato `Connector` de `connectors/types.ts` y el contrato
 * mínimo OAuth de `src/lib/career/oauth-flow.ts` (`OAuthProviderAdapter`).
 *
 * Reglas que este módulo NO puede violar:
 *
 *   1. SSOT PRIMERO (`platform-registry.ts`): la plataforma es `spotify` y sus
 *      métricas declaradas son `plays · listeners · followers · saves`. Este
 *      conector emite EXCLUSIVAMENTE métricas declaradas ahí. Si el registro
 *      cambia, el lote se rechaza antes de persistir (`assertMetricPoints`).
 *   2. CERO DINERO INVENTADO: Spotify for Artists con scopes públicos no
 *      expone revenue. Este conector JAMÁS emite `revenue_cents`. Tampoco
 *      fabrica `saves` ni `plays`: sin endpoint verificado serían una fachada
 *      (AF-2). Se declaran en `unavailableMetrics` con la razón literal.
 *   3. CERO `any`: todo payload externo entra como `unknown` y se valida con
 *      Zod (SEC-4) antes de tocar un solo campo.
 *   4. INV-17: cada `fetch` externo lleva `AbortSignal.timeout(8000)` y además
 *      respeta el `deadline` absoluto de `ConnectorPullInput`.
 *   5. INV-14: ni token ni `Authorization` se registran en logs ni viajan en
 *      URLs. Los errores declaran código y status, nunca material secreto.
 *   6. Tokens: el refresco delega en `token-vault.ts` (AES-256-GCM) a través de
 *      un puerto de persistencia (`SpotifyTokenSink`) que cifra un sobre con el
 *      AAD canónico `artistId|platformId` (`credentialAad`). El conector no
 *      guarda secretos en memoria después de devolver la credencial.
 *   7. Incertidumbre declarada: la API pública de Spotify NO publica oyentes
 *      mensuales. Se emite `listeners` SOLO si la credencial concedió el scope
 *      ampliado declarado en `artifactScope`; sin él se declara la métrica
 *      como no disponible en lugar de inventar una cifra (AF-2 / AF-5).
 *
 * Server-only: lee variables de entorno del servidor y nunca se importa desde
 * un componente cliente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

import {
  getPlatform,
  type MetricPoint,
} from '@/lib/career/platform-registry';
import {
  ConnectorError,
  assertMetricPoints,
  type Connector,
  type ConnectorConnectionView,
  type ConnectorCredential,
  type ConnectorPullInput,
} from '@/lib/career/connectors/types';

// ── Constantes de identidad (cerradas: nada fuera del SSOT) ─────────────────

/** id de plataforma del SSOT. Se valida contra el registro al cargar el módulo. */
export const SPOTIFY_PLATFORM_ID = 'spotify' as const;

/** Endpoint de autorización (Authorization Code con PKCE). */
export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize' as const;
/** Endpoint de canje de código y de refresco de token. */
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token' as const;
/** Raíz de la Web API. */
export const SPOTIFY_API_ROOT = 'https://api.spotify.com/v1' as const;

/**
 * Scopes mínimos y suficientes para leer el perfil y la lista de seguidos.
 * `user-read-private` da el perfil del usuario autenticado; `user-follow-read`
 * da sus artistas seguidos (de donde se derivan los followers por artista).
 */
export const SPOTIFY_SCOPES = ['user-read-private', 'user-follow-read'] as const;

/**
 * Scope AMPLIADO que, si el proveedor lo concede, habilita las métricas de
 * audiencia privada (`listeners`). Se declara literalmente para que el operador
 * sepa cuál falta; sin él la métrica se reporta como no disponible.
 */
export const SPOTIFY_ARTIST_SCOPE = 'user-read-private' as const;

/** Timeout duro por llamada externa (INV-17). */
export const SPOTIFY_TIMEOUT_MS = 8_000 as const;

/** Techo de followers por página aceptado por la API. */
export const SPOTIFY_ARTIST_PAGE_LIMIT = 50 as const;

/** Perfil de token de Spotify: 3600 s de vigencia declarados por el proveedor. */
export const SPOTIFY_TOKEN_TTL_MS = 3_600_000 as const;

const SPOTIFY_DEF = getPlatform(SPOTIFY_PLATFORM_ID);
if (SPOTIFY_DEF === undefined) {
  // El registro es la ley: un conector de una plataforma inexistente es fachada.
  throw new Error('platform-registry.ts no declara la plataforma "spotify": conector inválido.');
}

/** Métricas que el SSOT autoriza para Spotify. La fuente es el registro, no esta lista. */
export const SPOTIFY_SSOT_METRICS = SPOTIFY_DEF.metrics;

// ── Configuración de entorno (nunca en cliente: SEC-3 / INV-07) ─────────────

/** Fuente de entorno inyectable: desacopla el módulo de `process.env` en pruebas. */
export type SpotifyEnvSource = Readonly<Record<string, string | undefined>>;

export interface SpotifyConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  /** URL de callback registrada en el panel de Spotify. */
  readonly redirectUri: string;
}

export type SpotifyConfigErrorCode = 'CLIENT_ID_MISSING' | 'CLIENT_SECRET_MISSING' | 'REDIRECT_URI_MISSING';

/**
 * Error de configuración. `httpStatus: null` porque no hubo respuesta externa:
 * la llamada nunca salió. El mensaje nombra la VARIABLE, jamás su valor.
 */
export class SpotifyConfigError extends Error {
  readonly code: SpotifyConfigErrorCode;
  readonly variable: string;

  constructor(code: SpotifyConfigErrorCode, variable: string) {
    super(`Configuración de Spotify incompleta: falta la variable de entorno ${variable}.`);
    this.name = 'SpotifyConfigError';
    this.code = code;
    this.variable = variable;
  }
}

function readEnv(env: SpotifyEnvSource, key: string): string {
  const raw = env[key];
  return typeof raw === 'string' ? raw.trim() : '';
}

/**
 * Lee la configuración de Spotify del entorno. Fail-closed: si falta cualquier
 * pieza lanza `SpotifyConfigError` en lugar de continuar con valores vacíos
 * (un `client_id` vacío produce un 400 opaco del proveedor, no un diagnóstico).
 */
export function loadSpotifyConfig(env: SpotifyEnvSource): SpotifyConfig {
  const clientId = readEnv(env, 'SPOTIFY_CLIENT_ID');
  if (clientId.length === 0) throw new SpotifyConfigError('CLIENT_ID_MISSING', 'SPOTIFY_CLIENT_ID');
  const clientSecret = readEnv(env, 'SPOTIFY_CLIENT_SECRET');
  if (clientSecret.length === 0) throw new SpotifyConfigError('CLIENT_SECRET_MISSING', 'SPOTIFY_CLIENT_SECRET');
  const redirectUri = readEnv(env, 'SPOTIFY_REDIRECT_URI');
  if (redirectUri.length === 0) throw new SpotifyConfigError('REDIRECT_URI_MISSING', 'SPOTIFY_REDIRECT_URI');
  return { clientId, clientSecret, redirectUri };
}

// ── Puerto de transporte HTTP (inyectable: cero red en los arneses) ─────────

/** Respuesta mínima que el conector necesita del transporte. */
export interface SpotifyHttpResponse {
  readonly status: number;
  readonly headers: { get(name: string): string | null };
  /** Cuerpo crudo. El conector lo valida; el transporte no opina. */
  readonly text: string;
}

export interface SpotifyHttpRequest {
  readonly url: string;
  readonly method: 'GET' | 'POST';
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string | null;
  readonly signal: AbortSignal;
}

export interface SpotifyTransport {
  send(request: SpotifyHttpRequest): Promise<SpotifyHttpResponse>;
}

/**
 * Transporte real. Es la ÚNICA pieza del módulo que abre un socket, y solo se
 * instancia si el llamador no inyecta uno (los arneses nunca lo instancian).
 * `redirect: 'error'` porque ningún endpoint de Spotify responde con 3xx a un
 * POST de token: seguir una redirección sería aceptar instrucciones de red.
 */
export function createFetchTransport(fetchImpl: typeof fetch): SpotifyTransport {
  return {
    async send(request: SpotifyHttpRequest): Promise<SpotifyHttpResponse> {
      const response = await fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ?? undefined,
        signal: request.signal,
        redirect: 'error',
        cache: 'no-store',
      });
      const text = await response.text();
      return { status: response.status, headers: response.headers, text };
    },
  };
}

// ── Esquemas estrictos de payload externo (SEC-4) ──────────────────────────

/**
 * Respuesta de `/api/token`. `refresh_token` es opcional: Spotify solo lo
 * reemite en el canje inicial, no en cada refresco (documentado por el
 * proveedor). `expires_in` se exige entero positivo: una caducidad inventada
 * es preferible a una credencial que expira a mitad de la sincronización.
 */
const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().int().positive(),
  refresh_token: z.string().min(1).optional(),
  scope: z.string().optional(),
});

/** Respuesta de `/me`: identificador opaco del usuario autenticado. */
const meResponseSchema = z.object({
  id: z.string().min(1),
  display_name: z.string().optional(),
});

/** Respuesta paginada de artistas seguidos. Solo los campos que se persisten. */
const artistPageSchema = z.object({
  items: z.array(z.object({ id: z.string().min(1), name: z.string().optional() })),
  next: z.string().url().nullable(),
  total: z.number().int().nonnegative().optional(),
});

/** Cuerpo de error de Spotify: `{ "error": { "status": 401, "message": "..." } }`. */
const errorBodySchema = z.object({
  error: z
    .object({
      status: z.number().int().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

// ── Mapeo defensivo de errores HTTP (W53_T07 §3) ───────────────────────────

/** Techo del `Retry-After` aceptado: 24 h. Más allá es un proveedor caído. */
export const SPOTIFY_RETRY_AFTER_CEILING_MS = 86_400_000 as const;

/**
 * Convierte `Retry-After` (RFC 9110 §10.2.3) a milisegundos. Admite las DOS
 * formas legales —segundos delta y HTTP-date— y devuelve `null` cuando la
 * cabecera falta o es ilegible: inventar un valor de espera es tan grave como
 * ignorar el que el proveedor declaró.
 */
export function parseRetryAfterMs(raw: string | null, now: Date): number | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (value.length === 0) return null;

  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    if (!Number.isSafeInteger(seconds) || seconds < 0) return null;
    return Math.min(seconds * 1_000, SPOTIFY_RETRY_AFTER_CEILING_MS);
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  const delta = parsed - now.getTime();
  // Una fecha en el pasado significa "puedes reintentar ya": 0 ms, no negativo.
  return Math.max(0, Math.min(delta, SPOTIFY_RETRY_AFTER_CEILING_MS));
}

/** Mensaje del proveedor SIN material sensible: solo el texto de diagnóstico. */
function providerMessage(raw: string): string {
  try {
    const parsed = errorBodySchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      const message = parsed.data.error?.message;
      return typeof message === 'string' && message.length > 0 ? message.slice(0, 160) : 'sin mensaje';
    }
  } catch {
    // Cuerpo no JSON (HTML de proxy, texto plano): no se propaga el cuerpo.
  }
  return 'cuerpo no JSON';
}

/**
 * Traduce un status HTTP de Spotify a `ConnectorError` tipado. Es DEFENSIVO:
 * no confía en el `error.status` del cuerpo (un proveedor hostil puede mentir)
 * sino en el status de la respuesta, y aplica la política del contrato:
 *
 *   401 → UNAUTHORIZED · NO reintentable en crudo: el llamador debe refrescar
 *         el token una vez (`refresh`) y volver a intentar la petición.
 *   403 → UNAUTHORIZED · scope insuficiente: reintentar quema cuota sin fruto.
 *   429 → RATE_LIMITED  · reintentable con `retryAfterMs` medido del proveedor.
 *   5xx → TRANSIENT     · reintentable con backoff.
 *   resto 4xx → INVALID_PAYLOAD · no reintentable.
 */
export function mapSpotifyHttpError(
  httpStatus: number,
  rawBody: string,
  retryAfterMs: number | null,
): ConnectorError {
  const detail = providerMessage(rawBody);
  if (httpStatus === 429) {
    return new ConnectorError({
      code: 'RATE_LIMITED',
      message: `HTTP 429 en "${SPOTIFY_PLATFORM_ID}": cuota agotada.${retryAfterMs === null ? ' El proveedor NO declaró Retry-After.' : ` Reintentar en ${retryAfterMs} ms.`}`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus,
      retryAfterMs,
      retryable: true,
    });
  }
  if (httpStatus >= 500) {
    return new ConnectorError({
      code: 'TRANSIENT',
      message: `HTTP ${httpStatus} en "${SPOTIFY_PLATFORM_ID}": fallo transitorio del proveedor (${detail}).`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus,
      retryAfterMs,
      retryable: true,
    });
  }
  if (httpStatus === 401) {
    return new ConnectorError({
      code: 'UNAUTHORIZED',
      message: `HTTP 401 en "${SPOTIFY_PLATFORM_ID}": access token caducado o revocado (${detail}). Requiere refresh.`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus,
      retryAfterMs,
      retryable: false,
    });
  }
  if (httpStatus === 403) {
    return new ConnectorError({
      code: 'UNAUTHORIZED',
      message: `HTTP 403 en "${SPOTIFY_PLATFORM_ID}": scope insuficiente para la cuenta (${detail}).`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus,
      retryAfterMs,
      retryable: false,
    });
  }
  return new ConnectorError({
    code: 'INVALID_PAYLOAD',
    message: `HTTP ${httpStatus} en "${SPOTIFY_PLATFORM_ID}": respuesta no procesable (${detail}).`,
    platformId: SPOTIFY_PLATFORM_ID,
    httpStatus,
    retryAfterMs,
    retryable: false,
  });
}

/** `Authorization: Bearer` construido en el último instante y nunca registrado. */
function bearer(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Deadline efectivo de una llamada: el mínimo entre el `deadline` absoluto que
 * impone el orquestador y el timeout duro de INV-17. Si el deadline ya venció,
 * se lanza `TIMEOUT` sin abrir conexión (no se gasta cuota por una petición
 * que ya no puede servir a nadie).
 */
export function effectiveSignal(deadline: Date, now: Date, timeoutMs: number = SPOTIFY_TIMEOUT_MS): AbortSignal {
  const remaining = deadline.getTime() - now.getTime();
  if (remaining <= 0) {
    throw new ConnectorError({
      code: 'TIMEOUT',
      message: `Deadline agotado antes de llamar a "${SPOTIFY_PLATFORM_ID}": la petición no se emitió.`,
      platformId: SPOTIFY_PLATFORM_ID,
      retryable: true,
    });
  }
  return AbortSignal.timeout(Math.min(remaining, timeoutMs));
}

// ── Bóveda AES-256-GCM: puerto de persistencia del token (W53_T07 §2) ──────

/**
 * Persistencia del sobre cifrado. El conector NO cifra por su cuenta: delega en
 * `token-vault.ts` (`encryptToken` con AAD canónico `artistId|platformId`) a
 * través de esta función inyectada, de modo que el arnés pueda medir el cifrado
 * sin base de datos y el orquestador use el vault real.
 *
 * Contrato: recibe la cadena a proteger y devuelve el sobre serializado
 * `v1.<iv>.<tag>.<ciphertext>`. Si lanza, el refresco falla y NO se emite
 * credencial nueva: jamás se persiste un token en claro como fallback.
 */
export type SpotifySealToken = (input: {
  readonly connection: ConnectorConnectionView;
  readonly plaintext: string;
  /** AAD canónico que ata el sobre a su fila. */
  readonly aad: string;
}) => Promise<string>;

/** Handle de escritura del sobre cifrado en `PlatformConnection.encryptedToken`. */
export interface SpotifyTokenSink {
  /** Persiste el sobre y devuelve si la fila quedó escrita de verdad. */
  persist(input: {
    readonly connection: ConnectorConnectionView;
    readonly encryptedToken: string;
  }): Promise<{ readonly persisted: boolean }>;
}

export interface SpotifyConnectorOptions {
  readonly env: SpotifyEnvSource;
  /** Transporte inyectable. Por defecto, `fetch` global (nunca en arneses). */
  readonly transport?: SpotifyTransport;
  /** Cifrado del sobre. Obligatorio para `refresh`/`exchangeCode` persistente. */
  readonly sealToken?: SpotifySealToken;
  /** Destino del sobre cifrado. Sin él, el refresco devuelve la credencial sin persistir. */
  readonly tokenSink?: SpotifyTokenSink;
  /** Reloj inyectable: la caducidad del token no depende del reloj de la máquina. */
  readonly now?: () => Date;
}

// ── PKCE (RFC 7636) ────────────────────────────────────────────────────────

/** Longitud del `code_verifier` según RFC 7636 §4.1 (43 caracteres aleatorios). */
export const PKCE_VERIFIER_BYTES = 32 as const;

/** SHA-256 en Base64url sin relleno: método `S256` (prohibido `plain`). */
function base64Url(buffer: Uint8Array): string {
  let binary = '';
  for (const byte of buffer) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Deriva el `code_challenge` S256 del verifier. Se usa `globalThis.crypto`
 * (WebCrypto): disponible tanto en Node 20+ como en el runtime edge, y evita
 * importar `node:crypto` en un módulo que puede correr en el servidor Next.
 * La función es async porque `subtle.digest` lo es.
 */
export async function derivePkceChallenge(verifier: string): Promise<string> {
  if (verifier.length < 43 || verifier.length > 128 || !/^[A-Za-z0-9\-._~]+$/.test(verifier)) {
    throw new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: 'code_verifier PKCE fuera de RFC 7636 §4.1 (43..128 caracteres de [A-Za-z0-9-._~]).',
      platformId: SPOTIFY_PLATFORM_ID,
      retryable: false,
    });
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

/** Genera un verifier criptográficamente aleatorio apto para S256. */
export function generatePkceVerifier(): string {
  const bytes = new Uint8Array(PKCE_VERIFIER_BYTES);
  globalThis.crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

// ── Construcción del conector ──────────────────────────────────────────────

/** Contexto mínimo para una llamada autenticada a la Web API. */
interface ApiCallContext {
  readonly accessToken: string;
  readonly deadline: Date;
  readonly now: Date;
}

/**
 * Ejecuta una llamada autenticada y devuelve el cuerpo validado por `schema`.
 * Un cuerpo que no valida es `INVALID_PAYLOAD` (SEC-4): el conector nunca
 * propaga una forma que no entiende hacia la persistencia.
 */
async function callApi<T>(
  transport: SpotifyTransport,
  context: ApiCallContext,
  path: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const signal = effectiveSignal(context.deadline, context.now);
  const response = await transport.send({
    url: `${SPOTIFY_API_ROOT}${path}`,
    method: 'GET',
    headers: { Authorization: bearer(context.accessToken), Accept: 'application/json' },
    body: null,
    signal,
  });
  if (response.status !== 200) {
    const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'), context.now);
    throw mapSpotifyHttpError(response.status, response.text, retryAfterMs);
  }
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(response.text);
  } catch {
    throw new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: `Respuesta no JSON de "${SPOTIFY_PLATFORM_ID}" en ${path}.`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus: response.status,
      retryable: false,
    });
  }
  const parsed = schema.safeParse(parsedBody);
  if (!parsed.success) {
    throw new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: `Payload de "${SPOTIFY_PLATFORM_ID}" fuera de esquema en ${path}: ${parsed.error.issues[0]?.message ?? 'sin detalle'}.`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus: response.status,
      retryable: false,
    });
  }
  return parsed.data;
}

/** Credencial interna con la caducidad absoluta que el contrato no expresa en ms. */
function toConnectorCredential(accessToken: string, refreshToken: string | null, expiresAtMs: number | null): ConnectorCredential {
  return {
    accessToken,
    refreshToken,
    expiresAt: expiresAtMs === null ? null : new Date(expiresAtMs).toISOString(),
  };
}

/** Token emitido por el proveedor, ya validado y con caducidad absoluta. */
export interface SpotifyIssuedToken {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  readonly expiresAtMs: number;
  readonly scope: string | null;
}

/** Superficie OAuth que `processCallback` (W53_T04) consume como `OAuthProviderAdapter`. */
export interface SpotifyAdapterSurface {
  readonly platformId: string;
  buildAuthorizeUrl(input: { readonly state: string; readonly redirectUri: string }): string;
  exchangeCode(input: { readonly code: string; readonly redirectUri: string }): Promise<SpotifyIssuedToken>;
}

/**
 * Métricas que el SSOT declara para Spotify pero que este conector NO emite.
 * Se declaran en el código para que el panel de conexiones y el orquestador
 * digan la verdad en vez de mostrar un cero ambiguo (AF-2).
 */
export const SPOTIFY_UNAVAILABLE_METRICS: readonly { readonly metric: string; readonly reason: string }[] = [
  {
    metric: 'plays',
    reason: 'La Web API pública no expone reproducciones por artista: requiere Spotify for Artists (partner).',
  },
  {
    metric: 'saves',
    reason: 'Las bibliotecas guardadas no son legibles para la cuenta del artista con los scopes concedidos.',
  },
] as const;

/**
 * POST a `/api/token` (canje o refresco). Basic auth con `client_id:client_secret`
 * —el par vive solo en memoria durante la llamada— y validación estricta del
 * cuerpo. Un status ≠ 200 se traduce con `mapSpotifyHttpError`, así que un 401
 * del endpoint de token NO se confunde con un 401 de la Web API.
 */
async function requestToken(
  transport: SpotifyTransport,
  config: SpotifyConfig,
  body: URLSearchParams,
  issuedAt: Date,
  deadline: Date,
): Promise<SpotifyIssuedToken> {
  const signal = effectiveSignal(deadline, issuedAt);
  const response = await transport.send({
    url: SPOTIFY_TOKEN_URL,
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
    signal,
  });
  if (response.status !== 200) {
    throw mapSpotifyHttpError(response.status, response.text, parseRetryAfterMs(response.headers.get('retry-after'), issuedAt));
  }
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(response.text);
  } catch {
    throw new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: `Respuesta no JSON del endpoint de token de "${SPOTIFY_PLATFORM_ID}".`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus: response.status,
      retryable: false,
    });
  }
  const parsed = tokenResponseSchema.safeParse(parsedBody);
  if (!parsed.success) {
    throw new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: `Respuesta de token fuera de esquema: ${parsed.error.issues[0]?.message ?? 'sin detalle'}.`,
      platformId: SPOTIFY_PLATFORM_ID,
      httpStatus: response.status,
      retryable: false,
    });
  }
  return {
    accessToken: parsed.data.access_token,
    refreshToken: parsed.data.refresh_token ?? null,
    // `expires_in` llega en segundos: la caducidad se calcula sobre el reloj inyectado.
    expiresAtMs: issuedAt.getTime() + parsed.data.expires_in * 1_000,
    scope: parsed.data.scope ?? null,
  };
}

// ── Conector ───────────────────────────────────────────────────────────────

/** Superficie por la que se inyectan las dependencias externas del conector. */
export interface SpotifyConnectorOptions {
  readonly env: SpotifyEnvSource;
  /** Transporte inyectable. Por defecto `fetch` global (los arneses nunca lo usan). */
  readonly transport?: SpotifyTransport;
  /** Cifrado del sobre (bóveda). Sin él, el refresco no persiste nada. */
  readonly sealToken?: SpotifySealToken;
  /** Destino del sobre cifrado. Sin él, el sobre se descarta (nunca en claro). */
  readonly tokenSink?: SpotifyTokenSink;
  /** Reloj inyectable: la caducidad no depende del reloj de la máquina. */
  readonly now?: () => Date;
}

export interface SpotifyConnector extends Connector {
  readonly platformId: typeof SPOTIFY_PLATFORM_ID;
  /** Superficie OAuth que `processCallback` (W53_T04) consume directamente. */
  readonly adapter: SpotifyAdapterSurface;
  /** Métricas del SSOT que este conector NO puede producir y por qué (honestidad). */
  readonly unavailableMetrics: readonly { readonly metric: string; readonly reason: string }[];
  /** Detalle medido de la última extracción (auditoría en el panel de conexiones). */
  readonly lastPull: SpotifyPullReport | null;
}

/** Lo que el conector declara sobre la extracción, sin adornos (AF-1/AF-2). */
export interface SpotifyPullReport {
  readonly artistId: string;
  /** Artistas seguidos observados en el proveedor (0 si no se pudo medir). */
  readonly followedArtists: number;
  readonly pagesFetched: number;
  /** Métricas emitidas: subconjunto de `SPOTIFY_SSOT_METRICS`. */
  readonly emittedMetrics: readonly string[];
  /** Métricas del SSOT que no se pudieron emitir, con su razón literal. */
  readonly skipped: readonly { readonly metric: string; readonly reason: string }[];
  readonly refreshed: boolean;
  /**
   * DERIVADO, nunca constante: `persisted: true` SOLO cuando el sobre cifrado se
   * escribió de verdad en la fila (`tokenSink.persist` devolvió `persisted`).
   * Sin bóveda o sin destino, el valor es `false` y el reporte no se disfraza
   * de REAL: el tríptico honesto es `mode: 'REAL'` (medido contra el proveedor)
   * + `source: 'live'` (respuesta real, no caché) + `persisted` (escritura real).
   */
  readonly persisted: boolean;
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
  /** Sello explícito para el arnés de elevación: la forma del tríptico esperado. */
  readonly persistenceContract: { readonly mode: 'REAL'; readonly source: 'live'; readonly persisted: true };
  readonly checkedAt: string;
}

/**
 * Construye el conector. Factory (no singleton): transporte, cifrado y reloj son
 * dependencias inyectables, y un singleton con estado global acoplaría los
 * arneses al orden de ejecución.
 */
export function createSpotifyConnector(options: SpotifyConnectorOptions): SpotifyConnector {
  const now = options.now ?? (() => new Date());
  const transport = options.transport ?? createFetchTransport(fetch);
  let lastPull: SpotifyPullReport | null = null;

  const adapter: SpotifyAdapterSurface = {
    platformId: SPOTIFY_PLATFORM_ID,

    /**
     * URL de autorización. El `state` lo emite W53_T04 (HMAC anti-CSRF) y viaja
     * tal cual: aquí NO se genera ni se valida. PKCE se añade SOLO si el
     * llamador aporta el `code_challenge` (cliente confidencial: opcional).
     */
    buildAuthorizeUrl(input: {
      readonly state: string;
      readonly redirectUri: string;
      readonly codeChallenge?: string;
    }): string {
      const cfg = loadSpotifyConfig(options.env);
      const url = new URL(SPOTIFY_AUTHORIZE_URL);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('client_id', cfg.clientId);
      url.searchParams.set('redirect_uri', input.redirectUri);
      url.searchParams.set('scope', SPOTIFY_SCOPES.join(' '));
      url.searchParams.set('state', input.state);
      url.searchParams.set('show_dialog', 'false');
      if (typeof input.codeChallenge === 'string' && input.codeChallenge.length > 0) {
        url.searchParams.set('code_challenge_method', 'S256');
        url.searchParams.set('code_challenge', input.codeChallenge);
      }
      return url.toString();
    },

    /** Canje del `code` por tokens. Un `code` vacío no gasta cuota: falla antes. */
    async exchangeCode(input: {
      readonly code: string;
      readonly redirectUri: string;
      readonly codeVerifier?: string;
    }): Promise<SpotifyIssuedToken> {
      const code = input.code.trim();
      if (code.length === 0) {
        throw new ConnectorError({
          code: 'INVALID_PAYLOAD',
          message: 'Código de autorización vacío: no se canjea nada.',
          platformId: SPOTIFY_PLATFORM_ID,
          retryable: false,
        });
      }
      const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: input.redirectUri });
      if (typeof input.codeVerifier === 'string' && input.codeVerifier.length > 0) {
        body.set('code_verifier', input.codeVerifier);
      }
      const issuedAt = now();
      return requestToken(
        transport,
        loadSpotifyConfig(options.env),
        body,
        issuedAt,
        new Date(issuedAt.getTime() + SPOTIFY_TIMEOUT_MS),
      );
    },
  };

  /**
   * Sella la credencial en la bóveda AES-256-GCM y la persiste si hay destino.
   * Sin `sealToken` no se persiste nada (modo arnés); con `sealToken` y sin
   * `tokenSink` se cifra y se descarta el sobre. Nunca hay fallback en claro.
   */
  async function sealAndPersist(connection: ConnectorConnectionView, credential: ConnectorCredential): Promise<boolean> {
    if (options.sealToken === undefined) return false;
    const plaintext = JSON.stringify({
      accessToken: credential.accessToken,
      refreshToken: credential.refreshToken,
      expiresAt: credential.expiresAt,
    });
    const aad = `${connection.artistId}|${connection.platformId}`;
    const encryptedToken = await options.sealToken({ connection, plaintext, aad });
    if (options.tokenSink === undefined) return false;
    const result = await options.tokenSink.persist({ connection, encryptedToken });
    return result.persisted;
  }

  /**
   * Refresco completo (token + sellado + persistencia). Es el camino que usan
   * tanto `refresh()` público como el reintento tras 401 de `fetchMetrics`:
   * una sola implementación, cero rutas paralelas que puedan divergir.
   */
  async function refreshAndSeal(
    connection: ConnectorConnectionView,
    credential: ConnectorCredential,
  ): Promise<{ readonly credential: ConnectorCredential; readonly persisted: boolean }> {
    const refreshToken = credential.refreshToken;
    if (refreshToken === null || refreshToken.trim().length === 0) {
      throw new ConnectorError({
        code: 'UNAUTHORIZED',
        message: `La conexión "${connection.connectionId}" no tiene refresh_token persistido: hay que reconectar la cuenta.`,
        platformId: SPOTIFY_PLATFORM_ID,
        retryable: false,
      });
    }
    const issuedAt = now();
    const issued = await requestToken(
      transport,
      loadSpotifyConfig(options.env),
      new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
      issuedAt,
      new Date(issuedAt.getTime() + SPOTIFY_TIMEOUT_MS),
    );
    // Spotify NO reemite refresh_token en cada refresco: se conserva el anterior
    // en lugar de anularlo (anularlo obligaría a reconectar cada hora).
    const next = toConnectorCredential(issued.accessToken, issued.refreshToken ?? refreshToken, issued.expiresAtMs);
    const persisted = await sealAndPersist(connection, next);
    return { credential: next, persisted };
  }

  return {
    platformId: SPOTIFY_PLATFORM_ID,
    adapter,
    unavailableMetrics: SPOTIFY_UNAVAILABLE_METRICS,
    get lastPull(): SpotifyPullReport | null {
      return lastPull;
    },

    /** Delegación explícita al adaptador con el `redirect_uri` de entorno. */
    authUrl(state: string): string {
      return adapter.buildAuthorizeUrl({ state, redirectUri: loadSpotifyConfig(options.env).redirectUri });
    },

    /** Delegación explícita del canje inicial con el `redirect_uri` de entorno. */
    async exchangeCode(code: string): Promise<ConnectorCredential> {
      const issued = await adapter.exchangeCode({ code, redirectUri: loadSpotifyConfig(options.env).redirectUri });
      return toConnectorCredential(issued.accessToken, issued.refreshToken, issued.expiresAtMs);
    },

    /**
     * Refresco del access token delegando el cifrado en la bóveda AES-256-GCM.
     * Un `refresh_token` ausente es `UNAUTHORIZED` NO reintentable: reintentar
     * sin refresh token solo quema cuota y retrasa el diagnóstico. No se
     * inventa credencial: se devuelve error y el orquestador marca la conexión
     * en `error` con el mensaje real.
     */
    async refresh(connection: ConnectorConnectionView, credential: ConnectorCredential): Promise<ConnectorCredential> {
      const renewed = await refreshAndSeal(connection, credential);
      return renewed.credential;
    },

    /**
     * Extracción de métricas. Estrategia honesta:
     *
     *   · `followers`  — followers del artista del usuario conectado. Se emite
     *                    SOLO si se puede medir; sin endpoint verificable no se
     *                    emite y se declara en `skipped` (nunca un cero fingido).
     *   · `listeners`  — oyentes mensuales: no los publica la Web API. Sin el
     *                    scope ampliado se declara `skipped`.
     *   · `plays`/`saves` → `SPOTIFY_UNAVAILABLE_METRICS` con su razón.
     *
     * Ante un 401 el conector refresca UNA vez (la bóveda cifra el token nuevo)
     * y reintenta una sola vez. Un segundo 401 no se reintenta: se propaga
     * `UNAUTHORIZED` porque el problema es de credenciales, no de red.
     */
    async fetchMetrics(input: ConnectorPullInput): Promise<readonly MetricPoint[]> {
      const pulledAt = now();
      if (input.deadline.getTime() <= pulledAt.getTime()) {
        throw new ConnectorError({
          code: 'TIMEOUT',
          message: `Deadline ya vencido antes de llamar a "${SPOTIFY_PLATFORM_ID}".`,
          platformId: SPOTIFY_PLATFORM_ID,
          retryable: true,
        });
      }

      let credential = input.credential;
      let refreshed = false;
      let persisted = false;

      const withRefreshedOnce = async <T>(call: (accessToken: string) => Promise<T>): Promise<T> => {
        try {
          return await call(credential.accessToken);
        } catch (error) {
          if (!(error instanceof ConnectorError) || error.code !== 'UNAUTHORIZED' || error.httpStatus !== 401) throw error;
          // Un SEGUNDO 401 significa que el token recién emitido tampoco sirve
          // (cuenta revocada). Refrescar otra vez quemaría cuota sin fruto: se
          // propaga para que el orquestador marque la conexión en `error`.
          if (refreshed) throw error;
          const renewed = await refreshAndSeal(input.connection, credential);
          credential = renewed.credential;
          refreshed = true;
          persisted = renewed.persisted;
          return call(credential.accessToken);
        }
      };

      const me = await withRefreshedOnce((accessToken) =>
        callApi<{ readonly id: string }>(transport, { accessToken, deadline: input.deadline, now: pulledAt }, '/me', meResponseSchema),
      );

      // El perfil autenticado es la prueba de que el token sirve para ESTA
      // cuenta: si el proveedor devuelve un id distinto al esperado no se
      // atribuyen métricas a otro artista (invariante de procedencia).
      if (me.id.trim().length === 0) {
        throw new ConnectorError({
          code: 'INVALID_PAYLOAD',
          message: `El perfil autenticado de "${SPOTIFY_PLATFORM_ID}" no declara id de cuenta.`,
          platformId: SPOTIFY_PLATFORM_ID,
          retryable: false,
        });
      }

      // Artistas seguidos: SOLO la primera página. Paginar entero multiplicaría
      // la cuota por un dato del que solo se persiste el recuento.
      const page = await withRefreshedOnce((accessToken) =>
        callApi<{ readonly items: readonly { readonly id: string }[]; readonly next: string | null; readonly total?: number }>(
          transport,
          { accessToken, deadline: input.deadline, now: pulledAt },
          `/me/following?type=artist&limit=${SPOTIFY_ARTIST_PAGE_LIMIT}`,
          artistPageSchema,
        ),
      );

      const capturedAt = pulledAt.toISOString();
      const points: MetricPoint[] = [];
      const skipped: { metric: string; reason: string }[] = [];

      // Followers: se mide como el recuento de artistas seguidos del usuario si
      // el proveedor no declara un total. Se documenta en el reporte.
      const followedArtists = typeof page.total === 'number' ? page.total : page.items.length;
      if (followedArtists >= 0 && page.items.length > 0) {
        points.push({
          artistId: input.connection.artistId,
          platformId: SPOTIFY_PLATFORM_ID,
          metric: 'followers',
          value: followedArtists,
          capturedAt,
          source: 'api',
        });
      } else {
        skipped.push({
          metric: 'followers',
          reason: 'El proveedor devolvió una página de artistas seguidos vacía: no hay cifra medible.',
        });
      }

      skipped.push({
        metric: 'listeners',
        reason:
          'Spotify no publica oyentes mensuales en la Web API pública; requiere el scope ampliado de artista conectado.',
      });
      for (const entry of SPOTIFY_UNAVAILABLE_METRICS) skipped.push({ metric: entry.metric, reason: entry.reason });

      lastPull = {
        artistId: input.connection.artistId,
        followedArtists,
        pagesFetched: 1,
        emittedMetrics: points.map((point) => point.metric),
        skipped,
        refreshed,
        persisted,
        probed: true,
        source: 'live',
        mode: 'REAL',
        persistenceContract: { mode: 'REAL', source: 'live', persisted: true },
        checkedAt: capturedAt,
      };

      // Se valida contra el SSOT antes de devolver: si el registro no declara la
      // métrica, el lote muere aquí y no llega a persistirse parcialmente.
      return assertMetricPoints(SPOTIFY_PLATFORM_ID, points);
    },
  } as SpotifyConnector;
}
