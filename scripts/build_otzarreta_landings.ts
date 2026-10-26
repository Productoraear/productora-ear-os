/**
 * ════════════════════════════════════════════════════════════════════════════
 * BUILD — CLÚSTER DE DOMINANCIA OTZARRETA · GIPUZKOA (126 LANDINGS)
 * ════════════════════════════════════════════════════════════════════════════
 * Consume el motor tipado `src/lib/seo/otzarreta-dominance-engine.ts`, valida
 * los invariantes SSOT y emite `public/landings/otzarreta/manifest.json`
 * (determinístico, sin timestamps) para que el guardián anti-duplicación
 * `scripts/audit_otzarreta_landings.cjs` lo audite sin recomponer copy.
 *
 * Ejecución:  npx tsx scripts/build_otzarreta_landings.ts
 * Salida:     Exit 0 solo si 126 = 72 geo + 54 intención, depósito SSOT y
 *             sellos SHA-256 válidos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
    CENTRALITA_EAR_OS,
    DEPOSITO_STRIPE_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SPLIT_SOBERANO,
} from '../src/lib/constants/ear-os-ssot';
import {
    isOtzarretaPhoneVerifiable,
    OTZARRETA_ENTITY,
} from '../src/lib/constants/otzarreta-entity';
import {
    OTZARRETA_HUB,
    OTZARRETA_LANDINGS,
    type OtzarretaLanding,
} from '../src/lib/seo/otzarreta-dominance-engine';

const HEX_64 = /^[0-9a-f]{64}$/;
/**
 * Marcadores de placeholder prohibidos en la ruta de venta. Se comparan en
 * minúsculas salvo `TODO`/`FIXME`, que se validan aparte en mayúsculas para no
 * confundirlos con la palabra española «todo».
 */
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
    readonly municipality: string;
    readonly municipalitySlug: string;
    readonly vertical: string;
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
    readonly depositEur: number;
    readonly splitSoberano: {
        readonly artista: number;
        readonly earOs: number;
        readonly vimume: number;
    };
    readonly logistics: {
        readonly kmFree: number;
        readonly eurPerKm: number;
        readonly origin: string;
    };
    readonly entity: {
        readonly id: string;
        readonly name: string;
        readonly phone: string;
        readonly email: string;
        readonly address: string;
        readonly verified: boolean;
        readonly provenanceSha256: string | null;
    };
    readonly payload: readonly ManifestEntry[];
}

/** Extrae los `@type` de un grafo JSON-LD. */
function schemaTypes(landing: OtzarretaLanding): readonly string[] {
    return landing.schemaOrg
        .map((node) => String(node['@type'] ?? ''))
        .filter((value) => value.length > 0);
}

/** Serializa una landing al registro auditable. */
function toEntry(landing: OtzarretaLanding): ManifestEntry {
    return {
        slug: landing.slug,
        path: landing.path,
        kind: landing.kind,
        title: landing.title,
        description: landing.description,
        h1: landing.h1,
        keyword: landing.keyword,
        municipality: landing.municipalityName,
        municipalitySlug: landing.municipalitySlug,
        vertical: landing.verticalSlug,
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

/** Validaciones duras previas a escribir el manifiesto. */
function validate(payload: readonly ManifestEntry[]): readonly string[] {
    const errors: string[] = [];

    if (payload.length !== 126) {
        errors.push(`landingCount=${payload.length} (esperado 126)`);
    }
    const geo = payload.filter((entry) => entry.kind === 'geo').length;
    const intent = payload.filter((entry) => entry.kind === 'intent').length;
    if (geo !== 72) {
        errors.push(`geoCount=${geo} (esperado 72)`);
    }
    if (intent !== 54) {
        errors.push(`intentCount=${intent} (esperado 54)`);
    }

    const seenSlug = new Set<string>();
    const seenTitle = new Set<string>();
    const seenH1 = new Set<string>();

    for (const entry of payload) {
        if (seenSlug.has(entry.slug)) {
            errors.push(`slug duplicado: ${entry.slug}`);
        }
        seenSlug.add(entry.slug);

        if (seenTitle.has(entry.title)) {
            errors.push(`title duplicado: ${entry.title}`);
        }
        seenTitle.add(entry.title);

        if (seenH1.has(entry.h1)) {
            errors.push(`h1 duplicado: ${entry.h1}`);
        }
        seenH1.add(entry.h1);

        if (entry.depositEur !== DEPOSITO_STRIPE_EUR) {
            errors.push(`${entry.slug}: depósito ${entry.depositEur} ≠ SSOT`);
        }
        if (!HEX_64.test(entry.stripeSessionId)) {
            errors.push(`${entry.slug}: stripeSessionId no es SHA-256`);
        }
        if (!HEX_64.test(entry.priceLockSha256)) {
            errors.push(`${entry.slug}: priceLockSha256 no es SHA-256`);
        }
        if (!HEX_64.test(entry.provenanceHash)) {
            errors.push(`${entry.slug}: provenanceHash no es SHA-256`);
        }
        if (entry.schemaTypes.join(',') !== 'Restaurant,Service,FAQPage,BreadcrumbList') {
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
    }

    return errors;
}

/** Punto de entrada determinístico. */
function main(): void {
    if (!OTZARRETA_ENTITY.verified) {
        throw new Error('[BUILD] La entidad no está verificada: no se generan landings.');
    }
    if (
        !isOtzarretaPhoneVerifiable(
            OTZARRETA_ENTITY.primaryPhone,
            CENTRALITA_EAR_OS,
        )
    ) {
        throw new Error('[BUILD] Teléfono del proveedor no verificable (¿centralita?).');
    }

    const payload = OTZARRETA_LANDINGS.map(toEntry);
    const errors = validate(payload);

    if (errors.length > 0) {
        errors.forEach((error) => console.error(`[BUILD] ${error}`));
        throw new Error(`[BUILD] ${errors.length} violaciones: no se escribe manifiesto.`);
    }

    const manifest: Manifest = {
        engine: 'omega-otzarreta-gipuzkoa-126',
        version: '1.0.0',
        landingCount: payload.length,
        geoCount: payload.filter((entry) => entry.kind === 'geo').length,
        intentCount: payload.filter((entry) => entry.kind === 'intent').length,
        depositEur: DEPOSITO_STRIPE_EUR,
        splitSoberano: {
            artista: SPLIT_SOBERANO.artista,
            earOs: SPLIT_SOBERANO.earOs,
            vimume: SPLIT_SOBERANO.vimume,
        },
        logistics: {
            kmFree: LOGISTICA_KM_EXENTOS,
            eurPerKm: LOGISTICA_EUR_PER_KM,
            origin: OTZARRETA_ENTITY.fullAddress,
        },
        entity: {
            id: OTZARRETA_ENTITY.id,
            name: OTZARRETA_ENTITY.commercialName,
            phone: OTZARRETA_ENTITY.primaryPhone,
            email: OTZARRETA_ENTITY.email,
            address: OTZARRETA_ENTITY.fullAddress,
            verified: OTZARRETA_ENTITY.verified,
            provenanceSha256:
                OTZARRETA_ENTITY.evidence[0]?.provenanceSha256 ?? null,
        },
        payload,
    };

    const outDir = resolve(process.cwd(), 'public', 'landings', 'otzarreta');
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, 'manifest.json');
    writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    process.stdout.write(
        `[BUILD] ${manifest.landingCount} landings (${manifest.geoCount} geo + ${manifest.intentCount} intención) · depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € · hub ${OTZARRETA_HUB.total} · ${outFile}\n`,
    );
}

main();
