const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if(!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const res = path.resolve(dir, file);
    if (fs.statSync(res).isDirectory()) {
      getFiles(res, files);
    } else if (res.endsWith('.tsx')) {
      files.push(res);
    }
  }
  return files;
}

const allFiles = getFiles('src/components').filter(f => !f.includes('node_modules'));
const relativeFiles = allFiles.map(f => path.relative(process.cwd(), f).replace(/\\/g, '/'));

const manifest = JSON.parse(fs.readFileSync('.antigravity/waves_manifest.json', 'utf8'));
const queue = {
  _meta: {
    version: '5.1-DEEPSEEK-AUDIT-FIRST',
    doctrine: 'AUDITORIA FORENSE PREVENTIVA + COMPOSICION AVANZADA',
    waves: '7-9',
    model: 'deepseek-pro-v4'
  },
  _instructions_for_cline: 'PROTOCOLO DEEPSEEK 100K: 1) node .antigravity/omega.js next 2) Tienes permiso para leer y modificar cualquier motor existente para forzar el cumplimiento estricto del SSOT. 3) Usa tsc --noEmit.',
  tasks: []
};

// Generate 50 tasks for Wave 7
for(let i=0; i<50 && i<relativeFiles.length; i++) {
  queue.tasks.push({
    id: `W07-${String(i+1).padStart(3, '0')}`,
    wave: 7,
    status: 'PENDING',
    title: `A11Y Audit: ${path.basename(relativeFiles[i])}`,
    action: 'Auditar y añadir aria-labels, alt texts y roles ARIA si es un componente interactivo.',
    files: [relativeFiles[i]],
    validate: 'npx tsc --noEmit'
  });
}

// Generate 50 tasks for Wave 8
const offset8 = 50;
for(let i=0; i<50 && (i+offset8)<relativeFiles.length; i++) {
  queue.tasks.push({
    id: `W08-${String(i+1).padStart(3, '0')}`,
    wave: 8,
    status: 'PENDING',
    title: `Mobile Responsive: ${path.basename(relativeFiles[i+offset8])}`,
    action: 'Verificar responsive (min-h-screen, overflow-x-hidden, touch targets 48px). Prohibido w-screen.',
    files: [relativeFiles[i+offset8]],
    validate: 'npx tsc --noEmit'
  });
}

// Generate 50 tasks for Wave 9
const offset9 = 100;
for(let i=0; i<50 && (i+offset9)<relativeFiles.length; i++) {
  queue.tasks.push({
    id: `W09-${String(i+1).padStart(3, '0')}`,
    wave: 9,
    status: 'PENDING',
    title: `Performance: ${path.basename(relativeFiles[i+offset9])}`,
    action: 'Lazy loading de componentes pesados (next/dynamic) y optimización de imágenes.',
    files: [relativeFiles[i+offset9]],
    validate: 'npx tsc --noEmit'
  });
}

fs.writeFileSync('.antigravity/tasks_queue.json', JSON.stringify(queue, null, 2));
console.log('Generated tasks_queue.json with ' + queue.tasks.length + ' tasks.');
