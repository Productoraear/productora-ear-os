const fs = require('fs');
const http = require('http');

// Check pages by making HTTP requests to localhost:3007
async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3007${urlPath}`, (res) => {
      resolve({ path: urlPath, status: res.statusCode, location: res.headers.location });
    }).on('error', (err) => {
      resolve({ path: urlPath, error: err.message });
    });
  });
}

async function run() {
  const testPaths = [
    '/',
    '/proveedores',
    '/proveedores-servicios',
    '/proveedores/edwin-agudelo',
    '/artistas',
    '/artistas/dashboard',
    '/artistas/edwin-agudelo',
    '/artistas/reclamar-regalias',
    '/artistas/solistas',
    '/reservar',
    '/reservar/solista',
    '/checkout/presupuesto',
    '/calculadora',
    '/cotizador',
    '/fincas',
    '/fincas-landing',
    '/alquiler-equipos-sonido-audiovisuales',
    '/simulacion-mariachis',
    '/experiencia',
    '/musica/canciones-prohibidas',
    '/sonometro',
    '/vimume',
    '/vimume/protocolo',
    '/vimume/residencias',
    '/vimume/clinica',
    '/vimume/piloto-5-centros',
    '/licitaciones/expediente',
    '/directorio',
    '/alianzas',
    '/academia',
    '/eventos',
    '/ayuntamientos',
    '/about',
    '/aviso-legal',
    '/privacidad',
    '/cookies'
  ];

  console.log('Testing ' + testPaths.length + ' key routes on http://localhost:3007 ...\n');
  const results = [];
  for (const p of testPaths) {
    const res = await checkUrl(p);
    results.push(res);
    const statusMark = res.status === 200 ? '✅ 200' : (res.status === 307 || res.status === 308 || res.status === 302 ? `↪️ ${res.status} -> ${res.location}` : `❌ ${res.status || res.error}`);
    console.log(`${statusMark.padEnd(12)} ${p}`);
  }

  const failures = results.filter(r => r.status >= 400 || r.error);
  console.log(`\nCompleted: ${results.length - failures.length} OK, ${failures.length} FAILED.`);
}

run();
