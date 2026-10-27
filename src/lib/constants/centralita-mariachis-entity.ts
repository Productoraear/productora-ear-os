/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENTIDAD CANÓNICA VERIFICADA — CENTRALITA DE MARIACHIS (ESPAÑA · EUROPA)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina del Dato Verificado (AGENTS.md §4bis y §8 — CERO FACHADAS).
 *
 * Diferencia crítica frente a una ficha de proveedor tercero:
 *  - Aquí la entidad es el OPERADOR del servicio (Productora EAR, cuyo CEO es
 *    Edwin Agudelo). La centralita +34 693 693 048 es la línea oficial del
 *    operador, publicada y atendida por su titular. No es un teléfono de relleno
 *    ni un huérfano enrutado a un tercero.
 *  - Un proveedor de la RED (tercero) JAMÁS se marca `verified:true` con la
 *    centralita: exige teléfono propio verificable y distinto. Ese invariante lo
 *    aplica `isNetworkProviderVerified()` y lo audita el guardián del clúster.
 *
 * Reglas aplicadas:
 *  - Cero invención: no se publica dirección postal exacta ni coordenadas
 *    porque el operador no las expone como sede de atención al público.
 *  - Los importes nacen del SSOT (`ear-os-ssot.ts`): tarifa base 350,00 €,
 *    depósito 100,00 €, logística 1,50 €/km desde el km 50 y hotel 120,00 €.
 *  - `verified:true` con regla explícita `platform-operator-line` + titularidad
 *    de la línea declarada (`lineOwner`), no un booleano suelto.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    CENTRALITA_EAR_OS,
    DEPOSITO_STRIPE_EUR,
    TARIFA_BASE_SOLISTA_EUR,
} from './ear-os-ssot';

/** Evidencia de origen que respalda cada campo de la ficha. */
export interface CentralitaEvidence {
    readonly source: string;
    readonly dataset: string;
    /** SHA-256 del documento de origen; `null` si el dataset no lo publica. */
    readonly provenanceSha256: string | null;
    readonly retrievedAt: string;
    readonly fields: readonly string[];
}

/** Mercado de cobertura declarado por el operador. */
export interface CentralitaCoverage {
    readonly spain: boolean;
    readonly europe: boolean;
    /** Códigos ISO-3166 alfa-2 con demanda mariachi atendida. */
    readonly countryCodes: readonly string[];
}

/** Ficha canónica e inmutable del operador. */
export const CENTRALITA_MARIACHIS_ENTITY = Object.freeze({
    /** Identificador estable usado por checkout y telemetría. */
    id: 'centralita-mariachis',
    slug: 'centralita-mariachis',
    brand: 'Centralita de Mariachis',
    /** Nombre comercial largo (title/OG). */
    commercialName: 'Centralita de Mariachis · Productora EAR',
    tagline: 'Contratación directa de mariachi en España y Europa',
    /** Operador humano responsable de la línea. */
    operator: 'Edwin Agudelo',
    operatorRole: 'CEO de Productora EAR y artista residente',
    legalName: 'Productora EAR',
    /** Línea oficial del operador (único teléfono válido para leads). */
    officialLine: CENTRALITA_EAR_OS,
    officialLineRaw: '+34693693048',
    email: 'productoraear@gmail.com',
    website: 'https://www.productoraear.com',
    canonicalBase: 'https://www.productoraear.com',
    /** Base logística declarada (no se publica calle: no consta en origen). */
    baseMunicipality: 'Méntrida',
    baseProvince: 'Toledo',
    baseCountry: 'España',
    baseFullLabel: 'Méntrida (Toledo), España',
    /** No hay sede de atención al público publicada → `null` (cero invención). */
    geo: null,
    streetAddress: null,
    postalCode: null,
    coverage: Object.freeze({
        spain: true,
        europe: true,
        countryCodes: Object.freeze([
            'ES', 'PT', 'FR', 'DE', 'IT', 'NL', 'BE', 'CH', 'GB', 'AT',
            'CZ', 'DK', 'SE',
        ]),
    } as const satisfies CentralitaCoverage),
    /** Artista residente: la única ficha individual con tarifa SSOT. */
    residentArtist: Object.freeze({
        name: 'Edwin Agudelo',
        role: 'Tenor solista y director de formación',
        baseFeeEur: TARIFA_BASE_SOLISTA_EUR,
        profilePath: '/artistas/edwin-agudelo',
    }),
    depositEur: DEPOSITO_STRIPE_EUR,
    /**
     * Doctrina de red: ningún proveedor tercero se publica como verificado sin
     * teléfono propio distinto de la centralita.
     */
    networkPolicy:
        'Un proveedor de red solo se publica con teléfono propio verificable y distinto de la centralita; la centralita nunca se usa como teléfono de un tercero.',
    /** Estado de verificación del operador. */
    verified: true,
    verificationRule: 'platform-operator-line' as const,
    lineOwner: 'Edwin Agudelo (CEO de Productora EAR)',
    evidence: Object.freeze([
        {
            source: 'src/lib/constants/ear-os-ssot.ts',
            dataset: 'ssot',
            provenanceSha256: null,
            retrievedAt: '2026-10-26T09:00:00.000Z',
            fields: Object.freeze([
                'officialLine',
                'depositEur',
                'residentArtist.baseFeeEur',
            ]),
        },
        {
            source: 'https://www.productoraear.com/artistas/edwin-agudelo',
            dataset: 'own-domain',
            provenanceSha256: null,
            retrievedAt: '2026-10-26T09:00:00.000Z',
            fields: Object.freeze([
                'operator',
                'residentArtist',
                'brand',
                'email',
                'website',
            ]),
        },
    ] as const satisfies readonly CentralitaEvidence[]),
});

/** Tipo derivado para consumo estricto (cero `any`). */
export type CentralitaMariachisEntity = typeof CENTRALITA_MARIACHIS_ENTITY;

/** Dígitos normalizados de un teléfono. */
function digits(phone: string): string {
    return phone.replace(/\D/g, '');
}

/**
 * Predicado de la línea del operador: es válida SOLO si coincide con la línea
 * oficial publicada y existe un titular identificado de esa línea.
 */
export function isOperatorLineVerifiable(phone: string): boolean {
    return (
        digits(phone) === digits(CENTRALITA_MARIACHIS_ENTITY.officialLineRaw) &&
        CENTRALITA_MARIACHIS_ENTITY.verified === true &&
        CENTRALITA_MARIACHIS_ENTITY.lineOwner.trim().length > 0
    );
}

/**
 * Predicado de proveedor de RED (tercero): exige teléfono real de al menos
 * nueve dígitos y distinto de la centralita. Es la regla anti-huérfanos.
 */
export function isNetworkProviderVerified(phone: string): boolean {
    const provider = digits(phone);
    return (
        provider.length >= 9 &&
        provider !== digits(CENTRALITA_MARIACHIS_ENTITY.officialLine)
    );
}

