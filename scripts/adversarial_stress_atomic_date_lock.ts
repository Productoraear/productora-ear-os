/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMPIRICAL ADVERSARIAL STRESS TEST: ATOMIC DATE LOCK ENGINE
 * ════════════════════════════════════════════════════════════════════════════
 * Challenger: challenger_1 (teamwork_challenger)
 * Target: src/lib/availability/atomicDateLockEngine.ts
 *
 * Verifies under hostile/adversarial conditions:
 *  1. Concurrency stress: 20 simultaneous racing locks on identical date/slot.
 *     Strict Invariant: Exactly 1 succeeds, exactly 19 rejected with PRODUCTION_COLLISION.
 *  2. Concurrency stress (full day): 20 simultaneous racing locks without timeSlot.
 *     Strict Invariant: Exactly 1 succeeds, exactly 19 rejected with PRODUCTION_COLLISION.
 *  3. Stripe Idempotency: 10 identical webhook replay calls (mixed concurrent and serial).
 *     Strict Invariant: In 100% of calls, returns success=true and original lockId.
 *     Store contains exactly 1 physical record on disk (0 duplicates).
 *  4. Durability & Cold Restart: File persistence in `.data/offline-date-locks.json`
 *     survives memory cache purges and detects collisions on cold reboot.
 *  5. Unlock and recovery lifecycle under offline disk persistence.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  checkDateAvailability,
  lockDateAtomically,
  unlockDateAtomically,
  reloadOfflineStoreFromDisk,
  getOfflineDateLockStore,
  tripDbCircuit,
  isDbCircuitOpen,
} from '../src/lib/availability/atomicDateLockEngine';

interface StressResult {
  suite: string;
  test: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const stressLog: StressResult[] = [];

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(`[ASSERTION_FAILURE] ${msg}`);
  }
}

async function runTest(suite: string, name: string, fn: () => Promise<void>): Promise<void> {
  const start = performance.now();
  try {
    await fn();
    const durationMs = performance.now() - start;
    stressLog.push({ suite, test: name, passed: true, durationMs });
    console.log(`  ✅ [PASS] [${suite}] ${name} (${durationMs.toFixed(2)}ms)`);
  } catch (err) {
    const durationMs = performance.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    stressLog.push({ suite, test: name, passed: false, durationMs, details: msg });
    console.error(`  ❌ [FAIL] [${suite}] ${name} (${durationMs.toFixed(2)}ms): ${msg}`);
  }
}

async function main(): Promise<void> {
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log('⚔️  ADVERSARIAL STRESS TEST: ATOMIC DATE LOCK ENGINE');
  console.log('    Empirical Challenger Suite // Antigravity Omega S-Class');
  console.log('════════════════════════════════════════════════════════════════════════\n');

  // Asegurar entorno offline forzado para someter a prueba el motor secundario
  tripDbCircuit();
  assert(isDbCircuitOpen(), 'Circuit breaker must be open to test offline resilience');
  await reloadOfflineStoreFromDisk();

  const storeFilePath =
    process.env.EAR_OFFLINE_DATE_LOCKS_STORE?.trim() ||
    path.join(process.cwd(), '.data', 'offline-date-locks.json');

  /* -------------------------------------------------------------------------- */
  /* SUITE 1: CONCURRENCY STRESS (20 RACING REQUESTS ON SAME DATE & SLOT)       */
  /* -------------------------------------------------------------------------- */
  const concurrencyDate = '2028-06-17';
  const concurrencySlot = '19:30';
  const entitySlug = 'edwin-agudelo';

  let winningLockId: string | undefined;

  await runTest('CONCURRENCY', '20 concurrent lock requests on identical date/slot: exactly 1 succeeds, 19 collide', async () => {
    // Verificar primero que está libre
    const initCheck = await checkDateAvailability({
      eventDate: concurrencyDate,
      entityKind: 'artista',
      entitySlug,
      timeSlot: concurrencySlot,
    });
    assert(initCheck.available === true, `Date ${concurrencyDate} must be initially available`);

    // Disparar 20 peticiones concurrentes simultáneamente con Promise.all
    const CONCURRENCY_N = 20;
    const reqs = Array.from({ length: CONCURRENCY_N }, (_, idx) =>
      lockDateAtomically({
        eventDate: concurrencyDate,
        entityKind: 'artista',
        entitySlug,
        timeSlot: concurrencySlot,
        clientName: `Concurrent Challenger ${idx + 1}`,
        clientEmail: `challenger_${idx + 1}@productoraear.com`,
        stripeSessionId: `cs_stress_race_${Date.now()}_req_${idx + 1}`,
        totalAmountEur: 350.0,
        depositAmountEur: 100.0,
      })
    );

    const outcomes = await Promise.all(reqs);

    const successes = outcomes.filter((r) => r.success === true);
    const failures = outcomes.filter((r) => r.success === false);

    console.log(`     Total concurrent requests: ${outcomes.length}`);
    console.log(`     Success count: ${successes.length}`);
    console.log(`     Rejection count: ${failures.length}`);

    assert(successes.length === 1, `Expected exactly 1 success, got ${successes.length}`);
    assert(failures.length === 19, `Expected exactly 19 failures, got ${failures.length}`);

    const winner = successes[0];
    assert(winner.reason === 'LOCKED', `Winner reason must be LOCKED, got ${winner.reason}`);
    assert(Boolean(winner.productionId), 'Winner must have productionId');
    assert(Boolean(winner.lockId), 'Winner must have lockId');
    assert(winner.storageMode === 'FALLBACK_OFFLINE_DISK', 'Storage mode must be FALLBACK_OFFLINE_DISK');
    winningLockId = winner.lockId;

    // Verificar que los 19 fallos tienen la causa de colisión adecuada y referencian al ganador
    for (let i = 0; i < failures.length; i++) {
      const f = failures[i];
      assert(
        f.reason === 'PRODUCTION_COLLISION',
        `Failure #${i} must have reason PRODUCTION_COLLISION, got ${f.reason}`
      );
      assert(
        f.productionId === winningLockId,
        `Failure #${i} conflicting productionId must be ${winningLockId}, got ${f.productionId}`
      );
    }
  });

  await runTest('CONCURRENCY', 'Store on disk contains exactly 1 active lock for the contested slot', async () => {
    const rawDisk = await fs.readFile(storeFilePath, 'utf8');
    const store = JSON.parse(rawDisk);
    const matching = (store.productionEvents as Array<{ eventDate: string; metadata?: { timeSlot?: string }; status?: string }>).filter(
      (e) =>
        e.status !== 'CANCELLED' &&
        e.eventDate.startsWith(concurrencyDate) &&
        e.metadata?.timeSlot === concurrencySlot
    );
    assert(matching.length === 1, `Expected exactly 1 active record in disk file, found ${matching.length}`);
  });

  /* -------------------------------------------------------------------------- */
  /* SUITE 2: CONCURRENCY STRESS (FULL DAY LOCK WITHOUT SLOT)                   */
  /* -------------------------------------------------------------------------- */
  const fullDayDate = '2028-06-24';
  await runTest('CONCURRENCY_FULLDAY', '20 concurrent full-day lock requests: exactly 1 succeeds, 19 collide', async () => {
    const CONCURRENCY_N = 20;
    const reqs = Array.from({ length: CONCURRENCY_N }, (_, idx) =>
      lockDateAtomically({
        eventDate: fullDayDate,
        entityKind: 'artista',
        entitySlug,
        clientName: `Full Day Challenger ${idx + 1}`,
        stripeSessionId: `cs_stress_fullday_${Date.now()}_req_${idx + 1}`,
        totalAmountEur: 350.0,
        depositAmountEur: 100.0,
      })
    );

    const outcomes = await Promise.all(reqs);
    const successes = outcomes.filter((r) => r.success === true);
    const failures = outcomes.filter((r) => r.success === false);

    assert(successes.length === 1, `Full-day contest: expected 1 success, got ${successes.length}`);
    assert(failures.length === 19, `Full-day contest: expected 19 failures, got ${failures.length}`);
    for (const f of failures) {
      assert(f.reason === 'PRODUCTION_COLLISION', `Full-day failure reason must be PRODUCTION_COLLISION, got ${f.reason}`);
    }
  });

  /* -------------------------------------------------------------------------- */
  /* SUITE 3: STRIPE IDEMPOTENCY (10 IDENTICAL WEBHOOK REPLAY CALLS)            */
  /* -------------------------------------------------------------------------- */
  const replayDate = '2028-07-01';
  const replaySlot = '20:00';
  const canonicalSessionId = `cs_replay_adversarial_${Date.now()}_alpha`;
  let originalReplayLockId: string | undefined;

  await runTest('IDEMPOTENCY', 'First call with Stripe session creates lock and records lockId', async () => {
    const res = await lockDateAtomically({
      eventDate: replayDate,
      entityKind: 'artista',
      entitySlug,
      timeSlot: replaySlot,
      clientName: 'Idempotency Target User',
      stripeSessionId: canonicalSessionId,
      totalAmountEur: 350.0,
      depositAmountEur: 100.0,
    });
    assert(res.success === true, 'Initial lock must succeed');
    assert(res.reason === 'LOCKED', 'Initial reason must be LOCKED');
    assert(Boolean(res.lockId), 'Initial response must have lockId');
    originalReplayLockId = res.lockId;
  });

  await runTest('IDEMPOTENCY', '10 identical replay calls (5 serial + 5 concurrent) return original lockId', async () => {
    assert(Boolean(originalReplayLockId), 'Must have originalReplayLockId');

    // 5 llamadas secuenciales
    for (let i = 1; i <= 5; i++) {
      const serialRes = await lockDateAtomically({
        eventDate: replayDate,
        entityKind: 'artista',
        entitySlug,
        timeSlot: replaySlot,
        clientName: `Idempotency Serial Replay ${i}`,
        stripeSessionId: canonicalSessionId, // MISMO SESSION ID
      });
      assert(serialRes.success === true, `Serial replay #${i} must succeed`);
      assert(serialRes.reason === 'LOCKED', `Serial replay #${i} reason must be LOCKED`);
      assert(
        serialRes.lockId === originalReplayLockId,
        `Serial replay #${i} lockId ${serialRes.lockId} must equal original ${originalReplayLockId}`
      );
      assert(
        serialRes.productionId === originalReplayLockId,
        `Serial replay #${i} productionId must equal original`
      );
    }

    // 5 llamadas concurrentes simultáneas
    const concurrentReplays = await Promise.all(
      Array.from({ length: 5 }, (_, idx) =>
        lockDateAtomically({
          eventDate: replayDate,
          entityKind: 'artista',
          entitySlug,
          timeSlot: replaySlot,
          clientName: `Idempotency Concurrent Replay ${idx + 1}`,
          stripeSessionId: canonicalSessionId, // MISMO SESSION ID
        })
      )
    );

    for (let idx = 0; idx < concurrentReplays.length; idx++) {
      const cr = concurrentReplays[idx];
      assert(cr.success === true, `Concurrent replay #${idx} must succeed`);
      assert(cr.reason === 'LOCKED', `Concurrent replay #${idx} reason must be LOCKED`);
      assert(
        cr.lockId === originalReplayLockId,
        `Concurrent replay #${idx} lockId must equal original ${originalReplayLockId}`
      );
    }
  });

  await runTest('IDEMPOTENCY', 'Physical file on disk contains EXACTLY 1 record for this Stripe session (0 duplicates)', async () => {
    const rawDisk = await fs.readFile(storeFilePath, 'utf8');
    const store = JSON.parse(rawDisk);
    const duplicates = (store.productionEvents as Array<{ metadata?: { stripeSessionId?: string }; status?: string }>).filter(
      (e) => e.metadata?.stripeSessionId === canonicalSessionId
    );
    console.log(`     Found ${duplicates.length} records in disk store for stripeSessionId ${canonicalSessionId}`);
    assert(duplicates.length === 1, `Expected exactly 1 record on disk, but found ${duplicates.length} (FATAL DUPLICATION)`);
  });

  /* -------------------------------------------------------------------------- */
  /* SUITE 4: DURABILITY & RESTART STRESS                                       */
  /* -------------------------------------------------------------------------- */
  const durabilityDate = '2028-07-08';
  let durabilityLockId: string | undefined;
  let durabilitySha256: string | undefined;

  await runTest('DURABILITY', 'Write lock to disk and verify atomic presence in physical JSON file', async () => {
    const res = await lockDateAtomically({
      eventDate: durabilityDate,
      entityKind: 'artista',
      entitySlug,
      timeSlot: '21:00',
      clientName: 'Durability Client Test',
      totalAmountEur: 350.0,
      depositAmountEur: 100.0,
    });
    assert(res.success === true, 'Lock must succeed');
    durabilityLockId = res.lockId;
    durabilitySha256 = res.priceLockSha256;

    // Verificar en disco directamente sin pasar por caché en memoria
    const rawDisk = await fs.readFile(storeFilePath, 'utf8');
    const store = JSON.parse(rawDisk);
    const savedEvent = (store.productionEvents as Array<{ id: string; metadata?: { priceLockSha256?: string } }>).find(
      (e) => e.id === durabilityLockId
    );
    assert(Boolean(savedEvent), `Event ${durabilityLockId} must be physically written to disk`);
    assert(
      savedEvent?.metadata?.priceLockSha256 === durabilitySha256,
      'SHA-256 seal on disk must match memory seal'
    );
  });

  await runTest('DURABILITY', 'Purge memory cache completely; cold reload recovers lock and blocks collision', async () => {
    // Purga de memoria
    await reloadOfflineStoreFromDisk();

    // Comprobar disponibilidad: debe fallar con colisión detectada desde disco
    const checkAfterRestart = await checkDateAvailability({
      eventDate: durabilityDate,
      entityKind: 'artista',
      entitySlug,
      timeSlot: '21:00',
    });

    assert(checkAfterRestart.available === false, 'Date must NOT be available after cold restart');
    assert(
      checkAfterRestart.reason === 'PRODUCTION_COLLISION',
      `Reason must be PRODUCTION_COLLISION, got ${checkAfterRestart.reason}`
    );
    assert(
      checkAfterRestart.conflictingProductionId === durabilityLockId,
      `Conflicting ID must be ${durabilityLockId}, got ${checkAfterRestart.conflictingProductionId}`
    );
  });

  await runTest('DURABILITY', 'No leftover .tmp files exist in .data directory', async () => {
    const dataDir = path.dirname(storeFilePath);
    const files = await fs.readdir(dataDir);
    const tmpFiles = files.filter((f) => f.includes('.tmp'));
    console.log(`     Leftover .tmp files count: ${tmpFiles.length}`);
    assert(tmpFiles.length === 0, `Found ${tmpFiles.length} leftover .tmp files: ${tmpFiles.join(', ')}`);
  });

  /* -------------------------------------------------------------------------- */
  /* SUITE 5: CLEANUP & RECOVERY                                                */
  /* -------------------------------------------------------------------------- */
  await runTest('LIFECYCLE', 'Unlock created locks and verify date is released', async () => {
    // Liberar durability
    if (durabilityLockId) {
      const uRes = await unlockDateAtomically({
        productionId: durabilityLockId,
        eventDate: durabilityDate,
        entityKind: 'artista',
        entitySlug,
        timeSlot: '21:00',
      });
      assert(uRes.success === true, 'Unlock durability must succeed');
    }

    // Liberar concurrency winner
    if (winningLockId) {
      const uRes = await unlockDateAtomically({
        productionId: winningLockId,
        eventDate: concurrencyDate,
        entityKind: 'artista',
        entitySlug,
        timeSlot: concurrencySlot,
      });
      assert(uRes.success === true, 'Unlock concurrency winner must succeed');
    }

    // Recargar y verificar disponibilidad liberada
    await reloadOfflineStoreFromDisk();
    const releasedCheck = await checkDateAvailability({
      eventDate: durabilityDate,
      entityKind: 'artista',
      entitySlug,
      timeSlot: '21:00',
    });
    assert(releasedCheck.available === true, 'Date must be available again after unlock');
  });

  /* -------------------------------------------------------------------------- */
  /* SUMMARY REPORT                                                             */
  /* -------------------------------------------------------------------------- */
  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('📊 RESULTS SUMMARY: ATOMIC DATE LOCK ADVERSARIAL STRESS TEST');
  console.log('════════════════════════════════════════════════════════════════════════');

  const total = stressLog.length;
  const passed = stressLog.filter((r) => r.passed).length;
  const failed = stressLog.filter((r) => !r.passed).length;

  for (const r of stressLog) {
    console.log(`  ${r.passed ? '✅' : '❌'} [${r.suite}] ${r.test} — ${r.durationMs.toFixed(2)}ms`);
    if (r.details) {
      console.log(`     Error details: ${r.details}`);
    }
  }

  console.log(`\nTotal test cases: ${total} | Passed: ${passed} | Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n🏆 [EXIT 0] All adversarial stress tests for atomicDateLockEngine PASSED with zero bugs.');
    process.exit(0);
  } else {
    console.error(`\n💥 [EXIT 1] ${failed} stress tests failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('💥 Fatal unexpected error:', err);
  process.exit(1);
});
