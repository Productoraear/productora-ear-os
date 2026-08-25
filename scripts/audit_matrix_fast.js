const http = require('http');

const testCases = [
  { url: 'http://localhost:3007/arsenal/pantallas-led-p29/madrid', forbidden: ['undefined', 'Vimume', 'Alzheimer', 'Mariachi'] },
  { url: 'http://localhost:3007/arsenal/sonido-bose-f1/barcelona', forbidden: ['undefined', 'Vimume'] },
  { url: 'http://localhost:3007/servicios/edwin-agudelo-solista/valencia', forbidden: ['undefined'] },
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
        const found = test.forbidden.filter(word => new RegExp(\\b\\\b, 'i').test(data));
        if (found.length > 0) {
          console.log(❌ FUGA DETECTADA: \ -> Encontrado: \);
        } else {
          console.log(✅ OK: \);
        }
        resolve();
      });
    }).on('error', () => {
      console.log(⚠️ Servidor no activo en \);
      resolve();
    });
  });
}

(async () => {
  console.log('=== BARRIDO AUTOMÁTICO DE RUTAS ===');
  for (const test of testCases) {
    await checkUrl(test);
  }
})();
