const fs = require('fs');
const path = require('path');

/**
 * EAR OS GOLD - CODEX INGESTION ENGINE
 * Lee archivos .md de /temp_codex/, los limpia y los vuelca en un Master JSON.
 */

const CODEX_DIR = path.join(__dirname, '../temp_codex');
const MASTER_JSON = path.join(__dirname, '../data_vault/codex_master.json');

async function ingest() {
  console.log('🚀 Iniciando Protocolo de Asimilación Codex...');

  if (!fs.existsSync(CODEX_DIR)) {
    console.log('⚠️ Carpeta /temp_codex/ no encontrada. Creándola...');
    fs.mkdirSync(CODEX_DIR);
    return;
  }

  const files = fs.readdirSync(CODEX_DIR).filter(f => f.endsWith('.md'));
  console.log(`📂 Detectados ${files.length} documentos para asimilación.`);

  let masterKnowledge = [];

  // Cargar master previo si existe
  if (fs.existsSync(MASTER_JSON)) {
    masterKnowledge = JSON.parse(fs.readFileSync(MASTER_JSON, 'utf8'));
  }

  files.forEach(file => {
    const filePath = path.join(CODEX_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Limpieza básica y extracción de metadata
    const entry = {
      source: file,
      timestamp: new Date().toISOString(),
      content: content.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""), // Limpieza de caracteres no imprimibles
      summary: content.split('\n')[0].replace('#', '').trim(), // Primera línea como resumen
    };

    masterKnowledge.push(entry);
    console.log(`✅ Asimilado: ${file}`);
    
    // Mover a procesados (opcional para no duplicar)
    // fs.renameSync(filePath, path.join(CODEX_DIR, 'processed_' + file));
  });

  // Guardar Master JSON
  fs.writeFileSync(MASTER_JSON, JSON.stringify(masterKnowledge, null, 2));
  console.log(`\n💎 Bóveda Actualizada: ${MASTER_JSON}`);
  console.log(`📈 Total de Entradas: ${masterKnowledge.length}`);
}

ingest().catch(console.error);
