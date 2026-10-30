/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DEL GUARDIÁN DE CRON_SECRET — `npm run verify:cron-secret`
 * ═══════════════════════════════════════════════════════════════════════════════
 * Prueba hostil del SSOT `src/lib/security/cronSecretGuard.ts`, que es quien
 * decide si `POST /api/outreach/intake` (y los crons) atienden o devuelven 401:
 *
 *   A) NEWLINE   — el secreto llega con salto de línea del copia-pega: PASA.
 *   B) QUOTES    — el panel guardó "secreto" con comillas: PASA.
 *   C) BOM       — BOM UTF-8 delante: PASA.
 *   D) BEARER    — el valor del panel ya incluye "Bearer ": PASA.
 *   E) MUTADO    — un carácter distinto: 401 MISMATCH con HUELLAS distintas.
 *   F) AUSENTE   — sin cabecera: 401 NO_CREDENTIAL (distinto de secreto malo).
 *   G) FAILCLOSE — producción sin secreto: 503, jamás 200.
 *   H) DEVBYPASS — desarrollo sin secreto: 200 DEV_BYPASS (comportamiento local).
 *   I) ROTACION  — CRON_SECRET_SECONDARY vale durante la rotación: PASA.
 *   J) ALIAS     — cabecera `x-cron-secret`: PASA.
 *   K) FUGA      — la huella NO contiene el secreto y mide `sha256:` + 12 hex.
 *   L) DEBIL     — secreto < 32 caracteres: huella RETENIDA y `weak=true`.
 *   M) CONTRATO  — el cuerpo del 401 declara el código y NO filtra el valor.
 *   N) NORMAL    — normalización simétrica (unitaria).
 *
 * Exit 0 sólo si las 14 pruebas pasan. Cualquier fallo → Exit 1.
 * Salida ASCII pura (Windows PowerShell / CI sin mojibake).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  CRON_FINGERPRINT_WITHHELD,
  cronSecretHealth,
  describeCronAuthFailure,
  fingerprintCronSecret,
  normalizeCronSecret,
  verifyCronSecret,
} from '../src/lib/security/cronSecretGuard';

interface Check {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const CHECKS: Check[] = [];

function push(name: string, ok: boolean, detail: string): void {
  CHECKS.push({ name, ok, detail });
}

/** Secreto de 40 caracteres (>= 32 exige huella publicable). */
const SECRET = 'kR7dQ2mLp9XtV4zN8sW1yB6cF0gH3jK5aE2uT7iO';
/** Clave secundaria para probar la ventana de rotación. */
const SECONDARY = 'Zx4Vb7Nm2Qw9Er5Ty1Ui8Op3As6Df0Gh4Jk7Lz2Xc';

const PROD_ENV: NodeJS.ProcessEnv = { NODE_ENV: 'production', CRON_SECRET: SECRET };

function headers(init: Record<string, string>): Headers {
  return new Headers(init);
}

function bearer(value: string): Headers {
  return headers({ authorization: `Bearer ${value}` });
}

function verify(headerBag: Headers, env: NodeJS.ProcessEnv = PROD_ENV) {
  return verifyCronSecret({ headers: headerBag }, env);
}

function main(): number {
  // A) Salto de línea + espacios del copia-pega.
  {
    const verdict = verify(bearer(`${SECRET}\r\n `));
    push('A NEWLINE tolerada', verdict.ok && verdict.reason === 'OK', `reason=${verdict.reason}`);
  }

  // B) Comillas envolventes (paneles que serializan strings).
  {
    const verdict = verify(bearer(`"${SECRET}"`));
    push('B QUOTES toleradas', verdict.ok, `reason=${verdict.reason}`);
  }

  // C) BOM UTF-8 en el valor CONFIGURADO (el panel lo pega así). Ojo: una
  //    cabecera HTTP no puede transportar U+FEFF (undici la rechaza por
  //    ByteString), así que el BOM solo puede entrar por el lado del servidor.
  {
    const bomEnv: NodeJS.ProcessEnv = { NODE_ENV: 'production', CRON_SECRET: `\uFEFF${SECRET}` };
    const verdict = verify(bearer(SECRET), bomEnv);
    push('C BOM configurado tolerado', verdict.ok, `reason=${verdict.reason}`);
  }

  // D) Prefijo "Bearer " pegado DENTRO del secreto del panel.
  {
    const env: NodeJS.ProcessEnv = { NODE_ENV: 'production', CRON_SECRET: `Bearer ${SECRET}` };
    const verdict = verify(bearer(SECRET), env);
    push('D BEARER interno tolerado', verdict.ok, `reason=${verdict.reason}`);
  }

  // E) Un carácter mutado: 401 MISMATCH y huellas distintas.
  {
    const mutated = `${SECRET.slice(0, -1)}X`;
    const verdict = verify(bearer(mutated));
    const fingerprintsDiffer = verdict.presentedFingerprint !== fingerprintCronSecret(SECRET);
    push(
      'E MUTADO rechazado con huellas distintas',
      !verdict.ok && verdict.status === 401 && verdict.reason === 'MISMATCH' && fingerprintsDiffer,
      `reason=${verdict.reason} status=${verdict.status} distinct=${fingerprintsDiffer}`,
    );
  }

  // F) Sin cabecera: NO_CREDENTIAL, no MISMATCH.
  {
    const verdict = verify(headers({}));
    push(
      'F AUSENTE es NO_CREDENTIAL',
      !verdict.ok && verdict.status === 401 && verdict.reason === 'NO_CREDENTIAL',
      `reason=${verdict.reason} status=${verdict.status}`,
    );
  }

  // G) Fail-closed en producción.
  {
    const verdict = verify(bearer(SECRET), { NODE_ENV: 'production' });
    push(
      'G FAILCLOSE produccion sin secreto',
      !verdict.ok && verdict.status === 503 && verdict.reason === 'NOT_CONFIGURED',
      `reason=${verdict.reason} status=${verdict.status}`,
    );
  }

  // H) Bypass local documentado (desarrollo sin secreto).
  {
    const verdict = verify(headers({}), { NODE_ENV: 'development' });
    push(
      'H DEVBYPASS desarrollo sin secreto',
      verdict.ok && verdict.reason === 'DEV_BYPASS' && verdict.status === 200,
      `reason=${verdict.reason} status=${verdict.status}`,
    );
  }

  // I) Rotación sin ventana de 401.
  {
    const env: NodeJS.ProcessEnv = {
      NODE_ENV: 'production',
      CRON_SECRET: SECRET,
      CRON_SECRET_SECONDARY: SECONDARY,
    };
    const verdict = verify(bearer(SECONDARY), env);
    push(
      'I ROTACION clave secundaria aceptada',
      verdict.ok && verdict.matchedKey === 'CRON_SECRET_SECONDARY',
      `matched=${verdict.matchedKey ?? 'none'}`,
    );
  }

  // J) Alias x-cron-secret.
  {
    const verdict = verify(headers({ 'x-cron-secret': SECRET }));
    push(
      'J ALIAS x-cron-secret aceptado',
      verdict.ok && verdict.presentedSource === 'x-cron-secret',
      `source=${verdict.presentedSource ?? 'none'}`,
    );
  }

  // K) La huella no filtra el secreto.
  {
    const fp = fingerprintCronSecret(SECRET);
    const shapeOk = /^sha256:[0-9a-f]{12}$/.test(fp);
    push('K FUGA huella opaca', shapeOk && !fp.includes(SECRET), `fingerprint=${fp} shape=${shapeOk}`);
  }

  // L) Secreto débil: huella retenida y `weak=true`.
  {
    const weakEnv: NodeJS.ProcessEnv = { NODE_ENV: 'production', CRON_SECRET: 'corto123' };
    const health = cronSecretHealth(weakEnv);
    const fp = fingerprintCronSecret('corto123');
    push(
      'L DEBIL huella retenida',
      fp === CRON_FINGERPRINT_WITHHELD && health.weak && health.configured,
      `fingerprint=${fp} weak=${health.weak} configured=${health.configured}`,
    );
  }

  // M) Contrato del 401: código explícito y cero fuga del valor.
  {
    const verdict = verify(bearer(`${SECRET.slice(0, -1)}X`));
    const body = describeCronAuthFailure(verdict);
    const serialized = JSON.stringify(body);
    push(
      'M CONTRATO 401 sin fuga',
      body.code === 'CRON_SECRET_MISMATCH' &&
        serialized.includes(verdict.presentedFingerprint ?? 'NONE') &&
        !serialized.includes(SECRET),
      `code=${body.code} len=${serialized.length}`,
    );
  }

  // O) Alias histórico x-admin-secret (lo usaba `api/telemetry/funnel`).
  {
    const verdict = verify(headers({ 'x-admin-secret': SECRET }));
    push(
      'O ALIAS x-admin-secret aceptado',
      verdict.ok && verdict.presentedSource === 'x-admin-secret',
      `source=${verdict.presentedSource ?? 'none'}`,
    );
  }

  // N) Normalización simétrica (unitaria).
  {
    const normalized = normalizeCronSecret(`  "${SECRET}"  `);
    push('N NORMALIZACION simetrica', normalized === SECRET, `len=${normalized.length}`);
  }

  const passed = CHECKS.filter((check) => check.ok).length;
  console.log('');
  console.log('='.repeat(72));
  console.log(`RESUMEN: ${passed}/${CHECKS.length} [OK] | guardian de CRON_SECRET`);
  console.log('='.repeat(72));
  for (const check of CHECKS) {
    console.log(`  ${check.ok ? '[OK]  ' : '[FAIL]'} ${check.name} -> ${check.detail}`);
  }
  if (passed !== CHECKS.length) {
    console.log('');
    console.log('FALLOS:');
    CHECKS.filter((check) => !check.ok).forEach((check) => console.log(`  - ${check.name}: ${check.detail}`));
    return 1;
  }
  return 0;
}

process.exit(main());
