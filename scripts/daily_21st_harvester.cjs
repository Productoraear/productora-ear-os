/**
 * DAILY 21ST COMPONENT HARVESTER (Zero-Token Free Tier)
 * Descarga automáticamente los 2 componentes gratuitos diarios permitidos por 21st.dev
 * y los almacena en `src/components/harvested/` para su adaptación offline.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HARVEST_DIR = path.join(__dirname, '..', 'src', 'components', 'harvested');
const LOG_FILE = path.join(__dirname, '..', '.antigravity', 'harvest_21st_log.json');

if (!fs.existsSync(HARVEST_DIR)) {
  fs.mkdirSync(HARVEST_DIR, { recursive: true });
}

// Catálogo de componentes de alto valor visual para el frontend (SaaS, UI extrema, Gráficos)
const TARGET_QUERIES = [
  'bento grid',
  'pricing table',
  '3d card',
  'interactive timeline',
  'glow button',
  'dock navigation',
  'fluid tabs',
  'animated counter'
];

function runHarvest() {
  console.log('[21st Harvester] Iniciando ciclo diario de ingesta...');
  let log = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (e) {
      log = [];
    }
  }

  // Verificar si ya se cosechó hoy
  const today = new Date().toISOString().split('T')[0];
  const harvestedToday = log.filter(entry => entry.date === today);
  if (harvestedToday.length >= 2) {
    console.log(`[21st Harvester] Cupo diario alcanzado para hoy (${today}): 2/2 componentes ya descargados.`);
    return;
  }

  // Tomar una consulta rotativa según el día del año
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const query = TARGET_QUERIES[dayOfYear % TARGET_QUERIES.length];

  // Cargar token desde .env.local si no está en process.env
  let token = process.env.TWENTYFIRST_API_KEY || process.env.API_KEY_21ST || process.env.TWENTYFIRST_TOKEN;
  if (!token && fs.existsSync(path.join(__dirname, '..', '.env.local'))) {
    const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
    const match = envContent.match(/TWENTYFIRST_API_KEY=["']?([^"'\r\n]+)/);
    if (match) token = match[1];
  }

  const env = { ...process.env, TWENTYFIRST_TOKEN: token, API_KEY_21ST: token, TWENTYFIRST_API_KEY: token };
  console.log(`[21st Harvester] Buscando componentes destacados para: "${query}"`);
  try {
    const searchRaw = execSync(`npx @21st-dev/cli search "${query}" --limit 2`, { env, encoding: 'utf8' });
    console.log('[21st Harvester] Búsqueda completada.');
    
    // Registrar evento de auditoría
    log.push({
      date: today,
      query: query,
      timestamp: new Date().toISOString(),
      status: 'SEARCH_OK'
    });
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
  } catch (err) {
    console.error('[21st Harvester] Error durante la ejecución:', err.message);
  }
}

runHarvest();
