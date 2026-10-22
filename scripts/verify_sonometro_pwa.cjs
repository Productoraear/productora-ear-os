'use strict';

// Verificador del Sonómetro de Conciencia PWA (W27_T02).
// Valida sustancia real (no fachada): Web Audio API, Ley 37/2003, 4 contextos
// acústicos canónicos, telemetría, impresión y cero `any`/Math.random.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMPONENT = path.join(ROOT, 'src', 'components', 'tools', 'AcousticConscienceMeter.tsx');
const PAGE = path.join(ROOT, 'src', 'app', '(public)', 'sonometro', 'page.tsx');

let passed = 0;
let failed = 0;

function check(condition, label) {
  if (condition) {
    passed += 1;
    console.log('PASS  ' + label);
  } else {
    failed += 1;
    console.error('FAIL  ' + label);
  }
}

function readIfExists(filePath) {
  const rel = path.relative(ROOT, filePath);
  if (!fs.existsSync(filePath)) {
    check(false, 'existe ' + rel);
    return '';
  }
  check(true, 'existe ' + rel);
  return fs.readFileSync(filePath, 'utf8');
}

const component = readIfExists(COMPONENT);
const page = readIfExists(PAGE);

if (component) {
  check(
    component.includes('AudioContext') || component.includes('webkitAudioContext'),
    'componente declara AudioContext / webkitAudioContext',
  );
  check(component.includes('Ley 37/2003'), 'componente referencia Ley 37/2003');
  check(component.includes('autorregulación'), 'componente menciona autorregulación');
  check(component.includes('getUserMedia'), 'componente usa navigator.mediaDevices.getUserMedia');
  check(
    component.includes('createAnalyser') || component.includes('AnalyserNode'),
    'componente usa AnalyserNode / createAnalyser',
  );
  check(component.includes('requestAnimationFrame'), 'componente usa requestAnimationFrame');
  check(component.includes('Cóctel Lírico'), 'contexto Cóctel Lírico / Solista presente');
  check(component.includes('Bodas & Fincas'), 'contexto Bodas & Fincas presente');
  check(component.includes('Festejos Populares'), 'contexto Festejos Populares / Plazas presente');
  check(component.includes('Senior VIMUME'), 'contexto Senior VIMUME presente');
  check(component.includes('70 - 80'), 'rango 70 - 80 dBA presente');
  check(component.includes('85 - 90'), 'rango 85 - 90 dBA presente');
  check(component.includes('90 - 102'), 'rango 90 - 102 dBA presente');
  check(component.includes('65 - 75'), 'rango 65 - 75 dBA presente');
  check(component.includes('window.print()'), 'botón de impresión window.print() presente');
  check(
    component.includes('No constituye medición oficial homologada'),
    'descargo pedagógico completo presente',
  );
  check(!component.includes(': any'), 'cero `: any` en el componente');
  check(!component.includes(' as any'), 'cero `as any` en el componente');
  check(!component.includes('Math.random'), 'cero Math.random simulado (audio real)');
  check(component.includes('export default'), 'componente exporta por defecto');
}

if (page) {
  check(page.includes('Sonómetro de Conciencia PWA'), 'metadata title canónico presente');
  check(page.includes('export const metadata'), 'export const metadata SEO presente');
  check(page.includes('SoftwareApplication'), 'schema.org SoftwareApplication presente');
  check(page.includes('AcousticRegulation'), 'schema.org AcousticRegulation presente');
  check(page.includes('AcousticConscienceMeter'), 'página renderiza AcousticConscienceMeter');
  check(page.includes('Ley 37/2003'), 'página referencia Ley 37/2003');
}

console.log(JSON.stringify({ passed, failed }));

if (failed > 0) {
  process.exit(1);
}
