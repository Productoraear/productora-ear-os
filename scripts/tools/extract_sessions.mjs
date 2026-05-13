import fs from 'fs';
import readline from 'readline';

const TARGET_FILE = 'c:/EAR_OS_V2/EAR_OS_OMEGA_CODEX.md';
const SESSION_PATTERN = /(Sesión|Sesion|Session)\s*(\d+)/i;

async function findProtocol() {
  console.log("🔍 BUSCANDO PROTOCOLO DE 52 SESIONES...");
  const sessions = {};
  
  const fileStream = fs.createReadStream(TARGET_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentSession = null;
  let context = [];

  for await (const line of rl) {
    const match = line.match(SESSION_PATTERN);
    if (match) {
      if (currentSession && context.length > 0) {
        sessions[currentSession] = context.join('\n').substring(0, 2000);
      }
      currentSession = match[0].toUpperCase();
      context = [line];
    } else if (currentSession) {
      if (context.length < 50) { // Capturamos 50 líneas de contexto por sesión
        context.push(line);
      }
    }
  }

  // Guardar última sesión
  if (currentSession) sessions[currentSession] = context.join('\n');

  fs.writeFileSync('c:/EAR_OS_V2/data_vault/VIMUME_SESSIONS_PROTOCOL.json', JSON.stringify(sessions, null, 2));
  console.log(`✅ PROTOCOLO LOCALIZADO: ${Object.keys(sessions).length} sesiones identificadas.`);
}

findProtocol().catch(console.error);
