const https = require('https');

const testCases = [
  // 1. Rutas Core de Verticales y Arsenal
  { url: 'https://www.productoraear.com/arsenal/pantallas-led-p29/madrid', mustHave: 'Pantallas LED', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/arsenal/sonido-bose-f1/barcelona', mustHave: 'Bose', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/servicios/edwin-agudelo-solista/valencia', mustHave: 'Valencia', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/bodas/malaga/dj-eventos', mustHave: 'Malaga', forbidden: ['Licitacion'] },
  { url: 'https://www.productoraear.com/b2g/fiestas-patronales/avila', mustHave: 'Avila', forbidden: ['Novia'] },
  { url: 'https://www.productoraear.com/vimume', mustHave: 'VIMUME', forbidden: ['Licitacion'] },

  // 2. Barrido de Validación Categorial de Proveedores
  { url: 'https://www.productoraear.com/proveedores?cat=foto', mustHave: 'Foto', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=finca', mustHave: 'Fincas', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=catering', mustHave: 'Catering', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=decoracion', mustHave: 'Decoración', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=musica', mustHave: 'Música', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=sonido', mustHave: 'Sonido', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=wedding', mustHave: 'Wedding Planners', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=moda', mustHave: 'Moda', forbidden: ['Alzheimer'] },
  { url: 'https://www.productoraear.com/proveedores?cat=transporte', mustHave: 'Transporte', forbidden: ['Alzheimer'] },

  // 3. Dossier PDF Generator Endpoint
  { url: 'https://www.productoraear.com/api/dossier/pdf?location=Madrid&total=1450', mustHave: 'PRODUCTORA EAR', forbidden: ['undefined'] }
];

async function checkUrl(test) {
  return new Promise((resolve) => {
    https.get(test.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const visibleHtml = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const hasMust = test.mustHave ? new RegExp(test.mustHave, 'i').test(visibleHtml) : true;
        const found = test.forbidden.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(visibleHtml));
        
        if (!hasMust) {
          console.log(`❌ FALTA CONTENIDO: ${test.url} -> Esperaba: ${test.mustHave}`);
        } else if (found.length > 0) {
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
  console.log('=== BARRIDO AUTOMÁTICO DE VALIDACIÓN CATEGORIAL Y RUTAS CORE ===');
  for (const test of testCases) {
    await checkUrl(test);
  }
})();
