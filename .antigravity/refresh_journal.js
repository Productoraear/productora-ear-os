const fs = require('fs');
const file = '.antigravity/tasks_queue.json';
const journal = '.antigravity/OMEGA_STATE_JOURNAL.md';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const completed = data.tasks.filter(t => t.status === 'COMPLETED');
const failed = data.tasks.filter(t => t.status === 'FAILED');
const queued = data.tasks.filter(t => t.status === 'QUEUED');
const total = data.tasks.length;
const done = total - queued.length;
const percent = Math.round((done / total) * 100);
const bar = '█'.repeat(Math.floor(percent / 4)) + '░'.repeat(25 - Math.floor(percent / 4));

const nextTask = queued[0] || { id: 'N/A', title: 'N/A', files: ['N/A'] };

const content = `# 🧠 OMEGA STATE JOURNAL (MEMORIA PERSISTENTE)
> **Última actualización:** ${new Date().toISOString()}
> **Motor AI Activo:** ear-27b-apis-ctx20480:latest (Ollama localhost:11434)
> **Validación:** npx tsc --noEmit (Exit Code 0 Strict)

---

### 📊 TELEMETRÍA EN DIRECTO
\`\`\`
PROGRESO BATCH: [${bar}] ${percent}% (${done}/${total})
---------------------------------------------------------------------
STATUS        | CANTIDAD | % DEL TOTAL
---------------------------------------------------------------------
✅ COMPLETED  | ${completed.length.toString().padStart(8)} | ${Math.round((completed.length/total)*100)}%
⏳ QUEUED     | ${queued.length.toString().padStart(8)} | ${Math.round((queued.length/total)*100)}%
❌ FAILED     | ${failed.length.toString().padStart(8)} | ${Math.round((failed.length/total)*100)}%
\`\`\`

---

### ⚡ TAREA EN EJECUCIÓN AHORA MISMO
- **ID:** ${nextTask.id}
- **Título:** ${nextTask.title}
- **Archivo Objetivo:** ${(nextTask.files || []).join(', ')}
- **Estado:** \`Enviando prompt a GPU (Ollama)...\`

---

### 📋 ÚLTIMAS TAREAS COMPLETADAS
${completed.slice(-3).map(t => `- ✅ **[${t.id}]** ${t.title}`).join('\n')}

---

### 🔮 PRÓXIMAS TAREAS EN COLA
${queued.slice(1, 6).map(t => `- ⏳ **[${t.id}]** ${t.title}`).join('\n')}

---
*🛡️ Sistema Autónomo ZTM (Zero-Token Memory). Impulsado por Antigravity S-Class.*
`;

fs.writeFileSync(journal, content, 'utf8');
console.log('✅ OMEGA_STATE_JOURNAL actualizado de forma forzada.');
