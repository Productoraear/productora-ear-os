import fs from 'fs';
import readline from 'readline';

const filePath = 'H:\\EAR_GOLDEN_INDEX.csv';

const fileStream = fs.createReadStream(filePath);

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  const headers = line.split(',');
  console.log(`Columnas del CSV: ${headers}`);
  rl.close();
});