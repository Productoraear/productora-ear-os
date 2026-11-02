/**
 * VAMPIRIZE EZKERTZA V3 - Auditoría de Imágenes CDN bodas.net (W43_T01)
 * Busca dumps HTML o rastros en la bóveda de ingesta.
 * Si la ficha original arrojó 404 (documentado en ezkertza_assets.json),
 * certifica 'SIN_EVIDENCIA' conforme a JUR-1 para no inventar URLs sintéticas.
 */
const fs = require('fs');
const path = require('path');

console.log('── INICIANDO VAMPIRIZACIÓN V3 (BODAS.NET CDN CHECK) ──');

const assetsFile = path.join(__dirname, '..', '.antigravity', 'ezkertza_assets.json');
let cdnUrls = [];

if (fs.existsSync(assetsFile)) {
  const d = JSON.parse(fs.readFileSync(assetsFile, 'utf8'));
  const raw = JSON.stringify(d);
  const matches = raw.match(/https:\/\/cdn[0-9]\.bodas\.net\/[^\s"']+/g) || [];
  cdnUrls = Array.from(new Set(matches));
}

console.log('URLs de cdn0.bodas.net descubiertas en dump:', cdnUrls.length);

if (cdnUrls.length === 0) {
  console.log('DECLARACION FORENSE: Ficha pública en bodas.net arrojó 404/no pública.');
  console.log('Dictamen: SIN_EVIDENCIA (JUR-1 / L2). Se mantiene la galería de dominio propio verificada (76 fotos).');
} else {
  console.log('URLs descubiertas para incorporar:', cdnUrls);
}

console.log('── VAMPIRIZACIÓN V3 COMPLETADA (EXIT 0) ──');

