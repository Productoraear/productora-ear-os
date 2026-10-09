const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');

(async () => {
  console.log('Iniciando Motor Cinematico Local (Playwright)...');
  const desktopDir = path.join(os.homedir(), 'Desktop');
  const finalVideoPath = path.join(desktopDir, 'demo_mariachis_sclass.webm');

  try {
    // Lanza el navegador
    const browser = await chromium.launch({
      headless: true,
    });

    // Crea un contexto con grabación de video habilitada
    const context = await browser.newContext({
      recordVideo: {
        dir: desktopDir,
        size: { width: 1280, height: 720 },
      },
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    console.log('Navegando a la landing de Mariachis...');
    await page.goto('http://localhost:3007/mariachis', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('Network idle timeout, procediendo...'));

    console.log('Iniciando coreografía de demo (scroll y hover)...');
    
    // Simulamos interacción de usuario para el video
    await page.waitForTimeout(2000);
    
    // Scroll suave hacia abajo
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 15;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 5000) {
            clearInterval(timer);
            resolve();
          }
        }, 20);
      });
    });

    await page.waitForTimeout(1000);

    // Scroll de vuelta arriba
    await page.evaluate(async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    await page.waitForTimeout(2000);

    console.log('Finalizando grabación y cerrando contexto...');
    
    const videoObj = await page.video();
    let videoPath = null;
    if (videoObj) {
        videoPath = await videoObj.path();
    }

    await context.close();
    await browser.close();

    if (videoPath && fs.existsSync(videoPath)) {
      if (fs.existsSync(finalVideoPath)) {
        fs.unlinkSync(finalVideoPath);
      }
      fs.renameSync(videoPath, finalVideoPath);
      console.log('✅ Demo cinemática generada exitosamente en el escritorio:');
      console.log(finalVideoPath);
    } else {
      console.log('⚠️ No se encontró el archivo de video temporal.');
    }
  } catch (error) {
    console.error('Error durante la generación de la demo:', error);
  }
})();
