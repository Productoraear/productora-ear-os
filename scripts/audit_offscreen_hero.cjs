#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DEL CONTRATO OFFSCREENCANVAS (FASE 1 · hero 3D sin bloqueo de hilo)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: prometer «el 3D ya no bloquea el hilo principal» es fácil de
 * escribir y difícil de comprobar. Este auditor convierte la promesa en un
 * contrato verificable en disco, sin abrir un navegador:
 *
 *   C1. El componente monta el worker con la forma ESTÁTICA que el bundler
 *       reconoce: `new Worker(new URL('...worker.ts', import.meta.url))`. Con un
 *       `import()` dinámico de la clase, el módulo se evaluaría en el hilo
 *       principal y el offload sería cosmético (fachada).
 *   C2. El canvas se transfiere: `transferControlToOffscreen()` y se postea el
 *       `OffscreenCanvas` en la lista de transferibles (`[offscreen]`).
 *   C3. El hilo principal NO crea contexto WebGL ni instancia `WebGLRenderer`.
 *   C4. El worker crea el renderer sobre el OffscreenCanvas recibido.
 *   C5. La pausa viaja como mensaje (`animate`), no como reconstrucción.
 *   C6. Geometría fija del contenedor: alto declarado + `contain` (INV-18).
 *
 * Falsado: si alguien vuelve a importar `three` en el componente, C3 falla.
 *
 * Salida: OFFSCREEN_CHECKS=n · OFFSCREEN_FAILED=m · OFFSCREEN_VERDICT=PASS|FAIL
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENT = 'src/components/sclass/PrismaDiamondHero3D.tsx';
const WORKER = 'src/components/sclass/prismaDiamondScene.worker.ts';

const results = [];
let failed = 0;

function check(id, ok, detail) {
  results.push({ id, ok, detail });
  if (!ok) failed += 1;
}

const componentPath = path.join(ROOT, COMPONENT);
const workerPath = path.join(ROOT, WORKER);

check('C1:componente-existe', fs.existsSync(componentPath), COMPONENT);
check('C1:worker-existe', fs.existsSync(workerPath), WORKER);

if (fs.existsSync(componentPath) && fs.existsSync(workerPath)) {
  const component = fs.readFileSync(componentPath, 'utf8');
  const worker = fs.readFileSync(workerPath, 'utf8');

  // C1 · worker estático reconocible por el bundler.
  const staticWorker = /new\s+Worker\(\s*new\s+URL\(\s*['"][^'"]*\.worker\.ts['"]\s*,\s*import\.meta\.url\s*\)/.test(component);
  check('C1:new-worker-new-url-estatico', staticWorker, staticWorker ? 'forma estática presente' : 'sin new Worker(new URL(...))');
  check(
    'C1:sin-import-dinamico-de-clase',
    !/import\(\s*['"][^'"]*\.worker['"]\s*\)/.test(component),
    'sin import() dinámico de la clase Worker',
  );

  // C2 · transferencia del canvas.
  check(
    'C2:transferControlToOffscreen',
    /transferControlToOffscreen\(\)/.test(component),
    'el canvas se convierte en OffscreenCanvas',
  );
  check(
    'C2:transferibles-en-postMessage',
    /postMessage\([\s\S]{0,400}\[\s*offscreen\s*\]/.test(component),
    'el OffscreenCanvas viaja en la lista de transferibles',
  );

  // C3 · cero WebGL en el hilo principal.
  const componentImportsThree = /from\s+['"]three['"]/.test(component) || /import\(\s*['"]three['"]\s*\)/.test(component);
  check('C3:sin-three-en-componente', !componentImportsThree, 'el componente no importa three');
  check(
    'C3:sin-webglrenderer-en-componente',
    !/new\s+THREE\.WebGLRenderer|new\s+WebGLRenderer/.test(component),
    'ningún renderer WebGL se instancia en el hilo principal',
  );

  // C4 · el worker construye la escena sobre el OffscreenCanvas.
  check(
    'C4:renderer-sobre-offscreen',
    /new\s+THREE\.WebGLRenderer\([\s\S]{0,200}canvas:\s*message\.canvas/.test(worker),
    'el renderer del worker usa el canvas transferido',
  );

  // C5 · pausa como mensaje.
  check(
    'C5:pausa-por-mensaje',
    /type:\s*'animate'/.test(component) && /case\s*'animate'/.test(worker),
    'componente y worker hablan el mensaje `animate`',
  );

  // C6 · geometría fija.
  check(
    'C6:geometria-fija',
    /HERO_GEOMETRY_CLASS/.test(component) && /h-\[clamp\(/.test(component) && /contain:/.test(component),
    'alto declarado + contain: layout paint style',
  );

  // El worker debe declararse como módulo (frontera limpia, sin globals).
  check('C6:worker-sin-window', !/\bwindow\./.test(worker), 'el worker no toca `window`');
}

const verdict = failed === 0 ? 'PASS' : 'FAIL';
for (const row of results) {
  console.log(`  ${row.ok ? 'PASS' : 'FAIL'} · ${row.id} — ${row.detail}`);
}
console.log(`OFFSCREEN_CHECKS=${results.length} · OFFSCREEN_FAILED=${failed} · OFFSCREEN_VERDICT=${verdict}`);
process.exit(verdict === 'PASS' ? 0 : 1);
