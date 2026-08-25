const http = require('http');

const testCases = [
  { url: 'http://localhost:3007/arsenal/pantallas-led-p29/madrid', forbidden: ['undefined', 'Alzheimer'] },
  { url: 'http://localhost:3007/arsenal/sonido-bose-f1/barcelona', forbidden: ['undefined', 'Alzheimer'] },
  { url: 'http://localhost:3007/servicios/edwin-agudelo-solista/valencia', forbidden: ['undefined', 'Alzheimer'] },
  { url: 'http://localhost:3007/bodas/malaga/dj-eventos', forbidden: ['undefined', 'Licitacion'] },
  { url: 'http://localhost:3007/b2g/fiestas-patronales/avila', forbidden: ['undefined', 'Novia'] },
  { url: 'http://localhost:3007/vimume', forbidden: ['undefined', 'Licitacion'] }
];

async function checkUrl(test) {
  return new Promise((resolve) => {
    http.get(test.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Remove Next.js RSC Flight stream scripts to avoid false positives with React internal '$undefined'
        const visibleHtml = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const found = test.forbidden.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(visibleHtml));
        if (found.length > 0) {
          console.log(`❌ FUGA DETECTADA: ${test.url} -> Encontrado: ${found.join(', ')}`);
        } else {
          console.log(`✅ OK: ${test.url}`);
        }
        resolve();
      });
    }).on('error', () => {
      console.log(`⚠️ Servidor no activo en ${test.url}`);
      resolve();
    });
  });
}

(async () => {
  console.log('=== BARRIDO AUTOMÁTICO DE RUTAS LOCALES ===');
  for (const test of testCases) {
    await checkUrl(test);
  }
})();
