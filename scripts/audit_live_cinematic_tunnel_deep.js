const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runDeepLiveAudit() {
  const artifactDir = 'C:\\Users\\M2-W10\\.gemini\\antigravity-ide\\brain\\066359b6-dd26-4c3d-b49b-ca96c39f0c12';
  
  const consoleLogs = [];
  const pageErrors = [];

  console.log('>>> [1/5] Launching Puppeteer Chromium instance...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  console.log('>>> [2/5] Navigating to http://localhost:3007/ ...');
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. INVOCACIÓN DE SCROLL Y NAVEGACIÓN (Cliente de Eventos)
  console.log('>>> [3/5] Testing Invocación de Scroll & Cliente de Eventos...');
  
  // Click on "Cliente de Eventos" card
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const clientCard = cards.find(c => c.textContent && c.textContent.includes('Cliente de Eventos'));
    if (clientCard) clientCard.click();
  });

  // Wait for dynamic chunk to load and element to mount
  await page.waitForSelector('#neural-tunnel-section button[aria-label="Cerrar túnel"]', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1200));

  const clientScreenshotPath = path.join(artifactDir, 'audit_cliente_tunnel_open.png');
  await page.screenshot({ path: clientScreenshotPath, fullPage: false });
  console.log(`[OK] Captured: ${clientScreenshotPath}`);

  // Inspect DOM state of #neural-tunnel-section
  const clientTunnelState = await page.evaluate(() => {
    const section = document.getElementById('neural-tunnel-section');
    if (!section) return { exists: false };
    const h2 = section.querySelector('h2');
    const phases = Array.from(section.querySelectorAll('h3')).map(h => h.textContent.trim());
    const options = Array.from(section.querySelectorAll('h4')).map(h => h.textContent.trim());
    const rect = section.getBoundingClientRect();
    return {
      exists: true,
      header: h2 ? h2.textContent.trim() : '',
      phases,
      options,
      rectTop: Math.round(rect.top),
      hasBespokeHeader: h2 ? h2.textContent.includes('Arquitectura de Experiencia Bespoke') : false
    };
  });

  // 2. INSPECCIÓN DEL RESPLANDOR Y ESTADO DINÁMICO (Institución / B2G)
  console.log('>>> [4/5] Testing Transition to Institución / B2G...');
  
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const b2gCard = cards.find(c => c.textContent && c.textContent.includes('Institución / B2G'));
    if (b2gCard) b2gCard.click();
  });

  await new Promise(r => setTimeout(r, 1200));

  const b2gScreenshotPath = path.join(artifactDir, 'audit_b2g_tunnel_open.png');
  await page.screenshot({ path: b2gScreenshotPath, fullPage: false });
  console.log(`[OK] Captured: ${b2gScreenshotPath}`);

  const b2gTunnelState = await page.evaluate(() => {
    const section = document.getElementById('neural-tunnel-section');
    if (!section) return { exists: false };
    const h2 = section.querySelector('h2');
    const subtitle = section.querySelector('p');
    const glowDiv = section.querySelector('div[style*="background-color"]');
    const glowStyle = glowDiv ? glowDiv.getAttribute('style') : '';
    return {
      exists: true,
      header: h2 ? h2.textContent.trim() : '',
      subtitle: subtitle ? subtitle.textContent.trim() : '',
      glowStyle,
      isB2G: h2 ? h2.textContent.includes('Protocolo de Autoridad Pública') : false,
      hasCobaltGlow: glowStyle.includes('59, 130, 246') || glowStyle.includes('59,130,246') || glowStyle.includes('blue')
    };
  });

  // 3. AUDITORÍA DE CONSOLA Y CICLOS OPEN/CLOSE (3 Ciclos Seguidos)
  console.log('>>> [5/5] Testing 3 Open/Close Cycles with Close Button (X)...');
  const cycleResults = [];

  for (let cycle = 1; cycle <= 3; cycle++) {
    // Click close button 'X'
    await page.evaluate(() => {
      const btn = document.querySelector('#neural-tunnel-section button[aria-label="Cerrar túnel"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const isClosed = await page.evaluate(() => {
      const section = document.getElementById('neural-tunnel-section');
      return !section || section.children.length === 0 || section.innerText.trim() === '';
    });

    // Reopen next profile
    const profileIdx = cycle === 1 ? 'Proveedor / Partner' : cycle === 2 ? 'Artista / Producción' : 'Cliente de Eventos';
    await page.evaluate((name) => {
      const cards = Array.from(document.querySelectorAll('div[role="button"]'));
      const card = cards.find(c => c.textContent && c.textContent.includes(name));
      if (card) card.click();
    }, profileIdx);

    await page.waitForSelector('#neural-tunnel-section button[aria-label="Cerrar túnel"]', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));

    cycleResults.push({ cycle, closedCleanly: isClosed, reopenedProfile: profileIdx });
  }

  // Check console for hydration mismatches or hooks errors
  const hydrationErrors = consoleLogs.filter(log => 
    log.text.toLowerCase().includes('hydration') ||
    log.text.toLowerCase().includes('mismatch') ||
    log.text.toLowerCase().includes('rendered more hooks')
  );

  // 4. EMULACIÓN MÓVIL ESTRICTA (390 x 844)
  console.log('>>> Testing Mobile Emulation (390 x 844 px)...');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 800));

  // Scroll into tunnel section in mobile
  await page.evaluate(() => {
    const el = document.getElementById('neural-tunnel-section');
    if (el) el.scrollIntoView({ behavior: 'auto' });
  });
  await new Promise(r => setTimeout(r, 600));

  const mobileMetrics = await page.evaluate(() => {
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const hasHorizontalOverflow = scrollWidth > clientWidth;

    // Check touch targets >= 44px
    const buttons = Array.from(document.querySelectorAll('#neural-tunnel-section a, #neural-tunnel-section button'));
    const touchTargets = buttons.map(b => {
      const r = b.getBoundingClientRect();
      return {
        text: b.textContent.trim().slice(0, 30),
        width: Math.round(r.width),
        height: Math.round(r.height),
        meetsTouchTarget: r.height >= 44
      };
    });

    return {
      scrollWidth,
      clientWidth,
      hasHorizontalOverflow,
      touchTargetsCount: touchTargets.length,
      allTouchTargetsPass: touchTargets.length > 0 && touchTargets.every(t => t.meetsTouchTarget || t.height === 0)
    };
  });

  const mobileScreenshotPath = path.join(artifactDir, 'audit_mobile_390x844_tunnel.png');
  await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
  console.log(`[OK] Captured Mobile: ${mobileScreenshotPath}`);

  await browser.close();

  const auditReport = {
    timestamp: new Date().toISOString(),
    clientTunnelState,
    b2gTunnelState,
    cycleResults,
    hydrationErrorsCount: hydrationErrors.length,
    pageErrorsCount: pageErrors.length,
    pageErrors,
    mobileMetrics,
    screenshots: {
      client: clientScreenshotPath,
      b2g: b2gScreenshotPath,
      mobile: mobileScreenshotPath
    }
  };

  console.log('\n================ DEEP AUDIT RESULTS JSON ================');
  console.log(JSON.stringify(auditReport, null, 2));
  console.log('=========================================================\n');
}

runDeepLiveAudit().catch(err => {
  console.error('[AUDIT FAILED]:', err);
  process.exit(1);
});
