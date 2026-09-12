import fs from 'fs';
import path from 'path';

console.log('🔍 [ZTM INTEL SEARCH] Minando análisis estratégico de gigantes del sector bodas...\n');

const vaultDir = path.join(process.cwd(), 'src/data/wedding_intel_vault');
const targetKeywords = [
  'Bodas.net',
  'Global Wedding Report',
  'Informe sector nupcial',
  'Customer Journey',
  'SEO Guide',
  'Optimiza tu Funnel',
  '6 secretos',
  'Libro Imprescindible'
];

if (!fs.existsSync(vaultDir)) {
  console.error('❌ Directorio Vault no localizado en:', vaultDir);
  process.exit(1);
}

const files = fs.readdirSync(vaultDir);
const matches: { name: string; sizeMB: string; path: string }[] = [];

for (const file of files) {
  const isMatch = targetKeywords.some(kw => file.toLowerCase().includes(kw.toLowerCase()));
  if (isMatch) {
    const fullPath = path.join(vaultDir, file);
    const stat = fs.statSync(fullPath);
    matches.push({
      name: file,
      sizeMB: (stat.size / 1048576).toFixed(2),
      path: fullPath
    });
  }
}

console.log(`✨ Encontrados ${matches.length} documentos estratégicos clave de Bodas.net:\n`);

matches.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));

for (const m of matches) {
  console.log(` 📄 [${m.sizeMB} MB] ${m.name}`);
}

console.log('\n✅ Minería de archivos clave completada. ZTM listo.');
