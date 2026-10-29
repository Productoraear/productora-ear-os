/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR — MOTOR DE CAPTACIÓN DE AGRUPACIONES (RED DE MARIACHIS)
 * ════════════════════════════════════════════════════════════════════════════
 * Evidencia máquina del bloque «red de agrupaciones». Sin este script, la
 * oferta sería prosa. Comprueba:
 *
 *  1. HARD INVARIANTS del SSOT: 0 € fijos, 10 % de infraestructura, 80 % al
 *     artista, 100 € de depósito. Si alguien toca el motor financiero, aquí
 *     revienta.
 *  2. Coherencia aritmética del punto de equilibrio.
 *  3. Determinismo y alfabeto del código de invitación.
 *  4. ANTI-HUÉRFANO: la centralita NO sirve como teléfono de proveedor de red
 *     (debe devolver `ok:false`), y un teléfono propio sí genera enlace.
 *  5. RGPD: el mensaje incluye vía de baja (BAJA) y no inventa marcas.
 *  6. Archivo histórico: 22 URLs del clúster y repertorio no vacío.
 *
 * Uso: npx tsx scripts/verify_mariachi_network_offer.ts
 * Exit 0 = todo verificado · Exit 1 = al menos una aserción rota.
 * ════════════════════════════════════════════════════════════════════════════
 */

import assert from 'node:assert/strict';
import {
    buildInvitationCode,
    buildOutreachMessage,
    buildOwnerOffer,
    buildWhatsAppOutreachLink,
    isInvitationCode,
    provinceSlug,
} from '../src/lib/mariachi/network-outreach';
import { MARIACHI_MARKETS } from '../src/lib/seo/centralita-mariachis-dominance-engine';
import { MARIACHI_FORMATS } from '../src/lib/mariachi/mariachi-formats';
import {
    ARCHIVE_REPERTOIRE,
    ARCHIVE_REPERTOIRE_TOTAL,
    ARCHIVE_SERVICES,
    ARCHIVE_WORLD_CLUSTER,
    ARCHIVE_WORLD_CLUSTER_COUNT,
} from '../src/lib/constants/mariachi-historical-archive';
import {
    MARIACHI_MARKET_OBSERVATION,
    OBSERVED_ANNUAL_SUBSCRIPTION_EUR,
    UNCOVERED_PROVINCES_COUNT,
} from '../src/lib/constants/mariachi-market-intelligence';

const checks: string[] = [];
function ok(label: string): void {
    checks.push(label);
}

/* ── 1. Invariantes del SSOT ─────────────────────────────────────────────── */
const offer = buildOwnerOffer(MARIACHI_FORMATS);
assert.equal(offer.fixedAnnualCostEur, 0, 'La cuota fija debe ser 0 €');
ok('cuota fija = 0 €');
assert.equal(offer.successFeeRate, 0.1, 'Infraestructura debe ser 10 % (0,1)');
ok('infraestructura = 10 %');
assert.equal(offer.artistPayoutRate, 0.8, 'Artista debe percibir 80 % (0,8)');
ok('artista = 80 %');
assert.equal(offer.depositEur, 100, 'Depósito debe ser 100 €');
ok('depósito = 100 € deducible');
assert.equal(
    Math.round((offer.artistPayoutRate + offer.successFeeRate + 0.1) * 100) / 100,
    1,
    'Split 80/10/10 debe sumar 1,0',
);
ok('split 80/10/10 suma 1,0');
assert.equal(
    offer.observedAnnualCostEur,
    OBSERVED_ANNUAL_SUBSCRIPTION_EUR,
    'Coste observado debe venir del dataset de mercado',
);
ok(`coste observado = ${offer.observedAnnualCostEur} €/año`);

/* ── 2. Aritmética del punto de equilibrio ───────────────────────────────── */
assert.ok(offer.averageBookingValueEur > 0, 'Bolo medio debe ser positivo');
const feePerBooking = offer.averageBookingValueEur * offer.successFeeRate;
const expectedBreakEven = Math.ceil(
    offer.observedAnnualCostEur / feePerBooking,
);
assert.equal(
    offer.breakEvenBookings,
    expectedBreakEven,
    'Punto de equilibrio incoherente',
);
ok(
    `break-even = ${offer.breakEvenBookings} bolos · ${offer.breakEvenGrossRevenueEur} € brutos`,
);
assert.equal(
    offer.breakEvenGrossRevenueEur,
    offer.breakEvenBookings * offer.averageBookingValueEur,
    'Facturación de equilibrio incoherente',
);
assert.ok(offer.valueLines.length >= 5, 'Pila de valor incompleta');
for (const line of offer.valueLines) {
    assert.ok(
        line.detail.trim().length > 20,
        `Línea sin detalle: ${line.label}`,
    );
}
ok(`pila de valor = ${offer.valueLines.length} líneas con detalle`);

/* ── 3. Código de invitación determinista ────────────────────────────────── */
const codeA = buildInvitationCode('Mariachi Ejemplo|Madrid');
const codeB = buildInvitationCode('  mariachi ejemplo|madrid ');
assert.equal(codeA, codeB, 'El código debe ser determinista e insensible a caja');
ok(`invitación determinista = ${codeA}`);
assert.equal(codeA.length, 8, 'Longitud por defecto = 8');
assert.ok(isInvitationCode(codeA), 'El código generado debe validar');
assert.ok(!isInvitationCode('AEIOU0O1IL'), 'Alfabeto ambiguo debe rechazarse');
assert.ok(!isInvitationCode(''), 'Cadena vacía debe rechazarse');
const codes = new Set<string>();
for (let index = 0; index < 500; index += 1) {
    codes.add(buildInvitationCode(`grupo-${index}|Sevilla`));
}
assert.ok(codes.size >= 498, `Colisión excesiva: ${codes.size}/500 únicos`);
ok(`500 semillas → ${codes.size} códigos únicos`);

/* ── 4. Anti-huérfano: la centralita no vale como teléfono de red ────────── */
const orphan = buildWhatsAppOutreachLink({
    groupSeed: 'Mariachi Ejemplo',
    province: 'Madrid',
    phone: '+34693693048',
});
assert.equal(orphan.ok, false, 'La centralita NO debe generar enlace de proveedor');
ok('centralita rechazada como teléfono de red');
const empty = buildWhatsAppOutreachLink({
    groupSeed: 'Mariachi Ejemplo',
    province: 'Madrid',
    phone: '',
});
assert.equal(empty.ok, false, 'Teléfono vacío NO debe generar enlace');
ok('teléfono vacío rechazado');
const real = buildWhatsAppOutreachLink({
    groupSeed: 'Mariachi Ejemplo',
    province: 'Madrid',
    phone: '+34 655 12 34 56',
});
assert.equal(real.ok, true, 'Teléfono propio válido debe generar enlace');
if (!real.ok) {
    throw new Error('Enlace no generado para teléfono válido');
}
assert.ok(
    real.href.startsWith('https://wa.me/34655123456'),
    'Destino WhatsApp inválido',
);
assert.equal(
    real.invitationCode,
    codeA,
    'El enlace debe reutilizar el código determinista',
);
ok('enlace wa.me generado con teléfono verificado');

const national = buildWhatsAppOutreachLink({
    groupSeed: 'Mariachi Ejemplo',
    province: 'Madrid',
    phone: '655123456',
});
assert.equal(national.ok, true, 'Un móvil nacional válido debe generar enlace');
if (!national.ok) {
    throw new Error('Enlace no generado para teléfono nacional');
}
assert.ok(
    national.href.startsWith('https://wa.me/34655123456'),
    'Falta el prefijo país: el enlace quedaría muerto',
);
ok('teléfono nacional normalizado a +34');

/* ── 5. RGPD y cero invención de marcas ──────────────────────────────────── */
const decoded = decodeURIComponent(real.href.split('text=')[1] ?? '');
assert.ok(decoded.includes('BAJA'), 'El mensaje debe ofrecer baja inmediata');
assert.ok(decoded.includes('0 €'), 'El mensaje debe declarar 0 € fijos');
assert.ok(decoded.includes('100 €'), 'El mensaje debe declarar el depósito');
assert.ok(decoded.includes('80 %'), 'El mensaje debe declarar el 80 % artista');
assert.ok(
    !decoded.toLowerCase().includes('malinalco'),
    'No debe citar marcas de terceros',
);
ok('mensaje con BAJA + cifras SSOT y sin marcas de terceros');

/* ── 6. Archivo histórico recuperado ─────────────────────────────────────── */
assert.equal(ARCHIVE_WORLD_CLUSTER_COUNT, 22, 'El clúster debe tener 22 URLs');
assert.equal(
    new Set(ARCHIVE_WORLD_CLUSTER.map((item) => item.slug)).size,
    22,
    'Slugs duplicados en el clúster',
);
assert.ok(
    ARCHIVE_WORLD_CLUSTER.every((item) => item.heading.trim().length > 5),
    'Artículo sin titular',
);
assert.ok(
    ARCHIVE_REPERTOIRE_TOTAL >= 50,
    `Repertorio escaso: ${ARCHIVE_REPERTOIRE_TOTAL}`,
);
assert.equal(
    ARCHIVE_REPERTOIRE_TOTAL,
    ARCHIVE_REPERTOIRE.reduce(
        (total, category) => total + category.titles.length,
        0,
    ),
    'El total debe coincidir con la suma de categorías (sin inflar)',
);
assert.ok(ARCHIVE_SERVICES.length >= 10, 'Catálogo de servicios incompleto');
ok(
    `archivo: 22 URLs · ${ARCHIVE_REPERTOIRE_TOTAL} títulos · ${ARCHIVE_SERVICES.length} servicios`,
);

/* ── 7. Datos de mercado con provenance ──────────────────────────────────── */
assert.ok(
    MARIACHI_MARKET_OBSERVATION.proPremiumPlan.length >= 3,
    'Plan observado incompleto',
);
assert.ok(UNCOVERED_PROVINCES_COUNT > 0, 'Debe declarar provincias sin plaza');
ok(`mercado: ${UNCOVERED_PROVINCES_COUNT} provincias sin plaza real`);

/* ── 8. Contrato de URL: la invitación debe caer en una plaza que existe ─── */
const spanishMarkets = MARIACHI_MARKETS.filter((market) => market.inSpain);
const resolveMarket = (raw: string): string | null => {
    const key = provinceSlug(raw);
    const bySlug = spanishMarkets.find(
        (market) => provinceSlug(market.slug) === key,
    );
    if (bySlug) {
        return bySlug.slug;
    }
    const byName = spanishMarkets.find(
        (market) => provinceSlug(market.name) === key,
    );
    return byName ? byName.slug : null;
};
assert.ok(spanishMarkets.length >= 20, 'Malla de plazas insuficiente');
for (const market of spanishMarkets) {
    assert.equal(
        resolveMarket(market.name),
        market.slug,
        `El nombre «${market.name}» no resuelve a la plaza ${market.slug}`,
    );
    assert.equal(
        resolveMarket(market.slug.toUpperCase()),
        market.slug,
        `El slug «${market.slug}» no resuelve en mayúsculas`,
    );
}
ok(`${spanishMarkets.length} plazas resuelven por nombre y por slug`);

const targetMarket = spanishMarkets[0];
if (!targetMarket) {
    throw new Error('Sin plazas españolas: la red no tiene destino');
}
const outreach = buildOutreachMessage(
    {
        groupSeed: 'Mariachi Ejemplo',
        province: targetMarket.name,
        phone: '+34 655 12 34 56',
    },
    codeA,
);
assert.ok(
    outreach.includes(`/mariachis/red/${targetMarket.slug}?inv=${codeA}`),
    'La URL de captación no apunta a la ruta real de la plaza',
);
assert.ok(
    !outreach.includes(`/mariachis/red/${targetMarket.slug}-`),
    'Slug mal normalizado en la URL de captación',
);
ok(`URL de captación verificada → /mariachis/red/${targetMarket.slug}`);

process.stdout.write(
    `${JSON.stringify(
        {
            status: 'PASS',
            checks: checks.length,
            offer: {
                fixedAnnualCostEur: offer.fixedAnnualCostEur,
                infraPct: Math.round(offer.successFeeRate * 100),
                artistPct: Math.round(offer.artistPayoutRate * 100),
                depositEur: offer.depositEur,
                breakEvenBookings: offer.breakEvenBookings,
            },
            archive: {
                clusterUrls: ARCHIVE_WORLD_CLUSTER_COUNT,
                repertoireTitles: ARCHIVE_REPERTOIRE_TOTAL,
                services: ARCHIVE_SERVICES.length,
            },
            network: {
                spanishPlazas: spanishMarkets.length,
                sampleOutreachUrl: `/mariachis/red/${targetMarket.slug}?inv=${codeA}`,
            },
        },
        null,
        2,
    )}\n`,
);
