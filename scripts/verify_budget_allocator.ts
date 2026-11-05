/**
 * ════════════════════════════════════════════════════════════════════════════
 * W45_T01 / W51_T03 · AUDITOR ENDURECIDO DEL MOTOR MAGIA NEGRA (BUDGET ALLOCATOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica la ley §5 de `docs/MASTER_AUDIT_OMEGA_DIAMANTE_2026.md:154-175`:
 *   1. Reparto canónico 50/15/15/10/10 siempre exacto al céntimo.
 *   2. Candados 🔒 inmutables: mover uno lanza LOCKED_CATEGORY.
 *   3. Rebalanceo proporcional entre categorías libres.
 *   4. Barrido aleatorio determinista sin un solo descuadre.
 *   5. Paridad con el SSOT (350 / 100 / 14.250) y radar de 3 tiers.
 *   6. Exactitud en céntimos para totales clave (0, 1, 2, 3, 99, 100, 101, 350 €).
 *   7. Determinismo del resto y rechazo explícito de entradas hostiles.
 *   8. Prueba de propiedad con LCG de semilla fija (1.000 casos verificados).
 *
 * Salida contractual S-Class:
 *   BUDGET_ASSERTIONS=<n>
 *   BUDGET_ITERATIONS=<n>
 *   BUDGET_PROPERTY_CASES=1000
 *   BUDGET_SEED=<seed>
 *   BUDGET_RESULT=PASS|FAIL
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    BUDGET_CATEGORIES,
    BUDGET_ENGINE_SSOT,
    BudgetEngineError,
    CANONICAL_WEIGHT_TOTAL,
    assertBalanced,
    centsToEur,
    createAllocation,
    eurToCents,
    rankProviderTiers,
    setCategoryAmount,
    toggleLock,
    type BudgetAllocation,
    type BudgetCategoryId,
    type BudgetErrorCode,
} from '../src/lib/budget/budget-allocator-engine';

interface MetricsTracker {
    assertions: number;
    failures: number;
    iterations: number;
}

const metrics: MetricsTracker = {
    assertions: 0,
    failures: 0,
    iterations: 0,
};

function check(name: string, fn: () => void): void {
    metrics.assertions += 1;
    try {
        fn();
    } catch (err) {
        metrics.failures += 1;
        const detail = err instanceof Error ? err.message : String(err);
        console.error(`FAIL · ${name} :: ${detail}`);
    }
}

function expect(condition: boolean, message: string): void {
    if (!condition) throw new Error(message);
}

function expectEqual(actual: number, expected: number, label: string): void {
    if (actual !== expected) {
        throw new Error(`${label}: esperado ${expected}, obtenido ${actual}`);
    }
}

function expectThrows(fn: () => void, code: BudgetErrorCode, label: string): void {
    try {
        fn();
    } catch (err) {
        if (err instanceof BudgetEngineError && err.code === code) return;
        const detail = err instanceof Error ? err.message : String(err);
        throw new Error(`${label}: se esperaba ${code}, se obtuvo "${detail}"`);
    }
    throw new Error(`${label}: no lanzó excepción (se esperaba ${code})`);
}

/** LCG determinista: misma semilla ⇒ misma secuencia ⇒ auditoría reproducible. */
function createRandom(seed: number): () => number {
    let state = seed >>> 0;
    return (): number => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

function amounts(allocation: BudgetAllocation): readonly number[] {
    return BUDGET_CATEGORIES.map((rule) => allocation.amountsCents[rule.id]);
}

function totalOf(allocation: BudgetAllocation): number {
    return amounts(allocation).reduce((acc, value) => acc + value, 0);
}

console.log('[W51_T03] MOTOR MAGIA NEGRA — AUDITORÍA DE REPARTO PRESUPUESTARIO');
console.log('─'.repeat(76));

// ─── 1. Reparto canónico exacto ──────────────────────────────────────────────
check('canónico 20.000 € ⇒ 10.000 / 3.000 / 3.000 / 2.000 / 2.000', () => {
    const allocation = createAllocation(20_000);
    expectEqual(allocation.amountsCents.espacio_banquete, 1_000_000, 'espacio');
    expectEqual(allocation.amountsCents.musica_produccion, 300_000, 'música');
    expectEqual(allocation.amountsCents.foto_video, 300_000, 'foto/vídeo');
    expectEqual(allocation.amountsCents.estilismo, 200_000, 'estilismo');
    expectEqual(allocation.amountsCents.decoracion_flores, 200_000, 'decoración');
    expectEqual(totalOf(allocation), 2_000_000, 'suma');
});

check('céntimo indivisible 20,01 € ⇒ 10,01 / 3 / 3 / 2 / 2', () => {
    const allocation = createAllocation(20.01);
    expectEqual(allocation.amountsCents.espacio_banquete, 1001, 'espacio');
    expectEqual(allocation.amountsCents.musica_produccion, 300, 'música');
    expectEqual(allocation.amountsCents.foto_video, 300, 'foto/vídeo');
    expectEqual(allocation.amountsCents.estilismo, 200, 'estilismo');
    expectEqual(allocation.amountsCents.decoracion_flores, 200, 'decoración');
    expectEqual(totalOf(allocation), 2001, 'suma');
});

check('mínimo 0,01 € ⇒ 1 céntimo al mayor resto (espacio)', () => {
    const allocation = createAllocation(0.01);
    expectEqual(totalOf(allocation), 1, 'suma');
    expectEqual(allocation.amountsCents.espacio_banquete, 1, 'espacio');
});

check('cero 0 € ⇒ todo cero, sin NaN', () => {
    const allocation = createAllocation(0);
    expectEqual(totalOf(allocation), 0, 'suma');
    expect(amounts(allocation).every((value) => value === 0), 'alguna categoría distinta de 0');
});

check('hostiles (-1, NaN, Infinity, 1e12) ⇒ INVALID_TOTAL', () => {
    expectThrows(() => createAllocation(-1), 'INVALID_TOTAL', '-1');
    expectThrows(() => createAllocation(Number.NaN), 'INVALID_TOTAL', 'NaN');
    expectThrows(() => createAllocation(Number.POSITIVE_INFINITY), 'INVALID_TOTAL', 'Infinity');
    expectThrows(() => createAllocation(1e12), 'INVALID_TOTAL', '1e12');
});

check('pesos canónicos suman 100', () => {
    const sum = BUDGET_CATEGORIES.reduce((acc, rule) => acc + rule.weight, 0);
    expectEqual(sum, CANONICAL_WEIGHT_TOTAL, 'Σ pesos');
});

// ─── 2. Barrido aleatorio determinista (10.000 presupuestos) ─────────────────
check('10.000 presupuestos aleatorios ⇒ Σ exacta, enteros y no negativos', () => {
    const random = createRandom(20261102);
    for (let i = 0; i < 10_000; i += 1) {
        metrics.iterations += 1;
        const euros = Math.round(random() * 5_000_000) / 100; // 0,00 € … 50.000,00 €
        const allocation = createAllocation(euros);
        expect(assertBalanced(allocation), `descuadre en ${euros} €`);
        expectEqual(totalOf(allocation), allocation.totalCents, `suma en ${euros} €`);
        for (const value of amounts(allocation)) {
            expect(Number.isInteger(value), `no entero en ${euros} €`);
            expect(value >= 0, `negativo en ${euros} €`);
        }
    }
});

// ─── 3. Candados 🔒 ─────────────────────────────────────────────────────────
check('candado congela el importe y el rebalanceo no lo mueve', () => {
    const base = createAllocation(20_000);
    const lockedAllocation = toggleLock(base, 'espacio_banquete', true);
    expectEqual(lockedAllocation.amountsCents.espacio_banquete, 1_000_000, 'espacio bloqueado');

    const moved = setCategoryAmount(lockedAllocation, 'musica_produccion', 4_000);
    expectEqual(moved.amountsCents.espacio_banquete, 1_000_000, 'espacio tras rebalanceo');
    expectEqual(moved.amountsCents.musica_produccion, 400_000, 'música fijada');
    expectEqual(moved.amountsCents.foto_video, 257_143, 'foto/vídeo rebalanceado');
    expectEqual(moved.amountsCents.estilismo, 171_429, 'estilismo rebalanceado');
    expectEqual(moved.amountsCents.decoracion_flores, 171_428, 'decoración rebalanceada');
    expectEqual(totalOf(moved), 2_000_000, 'suma tras rebalanceo');
});

check('mover una categoría bloqueada ⇒ LOCKED_CATEGORY', () => {
    const lockedAllocation = toggleLock(createAllocation(20_000), 'espacio_banquete', true);
    expectThrows(
        () => setCategoryAmount(lockedAllocation, 'espacio_banquete', 12_000),
        'LOCKED_CATEGORY',
        'candado espacio',
    );
});

check('importe por encima de lo disponible ⇒ INVALID_TOTAL', () => {
    const lockedAllocation = toggleLock(createAllocation(20_000), 'espacio_banquete', true);
    expectThrows(
        () => setCategoryAmount(lockedAllocation, 'foto_video', 11_000),
        'INVALID_TOTAL',
        'foto sobre disponible',
    );
});

check('desbloquear devuelve el reparto canónico', () => {
    const lockedAllocation = toggleLock(createAllocation(20_000), 'espacio_banquete', true);
    const moved = setCategoryAmount(lockedAllocation, 'musica_produccion', 4_000);
    const unlocked = toggleLock(moved, 'espacio_banquete', false);
    expectEqual(unlocked.amountsCents.espacio_banquete, 1_000_000, 'espacio');
    expectEqual(unlocked.amountsCents.musica_produccion, 300_000, 'música');
    expectEqual(unlocked.amountsCents.foto_video, 300_000, 'foto/vídeo');
    expectEqual(unlocked.amountsCents.estilismo, 200_000, 'estilismo');
    expectEqual(unlocked.amountsCents.decoracion_flores, 200_000, 'decoración');
    expectEqual(totalOf(unlocked), 2_000_000, 'suma');
});

check('toggleLock idempotente (mismo estado ⇒ misma asignación)', () => {
    const base = createAllocation(20_000);
    const once = toggleLock(base, 'foto_video', true);
    const twice = toggleLock(once, 'foto_video', true);
    expect(once === twice, 'toggleLock no es idempotente');
});

// ─── 4. Secuencias aleatorias de candados ────────────────────────────────────
check('1.000 secuencias aleatorias de candado ⇒ Σ exacta y candados intactos', () => {
    const random = createRandom(424242);
    const ids: readonly BudgetCategoryId[] = BUDGET_CATEGORIES.map((rule) => rule.id);

    for (let i = 0; i < 1_000; i += 1) {
        metrics.iterations += 1;
        const euros = Math.round(random() * 2_000_000) / 100;
        let allocation = createAllocation(euros);
        const frozen = new Map<BudgetCategoryId, number>();

        for (let step = 0; step < 8; step += 1) {
            const id = ids[Math.floor(random() * ids.length)];
            const shouldLock = random() > 0.5;
            const wasLocked = allocation.locked.includes(id);
            allocation = toggleLock(allocation, id, shouldLock);
            if (shouldLock && !wasLocked) frozen.set(id, allocation.amountsCents[id]);
            if (!shouldLock) frozen.delete(id);
        }

        expect(assertBalanced(allocation), `descuadre en secuencia ${i}`);
        for (const [id, amount] of frozen) {
            expectEqual(allocation.amountsCents[id], amount, `candado ${id} movido en secuencia ${i}`);
        }
    }
});

// ─── 5. Radar de proveedores (3 tiers) ──────────────────────────────────────
check('radar 3 tiers: exact / premium +15% / stretch +30%', () => {
    const allocation = createAllocation(20_000); // espacio = 1.000.000 céntimos
    const radar = rankProviderTiers(allocation, 'espacio_banquete', [
        900_000, 1_000_000, 1_100_000, 1_150_000, 1_200_000, 1_400_000,
    ]);
    expectEqual(radar.exact, 2, 'exact');
    expectEqual(radar.premium15, 2, 'premium15');
    expectEqual(radar.stretch, 1, 'stretch');
});

check('radar rechaza ofertas hostiles ⇒ NEGATIVE_AMOUNT', () => {
    const allocation = createAllocation(20_000);
    expectThrows(() => rankProviderTiers(allocation, 'espacio_banquete', [-1]), 'NEGATIVE_AMOUNT', 'oferta -1');
    expectThrows(
        () => rankProviderTiers(allocation, 'espacio_banquete', [Number.NaN]),
        'NEGATIVE_AMOUNT',
        'oferta NaN',
    );
});

// ─── 6. Paridad con el SSOT (ZONA CERO, solo lectura) ───────────────────────
check('paridad SSOT: 350 € / 100 € / 14.250 € / split 80-10-10', () => {
    expectEqual(BUDGET_ENGINE_SSOT.tarifaBaseSolistaCents, 35_000, 'tarifa solista');
    expectEqual(BUDGET_ENGINE_SSOT.depositoStripeCents, 10_000, 'depósito Stripe');
    expectEqual(BUDGET_ENGINE_SSOT.safeLcspCeilingCents, 1_425_000, 'techo B2G preventivo');
    const split = BUDGET_ENGINE_SSOT.splitSoberano;
    expect(Math.abs(split.artista + split.earOs + split.vimume - 1) < 1e-9, 'el split no suma 1');
    expectEqual(Math.round(split.artista * 100), 80, 'artista');
    expectEqual(Math.round(split.earOs * 100), 10, 'EAR OS');
    expectEqual(Math.round(split.vimume * 100), 10, 'VIMUME');
});

// ─── 7. Ida y vuelta monetaria sin deriva ───────────────────────────────────
check('€ → céntimos → € sin deriva (1.000 casos)', () => {
    const random = createRandom(7);
    for (let i = 0; i < 1_000; i += 1) {
        metrics.iterations += 1;
        const euros = Math.round(random() * 100_000) / 100;
        const back = centsToEur(eurToCents(euros));
        expect(Math.abs(back - euros) < 1e-9, `deriva en ${euros} € → ${back} €`);
    }
});

// ─── 8. Determinismo byte a byte ────────────────────────────────────────────
check('determinismo byte a byte (misma entrada ⇒ mismo JSON)', () => {
    const first = createAllocation(12_345.67);
    const second = createAllocation(12_345.67);
    expect(JSON.stringify(first) === JSON.stringify(second), 'creación no determinista');

    const left = setCategoryAmount(toggleLock(first, 'foto_video', true), 'musica_produccion', 1_234.56);
    const right = setCategoryAmount(toggleLock(second, 'foto_video', true), 'musica_produccion', 1_234.56);
    expect(JSON.stringify(left) === JSON.stringify(right), 'rebalanceo no determinista');
});

// ─── 9. Exactitud en céntimos para totales clave (0, 1, 2, 3, 99, 100, 101, 350 €) ─
check('exactitud céntimos en puntos críticos (0, 1, 2, 3, 99, 100, 101, 350 €)', () => {
    const criticalEuros = [0, 0.01, 0.02, 0.03, 0.99, 1.00, 1.01, 3.50, 99.00, 100.00, 101.00, 350.00];
    for (const euros of criticalEuros) {
        metrics.iterations += 1;
        const alloc = createAllocation(euros);
        expect(assertBalanced(alloc), `desbalance en crítico ${euros} €`);
        expectEqual(totalOf(alloc), alloc.totalCents, `suma en crítico ${euros} €`);
        for (const amt of amounts(alloc)) {
            expect(Number.isInteger(amt), `amt no entero en crítico ${euros} €`);
            expect(amt >= 0, `amt negativo en crítico ${euros} €`);
        }
    }
});

// ─── 10. Determinismo del resto: céntimo sobrante en bolsa idéntica ────────
check('determinismo del resto: el céntimo indivisible cae en la misma bolsa', () => {
    const allocA = createAllocation(0.01);
    const allocB = createAllocation(0.01);
    expectEqual(allocA.amountsCents.espacio_banquete, allocB.amountsCents.espacio_banquete, 'espacio idéntico');
    expectEqual(allocA.amountsCents.musica_produccion, allocB.amountsCents.musica_produccion, 'música idéntica');

    const allocA3 = createAllocation(0.03);
    const allocB3 = createAllocation(0.03);
    expectEqual(JSON.stringify(allocA3.amountsCents), JSON.stringify(allocB3.amountsCents), 'resto 3 céntimos idéntico');
});

// ─── 11. Rechazo explícito de entradas hostiles adicionales ─────────────────
check('rechazo explícito de entradas hostiles: strings, no-enteros para céntimos', () => {
    expectThrows(() => centsToEur(-5), 'INVALID_TOTAL', 'céntimos negativos');
    expectThrows(() => centsToEur(12.34), 'INVALID_TOTAL', 'céntimos float');
    expectThrows(() => centsToEur(Number.NaN), 'INVALID_TOTAL', 'céntimos NaN');
    // Verificación de tipos hostiles
    expectThrows(() => createAllocation('invalid' as unknown as number), 'INVALID_TOTAL', 'string no numérico');
});

// ─── 12. Idempotencia de llamadas múltiples N=10 ────────────────────────────
check('idempotencia: N llamadas idénticas producen idéntico estado inmutable', () => {
    const baseline = createAllocation(350);
    const jsonBase = JSON.stringify(baseline);
    for (let i = 0; i < 10; i += 1) {
        metrics.iterations += 1;
        const current = createAllocation(350);
        expectEqual(current.totalCents, baseline.totalCents, `totalCents iter ${i}`);
        expect(JSON.stringify(current) === jsonBase, `desfase JSON iter ${i}`);
    }
});

// ─── 13. Prueba de Propiedad (Property-Based Test: 1.000 casos deterministas) ─
const PROPERTY_SEED = 20261105;
const PROPERTY_CASES = 1000;

check(`prueba de propiedad: ${PROPERTY_CASES} casos (semilla fija ${PROPERTY_SEED})`, () => {
    const rng = createRandom(PROPERTY_SEED);
    for (let i = 0; i < PROPERTY_CASES; i += 1) {
        metrics.iterations += 1;
        // Rango de 0 a 100.000 € con céntimos variados
        const euros = Math.round(rng() * 10_000_000) / 100;
        const alloc = createAllocation(euros);

        expect(assertBalanced(alloc), `propiedad fallida en caso ${i}: ${euros} €`);
        expectEqual(totalOf(alloc), alloc.totalCents, `propiedad suma caso ${i}`);

        // Invariante de 5 bolsas enteras no negativas
        const values = amounts(alloc);
        expect(values.length === 5, 'bolsas !== 5');
        for (const v of values) {
            expect(Number.isInteger(v), `no entero en caso ${i}`);
            expect(v >= 0, `negativo en caso ${i}`);
        }
    }
});

// ─── Cierre contractual S-Class ─────────────────────────────────────────────
console.log('─'.repeat(76));
console.log(`ASSERTIONS=${metrics.assertions} FAILURES=${metrics.failures}`);
console.log(`BUDGET_ASSERTIONS=${metrics.assertions}`);
console.log(`BUDGET_ITERATIONS=${metrics.iterations}`);
console.log(`BUDGET_PROPERTY_CASES=${PROPERTY_CASES}`);
console.log(`BUDGET_SEED=${PROPERTY_SEED}`);

if (metrics.failures === 0) {
    console.log('BUDGET_RESULT=PASS');
    console.log('RESULTADO: VERIFICADO · reparto exacto al céntimo en las 5 categorías');
    process.exit(0);
} else {
    console.log('BUDGET_RESULT=FAIL');
    console.error('RESULTADO: FACHADA · el motor no cumple la ley §5 del MASTER AUDIT');
    process.exit(1);
}
