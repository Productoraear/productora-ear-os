/**
 * PRUEBA DE CONTRATO DETERMINÍSTICA (sin GPU) del Meta-Compilador.
 * Valida: Oráculo -> Forja -> DAG -> contrato canónico Omega (anti-fachada).
 */
import { refineQueryWithOracle } from '../src/lib/oracle/quantum-oracle-engine';
import { forgeMasterPrompt } from '../src/lib/compiler/prompt-maestro-forge';
import { compileIntentToDAG } from '../src/lib/compiler/omega-intent-compiler';

async function main(): Promise<void> {
    const intent = 'Blindar el flujo de reserva del solista con depósito Stripe y split soberano';
    const oracle = refineQueryWithOracle(intent, 'CEO');
    const forged = await forgeMasterPrompt({ intent, mode: 'ARQUITECTO', forceDeterministic: true });
    const dag = await compileIntentToDAG(intent, {
        mode: 'OMEGA_FULLSTACK',
        engine: 'CLOUD',
        skipOllamaArchitect: true,
        masterPromptOverride: forged.masterPrompt
    });

    const jt = dag.jsonTask;
    const failures: string[] = [];

    if (jt.status !== 'QUEUED') failures.push('status debe ser QUEUED');
    if (!Array.isArray(jt.files) || jt.files.length === 0) failures.push('files vacío (fachada)');
    if (typeof jt.scaffold !== 'string' || jt.scaffold.length < 50) failures.push('scaffold degradado');
    if (jt.scaffold !== forged.masterPrompt) failures.push('scaffold no arrastra el Prompt Maestro forjado');
    if (typeof jt.done_when !== 'string' || !jt.done_when.includes('tsc')) failures.push('done_when sin validación tsc');
    if (!forged.masterPrompt.includes('NORTH STAR')) failures.push('Prompt maestro sin NORTH STAR (KPI)');
    if (!forged.masterPrompt.includes('CONTRATOS DE DATOS')) failures.push('Prompt maestro sin contratos de datos con firmas');
    if (!forged.masterPrompt.includes('MATRIZ DE TRAZABILIDAD')) failures.push('Prompt maestro sin matriz de trazabilidad');
    if (!forged.masterPrompt.includes('ESTRATEGIA DE RECUPERACIÓN')) failures.push('Prompt maestro sin estrategia de recuperación');
    if (!forged.masterPrompt.includes('DOD SCORECARD 8/8')) failures.push('Prompt maestro sin DOD SCORECARD 8/8');
    if (!forged.masterPrompt.includes('calcularLogistica')) failures.push('Prompt maestro sin firma de contrato calcularLogistica');
    if (!forged.masterPrompt.includes('OBJETIVO DE NEGOCIO')) failures.push('Prompt maestro sin sección de objetivo');
    if (oracle.tacticalLevers.length < 3) failures.push('Oráculo sin palancas tácticas');

    if (failures.length > 0) {
        console.error('FAIL');
        failures.forEach((f) => console.error('  - ' + f));
        process.exit(1);
    }

    console.log('PASS');
    console.log('  files=' + jt.files.length + ' status=' + jt.status);
    console.log('  scaffold_chars=' + jt.scaffold.length + ' traza=' + (forged.masterPrompt.includes('MATRIZ DE TRAZABILIDAD') ? 'ok' : 'no'));
    console.log('  done_when=' + jt.done_when);
}

void main();