import fs from 'fs';

const filePath = 'c:/EAR_OS_V2/data_vault/SESSION_OMEGA_RAG.json';
const bufferSize = 1024 * 1024; // 1MB chunks
const fd = fs.openSync(filePath, 'r');
let buffer = Buffer.alloc(bufferSize);
let bytesRead;
let totalProcessed = 0;
let foundStart = false;

console.log("Buscando inicio de datos reales...");

while ((bytesRead = fs.readSync(fd, buffer, 0, bufferSize)) > 0) {
  const chunk = buffer.slice(0, bytesRead).toString('utf8');
  const trimStart = chunk.search(/[^\s]/);
  
  if (trimStart !== -1) {
    console.log(`¡Datos encontrados en la posición ${totalProcessed + trimStart}!`);
    console.log("Muestra de datos:");
    console.log(chunk.substring(trimStart, trimStart + 1000));
    foundStart = true;
    break;
  }
  
  totalProcessed += bytesRead;
  if (totalProcessed > 50 * 1024 * 1024) { // Guard rail at 50MB
    console.log("No se encontraron datos en los primeros 50MB.");
    break;
  }
}

fs.closeSync(fd);
