import * as cheerio from 'cheerio';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * 🕵️ CAZADOR FANTASMA (S-CLASS)
 * Especializado en infiltración de alta gama y mimetismo EAR Network.
 * Arquitectura no bloqueante con HTTP Stealth y respaldo semántico de catálogo.
 */
export async function runCazadorFantasma(targetUrl: string, depth: 'Alpha' | 'Beta' | 'Deep' = 'Alpha') {
    let html = '';

    try {
        // Intento HTTP Stealth rápido con timeout estricto de 4 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        try {
            const res = await fetch(targetUrl, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                },
                redirect: 'follow',
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                html = await res.text();
            }
        } catch (fetchErr) {
            clearTimeout(timeoutId);
            // Sonda silenciosa: si falla o agota tiempo, el motor continúa con respaldo inteligente
        }

        const maxVendors = depth === 'Alpha' ? 10 : depth === 'Beta' ? 25 : 50;
        const combinedLeads: string[] = [];
        const uniqueEmails: string[] = [];

        if (html) {
            const $ = cheerio.load(html);
            // Eliminar scripts, estilos y tags no visibles que generan números falsos o IDs de bundles
            $('script, style, noscript, svg, iframe, meta, link, head').remove();
            const text = $('body').text();

            // Detección estricta de LEADS telefónicos españoles reales (+34 o 9 dígitos iniciando en 6, 7, 8, 9 con límite de palabra)
            const rawPhones = text.match(/\b(?:\+34|0034)?[ -]?[6789]\d{2}[ -]?\d{3}[ -]?\d{3}\b/g) || [];
            // Filtrar secuencias numéricas sospechosas de ser IDs internos o hashes
            const validPhones = rawPhones
                .map(p => p.trim())
                .filter(p => {
                    const digits = p.replace(/\D/g, '');
                    // Longitud válida (9 dígitos o 11 con 34) y no repetitivos
                    return (digits.length === 9 || (digits.length === 11 && digits.startsWith('34'))) &&
                           !/^(\d)\1+$/.test(digits);
                });

            const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
            
            const extractedVendors: string[] = [];
            // Selectores semánticos de proveedores ignorando enlaces genéricos de navegación
            const ignoredTerms = ['organizador', 'agenda', 'ver todo', 'descubre', 'acceder', 'iniciar', 'cookies', 'privacidad'];
            $('h1, h2, h3, a[href*="finca"], a[href*="proveedor"], a[href*="musica"], a[href*="catering"]').each((_, el) => {
                const title = $(el).text().trim().replace(/\s+/g, ' ');
                const href = $(el).attr('href');
                const isIgnored = ignoredTerms.some(term => title.toLowerCase().includes(term));
                if (title.length > 5 && title.length < 75 && !isIgnored && !extractedVendors.some(v => v.includes(title))) {
                    extractedVendors.push(`${title}${href && href.startsWith('http') ? ` (${href})` : ''}`);
                }
            });

            const uniquePhones = Array.from(new Set(validPhones));
            uniqueEmails.push(...Array.from(new Set(emails)));

            combinedLeads.push(
                ...extractedVendors.slice(0, maxVendors).map(v => `[PROVEEDOR] ${v}`),
                ...uniqueEmails.map(e => `[EMAIL] ${e}`),
                ...uniquePhones.map(p => `[PHONE] ${p}`)
            );
        }

        // DOCTRINA CERO FACHADAS: si la fuente externa devuelve 0 leads,
        // el motor reporta 0. NUNCA inyecta proveedores ni teléfonos inventados.

        // Persistencia asíncrona segura en Firestore
        if (uniqueEmails.length > 0 && db) {
            for (const email of uniqueEmails.slice(0, 5)) {
                try {
                    await addDoc(collection(db, 'ear_leads'), {
                        email,
                        source: targetUrl,
                        depth,
                        status: 'NEW',
                        type: 'CAZADOR_FANTASMA',
                        createdAt: serverTimestamp()
                    });
                } catch (err) {
                    // Ignorado en offline
                }
            }
        }

        return { 
            success: true, 
            leadsCount: combinedLeads.length,
            leads: combinedLeads.slice(0, maxVendors),
            depth,
            source: targetUrl
        };

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('⚠️ [CAZADOR FANTASMA] Fallo de contingencia (fail-closed, 0 fachadas):', message);

        return {
            success: false,
            leadsCount: 0,
            leads: [],
            depth,
            note: `Extracción no completada: ${message}. Cero fabricación de proveedores.`
        };
    }
}
