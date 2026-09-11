import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import Database from 'better-sqlite3';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = path.join(__dirname, '..', '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'golden_index.db');
const db = new Database(dbPath);

// Crear la tabla con FTS5
db.exec(`
  CREATE TABLE IF NOT EXISTS golden_index (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS fts_index USING fts5(filename, filepath);
`);

const csvFilePath = path.join(__dirname, '..', '..', '..', 'data', 'EAR_GOLDEN_INDEX_2.csv');

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    const insertStmt = db.prepare(`
      INSERT INTO golden_index (filename, filepath) VALUES (@filename, @filepath);
    `);

    const insertFtsStmt = db.prepare(`
      INSERT INTO fts_index (filename, filepath) VALUES (@filename, @filepath);
    `);

    insertStmt.run(row);
    insertFtsStmt.run(row);
  })
  .on('end', () => {
    console.log('CSV procesado y datos migrados a la base de datos SQLite.');
  });
