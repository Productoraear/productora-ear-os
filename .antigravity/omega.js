import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');
const JOURNAL_FILE = path.join(__dirname, 'OMEGA_STATE_JOURNAL.md');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

function updateJournal(queueData) {
    const completed = queueData.tasks.filter(t => t.status === 'COMPLETED').length;
    const failed = queueData.tasks.filter(t => t.status === 'FAILED').length;
    const queued = queueData.tasks.filter(t => t.status === 'QUEUED').length;

    const journalContent = `# 🧠 OMEGA STATE JOURNAL (MEMORIA PERSISTENTE)
> **Última actualización:** ${new Date().toISOString()}

## ESTADO DE LA WAVE ACTUAL
- Pendientes (QUEUED): ${queued}
- Completadas (COMPLETED): ${completed} (Auto-purgado activo)
- Fallidas (FAILED): ${failed}

## 🛡️ SISTEMA ANTI-REINICIOS (CRASH RECOVERY)
Todo el progreso está guardado y validado. Para continuar, ejecuta \`node .antigravity/omega.js next\`.
`;
    fs.writeFileSync(JOURNAL_FILE, journalContent, 'utf8');
}

const command = process.argv[2];

if (command === 'next') {
    const data = readJSON(QUEUE_FILE);

    // Auto-purga más agresiva: Cada 5 tareas para proteger la GPU
    const completedTasks = data.tasks.filter(t => t.status === 'COMPLETED');
    if (completedTasks.length >= 5) {
        console.log(`[⚡ OMEGA ENGINE] Limpieza Táctica Extrema: Purgando ${completedTasks.length} tareas completadas...`);
        data.tasks = data.tasks.filter(t => t.status !== 'COMPLETED');
        writeJSON(QUEUE_FILE, data);
    }

    updateJournal(data);

    const nextTask = data.tasks.find(t => t.status === 'QUEUED');
    if (!nextTask) {
        console.log("🏁 WAVE COMPLETADA AL 100%. No quedan tareas en cola.");
        console.log("Notifica a Antigravity para inyectar la siguiente Wave.");
        process.exit(0);
    }

    console.log("\n=== ⚡ OBJETIVO ASIGNADO (MODO S-CLASS) ⚡ ===");
    console.log(`ID:      ${nextTask.id}`);
    console.log(`TÍTULO:  ${nextTask.title}`);
    console.log(`ARCHIVO: ${nextTask.files.join(', ')}`);
    console.log(`ACCIÓN:  ${nextTask.action}`);
    console.log("==============================================");
    console.log(`[🤖 OBRERO] -> 1. Analiza el archivo. 2. Modifica con EXCELENCIA. 3. Ejecuta: node .antigravity/omega.js complete ${nextTask.id}`);

} else if (command === 'complete') {
    const taskId = process.argv[3];
    if (!taskId) {
        console.error("❌ Falta el ID de la tarea. Uso: node .antigravity/omega.js complete <ID>");
        process.exit(1);
    }

    console.log("[🛡️ OMEGA ENGINE] Validando Typescript (S-Class Standard)...");
    try {
        const cwd = path.join(__dirname, '..');
        execSync('npx tsc --noEmit', { stdio: 'inherit', shell: true, cwd });
        console.log("✅ Validación S-Class EXITOSA.");

        const data = readJSON(QUEUE_FILE);
        const taskIndex = data.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            console.error(`❌ Tarea ${taskId} no encontrada.`);
            process.exit(1);
        }

        data.tasks[taskIndex].status = 'COMPLETED';
        writeJSON(QUEUE_FILE, data);
        updateJournal(data);

        console.log(`\n🚀 TAREA ${taskId} SELLADA Y REGISTRADA EN LA BLOCKCHAIN INTERNA.`);
        console.log("⚠️ ATENCIÓN OBRERO: PARA PREVENIR COLAPSO DE CONTEXTO (ZTM):");
        console.log("   1. DETENTE AHORA MISMO.");
        console.log("   2. PULSA EL BOTÓN '+' (NEW TASK) EN CLINE.");
        console.log("   3. PEGA TU MANIFIESTO (CLINE_PROMPT_TEMPLATE.md) PARA INICIAR LA SIGUIENTE TAREA EN LIMPIO.");

    } catch (error) {
        console.error("\n❌ ALARMA: CÓDIGO MEDIOCRE O ROTO.");
        console.error("El obrero DEBE corregir los errores mostrados arriba y volver a ejecutar 'node .antigravity/omega.js complete " + taskId + "'.");
        process.exit(1);
    }
} else {
    console.log("Comando desconocido. Usa 'next' o 'complete <ID>'.");
}
