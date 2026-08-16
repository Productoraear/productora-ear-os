const fs = require('fs');
const path = 'C:\\EAR_OS_V2\\docs\\release\\COMPREHENSIVE_FORENSIC_INVENTORY.json';

try {
  console.log('Loading JSON manifest...');
  let content = fs.readFileSync(path, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  const data = JSON.parse(content);

  console.log('=========================================================');
  console.log('   AUDITORÍA FORENSE S-CLASS // MANIFIESTO CONSOLIDADO   ');
  console.log('=========================================================');
  console.log(`Total de Archivos Indexados: ${data.TotalFiles}`);
  console.log(`Fecha de Indexación (UTC): ${data.GeneratedAtUtc}`);
  console.log('');

  const extMap = {};
  data.Files.forEach(f => {
    extMap[f.Extension] = (extMap[f.Extension] || 0) + 1;
  });

  console.log('--- DESGLOSE POR EXTENSIÓN ---');
  Object.entries(extMap)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      console.log(`  ${ext.padEnd(10)}: ${count} archivos`);
    });

  console.log('');
  console.log('--- TOP 25 ACTIVOS MONOLÍTICOS (>30KB) TSX / TS / JSON ---');
  const largeFiles = data.Files
    .filter(f => f.SizeBytes > 30000 && (f.Extension === '.tsx' || f.Extension === '.ts' || f.Extension === '.json'))
    .sort((a, b) => b.SizeBytes - a.SizeBytes)
    .slice(0, 25);

  largeFiles.forEach((f, idx) => {
    const sizeKB = (f.SizeBytes / 1024).toFixed(1);
    console.log(`${(idx + 1).toString().padStart(2)}. [${sizeKB} KB] ${f.Name}`);
    console.log(`    Ruta: ${f.FullPath}`);
  });

} catch (err) {
  console.error('Error procesando manifiesto:', err.message);
}
