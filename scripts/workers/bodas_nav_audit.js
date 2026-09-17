import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
const pages = await browser.pages();
let bodasPage;

for (const page of pages) {
  if ((await page.title()).toLowerCase().includes('bodas.net') || page.url().toLowerCase().includes('bodas.net')) {
    bodasPage = page;
    break;
  }
}

if (!bodasPage) {
  console.error('No se encontró la página de Bodas.net');
  await browser.disconnect();
  process.exit(1);
}

const audit = await bodasPage.evaluate(() => {
  const links = [];
  document.querySelectorAll('a[href]').forEach(a => {
    const text = (a.textContent || '').trim().replace(/\s+/g, ' ');
    const href = a.getAttribute('href');
    if (text && href && text.length <= 80) {
      links.push({ text, href });
    }
  });

  const headings = [];
  document.querySelectorAll('h1,h2,h3,h4').forEach(h => {
    const text = (h.textContent || '').trim().replace(/\s+/g, ' ');
    if (text && text.length <= 100) {
      headings.push(text);
    }
  });

  const navText = [];
  document.querySelectorAll('nav').forEach(n => {
    const t = (n.textContent || '').trim().replace(/\s+/g, ' ');
    if (t && t.length > 5) navText.push(t.slice(0, 500));
  });

  return {
    title: document.title,
    url: location.href,
    totalLinks: links.length,
    links: links.slice(0, 250),
    headings: headings.slice(0, 50),
    navText
  };
});

console.log(JSON.stringify(audit, null, 2));
await browser.disconnect();