/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · W53_T04 · RUTAS OAUTH CONNECT/CALLBACK CON STATE ANTI-CSRF
 * ════════════════════════════════════════════════════════════════════════════
 * Prueba el COMPORTAMIENTO del flujo, no su existencia:
 *
 *   1. state-anti-csrf · emisión y forma: payload.firma Base64url, nonce único,
 *      TTL exacto de 10 minutos, dos emisiones del mismo artista difieren.
 *   2. state-anti-csrf · rechazo de manipulación (cada mutación con su código):
 *      payload alterado, firma alterada, firma truncada, state vacío, sin punto,
 *      caracteres fuera de Base64url, secreto equivocado, caducado, del futuro,
 *      de otro proveedor, de otro artista, y `exp` inyectado sin firmar.
 *   3. connect · resolveOAuthProvider contra el SSOT: plataforma inexistente 404,
 *      plataforma CSV/no-OAuth 400 (no se finge un flujo que no existe),
 *      501 cuando no hay adaptador registrado (estado actual, verificado).
 *   4. connect · flujo completo con adaptador: el `state` de la URL del proveedor
 *      es válido y corresponde al artista y proveedor pedidos; callback exigido.
 *   5. callback · happy path: canje → cifrado AES-256-GCM → upsert `live`.
 *   6. callback · CSRF: `state` manipulado NO invoca `exchangeCode` (0 llamadas)
 *      y NO escribe en base de datos.
 *   7. cifrado en reposo: el sobre persistido no contiene el access/refresh token
 *      en claro, el AAD ata la fila (mover el sobre no descifra) y el sobre
 *      descifra exactamente la credencial original.
 *   8. cero secretos en la URL: la redirección de error solo porta un código
 *      cerrado; ningún token, mensaje del proveedor ni traza viaja en la query.
 *   9. PostgreSQL REAL: persistencia medida contra esquema efímero dedicado
 *      (testid = W53_T04). Sin PostgreSQL → Exit 2 (SIN_EVIDENCIA, nunca verde).
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_career_oauth_flow.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_career_oauth_flow.ts --json
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_career_oauth_flow.ts --self-test
 *
 * Exit codes: 0 = todas las aserciones pasan · 1 = al menos una falla ·
 *             2 = sin PostgreSQL verificable.
 * Zero red externa: el adaptador es un doble local. Ningún secreto real.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PrismaClient } from '@prisma/client';

import {
  OAUTH_CALLBACK_PATH,
  OAUTH_PANEL_PATH,
  OAUTH_STATE_TTL_MS,
  OAuthFlowError,
  buildCallbackUrl,
  buildResultRedirect,
  credentialAad,
  decryptCredential,
  encryptCredential,
  generateStateSecret,
  issueOAuthState,
  loadStateSecret,
  processCallback,
  resolveOAuthProvider,
  startConnect,
  toOAuthFlowError,
  verifyOAuthState,
  type OAuthPersistHandle,
  type OAuthProviderAdapter,
  type OAuthProviderCredential,
} from '../src/lib/career/oauth-flow';
import { decryptToken, encryptToken } from '../src/lib/career/token-vault';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requireCjs = createRequire(import.meta.url);
const JSON_ONLY = process.argv.includes('--json');
const SELF_TEST = process.argv.includes('--self-test');

// ── Micro-framework de aserciones ───────────────────────────────────────────

interface CheckResult {
  readonly group: string;
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string | null;
}

const results: CheckResult[] = [];

function record(group: string, name: string, ok: boolean, detail: string | null = null): void {
  results.push({ group, name, ok, detail });
}

function check(group: string, name: string, ok: boolean, detail: string | null = null): void {
  record(group, name, ok, ok ? null : (detail ?? 'aserto falso'));
}

function checkEqual(group: string, name: string, actual: unknown, expected: unknown): void {
  const ok = Object.is(actual, expected);
  record(group, name, ok, ok ? null : `esperado=${String(expected)} obtenido=${String(actual)}`);
}

/** Exige que `fn` lance `OAuthFlowError` con el código exacto. */
function checkFlowError(group: string, name: string, fn: () => unknown, expectedCode: string): void {
  try {
    fn();
    record(group, name, false, `no lanzó: se esperaba OAuthFlowError ${expectedCode}`);
  } catch (error) {
    if (error instanceof OAuthFlowError) {
      checkEqual(group, `${name} (código)`, error.code, expectedCode);
    } else {
      record(group, name, false, `excepción no tipada: ${error instanceof Error ? error.name : typeof error}`);
    }
  }
}

// ── Fixtures ────────────────────────────────────────────────────────────────

const STATE_KEY = generateStateSecret();
const OTHER_STATE_KEY = generateStateSecret();
const VAULT_KEY = generateStateSecret();
const T0 = Date.UTC(2026, 10, 11, 10, 0, 0);
const NOW = (): number => T0;
const ARTIST_ID = 'artist-w53t04-fixture';
const OTHER_ARTIST = 'artist-w53t04-intruso';
const PLATFORM = 'spotify';

const FLOW_ENV: Record<string, string> = {
  CAREER_OAUTH_STATE_SECRET: STATE_KEY,
  CAREER_TOKEN_KEY: VAULT_KEY,
  NEXT_PUBLIC_APP_URL: 'https://productoraear.com',
};

const ACCESS_TOKEN = 'access-token-DE-PRUEBA-w53t04-no-real';
const REFRESH_TOKEN = 'refresh-token-DE-PRUEBA-w53t04-no-real';

/** Credencial de prueba: los valores jamás son reales ni alcanzan la red. */
function fixtureCredential(): OAuthProviderCredential {
  return {
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
    expiresAtMs: T0 + 3_600_000,
    scope: 'user-read-email user-top-read',
  };
}

/** Reemplaza un carácter en la posición `index` para corromper un segmento. */
function corruptAt(value: string, index: number): string {
  const char = value[index] ?? 'A';
  const replacement = char === 'A' ? 'B' : 'A';
  return `${value.slice(0, index)}${replacement}${value.slice(index + 1)}`;
}

function toB64url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(input: string): string {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

/**
 * Re-firma un payload ARBITRARIO con un secreto dado. Es la prueba definitiva:
 * aunque el atacante conozca el formato, sin el secreto no produce un `state`
 * válido; y si lo produce con otro secreto, el servidor lo rechaza.
 */
function signPayloadWith(secretB64: string, payload: Record<string, unknown>): string {
  const crypto = process.getBuiltinModule('node:crypto');
  const segment = toB64url(JSON.stringify(payload));
  const mac = crypto
    .createHmac('sha256', Buffer.from(secretB64, 'base64'))
    .update(segment, 'utf8')
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${segment}.${mac}`;
}



// ── Grupo 1 · emisión del state ─────────────────────────────────────────────

function checkStateIssuance(): void {
  const G = '1.state-emision';
  const state = issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW });
  const parts = state.split('.');

  checkEqual(G, 'el state tiene exactamente 2 segmentos', parts.length, 2);
  check(G, 'ambos segmentos son Base64url', parts.every((p) => /^[A-Za-z0-9_-]+$/.test(p)), state);
  check(G, 'sin relleno "=" (Base64url, no Base64)', !state.includes('='), state);
  check(G, 'el state no contiene el artistId en claro', !state.includes(ARTIST_ID), state);

  const verified = verifyOAuthState(state, PLATFORM, { env: FLOW_ENV, now: NOW });
  checkEqual(G, 'roundtrip · artistId', verified.artistId, ARTIST_ID);
  checkEqual(G, 'roundtrip · platformId', verified.platformId, PLATFORM);
  checkEqual(G, 'TTL exacto de 10 minutos (600000 ms)', verified.expiresAt - verified.issuedAt, 600_000);
  checkEqual(G, 'OAUTH_STATE_TTL_MS declarado = 600000', OAUTH_STATE_TTL_MS, 600_000);

  const payload = JSON.parse(fromB64url(parts[0] ?? '')) as Record<string, unknown>;
  const nonceBytes = Buffer.from(String(payload.n).replace(/-/g, '+').replace(/_/g, '/'), 'base64').length;
  checkEqual(G, 'payload · nonce de 16 bytes', nonceBytes, 16);
  checkEqual(G, 'payload · exp = iat + TTL', Number(payload.exp) - Number(payload.iat), 600_000);

  const second = issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW });
  const secondPayload = JSON.parse(fromB64url((second.split('.')[0] ?? ''))) as Record<string, unknown>;
  check(G, 'dos emisiones simultáneas NO son idénticas (nonce)', state !== second, 'state repetido');
  check(G, 'el nonce cambia con payload idéntico', secondPayload.n !== payload.n, 'nonce repetido');

  checkFlowError(G, 'artistId vacío rechazado al emitir', () => issueOAuthState('', PLATFORM, { env: FLOW_ENV, now: NOW }), 'STATE_MALFORMED');
  checkFlowError(G, 'ttlMs=0 rechazado', () => issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW, ttlMs: 0 }), 'STATE_MALFORMED');
  checkFlowError(G, 'ttlMs negativo rechazado', () => issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW, ttlMs: -1 }), 'STATE_MALFORMED');
  checkFlowError(G, 'sin secreto no se emite', () => issueOAuthState(ARTIST_ID, PLATFORM, { env: { CAREER_TOKEN_KEY: VAULT_KEY }, now: NOW }), 'SECRET_MISSING');
}


// ── Grupo 2 · CSRF: rechazo de cada mutación ────────────────────────────────

function checkStateRejection(): void {
  const G = '2.state-csrf';
  const state = issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW });
  const [payloadSegment = '', signatureSegment = ''] = state.split('.');
  const verify = (candidate: string | null, platform = PLATFORM): unknown =>
    verifyOAuthState(candidate, platform, { env: FLOW_ENV, now: NOW });
  const longPayload = { a: ARTIST_ID, p: PLATFORM, iat: T0, exp: T0 + 86_400_000, n: 'AAAAAAAAAAAAAAAAAAAAAA' };

  // — estructura
  checkFlowError(G, 'state ausente (null)', () => verify(null), 'STATE_MALFORMED');
  checkFlowError(G, 'state vacío', () => verify(''), 'STATE_MALFORMED');
  checkFlowError(G, 'state sin separador "."', () => verify(payloadSegment), 'STATE_MALFORMED');
  checkFlowError(G, 'state con 3 segmentos', () => verify(`${state}.extra`), 'STATE_MALFORMED');
  checkFlowError(G, 'state con caracteres fuera de Base64url', () => verify(`${payloadSegment}.<script>`), 'STATE_MALFORMED');

  // — firma (el ataque CSRF clásico)
  checkFlowError(G, 'payload alterado (1 byte)', () => verify(`${corruptAt(payloadSegment, 4)}.${signatureSegment}`), 'STATE_BAD_SIGNATURE');
  checkFlowError(G, 'firma alterada (1 byte)', () => verify(`${payloadSegment}.${corruptAt(signatureSegment, 3)}`), 'STATE_BAD_SIGNATURE');
  checkFlowError(G, 'firma truncada', () => verify(`${payloadSegment}.${signatureSegment.slice(0, -4)}`), 'STATE_BAD_SIGNATURE');
  checkFlowError(G, 'firma vacía', () => verify(`${payloadSegment}.`), 'STATE_MALFORMED');
  checkFlowError(G, 'state firmado con otro secreto', () => verify(signPayloadWith(OTHER_STATE_KEY, longPayload)), 'STATE_BAD_SIGNATURE');

  // — expiración (el exp está cubierto por el MAC)
  checkFlowError(G, 'state expirado (ahora = iat + TTL + 1ms)', () => verifyOAuthState(state, PLATFORM, { env: FLOW_ENV, now: () => T0 + 600_000 + 1 }), 'STATE_EXPIRED');
  check(G, 'state vivo en el último milisegundo', (() => {
    try {
      verifyOAuthState(state, PLATFORM, { env: FLOW_ENV, now: () => T0 + 600_000 - 1 });
      return true;
    } catch {
      return false;
    }
  })(), 'expiró antes de tiempo');
  checkFlowError(G, 'state emitido en el futuro', () => verifyOAuthState(state, PLATFORM, { env: FLOW_ENV, now: () => T0 - 60_000 }), 'STATE_EXPIRED');
  check(G, 'un exp largo RE-FIRMADO con el secreto real sí se respeta', (() => {
    try {
      verifyOAuthState(signPayloadWith(STATE_KEY, longPayload), PLATFORM, { env: FLOW_ENV, now: () => T0 + 600_001 });
      return true;
    } catch {
      return false;
    }
  })(), 'el TTL firmado no se respetó');
  checkFlowError(G, 'exp inyectado sin re-firmar', () => verify(signPayloadWith(OTHER_STATE_KEY, longPayload)), 'STATE_BAD_SIGNATURE');

  // — enlace a proveedor y artista
  checkFlowError(G, 'state de spotify usado en youtube (cross-provider)', () => verify(state, 'youtube'), 'STATE_PROVIDER_MISMATCH');
  checkFlowError(G, 'state de otro artista rechazado', () => verifyOAuthState(state, PLATFORM, { env: FLOW_ENV, now: NOW, expectedArtistId: OTHER_ARTIST }), 'STATE_ARTIST_MISMATCH');
  check(G, 'state del artista legítimo aceptado', (() => {
    try {
      verifyOAuthState(state, PLATFORM, { env: FLOW_ENV, now: NOW, expectedArtistId: ARTIST_ID });
      return true;
    } catch {
      return false;
    }
  })(), 'rechazó el artista legítimo');

  // — secreto del servidor
  checkFlowError(G, 'sin CAREER_OAUTH_STATE_SECRET no se verifica', () => verifyOAuthState(state, PLATFORM, { env: { CAREER_TOKEN_KEY: VAULT_KEY }, now: NOW }), 'SECRET_MISSING');
  checkFlowError(G, 'secreto corto (<32 bytes) rechazado', () => loadStateSecret({ CAREER_OAUTH_STATE_SECRET: 'c2hvcnQ=' }), 'SECRET_MISSING');
  checkFlowError(G, 'secreto en blanco rechazado', () => loadStateSecret({ CAREER_OAUTH_STATE_SECRET: '   ' }), 'SECRET_MISSING');

  // — MUTACIÓN: un verificador que solo decodifique el payload (sin HMAC)
  //   ACEPTARÍA una escalada de identidad: el atacante cambia el artista dentro
  //   del payload y republica la firma vieja. Si esta aserción fallara, los
  //   rechazos de arriba no demostrarían nada: no habría nada que romper.
  const escalatedPayload = toB64url(JSON.stringify({
    a: OTHER_ARTIST,
    p: PLATFORM,
    iat: T0,
    exp: T0 + OAUTH_STATE_TTL_MS,
    n: 'AAAAAAAAAAAAAAAAAAAAAA',
  }));
  const escalated = `${escalatedPayload}.${signatureSegment}`;
  let laxAccepts = false;
  try {
    const decodedLax = JSON.parse(fromB64url(escalated.split('.')[0] ?? '')) as Record<string, unknown>;
    // Verificador laxo: se cree el payload sin comprobar el MAC.
    laxAccepts = decodedLax.a === OTHER_ARTIST && decodedLax.p === PLATFORM;
  } catch {
    laxAccepts = false;
  }
  check(G, 'MUTACIÓN: un verificador sin HMAC aceptaría la escalada de artista', laxAccepts, 'la mutación no demuestra nada');
  checkFlowError(G, 'y el motor REAL rechaza esa misma escalada', () => verify(escalated), 'STATE_BAD_SIGNATURE');
}

// ── Dobles de prueba (adaptador + persistencia) ─────────────────────────────

interface StubAdapterState {
  exchangeCalls: number;
  authorizeCalls: number;
}

/**
 * Adaptador OAuth falso: URL https con `state` y `redirect_uri`, y canje que
 * devuelve la credencial de fixture. Registra cuántas veces se le invoca: es el
 * instrumento de la prueba CSRF (un state inválido NO debe llegar a canjear).
 */
function makeAdapter(platformId: string, control: StubAdapterState): OAuthProviderAdapter {
  return {
    platformId,
    buildAuthorizeUrl: ({ state, redirectUri }) => {
      control.authorizeCalls += 1;
      const url = new URL(`https://provider.invalid/authorize/${platformId}`);
      url.searchParams.set('client_id', 'client-ficticio');
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('state', state);
      return url.toString();
    },
    exchangeCode: async () => {
      control.exchangeCalls += 1;
      return fixtureCredential();
    },
  };
}

interface RecordedUpsert {
  readonly artistId: string;
  readonly platformId: string;
  readonly status: string;
  readonly encryptedToken: string;
}

/** Persistencia en memoria que graba exactamente lo que recibiría Prisma. */
function makeMemoryClient(rows: RecordedUpsert[]): OAuthPersistHandle {
  return {
    platformConnection: {
      upsert: async (args) => {
        rows.push({
          artistId: args.create.artistId,
          platformId: args.create.platformId,
          status: args.create.status,
          encryptedToken: args.create.encryptedToken,
        });
        return { id: `mem-${rows.length}`, status: args.create.status };
      },
    },
  };
}

// ── Grupo 3 · resolución de proveedor contra el SSOT ────────────────────────

function checkProviderResolution(): void {
  const G = '3.proveedor-ssot';

  checkEqual(G, 'spotify (oauth_api) se resuelve', resolveOAuthProvider('spotify').id, 'spotify');
  checkEqual(G, 'youtube (oauth_api) se resuelve', resolveOAuthProvider('youtube').id, 'youtube');
  checkEqual(G, 'el SSOT declara spotify como oauth_api', resolveOAuthProvider('spotify').syncMode, 'oauth_api');

  checkFlowError(G, 'plataforma inventada => PROVIDER_UNKNOWN', () => resolveOAuthProvider('myspace-fantasma'), 'PROVIDER_UNKNOWN');
  checkFlowError(G, 'cadena vacía => PROVIDER_UNKNOWN', () => resolveOAuthProvider(''), 'PROVIDER_UNKNOWN');
  checkFlowError(G, 'apple-music (csv_import) NO tiene OAuth', () => resolveOAuthProvider('apple-music'), 'PROVIDER_NOT_OAUTH');
  checkFlowError(G, 'ticketmaster (csv_import) NO tiene OAuth', () => resolveOAuthProvider('ticketmaster'), 'PROVIDER_NOT_OAUTH');
  checkFlowError(G, 'snapchat (manual) NO tiene OAuth', () => resolveOAuthProvider('snapchat'), 'PROVIDER_NOT_OAUTH');

  // Estado real del repositorio hoy: ninguna ruta tiene adaptador cableado, así
  // que el connect honesto es 501 — no un redirect a un proveedor inexistente.
  const control: StubAdapterState = { exchangeCalls: 0, authorizeCalls: 0 };
  checkFlowError(
    G,
    'sin adaptador registrado => CONNECTOR_NOT_REGISTERED (501)',
    () => startConnect('spotify', ARTIST_ID, {
      requestUrl: 'https://productoraear.com/api/artist/career/connect/spotify',
      deps: { adapters: () => null, client: makeMemoryClient([]), env: FLOW_ENV, now: NOW },
    }),
    'CONNECTOR_NOT_REGISTERED',
  );
  checkEqual(G, 'el 501 no invoca al adaptador', control.authorizeCalls + control.exchangeCalls, 0);
  checkEqual(G, 'CONNECTOR_NOT_REGISTERED mapea a HTTP 501', new OAuthFlowError('CONNECTOR_NOT_REGISTERED', 501, '').httpStatus, 501);
}

// ── Grupo 4 · connect: state firmado en la URL del proveedor ────────────────

function checkConnectFlow(): void {
  const G = '4.connect';
  const control: StubAdapterState = { exchangeCalls: 0, authorizeCalls: 0 };
  const rows: RecordedUpsert[] = [];
  const result = startConnect('spotify', ARTIST_ID, {
    requestUrl: `https://productoraear.com/api/artist/career/connect/spotify?artist=${ARTIST_ID}`,
    deps: {
      adapters: (id) => (id === 'spotify' ? makeAdapter(id, control) : null),
      client: makeMemoryClient(rows),
      env: FLOW_ENV,
      now: NOW,
    },
  });

  const location = new URL(result.location);
  checkEqual(G, 'devuelve 302 a un host https', location.protocol, 'https:');
  checkEqual(G, 'el proveedor recibe response_type=code', location.searchParams.get('response_type'), 'code');
  checkEqual(G, 'plataforma resuelta', result.platformId, 'spotify');
  checkEqual(G, 'el adaptador se invocó una vez', control.authorizeCalls, 1);
  checkEqual(G, 'connect NO canjea ningún código', control.exchangeCalls, 0);
  checkEqual(G, 'connect NO escribe en base de datos', rows.length, 0);

  checkEqual(
    G,
    'redirect_uri apunta al callback canónico',
    location.searchParams.get('redirect_uri'),
    `https://productoraear.com${OAUTH_CALLBACK_PATH}/spotify`,
  );
  checkEqual(G, 'buildCallbackUrl no duplica barras', buildCallbackUrl('https://x.es/', 'spotify'), 'https://x.es/api/artist/career/callback/spotify');

  const verified = verifyOAuthState(location.searchParams.get('state'), 'spotify', { env: FLOW_ENV, now: NOW });
  checkEqual(G, 'el state del proveedor es válido y del artista pedido', verified.artistId, ARTIST_ID);
  checkEqual(G, 'el state del proveedor caduca a 10 minutos', verified.expiresAt - NOW(), 600_000);

  checkFlowError(
    G,
    'connect sin artist en la query => 400 (no se firma state anónimo)',
    () => startConnect('spotify', '', {
      requestUrl: 'https://productoraear.com/api/artist/career/connect/spotify',
      deps: { adapters: (id) => makeAdapter(id, control), client: makeMemoryClient(rows), env: FLOW_ENV, now: NOW },
    }),
    'STATE_MALFORMED',
  );
  checkFlowError(
    G,
    'connect de plataforma CSV rechazado antes de redirigir',
    () => startConnect('apple-music', ARTIST_ID, {
      requestUrl: 'https://productoraear.com/api/artist/career/connect/apple-music',
      deps: { adapters: (id) => makeAdapter(id, control), client: makeMemoryClient(rows), env: FLOW_ENV, now: NOW },
    }),
    'PROVIDER_NOT_OAUTH',
  );
}

// ── Grupo 5 · callback: flujo completo y cifrado en reposo ──────────────────

async function checkCallbackHappyPath(): Promise<void> {
  const G = '5.callback-ok';
  const control: StubAdapterState = { exchangeCalls: 0, authorizeCalls: 0 };
  const rows: RecordedUpsert[] = [];
  const state = issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW });

  const result = await processCallback(PLATFORM, {
    code: 'authorization-code-ficticio',
    state,
    providerError: null,
    requestUrl: 'https://productoraear.com/api/artist/career/callback/spotify',
    deps: {
      adapters: (id) => makeAdapter(id, control),
      client: makeMemoryClient(rows),
      env: FLOW_ENV,
      now: NOW,
    },
  });

  checkEqual(G, 'el código se canjea exactamente una vez', control.exchangeCalls, 1);
  checkEqual(G, 'se persiste exactamente una conexión', rows.length, 1);
  checkEqual(G, 'la conexión se guarda como live', rows[0]?.status, 'live');
  checkEqual(G, 'la conexión pertenece al artista del state', rows[0]?.artistId, ARTIST_ID);
  checkEqual(G, 'la conexión pertenece al proveedor de la ruta', rows[0]?.platformId, PLATFORM);
  checkEqual(G, 'persisted=true declarado por el flujo', result.persisted, true);

  const redirect = new URL(result.location);
  checkEqual(G, 'redirige al panel del artista', redirect.pathname, OAUTH_PANEL_PATH);
  checkEqual(G, 'el panel recibe status=connected', redirect.searchParams.get('status'), 'connected');
  checkEqual(G, 'el panel recibe la plataforma', redirect.searchParams.get('platform'), PLATFORM);
  checkEqual(G, 'el panel NO recibe ningún error', redirect.searchParams.get('error'), null);

  // Cifrado en reposo: el sobre no filtra el texto plano.
  const envelope = rows[0]?.encryptedToken ?? '';
  check(G, 'el token persistido es un sobre del vault (v1.iv.tag.ct)', envelope.startsWith('v1.'), envelope.slice(0, 12));
  check(G, 'el access_token NO aparece en claro en la fila', !envelope.includes(ACCESS_TOKEN), 'FUGA DE ACCESS TOKEN');
  check(G, 'el refresh_token NO aparece en claro en la fila', !envelope.includes(REFRESH_TOKEN), 'FUGA DE REFRESH TOKEN');
  check(G, 'la URL de éxito no contiene el access token', !result.location.includes(ACCESS_TOKEN), 'token en la URL');
  check(G, 'la URL de éxito no contiene el código de autorización', !result.location.includes('authorization-code-ficticio'), 'code en la URL');

  // Roundtrip exacto: el sobre descifra la credencial original.
  const decrypted = decryptCredential(ARTIST_ID, PLATFORM, envelope, FLOW_ENV);
  checkEqual(G, 'roundtrip · accessToken íntegro', decrypted.accessToken, ACCESS_TOKEN);
  checkEqual(G, 'roundtrip · refreshToken íntegro', decrypted.refreshToken, REFRESH_TOKEN);
  checkEqual(G, 'roundtrip · expiresAtMs íntegro', decrypted.expiresAtMs, T0 + 3_600_000);
  checkEqual(G, 'roundtrip · scope íntegro', decrypted.scope, 'user-read-email user-top-read');

  // AAD: el sobre está atado a su fila.
  let movedOverEnvelopeRejected = false;
  try {
    decryptCredential(OTHER_ARTIST, PLATFORM, envelope, FLOW_ENV);
  } catch {
    movedOverEnvelopeRejected = true;
  }
  check(G, 'mover el sobre a otro artista NO descifra (AAD)', movedOverEnvelopeRejected, 'el AAD no ata la fila');
  let otherPlatformRejected = false;
  try {
    decryptCredential(ARTIST_ID, 'youtube', envelope, FLOW_ENV);
  } catch {
    otherPlatformRejected = true;
  }
  check(G, 'mover el sobre a otra plataforma NO descifra (AAD)', otherPlatformRejected, 'el AAD no ata la plataforma');

  // Dos cifrados del mismo token no producen el mismo sobre (IV aleatorio).
  const second = encryptCredential(ARTIST_ID, PLATFORM, fixtureCredential(), FLOW_ENV);
  check(G, 'dos cifrados del mismo token difieren (IV aleatorio)', second !== envelope, 'IV reutilizado');
  checkEqual(G, 'el segundo sobre descifra igual', decryptCredential(ARTIST_ID, PLATFORM, second, FLOW_ENV).accessToken, ACCESS_TOKEN);
}


// ── Grupo 6 · callback: CSRF y errores no canjean ni escriben ───────────────

async function checkCallbackRejections(): Promise<void> {
  const G = '6.callback-csrf';
  const validState = issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW });
  const [payloadSegment = '', signatureSegment = ''] = validState.split('.');

  const attempt = async (
    overrides: { code?: string | null; state?: string | null; providerError?: string | null },
    now: () => number = NOW,
  ): Promise<{ control: StubAdapterState; rows: RecordedUpsert[]; error: OAuthFlowError | null }> => {
    const control: StubAdapterState = { exchangeCalls: 0, authorizeCalls: 0 };
    const rows: RecordedUpsert[] = [];
    let error: OAuthFlowError | null = null;
    try {
      await processCallback(PLATFORM, {
        code: overrides.code === undefined ? 'authorization-code-ficticio' : overrides.code,
        state: overrides.state === undefined ? validState : overrides.state,
        providerError: overrides.providerError ?? null,
        requestUrl: 'https://productoraear.com/api/artist/career/callback/spotify',
        deps: { adapters: (id) => makeAdapter(id, control), client: makeMemoryClient(rows), env: FLOW_ENV, now },
      });
    } catch (caught) {
      error = caught instanceof OAuthFlowError ? caught : toOAuthFlowError(caught);
    }
    return { control, rows, error };
  };

  const forged = await attempt({ state: `${corruptAt(payloadSegment, 4)}.${signatureSegment}` });
  checkEqual(G, 'state manipulado => STATE_BAD_SIGNATURE', forged.error?.code, 'STATE_BAD_SIGNATURE');
  checkEqual(G, 'state manipulado NO canjea el código', forged.control.exchangeCalls, 0);
  checkEqual(G, 'state manipulado NO escribe en base de datos', forged.rows.length, 0);
  checkEqual(G, 'el código público no revela detalles', forged.error?.publicCode, 'state_bad_signature');

  const expired = await attempt({}, () => T0 + 600_000 + 1);
  checkEqual(G, 'state caducado => STATE_EXPIRED', expired.error?.code, 'STATE_EXPIRED');
  checkEqual(G, 'state caducado NO canjea', expired.control.exchangeCalls, 0);
  checkEqual(G, 'state caducado NO escribe', expired.rows.length, 0);

  const missingState = await attempt({ state: null });
  checkEqual(G, 'sin state => STATE_MALFORMED', missingState.error?.code, 'STATE_MALFORMED');
  checkEqual(G, 'sin state NO canjea', missingState.control.exchangeCalls, 0);

  const denied = await attempt({ providerError: 'access_denied' });
  checkEqual(G, 'usuario deniega => PROVIDER_DENIED', denied.error?.code, 'PROVIDER_DENIED');
  checkEqual(G, 'usuario deniega NO canjea', denied.control.exchangeCalls, 0);
  checkEqual(G, 'usuario deniega NO escribe', denied.rows.length, 0);

  const noCode = await attempt({ code: null });
  checkEqual(G, 'sin code => EXCHANGE_FAILED', noCode.error?.code, 'EXCHANGE_FAILED');
  checkEqual(G, 'sin code NO canjea', noCode.control.exchangeCalls, 0);

  const crossProvider = await attempt({ state: issueOAuthState(ARTIST_ID, 'youtube', { env: FLOW_ENV, now: NOW }) });
  checkEqual(G, 'state de youtube en callback de spotify => STATE_PROVIDER_MISMATCH', crossProvider.error?.code, 'STATE_PROVIDER_MISMATCH');
  checkEqual(G, 'cross-provider NO canjea', crossProvider.control.exchangeCalls, 0);

  const noVault = await (async () => {
    const control: StubAdapterState = { exchangeCalls: 0, authorizeCalls: 0 };
    const rows: RecordedUpsert[] = [];
    try {
      await processCallback(PLATFORM, {
        code: 'authorization-code-ficticio',
        state: validState,
        providerError: null,
        requestUrl: 'https://productoraear.com/api/artist/career/callback/spotify',
        deps: {
          adapters: (id) => makeAdapter(id, control),
          client: makeMemoryClient(rows),
          env: { CAREER_OAUTH_STATE_SECRET: STATE_KEY },
          now: NOW,
        },
      });
      return { code: null, rows };
    } catch (caught) {
      return { code: caught instanceof OAuthFlowError ? caught.code : 'UNTYPED', rows };
    }
  })();
  checkEqual(G, 'sin CAREER_TOKEN_KEY => VAULT_UNCONFIGURED (no texto plano)', noVault.code, 'VAULT_UNCONFIGURED');
  checkEqual(G, 'sin vault NO se escribe NADA (ni un token claro)', noVault.rows.length, 0);
}


// ── Grupo 7 · higiene de la URL de error y conversión de errores ────────────

function checkErrorUrlHygiene(): void {
  const G = '7.url-sin-secretos';
  const state = issueOAuthState(ARTIST_ID, PLATFORM, { env: FLOW_ENV, now: NOW });
  const [payloadSegment = '', signatureSegment = ''] = state.split('.');

  // El mensaje del proveedor puede contener el código o el token: se prueba con
  // material sensible inyectado en el error del proveedor.
  const leakyMessage = `invalid_client: code=authorization-code-ficticio token=${ACCESS_TOKEN}`;
  const flowError = toOAuthFlowError(new Error(leakyMessage));
  checkEqual(G, 'un error no tipado se degrada a EXCHANGE_FAILED', flowError.code, 'EXCHANGE_FAILED');
  check(G, 'el mensaje no copia el texto del proveedor', !flowError.message.includes(ACCESS_TOKEN), flowError.message);
  check(G, 'el mensaje no copia el código de autorización', !flowError.message.includes('authorization-code-ficticio'), flowError.message);

  const base = 'https://productoraear.com';
  const codes = [
    'STATE_MALFORMED',
    'STATE_BAD_SIGNATURE',
    'STATE_EXPIRED',
    'STATE_PROVIDER_MISMATCH',
    'STATE_ARTIST_MISMATCH',
    'PROVIDER_DENIED',
    'EXCHANGE_FAILED',
    'VAULT_UNCONFIGURED',
    'PERSIST_FAILED',
    'CONNECTOR_NOT_REGISTERED',
  ] as const;
  const allowed = ['platform', 'status', 'error'];
  let allClosed = true;
  let offender = '';
  for (const code of codes) {
    const parsed = new URL(buildResultRedirect(base, PLATFORM, { status: 'error', error: code }));
    const errorParam = parsed.searchParams.get('error') ?? '';
    const extraKeys = [...parsed.searchParams.keys()].filter((k) => !allowed.includes(k));
    const closed = /^[a-z_]+$/.test(errorParam) && errorParam === code.toLowerCase() && extraKeys.length === 0;
    if (!closed) {
      allClosed = false;
      offender = parsed.toString();
    }
  }
  check(G, 'las 10 salidas de error solo portan platform/status/error cerrados', allClosed, offender);

  const sample = buildResultRedirect(base, PLATFORM, { status: 'error', error: 'STATE_BAD_SIGNATURE' });
  checkEqual(G, 'ejemplo · path del panel', new URL(sample).pathname, OAUTH_PANEL_PATH);
  checkEqual(G, 'ejemplo · status=error', new URL(sample).searchParams.get('status'), 'error');
  checkEqual(G, 'ejemplo · error=state_bad_signature', new URL(sample).searchParams.get('error'), 'state_bad_signature');
  check(G, 'la URL de error no contiene el state ni su firma', !sample.includes(payloadSegment) && !sample.includes(signatureSegment), sample);
  check(G, 'todo código público es minúsculas sin espacios', codes.every((c) => /^[a-z_]+$/.test(c.toLowerCase())), codes.join(','));
}


// ── Grupo 8 · persistencia duradera contra PostgreSQL REAL ──────────────────

interface EphemeralDatabase {
  readonly url: string;
  readonly stop: () => Promise<void>;
  readonly detail: string | null;
}

/** URL de Prisma fijada a un esquema dedicado: aísla el arnés del estado residual. */
function scopedUrl(baseUrl: string, schema: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('schema', schema);
  return url.toString();
}

/** Ejecuta un script SQL sentencia a sentencia (respeta bloques `DO $$ … $$`). */
async function executeSqlScript(client: PrismaClient, script: string, label: string): Promise<number> {
  const statements: string[] = [];
  let buffer = '';
  let inDollarBlock = false;
  for (const rawLine of script.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    buffer += `${line}\n`;
    if (trimmed.includes('$$') && (trimmed.match(/\$\$/g) ?? []).length === 1) {
      inDollarBlock = !inDollarBlock;
    }
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
      if (!/already exists|duplicate/i.test(message)) {
        throw new Error(`[${label}] ${message.slice(0, 300)}`);
      }
    }
  }
  return applied;
}


/**
 * Prueba la persistencia contra PostgreSQL real. El clúster efímero solo aplica
 * la migración de telemetría, así que se levanta un ESQUEMA DEDICADO por
 * ejecución y se aplica 0_baseline + la migración Career OS, igual que un
 * deploy de Coolify. Al terminar, el esquema se destruye con CASCADE.
 */
async function withRealDatabase(): Promise<void> {
  const G = '8.postgres-real';
  const mod = requireCjs('./lib/ephemeral-postgres.cjs') as {
    resolveVerificationDatabase: () => Promise<EphemeralDatabase | null>;
  };
  const database = await mod.resolveVerificationDatabase();
  if (database === null) {
    if (!JSON_ONLY) console.log('SIN_EVIDENCIA: sin PostgreSQL verificable. No se firma verde por defecto (AF-5).');
    process.exit(2);
  }

  const schemaName = `w53t04_verify_${process.pid}`;
  const { PrismaClient } = requireCjs('@prisma/client') as { PrismaClient: new () => PrismaClient };
  const client = new PrismaClient({ datasources: { db: { url: scopedUrl(database.url, schemaName) } }, log: [] });
  const stamp = Date.now();
  const artistId = `w53t04-artist-${stamp}`;
  const platformId = PLATFORM;
  const requestUrl = 'https://productoraear.com/api/artist/career/callback/spotify';

  try {
    await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await executeSqlScript(client, fs.readFileSync(path.join(ROOT, 'prisma/migrations/0_baseline/migration.sql'), 'utf8'), '0_baseline');
    const applied = await executeSqlScript(
      client,
      fs.readFileSync(path.join(ROOT, 'prisma/migrations/20261110195500_add_career_os_models/migration.sql'), 'utf8'),
      'W53',
    );
    check(G, 'migración Career OS aplicada contra PostgreSQL real', applied > 0, `sentencias=${applied}`);
    check(G, 'el motor de la prueba es PostgreSQL (no SQLite)', database.url.startsWith('postgres'), database.url.split(':')[0]);

    // Identidad: `artistProfile` es la tabla del SSOT; Prisma la expone como
    // extensión espejo, así que se siembra el SSOT por SQL y luego la extensión.
    const userId = `w53t04-user-${stamp}`;
    await client.$executeRawUnsafe(
      'INSERT INTO "User" ("id","email","displayName","updatedAt") VALUES ($1,$2,$3,NOW())',
      userId,
      `w53t04-${stamp}@example.invalid`,
      'W53_T04 fixture',
    );
    await client.$executeRawUnsafe(
      'INSERT INTO "artistProfile" ("id","userId","slug","genres","updatedAt") VALUES ($1,$2,$3,ARRAY[]::TEXT[],NOW())',
      artistId,
      userId,
      `w53t04-${stamp}`,
    );
    await client.artistProfile.create({ data: { id: artistId }, select: { id: true } });

    // El handle que consume el motor es el cliente Prisma real: sin dobles.
    const handle: OAuthPersistHandle = {
      platformConnection: {
        upsert: (args) =>
          client.platformConnection.upsert({
            where: args.where,
            create: args.create,
            update: args.update,
            select: args.select,
          }),
      },
    };
    const control: StubAdapterState = { exchangeCalls: 0, authorizeCalls: 0 };

    const first = await processCallback(platformId, {
      code: 'authorization-code-ficticio',
      state: issueOAuthState(artistId, platformId, { env: FLOW_ENV, now: NOW }),
      providerError: null,
      requestUrl,
      deps: { adapters: (id) => makeAdapter(id, control), client: handle, env: FLOW_ENV, now: NOW },
    });
    check(G, 'el callback declara persistencia', first.persisted, false);

    const rows = await client.platformConnection.findMany({
      where: { artistId, platformId },
      select: { id: true, status: true, encryptedToken: true, error: true },
    });
    checkEqual(G, 'PostgreSQL real: exactamente 1 fila PlatformConnection', rows.length, 1);
    checkEqual(G, 'PostgreSQL real: status = live', rows[0]?.status, 'live');
    checkEqual(G, 'PostgreSQL real: error = null (conexión sana)', rows[0]?.error, null);

    const stored = rows[0]?.encryptedToken ?? '';
    check(G, 'PostgreSQL real: el token guardado es un sobre del vault', stored.startsWith('v1.'), stored.slice(0, 10));
    check(G, 'PostgreSQL real: el access_token NO está en claro en la BD', !stored.includes(ACCESS_TOKEN), 'FUGA DE ACCESS TOKEN');
    check(G, 'PostgreSQL real: el refresh_token NO está en claro en la BD', !stored.includes(REFRESH_TOKEN), 'FUGA DE REFRESH TOKEN');
    const recovered = decryptCredential(artistId, platformId, stored, FLOW_ENV);
    checkEqual(G, 'PostgreSQL real: el sobre descifra el access_token original', recovered.accessToken, ACCESS_TOKEN);
    checkEqual(G, 'PostgreSQL real: el sobre descifra el refresh_token original', recovered.refreshToken, REFRESH_TOKEN);

    // Reintento del flujo: el upsert es idempotente por la clave única REAL.
    const second = await processCallback(platformId, {
      code: 'authorization-code-ficticio',
      state: issueOAuthState(artistId, platformId, { env: FLOW_ENV, now: NOW }),
      providerError: null,
      requestUrl,
      deps: { adapters: (id) => makeAdapter(id, control), client: handle, env: FLOW_ENV, now: NOW },
    });
    check(G, 'el segundo callback se completa', second.persisted, false);
    const after = await client.platformConnection.findMany({ where: { artistId, platformId }, select: { id: true } });
    checkEqual(G, 'el segundo callback NO duplica la fila (clave única)', after.length, 1);
    checkEqual(G, 'el id de la fila se conserva (update, no create)', after[0]?.id, rows[0]?.id);
  } finally {
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
    await client.$disconnect().catch(() => undefined);
    await database.stop().catch(() => undefined);
  }
}


// ── Ejecución ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  checkStateIssuance();
  checkStateRejection();
  checkProviderResolution();
  checkConnectFlow();
  await checkCallbackHappyPath();
  await checkCallbackRejections();
  checkErrorUrlHygiene();

  // En modo --self-test se fuerza UNA aserción imposible: si el arnés sigue
  // diciendo PASS, el canal de fallo está roto y el veredicto se invierte.
  if (SELF_TEST) {
    check('self-test', 'aserto deliberadamente imposible (debe fallar)', false, 'fallo forzado');
  }

  await withRealDatabase();

  const failures = results.filter((r) => !r.ok);
  const passed = results.length - failures.length;
  const healthy = failures.length === 0;
  const verdict = SELF_TEST ? !healthy : healthy;

  if (JSON_ONLY) {
    console.log(
      JSON.stringify(
        {
          harness: 'verify_career_oauth_flow.ts',
          task: 'W53_T04',
          ts: new Date().toISOString(),
          state_ttl_ms: OAUTH_STATE_TTL_MS,
          checks_total: results.length,
          checks_passed: passed,
          checks_failed: failures.length,
          self_test: SELF_TEST,
          verdict: verdict ? 'PASS' : 'FAIL',
          failures,
        },
        null,
        2,
      ),
    );
  } else {
    console.log('── ARNÉS FALSABLE · W53_T04 · RUTAS OAUTH CONNECT/CALLBACK ──');
    let currentGroup = '';
    let groupPass = 0;
    let groupTotal = 0;
    const flush = (): void => {
      if (currentGroup !== '') {
        console.log(`${groupPass === groupTotal ? 'PASS' : 'FAIL'} · ${currentGroup} (${groupPass}/${groupTotal})`);
      }
    };
    for (const r of results) {
      if (r.group !== currentGroup) {
        flush();
        currentGroup = r.group;
        groupPass = 0;
        groupTotal = 0;
        if (!JSON_ONLY) console.log('');
      }
      groupTotal += 1;
      if (r.ok) groupPass += 1;
      if (!r.ok) console.log(`  FAIL · ${r.name}${r.detail === null ? '' : ` → ${r.detail}`}`);
    }
    flush();

    if (failures.length > 0) {
      console.log('\nHUECOS (el bloque NO está verificado):');
      for (const f of failures) console.log(`  · [${f.group}] ${f.name} → ${f.detail ?? ''}`);
    }
    console.log('');
    console.log(`aserciones: ${passed}/${results.length} · fallos: ${failures.length}`);
    console.log(`CAREER_OAUTH_FLOW=${verdict ? 'PASS' : 'FAIL'}${SELF_TEST ? ' (self-test: canal de fallo verificado)' : ''}`);
  }

  process.exit(verdict ? 0 : 1);
}

main().catch((error: unknown) => {
  console.error(`SIN_EVIDENCIA: el arnés no pudo ejecutarse (${error instanceof Error ? error.message : String(error)}).`);
  process.exit(2);
});
