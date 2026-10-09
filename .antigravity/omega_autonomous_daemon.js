import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');
const JOURNAL_FILE = path.join(__dirname, 'OMEGA_STATE_JOURNAL.md');
const VAULT_DIR = path.join(__dirname, '..', '..', 'EAR_VAULT_GOLDEN_NUGGETS');
const OLLAMA_URL = 'http://localhost:11434/api/chat';
// Modelo local blindado VRAM-Shield (GPU 24GB). Configurable por env para no acoplar.
const MODEL_NAME = process.env.OMEGA_MODEL || 'ear-27b-apis-sclass:latest';
// Ventana de contexto blindada: 16k tokens + KV q4_0 (0 offload a RAM/CPU).
const NUM_CTX = Number(process.env.OMEGA_NUM_CTX || 16384);

if (!fs.existsSync(VAULT_DIR)) fs.mkdirSync(VAULT_DIR, { recursive: true });

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

    const journalContent = `# 🚀 OMEGA ENGINE — DASHBOARD DE AUTONOMÍA EN TIEMPO REAL (v8.0 S-CLASS)
> **Último Latido (GPU Local):** \`${new Date().toLocaleString('es-ES')}\`
> **Motor AI Activo:** \`${MODEL_NAME}\` (Ollama localhost:11434)
> **Módulos Activos:** Self-Healing Loop, Vampire RAG Vault, Pre-Flight CI

---

### 📊 TELEMETRÍA EN DIRECTO
\`\`\`
PROGRESO BATCH: [${progressBar}] ${percentage}% (${processed}/${total})
---------------------------------------------------------------------
STATUS        | CANTIDAD | % DEL TOTAL
---------------------------------------------------------------------
✅ COMPLETED  | ${completed.toString().padStart(8)} | ${Math.round((completed / total) * 100 || 0)}%
⏳ QUEUED     | ${queued.toString().padStart(8)} | ${Math.round((queued / total) * 100 || 0)}%
❌ FAILED     | ${failed.toString().padStart(8)} | ${Math.round((failed / total) * 100 || 0)}%
\`\`\`

---

### ⚡ TAREA EN EJECUCIÓN AHORA MISMO
- **ID:** \`${currentTask?.id || 'N/A'}\`
- **Título:** ${currentTask?.title || 'N/A'}
- **Archivo Objetivo:** \`${currentTask?.files ? currentTask.files.join(', ') : 'N/A'}\`
- **Estado:** \`${statusMessage || 'Procesando en GPU Local...'}\`

---

### 📋 ÚLTIMAS TAREAS COMPLETADAS (SELLADAS CON EXIT CODE 0)
${recentCompleted.length > 0 ? recentCompleted.map(t => `- ✅ **[${t.id}]** ${t.title}`).join('\n') : '*Procesando primeras tareas...*'}

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
                num_ctx: NUM_CTX
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
    console.log(`🚀 [AUTÓNOMO v8.0] PROCESANDO TAREA ${task.id}: ${task.title}`);
    console.log(`   Archivos: ${task.files.join(', ')}`);
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

    // Vampire RAG: Inject Golden Nuggets
    let ragContext = '';
    const nuggets = fs.readdirSync(VAULT_DIR).filter(f => f.endsWith('.md')).slice(-3);
    for (const f of nuggets) {
        ragContext += fs.readFileSync(path.join(VAULT_DIR, f), 'utf8') + '\n';
    }

    const systemPrompt = `Eres el Obrero Autónomo S-Class de Productora EAR (EAR OS v2). 
Tu trabajo es auditar, refactorizar o arreglar el archivo TypeScript/React proporcionado siguiendo estrictamente estas reglas:
1. Responde ÚNICAMENTE con el código final TypeScript/TSX listo para guardarse en el archivo.
2. NO agregues markdown wrappers innecesarios si puedes evitarlo.
3. Respeta Next.js 15, estética OLED (#030305), tipos estricto (cero any implícitos).
4. APRENDIZAJE PREVIO (RAG): ${ragContext.slice(0, 5000)}`;

    const userPrompt = `TAREA ID: ${task.id}
TÍTULO: ${task.title}
INSTRUCCIÓN: ${task.action}

CONTENIDO ACTUAL DEL ARCHIVO (${task.files[0]}):
\`\`\`tsx
${fileContent}
\`\`\`
Por favor entrega el contenido completo y refactorizado del archivo:`;

    console.log(`⏳ Enviando prompt a Ollama (${MODEL_NAME}) con VAMPIRE RAG...`);
    updateJournal(queueData, task, 'Generando refactorización en GPU (RAG Activo)...');
    let aiResponse = await callOllama(systemPrompt, userPrompt);

    let cleanedCode = aiResponse.trim();
    if (cleanedCode.startsWith('\`\`\`')) {
        const lines = cleanedCode.split('\n');
        if (lines[0].startsWith('\`\`\`')) lines.shift();
        if (lines[lines.length - 1].trim().startsWith('\`\`\`')) lines.pop();
        cleanedCode = lines.join('\n');
    }

    // GUARD ZERO-BYTES: nunca escribir un archivo vacío si Ollama devuelve basura.
    if (!cleanedCode || cleanedCode.length < 20 || !/export|import|React|function|const|\{|>/.test(cleanedCode)) {
        console.warn(`⚠️ Respuesta vacía/inválida de Ollama (${cleanedCode.length} chars). Abortando sin escribir.`);
        task.status = 'FAILED';
        task.retries = (task.retries || 0) + 1;
        writeJSON(QUEUE_FILE, queueData);
        updateJournal(queueData, task, 'FAILED (respuesta vacía de Ollama)');
        return false;
    }

    fs.writeFileSync(targetFilePath, cleanedCode, 'utf8');
    console.log(`💾 Archivo ${task.files[0]} actualizado.`);

    console.log(`🛡️ Validando con npx tsc --noEmit...`);
    let valResult = runTscValidation();

    if (!valResult.success) {
        console.warn(`⚠️ TypeScript error detectado. Intentando 1 auto-corrección con la IA...`);
        const fixPrompt = `El código generado causó errores (\`npx tsc --noEmit\`):
${valResult.error.slice(0, 3000)}
CÓDIGO:
\`\`\`tsx
${cleanedCode}
\`\`\`
Corrige todos los errores y entrega el código completo corregido:`;

        const fixedResponse = await callOllama(systemPrompt, fixPrompt);
        let cleanedFixed = fixedResponse.trim();
        if (cleanedFixed.startsWith('\`\`\`')) {
            const lines = cleanedFixed.split('\n');
            if (lines[0].startsWith('\`\`\`')) lines.shift();
            if (lines[lines.length - 1].trim().startsWith('\`\`\`')) lines.pop();
            cleanedFixed = lines.join('\n');
        }

        if (!cleanedFixed || cleanedFixed.length < 20) {
            console.warn(`⚠️ Fix vacío de Ollama (${cleanedFixed.length} chars). Se conserva el archivo previo.`);
            fs.writeFileSync(targetFilePath, fileContent, 'utf8');
        } else {
            fs.writeFileSync(targetFilePath, cleanedFixed, 'utf8');
        }
        valResult = runTscValidation();
    }

    if (valResult.success) {
        console.log(`✅ [ÉXITO] Tarea ${task.id} completada.`);

        // Save Golden Nugget if this was a fix task
        if (task.id.includes('-HEAL')) {
            fs.writeFileSync(path.join(VAULT_DIR, `nugget-${task.id}.md`), `Aprendizaje de ${task.id}: Se resolvió compilación en ${task.files[0]}.`, 'utf8');
            console.log(`🦇 [VAMPIRE RAG] Conocimiento guardado en la bóveda.`);
        }

        task.status = 'COMPLETED';
        writeJSON(QUEUE_FILE, queueData);
        updateJournal(queueData, task, 'COMPLETED (Exit Code 0)');
        return true;
    } else {
        console.error(`❌ [ERROR CRÍTICO] Tarea ${task.id} falló validación. Revirtiendo...`);
        fs.writeFileSync(targetFilePath, fileContent, 'utf8');
        task.status = 'FAILED';

        // Milestone 1: SELF-HEALING LOOP
        // PARCHE ANTI-INFLACIÓN: máximo 1 heal total por id base; jamás regenrar un HEAL.
        const healCount = (task.id.match(/-HEAL/g) || []).length;
        if (healCount >= 1) {
            console.log(`⚠️ Auto-Sanación DESACTIVADA para ${task.id} (límite de 1 alcanzado). No se inyectan más tareas.`);
        } else {
            console.log(`🚑 [AUTO-SANACIÓN] Generando tarea de diagnóstico dinámico...`);
            try {
                const healPrompt = `La tarea ${task.id} falló de forma irrecuperable. Error TSC: ${valResult.error.slice(0, 500)}.
                Genera un JSON estrictamente con este formato para una NUEVA tarea que arregle esto:
                {"id": "${task.id}-HEAL", "wave": ${task.wave || 99}, "status": "QUEUED", "title": "Auto-Fix ${task.id}", "action": "Reescribir dependencias o fixear tipos basándose en el error TS...", "files": ["${task.files[0]}"], "validate": "npx tsc --noEmit"}`;

                const healRes = await callOllama("Eres un orquestador que solo escupe JSON estricto.", healPrompt);
                const healJsonStr = healRes.substring(healRes.indexOf('{'), healRes.lastIndexOf('}') + 1);
                const healTask = JSON.parse(healJsonStr);
                queueData.tasks.unshift(healTask); // Inject to the TOP of the queue
                console.log(`💉 [ÉXITO AUTO-SANACIÓN] Tarea inyectada: ${healTask.id}`);
            } catch (e) {
                console.log(`⚠️ Falló la auto-sanación: ${e.message}`);
            }
        }

        writeJSON(QUEUE_FILE, queueData);
        updateJournal(queueData, task, 'FAILED (Self-Healing Injected)');
        return false;
    }
}

async function runDaemonLoop() {
    console.log("⚡ === MOTOR AUTÓNOMO OMEGA v8.0 INICIADO ===");

    while (true) {
        let queueData;
        try {
            queueData = readJSON(QUEUE_FILE);
        } catch (e) {
            await new Promise(r => setTimeout(r, 3000));
            continue;
        }

        let nextTask = queueData.tasks.find(t => t.status === 'QUEUED');

        if (!nextTask) {
            const failedTasks = queueData.tasks.filter(t => t.status === 'FAILED' && (t.retries || 0) < 3);
            if (failedTasks.length > 0) {
                console.log(`\n♻️ Reciclando ${failedTasks.length} tareas fallidas...`);
                failedTasks.forEach(t => {
                    t.status = 'QUEUED';
                    t.retries = (t.retries || 0) + 1;
                });
                writeJSON(QUEUE_FILE, queueData);
                continue;
            }

            console.log("🏁 TODAS LAS TAREAS DE LA COLA ACTUAL FUERON COMPLETADAS.");

            // Milestone 3: CI/CD Pre-Flight Checks
            console.log("✈️ [PRE-FLIGHT CHECK] Comprobando tamaño del repositorio Git...");
            try {
                const cwd = path.join(__dirname, '..');
                const gitCount = execSync('git rev-list --objects --all', { shell: true, cwd }).toString();
                const gitSize = gitCount.split(/\r?\n/).filter(Boolean).length;
                console.log(`📦 Objetos en Git: ${gitSize} (Mantenimiento ultra-ligero S-Class OK).`);
                updateJournal(queueData, null, `Pre-Flight OK. Git Objects: ${gitSize}`);
            } catch (e) {
                console.log("⚠️ No se pudo ejecutar el pre-flight check de Git.");
            }

            await new Promise(r => setTimeout(r, 10000));
            continue;
        }

        try {
            await processSingleTask(nextTask, queueData);
        } catch (err) {
            console.error(`Error crítico procesando tarea ${nextTask.id}:`, err);
            const errMsg = String((err && err.message) || err);
            if (/ECONNREFUSED|fetch failed|connection|connect/i.test(errMsg)) {
                console.log('🔌 Ollama no disponible. Pausa y reintento (tarea no quemada).');
                await new Promise(r => setTimeout(r, 5000));
                continue;
            }
            nextTask.status = 'FAILED';
            nextTask.retries = (nextTask.retries || 0) + 1;
            writeJSON(QUEUE_FILE, queueData);
        }

        await new Promise(r => setTimeout(r, 1500));
    }
}

runDaemonLoop();
