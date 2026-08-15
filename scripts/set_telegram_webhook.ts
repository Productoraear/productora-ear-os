import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VERCEL_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;

async function configureWebhook() {
  if (!BOT_TOKEN || !VERCEL_URL) {
    console.error('❌ Falta TELEGRAM_BOT_TOKEN o la URL de despliegue en las variables de entorno.');
    process.exit(1);
  }

  const cleanUrl = VERCEL_URL.startsWith('http') ? VERCEL_URL : `https://${VERCEL_URL}`;
  const webhookEndpoint = `${cleanUrl}/api/telegram/webhook`;

  console.log(`⚡ Configurando Webhook de Telegram hacia: ${webhookEndpoint}`);

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookEndpoint }),
    });

    const data = await response.json();
    if (data.ok) {
      console.log('✅ Webhook de Telegram vinculado con éxito.');
      console.log('📡 Telegram API Response:', data);
    } else {
      console.error('❌ Error al vincular Webhook:', data);
    }
  } catch (error) {
    console.error('❌ Error en la petición a Telegram:', error);
  }
}

configureWebhook();
