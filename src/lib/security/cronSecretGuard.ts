/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN DEL SECRETO DE CRON — SSOT DE AUTENTICACIÓN MÁQUINA (P0)
 * ════════════════════════════════════════════════════════════════════════════
 * Bug que este módulo cierra (incidente medido 2026-10-30):
 *   `POST /api/outreach/intake` respondía 401 en el smoke de producción y el
 *   diagnóstico era una adivinanza. La ruta comparaba
 *   `headers.get('authorization') !== \`Bearer ${secret}\``: sensible a UN
 *   carácter, a un salto de línea del copia-pega, a las comillas que añade el
 *   panel del proveedor y a un prefijo `Bearer ` pegado DENTRO del secreto.
 *   Además el servidor no publicaba ninguna huella, así que "secreto distinto"
 *   era indistinguible de "secreto ausente" y de "cabecera mal formada".
 *
 * Reglas de este módulo:
 *  · Fail-closed en producción: sin secreto configurado → 503, nunca 200.
 *  · Comparación en TIEMPO CONSTANTE sobre digests SHA-256 (`safeEqual`), para
 *    no filtrar por temporización ni la longitud del secreto.
 *  · Rotación sin ventana de 401: acepta CRON_SECRET + _SECONDARY + _LEGACY.
 *  · Diagnóstico SIN filtrar el secreto: sólo huellas truncadas de 48 bits
 *    (`sha256:` + 12 hex) y longitudes. La huella no permite recuperar el
 *    secreto: sólo confirma "mismo valor / valor distinto" entre GitHub Secrets
 *    y el VPS. Si el secreto mide menos de 32 caracteres la huella se RETIENE
 *    (`WITHHELD_WEAK_SECRET`): publicar la huella de un secreto débil sí
 *    abarataría su fuerza bruta.
 *  · Normalización SIMÉTRICA (servidor y cliente): BOM, espacios y saltos de
 *    línea del copia-pega, comillas envolventes y prefijo `Bearer `.
 *
 * Módulo PURO de servidor (`node:crypto`): jamás importar en Client Component.
 * Verificador ejecutable: `npm run verify:cron-secret`.
 * Sonda real contra producción: `npm run probe:cron`.
 * ════════════════════════════════════════════════════════════════════════════
 */
import crypto from 'node:crypto';

import { safeEqual } from './constantTime';

/**
 * Alias de cabecera aceptados, en orden de precedencia. `authorization` es el
 * contrato estándar (GitHub Actions, n8n, Coolify cron); `x-cron-secret` y el
 * histórico `x-admin-secret` (telemetría) se aceptan porque transportan EL
 * MISMO valor y así ninguna integración viva se rompe al centralizar el SSOT.
 * Verificado en disco el 2026-10-30: `x-admin-secret` sólo lo leía
 * `api/telemetry/funnel`, ningún otro consumidor del repo lo envía.
 */
export const CRON_SECRET_HEADER_NAMES = [
  'authorization',
  'x-cron-secret',
  'x-admin-secret',
] as const;

export type CronSecretHeaderName = (typeof CRON_SECRET_HEADER_NAMES)[number];

/** Claves de entorno aceptadas, en orden de precedencia (rotación sin caída). */
export const CRON_SECRET_ENV_KEYS = [
  'CRON_SECRET',
  'CRON_SECRET_SECONDARY',
  'CRON_SECRET_LEGACY',
] as const;

export type CronSecretEnvKey = (typeof CRON_SECRET_ENV_KEYS)[number];

/** Hex publicado de la huella: 12 hex = 48 bits. Suficiente para comparar,
 *  insuficiente para reconstruir el secreto (que exige ≥32 caracteres). */
const FINGERPRINT_HEX_LENGTH = 12;

/** Por debajo de esta longitud no se publica huella (secreto débil). */
export const CRON_MIN_FINGERPRINTABLE_LENGTH = 32;

export const CRON_FINGERPRINT_WITHHELD = 'WITHHELD_WEAK_SECRET';
export const CRON_FINGERPRINT_ABSENT = 'ABSENT';
export const CRON_FINGERPRINT_NONE = 'NONE';

/**
 * Normaliza un secreto tal y como lo entrega un humano por copia-pega.
 * Es la MISMA función para el valor del servidor y para el que presenta el
 * cliente, de modo que una diferencia de forma (no de contenido) nunca produzca
 * un 401 fantasma. No relaja la seguridad: sólo recorta ruido de transporte.
 */
export function normalizeCronSecret(raw: string | null | undefined): string {
  if (typeof raw !== 'string') return '';
  let value = raw.replace(/^\uFEFF/, '').trim();
  // El header completo pegado por error dentro del secreto del panel.
  value = value.replace(/^bearer\s+/i, '').trim();
  // Comillas envolventes del copia-pega ("..." o '...').
  if (value.length >= 2) {
    const first = value.charAt(0);
    const last = value.charAt(value.length - 1);
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      value = value.slice(1, -1).trim();
    }
  }
  return value;
}

/** Huella pública de un secreto: `sha256:<12 hex>`. Nunca devuelve el valor. */
export function fingerprintCronSecret(raw: string | null | undefined): string {
  const value = normalizeCronSecret(raw);
  if (value.length === 0) return CRON_FINGERPRINT_ABSENT;
  if (value.length < CRON_MIN_FINGERPRINTABLE_LENGTH) return CRON_FINGERPRINT_WITHHELD;
  return `sha256:${digestHex(value).slice(0, FINGERPRINT_HEX_LENGTH)}`;
}

function digestHex(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

/** Entrada interna: lleva el digest completo, que NO se exporta jamás. */
interface CronSecretEntry {
  readonly key: CronSecretEnvKey;
  readonly digest: string;
  readonly fingerprint: string;
  readonly length: number;
}

/** Secreto configurado, en forma pública (sin digest, sin valor). */
export interface ConfiguredCronSecret {
  readonly key: CronSecretEnvKey;
  readonly fingerprint: string;
  readonly length: number;
}

function collectSecretEntries(env: NodeJS.ProcessEnv): CronSecretEntry[] {
  const entries: CronSecretEntry[] = [];
  const seenDigests = new Set<string>();

  for (const key of CRON_SECRET_ENV_KEYS) {
    const value = normalizeCronSecret(env[key]);
    if (value.length === 0) continue;
    const digest = digestHex(value);
    // Dos claves con el mismo valor son una sola credencial: no dupliques la
    // huella en el diagnóstico (evita confundir al operador con "dos servidores").
    if (seenDigests.has(digest)) continue;
    seenDigests.add(digest);
    entries.push({
      key,
      digest,
      fingerprint: fingerprintCronSecret(value),
      length: value.length,
    });
  }

  return entries;
}

/** Censo público de credenciales configuradas en el proceso. */
export function configuredCronSecrets(
  env: NodeJS.ProcessEnv = process.env,
): ConfiguredCronSecret[] {
  return collectSecretEntries(env).map((entry) => ({
    key: entry.key,
    fingerprint: entry.fingerprint,
    length: entry.length,
  }));
}

/** Instantánea pública para `/api/health`: prueba de configuración sin valor. */
export interface CronSecretHealth {
  readonly configured: boolean;
  readonly keys: readonly CronSecretEnvKey[];
  readonly fingerprints: readonly string[];
  readonly weak: boolean;
  readonly mode: 'fail-closed' | 'dev-bypass';
  readonly minFingerprintLength: number;
}

export function cronSecretHealth(env: NodeJS.ProcessEnv = process.env): CronSecretHealth {
  const entries = collectSecretEntries(env);
  const production = (env.NODE_ENV ?? '') === 'production';
  return {
    configured: entries.length > 0,
    keys: entries.map((entry) => entry.key),
    fingerprints: entries.map((entry) => entry.fingerprint),
    weak: entries.some((entry) => entry.fingerprint === CRON_FINGERPRINT_WITHHELD),
    mode: production ? 'fail-closed' : 'dev-bypass',
    minFingerprintLength: CRON_MIN_FINGERPRINTABLE_LENGTH,
  };
}

// ─── Veredicto de autenticación ───────────────────────────────────────────────

export type CronAuthReason =
  | 'OK'
  | 'DEV_BYPASS'
  | 'NOT_CONFIGURED'
  | 'NO_CREDENTIAL'
  | 'MISMATCH';

export interface CronAuthVerdict {
  readonly ok: boolean;
  readonly reason: CronAuthReason;
  /** 200 = pasa · 401 = credencial ausente o distinta · 503 = fail-closed. */
  readonly status: 200 | 401 | 503;
  readonly presentedSource: CronSecretHeaderName | null;
  readonly presentedFingerprint: string | null;
  readonly presentedLength: number;
  readonly matchedKey: CronSecretEnvKey | null;
  readonly configured: readonly CronSecretEnvKey[];
  readonly configuredFingerprints: readonly string[];
}

interface PresentedSecret {
  readonly value: string;
  readonly source: CronSecretHeaderName;
}

/**
 * Extrae la credencial de la petición. Acepta el contrato estándar
 * (`Authorization: Bearer <secreto>`, que es lo que usan GitHub Actions, n8n y
 * los crons) y `x-cron-secret` como alias para integraciones que no pueden
 * tocar `Authorization`. Nunca registra el valor.
 */
function readPresentedSecret(headers: Headers): PresentedSecret | null {
  const authorization = headers.get('authorization');
  if (authorization !== null && authorization.trim().length > 0) {
    const bearer = /^bearer\s+(.+)$/i.exec(authorization.trim());
    return {
      value: normalizeCronSecret(bearer ? bearer[1] : authorization),
      source: 'authorization',
    };
  }
  const direct = headers.get('x-cron-secret');
  if (direct !== null && direct.trim().length > 0) {
    return { value: normalizeCronSecret(direct), source: 'x-cron-secret' };
  }
  const admin = headers.get('x-admin-secret');
  if (admin !== null && admin.trim().length > 0) {
    return { value: normalizeCronSecret(admin), source: 'x-admin-secret' };
  }
  return null;
}

/**
 * Veredicto único de autenticación máquina-a-máquina.
 * · producción sin secreto → 503 (fail-closed, jamás 200).
 * · desarrollo sin secreto → 200 DEV_BYPASS (comportamiento histórico local).
 * · cabecera ausente/vacía → 401 NO_CREDENTIAL (distinto de "secreto malo").
 * · cabecera presente y distinta → 401 MISMATCH con ambas huellas.
 */
export function verifyCronSecret(
  request: { readonly headers: Headers },
  env: NodeJS.ProcessEnv = process.env,
): CronAuthVerdict {
  const entries = collectSecretEntries(env);
  const configuredKeys = entries.map((entry) => entry.key);
  const configuredFingerprints = entries.map((entry) => entry.fingerprint);
  const presented = readPresentedSecret(request.headers);
  const presentedValue = normalizeCronSecret(presented?.value ?? '');
  const presentedFingerprint =
    presented === null ? null : fingerprintCronSecret(presentedValue);

  if (entries.length === 0) {
    const production = (env.NODE_ENV ?? '') === 'production';
    return {
      ok: !production,
      reason: production ? 'NOT_CONFIGURED' : 'DEV_BYPASS',
      status: production ? 503 : 200,
      presentedSource: presented?.source ?? null,
      presentedFingerprint,
      presentedLength: presentedValue.length,
      matchedKey: null,
      configured: configuredKeys,
      configuredFingerprints,
    };
  }

  if (presented === null || presentedValue.length === 0) {
    return {
      ok: false,
      reason: 'NO_CREDENTIAL',
      status: 401,
      presentedSource: presented?.source ?? null,
      presentedFingerprint,
      presentedLength: presentedValue.length,
      matchedKey: null,
      configured: configuredKeys,
      configuredFingerprints,
    };
  }

  const candidateDigest = digestHex(presentedValue);
  const matched = entries.find((entry) => safeEqual(candidateDigest, entry.digest)) ?? null;

  return {
    ok: matched !== null,
    reason: matched === null ? 'MISMATCH' : 'OK',
    status: matched === null ? 401 : 200,
    presentedSource: presented.source,
    presentedFingerprint,
    presentedLength: presentedValue.length,
    matchedKey: matched === null ? null : matched.key,
    configured: configuredKeys,
    configuredFingerprints,
  };
}

// ─── Diagnóstico legible (sin filtrar el secreto) ─────────────────────────────

export interface CronAuthFailureBody {
  readonly ok: false;
  readonly code: 'CRON_SECRET_MISMATCH' | 'CRON_SECRET_ABSENT' | 'CRON_SECRET_NOT_CONFIGURED';
  readonly error: string;
  readonly presented: string;
  readonly presentedLength: number;
  readonly configured: readonly string[];
  readonly keys: readonly string[];
  readonly hint: string;
}

/**
 * Cuerpo de error accionable. Convierte el 401 mudo en una comparación de
 * huellas: si `presented` ≠ `configured`, el valor de GitHub Secrets y el del
 * VPS no son el mismo; si `presented` es `NONE`, la cabecera no viajó.
 */
export function describeCronAuthFailure(verdict: CronAuthVerdict): CronAuthFailureBody {
  const presented = verdict.presentedFingerprint ?? CRON_FINGERPRINT_NONE;

  if (verdict.reason === 'NOT_CONFIGURED') {
    return {
      ok: false,
      code: 'CRON_SECRET_NOT_CONFIGURED',
      error: 'CRON_SECRET no configurado en el servidor: fallo cerrado.',
      presented,
      presentedLength: verdict.presentedLength,
      configured: verdict.configuredFingerprints,
      keys: verdict.configured,
      hint:
        'Define CRON_SECRET en el entorno del despliegue (Coolify). Sin secreto ' +
        'esta ruta no atiende en produccion por diseno (fail-closed).',
    };
  }

  if (verdict.reason === 'NO_CREDENTIAL') {
    return {
      ok: false,
      code: 'CRON_SECRET_ABSENT',
      error: 'No autorizado: falta la credencial de cron.',
      presented,
      presentedLength: verdict.presentedLength,
      configured: verdict.configuredFingerprints,
      keys: verdict.configured,
      hint:
        'Envia `Authorization: Bearer <CRON_SECRET>` (o `x-cron-secret`). Se ' +
        'recibio una cabecera vacia o ausente, no un secreto distinto.',
    };
  }

  return {
    ok: false,
    code: 'CRON_SECRET_MISMATCH',
    error: 'No autorizado: la credencial de cron no coincide.',
    presented,
    presentedLength: verdict.presentedLength,
    configured: verdict.configuredFingerprints,
    keys: verdict.configured,
    hint:
      'Compara `presented` con `configured`: si son distintas, el secreto del ' +
      'cliente (GitHub Secrets / n8n) y el del VPS (Coolify) no son el mismo ' +
      'valor. Si solo difiere la longitud, sobra un salto de linea o unas ' +
      'comillas. Diagnostico maquina: `npm run probe:cron`.',
  };
}
