const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MANIFEST_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest.json';

function startBatchProcessing() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ No se encontró el manifiesto en ${MANIFEST_PATH}`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`🚀 INICIANDO BATCH DE TRANSCRIPCIÓN: ${manifest.length} ARCHIVOS`);

  let completed = 0;
  let skipped = 0;

  for (const item of manifest) {
    const baseName = path.basename(item.name, path.extname(item.name));
    const targetTxt = path.join(item.targetDir, `${baseName}.txt`);
    const targetJson = path.join(item.targetDir, `${baseName}.json`);

    // Saltar si ya existe la transcripción
    if (fs.existsSync(targetTxt) || fs.existsSync(targetJson)) {
      skipped++;
      continue;
    }

    console.log(`\n🎙️ [${completed + skipped + 1}/${manifest.length}] Transcribiendo [${item.category}]: ${item.name}`);

    try {
      // Ejecución de Whisper local en Python (modelo medium/large)
      const command = `whisper "${item.fullPath}" --model medium --language Spanish --output_dir "${item.targetDir}" --output_format all`;
      execSync(command, { stdio: 'inherit' });
      completed++;
    } catch (e) {
      console.error(`⚠️ Error al transcribir ${item.name}: ${e.message}`);
    }
  }

  console.log('\n==================================================');
  console.log(`✅ PROCESO DE TRANSCRIPCIÓN BATCH FINALIZADO`);
  console.log(`📄 Transcripciones procesadas: ${completed}`);
  console.log(`⏭️ Archivos omitidos (ya existentes): ${skipped}`);
  console.log('==================================================');
}

startBatchProcessing();
