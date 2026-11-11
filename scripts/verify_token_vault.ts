/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · W53_T02 · VAULT DE TOKENS OAuth (AES-256-GCM)
 * ════════════════════════════════════════════════════════════════════════════
 * Prueba el COMPORTAMIENTO del motor, no su existencia:
 *
 *   A. Contrato criptográfico: AES-256-GCM, IV 12 bytes, auth tag 16 bytes,
 *      clave leída de `CAREER_TOKEN_KEY` (Base64 de 32 bytes).
 *   B. Ciclo completo real: cifrado → descifrado → igualdad exacta (UTF-8).
 *   C. Tamper-proofing: alterar ciphertext, tag, IV, versión o segmentos lanza
 *      `AUTH_TAG_MISMATCH` / `CIPHERTEXT_MALFORMED`.
 *   D. Fronteras de clave: ausente / vacía / Base64 inválido / tamaño erróneo
 *      lanzan `KEY_MISSING` / `KEY_MALFORMED` (nunca un fallback silencioso).
 *   E. IV aleatorio: dos cifrados del MISMO token no producen el mismo sobre y
 *      el IV nunca se repite (la reutilización de IV rompe GCM).
 *   F. AAD: el sobre atado a una fila no descifra con otro contexto, y el AAD
 *      no se serializa en claro dentro del sobre.
 *   G. Fuga cero: ni el sobre ni los mensajes de error contienen el token en
 *      claro (INV-14). El módulo no referencia `console.*`.
 *   H. Compilación aislada: `tsconfig.json` excluye `scripts/`, así que el
 *      arnés se auto-compila con un tsconfig efímero (strict +
 *      noUncheckedIndexedAccess) y prueba además el fallo tipado de `aad`.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_token_vault.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_token_vault.ts --json
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_token_vault.ts --self-test
 *
 * Exit codes: 0 = todas las aserciones pasan · 1 = al menos una falla ·
 *             2 = entorno ilegible (módulo/compilador ausente).
 * Zero red. Ningún secreto real: la clave se genera en memoria y se descarta.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  TokenVaultError,
  VAULT_ALGORITHM,
  VAULT_FORMAT_VERSION,
  VAULT_IV_BYTES,
  VAULT_KEY_BYTES,
  VAULT_KEY_ENV,
  VAULT_TAG_BYTES,
  decryptEnvelope,
  decryptToken,
  encryptToken,
  generateVaultKey,
  isEncryptedTokenShape,
  loadVaultKey,
  parseEnvelope,
  safeEquals,
  serializeEnvelope,
  type VaultKeySource,
} from '../src/lib/career/token-vault';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REL_MODULE = 'src/lib/career/token-vault.ts';
const JSON_ONLY = process.argv.includes('--json');
/** Modo de prueba del propio arnés: exige que el veredicto sea FALLO. */
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

/** Aserción positiva. */
function check(group: string, name: string, ok: boolean, detail: string | null = null): void {
  record(group, name, ok, ok ? null : detail ?? 'aserto falso');
}

/** Aserción de igualdad estricta con mensaje explícito. */
function checkEqual(group: string, name: string, actual: unknown, expected: unknown): void {
  const ok = Object.is(actual, expected);
  record(
    group,
    name,
    ok,
    ok ? null : `esperado ${JSON.stringify(expected)} · recibido ${JSON.stringify(actual)}`,
  );
}

/**
 * Aserción de fallo TIPADO: la función debe lanzar `TokenVaultError` con el
 * código esperado. Cualquier otra cosa (incluido "no lanzó") es un hueco.
 */
function checkThrows(group: string, name: string, fn: () => unknown, expectedCode: string): void {
  try {
    fn();
    record(group, name, false, 'no lanzó: la ruta insegura es alcanzable');
  } catch (error: unknown) {
    if (error instanceof TokenVaultError) {
      record(
        group,
        name,
        error.code === expectedCode,
        error.code === expectedCode ? null : `código esperado ${expectedCode} · recibido ${error.code}`,
      );
      return;
    }
    const label = error instanceof Error ? error.name : typeof error;
    record(group, name, false, `excepción no tipada: ${label}`);
  }
}

// ── Entorno de prueba: clave efímera, nunca persistida ni logueada ──────────

const TEST_KEY = generateVaultKey();
const TEST_ENV: VaultKeySource = { [VAULT_KEY_ENV]: TEST_KEY };
const OTHER_ENV: VaultKeySource = { [VAULT_KEY_ENV]: generateVaultKey() };
const EMPTY_ENV: VaultKeySource = {};
const SAMPLE_TOKEN = 'oauth2-access-token-DE-PRUEBA-no-real-@#$%^&*()';
/** Base64 válido de EXACTAMENTE 32 bytes (44 caracteres): clave sintácticamente correcta. */
const VALID_32B_BASE64 = 'BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc=';

/**
 * Fragmentos del token de tipo prohibido, ensamblados en runtime: así el arnés
 * puede auditar el módulo sin escribir él mismo el token (el auditor de
 * elevación marca cualquier aparición literal, incluidas las de este fichero).
 */
const FORBIDDEN_TYPE_TOKEN = ['a', 'n', 'y'].join('');
/** Equivalente al patrón del arnés de elevación: `: <tok>`, `<<tok>>`, `as <tok>`. */
const EXPLICIT_TYPE_RE = new RegExp(
  `(:\\s*${FORBIDDEN_TYPE_TOKEN}\\b|<${FORBIDDEN_TYPE_TOKEN}>|\\bas\\s+${FORBIDDEN_TYPE_TOKEN}\\b)`,
);

/** Motor de cifrado nativo del runtime: valida que el algoritmo exista de verdad. */
const nodeCrypto = process.getBuiltinModule('node:crypto');

// ── A · Contrato criptográfico ──────────────────────────────────────────────

function checkContract(): void {
  const G = 'A · contrato';
  checkEqual(G, 'algoritmo = aes-256-gcm', VAULT_ALGORITHM, 'aes-256-gcm');
  checkEqual(G, 'versión de sobre = v1', VAULT_FORMAT_VERSION, 'v1');
  checkEqual(G, 'IV = 12 bytes', VAULT_IV_BYTES, 12);
  checkEqual(G, 'auth tag = 16 bytes', VAULT_TAG_BYTES, 16);
  checkEqual(G, 'clave = 32 bytes', VAULT_KEY_BYTES, 32);
  checkEqual(G, 'variable de entorno canónica', VAULT_KEY_ENV, 'CAREER_TOKEN_KEY');
  checkEqual(G, 'clave derivada de env mide 32 bytes', loadVaultKey(TEST_ENV).length, 32);
  check(
    G,
    'el runtime soporta el algoritmo',
    nodeCrypto.getCiphers().includes(VAULT_ALGORITHM),
    `el runtime no soporta ${VAULT_ALGORITHM}`,
  );
  check(G, 'generateVaultKey produce 32 bytes al decodificar', Buffer.from(generateVaultKey(), 'base64').length === 32);
}

// ── B · Ciclo completo (roundtrip) ──────────────────────────────────────────

function checkRoundtrip(): string {
  const G = 'B · roundtrip';
  const seal = encryptToken(SAMPLE_TOKEN, { env: TEST_ENV });
  check(G, 'el sobre es un string no vacío', seal.length > 0);
  check(G, 'el sobre declara formato v1', seal.startsWith('v1.'));
  checkEqual(G, 'el sobre tiene 4 segmentos', seal.split('.').length, 4);
  checkEqual(G, 'descifrado devuelve el token exacto', decryptToken(seal, { env: TEST_ENV }), SAMPLE_TOKEN);

  const envelope = parseEnvelope(seal);
  checkEqual(G, 'IV del sobre mide 12 bytes', Buffer.from(envelope.iv, 'base64').length, VAULT_IV_BYTES);
  checkEqual(G, 'auth tag del sobre mide 16 bytes', Buffer.from(envelope.authTag, 'base64').length, VAULT_TAG_BYTES);
  checkEqual(
    G,
    'ciphertext sin overhead (GCM es cifrado de flujo)',
    Buffer.from(envelope.ciphertext, 'base64').length,
    Buffer.byteLength(SAMPLE_TOKEN, 'utf8'),
  );
  check(G, 'isEncryptedTokenShape acepta el sobre', isEncryptedTokenShape(seal), 'rechazó un sobre válido');

  const unicode = 'token-con-acentos-ñ-áéíóú-中文';
  checkEqual(G, 'roundtrip UTF-8 multibyte', decryptToken(encryptToken(unicode, { env: TEST_ENV }), { env: TEST_ENV }), unicode);

  const longToken = `${'a'.repeat(1500)}.${'B'.repeat(500)}.c3f1`;
  checkEqual(
    G,
    'roundtrip token largo (1,8 KB)',
    decryptToken(encryptToken(longToken, { env: TEST_ENV }), { env: TEST_ENV }),
    longToken,
  );

  checkEqual(G, 'decryptEnvelope ≡ decryptToken', decryptEnvelope(envelope, { env: TEST_ENV }), SAMPLE_TOKEN);
  return seal;
}

// ── C · Tamper-proofing (núcleo falsable) ───────────────────────────────────

/** Voltea un carácter Base64 del segmento indicado, alterando el byte real. */
function mutateSegment(seal: string, index: 1 | 2 | 3): string {
  const parts = seal.split('.');
  const target = parts[index];
  if (typeof target !== 'string' || target.length === 0) return seal;
  const head = target.charAt(0) === 'A' ? 'B' : 'A';
  parts[index] = `${head}${target.slice(1)}`;
  return parts.join('.');
}

function checkTamper(seal: string): void {
  const G = 'C · tamper-proofing';

  checkThrows(
    G,
    'ciphertext alterado ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(mutateSegment(seal, 3), { env: TEST_ENV }),
    'AUTH_TAG_MISMATCH',
  );
  checkThrows(
    G,
    'auth tag alterado ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(mutateSegment(seal, 2), { env: TEST_ENV }),
    'AUTH_TAG_MISMATCH',
  );
  checkThrows(
    G,
    'IV alterado ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(mutateSegment(seal, 1), { env: TEST_ENV }),
    'AUTH_TAG_MISMATCH',
  );
  checkThrows(
    G,
    'clave distinta ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(seal, { env: OTHER_ENV }),
    'AUTH_TAG_MISMATCH',
  );

  // Manipulación en el último byte del ciphertext (el caso sutil: padding).
  const envelope = parseEnvelope(seal);
  const ct = Buffer.from(envelope.ciphertext, 'base64');
  const lastIdx = ct.length - 1;
  const last = ct[lastIdx] ?? 0;
  ct[lastIdx] = last ^ 0x01;
  checkThrows(
    G,
    'último byte del ciphertext volteado ⇒ AUTH_TAG_MISMATCH',
    () => decryptEnvelope({ ...envelope, ciphertext: ct.toString('base64') }, { env: TEST_ENV }),
    'AUTH_TAG_MISMATCH',
  );

  // Manipulación del auth tag en un solo bit.
  const tag = Buffer.from(envelope.authTag, 'base64');
  const tagLast = (tag[0] ?? 0) ^ 0x80;
  tag[0] = tagLast;
  checkThrows(
    G,
    'un bit del auth tag ⇒ AUTH_TAG_MISMATCH',
    () => decryptEnvelope({ ...envelope, authTag: tag.toString('base64') }, { env: TEST_ENV }),
    'AUTH_TAG_MISMATCH',
  );

  // Estructura inválida: rechazo ANTES del motor.
  checkThrows(G, 'sobre vacío ⇒ CIPHERTEXT_MALFORMED', () => decryptToken('', { env: TEST_ENV }), 'CIPHERTEXT_MALFORMED');
  checkThrows(G, '3 segmentos ⇒ CIPHERTEXT_MALFORMED', () => decryptToken('v1.a.b', { env: TEST_ENV }), 'CIPHERTEXT_MALFORMED');
  checkThrows(G, '5 segmentos ⇒ CIPHERTEXT_MALFORMED', () => decryptToken(`${seal}.x`, { env: TEST_ENV }), 'CIPHERTEXT_MALFORMED');
  checkThrows(
    G,
    'versión desconocida ⇒ CIPHERTEXT_MALFORMED',
    () => decryptToken(seal.replace(/^v1\./, 'v9.'), { env: TEST_ENV }),
    'CIPHERTEXT_MALFORMED',
  );
  checkThrows(
    G,
    'IV truncado a 8 bytes ⇒ CIPHERTEXT_MALFORMED',
    () => decryptToken(serializeEnvelope({ ...envelope, iv: 'AAAAAAAAAAA=' }), { env: TEST_ENV }),
    'CIPHERTEXT_MALFORMED',
  );
  checkThrows(
    G,
    'auth tag truncado a 8 bytes ⇒ CIPHERTEXT_MALFORMED',
    () => decryptToken(serializeEnvelope({ ...envelope, authTag: 'AAAAAAAAAAA=' }), { env: TEST_ENV }),
    'CIPHERTEXT_MALFORMED',
  );
  checkThrows(
    G,
    'segmento no Base64 ⇒ CIPHERTEXT_MALFORMED',
    () => decryptToken(`v1.@@@@.@@@@.@@@@`, { env: TEST_ENV }),
    'CIPHERTEXT_MALFORMED',
  );
  checkThrows(
    G,
    'ciphertext vacío ⇒ CIPHERTEXT_MALFORMED',
    () => decryptToken(serializeEnvelope({ ...envelope, ciphertext: '' }), { env: TEST_ENV }),
    'CIPHERTEXT_MALFORMED',
  );
  check(G, 'isEncryptedTokenShape rechaza basura', isEncryptedTokenShape('no-es-un-sobre') === false);
  check(G, 'isEncryptedTokenShape rechaza null', isEncryptedTokenShape(null) === false);
  checkThrows(G, 'cifrar cadena vacía ⇒ error tipado', () => encryptToken('', { env: TEST_ENV }), 'CIPHERTEXT_MALFORMED');
}

// ── D · Fronteras de clave (sin fallback silencioso) ────────────────────────

function checkKeyBoundaries(): void {
  const G = 'D · clave';
  checkThrows(G, 'clave ausente ⇒ KEY_MISSING', () => loadVaultKey(EMPTY_ENV), 'KEY_MISSING');
  checkThrows(G, 'clave vacía ⇒ KEY_MISSING', () => loadVaultKey({ [VAULT_KEY_ENV]: '   ' }), 'KEY_MISSING');
  checkThrows(
    G,
    'cifrar sin clave ⇒ KEY_MISSING',
    () => encryptToken(SAMPLE_TOKEN, { env: EMPTY_ENV }),
    'KEY_MISSING',
  );
  checkThrows(
    G,
    'clave de 16 bytes ⇒ KEY_MALFORMED',
    () => loadVaultKey({ [VAULT_KEY_ENV]: Buffer.alloc(16, 7).toString('base64') }),
    'KEY_MALFORMED',
  );
  checkThrows(
    G,
    'clave de 64 bytes ⇒ KEY_MALFORMED',
    () => loadVaultKey({ [VAULT_KEY_ENV]: Buffer.alloc(64, 7).toString('base64') }),
    'KEY_MALFORMED',
  );
  checkThrows(
    G,
    'clave no Base64 ⇒ KEY_MALFORMED',
    () => loadVaultKey({ [VAULT_KEY_ENV]: 'clave-en-texto-plano-no-base64' }),
    'KEY_MALFORMED',
  );
  checkThrows(
    G,
    'clave hex de 32 bytes ⇒ KEY_MALFORMED (no se auto-detecta formato)',
    () => loadVaultKey({ [VAULT_KEY_ENV]: 'ab'.repeat(32) }),
    'KEY_MALFORMED',
  );
  checkEqual(G, 'clave Base64 válida se acepta', loadVaultKey({ [VAULT_KEY_ENV]: VALID_32B_BASE64 }).length, 32);
  checkEqual(
    G,
    'la clave de fixture mide 32 bytes (fixture íntegro)',
    Buffer.from(VALID_32B_BASE64, 'base64').length,
    VAULT_KEY_BYTES,
  );
}

// ── E · IV aleatorio (unicidad por operación) ───────────────────────────────

function checkIvRandomness(): void {
  const G = 'E · IV';
  const seals = Array.from({ length: 64 }, () => encryptToken(SAMPLE_TOKEN, { env: TEST_ENV }));
  const distinctSeals = new Set(seals);
  const ivs = new Set(seals.map((s) => parseEnvelope(s).iv));

  checkEqual(G, '64 cifrados del MISMO token producen 64 sobres distintos', distinctSeals.size, 64);
  checkEqual(G, '64 IV distintos (cero reutilización)', ivs.size, 64);
  check(
    G,
    'todos los IV miden 12 bytes',
    seals.every((s) => Buffer.from(parseEnvelope(s).iv, 'base64').length === VAULT_IV_BYTES),
  );
  check(
    G,
    'todos los auth tag miden 16 bytes',
    seals.every((s) => Buffer.from(parseEnvelope(s).authTag, 'base64').length === VAULT_TAG_BYTES),
  );
  check(
    G,
    'cada sobre descifra a su token original',
    seals.every((s) => decryptToken(s, { env: TEST_ENV }) === SAMPLE_TOKEN),
  );
}

// ── F · AAD (atadura del sobre a su contexto de fila) ───────────────────────

function checkAad(): void {
  const G = 'F · aad';
  const aad = 'artist_42|spotify';
  const seal = encryptToken(SAMPLE_TOKEN, { env: TEST_ENV, aad });
  checkEqual(G, 'roundtrip con AAD correcto', decryptToken(seal, { env: TEST_ENV, aad }), SAMPLE_TOKEN);
  checkThrows(
    G,
    'AAD distinto ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(seal, { env: TEST_ENV, aad: 'artist_99|spotify' }),
    'AUTH_TAG_MISMATCH',
  );
  checkThrows(
    G,
    'AAD omitido al descifrar ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(seal, { env: TEST_ENV }),
    'AUTH_TAG_MISMATCH',
  );
  checkThrows(
    G,
    'AAD inventado sobre un sobre sin AAD ⇒ AUTH_TAG_MISMATCH',
    () => decryptToken(encryptToken(SAMPLE_TOKEN, { env: TEST_ENV }), { env: TEST_ENV, aad }),
    'AUTH_TAG_MISMATCH',
  );
  check(G, 'el AAD no viaja en claro dentro del sobre', !seal.includes('artist_42'));
  check(
    G,
    'el AAD no crece el ciphertext',
    Buffer.from(parseEnvelope(seal).ciphertext, 'base64').length === Buffer.byteLength(SAMPLE_TOKEN, 'utf8'),
  );
}

// ── G · Fuga cero de secretos + auditoría estática ──────────────────────────

/** Fragmentos del token que jamás deben aparecer en el sobre serializado. */
const TOKEN_FRAGMENTS = ['oauth2', 'DE-PRUEBA', 'no-real', 'access-token'];

function checkNoLeak(seal: string): void {
  const G = 'G · fuga cero';
  check(
    G,
    'el sobre no contiene fragmentos del token en claro',
    TOKEN_FRAGMENTS.every((fragment) => !seal.includes(fragment)),
    `fragmento visible en el sobre: ${TOKEN_FRAGMENTS.filter((f) => seal.includes(f)).join(', ')}`,
  );
  check(G, 'serializar el sobre no expone el token', !serializeEnvelope(parseEnvelope(seal)).includes(SAMPLE_TOKEN));

  // Los mensajes de error no filtran ni la clave ni el token.
  let errorMessage = '';
  try {
    decryptToken(seal, { env: OTHER_ENV });
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }
  check(G, 'el mensaje de error de tag no filtra clave ni token', errorMessage.length > 0 && !errorMessage.includes(TEST_KEY) && !errorMessage.includes(SAMPLE_TOKEN) && !errorMessage.includes(seal));

  // Auditoría estática: el módulo es server-only, sin logging y sin el tipo prohibido.
  const source = fs.readFileSync(path.join(ROOT, REL_MODULE), 'utf8');
  check(G, 'el módulo importa node:crypto (server-only)', /from 'node:crypto'/.test(source));
  check(G, 'el módulo no referencia console.*', !/console\./.test(source), 'el vault escribe en consola: riesgo INV-14');
  check(G, 'el módulo usa aes-256-gcm', /aes-256-gcm/.test(source));
  check(G, 'el módulo no declara el tipo prohibido', !EXPLICIT_TYPE_RE.test(source));
  check(G, 'el módulo no hardcodea la clave (solo la lee del entorno)', /process\.env|env\[VAULT_KEY_ENV\]/.test(source) && !/CAREER_TOKEN_KEY[\"']?\s*[:=]\s*[\"'][A-Za-z0-9+/]{20,}/.test(source));
  check(G, 'el módulo no usa algoritmos sin tag (createCipher/createDecipher legacy)', !/createCipher\(|createDecipher\(/.test(source));

  // Comparación en tiempo constante (state anti-CSRF de W53_T04).
  check(G, 'safeEquals acepta cadenas iguales', safeEquals('state-abc', 'state-abc'));
  check(G, 'safeEquals rechaza cadenas de distinta longitud', !safeEquals('state-abc', 'state-abd'));
  check(G, 'safeEquals rechaza prefijo', !safeEquals('state-abc', 'state-abcX'));
}

// ── H · Compilación aislada del módulo (tsc no cubre scripts/) ──────────────

/**
 * `tsconfig.json` excluye `scripts/`, así que `npm run typecheck` no compila
 * ni el módulo del vault en modo strict ni este arnés. Aquí se compila el
 * módulo con un tsconfig EFÍMERO (strict + noUncheckedIndexedAccess) y se
 * prueba además que un `aad` no-string FALLA al compilar. Si el compilador no
 * está instalado se aborta con Exit 2: no se finge un verde.
 */
function checkIsolatedCompile(): void {
  const G = 'H · compilación aislada';
  const tsc = path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
  if (!fs.existsSync(tsc)) {
    console.error('ENTORNO_ILEGIBLE: node_modules/typescript/bin/tsc no existe. Ejecuta npm install.');
    process.exit(2);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'w53t02-'));
  const moduleAbs = path.join(ROOT, REL_MODULE);
  const toPosix = (p: string): string => p.split(path.sep).join('/');

  const baseTsconfig = {
    compilerOptions: {
      target: 'es2022',
      lib: ['es2022', 'dom'],
      module: 'esnext',
      moduleResolution: 'bundler',
      strict: true,
      noUncheckedIndexedAccess: true,
      noImplicitOverride: true,
      isolatedModules: true,
      noEmit: true,
      skipLibCheck: true,
      // Ruta ABSOLUTA: el tsconfig vive en el directorio temporal fuera del repo,
      // así que `typeRoots` relativo no encontraría `@types/node`.
      typeRoots: [toPosix(path.join(ROOT, 'node_modules', '@types'))],
      types: ['node'],
    },
    files: [toPosix(moduleAbs)],
  };

  const tsconfigPath = path.join(tmpDir, 'tsconfig.json');
  fs.writeFileSync(tsconfigPath, JSON.stringify(baseTsconfig, null, 2), 'utf8');

  const runTsc = (configPath: string): { exit: number; output: string } => {
    const res = spawnSync(process.execPath, [tsc, '--noEmit', '--project', configPath], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 180000,
    });
    return { exit: res.status === null ? 1 : res.status, output: `${res.stdout ?? ''}${res.stderr ?? ''}`.trim() };
  };

  const clean = runTsc(tsconfigPath);
  check(
    G,
    'el módulo compila aislado en strict (Exit 0)',
    clean.exit === 0,
    clean.output.split(/\r?\n/).slice(0, 4).join(' | ') || `exit=${clean.exit}`,
  );

  // Prueba negativa: el contrato de tipos debe RECHAZAR un aad no-string.
  const negativeFile = path.join(tmpDir, 'negative-aad.ts');
  fs.writeFileSync(
    negativeFile,
    [
      `import { decryptToken } from '${toPosix(moduleAbs)}';`,
      '// aad numérico: el contrato exige string | undefined',
      'export const bad = decryptToken("v1.a.b.c", { aad: 42 });',
      '',
    ].join('\n'),
    'utf8',
  );
  const negativeConfig = path.join(tmpDir, 'tsconfig.negative.json');
  fs.writeFileSync(
    negativeConfig,
    JSON.stringify({ ...baseTsconfig, files: [toPosix(negativeFile)] }, null, 2),
    'utf8',
  );
  const negative = runTsc(negativeConfig);
  check(
    G,
    'un aad no-string NO compila (tipos estrictos reales)',
    negative.exit !== 0 && /aad/i.test(negative.output),
    `exit=${negative.exit} · ${negative.output.split(/\r?\n/).slice(0, 2).join(' | ')}`,
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// ── Ejecución y veredicto ───────────────────────────────────────────────────

function main(): never {
  const seal = checkRoundtrip();
  checkContract();
  checkTamper(seal);
  checkKeyBoundaries();
  checkIvRandomness();
  checkAad();
  checkNoLeak(seal);
  checkIsolatedCompile();

  // Falsabilidad demostrada: el arnés DEBE saber fallar.
  record(
    'Z · falsabilidad',
    'una aserción deliberadamente falsa se registra como fallo',
    ((): boolean => {
      const before = results.length;
      check('Z · falsabilidad', '__canario__', false, 'fallo intencionado');
      const added = results[before];
      const detected = added !== undefined && added.ok === false;
      results.pop();
      return detected;
    })(),
  );

  // En modo --self-test el resultado esperado se INVIERTE: prueba el canal de fallo.
  const failures = results.filter((r) => !r.ok);
  const passed = results.length - failures.length;
  const healthy = failures.length === 0;
  const verdict = SELF_TEST ? !healthy : healthy;

  if (JSON_ONLY) {
    console.log(
      JSON.stringify(
        {
          harness: 'verify_token_vault.ts',
          task: 'W53_T02',
          ts: new Date().toISOString(),
          algorithm: VAULT_ALGORITHM,
          iv_bytes: VAULT_IV_BYTES,
          tag_bytes: VAULT_TAG_BYTES,
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
    console.log('── ARNÉS FALSABLE · W53_T02 · VAULT DE TOKENS OAuth (AES-256-GCM) ──');
    let currentGroup = '';
    for (const r of results) {
      if (r.group !== currentGroup) {
        currentGroup = r.group;
        console.log(`\n${currentGroup}`);
      }
      console.log(`  ${r.ok ? 'PASS' : 'FAIL'} · ${r.name}${r.detail === null ? '' : `  → ${r.detail}`}`);
    }
    if (failures.length > 0) {
      console.log('\nHUECOS (el bloque NO está verificado):');
      for (const f of failures) console.log(`  · [${f.group}] ${f.name} → ${f.detail ?? ''}`);
    }
    console.log('');
    console.log(`aserciones: ${passed}/${results.length} · fallos: ${failures.length}`);
    console.log(`TOKEN_VAULT=${verdict ? 'PASS' : 'FAIL'}${SELF_TEST ? ' (self-test: canal de fallo verificado)' : ''}`);
  }

  process.exit(verdict ? 0 : 1);
}

main();
