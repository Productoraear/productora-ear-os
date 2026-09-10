const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function executeDeepInternalSweep() {
    console.log('[EAR OS FORENSIC] Iniciando disección atómica de emp-Menu.php...');
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null
    });

    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('bodas.net/emp-Menu.php')) || pages[0];

    // Asegurar que estamos en el dashboard B2B
    if (!page.url().includes('emp-Menu.php')) {
        await page.goto('https://www.bodas.net/emp-Menu.php', { waitUntil: 'networkidle2' });
    }

    // 1. Extraer los hipervínculos reales de las secciones internas
    const realRoutes = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const targetMap = {};

        links.forEach(a => {
            const text = a.innerText.trim().toLowerCase();
            const href = a.href;
            if (text.includes('solicitud') || text.includes('gestionar mis solicitudes')) {
                targetMap['solicitudes'] = href;
            } else if (text.includes('escaparate') || text.includes('mi escaparate')) {
                targetMap['escaparate'] = href;
            } else if (text.includes('opiniones') || text.includes('mostrar todas')) {
                targetMap['opiniones'] = href;
            } else if (text.includes('factura') || text.includes('facturación')) {
                targetMap['facturacion'] = href;
            }
        });

        return targetMap;
    });

    console.log('[EAR OS FORENSIC] Rutas internas reales identificadas:', JSON.stringify(realRoutes, null, 2));

    const completeDossier = {
        metadata: {
            extractedAt: new Date().toISOString(),
            sourceAccount: 'Productora EAR'
        },
        sections: {}
    };

    // 2. Navegar y extraer quirúrgicamente cada sección real
    for (const [key, targetUrl] of Object.entries(realRoutes)) {
        if (!targetUrl || targetUrl === '#' || targetUrl.startsWith('javascript:')) continue;

        console.log(`[EAR OS FORENSIC] Extrayendo a fondo: [${key}] -> ${targetUrl}`);
        try {
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 35000 });
            await new Promise(r => setTimeout(r, 2500));

            const pageDump = await page.evaluate(() => {
                return {
                    url: window.location.href,
                    title: document.title,
                    // Extracción de tablas de solicitudes, facturas o tarjetas de opiniones
                    structuredCards: Array.from(document.querySelectorAll('.requestItem, .reviewItem, .invoiceItem, tr, .card, [class*="item"], [class*="row"]'))
                        .map(el => el.innerText.trim())
                        .filter(t => t.length > 15 && t.length < 1500),
                    fullText: document.body.innerText.slice(0, 15000)
                };
            });

            completeDossier.sections[key] = pageDump;
        } catch (err) {
            console.error(`[EAR OS FORENSIC Error] Fallo al extraer sección ${key}:`, err.message);
            completeDossier.sections[key] = { error: err.message, url: targetUrl };
        }
    }

    const exportPath = path.join(process.cwd(), 'bodas_dossier_atomico.json');
    fs.writeFileSync(exportPath, JSON.stringify(completeDossier, null, 2), 'utf8');
    console.log(`[EAR OS FORENSIC] ¡ÉXITO TOTAL! Dossier maestro compilado en: ${exportPath}`);

    await browser.disconnect();
}

executeDeepInternalSweep();
