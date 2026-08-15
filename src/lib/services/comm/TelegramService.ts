/**
 * 📡 TELEGRAM SERVICE - VIMUME OS COMMUNICATION BRIDGE
 * Encrypted alert system for VIMUME OS.
 */

export class TelegramService {
    private botToken: string;
    private adminChatId: string;

    constructor() {
        // Usamos las variables del .env.local recuperado
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.adminChatId = process.env.TELEGRAM_CHAT_ID || '';
    }

    /**
     * Envía una alerta crítica al terminal móvil del Comandante.
     */
    async sendAlert(message: string, priority: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') {
        if (!this.botToken || !this.adminChatId) {
            console.warn('⚠️ TELEGRAM_SERVICE: Faltan credenciales en el entorno.');
            return { success: false, error: 'Missing credentials' };
        }

        const icons = {
            'INFO': 'ℹ️',
            'WARNING': '⚠️',
            'CRITICAL': '🔥'
        };

        const formattedMessage = `${icons[priority]} *EAR OS ALERT* (${priority})\n\n${message}`;

        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.adminChatId,
                    text: formattedMessage,
                    parse_mode: 'Markdown'
                })
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.description || 'Fallo en la API de Telegram');
            }

            return { success: true };

        } catch (error) {
            console.error('❌ TELEGRAM_SERVICE_ERROR:', error);
            return { success: false, error };
        }
    }

    /**
     * Responde a un chat específico o usuario en Telegram.
     */
    async replyToChat(chatId: string | number, text: string, parseMode: 'Markdown' | 'HTML' = 'Markdown') {
        if (!this.botToken) {
            console.warn('⚠️ TELEGRAM_SERVICE: Falta TELEGRAM_BOT_TOKEN en el entorno.');
            return { success: false, error: 'Missing TELEGRAM_BOT_TOKEN' };
        }

        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: parseMode
                })
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.description || 'Fallo en la API de Telegram al responder');
            }

            return { success: true, data };

        } catch (error) {
            console.error('❌ TELEGRAM_REPLY_ERROR:', error);
            return { success: false, error };
        }
    }
}

export const telegramService = new TelegramService();
