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
export async function runCazadorFantasma(targetUrl) {
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
        // Lógica de detección de LEADS (E-mails, Teléfonos, Nombres)
        const text = $('body').text();
        const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        const uniqueEmails = Array.from(new Set(emails));
        // FILTRO DE VALOR S-CLASS & PERSISTENCIA
        for (const email of uniqueEmails) {
            // Persistencia en Firestore (DNA Operativo)
            try {
                await addDoc(collection(db, 'ear_leads'), {
                    email,
                    source: targetUrl,
                    status: 'NEW',
                    type: 'CAZADOR_FANTASMA',
                    createdAt: serverTimestamp()
                });
            }
            catch (err) {
                console.error(`❌ Error persistiendo lead ${email}:`, err);
            }
            // Si el lead parece valioso (dominio corporativo o específico)
            const isHighValue = !email.includes('gmail.com') && !email.includes('hotmail.com');
            if (isHighValue) {
                await telegramService.sendAlert(`🔥 LEAD DE ORO DETECTADO\n\nOrigen: ${targetUrl}\nContacto: ${email}\n\nStatus: Pendiente de Transmutación RAG.`, 'CRITICAL');
            }
            else {
                await telegramService.sendAlert(`ℹ️ Lead Estándar Detectado: ${email}\nOrigen: ${targetUrl}`, 'INFO');
            }
        }
        return {
            success: true,
            leadsCount: uniqueEmails.length,
            leads: uniqueEmails
        };
    }
    catch (error) {
        console.error('❌ FALLO DE INFILTRACIÓN:', error);
        await telegramService.sendAlert(`🚨 ERROR EN CAZADOR FANTASMA: ${error.message}`, 'WARNING');
        return { success: false, error: error.message };
    }
    finally {
        await browser.close();
    }
}
