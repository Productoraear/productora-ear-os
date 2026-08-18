import fs from 'fs';
import path from 'path';

/**
 * 🧬 ADN EAR OS SCANNER & FORENSIC HARVESTER
 * Scans user workspaces for high-value UX/UI .tsx/.jsx components created in the last 6 years.
 * Extracts and consolidates candidates into 'src/adn_vault/' with an architectural index.
 */

const TARGET_VAULT_DIR = path.resolve(process.cwd(), 'src/adn_vault');
const SIX_YEARS_AGO = new Date(Date.now() - 6 * 365 * 24 * 60 * 60 * 1000);

const EXCLUDED_DIRS = [
  'node_modules', '.git', '.next', 'dist', 'build', 'out',
  'windows', 'program files', 'program files (x86)', 'appdata\\local\\temp',
  'appdata\\local\\microsoft', '.vscode', '.cache', 'system32'
];

const SEMANTIC_KEYWORDS = [
  'pricer', 'cotizad', 'calculat', 'modal', 'drawer', 'filter',
  'dossier', 'stripe', 'booking', 'checkout', 'rider', 'player',
  'vault', 'card', 'lead', 'hero', 'pricing', 'presupuesto'
];

interface DiscoveredComponent {
  originalPath: string;
  fileName: string;
  size: number;
  lastModified: Date;
  category: string;
  semanticScore: number;
  matchedKeywords: string[];
}

function shouldSkipDirectory(dirPath: string): boolean {
  const lower = dirPath.toLowerCase();
  return EXCLUDED_DIRS.some(ex => lower.includes(ex));
}

function analyzeSemanticContent(filePath: string): { score: number; keywords: string[]; category: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lower = content.toLowerCase();
    const matches: string[] = [];

    SEMANTIC_KEYWORDS.forEach(kw => {
      if (lower.includes(kw)) {
        matches.push(kw);
      }
    });

    let category = 'ui_general';
    if (matches.includes('pricer') || matches.includes('cotizad') || matches.includes('calculat') || matches.includes('pricing')) {
      category = 'pricing_engines';
    } else if (matches.includes('filter') || matches.includes('drawer') || matches.includes('modal')) {
      category = 'filters_and_modals';
    } else if (matches.includes('dossier') || matches.includes('lead') || matches.includes('booking')) {
      category = 'dossiers_and_conversion';
    } else if (matches.includes('player') || matches.includes('vault') || matches.includes('rider')) {
      category = 'multimedia_and_vault';
    }

    return {
      score: matches.length,
      keywords: matches,
      category
    };
  } catch {
    return { score: 0, keywords: [], category: 'unreadable' };
  }
}

async function scanDirectory(dir: string, results: DiscoveredComponent[], maxDepth = 4, currentDepth = 0) {
  if (currentDepth > maxDepth || shouldSkipDirectory(dir)) return;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath, results, maxDepth, currentDepth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.tsx' || ext === '.jsx') {
          try {
            const stats = fs.statSync(fullPath);
            if (stats.mtime >= SIX_YEARS_AGO && stats.size > 200) {
              const semantic = analyzeSemanticContent(fullPath);
              if (semantic.score >= 2) {
                results.push({
                  originalPath: fullPath,
                  fileName: entry.name,
                  size: stats.size,
                  lastModified: stats.mtime,
                  category: semantic.category,
                  semanticScore: semantic.score,
                  matchedKeywords: semantic.keywords
                });
              }
            }
          } catch {
            // Ignorar archivos inaccesibles
          }
        }
      }
    }
  } catch {
    // Ignorar directorios con permisos restringidos
  }
}

async function runAdnHarvest() {
  console.log('🧬 Iniciando barrido semántico de ADN EAR OS en el PC...\n');

  if (!fs.existsSync(TARGET_VAULT_DIR)) {
    fs.mkdirSync(TARGET_VAULT_DIR, { recursive: true });
  }

  const results: DiscoveredComponent[] = [];

  // Rutas prioritarias de búsqueda
  const rootScanPaths = [
    process.cwd(),
    path.resolve(process.env.USERPROFILE || 'C:\\Users\\M2-W10', 'Desktop'),
    path.resolve(process.env.USERPROFILE || 'C:\\Users\\M2-W10', 'Documents'),
    path.resolve(process.env.USERPROFILE || 'C:\\Users\\M2-W10', 'Downloads'),
    'C:\\EAR_OS_V2',
    'C:\\Users\\M2-W10'
  ].filter(p => fs.existsSync(p));

  const uniquePaths = Array.from(new Set(rootScanPaths));

  for (const rootPath of uniquePaths) {
    console.log(`🔍 Escaneando raíz: ${rootPath}`);
    await scanDirectory(rootPath, results, 4, 0);
  }

  // Deduplicar por nombre y tamaño
  const seen = new Set<string>();
  const uniqueResults = results.filter(r => {
    const key = `${r.fileName}_${r.size}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n🏆 Encontrados ${uniqueResults.length} componentes candidatos con ADN EAR OS.\n`);

  // Organizar y copiar a src/adn_vault/
  const categories = ['pricing_engines', 'filters_and_modals', 'dossiers_and_conversion', 'multimedia_and_vault', 'ui_general'];

  categories.forEach(cat => {
    const catDir = path.join(TARGET_VAULT_DIR, cat);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
  });

  let indexContent = `# 🧬 ADN EAR OS — BÓVEDA DE COMPONENTES EXTRAÍDOS DEL PC\n\n`;
  indexContent += `Fecha de extracción: ${new Date().toISOString()}\n`;
  indexContent += `Total de componentes consolidados: **${uniqueResults.length}**\n\n`;

  for (const comp of uniqueResults) {
    const targetCatDir = path.join(TARGET_VAULT_DIR, comp.category);
    const destPath = path.join(targetCatDir, comp.fileName);

    try {
      fs.copyFileSync(comp.originalPath, destPath);
      indexContent += `### 📦 \`${comp.fileName}\` (${comp.category})\n`;
      indexContent += `- **Ruta Origen**: \`${comp.originalPath}\`\n`;
      indexContent += `- **Score Semántico**: ${comp.semanticScore} matches (${comp.matchedKeywords.join(', ')})\n`;
      indexContent += `- **Modificado**: ${comp.lastModified.toLocaleDateString('es-ES')}\n\n`;
    } catch (e: any) {
      console.warn(`⚠️ No se pudo copiar ${comp.fileName}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(TARGET_VAULT_DIR, 'ADN_VAULT_INDEX.md'), indexContent, 'utf-8');
  console.log(`✅ Bóveda de ADN consolidada con éxito en: ${TARGET_VAULT_DIR}`);
  console.log(`📄 Índice generado en: src/adn_vault/ADN_VAULT_INDEX.md\n`);
}

runAdnHarvest();
