const fs = require('fs');
const path = require('path');

const MEDIA_DIR = 'H:\\incubadora despegue\\CATALOGO_DESPEGUE\\00_MEDIA_RECUPERADA';
const DANI_DIR = 'H:\\incubadora despegue\\DANI_ARAGON_FORMACION\\AUDIOS_MANAGERS_Y_AR';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function organizeMediaInbox() {
  console.log('🏛️ INICIANDO CLASIFICACIÓN DE MEDIA RECUPERADO...');
  ensureDir(DANI_DIR);

  let daniCount = 0;
  let despegueCount = 0;
  let duplicatesRemoved = 0;

  const seenSizes = new Map();

  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`❌ No se encontró la carpeta ${MEDIA_DIR}`);
    return;
  }

  const files = fs.readdirSync(MEDIA_DIR);

  files.forEach(file => {
    const fullPath = path.join(MEDIA_DIR, file);
    try {
      const stats = fs.statSync(fullPath);

      // 1. Mover todo lo referente a Dani Aragón
      if (/dani_aragon|ART_AUDIOS_DE_DANI|management|clases_de_canto|artista/i.test(file)) {
        const destPath = path.join(DANI_DIR, file);
        fs.renameSync(fullPath, destPath);
        daniCount++;
        console.log(`[🎵 DANI ARAGÓN -> DEDICADO]: ${file}`);
        return;
      }

      // 2. Filtrar duplicados con sufijos de backup (_123456789.mp4)
      if (/_\d{6,}\./.test(file)) {
        fs.unlinkSync(fullPath);
        duplicatesRemoved++;
        console.log(`[🗑️ DUPLICADO DE SUFIJO ELIMINADO]: ${file}`);
        return;
      }

      // 3. Filtrar por tamaño idéntico exacto
      if (seenSizes.has(stats.size)) {
        fs.unlinkSync(fullPath);
        duplicatesRemoved++;
        console.log(`[🗑️ DUPLICADO POR TAMAÑO ELIMINADO]: ${file}`);
      } else {
        seenSizes.set(stats.size, file);
        despegueCount++;
      }

    } catch (e) {
      // Ignorar errores de acceso
    }
  });

  console.log('\n==================================================');
  console.log(`✅ ORGANIZACIÓN DE MEDIA COMPLETADA`);
  console.log(`🎵 Audios de Dani Aragón trasladados: ${daniCount}`);
  console.log(`📹 Vídeos/Audios de Despegue consolidados: ${despegueCount}`);
  console.log(`🗑️ Duplicados purgados: ${duplicatesRemoved}`);
  console.log('==================================================');
}

organizeMediaInbox();
