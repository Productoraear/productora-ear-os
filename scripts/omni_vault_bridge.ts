import fs from 'fs';
import readline from 'readline';

const filePath = 'H:\\EAR_GOLDEN_INDEX.csv';
const outputPath = 'src/data/vault_seed.json';

async function extractSeed() {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const keywords = ['proveedor', 'catalogo', 'tarifa', 'rider', 'servicio', 'boda', 'wedding', 'sound', 'light'];
  const results: any[] = [];

  for await (const line of rl) {
    if (results.length >= 50) break;
    const match = line.match(/^"([^"]+)"/);
    const path = match ? match[1] : line.split(',')[0];
    
    if (!path) continue;
    const lower = path.toLowerCase();
    
    if (keywords.some(k => lower.includes(k)) && (lower.endsWith('.json') || lower.endsWith('.md') || lower.endsWith('.ts'))) {
      results.push({
        id: `srv-${results.length + 1}`,
        name: path.split('\\').pop() || `Servicio ${results.length + 1}`,
        category: 'PRODUCTION_SERVICE',
        unitPrice: 350 + (results.length * 15),
        sourcePath: path,
        status: 'AVAILABLE'
      });
    }
  }

  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`[EXITO] Extraídos ${results.length} activos semilla en ${outputPath}`);
}

extractSeed().catch(console.error);