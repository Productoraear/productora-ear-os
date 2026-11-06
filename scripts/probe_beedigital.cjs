const https = require('https');
const fs = require('fs');

const URLS = [
  'https://www.beedigital.es/contacto/',
  'https://www.beedigital.es/planes/plan-lidera-digital/',
  'https://www.beedigital.es/empieza-gratis/'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); resolve({ url, status: 0, data: '' }); });
  });
}

async function run() {
  const results = {};
  for (const url of URLS) {
    try {
      console.log('Probing:', url);
      const res = await fetchUrl(url);
      console.log('Status:', res.status, 'Length:', res.data.length);
      
      // Extract forms, key headings, schema json-ld, scripts
      const forms = res.data.match(/<form[\s\S]*?<\/form>/gi) || [];
      const jsonLd = res.data.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi) || [];
      const h1s = res.data.match(/<h1[\s\S]*?<\/h1>/gi) || [];
      const h2s = res.data.match(/<h2[\s\S]*?<\/h2>/gi) || [];
      
      results[url] = {
        status: res.status,
        htmlLength: res.data.length,
        h1s: h1s.map(h => h.replace(/<[^>]+>/g, '').trim()),
        h2s: h2s.slice(0, 10).map(h => h.replace(/<[^>]+>/g, '').trim()),
        formsCount: forms.length,
        formSnippets: forms.map(f => f.slice(0, 500)),
        jsonLdCount: jsonLd.length
      };
    } catch (e) {
      console.error('Error fetching', url, e.message);
    }
  }

  fs.writeFileSync('src/data/beedigital_forensic_extract.json', JSON.stringify(results, null, 2));
  console.log('Wrote forensic extraction to src/data/beedigital_forensic_extract.json');
}

run();

