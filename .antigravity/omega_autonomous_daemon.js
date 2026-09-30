import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');
const JOURNAL_FILE = path.join(__dirname, 'OMEGA_STATE_JOURNAL.md');
const OLLAMA_URL = 'http://localhost:11434/api/chat';
const MODEL_NAME = 'ear-27b-apis-ctx20480:latest';

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

function updateJournal(queueData, currentTask, statusMessage) {
    const completed = queueData.tasks.filter(t => t.status === 'COMPLETED').length;
    const failed = queueData.tasks.filter(t => t.status === 'FAILED').length;
    const queued = queueData.tasks.filter(t => t.status === 'QUEUED').length;
    const total = queueData.tasks.length;
    const processed = completed + failed;
    const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;

    const barLength = 25;
    const filledLength = Math.round((barLength * percentage) / 100);
    const progressBar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    const recentCompleted = queueData.tasks.filter(t => t.status === 'COMPLETED').slice(-5);
    const upcomingQueued = queueData.tasks.filter(t => t.status === 'QUEUED').slice(0, 5);

    const journalContent = `# 🚀 OMEGA ENGINE — DASHBOARD DE AUTONOMÍA EN TIEMPO REAL
> **Último Latido (GPU Local):** \`${new Date().toLocaleString('es-ES')}\`
> **Motor AI Activo:** \`${MODEL_NAME}\` (Ollama localhost:11434)
> **Validación:** \`npx tsc --noEmit\` (Exit Code 0 Strict)

---

### 📊 TELEMETRÍA EN DIRECTO
\`\`\`
PROGRESO BATCH: [${progressBar}] ${percentage}% (${processed}/${total})
---------------------------------------------------------------------
STATUS        | CANTIDAD | % DEL TOTAL
---------------------------------------------------------------------
✅ COMPLETED  | ${completed.toString().padStart(8)} | ${Math.round((completed/total)*100 || 0)}%
⏳ QUEUED     | ${queued.toString().padStart(8)} | ${Math.round((queued/total)*100 || 0)}%
❌ FAILED     | ${failed.toString().padStart(8)} | ${Math.round((failed/total)*100 || 0)}%
\`\`\`

---

### ⚡ TAREA EN EJECUCIÓN AHORA MISMO
- **ID:** \`${currentTask?.id || 'N/A'}\`
- **Título:** ${currentTask?.title || 'N/A'}
- **Archivo Objetivo:** \`${currentTask?.files ? currentTask.files.join(', ') : 'N/A'}\`
- **Estado:** \`${statusMessage || 'Procesando en GPU Local...'}\`

---

### 📋 ÚLTIMAS TAREAS COMPLETADAS (SELLADAS CON EXIT CODE 0)
${recentCompleted.length > 0 ? recentCompleted.map(t => `- ✅ **[${t.id}]** ${t.title} (\`${t.files.join(', ')}\`)`).join('\n') : '*Procesando primeras tareas...*'}

---

### 🔮 PRÓXIMAS TAREAS EN COLA
${upcomingQueued.length > 0 ? upcomingQueued.map(t => `- ⏳ **[${t.id}]** ${t.title}`).join('\n') : '*Cola completada.*'}

---
*🛡️ Sistema Autónomo ZTM (Zero-Token Memory). Impulsado por Antigravity S-Class.*
`;
    fs.writeFileSync(JOURNAL_FILE, journalContent, 'utf8');
}

async function callOllama(systemPrompt, userPrompt) {
    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            stream: false,
            options: {
                temperature: 0.1,
                num_ctx: 20480
            }
        })
    });
    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.message?.content || '';
}

function runTscValidation() {
    try {
        const cwd = path.join(__dirname, '..');
        execSync('npx tsc --noEmit', { stdio: 'pipe', shell: true, cwd });
        return { success: true, error: null };
    } catch (err) {
        const output = (err.stdout ? err.stdout.toString() : '') + '\n' + (err.stderr ? err.stderr.toString() : '');
        return { success: false, error: output };
    }
}

async function processSingleTask(task, queueData) {
    console.log(`\n==================================================`);
    console.log(`🚀 [AUTÓNOMO] PROCESANDO TAREA ${task.id}: ${task.title}`);
    console.log(`   Archivos: ${task.files.join(', ')}`);
    console.log(`   Acción: ${task.action}`);
    console.log(`==================================================`);

    const cwd = path.join(__dirname, '..');
    const targetFilePath = path.join(cwd, task.files[0]);

    if (!fs.existsSync(targetFilePath)) {
        console.warn(`⚠️ Archivo no existe: ${targetFilePath}. Saltando.`);
        task.status = 'FAILED';
        writeJSON(QUEUE_FILE, queueData);
        return false;
    }

    const fileContent = fs.readFileSync(targetFilePath, 'utf8');

    // System prompt for Qwen
    const systemPrompt = `Eres el Obrero Autónomo S-Class de Productora EAR (EAR OS v2). 
Tu trabajo es auditar, refactorizar o arreglar el archivo TypeScript/React proporcionado siguiendo estrictamente estas reglas:
1. Responde ÚNICAMENTE con el código final TypeScript/TSX listo para guardarse en el archivo.
2. NO agregues introducciones, explicaciones, markdown wrappers triple backticks con texto descriptivo si puedes evitarlo, solo entrega el contenido del archivo.
3. Respeta Next.js 15, estética OLED (#030305), tipos estricto (cero any implícitos) y limpia imports no utilizados.`;

    const userPrompt = `TAREA ID: ${task.id}
TÍTULO: ${task.title}
INSTRUCCIÓN: ${task.action}

CONTENIDO ACTUAL DEL ARCHIVO (${task.files[0]}):
\`\`\`tsx
${fileContent}
\`\`\`

Por favor entrega el contenido completo y refactorizado del archivo:`;

    console.log(`⏳ Enviando prompt a Ollama (${MODEL_NAME})...`);
    updateJournal(queueData, task, 'Generando refactorización en GPU...');
    let aiResponse = await callOllama(systemPrompt, userPrompt);

    // Clean code fences if present
    let cleanedCode = aiResponse.trim();
    if (cleanedCode.startsWith('```')) {
        const lines = cleanedCode.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].trim().startsWith('```')) lines.pop();
        cleanedCode = lines.join('\n');
    }

    // Write candidate code
    fs.writeFileSync(targetFilePath, cleanedCode, 'utf8');
    console.log(`💾 Archivo ${task.files[0]} actualizado.`);

    // Validate with TSC
    console.log(`🛡️ Validando con npx tsc --noEmit...`);
    let valResult = runTscValidation();

    if (!valResult.success) {
        console.warn(`⚠️ TypeScript error detectado. Intentando 1 auto-corrección con la IA...`);
        const fixPrompt = `El código generado causó los siguientes errores de TypeScript (\`npx tsc --noEmit\`):

ERRORS:
${valResult.error.slice(0, 3000)}

CÓDIGO QUE CAUSÓ EL ERROR:
\`\`\`tsx
${cleanedCode}
\`\`\`

Por favor corrige todos los errores y entrega el código completo corregido:`;

        const fixedResponse = await callOllama(systemPrompt, fixPrompt);
        let cleanedFixed = fixedResponse.trim();
        if (cleanedFixed.startsWith('```')) {
            const lines = cleanedFixed.split('\n');
            if (lines[0].startsWith('```')) lines.shift();
            if (lines[lines.length - 1].trim().startsWith('```')) lines.pop();
            cleanedFixed = lines.join('\n');
        }

        fs.writeFileSync(targetFilePath, cleanedFixed, 'utf8');
        valResult = runTscValidation();
    }

    if (valResult.success) {
        console.log(`✅ [ÉXITO] Tarea ${task.id} completada y validada con Exit Code 0.`);
        task.status = 'COMPLETED';

        // Auto purge every 5 tasks
        const completedCount = queueData.tasks.filter(t => t.status === 'COMPLETED').length;
        if (completedCount >= 5) {
            console.log(`🧹 [PURGA] Purgando ${completedCount} tareas completadas para mantener la cola ultraligera...`);
            queueData.tasks = queueData.tasks.filter(t => t.status !== 'COMPLETED');
        }

        writeJSON(QUEUE_FILE, queueData);
        updateJournal(queueData, task, 'COMPLETED (Exit Code 0)');
        return true;
    } else {
        console.error(`❌ [ERROR] Tarea ${task.id} falló validación. Revirtiendo archivo.`);
        fs.writeFileSync(targetFilePath, fileContent, 'utf8');
        task.status = 'FAILED';
        writeJSON(QUEUE_FILE, queueData);
        updateJournal(queueData, task, 'FAILED (Revertido)');
        return false;
    }
}

async function runDaemonLoop() {
    console.log("⚡ === MOTOR AUTÓNOMO OMEGA (ZERO-CLICK CEO EDITION) INICIADO ===");
    
    while (true) {
        let queueData;
        try {
            queueData = readJSON(QUEUE_FILE);
        } catch (e) {
            console.error("Error leyendo queue file:", e);
            await new Promise(r => setTimeout(r, 3000));
            continue;
        }

        let nextTask = queueData.tasks.find(t => t.status === 'QUEUED');

        if (!nextTask) {
            // Auto-reintento de tareas fallidas
            const failedTasks = queueData.tasks.filter(t => t.status === 'FAILED' && (t.retries || 0) < 3);
            if (failedTasks.length > 0) {
                console.log(`\n♻️ [REINTENTO AUTOMÁTICO] Reciclando ${failedTasks.length} tareas fallidas a la cola (Max 3 intentos)...`);
                failedTasks.forEach(t => {
                    t.status = 'QUEUED';
                    t.retries = (t.retries || 0) + 1;
                });
                writeJSON(QUEUE_FILE, queueData);
                continue;
            }

            console.log("🏁 TODAS LAS TAREAS DE LA COLA ACTUAL FUERON COMPLETADAS.");
            console.log("Esperando 10 segundos antes de volver a verificar...");
            await new Promise(r => setTimeout(r, 10000));
            continue;
        }

        try {
            await processSingleTask(nextTask, queueData);
        } catch (err) {
            console.error(`Error procesando tarea ${nextTask.id}:`, err);
            await new Promise(r => setTimeout(r, 5000));
        }

        // Small pause between tasks to allow system breathing
        await new Promise(r => setTimeout(r, 1500));
    }
}

runDaemonLoop();
