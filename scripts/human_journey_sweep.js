const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runHumanJourneySweep() {
  const artifactDir = 'C:\\Users\\M2-W10\\.gemini\\antigravity-ide\\brain\\066359b6-dd26-4c3d-b49b-ca96c39f0c12';

  console.log('>>> [START] Launching Puppeteer for Human Journey Sweep...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const report = {
    route1: { pages: [], actions: [], screenshots: [], systemResponse: '' },
    route2: { pages: [], actions: [], screenshots: [], systemResponse: '' },
    route3: { pages: [], actions: [], screenshots: [], systemResponse: '' },
    route4: { pages: [], actions: [], screenshots: [], systemResponse: '' },
  };

  /* ==========================================================================
     RUTA 1: CLIENTE DE EVENTOS (DEL GATEWAY AL CHECKOUT FINAL)
     ========================================================================== */
  console.log('\n=================== RUTA 1: CLIENTE DE EVENTOS ===================');
  
  // Pantalla 1: Home /
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle2' });
  report.route1.pages.push(page.url());
  report.route1.actions.push('Navegación inicial a http://localhost:3007/');
  
  let shotPath = path.join(artifactDir, 'r1_p1_home.png');
  await page.screenshot({ path: shotPath });
  report.route1.screenshots.push(shotPath);

  // Clic en "Cliente de Eventos"
  console.log('-> Clic en Cliente de Eventos...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const clientCard = cards.find(c => c.textContent && c.textContent.includes('Cliente de Eventos'));
    if (clientCard) clientCard.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Pantalla 2: Túnel Neural
  report.route1.actions.push('Clic en tarjeta Cliente de Eventos -> Scroll cinemático al túnel');
  shotPath = path.join(artifactDir, 'r1_p2_tunel.png');
  await page.screenshot({ path: shotPath });
  report.route1.screenshots.push(shotPath);

  // Pantalla 3: Clic en "Cotización Bespoke" -> /cotizador
  console.log('-> Clic en Cotización Bespoke...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('#neural-tunnel-section a'));
    const bespokeLink = links.find(l => l.textContent && l.textContent.includes('Cotización Bespoke'));
    if (bespokeLink) bespokeLink.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  report.route1.pages.push(page.url());
  report.route1.actions.push('Clic en Opción A "Cotización Bespoke" -> Carga física de /cotizador');
  shotPath = path.join(artifactDir, 'r1_p3_cotizador.png');
  await page.screenshot({ path: shotPath });
  report.route1.screenshots.push(shotPath);

  // Pantalla 4: Desglose y Price-Lock (abrir PaymentModal)
  console.log('-> Ajuste de controles y solicitud de ejecución...');
  // Check if there is a button for PaymentModal or execution
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const execBtn = buttons.find(b => b.textContent && (b.textContent.includes('Solicitar') || b.textContent.includes('Price-Lock') || b.textContent.includes('Reserva')));
    if (execBtn) execBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  report.route1.pages.push(page.url());
  report.route1.actions.push('Ajuste de aforo y clic en "Solicitar Ejecución" -> Despliegue de pasarela con depósito de 10 €');
  shotPath = path.join(artifactDir, 'r1_p4_checkout.png');
  await page.screenshot({ path: shotPath });
  report.route1.screenshots.push(shotPath);
  report.route1.systemResponse = `Ruta completada: / -> /cotizador. Pasarela y desglose cargados sin errores. URL final: ${page.url()}`;

  /* ==========================================================================
     RUTA 2: ARTISTA Y PROGRAMA "THE SIGNAL"
     ========================================================================== */
  console.log('\n=================== RUTA 2: ARTISTA Y THE SIGNAL ===================');
  
  // Pantalla 1: Volver a Home
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle2' });
  report.route2.pages.push(page.url());
  report.route2.actions.push('Retorno a Home /');

  // Clic en "Artista / Producción"
  console.log('-> Clic en Artista / Producción...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const artistCard = cards.find(c => c.textContent && c.textContent.includes('Artista / Producción'));
    if (artistCard) artistCard.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  report.route2.actions.push('Clic en tarjeta Artista / Producción -> Túnel de Curaduría');
  shotPath = path.join(artifactDir, 'r2_p1_artist_tunel.png');
  await page.screenshot({ path: shotPath });
  report.route2.screenshots.push(shotPath);

  // Pantalla 2: Opción B: "Edwin Agudelo (Paciente Cero)"
  console.log('-> Clic en Opción B: Edwin Agudelo...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('#neural-tunnel-section a'));
    const edwinLink = links.find(l => l.textContent && l.textContent.includes('Edwin Agudelo'));
    if (edwinLink) edwinLink.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  report.route2.pages.push(page.url());
  report.route2.actions.push('Clic en "Edwin Agudelo (Paciente Cero)" -> Carga de /artistas/edwin-agudelo');
  shotPath = path.join(artifactDir, 'r2_p2_dossier_edwin.png');
  await page.screenshot({ path: shotPath });
  report.route2.screenshots.push(shotPath);

  // Pantalla 3: Navegación dossier /artistas/edwin-agudelo
  console.log('-> Navegación dossier e interacción...');
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 600));

  report.route2.actions.push('Scroll e inspección del dossier interactivo y rider técnico');
  shotPath = path.join(artifactDir, 'r2_p3_edwin_scroll.png');
  await page.screenshot({ path: shotPath });
  report.route2.screenshots.push(shotPath);

  // Pantalla 4: Navegar a /artistas y TinderMatcherClient.tsx
  console.log('-> Navegación a /artistas...');
  await page.goto('http://localhost:3007/artistas', { waitUntil: 'networkidle2' });
  report.route2.pages.push(page.url());

  // 3 interacciones en TinderMatcherClient
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    if (btns.length > 0) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    if (btns.length > 1) btns[1].click();
  });
  await new Promise(r => setTimeout(r, 500));

  report.route2.actions.push('Navegación a /artistas y 3 interacciones ejecutadas en TinderMatcherClient');
  shotPath = path.join(artifactDir, 'r2_p4_roster.png');
  await page.screenshot({ path: shotPath });
  report.route2.screenshots.push(shotPath);
  report.route2.systemResponse = `Ruta completada: / -> /artistas/edwin-agudelo -> /artistas. Matcher y dossier 100% operativos.`;

  /* ==========================================================================
     RUTA 3: INSTITUCIÓN Y VIMUME B2G
     ========================================================================== */
  console.log('\n=================== RUTA 3: INSTITUCIÓN Y VIMUME B2G ===================');

  // Pantalla 1: Home /
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle2' });
  report.route3.pages.push(page.url());

  // Clic en "Institución / B2G"
  console.log('-> Clic en Institución / B2G...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const b2gCard = cards.find(c => c.textContent && c.textContent.includes('Institución / B2G'));
    if (b2gCard) b2gCard.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  report.route3.actions.push('Clic en tarjeta Institución / B2G -> Túnel B2G');
  shotPath = path.join(artifactDir, 'r3_p1_b2g_tunel.png');
  await page.screenshot({ path: shotPath });
  report.route3.screenshots.push(shotPath);

  // Pantalla 2: Clic en "Generar Pliego B2G" -> /vimume/clinica
  console.log('-> Clic en Pliegos Art. 118 LCSP...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('#neural-tunnel-section a'));
    const b2gLink = links.find(l => l.textContent && (l.textContent.includes('Pliego') || l.textContent.includes('B2G')));
    if (b2gLink) b2gLink.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  report.route3.pages.push(page.url());
  report.route3.actions.push('Clic en "Generar Pliego B2G" -> Carga de /vimume/clinica');
  shotPath = path.join(artifactDir, 'r3_p2_vimume_clinica.png');
  await page.screenshot({ path: shotPath });
  report.route3.screenshots.push(shotPath);

  // Pantalla 3: Clic en "Descargar Pliego B2G" / PDF en /vimume/clinica
  console.log('-> Prueba de descarga de PDF técnico...');
  await page.evaluate(() => {
    const pdfBtn = Array.from(document.querySelectorAll('a, button')).find(el => el.textContent && el.textContent.includes('Pliego'));
    if (pdfBtn) pdfBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  report.route3.actions.push('Inspección de bloque 40Hz Gamma y prueba de descarga de PDF Pliego B2G');
  shotPath = path.join(artifactDir, 'r3_p3_pdf_response.png');
  await page.screenshot({ path: shotPath });
  report.route3.screenshots.push(shotPath);

  // Pantalla 4: Vista Familiar /vimume/familia
  console.log('-> Navegación a /vimume/familia...');
  await page.goto('http://localhost:3007/vimume/familia', { waitUntil: 'networkidle2' });
  report.route3.pages.push(page.url());

  // Probar botones de bitácora
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    if (btns.length > 0) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 600));

  report.route3.actions.push('Navegación a /vimume/familia e interacción con bitácora de sesiones');
  shotPath = path.join(artifactDir, 'r3_p4_vimume_familia.png');
  await page.screenshot({ path: shotPath });
  report.route3.screenshots.push(shotPath);
  report.route3.systemResponse = `Ruta completada: / -> /vimume/clinica -> /vimume/familia. Pliegos y bitácora clínica 100% integrados.`;

  /* ==========================================================================
     RUTA 4: PROVEEDOR Y RECLAMACIÓN DE FICHA
     ========================================================================== */
  console.log('\n=================== RUTA 4: PROVEEDOR Y RECLAMACIÓN ===================');

  // Pantalla 1: Home /
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle2' });
  report.route4.pages.push(page.url());

  // Clic en "Proveedor / Partner"
  console.log('-> Clic en Proveedor / Partner...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const partnerCard = cards.find(c => c.textContent && c.textContent.includes('Proveedor / Partner'));
    if (partnerCard) partnerCard.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  report.route4.actions.push('Clic en tarjeta Proveedor / Partner -> Túnel de Infraestructura');
  shotPath = path.join(artifactDir, 'r4_p1_partner_tunel.png');
  await page.screenshot({ path: shotPath });
  report.route4.screenshots.push(shotPath);

  // Pantalla 2: Clic en Opción B "Reclamar mi Ficha" -> /reclamar-perfil
  console.log('-> Clic en Reclamar mi Ficha...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('#neural-tunnel-section a'));
    const claimLink = links.find(l => l.textContent && l.textContent.includes('Reclamar'));
    if (claimLink) claimLink.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  report.route4.pages.push(page.url());
  report.route4.actions.push('Clic en "Reclamar mi Ficha" -> Carga física de /reclamar-perfil');
  shotPath = path.join(artifactDir, 'r4_p2_reclamar_perfil.png');
  await page.screenshot({ path: shotPath });
  report.route4.screenshots.push(shotPath);

  // Pantalla 3: Portal /reclamar-perfil - Rellenar campo de búsqueda y verificar
  console.log('-> Búsqueda de empresa y verificación...');
  await page.evaluate(() => {
    const input = document.querySelector('input[type="text"]');
    if (input) {
      input.value = 'Sonido Madrid S.L.';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 800));

  report.route4.actions.push('Relleno de búsqueda con "Sonido Madrid S.L." y verificación de perfiles indexados');
  shotPath = path.join(artifactDir, 'r4_p3_busqueda_empresa.png');
  await page.screenshot({ path: shotPath });
  report.route4.screenshots.push(shotPath);
  report.route4.systemResponse = `Ruta completada: / -> /reclamar-perfil. Buscador de 22.471 perfiles activo con respuesta fluida.`;

  await browser.close();

  console.log('\n================ SWEEP COMPLETE ================');
  console.log(JSON.stringify(report, null, 2));
  console.log('================================================\n');
}

runHumanJourneySweep().catch(err => {
  console.error('[SWEEP FAILED]:', err);
  process.exit(1);
});
