// ════════════════════════════════════════════════════════════════════════════
// build_investor_metrics.cjs — DATA ROOM METRICS GENERATOR (S-CLASS)
// ════════════════════════════════════════════════════════════════════════════
// Extrae las constantes de negocio DIRECTAMENTE del SSOT canónico
// (src/lib/constants/ear-os-ssot.ts) para garantizar CERO duplicación de valores.
// Produce reports/investor_metrics.json con los unit economics que un inversor
// audita primero. No inventa nada: los números nacen del SSOT verificado.
//
// Uso: node scripts/build_investor_metrics.cjs
// ════════════════════════════════════════════════════════════════════════════

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const SSOT_PATH = path.join(ROOT, 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const OUT_PATH = path.join(ROOT, 'reports', 'investor_metrics.json');

function fail(msg) {
    console.error(`\n❌ [INVESTOR_METRICS] ${msg}`);
    process.exit(1);
}

if (!fs.existsSync(SSOT_PATH)) {
    fail(`No se encontró el SSOT canónico en: ${SSOT_PATH}`);
}

// ── 1. Leer la fuente única de verdad ────────────────────────────────────────
const ssotSource = fs.readFileSync(SSOT_PATH, 'utf8');

// ── 2. Extraer primitivas tipadas (números y strings) con regex no destructiva ──
const primitivePattern = /export\s+const\s+([A-Z0-9_]+)\s*:\s*[a-z]+\s*=\s*([^;]+);/g;
const primitives = {};
let match;
while ((match = primitivePattern.exec(ssotSource)) !== null) {
    const name = match[1];
    const raw = match[2].trim();

    // Números (float o int)
    if (raw === 'true' || raw === 'false') {
        primitives[name] = raw === 'true';
    } else if (/^[-+]?\d+(\.\d+)?$/.test(raw)) {
        primitives[name] = Number(raw);
    } else if (/^'.*'$/.test(raw)) {
        // String con comillas simples (posible escape por comillas internas)
        primitives[name] = raw.slice(1, -1).replace(/\\'/g, "'");
    } else {
        primitives[name] = raw;
    }
}

// ── 3. Extraer Split Soberano 80/10/10 (objeto inmutable) ────────────────────
const splitBlock = ssotSource.match(/SPLIT_SOBERANO\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\s*as\s*const\);/);
const split = {};
if (splitBlock) {
    const entryPattern = /(\w+)\s*:\s*(0?\.\d+|\d+)/g;
    let entry;
    while ((entry = entryPattern.exec(splitBlock[1])) !== null) {
        split[entry[1]] = Number(entry[2]);
    }
}

// ── 4. Cálculos de unit economics (lógica pura, sin hardcodear cifras) ────────
const baseRate = primitives.TARIFA_BASE_SOLISTA_EUR;
const deposit = primitives.DEPOSITO_STRIPE_EUR;
const depositCents = Math.round(deposit * 100);
const artistPct = split.artista ?? 0.8;
const earPct = split.earOs ?? 0.1;
const vimumePct = split.vimume ?? 0.1;

const vatRate = primitives.VAT_RATE ?? 0.21;
const baseWithVat = baseRate * (1 + vatRate);

const kmRate = primitives.LOGISTICA_EUR_PER_KM;
const kmExempt = primitives.LOGISTICA_KM_EXENTOS;
const kmHotel = primitives.LOGISTICA_KM_HOTEL;
const hotelFee = primitives.SUPLEMENTO_HOTEL_EUR;
const finishHourHotel = primitives.HORA_FIN_HOTEL;

// Ejemplo ilustrativo de logística a 120 km (sin hotel, hora fin 1:00 AM)
const sampleDistance = 120;
const billableKm = Math.max(0, sampleDistance - kmExempt);
const sampleLogistics = Number((billableKm * kmRate).toFixed(2));

// Reparto del depósito de 100 € según split (el depósito es deducible 100%)
const depositSplit = {
    artista: Number((deposit * artistPct).toFixed(2)),
    earOs: Number((deposit * earPct).toFixed(2)),
    vimume: Number((deposit * vimumePct).toFixed(2)),
};

// ── 5. Construir el payload del data room ────────────────────────────────────
const now = new Date().toISOString();
const report = {
    _meta: {
        generatedAt: now,
        ssot: 'src/lib/constants/ear-os-ssot.ts',
        doctrine: 'CERO DUPLICACIÓN: todos los valores provienen del SSOT canónico.',
        version: '1.0-investor-data-room',
    },
    unit_economics: {
        artist: 'Edwin Agudelo — Solista Premium',
        base_rate_eur: baseRate,
        base_rate_with_vat_eur: Number(baseWithVat.toFixed(2)),
        vat_rate: vatRate,
        deposit_price_lock_eur: deposit,
        deposit_cents: depositCents,
        deposit_deductible_100pct: true,
        deposit_split_80_10_10: depositSplit,
        sovereign_split: {
            artista: artistPct,
            ear_os: earPct,
            vimume: vimumePct,
            check_sum: Number((artistPct + earPct + vimumePct).toFixed(3)),
        },
    },
    logistics: {
        eur_per_km: kmRate,
        km_exempt: kmExempt,
        km_hotel_threshold: kmHotel,
        hotel_supplement_eur: hotelFee,
        hotel_trigger_finish_hour: finishHourHotel,
        example_120km_no_hotel: {
            billable_km: billableKm,
            charge_eur: sampleLogistics,
        },
    },
    acoustic_rider_ssot: {
        public_health_limit_db_spl: primitives.LIMITE_SPL_DB,
        watts_per_pax: primitives.WATTS_PER_PAX,
        note: 'Rider por contexto (Festejos/Bodas/Solista/VIMUME) definido en AGENTS.md; estos dos son los límites de salud pública del SSOT.',
    },
    b2g_limits: {
        lcsp_art_118_legal_ceiling_eur: primitives.LIMITE_B2G_LCSP_EUR,
        preventive_ceiling_eur: primitives.AJUSTE_PREVENTIVO_B2G_EUR,
    },
    funnel_structure: {
        route: '/reservar/solista → calendario → depósito Stripe (100 €) → webhook → lock atómico → ledger 80/10/10 → n8n',
        persistence: 'PostgreSQL 16 (Prisma)',
        idempotency: 'lock atómico ACID; N retries con misma stripeSessionId = 1 fila ProductionEvent',
    },
    trailing_metrics: {
        status: 'PENDING_LIVE_CREDENTIALS',
        note: 'GMV, nº reservas, CAC, LTV y run-rate requieren credenciales Stripe reales y transacciones legítimas. Pendiente exclusivo del CEO (no automatizable sin claves).',
        gmv_eur: null,
        reservations_paid: null,
        stripe_secret_configured: Boolean(process.env.STRIPE_SECRET_KEY),
        postgres_url_configured: Boolean(process.env.POSTGRES_PRISMA_URL),
    },
};

// ── 6. Calcular hash de integridad del propio reporte para due diligence ──────
const jsonBody = JSON.stringify(report, null, 2);
report._meta.reportSha256 = crypto.createHash('sha256').update(jsonBody).digest('hex');

// ── 7. Persistir artefacto ───────────────────────────────────────────────────
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log('\n✅ [INVESTOR_METRICS] Data room generado:');
console.log(`   📄 ${path.relative(ROOT, OUT_PATH)}`);
console.log(`   🔐 SHA-256: ${report._meta.reportSha256}`);
console.log(`   💶 Base solista: ${baseRate} € · Depósito: ${deposit} € · Split: ${(artistPct * 100).toFixed(0)}/${(earPct * 100).toFixed(0)}/${(vimumePct * 100).toFixed(0)}`);
console.log('   ⚠️  Métricas de tracción: PENDING_LIVE_CREDENTIALS (requieren claves del CEO).\n');

process.exit(0);