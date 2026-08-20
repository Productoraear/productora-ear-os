const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest.json';
const EDWIN_MUSIC_DIR = 'H:\\00_PRODUCTORA_EAR\\REPERTORIO_EDWIN_AGUDELO';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function refineTricatedra() {
  console.log('🏛️ INICIANDO DEPURACIÓN Y REPOSICIONAMIENTO CANÓNICO...');
  ensureDir(EDWIN_MUSIC_DIR);

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ No se encontró el manifiesto.');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  let edwinMoved = 0;
  let cleanManifest = [];

  manifest.forEach(item => {
    const fileName = item.name;

    // 1. Identificar canciones e interpretaciones de Edwin Agudelo
    if (/canta Edwin Agudelo|Autor Edwin Agudelo|Edwin Agudelo/i.test(fileName)) {
      const targetPath = path.join(EDWIN_MUSIC_DIR, fileName);
      try {
        if (fs.existsSync(item.fullPath) && !fs.existsSync(targetPath)) {
          fs.renameSync(item.fullPath, targetPath);
        }
        edwinMoved++;
        console.log(`[🎵 REPERTORIO EDWIN AGUDELO]: ${fileName}`);
      } catch (e) {}
    } else {
      cleanManifest.push(item);
    }
  });

  const refinedManifestPath = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest_clean.json';
  fs.writeFileSync(refinedManifestPath, JSON.stringify(cleanManifest, null, 2), 'utf-8');

  console.log('\n==================================================');
  console.log(`✅ DEPURACIÓN COMPLETADA`);
  console.log(`🎵 Canciones e interpretaciones movidas a Productora EAR: ${edwinMoved}`);
  console.log(`📚 Archivos académicos reales en la Tri-Cátedra: ${cleanManifest.length}`);
  console.log('==================================================');
}

refineTricatedra();
