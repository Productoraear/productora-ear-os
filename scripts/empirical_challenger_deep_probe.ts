/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMPIRICAL CHALLENGER DEEP PROBE: W52_T02 (EAR OS V2)
 * ════════════════════════════════════════════════════════════════════════════
 * Stress harnesses, tamper detection oracles, concurrency mutation stress,
 * and boundary leakage verification.
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
  computeEntryHash,
  clearLedgerForTesting,
  reloadStoreFromDisk,
  isDbCircuitOpen,
  tripDbCircuit,
  resetDbCircuitBreaker,
  GENESIS_PREV_HASH,
  type AchievementLedgerEntry,
} from '../src/lib/academy/achievement-ledger';
import { GET, POST, resolveAuthContext } from '../src/app/api/artist/achievements/route';
import { classifyDbFailure } from '../src/lib/db/dbFailureClassifier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHALLENGER_STORE = path.join(projectRoot, '.data', 'challenger-deep-test-ledger.json');
process.env.EAR_ACHIEVEMENT_LEDGER_STORE = CHALLENGER_STORE;

interface ProbeResult {
  probeId: string;
  category: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: unknown;
}

const probeResults: ProbeResult[] = [];

function recordProbe(res: ProbeResult): void {
  probeResults.push(res);
  const tag = res.passed ? '✓ [PASS]' : '✗ [FAIL]';
  console.log(`${tag} [${res.category}] ${res.probeId}: ${res.description}`);
  if (!res.passed) {
    console.error(`      Expected: ${res.expected}`);
    console.error(`      Actual:   ${res.actual}`);
    if (res.details) console.error(`      Details:  ${JSON.stringify(res.details)}`);
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

function verifyChainIntegrity(entries: readonly AchievementLedgerEntry[]): {
  valid: boolean;
  tamperedIndex?: number;
  reason?: string;
} {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    // 1. Monotonicity check
    const expectedIndex = i + 1;
    if (entry.entryIndex !== expectedIndex) {
      return {
        valid: false,
        tamperedIndex: i,
        reason: `Non-monotonic index: expected ${expectedIndex}, got ${entry.entryIndex}`,
      };
    }
    // 2. Genesis / Linkage check
    const expectedPrev = i === 0 ? GENESIS_PREV_HASH : entries[i - 1].hash;
    if (entry.previousHash !== expectedPrev) {
      return {
        valid: false,
        tamperedIndex: i,
        reason: `Broken chain link at index ${i}: expected prev ${expectedPrev.slice(0, 8)}, got ${entry.previousHash.slice(0, 8)}`,
      };
    }
    // 3. Recompute hash
    const recomputed = computeRecordHash(entry);
    if (recomputed !== entry.hash) {
      return {
        valid: false,
        tamperedIndex: i,
        reason: `Hash mismatch at index ${i}: expected ${recomputed.slice(0, 8)}, entry has ${entry.hash.slice(0, 8)}`,
      };
    }
  }
  return { valid: true };
}

async function runDeepProbes(): Promise<void> {
  console.log('\n================================================================');
  console.log(' EMPIRICAL CHALLENGER DEEP STRESS & ADVERSARIAL ORACLE');
  console.log('================================================================\n');

  try {
    if (fs.existsSync(CHALLENGER_STORE)) {
      fs.unlinkSync(CHALLENGER_STORE);
    }
  } catch {}
  clearLedgerForTesting();
  resetDbCircuitBreaker();

  // ──────────────────────────────────────────────────────────────────────────
  // HARNESS 1: CONCURRENT MUTATION STRESS & STRICT MONOTONICITY
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- HARNESS 1: HIGH-CONCURRENCY MUTATION STRESS ---');
  {
    const CONCURRENCY_COUNT = 30;
    const promises: Promise<unknown>[] = [];

    for (let i = 0; i < CONCURRENCY_COUNT; i++) {
      promises.push(
        appendAchievementEvidence({
          artistSlug: `artist-concurrent-${i % 3}`,
          achievementId: `ach-concurrent-${i}`,
          moduleId: 't66-m1-ikigai',
          trackId: 'track66',
          evidenceKind: 'exercise',
          verifiedBy: 'system-concurrency-verifier',
          verifiedAt: new Date(Date.now() + i * 1000).toISOString(),
        })
      );
    }

    const mutationResults = await Promise.all(promises);
    const allSuccessful = mutationResults.every((r: any) => r.success === true);

    // Read store directly from disk after reload
    await reloadStoreFromDisk();
    const rawDisk = JSON.parse(fs.readFileSync(CHALLENGER_STORE, 'utf8'));
    const diskEntries: AchievementLedgerEntry[] = rawDisk.entries;

    // Check count
    const countMatches = diskEntries.length === CONCURRENCY_COUNT;

    // Check chain integrity on entire disk ledger
    const chainCheck = verifyChainIntegrity(diskEntries);

    recordProbe({
      probeId: 'CHL-CONCURRENCY-SERIALIZATION',
      category: 'Concurrency & Mutex',
      description: `Concurrent insertion of ${CONCURRENCY_COUNT} items must yield unbroken monotonic chain`,
      passed: allSuccessful && countMatches && chainCheck.valid,
      expected: `All ${CONCURRENCY_COUNT} success, disk count ${CONCURRENCY_COUNT}, chain valid`,
      actual: `Success: ${allSuccessful}, count: ${diskEntries.length}, chainValid: ${chainCheck.valid} (${chainCheck.reason ?? 'OK'})`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HARNESS 2: ADVERSARIAL DISK TAMPER DETECTION ORACLE
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- HARNESS 2: ADVERSARIAL DISK TAMPER DETECTION ---');

  // 2.1: Tampering a single field in entry 5 (e.g. status)
  {
    const rawDisk = JSON.parse(fs.readFileSync(CHALLENGER_STORE, 'utf8'));
    const tamperedEntries = JSON.parse(JSON.stringify(rawDisk.entries));

    // Tamper entry at index 5: change verifiedBy
    tamperedEntries[5].verifiedBy = 'malicious_attacker';
    const checkTamper = verifyChainIntegrity(tamperedEntries);

    recordProbe({
      probeId: 'CHL-TAMPER-VERIFIER-MUTATION',
      category: 'Tamper Detection',
      description: 'Mutating verifiedBy in historical entry must break cryptographic chain verification',
      passed: !checkTamper.valid && checkTamper.tamperedIndex === 5,
      expected: 'Chain invalid at index 5',
      actual: `valid=${checkTamper.valid}, tamperedIndex=${checkTamper.tamperedIndex}, reason=${checkTamper.reason}`,
    });
  }

  // 2.2: Tampering entryIndex (reordering)
  {
    const rawDisk = JSON.parse(fs.readFileSync(CHALLENGER_STORE, 'utf8'));
    const tamperedEntries = JSON.parse(JSON.stringify(rawDisk.entries));

    // Swap entry 2 and 3
    const tmp = tamperedEntries[2];
    tamperedEntries[2] = tamperedEntries[3];
    tamperedEntries[3] = tmp;

    const checkTamper = verifyChainIntegrity(tamperedEntries);
    recordProbe({
      probeId: 'CHL-TAMPER-ENTRY-REORDER',
      category: 'Tamper Detection',
      description: 'Swapping entry order must trigger chain verification failure',
      passed: !checkTamper.valid,
      expected: 'Chain invalid',
      actual: `valid=${checkTamper.valid}, reason=${checkTamper.reason}`,
    });
  }

  // 2.3: Forging previousHash
  {
    const rawDisk = JSON.parse(fs.readFileSync(CHALLENGER_STORE, 'utf8'));
    const tamperedEntries = JSON.parse(JSON.stringify(rawDisk.entries));

    tamperedEntries[10].previousHash = 'a'.repeat(64);
    const checkTamper = verifyChainIntegrity(tamperedEntries);
    recordProbe({
      probeId: 'CHL-TAMPER-PREV-HASH-FORGERY',
      category: 'Tamper Detection',
      description: 'Forging previousHash must trigger chain verification failure',
      passed: !checkTamper.valid && checkTamper.tamperedIndex === 10,
      expected: 'Chain invalid at index 10',
      actual: `valid=${checkTamper.valid}, tamperedIndex=${checkTamper.tamperedIndex}`,
    });
  }

  // 2.4: Mutating status (VERIFIED -> REJECTED or vice versa)
  {
    const rawDisk = JSON.parse(fs.readFileSync(CHALLENGER_STORE, 'utf8'));
    const tamperedEntries = JSON.parse(JSON.stringify(rawDisk.entries));

    tamperedEntries[0].status = 'REJECTED';
    const checkTamper = verifyChainIntegrity(tamperedEntries);
    recordProbe({
      probeId: 'CHL-TAMPER-STATUS-MUTATION',
      category: 'Tamper Detection',
      description: 'Mutating status of genesis or any entry must trigger hash mismatch',
      passed: !checkTamper.valid && checkTamper.tamperedIndex === 0,
      expected: 'Chain invalid at index 0',
      actual: `valid=${checkTamper.valid}, tamperedIndex=${checkTamper.tamperedIndex}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HARNESS 3: EXTREME PUBLIC VIEW ZERO-LEAKAGE INVARIANT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- HARNESS 3: PUBLIC VIEW ZERO-LEAKAGE STRESS ---');

  const leakedArtist = 'artist-leak-target';
  // Insert mixed statuses: 3 VERIFIED, 5 PENDING_VERIFICATION, 4 REJECTED, 2 UNVERIFIED
  for (let i = 0; i < 3; i++) {
    await recordAchievement({
      artistSlug: leakedArtist,
      achievementId: `ach-v-${i}`,
      moduleId: 't66-m1-ikigai',
      status: 'VERIFIED',
      verifiedBy: 'mentor-official',
    });
  }
  for (let i = 0; i < 5; i++) {
    await recordAchievement({
      artistSlug: leakedArtist,
      achievementId: `ach-pending-${i}`,
      moduleId: 't66-m1-ikigai',
      status: 'PENDING_VERIFICATION',
      verifiedBy: null,
    });
  }
  for (let i = 0; i < 4; i++) {
    await recordAchievement({
      artistSlug: leakedArtist,
      achievementId: `ach-rej-${i}`,
      moduleId: 't66-m1-ikigai',
      status: 'REJECTED',
      verifiedBy: 'mentor-official',
    });
  }
  for (let i = 0; i < 2; i++) {
    await recordAchievement({
      artistSlug: leakedArtist,
      achievementId: `ach-unver-${i}`,
      moduleId: 't66-m1-ikigai',
      status: 'UNVERIFIED',
      verifiedBy: null,
    });
  }

  // 3.1: Public GET query with varied query parameter noise
  {
    const req = createRequest(
      `http://localhost:3000/api/artist/achievements?artistSlug=${leakedArtist}&public=true&status=ALL&includePending=true&secret=showAll`
    );
    const res = await GET(req);
    const body = await res.json();

    const returned = (body.achievements || []) as AchievementLedgerEntry[];
    const nonVerified = returned.filter((a) => a.status !== 'VERIFIED');
    const allVerified = returned.every((a) => a.status === 'VERIFIED');

    recordProbe({
      probeId: 'CHL-PUBLIC-ZERO-LEAK-POLLUTED-QUERY',
      category: 'Public View Zero Leakage',
      description: 'Public query with malicious status overrides must ONLY return VERIFIED achievements (0 leaked)',
      passed: res.status === 200 && returned.length === 3 && nonVerified.length === 0 && allVerified,
      expected: 'Exactly 3 VERIFIED returned, 0 non-verified leaked',
      actual: `Returned ${returned.length}, nonVerified=${nonVerified.length}`,
    });
  }

  // 3.2: Public GET query without credentials should NEVER return internal DB status or sensitive fields
  {
    const req = createRequest(`http://localhost:3000/api/artist/achievements?artistSlug=${leakedArtist}&public=true`);
    const res = await GET(req);
    const body = await res.json();

    const exposesDbStatus = 'dbStatus' in body;
    const exposesPendingCount = 'pendingCount' in body;
    const exposesRejectedCount = 'rejectedCount' in body;

    recordProbe({
      probeId: 'CHL-PUBLIC-RESPONSE-HYGIENE',
      category: 'Public View Zero Leakage',
      description: 'Public response must NOT expose dbStatus, pendingCount, or rejectedCount',
      passed: !exposesDbStatus && !exposesPendingCount && !exposesRejectedCount,
      expected: 'dbStatus=false, pendingCount=false, rejectedCount=false',
      actual: `dbStatus=${exposesDbStatus}, pendingCount=${exposesPendingCount}, rejectedCount=${exposesRejectedCount}`,
    });
  }

  // 3.3: Case insensitivity and whitespace trimming on artistSlug in public query
  {
    const req = createRequest(
      `http://localhost:3000/api/artist/achievements?artistSlug=%20%20${leakedArtist.toUpperCase()}%20%20&public=true`
    );
    const res = await GET(req);
    const body = await res.json();
    const returned = (body.achievements || []) as AchievementLedgerEntry[];

    recordProbe({
      probeId: 'CHL-PUBLIC-SLUG-NORMALIZATION',
      category: 'Public View Zero Leakage',
      description: 'Padded and uppercase artistSlug must resolve correctly and still return strictly VERIFIED',
      passed: res.status === 200 && returned.length === 3 && returned.every((a) => a.status === 'VERIFIED'),
      expected: '3 VERIFIED achievements returned',
      actual: `Status: ${res.status}, count: ${returned.length}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HARNESS 4: DATABASE RESILIENCE & ZERO DATA FABRICATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- HARNESS 4: DATABASE RESILIENCE & ZERO FABRICATION ---');

  // 4.1: Circuit Breaker trip and manual reset
  {
    resetDbCircuitBreaker();
    const before = isDbCircuitOpen();
    tripDbCircuit();
    const during = isDbCircuitOpen();
    resetDbCircuitBreaker();
    const after = isDbCircuitOpen();

    recordProbe({
      probeId: 'CHL-DB-CIRCUIT-BREAKER',
      category: 'DB Resilience',
      description: 'Circuit breaker trips and resets cleanly to prevent DB stampede',
      passed: before === false && during === true && after === false,
      expected: 'before=false, during=true, after=false',
      actual: `before=${before}, during=${during}, after=${after}`,
    });
  }

  // 4.2: Honest Zero Fabrication on empty non-existent artist
  {
    const emptySlug = 'completely-unknown-artist-slug-999';
    const query = await getArtistAchievements(emptySlug, { publicOnly: false });

    recordProbe({
      probeId: 'CHL-HONEST-ZERO-FABRICATION',
      category: 'Zero Fabrication',
      description: 'Non-existent artist returns totalEntries=0, verifiedCount=0, progressPct=0, empty arrays',
      passed:
        query.totalEntries === 0 &&
        query.verifiedCount === 0 &&
        query.pendingCount === 0 &&
        query.rejectedCount === 0 &&
        query.progressPct === 0 &&
        query.achievements.length === 0 &&
        query.completedModules.length === 0,
      expected: 'All zero metrics, empty arrays',
      actual: `total=${query.totalEntries}, verified=${query.verifiedCount}, progress=${query.progressPct}`,
    });
  }

  // 4.3: Classify various error types without leakages
  {
    const errorsToTest = [
      { err: { code: 'P1001' }, expectedKind: 'DB_UNREACHABLE' },
      { err: { message: 'connect ECONNREFUSED 127.0.0.1:5432' }, expectedKind: 'DB_UNREACHABLE' },
      { err: { message: 'timed out fetching a new connection from the pool' }, expectedKind: 'DB_POOL_TIMEOUT' },
      { err: { message: 'Environment variable not found: POSTGRES_PRISMA_URL' }, expectedKind: 'DB_URL_MISSING' },
      { err: { code: 'P1000' }, expectedKind: 'DB_AUTH_FAILED' },
      { err: { code: 'P2021' }, expectedKind: 'DB_SCHEMA_MISSING' },
      { err: { code: 'P1003' }, expectedKind: 'DB_NOT_FOUND' },
      { err: { code: 'P1011' }, expectedKind: 'DB_CONNECTION_CLOSED' },
      { err: { message: 'some unclassified strange error' }, expectedKind: 'DB_UNKNOWN' },
    ];

    let allClassifiedCorrectly = true;
    const failures: string[] = [];
    for (const testCase of errorsToTest) {
      const rep = classifyDbFailure(testCase.err);
      if (rep.kind !== testCase.expectedKind) {
        allClassifiedCorrectly = false;
        failures.push(`err=${JSON.stringify(testCase.err)} -> got ${rep.kind}, expected ${testCase.expectedKind}`);
      }
    }

    recordProbe({
      probeId: 'CHL-DB-CLASSIFY-VARIANTS',
      category: 'DB Resilience',
      description: 'classifyDbFailure correctly maps P1001, ECONNREFUSED, ETIMEDOUT, URL_MISSING, P2002',
      passed: allClassifiedCorrectly,
      expected: 'All error kinds mapped correctly',
      actual: `allClassifiedCorrectly=${allClassifiedCorrectly}`,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HARNESS 5: EXTREME PAYLOAD & INJECTION ATTACKS ON POST /api/artist/achievements
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- HARNESS 5: INJECTION & MALICIOUS INPUT PROBES ---');

  const adminAuth = {
    authorization: 'Bearer ear_admin_master_sclass',
    'x-ear-role': 'admin',
    'content-type': 'application/json',
  };

  // 5.1: Path traversal / invalid slug in artistSlug -> 400
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminAuth,
      body: {
        artistSlug: '../../etc/passwd',
        achievementId: 'ach-traversal',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-valid',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      probeId: 'CHL-SEC-PATH-TRAVERSAL-SLUG',
      category: 'Malicious Input Injection',
      description: 'Path traversal characters in artistSlug must be rejected by Zod with HTTP 400',
      passed: res.status === 400 && body.error === 'INVALID_INPUT',
      expected: 'HTTP 400 INVALID_INPUT',
      actual: `HTTP ${res.status} ${body.error}`,
    });
  }

  // 5.2: SQL Injection characters in artistSlug -> 400
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminAuth,
      body: {
        artistSlug: "admin' OR '1'='1",
        achievementId: 'ach-sqli',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-valid',
      },
    });
    const res = await POST(req);
    recordProbe({
      probeId: 'CHL-SEC-SQLI-SLUG',
      category: 'Malicious Input Injection',
      description: 'SQL injection characters in artistSlug must be rejected by Zod with HTTP 400',
      passed: res.status === 400,
      expected: 'HTTP 400',
      actual: `HTTP ${res.status}`,
    });
  }

  // 5.3: Unknown fields in body with .strict() -> 400
  {
    const req = createRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminAuth,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-strict-01',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-valid',
        status: 'VERIFIED', // Injected forbidden field directly in body
        unauthorizedField: 'malicious_injection',
      },
    });
    const res = await POST(req);
    const body = await res.json();
    recordProbe({
      probeId: 'CHL-SEC-STRICT-SCHEMA-REJECTION',
      category: 'Schema Enforcement',
      description: 'Payload with unexpected fields must be rejected by strict Zod schema with HTTP 400',
      passed: res.status === 400 && body.error === 'INVALID_INPUT',
      expected: 'HTTP 400 INVALID_INPUT',
      actual: `HTTP ${res.status} ${body.error}`,
    });
  }

  // Cleanup test file
  try {
    if (fs.existsSync(CHALLENGER_STORE)) {
      fs.unlinkSync(CHALLENGER_STORE);
    }
  } catch {}

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  const total = probeResults.length;
  const passed = probeResults.filter((p) => p.passed).length;
  const failed = probeResults.filter((p) => !p.passed).length;

  console.log('\n================================================================');
  console.log(` EMPIRICAL CHALLENGER RESULT: ${passed}/${total} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runDeepProbes().catch((err) => {
  console.error('CRITICAL ERROR IN DEEP PROBE:', err);
  process.exit(1);
});
