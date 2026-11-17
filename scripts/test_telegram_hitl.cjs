const fs = require('fs');
const path = require('path');

function getEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    }
    return env;
  }
  return {};
}

async function sendHitl() {
  const env = getEnv();
  const botToken = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('ERROR: Credenciales TELEGRAM no encontradas en .env.local');
    return;
  }

  const text = '🚨 *HITL 90% · LEAD DE ALTA CUALIFICACIÓN OTZARRETA*\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '🏛️ *Finca / Espacio:* Ezkertza Berria & Otzarreta (Derio)\n' +
    '📅 *Fecha Solicitada:* 24 de junio de 2027 (Exclusividad 1 boda/día)\n' +
    '👥 *Comensales:* 90 pax (Menús adaptados celíacos + Parking 150 plazas)\n' +
    '🍷 *Menú Interés:* Menú Asador al Sarmiento / Ezkertza (155,00 € + IVA)\n' +
    '🎯 *Intención:* Bloqueo de fecha con fianza de 100 € (Deducible)\n' +
    '📍 *Origen:* Sovereign Concierge Widget (/otzarreta)\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '⚡ *Acción CEO:* Llamada prioritaria con Eduardo Martínez para visita técnica.';

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
    const data = await res.json();
    console.log('TELEGRAM HITL DISPATCH RESULT:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error enviando a Telegram:', err);
  }
}

sendHitl();
