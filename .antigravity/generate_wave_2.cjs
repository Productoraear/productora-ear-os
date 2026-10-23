const fs = require('fs');
const path = require('path');

function getFiles(dir, ext = '.ts', files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const res = path.resolve(dir, file);
    if (fs.statSync(res).isDirectory()) {
      getFiles(res, ext, files);
    } else if (res.endsWith(ext) || res.endsWith(ext + 'x')) {
      files.push(res);
    }
  }
  return files;
}

const apiFiles = getFiles('src/app/api', '.ts')
  .map(f => path.relative(process.cwd(), f).replace(/\\/g, '/'))
  .filter(f => f.endsWith('route.ts') || f.endsWith('route.tsx'));

const publicPages = getFiles('src/app/(public)', '.tsx')
  .map(f => path.relative(process.cwd(), f).replace(/\\/g, '/'))
  .filter(f => f.endsWith('page.tsx'));

const tasks = [];

// 25 API Validation & Security Tasks
for (let i = 0; i < 25 && i < apiFiles.length; i++) {
  const file = apiFiles[i];
  tasks.push({
    id: `W02-API-${String(i + 1).padStart(3, '0')}`,
    wave: 2,
    status: 'QUEUED',
    title: `SECURITY API HARDENING: ${file}`,
    action: `Verificar y asegurar validación estricta de inputs (Zod/Sanitización), try/catch global, headers de seguridad y respuesta tipada en ${file}.`,
    files: [file],
    validate: 'npx tsc --noEmit'
  });
}

// 25 SEO Metadata & OpenGraph Tasks
for (let i = 0; i < 25 && i < publicPages.length; i++) {
  const file = publicPages[i];
  tasks.push({
    id: `W02-SEO-${String(i + 1).padStart(3, '0')}`,
    wave: 2,
    status: 'QUEUED',
    title: `SEO & METADATA HARDENING: ${file}`,
    action: `Verificar export const metadata (title, description, openGraph, canonical URL) y JSON-LD Schema.org en ${file}.`,
    files: [file],
    validate: 'npx tsc --noEmit'
  });
}

const queue = {
  _meta: {
    version: '9.0-OMEGA-WAVE-2',
    doctrine: 'WAVE 2: SEGURIDAD API & ENRIQUECIMIENTO METADATA SEO S-CLASS',
    wave: 2,
    total_tasks: tasks.length
  },
  _instructions_for_worker: '1) node .antigravity/omega.js next  2) Lee SOLO .antigravity/MISSION_ACTIVE.json  3) Ejecuta el sellado integral del archivo  4) npx tsc --noEmit  5) node .antigravity/omega.js complete <ID>  6) Vuelve al paso 1 hasta agotar la cola.',
  tasks: tasks
};

fs.writeFileSync('.antigravity/tasks_queue.json', JSON.stringify(queue, null, 2));
console.log(`Wave 2 cargada con éxito en .antigravity/tasks_queue.json con ${tasks.length} tareas en estado QUEUED.`);
