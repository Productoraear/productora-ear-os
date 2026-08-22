export class TelegramService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!TelegramService.instance) {
            TelegramService.instance = new TelegramService();
        }
        return TelegramService.instance;
    }
    async sendAlert(message) {
        // En un entorno real, usaría el bot API de Telegram
        // const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
        console.log(`[TELEGRAM_ALERT_SIMULATED]: ${message}`);
        // Simulación de envío
        try {
            // await fetch(url);
        }
        catch (error) {
            console.error('❌ TELEGRAM_DISPATCH_FAILED:', error);
        }
    }
}
export const telegramService = TelegramService.getInstance();
