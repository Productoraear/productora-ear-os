const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function sweepVendorDashboard() {
    console.log('[EAR OS] Conectando a la sesión activa de Proveedor...');
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null
    });

    const pages = await browser.pages();
    const vendorPage = pages.find(p => p.url().includes('bodas.net')) || pages[0];

    console.log(`[EAR OS] Inspeccionando portal de empresa: ${vendorPage.url()}`);
    
    // Espera breve por si acabas de cerrar el modal
    await new Promise(r => setTimeout(r, 2000));

    const vendorPayload = await vendorPage.evaluate(() => {
        return {
            url: window.location.href,
            title: document.title,
            menuItems: Array.from(document.querySelectorAll('nav a, .admin-menu a, header a, [class*="menu"], [class*="nav"]'))
                .map(a => a.innerText.trim())
                .filter(t => t.length > 2 && t.length < 100),
            kpis: Array.from(document.querySelectorAll('.stat, .kpi, [class*="stat"], [class*="count"], [class*="metric"]'))
                .map(s => s.innerText.trim())
                .filter(Boolean),
            rawDOM: document.body.innerText.slice(0, 10000)
        };
    });

    const outputPath = path.join(process.cwd(), 'auditoria_proveedor_b2b.md');
    const content = `# AUDITORÍA FORENSE B2B - PORTAL PROVEEDOR BODAS.NET\n\n` +
        `- **URL:** ${vendorPayload.url}\n` +
        `- **Título:** ${vendorPayload.title}\n` +
        `- **Timestamp:** ${new Date().toISOString()}\n\n` +
        `## Navegación y Secciones B2B\n` +
        [...new Set(vendorPayload.menuItems)].map(m => `- ${m}`).join('\n') + `\n\n` +
        `## Métricas y KPIs Visibles\n` +
        [...new Set(vendorPayload.kpis)].map(k => `> ${k.replace(/\n/g, ' ')}`).join('\n\n') + `\n\n` +
        `## Volcado Estructurado del Panel\n\`\`\`text\n${vendorPayload.rawDOM}\n\`\`\`\n`;

    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`[EAR OS] Informe B2B generado con éxito: ${outputPath}`);
    await browser.disconnect();
}

sweepVendorDashboard();
