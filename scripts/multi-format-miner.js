const fs = require('fs');
const path = require('path');

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(getFilesRecursively(file));
      }
    } else if (file.endsWith('.csv')) {
      results.push(file);
    }
  });
  return results;
}

const csvFiles = getFilesRecursively('.');
let allQuestions = [];

csvFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.toLowerCase().startsWith('question')) {
        const clean = trimmed.replace(/^"|"$/g, '').split(',')[0];
        if (clean) allQuestions.push(clean);
      }
    });
  } catch (e) {
    console.error(`Error al leer ${file}:`, e.message);
  }
});

const report = { csvFiles, totalQuestions: allQuestions.length, sample: allQuestions.slice(0, 10) };
fs.writeFileSync('scripts/reports/miner-audit.json', JSON.stringify(report, null, 2));
console.log(`Minería completada: ${csvFiles.length} archivos CSV encontrados, ${allQuestions.length} preguntas extraídas.`);
