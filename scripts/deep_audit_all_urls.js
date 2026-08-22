const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = process.env.TEST_URL || 'https://www.productoraear.com';
const CONCURRENCY = 8;

async function fetchSitemapUrls() {
  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    const xmlText = await response.text();
    const urls = [];
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(xmlText)) !== null) {
      urls.push(match[1]);
    }
    return urls.length > 0 ? urls : [`${BASE_URL}/cotizador`, `${BASE_URL}/arsenal`];
  } catch (e) {
    return [`${BASE_URL}/cotizador`, `${BASE_URL}/arsenal`];
  }
}

async function auditUrl(context, url) {
  const page = await context.newPage();
  const result = { 
    url, 
    statusCode: 200, 
    hasH1: false, 
    h1Count: 0, 
    hasCta: false, 
    hasPlaceholderText: false, 
    durationMs: 0 
  };
  const start = Date.now();
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    result.statusCode = response ? response.status() : 500;
    
    // Jerarquía de H1
    const h1s = await page.$$eval('h1', els => els.map(e => e.innerText.trim()));
    result.h1Count = h1s.length;
    result.hasH1 = h1s.length === 1;
    
    // Detección de textos basura o residuales
    const bodyText = await page.$eval('body', el => el.innerText);
    result.hasPlaceholderText = /undefined|null|Lorem ipsum|TODO|NaN/i.test(bodyText);
    result.hasCta = /Smart-Lock|Reservar|Cotizar|WhatsApp|Centralita|10 €|350 €/i.test(bodyText);
  } catch (err) {
    result.statusCode = 500;
    result.error = err.message;
  } finally {
    result.durationMs = Date.now() - start;
    await page.close();
  }
  return result;
}

async function main() {
  console.log('🚀 INICIANDO AUDITORÍA MASIVA DE COHERENCIA S-CLASS...');
  const urls = await fetchSitemapUrls();
  console.log(`📊 Catálogo de URLs extraídas del sitemap: ${urls.length}`);

  const browser = await chromium.launch({ headless: true });
  console.log('🌐 Navegador Headless iniciado.');
  console.log('⚡ Iniciando rastreo concurrente con 8 workers...');

  const context = await browser.newContext();
  const results = [];

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const chunk = urls.slice(i, i + CONCURRENCY);
    console.log(`🔍 Auditando lote ${i + 1} a ${Math.min(i + CONCURRENCY, urls.length)} de ${urls.length}...`);
    const chunkResults = await Promise.all(chunk.map(url => auditUrl(context, url)));
    results.push(...chunkResults);
  }

  await browser.close();

  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/DEEP_AUDIT_MASTER_REPORT.json', JSON.stringify(results, null, 2));

  const failed = results.filter(r => r.statusCode !== 200 || !r.hasH1 || r.hasPlaceholderText);
  console.log('\nHECHO_VERIFICADO: Auditoría masiva completada con éxito.');
  console.log(`📊 Total analizado: ${results.length} URLs | Con observaciones: ${failed.length}`);
  console.log('📁 Reporte consolidado guardado en: docs/DEEP_AUDIT_MASTER_REPORT.json');
}

main();
