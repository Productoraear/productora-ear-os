const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\01_ESTRATEGIA_Y_CHATS';
const OUTPUT_FILE = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\MEGA_EXPORT_ESTRATEGIA.md';

console.log('[ZTM EXPORT] Iniciando concatenación por Streams sin saturar memoria...');

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`[ERROR] No existe el directorio: ${SOURCE_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(SOURCE_DIR).filter(f => !f.startsWith('.'));
console.log(`[ZTM EXPORT] ${files.length} archivos detectados para consolidar.`);

const writeStream = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf-8', flags: 'w' });

async function streamFiles() {
  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    console.log(` -> Procesando stream: ${file} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
    writeStream.write(`\n\n========================================\n[ARCHIVO: ${file}]\n[RUTA: ${filePath}]\n[TIMESTAMP: ${new Date().toISOString()}]\n========================================\n\n`);

    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
      readStream.on('data', chunk => writeStream.write(chunk));
      readStream.on('end', resolve);
      readStream.on('error', reject);
    });
  }

  writeStream.end();
}

streamFiles().then(() => {
  const finalStat = fs.statSync(OUTPUT_FILE);
  console.log(`\n======================================================`);
  console.log(`[EXITO] MEGA_EXPORT_ESTRATEGIA.md generado con éxito.`);
  console.log(`Ubicación: ${OUTPUT_FILE}`);
  console.log(`Tamaño Total: ${(finalStat.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`======================================================\n`);
  process.exit(0);
}).catch(err => {
  console.error('[ERROR CRÍTICO EN STREAM]:', err);
  process.exit(1);
});
