const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MANIFEST_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest_clean.json';
const ERROR_LOG_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\transcription_errors.log';

function runOvernightProcess() {
  console.log('🌙 INICIANDO MOTOR DE TRANSCRIPCIÓN NOCTURNA TRI-CÁTEDRA (1.291 ARCHIVOS)...');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ No se encontró el manifiesto en ${MANIFEST_PATH}`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const total = manifest.length;
  console.log(`📋 Total de archivos programados para el lote nocturno: ${total}`);

  let completed = 0;
  let skipped = 0;
  let failed = 0;

  const startTime = Date.now();

  manifest.forEach((item, index) => {
    const baseName = path.basename(item.name, path.extname(item.name));
    const targetTxt = path.join(item.targetDir, `${baseName}.txt`);
    const targetJson = path.join(item.targetDir, `${baseName}.json`);

    // Asegurar directorio
    if (!fs.existsSync(item.targetDir)) {
      fs.mkdirSync(item.targetDir, { recursive: true });
    }

    // Omitir si ya fue procesado
    if (fs.existsSync(targetTxt) || fs.existsSync(targetJson)) {
      skipped++;
      return;
    }

    console.log(`\n🎙️ [${index + 1}/${total}] Transcribiendo [${item.category}]: ${item.name}`);

    try {
      // Intento de transcripción
      const command = `whisper "${item.fullPath}" --model medium --language Spanish --output_dir "${item.targetDir}" --output_format txt`;
      execSync(command, { stdio: 'inherit' });
      completed++;
    } catch (e) {
      console.error(`⚠️ Error al procesar ${item.name}: ${e.message}`);
      failed++;
      
      const errorEntry = `[${new Date().toISOString()}] File: ${item.fullPath} | Error: ${e.message}\n`;
      fs.appendFileSync(ERROR_LOG_PATH, errorEntry, 'utf-8');
    }
  });

  const durationHours = ((Date.now() - startTime) / (1000 * 60 * 60)).toFixed(2);

  console.log('\n==================================================');
  console.log(`✅ LOTE NOCTURNO COMPLETADO (${durationHours} horas de procesamiento)`);
  console.log(`📄 Transcripciones creadas: ${completed}`);
  console.log(`⏭️ Omitidos (preexistentes): ${skipped}`);
  console.log(`⚠️ Errores registrados: ${failed}`);
  console.log(`📜 Registro de errores guardado en: ${ERROR_LOG_PATH}`);
  console.log('==================================================');
}

runOvernightProcess();
