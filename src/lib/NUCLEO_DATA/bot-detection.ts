/**
 * 🤖 EAR OS GOLD - BOT DETECTION ENGINE
 * Sistema de protección contra scraping y accesos no autorizados.
 */

export const detectBot = (userAgent: string): boolean => {
  const botPatterns = [
    /bot/i, /spider/i, /crawl/i, /phantom/i, /headless/i
  ];
  return botPatterns.some(pattern => pattern.test(userAgent));
};

export const logSuspiciousActivity = (ip: string, reason: string) => {
  console.warn(`[BOT_DETECTION] Actividad sospechosa desde ${ip}: ${reason}`);
};