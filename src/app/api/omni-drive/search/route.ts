import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const dbPath = process.env.DB_PATH || '../../data/golden_index.db';
let db: any; try { db = new Database(dbPath); } catch (e) { console.warn('⚠️ [Build] Omitiendo carga estatica de DB local Omni-Drive'); }

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const stmt = db.prepare(`
    SELECT filename, filepath
    FROM fts_index
    WHERE fts_index MATCH ?
    ORDER BY rank
    LIMIT 50;
  `);

  const results = stmt.all(query);

  return NextResponse.json(results);
}
