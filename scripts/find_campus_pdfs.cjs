const fs = require('fs');
const path = require('path');

const targetRoots = ['H:\\', 'D:\\', 'E:\\'];
const keywords = ['campus', 'bodas', 'wedding', 'proveedor', 'guia', 'libro', 'manual', 'ebook', 'novios', 'venta', 'closing', 'informe'];
const skipDirs = ['node_modules', '.git', '.next', 'windows', 'program files', 'program files (x86)', 'appdata', '$recycle.bin', 'system volume information'];

const results = [];

function scanDir(dir, depth = 0) {
  if (depth > 6) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const nameLower = entry.name.toLowerCase();
      if (entry.isDirectory()) {
        if (skipDirs.some(s => nameLower.includes(s))) continue;
        scanDir(path.join(dir, entry.name), depth + 1);
      } else if (entry.isFile()) {
        if (nameLower.endsWith('.pdf') || nameLower.endsWith('.docx') || nameLower.endsWith('.epub')) {
          const fullPath = path.join(dir, entry.name);
          const fullPathLower = fullPath.toLowerCase();
          const matches = keywords.some(k => nameLower.includes(k) || fullPathLower.includes(k));
          if (matches) {
            try {
              const stat = fs.statSync(fullPath);
              results.push({
                path: fullPath,
                sizeBytes: stat.size,
                sizeMB: (stat.size / (1024 * 1024)).toFixed(2),
                name: entry.name,
                mtime: stat.mtime
              });
              if (results.length % 50 === 0) {
                console.log(`Encontrados ${results.length} documentos...`);
              }
            } catch (e) {}
          }
        }
      }
    }
  } catch (err) {
    // Silently ignore access denied
  }
}

console.log('Iniciando escaneo de documentos en H:\\...');
scanDir('H:\\');

console.log(`Total encontrados en H:\\: ${results.length}`);
if (results.length < 20) {
  console.log('Buscando también en E:\\ y D:\\...');
  scanDir('E:\\');
  scanDir('D:\\');
}

console.log(`\n========================================`);
console.log(`TOTAL ARCHIVOS LOCALIZADOS: ${results.length}`);
console.log(`========================================`);

// Ordenar por tamaño y mostrar los primeros 40
results.sort((a, b) => b.sizeBytes - a.sizeBytes);
const sample = results.slice(0, 50);
console.log(JSON.stringify({ total: results.length, top50: sample }, null, 2));

// Guardar índice en vault_absorbed
const outDir = path.join(__dirname, '..', 'vault_absorbed', 'bodas_net_intel');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'inventario_campus_local.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('Inventario completo guardado en vault_absorbed/bodas_net_intel/inventario_campus_local.json');
