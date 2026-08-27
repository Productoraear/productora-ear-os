const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const keywords = [
  'vimume', 'terapeuta', 'geriatra', 'familiar', 'cuidadores', 'prensa', 
  'asociacion', 'afa', 'alzheimer', 'fundacion', 'silver economy', '40hz', 
  'neuroacustica', 'reminiscencia', 'banda sonora vital', 'patrocinio', 'sroi'
];

let matches = [];
let count = 0;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    try {
      const s = fs.statSync(full);
      if (s.isDirectory()) {
        if (!['node_modules', '.git', '.next', '.gemini'].includes(item)) {
          scanDir(full);
        }
      } else if (['.md', '.txt', '.json', '.ts', '.tsx'].includes(path.extname(full))) {
        count++;
        const str = fs.readFileSync(full, 'utf8').toLowerCase();
        for (const kw of keywords) {
          if (str.includes(kw)) {
            matches.push({ file: path.relative(rootDir, full), keyword: kw });
            break;
          }
        }
      }
    } catch (e) {}
  }
}

scanDir(rootDir);

const repDir = path.join(rootDir, 'scripts', 'reports');
if (!fs.existsSync(repDir)) fs.mkdirSync(repDir, { recursive: true });

fs.writeFileSync(
  path.join(repDir, 'VIMUME_FORENSIC_MINED_STAKEHOLDERS.json'),
  JSON.stringify({
    timestamp: new Date().toISOString(),
    filesScanned: count,
    totalStakeholderMatches: matches.length,
    matches: matches
  }, null, 2),
  'utf8'
);

console.log(`\n✅ Minería VIMUME finalizada: ${matches.length} archivos vinculados a los 11 arquetipos de VIMUME.`);
