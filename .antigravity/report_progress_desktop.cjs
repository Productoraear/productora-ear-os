/* Generador de reporte de progreso ZTM -> Escritorio (con fecha). */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const queuePath = path.join(root, '.antigravity', 'tasks_queue.json');
const histPath = path.join(root, '.antigravity', 'tasks_history.json');

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const hist = JSON.parse(fs.readFileSync(histPath, 'utf8'));

const now = new Date();
const stamp = now.toISOString();
const dateOnly = stamp.slice(0, 10);
const human = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Madrid',
}).format(now);

const tasks = queue.tasks || [];
const byStatus = tasks.reduce((a, t) => { a[t.status] = (a[t.status] || 0) + 1; return a; }, {});
const totalMission = (queue._meta && queue._meta.total_tasks) || 50;
const doneCount = totalMission - tasks.length;

const history = hist.history || [];
const last = history.slice(-6);

const rows = tasks
    .map((t) => `| ${t.id} | ${t.cliente || '-'} | \`${(t.files && t.files[0]) || t.ruta || '-'}\` | ${t.status} |`)
    .join('\n');

const md = `# EAR OS V2 — Reporte de Progreso S-Class (ZTM)

**Fecha de emisión:** ${human}
**Marca temporal ISO:** ${stamp}

> Documento de cierre preventivo por **Pacto Sagrado Anti-Sobrecostes (ZTM)**.
> El progreso reside en disco (\`.antigravity/tasks_queue.json\` y \`tasks_history.json\`), no en la sesión de chat.

---

## 1. Resumen ejecutivo de la Misión Activa

| Métrica | Valor |
|---|---|
| Doctrina en curso | ${(queue._meta && queue._meta.doctrine) || 'MVP-50 S-Class'} |
| Versión cola | ${(queue._meta && queue._meta.version) || '-'} |
| Superficies comerciales totales | ${totalMission} |
| Tareas selladas y purgadas | ${doneCount} |
| Tareas en cola (QUEUED) | ${tasks.length} |
| Tareas originales absorbidas | ${(queue._meta && queue._meta.original_tasks_absorbed) || 'n/a'} |
| Siguiente tarea en cola | ${tasks[0] ? tasks[0].id : 'NINGUNA — cola agotada'} |

**Estado operativo:** ${tasks.length === 0 ? '✅ COLA VACÍA / MISIÓN COMPLETA' : '🟡 MISIÓN EN CURSO — ' + tasks.length + ' superficies pendientes de sellado'}

---

## 2. Último bloque validado (Exit Code 0)

Las siguientes superficies fueron selladas con **\`npx tsc --noEmit\` → Exit Code 0** (0 errores, 0 \`any\` implícito) y purgadas de la cola:

### ✅ MVP-50-003 — \`src/app/(public)/alianzas/page.tsx\`
- **Split Soberano 80/10/10:** exposición transparente y blindada (80% Artista / 10% EAR OS / 10% VIMUME).
- **Precio SSOT Canónico:** Tarifa Base Solista (350 €) y depósito Stripe deducible (100 €).
- **CTAs Reales:** enlaces a \`/reservar/solista\` y deep-link WhatsApp oficial (+34 693 693 048). Cero \`href="#"\`.
- **JSON-LD Schema.org:** estructura \`Service\` y \`Offer\` coherente con el SSOT.

### ✅ MVP-50-004 — \`src/app/(public)/eventos/municipales/page.tsx\`
- **Blindaje Zona Cero B2G:** integración de \`SAFE_LCSP_CEILING_EUR\` (14.250 €) y \`LIMITE_B2G_LCSP_EUR\` (15.000 €) bajo Art. 118 LCSP + acústica \`WATTS_PER_PAX\` (12 W/pax).
- **Schema.org B2G:** bloque \`GovernmentService\` con \`Offer\` formal indexada.
- **Estética Luxury OLED:** contenedores \`rounded-3xl bg-[#09090d]/80 border border-white/10\` con micro-animaciones hover.

> **Validación de compilación:** \`npx tsc --noEmit\` ➔ Exit Code 0.
> **Cierre:** \`node .antigravity/omega.js complete MVP-50-004\` ➔ Exit Code 0.

---

## 3. Cola pendiente (${tasks.length} superficies)

| ID | Cliente / vertical | Superficie | Estado |
|---|---|---|---|
${rows || '| — | — | — | (vacía) |'}

---

## 4. Cola histórica reciente (contexto)

${last.map((h) => `- **${h.id}** — ${h.title || h.description || ''} → \`${h.status || 'COMPLETED'}\``).join('\n') || '- (sin registros)'}

---

## 5. Instrucción de reanudación (Memoria Limpia)

1. Abrir **Start New Task (+)** en Cline (purga de contexto, Protocolo ZTM).
2. Ejecutar: \`node .antigravity/omega.js next\`
3. Leer SOLO \`.antigravity/MISSION_ACTIVE.json\` y el archivo indicado.
4. Aplicar el Sellado Integral (precio SSOT + CTA real + JSON-LD + estética OLED).
5. Validar: \`npx tsc --noEmit\` ➔ Exit Code 0.
6. Cerrar: \`node .antigravity/omega.js complete <ID>\`.

---

*Generado automáticamente por \`.antigravity/report_progress_desktop.cjs\`.*
`;

const outPath = path.join('C:', 'Users', 'M2-W10', 'Desktop', `EAR_OS_PROGRESO_ZTM_${dateOnly}.md`);
fs.writeFileSync(outPath, md, 'utf8');
console.log('OK ->', outPath);
console.log('DONE=' + doneCount + ' QUEUED=' + tasks.length + ' TOTAL=' + totalMission);
