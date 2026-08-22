/**
 * 🤖 EAR OS GOLD - BOT DETECTION ENGINE
 * Sistema de protección contra scraping y accesos no autorizados.
 */
export const detectBot = (userAgent) => {
    const botPatterns = [
        /bot/i, /spider/i, /crawl/i, /phantom/i, /headless/i
    ];
    return botPatterns.some(pattern => pattern.test(userAgent));
};
export const logSuspiciousActivity = (ip, reason) => {
    console.warn(`[BOT_DETECTION] Actividad sospechosa desde ${ip}: ${reason}`);
};
