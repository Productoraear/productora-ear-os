/**
 * ════════════════════════════════════════════════════════════════════════════
 * S-CLASS EXTRACTOR ASISTIDO: SUSCRIPCIÓN VELOCITY MEDIA
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina: ZTLM (Zero-Token Local Mirroring) · Extracción Asistida.
 * Extrae transcripciones y textos de la suscripción en `space.velocitymedia.info`
 * sin requerir credenciales en texto plano.
 *
 * MODALIDADES SOPORTADAS:
 *   [A] Puppeteer remoto: Se conecta a Chrome en `http://127.0.0.1:9222`.
 *   [B] Procesamiento de HTMLs: Procesa archivos en `scratch/velocity_raw_html/`.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const BASE_URL = 'https://space.velocitymedia.info';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'knowledge', 'vault_velocity_incubadora', 'transcripciones');
const RAW_HTML_DIR = path.resolve(__dirname, '..', 'scratch', 'velocity_raw_html');

// Catálogo canónico extraído de la nota del CEO
const CATALOG_PATHS = [
  // Workshops
  { category: 'workshops', id: '109', name: 'Workshops Activos (Sesión CEO)', path: '/course/109/workshops' },
  { category: 'workshops', id: '88', name: 'Metodología de Atención', path: '/course/88/workshops' },
  { category: 'workshops', id: '90', name: 'Comunicación Disruptiva', path: '/course/90/workshops' },
  { category: 'workshops', id: '102', name: 'AI Copywriting', path: '/course/102/workshops' },

  // Series
  { category: 'series', id: '62', name: 'El Catalista', path: '/course/62/series' },
  { category: 'series', id: '63', name: 'El Viaje Exponencial', path: '/course/63/series' },

  // Podcasts
  { category: 'podcasts', id: '91', name: 'Accelerate', path: '/course/91/podcasts' },
  { category: 'podcasts', id: '95', name: 'Sobredemanda', path: '/course/95/podcasts' },
  { category: 'podcasts', id: '96', name: 'Lo Táctico', path: '/course/96/podcasts' },
  { category: 'podcasts', id: '97', name: 'La Venta Elegante', path: '/course/97/podcasts' },
  { category: 'podcasts', id: '98', name: 'Secretos del Mentalista', path: '/course/98/podcasts' },
  { category: 'podcasts', id: '99', name: 'Disparos', path: '/course/99/podcasts' },

  // Cursos
  { category: 'cursos', id: '70', name: 'Midas', path: '/course/70/cursos' },
  { category: 'cursos', id: '71', name: 'La Venta Elegante Curso', path: '/course/71/cursos' },
  { category: 'cursos', id: '72', name: 'Copywriting', path: '/course/72/cursos' },
  { category: 'cursos', id: '73', name: 'Oportunidades Rápidas', path: '/course/73/cursos' },
];

function ensureDirs() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(RAW_HTML_DIR)) fs.mkdirSync(RAW_HTML_DIR, { recursive: true });
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80);
}

/**
 * MODALIDAD B: Procesa archivos HTML locales depositados en scratch/velocity_raw_html/
 */
function processLocalHtmlFiles() {
  console.log('[MODALIDAD B] Escaneando archivos en:', RAW_HTML_DIR);
  const files = fs.readdirSync(RAW_HTML_DIR).filter((f) => /\.(html|htm|txt|mhtml)$/i.test(f));

  if (files.length === 0) {
    console.log('[MODALIDAD B] No se encontraron archivos HTML en scratch/velocity_raw_html/');
    return 0;
  }

  let convertedCount = 0;
  for (const file of files) {
    const filePath = path.join(RAW_HTML_DIR, file);
    try {
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const $ = cheerio.load(rawContent);

      // Eliminar scripts, estilos, navegación no deseada
      $('script, style, noscript, nav, footer, header, svg').remove();

      const pageTitle = $('h1').first().text().trim() || $('title').text().trim() || path.parse(file).name;
      const subtitle = $('h2, h3').first().text().trim();

      // Buscar transcripciones o contenidos
      let bodyText = '';
      const transcriptEl = $('[class*="transcript"], [id*="transcript"], article, main, .content, .description');
      if (transcriptEl.length > 0) {
        bodyText = transcriptEl.text().trim();
      } else {
        bodyText = $('body').text().trim();
      }

      // Normalizar espacios
      bodyText = bodyText.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/[ \t]+/g, ' ');

      const mdContent = `# ${pageTitle}

- **Origen:** Archivo local ${file}
- **Fecha de Procesamiento:** ${new Date().toISOString()}

---

${subtitle ? `### ${subtitle}\n\n` : ''}
${bodyText}
`;

      const outName = `velocity_raw_${sanitizeFilename(path.parse(file).name)}.md`;
      const outPath = path.join(OUTPUT_DIR, outName);
      fs.writeFileSync(outPath, mdContent, 'utf8');
      console.log(`[MODALIDAD B] ✓ Extraído: ${outName} (${bodyText.split(/\s+/).length} palabras)`);
      convertedCount++;
    } catch (err) {
      console.error(`[MODALIDAD B] Error procesando ${file}:`, err.message);
    }
  }

  return convertedCount;
}

/**
 * MODALIDAD A: Se conecta a una sesión activa de Chrome en puerto 9222
 */
async function processPuppeteerRemote() {
  console.log('[MODALIDAD A] Intentando conectar con Chrome en http://127.0.0.1:9222...');
  let browser;

  try {
    browser = await puppeteer.connect({
      browserURL: 'http://127.0.0.1:9222',
      defaultViewport: null,
    });
  } catch (err) {
    console.log('[MODALIDAD A] No se pudo conectar al puerto 9222.');
    console.log('[INFO] Para activar Chrome en modo depuración, ejecútalo con:');
    console.log('       chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\chrome-debug-profile"');
    return false;
  }

  console.log('[MODALIDAD A] ✅ Conexión establecida con Chrome abierto.');

  const pages = await browser.pages();
  let targetPage = pages.find((p) => p.url().includes('velocitymedia.info'));

  if (!targetPage) {
    console.log('[MODALIDAD A] No se encontró pestaña abierta con velocitymedia.info. Abriendo pestaña nueva...');
    targetPage = await browser.newPage();
  }

  let totalExtracted = 0;

  for (const item of CATALOG_PATHS) {
    const fullUrl = `${BASE_URL}${item.path}`;
    console.log(`\n[MODALIDAD A] ━━━ Explorando: ${item.name} (${fullUrl}) ━━━`);

    try {
      await targetPage.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise((r) => setTimeout(r, 2500)); // Tiempo de estabilización DOM

      // Extraer datos de la página principal del curso/workshop
      const pageData = await targetPage.evaluate(() => {
        const title = document.querySelector('h1')?.innerText?.trim() || document.title;
        const description =
          document.querySelector('[class*="description"], [class*="about"], article, main')?.innerText?.trim() || '';

        // Buscar enlaces a lecciones individuales
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map((a) => ({
            href: a.href,
            text: a.innerText.trim(),
          }))
          .filter(
            (l) =>
              l.href.includes('/lesson/') ||
              l.href.includes('/episode/') ||
              l.href.includes('/watch/') ||
              l.href.includes('/class/') ||
              l.href.includes('/course/')
          );

        return { title, description, links };
      });

      console.log(`[MODALIDAD A] Título detectado: "${pageData.title}" | Enlaces encontrados: ${pageData.links.length}`);

      // Guardar el resumen del curso
      const courseSummaryMd = `# ${pageData.title}

- **Categoría:** ${item.category}
- **Curso ID:** ${item.id}
- **URL Canónica:** ${fullUrl}
- **Fecha de Extracción:** ${new Date().toISOString()}

---

## Descripción del Módulo
${pageData.description || 'Contenido disponible en plataforma con sesión activa.'}

## Índice de Lecciones / Módulos
${pageData.links.map((l) => `- [${l.text || 'Lección'}](${l.href})`).join('\n') || 'Módulo de acceso directo en vista única.'}
`;

      const summaryFilename = `velocity_${item.category}_${item.id}_${sanitizeFilename(item.name)}_indice.md`;
      fs.writeFileSync(path.join(OUTPUT_DIR, summaryFilename), courseSummaryMd, 'utf8');
      totalExtracted++;

      // Extraer contenido de la lección actual si existe reproductor o transcripción
      const lessonContent = await targetPage.evaluate(() => {
        const transcriptBox = document.querySelector(
          '[class*="transcript"], [class*="subtitles"], [id*="transcript"], .content, article'
        );
        return transcriptBox ? transcriptBox.innerText.trim() : null;
      });

      if (lessonContent && lessonContent.length > 100) {
        const lessonMd = `# ${pageData.title} - Contenido y Transcripción

- **Módulo:** ${item.name}
- **URL:** ${fullUrl}
- **Fecha:** ${new Date().toISOString()}

---

${lessonContent}
`;
        const lessonFilename = `velocity_${item.category}_${item.id}_${sanitizeFilename(item.name)}_transcripcion.md`;
        fs.writeFileSync(path.join(OUTPUT_DIR, lessonFilename), lessonMd, 'utf8');
        console.log(`[MODALIDAD A] ✓ Transcripción guardada: ${lessonFilename}`);
        totalExtracted++;
      }
    } catch (navErr) {
      console.warn(`[MODALIDAD A] Advertencia en ${fullUrl}:`, navErr.message);
    }
  }

  return totalExtracted;
}

async function main() {
  ensureDirs();
  console.log('════════════════════════════════════════════════════════════════════════════');
  console.log('EXTRACTOR ASISTIDO S-CLASS · SUSCRIPCIÓN VELOCITY MEDIA');
  console.log('════════════════════════════════════════════════════════════════════════════');

  // Primero probamos Modalidad A (Puppeteer a Chrome abierto)
  const remoteResult = await processPuppeteerRemote();

  // Siempre procesamos también cualquier archivo presente en Modalidad B
  const localResult = processLocalHtmlFiles();

  console.log('\n════════════════════════════════════════════════════════════════════════════');
  console.log(`RESUMEN:`);
  console.log(`  Modalidad A (Remoto): ${remoteResult === false ? 'Inactivo (requiere Chrome debug)' : `${remoteResult} extraídos`}`);
  console.log(`  Modalidad B (Archivos locales): ${localResult} procesados`);
  console.log(`  Destino: knowledge/vault_velocity_incubadora/transcripciones/`);
  console.log('════════════════════════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
