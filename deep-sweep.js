const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runDeepForensicSweep() {
    console.log('[EAR OS DEEP FORENSIC] Conectando a Chrome vía CDP (Puerto 9222)...');
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null
    });

    const pages = await browser.pages();
    let targetPage = pages.find(p => p.url().includes('bodas.net')) || pages[0];

    // Rutas clave del panel de gestión de pareja en Bodas.net
    const targets = [
        { name: 'Dashboard Principal', url: 'https://www.bodas.net/tools/Main' },
        { name: 'Presupuesto Detallado', url: 'https://www.bodas.net/tools/Budget' },
        { name: 'Listado de Invitados', url: 'https://www.bodas.net/tools/Guests' },
        { name: 'Gestión de Mesas (Seating)', url: 'https://www.bodas.net/tools/Tables' },
        { name: 'Buzón / Mensajes con Proveedores', url: 'https://www.bodas.net/tools/Messaging' },
        { name: 'Equipo de Proveedores', url: 'https://www.bodas.net/tools/Suppliers' }
    ];

    let fullReport = `# INFORME DE BARRIDO FORENSE PROFUNDO - EAR OS\n- **Timestamp:** ${new Date().toISOString()}\n\n`;

    for (const t of targets) {
        console.log(`[EAR OS DEEP FORENSIC] Extrayendo sección: ${t.name} -> ${t.url}`);
        try {
            await targetPage.goto(t.url, { waitUntil: 'networkidle2', timeout: 30000 });
            await new Promise(r => setTimeout(r, 2500)); // Espera de renderizado dinámico

            const sectionData = await targetPage.evaluate(() => {
                return {
                    pageTitle: document.title,
                    currentUrl: window.location.href,
                    // Extracción inteligente de textos significativos en tablas, filas, tarjetas y paneles
                    relevantTextBlocks: Array.from(document.querySelectorAll('tr, .card, [class*="budget"], [class*="guest"], [class*="message"], [class*="item"], li'))
                        .map(el => el.innerText.trim())
                        .filter(txt => txt.length > 3 && txt.length < 300),
                    fullBodySnippet: document.body.innerText.slice(0, 8000)
                };
            });

            // Limpieza de duplicados en los bloques de texto
            const uniqueBlocks = [...new Set(sectionData.relevantTextBlocks)].slice(0, 50);

            fullReport += `## Sección: ${t.name}\n` +
                `- **URL Real:** ${sectionData.currentUrl}\n` +
                `- **Título de Página:** ${sectionData.pageTitle}\n\n` +
                `### Elementos y Datos Detectados\n` +
                uniqueBlocks.map(b => `> ${b.replace(/\n/g, ' ')}`).join('\n\n') + `\n\n` +
                `### Volcado Crudo de la Vista\n\`\`\`text\n${sectionData.fullBodySnippet}\n\`\`\`\n\n---\n\n`;

        } catch (err) {
            console.warn(`[EAR OS WARNING] No se pudo procesar ${t.name}:`, err.message);
            fullReport += `## Sección: ${t.name}\n- **Estado:** Error al acceder o ruta no disponible (${err.message})\n\n---\n\n`;
        }
    }

    const outputFilePath = path.join(process.cwd(), 'auditoria_forense_profunda.md');
    fs.writeFileSync(outputFilePath, fullReport, 'utf8');
    console.log(`[EAR OS DEEP FORENSIC] ¡Barrido completo finalizado con éxito! Archivo generado: ${outputFilePath}`);

    await browser.disconnect();
}

runDeepForensicSweep();
