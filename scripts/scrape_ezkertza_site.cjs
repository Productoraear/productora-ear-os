const fs = require('fs');

async function scrapeAll() {
  const urls = [
    'https://www.ezkertzaberria.com/',
    'https://www.ezkertzaberria.com/instalaciones/',
    'https://www.ezkertzaberria.com/menus/',
    'https://www.ezkertzaberria.com/contacto/',
    'https://www.ezkertzaberria.com/quienes-somos/'
  ];
  const results = {};
  for (const u of urls) {
    try {
      console.log('Fetching:', u);
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await res.text();
      
      // Extract images
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const images = [];
      let m;
      while ((m = imgRegex.exec(html)) !== null) {
        images.push(m[1]);
      }
      
      // Clean text
      const cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Extract title and meta
      const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);

      results[u] = {
        title: titleMatch ? titleMatch[1] : '',
        metaDesc: metaDescMatch ? metaDescMatch[1] : '',
        images: [...new Set(images)],
        text: cleanText,
        htmlLength: html.length
      };
    } catch(e) {
      console.error('Error on', u, e.message);
      results[u] = { error: e.message };
    }
  }
  
  if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch', { recursive: true });
  }
  fs.writeFileSync('scratch/EZKERTZA_WEBSITE_VAMPIRIZED.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Successfully saved scratch/EZKERTZA_WEBSITE_VAMPIRIZED.json');
}

scrapeAll();
