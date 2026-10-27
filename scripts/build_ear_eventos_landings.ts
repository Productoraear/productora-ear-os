/**
 * ════════════════════════════════════════════════════════════════════════════
 * BUILD — CLÚSTER PRODUCTORA EAR · BODAS Y EVENTOS (ESPAÑA) · 268 LANDINGS
 * ════════════════════════════════════════════════════════════════════════════
 * Consume `src/lib/seo/ear-eventos-dominance-engine.ts`, valida invariantes
 * SSOT y emite `public/landings/productora-ear/manifest.json` (determinístico).
 *
 * Ejecución:  npx tsx scripts/build_ear_eventos_landings.ts
 * Salida:     Exit 0 solo si 268 = 208 geo + 60 intención, 52 provincias,
 *             depósito SSOT, línea del operador verificada y sellos válidos.
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
    EAR_EVENTOS_ENTITY,
    isEarOperatorLineVerifiable,
} from '../src/lib/constants/ear-eventos-entity';
import { MARIACHI_FORMATS } from '../src/lib/mariachi/mariachiDispatchCore';
import {
    EVENT_HUB,
    EVENT_LANDINGS,
    EVENT_PROVINCES,
    type EventLanding,
} from '../src/lib/seo/ear-eventos-dominance-engine';

const HEX_64 = /^[0-9a-f]{64}$/;
const EXPECTED_TOTAL = 268;
const EXPECTED_GEO = 208;
const EXPECTED_INTENT = 60;
const EXPECTED_PROVINCES = 52;
const PATH_PREFIX = '/productora-ear/';
const EXPECTED_SCHEMA = 'Organization,Service,Offer,FAQPage,BreadcrumbList';
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
    readonly province: string;
    readonly provinceSlug: string;
    readonly community: string;
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
    readonly provinceCount: number;
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

/** Proyecta una landing al manifiesto auditable. */
function toEntry(landing: EventLanding): ManifestEntry {
    return {
        slug: landing.slug,
        path: landing.path,
        kind: landing.kind,
        title: landing.title,
        description: landing.description,
        h1: landing.h1,
        keyword: landing.keyword,
        province: landing.provinceName,
        provinceSlug: landing.provinceSlug,
        community: landing.community,
        vertical: landing.verticalSlug,
        formatId: landing.format.id,
        basePriceEur: landing.format.basePrice,
        depositEur: landing.depositEur,
        stripeSessionId: landing.stripeSessionId,
        priceLockSha256: landing.priceLockSha256,
        provenanceHash: landing.provenanceHash,
        uniqueCopy: landing.uniqueCopy,
        faqCount: landing.faqs.length,
        schemaTypes: landing.schemaOrg.map((node) => String(node['@type'])),
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
    if (EVENT_PROVINCES.length !== EXPECTED_PROVINCES) {
        errors.push(`provincias ${EVENT_PROVINCES.length} ≠ ${EXPECTED_PROVINCES}`);
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
        if (!isEarOperatorLineVerifiable(entry.phone)) {
            errors.push(`${entry.slug}: línea del operador no verificable`);
        }
    }

    return errors;
}

/** Punto de entrada determinístico. */
function main(): void {
    if (!EAR_EVENTOS_ENTITY.verified) {
        throw new Error('[BUILD] El operador no está verificado: no se generan landings.');
    }
    if (
        !isEarOperatorLineVerifiable(EAR_EVENTOS_ENTITY.officialLine) ||
        EAR_EVENTOS_ENTITY.lineOwner.trim().length === 0
    ) {
        throw new Error('[BUILD] La línea oficial no tiene titular declarado.');
    }
    if (EVENT_HUB.total !== EXPECTED_TOTAL) {
        throw new Error(`[BUILD] Hub desalineado: ${EVENT_HUB.total}.`);
    }

    const payload = EVENT_LANDINGS.map(toEntry);
    const errors = validate(payload);

    if (errors.length > 0) {
        errors.forEach((error) => console.error(`[BUILD] ${error}`));
        throw new Error(`[BUILD] ${errors.length} violaciones: no se escribe manifiesto.`);
    }

    const manifest: Manifest = {
        engine: 'omega-productora-ear-espana-268',
        version: '1.0.0',
        landingCount: payload.length,
        geoCount: payload.filter((entry) => entry.kind === 'geo').length,
        intentCount: payload.filter((entry) => entry.kind === 'intent').length,
        provinceCount: EVENT_PROVINCES.length,
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
            origin: EAR_EVENTOS_ENTITY.baseFullLabel,
        },
        formats: MARIACHI_FORMATS.map((format) => ({
            id: format.id,
            name: format.name,
            members: format.members,
            basePrice: format.basePrice,
        })),
        entity: {
            id: EAR_EVENTOS_ENTITY.id,
            brand: EAR_EVENTOS_ENTITY.brand,
            operator: EAR_EVENTOS_ENTITY.operator,
            phone: EAR_EVENTOS_ENTITY.officialLine,
            email: EAR_EVENTOS_ENTITY.email,
            base: EAR_EVENTOS_ENTITY.baseFullLabel,
            verified: EAR_EVENTOS_ENTITY.verified,
            verificationRule: EAR_EVENTOS_ENTITY.verificationRule,
            lineOwner: EAR_EVENTOS_ENTITY.lineOwner,
            networkPolicy: EAR_EVENTOS_ENTITY.networkPolicy,
        },
        payload,
    };

    const outDir = resolve(process.cwd(), 'public', 'landings', 'productora-ear');
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, 'manifest.json');
    writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    process.stdout.write(
        `[BUILD] ${manifest.landingCount} landings (${manifest.geoCount} geo + ${manifest.intentCount} intención) · ${manifest.provinceCount} provincias · depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € · ${outFile}\n`,
    );
}

main();


