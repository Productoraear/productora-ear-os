const fs = require('fs');
const path = require('path');

// Directorios a inspeccionar línea por línea
const SEARCH_TARGETS = [
  process.cwd(),
  'L:\\COPIA DE SEGURIDAD DE PROVEEDORES BODAS',
  'C:\\EAR_OS_V2'
];

// Ignorar carpetas pesadas de build/cache
const IGNORED_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', '.vercel'];

// Firmas semánticas a buscar dentro del CÓDIGO
const CAPABILITY_PATTERNS = {
  'Tinder/Swipe Matchmaker': /swipe|matchmaking|cardStack|dragGesture|tinder|swipeCard/i,
  'Bespoke Pricer & Price-Lock': /priceLock|sha256|freezePrice|bespokePricer|congelador/i,
  'Calculadora Acústica/Rider': /technicalWatts|bose|behringer|xr18|fbt|shure|soundCalculation|wattsPerPax/i,
  'UI Onyx / Divi Transmuter': /diviTransmuter|auraOnyx|sClassPanels|omegaCockpit|hunterPanel/i,
  'Gestor de Talentos/Edwin': /mariachi|edwinAgudelo|artistDirect|riderAudit|redDiamond/i,
  'Ledger / Commission Split': /split801010|auraWallet|commissionLedger|vimumeVault/i,
  'RBAC / Sovereign Login': /sovereignLogin|customClaims|singleAdmin|accessLevel/i
};

function scanFileContent(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > 2 * 1024 * 1024) return null; // Saltar archivos > 2MB

    const content = fs.readFileSync(filePath, 'utf-8');
    const matchedCapabilities = [];

    for (const [capability, pattern] of Object.entries(CAPABILITY_PATTERNS)) {
      if (pattern.test(content)) {
        matchedCapabilities.push(capability);
      }
    }

    if (matchedCapabilities.length === 0) return null;

    const lines = content.split('\n').length;
    const exportMatches = content.match(/export\s+(default\s+)?(function|const|class|type|interface)/g) || [];

    return {
      file: filePath,
      lines,
      exportsCount: exportMatches.length,
      capabilities: matchedCapabilities
    };
  } catch {
    return null;
  }
}

function traverseDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.includes(entry.name)) {
          traverseDirectory(fullPath, results);
        }
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx|json)$/i.test(entry.name)) {
        const audit = scanFileContent(fullPath);
        if (audit) results.push(audit);
      }
    }
  } catch {
    // Ignorar directorios protegidos del SO
  }

  return results;
}

console.log('⚡ [DEEP DISCOVERY] Escaneando contenido de código en discos locales...');

const allDiscoveries = [];
SEARCH_TARGETS.forEach(target => {
  console.log(`📍 Inspeccionando interior de archivos en: ${target}`);
  traverseDirectory(target, allDiscoveries);
});

// Eliminar duplicados por ruta de archivo
const uniqueDiscoveries = Array.from(new Map(allDiscoveries.map(item => [item.file, item])).values());

// Ordenar por relevancia funcional y volumen de líneas
uniqueDiscoveries.sort((a, b) => b.capabilities.length - a.capabilities.length || b.lines - a.lines);

console.log(`\n📊 [RESUMEN DE INSPECCIÓN PROFUNDA]`);
console.log(`- Total de archivos con lógica de vanguardia detectados: ${uniqueDiscoveries.length}\n`);

console.log('🔍 [ARCHIVOS CLAVE CON LÓGICA INTERNA DETECTADA]:');
uniqueDiscoveries.slice(0, 25).forEach((item, index) => {
  console.log(`${index + 1}. 📄 ${item.file}`);
  console.log(`   📏 Líneas: ${item.lines} | Exports: ${item.exportsCount}`);
  console.log(`   🛠️ Capacidades detectadas: ${item.capabilities.join(' | ')}`);
  console.log('---');
});

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'deep_discovery_report.json'),
  JSON.stringify(uniqueDiscoveries, null, 2)
);
console.log(`💾 Reporte completo guardado en: scripts/deep_discovery_report.json`);
