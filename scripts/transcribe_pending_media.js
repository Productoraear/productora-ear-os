const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DESPEGUE = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER';
const OUTPUT_DANI = 'H:\\incubadora despegue\\DANI_ARAGON_FORMACION\\TRANSCRIPCIONES_DANI';
const OUTPUT_ROMUALD = 'H:\\ROMUALD_FONS_BIGSEO\\TRANSCRIPCIONES_ROMUALD';

// Patrones de Reconocimiento por Huella Semántica
const DESPEGUE_PATTERN = /despegue|velocity|carles|alexandra|midas|copywriting|funnel|hook|cro|atencion|workshop|masterclass|clase/i;
const DANI_PATTERN = /dani_aragon|ART_AUDIOS_DE_DANI|management|manager|canto|artista|musica/i;
const ROMUALD_PATTERN = /romuald|fons|bigseo|seo|orbital|tsa|crepas|armada|keyword|interlinking/i;

const MEDIA_EXTS = ['.mp4', '.mp3', '.m4a', '.wav', '.mkv', '.avi', '.mov', '.ogg', '.flv'];
const SYSTEM_EXCLUSIONS = ['Windows', 'Program Files', 'Program Files (x86)', 'AppData', '$Recycle.Bin', 'node_modules', '.git'];

function getDrives() {
  try {
    const stdout = execSync('wmic logicaldisk get caption', { encoding: 'utf8' });
    return stdout.split('\n').map(l => l.trim()).filter(l => /^[A-Z]:$/i.test(l)).map(d => d + '\\');
  } catch (e) {
    return ['C:\\', 'H:\\'];
  }
}

function runTriCatedraManifest() {
  console.log('🚀 CLASIFICANDO Y ESTRUCTURANDO EL MANIFIESTO DE 1.206 ARCHIVOS (TRI-CÁTEDRA)...');

  if (!fs.existsSync(OUTPUT_DESPEGUE)) fs.mkdirSync(OUTPUT_DESPEGUE, { recursive: true });
  if (!fs.existsSync(OUTPUT_DANI)) fs.mkdirSync(OUTPUT_DANI, { recursive: true });
  if (!fs.existsSync(OUTPUT_ROMUALD)) fs.mkdirSync(OUTPUT_ROMUALD, { recursive: true });

  const drives = getDrives();
  let pendingList = [];

  function scan(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!SYSTEM_EXCLUSIONS.includes(entry.name)) {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (MEDIA_EXTS.includes(ext)) {
          const isDespegue = DESPEGUE_PATTERN.test(entry.name) || DESPEGUE_PATTERN.test(fullPath);
          const isDani = DANI_PATTERN.test(entry.name) || DANI_PATTERN.test(fullPath);
          const isRomuald = ROMUALD_PATTERN.test(entry.name) || ROMUALD_PATTERN.test(fullPath);

          if (isDespegue || isDani || isRomuald) {
            let category = 'DESPEGUE';
            let targetDir = OUTPUT_DESPEGUE;

            if (isRomuald) {
              category = 'ROMUALD_FONS';
              targetDir = OUTPUT_ROMUALD;
            } else if (isDani) {
              category = 'DANI_ARAGON';
              targetDir = OUTPUT_DANI;
            }

            pendingList.push({ fullPath, name: entry.name, category, targetDir });
          }
        }
      }
    }
  }

  drives.forEach(d => {
    if (fs.existsSync(d)) scan(d);
  });

  const despegueItems = pendingList.filter(x => x.category === 'DESPEGUE');
  const daniItems = pendingList.filter(x => x.category === 'DANI_ARAGON');
  const romualdItems = pendingList.filter(x => x.category === 'ROMUALD_FONS');

  console.log(`\n==================================================`);
  console.log(`📊 DESGLOSE DE TRI-CÁTEDRA REGISTRADA (${pendingList.length} ARCHIVOS):`);
  console.log(`1. Incubadora Despegue (CRO/Funnels): ${despegueItems.length} archivos`);
  console.log(`2. Dani Aragón (Management/Música): ${daniItems.length} archivos`);
  console.log(`3. Romuald Fons / BIGSEO (SEO/Tráfico): ${romualdItems.length} archivos`);
  console.log(`==================================================\n`);

  const manifestPath = path.join(OUTPUT_DESPEGUE, 'global_tricatedra_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(pendingList, null, 2), 'utf-8');
  console.log(`📄 Manifiesto estructurado guardado en: ${manifestPath}`);
}

runTriCatedraManifest();
