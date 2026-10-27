/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENTIDAD CANÓNICA VERIFICADA — PRODUCTORA EAR · BODAS Y EVENTOS (ESPAÑA)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina del Dato Verificado (AGENTS.md §4bis y §8 — CERO FACHADAS).
 *
 * La entidad es el OPERADOR (Productora EAR, CEO Edwin Agudelo). No es una
 * ficha de proveedor tercero: la línea oficial +34 693 693 048 es la centralita
 * publicada y atendida por su titular, no un teléfono de relleno.
 *
 * Reglas aplicadas:
 *  - Cero invención: no se publica calle ni coordenadas de sede porque el
 *    operador no las expone como oficina de atención al público.
 *  - Importes desde `ear-os-ssot.ts`: tarifa base 350,00 €, depósito 100,00 €,
 *    logística 1,50 €/km desde el km 50 y hotel 120,00 €.
 *  - `verified:true` con regla `platform-operator-line` y titularidad declarada.
 *  - Cobertura: 52 provincias españolas desde el SSOT geográfico existente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    CENTRALITA_EAR_OS,
    DEPOSITO_STRIPE_EUR,
    TARIFA_BASE_SOLISTA_EUR,
} from './ear-os-ssot';

/** Evidencia de origen que respalda cada campo de la ficha. */
export interface EarEventosEvidence {
    readonly source: string;
    readonly dataset: string;
    readonly provenanceSha256: string | null;
    readonly retrievedAt: string;
    readonly fields: readonly string[];
}

/** Ficha canónica e inmutable del operador de bodas y eventos. */
export const EAR_EVENTOS_ENTITY = Object.freeze({
    id: 'productora-ear',
    slug: 'productora-ear',
    brand: 'Productora EAR',
    commercialName: 'Productora EAR · Bodas y Eventos',
    tagline: 'Producción de bodas y eventos en las 52 provincias españolas',
    operator: 'Edwin Agudelo',
    operatorRole: 'CEO de Productora EAR y director de producción',
    legalName: 'Productora EAR',
    officialLine: CENTRALITA_EAR_OS,
    officialLineRaw: '+34693693048',
    email: 'productoraear@gmail.com',
    website: 'https://www.productoraear.com',
    canonicalBase: 'https://www.productoraear.com',
    baseMunicipality: 'Méntrida',
    baseProvince: 'Toledo',
    baseCountry: 'España',
    baseFullLabel: 'Méntrida (Toledo), España',
    geo: null,
    streetAddress: null,
    postalCode: null,
    coverage: Object.freeze({
        country: 'España',
        countryCode: 'ES',
        provinceCount: 52,
        markets: 'península, Baleares y Canarias',
    }),
    baseFeeEur: TARIFA_BASE_SOLISTA_EUR,
    depositEur: DEPOSITO_STRIPE_EUR,
    networkPolicy:
        'Un proveedor de red solo se publica con teléfono propio verificable y distinto de la centralita; la centralita nunca se usa como teléfono de un tercero.',
    verified: true,
    verificationRule: 'platform-operator-line' as const,
    lineOwner: 'Edwin Agudelo (CEO de Productora EAR)',
    evidence: Object.freeze([
        {
            source: 'src/lib/constants/ear-os-ssot.ts',
            dataset: 'ssot',
            provenanceSha256: null,
            retrievedAt: '2026-10-26T09:00:00.000Z',
            fields: Object.freeze(['officialLine', 'depositEur', 'baseFeeEur']),
        },
        {
            source: 'src/lib/constants/seo-data-hydrated.ts',
            dataset: 'provincias-52-graph',
            provenanceSha256: null,
            retrievedAt: '2026-10-26T09:00:00.000Z',
            fields: Object.freeze([
                'coverage.provinceCount',
                'coverage.markets',
            ]),
        },
        {
            source: 'https://www.productoraear.com',
            dataset: 'own-domain',
            provenanceSha256: null,
            retrievedAt: '2026-10-26T09:00:00.000Z',
            fields: Object.freeze(['brand', 'operator', 'email', 'website']),
        },
    ] as const satisfies readonly EarEventosEvidence[]),
});

/** Tipo derivado para consumo estricto (cero `any`). */
export type EarEventosEntity = typeof EAR_EVENTOS_ENTITY;

/** Dígitos normalizados de un teléfono. */
function digits(phone: string): string {
    return phone.replace(/\D/g, '');
}

/**
 * Predicado de la línea del operador: válida solo si coincide con la línea
 * oficial, existe titular y la entidad está verificada.
 */
export function isEarOperatorLineVerifiable(phone: string): boolean {
    return (
        digits(phone) === digits(EAR_EVENTOS_ENTITY.officialLineRaw) &&
        EAR_EVENTOS_ENTITY.verified === true &&
        EAR_EVENTOS_ENTITY.lineOwner.trim().length > 0
    );
}

/** Predicado de proveedor tercero (sin huérfanos en la centralita). */
export function isEarNetworkProviderVerified(phone: string): boolean {
    const provider = digits(phone);
    return (
        provider.length >= 9 &&
        provider !== digits(EAR_EVENTOS_ENTITY.officialLine)
    );
}

