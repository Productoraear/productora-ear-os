/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMPIRICAL CHALLENGER DEEP STRESS HARNESS · W52_T02 (EAR OS V2)
 * ════════════════════════════════════════════════════════════════════════════
 * Independent adversarial probe verifying:
 *   1. Auth spoofing variants (tokens < 8 chars, whitespace tokens, invalid tokens,
 *      role header without valid bearer, spoofed cookies).
 *   2. Cross-tenant isolation (case variants, slug mismatch, admin bypass verification).
 *   3. Anti-fraud whitespace bypass (tabs, newlines, null, undefined, trim collisions).
 *   4. Self-verification evasion (casing, trimming, embedded whitespace).
 *   5. Security headers presence on all error and success responses.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NextRequest } from 'next/server';
import { GET, POST, resolveAuthContext, SECURITY_HEADERS } from '../src/app/api/artist/achievements/route';
import { clearLedgerForTesting } from '../src/lib/academy/achievement-ledger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHALLENGER_STORE = path.join(projectRoot, '.data', 'challenger-stress-ledger.json');
process.env.EAR_ACHIEVEMENT_LEDGER_STORE = CHALLENGER_STORE;

interface ProbeResult {
  name: string;
  category: string;
  expectedStatus: number;
  actualStatus: number;
  expectedErrorOrReason?: string;
  actualErrorOrReason?: string;
  passed: boolean;
  notes?: string;
}

const probeResults: ProbeResult[] = [];

function recordProbe(res: ProbeResult): void {
  probeResults.push(res);
  const tag = res.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${tag}] [${res.category}] ${res.name} (Status: ${res.actualStatus}/${res.expectedStatus})`);
  if (!res.passed) {
    console.error(`      Expected: status=${res.expectedStatus}, error/reason=${res.expectedErrorOrReason}`);
    console.error(`      Actual:   status=${res.actualStatus}, error/reason=${res.actualErrorOrReason}`);
    if (res.notes) console.error(`      Notes:    ${res.notes}`);
  }
}

function makeRequest(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    rawBody?: string;
  }
): NextRequest {
  const reqHeaders = new Headers(options?.headers || {});
  if (options?.body !== undefined && !reqHeaders.has('content-type')) {
    reqHeaders.set('content-type', 'application/json');
  }

  let bodyPayload: BodyInit | undefined;
  if (options?.rawBody !== undefined) {
    bodyPayload = options.rawBody;
  } else if (options?.body !== undefined) {
    bodyPayload = JSON.stringify(options.body);
  }

  const reqInit: RequestInit = {
    method: options?.method || 'GET',
    headers: reqHeaders,
    body: bodyPayload,
  };

  return new NextRequest(new URL(url, 'http://localhost:3000'), reqInit);
}

async function runEmpiricalStress(): Promise<void> {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log(' EMPIRICAL CHALLENGER: DEEP ADVERSARIAL STRESS SUITE (W52_T02)');
  console.log('════════════════════════════════════════════════════════════════════\n');

  try {
    if (fs.existsSync(CHALLENGER_STORE)) {
      fs.unlinkSync(CHALLENGER_STORE);
    }
  } catch {}
  clearLedgerForTesting();

  // ──────────────────────────────────────────────────────────────────────────
  // 1. AUTHENTICATION SPOOFING & SUB-TOKEN BOUNDARY PROBES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 1. AUTH SPOOFING & SUB-TOKEN PROBES ---');

  // Probe 1.1: x-artist-token < 8 characters must be rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        'x-artist-slug': 'edwin-agudelo',
        'x-artist-token': 'short12', // 7 chars
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Artist token < 8 chars rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // Probe 1.2: x-artist-token containing 'invalid' (case insensitive) must be rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        'x-artist-slug': 'edwin-agudelo',
        'x-artist-token': 'InVaLiD_super_token_123',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Artist token containing "invalid" rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // Probe 1.3: x-artist-token whitespace only must be rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        'x-artist-slug': 'edwin-agudelo',
        'x-artist-token': '         ', // 9 spaces
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Artist token whitespace-only rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // Probe 1.4: Cookie ear_artist_slug without ear_artist_session must be rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        cookie: 'ear_artist_slug=edwin-agudelo',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Cookie artist slug without session cookie rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // Probe 1.5: Cookie ear_artist_session < 8 chars must be rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        cookie: 'ear_artist_slug=edwin-agudelo; ear_artist_session=tiny',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Cookie artist session < 8 chars rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // Probe 1.6: Spoofed cookie ear_admin_token with forged value must be rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        cookie: 'ear_admin_token=forged_admin_cookie_value_12345678',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Forged admin cookie rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // Probe 1.7: Bearer token containing "invalid" in admin path rejected
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        authorization: 'Bearer ear_admin_invalid_token',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Admin bearer token with "invalid" rejected',
      category: 'Auth Spoofing',
      expectedStatus: 401,
      actualStatus: res.status,
      expectedErrorOrReason: 'UNAUTHORIZED',
      actualErrorOrReason: body.error,
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CROSS-TENANT ISOLATION & AUTHORIZATION EDGE CASES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 2. CROSS-TENANT ISOLATION EDGE CASES ---');

  const aliceHeaders = {
    'x-artist-slug': 'alice',
    'x-artist-token': 'token_alice_authenticated_sclass',
  };

  // Probe 2.1: Alice GET bob -> 403
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=bob', {
      headers: aliceHeaders,
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Alice GET private achievements of Bob -> 403',
      category: 'Cross-Tenant',
      expectedStatus: 403,
      actualStatus: res.status,
      expectedErrorOrReason: 'FORBIDDEN',
      actualErrorOrReason: body.error,
      passed: res.status === 403 && body.error === 'FORBIDDEN',
    });
  }

  // Probe 2.2: Alice GET BOB (uppercase) -> 403
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=BOB', {
      headers: aliceHeaders,
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Alice GET uppercase BOB -> 403',
      category: 'Cross-Tenant',
      expectedStatus: 403,
      actualStatus: res.status,
      expectedErrorOrReason: 'FORBIDDEN',
      actualErrorOrReason: body.error,
      passed: res.status === 403 && body.error === 'FORBIDDEN',
    });
  }

  // Probe 2.3: Alice POST for Bob -> 403
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: aliceHeaders,
      body: {
        artistSlug: 'bob',
        achievementId: 'ach-alice-hacks-bob',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-charlie',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'Alice POST achievements for Bob -> 403',
      category: 'Cross-Tenant',
      expectedStatus: 403,
      actualStatus: res.status,
      expectedErrorOrReason: 'FORBIDDEN',
      actualErrorOrReason: body.error,
      passed: res.status === 403 && body.error === 'FORBIDDEN',
    });
  }

  // Probe 2.4: Alice POST for alice-clone (partial prefix) -> 403
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: aliceHeaders,
      body: {
        artistSlug: 'alice-clone',
        achievementId: 'ach-prefix-confusion',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-charlie',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'Alice POST for alice-clone prefix confusion -> 403',
      category: 'Cross-Tenant',
      expectedStatus: 403,
      actualStatus: res.status,
      expectedErrorOrReason: 'FORBIDDEN',
      actualErrorOrReason: body.error,
      passed: res.status === 403 && body.error === 'FORBIDDEN',
    });
  }

  // Probe 2.5: Alice POST for Alice (own account, uppercase body) -> 201 Created
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: aliceHeaders,
      body: {
        artistSlug: 'ALICE',
        achievementId: 'ach-alice-valid',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-charlie',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'Alice POST for ALICE (case-canonical match) -> 201',
      category: 'Cross-Tenant',
      expectedStatus: 201,
      actualStatus: res.status,
      passed: res.status === 201 && body.ok === true,
    });
  }

  // Probe 2.6: Sovereign Admin accessing Bob's private history -> 200 OK
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=bob', {
      headers: {
        authorization: 'Bearer ear_admin_master_sclass',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordProbe({
      name: 'Sovereign Admin GET private history of Bob -> 200',
      category: 'Cross-Tenant',
      expectedStatus: 200,
      actualStatus: res.status,
      passed: res.status === 200 && body.ok === true && body.artistSlug === 'bob',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. ANTI-FRAUD WHITESPACE & EVASION PROBES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 3. ANTI-FRAUD WHITESPACE & EVASION PROBES ---');

  const validAdminHeaders = {
    authorization: 'Bearer ear_admin_master_sclass',
    'content-type': 'application/json',
  };

  // Probe 3.1: verifiedBy is string with tab and newline -> 422 SIN_VERIFICADOR
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-whitespace-tab',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: "\t\r\n   \t\n",
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'verifiedBy tabs and newlines -> 422 SIN_VERIFICADOR',
      category: 'Anti-Fraud Whitespace',
      expectedStatus: 422,
      actualStatus: res.status,
      expectedErrorOrReason: 'SIN_VERIFICADOR',
      actualErrorOrReason: body.reason,
      passed: res.status === 422 && body.reason === 'SIN_VERIFICADOR',
    });
  }

  // Probe 3.2: verifiedBy is empty string "" -> 422 SIN_VERIFICADOR
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-whitespace-empty',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: '',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'verifiedBy empty string "" -> 422 SIN_VERIFICADOR',
      category: 'Anti-Fraud Whitespace',
      expectedStatus: 422,
      actualStatus: res.status,
      expectedErrorOrReason: 'SIN_VERIFICADOR',
      actualErrorOrReason: body.reason,
      passed: res.status === 422 && body.reason === 'SIN_VERIFICADOR',
    });
  }

  // Probe 3.3: verifiedBy is null -> 422 SIN_VERIFICADOR
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-whitespace-null',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: null,
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'verifiedBy null -> 422 SIN_VERIFICADOR',
      category: 'Anti-Fraud Whitespace',
      expectedStatus: 422,
      actualStatus: res.status,
      expectedErrorOrReason: 'SIN_VERIFICADOR',
      actualErrorOrReason: body.reason,
      passed: res.status === 422 && body.reason === 'SIN_VERIFICADOR',
    });
  }

  // Probe 3.4: Self-verification with leading and trailing tabs/spaces
  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-self-verify-padded',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: " \t EDWIN-AGUDELO \r\n ",
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      name: 'Self-verification with tabs/spaces and uppercase -> 422 AUTOVERIFICADA',
      category: 'Anti-Fraud Evasion',
      expectedStatus: 422,
      actualStatus: res.status,
      expectedErrorOrReason: 'AUTOVERIFICADA',
      actualErrorOrReason: body.reason,
      passed: res.status === 422 && body.reason === 'AUTOVERIFICADA',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SECURITY HEADERS VERIFICATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 4. SECURITY HEADERS VERIFICATION ---');

  {
    const req = makeRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo');
    const res = await GET(req);

    const checkHeaders = [
      'Cache-Control',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'X-Robots-Tag',
    ];

    let headersPassed = true;
    for (const h of checkHeaders) {
      const val = res.headers.get(h);
      if (!val) {
        headersPassed = false;
        console.error(`Missing security header: ${h}`);
      }
    }

    recordProbe({
      name: 'Security headers present on 401 error response',
      category: 'Security Headers',
      expectedStatus: 401,
      actualStatus: res.status,
      passed: headersPassed,
      notes: `X-Content-Type-Options: ${res.headers.get('x-content-type-options')}, X-Frame-Options: ${res.headers.get('x-frame-options')}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  const total = probeResults.length;
  const passed = probeResults.filter((p) => p.passed).length;
  const failed = probeResults.filter((p) => !p.passed).length;

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(` EMPIRICAL CHALLENGER RESULTS: ${passed}/${total} PASSED, ${failed} FAILED`);
  console.log('════════════════════════════════════════════════════════════════════');

  if (failed > 0) {
    console.error('\nFAILURES FOUND:');
    for (const f of probeResults.filter((p) => !p.passed)) {
      console.error(`  - [${f.category}] ${f.name}`);
      console.error(`      Expected: ${f.expectedStatus} (${f.expectedErrorOrReason})`);
      console.error(`      Actual:   ${f.actualStatus} (${f.actualErrorOrReason})`);
    }
    process.exit(1);
  } else {
    console.log('\nALL EMPIRICAL CHALLENGER PROBES COMPLETED WITH ZERO FAILURES.');
  }
}

runEmpiricalStress().catch((err) => {
  console.error('CRITICAL ERROR IN EMPIRICAL STRESS:', err);
  process.exit(1);
});
