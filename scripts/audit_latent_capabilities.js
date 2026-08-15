const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const auditDirs = ['src', 'scripts', 'public', 'docs', 'data'];
const fileExtensions = ['.ts', '.tsx', '.json', '.ps1', '.sql'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (fileExtensions.includes(path.extname(file))) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

console.log("⚡ [S-CLASS AUDIT] Iniciando inspección semántica de archivos latentes...");

const allFiles = auditDirs.flatMap(dir => getAllFiles(path.join(projectRoot, dir)));
const fileContentsMap = new Map();
const importsSet = new Set();

allFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  fileContentsMap.set(filePath, content);

  const importMatches = content.matchAll(/from\ ['"]([^'"]+)['"]/g);
  for (const match of importMatches) {
    importsSet.add(match[1]);
  }
});

const orphanFiles = [];

fileContentsMap.forEach((content, filePath) => {
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  
  if (
    relativePath.includes('src/app/') && (
      relativePath.endsWith('page.tsx') || 
      relativePath.endsWith('layout.tsx') || 
      relativePath.endsWith('route.ts') ||
      relativePath.endsWith('middleware.ts')
    )
  ) {
    return;
  }

  const fileNameNoExt = path.basename(filePath, path.extname(filePath));
  
  let isImported = false;
  for (const imp of importsSet) {
    if (imp.includes(fileNameNoExt)) {
      isImported = true;
      break;
    }
  }

  if (!isImported) {
    const exportsCount = (content.match(/export\ /g) || []).length;
    const hasZustand = content.includes('create(') || content.includes('zustand');
    const hasPrisma = content.includes('prisma') || content.includes('@prisma/client');
    const hasUI = content.includes('className=') || content.includes('lucide-react');
    const hasAI = content.includes('ollama') || content.includes('openai') || content.includes('telegram');

    orphanFiles.push({
      file: relativePath,
      lines: content.split('\n').length,
      exportsCount,
      capabilities: [
        hasZustand ? 'State Management (Zustand)' : null,
        hasPrisma ? 'Database/Prisma Engine' : null,
        hasUI ? 'Aura Onyx UI Component' : null,
        hasAI ? 'Agentic/AI Pipeline' : null,
      ].filter(Boolean)
    });
  }
});

console.log(`\n📊 [RESULTADO DEL BARRIDO]`);
console.log(`- Total de archivos inspeccionados: ${allFiles.length}`);
console.log(`- Archivos latentes / huérfanos detectados: ${orphanFiles.length}\n`);

console.log(`🔍 [TOP ARCHIVOS HUÉRFANOS CON ALTA CAPACIDAD FUNCIONAL]`);
orphanFiles
  .sort((a, b) => b.exportsCount - a.exportsCount || b.lines - a.lines)
  .slice(0, 15)
  .forEach(item => {
    console.log(`📄 Archivo: ${item.file} (${item.lines} líneas, ${item.exportsCount} exports)`);
    console.log(`   Capacidades: ${item.capabilities.join(', ') || 'Utilidad General / Configuración'}`);
    console.log('---');
  });
