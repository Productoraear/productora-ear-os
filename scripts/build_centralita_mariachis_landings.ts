/**
 * ════════════════════════════════════════════════════════════════════════════
 * BUILD — CLÚSTER CENTRALITA DE MARIACHIS · ESPAÑA + EUROPA (220 LANDINGS)
 * ════════════════════════════════════════════════════════════════════════════
 * Consume el motor tipado `src/lib/seo/centralita-mariachis-dominance-engine.ts`,
 * valida los invariantes SSOT y emite
 * `public/landings/centralita-mariachis/manifest.json` (determinístico, sin
 * timestamps) para que el guardián anti-duplicación lo audite sin recomponer.
 *
 * Ejecución:  npx tsx scripts/build_centralita_mariachis_landings.ts
 * Salida:     Exit 0 solo si 220 = 160 geo + 60 intención, depósito SSOT,
 *             línea del operador verificada y sellos SHA-256 válidos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
    DEPOSITO_STRIPE_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SPLIT_SOBERANO,
    SUPLEMENTO_HOTEL_EUR,
} from '../src/lib/constants/ear-os-ssot';
import {
    CENTRALITA_MARIACHIS_ENTITY,
    isOperatorLineVerifiable,
} from '../src/lib/constants/centralita-mariachis-entity';
import { MARIACHI_FORMATS } from '../src/lib/mariachi/mariachiDispatchCore';
import {
    MARIACHI_HUB,
    MARIACHI_LANDINGS,
    type MariachiLanding,
} from '../src/lib/seo/centralita-mariachis-dominance-engine';

const HEX_64 = /^[0-9a-f]{64}$/;
const EXPECTED_TOTAL = 220;
const EXPECTED_GEO = 160;
const EXPECTED_INTENT = 60;
const PATH_PREFIX = '/centralita-mariachis/';
const EXPECTED_SCHEMA = 'MusicGroup,Service,Offer,FAQPage,BreadcrumbList';
const FORBIDDEN_TOKENS: readonly string[] = Object.freeze([
    'lorem ipsum',
    'a consultar',
    'pendiente de definir',
    'xxx',
    '<script',
    'javascript:',
]);

interface ManifestEntry {
    readonly slug: string;
    readonly path: string;
    readonly kind: 'geo' | 'intent';
    readonly title: string;
    readonly description: string;
    readonly h1: string;
    readonly keyword: string;
    readonly market: string;
    readonly marketSlug: string;
    readonly country: string;
    readonly vertical: string;
    readonly formatId: string;
    readonly basePriceEur: number;
    readonly depositEur: number;
    readonly stripeSessionId: string;
    readonly priceLockSha256: string;
    readonly provenanceHash: string;
    readonly uniqueCopy: string;
    readonly faqCount: number;
    readonly schemaTypes: readonly string[];
    readonly relatedCount: number;
    readonly phone: string;
    readonly email: string;
}

interface Manifest {
    readonly engine: string;
    readonly version: string;
    readonly landingCount: number;
    readonly geoCount: number;
    readonly intentCount: number;
    readonly marketCount: number;
    readonly countryCount: number;
    readonly depositEur: number;
    readonly splitSoberano: {
        readonly artista: number;
        readonly earOs: number;
        readonly vimume: number;
    };
    readonly logistics: {
        readonly kmFree: number;
        readonly eurPerKm: number;
        readonly hotelEur: number;
        readonly origin: string;
    };
    readonly formats: readonly {
        readonly id: string;
        readonly name: string;
        readonly members: number;
        readonly basePrice: number;
    }[];
    readonly entity: {
        readonly id: string;
        readonly brand: string;
        readonly operator: string;
        readonly phone: string;
        readonly email: string;
        readonly base: string;
        readonly verified: boolean;
        readonly verificationRule: string;
        readonly lineOwner: string;
        readonly networkPolicy: string;
    };
    readonly payload: readonly ManifestEntry[];
}

/** Extrae los `@type` de un grafo JSON-LD. */
function schemaTypes(landing: MariachiLanding): readonly string[] {
    return landing.schemaOrg.map((node) => String(node['@type']));
}

/** Proyecta una landing al manifiesto auditable. */
function toEntry(landing: MariachiLanding): ManifestEntry {
    return {
        slug: landing.slug,
        path: landing.path,
        kind: landing.kind,
        title: landing.title,
        description: landing.description,
        h1: landing.h1,
        keyword: landing.keyword,
        market: landing.marketName,
        marketSlug: landing.marketSlug,
        country: landing.marketCountry,
        vertical: landing.verticalSlug,
        formatId: landing.format.id,
        basePriceEur: landing.format.basePrice,
        depositEur: landing.depositEur,
        stripeSessionId: landing.stripeSessionId,
        priceLockSha256: landing.priceLockSha256,
        provenanceHash: landing.provenanceHash,
        uniqueCopy: landing.uniqueCopy,
        faqCount: landing.faqs.length,
        schemaTypes: schemaTypes(landing),
        relatedCount: landing.related.length,
        phone: landing.phone,
        email: landing.email,
    };
}

/** Validación atómica del manifiesto. */
function validate(payload: readonly ManifestEntry[]): readonly string[] {
    const errors: string[] = [];
    if (payload.length !== EXPECTED_TOTAL) {
        errors.push(`total ${payload.length} ≠ ${EXPECTED_TOTAL}`);
    }
    const geo = payload.filter((entry) => entry.kind === 'geo').length;
    const intent = payload.filter((entry) => entry.kind === 'intent').length;
    if (geo !== EXPECTED_GEO || intent !== EXPECTED_INTENT) {
        errors.push(`reparto ${geo} geo / ${intent} intención`);
    }

    const seenSlug = new Set<string>();
    const seenTitle = new Set<string>();
    const seenH1 = new Set<string>();

    for (const entry of payload) {
        if (seenSlug.has(entry.slug)) {
            errors.push(`${entry.slug}: slug duplicado`);
        }
        seenSlug.add(entry.slug);
        if (seenTitle.has(entry.title)) {
            errors.push(`${entry.slug}: title duplicado`);
        }
        seenTitle.add(entry.title);
        if (seenH1.has(entry.h1)) {
            errors.push(`${entry.slug}: H1 duplicado`);
        }
        seenH1.add(entry.h1);

        if (!entry.path.startsWith(PATH_PREFIX)) {
            errors.push(`${entry.slug}: ruta fuera del clúster`);
        }
        if (entry.depositEur !== DEPOSITO_STRIPE_EUR) {
            errors.push(`${entry.slug}: depósito distinto del SSOT`);
        }
        if (!Number.isFinite(entry.basePriceEur) || entry.basePriceEur <= 0) {
            errors.push(`${entry.slug}: precio base no derivado del SSOT`);
        }
        if (
            !HEX_64.test(entry.stripeSessionId) ||
            !HEX_64.test(entry.priceLockSha256) ||
            !HEX_64.test(entry.provenanceHash)
        ) {
            errors.push(`${entry.slug}: sello SHA-256 inválido`);
        }
        if (entry.schemaTypes.join(',') !== EXPECTED_SCHEMA) {
            errors.push(`${entry.slug}: grafo JSON-LD incompleto`);
        }
        if (entry.faqCount < 6) {
            errors.push(`${entry.slug}: FAQ insuficientes (${entry.faqCount})`);
        }
        if (entry.relatedCount < 3) {
            errors.push(`${entry.slug}: enlaces internos insuficientes`);
        }
        if (entry.uniqueCopy.length < 500) {
            errors.push(`${entry.slug}: copy único demasiado corto`);
        }
        const lowered = `${entry.uniqueCopy} ${entry.description}`.toLowerCase();
        for (const token of FORBIDDEN_TOKENS) {
            if (lowered.includes(token)) {
                errors.push(`${entry.slug}: token prohibido "${token}"`);
            }
        }
        if (/\bTODO\b|\bFIXME\b/.test(`${entry.uniqueCopy} ${entry.description}`)) {
            errors.push(`${entry.slug}: marcador TODO/FIXME en copy`);
        }
        if (entry.uniqueCopy.includes('<') || entry.uniqueCopy.includes('>')) {
            errors.push(`${entry.slug}: raw HTML en copy (riesgo XSS)`);
        }
        if (!isOperatorLineVerifiable(entry.phone)) {
            errors.push(`${entry.slug}: línea del operador no verificable`);
        }
    }

    return errors;
}

/** Punto de entrada determinístico. */
function main(): void {
    if (!CENTRALITA_MARIACHIS_ENTITY.verified) {
        throw new Error('[BUILD] El operador no está verificado: no se generan landings.');
    }
    if (
        !isOperatorLineVerifiable(CENTRALITA_MARIACHIS_ENTITY.officialLine) ||
        CENTRALITA_MARIACHIS_ENTITY.lineOwner.trim().length === 0
    ) {
        throw new Error('[BUILD] La línea oficial no tiene titular declarado.');
    }
    if (MARIACHI_HUB.total !== EXPECTED_TOTAL) {
        throw new Error(`[BUILD] Hub desalineado: ${MARIACHI_HUB.total}.`);
    }

    const payload = MARIACHI_LANDINGS.map(toEntry);
    const errors = validate(payload);

    if (errors.length > 0) {
        errors.forEach((error) => console.error(`[BUILD] ${error}`));
        throw new Error(`[BUILD] ${errors.length} violaciones: no se escribe manifiesto.`);
    }

    const manifest: Manifest = {
        engine: 'omega-centralita-mariachis-europa-220',
        version: '1.0.0',
        landingCount: payload.length,
        geoCount: payload.filter((entry) => entry.kind === 'geo').length,
        intentCount: payload.filter((entry) => entry.kind === 'intent').length,
        marketCount: MARIACHI_HUB.marketCount,
        countryCount: MARIACHI_HUB.countryCount,
        depositEur: DEPOSITO_STRIPE_EUR,
        splitSoberano: {
            artista: SPLIT_SOBERANO.artista,
            earOs: SPLIT_SOBERANO.earOs,
            vimume: SPLIT_SOBERANO.vimume,
        },
        logistics: {
            kmFree: LOGISTICA_KM_EXENTOS,
            eurPerKm: LOGISTICA_EUR_PER_KM,
            hotelEur: SUPLEMENTO_HOTEL_EUR,
            origin: CENTRALITA_MARIACHIS_ENTITY.baseFullLabel,
        },
        formats: MARIACHI_FORMATS.map((format) => ({
            id: format.id,
            name: format.name,
            members: format.members,
            basePrice: format.basePrice,
        })),
        entity: {
            id: CENTRALITA_MARIACHIS_ENTITY.id,
            brand: CENTRALITA_MARIACHIS_ENTITY.brand,
            operator: CENTRALITA_MARIACHIS_ENTITY.operator,
            phone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
            email: CENTRALITA_MARIACHIS_ENTITY.email,
            base: CENTRALITA_MARIACHIS_ENTITY.baseFullLabel,
            verified: CENTRALITA_MARIACHIS_ENTITY.verified,
            verificationRule: CENTRALITA_MARIACHIS_ENTITY.verificationRule,
            lineOwner: CENTRALITA_MARIACHIS_ENTITY.lineOwner,
            networkPolicy: CENTRALITA_MARIACHIS_ENTITY.networkPolicy,
        },
        payload,
    };

    const outDir = resolve(process.cwd(), 'public', 'landings', 'centralita-mariachis');
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, 'manifest.json');
    writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    process.stdout.write(
        `[BUILD] ${manifest.landingCount} landings (${manifest.geoCount} geo + ${manifest.intentCount} intención) · ${manifest.marketCount} mercados / ${manifest.countryCount} países · depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € · ${outFile}\n`,
    );
}

main();


