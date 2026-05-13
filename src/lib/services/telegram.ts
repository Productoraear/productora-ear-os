
/**
 * 📡 TELEGRAM TELEMETRY SERVICE
 * Sistema de notificación forense para ventas y eventos críticos.
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(message: string, chatId?: string) {
  const targetId = chatId || TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !targetId) {
    console.warn('⚠️ Telegram telemetry not configured. Missing TOKEN or TARGET_ID.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Telegram Notification Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error);
  }
}
