/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · FLUJO OAUTH GENÉRICO CONNECT/CALLBACK (W53_T04)
 * ════════════════════════════════════════════════════════════════════════════
 * Motor único de las rutas `/connect/[provider]` y `/callback/[provider]`.
 * Las rutas son cáscaras cortas; TODA la decisión de seguridad vive aquí para
 * que un cambio de política no se aplique en dos sitios a medias.
 *
 * Contrato de seguridad (NO negociable):
 *
 *   1. ANTI-CSRF (`state`): token firmado con HMAC-SHA256 sobre el payload
 *      canónico. Un `state` manipulado, expirado, de otro artista, de otro
 *      proveedor o sin firma se RECHAZA antes de tocar la red.
 *   2. TTL 10 MINUTOS: la expiración viaja DENTRO del payload firmado. No se
 *      acepta un `exp` alterado porque el `exp` está cubierto por el MAC.
 *   3. NONCE: 16 bytes aleatorios por intento (2^128). Sin replay idéntico.
 *   4. COMPARACIÓN EN TIEMPO CONSTANTE (`timingSafeEqual`): validar la firma
 *      no filtra el prefijo correcto por temporización.
 *   5. CIFRADO INMEDIATO: `access_token` y `refresh_token` se cifran con el
 *      vault de W53_T02 (AES-256-GCM, AAD `artistId|platformId`) ANTES de
 *      cualquier escritura. El texto plano no sale de esta función.
 *   6. CERO SECRETOS EN LA URL: la redirección de error solo porta un CÓDIGO
 *      (`error=state_bad_signature`). Ni tokens, ni mensajes del proveedor, ni
 *      stack, ni la query original. El detalle técnico se queda en el servidor.
 *   7. ESTADO HONESTO: sin `CAREER_TOKEN_KEY` no se persiste nada y se devuelve
 *      `VAULT_UNCONFIGURED` (503). Prohibido degradar a texto plano (AF-5).
 *
 * Cero `any`. Cero log de tokens (INV-14). Server-only (`node:crypto`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';

import { getPlatform, type PlatformDef } from '@/lib/career/platform-registry';
import { decryptToken, encryptToken, type VaultKeySource } from '@/lib/career/token-vault';

// ── Constantes del contrato ─────────────────────────────────────────────────

/** Variable de entorno que porta el secreto HMAC del `state` (Base64 de >= 32 bytes). */
export const OAUTH_STATE_SECRET_ENV = 'CAREER_OAUTH_STATE_SECRET' as const;
/** Vida del `state`: 10 minutos. Ni una hora de ventana de replay. */
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
/** 16 bytes de nonce por intento = 2^128 combinaciones (colisión imposible). */
export const OAUTH_STATE_NONCE_BYTES = 16;
/** Timeout duro de la llamada de intercambio contra el proveedor (INV-17). */
export const OAUTH_EXCHANGE_TIMEOUT_MS = 8_000;
/** Ruta canónica de callback que el proveedor debe tener registrada. */
export const OAUTH_CALLBACK_PATH = '/api/artist/career/callback' as const;
/** Marca de persistencia honesta del tríptico SOTA_2026_ELEVATION. */
export const OAUTH_PERSISTENCE_MARKERS = {
  mode: 'REAL',
  source: 'live',
  persisted: true,
} as const;

// ── Errores tipados ─────────────────────────────────────────────────────────

export type OAuthErrorCode =
  | 'PROVIDER_UNKNOWN'
  | 'PROVIDER_NOT_OAUTH'
  | 'CONNECTOR_NOT_REGISTERED'
  | 'SECRET_MISSING'
  | 'STATE_MALFORMED'
  | 'STATE_BAD_SIGNATURE'
  | 'STATE_EXPIRED'
  | 'STATE_PROVIDER_MISMATCH'
  | 'STATE_ARTIST_MISMATCH'
  | 'PROVIDER_DENIED'
  | 'EXCHANGE_FAILED'
  | 'VAULT_UNCONFIGURED'
  | 'PERSIST_FAILED';

/**
 * Error del flujo. `publicCode` es lo ÚNICO que viaja a la URL: un identificador
 * cerrado, nunca un mensaje que pueda arrastrar un token o una traza.
 */
export class OAuthFlowError extends Error {
  readonly code: OAuthErrorCode;
  readonly httpStatus: number;

  constructor(code: OAuthErrorCode, httpStatus: number, message: string) {
    super(message);
    this.name = 'OAuthFlowError';
    this.code = code;
    this.httpStatus = httpStatus;
  }

  /** Código seguro para la query de redirección (sin espacios, sin secretos). */
  get publicCode(): string {
    return this.code.toLowerCase();
  }
}

// ── `state` firmado (HMAC-SHA256) ───────────────────────────────────────────

/** Payload que viaja DENTRO del `state`: identidad y ventana, jamás un secreto. */
const statePayloadSchema = z.object({
  /** Id del artista que inició la conexión. */
  a: z.string().min(1).max(128),
  /** Id de plataforma del SSOT (`platform-registry.ts`). */
  p: z.string().min(1).max(64),
  /** Emisión en ms desde epoch. */
  iat: z.number().int().nonnegative(),
  /** Expiración en ms desde epoch. */
  exp: z.number().int().nonnegative(),
  /** Nonce aleatorio Base64url. */
  n: z.string().min(8).max(64),
});

export type OAuthStatePayload = z.infer<typeof statePayloadSchema>;

/** Vista pública del `state` ya validado. */
export interface VerifiedOAuthState {
  readonly artistId: string;
  readonly platformId: string;
  readonly issuedAt: number;
  readonly expiresAt: number;
}

const BASE64URL_RE = /^[A-Za-z0-9_-]+$/;

function toBase64url(input: Buffer | string): string {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64');
}

/**
 * Secreto HMAC del `state`. Acepta inyección de entorno para que el arnés no
 * dependa de `process.env` global. Un secreto de menos de 32 bytes se rechaza:
 * un HMAC con entropía ridícula no protege el flujo y muere antes de firmar.
 */
export function loadStateSecret(env: VaultKeySource = process.env): Buffer {
  const raw = env[OAUTH_STATE_SECRET_ENV];
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    throw new OAuthFlowError(
      'SECRET_MISSING',
      503,
      `${OAUTH_STATE_SECRET_ENV} no está definido: no se puede firmar el state anti-CSRF.`,
    );
  }
  const secret = Buffer.from(raw.trim(), 'base64');
  if (secret.length < 32) {
    throw new OAuthFlowError(
      'SECRET_MISSING',
      503,
      `${OAUTH_STATE_SECRET_ENV} debe ser Base64 de >= 32 bytes (recibidos ${secret.length}).`,
    );
  }
  return secret;
}

/** Genera un secreto utilizable en despliegue o arnés (no se persiste aquí). */
export function generateStateSecret(): string {
  return randomBytes(32).toString('base64');
}

function signState(payloadSegment: string, secret: Buffer): string {
  return toBase64url(createHmac('sha256', secret).update(payloadSegment, 'utf8').digest());
}

/** Opciones de emisión: permiten fijar reloj, secreto y TTL (pruebas deterministas). */
export interface IssueStateOptions {
  readonly env?: VaultKeySource;
  readonly now?: () => number;
  readonly ttlMs?: number;
}

/**
 * Emite un `state` firmado con la forma `<payloadBase64url>.<hmacBase64url>`.
 * El payload es JSON con orden de claves fijo para que la firma sea estable.
 */
export function issueOAuthState(
  artistId: string,
  platformId: string,
  options: IssueStateOptions = {},
): string {
  if (artistId.trim().length === 0) {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'artistId vacío: no se firma un state anónimo.');
  }
  const secret = loadStateSecret(options.env ?? process.env);
  const nowFn = options.now ?? Date.now;
  const ttl = options.ttlMs ?? OAUTH_STATE_TTL_MS;
  if (!Number.isInteger(ttl) || ttl <= 0) {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'ttlMs inválido.');
  }

  const issuedAt = nowFn();
  const payload: OAuthStatePayload = {
    a: artistId,
    p: platformId,
    iat: issuedAt,
    exp: issuedAt + ttl,
    n: toBase64url(randomBytes(OAUTH_STATE_NONCE_BYTES)),
  };
  const segment = toBase64url(JSON.stringify(payload));
  return `${segment}.${signState(segment, secret)}`;
}

export interface VerifyStateOptions {
  readonly env?: VaultKeySource;
  readonly now?: () => number;
  /**
   * Si se declara, el `state` debe corresponder a ESTE artista. Defensa en
   * profundidad: la ruta lo rellena cuando exista sesión resuelta.
   */
  readonly expectedArtistId?: string;
}

/**
 * Valida el `state` recibido en el callback. Orden deliberado:
 * estructura → firma → expiración → proveedor → artista.
 * La firma se verifica ANTES de leer `exp`, así un `exp` inventado no adelanta
 * el reloj: el payload no autenticado no se interpreta jamás.
 */
export function verifyOAuthState(
  received: string | null,
  platformId: string,
  options: VerifyStateOptions = {},
): VerifiedOAuthState {
  if (typeof received !== 'string' || received.length === 0) {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'Falta el parámetro state.');
  }
  const parts = received.split('.');
  if (parts.length !== 2) {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'El state no tiene la forma payload.firma.');
  }
  const payloadSegment = parts[0] ?? '';
  const signatureSegment = parts[1] ?? '';
  if (!BASE64URL_RE.test(payloadSegment) || !BASE64URL_RE.test(signatureSegment)) {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'El state contiene caracteres fuera de Base64url.');
  }

  const secret = loadStateSecret(options.env ?? process.env);
  const expectedSignature = signState(payloadSegment, secret);
  const provided = Buffer.from(signatureSegment, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');
  // Longitud distinta = firma inválida; el resto se compara en tiempo constante.
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    throw new OAuthFlowError('STATE_BAD_SIGNATURE', 400, 'Firma del state inválida: posible manipulación CSRF.');
  }

  let decoded: unknown;
  try {
    decoded = JSON.parse(fromBase64url(payloadSegment).toString('utf8'));
  } catch {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'Payload del state ilegible.');
  }
  const parsed = statePayloadSchema.safeParse(decoded);
  if (!parsed.success) {
    throw new OAuthFlowError('STATE_MALFORMED', 400, 'Payload del state con forma inválida.');
  }
  const payload = parsed.data;

  const now = (options.now ?? Date.now)();
  if (payload.exp <= now) {
    throw new OAuthFlowError('STATE_EXPIRED', 400, 'El state expiró: reinicia la conexión desde el panel.');
  }
  if (payload.iat > now) {
    throw new OAuthFlowError('STATE_EXPIRED', 400, 'El state fue emitido en el futuro: reloj o manipulación.');
  }
  if (payload.p !== platformId) {
    throw new OAuthFlowError(
      'STATE_PROVIDER_MISMATCH',
      400,
      'El state fue emitido para otro proveedor: no se reutiliza entre plataformas.',
    );
  }
  if (options.expectedArtistId !== undefined && payload.a !== options.expectedArtistId) {
    throw new OAuthFlowError('STATE_ARTIST_MISMATCH', 403, 'El state pertenece a otro artista.');
  }

  return {
    artistId: payload.a,
    platformId: payload.p,
    issuedAt: payload.iat,
    expiresAt: payload.exp,
  };
}

// ── Resolución de proveedor contra el SSOT ──────────────────────────────────

/**
 * Resuelve el proveedor y exige que el SSOT lo declare `oauth_api`.
 * Una plataforma de importación CSV (`syncMode` distinto) NO tiene flujo OAuth:
 * devolverla como conectable sería una fachada (AF-2 / AF-5).
 */
export function resolveOAuthProvider(rawProvider: string): PlatformDef {
  const def = getPlatform(rawProvider);
  if (def === undefined) {
    throw new OAuthFlowError(
      'PROVIDER_UNKNOWN',
      404,
      `Proveedor "${rawProvider}" fuera de platform-registry.ts: prohibido inventar plataformas.`,
    );
  }
  if (def.syncMode !== 'oauth_api') {
    throw new OAuthFlowError(
      'PROVIDER_NOT_OAUTH',
      400,
      `"${def.id}" se sincroniza por ${def.syncMode}, no por OAuth: no hay authorizeUrl que emitir.`,
    );
  }
  return def;
}

/** Base pública del sitio: sin barra final y sin dobles barras en el callback. */
export function resolvePublicBaseUrl(requestUrl: string, env: VaultKeySource = process.env): string {
  const declared = env.NEXT_PUBLIC_APP_URL;
  if (typeof declared === 'string' && declared.trim().length > 0) {
    return declared.trim().replace(/\/+$/, '');
  }
  const parsed = new URL(requestUrl);
  return `${parsed.protocol}//${parsed.host}`;
}

/** URL de callback exigida por el proveedor (debe estar registrada en su panel). */
export function buildCallbackUrl(baseUrl: string, platformId: string): string {
  // `baseUrl` puede llegar con barra final (p. ej. NEXT_PUBLIC_APP_URL): sin
  // normalizar, el redirect_uri saldría con doble barra y el proveedor lo
  // rechazaría por no coincidir con el registrado.
  return `${baseUrl.replace(/\/+$/, '')}${OAUTH_CALLBACK_PATH}/${encodeURIComponent(platformId)}`;
}

// ── Redirecciones sin secretos (SEC-1 / JUR-1) ──────────────────────────────

/** Destino humano del panel de conexiones (nunca una ruta de API). */
export const OAUTH_PANEL_PATH = '/artistas/analytics' as const;

/**
 * Construye la redirección al panel con un resultado CERRADO.
 * Solo viajan `platform` y `status`/`error`, ambos validados contra su enum:
 * ninguna cadena libre del proveedor entra en la URL.
 */
export function buildResultRedirect(
  baseUrl: string,
  platformId: string,
  outcome: { readonly status: 'connected' } | { readonly status: 'error'; readonly error: OAuthErrorCode },
): string {
  const target = new URL(`${baseUrl}${OAUTH_PANEL_PATH}`);
  target.searchParams.set('platform', platformId);
  target.searchParams.set('status', outcome.status);
  if (outcome.status === 'error') target.searchParams.set('error', outcome.error.toLowerCase());
  return target.toString();
}

/**
 * Convierte cualquier fallo en `OAuthFlowError`. Un error no tipado (fetch
 * abortado, JSON roto) se degrada a `EXCHANGE_FAILED`: nunca se propaga su
 * mensaje a la URL porque podría contener el `code` o el token del proveedor.
 */
export function toOAuthFlowError(error: unknown): OAuthFlowError {
  if (error instanceof OAuthFlowError) return error;
  return new OAuthFlowError(
    'EXCHANGE_FAILED',
    502,
    `Intercambio con el proveedor fallido: ${error instanceof Error ? error.name : typeof error}`,
  );
}

// ── Credencial e intercambio de código ──────────────────────────────────────

/**
 * Credencial en TEXTO PLANO tal como la devuelve el proveedor. Vive solo dentro
 * de `processCallback` y muere convertida en sobre cifrado. Nunca se loguea.
 */
export interface OAuthProviderCredential {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  /** Expiración absoluta en ms epoch. null = el proveedor no la declaró. */
  readonly expiresAtMs: number | null;
  /** Scopes realmente concedidos (separados por espacio). Trazabilidad, no secreto. */
  readonly scope: string | null;
}

/** Contrato mínimo de un conector OAuth (lo implementarán W53_T07..W53_T11). */
export interface OAuthProviderAdapter {
  readonly platformId: string;
  /** URL de autorización del proveedor, con `state` y `redirect_uri` ya aplicados. */
  buildAuthorizeUrl(input: {
    readonly state: string;
    readonly redirectUri: string;
  }): string;
  /** Canjea `code` por tokens. Debe usar `AbortSignal.timeout(8000)` (INV-17). */
  exchangeCode(input: {
    readonly code: string;
    readonly redirectUri: string;
  }): Promise<OAuthProviderCredential>;
}

/** Resultado del flujo de callback: lo que la ruta necesita para responder. */
export interface OAuthCallbackSuccess {
  readonly platformId: string;
  readonly artistId: string;
  /** Sobre cifrado ya listo para `PlatformConnection.encryptedToken`. */
  readonly encryptedToken: string;
  /** true solo si se escribió la fila contra la base real. */
  readonly persisted: boolean;
  readonly persistence: { readonly mode: 'REAL'; readonly source: 'live'; readonly persisted: true };
}

/** Handle de persistencia: Prisma real en producción, doble en el arnés. */
export interface OAuthPersistHandle {
  platformConnection: {
    upsert(args: {
      /** Clave única REAL del schema: `@@unique([artistId, platformId], name: "uniq_connection_artist_platform")`. */
      where: { uniq_connection_artist_platform: { artistId: string; platformId: string } };
      create: { artistId: string; platformId: string; status: 'live'; encryptedToken: string };
      update: { status: 'live'; encryptedToken: string; error: null };
      select: { id: true; status: true };
    }): Promise<{ readonly id: string; readonly status: string }>;
  };
}

/**
 * Serializa la credencial a JSON. El refresh token y la expiración viajan juntos
 * dentro del MISMO sobre cifrado: no hay dos columnas que puedan desincronizarse.
 */
export function serializeCredential(credential: OAuthProviderCredential): string {
  if (credential.accessToken.trim().length === 0) {
    throw new OAuthFlowError('EXCHANGE_FAILED', 502, 'El proveedor devolvió un access_token vacío.');
  }
  return JSON.stringify({
    v: 1,
    accessToken: credential.accessToken,
    refreshToken: credential.refreshToken,
    expiresAtMs: credential.expiresAtMs,
    scope: credential.scope,
  });
}

/** AAD del sobre: ata el token a su fila. Mover el sobre a otra fila invalida el tag. */
export function credentialAad(artistId: string, platformId: string): string {
  return `${artistId}|${platformId}`;
}

/**
 * Cifra la credencial con el vault de W53_T02 (AES-256-GCM).
 * Sin `CAREER_TOKEN_KEY` se lanza `VAULT_UNCONFIGURED` (503): jamás se degrada a
 * texto plano para "no romper el flujo" (AF-5).
 */
export function encryptCredential(
  artistId: string,
  platformId: string,
  credential: OAuthProviderCredential,
  env: VaultKeySource = process.env,
): string {
  const plaintext = serializeCredential(credential);
  try {
    return encryptToken(plaintext, { env, aad: credentialAad(artistId, platformId) });
  } catch (error) {
    const detail = error instanceof Error ? error.name : typeof error;
    throw new OAuthFlowError(
      'VAULT_UNCONFIGURED',
      503,
      `No se pudo cifrar la credencial (${detail}): revisa CAREER_TOKEN_KEY.`,
    );
  }
}

/**
 * Descifra un sobre de credencial y devuelve el JSON tipado. Uso exclusivo del
 * orquestador de sincronización (W53_T03) y del arnés: la UI nunca descifra.
 * Un sobre movido a otra fila (AAD distinto) falla aquí, que es exactamente la
 * prueba de que el token está atado a su artista y plataforma.
 */
export function decryptCredential(
  artistId: string,
  platformId: string,
  serialized: string,
  env: VaultKeySource = process.env,
): OAuthProviderCredential {
  const plaintext = decryptToken(serialized, { env, aad: credentialAad(artistId, platformId) });
  const parsed = storedCredentialSchema.safeParse(JSON.parse(plaintext));
  if (!parsed.success) {
    throw new OAuthFlowError('EXCHANGE_FAILED', 500, 'Sobre de credencial con contenido no reconocible.');
  }
  return {
    accessToken: parsed.data.accessToken,
    refreshToken: parsed.data.refreshToken,
    expiresAtMs: parsed.data.expiresAtMs,
    scope: parsed.data.scope,
  };
}

/** Forma del JSON cifrado dentro del sobre (versión 1). */
const storedCredentialSchema = z.object({
  v: z.literal(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable(),
  expiresAtMs: z.number().int().nullable(),
  scope: z.string().nullable(),
});

// ── Puntos de entrada de las rutas (cáscaras delgadas) ──────────────────────

/** Dependencias inyectables: el arnés sustituye red, reloj y persistencia. */
export interface OAuthFlowDeps {
  readonly adapters: (platformId: string) => OAuthProviderAdapter | null;
  readonly client: OAuthPersistHandle;
  readonly env?: VaultKeySource;
  readonly now?: () => number;
}

export interface ConnectResult {
  /** 302 al proveedor. */
  readonly location: string;
  readonly platformId: string;
}

/**
 * GET /connect/[provider]: valida proveedor, emite el `state` firmado y devuelve
 * la URL de autorización del proveedor. El `state` va en la query del PROVEEDOR,
 * nunca en la nuestra: en nuestra URL solo hay `artist` de entrada.
 */
export function startConnect(
  rawProvider: string,
  artistId: string,
  input: { readonly requestUrl: string; readonly deps: OAuthFlowDeps },
): ConnectResult {
  const def = resolveOAuthProvider(rawProvider);
  const adapter = input.deps.adapters(def.id);
  if (adapter === null) {
    throw new OAuthFlowError(
      'CONNECTOR_NOT_REGISTERED',
      501,
      `No hay conector OAuth registrado para "${def.id}": se responde 501, no un redirect falso.`,
    );
  }
  const baseUrl = resolvePublicBaseUrl(input.requestUrl, input.deps.env ?? process.env);
  const redirectUri = buildCallbackUrl(baseUrl, def.id);
  const state = issueOAuthState(artistId, def.id, {
    env: input.deps.env,
    now: input.deps.now,
  });
  const location = adapter.buildAuthorizeUrl({ state, redirectUri });
  // El proveedor debe ser una URL absoluta https: jamás un `javascript:` inyectado.
  const parsed = new URL(location);
  if (parsed.protocol !== 'https:') {
    throw new OAuthFlowError('EXCHANGE_FAILED', 500, `authorizeUrl no es https para "${def.id}".`);
  }
  return { location: parsed.toString(), platformId: def.id };
}

export interface CallbackResult {
  /** 302 al panel con `status=connected` o `status=error&error=<código cerrado>`. */
  readonly location: string;
  readonly platformId: string;
  readonly persisted: boolean;
}

/**
 * GET /callback/[provider]: valida el `state` ANTES de tocar la red, canjea el
 * código, cifra la credencial y persiste la conexión `live`.
 *
 * SEC-1 (default-deny): si `error` viene del proveedor (usuario que deniega) se
 * devuelve `PROVIDER_DENIED` sin llamar a `exchangeCode`.
 */
export async function processCallback(
  rawProvider: string,
  input: {
    readonly code: string | null;
    readonly state: string | null;
    readonly providerError: string | null;
    readonly requestUrl: string;
    readonly deps: OAuthFlowDeps;
  },
): Promise<CallbackResult> {
  const def = resolveOAuthProvider(rawProvider);
  const env = input.deps.env ?? process.env;
  const baseUrl = resolvePublicBaseUrl(input.requestUrl, env);

  if (input.providerError !== null && input.providerError.length > 0) {
    throw new OAuthFlowError('PROVIDER_DENIED', 403, `El proveedor devolvió error="${input.providerError.slice(0, 40)}".`);
  }
  const verified = verifyOAuthState(input.state, def.id, { env, now: input.deps.now });
  if (typeof input.code !== 'string' || input.code.length === 0) {
    throw new OAuthFlowError('EXCHANGE_FAILED', 400, 'Callback sin código de autorización.');
  }
  const adapter = input.deps.adapters(def.id);
  if (adapter === null) {
    throw new OAuthFlowError('CONNECTOR_NOT_REGISTERED', 501, `No hay conector OAuth registrado para "${def.id}".`);
  }

  const redirectUri = buildCallbackUrl(baseUrl, def.id);
  const credential = await adapter.exchangeCode({ code: input.code, redirectUri });
  // Cifrado ANTES de cualquier escritura: el texto plano no llega a la BD.
  const encryptedToken = encryptCredential(verified.artistId, def.id, credential, env);

  try {
    await input.deps.client.platformConnection.upsert({
      where: { uniq_connection_artist_platform: { artistId: verified.artistId, platformId: def.id } },
      create: { artistId: verified.artistId, platformId: def.id, status: 'live', encryptedToken },
      update: { status: 'live', encryptedToken, error: null },
      select: { id: true, status: true },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.name : typeof error;
    throw new OAuthFlowError('PERSIST_FAILED', 500, `No se pudo persistir la conexión (${detail}).`);
  }

  return {
    location: buildResultRedirect(baseUrl, def.id, { status: 'connected' }),
    platformId: def.id,
    persisted: OAUTH_PERSISTENCE_MARKERS.persisted,
  };
}
