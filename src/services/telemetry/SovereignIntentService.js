import { sendTelegramNotification } from '@/lib/services/telegram';
/**
 * SOVEREIGN INTENT SERVICE - V128.2
 * Telemetría de Alta Gravedad con Throttling Estratégico.
 */
let lastNotificationTime = 0;
const THROTTLE_MS = 60000; // 1 minuto entre notificaciones de la misma sesión
export const reportHighGravityIntent = async (event, context, details) => {
    const now = Date.now();
    // Solo disparar si es B2G_HIGH o B2B_HIGH con score alto
    const isHighGravity = context.intentClass === 'B2G_HIGH' || (context.intentClass === 'B2B_HIGH' && context.intentScore > 70);
    if (!isHighGravity)
        return;
    // Throttling
    if (now - lastNotificationTime < THROTTLE_MS)
        return;
    lastNotificationTime = now;
    const message = `
🎯 *INTENCIÓN DE ALTA GRAVEDAD DETECTADA*
Evento: \`${event}\`
Clase: \`${context.intentClass}\`
Score: \`${context.intentScore}%\`

📍 *Contexto:*
Nicho: ${context.lastNiches[0] || 'N/A'}
Provincia: ${context.lastProvinces[0] || 'N/A'}
Ruta: \`${details.route || 'N/A'}\`

🔍 *Query:*
\`${details.query || 'N/A'}\`

🚀 _EAR OS GOLD: Inteligencia Contextual Activa._
  `.trim();
    try {
        await sendTelegramNotification(message);
    }
    catch (e) {
        console.error("❌ Telemetría fallida:", e);
    }
};
