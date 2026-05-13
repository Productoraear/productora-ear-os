import fs from 'fs';
import readline from 'readline';

const filePath = 'c:/EAR_OS_V2/data_vault/LOGS_MASTER_RAG.json';
const outputSessions = 'c:/EAR_OS_V2/data_vault/VIMUME_SESSIONS_EXTRACTED.json';

async function extractSessions() {
  console.log("🔍 Escaneando LOGS_MASTER_RAG para localizar las 52 sesiones...");
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const sessions = [];
  let currentSession = null;
  let count = 0;

  for await (const line of rl) {
    // Buscamos patrones de sesiones en el JSON
    if (line.includes('"sesion"') || line.includes('"sesión"') || line.includes('Sesión ') || line.includes('Sesion ')) {
      // Si detectamos una línea que parece el inicio de una sesión o contiene datos de sesión
      sessions.push({
        id: ++count,
        content: line.trim()
      });
    }
    
    if (sessions.length >= 500) break; // Límite para no saturar en esta fase
  }

  fs.writeFileSync(outputSessions, JSON.stringify(sessions, null, 2));
  console.log(`✅ Extracción terminada. Se encontraron ${sessions.length} referencias a sesiones.`);
}

extractSessions().catch(console.error);
