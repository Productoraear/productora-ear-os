const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runLiveAudit() {
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
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  console.log('>>> [2/5] Navigating to http://localhost:3007/ ...');
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. INVOCACIÓN DE SCROLL Y NAVEGACIÓN (Cliente de Eventos)
  console.log('>>> [3/5] Testing Invocación de Scroll & Cliente de Eventos...');
  
  // Find card with "Cliente de Eventos"
  const clientCard = await page.evaluateHandle(() => {
    const elements = Array.from(document.querySelectorAll('div[role="button"], div'));
    return elements.find(el => el.textContent && el.textContent.includes('Cliente de Eventos') && el.textContent.includes('Perfil 1'));
  });

  if (clientCard) {
    await clientCard.click();
  } else {
    // Fallback click on first profile card
    const cards = await page.$$('div[role="button"]');
    if (cards.length > 0) await cards[0].click();
  }

  // Wait for spring animation and smooth scroll
  await new Promise(r => setTimeout(r, 1500));

  const clientScreenshotPath = path.join(artifactDir, 'audit_cliente_tunnel_open.png');
  await page.screenshot({ path: clientScreenshotPath, fullPage: false });
  console.log(`[OK] Captured: ${clientScreenshotPath}`);

  // Inspect DOM state of #neural-tunnel-section
  const clientTunnelState = await page.evaluate(() => {
    const section = document.getElementById('neural-tunnel-section');
    if (!section) return { exists: false };
    const h2 = section.querySelector('h2');
    const phases = Array.from(section.querySelectorAll('h3')).map(h => h.textContent);
    const options = Array.from(section.querySelectorAll('h4')).map(h => h.textContent);
    const rect = section.getBoundingClientRect();
    const scrollY = window.scrollY;
    return {
      exists: true,
      header: h2 ? h2.textContent : '',
      phases,
      options,
      rectTop: rect.top,
      scrollY,
      hasBespokeHeader: h2 ? h2.textContent.includes('Arquitectura de Experiencia Bespoke') : false
    };
  });

  // 2. INSPECCIÓN DEL RESPLANDOR Y ESTADO DINÁMICO (Institución / B2G)
  console.log('>>> [4/5] Testing Transition to Institución / B2G...');
  
  const b2gCard = await page.evaluateHandle(() => {
    const elements = Array.from(document.querySelectorAll('div[role="button"], div'));
    return elements.find(el => el.textContent && el.textContent.includes('Institución / B2G') && el.textContent.includes('Perfil 2'));
  });

  if (b2gCard) {
    await b2gCard.click();
  }

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
    return {
      exists: true,
      header: h2 ? h2.textContent : '',
      subtitle: subtitle ? subtitle.textContent : '',
      glowStyle: glowDiv ? glowDiv.getAttribute('style') : '',
      isB2G: h2 ? h2.textContent.includes('Protocolo de Autoridad Pública') : false
    };
  });

  // 3. AUDITORÍA DE CONSOLA Y CICLOS OPEN/CLOSE (3 Ciclos Seguidos)
  console.log('>>> [5/5] Testing 3 Open/Close Cycles with Close Button (X)...');
  const cycleResults = [];

  for (let cycle = 1; cycle <= 3; cycle++) {
    // Click close button 'X'
    const closeBtn = await page.$('#neural-tunnel-section button[aria-label="Cerrar túnel"]');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }

    const isClosed = await page.evaluate(() => {
      const section = document.getElementById('neural-tunnel-section');
      return !section || section.children.length === 0 || section.innerText.trim() === '';
    });

    // Reopen next profile
    const profileIdx = cycle === 1 ? 'Proveedor / Partner' : cycle === 2 ? 'Artista / Producción' : 'Cliente de Eventos';
    const cardToClick = await page.evaluateHandle((name) => {
      const elements = Array.from(document.querySelectorAll('div[role="button"], div'));
      return elements.find(el => el.textContent && el.textContent.includes(name));
    }, profileIdx);

    if (cardToClick) {
      await cardToClick.click();
      await new Promise(r => setTimeout(r, 800));
    }

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
      touchTargets,
      allTouchTargetsPass: touchTargets.every(t => t.meetsTouchTarget || t.height === 0)
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

  console.log('\n================ AUDIT RESULTS JSON ================');
  console.log(JSON.stringify(auditReport, null, 2));
  console.log('====================================================\n');
}

runLiveAudit().catch(err => {
  console.error('[AUDIT FAILED]:', err);
  process.exit(1);
});
