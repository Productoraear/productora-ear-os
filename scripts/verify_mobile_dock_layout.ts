/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR EJECUTABLE — DOCK MÓVIL (VIEWPORT 390 px) Y ESTRATIFICACIÓN Z-INDEX
 * ════════════════════════════════════════════════════════════════════════════
 * Prueba mecánicamente, sobre el código fuente en disco (sin navegador):
 *   1. El cajón de compra reserva el espacio inferior del dock + safe-area
 *      (`pb-[calc(5.5rem+env(safe-area-inset-bottom))]`).
 *   2. El cajón se estratifica POR ENCIMA del dock (z mayor) para no robar el
 *      clic al botón primario «Proceder al Pago».
 *   3. Cero `w-screen` en el cajón (evita el desborde horizontal de 40 px).
 *   4. El dock móvil ancla su offset al token único `--ear-dock-h` y respeta
 *      la safe-area; se oculta en rutas privadas.
 *   5. `globals.css` declara el token y reserva su altura en el `body` móvil.
 *
 * Exit Code 0 = todas las aserciones pasan. Exit Code 1 = alguna falla.
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_mobile_dock_layout.ts
 * ════════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir: string = path.dirname(fileURLToPath(import.meta.url));
const repoRoot: string = path.resolve(scriptDir, '..');
const read = (rel: string): string => readFileSync(path.join(repoRoot, rel), 'utf8');

let passed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail?: string): void {
  if (ok) {
    passed += 1;
    console.log(`  PASS · ${name}`);
  } else {
    failures.push(name);
    console.log(`  FAIL · ${name}${detail !== undefined ? ` — ${detail}` : ''}`);
  }
}

const DOCK_Z = 80;
const SAFE_AREA_PB = 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]';

/** Elimina los comentarios JSX (`{/* … *\/}`) para auditar sólo el marcado real. */
const stripJsxComments = (src: string): string => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

/* ── BLOQUE 1 · Cajón de compra (SovereignCartDrawer) ────────────────────── */

console.log('── BLOQUE 1 · Cajón de compra móvil ──');

const cart = read('src/components/checkout/SovereignCartDrawer.tsx');
check('reserva el espacio inferior del dock + safe-area', cart.includes(SAFE_AREA_PB), `falta ${SAFE_AREA_PB}`);
check('cero w-screen en el marcado (sin desborde a 390 px)', !stripJsxComments(cart).includes('w-screen'));

const cartZMatch = cart.match(/fixed inset-0 z-\[(\d+)\]/);
const cartZ = cartZMatch ? Number(cartZMatch[1]) : NaN;
check(
  'se estratifica POR ENCIMA del dock móvil',
  Number.isFinite(cartZ) && cartZ > DOCK_Z,
  `z del cajón=${cartZ} vs dock z=${DOCK_Z}`,
);

/* ── BLOQUE 2 · Dock móvil (SovereignMobileHUD) ──────────────────────────── */

console.log('── BLOQUE 2 · Dock móvil unificado ──');

const hud = read('src/components/sclass/SovereignMobileHUD.tsx');
check('el panel se ancla al token único --ear-dock-h', hud.includes('var(--ear-dock-h)'));
check('el dock se declara en z-[80]', hud.includes('z-[80]'));
check('el dock respeta la safe-area inferior', hud.includes('env(safe-area-inset-bottom)'));
check('el dock sólo aparece en móvil (lg:hidden)', hud.includes('lg:hidden'));
check('el dock se oculta en rutas privadas', hud.includes("pathname.startsWith('/admin')"));

/* ── BLOQUE 3 · Token canónico de reserva (globals.css) ──────────────────── */

console.log('── BLOQUE 3 · Token de reserva inferior (globals.css) ──');

const css = read('src/app/globals.css');
check(
  'declara --ear-dock-h = 5.5rem + safe-area',
  css.includes('--ear-dock-h: calc(5.5rem + env(safe-area-inset-bottom))'),
);
check(
  'reserva la altura del dock en el body móvil',
  /@media\s*\(max-width:\s*1023px\)[\s\S]{0,160}padding-bottom:\s*var\(--ear-dock-h\)/.test(css),
);

/* ── RESULTADO ───────────────────────────────────────────────────────────── */

console.log('\n────────────────────────────────────────────────────────────');
if (failures.length === 0) {
  console.log(`RESULTADO: ${passed}/${passed} ASERCIONES PASS · EXIT CODE 0`);
  process.exit(0);
} else {
  console.log(`RESULTADO: ${passed} PASS · ${failures.length} FAIL`);
  for (const f of failures) console.log(`  · ${f}`);
  process.exit(1);
}
