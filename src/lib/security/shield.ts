import { sendTelegramNotification } from "@/lib/services/telegram";

/**
 * 🛡️ EAR OS SOVEREIGN SECURITY SHIELD - ACTIVE PERIMETER PROTECTION (V153)
 * Screens, profiles, and blocks bots, scrapers, and malicious transaction attempts.
 */

export interface SecurityFingerprint {
  ip: string;
  userAgent: string;
  host: string;
  referrer: string;
  isBot: boolean;
  threatLevel: "CLEAN" | "SUSPICIOUS" | "CRITICAL";
  reason?: string;
}

/**
 * Analyzes request headers and connection parameters to detect scrapers, headless browsers, or scanning engines.
 */
export function analyzeHeaders(headers: Headers): SecurityFingerprint {
  const userAgent = headers.get("user-agent") || "";
  const host = headers.get("host") || "";
  const referrer = headers.get("referer") || "";
  const forwardedFor = headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0].trim() || "127.0.0.1";

  const lowercaseUA = userAgent.toLowerCase();
  
  // 🔍 1. Common Scraping & Automation Signatures
  const botSignatures = [
    "headless",
    "puppeteer",
    "playwright",
    "selenium",
    "webdriver",
    "phantomjs",
    "axios",
    "node-fetch",
    "python-requests",
    "scrapy",
    "curl",
    "wget",
    "postman",
    "sqlmap",
    "nikto",
    "nmap"
  ];

  const matchedSignature = botSignatures.find(sig => lowercaseUA.includes(sig));
  
  let isBot = false;
  let threatLevel: "CLEAN" | "SUSPICIOUS" | "CRITICAL" = "CLEAN";
  let reason = "";

  if (matchedSignature) {
    isBot = true;
    threatLevel = "CRITICAL";
    reason = `Automation signature detected: [${matchedSignature}] in User-Agent.`;
  }

  // 🔍 2. Structural Fingerprint Anomalies (Headers checking)
  if (!isBot && userAgent.length < 15) {
    isBot = true;
    threatLevel = "SUSPICIOUS";
    reason = "Anomalously short User-Agent header (Scraper/Crawler suspect).";
  }

  if (!isBot && !headers.get("accept") && !lowercaseUA.includes("googlebot")) {
    threatLevel = "SUSPICIOUS";
    reason = "Missing HTTP Accept headers standard for browsers.";
  }

  return {
    ip,
    userAgent,
    host,
    referrer,
    isBot,
    threatLevel,
    reason
  };
}

/**
 * Inspects incoming request server-side and dispatches a live alert to Telegram if a breach is detected.
 * Returns true if the request is marked as a critical threat (should be blocked).
 */
export async function inspectRequest(req: Request, endpointName: string): Promise<boolean> {
  // Safe clone headers to prevent stream lock
  const headers = req.headers;
  const fingerprint = analyzeHeaders(headers);

  if (fingerprint.threatLevel === "CLEAN") {
    return false; // Clean traffic
  }

  // ⚡ Dispatch Active Telegram Breach Alert
  try {
    const alertMessage = 
      `🚨 *VIGILANTE DE SEGURIDAD S-CLASS: ALERTA DE PERÍMETRO*\n\n` +
      `🎯 *Endpoint:* \`${endpointName}\`\n` +
      `🌐 *IP:* \`${fingerprint.ip}\`\n` +
      `🚨 *Nivel de Amenaza:* **${fingerprint.threatLevel}**\n` +
      `🔍 *Razón:* _${fingerprint.reason || "Patrón de navegación anómalo"}\n\n` +
      `🖥️ *User-Agent:* \`${fingerprint.userAgent}\`\n` +
      `🔗 *Referrer:* \`${fingerprint.referrer || "Directo / Desconocido"}\`\n` +
      `🏢 *Host:* \`${fingerprint.host}\`\n\n` +
      `🛡️ _EAR OS Shield Active: Solicitud bajo vigilancia inmutable._`;

    await sendTelegramNotification(alertMessage);
  } catch (tgErr: any) {
    console.error("⚠️ [SECURITY_SHIELD] Failed to send Telegram notification:", tgErr.message);
  }

  // Block absolutely if threat is CRITICAL
  return fingerprint.threatLevel === "CRITICAL";
}
