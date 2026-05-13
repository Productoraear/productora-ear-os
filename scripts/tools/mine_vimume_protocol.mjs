import fs from 'fs';
import readline from 'readline';

const filePath = 'c:/EAR_OS_V2/data_vault/SESSION_OMEGA_RAG.json';
const protocolKeywords = ['Viaje Musical por la Memoria', 'Sesión 1', 'Sesión 2', 'Semana 1', 'Semana 2', 'alzheimer', 'musicoterapia'];
const foundSessions = [];

async function scanProtocol() {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;
    const lowerLine = line.toLowerCase();
    if (protocolKeywords.some(kw => lowerLine.includes(kw.toLowerCase()))) {
      foundSessions.push({
        line: lineNumber,
        content: line.substring(0, 500).trim()
      });
    }
    if (foundSessions.length > 100) break; // Limit for preview
  }

  console.log(JSON.stringify(foundSessions, null, 2));
}

scanProtocol();
