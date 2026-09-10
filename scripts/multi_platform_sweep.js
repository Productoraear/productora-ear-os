const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runMultiPlatformSweep() {
    console.log('[EAR OS MULTI-INTEL] Conectando a la sesión de Chrome (Puerto 9222) con ignoreHTTPSErrors...');
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null
    });

    const targets = [
        { name: 'Hola Bodas', url: 'https://www.tubodahola.com/' },
        { name: 'Fander', url: 'https://fander.es/' }
    ];

    const masterIntel = {
        timestamp: new Date().toISOString(),
        platforms: {}
    };

    for (const target of targets) {
        console.log(`[EAR OS MULTI-INTEL] Abriendo pestaña dedicada para: ${target.name} (${target.url})`);
        const page = await browser.newPage();
        
        try {
            // Permitir ignorar errores de certificado y seguridad
            await page.setBypassCSP(true);
            
            await page.goto(target.url, { 
                waitUntil: 'domcontentloaded', 
                timeout: 35000 
            });
            
            await new Promise(r => setTimeout(r, 4000)); // Espera de renderizado dinámico

            const intelData = await page.evaluate((platformName) => {
                const links = Array.from(document.querySelectorAll('a'))
                    .map(a => ({ text: a.innerText.trim(), href: a.href }))
                    .filter(l => l.text.length > 2 && l.text.length < 80);

                const uniqueLinks = Array.from(new Set(links.map(l => l.text)))
                    .map(text => links.find(l => l.text === text))
                    .slice(0, 50);

                const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
                    .map(h => h.innerText.trim())
                    .filter(h => h.length > 5 && h.length < 150);

                return {
                    platform: platformName,
                    url: window.location.href,
                    title: document.title,
                    menuOrCategories: uniqueLinks,
                    mainHeadings: Array.from(new Set(headings)),
                    bodySample: document.body.innerText.slice(0, 8000)
                };
            }, target.name);

            masterIntel.platforms[target.name.toLowerCase().replace(/\s+/g, '_')] = intelData;
            console.log(`[EAR OS MULTI-INTEL] Extracción exitosa para: ${target.name}`);
        } catch (err) {
            console.warn(`[EAR OS WARNING] Fallo al extraer ${target.name}:`, err.message);
            masterIntel.platforms[target.name.toLowerCase().replace(/\s+/g, '_')] = { error: err.message, url: target.url };
        } finally {
            await page.close().catch(() => {});
        }
    }

    const outputPath = path.join('H:\\EAR_OS_V2\\EAR_OS_V2\\src\\data', 'multi_platform_competitive_intel.json');
    fs.writeFileSync(outputPath, JSON.stringify(masterIntel, null, 2), 'utf8');
    console.log(`[EAR OS MULTI-INTEL] ¡Inteligencia multi-plataforma compilada con éxito en: ${outputPath}`);

    await browser.disconnect();
}

runMultiPlatformSweep();
