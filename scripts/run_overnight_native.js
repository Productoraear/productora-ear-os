const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest_clean.json';

function runNativeEngine() {
  console.log('🌙 INICIANDO ENGINE NATIVO DE INDEXACIÓN NOCTURNA...');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ No se encontró el manifiesto en ${MANIFEST_PATH}`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📋 Total de archivos en manifiesto: ${manifest.length}`);

  let processed = 0;
  let skipped = 0;

  manifest.forEach((item, index) => {
    const baseName = path.basename(item.name, path.extname(item.name));
    const targetTxt = path.join(item.targetDir, `${baseName}.txt`);

    if (fs.existsSync(targetTxt)) {
      skipped++;
      return;
    }

    if (!fs.existsSync(item.targetDir)) {
      fs.mkdirSync(item.targetDir, { recursive: true });
    }

    // Generación de metadatos y marcador de posición para RAG
    const summaryText = `[ACTIVO MULTIMEDIA INDEXADO]\nNombre: ${item.name}\nCátedra: ${item.category}\nRuta: ${item.fullPath}\nFecha: ${new Date().toISOString()}\n`;
    fs.writeFileSync(targetTxt, summaryText, 'utf-8');
    processed++;
  });

  console.log('==================================================');
  console.log(`✅ PROCESAMIENTO NATIVO COMPLETADO`);
  console.log(`📄 Registros creados: ${processed}`);
  console.log(`⏭️ Omitidos: ${skipped}`);
  console.log('==================================================');
}

runNativeEngine();
