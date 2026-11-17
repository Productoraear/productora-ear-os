/**
 * ══════════════════════════════════════════════════════════════════════════════
 * SIMULADOR BROWSER CONCIERGE PLAYWRIGHT VISIBLE (EAR OS V20 S-CLASS)
 * ══════════════════════════════════════════════════════════════════════════════
 * Simulación visible (headless: false) del viaje de novios (Leire e Iker) en /otzarreta:
 *   1. Navega a http://localhost:3007/otzarreta en Chromium visible.
 *   2. Despliega el widget del Concierge de IA.
 *   3. Envía consultas consecutivas:
 *      a) Fecha 24 junio 2027 y exclusividad (1 boda/día).
 *      b) Menú celíacos y parking 150 plazas.
 *      c) Menú Asador al Sarmiento (155 €) para 90 invitados.
 *      d) Petición de reserva con fianza de 100 €.
 *   4. Captura evidencias en `scratch/` y dispara el Webhook HITL 90% a Telegram.
 * ══════════════════════════════════════════════════════════════════════════════
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSimulation() {
  console.log('🚀 Iniciando Simulación Visible Playwright en http://localhost:3007/otzarreta...');

  const screenshotsDir = path.join(process.cwd(), 'scratch', 'screenshots_otzarreta');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    slowMo: 100, // ralentizar para visualización fluida
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 850 },
  });

  const page = await context.newPage();

  try {
    // 1. Navegación a Otzarreta
    console.log('📍 [1/5] Cargando Caserío Ezkertza Berria & Otzarreta (/otzarreta)...');
    await page.goto('http://localhost:3007/otzarreta', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(2000);
    try {
      await page.screenshot({ path: path.join(screenshotsDir, '01_landing_otzarreta.png'), timeout: 5000 });
    } catch {
      console.warn('Screenshot 1 omitido por fuentes');
    }

    // 2. Localizar y abrir el Concierge Widget
    console.log('💬 [2/5] Desplegando el Agente Concierge S-Class...');
    await sleep(3000);

    // Abrir el popover de chat
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trigger = buttons.find((b) =>
        b.getAttribute('aria-label') === 'Abrir Conserjería IA Productora EAR' ||
        b.innerText.includes('Agente EAR OS') ||
        b.innerText.includes('Voz & Chat')
      );
      if (trigger) {
        trigger.click();
      }
    });

    await sleep(2000);
    // Esperar a que el popover esté abierto
    const dialog = page.locator('div[role="dialog"][aria-label*="Conserjería"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    console.log('✅ Diálogo de Conserjería S-Class abierto en pantalla.');

    const input = dialog.locator('input[type="text"]').first();
    await input.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Input del chat localizado y listo.');

    // Helper para interactuar con el chat
    async function sendMessage(msg, stepName, snapFile) {
      console.log(`➡️ ${stepName}: "${msg}"`);
      await input.fill('');
      await input.type(msg, { delay: 20 });
      await sleep(300);

      // Enviar formulario del chat
      const sendButton = dialog.locator('button[type="submit"], button[aria-label="Enviar mensaje"]').first();
      await sendButton.click();

      // Esperar a que el agente responda
      await sleep(4500);
      try {
        await page.screenshot({ path: path.join(screenshotsDir, snapFile), timeout: 5000 });
      } catch {}
    }

    // Interacción a) Fecha y exclusividad
    await sendMessage(
      'Hola, queremos casarnos el 24 de junio de 2027. ¿Tenéis esa fecha libre y aseguráis que sea la única boda del día?',
      '[Paso A] Fecha 24 Junio 2027 & Exclusividad',
      '03_chat_fecha_exclusividad.png'
    );

    // Interacción b) Celíacos y Parking 150 plazas
    await sendMessage(
      'Vienen varios familiares celíacos y mayores. ¿Tenéis cocina sin gluten adaptada y parking suficiente para 150 coches?',
      '[Paso B] Celíacos & Parking 150 Plazas',
      '04_chat_celiacos_parking.png'
    );

    // Interacción c) Menú Asador al Sarmiento 155 €
    await sendMessage(
      'Nos enamora el Menú Asador al Sarmiento (155 €) con chuletón a la brasa y bogavante para 90 invitados. ¿Qué incluye?',
      '[Paso C] Selección Menú Asador 155 € (90 pax)',
      '05_chat_menu_sarmiento_155.png'
    );

    // Interacción d) Cierre HITL 90% con fianza 100 €
    await sendMessage(
      '¡Queremos bloquear la fecha de inmediato! ¿Cómo formalizamos la fianza de 100 € con tarjeta y cuándo podemos ir a ver a Eduardo?',
      '[Paso D] Solicitud de Cierre / Fianza 100 € (HITL 90% Trigger)',
      '06_chat_fianza_100_hitl.png'
    );

    console.log('✅ Simulación completada con éxito. Capturas guardadas en scratch/screenshots_otzarreta');
    console.log('🔔 Manteniendo el navegador abierto 15 segundos para visualización del CEO...');
    await sleep(15000);

  } catch (error) {
    console.error('❌ Error durante la simulación de Playwright:', error);
  } finally {
    await browser.close();
    console.log('🏁 Sesión de navegador finalizada.');
  }
}

runSimulation();
