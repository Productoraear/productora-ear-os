const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEST_MEDIA = 'H:\\incubadora despegue\\CATALOGO_DESPEGUE\\00_MEDIA_RECUPERADA';
const WHISPER_INDEX_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\rag_whisper_index.json';

// Extensiones multimedia universales
const MEDIA_EXTENSIONS = ['.mp4', '.mp3', '.m4a', '.wav', '.mkv', '.avi', '.mov', '.flv', '.aac', '.ogg'];

// Exclusiones del sistema
const SYSTEM_EXCLUSIONS = ['Windows', 'Program Files', 'Program Files (x86)', 'AppData', '$Recycle.Bin', 'node_modules', '.git'];

function getAllDrives() {
  try {
    const stdout = execSync('wmic logicaldisk get caption', { encoding: 'utf8' });
    return stdout.split('\n').map(l => l.trim()).filter(l => /^[A-Z]:$/i.test(l)).map(d => d + '\\');
  } catch (e) {
    return ['C:\\', 'H:\\'];
  }
}

function runMediaHunter() {
  console.log('🎥 INICIANDO BÚSQUEDA MULTIMEDIA MULTI-UNIDAD...');
  
  if (!fs.existsSync(DEST_MEDIA)) fs.mkdirSync(DEST_MEDIA, { recursive: true });

  // Leer transcripciones existentes para NO repetir trabajo
  let processedFiles = new Set();
  if (fs.existsSync(WHISPER_INDEX_PATH)) {
    const indexData = JSON.parse(fs.readFileSync(WHISPER_INDEX_PATH, 'utf-8'));
    indexData.forEach(item => {
      if (item.filename) processedFiles.add(path.basename(item.filename, path.extname(item.filename)).toLowerCase());
    });
  }

  console.log(`📋 Transcripciones previas registradas: ${processedFiles.size}. Se omitirán si se encuentran los audios/vídeos originales.`);

  const drives = getAllDrives();
  let mediaFound = 0;

  function scan(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!SYSTEM_EXCLUSIONS.includes(entry.name) && !fullPath.includes('CATALOGO_DESPEGUE')) {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (MEDIA_EXTENSIONS.includes(ext)) {
          
          // Evaluar si contiene términos relativos a Despegue/Cursos/Velocity
          const isRelevant = /despegue|velocity|carles|alexandra|midas|copywriting|funnel|podcast|masterclass|clase|modulo|workshop/i.test(entry.name) ||
                             /despegue|velocity/i.test(fullPath);

          if (isRelevant) {
            const baseName = path.basename(entry.name, ext).toLowerCase();
            const targetPath = path.join(DEST_MEDIA, entry.name);

            if (processedFiles.has(baseName)) {
              console.log(`[⏭️ OMITIDO - YA TRANNSCRITO]: ${entry.name}`);
            } else {
              if (!fs.existsSync(targetPath) && fullPath !== targetPath) {
                try {
                  fs.copyFileSync(fullPath, targetPath);
                  mediaFound++;
                  console.log(`[📹 NUEVO MEDIA ENCONTRADO]: ${entry.name} -> Listo para transcribir.`);
                } catch (e) {}
              }
            }
          }
        }
      }
    }
  }

  drives.forEach(drive => {
    if (fs.existsSync(drive)) scan(drive);
  });

  console.log(`\n✅ Búsqueda completada. Nuevos archivos multimedia para transcribir: ${mediaFound}`);
}

runMediaHunter();