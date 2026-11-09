/**
 * ════════════════════════════════════════════════════════════════════════════
 * ADVERSARIAL CHALLENGER SUITE · W52_T02 (EAR OS V2)
 * ════════════════════════════════════════════════════════════════════════════
 * Independent adversarial challenge testing authentication, authorization,
 * anti-fraud rules, cryptographic chain integrity, and payload boundary enforcement.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NextRequest } from 'next/server';
import {
  appendAchievementEvidence,
  recordAchievement,
  getArtistAchievements,
  computeRecordHash,
  clearLedgerForTesting,
  type AchievementLedgerEntry,
} from '@/lib/academy/achievement-ledger';
import { GET, POST, resolveAuthContext } from '@/app/api/artist/achievements/route';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const ADVERSARIAL_STORE = path.join(projectRoot, '.data', 'adversarial-test-ledger.json');
process.env.EAR_ACHIEVEMENT_LEDGER_STORE = ADVERSARIAL_STORE;

interface TestResult {
  id: string;
  category: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: unknown;
}

const results: TestResult[] = [];

function recordTest(result: TestResult): void {
  results.push(result);
  const tag = result.passed ? '[PASS]' : '[FAIL]';
  console.log(`${tag} [${result.category}] ${result.id}: ${result.description}`);
  if (!result.passed) {
    console.error(`       Expected: ${result.expected}`);
    console.error(`       Actual:   ${result.actual}`);
  }
}

function createRequest(
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

async function runAdversarialSuite(): Promise<void> {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(' ADVERSARIAL CHALLENGE EXECUTION: W52_T02 AUTH & ANTI-FRAUD');
  console.log('════════════════════════════════════════════════════════════════\n');

  try {
    if (fs.existsSync(ADVERSARIAL_STORE)) {
      fs.unlinkSync(ADVERSARIAL_STORE);
    }
  } catch {}
  clearLedgerForTesting();

  // ──────────────────────────────────────────────────────────────────────────
  // 1. NEGATIVE-FIRST SECURITY GATES (401 UNAUTHENTICATED)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 1. NEGATIVE-FIRST SECURITY GATES ---');

  // 1.1: GET private achievements without credentials -> 401
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo');
    const res = await GET(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-401-GET-ANON',
      category: 'Negative-First Auth',
      description: 'GET private achievements without credentials must return HTTP 401',
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
      expected: 'HTTP 401 with error: UNAUTHORIZED',
      actual: `HTTP ${res.status} with error: ${body.error}`,
    });
  }

  // 1.2: GET private achievements with public=false without credentials -> 401
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo&public=false');
    const res = await GET(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-401-GET-EXPLICIT-PRIVATE',
      category: 'Negative-First Auth',
      description: 'GET with public=false without credentials must return HTTP 401',
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
      expected: 'HTTP 401 with error: UNAUTHORIZED',
      actual: `HTTP ${res.status} with error: ${body.error}`,
    });
  }

  // 1.3: POST achievement evidence without credentials -> 401
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-test-01',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-ear',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-401-POST-ANON',
      category: 'Negative-First Auth',
      description: 'POST achievement evidence without credentials must return HTTP 401',
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
      expected: 'HTTP 401 with error: UNAUTHORIZED',
      actual: `HTTP ${res.status} with error: ${body.error}`,
    });
  }

  // 1.4: POST with invalid Bearer token -> 401
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        authorization: 'Bearer invalid_forged_signature',
      },
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-test-02',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-ear',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-401-POST-INVALID-BEARER',
      category: 'Negative-First Auth',
      description: 'POST with explicitly invalid bearer token must return HTTP 401',
      passed: res.status === 401 && body.error === 'UNAUTHORIZED',
      expected: 'HTTP 401 with error: UNAUTHORIZED',
      actual: `HTTP ${res.status} with error: ${body.error}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CROSS-TENANT & SPOOFING BOUNDARIES (403 FORBIDDEN)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 2. CROSS-TENANT & SPOOFING BOUNDARIES ---');

  // 2.1: Authenticated artist Alice querying private history of artist Bob -> 403
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements?artistSlug=bob', {
      headers: {
        'x-artist-slug': 'alice',
        'x-artist-token': 'token_alice_valid',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-403-GET-CROSS-TENANT',
      category: 'Cross-Tenant Guard',
      description: 'Artist Alice accessing private history of Bob must return HTTP 403 FORBIDDEN',
      passed: res.status === 403 && body.error === 'FORBIDDEN',
      expected: 'HTTP 403 with error: FORBIDDEN',
      actual: `HTTP ${res.status} with error: ${body.error}`,
    });
  }

  // 2.2: Authenticated artist Alice recording achievement for artist Bob -> 403
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        'x-artist-slug': 'alice',
        'x-artist-token': 'token_alice_valid',
      },
      body: {
        artistSlug: 'bob',
        achievementId: 'ach-forged-01',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-ear',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-403-POST-CROSS-TENANT',
      category: 'Cross-Tenant Guard',
      description: 'Artist Alice posting achievements for Bob must return HTTP 403 FORBIDDEN',
      passed: res.status === 403 && body.error === 'FORBIDDEN',
      expected: 'HTTP 403 with error: FORBIDDEN',
      actual: `HTTP ${res.status} with error: ${body.error}`,
    });
  }

  // 2.3: ADVERSARIAL PROBE: Header-only artist slug without credential
  // Does passing ONLY `x-artist-slug: bob` with no token bypass auth?
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements?artistSlug=bob', {
      headers: {
        'x-artist-slug': 'bob',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    // In production, uncredentialed x-artist-slug must NOT give access to private history.
    // If it returns 200, it indicates an auth bypass hole.
    const isProtected = res.status === 401;
    recordTest({
      id: 'SEC-AUTH-SPOOF-HEADER-ONLY',
      category: 'Adversarial Auth Probe',
      description: 'Request with x-artist-slug but NO token/cookie/credential must be rejected (401)',
      passed: isProtected,
      expected: 'HTTP 401 (credentials required)',
      actual: `HTTP ${res.status} (authenticated=${body.ok === true})`,
    });
  }

  // 2.4: ADVERSARIAL PROBE: Role spoofing via `x-ear-role: admin` without secret
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements?artistSlug=bob', {
      headers: {
        'x-ear-role': 'admin',
      },
    });
    const res = await GET(req);
    const body = await res.json();
    // Sending just `x-ear-role: admin` without bearer or sovereign cookie must NOT grant admin access
    const isProtected = res.status === 401;
    recordTest({
      id: 'SEC-AUTH-SPOOF-ADMIN-ROLE-HEADER',
      category: 'Adversarial Auth Probe',
      description: 'Request with spoofed x-ear-role: admin without secret must be rejected (401)',
      passed: isProtected,
      expected: 'HTTP 401 (unauthorized role header)',
      actual: `HTTP ${res.status} (isAdmin=${body.ok === true})`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. PAYLOAD BOUNDARIES & CONTENT-TYPE GATES (413 & 415)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 3. PAYLOAD BOUNDARIES & CONTENT-TYPE GATES ---');

  const validAdminHeaders = {
    authorization: 'Bearer ear_admin_master_sclass',
    'x-ear-role': 'admin',
    'content-type': 'application/json',
  };

  // 3.1: Non-JSON Content-Type -> 415
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        ...validAdminHeaders,
        'content-type': 'text/plain',
      },
      rawBody: 'artistSlug=edwin-agudelo',
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-415-NON-JSON-CONTENT-TYPE',
      category: 'Payload Boundaries',
      description: 'POST with text/plain content-type must return HTTP 415',
      passed: res.status === 415 && body.error === 'UNSUPPORTED_MEDIA_TYPE',
      expected: 'HTTP 415 UNSUPPORTED_MEDIA_TYPE',
      actual: `HTTP ${res.status} ${body.error}`,
    });
  }

  // 3.2: Content-Type with charset parameter -> 201 (should accept valid JSON with charset)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        ...validAdminHeaders,
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-charset-test',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-ear',
      },
    });
    const res = await POST(req);
    recordTest({
      id: 'SEC-201-JSON-WITH-CHARSET',
      category: 'Payload Boundaries',
      description: 'POST with application/json; charset=utf-8 should be accepted',
      passed: res.status === 201,
      expected: 'HTTP 201 Created',
      actual: `HTTP ${res.status}`,
    });
  }

  // 3.3: Oversized payload (> 8192 bytes) -> 413 PAYLOAD_TOO_LARGE
  {
    const bloatedNoise = 'A'.repeat(8500);
    const oversizedBody = JSON.stringify({
      artistSlug: 'edwin-agudelo',
      achievementId: 'ach-bloat',
      moduleId: 't66-m1-ikigai',
      evidenceKind: 'exercise',
      verifiedBy: 'mentor-ear',
      evidencePayload: { noise: bloatedNoise },
    });
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      rawBody: oversizedBody,
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-413-OVERSIZED-PAYLOAD',
      category: 'Payload Boundaries',
      description: 'POST with payload exceeding 8192 bytes must return HTTP 413',
      passed: res.status === 413 && body.error === 'PAYLOAD_TOO_LARGE',
      expected: 'HTTP 413 PAYLOAD_TOO_LARGE',
      actual: `HTTP ${res.status} ${body.error}`,
    });
  }

  // 3.4: Malformed JSON -> 400 INVALID_JSON
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      rawBody: '{ "artistSlug": "edwin-agudelo", broken_json: ',
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'SEC-400-MALFORMED-JSON',
      category: 'Payload Boundaries',
      description: 'POST with malformed JSON body must return HTTP 400 INVALID_JSON',
      passed: res.status === 400 && body.error === 'INVALID_JSON',
      expected: 'HTTP 400 INVALID_JSON',
      actual: `HTTP ${res.status} ${body.error}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. ANTI-FRAUD INVARIANTS (HTTP 422 REJECTIONS)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 4. ANTI-FRAUD INVARIANTS ---');

  // 4.1: Missing verifier (`SIN_VERIFICADOR`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-01',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-SIN-VERIFICADOR-OMITTED',
      category: 'Anti-Fraud',
      description: 'POST without verifiedBy must return HTTP 422 reason SIN_VERIFICADOR',
      passed: res.status === 422 && body.reason === 'SIN_VERIFICADOR',
      expected: 'HTTP 422 with reason: SIN_VERIFICADOR',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.2: Whitespace-only verifier (`SIN_VERIFICADOR`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-02',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: '     \t \n  ',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-SIN-VERIFICADOR-WHITESPACE',
      category: 'Anti-Fraud',
      description: 'POST with whitespace-only verifiedBy must return HTTP 422 reason SIN_VERIFICADOR',
      passed: res.status === 422 && body.reason === 'SIN_VERIFICADOR',
      expected: 'HTTP 422 with reason: SIN_VERIFICADOR',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.3: Self-verification identical case (`AUTOVERIFICADA`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-03',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'edwin-agudelo',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-AUTOVERIFICADA-EXACT',
      category: 'Anti-Fraud',
      description: 'POST with verifiedBy === artistSlug must return HTTP 422 reason AUTOVERIFICADA',
      passed: res.status === 422 && body.reason === 'AUTOVERIFICADA',
      expected: 'HTTP 422 with reason: AUTOVERIFICADA',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.4: Self-verification uppercase / mixed-case (`AUTOVERIFICADA`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-04',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: '  EdWiN-AgUdElO  ',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-AUTOVERIFICADA-MIXED-CASE',
      category: 'Anti-Fraud',
      description: 'POST with mixed-case and padded verifiedBy must return HTTP 422 reason AUTOVERIFICADA',
      passed: res.status === 422 && body.reason === 'AUTOVERIFICADA',
      expected: 'HTTP 422 with reason: AUTOVERIFICADA',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.5: Invalid date string (`FECHA_INVALIDA`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-05',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-director-ear',
        verifiedAt: 'fecha_invalida_no_iso',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-FECHA-INVALIDA-STRING',
      category: 'Anti-Fraud',
      description: 'POST with non-ISO date string must return HTTP 422 reason FECHA_INVALIDA',
      passed: res.status === 422 && body.reason === 'FECHA_INVALIDA',
      expected: 'HTTP 422 with reason: FECHA_INVALIDA',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.6: Truncated date < 10 characters (`FECHA_INVALIDA`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-06',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-director-ear',
        verifiedAt: '2026',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-FECHA-INVALIDA-TRUNCATED',
      category: 'Anti-Fraud',
      description: 'POST with truncated year-only date must return HTTP 422 reason FECHA_INVALIDA',
      passed: res.status === 422 && body.reason === 'FECHA_INVALIDA',
      expected: 'HTTP 422 with reason: FECHA_INVALIDA',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.7: Unsupported evidence kind (`TIPO_DESCONOCIDO`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-07',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'fake_crypto_token',
        verifiedBy: 'mentor-director-ear',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-TIPO-DESCONOCIDO',
      category: 'Anti-Fraud',
      description: 'POST with unknown evidence kind must return HTTP 422 reason TIPO_DESCONOCIDO',
      passed: res.status === 422 && body.reason === 'TIPO_DESCONOCIDO',
      expected: 'HTTP 422 with reason: TIPO_DESCONOCIDO',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // 4.8: Unknown module ID (`MODULO_DESCONOCIDO`)
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: validAdminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-nofraud-08',
        moduleId: 'modulo-inexistente-en-ssot',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-director-ear',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordTest({
      id: 'FRAUD-422-MODULO-DESCONOCIDO',
      category: 'Anti-Fraud',
      description: 'POST with unknown module ID must return HTTP 422 reason MODULO_DESCONOCIDO',
      passed: res.status === 422 && body.reason === 'MODULO_DESCONOCIDO',
      expected: 'HTTP 422 with reason: MODULO_DESCONOCIDO',
      actual: `HTTP ${res.status} with reason: ${body.reason}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. PUBLIC VIEW DATA LEAKAGE VERIFICATION (ZERO LEAKAGE OF UNVERIFIED)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 5. PUBLIC VIEW ZERO-LEAKAGE INVARIANT ---');

  // Seed 1 verified, 1 unverified/pending, and 1 rejected achievement directly in ledger
  const testArtist = 'challenger-test-artist';

  const entryVerified = await appendAchievementEvidence({
    artistSlug: testArtist,
    achievementId: 'ach-v-01',
    moduleId: 't66-m1-ikigai',
    trackId: 'track66',
    evidenceKind: 'exercise',
    verifiedBy: 'director-mentor',
    verifiedAt: '2026-11-09T10:00:00.000Z',
  });

  const entryPending = await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-p-01',
    moduleId: 't66-m2-rueda-vida',
    trackId: 'track66',
    evidenceKind: 'exercise',
    status: 'PENDING_VERIFICATION',
    verifiedBy: null,
  });

  const entryRejected = await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-r-01',
    moduleId: 't66-m3-buyer-persona',
    trackId: 'track66',
    evidenceKind: 'exercise',
    status: 'REJECTED',
    verifiedBy: 'auditor-reject',
  });

  // Query public view without credentials: ?artistSlug=...&public=true
  {
    const req = createRequest(`http://localhost:3000/api/artist/achievements?artistSlug=${testArtist}&public=true`);
    const res = await GET(req);
    const body = await res.json();

    const returnedAchievements = (body.achievements || []) as AchievementLedgerEntry[];
    const hasOnlyVerified = returnedAchievements.every((a) => a.status === 'VERIFIED');
    const leaksPending = returnedAchievements.some((a) => a.status === 'PENDING_VERIFICATION' || a.status === 'PENDING');
    const leaksRejected = returnedAchievements.some((a) => a.status === 'REJECTED');

    recordTest({
      id: 'DATA-LEAK-PUBLIC-VERIFIED-ONLY',
      category: 'Data Segregation',
      description: 'Public view without credentials must return HTTP 200 with strictly VERIFIED achievements',
      passed: res.status === 200 && hasOnlyVerified && !leaksPending && !leaksRejected && returnedAchievements.length === 1,
      expected: '1 VERIFIED achievement, 0 pending, 0 rejected leaked',
      actual: `${returnedAchievements.length} achievements, leaksPending=${leaksPending}, leaksRejected=${leaksRejected}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. CRYPTOGRAPHIC PROVENANCE & APPEND-ONLY MONOTONICITY
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 6. CRYPTOGRAPHIC PROVENANCE & CHAIN INTEGRITY ---');

  {
    const query = await getArtistAchievements(testArtist, { publicOnly: false });
    const records = query.achievements;

    let chainIntact = true;
    let monotonicityIntact = true;

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      // Check monotonicity
      if (i > 0 && rec.entryIndex <= records[i - 1].entryIndex) {
        monotonicityIntact = false;
      }
      // Check hash calculation
      const computed = computeRecordHash(rec);
      if (computed !== rec.hash) {
        chainIntact = false;
      }
      // Check chain linkage
      if (i > 0 && rec.previousHash !== records[i - 1].hash) {
        chainIntact = false;
      }
    }

    recordTest({
      id: 'CRYPTO-SHA256-CHAIN-INTEGRITY',
      category: 'Cryptographic Ledger',
      description: 'Ledger entries must form an unbroken SHA-256 chain with monotonically increasing entryIndex',
      passed: chainIntact && monotonicityIntact && records.length >= 3,
      expected: 'Chain intact=true, monotonicity=true, entries>=3',
      actual: `chainIntact=${chainIntact}, monotonicity=${monotonicityIntact}, entries=${records.length}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(` CHALLENGE RESULTS: ${passedCount}/${total} PASSED, ${failedCount} FAILED`);
  console.log('════════════════════════════════════════════════════════════════');

  if (failedCount > 0) {
    console.error('\nFAILED TESTS SUMMARY:');
    for (const f of results.filter((r) => !r.passed)) {
      console.error(`  - [${f.id}] ${f.description}`);
      console.error(`      Expected: ${f.expected}`);
      console.error(`      Actual:   ${f.actual}`);
    }
  }

  // Write results JSON for analysis report
  const reportPath = path.join(projectRoot, '.data', 'adversarial-challenge-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
}

runAdversarialSuite().catch((err) => {
  console.error('CRITICAL EXECUTION ERROR IN ADVERSARIAL SUITE:', err);
  process.exit(1);
});
