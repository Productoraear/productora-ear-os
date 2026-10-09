/**
 * ════════════════════════════════════════════════════════════════════════════
 * MYTHOS DUAL-DOMAIN COMPILER (S-CLASS v5.1)
 * ════════════════════════════════════════════════════════════════════════════
 * COMPILADOR VANGUARDISTA DE DOBLE DOMINIO, inspirado en la clase de modelos
 * duales de frontera (ciberseguridad + biología). Traduce una intención humana
 * cruda en un DAG canónico compatible con `omega.js`, sellado por:
 *
 *   · DOMINIO CYBER DEFENSE — firma webhook Stripe obligatoria, fail-closed de
 *     secretos, idempotencia del ledger y sentinel SHA-256 de Zona Cero.
 *   · DOMINIO BIO-ACOUSTIC — rider adaptativo Ley 37/2003 por contexto
 *     (festejo / bodas / solista / senior) con ancla de salud pública.
 *
 * PRINCIPIOS IRREVOCABLES:
 *   - Determinístico: NUNCA depende de GPU/Ollama/red. Cero fachadas.
 *   - SSOT puro: TODO número de dinero nace de `ear-os-ssot.ts` (Zona Cero).
 *     Este módulo NO re-hardcodea valores monetarios.
 *   - Tipado estricto: cero `any` implícito.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'crypto';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    LOGISTICA_KM_HOTEL,
    SUPLEMENTO_HOTEL_EUR,
    HORA_FIN_HOTEL,
    SAFE_LCSP_CEILING_EUR,
    LIMITE_SPL_DB,
    WATTS_PER_PAX,
    SPLIT_SOBERANO,
} from '../constants/ear-os-ssot';

export type MythosDomain = 'CYBER_DEFENSE' | 'BIO_ACOUSTIC';
export type MythosMode = 'QUIRURGICO' | 'FULL_STACK';

export interface MythosCompileOptions {
    mode?: MythosMode;
}

export interface CyberControl {
    id: string;
    level: 'P0' | 'P1';
    title: string;
    requirement: string;
}

export interface AcousticPrescription {
    context: string;
    minDb: number | null;
    maxDb: number;
    note: string;
    publicHealthLimitDb: number;
    wattsPerPax: number;
}

export interface ScorecardItem {
    id: string;
    layer: 'CORE' | 'CYBER' | 'BIO' | 'GOVERNANCE';
    check: string;
}

export interface MoneyContract {
    baseEur: number;
    depositEur: number;
    splitFractions: { artista: number; earOs: number; vimume: number };
    splitOnTotalShowEur: { artistaEur: number; earOsEur: number; vimumeEur: number };
    logistics: {
        eurPerKm: number;
        kmExentos: number;
        kmHotel: number;
        hotelEur: number;
        horaHotel: number;
    };
    b2gCeilingEur: number;
    riderAcustico: { limiterDb: number; wattsPerPax: number };
    hashSha256: string;
}

export interface MythosTaskContract {
    id: string;
    title: string;
    status: 'QUEUED';
    description: string;
    files: string[];
    action: string;
    scaffold: string;
    done_when: string;
    validation: string;
    domains: MythosDomain[];
    scorecard: ScorecardItem[];
    moneyHash: string;
}

export interface MythosCompileResult {
    task: MythosTaskContract;
    yaml: string;
    moneyContract: MoneyContract;
    cyberControls: CyberControl[];
    acoustic: AcousticPrescription;
    scorecard: ScorecardItem[];
    estimatedTokens: number;
}

const round2 = (n: number): number => Number(n.toFixed(2));

const CYBER_KEYWORDS: readonly string[] = [
    'stripe', 'webhook', 'firma', 'signature', 'secreto', 'secret', 'checkout',
    'pago', 'deposito', 'idempot', 'ledger', 'sha-256', 'sha256', 'criptog',
    'price-lock'
];

const BIO_KEYWORDS: readonly string[] = [
    'boda', 'bodas', 'finca', 'festejo', 'concierto', 'plaza', 'verbena',
    'solista', 'coctel', 'combo', 'mariachi', 'acustic', 'presion sonora',
    'ruido', 'vimume', 'senior', 'residencia', 'geriat', 'neuro', 'musicoterap',
    'decibel', 'rider'
];

interface AcousticContextRule {
    id: 'FESTEJO' | 'BODA_FINCA' | 'SOLISTA_COCTEL' | 'VIMUME_SENIOR';
    keywords: readonly string[];
    label: string;
    minDb: number | null;
    maxDb: number;
    note: string;
}

const ACOUSTIC_RULES: readonly AcousticContextRule[] = [
    {
        id: 'VIMUME_SENIOR',
        keywords: ['vimume', 'senior', 'residencia', 'geriat', 'neuro', 'musicoterap'],
        label: 'Residencias / centros senior (VIMUME)',
        minDb: 65,
        maxDb: 75,
        note: 'Protocolo 40 Hz no invasivo.',
    },
    {
        id: 'SOLISTA_COCTEL',
        keywords: ['solista', 'coctel', 'gal', 'acustic'],
        label: 'Cóctel / solista (Edwin Agudelo)',
        minDb: 70,
        maxDb: 80,
        note: 'Acústica de gala.',
    },
    {
        id: 'BODA_FINCA',
        keywords: ['boda', 'finca', 'banquete', 'wedding'],
        label: 'Bodas & fincas',
        minDb: 85,
        maxDb: 90,
        note: 'Exteriores 85-90 dBA; interiores 80-85 dBA.',
    },
    {
        id: 'FESTEJO',
        keywords: ['festejo', 'concierto', 'plaza', 'verbena'],
        label: 'Festejos populares / plazas / conciertos',
        minDb: 90,
        maxDb: 102,
        note: 'Con limitador telemático homologado.',
    },
];

const DEFAULT_ACOUSTIC = ACOUSTIC_RULES.find((r) => r.id === 'SOLISTA_COCTEL') as AcousticContextRule;

function detectDomains(lower: string): MythosDomain[] {
    const cyber = CYBER_KEYWORDS.some((k) => lower.includes(k));
    const bio = BIO_KEYWORDS.some((k) => lower.includes(k));
    if (cyber && bio) return ['CYBER_DEFENSE', 'BIO_ACOUSTIC'];
    if (cyber) return ['CYBER_DEFENSE'];
    if (bio) return ['BIO_ACOUSTIC'];
    return ['CYBER_DEFENSE', 'BIO_ACOUSTIC'];
}

function resolveAcoustic(lower: string): AcousticPrescription {
    const rule = ACOUSTIC_RULES.find((r) => r.keywords.some((k) => lower.includes(k))) ?? DEFAULT_ACOUSTIC;
    return {
        context: rule.label,
        minDb: rule.minDb,
        maxDb: rule.maxDb,
        note: rule.note,
        publicHealthLimitDb: LIMITE_SPL_DB,
        wattsPerPax: WATTS_PER_PAX,
    };
}

function buildCyberControls(lower: string): CyberControl[] {
    const controls: CyberControl[] = [];

    const hasStripe = lower.includes('stripe') || lower.includes('pago') || lower.includes('checkout') || lower.includes('deposito');
    if (hasStripe) {
        controls.push({
            id: 'WEBHOOK_SIGNATURE_MANDATORY',
            level: 'P0',
            title: 'Firma webhook Stripe obligatoria',
            requirement: 'stripe.webhooks.constructEvent valida `stripe-signature` en TODOS los entornos; sin secret, 500 o 503, nunca evento procesado.',
        });
        controls.push({
            id: 'FAIL_CLOSED_SECRETS',
            level: 'P0',
            title: 'Fail-closed de secretos',
            requirement: 'Sin STRIPE_SECRET_KEY legítima la instancia lanza excepción en el primer uso real; el build/CI no colapsa.',
        });
        controls.push({
            id: 'LEDGER_IDEMPOTENCE',
            level: 'P0',
            title: 'Ledger idempotente 80/10/10',
            requirement: 'upsert sobre reference=session.id: N retries del mismo stripeSessionId producen EXACTAMENTE 1 fila.',
        });
    }

    if (lower.includes('sha') || lower.includes('sentinel') || lower.includes('integr') || lower.includes('ssot')) {
        controls.push({
            id: 'SSOT_SENTINEL_SHA256',
            level: 'P0',
            title: 'Sentinel SHA-256 de Zona Cero',
            requirement: 'verifySsotIntegrity() compara el hash runtime contra KNOWN_GOOD_SSOT_HASH; alterar Zona Cero rompe la cadena.',
        });
    }

    controls.push({
        id: 'NO_SECRETS_CLIENT',
        level: 'P1',
        title: 'Secretos jamás en cliente',
        requirement: 'STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET solo en servidor; el cliente solo consume claves publicables.',
    });

    return controls;
}

function buildScorecard(acoustic: AcousticPrescription): ScorecardItem[] {
    const splitLabel = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;
    return [
        { id: 'CORE_1', layer: 'CORE', check: 'npx tsc --noEmit -> Exit Code 0' },
        { id: 'CORE_2', layer: 'CORE', check: 'Cero `any` implícito en el diff' },
        { id: 'CORE_3', layer: 'CORE', check: '0 fachadas: todo botón escribe de verdad' },
        { id: 'CORE_4', layer: 'CORE', check: '0 TODO/placeholder en la ruta de venta' },
        { id: 'CORE_5', layer: 'CORE', check: '0 array/dato hardcodeado en motores de dinero' },
        { id: 'CORE_6', layer: 'CORE', check: `Split ${splitLabel} intacto` },
        { id: 'CORE_7', layer: 'CORE', check: `Depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € intacto` },
        { id: 'CORE_8', layer: 'CORE', check: `Rider acústico ${WATTS_PER_PAX} W/pax y < ${LIMITE_SPL_DB} dB SPL intacto` },
        { id: 'CYBER_1', layer: 'CYBER', check: 'Firma webhook Stripe obligatoria (constructEvent) en todos los entornos' },
        { id: 'CYBER_2', layer: 'CYBER', check: 'Fail-closed: sin clave legítima -> 503, nunca proceso de pago' },
        { id: 'CYBER_3', layer: 'CYBER', check: 'Ledger idempotente: N retries mismo stripeSessionId = 1 fila' },
        { id: 'CYBER_4', layer: 'CYBER', check: 'Sentinel SSOT SHA-256: hash runtime == KNOWN_GOOD_SSOT_HASH' },
        { id: 'BIO_1', layer: 'BIO', check: `Rider por contexto "${acoustic.context}" respeta ${acoustic.minDb ?? acoustic.maxDb}-${acoustic.maxDb} dBA` },
        { id: 'BIO_2', layer: 'BIO', check: 'Límite de salud pública general < 75 dB SPL como ancla innegociable' },
        { id: 'GOV_1', layer: 'GOVERNANCE', check: '0 teléfonos placeholder/centralita con verified:true' },
        { id: 'GOV_2', layer: 'GOVERNANCE', check: 'Prohibido w-screen y gradientes AI-slop' },
    ];
}

function buildBusinessRules(): string[] {
    const splitLabel = `${Math.round(SPLIT_SOBERANO.artista * 100)}% Artista / ${Math.round(SPLIT_SOBERANO.earOs * 100)}% EAR OS / ${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME`;
    return [
        `Tarifa base solista (Edwin Agudelo): ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €.`,
        `Logística S-Class: ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde el km ${LOGISTICA_KM_EXENTOS} (+${SUPLEMENTO_HOTEL_EUR.toFixed(0)} € hotel si fin >= ${HORA_FIN_HOTEL}:00 o > ${LOGISTICA_KM_HOTEL} km).`,
        `Depósito Stripe inmutable: ${DEPOSITO_STRIPE_EUR.toFixed(2)} € (Price-Lock SHA-256), 100% deducible.`,
        `Split Soberano: ${splitLabel}.`,
        `Techo B2G Art. 118 LCSP preventivo: < ${SAFE_LCSP_CEILING_EUR.toFixed(2)} €.`,
        `Rider acústico salud pública: < ${LIMITE_SPL_DB} dB SPL, ${WATTS_PER_PAX} W/pax.`,
    ];
}

function inferFiles(domains: MythosDomain[], lower: string): string[] {
    const files = new Set<string>();
    files.add('src/lib/constants/ear-os-ssot.ts');
    files.add('src/lib/security/ssotIntegrityGuard.ts');

    if (domains.includes('CYBER_DEFENSE')) {
        files.add('src/app/api/stripe/webhook/route.ts');
        files.add('src/lib/payments.ts');
        files.add('src/lib/vendor/ledgerEngine.ts');
    }
    if (domains.includes('BIO_ACOUSTIC')) {
        files.add('src/lib/vimume/b2g-tender-engine.ts');
        if (lower.includes('vimume') || lower.includes('senior') || lower.includes('residencia')) {
            files.add('src/app/(public)/vimume/page.tsx');
        }
        if (lower.includes('solista') || lower.includes('reservar') || lower.includes('coctel')) {
            files.add('src/app/reservar/solista/page.tsx');
        }
    }
    return Array.from(files);
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32) || 'mythos-task';
}

function deriveMoneyContract(): MoneyContract {
    const splitFractions = {
        artista: SPLIT_SOBERANO.artista,
        earOs: SPLIT_SOBERANO.earOs,
        vimume: SPLIT_SOBERANO.vimume,
    };
    const splitOnTotalShowEur = {
        artistaEur: round2(TARIFA_BASE_SOLISTA_EUR * splitFractions.artista),
        earOsEur: round2(TARIFA_BASE_SOLISTA_EUR * splitFractions.earOs),
        vimumeEur: round2(TARIFA_BASE_SOLISTA_EUR * splitFractions.vimume),
    };
    const logistics = {
        eurPerKm: LOGISTICA_EUR_PER_KM,
        kmExentos: LOGISTICA_KM_EXENTOS,
        kmHotel: LOGISTICA_KM_HOTEL,
        hotelEur: SUPLEMENTO_HOTEL_EUR,
        horaHotel: HORA_FIN_HOTEL,
    };

    const payload = [
        `base:${TARIFA_BASE_SOLISTA_EUR.toFixed(2)}`,
        `deposit:${DEPOSITO_STRIPE_EUR.toFixed(2)}`,
        `split:${splitFractions.artista.toFixed(4)}/${splitFractions.earOs.toFixed(4)}/${splitFractions.vimume.toFixed(4)}`,
        `splitShow:${splitOnTotalShowEur.artistaEur.toFixed(2)}/${splitOnTotalShowEur.earOsEur.toFixed(2)}/${splitOnTotalShowEur.vimumeEur.toFixed(2)}`,
        `logistica:${logistics.eurPerKm.toFixed(2)}/${logistics.kmExentos}/${logistics.kmHotel}/${logistics.hotelEur.toFixed(2)}/${logistics.horaHotel}`,
        `b2g:${SAFE_LCSP_CEILING_EUR.toFixed(2)}`,
        `spl:${LIMITE_SPL_DB}/${WATTS_PER_PAX}`,
    ].join('|');

    const hashSha256 = createHash('sha256').update(payload, 'utf8').digest('hex');

    return {
        baseEur: TARIFA_BASE_SOLISTA_EUR,
        depositEur: DEPOSITO_STRIPE_EUR,
        splitFractions,
        splitOnTotalShowEur,
        logistics,
        b2gCeilingEur: SAFE_LCSP_CEILING_EUR,
        riderAcustico: { limiterDb: LIMITE_SPL_DB, wattsPerPax: WATTS_PER_PAX },
        hashSha256,
    };
}

function buildScaffold(
    intent: string,
    mode: MythosMode,
    domains: MythosDomain[],
    money: MoneyContract,
    cyberControls: CyberControl[],
    acoustic: AcousticPrescription,
    scorecard: ScorecardItem[],
    files: string[]
): string {
    const splitLabel = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;
    const lines: string[] = [
        '# ═══════════════════════════════════════════════════════════════════',
        '# PROMPT MAESTRO DUAL-DOMAIN · CYBER DEFENSE + BIO-ACOUSTIC',
        '# MYTHOS CLASS v5.1 · DETERMINISTIC · SCORECARD 16/16',
        '# ═══════════════════════════════════════════════════════════════════',
        '',
        '## 🎯 OBJETIVO DE NEGOCIO',
        intent,
        '',
        '## 🧭 NORTH STAR (KPI CUANTIFICABLE)',
        '- Dinero: reserva cerrada con depósito 100 €, split 80/10/10 íntegro y ledger idempotente.',
        `- Seguridad: firma webhook Stripe validada SIEMPRE; sin clave legítima -> 503 (fail-closed).`,
        `- Acústica: rider por contexto "${acoustic.context}" (${acoustic.minDb ?? acoustic.maxDb}-${acoustic.maxDb} dBA) con ancla ${acoustic.publicHealthLimitDb} dB SPL salud pública.`,
        '',
        `## 🧑‍💼 ROL A ASUMIR (${mode})`,
        domains.includes('CYBER_DEFENSE') && domains.includes('BIO_ACOUSTIC')
            ? 'Ingeniero de frontera dual: tesorería blindada (cyber) + cumplimiento acústico adaptativo (bio).'
            : domains.includes('CYBER_DEFENSE')
                ? 'Ingeniero de ciberseguridad defensiva de tesorería (Stripe, SSOT, ledger).'
                : 'Ingeniero bio-acústico de cumplimiento Ley 37/2003 (rider por contexto).',
        '',
        '## 📐 CONTRATOS DE DATOS (FIRMAS EXACTAS — CERO any)',
        `- \`MoneyContract { baseEur: ${money.baseEur.toFixed(2)}; depositEur: ${money.depositEur.toFixed(2)}; splitOnTotalShowEur: ${money.splitOnTotalShowEur.artistaEur.toFixed(2)}/${money.splitOnTotalShowEur.earOsEur.toFixed(2)}/${money.splitOnTotalShowEur.vimumeEur.toFixed(2)}; hashSha256: string }\``,
        '- Server actions / API routes devuelven `{ ok: boolean; error?: string; data?: T }` y nunca lanzan excepciones crudas.',
        '- Rutas dinámicas: `const resolvedParams = await params;`.',
        '',
        '## 🔒 RESTRICCIONES DURAS (SSOT — NUNCA VIOLAR)',
        ...buildBusinessRules().map((r) => `- ${r}`),
        '',
        '## 🛡️ CONTROLES CYBER DEFENSE',
        ...cyberControls.map((c) => `- [${c.level}] ${c.title}: ${c.requirement}`),
        '',
        '## 🔉 PRESCRIPCIÓN BIO-ACOUSTIC',
        `- Contexto: ${acoustic.context} — ${acoustic.minDb ?? acoustic.maxDb}-${acoustic.maxDb} dBA. ${acoustic.note}`,
        `- Anclas innegociables: < ${acoustic.publicHealthLimitDb} dB SPL, ${acoustic.wattsPerPax} W/pax.`,
        '',
        '## 🗂️ ARCHIVOS A TOCAR',
        ...files.map((f) => `- \`${f}\``),
        '',
        '## 🪜 PASOS DE IMPLEMENTACIÓN',
        '1. INSPECCIONAR: lee solo los archivos citados y sus exports/interfaces.',
        '2. CONTRATAR: define tipos y firmas exactas antes de escribir lógica.',
        '3. IMPLEMENTAR: respeta SSOT, fail-closed, idempotencia y estilo OLED.',
        '4. TRAZAR: botón -> handler -> endpoint -> motor SSOT -> persistencia/webhook.',
        '5. VALIDAR: `npx tsc --noEmit` y corregir hasta Exit Code 0.',
        '',
        `## 🧬 MATRIZ DE TRAZABILIDAD (ANTI-FACHADA) · SPLIT ${splitLabel}`,
        '- Depósito -> /api/payments/checkout -> Stripe Price-Lock -> webhook (firma) -> ledger 80/10/10 -> PostgreSQL.',
        '- Prohibidos arrays hardcodeados, botones sin backend o motores simulados.',
        '',
        '## 🛟 ESTRATEGIA DE RECUPERACIÓN',
        '- Stripe error de red: estado de error + reintento con misma idempotency key.',
        '- Webhook tras timeout: procesado asíncrono no bloqueante + DLQ.',
        '- GPU/Ollama fuera de línea: este compilador determinístico SIEMPRE emite DAG.',
        '',
        '## ⛔ PROHIBICIONES',
        `- Prohibido alterar Split ${splitLabel} o depósito de ${money.depositEur.toFixed(2)} €.`,
        '- Prohibido re-hardcodear `verified:true`; secretos solo en servidor.',
        '- Prohibido w-screen, grises lavados y gradientes AI-slop.',
        '',
        '## ✅ CRITERIO DE CIERRE ATÓMICO (SCORECARD 16/16)',
        ...scorecard.map((s) => `${s.layer === 'CORE' ? 'CORE' : s.layer} ${s.id}: ${s.check}`),
    ];

    return lines.join('\n');
}

export function compileMythosIntent(
    input: string,
    options: MythosCompileOptions = { mode: 'FULL_STACK' }
): MythosCompileResult {
    const clean = input.trim() || '(intención vacía)';
    const lower = clean.toLowerCase();
    const mode: MythosMode = options.mode ?? 'FULL_STACK';

    const domains = detectDomains(lower);
    const cyberControls = buildCyberControls(lower);
    const acoustic = resolveAcoustic(lower);
    const scorecard = buildScorecard(acoustic);
    const money = deriveMoneyContract();
    const files = inferFiles(domains, lower);

    const slug = slugify(clean);
    const taskId = `mythos-${slug}-${Date.now().toString().slice(-4)}`;

    const action = lower.includes('boda') || lower.includes('finca')
        ? 'Rider acústico de bodas/fincas + tesorería Stripe con firma y ledger idempotente 80/10/10.'
        : clean;

    const validation = 'npx tsc --noEmit -> Exit Code 0';
    const scaffold = buildScaffold(clean, mode, domains, money, cyberControls, acoustic, scorecard, files);

    const task: MythosTaskContract = {
        id: taskId,
        title: `M5.1 Dual: ${clean.slice(0, 55)}${clean.length > 55 ? '...' : ''}`,
        status: 'QUEUED',
        description: clean,
        files,
        action,
        scaffold,
        done_when: validation,
        validation,
        domains,
        scorecard,
        moneyHash: money.hashSha256,
    };

    const splitLabel = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;
    const filesYaml = files.map((f) => `    - "${f}"`).join('\n');
    const domainsYaml = domains.map((d) => `    - ${d}`).join('\n');
    const scorecardYaml = scorecard
        .map((s) => `    - "[${s.layer}] ${s.check.replace(/"/g, '\\"')}"`)
        .join('\n');

    const yaml = [
        '# ═══════════════════════════════════════════════════════════════════',
        '# PROTOCOL: MYTHOS_DUAL_DOMAIN_v5.1 [DETERMINISTIC]',
        '# CYBER_DEFENSE + BIO_ACOUSTIC',
        '# ═══════════════════════════════════════════════════════════════════',
        `TASK_ID: "${taskId}"`,
        `DOMAINS:`,
        domainsYaml,
        '',
        'MONEY_CONTRACT:',
        `  base_eur: ${money.baseEur.toFixed(2)}`,
        `  deposit_eur: ${money.depositEur.toFixed(2)}`,
        `  split_on_total_show_eur: ${money.splitOnTotalShowEur.artistaEur.toFixed(2)} / ${money.splitOnTotalShowEur.earOsEur.toFixed(2)} / ${money.splitOnTotalShowEur.vimumeEur.toFixed(2)}`,
        `  split_label: ${splitLabel}`,
        `  hash_sha256: ${money.hashSha256}`,
        '',
        'FILES_TO_TOUCH:',
        filesYaml,
        '',
        'CYBER_CONTROLS:',
        ...cyberControls.map((c) => `    - "[${c.level}] ${c.id}: ${c.requirement.replace(/"/g, '\\"')}"`),
        '',
        'BIO_ACOUSTIC:',
        `    - "${acoustic.context} — ${acoustic.minDb ?? acoustic.maxDb}-${acoustic.maxDb} dBA (${acoustic.note})"`,
        `    - "salud_publica: < ${acoustic.publicHealthLimitDb} dB SPL, ${acoustic.wattsPerPax} W/pax"`,
        '',
        'SCORECARD_16_16:',
        scorecardYaml,
        '',
        'PASS_CRITERIA:',
        `    - "${validation}"`,
        '',
        'EXECUTION_CHAIN:',
        '    - STEP_1: "INSPECT_CONTRACTS_AND_SSOT"',
        '    - STEP_2: "APPLY_CYBER_AND_BIO_SCAFFOLD"',
        '    - STEP_3: "RUN_TSC_VALIDATION"',
        '    - STEP_4: "ASSERT_EXIT_CODE_ZERO"',
    ].join('\n');

    const estimatedTokens = Math.round(yaml.length / 4);

    return {
        task,
        yaml,
        moneyContract: money,
        cyberControls,
        acoustic,
        scorecard,
        estimatedTokens,
    };
}