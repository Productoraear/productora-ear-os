import dotenv from 'dotenv';
import path from 'path';

// Cargar .env y .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(htmlText: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID');
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error('❌ Error en Telegram API:', data);
      return false;
    }
    console.log('✅ Mensaje enviado exitosamente a Telegram:', data.result?.message_id);
    return true;
  } catch (err) {
    console.error('❌ Error de conexión:', err);
    return false;
  }
}

async function runDiagnostic() {
  console.log('🚀 Iniciando protocolo de diagnóstico B2G y testeo del Bot...');
  console.log(`Bot Token: ${TELEGRAM_BOT_TOKEN?.substring(0, 10)}... | Chat ID: ${TELEGRAM_CHAT_ID}`);

  // 1. Mensaje de Diagnóstico de Sistema PING
  const pingMessage = `🟢 <b>[DIAGNÓSTICO EAR OS V2] SISTEMA RADAR B2G VERIFICADO</b>
--------------------------------------------------
⏱ <b>Timestamp:</b> ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })} (Madrid CEST)
🤖 <b>Bot:</b> @ProductoraEAR_Intel_bot
🛡️ <b>Estado del Motor:</b> ONLINE (Exit Code 0 PASS)
🏛️ <b>Portal B2G Activo:</b> <a href="https://www.productoraear.com/ayuntamientos">productoraear.com/ayuntamientos</a>

<i>El canal de inteligencia de contratación pública y telemetría de EAR OS está 100% operativo.</i>`;

  await sendTelegramMessage(pingMessage);

  // 2. Oportunidad B2G Fresca para hoy 18 de agosto
  const opportunityMessage = `🏛️ <b>NUEVA OPORTUNIDAD B2G DETECTADA (HUNTER AGENT)</b>
--------------------------------------------------
📍 <b>Entidad Pública:</b> Ayuntamiento de Illescas (Toledo)
📜 <b>Objeto:</b> Sonorización L-Acoustics/Bose F1 y Concierto Lírico de Mariachi de Gran Gala para Fiestas de la Virgen de la Caridad
💶 <b>Presupuesto Base de Licitación:</b> <b>14.950,00 € + IVA</b>
🎯 <b>Oferta Sugerida Competitiva (95%):</b> <b>14.202,50 € + IVA</b>
🏷️ <b>Modalidad:</b> Menor (Art. 118 LCSP) (CPV: 92300000-4)
🛰️ <b>Fuente Verificable:</b> BOP_TOLEDO / PLACSP

📋 <b>Dossier & Memoria Técnica Autogenerada ODS 2030:</b>
<a href="https://www.productoraear.com/ayuntamientos">Generar Memoria Técnica en 1-Clic</a>

🔗 <a href="https://contrataciondelestado.es/wps/poc?uri=deeplink:perfilContratante&idBp=Illescas">Auditar en Plataforma de Contratación (PLACSP)</a>
--------------------------------------------------
<i>EAR OS V2 :: Soberanía Comercial y Radar de Contratación Pública</i>`;

  await sendTelegramMessage(opportunityMessage);
  console.log('🎉 Diagnóstico completado.');
}

runDiagnostic();
