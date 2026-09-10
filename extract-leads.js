const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function extractVendorLeads() {
    console.log('[EAR OS INTEL] Conectando a la sesión de Proveedor...');
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null
    });

    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('bodas.net')) || pages[0];

    // Intentar navegar directamente a la bandeja de entrada B2B
    console.log('[EAR OS INTEL] Accediendo a solicitudes y mensajes de clientes...');
    
    // Rutas habituales del buzón comercial en la plataforma
    const targetUrl = 'https://www.bodas.net/empresa/solicitudes.php';
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));

    const leadsData = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.request-item, .lead-row, tr, [class*="request"], [class*="lead"]'));
        return {
            currentUrl: window.location.href,
            pageTitle: document.title,
            leadsDetected: rows.map(r => r.innerText.trim()).filter(t => t.length > 10).slice(0, 30),
            rawDOM: document.body.innerText.slice(0, 8000)
        };
    });

    const reportPath = path.join(process.cwd(), 'inteligencia_leads_b2b.md');
    fs.writeFileSync(reportPath, JSON.stringify(leadsData, null, 2), 'utf8');
    console.log(`[EAR OS INTEL] Datos volcados en: ${reportPath}`);

    await browser.disconnect();
}

extractVendorLeads();
