import puppeteer from 'puppeteer-extra';
// @ts-ignore
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// Asimilando lógica de evasión rescatada del Python (NUCLEO_DATA)
puppeteer.use(StealthPlugin());
export class PhantomScraper {
    userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ];
    async humanDelay(min = 2000, max = 5000) {
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    async executeOvertake(targetUrl) {
        console.log(`[PHANTOM] Iniciando secuencia de infiltración en: ${targetUrl}`);
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security'
            ]
        });
        try {
            const page = await browser.newPage();
            // Rotación de User-Agent (Lógica de evasión)
            const randomUA = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
            await page.setUserAgent(randomUA);
            // Evasión de bot-detection (fingerprinting override)
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });
            console.log('[PHANTOM] Capa Stealth Activa. Navegando...');
            await page.goto(targetUrl, { waitUntil: 'networkidle2' });
            await this.humanDelay();
            // Simular scroll humano
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight / 2);
            });
            await this.humanDelay(1000, 3000);
            const content = await page.content();
            console.log(`[PHANTOM] Extracción exitosa. ${content.length} bytes capturados.`);
            return content;
        }
        catch (error) {
            console.error('[PHANTOM] Intercepción detectada:', error);
            throw error;
        }
        finally {
            await browser.close();
            console.log('[PHANTOM] Rastro eliminado. Cerrando instancia.');
        }
    }
}
// Para uso standalone
if (require.main === module) {
    const phantom = new PhantomScraper();
    phantom.executeOvertake('https://example.com').then(() => process.exit(0));
}
