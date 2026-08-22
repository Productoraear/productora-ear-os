const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeQualityVip() {
  console.log('🚀 INICIANDO VAMPIRIZACIÓN DE QUALITY VIP SOLUTIONS...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const visited = new Set();
  const toVisit = ['https://www.qualityvipsolutions.com/'];
  const siteData = {
    pages: [],
    services: [],
    fleet: [],
    contact: {}
  };

  while (toVisit.length > 0) {
    const currentUrl = toVisit.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    console.log(`🔍 Rastreador en: ${currentUrl}`);
    try {
      await page.goto(currentUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // Extraer datos de la página
      const pageInfo = await page.evaluate(() => {
        const title = document.title;
        const h1s = Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim());
        const h2s = Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim());
        const h3s = Array.from(document.querySelectorAll('h3')).map(e => e.innerText.trim());
        const paragraphs = Array.from(document.querySelectorAll('p')).map(e => e.innerText.trim()).filter(t => t.length > 0);
        const images = Array.from(document.querySelectorAll('img')).map(e => ({
          src: e.src,
          alt: e.alt || ''
        }));
        
        // Enlaces internos
        const links = Array.from(document.querySelectorAll('a'))
          .map(a => a.href)
          .filter(href => href && href.startsWith('https://www.qualityvipsolutions.com') && !href.includes('#') && !href.includes('mailto:') && !href.includes('tel:'));

        const fullText = document.body.innerText;

        return {
          title,
          h1s,
          h2s,
          h3s,
          paragraphs,
          images,
          links: Array.from(new Set(links)),
          fullText
        };
      });

      siteData.pages.push({
        url: currentUrl,
        ...pageInfo
      });

      // Añadir nuevos enlaces a la cola
      for (const link of pageInfo.links) {
        if (!visited.has(link) && !toVisit.includes(link)) {
          toVisit.push(link);
        }
      }

    } catch (err) {
      console.error(`❌ Error en ${currentUrl}:`, err.message);
    }
  }

  await browser.close();

  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/qualityvipsolutions_raw_crawl.json', JSON.stringify(siteData, null, 2), 'utf8');
  console.log(`\n[OK] Vampirización completa. ${siteData.pages.length} páginas extraídas.`);
  console.log('📁 Guardado en src/data/qualityvipsolutions_raw_crawl.json');
}

scrapeQualityVip().catch(console.error);
