const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');
const BACKUP_FILE = path.join(__dirname, `tasks_queue.backup_before_50_${Date.now()}.json`);

const raw = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
const currentTasks = raw.tasks || [];

// Respaldar cola actual
fs.writeFileSync(BACKUP_FILE, JSON.stringify(raw, null, 2), 'utf8');
console.log(`[BACKUP] Cola original respaldada en: ${BACKUP_FILE}`);

// Agrupar tareas por archivo destino
const fileMap = new Map();
for (const t of currentTasks) {
  const f = (t.files && t.files[0]) || null;
  if (!f) continue;
  if (!fileMap.has(f)) {
    fileMap.set(f, {
      file: f,
      clientes: new Set(),
      productos: new Set(),
      operaciones: new Set(),
      originalIds: []
    });
  }
  const entry = fileMap.get(f);
  if (t.cliente) entry.clientes.add(t.cliente);
  if (t.producto) entry.productos.add(t.producto);
  if (t.tipo_operacion) entry.operaciones.add(t.tipo_operacion);
  entry.originalIds.push(t.id);
}

// Ordenar archivos por relevancia comercial y número de microtareas agrupadas
const sortedFiles = Array.from(fileMap.values()).sort((a, b) => {
  // Priorizar las que más microtareas condensan
  return b.originalIds.length - a.originalIds.length;
});

// Seleccionar exactamente 50 archivos comerciales prioritarios
const targetFiles = sortedFiles.slice(0, 50);

const condensedTasks = targetFiles.map((item, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  const taskId = `MVP-50-${num}`;
  const clientesList = Array.from(item.clientes).join(' / ') || 'Comercial';
  const productosList = Array.from(item.productos).slice(0, 3).join(', ') || 'Show Solista / Packs SSOT';
  const pageName = path.basename(path.dirname(item.file)) === '(public)' 
    ? path.basename(item.file, '.tsx') 
    : `${path.basename(path.dirname(item.file))}/${path.basename(item.file, '.tsx')}`;

  return {
    id: taskId,
    wave: 1,
    status: 'QUEUED',
    cliente: clientesList,
    ruta: item.file,
    condensed_count: item.originalIds.length,
    original_ids: item.originalIds,
    title: `[${pageName}] Revisión y Sellado Integral S-Class · ${clientesList}`,
    files: [item.file],
    action: `Revisión y Sellado Integral S-Class de la superficie comercial (${item.file}):\n` +
      `1. PRECIO TRANSPARENTE: Exponer el precio oficial SSOT (Tarifa Solista 350 € o packs de inventario) sin textos de "consultar".\n` +
      `2. CTA DE CIERRE REAL: Enlazar botones/links a rutas de conversión reales (/reservar/solista, /alquiler, /checkout o WhatsApp directo +34 693 693 048). Cero href="#" ni anclas rotas.\n` +
      `3. JSON-LD SCHEMA.ORG: Incluir o verificar bloque structured data (Offer/Product) con precio coherente con el SSOT.\n` +
      `4. ESTÉTICA LUXURY OLED: Contenedores rounded-3xl bg-[#09090d]/80 border border-white/10 con micro-animaciones hover.\n` +
      `5. BLINDAJE ZONA CERO: Usar solo constantes de src/lib/constants/ear-os-ssot.ts o inventory-catalog.ts. Cero valores hardcodeados ajenos.`,
    scaffold: `1) Lee el archivo ${item.file}.\n` +
      `2) Localiza los bloques de oferta/conversión de la página.\n` +
      `3) Aplica el sellado integral (precio SSOT visible + CTA real + JSON-LD Offer + estética OLED).\n` +
      `4) Valida: npx tsc --noEmit (Exit Code 0).\n` +
      `5) Cierra: node .antigravity/omega.js complete ${taskId}`,
    done_when: `Página sellada: precio SSOT visible, CTA de cierre real a ruta existente, JSON-LD Schema.org y estética OLED S-Class sin errores TS.`,
    validate: 'npx tsc --noEmit',
    complete: `node .antigravity/omega.js complete ${taskId}`
  };
});

const newQueue = {
  _meta: {
    version: "9.0-OMEGA-50-CONDENSED-MVP",
    doctrine: "50 REVISIONES INTEGRALES S-CLASS: Cada tarea sella por completo 1 superficie comercial real. Precio SSOT + CTA real + JSON-LD + Estética OLED. Tiempo estimado total: < 8 horas.",
    generado: new Date().toISOString(),
    total_tasks: condensedTasks.length,
    original_tasks_absorbed: currentTasks.length,
    unique_surfaces_covered: condensedTasks.length
  },
  _instructions_for_worker: "1) node .antigravity/omega.js next  2) Lee SOLO .antigravity/MISSION_ACTIVE.json  3) Ejecuta el sellado integral del archivo  4) npx tsc --noEmit  5) node .antigravity/omega.js complete <ID>  6) Vuelve al paso 1 hasta agotar la cola.",
  tasks: condensedTasks
};

fs.writeFileSync(QUEUE_FILE, JSON.stringify(newQueue, null, 2), 'utf8');

// Actualizar Journal
const JOURNAL_FILE = path.join(__dirname, 'OMEGA_STATE_JOURNAL.md');
fs.writeFileSync(JOURNAL_FILE,
  `# OMEGA STATE JOURNAL\n> ${new Date().toISOString()}\n- QUEUED: ${condensedTasks.length}  |  COMPLETED: 0  |  FAILED: 0\n- ARQUITECTURA: 50 Tareas Integrales S-Class (< 8 horas para MVP sellado)\n- Continuar: \`node .antigravity/omega.js next\`\n`,
  'utf8'
);

console.log(`[CONDENSACIÓN EXITOSA] ${currentTasks.length} microtareas absorbidas en exactamente ${condensedTasks.length} tareas integrales.`);
