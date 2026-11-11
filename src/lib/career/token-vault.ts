/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · VAULT DE TOKENS OAuth (W53_T02)
 * ════════════════════════════════════════════════════════════════════════════
 * Cifrado autenticado SIMÉTRICO para las credenciales de plataforma que se
 * persisten en `PlatformConnection.encryptedToken` (prisma/schema.prisma:1491).
 *
 * Contrato criptográfico (NO negociable):
 *
 *   1. Algoritmo: AES-256-GCM — cifrado autenticado (AEAD). Un solo primitivo:
 *      prohibido CBC/CTR sin tag (tamper-proofing inexistente).
 *   2. IV de 12 bytes (96 bits) ALEATORIO por operación (`randomBytes`).
 *      Reutilizar IV bajo la misma clave rompe GCM; prohibido IV derivado,
 *      contador global o constante.
 *   3. Auth tag de 16 bytes (128 bits) verificado en `decrypt` vía
 *      `setAuthTag`. Sin tag válido no se descifra: no hay ruta laxa.
 *   4. Clave: 32 bytes (256 bits) desde `CAREER_TOKEN_KEY` en Base64. Jamás
 *      hardcodeada (SEC-3/INV-07), jamás registrada en log (INV-14).
 *   5. AAD opcional: ata el ciphertext a su contexto (p. ej. `artistId|platformId`).
 *      Mover un token cifrado a otra fila invalida el tag.
 *   6. Formato serializado versionado: `v1.<iv>.<tag>.<ciphertext>` en Base64.
 *   7. Cero `any` explícito. Errores tipados sin volcar material secreto.
 *
 * Server-only: `node:crypto` no existe en el bundle de cliente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'node:crypto';

// ── Constantes de formato ───────────────────────────────────────────────────

/** Algoritmo AEAD único del vault. */
export const VAULT_ALGORITHM = 'aes-256-gcm' as const;
/** Prefijo de versión del formato serializado. Permite rotación futura. */
export const VAULT_FORMAT_VERSION = 'v1' as const;
/** Longitud de clave AES-256: 32 bytes (256 bits). */
export const VAULT_KEY_BYTES = 32 as const;
/** Longitud de IV de GCM: 12 bytes (96 bits). */
export const VAULT_IV_BYTES = 12 as const;
/** Longitud del auth tag de GCM: 16 bytes (128 bits). */
export const VAULT_TAG_BYTES = 16 as const;
/** Variable de entorno canónica que porta la clave (Base64 de 32 bytes). */
export const VAULT_KEY_ENV = 'CAREER_TOKEN_KEY' as const;

// ── Errores tipados ─────────────────────────────────────────────────────────

export type TokenVaultErrorCode =
  | 'KEY_MISSING'
  | 'KEY_MALFORMED'
  | 'CIPHERTEXT_MALFORMED'
  | 'AUTH_TAG_MISMATCH';

/**
 * Error del vault. El mensaje JAMÁS contiene el token, la clave, el IV real del
 * payload ni el ciphertext: solo la causa estructural.
 */
export class TokenVaultError extends Error {
  readonly code: TokenVaultErrorCode;

  constructor(code: TokenVaultErrorCode, message: string) {
    super(message);
    this.name = 'TokenVaultError';
    this.code = code;
  }
}

// ── Carga de clave ──────────────────────────────────────────────────────────

/** Fuente inyectable de entorno: desacopla el motor de `process.env` en pruebas. */
export type VaultKeySource = Readonly<Record<string, string | undefined>>;

const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * Lee la clave cruda del entorno. El acceso es por ÍNDICE, no por asignabilidad
 * estructural: `ProcessEnv` de Next declara únicamente `NODE_ENV` (el índice
 * viene de `@types/node`), así que `process.env` no es estructuralmente
 * asignable a un tipo con propiedades nominales. La lectura indexada es el
 * patrón canónico (secretos fuera del contrato de tipos · SEC-3).
 */
function readRawKey(env: VaultKeySource): string | undefined {
  return env[VAULT_KEY_ENV];
}

/**
 * Deriva la clave AES-256 desde Base64. Lanza `KEY_MISSING` si la variable no
 * existe o está vacía, y `KEY_MALFORMED` si no son exactamente 32 bytes.
 * Nunca hay clave por defecto: un fallback silencioso convertiría el vault en
 * una fachada y permitiría descifrar con una clave pública conocida.
 */
export function loadVaultKey(env: VaultKeySource = process.env): Buffer {
  const raw = readRawKey(env);
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    throw new TokenVaultError(
      'KEY_MISSING',
      `Falta la variable de entorno ${VAULT_KEY_ENV} (Base64 de ${VAULT_KEY_BYTES} bytes). ` +
        'El vault no opera sin clave: no existe valor por defecto.',
    );
  }
  const trimmed = raw.trim();
  if (!BASE64_RE.test(trimmed)) {
    throw new TokenVaultError(
      'KEY_MALFORMED',
      `${VAULT_KEY_ENV} no es Base64 válido. Debe codificar exactamente ${VAULT_KEY_BYTES} bytes aleatorios.`,
    );
  }
  const key = Buffer.from(trimmed, 'base64');
  if (key.length !== VAULT_KEY_BYTES) {
    throw new TokenVaultError(
      'KEY_MALFORMED',
      `${VAULT_KEY_ENV} decodifica a ${key.length} bytes; AES-256 exige exactamente ${VAULT_KEY_BYTES}.`,
    );
  }
  return key;
}

/** Genera una clave válida en Base64 para `CAREER_TOKEN_KEY`. No la persiste ni la loguea. */
export function generateVaultKey(): string {
  return randomBytes(VAULT_KEY_BYTES).toString('base64');
}

// ── Tipos de payload ────────────────────────────────────────────────────────

/** Piezas separadas del sobre cifrado (mismo contenido que el string serializado). */
export interface EncryptedTokenEnvelope {
  readonly version: typeof VAULT_FORMAT_VERSION;
  readonly algorithm: typeof VAULT_ALGORITHM;
  /** IV de 12 bytes en Base64. */
  readonly iv: string;
  /** Auth tag de 16 bytes en Base64. */
  readonly authTag: string;
  /** Texto cifrado en Base64. */
  readonly ciphertext: string;
}

/** Opciones del cifrado. AAD opcional para atar el sobre a su fila de origen. */
export interface EncryptOptions {
  readonly aad?: string | undefined;
  /** Inyección de entorno para pruebas; por defecto `process.env`. */
  readonly env?: VaultKeySource | undefined;
}

/** Opciones del descifrado. El AAD debe ser IDÉNTICO al usado al cifrar. */
export interface DecryptOptions {
  readonly aad?: string | undefined;
  readonly env?: VaultKeySource | undefined;
}

/** Resultado interno del pipeline de descifrado (compartido por string y sobre). */
interface RawDecryptResult {
  readonly plaintext: string;
  readonly version: string;
}

// ── Serialización ───────────────────────────────────────────────────────────

/**
 * Serializa el sobre a `v1.<iv>.<tag>.<ciphertext>` (Base64 por segmento).
 * Determinista y sin ambigüedad: 4 segmentos exactos.
 */
export function serializeEnvelope(envelope: EncryptedTokenEnvelope): string {
  return [envelope.version, envelope.iv, envelope.authTag, envelope.ciphertext].join('.');
}

/** Estrecha un segmento a `string` no vacío o lanza. Da tipos reales, no solo validación. */
function assertBase64Segment(segment: string | undefined, label: string): string {
  if (typeof segment !== 'string' || segment.length === 0) {
    throw new TokenVaultError('CIPHERTEXT_MALFORMED', `Segmento "${label}" ausente en el sobre.`);
  }
  if (!BASE64_RE.test(segment)) {
    throw new TokenVaultError('CIPHERTEXT_MALFORMED', `Segmento "${label}" no es Base64 válido.`);
  }
  return segment;
}

function decodeBase64Segment(segment: string | undefined, label: string): Buffer {
  return Buffer.from(assertBase64Segment(segment, label), 'base64');
}

/**
 * Parsea y valida ESTRUCTURALMENTE el sobre serializado. No descifra nada.
 * Rechaza versión desconocida, segmentos faltantes o longitudes incorrectas
 * antes de tocar el motor criptográfico.
 */
export function parseEnvelope(serialized: string): EncryptedTokenEnvelope {
  if (typeof serialized !== 'string' || serialized.length === 0) {
    throw new TokenVaultError('CIPHERTEXT_MALFORMED', 'Sobre cifrado vacío o no textual.');
  }
  const parts = serialized.split('.');
  if (parts.length !== 4) {
    throw new TokenVaultError(
      'CIPHERTEXT_MALFORMED',
      `Sobre cifrado con ${parts.length} segmentos; el formato ${VAULT_FORMAT_VERSION} exige 4.`,
    );
  }
  const version = parts[0];
  if (version !== VAULT_FORMAT_VERSION) {
    throw new TokenVaultError(
      'CIPHERTEXT_MALFORMED',
      `Versión de sobre desconocida: "${String(version)}" (esperado ${VAULT_FORMAT_VERSION}).`,
    );
  }
  const iv = assertBase64Segment(parts[1], 'iv');
  const authTag = assertBase64Segment(parts[2], 'authTag');
  const ciphertext = assertBase64Segment(parts[3], 'ciphertext');

  const ivBytes = decodeBase64Segment(iv, 'iv');
  const tagBytes = decodeBase64Segment(authTag, 'authTag');
  const ctBytes = decodeBase64Segment(ciphertext, 'ciphertext');
  if (ivBytes.length !== VAULT_IV_BYTES) {
    throw new TokenVaultError(
      'CIPHERTEXT_MALFORMED',
      `IV de ${ivBytes.length} bytes; GCM exige ${VAULT_IV_BYTES}.`,
    );
  }
  if (tagBytes.length !== VAULT_TAG_BYTES) {
    throw new TokenVaultError(
      'CIPHERTEXT_MALFORMED',
      `Auth tag de ${tagBytes.length} bytes; GCM exige ${VAULT_TAG_BYTES}.`,
    );
  }
  if (ctBytes.length === 0) {
    throw new TokenVaultError('CIPHERTEXT_MALFORMED', 'Ciphertext vacío: no hay nada que descifrar.');
  }
  return { version: VAULT_FORMAT_VERSION, algorithm: VAULT_ALGORITHM, iv, authTag, ciphertext };
}

// ── Motor ───────────────────────────────────────────────────────────────────

/**
 * Cifra un token OAuth y devuelve el sobre serializado listo para
 * `PlatformConnection.encryptedToken`.
 * IV nuevo (12 bytes aleatorios) por llamada: dos cifrados del MISMO token
 * producen ciphertexts distintos (semántica probabilística correcta).
 */
export function encryptToken(plaintext: string, options: EncryptOptions = {}): string {
  if (typeof plaintext !== 'string' || plaintext.length === 0) {
    throw new TokenVaultError('CIPHERTEXT_MALFORMED', 'Token a cifrar vacío o no textual.');
  }
  const key = loadVaultKey(options.env ?? process.env);
  const iv = randomBytes(VAULT_IV_BYTES);
  const cipher = createCipheriv(VAULT_ALGORITHM, key, iv, { authTagLength: VAULT_TAG_BYTES });
  if (typeof options.aad === 'string') cipher.setAAD(Buffer.from(options.aad, 'utf8'));

  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return serializeEnvelope({
    version: VAULT_FORMAT_VERSION,
    algorithm: VAULT_ALGORITHM,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  });
}

/** Núcleo común de descifrado. Toda manipulación termina en `AUTH_TAG_MISMATCH`. */
function decryptRaw(envelope: EncryptedTokenEnvelope, options: DecryptOptions): RawDecryptResult {
  const key = loadVaultKey(options.env ?? process.env);
  const iv = Buffer.from(envelope.iv, 'base64');
  const authTag = Buffer.from(envelope.authTag, 'base64');
  const ciphertext = Buffer.from(envelope.ciphertext, 'base64');

  const decipher = createDecipheriv(VAULT_ALGORITHM, key, iv, { authTagLength: VAULT_TAG_BYTES });
  if (typeof options.aad === 'string') decipher.setAAD(Buffer.from(options.aad, 'utf8'));
  decipher.setAuthTag(authTag);

  let plaintextBuffer: Buffer;
  try {
    plaintextBuffer = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch {
    // `final()` falla cuando el tag no valida: ciphertext, IV, tag o AAD manipulados.
    throw new TokenVaultError(
      'AUTH_TAG_MISMATCH',
      'Autenticación GCM fallida: el sobre cifrado fue manipulado o el AAD no corresponde.',
    );
  }
  return { plaintext: plaintextBuffer.toString('utf8'), version: envelope.version };
}

/**
 * Descifra un sobre serializado y verifica el auth tag. Si el payload fue
 * alterado en cualquier byte, lanza `AUTH_TAG_MISMATCH` (tamper-proofing) en
 * lugar de devolver basura: GCM jamás devuelve texto no autenticado.
 */
export function decryptToken(serialized: string, options: DecryptOptions = {}): string {
  const envelope = parseEnvelope(serialized);
  return decryptRaw(envelope, options).plaintext;
}

/** Descifra un sobre ya descompuesto (útil en migraciones de formato). */
export function decryptEnvelope(
  envelope: EncryptedTokenEnvelope,
  options: DecryptOptions = {},
): string {
  const validated = parseEnvelope(serializeEnvelope(envelope));
  return decryptRaw(validated, options).plaintext;
}

// ── Utilidades de verificación ──────────────────────────────────────────────

/**
 * ¿Es `serialized` un sobre bien formado del vault? Comprueba estructura y
 * longitudes, NO valida el tag (para eso está `decryptToken`). Nunca lanza.
 */
export function isEncryptedTokenShape(serialized: string | null | undefined): boolean {
  if (typeof serialized !== 'string' || serialized.length === 0) return false;
  try {
    parseEnvelope(serialized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Comparación en tiempo constante de dos textos (tokens de acceso o `state`
 * anti-CSRF de W53_T04). No filtra contenido por temporización.
 */
export function safeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
