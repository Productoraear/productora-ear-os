import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');
const MISSION_FILE = path.join(__dirname, 'MISSION_ACTIVE.json'); // El obrero lee SOLO esto
const JOURNAL_FILE = path.join(__dirname, 'OMEGA_STATE_JOURNAL.md');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

function updateJournal(data) {
    const c = data.tasks.filter(t => t.status === 'COMPLETED').length;
    const f = data.tasks.filter(t => t.status === 'FAILED').length;
    const q = data.tasks.filter(t => t.status === 'QUEUED').length;
    fs.writeFileSync(JOURNAL_FILE,
        `# OMEGA STATE JOURNAL\n> ${new Date().toISOString()}\n- QUEUED: ${q}  |  COMPLETED: ${c}  |  FAILED: ${f}\n- Continuar: \`node .antigravity/omega.js next\`\n`, 'utf8');
}

/** Emite MISSION_ACTIVE.json con SOLO los campos necesarios para el obrero (<800 bytes) */
function writeMission(task) {
    writeJSON(MISSION_FILE, {
        id: task.id,
        title: task.title,
        files: task.files,
        action: task.action,
        scaffold: task.scaffold ?? null,
        done_when: task.done_when ?? null,
        validate: 'npx tsc --noEmit',
        complete: `node .antigravity/omega.js complete ${task.id}`,
        budget: 'MAX 12 lecturas de archivo. No releas lo ya leido. DETENTE al completar.'
    });
}

const command = process.argv[2];

// ─── COMANDO: next ───────────────────────────────────────────────────────────
if (command === 'next') {
    const data = readJSON(QUEUE_FILE);

    // Purga inmediata de COMPLETED para mantener el queue lean
    const antes = data.tasks.length;
    data.tasks = data.tasks.filter(t => t.status !== 'COMPLETED');
    if (data.tasks.length < antes) {
        writeJSON(QUEUE_FILE, data);
        console.log(`[OMEGA] Purga ZTM: ${antes - data.tasks.length} tareas purgadas.`);
    }

    updateJournal(data);

    const next = data.tasks.find(t => t.status === 'QUEUED');
    if (!next) {
        if (fs.existsSync(MISSION_FILE)) fs.unlinkSync(MISSION_FILE);
        console.log('WAVE COMPLETADA. Cola vacia. Pide a Antigravity la siguiente Wave.');
        process.exit(0);
    }

    writeMission(next);

    // ─── PROMPT DE ARRANQUE ATÓMICO ZTM ──────────────────────────────────────
    // Bloquea TODA exploración: Cline debe leer SOLO MISSION_ACTIVE.json y ejecutar.
    const PROMPT = [
        '',
        '══════════ PROMPT DE ARRANQUE ATOMICO ZTM (BLOQUEO TOTAL DE EXPLORACION) ══════════',
        'MISION: ' + next.id + ' — ' + next.title,
        'ARCHIVOS AUTORIZADOS: ' + next.files.join(', '),
        '',
        'ORDEN DE EJECUCION ESTRICTA (NO TE DESVIES NI UN PASO):',
        ' 1. Lee UNICAMENTE .antigravity/MISSION_ACTIVE.json con read_file (UNA sola vez).',
        ' 2. PROHIBIDO explorar el repo, listar directorios o leer cualquier otro archivo.',
        '    No uses list_files. No uses search_files. No abras tasks_queue.json ni HISTORY.',
        ' 3. Ejecuta EXACTAMENTE lo descrito en los campos "action" y "scaffold".',
        ' 4. Edita SOLO los archivos listados en "files" (write_to_file o replace_in_file).',
        '    Si el scaffold exige leer un archivo, lee UNICAMENTE ese archivo de "files".',
        ' 5. Valida: npx tsc --noEmit  ->  debe dar Exit Code 0.',
        ' 6. Cierra: node .antigravity/omega.js complete ' + next.id,
        ' 7. Tras el complete con Exit Code 0, DETENTE INMEDIATAMENTE. No ejecutes "next".',
        '',
        'REGLA DE ORO: contexto minimo = coste minimo. Cero inventiva, cero exploracion.',
        '═══════════════════════════════════════════════════════════════════════════════════',
        ''
    ].join('\n');
    console.log(PROMPT);

    // ─── COMANDO: complete <ID> ──────────────────────────────────────────────────
} else if (command === 'complete') {
    const taskId = process.argv[3];
    if (!taskId) {
        console.error('Error: node .antigravity/omega.js complete <ID>');
        process.exit(1);
    }

    console.log('[OMEGA] Validando TypeScript...');
    try {
        execSync('npx tsc --noEmit', { stdio: 'inherit', shell: true, cwd: path.join(__dirname, '..') });
        console.log('tsc --noEmit = Exit Code 0.');
    } catch {
        console.error('ERRORES TS. Corrige y repite complete.');
        process.exit(1);
    }

    const data = readJSON(QUEUE_FILE);
    const idx = data.tasks.findIndex(t => t.id === taskId);
    if (idx === -1) {
        // Idempotencia S-Class: si ya fue purgada o completada previamente, dar éxito
        if (fs.existsSync(MISSION_FILE)) fs.unlinkSync(MISSION_FILE);
        console.log(`\n${taskId} -> YA ESTABA COMPLETADA Y PURGADA (IDEMPOTENCIA ACID).`);
        console.log('---');
        console.log('PACTO ZTM: DETENTE. Cierra esta sesion de Cline.');
        console.log('Abre Start New Task (+) y escribe: node .antigravity/omega.js next');
        console.log('---\n');
        process.exit(0);
    }

    // Eliminar misión activa
    if (fs.existsSync(MISSION_FILE)) fs.unlinkSync(MISSION_FILE);

    // Purgar la tarea completada directamente (no guardar COMPLETED en cola)
    data.tasks.splice(idx, 1);
    writeJSON(QUEUE_FILE, data);
    updateJournal(data);

    console.log(`\n${taskId} -> COMPLETADA Y PURGADA.`);
    console.log('---');
    console.log('PACTO ZTM: DETENTE. Cierra esta sesion de Cline.');
    console.log('Abre Start New Task (+) y escribe: node .antigravity/omega.js next');
    console.log('---\n');

    // ─── COMANDO: status (auditoria CEO — solo para Antigravity) ─────────────────
} else if (command === 'status') {
    const data = readJSON(QUEUE_FILE);
    const byStatus = {};
    for (const t of data.tasks) byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
    console.log('\nESTADO WAVE:');
    for (const [k, v] of Object.entries(byStatus)) console.log(`  ${k}: ${v}`);
    const pending = data.tasks.filter(t => t.status === 'QUEUED');
    if (pending.length) {
        console.log('\nProximas:');
        pending.slice(0, 5).forEach((t, i) => console.log(`  ${i + 1}. ${t.id} — ${t.title}`));
    }
    console.log('');

} else {
    console.log("Comandos: 'next' | 'complete <ID>' | 'status'");
}
