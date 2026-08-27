const fs = require('fs');

async function run() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.log('Playwright no detectado globalmente. Registrando reporte preliminar.');
    fs.writeFileSync('scripts/reports/ui-audit.json', JSON.stringify({ status: 'SKIPPED_NO_PLAYWRIGHT' }, null, 2));
    return;
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const pages = ['/eventos', '/ocasiones/ayuntamientos', '/artistas/edwin-agudelo', '/catering-brasas', '/alquiler-equipos-sonido-audiovisuales', '/admin/nexus'];
  const results = {};

  for (const url of pages) {
    try {
      const page = await context.newPage();
      await page.goto(`http://localhost:3007${url}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.setViewportSize({ width: 390, height: 844 });
      const mScroll = await page.evaluate(() => document.body.scrollWidth);
      const mWin = await page.evaluate(() => window.innerWidth);

      await page.setViewportSize({ width: 1920, height: 1080 });
      const dScroll = await page.evaluate(() => document.body.scrollWidth);
      const dWin = await page.evaluate(() => window.innerWidth);

      results[url] = { mobileOverflow: mScroll > mWin, desktopOverflow: dScroll > dWin };
      await page.close();
    } catch (err) {
      results[url] = { error: err.message };
    }
  }
  await browser.close();
  fs.writeFileSync('scripts/reports/ui-audit.json', JSON.stringify(results, null, 2));
  console.log('Pruebas de UI headless completadas.');
}

run();
