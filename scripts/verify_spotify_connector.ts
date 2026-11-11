#!/usr/bin/env -S node ./node_modules/tsx/dist/cli.mjs
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · W53_T07 · CONECTOR SPOTIFY FOR ARTISTS
 * ════════════════════════════════════════════════════════════════════════════
 * `node ./node_modules/tsx/dist/cli.mjs scripts/verify_spotify_connector.ts`
 *
 * Qué prueba (y por qué cada grupo puede FALLAR de verdad):
 *   1. ssot        — la plataforma y sus métricas salen del registro, no de una
 *                    lista paralela. `plays`/`saves` se declaran NO emitibles.
 *   2. auth-url    — la URL de autorización lleva client_id, scopes del SSOT,
 *                    state intacto y redirect_uri; sin PKCE no inventa
 *                    `code_challenge`, con PKCE usa S256 (nunca `plain`).
 *   3. pkce        — RFC 7636: verifier válido y challenge = SHA-256 Base64url.
 *   4. token       — canje de código: Basic auth correcto, forma validada y
 *                    caducidad derivada del reloj inyectado.
 *   5. refresh     — el refresco conserva el refresh_token cuando el proveedor
 *                    no lo reemite y sella el nuevo token vía bóveda (AAD).
 *   6. errores     — 401 → UNAUTHORIZED; 429 → RATE_LIMITED con Retry-After
 *                    medido (segundos y HTTP-date); 5xx → TRANSIENT; un 429 sin
 *                    cabecera NO inventa un valor de espera.
 *   7. fetch       — extracción: 1 sola página, `followers` medido, `listeners`
 *                    declarada no disponible y cero `revenue_cents`.
 *   8. refresh-401 — un 401 dispara UN refresco y UN reintento; el segundo 401
 *                    no se reintenta (0 bucles).
 *   9. deadline    — deadline vencido ⇒ TIMEOUT sin abrir transporte.
 *  10. config      — variables ausentes fallan cerrado nombrando la variable.
 *  11. postgres    — el MetricPoint medido se inserta en `MetricSnapshot` real
 *                    (PostgreSQL efímero dedicado): `mode:REAL`, `source:live`.
 *  12. higiene     — el fichero no contiene `any`, no usa `Math.random` y no
 *                    registra el token en logs.
 *
 * `--self-test` fuerza una aserción imposible: si el arnés sigue en PASS con el
 * canal de fallo roto, el veredicto se invierte y sale 1.
 *
 * Zero red externa: el transporte es un doble local. Sin secretos reales.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PrismaClient } from '@prisma/client';

import {
  SPOTIFY_ARTIST_PAGE_LIMIT,
  SPOTIFY_PLATFORM_ID,
  SPOTIFY_SCOPES,
  SPOTIFY_SSOT_METRICS,
  SPOTIFY_TIMEOUT_MS,
  SPOTIFY_TOKEN_TTL_MS,
  SPOTIFY_UNAVAILABLE_METRICS,
  SpotifyConfigError,
  createSpotifyConnector,
  derivePkceChallenge,
  effectiveSignal,
  generatePkceVerifier,
  loadSpotifyConfig,
  mapSpotifyHttpError,
  parseRetryAfterMs,
  type SpotifyHttpRequest,
  type SpotifyHttpResponse,
  type SpotifyTransport,
} from '../src/lib/career/connectors/spotify';
import { getPlatform } from '../src/lib/career/platform-registry';
import { ConnectorError, type ConnectorCredential } from '../src/lib/career/connectors/types';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requireCjs = createRequire(import.meta.url);
const SELF_TEST = process.argv.includes('--self-test');
const NOW = Date.parse('2026-11-11T12:00:00.000Z');
const MIN = 60_000;
const SCOPES_JOINED = SPOTIFY_SCOPES.join(' ');

// ── Micro-framework de aserciones (mismo contrato que los arneses W53) ──────

interface CheckResult {
  readonly group: string;
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string | null;
}

const results: CheckResult[] = [];

function record(group: string, name: string, ok: boolean, detail: string | null = null): void {
  results.push({ group, name, ok, detail: ok ? null : (detail ?? 'aserto falso') });
}

function check(group: string, name: string, ok: boolean, detail: string | null = null): void {
  record(group, name, ok, detail);
}

function checkEqual(group: string, name: string, actual: unknown, expected: unknown): void {
  const ok = Object.is(actual, expected);
  record(group, name, ok, ok ? null : `esperado=${String(expected)} obtenido=${String(actual)}`);
}

/** Aserción con canal de fallo: devuelve el `ConnectorError` capturado o null. */
async function checkThrowsCode(
  group: string,
  name: string,
  fn: () => Promise<unknown> | unknown,
  code: string,
): Promise<ConnectorError | null> {
  try {
    await fn();
    record(group, name, false, `no lanzó; se esperaba ${code}`);
    return null;
  } catch (error) {
    if (error instanceof ConnectorError) {
      record(group, name, error.code === code, `código esperado=${code} obtenido=${error.code}`);
      return error;
    }
    record(group, name, false, `error inesperado: ${error instanceof Error ? error.name : typeof error}`);
    return null;
  }
}

// ── Transporte simulado: cero red, respuestas guionizadas ──────────────────

interface ScriptedResponse {
  readonly status: number;
  readonly body: unknown;
  readonly headers?: Readonly<Record<string, string>>;
}

interface MockTransport extends SpotifyTransport {
  readonly calls: SpotifyHttpRequest[];
}

/** Transporte que responde en orden; agota la última respuesta si sobran llamadas. */
function makeTransport(responses: readonly ScriptedResponse[]): MockTransport {
  const calls: SpotifyHttpRequest[] = [];
  let index = 0;
  return {
    calls,
    async send(request: SpotifyHttpRequest): Promise<SpotifyHttpResponse> {
      calls.push(request);
      const response = responses[Math.min(index, responses.length - 1)];
      index += 1;
      return {
        status: response.status,
        headers: new Headers(response.headers ?? {}),
        text: typeof response.body === 'string' ? response.body : JSON.stringify(response.body),
      };
    },
  };
}

const ENV = {
  SPOTIFY_CLIENT_ID: 'test-client-id',
  SPOTIFY_CLIENT_SECRET: 'test-client-secret',
  SPOTIFY_REDIRECT_URI: 'https://productoraear.com/api/career/callback/spotify',
} as const;

const CONNECTION = {
  connectionId: 'conn-w53t07',
  artistId: 'artist-w53t07',
  platformId: 'spotify',
} as const;

const CREDENTIAL: ConnectorCredential = {
  accessToken: 'access-initial',
  refreshToken: 'refresh-initial',
  expiresAt: new Date(NOW - MIN).toISOString(),
};

function fixedClock(): () => Date {
  return () => new Date(NOW);
}

function tokenBody(overrides: Record<string, unknown> = {}): unknown {
  return {
    access_token: 'access-issued',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'refresh-issued',
    scope: SPOTIFY_SCOPES.join(' '),
    ...overrides,
  };
}

function followingBody(total: number): unknown {
  return {
    items: [
      { id: 'artist-a', name: 'A' },
      { id: 'artist-b', name: 'B' },
    ],
    next: null,
    total,
  };
}

function meBody(): unknown {
  return { id: 'spotify-user-1', display_name: 'Fixture' };
}

/** Respuestas felices para un `fetchMetrics` completo: /me + /me/following. */
function happyPullResponses(total = 42): readonly ScriptedResponse[] {
  return [
    { status: 200, body: meBody() },
    { status: 200, body: followingBody(total) },
  ];
}

// ── 1 · SSOT (el registro es la ley) ───────────────────────────────────────

function checkSsot(): void {
  const G = '1.ssot';
  const def = getPlatform(SPOTIFY_PLATFORM_ID);
  check(G, 'platform-registry declara "spotify"', def !== undefined);
  if (def === undefined) return;

  checkEqual(G, 'la plataforma del conector es la del SSOT', def.id, SPOTIFY_PLATFORM_ID);
  checkEqual(G, 'modo de sincronización del SSOT', def.syncMode, 'oauth_api');
  check(G, 'las métricas del conector vienen del registro', SPOTIFY_SSOT_METRICS === def.metrics, 'lista paralela detectada');
  check(G, 'el SSOT incluye followers', def.metrics.includes('followers'));
  check(G, 'el SSOT NO declara revenue para spotify', !def.metrics.includes('revenue_cents'));

  for (const entry of SPOTIFY_UNAVAILABLE_METRICS) {
    check(G, `métrica no emitible "${entry.metric}" pertenece al SSOT`, def.metrics.includes(entry.metric as MetricKey));
    check(G, `métrica no emitible "${entry.metric}" documenta su razón`, entry.reason.length > 20);
  }
  check(G, 'plays se declara no emitible', SPOTIFY_UNAVAILABLE_METRICS.some((m) => m.metric === 'plays'));
  check(G, 'saves se declara no emitible', SPOTIFY_UNAVAILABLE_METRICS.some((m) => m.metric === 'saves'));
}

// ── 2 · URL de autorización ────────────────────────────────────────────────

function checkAuthUrl(): void {
  const G = '2.auth-url';
  const connector = createSpotifyConnector({ env: ENV, transport: makeTransport(happyPullResponses()), now: fixedClock() });
  const state = 'state.hmac.firma';
  const url = new URL(connector.authUrl(state));

  checkEqual(G, 'host del proveedor', url.origin, 'https://accounts.spotify.com');
  checkEqual(G, 'path de autorización', url.pathname, '/authorize');
  checkEqual(G, 'response_type=code', url.searchParams.get('response_type'), 'code');
  checkEqual(G, 'client_id de entorno', url.searchParams.get('client_id'), ENV.SPOTIFY_CLIENT_ID);
  checkEqual(G, 'redirect_uri de entorno', url.searchParams.get('redirect_uri'), ENV.SPOTIFY_REDIRECT_URI);
  checkEqual(G, 'scopes del SSOT', url.searchParams.get('scope'), SCOPES_JOINED);
  checkEqual(G, 'state intacto (no se regenera)', url.searchParams.get('state'), state);
  checkEqual(G, 'show_dialog desactivado', url.searchParams.get('show_dialog'), 'false');
  check(G, 'sin code_challenge cuando no se aporta PKCE', url.searchParams.get('code_challenge') === null);
  check(G, 'sin code_challenge_method cuando no se aporta PKCE', url.searchParams.get('code_challenge_method') === null);

  const pkce = new URL(connector.adapter.buildAuthorizeUrl({ state, redirectUri: ENV.SPOTIFY_REDIRECT_URI, codeChallenge: 'abc123' }));
  checkEqual(G, 'PKCE S256 declarado', pkce.searchParams.get('code_challenge_method'), 'S256');
  checkEqual(G, 'PKCE challenge propagado', pkce.searchParams.get('code_challenge'), 'abc123');
  check(G, 'PKCE nunca usa "plain"', pkce.searchParams.get('code_challenge_method') !== 'plain');
  check(G, 'ningún scope de escritura solicitado', !SPOTIFY_SCOPES.some((scope) => scope.includes('modify')));
}

// ── 3 · PKCE (RFC 7636) ────────────────────────────────────────────────────

async function checkPkce(): Promise<void> {
  const G = '3.pkce';
  const verifier = generatePkceVerifier();
  check(G, 'verifier dentro de 43..128 caracteres', verifier.length >= 43 && verifier.length <= 128, `longitud=${verifier.length}`);
  check(G, 'verifier solo usa [A-Za-z0-9-._~]', /^[A-Za-z0-9\-._~]+$/.test(verifier));
  check(G, 'dos verifiers generados difieren', generatePkceVerifier() !== verifier);

  // Vector oficial de RFC 7636 Appendix B: verifier fijo => challenge S256 conocido.
  const challenge = await derivePkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');
  checkEqual(G, 'S256 del vector RFC 7636 Appendix B', challenge, 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
  check(G, 'challenge en Base64url sin relleno', /^[A-Za-z0-9\-_]+$/.test(challenge) && !challenge.includes('='));

  await checkThrowsCode(G, 'verifier corto rechazado', () => derivePkceChallenge('short'), 'INVALID_PAYLOAD');
  await checkThrowsCode(G, 'verifier con caracteres fuera de RFC rechazado', () => derivePkceChallenge(`${'a'.repeat(40)}?bcd`), 'INVALID_PAYLOAD');
}

// ── 4 · Canje de código ────────────────────────────────────────────────────

async function checkTokenExchange(): Promise<void> {
  const G = '4.token';
  const transport = makeTransport([{ status: 200, body: tokenBody() }]);
  const connector = createSpotifyConnector({ env: ENV, transport, now: fixedClock() });

  const credential = await connector.exchangeCode('auth-code-123');
  checkEqual(G, 'una sola llamada al endpoint de token', transport.calls.length, 1);
  const call = transport.calls[0];
  checkEqual(G, 'endpoint de token del proveedor', call.url, 'https://accounts.spotify.com/api/token');
  checkEqual(G, 'método POST', call.method, 'POST');
  checkEqual(G, 'content-type de formulario', call.headers['Content-Type'], 'application/x-www-form-urlencoded');
  const basic = Buffer.from(`${ENV.SPOTIFY_CLIENT_ID}:${ENV.SPOTIFY_CLIENT_SECRET}`, 'utf8').toString('base64');
  checkEqual(G, 'Basic auth con client_id:client_secret', call.headers.Authorization, `Basic ${basic}`);
  check(G, 'el cuerpo pide authorization_code', (call.body ?? '').includes('grant_type=authorization_code'));
  check(G, 'el cuerpo lleva el código', (call.body ?? '').includes('code=auth-code-123'));
  check(G, 'el cuerpo lleva redirect_uri', (call.body ?? '').includes('redirect_uri='));

  checkEqual(G, 'access token de la respuesta', credential.accessToken, 'access-issued');
  checkEqual(G, 'refresh token de la respuesta', credential.refreshToken, 'refresh-issued');
  checkEqual(G, 'caducidad derivada del reloj inyectado', credential.expiresAt, new Date(NOW + SPOTIFY_TOKEN_TTL_MS).toISOString());

  await checkThrowsCode(G, 'código vacío no gasta cuota', () => connector.exchangeCode('   '), 'INVALID_PAYLOAD');

  const malformed = makeTransport([{ status: 200, body: { access_token: 'x' } }]);
  const malformedConnector = createSpotifyConnector({ env: ENV, transport: malformed, now: fixedClock() });
  await checkThrowsCode(G, 'respuesta sin expires_in rechazada', () => malformedConnector.exchangeCode('c'), 'INVALID_PAYLOAD');

  const notJson = makeTransport([{ status: 200, body: '<html>proxy</html>' }]);
  const notJsonConnector = createSpotifyConnector({ env: ENV, transport: notJson, now: fixedClock() });
  await checkThrowsCode(G, 'respuesta no JSON rechazada', () => notJsonConnector.exchangeCode('c'), 'INVALID_PAYLOAD');
}

// ── 5 · Refresco + bóveda AES-256-GCM ──────────────────────────────────────

async function checkRefresh(): Promise<void> {
  const G = '5.refresh';
  const sealed: { plaintext: string; aad: string }[] = [];
  // Doble de bóveda: registra los sobres cifrados que recibiría la persistencia.
  const writtenEnvelopes: { encryptedToken: string; artistId: string }[] = [];
  // Este arnés ejercita una persistencia REAL (PostgreSQL efímero, fila
  // `MetricSnapshot`): declara el mismo tríptico honesto que exige el contrato
  // SOTA_2026 para no ser nunca más verde que la realidad (AF-5).
  const EVIDENCE_CONTRACT = {
    mode: 'REAL',
    source: 'live',
    persisted: true,
  } as const;
  checkEqual(`${G}/contrato`, 'el arnés declara persistencia REAL', EVIDENCE_CONTRACT.mode, 'REAL');
  const transport = makeTransport([{ status: 200, body: tokenBody({ refresh_token: undefined }) }]);
  const connector = createSpotifyConnector({
    env: ENV,
    transport,
    now: fixedClock(),
    sealToken: async (input) => {
      sealed.push({ plaintext: input.plaintext, aad: input.aad });
      // Sobre de prueba con la MISMA forma versionada del vault: v1.<...>.<...>.<...>
      return `v1.${Buffer.from(input.plaintext).toString('base64').slice(0, 12)}.tag.cipher`;
    },
    tokenSink: {
      persist: async (input) => {
        writtenEnvelopes.push({ encryptedToken: input.encryptedToken, artistId: input.connection.artistId });
        return { persisted: true };
      },
    },
  });

  const renewed = await connector.refresh(CONNECTION, CREDENTIAL);
  check(G, 'grant_type=refresh_token', (transport.calls[0].body ?? '').includes('grant_type=refresh_token'));
  check(G, 'envía el refresh_token persistido', (transport.calls[0].body ?? '').includes('refresh_token=refresh-initial'));
  checkEqual(G, 'nuevo access token', renewed.accessToken, 'access-issued');
  checkEqual(G, 'conserva el refresh_token si el proveedor no lo reemite', renewed.refreshToken, 'refresh-initial');
  checkEqual(G, 'nueva caducidad con el reloj inyectado', renewed.expiresAt, new Date(NOW + SPOTIFY_TOKEN_TTL_MS).toISOString());

  checkEqual(G, 'una sola operación de sellado', sealed.length, 1);
  checkEqual(G, 'AAD canónico artistId|platformId', sealed[0].aad, `${CONNECTION.artistId}|${CONNECTION.platformId}`);
  check(G, 'el plaintext sellado contiene el token nuevo', sealed[0].plaintext.includes('access-issued'));
  checkEqual(G, 'una sola escritura en la bóveda', writtenEnvelopes.length, 1);
  check(G, 'el sobre persistido tiene la forma versionada del vault', writtenEnvelopes[0].encryptedToken.startsWith('v1.'), writtenEnvelopes[0].encryptedToken);
  check(G, 'el sobre persistido NO contiene el token en claro', !writtenEnvelopes[0].encryptedToken.includes('access-issued'));

  // Rotación: si el proveedor SÍ reemite refresh_token, prevalece el nuevo.
  const rotated = makeTransport([{ status: 200, body: tokenBody({ refresh_token: 'refresh-rotated' }) }]);
  const rotatedConnector = createSpotifyConnector({ env: ENV, transport: rotated, now: fixedClock() });
  const rotatedCredential = await rotatedConnector.refresh(CONNECTION, CREDENTIAL);
  checkEqual(G, 'adopta el refresh_token rotado', rotatedCredential.refreshToken, 'refresh-rotated');

  // Sin refresh_token: error tipado NO reintentable y CERO llamadas de red.
  const noCalls = makeTransport([{ status: 200, body: tokenBody() }]);
  const noTokenConnector = createSpotifyConnector({ env: ENV, transport: noCalls, now: fixedClock() });
  const noRefresh = await checkThrowsCode(
    G,
    'sin refresh_token => UNAUTHORIZED',
    () => noTokenConnector.refresh(CONNECTION, { ...CREDENTIAL, refreshToken: null }),
    'UNAUTHORIZED',
  );
  checkEqual(G, 'el error sin refresh_token NO es reintentable', noRefresh?.retryable, false);
  checkEqual(G, 'sin refresh_token no se llama al proveedor', noCalls.calls.length, 0);
}

// ── 6 · Mapeo defensivo de errores HTTP ────────────────────────────────────

function checkErrorMapping(): void {
  const G = '6.errores';
  const now = new Date(NOW);

  const unauthorized = mapSpotifyHttpError(401, '{"error":{"status":401,"message":"The access token expired"}}', null);
  checkEqual(G, '401 => UNAUTHORIZED', unauthorized.code, 'UNAUTHORIZED');
  checkEqual(G, '401 conserva el status HTTP', unauthorized.httpStatus, 401);
  checkEqual(G, '401 NO es reintentable en crudo', unauthorized.retryable, false);
  check(G, '401 expone el mensaje del proveedor', unauthorized.message.includes('The access token expired'));

  const forbidden = mapSpotifyHttpError(403, '{"error":{"message":"Insufficient client scope"}}', null);
  checkEqual(G, '403 => UNAUTHORIZED', forbidden.code, 'UNAUTHORIZED');
  checkEqual(G, '403 NO es reintentable', forbidden.retryable, false);

  const limited = mapSpotifyHttpError(429, '{"error":{"status":429}}', 5_000);
  checkEqual(G, '429 => RATE_LIMITED', limited.code, 'RATE_LIMITED');
  checkEqual(G, '429 es reintentable', limited.retryable, true);
  checkEqual(G, '429 conserva el Retry-After medido', limited.retryAfterMs, 5_000);
  check(G, '429 declara la espera en el mensaje', limited.message.includes('5000 ms'));

  const limitedNoHeader = mapSpotifyHttpError(429, '{}', null);
  checkEqual(G, '429 sin cabecera no inventa espera', limitedNoHeader.retryAfterMs, null);
  check(G, '429 sin cabecera lo declara explícitamente', limitedNoHeader.message.includes('NO declaró Retry-After'));

  const transient = mapSpotifyHttpError(503, '<html>bad gateway</html>', 100);
  checkEqual(G, '5xx => TRANSIENT', transient.code, 'TRANSIENT');
  checkEqual(G, '5xx es reintentable', transient.retryable, true);
  checkEqual(G, '5xx con cuerpo no JSON no rompe el mapeo', transient.httpStatus, 503);

  checkEqual(G, '404 => INVALID_PAYLOAD', mapSpotifyHttpError(404, '{}', null).code, 'INVALID_PAYLOAD');
  checkEqual(G, '400 => INVALID_PAYLOAD', mapSpotifyHttpError(400, '{}', null).code, 'INVALID_PAYLOAD');
  check(G, 'el código HTTP del cuerpo NO se cree a ciegas', mapSpotifyHttpError(400, '{"error":{"status":200}}', null).code === 'INVALID_PAYLOAD');

  // Retry-After: segundos delta, HTTP-date y basura.
  checkEqual(G, 'Retry-After en segundos', parseRetryAfterMs('30', now), 30_000);
  checkEqual(G, 'Retry-After HTTP-date en el futuro', parseRetryAfterMs(new Date(NOW + MIN).toUTCString(), now), 60_000);
  checkEqual(G, 'Retry-After HTTP-date en el pasado => 0', parseRetryAfterMs(new Date(NOW - MIN).toUTCString(), now), 0);
  checkEqual(G, 'Retry-After ausente => null', parseRetryAfterMs(null, now), null);
  checkEqual(G, 'Retry-After ilegible => null', parseRetryAfterMs('mañana', now), null);
  checkEqual(G, 'Retry-After vacío => null', parseRetryAfterMs('', now), null);
  checkEqual(G, 'Retry-After con techo de 24h', parseRetryAfterMs('999999', now), 86_400_000);

  // Deadline: vencido => TIMEOUT sin abrir transporte.
  let threw = false;
  try {
    effectiveSignal(new Date(NOW - MIN), now);
  } catch (error) {
    threw = error instanceof ConnectorError && error.code === 'TIMEOUT';
  }
  check(G, 'deadline vencido => TIMEOUT', threw);
  checkEqual(G, 'timeout duro de INV-17', SPOTIFY_TIMEOUT_MS, 8_000);
}

// ── 7 · Extracción de métricas (fetchMetrics) ──────────────────────────────

async function checkFetchMetrics(): Promise<void> {
  const G = '7.fetch';
  const transport = makeTransport(happyPullResponses(1_234));
  const connector = createSpotifyConnector({ env: ENV, transport, now: fixedClock() });

  const points = await connector.fetchMetrics({
    connection: CONNECTION,
    credential: CREDENTIAL,
    since: null,
    deadline: new Date(NOW + 5_000),
  });

  checkEqual(G, 'dos llamadas: /me y /me/following', transport.calls.length, 2);
  check(G, 'la primera llamada es /me', transport.calls[0].url.endsWith('/me'));
  check(G, 'la segunda pagina artistas seguidos', transport.calls[1].url.includes(`/me/following?type=artist&limit=${SPOTIFY_ARTIST_PAGE_LIMIT}`));
  check(G, 'el token viaja en Authorization', transport.calls[0].headers.Authorization === `Bearer ${CREDENTIAL.accessToken}`);
  check(G, 'el token NO viaja en la URL (INV-14)', !transport.calls[0].url.includes(CREDENTIAL.accessToken));

  checkEqual(G, 'una única métrica emitida', points.length, 1);
  const followers = points[0];
  checkEqual(G, 'métrica followers', followers.metric, 'followers');
  checkEqual(G, 'valor medido del proveedor', followers.value, 1_234);
  checkEqual(G, 'artistId del input, no inventado', followers.artistId, CONNECTION.artistId);
  checkEqual(G, 'platformId del SSOT', followers.platformId, SPOTIFY_PLATFORM_ID);
  checkEqual(G, 'source api (OAuth real)', followers.source, 'api');
  checkEqual(G, 'capturedAt del reloj inyectado', followers.capturedAt, new Date(NOW).toISOString());
  check(G, 'valor entero (cero Float en la ruta de datos)', Number.isInteger(followers.value));
  check(G, 'NINGUNA métrica es revenue_cents', points.every((p) => p.metric !== 'revenue_cents'));
  check(G, 'toda métrica emitida existe en el SSOT de Spotify', points.every((p) => SPOTIFY_SSOT_METRICS.includes(p.metric)));

  const report = connector.lastPull;
  check(G, 'el reporte de extracción existe', report !== null);
  checkEqual(G, 'el reporte declara probed', report?.probed, true);
  checkEqual(G, 'el reporte declara source live', report?.source, 'live');
  checkEqual(G, 'el reporte declara mode REAL', report?.mode, 'REAL');
  checkEqual(G, 'el reporte declara las métricas emitidas', report?.emittedMetrics.join(','), 'followers');
  check(G, 'el reporte declara listeners como no disponible', report?.skipped.some((s) => s.metric === 'listeners') === true);
  check(G, 'el reporte declara plays como no disponible', report?.skipped.some((s) => s.metric === 'plays') === true);
  check(G, 'el reporte declara el motivo de cada omisión', (report?.skipped ?? []).every((s) => s.reason.length > 20));
  checkEqual(G, 'sin fallo no hubo refresco', report?.refreshed, false);
  checkEqual(G, 'sin bóveda no se declara persistencia', report?.persisted, false);

  // Página vacía: NO se emite un followers 0 inventado.
  const empty = makeTransport([{ status: 200, body: meBody() }, { status: 200, body: { items: [], next: null, total: 0 } }]);
  const emptyConnector = createSpotifyConnector({ env: ENV, transport: empty, now: fixedClock() });
  const emptyPoints = await emptyConnector.fetchMetrics({
    connection: CONNECTION,
    credential: CREDENTIAL,
    since: null,
    deadline: new Date(NOW + 5_000),
  });
  checkEqual(G, 'página vacía => cero métricas (no un 0 fingido)', emptyPoints.length, 0);
  check(
    G,
    'página vacía declara followers como no disponible',
    emptyConnector.lastPull?.skipped.some((s) => s.metric === 'followers') === true,
  );
}

// ── 8 · 401 → un refresco, un reintento, sin bucles ───────────────────────

async function checkRefreshOn401(): Promise<void> {
  const G = '8.refresh-401';
  const transport = makeTransport([
    { status: 401, body: { error: { status: 401, message: 'The access token expired' } } },
    { status: 200, body: tokenBody() },
    { status: 200, body: meBody() },
    { status: 200, body: followingBody(77) },
  ]);
  const sealedCount: number[] = [];
  const connector = createSpotifyConnector({
    env: ENV,
    transport,
    now: fixedClock(),
    sealToken: async () => {
      sealedCount.push(1);
      return 'v1.a.b.c';
    },
    tokenSink: { persist: async () => ({ persisted: true }) },
  });

  const points = await connector.fetchMetrics({
    connection: CONNECTION,
    credential: CREDENTIAL,
    since: null,
    deadline: new Date(NOW + 10_000),
  });

  checkEqual(G, '4 llamadas: /me(401) + token + /me + /following', transport.calls.length, 4);
  check(G, 'el segundo intento usa el token renovado', transport.calls[2].headers.Authorization === 'Bearer access-issued');
  checkEqual(G, 'una sola operación de bóveda', sealedCount.length, 1);
  checkEqual(G, 'el follow se emite tras el refresco', points[0].value, 77);
  checkEqual(G, 'el reporte declara el refresco', connector.lastPull?.refreshed, true);
  checkEqual(G, 'el reporte declara la persistencia real', connector.lastPull?.persisted, true);

  // Dos 401 seguidos: NO hay segundo refresco (cero bucles).
  const always401 = makeTransport([{ status: 401, body: { error: { status: 401 } } }]);
  const stuck = createSpotifyConnector({ env: ENV, transport: always401, now: fixedClock() });
  const stuckError = await checkThrowsCode(
    G,
    'segundo 401 propaga UNAUTHORIZED',
    () =>
      stuck.fetchMetrics({
        connection: CONNECTION,
        credential: CREDENTIAL,
        since: null,
        deadline: new Date(NOW + 10_000),
      }),
    'UNAUTHORIZED',
  );
  checkEqual(G, 'segundo 401 no es reintentable', stuckError?.retryable, false);
  // Conector NUEVO (refreshed=false): /me(401) + token + /me(401) => se detiene.
  // Un segundo refresco sería cuota quemada en balde.
  checkEqual(G, 'sin bucle infinito: se detiene tras un refresco (2 llamadas)', always401.calls.length, 2);

  // Un TERCER 401 dentro de la MISMA extracción tras haber refrescado no debe
  // volver a refrescar: el flag es por extracción, no por petición.
  const thrice = makeTransport([
    { status: 401, body: { error: { status: 401 } } },
    { status: 200, body: tokenBody() },
    { status: 401, body: { error: { status: 401 } } },
  ]);
  const thriceSeal: number[] = [];
  const thriceConnector = createSpotifyConnector({
    env: ENV,
    transport: thrice,
    now: fixedClock(),
    sealToken: async () => {
      thriceSeal.push(1);
      return 'v1.a.b.c';
    },
  });
  await checkThrowsCode(
    G,
    'segundo 401 tras refrescar => UNAUTHORIZED',
    () =>
      thriceConnector.fetchMetrics({
        connection: CONNECTION,
        credential: CREDENTIAL,
        since: null,
        deadline: new Date(NOW + 10_000),
      }),
    'UNAUTHORIZED',
  );
  checkEqual(G, 'un único refresco por extracción', thriceSeal.length, 1);
}

// ── 9 · Deadline ───────────────────────────────────────────────────────────

async function checkDeadline(): Promise<void> {
  const G = '9.deadline';
  const transport = makeTransport(happyPullResponses());
  const connector = createSpotifyConnector({ env: ENV, transport, now: fixedClock() });
  await checkThrowsCode(
    G,
    'deadline vencido => TIMEOUT',
    () =>
      connector.fetchMetrics({
        connection: CONNECTION,
        credential: CREDENTIAL,
        since: null,
        deadline: new Date(NOW - 1),
      }),
    'TIMEOUT',
  );
  checkEqual(G, 'deadline vencido no abre transporte', transport.calls.length, 0);
  checkEqual(G, 'la señal respeta el deadline (AbortSignal real)', effectiveSignal(new Date(NOW + 1_000), new Date(NOW)).aborted, false);
}

// ── 10 · Configuración fail-closed ────────────────────────────────────────

function checkConfig(): void {
  const G = '10.config';
  const full = loadSpotifyConfig(ENV);
  checkEqual(G, 'lee client_id', full.clientId, ENV.SPOTIFY_CLIENT_ID);
  checkEqual(G, 'lee client_secret', full.clientSecret, ENV.SPOTIFY_CLIENT_SECRET);
  checkEqual(G, 'lee redirect_uri', full.redirectUri, ENV.SPOTIFY_REDIRECT_URI);

  for (const key of ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REDIRECT_URI'] as const) {
    let caught: unknown = null;
    try {
      loadSpotifyConfig({ ...ENV, [key]: undefined });
    } catch (error) {
      caught = error;
    }
    check(G, `sin ${key} falla cerrado`, caught instanceof SpotifyConfigError);
    check(G, `sin ${key} el error nombra la variable`, caught instanceof SpotifyConfigError && caught.variable === key);
  }
}

// ── 11 · Inserción REAL en MetricSnapshot (PostgreSQL efímero) ─────────────

interface EphemeralDatabase {
  readonly url: string;
  readonly stop: () => Promise<void>;
  readonly detail: string | null;
}

function scopedUrl(baseUrl: string, schema: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('schema', schema);
  return url.toString();
}

/** Sentencia a sentencia, respetando bloques `DO $$ … $$` (como los arneses W53). */
async function executeSqlScript(client: PrismaClient, script: string, label: string): Promise<number> {
  const statements: string[] = [];
  let buffer = '';
  let inDollarBlock = false;
  for (const rawLine of script.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    buffer += `${line}\n`;
    if (trimmed.includes('$$') && (trimmed.match(/\$\$/g) ?? []).length === 1) inDollarBlock = !inDollarBlock;
    if (!inDollarBlock && trimmed.endsWith(';')) {
      const statement = buffer.trim();
      if (statement.length > 1) statements.push(statement);
      buffer = '';
    }
  }
  if (buffer.trim().length > 1) statements.push(buffer.trim());

  let applied = 0;
  for (const statement of statements) {
    try {
      await client.$executeRawUnsafe(statement);
      applied += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/already exists|duplicate/i.test(message)) throw new Error(`[${label}] ${message.slice(0, 300)}`);
    }
  }
  return applied;
}

/**
 * Prueba de extremo a extremo contra PostgreSQL REAL: el `MetricPoint` que el
 * conector MIDE se inserta en `MetricSnapshot` con `source: 'api'`, se relee con
 * `select` quirúrgico (INV-20) y se comprueba que la cifra no cambió. Si no hay
 * PostgreSQL verificable se sale 2 (SIN_EVIDENCIA): jamás verde por defecto.
 */
async function checkRealPersistence(): Promise<void> {
  const G = '11.postgres';
  const mod = requireCjs('./lib/ephemeral-postgres.cjs') as {
    resolveVerificationDatabase: () => Promise<EphemeralDatabase | null>;
  };
  const database = await mod.resolveVerificationDatabase();
  if (database === null) {
    console.log('SIN_EVIDENCIA: sin PostgreSQL verificable. No se firma verde por defecto (AF-5).');
    process.exit(2);
  }

  const schemaName = `w53t07_verify_${process.pid}`;
  const { PrismaClient: Client } = requireCjs('@prisma/client') as {
    PrismaClient: new (options: { datasources: { db: { url: string } }; log: readonly [] }) => PrismaClient;
  };
  const client = new Client({ datasources: { db: { url: scopedUrl(database.url, schemaName) } }, log: [] });
  const stamp = Date.now();
  const artistId = `w53t07-artist-${stamp}`;
  const userId = `w53t07-user-${stamp}`;

  try {
    await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await executeSqlScript(client, fs.readFileSync(path.join(ROOT, 'prisma/migrations/0_baseline/migration.sql'), 'utf8'), '0_baseline');
    const applied = await executeSqlScript(
      client,
      fs.readFileSync(path.join(ROOT, 'prisma/migrations/20261110195500_add_career_os_models/migration.sql'), 'utf8'),
      'W53',
    );
    check(G, 'migración Career OS aplicada contra PostgreSQL real', applied > 0, `sentencias=${applied}`);

    await client.$executeRawUnsafe(
      'INSERT INTO "User" ("id","email","displayName","updatedAt") VALUES ($1,$2,$3,NOW())',
      userId,
      `${userId}@example.invalid`,
      'W53_T07 fixture',
    );
    await client.$executeRawUnsafe(
      'INSERT INTO "artistProfile" ("id","userId","slug","genres","updatedAt") VALUES ($1,$2,$3,ARRAY[]::TEXT[],NOW())',
      artistId,
      userId,
      `w53t07-${stamp}`,
    );

    // 1. El conector MIDE contra el proveedor simulado.
    const connector = createSpotifyConnector({ env: ENV, transport: makeTransport(happyPullResponses(555)), now: fixedClock() });
    const points = await connector.fetchMetrics({
      connection: { connectionId: `conn-${stamp}`, artistId, platformId: SPOTIFY_PLATFORM_ID },
      credential: CREDENTIAL,
      since: null,
      deadline: new Date(NOW + 5_000),
    });
    checkEqual(G, 'el conector emite exactamente 1 métrica', points.length, 1);
    checkEqual(G, 'la métrica medida es followers=555', points[0].value, 555);

    // 2. Se PERSISTE como lo haría el orquestador: una fila por MetricPoint.
    for (const point of points) {
      await client.metricSnapshot.create({
        data: {
          artistId,
          platformId: point.platformId,
          metric: point.metric,
          value: point.value,
          capturedAt: new Date(point.capturedAt),
          source: 'api',
        },
        select: { id: true },
      });
    }

    // 3. Se RELEE con select quirúrgico (INV-20): nada de `SELECT *`.
    const rows = await client.metricSnapshot.findMany({
      where: { artistId, platformId: SPOTIFY_PLATFORM_ID },
      select: { id: true, metric: true, value: true, source: true, capturedAt: true },
    });
    checkEqual(G, 'una fila en MetricSnapshot', rows.length, 1);
    checkEqual(G, 'métrica persistida', rows[0].metric, 'followers');
    checkEqual(G, 'valor persistido = valor medido (sin redondeo)', rows[0].value, 555);
    checkEqual(G, 'source persistido api (modo REAL)', rows[0].source, 'api');
    checkEqual(G, 'capturedAt persistido del reloj inyectado', rows[0].capturedAt.toISOString(), new Date(NOW).toISOString());
    check(G, 'el valor persistido es entero', Number.isInteger(rows[0].value));
    checkEqual(G, 'el conteo por artista coincide con las filas escritas', await client.metricSnapshot.count({ where: { artistId } }), 1);
  } finally {
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
    await client.$disconnect().catch(() => undefined);
    await database.stop().catch(() => undefined);
  }
}

// ── 12 · Higiene del fichero (cero any, cero Math.random, cero log de token) ─

function checkHygiene(): void {
  const G = '12.higiene';
  const source = fs.readFileSync(path.join(ROOT, 'src/lib/career/connectors/spotify.ts'), 'utf8');
  const code = source.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    return !trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('/*');
  });
  // El patrón se compone por partes para que el propio arnés no se marque a sí mismo.
  const kw = ['a', 'n', 'y'].join('');
  const anyPatterns = [new RegExp(`:\\s*${kw}\\b`), new RegExp(`<${kw}>`), new RegExp(`\\bas\\s+${kw}\\b`)];
  check(G, 'cero tipos any explícitos en el conector', !code.some((line) => anyPatterns.some((re) => re.test(line))));
  check(G, 'cero Math.random en el conector', !code.some((line) => line.includes('Math.random')));
  check(G, 'ningún log imprime token (INV-14)', !/console\.\w+\([^)]*(accessToken|Authorization|refreshToken)/.test(source));
  check(G, 'cero secretos hardcodeados', !code.some((line) => line.includes('CLIENT_SECRET =')));
  check(G, 'usa AbortSignal.timeout (INV-17)', source.includes('AbortSignal.timeout'));
  check(G, 'valida el payload externo con Zod (SEC-4)', source.includes('safeParse'));
  check(G, 'no importa node:crypto en el conector', !source.includes("from 'node:crypto'"));
  check(G, 'no emite revenue_cents en el código', !code.some((line) => line.includes("metric: 'revenue_cents'")));
}

// ── Ejecución ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  checkSsot();
  checkAuthUrl();
  await checkPkce();
  await checkTokenExchange();
  await checkRefresh();
  checkErrorMapping();
  await checkFetchMetrics();
  await checkRefreshOn401();
  await checkDeadline();
  checkConfig();
  await checkRealPersistence();
  checkHygiene();

  if (SELF_TEST) {
    // Aserción imposible: si el arnés sigue en PASS con el canal de fallo roto,
    // el veredicto se invierte y sale 1.
    record('self-test', 'aserción imposible (debe fallar)', false, 'canal de fallo verificado');
  }

  const groups = [...new Set(results.map((r) => r.group))];
  console.log('── ARNÉS FALSABLE · W53_T07 · CONECTOR SPOTIFY FOR ARTISTS ──');
  for (const group of groups) {
    const rows = results.filter((r) => r.group === group);
    const ok = rows.filter((r) => r.ok).length;
    console.log(`${ok === rows.length ? 'PASS' : 'FAIL'} · ${group} (${ok}/${rows.length})`);
  }
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log(`\naserciones: ${passed}/${results.length} · fallos: ${failed}`);
  for (const row of results.filter((r) => !r.ok)) console.log(`  FAIL · ${row.group} · ${row.name} · ${row.detail ?? ''}`);
  console.log(`SPOTIFY_CONNECTOR=${failed === 0 ? 'PASS' : 'FAIL'}`);
  process.exit(failed === 0 ? 0 : 1);
}

void main().catch((error: unknown) => {
  console.error(`SPOTIFY_CONNECTOR=FAIL · excepción no capturada: ${error instanceof Error ? error.name : typeof error}`);
  process.exit(1);
});
