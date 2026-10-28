/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR · CONTRATO DE ACUSE DEL PUENTE OUTREACH (HARVEY → EAR OS)
 * ════════════════════════════════════════════════════════════════════════════
 * Uso:  npm run verify:outreach:ack
 *
 * Qué demuestra (sin base de datos y sin red):
 *  1. Cada familia de fallo de Prisma se traduce a un código accionable y
 *     distinguible, no a un `skipped` mudo con el mensaje crudo.
 *  2. Un acuse 2xx SOLO se emite si algo se persistió de verdad: el puente nunca
 *     recibe `ok:true` por un lote descartado entero (lead huérfano).
 *  3. Un lote parcial devuelve 207 y un lote sin ninguna escritura devuelve 503
 *     reintentable, porque la escritura es idempotente por `externalId`/`email`.
 *
 * Exit Codes: 0 = contrato cumplido · 1 = contrato roto · 70 = bug del auditor.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    classifyFailure,
    decideIntakeAck,
    type FailureCode,
} from '../src/lib/outreach/intake-diagnostics';

class AuditFailure extends Error {}

function expect(condition: boolean, reason: string): void {
    if (!condition) {
        throw new AuditFailure(reason);
    }
}

interface Check {
    readonly name: string;
    readonly ok: boolean;
    readonly detail: string;
}

const checks: Check[] = [];

function t(name: string, run: () => void): void {
    try {
        run();
        checks.push({ name, ok: true, detail: 'PASS' });
    } catch (error: unknown) {
        checks.push({
            name,
            ok: false,
            detail: error instanceof Error ? error.message : String(error),
        });
    }
}

// ─── Diagnóstico de fallo ─────────────────────────────────────────────────────

t('classifyFailure · P2021 => SCHEMA_MISSING', () => {
    const d = classifyFailure(Object.assign(new Error('boom'), { code: 'P2021' }));
    expect(d.code === 'SCHEMA_MISSING', `obtuve ${d.code}`);
    expect(d.reason.includes('migrate deploy'), 'el mensaje debe nombrar la acción que lo arregla');
});

t('classifyFailure · P2022 => SCHEMA_MISSING', () => {
    const d = classifyFailure(Object.assign(new Error('boom'), { code: 'P2022' }));
    expect(d.code === 'SCHEMA_MISSING', `obtuve ${d.code}`);
});

t('classifyFailure · 42P01 por mensaje => SCHEMA_MISSING', () => {
    const d = classifyFailure(new Error('ERROR: relation "OutreachProspect" does not exist'));
    expect(d.code === 'SCHEMA_MISSING', `obtuve ${d.code}`);
});

t('classifyFailure · P1001 => DB_UNREACHABLE', () => {
    const d = classifyFailure(Object.assign(new Error('boom'), { code: 'P1001' }));
    expect(d.code === 'DB_UNREACHABLE', `obtuve ${d.code}`);
});

t('classifyFailure · P2002 => UNIQUE_CONFLICT', () => {
    const d = classifyFailure(Object.assign(new Error('boom'), { code: 'P2002' }));
    expect(d.code === 'UNIQUE_CONFLICT', `obtuve ${d.code}`);
});

t('classifyFailure · genérico acotado a 300 caracteres', () => {
    const d = classifyFailure(new Error('x'.repeat(900)));
    expect(d.code === 'WRITE_FAILED', `obtuve ${d.code}`);
    expect(d.reason.length <= 300, `longitud ${d.reason.length}`);
});

t('classifyFailure · throw no-Error no rompe el clasificador', () => {
    const d = classifyFailure('fallo de red');
    expect(d.code === 'WRITE_FAILED', `obtuve ${d.code}`);
    expect(d.reason === 'fallo de red', `mensaje ${d.reason}`);
});

// ─── Contrato de acuse ───────────────────────────────────────────────────────

t('decideIntakeAck · todo persistido => 200 sin reintento', () => {
    const ack = decideIntakeAck({ received: 3, created: 2, updated: 1, skipped: [] });
    expect(ack.status === 200 && ack.ok && !ack.retryable, JSON.stringify(ack));
    expect(ack.persisted === 3, `persisted ${ack.persisted}`);
    expect(ack.code === null, `code ${String(ack.code)}`);
});

t('decideIntakeAck · 0 persistidos por esquema => 503 SCHEMA_MISSING', () => {
    const ack = decideIntakeAck({
        received: 2,
        created: 0,
        updated: 0,
        skipped: ['SCHEMA_MISSING', 'SCHEMA_MISSING'],
    });
    expect(ack.status === 503 && !ack.ok && ack.retryable, JSON.stringify(ack));
    expect(ack.code === 'SCHEMA_MISSING', `code ${String(ack.code)}`);
});

t('decideIntakeAck · 0 persistidos por datos => 503 ALL_SKIPPED', () => {
    const ack = decideIntakeAck({
        received: 2,
        created: 0,
        updated: 0,
        skipped: ['UNIQUE_CONFLICT', 'WRITE_FAILED'],
    });
    expect(ack.status === 503 && ack.code === 'ALL_SKIPPED', JSON.stringify(ack));
});

t('decideIntakeAck · parcial => 207 reintentable', () => {
    const ack = decideIntakeAck({
        received: 3,
        created: 1,
        updated: 0,
        skipped: ['DB_UNREACHABLE', 'WRITE_FAILED'],
    });
    expect(ack.status === 207 && !ack.ok && ack.retryable, JSON.stringify(ack));
    expect(ack.persisted === 1, `persisted ${ack.persisted}`);
    expect(ack.code === 'DB_UNREACHABLE', `code ${String(ack.code)}`);
});

t('INVARIANTE · ningún acuse 2xx sin escritura persistida', () => {
    const matrix: readonly (readonly FailureCode[])[] = [
        [],
        ['SCHEMA_MISSING'],
        ['DB_UNREACHABLE'],
        ['UNIQUE_CONFLICT'],
        ['WRITE_FAILED'],
        ['SCHEMA_MISSING', 'WRITE_FAILED'],
    ];
    for (const skipped of matrix) {
        for (let created = 0; created <= 2; created += 1) {
            for (let updated = 0; updated <= 2; updated += 1) {
                const ack = decideIntakeAck({
                    received: Math.max(skipped.length, created + updated),
                    created,
                    updated,
                    skipped,
                });
                const persisted = created + updated;
                if (persisted === 0) {
                    expect(ack.status === 503, `status ${ack.status} con 0 persistidos`);
                    expect(!ack.ok, 'ok:true sin persistencia');
                } else if (skipped.length === 0) {
                    expect(ack.status === 200 && ack.ok, `status ${ack.status} con todo persistido`);
                } else {
                    expect(ack.status === 207 && !ack.ok, `status ${ack.status} en lote parcial`);
                }
            }
        }
    }
});

// ─── Informe ─────────────────────────────────────────────────────────────────

const failed = checks.filter((check) => !check.ok);

process.stdout.write(
    `${JSON.stringify(
        {
            status: failed.length === 0 ? 'ACK_CONTRACT_OK' : 'ACK_CONTRACT_BROKEN',
            checks: checks.length,
            passed: checks.length - failed.length,
            failed: failed.length,
            failures: failed,
        },
        null,
        2,
    )}\n`,
);

process.exitCode = failed.length === 0 ? 0 : 1;

