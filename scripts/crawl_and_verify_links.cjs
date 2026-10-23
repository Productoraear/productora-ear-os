const http = require('http');

function fetchPage(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3007${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, location: res.headers.location }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function crawl() {
  const seeds = ['/', '/proveedores', '/artistas', '/fincas', '/vimume', '/sonometro', '/musica/canciones-prohibidas'];
  const visited = new Set();
  const queue = [...seeds];
  const allHrefs = new Set();
  const brokenLinks = [];
  const checked = new Map();

  console.log('Crawling pages to find every embedded <a href="...">...');

  while (queue.length > 0 && visited.size < 50) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const res = await fetchPage(current);
    if (!res.body) continue;

    // extract hrefs
    const regex = /href=["'](\/[^"'#?]+)/g;
    let match;
    while ((match = regex.exec(res.body)) !== null) {
      const link = match[1];
      if (!link.startsWith('/_next') && !link.startsWith('/api') && !link.startsWith('/images') && !link.startsWith('/fonts') && !link.startsWith('/data')) {
        allHrefs.add(link);
        if (!visited.has(link) && queue.length < 40 && !queue.includes(link)) {
          queue.push(link);
        }
      }
    }
  }

  console.log(`Discovered ${allHrefs.size} distinct links from rendered HTML.`);
  console.log('Verifying all discovered links on http://localhost:3007 ...');

  for (const link of allHrefs) {
    const res = await fetchPage(link);
    checked.set(link, res.status);
    if (res.status >= 400 || res.error) {
      brokenLinks.push({ link, status: res.status, error: res.error });
      console.log(`❌ BROKEN: ${link} (status ${res.status || res.error})`);
    }
  }

  console.log(`\nCrawl complete: ${checked.size} checked, ${brokenLinks.length} broken.`);
  if (brokenLinks.length > 0) {
    console.log('\nList of broken links:');
    brokenLinks.forEach(b => console.log(`- ${b.link} -> ${b.status || b.error}`));
  }
}

crawl();
