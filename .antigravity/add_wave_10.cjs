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

const data = JSON.parse(fs.readFileSync('.antigravity/tasks_queue.json', 'utf8'));

// Generate 50 tasks for Wave 10
const offset10 = 150;
for(let i=0; i<50 && (i+offset10)<relativeFiles.length; i++) {
  data.tasks.push({
    id: `W10-${String(i+1).padStart(3, '0')}`,
    wave: 10,
    status: 'QUEUED',
    title: `Error-Boundary: ${path.basename(relativeFiles[i+offset10])}`,
    action: 'Añadir Suspense/ErrorBoundary en páginas o componentes con fetching de datos.',
    files: [relativeFiles[i+offset10]],
    validate: 'npx tsc --noEmit'
  });
}

data._meta.waves = '7-10';
fs.writeFileSync('.antigravity/tasks_queue.json', JSON.stringify(data, null, 2));
console.log('Added Wave 10. Total tasks: ' + data.tasks.length);
