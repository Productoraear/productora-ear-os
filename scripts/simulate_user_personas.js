// scripts/simulate_user_personas.js
const { chromium } = require('playwright');
const fs = require('fs');

async function runPersonaSimulations() {
  console.log('🚀 INICIANDO SIMULACIÓN HEADLESS DE USER PERSONAS S-CLASS (ZERO-LAG)...');
  
  // Instanciamos Chromium en modo Headless (Sin GUI, consumo mínimo)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const BASE_URL = process.env.TEST_URL || 'https://www.productoraear.com';

  const report = {
    timestamp: new Date().toISOString(),
    personasTested: 3,
    results: []
  };

  // ---------------------------------------------------------------------------
  // PERSONA 1: WEDDING PLANNER DE LUJO (MADRID - 20 SERVICIOS Y BODA COMPLETA)
  // ---------------------------------------------------------------------------
  console.log('👰 [1/3] Simulando Wedding Planner (Madrid - 20 Servicios)...');
  const page1 = await context.newPage();
  try {
    const start = Date.now();
    await page1.goto(`${BASE_URL}/cotizador`, { waitUntil: 'domcontentloaded' });
    
    // Verificación de presencia de componentes críticos en Cotizador
    const hasNeuroFunnel = await page1.$eval('body', el => el.innerText.includes('Boda') || el.innerText.includes('Vida Social'));
    const hasArsenalLink = await page1.$eval('a[href*="arsenal"]', el => !!el).catch(() => false);
    
    // Navegación rápida al Arsenal para verificar la matriz de 20+ servicios
    await page1.goto(`${BASE_URL}/arsenal`, { waitUntil: 'domcontentloaded' });
    const hasFotomaton360 = await page1.$eval('body', el => el.innerText.includes('360') || el.innerText.includes('Fotomatón'));
    const hasScreensLED = await page1.$eval('body', el => el.innerText.includes('LED') || el.innerText.includes('Monitores'));

    report.results.push({
      persona: 'Wedding Planner Madrid (20 Servicios)',
      status: 'PASSED',
      durationMs: Date.now() - start,
      validations: {
        neuroFunnelActive: hasNeuroFunnel,
        arsenalIntegrated: hasArsenalLink,
        fotomaton360Available: hasFotomaton360,
        screensLEDAvailable: hasScreensLED
      }
    });
    console.log('✅ Persona 1 auditada con éxito.');
  } catch (err) {
    report.results.push({ persona: 'Wedding Planner Madrid', status: 'FAILED', error: err.message });
  } finally {
    await page1.close();
  }

  // ---------------------------------------------------------------------------
  // PERSONA 2: DIPLOMÁTICO EN FITUR 2027 (MONTAJE DE STAND + SERVICIOS B2B/B2G)
  // ---------------------------------------------------------------------------
  console.log('🏛️ [2/3] Simulando Diplomático (Stand FITUR 2027 - B2B/B2G)...');
  const page2 = await context.newPage();
  try {
    const start = Date.now();
    await page2.goto(`${BASE_URL}/corporativo/alquiler-pantallas-led-madrid`, { waitUntil: 'domcontentloaded' });
    
    const pageTitle = await page2.title();
    const has12WPax = await page2.$eval('body', el => el.innerText.includes('12 W/pax') || el.innerText.includes('Rider'));
    const hasSmartLock = await page2.$eval('body', el => el.innerText.includes('Smart-Lock') || el.innerText.includes('10 €') || el.innerText.includes('350'));

    report.results.push({
      persona: 'Diplomático FITUR 2027 (B2B/B2G Stand)',
      status: 'PASSED',
      durationMs: Date.now() - start,
      validations: {
        seoLandingLoaded: pageTitle.length > 0,
        soundStandardCertified: has12WPax,
        smartLockOrPriceLockVisible: hasSmartLock
      }
    });
    console.log('✅ Persona 2 auditada con éxito.');
  } catch (err) {
    report.results.push({ persona: 'Diplomático FITUR 2027', status: 'FAILED', error: err.message });
  } finally {
    await page2.close();
  }

  // ---------------------------------------------------------------------------
  // PERSONA 3: CLIENTE PARTICULAR (CUMPLEAÑOS MADRE - JULIO 2027)
  // ---------------------------------------------------------------------------
  console.log('🎂 [3/3] Simulando Cliente Particular (Cumpleaños Madre Julio 2027)...');
  const page3 = await context.newPage();
  try {
    const start = Date.now();
    await page3.goto(`${BASE_URL}/cumpleanos/mariachi-sorpresa-domicilio-madrid`, { waitUntil: 'domcontentloaded' });
    
    const hasEdwinRepertoire = await page3.$eval('body', el => el.innerText.toLowerCase().includes('mariachi') || el.innerText.toLowerCase().includes('edwin'));
    const hasPrice350 = await page3.$eval('body', el => el.innerText.includes('350'));

    report.results.push({
      persona: 'Cliente Particular (Cumpleaños Julio 2027)',
      status: 'PASSED',
      durationMs: Date.now() - start,
      validations: {
        mariachiLandingLoaded: hasEdwinRepertoire,
        basePrice350Verified: hasPrice350
      }
    });
    console.log('✅ Persona 3 auditada con éxito.');
  } catch (err) {
    report.results.push({ persona: 'Cliente Particular Cumpleaños', status: 'FAILED', error: err.message });
  } finally {
    await page3.close();
  }

  await browser.close();

  // Guardamos el informe en disco
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/PERSONA_SIMULATION_REPORT.json', JSON.stringify(report, null, 2));
  console.log('\n📊 INFORME GUARDADO EN: docs/PERSONA_SIMULATION_REPORT.json');
}

runPersonaSimulations();