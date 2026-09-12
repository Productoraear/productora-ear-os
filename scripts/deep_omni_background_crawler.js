/**
 * 🌌 EAR OS - CRAWLER DE FONDO FORENSE ZTM (100% ACTIVOS DE ORO)
 * Procesa por streaming los 362.498 registros de H:\EAR_GOLDEN_INDEX.csv
 * Extrae y clasifica absolutamente TODA la infraestructura técnica vanguardista.
 * 
 * Salida:
 *  - H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\00_CATALOGO_MAESTRO_100_PORCIENTO_ASTRONAUTAS.json
 *  - H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\00_CATALOGO_MAESTRO_100_PORCIENTO_ASTRONAUTAS.md
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const CSV_PATH = 'H:\\EAR_GOLDEN_INDEX.csv';
const VAULT_OUTPUT_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT';
const JSON_OUTPUT = path.join(VAULT_OUTPUT_DIR, '00_CATALOGO_MAESTRO_100_PORCIENTO_ASTRONAUTAS.json');
const MD_OUTPUT = path.join(VAULT_OUTPUT_DIR, '00_CATALOGO_MAESTRO_100_PORCIENTO_ASTRONAUTAS.md');

if (!fs.existsSync(VAULT_OUTPUT_DIR)) {
  fs.mkdirSync(VAULT_OUTPUT_DIR, { recursive: true });
}

console.log('🚀 Iniciando Crawler Forense ZTM de Fondo en H:\\EAR_GOLDEN_INDEX.csv...');

const CATEGORIES = {
  ALGORITMOS_Y_MOTORES: {
    name: 'Motores Algorítmicos y Matemáticos',
    keywords: ['hungarian', 'orchestrat', 'pricer', 'pricing', 'acoustic', 'spl', 'licitacion', 'tender', 'cuebridge', 'matcher', 'matching', 'dispatch', 'totp', 'split', 'b2g', 'claim', 'vampire', 'crypto', 'sha256', 'acid'],
    matches: []
  },
  MARKETING_Y_HABILIDADES_TACTICAS: {
    name: 'Marketing Skills & Psicología de Conversión',
    keywords: ['marketingskill', 'ab-test', 'cro', 'copywriting', 'seo', 'cold-email', 'launch', 'lead-magnet', 'psychology', 'referral', 'revops', 'sales-enablement', 'churn', 'ad-creative', 'funnel', 'oraculo', 'objecion'],
    matches: []
  },
  SERVICIOS_ENTERPRISE_Y_GEMELOS: {
    name: 'Servicios Enterprise & Digital Twins',
    keywords: ['eartwin', 'eartwinaudio', 'predator', 'sentinel', 'vimumehunter', 'weddingmatch', 'telemetry', 'broadcaster', 'sniper', 'ops', 'concierge', 'astra', 'agent', 'contract', 'affiliate'],
    matches: []
  },
  UI_TACTICA_Y_DASHBOARDS_SCLASS: {
    name: 'UI Táctica, Pantallas NASA y Cockpits S-Class',
    keywords: ['fleetradar', 'kineticmatcher', 'oraclebudget', 'technicaltwin', 'commandcenter', 'cockpit', 'chauffeur', 'livecommand', 'bentocard', 'neuraljourney', 'tindermatcher', 'bespoke', 'visor'],
    matches: []
  },
  PLANOS_XMIND_Y_ONTOLOGIAS: {
    name: 'Planos Mentales XMind, Grafos y Ontologías',
    keywords: ['.xmind', 'blueprint', 'ontolog', 'knowledge_graph', 'catedra', 'matriz', 'sitemap', 'unio', 'master_map', 'adn_vault'],
    matches: []
  },
  INTELIGENCIA_PROVEEDORES_Y_SCRAPERS: {
    name: 'Spiders, Crawlers y Cosechadores de Datos',
    keywords: ['vampiriz', 'harvester', 'spider', 'nightcrawler', 'crawler', 'bodas', 'celebrents', 'fander', 'shadowprofile', 'ingest'],
    matches: []
  }
};

let totalLines = 0;
let matchedFiles = 0;
const seenPaths = new Set();

const fileStream = fs.createReadStream(CSV_PATH, { encoding: 'utf8' });
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  totalLines++;

  if (totalLines === 1) return; // Skip CSV header

  // WizTree CSV format: "FileName","Size","Allocated","Modified","Attributes","Files","Folders"
  // Extraer la ruta limpia
  let cleanLine = line.trim();
  if (cleanLine.startsWith('"') && cleanLine.endsWith('"')) {
    cleanLine = cleanLine.slice(1, -1);
  }
  const parts = cleanLine.split('","');
  const filePath = parts[0] || '';
  const size = parts[1] || '';

  if (!filePath || seenPaths.has(filePath)) return;

  const lowerPath = filePath.toLowerCase();
  const ext = path.extname(lowerPath);

  // Filtrar extensiones relevantes para código y arquitectura
  const validExts = ['.ts', '.tsx', '.py', '.js', '.jsx', '.json', '.md', '.xmind', '.sql', '.html', '.css'];
  if (!validExts.includes(ext)) return;

  // Evaluar contra taxonomías
  for (const [catKey, catObj] of Object.entries(CATEGORIES)) {
    for (const kw of catObj.keywords) {
      if (lowerPath.includes(kw)) {
        seenPaths.add(filePath);
        matchedFiles++;
        catObj.matches.push({
          path: filePath,
          size: size,
          ext: ext,
          keyword: kw,
          filename: path.basename(filePath)
        });
        break;
      }
    }
  }

  if (totalLines % 50000 === 0) {
    console.log(`[Crawler Progreso] ${totalLines} líneas leídas | ${matchedFiles} componentes de oro identificados...`);
  }
});

rl.on('close', () => {
  console.log('======================================================');
  console.log(`🏁 CRAWLER COMPLETADO`);
  console.log(`Líneas procesadas: ${totalLines}`);
  console.log(`Componentes únicos consolidados: ${matchedFiles}`);
  console.log('======================================================');

  // Guardar JSON
  const resultJson = {
    timestamp: new Date().toISOString(),
    total_records_scanned: totalLines,
    total_golden_components: matchedFiles,
    categories: {}
  };

  for (const [k, v] of Object.entries(CATEGORIES)) {
    resultJson.categories[k] = {
      name: v.name,
      count: v.matches.length,
      items: v.matches
    };
  }

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(resultJson, null, 2), 'utf8');
  console.log(`💾 JSON guardado en: ${JSON_OUTPUT}`);

  // Generar Markdown S-Class
  let md = `# 🌌 CATÁLOGO MAESTRO FORENSE: 100% ACTIVOS DE ORO (ZTM)\n`;
  md += `**Fuente SSOT:** \`${CSV_PATH}\` | **Registros Analizados:** ${totalLines.toLocaleString('es-ES')} | **Activos de Élite Identificados:** ${matchedFiles.toLocaleString('es-ES')}\n`;
  md += `**Fecha de Compilación:** ${new Date().toLocaleString('es-ES')}\n\n`;
  md += `---\n\n`;

  for (const [k, v] of Object.entries(CATEGORIES)) {
    md += `## 📂 ${v.name} (${v.matches.length} Activos)\n\n`;
    md += `| Nombre de Archivo | Extensión | Coincidencia Clave | Ruta Completa en Disco |\n`;
    md += `| :--- | :---: | :---: | :--- |\n`;

    // Tomar los top 150 por categoría para evitar que el MD supere 5 MB pero mostrando lo más crítico
    const sample = v.matches.slice(0, 150);
    for (const item of sample) {
      md += `| \`${item.filename}\` | \`${item.ext}\` | \`${item.keyword}\` | \`${item.path}\` |\n`;
    }
    if (v.matches.length > 150) {
      md += `| *... y ${v.matches.length - 150} componentes más en el JSON maestro.* | | | |\n`;
    }
    md += `\n---\n\n`;
  }

  fs.writeFileSync(MD_OUTPUT, md, 'utf8');
  console.log(`📄 Markdown guardado en: ${MD_OUTPUT}`);
  console.log('✨ Misión de fondo finalizada con éxito.');
});
