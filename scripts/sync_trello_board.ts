import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = (process.env.TRELLO_API_KEY || '').replace(/['"]/g, '').trim();
const token = (process.env.TRELLO_TOKEN || '').replace(/['"]/g, '').trim();
const boardId = '4WyxsGBi';

async function inspectTrelloBoard() {
  console.log('📋 Consultando el estado actual de todas las tarjetas en Trello ("Produccion")...\n');

  try {
    // 1. Obtener listas
    const listsRes = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`);
    const lists = await listsRes.json();

    // 2. Obtener todas las tarjetas
    const cardsRes = await fetch(`https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${token}`);
    const cards = await cardsRes.json();

    for (const list of lists) {
      const listCards = cards.filter((c: any) => c.idList === list.id);
      console.log(`\n📂 [${list.name}] (${listCards.length} tarjetas) - ID: ${list.id}`);
      listCards.forEach((c: any, i: number) => {
        console.log(`   ${i + 1}. "${c.name}" -> ID: ${c.id}`);
      });
    }

  } catch (err) {
    console.error('❌ Error al inspeccionar Trello:', err);
  }
}

inspectTrelloBoard();
