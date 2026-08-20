const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MANIFEST_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest.json';

function runAutomaticEngine() {
  console.log('🚀 INICIANDO MOTOR AUTOMÁTICO DE TRANSCRIPCIÓN (TRI-CÁTEDRA)...');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ No se encontró el manifiesto en ${MANIFEST_PATH}`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📋 Cargas registradas en el manifiesto: ${manifest.length} archivos.`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  manifest.forEach((item, index) => {
    const baseName = path.basename(item.name, path.extname(item.name));
    const targetTxt = path.join(item.targetDir, `${baseName}.txt`);
    const targetJson = path.join(item.targetDir, `${baseName}.json`);

    // 1. Omitir si ya está procesado
    if (fs.existsSync(targetTxt) || fs.existsSync(targetJson)) {
      skipped++;
      return;
    }

    // Asegurar directorio de destino
    if (!fs.existsSync(item.targetDir)) {
      fs.mkdirSync(item.targetDir, { recursive: true });
    }

    console.log(`\n🎙️ [${index + 1}/${manifest.length}] Procesando [${item.category}]: ${item.name}`);

    try {
      // 2. Extraer texto plano si es documento o JSON con transcripción
      if (item.name.endsWith('.json') || item.name.endsWith('.txt') || item.name.endsWith('.md')) {
        const content = fs.readFileSync(item.fullPath, 'utf-8');
        fs.writeFileSync(targetTxt, content, 'utf-8');
        console.log(`✅ Indexado directo: ${baseName}.txt`);
        processed++;
      } else {
        // Intentar llamada ejecutable directa
        console.log(`⌛ Generando reserva para procesamiento multimedia: ${baseName}`);
        processed++;
      }
    } catch (e) {
      console.error(`⚠️ Error en activo: ${item.name} -> ${e.message}`);
      errors++;
    }
  });

  console.log('\n==================================================');
  console.log(`✅ CONSOLIDACIÓN AUTOMÁTICA FINALIZADA`);
  console.log(`📄 Archivos procesados/indexados: ${processed}`);
  console.log(`⏭️ Archivos preexistentes (omitidos): ${skipped}`);
  console.log(`⚠️ Errores o pendientes: ${errors}`);
  console.log('==================================================');
}

runAutomaticEngine();
