/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN — ATRIBUCIÓN DE LANDING → CONFIGURADOR → STRIPE (P1)
 * ════════════════════════════════════════════════════════════════════════════
 * No se conforma con leer texto: IMPORTA los módulos reales y ejecuta los
 * invariantes. Si algo se rompe, Exit Code ≠ 0.
 *
 * Invariantes auditados:
 *  1. Saneamiento OWASP: slugs con HTML, rutas, `--`, vacíos o gigantes → null.
 *  2. Clúster cerrado: cualquier valor fuera de la allow-list cae a `directo`.
 *  3. Round-trip: lo que emite el CTA se vuelve a leer sin pérdida.
 *  4. Homologación monetaria: cada formato SSOT apunta a un perfil cuya tarifa
 *     es EXACTAMENTE la del SSOT (cero incoherencia landing ↔ checkout).
 *  5. Contrato de plantillas y endpoint: ambos emiten y reenvían la procedencia.
 *  6. Cero `any` y cero precios hardcodeados en la línea mariachi del catálogo.
 *
 * Ejecución: npx tsx scripts/audit_landing_attribution.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
    LANDING_CLUSTERS,
    buildReserveQuery,
    readLandingAttribution,
    resolveArtistProfileId,
    resolveCluster,
    sanitizeLandingSlug,
} from '../src/lib/reservar/landing-attribution';
import { ARTIST_FORMAT_BY_SSOT_ID } from '../src/lib/reservar/solista-catalog';
import { MARIACHI_FORMATS } from '../src/lib/mariachi/mariachi-formats';

interface Failure {
    readonly check: string;
    readonly detail: string;
}

const failures: Failure[] = [];

function check(label: string, condition: boolean, detail: string): void {
    if (!condition) failures.push({ check: label, detail });
}

function readText(relativePath: string): string {
    return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

// ── 1. SANEAMIENTO OWASP ────────────────────────────────────────────────────
const validSlug = 'serenata-mariachi-madrid';
check('slug/valido', sanitizeLandingSlug(validSlug) === validSlug, 'slug legítimo rechazado');

for (const hostile of [
    '<script>alert(1)</script>',
    '../../etc/passwd',
    'slug con espacios',
    'serenata--doble-guion',
    '/centralita-mariachis/x',
    'x'.repeat(200),
    '',
]) {
    check(
        'slug/hostil',
        sanitizeLandingSlug(hostile) === null,
        `entrada hostil aceptada: ${JSON.stringify(hostile.slice(0, 40))}`,
    );
}
check('slug/no-string', sanitizeLandingSlug({ evil: true }) === null, 'objeto aceptado como slug');
check('slug/null', sanitizeLandingSlug(null) === null, 'null aceptado como slug');

// ── 2. CLÚSTER CERRADO ──────────────────────────────────────────────────────
for (const cluster of LANDING_CLUSTERS) {
    check('cluster/permitido', resolveCluster(cluster) === cluster, `clúster sancionado rechazado: ${cluster}`);
}
for (const hostile of ['evil-cluster', '<script>', '', 'productora_ear']) {
    check('cluster/hostil', resolveCluster(hostile) === 'directo', `clúster hostil aceptado: ${hostile}`);
}

// ── 3. ROUND-TRIP CTA → LECTURA ─────────────────────────────────────────────
const query = buildReserveQuery({
    cluster: 'centralita-mariachis',
    landingSlug: validSlug,
    formatId: 'gala',
});
const parsed = readLandingAttribution(query);
check('roundtrip/cluster', parsed.cluster === 'centralita-mariachis', `clúster perdido en ${query}`);
check('roundtrip/slug', parsed.landingSlug === validSlug, `slug perdido en ${query}`);
check('roundtrip/formato', parsed.formatId === 'gala', `formato perdido en ${query}`);

const hostileQuery = buildReserveQuery({
    cluster: 'productora-ear',
    landingSlug: '"><script>alert(1)</script>',
    formatId: 'inventado',
});
check(
    'roundtrip/hostil-descartado',
    !hostileQuery.includes('script') && !hostileQuery.includes('inventado'),
    `el CTA propagó datos sin sanear: ${hostileQuery}`,
);
check(
    'roundtrip/hostil-sin-procedencia',
    readLandingAttribution(hostileQuery).landingSlug === null &&
        readLandingAttribution(hostileQuery).formatId === null,
    'la atribución hostil no quedó neutralizada (un CTA sin landing ni formato debe degradar a directo)',
);

// ── 4. HOMOLOGACIÓN MONETARIA (SSOT ↔ CATÁLOGO) ─────────────────────────────
for (const format of MARIACHI_FORMATS) {
    const profileId = resolveArtistProfileId(format.id);
    if (!profileId) {
        failures.push({ check: 'homologacion/ausente', detail: `formato SSOT sin perfil: ${format.id}` });
        continue;
    }
    const profile = ARTIST_FORMAT_BY_SSOT_ID[format.id];
    check(
        'homologacion/precio',
        profile.id === profileId && profile.baseRate === format.basePrice,
        `${format.id}: perfil ${profile.id} cobra ${profile.baseRate} EUR y el SSOT publica ${format.basePrice} EUR`,
    );
    check(
        'homologacion/deposito',
        Math.abs(profile.baseRate - format.basePrice) < 0.005,
        `${format.id}: desviación de tarifa`,
    );
}

// Enlaces históricos con id nativo de perfil (sin pasar por SSOT).
for (const legacyId of ['edwin-solista', 'mariachi-imperial', 'cuarteto-cuerdas']) {
    check(
        'homologacion/legacy',
        resolveArtistProfileId(legacyId) === legacyId,
        `id histórico no resuelto: ${legacyId}`,
    );
}
check('homologacion/basura', resolveArtistProfileId('formato-inventado') === null, 'id inventado resuelto');

// ── 5. CONTRATO DE PLANTILLAS Y ENDPOINT ────────────────────────────────────
const templates: ReadonlyArray<{ path: string; cluster: string }> = [
    { path: 'src/app/(public)/centralita-mariachis/[slug]/page.tsx', cluster: 'centralita-mariachis' },
    { path: 'src/app/(public)/productora-ear/[slug]/page.tsx', cluster: 'productora-ear' },
];

for (const template of templates) {
    const source = readText(template.path);
    check('plantilla/helper', source.includes('buildReserveQuery'), `${template.path} no usa el contrato único`);
    check(
        'plantilla/cluster',
        source.includes(`'${template.cluster}'`),
        `${template.path} no declara su clúster`,
    );
    check(
        'plantilla/sin-query-manual',
        !source.includes('/reservar/solista?formato='),
        `${template.path} sigue construyendo el query a mano`,
    );
}

const depositRoute = readText('src/app/api/reservar/solista/deposit/route.ts');
check('endpoint/lee-slug', depositRoute.includes('landingSlug'), 'el endpoint no lee la procedencia');
check(
    'endpoint/stripe-metadata',
    depositRoute.includes('landingSlug: attributionSlug'),
    'la metadata de Stripe no persiste la landing',
);
check(
    'endpoint/n8n',
    depositRoute.includes('landingCluster: attributionCluster'),
    'n8n no recibe el clúster de procedencia',
);
check(
    'endpoint/cluster-whitelist',
    depositRoute.includes('LANDING_CLUSTERS'),
    'el clúster no se valida contra la allow-list',
);

const configurator = readText('src/app/reservar/solista/page.tsx');
check('configurador/lee', configurator.includes('readLandingAttribution'), 'el configurador no lee la procedencia');
check(
    'configurador/envia',
    configurator.includes('landingSlug: attribution.landingSlug'),
    'no se envía la landing al depósito',
);
check(
    'configurador/catalogo-puro',
    !configurator.includes('const ARTIST_FORMATS'),
    'el catálogo sigue hardcodeado en la página cliente',
);

// ── 6. HIGIENE DE CÓDIGO Y PRECIOS ──────────────────────────────────────────
const pureModules = [
    'src/lib/reservar/landing-attribution.ts',
    'src/lib/reservar/solista-catalog.ts',
    'src/lib/mariachi/mariachi-formats.ts',
];

for (const modulePath of pureModules) {
    const source = readText(modulePath);
    check('higiene/any', !/:\s*any\b|as any\b/.test(source), `${modulePath} contiene 'any'`);
    check('higiene/node', !source.includes("from 'node:"), `${modulePath} depende de Node (no es client-safe)`);
    check(
        'higiene/todo',
        !/\b(TODO|FIXME)\b/.test(source),
        `${modulePath} contiene TODO/FIXME en la ruta de dinero`,
    );
}

const catalog = readText('src/lib/reservar/solista-catalog.ts');
const hardcodedMariachiPrices = ['550.0', '850.0', '1300.0'].filter((price) => catalog.includes(price));
check(
    'higiene/precios-mariachi',
    hardcodedMariachiPrices.length === 0,
    `la línea mariachi conserva precios hardcodeados: ${hardcodedMariachiPrices.join(', ')}`,
);

// ── RESULTADO ───────────────────────────────────────────────────────────────
const summary = {
    status: failures.length === 0 ? 'VERIFICADO' : 'FALLIDO',
    formats: MARIACHI_FORMATS.length,
    clusters: LANDING_CLUSTERS.length,
    templates: templates.length,
    failures,
};

console.log('[AUDIT-ATRIBUCION] ' + JSON.stringify(summary, null, 2));

if (failures.length > 0) {
    console.error(`[AUDIT-ATRIBUCION] RESULTADO: FALLIDO - ${failures.length} violación(es).`);
    process.exit(1);
}

console.log(
    '[AUDIT-ATRIBUCION] RESULTADO: VERIFICADO - saneamiento OWASP, clúster cerrado, ' +
        'homologación SSOT↔checkout, plantillas y endpoint sellados.',
);
process.exit(0);
