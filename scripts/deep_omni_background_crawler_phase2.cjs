const fs = require('fs');
const readline = require('readline');
const path = require('path');

const INPUT_CSV = 'H:\\EAR_GOLDEN_INDEX.csv';
const OUTPUT_JSON = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\01_ESTRATEGIA_Y_CHATS\\REMAINING_60_PERCENT_INFRASTRUCTURE.json';

console.log('[ZTM CRAWLER] Iniciando rastreo profundo de infraestructura...');

if (!fs.existsSync(INPUT_CSV)) {
  console.error(`[ERROR] No existe el índice maestro: ${INPUT_CSV}`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(INPUT_CSV),
  crlfDelay: Infinity
});

const results = [];
const patterns = [
  /\\hooks\\/i,
  /\\store\\/i,
  /\\context\\/i,
  /\\ui\\/i,
  /\\components\\/i,
  /\\lib\\/i,
  /tailwind\.config/i,
  /prisma/i,
  /\.tsx$/i
];

const rescuePath = 'H:\\ARCHIVO_HISTORICO_EAR\\RESCATES_Y_SANTUARIOS';

rl.on('line', (line) => {
  // El CSV de WizTree suele tener: FileName,Size,Allocated,Modified,Attributes,Path
  // Buscamos rutas que contengan el patrón de rescate y alguna de las palabras clave
  if (line.includes(rescuePath) && !line.includes('node_modules') && !line.includes('dist')) {
    const matches = patterns.some(pattern => pattern.test(line));
    if (matches) {
      results.push(line);
    }
  }
});

rl.on('close', () => {
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2));
  console.log(`\n======================================================`);
  console.log(`[EXITO] Rastreo completado.`);
  console.log(`Archivos de infraestructura encontrados: ${results.length}`);
  console.log(`Reporte generado en: ${OUTPUT_JSON}`);
  console.log(`======================================================\n`);
  process.exit(0);
});
