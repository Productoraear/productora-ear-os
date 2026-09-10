const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function executeSovereignToolsScraper() {
    console.log('[EAR OS CDP] Conectando a la instancia activa del navegador en el puerto 9222...');
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://127.0.0.1:9222',
            defaultViewport: null
        });
        
        const pages = await browser.pages();
        let targetPage = pages.find(p => p.url().includes('bodas.net/tools/Main')) || pages.find(p => p.url().includes('bodas.net'));
        
        if (!targetPage) {
            targetPage = await browser.newPage();
        }
        
        console.log(`[EAR OS CDP] Navegando y extrayendo metadatos de: https://www.bodas.net/tools/Main`);
        await targetPage.goto('https://www.bodas.net/tools/Main', { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extracción atómica de la estructura web, menús, contadores, presupuesto y buzón
        const toolAuditPayload = await targetPage.evaluate(() => {
            const getCleanText = (selector) => document.querySelector(selector)?.innerText?.trim() || '';
            
            const extractList = (selector) => {
                return Array.from(document.querySelectorAll(selector))
                    .map(el => el.innerText.trim())
                    .filter(text => text.length > 0);
            };

            return {
                url: window.location.href,
                timestamp: new Date().toISOString(),
                pageTitle: document.title,
                navigationMenus: extractList('nav a, header a, .menu-item, [class*="nav"], [class*="menu"]'),
                dashboardStats: extractList('.dashboard-stat, .counter, .stats-card, [class*="stat"], [class*="budget"]'),
                recentMessages: extractList('.message-preview, .chat-item, [class*="message"], [class*="buzon"]').slice(0, 15),
                tasksProgress: getCleanText('[class*="task"], [class*="checklist"], [class*="tarea"]'),
                rawDOMSnippet: document.body.innerText.slice(0, 6000)
            };
        });

        const outputPath = path.join(process.cwd(), 'auditoria_tools_main.md');
        const markdownReport = `# AUDITORÍA FORENSE Y DE HERRAMIENTAS - BODAS.NET / TOOLS / MAIN\n\n` +
            `- **URL Objetivo:** ${toolAuditPayload.url}\n` +
            `- **Timestamp:** ${toolAuditPayload.timestamp}\n` +
            `- **Título:** ${toolAuditPayload.pageTitle}\n\n` +
            `## Menús y Elementos de Navegación Detectados\n` +
            toolAuditPayload.navigationMenus.map(m => `- ${m}`).join('\n') + `\n\n` +
            `## Estadísticas y Bloques de Panel\n` +
            toolAuditPayload.dashboardStats.map(s => `- ${s}`).join('\n') + `\n\n` +
            `## Actividad del Buzón y Mensajes\n` +
            toolAuditPayload.recentMessages.map(msg => `> ${msg}`).join('\n\n') + `\n\n` +
            `## Progreso de Tareas / Checklist\n\`\`\`text\n${toolAuditPayload.tasksProgress}\n\`\`\`\n\n` +
            `## Volcado Estructurado del DOM\n\`\`\`text\n${toolAuditPayload.rawDOMSnippet}\n\`\`\`\n`;

        fs.writeFileSync(outputPath, markdownReport, 'utf8');
        console.log(`[EAR OS CDP] Éxito absoluto. Informe generado en: ${outputPath}`);
        
        await browser.disconnect();
    } catch (error) {
        console.error('[EAR OS CDP Error]: Fallo en la conexión o extracción por CDP:', error.message);
        console.log('Asegúrate de haber iniciado Chrome con: chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\ChromeDevSession"');
    }
}

executeSovereignToolsScraper();
