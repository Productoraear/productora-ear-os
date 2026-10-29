/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🔐 AUDITOR REAL — BACKDOORS DE AUTENTICACIÓN ERRADICADOS (W46 · P0)
 * ════════════════════════════════════════════════════════════════════════════
 * No audita intenciones ni comentarios: invoca los handlers REALES
 * (`POST /api/auth/admin-verify` y `POST /api/auth/recovery-3phase`) y exige
 * que los artefactos públicos —el PIN literal, la «fórmula del día» `DD24` y
 * el código mágico de editor— ya NO abran sesión.
 *
 *   1. Estático: los fuentes no contienen `1012`, ni `${todayDay}24`, ni
 *      `input2fa === '2026'` (anti-regresión en código, no en prosa).
 *   2. `DD24` / `24DD` → 401 (antes abría sesión con sólo saber el día).
 *   3. PIN literal `1012` → 401 (antes era el PIN maestro por defecto).
 *   4. `EAR_MASTER_PIN` (entorno) → 200 + `bypass: sovereign_master_pin`.
 *   5. Editor: `'2026'` → 401; fórmula → 401; OTP firmado de Fase 1 → 200.
 *   6. Dirección: el OTP de Fase 1 NO sustituye al TOTP → 401.
 *   7. Challenge caducado → 401.
 *
 * Uso:   node ./node_modules/tsx/dist/cli.mjs scripts/verify_auth_hardening.ts
 * Coste: $0,00 (cero red; secretos de humo inyectados en memoria).
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { NextRequest } from 'next/server';
import { POST as adminVerifyPost } from '../src/app/api/auth/admin-verify/route';
import { POST as recoveryPost } from '../src/app/api/auth/recovery-3phase/route';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

interface AuthPayload {
  readonly success?: boolean;
  readonly bypass?: string;
  readonly role?: string;
  readonly message?: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

/** Secretos de humo: viven sólo en memoria del proceso auditor. */
const SMOKE_SECRETS: Readonly<Record<string, string>> = {
  EAR_ADMIN_PASSWORD: 'Smoke-Admin-2026',
  EAR_EDITOR_PASSWORD: 'Smoke-Editor-2026',
  EAR_SOVEREIGN_MASTER_PASSWORD: 'Smoke-Sovereign-2026',
  EAR_ADMIN_2FA_SECRET: 'JBSWY3DPEHPK3PXP',
  NEXTAUTH_SECRET: 'smoke-nextauth-secret-32-chars-min',
  EAR_MASTER_PIN: '918273',
};

const JWT_SECRET: string = SMOKE_SECRETS.NEXTAUTH_SECRET;
const EDITOR_EMAIL = 'adri521@hotmail.com';
const ADMIN_EMAIL = 'edwin.agudelo@productoraear.com';

function applySmokeEnv(): void {
  for (const [key, value] of Object.entries(SMOKE_SECRETS)) {
    process.env[key] = value;
  }
}

function readSource(relative: string): string {
  return fs.readFileSync(path.join(process.cwd(), relative), 'utf8');
}

function todayDay(): string {
  return String(new Date().getDate()).padStart(2, '0');
}


async function callAdminVerify(body: Record<string, unknown>): Promise<{ status: number; payload: AuthPayload }> {
  const request = new Request('http://localhost:3007/api/auth/admin-verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const response = await adminVerifyPost(request);
  const payload = (await response.json()) as AuthPayload;
  return { status: response.status, payload };
}

function buildChallenge(email: string, role: string, pin: string, ttlMs: number): string {
  const expiresAt: string = String(Date.now() + ttlMs);
  const signature: string = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${email}:${pin}:${expiresAt}:${role}`)
    .digest('hex');
  return `${email}:${pin}:${expiresAt}:${role}:${signature}`;
}

function buildPhase2Token(email: string, role: string, ttlMs: number): string {
  const expiresAt: string = String(Date.now() + ttlMs);
  const signature: string = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`P2_PASSED:${email}:${role}:${expiresAt}`)
    .digest('hex');
  return `${email}:${role}:${expiresAt}:${signature}`;
}

async function callPhase3(
  code2fa: string,
  email: string,
  role: string,
  challenge: string | null,
): Promise<{ status: number; payload: AuthPayload }> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (challenge !== null) headers.cookie = `ear_otp_challenge=${challenge}`;

  const request = new NextRequest('http://localhost:3007/api/auth/recovery-3phase', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'phase3_verify_authenticator',
      code2fa,
      phase2Token: buildPhase2Token(email, role, 10 * 60 * 1000),
    }),
  });

  const response = await recoveryPost(request);
  const payload = (await response.json()) as AuthPayload;
  return { status: response.status, payload };
}

async function main(): Promise<void> {
  applySmokeEnv();

  // ── 1. ANTI-REGRESIÓN ESTÁTICA (código, no comentarios) ──────────────────
  const adminSource: string = readSource('src/app/api/auth/admin-verify/route.ts');
  const recoverySource: string = readSource('src/app/api/auth/recovery-3phase/route.ts');

  check('admin-verify: sin el PIN literal 1012', !/\b1012\b/.test(adminSource), 'cero literal en el binario');
  check('recovery-3phase: sin el PIN literal 1012', !/\b1012\b/.test(recoverySource), 'cero literal en el binario');
  check(
    'admin-verify: sin fórmula del día',
    !/\$\{todayDay\}/.test(adminSource),
    'la fecha ya no es un secreto',
  );
  check(
    'recovery-3phase: sin fórmula del día',
    !/\$\{todayDay\}/.test(recoverySource),
    'la fecha ya no es un secreto',
  );
  check(
    "recovery-3phase: sin código mágico '2026'",
    !/input2fa\s*===\s*'2026'/.test(recoverySource),
    'cero segundo factor hardcodeado',
  );

  // ── 2. LA FÓRMULA DEL DÍA YA NO ABRE SESIÓN ──────────────────────────────
  const day: string = todayDay();
  const formula = await callAdminVerify({ password: '', code2fa: `${day}24` });
  check(
    'DD24 rechazado en admin-verify',
    formula.status === 401 && formula.payload.success !== true,
    `status=${String(formula.status)}`,
  );

  const reversed = await callAdminVerify({ password: '', code2fa: `24${day}` });
  check(
    '24DD rechazado en admin-verify',
    reversed.status === 401 && reversed.payload.success !== true,
    `status=${String(reversed.status)}`,
  );

  // ── 3. EL PIN LITERAL YA NO ES MAESTRO ───────────────────────────────────
  const literalPin = await callAdminVerify({ password: '1012' });
  check(
    'PIN 1012 rechazado como contraseña',
    literalPin.status === 401 && literalPin.payload.success !== true,
    `status=${String(literalPin.status)}`,
  );

  // ── 4. LA VÍA SOBERANA REAL SIGUE VIVA (sin lockout del CEO) ─────────────
  const masterPin = await callAdminVerify({ password: SMOKE_SECRETS.EAR_MASTER_PIN });
  check(
    'EAR_MASTER_PIN abre el acceso soberano',
    masterPin.status === 200 && masterPin.payload.bypass === 'sovereign_master_pin',
    `status=${String(masterPin.status)} bypass=${String(masterPin.payload.bypass)}`,
  );

  const wrongPin = await callAdminVerify({ password: '999999' });
  check('PIN erróneo rechazado', wrongPin.status === 401, `status=${String(wrongPin.status)}`);

  // ── 5. EDITOR: CÓDIGO MÁGICO MUERTO, OTP FIRMADO VIVO ────────────────────
  const editorOtp = '482913';
  const editorChallenge: string = buildChallenge(EDITOR_EMAIL, 'editor', editorOtp, 15 * 60 * 1000);

  const magic = await callPhase3('2026', EDITOR_EMAIL, 'editor', editorChallenge);
  check(
    "Editor: el código '2026' ya no restaura sesión",
    magic.status === 401 && magic.payload.success !== true,
    `status=${String(magic.status)}`,
  );

  const editorFormula = await callPhase3(`${day}24`, EDITOR_EMAIL, 'editor', editorChallenge);
  check(
    'Editor: la fórmula del día tampoco',
    editorFormula.status === 401 && editorFormula.payload.success !== true,
    `status=${String(editorFormula.status)}`,
  );

  const editorOk = await callPhase3(editorOtp, EDITOR_EMAIL, 'editor', editorChallenge);
  check(
    'Editor: el OTP firmado de Fase 1 sí restaura sesión',
    editorOk.status === 200 && editorOk.payload.success === true && editorOk.payload.role === 'editor',
    `status=${String(editorOk.status)} role=${String(editorOk.payload.role)}`,
  );

  // ── 6. DIRECCIÓN: EL OTP NO SUSTITUYE AL TOTP ────────────────────────────
  const adminChallenge: string = buildChallenge(ADMIN_EMAIL, 'admin', '771204', 15 * 60 * 1000);
  const adminReuse = await callPhase3('771204', ADMIN_EMAIL, 'admin', adminChallenge);
  check(
    'Dirección: el OTP de Fase 1 no vale como segundo factor',
    adminReuse.status === 401 && adminReuse.payload.success !== true,
    `status=${String(adminReuse.status)}`,
  );

  // ── 7. CHALLENGE CADUCADO ────────────────────────────────────────────────
  const expiredChallenge: string = buildChallenge(EDITOR_EMAIL, 'editor', editorOtp, -1000);
  const expired = await callPhase3(editorOtp, EDITOR_EMAIL, 'editor', expiredChallenge);
  check(
    'Challenge caducado rechazado',
    expired.status === 401 && expired.payload.success !== true,
    `status=${String(expired.status)}`,
  );

  const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
  for (const item of cases) {
    console.log(`${item.ok ? '✅' : '❌'} ${item.name} — ${item.detail}`);
  }
  console.log(
    JSON.stringify(
      { audit: 'auth_hardening', total: cases.length, passed: cases.length - failed.length, failed: failed.length },
      null,
      2,
    ),
  );
  process.exitCode = failed.length === 0 ? 0 : 1;
}

void main();
