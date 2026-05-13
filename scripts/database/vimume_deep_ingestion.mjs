import fs from 'fs';
import path from 'path';
import readline from 'readline';

const KEYWORDS = [
  'vimume', 'abuelos', 'abuelas', 'mayores', 'centros de dia', 'residencias', 
  'familiares', 'viaje musical por la memoria', 'terapeutas', 'musicoterapia', 
  'ods', 'alzheimer', 'sesion', 'sesión'
];

const TARGET_FILES = [
  'c:/EAR_OS_V2/EAR_OS_OMEGA_CODEX.md',
  'c:/EAR_OS_V2/data_vault/SESSION_OMEGA_RAG.json',
  'c:/EAR_OS_V2/data_vault/LOGS_MASTER_RAG.json'
];

const OUTPUT_FILE = 'c:/EAR_OS_V2/data_vault/VIMUME_EXTRACTED_KNOWLEDGE.json';

async function deepIngestion() {
  console.log("🚀 INICIANDO INGESTA PROFUNDA VIMUME S-CLASS...");
  const results = [];
  let idCounter = 1;

  for (const filePath of TARGET_FILES) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Archivo no encontrado: ${filePath}`);
      continue;
    }

    console.log(`🔍 Escaneando: ${filePath}`);
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineNumber = 0;
    for await (const line of rl) {
      lineNumber++;
      const lowerLine = line.toLowerCase();
      
      const foundKeywords = KEYWORDS.filter(kw => lowerLine.includes(kw));
      
      if (foundKeywords.length > 0) {
        // Capturamos un bloque de contexto (la línea misma y quizás algo más si es JSON)
        results.push({
          id: idCounter++,
          source: path.basename(filePath),
          line: lineNumber,
          keywords: foundKeywords,
          content: line.trim().substring(0, 1000), // Evitamos líneas infinitas
          level: Math.min(10, Math.max(1, foundKeywords.length)) // Nivel heurístico basado en densidad de keywords
        });
      }

      if (results.length >= 5000) break; // Límite de seguridad para no saturar
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`✅ INGESTA COMPLETADA. ${results.length} átomos localizados.`);
  console.log(`📡 Datos guardados en: ${OUTPUT_FILE}`);
}

deepIngestion().catch(console.error);
