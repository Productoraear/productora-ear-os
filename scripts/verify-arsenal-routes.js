const http = require('http');
const { spawn } = require('child_process');

async function testRoutes() {
  console.log('🚀 Levantando servidor local en puerto 3001 para validación de rutas...');
  const serverProcess = spawn('npm', ['run', 'start', '--', '-p', '3001'], {
    shell: true,
    stdio: 'pipe'
  });

  // Esperar a que arranque
  await new Promise(resolve => setTimeout(resolve, 6000));

  const urlsToTest = [
    'http://localhost:3001/arsenal/luces-navidad',
    'http://localhost:3001/arsenal/luces-navidad/dem-p2-motivos-3d-gigantes',
    'http://localhost:3001/b2g/alumbrado-navideno',
    'http://localhost:3001/b2g',
    'http://localhost:3001/servicios/chofer-vip',
    'http://localhost:3001/servicios/chofer-vip/madrid',
    'http://localhost:3001/servicios/transfer-aeropuerto-madrid',
    'http://localhost:3001/corporativo/alquiler-mercedes-clase-v-chofer-madrid',
    'http://localhost:3001/bodas/alquiler-coche-boda-chofer-madrid',
    'http://localhost:3001/artistas/transporte-vip-artistas-giras'
  ];

  console.log('\n🔍 Probando respuestas HTTP de las URLs objetivo:');

  for (const url of urlsToTest) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const h1Clean = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NO_H1_FOUND';
      console.log(`[STATUS ${res.status}] ${url}`);
      console.log(`   👉 H1: "${h1Clean}"`);
      if (res.status === 404) {
        console.error(`   ❌ FALLO: Retorna 404`);
      } else {
        console.log(`   ✅ ÉXITO: 200 OK`);
      }
    } catch (e) {
      console.error(`   ❌ Error conectando a ${url}:`, e.message);
    }
  }

  // Matar servidor
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
  } else {
    serverProcess.kill();
  }
}

testRoutes().catch(console.error);
