/**
 * ════════════════════════════════════════════════════════════════════════════
 * SENTINEL DE INTEGRIDAD EN RUNTIME (SSOT INTEGRITY GUARD)
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica en runtime que el bloque SSOT (`ear-os-ssot.ts`) no haya sufrido
 * manipulación no autorizada, comparando el hash SHA-256 de su serialización
 * canónica contra un hash de referencia.
 *
 * Estrategia de defensa en profundidad:
 *   - Serialización canónica determinística (claves ordenadas, números con
 *     notación fija) para que el hash sea reproducible entre builds.
 *   - Hash de referencia doblemente alimentado: una constante "known-good"
 *     (calculada en tiempo de desarrollo) y/o la variable de entorno
 *     `SSOT_INTEGRITY_HASH` (permite rotación segura sin redeploy de código).
 *   - Verificación de invariantes relacionales (Split 80/10/10 suma 1, ajuste
 *     preventivo B2G = 95% del techo legal) como red adicional.
 *
 * Cero `any` implícitos y sin dependencias externas (solo `node:crypto`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'crypto';
import {
    EAR_OS_SSOT,
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    LIMITE_B2G_LCSP_EUR,
    SAFE_LCSP_CEILING_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    LOGISTICA_KM_HOTEL,
    SUPLEMENTO_HOTEL_EUR,
    HORA_FIN_HOTEL,
    LIMITE_SPL_DB,
    WATTS_PER_PAX,
    VAT_RATE,
    SPLIT_SOBERANO,
    CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export interface SsotIntegrityReport {
    intact: boolean;
    computedHash: string;
    referenceHash: string;
    invariantsOk: boolean;
    violatedInvariants: string[];
}

interface CanonicalNumber {
    value: number;
}

interface CanonicalString {
    value: string;
}

/**
 * Serialización canónica y determinística del bloque SSOT.
 * Se ordenan las claves y se normalizan los números a 2 decimales fijos.
 */
function canonicalizeSsot(): Record<string, CanonicalNumber | CanonicalString | Record<string, number>> {
    const ordered: Record<string, CanonicalNumber | CanonicalString | Record<string, number>> = {
        TARIFA_BASE_SOLISTA_EUR: { value: TARIFA_BASE_SOLISTA_EUR },
        LOGISTICA_EUR_PER_KM: { value: LOGISTICA_EUR_PER_KM },
        LOGISTICA_KM_EXENTOS: { value: LOGISTICA_KM_EXENTOS },
        LOGISTICA_KM_HOTEL: { value: LOGISTICA_KM_HOTEL },
        SUPLEMENTO_HOTEL_EUR: { value: SUPLEMENTO_HOTEL_EUR },
        HORA_FIN_HOTEL: { value: HORA_FIN_HOTEL },
        DEPOSITO_STRIPE_EUR: { value: DEPOSITO_STRIPE_EUR },
        LIMITE_B2G_LCSP_EUR: { value: LIMITE_B2G_LCSP_EUR },
        SAFE_LCSP_CEILING_EUR: { value: SAFE_LCSP_CEILING_EUR },
        LIMITE_SPL_DB: { value: LIMITE_SPL_DB },
        WATTS_PER_PAX: { value: WATTS_PER_PAX },
        VAT_RATE: { value: VAT_RATE },
        CENTRALITA_EAR_OS: { value: CENTRALITA_EAR_OS },
        SPLIT_SOBERANO: {
            artista: SPLIT_SOBERANO.artista,
            earOs: SPLIT_SOBERANO.earOs,
            vimume: SPLIT_SOBERANO.vimume,
        },
    };

    return ordered;
}

function stringifyCanonical(input: Record<string, CanonicalNumber | CanonicalString | Record<string, number>>): string {
    const entries = Object.entries(input).map(([key, value]) => {
        if ('value' in value) {
            const numeric = typeof value.value === 'number' ? value.value.toFixed(2) : value.value;
            return `${key}:${numeric}`;
        }

        const split = (value as Record<string, number>);
        const sortedSplit = Object.keys(split)
            .sort()
            .map((k) => `${k}:${split[k].toFixed(4)}`)
            .join(',');
        return `${key}:{${sortedSplit}}`;
    });

    return entries.sort().join('|');
}

/**
 * Calcula el hash SHA-256 canónico del SSOT en runtime.
 */
export function computeSsotHash(): string {
    const canonical = stringifyCanonical(canonicalizeSsot());
    return createHash('sha256').update(canonical).digest('hex');
}

/**
 * Invariantes de negocio que deben cumplirse SIEMPRE. Su violación indica
 * manipulación o regresión del motor financiero.
 */
export function validateSsotInvariants(): string[] {
    const violations: string[] = [];

    const splitSum = SPLIT_SOBERANO.artista + SPLIT_SOBERANO.earOs + SPLIT_SOBERANO.vimume;
    const splitTolerance = 0.0001;
    if (Math.abs(splitSum - 1) > splitTolerance) {
        violations.push('SPLIT_SOBERANO no suma 100% (80/10/10).');
    }

    const expectedSafeCeiling = LIMITE_B2G_LCSP_EUR * 0.95;
    if (Math.abs(SAFE_LCSP_CEILING_EUR - expectedSafeCeiling) > 0.01) {
        violations.push('SAFE_LCSP_CEILING no es el 95% de LIMITE_B2G_LCSP_EUR.');
    }

    if (DEPOSITO_STRIPE_EUR !== 100) {
        violations.push('DEPOSITO_STRIPE_EUR ha sido alterado (debe ser 100,00 €).');
    }

    if (TARIFA_BASE_SOLISTA_EUR !== 350) {
        violations.push('TARIFA_BASE_SOLISTA_EUR ha sido alterado (debe ser 350,00 €).');
    }

    if (LIMITE_SPL_DB !== 75 || WATTS_PER_PAX !== 12) {
        violations.push('Rider acústico alterado (75 dB SPL / 12 W-pax).');
    }

    if (LOGISTICA_EUR_PER_KM !== 1.5 || LOGISTICA_KM_EXENTOS !== 50) {
        violations.push('Logística S-Class alterada (1,50 €/km a partir del km 50).');
    }

    if (SUPLEMENTO_HOTEL_EUR !== 120 || LOGISTICA_KM_HOTEL !== 200 || HORA_FIN_HOTEL !== 3) {
        violations.push('Suplemento hotelero alterado (120 € / >200 km / fin >= 3:00 AM).');
    }

    if (VAT_RATE !== 0.21) {
        violations.push('VAT_RATE alterado (debe ser 21%).');
    }

    return violations;
}

/**
 * Verifica la integridad del SSOT en runtime.
 *
 * El hash de referencia se resuelve por prioridad:
 *   1. Variable de entorno `SSOT_INTEGRITY_HASH` (rotación operativa).
 *   2. Constante `KNOWN_GOOD_SSOT_HASH` (sellada en build).
 *
 * Si ninguna referencia está disponible, el reporte marca `intact: false` con
 * instrucción de baselining, evitando falsos positivos de integridad.
 */
export function verifySsotIntegrity(): SsotIntegrityReport {
    const computedHash = computeSsotHash();
    const envHash = process.env.SSOT_INTEGRITY_HASH?.trim() || null;
    const referenceHash = envHash || KNOWN_GOOD_SSOT_HASH;

    const violations = validateSsotInvariants();
    const invariantsOk = violations.length === 0;
    const hashOk = referenceHash.length > 0 && computedHash === referenceHash;

    return {
        intact: hashOk && invariantsOk,
        computedHash,
        referenceHash,
        invariantsOk,
        violatedInvariants: violations,
    };
}

export const KNOWN_GOOD_SSOT_HASH = 'ebc011a07ea56e1f196d4b890ad1228142bc74ba0e56dae8e38d29cf55bb29dd';

export { EAR_OS_SSOT };