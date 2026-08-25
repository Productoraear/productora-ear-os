const https = require('https');

const testCases = [
  { url: 'https://www.productoraear.com/arsenal/pantallas-led-p29/madrid', forbidden: ['undefined', 'Alzheimer'] },
  { url: 'https://www.productoraear.com/arsenal/sonido-bose-f1/barcelona', forbidden: ['undefined', 'Alzheimer'] },
  { url: 'https://www.productoraear.com/servicios/edwin-agudelo-solista/valencia', forbidden: ['undefined', 'Alzheimer'] },
  { url: 'https://www.productoraear.com/bodas/malaga/dj-eventos', forbidden: ['undefined', 'Licitacion'] },
  { url: 'https://www.productoraear.com/b2g/fiestas-patronales/avila', forbidden: ['undefined', 'Novia'] },
  { url: 'https://www.productoraear.com/vimume', forbidden: ['undefined', 'Licitacion'] }
];

async function checkUrl(test) {
  return new Promise((resolve) => {
    https.get(test.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Remove Next.js RSC Flight stream scripts to avoid false positives with React internal '$undefined'
        const visibleHtml = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const found = test.forbidden.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(visibleHtml));
        if (found.length > 0) {
          console.log(`❌ FUGA DETECTADA: ${test.url} -> Encontrado: ${found.join(', ')}`);
        } else {
          console.log(`✅ OK (${res.statusCode}): ${test.url}`);
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`⚠️ Error consultando ${test.url}: ${err.message}`);
      resolve();
    });
  });
}

(async () => {
  console.log('=== BARRIDO AUTOMÁTICO DE RUTAS EN PRODUCCIÓN ===');
  for (const test of testCases) {
    await checkUrl(test);
  }
})();
