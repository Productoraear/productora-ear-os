const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

// ════════════════════════════════════════════════════════════════════════════
// EAR OS - S-CLASS CINEMATIC RENDER ENGINE (CLI)
// ════════════════════════════════════════════════════════════════════════════
// Parámetros de CLI: --target [url] --outDir [dir] --fps [30|60] --voiceover [true|false]
// Ejemplo: node scripts/cinematic_render_engine.cjs --target http://localhost:3007/mariachis --outDir C:\Users\M2-W10\Desktop\EAR_RENDERS --fps 60
// ════════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const getArg = (flag, def) => {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : def;
};

const TARGET_URL = getArg('--target', 'http://localhost:3007/mariachis');
const OUT_DIR = getArg('--outDir', path.join(os.homedir(), 'Desktop', 'EAR_RENDERS'));
const FPS = parseInt(getArg('--fps', '60'));
const USE_VOICEOVER = getArg('--voiceover', 'true') === 'true';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const finalVideoPath = path.join(OUT_DIR, `CINEMATIC_RENDER_${timestamp}.webm`);

console.log('═══════════════════════════════════════════════════════════════');
console.log('🎬 INICIANDO CINEMATIC RENDER ENGINE (S-CLASS) 🎬');
console.log(`- Objetivo: ${TARGET_URL}`);
console.log(`- Directorio Salida: ${OUT_DIR}`);
console.log(`- Framerate: ${FPS} FPS`);
console.log(`- Multiplexar Voiceover: ${USE_VOICEOVER ? 'SÍ (Simulado sin FFmpeg)' : 'NO'}`);
console.log('═══════════════════════════════════════════════════════════════\n');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    
    // Configuración Profesional de Contexto
    const context = await browser.newContext({
      recordVideo: {
        dir: OUT_DIR,
        size: { width: 1920, height: 1080 },
      },
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2, // HiDPI Retina (4K-like sharpness)
    });

    const page = await context.newPage();

    console.log('[1/4] 🌐 Navegando a la URL objetivo...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => console.log('Network idle warning...'));

    console.log('[2/4] 🎥 Grabando coreografía visual (Tracking DOM)...');
    
    // Inyectar un overlay "REC" (Opcional, para estilo)
    await page.evaluate(() => {
      const rec = document.createElement('div');
      rec.innerHTML = '● REC 4K S-CLASS';
      rec.style.position = 'fixed';
      rec.style.top = '20px';
      rec.style.right = '20px';
      rec.style.color = 'red';
      rec.style.fontFamily = 'monospace';
      rec.style.fontSize = '24px';
      rec.style.zIndex = '999999';
      rec.style.fontWeight = 'bold';
      document.body.appendChild(rec);
    });

    await page.waitForTimeout(1000);
    
    // Scroll coreografiado dinámico
    await page.evaluate(async (fps) => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = fps === 60 ? 10 : 20; // Más suave en 60fps
        const interval = fps === 60 ? 16 : 33; 
        
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 5000) {
            clearInterval(timer);
            resolve();
          }
        }, interval);
      });
    }, FPS);

    await page.waitForTimeout(500);
    await page.evaluate(async () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1500);

    console.log('[3/4] 💾 Finalizando pipeline de renderizado...');
    const videoObj = await page.video();
    let videoPath = null;
    if (videoObj) {
        videoPath = await videoObj.path();
    }

    await context.close();
    await browser.close();

    console.log('[4/4] 📦 Exportando archivo maestro...');
    if (videoPath && fs.existsSync(videoPath)) {
      if (fs.existsSync(finalVideoPath)) {
        fs.unlinkSync(finalVideoPath);
      }
      fs.renameSync(videoPath, finalVideoPath);
      
      console.log('\n===============================================================');
      console.log('✅ RENDER S-CLASS COMPLETADO EXITOSAMENTE');
      console.log(`➡️ Archivo Maestro (Video): ${finalVideoPath}`);
      
      if (USE_VOICEOVER) {
        console.log(`\n⚠️ NOTA AUDIO: El motor local grabó el lienzo DOM.`);
        console.log(`Para inyectar el audio de alta calidad (TTS), el pipeline definitivo de Silicon Valley `);
        console.log(`orquesta esta tarea en n8n + FFmpeg en la nube o requiere FFmpeg instalado en tu PC (Windows).`);
      }
      console.log('===============================================================');
      
    } else {
      console.log('❌ Error crítico: No se generó el buffer de video.');
    }
  } catch (error) {
    console.error('❌ Error catastrófico en el render engine:', error);
  }
})();
