/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIAGNÓSTICO Y CONTRATO DE ACUSE · PUENTE HARVEY → EAR OS
 * ════════════════════════════════════════════════════════════════════════════
 * Capa PURA (sin IO, sin Prisma, sin Next): la usa la ruta
 * `src/app/api/outreach/intake/route.ts` y la audita
 * `scripts/verify_outreach_intake_ack.ts`.
 *
 * Por qué existe:
 *  1. Un `skipped` con el mensaje crudo de Prisma no dice al operador si debe
 *     arreglar su JSON o nuestra infraestructura. El código es estable y
 *     distinguible; el mensaje, no.
 *  2. Un 200 con todo en `skipped` es un acuse de recibo FALSO: el puente da el
 *     lead por sincronizado y no lo reintenta nunca. El 2xx queda reservado a lo
 *     que realmente se persistió; el resto es 503 (reintentable) o 207 (parcial).
 *
 * Invariante: `decideIntakeAck` nunca devuelve 2xx con `persisted === 0`.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Código estable de fallo de escritura. */
export type FailureCode =
    | 'SCHEMA_MISSING'
    | 'DB_UNREACHABLE'
    | 'UNIQUE_CONFLICT'
    | 'WRITE_FAILED';

export interface FailureDiagnosis {
    readonly code: FailureCode;
    readonly reason: string;
}

/** Fallo de infraestructura: el reintento es la acción correcta. */
const INFRA_CODES: readonly FailureCode[] = ['SCHEMA_MISSING', 'DB_UNREACHABLE'];

/** Longitud máxima del mensaje de error ajeno que se devuelve al puente. */
const REASON_MAX_LENGTH = 300;

function prismaCodeOf(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const raw = (error as { code: unknown }).code;
        return typeof raw === 'string' ? raw : '';
    }
    return '';
}

/**
 * Traduce cualquier fallo de escritura a un código accionable.
 *
 * `P2021`/`P2022` (tabla/columna inexistente) es el síntoma exacto de un
 * `prisma migrate deploy` pendiente, no un error de datos del cliente: merece un
 * mensaje propio para que nadie persiga un fantasma en el payload de Harvey.
 */
export function classifyFailure(error: unknown): FailureDiagnosis {
    const message = error instanceof Error ? error.message : String(error);
    const prismaCode = prismaCodeOf(error);

    if (
        prismaCode === 'P2021' ||
        prismaCode === 'P2022' ||
        /relation ["'].*["'] does not exist/i.test(message) ||
        /\b42P01\b/.test(message)
    ) {
        return {
            code: 'SCHEMA_MISSING',
            reason: 'Tabla de outreach inexistente en la base de datos: falta aplicar la migración (prisma migrate deploy).',
        };
    }

    if (
        prismaCode === 'P1001' ||
        prismaCode === 'P1002' ||
        prismaCode === 'P1017' ||
        /can'?t reach database server/i.test(message)
    ) {
        return {
            code: 'DB_UNREACHABLE',
            reason: 'Base de datos inalcanzable desde el runtime: reintentar cuando el servicio vuelva.',
        };
    }

    if (prismaCode === 'P2002') {
        return {
            code: 'UNIQUE_CONFLICT',
            reason: 'Conflicto de unicidad: el externalId o el email ya pertenecen a otra fila.',
        };
    }

    return { code: 'WRITE_FAILED', reason: message.slice(0, REASON_MAX_LENGTH) };
}

export interface IntakeCounters {
    readonly received: number;
    readonly created: number;
    readonly updated: number;
    readonly skipped: readonly FailureCode[];
}

export interface AckDecision {
    /** 200 = todo persistido · 207 = parcial · 503 = nada persistido. */
    readonly status: 200 | 207 | 503;
    readonly ok: boolean;
    readonly persisted: number;
    readonly retryable: boolean;
    /**
     * Causa dominante cuando no es 200. `ALL_SKIPPED` = fallo de datos (no de
     * infraestructura): reintentar el mismo payload no lo arregla.
     */
    readonly code: FailureCode | 'ALL_SKIPPED' | null;
}

/**
 * Decide el acuse. El reintento es seguro porque la escritura es idempotente por
 * `externalId`/`email`: un 207 o un 503 se pueden repetir sin duplicar filas.
 */
export function decideIntakeAck(counters: IntakeCounters): AckDecision {
    const persisted = counters.created + counters.updated;
    const skipped = counters.skipped.length;

    if (persisted > 0 && skipped === 0) {
        return { status: 200, ok: true, persisted, retryable: false, code: null };
    }

    const dominantInfra = counters.skipped.find((code) => INFRA_CODES.includes(code)) ?? null;

    if (persisted === 0) {
        return {
            status: 503,
            ok: false,
            persisted: 0,
            retryable: true,
            code: dominantInfra ?? 'ALL_SKIPPED',
        };
    }

    return {
        status: 207,
        ok: false,
        persisted,
        retryable: true,
        code: dominantInfra,
    };
}
