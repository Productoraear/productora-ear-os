// scripts/audit_unresolved_ideas.js
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const auditDirs = ['docs', 'scripts', 'src', 'BASE_DE_CONOCIMIENTO', '.'];
const docExtensions = ['.md', '.txt', '.log'];
const ideaKeywords = ['TODO:', 'FIXME:', 'IDEA:', 'HIPÓTESIS:', 'PENDIENTE:', 'FALTA:'];

function getAllDocs(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
        arrayOfFiles = getAllDocs(fullPath, arrayOfFiles);
      }
    } else {
      if (docExtensions.includes(path.extname(file).toLowerCase())) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const uniqueFiles = new Set();
auditDirs.forEach(dir => {
  const target = path.join(projectRoot, dir);
  if (dir === '.') {
    if (fs.existsSync(target)) {
      fs.readdirSync(target).forEach(file => {
        const fullPath = path.join(target, file);
        if (!fs.statSync(fullPath).isDirectory() && docExtensions.includes(path.extname(file).toLowerCase())) {
          uniqueFiles.add(fullPath);
        }
      });
    }
  } else {
    getAllDocs(target).forEach(f => uniqueFiles.add(f));
  }
});

const allDocs = Array.from(uniqueFiles);
const unresolvedIdeas = [];

allDocs.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      ideaKeywords.forEach(keyword => {
        if (line.includes(keyword)) {
          unresolvedIdeas.push({
            file: path.relative(projectRoot, filePath),
            lineNum: index + 1,
            type: keyword.replace(':', ''),
            content: line.trim()
          });
        }
      });
    });
  } catch (err) {
    // Ignore read errors
  }
});

console.log(`\n📊 [OMNI-SCANNER S-CLASS] Minería de Documentos e Ideas`);
console.log(`- Documentos analizados: ${allDocs.length}`);
console.log(`- Ideas/Tareas sin resolver encontradas: ${unresolvedIdeas.length}\n`);

// Agrupar por archivo
const groupedIdeas = unresolvedIdeas.reduce((acc, curr) => {
  (acc[curr.file] = acc[curr.file] || []).push(curr);
  return acc;
}, {});

for (const [file, ideas] of Object.entries(groupedIdeas)) {
  console.log(`\n📄 Archivo: ${file}`);
  ideas.forEach(idea => {
    console.log(`   [${idea.type}] Línea ${idea.lineNum}: ${idea.content}`);
  });
}
