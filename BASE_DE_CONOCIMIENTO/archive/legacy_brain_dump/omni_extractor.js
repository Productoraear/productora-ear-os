const fs = require('fs');
const path = require('path');

/**
 * 🏛️ OMNI-EXTRACTOR V1.0: PROTOCOLO DE INGENIERÍA INVERSA S-CLASS
 * Misión: Unificación atómica de EAR OS desde discos H:, F:, D:
 * Autor: Arquitecto Omega (Antigravity)
 */

const CONFIG = {
  drives: ['H:', 'F:', 'D:'],
  extensions: ['.tsx', '.ts', '.md', '.json', '.py'],
  outputFile: 'EAR_OS_OMEGA_CODEX.md',
  levels: [
    { id: 1, name: 'SOBERANÍA', keywords: ['auth', 'nexus', 'jwt', 'security', 'role'], anchor: 'auth_nexus_sovereignty' },
    { id: 2, name: 'INTELIGENCIA', keywords: ['vampire', 'scraper', 'hunter', 'rag', 'ingest', 'ingest'], anchor: 'vampire_rag_intelligence' },
    { id: 3, name: 'NERVIO CENTRAL', keywords: ['commandcenter', 'telemetry', 'focal', 'dashboard'], anchor: 'command_center_nerve' },
    { id: 4, name: 'LOGÍSTICA', keywords: ['fleet', 'bespoke', 'shield', 'dispatch', 'logistics', 'fleet'], anchor: 'logistics_bespoke_fleet' },
    { id: 5, name: 'CRM & DOMINANCIA', keywords: ['expansion', 'crm', 'leads', 'sovereign', 'revenue'], anchor: 'crm_expansion_dominance' },
    { id: 6, name: 'TRACKING TÁCTICO', keywords: ['tactical', 'tracker', 'progress', 'status'], anchor: 'tactical_progress_tracker' },
    { id: 7, name: 'GENERACIÓN DEMANDA', keywords: ['demand', 'marketing', 'funnel', 'campaign', 'landing', 'lp'], anchor: 'demand_generation_autonomous' },
    { id: 8, name: 'ALIANZAS TÁCTICAS', keywords: ['alliance', 'affiliate', 'partner', 'referral'], anchor: 'alliance_affiliate_network' },
    { id: 9, name: 'PREDICTIVE AI', keywords: ['astra', 'neural', 'prediction', 'ml', 'oracle'], anchor: 'predictive_analytics_astra' },
    { id: 10, name: 'DOMINANCIA TOTAL', keywords: ['autonomous', 'total', 'empire', 'unattended'], anchor: 'total_dominance_autonomous' }
  ],
  giants: {
    UBER: ['dispatch', 'fleet', 'tracker', 'ride', 'availability'],
    AIRBNB: ['booking', 'experience', 'luxe', 'host', 'listing', 'reservation'],
    TINDER: ['match', 'swipe', 'profile', 'discovery', 'score'],
    BODAS: ['scraper', 'vampire', 'wedding', 'portal', 'lead_extraction']
  }
};

const masterMap = new Map();

function walk(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist'].includes(file)) {
          walk(fullPath);
        }
      } else {
        const ext = path.extname(file).toLowerCase();
        if (CONFIG.extensions.includes(ext)) {
          processFile(fullPath, stat);
        }
      }
    }
  } catch (e) {
    // Silencio táctico ante discos no montados
  }
}

function processFile(fullPath, stat) {
  const fileName = path.basename(fullPath);
  
  if (!masterMap.has(fileName)) {
    masterMap.set(fileName, []);
  }
  
  masterMap.get(fileName).push({
    path: fullPath,
    size: stat.size,
    mtime: stat.mtime
  });
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
  const findings = {
    level: 0,
    giants: [],
    logic: 'Logic detected via keywords',
    dependencies: []
  };

  // Mapeo de Niveles
  for (const level of CONFIG.levels) {
    if (level.keywords.some(k => content.includes(k))) {
      findings.level = level.id;
      break;
    }
  }

  // Mapeo de Gigantes
  for (const [giant, keys] of Object.entries(CONFIG.giants)) {
    if (keys.some(k => content.includes(k))) {
      findings.giants.push(giant);
    }
  }

  // Extracción de dependencias (TS/JS simple)
  const importMatches = content.match(/from ['"](.+)['"]/g);
  if (importMatches) {
    findings.dependencies = importMatches.map(m => m.replace(/from ['"]|['"]/g, ''));
  }

  return findings;
}

function generateCodex() {
  console.log('🚀 INICIANDO VAMPIRIZACIÓN POR DENSIDAD...');
  let codex = `# 🏛️ EAR OS OMEGA CODEX — UNIFICACIÓN TOTAL\n`;
  codex += `> Generado automáticamente por el Protocolo Omni-Extractor | ${new Date().toISOString()}\n\n`;

  const categorized = Array.from({ length: 11 }, () => []);

  for (const [fileName, versions] of masterMap.entries()) {
    // VAMPIRIZACIÓN POR DENSIDAD: Ordenar por tamaño descendente
    versions.sort((a, b) => b.size - a.size);
    const base = versions[0];
    const complements = versions.slice(1);

    const analysis = analyzeFile(base.path);
    categorized[analysis.level].push({ fileName, base, complements, analysis });
  }

  // Generación por niveles
  CONFIG.levels.forEach(level => {
    codex += `\n## NIVEL ${level.id}: ${level.name} 🌌\n`;
    codex += `**Anchor Point**: \`${level.anchor}\`\n\n`;

    const modules = categorized[level.id];
    if (modules.length === 0) {
      codex += `*Sin módulos detectados en este nivel.*\n`;
    } else {
      modules.forEach(m => {
        codex += `### 📦 ${m.fileName}\n`;
        codex += `- **Ruta Base**: \`${m.base.path}\` (Peso: ${m.base.size} bytes)\n`;
        if (m.complements.length > 0) {
          codex += `- **Complementos Detectados**: \n${m.complements.map(c => `  * \`${c.path}\` (${c.size} bytes)`).join('\n')}\n`;
        }
        codex += `- **ADN de Gigantes**: ${m.analysis.giants.length > 0 ? m.analysis.giants.join(' + ') : 'PROPIETARIO'}\n`;
        codex += `- **Ventaja Injusta**: ${m.analysis.giants.includes('BODAS') ? 'Vampirización Atómica de Mercado' : 'Soberanía Operativa S-Class'}\n`;
        codex += `- **Dependencias Críticas**: \`${m.analysis.dependencies.slice(0, 5).join(', ')}${m.analysis.dependencies.length > 5 ? '...' : ''}\`\n\n`;
      });
    }
  });

  // Nivel 0 (No clasificados)
  codex += `\n## OTROS MÓDULOS (PENDIENTES DE CLASIFICACIÓN)\n`;
  categorized[0].forEach(m => {
    codex += `- \`${m.fileName}\` en \`${m.base.path}\`\n`;
  });

  fs.writeFileSync(CONFIG.outputFile, codex);
  console.log(`\n✅ OMEGA_CODEX.md GENERADO CON ÉXITO EN: ${path.resolve(CONFIG.outputFile)}`);
  console.log(`📊 Total archivos analizados: ${masterMap.size}`);
}

// IGNICIÓN
console.log('🏛️ ESCANEANDO DISCOS: H:, F:, D:...');
CONFIG.drives.forEach(drive => {
  console.log(`  - Procesando unidad ${drive}...`);
  walk(drive + '\\');
});

generateCodex();
