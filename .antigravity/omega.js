import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');
const MISSION_FILE = path.join(__dirname, 'MISSION_ACTIVE.json'); // El obrero lee SOLO esto
const JOURNAL_FILE = path.join(__dirname, 'OMEGA_STATE_JOURNAL.md');
// Registro de autoridad del Arquitecto (ARCHITECT_DIRECTIVE_SOTA_2026 §1.1).
// Si existe y exige firma, `complete` NO cierra nada sin aprobación externa.
const APPROVAL_FILE = path.join(__dirname, 'ARCHITECT_APPROVAL.json');
/** Raíz del repo: .antigravity/ están un nivel por debajo. */
const REPO_ROOT = path.join(__dirname, '..');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

/**
 * VOCABULARIO CANÓNICO DE ESTADOS (WAVE 53 · ORDEN A).
 * DEFECTO CORREGIDO: `next` exigía status === 'QUEUED' (línea 55) mientras `complete`
 * expulsaba la tarea de `tasks` y la escribía en `completed[]` con status 'COMPLETED'
 * (línea 173), estado que `next` jamás leía. Resultado: el selector nunca veía la tarea
 * cerrada y un re-`complete` caía en la rama de idempotencia con Exit 0 SIN ejecutar pruebas.
 * Ahora la tarea sale de `tasks` de forma atómica y el estado terminal vive en `completed[]`.
 */
/** Estados con los que una tarea queda CERRADA. */
const TERMINAL_STATES = new Set(['COMPLETED', 'COMPLETED_REAL', 'DONE']);
/** Estados ejecutables por el obrero. */
const EXECUTABLE_STATES = new Set(['QUEUED', 'PENDING', 'NOT_STARTED']);

/** ¿Está la tarea ya cerrada en el array `completed[]` (fuente de verdad terminal)? */
function isTerminalInArchive(data, taskId) {
    const archive = Array.isArray(data.completed) ? data.completed : [];
    return archive.some(c => c && c.id === taskId && c.exit_code === 0);
}

/** Ids cerrados con Exit 0: no pueden volver a ser seleccionados como misión. */
function terminalIds(data) {
    const archive = Array.isArray(data.completed) ? data.completed : [];
    return new Set(archive.filter(c => c && c.exit_code === 0).map(c => c.id));
}

/**
 * ARCHIVA (nunca destruye) las tareas terminales que siguen dentro de `tasks`.
 * INCIDENTE WAVE 53: una versión previa de `next` las purgaba sin archivarlas y perdió
 * `files`, `action` y `status_evidence` de 3 tareas COMPLETED_REAL auditadas. Aquí se
 * copian a `completed[]` ANTES de salir de `tasks`, conservando su evidencia completa.
 */
function archiveTerminalTasks(data) {
    const closed = terminalIds(data);
    const terminales = data.tasks.filter(t => TERMINAL_STATES.has(t.status) || closed.has(t.id));
    if (terminales.length === 0) return 0;
    if (!Array.isArray(data.completed)) data.completed = [];
    for (const t of terminales) {
        const idxArch = data.completed.findIndex(c => c && c.id === t.id);
        const entry = {
            ...t,
            status: 'COMPLETED',
            exit_code: 0,
            archived_at: new Date().toISOString(),
            archived_by: 'omega.js next (archivado con evidencia, sin destruccion)'
        };
        if (idxArch !== -1) data.completed[idxArch] = { ...data.completed[idxArch], ...entry };
        else data.completed.unshift(entry);
    }
    data.tasks = data.tasks.filter(t => !terminales.includes(t));
    return terminales.length;
}

/** Recuento por estado medido sobre el array vivo (nunca sobre `_meta`). */
function countByStatus(tasks) {
    const by = {};
    for (const t of tasks) by[t.status] = (by[t.status] ?? 0) + 1;
    return by;
}

/** Refresca `_meta` con la MEDICIÓN real (conciliación con audit:queue-counters). */
function syncMeta(data) {
    const by = countByStatus(data.tasks);
    const pendingExecutable = data.tasks.filter(t => EXECUTABLE_STATES.has(t.status)).length;
    // `completed_real` debe medirse EXACTAMENTE como lo mide audit_queue_counter_integrity.cjs:
    // entradas de tasks[] con status COMPLETED_REAL. Las archivadas en completed[] son HISTÓRICO
    // y se reportan aparte; contarlas aquí producía un falso 5 vs 0 (divergencia real detectada
    // por la puerta de prepush en esta misma sesión).
    const completedReal = by.COMPLETED_REAL ?? 0;
    for (const metaKey of ['_meta', 'metadata']) {
        const meta = data[metaKey];
        if (meta !== null && typeof meta === 'object') {
            meta.total_pending = pendingExecutable;
            meta.total_completed_real = completedReal;
            meta.total_blocked_ceo = (by.BLOCKED_CEO ?? 0);
            meta.total_w53_career_os = data.tasks.filter(t => t.status === 'PENDING' && String(t.id).startsWith('W53_')).length;
            meta.total_tasks = data.tasks.length + completedReal;
            meta.last_updated = new Date().toISOString();
            meta.meta_reconciled_at = meta.last_updated;
            meta.meta_measurement = 'omega.js · recuento por estado sobre el array tasks (fuente única de verdad)';
        }
    }
    return by;
}

function updateJournal(data) {
    const by = countByStatus(data.tasks);
    const c = by.COMPLETED_REAL ?? 0;
    const f = by.FAILED ?? 0;
    const q = by.QUEUED ?? 0;
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
        test: task.test ?? null,
        validate: 'node ./node_modules/typescript/bin/tsc --noEmit && node ./node_modules/eslint/bin/eslint.js <files>',
        complete: `call RUN_OMEGA.bat complete ${task.id}`,
        budget: 'MAX 12 lecturas de archivo. No releas lo ya leido. DETENTE al completar.'
    });
}

const command = process.argv[2];

// ─── COMANDO: next ───────────────────────────────────────────────────────────
if (command === 'next') {
    const data = readJSON(QUEUE_FILE);

    // Purga inmediata de tareas TERMINALES (status terminal O ya archivadas en completed[]).
    // WAVE 53 / ORDEN A: antes solo se purgaba status === 'COMPLETED' en `tasks`, así que una
    // tarea cerrada (archivada en `completed[]`) podía seguir siendo seleccionable como misión.
    // WAVE 53 / CORRECCIÓN: ahora se ARCHIVAN con su evidencia completa antes de salir de `tasks`.
    const archivadas = archiveTerminalTasks(data);
    if (archivadas > 0) {
        console.log(`[OMEGA] Purga ZTM: ${archivadas} tareas terminales archivadas en completed[] (evidencia preservada).`);
    }
    syncMeta(data);
    writeJSON(QUEUE_FILE, data);

    updateJournal(data);

    // Selección: primera tarea EJECUTABLE no archivada. Queued-first para respetar prioridad explícita.
    const closed = terminalIds(data);
    const executable = data.tasks.filter(t => EXECUTABLE_STATES.has(t.status) && !closed.has(t.id));
    const prioritized = executable.filter(t => t.status === 'QUEUED');
    const next = prioritized[0] ?? executable[0] ?? null;
    if (!next) {
        if (fs.existsSync(MISSION_FILE)) fs.unlinkSync(MISSION_FILE);
        console.log('WAVE COMPLETADA. Cola vacia. Pide a Antigravity la siguiente Wave.');
        process.exit(0);
    }
    if (next.status !== 'QUEUED') {
        console.log(`[OMEGA] ATENCION: ${next.id} estaba en "${next.status}" (no QUEUED). Se selecciona por contrato de estados, no por promocion ciega.`);
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
        ' 5. Valida: node ./node_modules/typescript/bin/tsc --noEmit  ->  debe dar Exit Code 0.',
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

    const data = readJSON(QUEUE_FILE);
    const root = path.join(__dirname, '..');
    const idx = data.tasks.findIndex(t => t.id === taskId);

    // ─── ANTI-FALSO-VERDE (WAVE 53 · ORDEN A) ────────────────────────────────────
    // La rama de idempotencia SOLO es legítima si la tarea está archivada en `completed[]`
    // con exit_code 0. Si no está ni en `tasks` ni en `completed[]`, el ID es fantasma:
    // antes se devolvía Exit 0 "YA COMPLETADA" sin ejecutar ni una prueba (falso desbloqueo).
    if (idx === -1) {
        if (!isTerminalInArchive(data, taskId)) {
            console.error(`\n[OMEGA] ABORTADO: ${taskId} no existe ni en tasks[] ni en completed[] con exit_code 0.`);
            console.error('NO se emite falso verde de idempotencia. Revisa el ID o promueve la tarea a QUEUED.');
            process.exit(1);
        }
        if (fs.existsSync(MISSION_FILE)) fs.unlinkSync(MISSION_FILE);
        console.log(`\n${taskId} -> YA ESTABA COMPLETADA Y ARCHIVADA (IDEMPOTENCIA ACID, evidencia en completed[]).`);
        console.log('---');
        console.log('PACTO ZTM: DETENTE. Cierra esta sesion de Cline.');
        console.log('Abre Start New Task (+) y escribe: node .antigravity/omega.js next');
        console.log('---\n');
        process.exit(0);
    }

    const task = data.tasks[idx];
    // MISSION_ACTIVE debe ser esta tarea: cerrar una misión que nunca fue asignada es fraude de cola.
    if (fs.existsSync(MISSION_FILE)) {
        const active = readJSON(MISSION_FILE);
        if (active && active.id && active.id !== taskId) {
            console.error(`\n[OMEGA] ABORTADO: la mision activa es ${active.id}, no ${taskId}.`);
            console.error('Cierra la mision asignada o ejecuta next para reasignar el slot unico.');
            process.exit(1);
        }
    }

    // ─── CERROJO DE AUTORIDAD (ARCHITECT_DIRECTIVE_SOTA_2026 §1.1 / §5.3) ────────
    // El obrero ya NO puede autoaprobarse. Si existe el registro del Arquitecto con
    // `architect_approval.required === true`, el cierre exige que la tarea figure en
    // `approved[]`. Sin firma: Exit 1 y la tarea NO se archiva.
    if (fs.existsSync(APPROVAL_FILE)) {
        let registry = null;
        try {
            registry = readJSON(APPROVAL_FILE);
        } catch {
            console.error('[OMEGA] ABORTADO: ARCHITECT_APPROVAL.json ilegible. No se cierra sin autoridad verificable.');
            process.exit(1);
        }
        const required = registry && registry.architect_approval && registry.architect_approval.required === true;
        if (required) {
            const approved = Array.isArray(registry.approved) ? registry.approved : [];
            const signed = approved.some(a => a && a.id === taskId);
            if (!signed) {
                const reject = Array.isArray(registry.rejected) ? registry.rejected.find(r => r && r.id === taskId) : null;
                console.error(`\n[OMEGA] CIERRE RECHAZADO: ${taskId} no tiene firma del Arquitecto.`);
                console.error('El Obrero no puede autoaprobar su entrega (worker_self_approval=false).');
                if (reject) console.error(`La tarea figura RECHAZADA: ${reject.reason ?? 'sin motivo declarado'}`);
                console.error('El Arquitecto debe añadir { "id": "' + taskId + '", "approved_at": "<ISO8601>", "by": "Arquitecto" }');
                console.error('a approved[] de .antigravity/ARCHITECT_APPROVAL.json antes de repetir complete.');
                process.exit(1);
            }
        }
    }
    const hasTypeScript = task.files && task.files.some(f => f.endsWith('.ts') || f.endsWith('.tsx'));

    if (hasTypeScript) {
        // BLINDAJE ZTM: los shims de node_modules/.bin pueden no existir (npm --ignore-scripts).
        // 'npx tsc' descargaría el paquete impostor 'tsc' -> se invoca el binario real de TypeScript.
        const tscBin = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
        const tscCmd = fs.existsSync(tscBin)
            ? `"${process.execPath}" "${tscBin}" --noEmit`
            : 'npx --yes typescript tsc --noEmit';
        console.log('[OMEGA] Validando TypeScript...');
        try {
            execSync(tscCmd, { stdio: 'inherit', shell: true, cwd: root });
            console.log('tsc --noEmit = Exit Code 0.');
        } catch {
            console.error('ERRORES TS. Corrige y repite complete.');
            process.exit(1);
        }
        // Scorecard 4bis: eslint Exit 0 sobre los archivos TS de la mision
        const eslintBin = path.join(root, 'node_modules', 'eslint', 'bin', 'eslint.js');
        const eslintCmd = fs.existsSync(eslintBin)
            ? `"${process.execPath}" "${eslintBin}"`
            : 'npx --yes eslint';
        const lintable = task.files.filter(f => /\.(ts|tsx)$/.test(f) && fs.existsSync(path.join(root, f)));
        if (lintable.length) {
            console.log('[OMEGA] Validando ESLint...');
            try {
                execSync(`${eslintCmd} ${lintable.map(f => `"${f}"`).join(' ')}`, { stdio: 'inherit', shell: true, cwd: root });
                console.log('eslint = Exit Code 0.');
            } catch {
                console.error('ERRORES ESLINT. Corrige y repite complete.');
                process.exit(1);
            }
        }
    } else {
        console.log('[OMEGA] Tarea sin archivos TypeScript directos: se omite tsc/eslint.');
    }

    // ─── PRUEBA OBLIGATORIA (SIEMPRE, tenga o no archivos TS) ────────────────────
    // DEFECTO CORREGIDO EN WAVE 50: `task.test` vivía DENTRO de la rama hasTypeScript,
    // así que una tarea de scripts .cjs/.md/.json cerraba con Exit 0 sin ejecutar su
    // verificador (fachada de papel). El antifachada es la prueba, no la extensión.
    // WAVE 53 / ORDEN A: sin `test` declarado NO se cierra (antes solo avisaba y archivaba
    // con exit_code 0, es decir, firmaba una tarea sin evidencia ejecutable).
    if (!task.test || typeof task.test !== 'string' || task.test.trim() === '') {
        console.error('[OMEGA] SIN_EVIDENCIA: la tarea no declara "test". Cierre rechazado, no se archiva.');
        process.exit(1);
    }
    console.log(`[OMEGA] Ejecutando prueba: ${task.test}`);
    try {
        execSync(task.test, { stdio: 'inherit', shell: true, cwd: root });
        console.log('prueba = Exit Code 0.');
    } catch {
        console.error('PRUEBA FALLIDA. Corrige y repite complete.');
        process.exit(1);
    }

    // Eliminar misión activa
    if (fs.existsSync(MISSION_FILE)) fs.unlinkSync(MISSION_FILE);

    // Registrar la tarea en completed con timestamp forense y evidencia del comando ejecutado
    if (!data.completed) data.completed = [];
    const completedEntry = {
        id: task.id,
        title: task.title,
        status: 'COMPLETED',
        exit_code: 0,
        test: task.test,
        completed_at: new Date().toISOString()
    };
    // Preservar la superficie verificable de la tarea: sin `files` ni `elevation_contract`
    // el auditor `audit_elevation_task_harness.cjs --task=<ID>` no puede re-verificar la
    // entrega DESPUES del cierre (informaba "la tarea no declara files" sobre una tarea ya
    // archivada). Se copian solo si existen; no se inventan campos.
    if (Array.isArray(task.files)) completedEntry.files = task.files;
    if (task.elevation_contract && typeof task.elevation_contract === 'object') {
        completedEntry.elevation_contract = task.elevation_contract;
    }
    const existingIdx = data.completed.findIndex(c => c.id === task.id);
    if (existingIdx !== -1) {
        data.completed[existingIdx] = completedEntry;
    } else {
        data.completed.unshift(completedEntry);
    }

    // Purgar de tasks pendientes y conciliar contadores con la MEDICIÓN (no con tasks.length,
    // que incluía BLOCKED_CEO y demás estados no ejecutables y desincronizaba _meta.total_pending).
    data.tasks.splice(idx, 1);
    syncMeta(data);
    writeJSON(QUEUE_FILE, data);
    updateJournal(data);

    console.log(`\n${taskId} -> COMPLETADA Y PURGADA.`);
    console.log('---');
    console.log('PACTO ZTM: DETENTE. Cierra esta sesion de Cline.');
    console.log('Abre Start New Task (+) y escribe: node .antigravity/omega.js next');
    console.log('---\n');

    // ─── COMANDO: status (auditoria CEO — solo para Antigravity) ─────────────────
} else if (command === 'audit') {
    // ─── COMANDO: audit --elevation-spec=<ruta> (MANDATO DEL ARQUITECTO) ────────
    // ARCHITECT_DIRECTIVE_SOTA_2026 §5. `omega.js` no reimplementa la reauditoría:
    // delega en scripts/omega_elevation_apply.cjs, que es el instrumento real
    // (ledger EP-4 + contratos de cola + revocación de autoaprobación).
    // Antes de este cableado, `audit` caía en el `else` final: imprimía la ayuda y
    // salía 0 sin auditar nada — exactamente el verde por defecto que prohíbe AF-5.
    const elevationSpec = process.argv.find((a) => a.startsWith('--elevation-spec='));
    if (!elevationSpec) {
        console.error('USO: node .antigravity/omega.js audit --elevation-spec=<ruta .md> [--dry-run]');
        console.error('     Sin --elevation-spec NO se audita: no se emite verde por defecto (AF-5).');
        process.exit(2);
    }
    const elevationScript = path.join(REPO_ROOT, 'scripts', 'omega_elevation_apply.cjs');
    if (!fs.existsSync(elevationScript)) {
        console.error('SIN_EVIDENCIA: scripts/omega_elevation_apply.cjs no existe en disco.');
        process.exit(1);
    }
    const elevationArgs = process.argv.slice(3).map(a => `"${a.replace(/"/g, '')}"`).join(' ');
    try {
        execSync(`"${process.execPath}" "${elevationScript}" ${elevationArgs}`, { stdio: 'inherit', cwd: REPO_ROOT });
    } catch (error) {
        process.exit(typeof error.status === 'number' ? error.status : 1);
    }
    process.exit(0);

} else if (command === 'status') {
    const data = readJSON(QUEUE_FILE);
    const closed = terminalIds(data);
    const byStatus = countByStatus(data.tasks);
    console.log('\nESTADO WAVE:');
    for (const [k, v] of Object.entries(byStatus)) console.log(`  ${k}: ${v}`);
    const pending = data.tasks.filter(t => EXECUTABLE_STATES.has(t.status) && !closed.has(t.id));
    const pendingExecutable = pending.length;
    const declared = (data._meta ?? data.metadata ?? {}).total_pending;
    console.log(`\ntasks vivas: ${data.tasks.length} | pendientes ejecutables: ${pendingExecutable} | _meta.total_pending: ${declared ?? '<ausente>'}`);
    console.log(`QUEUE_COUNTERS=${declared === pendingExecutable ? 'CONSISTENT' : 'DRIFT'}`);
    if (pending.length) {
        console.log('\nProximas:');
        pending.slice(0, 5).forEach((t, i) => console.log(`  ${i + 1}. ${t.id} [${t.status}] — ${t.title}`));
    }
    console.log('');

} else {
    console.log("Comandos: 'next' | 'complete <ID>' | 'status' | 'audit --elevation-spec=<ruta>'");
}
