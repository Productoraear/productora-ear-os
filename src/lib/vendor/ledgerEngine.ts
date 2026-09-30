/**
 * ⚡ SHA-256 LEDGER ENGINE — EAR OS S-CLASS (SSOT)
 * Reto 1 · Ledger inmutable encadenado por hash para el Vendor Dashboard.
 *
 * Cada asiento sella el hash SHA-256 del bloque anterior, provocando que
 * cualquier manipulación rompa la cadena de forma detectable. Tipado estricto,
 * cero "any", cero dependencias externas (solo `node:crypto`).
 *
 * Leyes inmutables heredadas de PHASE_1..4_SSOT (Aprobado por CEO — Octubre 2026):
 *   - Depósito Stripe inmutable: 100,00 € (Price-Lock).
 *   - Comisión EAR OS: 20% de la transacción.
 *   - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
 */

import { createHash, randomUUID } from 'crypto';

/** Divisas soportadas por el ledger (misma superficie que el Vendor Engine). */
export type LedgerCurrency = 'EUR' | 'USD' | 'GBP';

/** Naturaleza del asiento contable dentro del Vendor Dashboard. */
export type LedgerEntryKind =
    | 'RESERVA'
    | 'DEPOSITO'
    | 'PAYOUT'
    | 'COMISION'
    | 'REEMBOLSO';

/** SSOT financiero inmutable del ledger. */
export const LEDGER_SSOT = {
    DEPOSIT_STRIPE_EUR: 100,
    EAR_COMMISSION_PCT: 0.2,
    SPLIT_ARTIST_PCT: 0.8,
    SPLIT_EAR_PCT: 0.1,
    SPLIT_VIMUME_PCT: 0.1
} as const;

/** Asiento canónico antes de ser sellado en un bloque. */
export interface LedgerEntry {
    kind: LedgerEntryKind;
    providerId: string;
    /** Importe en la divisa elegida (se normaliza a EUR en el caso del motor de presupuestos). */
    amount: number;
    currency: LedgerCurrency;
    /** Motivo o referencia legible del asiento. */
    memo: string;
    /** Datos canónicos serializados que participan en el hash (sin secretos). */
    payload: string;
}

/** Bloque sellado e inmutable de la cadena. */
export interface LedgerBlock extends LedgerEntry {
    index: number;
    id: string;
    previousHash: string;
    hash: string;
    createdAt: string;
}

/** Informe de integridad emitido por `verify()`. */
export interface LedgerIntegrityReport {
    valid: boolean;
    blockCount: number;
    brokenAtIndex: number | null;
    tamperedIndexes: number[];
    headHash: string;
}

/** Estado de diagnóstico emitido por `runLedgerDiagnostics()`. */
export interface LedgerDiagnosticsResult {
    status: 'SUCCESS' | 'FAILED';
    testsPassed: number;
    testsTotal: number;
    checks: Array<{ name: string; ok: boolean; detail: string }>;
}

const HASH_ALGORITHM = 'sha256';

function sha256(value: string): string {
    return createHash(HASH_ALGORITHM).update(value, 'utf8').digest('hex');
}

/**
 * Motor de ledger inmutable encadenado por SHA-256.
 *
 * Uso:
 *   const ledger = new Sha256LedgerEngine();
 *   ledger.append({ kind:'DEPOSITO', providerId:'...', amount:100, ... });
 *   const report = ledger.verify(); // => { valid: true, ... }
 */
export class Sha256LedgerEngine {
    private blocks: LedgerBlock[] = [];

    /** Génesis determinista de la cadena. */
    private static readonly GENESIS_HASH = '0'.repeat(64);

    private static hashBlock(
        index: number,
        id: string,
        previousHash: string,
        entry: LedgerEntry,
        createdAt: string
    ): string {
        return sha256(
            [
                index,
                id,
                previousHash,
                entry.kind,
                entry.providerId,
                entry.amount,
                entry.currency,
                entry.memo,
                entry.payload,
                createdAt
            ].join('|')
        );
    }

    /** Sella y añade un nuevo bloque a la cadena. Devuelve el bloque creado. */
    append(entry: LedgerEntry): LedgerBlock {
        const index = this.blocks.length;
        const previousHash =
            this.blocks.length === 0
                ? Sha256LedgerEngine.GENESIS_HASH
                : this.blocks[this.blocks.length - 1].hash;
        const createdAt = new Date().toISOString();
        const id = `BLK-${randomUUID()}`;
        const hash = Sha256LedgerEngine.hashBlock(index, id, previousHash, entry, createdAt);

        const block: LedgerBlock = {
            ...entry,
            index,
            id,
            previousHash,
            hash,
            createdAt
        };

        this.blocks.push(block);
        return block;
    }

    /** Verifica la integridad completa de la cadena contra manipulación. */
    verify(): LedgerIntegrityReport {
        let brokenAtIndex: number | null = null;
        const tamperedIndexes: number[] = [];

        for (let i = 0; i < this.blocks.length; i += 1) {
            const block = this.blocks[i];
            const expectedPrevious =
                i === 0 ? Sha256LedgerEngine.GENESIS_HASH : this.blocks[i - 1].hash;
            const recomputed = Sha256LedgerEngine.hashBlock(
                block.index,
                block.id,
                block.previousHash,
                {
                    kind: block.kind,
                    providerId: block.providerId,
                    amount: block.amount,
                    currency: block.currency,
                    memo: block.memo,
                    payload: block.payload
                },
                block.createdAt
            );

            const prevBroken = block.previousHash !== expectedPrevious;
            const hashBroken = block.hash !== recomputed;

            if (prevBroken || hashBroken) {
                tamperedIndexes.push(i);
                if (brokenAtIndex === null) brokenAtIndex = i;
            }
        }

        return {
            valid: tamperedIndexes.length === 0,
            blockCount: this.blocks.length,
            brokenAtIndex,
            tamperedIndexes,
            headHash:
                this.blocks.length > 0
                    ? this.blocks[this.blocks.length - 1].hash
                    : Sha256LedgerEngine.GENESIS_HASH
        };
    }

    /** Devuelve una copia defensiva de los bloques sellados. */
    toArray(): readonly LedgerBlock[] {
        return this.blocks.map((block) => ({ ...block }));
    }

    /** Devuelve el último bloque sellado o `null` si la cadena está vacía. */
    getHead(): LedgerBlock | null {
        return this.blocks.length > 0 ? { ...this.blocks[this.blocks.length - 1] } : null;
    }
}

/** Diagnóstico de contrato del ledger (5 assertions). */
export function runLedgerDiagnostics(): LedgerDiagnosticsResult {
    const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

    // Test 1: Cadena vacía es íntegra.
    const empty = new Sha256LedgerEngine();
    const emptyReport = empty.verify();
    checks.push({
        name: 'Cadena vacía íntegra',
        ok: emptyReport.valid && emptyReport.blockCount === 0,
        detail: JSON.stringify(emptyReport)
    });

    // Test 2: Append produce hash de 64 caracteres hex.
    const ledger = new Sha256LedgerEngine();
    const first = ledger.append({
        kind: 'DEPOSITO',
        providerId: 'prov_solista_edwin',
        amount: LEDGER_SSOT.DEPOSIT_STRIPE_EUR,
        currency: 'EUR',
        memo: 'Depósito Price-Lock Stripe inmutable',
        payload: 'edwin-agudelo|solista|350.00'
    });
    const isHex64 = /^[0-9a-f]{64}$/.test(first.hash);
    checks.push({
        name: 'Bloque sellado con SHA-256 (64 hex)',
        ok: isHex64 && first.previousHash === '0'.repeat(64),
        detail: `${first.hash.substring(0, 16)}...`
    });

    // Test 3: Encadenamiento correcto entre bloques.
    ledger.append({
        kind: 'COMISION',
        providerId: 'prov_solista_edwin',
        amount: first.amount * LEDGER_SSOT.EAR_COMMISSION_PCT,
        currency: 'EUR',
        memo: 'Comisión EAR OS 20%',
        payload: 'ear-os|comision|0.2'
    });
    const chainReport = ledger.verify();
    checks.push({
        name: 'Encadenamiento SHA-256 íntegro',
        ok: chainReport.valid && chainReport.blockCount === 2,
        detail: JSON.stringify(chainReport)
    });

    // Test 4: Detección de manipulación.
    const tampered = new Sha256LedgerEngine();
    const original = tampered.append({
        kind: 'RESERVA',
        providerId: 'prov_finca_merida',
        amount: 2500,
        currency: 'EUR',
        memo: 'Reserva de boda íntegra',
        payload: 'finca|boda|2500.00'
    });
    // Simula alteración post-sellado del asiento.
    const corruptedBlock: LedgerBlock = { ...original, amount: 1 };
    (tampered as unknown as { blocks: LedgerBlock[] }).blocks[0] = corruptedBlock;
    const tamperReport = tampered.verify();
    checks.push({
        name: 'Detección de manipulación',
        ok: !tamperReport.valid && tamperReport.tamperedIndexes.length === 1,
        detail: JSON.stringify(tamperReport)
    });

    // Test 5: Split Soberano inmutable 80/10/10.
    const totalSplit =
        LEDGER_SSOT.SPLIT_ARTIST_PCT +
        LEDGER_SSOT.SPLIT_EAR_PCT +
        LEDGER_SSOT.SPLIT_VIMUME_PCT;
    checks.push({
        name: 'Split Soberano 80/10/10',
        ok: totalSplit === 1,
        detail: `${LEDGER_SSOT.SPLIT_ARTIST_PCT}/${LEDGER_SSOT.SPLIT_EAR_PCT}/${LEDGER_SSOT.SPLIT_VIMUME_PCT}`
    });

    const testsPassed = checks.filter((c) => c.ok).length;
    return {
        status: testsPassed === checks.length ? 'SUCCESS' : 'FAILED',
        testsPassed,
        testsTotal: checks.length,
        checks
    };
}