/**
 * ════════════════════════════════════════════════════════════════════════════
 * GENERADOR FORENSE DEL GENOMA COMPLETO DE EAR OS (+900K / 1.2M TOKENS)
 * ════════════════════════════════════════════════════════════════════════════
 * Volcado mecánico y determinista en streaming para ingesta masiva en NotebookLM.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE_1 = path.join(ROOT_DIR, 'EAR_OS_GENOMA_TOTAL_900K.md');
const OUTPUT_FILE_2 = path.join(ROOT_DIR, 'EAR_OS_GENOMA_TOTAL_1.200.000K.md');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  '.turbo',
  'graphify-out',
  'dist',
  'build',
  '.firebase',
  'coverage',
  '.nyc_output',
  '__pycache__',
  '.cache'
]);

const BINARY_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.ico', '.svg_binary',
  '.pdf', '.mp3', '.m4a', '.mp4', '.mov', '.wav', '.ogg',
  '.zip', '.tar', '.gz', '.7z', '.rar',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.exe', '.bin', '.dll', '.so', '.dylib', '.pyc', '.wasm'
]);

// Extensiones de texto válidas
const VALID_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs',
  '.json', '.prisma', '.sql', '.css', '.scss',
  '.md', '.txt', '.yml', '.yaml', '.html'
]);

// Archivos o carpetas clave de primer nivel a incluir
const ROOT_INCLUDE_FILES = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'Dockerfile',
  'AGENTS.md',
  'CLINE_EXECUTION_LOG.md',
  'EAR_OS_GENOMA_TOTAL_ARQUITECTURA_FORENSE_SOTA.md'
];

const ROOT_INCLUDE_DIRS = [
  'src',
  'prisma',
  'scripts',
  'docs',
  'e2e'
];

function isBinary(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.has(ext);
}

function shouldProcessFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  
  for (const part of parts) {
    if (EXCLUDED_DIRS.has(part)) return false;
  }

  // Ignorar volcados masivos en carpetas generadas si exceden 2MB
  const fullPath = path.join(ROOT_DIR, relPath);
  try {
    const stat = fs.statSync(fullPath);
    if (stat.size > 2 * 1024 * 1024) { // omitir archivos individuales > 2MB
      return false;
    }
  } catch {
    return false;
  }

  const ext = path.extname(relPath).toLowerCase();
  if (isBinary(relPath)) return false;

  // Archivos raíz clave
  if (!parts[1] && ROOT_INCLUDE_FILES.includes(parts[0])) return true;

  // Directorios clave
  if (ROOT_INCLUDE_DIRS.includes(parts[0])) {
    return VALID_EXTENSIONS.has(ext);
  }

  return false;
}

function getAllFiles(dir, fileList = [], baseDir = ROOT_DIR) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        getAllFiles(fullPath, fileList, baseDir);
      }
    } else if (entry.isFile()) {
      if (shouldProcessFile(relPath)) {
        fileList.push(relPath);
      }
    }
  }
  return fileList;
}

function getLanguageFromExt(ext) {
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'typescript';
    case '.js':
    case '.jsx':
    case '.cjs':
    case '.mjs':
      return 'javascript';
    case '.json':
      return 'json';
    case '.prisma':
      return 'prisma';
    case '.sql':
      return 'sql';
    case '.css':
      return 'css';
    case '.md':
      return 'markdown';
    case '.yml':
    case '.yaml':
      return 'yaml';
    case '.html':
      return 'html';
    default:
      return 'text';
  }
}

async function generateGenome() {
  console.log('=== INICIANDO EXTRACCIÓN DEL GENOMA COMPLETO DE EAR OS ===');
  console.log('Directorio base:', ROOT_DIR);

  const files = getAllFiles(ROOT_DIR).sort();
  console.log(`Archivos seleccionados para volcado: ${files.length}`);

  const writeStream = fs.createWriteStream(OUTPUT_FILE_1, { encoding: 'utf8' });

  // Cabecera del Dossier
  writeStream.write(`# 🏛️ EAR OS — GENOMA FORENSE TOTAL & VOLCADO ÍNTEGRO DEL REPOSITORIO
**Autoridad:** Edwin Agudelo (Director Generalista / CEO)  
**Custodio:** Antigravity (Arquitecto de Sistemas & Guardián Constitucional)  
**Entorno:** Producción Bare-Metal Coolify (82.29.179.172:8000) · \`productoraear.com\`  
**Sello SSOT:** \`cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b\`  
**Reglas Canónicas del Oráculo:** 100/100 Compiladas (Bloques 1 a 10)  
**Fecha de Volcado:** ${new Date().toISOString()}  
**Total de Archivos Incluidos:** ${files.length}  

---

## ÍNDICE ANATÓMICO DE ARCHIVOS INCLUIDOS

`);

  for (const f of files) {
    writeStream.write(`- \`${f.replace(/\\/g, '/')}\`\n`);
  }

  writeStream.write(`\n---\n\n## VOLCADO ÍNTEGRO DE ARCHIVOS DE CÓDIGO FUENTE\n\n`);

  let processedCount = 0;
  let totalLines = 0;

  for (const relPath of files) {
    const fullPath = path.join(ROOT_DIR, relPath);
    const normalizedPath = relPath.replace(/\\/g, '/');
    const ext = path.extname(relPath).toLowerCase();
    const lang = getLanguageFromExt(ext);

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n').length;
      totalLines += lines;

      writeStream.write(`\n\n════════════════════════════════════════════════════════════════════════════════\n`);
      writeStream.write(`### FICHERO: ${normalizedPath} (${lines} líneas)\n`);
      writeStream.write(`════════════════════════════════════════════════════════════════════════════════\n\n`);
      writeStream.write(`\`\`\`${lang}\n`);
      writeStream.write(content);
      if (!content.endsWith('\n')) writeStream.write('\n');
      writeStream.write(`\`\`\`\n`);

      processedCount++;
      if (processedCount % 50 === 0 || processedCount === files.length) {
        console.log(`Procesados ${processedCount}/${files.length} archivos...`);
      }
    } catch (err) {
      console.warn(`Aviso: No se pudo leer ${relPath}: ${err.message}`);
    }
  }

  writeStream.end();

  await new Promise((resolve) => writeStream.on('finish', resolve));

  // Generar copia con el segundo nombre solicitado
  fs.copyFileSync(OUTPUT_FILE_1, OUTPUT_FILE_2);

  const stats = fs.statSync(OUTPUT_FILE_1);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  const estimatedTokens = Math.round(stats.size / 3.8); // ratio estándar UTF-8 a tokens

  console.log('\n=== GENOMA FORENSE TOTAL GENERADO CON ÉXITO ===');
  console.log(`Ruta 1: ${OUTPUT_FILE_1}`);
  console.log(`Ruta 2: ${OUTPUT_FILE_2}`);
  console.log(`Tamaño exacto: ${sizeMb} MB (${stats.size} bytes)`);
  console.log(`Total de archivos volcados: ${processedCount}`);
  console.log(`Total de líneas de código: ${totalLines.toLocaleString('es-ES')}`);
  console.log(`Tokens estimados: ~${estimatedTokens.toLocaleString('es-ES')} tokens`);

  // Escribir resumen en JSON para consumo directo
  const summary = {
    file_900k: OUTPUT_FILE_1,
    file_1200k: OUTPUT_FILE_2,
    size_mb: parseFloat(sizeMb),
    size_bytes: stats.size,
    total_files: processedCount,
    total_lines: totalLines,
    estimated_tokens: estimatedTokens,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(path.join(ROOT_DIR, '.antigravity', 'GENOMA_SUMMARY.json'), JSON.stringify(summary, null, 2), 'utf8');
}

generateGenome().catch((err) => {
  console.error('Error fatal al generar el genoma:', err);
  process.exit(1);
});
