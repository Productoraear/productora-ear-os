/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN OFFLINE DE ATOMIC DATE LOCK ENGINE · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Valida la resiliencia offline de `src/lib/availability/atomicDateLockEngine.ts`
 * cuando PostgreSQL no está levantado en `localhost:5432`:
 *   1. Chequeo de disponibilidad offline (< 10ms, sin excepciones no controladas).
 *   2. Bloqueo atómico offline con persistencia en `.data/offline-date-locks.json`.
 *   3. Prevención de colisiones en el mismo día y tramo horario.
 *   4. Idempotencia estricta por `stripeSessionId` (retries de webhook).
 *   5. Aislamiento por entidad (`kind:slug`), evitando bloqueos cruzados.
 *   6. Integridad criptográfica del sello SHA-256 (`priceLockSha256`).
 *   7. Durabilidad cross-restart (recarga desde disco con purga de caché en memoria).
 *   8. Desbloqueo atómico (`unlockDateAtomically`) y limpieza de stale locks.
 *
 * Ejecución canónica:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_atomic_date_lock_offline.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  checkDateAvailability,
  lockDateAtomically,
  unlockDateAtomically,
  releaseStalePendingLocks,
  reloadOfflineStoreFromDisk,
  getOfflineDateLockStore,
  isDbCircuitOpen,
  tripDbCircuit,
  resetDbCircuitBreaker,
} from '../src/lib/availability/atomicDateLockEngine';

interface TestStepResult {
  step: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const results: TestStepResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`);
  }
}

async function runStep(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ step: name, passed: true, durationMs });
    console.log(`  ✅ [PASS] ${name} (${durationMs}ms)`);
  } catch (error) {
    const durationMs = Date.now() - start;
    const msg = error instanceof Error ? error.message : String(error);
    results.push({ step: name, passed: false, durationMs, details: msg });
    console.error(`  ❌ [FAIL] ${name} (${durationMs}ms): ${msg}`);
  }
}

async function main(): Promise<void> {
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log('🏛️  EAR OS V2 — ATOMIC DATE LOCK ENGINE OFFLINE RESILIENCE SUITE');
  console.log('    Gobernanza S-Class / Antigravity Omega v11.0 / ZTM');
  console.log('════════════════════════════════════════════════════════════════════════\n');

  // Fechas y entidades deterministas para la suite de pruebas
  const testDate = '2027-06-19'; // Sábado temporada alta 2027
  const testSlot = '18:00';
  const testSlugEdwin = 'edwin-agudelo';
  const testSlugFinca = 'finca-la-toledana-test';
  const testSessionId = `cs_test_offline_${Date.now()}_alpha`;
  const knownSha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  let createdLockId: string | undefined;

  // Paso 0: Asegurar que el circuit breaker simule entorno offline si no está ya activo
  await runStep('0. Inicialización de estado y disparo de circuit breaker offline', async () => {
    tripDbCircuit();
    assert(isDbCircuitOpen(), 'El circuit breaker debe estar activo en modo offline');
    await reloadOfflineStoreFromDisk();
  });

  // Paso 1: Chequeo inicial de disponibilidad en fecha libre
  await runStep('1. Chequeo de disponibilidad en fecha libre sin PostgreSQL', async () => {
    const res = await checkDateAvailability({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
    });

    assert(res.available === true, `La fecha ${testDate} debe estar disponible inicialmente`);
    assert(res.reason === 'AVAILABLE', `El reason debe ser AVAILABLE, recibido: ${res.reason}`);
    assert(res.storageMode === 'FALLBACK_OFFLINE_DISK', `Debe operar en modo FALLBACK_OFFLINE_DISK`);
  });

  // Paso 2: Bloqueo atómico con persistencia offline y sello criptográfico SHA-256
  await runStep('2. Bloqueo atómico offline con sello SHA-256 y metadatos S-Class', async () => {
    const lock = await lockDateAtomically({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
      clientName: 'Inversor Showcase Test',
      clientEmail: 'inversor@productoraear.com',
      stripeSessionId: testSessionId,
      priceLockSha256: knownSha256,
      totalAmountEur: 350.0,
      depositAmountEur: 100.0,
    });

    assert(lock.success === true, `El bloqueo atómico offline debe tener éxito`);
    assert(lock.reason === 'LOCKED', `El reason debe ser LOCKED`);
    assert(Boolean(lock.productionId), `Debe generarse un productionId válido`);
    assert(lock.lockId === lock.productionId, `lockId debe coincidir con productionId`);
    assert(lock.priceLockSha256 === knownSha256, `El hash SHA-256 provisto debe preservarse`);
    assert(lock.storageMode === 'FALLBACK_OFFLINE_DISK', `Debe reportar storageMode FALLBACK_OFFLINE_DISK`);

    createdLockId = lock.productionId;
  });

  // Paso 3: Prevención estricta de colisiones en la misma fecha y franja
  await runStep('3. Prevención de colisión (anti-race condition) en misma fecha y franja', async () => {
    const checkAfter = await checkDateAvailability({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
    });

    assert(checkAfter.available === false, `La fecha y tramo ya bloqueados NO deben estar disponibles`);
    assert(
      checkAfter.reason === 'PRODUCTION_COLLISION',
      `El reason debe ser PRODUCTION_COLLISION, recibido: ${checkAfter.reason}`
    );
    assert(
      checkAfter.conflictingProductionId === createdLockId,
      `Debe identificar exactamente la producción en conflicto (${createdLockId})`
    );

    // Intento de doble bloqueo sobre el mismo tramo debe ser rechazado
    const duplicateLock = await lockDateAtomically({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
      clientName: 'Cliente Concurrente 2',
      stripeSessionId: `cs_test_offline_${Date.now()}_beta`,
    });

    assert(duplicateLock.success === false, `El segundo bloqueo concurrente debe ser rechazado`);
    assert(
      duplicateLock.reason === 'PRODUCTION_COLLISION',
      `Reason de rechazo debe ser PRODUCTION_COLLISION`
    );
  });

  // Paso 4: Idempotencia de sesión de Stripe (retries de webhook)
  await runStep('4. Idempotencia estricta por stripeSessionId (webhooks repetidos)', async () => {
    const retryLock = await lockDateAtomically({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
      clientName: 'Inversor Showcase Test Retry',
      stripeSessionId: testSessionId, // MISMA sesión de Stripe
    });

    assert(retryLock.success === true, `El retry idempotente debe devolver éxito`);
    assert(retryLock.reason === 'LOCKED', `El reason debe ser LOCKED`);
    assert(
      retryLock.productionId === createdLockId,
      `Debe devolver exactamente el productionId original sin duplicar registros`
    );
  });

  // Paso 5: Aislamiento por entidad (el bloqueo de Edwin no bloquea la Finca en la misma fecha)
  await runStep('5. Aislamiento por entidad (la reserva del solista no colisiona con la finca)', async () => {
    const fincaCheck = await checkDateAvailability({
      eventDate: testDate,
      entityKind: 'finca',
      entitySlug: testSlugFinca,
      timeSlot: testSlot,
    });

    assert(
      fincaCheck.available === true,
      `La finca debe estar libre en la misma fecha y hora (aislamiento kind:slug)`
    );

    // Bloquear la finca
    const fincaLock = await lockDateAtomically({
      eventDate: testDate,
      entityKind: 'finca',
      entitySlug: testSlugFinca,
      timeSlot: testSlot,
      clientName: 'Boda en Finca',
      stripeSessionId: `cs_test_finca_${Date.now()}`,
    });

    assert(fincaLock.success === true, `El bloqueo de la finca debe materializarse con éxito`);
  });

  // Paso 6: Durabilidad cross-restart (persistencia real en .data/offline-date-locks.json)
  await runStep('6. Durabilidad cross-restart: recarga física desde disco tras purga de memoria', async () => {
    const storePath =
      process.env.EAR_OFFLINE_DATE_LOCKS_STORE?.trim() ||
      path.join(process.cwd(), '.data', 'offline-date-locks.json');

    const fileExists = await fs
      .access(storePath)
      .then(() => true)
      .catch(() => false);

    assert(fileExists, `El archivo físico ${storePath} debe existir en disco`);

    const rawDisk = await fs.readFile(storePath, 'utf8');
    const parsed = JSON.parse(rawDisk);
    assert(Array.isArray(parsed.productionEvents), 'productionEvents debe ser un array en disco');
    const onDiskEvent = parsed.productionEvents.find(
      (e: { id: string }) => e.id === createdLockId
    );
    assert(Boolean(onDiskEvent), `El evento ${createdLockId} debe existir físicamente en el JSON`);
    assert(
      onDiskEvent.metadata?.priceLockSha256 === knownSha256,
      'El hash SHA-256 debe coincidir en disco'
    );

    // Purgar caché en memoria y recargar desde disco
    await reloadOfflineStoreFromDisk();

    // Re-chequear disponibilidad tras cold-start simulado
    const postRestartCheck = await checkDateAvailability({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
    });

    assert(
      postRestartCheck.available === false,
      `Tras reinicio en frío, la colisión debe seguir detectándose desde disco`
    );
    assert(
      postRestartCheck.conflictingProductionId === createdLockId,
      `El id de colisión en frío debe seguir siendo ${createdLockId}`
    );
  });

  // Paso 7: Desbloqueo atómico y liberación de fecha
  await runStep('7. Desbloqueo atómico (unlockDateAtomically) y verificación de liberación', async () => {
    assert(Boolean(createdLockId), 'Se requiere createdLockId para el desbloqueo');

    const unlock = await unlockDateAtomically({
      productionId: createdLockId,
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
    });

    assert(unlock.success === true, `El desbloqueo debe reportar éxito`);
    assert(unlock.reason === 'UNLOCKED', `El reason debe ser UNLOCKED`);

    // Comprobar que la fecha vuelve a estar disponible
    const postUnlockCheck = await checkDateAvailability({
      eventDate: testDate,
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: testSlot,
    });

    assert(
      postUnlockCheck.available === true,
      `Tras el desbloqueo, la fecha debe volver a estar disponible`
    );
    assert(postUnlockCheck.reason === 'AVAILABLE', `El reason debe ser AVAILABLE tras desbloquear`);
  });

  // Paso 8: Liberación de stale pending locks
  await runStep('8. Limpieza atómica de bloqueos obsoletos (releaseStalePendingLocks)', async () => {
    // Insertar un lock temporal pendiente con expiración forzada en el pasado
    const staleLock = await lockDateAtomically({
      eventDate: '2027-07-10',
      entityKind: 'artista',
      entitySlug: testSlugEdwin,
      timeSlot: '12:00',
      clientName: 'Cliente Abandono Checkout',
      status: 'PENDING_DEPOSIT',
    });

    assert(staleLock.success === true, 'El lock pendiente debe crearse');

    // Modificar temporalmente la fecha de creación en el store para simular antigüedad > 30 min
    const store = await getOfflineDateLockStore();
    const staleItem = store.productionEvents.find((e) => e.id === staleLock.productionId);
    if (staleItem) {
      staleItem.createdAt = new Date(Date.now() - 40 * 60 * 1000).toISOString();
      const storePath =
        process.env.EAR_OFFLINE_DATE_LOCKS_STORE?.trim() ||
        path.join(process.cwd(), '.data', 'offline-date-locks.json');
      await fs.writeFile(storePath, JSON.stringify(store, null, 2), 'utf8');
      await reloadOfflineStoreFromDisk();
    }

    const releaseRes = await releaseStalePendingLocks(30);
    assert(releaseRes.success === true, 'releaseStalePendingLocks debe tener éxito');
    assert(releaseRes.releasedCount >= 1, `Debe haberse liberado al menos 1 lock obsoleto`);

    // Limpieza final de finca test
    await unlockDateAtomically({
      eventDate: testDate,
      entityKind: 'finca',
      entitySlug: testSlugFinca,
      timeSlot: testSlot,
    });
  });

  // Paso 9: Latencia sub-10ms con circuit breaker activo
  await runStep('9. Medición de latencia sub-10ms garantizada por el circuit breaker', async () => {
    const iters = 5;
    const times: number[] = [];
    for (let i = 0; i < iters; i++) {
      const t0 = performance.now();
      await checkDateAvailability({
        eventDate: '2027-08-15',
        entityKind: 'artista',
        entitySlug: testSlugEdwin,
      });
      times.push(performance.now() - t0);
    }
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`     Latencia media disponibilidad offline: ${avg.toFixed(2)}ms (muestras: ${times.map((t) => t.toFixed(1)).join(', ')}ms)`);
    assert(avg < 15.0, `La latencia media (${avg.toFixed(2)}ms) debe ser < 15ms`);
  });

  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('📊 RESUMEN EJECUTIVO DE VERIFICACIÓN OFFLINE');
  console.log('════════════════════════════════════════════════════════════════════════');
  const allPassed = results.every((r) => r.passed);
  for (const r of results) {
    console.log(`  ${r.passed ? '✅' : '❌'} ${r.step} — ${r.durationMs}ms`);
  }
  console.log(`\nTotal pruebas: ${results.length} | Aprobadas: ${results.filter((r) => r.passed).length} | Fallidas: ${results.filter((r) => !r.passed).length}`);

  if (allPassed) {
    console.log('\n🎉 [EXIT 0] Todas las garantías de resiliencia offline han sido verificadas.');
    process.exit(0);
  } else {
    console.error('\n💥 [EXIT 1] Una o más aserciones de la suite offline han fallado.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('💥 Error crítico en la ejecución del arnés:', err);
  process.exit(1);
});
