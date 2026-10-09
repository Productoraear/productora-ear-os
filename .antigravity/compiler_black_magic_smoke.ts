/**
 * BLACK-MAGIC EDITION — SMOKE EXTENDIDO DETERMINÍSTICO (sin GPU).
 * Ejercita el Forge v3.0 en los 5 dominios + transversal y verifica:
 *   - Las 7 capas del manifiesto (NORTH STAR, CONTRATOS, ARQUITECTURA,
 *     CASOS LÍMITE, MATRIZ DE TRAZABILIDAD, RECUPERACIÓN, DOD 8/8).
 *   - Derivación estricta desde SSOT canónico (split, depósito, rider).
 *   - Ciclo Forja -> DAG -> contrato Omega (masterPromptOverride).
 */
import { forgeMasterPrompt } from '../src/lib/compiler/prompt-maestro-forge';
import { compileIntentToDAG } from '../src/lib/compiler/omega-intent-compiler';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SUPLEMENTO_HOTEL_EUR,
    LOGISTICA_KM_HOTEL,
    HORA_FIN_HOTEL,
    SAFE_LCSP_CEILING_EUR,
    LIMITE_SPL_DB,
    WATTS_PER_PAX,
    SPLIT_SOBERANO
} from '../src/lib/constants/ear-os-ssot';

const SPLIT = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;

interface CaseDef {
    intent: string;
    domain: string;
    expect: string[];
}

const CASES: CaseDef[] = [
    {
        intent: 'Blindar la reserva del solista con depósito Stripe y logística Méntrida',
        domain: 'tesoreria',
        expect: ['calcularLogistica', 'ReservaSolistaInput', `Depósito inmutable: ${DEPOSITO_STRIPE_EUR.toFixed(2)} €`, `Split ${SPLIT}`]
    },
    {
        intent: 'Portal de fincas y bodas con teléfonos reales verificados',
        domain: 'fincas',
        expect: ['FincaRecord', 'verified:false', 'finca-partnership']
    },
    {
        intent: 'Licitar pliegos B2G para centros senior VIMUME',
        domain: 'vimume',
        expect: ['LicitacionB2G', `RiderAcustico { splDb: ${LIMITE_SPL_DB}`, `${SAFE_LCSP_CEILING_EUR.toFixed(2)}`]
    },
    {
        intent: 'Call center omnicanal con despacho a WhatsApp',
        domain: 'callcenter',
        expect: ['LeadIntake', '+34 693 693 048', 'call-center-intake']
    },
    {
        intent: 'Armonizar la navegación global del sistema',
        domain: 'transversal',
        expect: ['TResultado', 'Server Components por defecto']
    }
];

const REQUIRED_LAYERS = [
    'NORTH STAR',
    'CONTRATOS DE DATOS',
    'ARQUITECTURA',
    'CASOS LÍMITE',
    'MATRIZ DE TRAZABILIDAD',
    'ESTRATEGIA DE RECUPERACIÓN',
    'DOD SCORECARD 8/8'
];

async function main(): Promise<void> {
    const failures: string[] = [];
    const passes: string[] = [];

    for (const c of CASES) {
        const forged = await forgeMasterPrompt({ intent: c.intent, mode: 'ARQUITECTO', forceDeterministic: true });

        // 1. Las 7 capas siempre presentes.
        for (const layer of REQUIRED_LAYERS) {
            if (!forged.masterPrompt.includes(layer)) {
                failures.push(`[${c.domain}] falta capa ${layer}`);
            }
        }

        // 2. Contratos/casos específicos del dominio.
        for (const token of c.expect) {
            if (!forged.masterPrompt.includes(token)) {
                failures.push(`[${c.domain}] falta token esperado: ${token}`);
            }
        }

        // 3. DOD 8/8 con split, depósito y rider intactos.
        for (const guard of [`Split ${SPLIT} intacto`, `Depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € intacto`, `${WATTS_PER_PAX} W/pax`, `< ${LIMITE_SPL_DB} dB SPL`]) {
            if (!forged.masterPrompt.includes(guard)) {
                failures.push(`[${c.domain}] DOD 8/8 sin guardia: ${guard}`);
            }
        }

        // 4. Ciclo Forja -> DAG (masterPromptOverride -> scaffold canónico Omega).
        const dag = await compileIntentToDAG(c.intent, {
            mode: 'OMEGA_FULLSTACK',
            engine: 'CLOUD',
            skipOllamaArchitect: true,
            masterPromptOverride: forged.masterPrompt
        });
        if (dag.jsonTask.scaffold !== forged.masterPrompt) {
            failures.push(`[${c.domain}] scaffold DAG no arrastra el Prompt Maestro`);
        }
        if (!dag.jsonTask.done_when.includes('tsc')) {
            failures.push(`[${c.domain}] done_when sin validación tsc`);
        }

        passes.push(`${c.domain}:7capas+contratos+dag`);
    }

    // 5. Invariantes SSOT numéricos (cero valores mágicos).
    const asserts: Array<[string, boolean]> = [
        [`tarifa base solista = ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €`, TARIFA_BASE_SOLISTA_EUR === 350.0],
        [`depósito inmutable = ${DEPOSITO_STRIPE_EUR.toFixed(2)} €`, DEPOSITO_STRIPE_EUR === 100.0],
        [`logística ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde km ${LOGISTICA_KM_EXENTOS}`, LOGISTICA_EUR_PER_KM === 1.5 && LOGISTICA_KM_EXENTOS === 50],
        [`hotel +${SUPLEMENTO_HOTEL_EUR.toFixed(0)} € (fin >= ${HORA_FIN_HOTEL}:00 o > ${LOGISTICA_KM_HOTEL} km)`, SUPLEMENTO_HOTEL_EUR === 120 && HORA_FIN_HOTEL === 3 && LOGISTICA_KM_HOTEL === 200],
        [`techo B2G preventivo = ${SAFE_LCSP_CEILING_EUR.toFixed(2)} €`, SAFE_LCSP_CEILING_EUR === 14250.0],
        [`rider ${WATTS_PER_PAX} W/pax y < ${LIMITE_SPL_DB} dB SPL`, WATTS_PER_PAX === 12 && LIMITE_SPL_DB === 75],
        [`split inmutable = ${SPLIT}`, SPLIT === '80/10/10']
    ];
    for (const [label, ok] of asserts) {
        if (!ok) failures.push(`Invariante SSOT roto: ${label}`);
    }

    if (failures.length > 0) {
        console.error('FAIL');
        failures.forEach((f) => console.error('  - ' + f));
        process.exit(1);
    }

    console.log('PASS — BLACK-MAGIC EDITION');
    passes.forEach((p) => console.log('  ✅ ' + p));
    asserts.forEach(([label]) => console.log('  ✅ ' + label));
}

void main();