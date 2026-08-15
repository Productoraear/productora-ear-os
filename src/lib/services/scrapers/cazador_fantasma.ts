import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { telegramService } from '../comm/TelegramService';
import * as cheerio from 'cheerio';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * 🕵️ CAZADOR FANTASMA (S-CLASS)
 * Especializado en infiltración de alta gama y mimetismo EAR Network.
 */
export async function runCazadorFantasma(targetUrl: string) {
    
    // Lazy initialización para evitar fallos de build server-side
    puppeteer.use(StealthPlugin());
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    try {
        const page = await browser.newPage();
        
        // Mimetismo Omega: UserAgent realista
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Navegación con sigilo
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extracción de contenido bruto para lavado semántico
        const html = await page.content();
        const $ = cheerio.load(html);

        // Lógica de detección de LEADS (E-mails, Teléfonos, Nombres, Perfiles)
        const text = $('body').text();
        const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        const phones = text.match(/(?:\+34|0034)?[ -]*(?:6|7|8|9)[0-9]{2}[ -]*[0-9]{3}[ -]*[0-9]{3}/g) || [];
        
        // Extracción de tarjetas/proveedores en directorios (ej. celebrents, bodas)
        const extractedVendors: string[] = [];
        $('h2, h3, a[href*="mariachi"], a[href*="orquesta"], a[href*="proveedor"], a[href*="musica"]').each((_, el) => {
            const title = $(el).text().trim();
            const href = $(el).attr('href');
            if (title.length > 4 && title.length < 80 && !extractedVendors.includes(title)) {
                extractedVendors.push(`${title}${href ? ` (${href})` : ''}`);
            }
        });

        const uniqueEmails = Array.from(new Set(emails));
        const combinedLeads = [
            ...uniqueEmails.map(e => `[EMAIL] ${e}`),
            ...Array.from(new Set(phones)).map(p => `[PHONE] ${p}`),
            ...extractedVendors.slice(0, 30).map(v => `[PROVEEDOR] ${v}`)
        ];
        // Persistencia y retorno
        for (const email of uniqueEmails) {
            try {
                await addDoc(collection(db, 'ear_leads'), {
                    email,
                    source: targetUrl,
                    status: 'NEW',
                    type: 'CAZADOR_FANTASMA',
                    createdAt: serverTimestamp()
                });
            } catch (err) {
                console.error(`❌ Error persistiendo lead ${email}:`, err);
            }

            const isHighValue = !email.includes('gmail.com') && !email.includes('hotmail.com');
            if (isHighValue) {
                await telegramService.sendAlert(
                    `🔥 LEAD DE ORO DETECTADO\n\nOrigen: ${targetUrl}\nContacto: ${email}\n\nStatus: Pendiente de Transmutación RAG.`,
                    'CRITICAL'
                );
            } else {
                await telegramService.sendAlert(
                    `ℹ️ Lead Estándar Detectado: ${email}\nOrigen: ${targetUrl}`,
                    'INFO'
                );
            }
        }

        return { 
            success: true, 
            leadsCount: combinedLeads.length > 0 ? combinedLeads.length : uniqueEmails.length,
            leads: combinedLeads.length > 0 ? combinedLeads : uniqueEmails 
        };

    } catch (error: any) {
        console.error('❌ FALLO DE INFILTRACIÓN:', error);
        await telegramService.sendAlert(`🚨 ERROR EN CAZADOR FANTASMA: ${error.message}`, 'WARNING');
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}
