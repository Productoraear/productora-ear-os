const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest_clean.json';

function processSeoCatedra() {
  if (!fs.existsSync(MANIFEST_PATH)) return;
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const seoItems = manifest.filter(x => x.category === 'ROMUALD_FONS');

  console.log(`🚀 CÁTEDRA SEO DETECTADA: ${seoItems.length} archivos para transcribir.`);
  console.log(`📄 Listo para iniciar el procesado en lote a texto plano.`);
}

processSeoCatedra();
