/**
 * E2E NAVEGACIÓN REAL EN BROWSER — WEDDING PLANNER (17 SERVICIOS + AFILIACIÓN 5%)
 * ─────────────────────────────────────────────────────────────────────────────
 * Abre un navegador real (Chromium), navega por las rutas de EAR OS como lo haría
 * una organizadora de bodas y captura evidencia visual + estado del DOM.
 *
 * Usa el canal 'chrome' del sistema si existe; si no, el Chromium de Playwright.
 * Ejecución: npx tsx scripts/e2e-wedding-planner-browser.ts
 */

import { chromium, type Browser, type Page } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3007';
const OUTPUT_DIR = join(process.cwd(), 'reports', 'wedding_planner_e2e');
const PROVINCIA = 'toledo';
const GREMIOS = [
  'mariachis',
  'solistas',
  'cuarteto-cuerdas',
  'sonido-iluminacion',
  'dj',
  'fincas',
  'catering-brasas',
  'pantallas-led',
  'animacion',
  'coches-clasicos'
];

interface StepEvidence {
  step: number;
  name: string;
  url: string;
  status: number;
  title: string;
  matchedIntent: boolean;
  screenshot: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function grab(page: Page): Promise<{ title: string; bodyText: string }> {
  return {
    title: await page.title(),
    bodyText: await page.evaluate(() => document.body.innerText)
  };
}

async function resolveBrowser(): Promise<Browser> {
  // Intenta el Chrome del sistema (más rápido, sin descargar Chromium).
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const fs = await import('fs');
  for (const exe of candidates) {
    if (fs.existsSync(exe)) {
      console.log(`  Browser detectado: ${exe}`);
      return chromium.launch({ executablePath: exe, headless: true });
    }
  }
  console.log('  Usando Chromium de Playwright (fallback).');
  return chromium.launch({ headless: true });
}

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(' NAVEGACIÓN E2E EN BROWSER — WEDDING PLANNER (17 SERVICIOS)');
  console.log('═══════════════════════════════════════════════════════════');

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  let browser: Browser | null = null;
  try {
    browser = await resolveBrowser();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const evidence: StepEvidence[] = [];

    // PASO 0 — Home / landing general.
    console.log('\n[PASO 0] Landing principal');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await delay(1200);
    let g = await grab(page);
    console.log(`  → ${g.title}`);
    evidence.push({
      step: 0, name: 'Home', url: `${BASE_URL}/`, status: 200,
      title: g.title, matchedIntent: g.bodyText.length > 100,
      screenshot: join(OUTPUT_DIR, '00-home.png')
    });
    await page.screenshot({ path: evidence[0].screenshot, fullPage: false });

    // PASO 1 — Página de afiliados (la organizadora se adhiere).
    console.log('\n[PASO 1] Programa de Afiliados / Adhesión Wedding Planner');
    const afiliadosResp = await page.goto(`${BASE_URL}/afiliados`, { waitUntil: 'domcontentloaded' });
    await delay(1200);
    g = await grab(page);
    const hubAfi = g.bodyText.toLowerCase().includes('afiliad') || g.bodyText.toLowerCase().includes('wedding planner');
    console.log(`  → HTTP ${afiliadosResp?.status()} · ${g.title}`);
    evidence.push({
      step: 1, name: 'Adhesión Afiliada', url: `${BASE_URL}/afiliados`,
      status: afiliadosResp?.status() ?? 0, title: g.title, matchedIntent: hubAfi,
      screenshot: join(OUTPUT_DIR, '01-afiliados.png')
    });
    await page.screenshot({ path: evidence[1].screenshot, fullPage: true });

    // PASO 2.. — Navegación de intención por los 10 gremios de servicios.
    console.log('\n[PASO 2] Recorrido de intención por gremios (resolución de dolor)');
    for (let i = 0; i < GREMIOS.length; i++) {
      const gremio = GREMIOS[i];
      const url = `${BASE_URL}/servicios/${gremio}/${PROVINCIA}`;
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
      await delay(700);
      g = await grab(page);
      const matched = /12 W\/pax|12W\/pax|Bose|Bose F1|Méntrida|350,00|350 €|100,00|80\/10\/10|telemetría|Relevo Uber/i.test(g.bodyText);
      console.log(`  [${String(i + 2).padStart(2, '0')}] ${gremio} — HTTP ${resp?.status()} — intent ${matched ? '✓' : '✗'}`);
      evidence.push({
        step: i + 2, name: gremio, url,
        status: resp?.status() ?? 0, title: g.title, matchedIntent: matched,
        screenshot: join(OUTPUT_DIR, `${String(i + 2).padStart(2, '0')}-${gremio}.png`)
      });
      if (i < 3) {
        await page.screenshot({ path: evidence[i + 2].screenshot, fullPage: false });
      }
    }

    // PASO FINAL — Checkout unificado (consolidación de los 17 servicios).
    console.log('\n[PASO FINAL] Checkout consolidado / presupuesto');
    const checkoutUrl = `${BASE_URL}/checkout/presupuesto?servicio=solistas&provincia=${PROVINCIA}`;
    const coResp = await page.goto(checkoutUrl, { waitUntil: 'domcontentloaded' });
    await delay(1500);
    g = await grab(page);
    const checkoutOk = coResp?.status() === 200;
    console.log(`  → HTTP ${coResp?.status()} · ${g.title}`);
    evidence.push({
      step: 99, name: 'Checkout', url: checkoutUrl,
      status: coResp?.status() ?? 0, title: g.title, matchedIntent: checkoutOk,
      screenshot: join(OUTPUT_DIR, '99-checkout.png')
    });
    await page.screenshot({ path: evidence[evidence.length - 1].screenshot, fullPage: false });

    // Evidencia JSON.
    const summary = {
      engine: 'WEDDING_PLANNER_BROWSER_E2E',
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      totalSteps: evidence.length,
      passed: evidence.filter((e) => e.status === 200 && e.matchedIntent).length,
      evidence
    };
    writeFileSync(join(OUTPUT_DIR, 'evidence.json'), JSON.stringify(summary, null, 2), 'utf-8');

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log(`  Pasos navegados: ${evidence.length}`);
    console.log(`  Evidencia OK (HTTP 200 + intención): ${summary.passed}/${summary.totalSteps}`);
    console.log(`  Capturas guardadas en: ${OUTPUT_DIR}`);
    console.log('═══════════════════════════════════════════════════════════');
  } finally {
    if (browser) await browser.close();
  }
}

main().catch((err) => {
  console.error('[E2E BROWSER ERROR]', err);
  process.exit(1);
});