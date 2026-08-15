import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SERVICE_ACCOUNT_FILE = path.join(process.cwd(), 'service-account-key.json');

async function triggerBatchIndexing() {
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.error('❌ Falta service-account-key.json para autenticar con Google Indexing API.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({ version: 'v3', auth });

  const categories = ['musica', 'fotografia', 'animacion', 'catering', 'organizacion'];
  const provinces = ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga', 'toledo', 'alicante', 'cadiz', 'zaragoza'];

  console.log('⚡ [GOOGLE INDEXER] Iniciando inyección masiva de URLs programáticas...');

  for (const cat of categories) {
    for (const prov of provinces) {
      const targetUrl = `https://www.productoraear.com/servicios/${cat}/${prov}`;

      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url: targetUrl,
            type: 'URL_UPDATED',
          },
        });
        console.log(`✅ URL enviada a índice de Google: ${targetUrl}`);
      } catch (err: any) {
        console.error(`❌ Error en envío de ${targetUrl}:`, err.message);
      }
    }
  }
}

triggerBatchIndexing();
