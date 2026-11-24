/**
 * ════════════════════════════════════════════════════════════════════════════
 * S-CLASS HARVESTER: VAULT VELOCITY / INCUBADORA DESPEGUE (ZTLM)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina Halcón Peregrino · Zero-Token Local Mirroring (ZTLM).
 * Localiza, indexa, desduplica y consolida en `knowledge/vault_velocity_incubadora/`
 * todo el material intelectual de Velocity, Incubadora Despegue y satélites.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const VAULT_DIR = path.join(ROOT_DIR, 'knowledge', 'vault_velocity_incubadora');

const DIRS = {
  transcripciones: path.join(VAULT_DIR, 'transcripciones'),
  documentos: path.join(VAULT_DIR, 'documentos'),
  datos_esquemas: path.join(VAULT_DIR, 'datos_esquemas'),
  multimedia_meta: path.join(VAULT_DIR, 'multimedia_meta'),
};

const KEYWORDS = [
  'velocity',
  'incubadora despegue',
  'despegue',
  'eje 1',
  'eje 6',
  'visual business school',
  'visual factory',
  'hacking',
  'oferta irresistible',
  'aristocrático',
  'aristocratico',
  'high ticket',
  'llamada de calificación',
  'llamada de calificacion',
  'closer',
];

const EXTENSIONS = new Set([
  '.pdf',
  '.md',
  '.txt',
  '.json',
  '.jsonl',
  '.csv',
  '.mp3',
  '.mp4',
  '.wav',
  '.docx',
  '.pptx',
  '.vtt',
  '.srt',
]);

const MULTIMEDIA_EXTS = new Set(['.mp3', '.mp4', '.wav']);
const TRANSCRIPCIONES_EXTS = new Set(['.txt', '.md', '.vtt', '.srt']);
const DOCUMENTOS_EXTS = new Set(['.pdf', '.docx', '.pptx']);
const DATOS_EXTS = new Set(['.json', '.jsonl', '.csv']);

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.gemini',
  'knowledge/vault_velocity_incubadora',
  'vault_velocity_incubadora',
]);

// Crear carpetas de destino
Object.values(DIRS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function calculateSha256(filePath) {
  const hash = crypto.createHash('sha256');
  const buffer = fs.readFileSync(filePath);
  hash.update(buffer);
  return hash.digest('hex');
}

function countWords(filePath, ext) {
  if (['.txt', '.md', '.vtt', '.srt', '.csv'].includes(ext)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const words = content.trim().split(/\s+/).filter(Boolean);
      return words.length;
    } catch {
      return 0;
    }
  }
  return 0;
}

function matchesHeuristics(filePath, ext) {
  const lowerPath = filePath.toLowerCase();
  for (const kw of KEYWORDS) {
    if (lowerPath.includes(kw)) {
      return true;
    }
  }

  // Si no coincide por ruta, revisar las primeras 50 líneas para archivos de texto/json
  if (['.txt', '.md', '.vtt', '.srt', '.json', '.jsonl', '.csv'].includes(ext)) {
    try {
      const fd = fs.openSync(filePath, 'r');
      const buffer = Buffer.alloc(16384);
      const bytesRead = fs.readSync(fd, buffer, 0, 16384, 0);
      fs.closeSync(fd);
      const snippet = buffer.toString('utf8', 0, bytesRead).toLowerCase();
      const lines = snippet.split('\n').slice(0, 50).join('\n');
      for (const kw of KEYWORDS) {
        if (lines.includes(kw)) {
          return true;
        }
      }
    } catch {
      // Ignorar archivos no legibles
    }
  }

  return false;
}

function scanDirectory(currentDir, results) {
  let entries;
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || relPath.startsWith('knowledge/vault_velocity_incubadora')) {
        continue;
      }
      scanDirectory(fullPath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        if (matchesHeuristics(fullPath, ext)) {
          results.push({ fullPath, relPath, ext, name: entry.name });
        }
      }
    }
  }
}

console.log('[VAULT] Iniciando barrido heurístico en:', ROOT_DIR);
const candidates = [];
scanDirectory(ROOT_DIR, candidates);

// Escaneo directo de los archivos ya presentes en la propia bóveda
function scanVaultDirectory(dir, results) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanVaultDirectory(fullPath, results);
    } else if (entry.isFile()) {
      if (entry.name === 'MANIFESTO_RECURSOS.json') continue;
      const ext = path.extname(entry.name).toLowerCase();
      const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
      results.push({ fullPath, relPath, ext, name: entry.name });
    }
  }
}
scanVaultDirectory(VAULT_DIR, candidates);

console.log(`[VAULT] Candidatos localizados: ${candidates.length}`);

// Desduplicación por SHA-256
const inventoryByHash = new Map();

for (const candidate of candidates) {
  let stats;
  try {
    stats = fs.statSync(candidate.fullPath);
  } catch {
    continue;
  }

  const sha256 = calculateSha256(candidate.fullPath);

  if (inventoryByHash.has(sha256)) {
    const existing = inventoryByHash.get(sha256);
    if (!existing.original_paths.includes(candidate.relPath)) {
      existing.original_paths.push(candidate.relPath);
    }
  } else {
    let category = 'documentos';
    let targetSubdir = DIRS.documentos;

    if (MULTIMEDIA_EXTS.has(candidate.ext)) {
      category = 'multimedia_meta';
      targetSubdir = DIRS.multimedia_meta;
    } else if (TRANSCRIPCIONES_EXTS.has(candidate.ext)) {
      category = 'transcripciones';
      targetSubdir = DIRS.transcripciones;
    } else if (DATOS_EXTS.has(candidate.ext)) {
      category = 'datos_esquemas';
      targetSubdir = DIRS.datos_esquemas;
    }

    const wordCount = countWords(candidate.fullPath, candidate.ext);

    inventoryByHash.set(sha256, {
      filename: candidate.name,
      sha256,
      original_paths: [candidate.relPath],
      sourcePath: candidate.fullPath,
      category,
      targetSubdir,
      ext: candidate.ext,
      size_bytes: stats.size,
      word_count: wordCount,
    });
  }
}

console.log(`[VAULT] Archivos únicos desduplicados: ${inventoryByHash.size}`);

// Copiar archivos únicos o generar metadata para multimedia
const finalInventory = [];
const summaryByExt = {};
let totalBytes = 0;

for (const item of inventoryByHash.values()) {
  totalBytes += item.size_bytes;
  summaryByExt[item.ext] = (summaryByExt[item.ext] || 0) + 1;

  if (MULTIMEDIA_EXTS.has(item.ext)) {
    // Para multimedia no copiamos el binario pesado: escribimos metadatos
    const metaFilename = `${path.parse(item.filename).name}_${item.sha256.substring(0, 8)}.meta.json`;
    const metaDest = path.join(item.targetSubdir, metaFilename);
    const metaContent = {
      filename: item.filename,
      sha256: item.sha256,
      size_bytes: item.size_bytes,
      size_mb: (item.size_bytes / (1024 * 1024)).toFixed(2),
      ext: item.ext,
      original_paths: item.original_paths,
      recorded_at: new Date().toISOString(),
    };
    fs.writeFileSync(metaDest, JSON.stringify(metaContent, null, 2), 'utf8');
    finalInventory.push({
      filename: item.filename,
      vault_ref: `multimedia_meta/${metaFilename}`,
      sha256: item.sha256,
      original_paths: item.original_paths,
      category: item.category,
      ext: item.ext,
      size_bytes: item.size_bytes,
      word_count: item.word_count,
    });
  } else {
    // Para documentos, transcripciones y datos copiamos el archivo conservando nombre (con prefijo hash si colisiona)
    let destName = item.filename;
    let destPath = path.join(item.targetSubdir, destName);

    if (fs.existsSync(destPath)) {
      const existingHash = calculateSha256(destPath);
      if (existingHash !== item.sha256) {
        destName = `${item.sha256.substring(0, 8)}_${item.filename}`;
        destPath = path.join(item.targetSubdir, destName);
      }
    }

    if (path.resolve(item.sourcePath) !== path.resolve(destPath)) {
      fs.copyFileSync(item.sourcePath, destPath);
    }

    finalInventory.push({
      filename: destName,
      vault_ref: `${item.category}/${destName}`,
      sha256: item.sha256,
      original_paths: item.original_paths,
      category: item.category,
      ext: item.ext,
      size_bytes: item.size_bytes,
      word_count: item.word_count,
    });
  }
}

// Generar MANIFESTO_RECURSOS.json
const manifesto = {
  version: '1.0.0-S-CLASS',
  generated_at: new Date().toISOString(),
  vault_root: 'knowledge/vault_velocity_incubadora',
  total_files: finalInventory.length,
  total_size_bytes: totalBytes,
  total_size_mb: (totalBytes / (1024 * 1024)).toFixed(2),
  total_size_gb: (totalBytes / (1024 * 1024 * 1024)).toFixed(4),
  files_by_extension: summaryByExt,
  inventory: finalInventory,
};

const manifestoPath = path.join(VAULT_DIR, 'MANIFESTO_RECURSOS.json');
fs.writeFileSync(manifestoPath, JSON.stringify(manifesto, null, 2), 'utf8');

// Sincronizar espejo para el oráculo en src/lib/oraculo/
const oraculoManifestoPath = path.join(ROOT_DIR, 'src', 'lib', 'oraculo', 'vault-manifesto.json');
fs.copyFileSync(manifestoPath, oraculoManifestoPath);

console.log('[VAULT] ✅ Manifiesto generado con éxito en:', manifestoPath);
console.log('[VAULT] ✅ Espejo sincronizado en:', oraculoManifestoPath);
console.log(`[VAULT] Resumen: ${finalInventory.length} archivos | ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
