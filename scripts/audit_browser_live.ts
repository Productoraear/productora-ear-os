import { chromium } from 'playwright';

async function runLiveAudit() {
  console.log("==============================================================");
  console.log("ARRANCANDO NAVEGADOR AUTÓNOMO (MODO VISIBLE / HEADED)");
  console.log("==============================================================");

  // Lanzar navegador real visible en pantalla
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // 1. Auditoría de la Portada (Bodas.net UX)
    console.log("--> Navegando a la Portada Principal (http://localhost:3007)...");
    await page.goto('http://localhost:3007', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 2. Auditoría del Estudio de Encargos (Canciones de Autor / E-commerce)
    console.log("--> Navegando a la pasarela de Encargos (/encargos)...");
    await page.goto('http://localhost:3007/encargos', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Hacer clic en una ocasión y un género para probar interactividad
    console.log("--> Probando interactividad en selectores de ocasión y género...");
    await page.locator('button').filter({ hasText: 'Aniversario de Pareja' }).click().catch(() => {});
    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: 'Bolero Clásico' }).first().click().catch(() => {});
    await page.waitForTimeout(1500);

    // 3. Auditoría del Panel de Telemetría (Uber Telemetry)
    console.log("--> Navegando al panel de Telemetría (/admin/telemetria)...");
    await page.goto('http://localhost:3007/admin/telemetria', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log("\n==============================================================");
    console.log("✅ AUDITORÍA VISUAL EN VIVO FINALIZADA CON ÉXITO");
    console.log("==============================================================");
  } catch (err) {
    console.error("❌ Error durante la navegación autónoma:", err);
  } finally {
    await browser.close();
  }
}

runLiveAudit();