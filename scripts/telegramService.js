/**
 * 🔫 GATILLO DEL CAZADOR - Telegram Live Notification Service
 * Envía alertas reales al móvil de CEO cuando un lead entra al sistema.
 * Usa la API Route de Next.js para proteger el token del lado server.
 */
/**
 * Dispara una notificación de Telegram a través del API Route del servidor.
 * NUNCA expone el token en el cliente.
 */
export async function notifyTelegramLead(payload) {
    try {
        const response = await fetch('/api/telegram/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            console.error('[TELEGRAM] Error en notificación:', response.statusText);
            return false;
        }
        const data = await response.json();
        return data.success === true;
    }
    catch (error) {
        console.error('[TELEGRAM] Error de red:', error);
        return false;
    }
}
