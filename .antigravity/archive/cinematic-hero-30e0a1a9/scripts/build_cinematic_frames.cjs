#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/BUILD_CINEMATIC_FRAMES.CJS — PIPELINE DE FOTOGRAMAS CINEMATOGRÁFICOS
 * ════════════════════════════════════════════════════════════════════════════
 * Convierte los plates fotográficos REALES del catálogo de marca (JPG) en
 * fotogramas WebP ultra-optimizados que consume:
 *   · el motor Canvas 2D del Hero cinemático (escritorio), y
 *   · la degradación por keyframes (móvil / prefers-reduced-motion).
 *
 * Anti-fachada (AF-1 / AF-2):
 *   · Aborta con Exit Code 1 si un plate de origen no existe en disco.
 *   · Emite por cada fotograma: origen, bytes de entrada/salida, ratio de
 *     compresión y sha256 del archivo resultante (prueba replicable).
 *   · No inventa assets ni rutas: todo lo que escribe nace de un JPG verificado.
 *
 * USO:
 *   node scripts/build_cinematic_frames.cjs
 *   node scripts/build_cinematic_frames.cjs --check   (sólo compara tamaños)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'images', 'cinematic');
const BANANA = path.join(ROOT, 'public', 'images', 'banana');

/** Ancho de salida: 1600 px cubre un viewport 1440/1920 con margen de cámara. */
const TARGET_WIDTH = 1600;
const WEBP_QUALITY = 74;

/**
 * Plates canónicos → fotogramas. `sala` se reutiliza en el Acto III (macro de
 * cristal) para no duplicar peso de red: el motor aplica blur de refracción
 * sobre el mismo fotograma en lugar de descargar un cuarto asset.
 */
const FRAMES = Object.freeze([
  { id: 'acto-01-brasa', source: 'catering_minimal.jpg', note: 'Parrilla de brasa de encina + humo volumétrico' },
  { id: 'acto-01-sala', source: 'finca_luxury_gala.jpg', note: 'Comedor acristalado de gala al anochecer' },
  { id: 'acto-02-escena', source: 'bose_sound_gala.jpg', note: 'Cono acústico + mástil + haz dorado en escenario' },
  { id: 'acto-02-directo', source: 'mariachi_gala_sunset.jpg', note: 'Directo en arcos con bokeh cálido' },
  { id: 'acto-04-plaza', source: 'finca_minimalist.jpg', note: 'Claustro/plaza institucional con luz cenital' },
]);

const checkOnly = process.argv.includes('--check');

function sha256(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('[CINEMATIC] FATAL: sharp no está disponible en node_modules.');
    process.exit(1);
  }

  if (!checkOnly) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  let failures = 0;

  for (const frame of FRAMES) {
    const sourcePath = path.join(BANANA, frame.source);
    const outPath = path.join(OUT_DIR, `${frame.id}.webp`);

    if (!fs.existsSync(sourcePath)) {
      console.error(`[CINEMATIC] ❌ NO_EXISTE plate origen: ${path.relative(ROOT, sourcePath)}`);
      failures += 1;
      continue;
    }

    const sourceBytes = fs.statSync(sourcePath).size;

    if (checkOnly) {
      const exists = fs.existsSync(outPath);
      console.log(
        `[CINEMATIC] ${exists ? 'OK' : 'FALTA'} ${frame.id}.webp · plate=${sourceBytes}B`
      );
      if (!exists) failures += 1;
      continue;
    }

    const buffer = await sharp(sourcePath)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer();

    fs.writeFileSync(outPath, buffer);

    const meta = await sharp(outPath).metadata();
    const ratio = ((buffer.length / sourceBytes) * 100).toFixed(1);

    console.log(
      `[CINEMATIC] OK ${frame.id}.webp · ${meta.width}x${meta.height} · ` +
        `${sourceBytes}B → ${buffer.length}B (${ratio}%) · sha256=${sha256(outPath).slice(0, 16)}`
    );
    console.log(`[CINEMATIC]    ${frame.note}`);
  }

  if (failures > 0) {
    console.error(`[CINEMATIC] VERDICT=FAIL fallos=${failures}`);
    process.exit(1);
  }

  console.log(`[CINEMATIC] VERDICT=PASS frames=${FRAMES.length}`);
}

main().catch((error) => {
  console.error('[CINEMATIC] FATAL', error);
  process.exit(1);
});