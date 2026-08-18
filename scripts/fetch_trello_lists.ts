import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = (process.env.TRELLO_API_KEY || '').replace(/['"]/g, '').trim();
const token = (process.env.TRELLO_TOKEN || '').replace(/['"]/g, '').trim();

async function getBoardLists() {
  console.log('🔍 Consultando las listas/columnas de tu tablero "Produccion" (4WyxsGBi)...');
  const boardId = '4WyxsGBi';

  try {
    const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error('❌ Error al consultar Trello:', res.status, await res.text());
      return;
    }

    const lists = await res.json();
    console.log(`\n✅ Columnas encontradas en el tablero (${lists.length}):`);
    lists.forEach((l: any, index: number) => {
      console.log(`[${index + 1}] "${l.name}" -> ID: ${l.id}`);
    });
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

getBoardLists();
