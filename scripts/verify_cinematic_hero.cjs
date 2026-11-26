#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/VERIFY_CINEMATIC_HERO.CJS — ARNÉS REAL DEL HERO "TASTE ENGINE"
 * ════════════════════════════════════════════════════════════════════════════
 * Sonda de navegador (Puppeteer) sobre una instancia VIVA de la Home. No es un
 * test estático: mide CLS con PerformanceObserver, monta el motor Canvas 2D,
 * recorre los 4 actos por scroll y comprueba que nunca hay dos claims
 * superpuestos, que el rail marca el acto correcto, que el CTA del Acto IV
 * apunta a una ruta real y que `prefers-reduced-motion` degrada a keyframes
 * WebP sin canvas.
 *
 * USO (requiere servidor arrancado: `npm run dev` o `npm start`):
 *   node scripts/verify_cinematic_hero.cjs
 *   node scripts/verify_cinematic_hero.cjs --url=http://localhost:3007/
 *
 * CÓDIGOS DE SALIDA (protocolo EP-2):
 *   0 → VERIFICADO (todas las aserciones pasan)
 *   1 → SOSPECHOSO (alguna aserción falla: se imprime el detalle)
 *   2 → SIN_EVIDENCIA (servidor no alcanzable: no se inventa un verde)
 * ════════════════════════════════════════════════════════════════════════════
 */

const puppeteer = require('puppeteer');

const DEFAULT_URL = 'http://localhost:3007/';
const CLS_BUDGET = 0.05;
const ACT_COUNT = 4;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function resolveTarget() {
  const arg = process.argv.find((value) => value.startsWith('--url='));
  return arg ? arg.slice('--url='.length) : DEFAULT_URL;
}

function observeCls() {
  window.__cls = 0;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hasRecentInput) window.__cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {
    window.__cls = null;
  }
}

async function scrollToFraction(page, fraction) {
  await page.evaluate((value) => {
    const hero = document.querySelector('section[aria-label*="Hero cinematogr"]');
    if (!hero) return;
    const top = hero.getBoundingClientRect().top + window.scrollY;
    const span = hero.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * value, behavior: 'instant' });
  }, fraction);
  await sleep(420);
}

async function measureActs(page) {
  return page.evaluate((count) => {
    const panels = Array.from(document.querySelectorAll('[data-cinematic-act]'));
    const opacities = panels.map((panel) => ({
      act: panel.getAttribute('data-cinematic-act'),
      opacity: Number(Number(getComputedStyle(panel).opacity).toFixed(2)),
    }));
    const visible = opacities.filter((entry) => entry.opacity > 0.5);
    const rail = document.querySelector('nav[aria-label="Actos del hero"] [aria-current="step"]');
    return {
      count: opacities.length,
      expected: count,
      visible: visible.length,
      total: Number(opacities.reduce((sum, entry) => sum + entry.opacity, 0).toFixed(2)),
      rail: rail ? rail.textContent : null,
      detail: opacities.map((entry) => `${entry.act}:${entry.opacity}`).join(' '),
    };
  }, ACT_COUNT);
}
async function main() {
  const target = resolveTarget();
  const report = { url: target, checks: [], evidence: {}, verdict: 'SIN_EVIDENCIA' };
  const fail = (message) => report.checks.push({ status: 'FAIL', message });

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  } catch (error) {
    report.checks.push({
      status: 'SIN_EVIDENCIA',
      message: `Puppeteer no disponible: ${error.message}`,
    });
    console.log(JSON.stringify(report, null, 2));
    process.exit(2);
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluateOnNewDocument(observeCls);
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));

    const response = await page.goto(target, { waitUntil: 'networkidle2', timeout: 120000 });
    await sleep(2500);

    report.evidence.httpStatus = response ? response.status() : null;
    if (report.evidence.httpStatus !== 200) {
      fail(`Home no responde 200 (status=${report.evidence.httpStatus})`);
    }

    report.evidence.heroHeight = await page.evaluate(() => {
      const hero = document.querySelector('section[aria-label*="Hero cinematogr"]');
      return hero ? Math.round(hero.getBoundingClientRect().height) : 0;
    });
    if (report.evidence.heroHeight < 900) {
      fail('El stage del hero no reserva una altura de viewport completa');
    }

    report.evidence.canvasMounted =
      (await page.$$('[data-cinematic-engine="canvas-2d"]')).length === 1;
    if (!report.evidence.canvasMounted) fail('El motor Canvas 2D no se montó en escritorio');

    report.evidence.keyframes = (await page.$$('[data-cinematic-engine="keyframe"]')).length;
    if (report.evidence.keyframes !== 1) fail('La capa de keyframes WebP no está montada');

    // Recorrido de los 4 actos: un único claim legible en cada punto.
    const samples = [0, 0.12, 0.25, 0.3, 0.45, 0.6, 0.72, 0.95, 1];
    report.evidence.acts = [];
    for (const fraction of samples) {
      await scrollToFraction(page, fraction);
      const measured = await measureActs(page);
      report.evidence.acts.push({ fraction, ...measured });
      if (measured.count !== measured.expected) {
        fail(`Se esperaban ${measured.expected} paneles de copy y hay ${measured.count}`);
      }
      if (measured.total > 1.02) {
        fail(`Solape de claims en p=${fraction} (opacidad acumulada ${measured.total})`);
      }
      if (measured.visible > 1) {
        fail(`Dos claims legibles simultáneamente en p=${fraction} (${measured.detail})`);
      }
    }

    const lastAct = report.evidence.acts[report.evidence.acts.length - 1];
    if (lastAct.rail !== '04') {
      fail(`El rail no alcanza el Acto IV al final del track (rail=${lastAct.rail})`);
    }

    report.evidence.act4Cta = await page.evaluate(() => {
      const panel = document.querySelector('[data-cinematic-act="4"]');
      const link = panel ? panel.querySelector('a[href="/fincas"]') : null;
      if (!link) return null;
      const rect = link.getBoundingClientRect();
      return {
        href: link.getAttribute('href'),
        inside:
          rect.left >= 0 &&
          rect.top >= 0 &&
          rect.right <= window.innerWidth &&
          rect.bottom <= window.innerHeight,
      };
    });
    if (!report.evidence.act4Cta || report.evidence.act4Cta.href !== '/fincas') {
      fail('El CTA "Explorar Catálogo de Fincas" no apunta a /fincas en el Acto IV');
    }
    if (report.evidence.act4Cta && !report.evidence.act4Cta.inside) {
      fail('El CTA del Acto IV queda fuera del viewport');
    }

    report.evidence.maitreButton = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button')).some((btn) =>
        /Hablar con el Ma/i.test(btn.textContent || '')
      )
    );
    if (!report.evidence.maitreButton) fail('No existe el botón "Hablar con el Maître"');
// Audio: silencio por defecto y arranque sólo por gesto.
    report.evidence.audioPressedInitial = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((node) =>
        /Audio inmersivo/i.test(node.textContent || '')
      );
      return btn ? btn.getAttribute('aria-pressed') : null;
    });
    if (report.evidence.audioPressedInitial !== 'false') {
      fail('El audio no está silenciado por defecto (política de autoplay)');
    }

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((node) =>
        /Audio inmersivo/i.test(node.textContent || '')
      );
      if (btn) btn.click();
    });
    await sleep(900);

    report.evidence.audioPressedAfterClick = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((node) =>
        /Audio inmersivo/i.test(node.textContent || '')
      );
      return btn ? btn.getAttribute('aria-pressed') : null;
    });
    if (report.evidence.audioPressedAfterClick !== 'true') {
      fail('El toggle de audio no activa el grafo WebAudio tras el gesto');
    }

    // CLS medido (sin recent input) tras cargar y tras recorrer el hero.
    report.evidence.cls = await page.evaluate(() => window.__cls);
    if (report.evidence.cls === null) {
      report.checks.push({
        status: 'SIN_EVIDENCIA',
        message: 'layout-shift no soportado en este motor',
      });
    } else if (report.evidence.cls > CLS_BUDGET) {
      fail(`CLS ${report.evidence.cls} supera el presupuesto ${CLS_BUDGET}`);
    }

    if (pageErrors.length > 0) {
      fail(`Errores de página durante el recorrido: ${pageErrors[0]}`);
    }
    report.evidence.pageErrors = pageErrors.slice(0, 3);

    // Degradación accesible: prefers-reduced-motion ⇒ keyframes, cero canvas.
    const reducedPage = await browser.newPage();
    await reducedPage.setViewport({ width: 1440, height: 900 });
    await reducedPage.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await reducedPage.goto(target, { waitUntil: 'networkidle2', timeout: 120000 });
    await sleep(2000);

    report.evidence.reducedMotion = await reducedPage.evaluate(() => {
      const layers = Array.from(
        document.querySelectorAll('[data-cinematic-engine="keyframe"] > div')
      );
      return {
        canvases: document.querySelectorAll('canvas').length,
        layers: layers.length,
        layersWithWebp: layers.filter((el) => (el.style.backgroundImage || '').includes('webp'))
          .length,
      };
    });
    if (report.evidence.reducedMotion.canvases !== 0) {
      fail('Con prefers-reduced-motion se sigue montando un canvas');
    }
    if (report.evidence.reducedMotion.layersWithWebp < 1) {
      fail('Con prefers-reduced-motion no se cargó ningún fotograma WebP');
    }
    await reducedPage.close();
  } catch (error) {
    report.checks.push({ status: 'SIN_EVIDENCIA', message: error.message });
    await browser.close();
    console.log(JSON.stringify(report, null, 2));
    process.exit(2);
  }

  await browser.close();

  const failures = report.checks.filter((check) => check.status === 'FAIL');
  report.verdict = failures.length === 0 ? 'VERIFICADO' : 'SOSPECHOSO';
  console.log(JSON.stringify(report, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('VERIFY_CINEMATIC_HERO_FAILED', error);
  process.exit(2);
});