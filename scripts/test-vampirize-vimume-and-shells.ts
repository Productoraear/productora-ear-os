/**
 * test-vampirize-vimume-and-shells.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Certificación S-Class del bloque "vampirize-vimume-hostinger-and-deploy-sclass-shells".
 *
 * Valida:
 *   1. src/data/vimume_vampirized_hostinger.json existe y es JSON válido.
 *   2. CERO texto basura (lorem ipsum / wordpress / elementor) en el payload.
 *   3. Estructura canónica: project, scientific_basis, testimonials, repertoire,
 *      b2g_framework, media_gallery, flagship Edwin Agudelo 350,00 €, split 80/10/10.
 *   4. Los 3 shells PHP existen y contienen cabecera PHP 8.3 + declare(strict_types=1).
 *   5. Los 3 .htaccess LiteSpeed existen con Brotli/Gzip + HSTS + redirección HTTPS.
 *
 * Ejecución: npx tsx scripts/test-vampirize-vimume-and-shells.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();


interface CheckResult {
  label: string;
  passed: boolean;
  detail: string;
}

const results: CheckResult[] = [];

function check(label: string, passed: boolean, detail: string): void {
  results.push({ label, passed, detail });
}

// ── 1. Payload JSON vampirizado ──────────────────────────────────────────────
const payloadPath = resolve(ROOT, 'src/data/vimume_vampirized_hostinger.json');
let payloadRaw = '';
let payload: Record<string, unknown> | null = null;

if (existsSync(payloadPath)) {
  payloadRaw = readFileSync(payloadPath, 'utf-8');
  try {
    payload = JSON.parse(payloadRaw) as Record<string, unknown>;
    check('JSON payload parseable', true, `${payloadRaw.length} bytes`);
  } catch (err) {
    check('JSON payload parseable', false, `Error de parseo: ${(err as Error).message}`);
  }
} else {
  check('JSON payload existe', false, `No encontrado: ${payloadPath}`);
}

// ── 2. Cero texto basura ─────────────────────────────────────────────────────
const SLOP_PATTERNS: RegExp[] = [
  /lorem\s+ipsum/i,
  /dolor\s+sit\s+amet/i,
  /welcome\s+to\s+wordpress/i,
  /this\s+is\s+your\s+first\s+post/i,
  /edit\s+or\s+delete\s+it/i,
  /then\s+start\s+writing/i,
  /elementor_library/i,
  /cons\s+aring\s+elit/i,
  /eimod\s+tempor/i,
  /ullaco\s+laboris/i,
];

if (payloadRaw.length > 0) {
  const slopHits = SLOP_PATTERNS.filter((re) => re.test(payloadRaw));
  check(
    'Cero texto basura (lorem/wordpress/elementor)',
    slopHits.length === 0,
    slopHits.length === 0 ? '0 coincidencias' : `Coincidencias: ${slopHits.map((r) => r.source).join(', ')}`,
  );
}

// ── 3. Estructura canónica ───────────────────────────────────────────────────
if (payload) {
  const requiredKeys = ['project', 'scientific_basis', 'testimonials', 'repertoire', 'b2g_framework', 'media_gallery'];
  const missing = requiredKeys.filter((k) => !(k in payload));
  check('Estructura canónica completa', missing.length === 0, missing.length === 0 ? requiredKeys.join(', ') : `Faltan: ${missing.join(', ')}`);

  const testimonials = Array.isArray(payload.testimonials) ? payload.testimonials : [];
  check('Testimonios extraídos', testimonials.length > 0, `${testimonials.length} testimonios`);

  const repertoire = Array.isArray(payload.repertoire) ? payload.repertoire : [];
  check('Repertorio extraído', repertoire.length > 0, `${repertoire.length} piezas`);

  const b2g = payload.b2g_framework as Record<string, unknown> | undefined;
  const b2gOk = !!b2g && b2g.ceiling === 15000 && b2g.preventiveCeiling === 14250 && b2g.splLimit === 75;
  check('B2G Art. 118 LCSP (14.250 € / 75 dB)', b2gOk, b2gOk ? 'ceiling 15000 · preventive 14250 · spl 75' : 'Parámetros B2G incorrectos');

  const flagship = payload.flagship_artist as Record<string, unknown> | undefined;
  const flagshipOk = !!flagship && flagship.name === 'Edwin Agudelo' && flagship.basePrice === 350;
  check('Flagship Edwin Agudelo 350,00 €', flagshipOk, flagshipOk ? 'Edwin Agudelo · 350 €' : 'Flagship incorrecto');

  const split = payload.sovereign_split as Record<string, unknown> | undefined;
  const splitOk = !!split && split.artist === 80 && split.earOs === 10 && split.vimume === 10;
  check('Split Soberano 80/10/10', splitOk, splitOk ? '80/10/10' : 'Split incorrecto');

}

// ── 4. Shells PHP 8.3 ────────────────────────────────────────────────────────
const shells = [
  'deploy/hostinger_edge/viajemusicalporlamemoria/index.php',
  'deploy/hostinger_edge/fincasparaboda/index.php',
  'deploy/hostinger_edge/artistaseuropa/index.php',
];

for (const rel of shells) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    check(`Shell PHP existe: ${rel}`, false, 'No encontrado');
    continue;
  }
  const src = readFileSync(abs, 'utf-8');
  const hasPhpOpen = src.trimStart().startsWith('<?php');
  const hasStrict = src.includes('declare(strict_types=1)');
  const hasOled = src.includes('#030305');
  const hasClose = src.includes('</html>');
  const ok = hasPhpOpen && hasStrict && hasOled && hasClose;
  check(
    `Shell PHP 8.3 válido: ${rel}`,
    ok,
    ok ? '<?php + strict_types + OLED + </html>' : `php:${hasPhpOpen} strict:${hasStrict} oled:${hasOled} close:${hasClose}`,
  );
}

// ── 5. .htaccess LiteSpeed ───────────────────────────────────────────────────
const htaccessFiles = [
  'deploy/hostinger_edge/viajemusicalporlamemoria/.htaccess',
  'deploy/hostinger_edge/fincasparaboda/.htaccess',
  'deploy/hostinger_edge/artistaseuropa/.htaccess',
];

for (const rel of htaccessFiles) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    check(`.htaccess existe: ${rel}`, false, 'No encontrado');
    continue;
  }
  const src = readFileSync(abs, 'utf-8');
  const hasBrotli = src.includes('BROTLI_COMPRESS');
  const hasGzip = src.includes('DEFLATE');
  const hasHsts = src.includes('Strict-Transport-Security');
  const hasHttpsRedirect = src.includes('RewriteCond %{HTTPS} !=on');
  const ok = hasBrotli && hasGzip && hasHsts && hasHttpsRedirect;
  check(
    `.htaccess LiteSpeed S-Class: ${rel}`,
    ok,
    ok ? 'Brotli + Gzip + HSTS + HTTPS' : `brotli:${hasBrotli} gzip:${hasGzip} hsts:${hasHsts} redirect:${hasHttpsRedirect}`,
  );
}

// ── Reporte final ────────────────────────────────────────────────────────────
const passed = results.filter((r) => r.passed).length;
const failed = results.length - passed;

console.log('\n══════════════════════════════════════════════════════════════════');
console.log('  CERTIFICACIÓN S-CLASS · VIMUME HOSTINGER EDGE SHELLS');
console.log('══════════════════════════════════════════════════════════════════\n');

for (const r of results) {
  const icon = r.passed ? '✓' : '✗';
  console.log(`  ${icon} ${r.label}`);
  console.log(`      ${r.detail}`);
}

console.log('\n──────────────────────────────────────────────────────────────────');
console.log(`  RESULTADO: ${passed}/${results.length} checks OK · ${failed} fallos`);
console.log('──────────────────────────────────────────────────────────────────\n');

if (failed > 0) {
  console.error(`✗ CERTIFICACIÓN FALLIDA: ${failed} check(s) no superados.`);
  process.exit(1);
}

console.log('✓ CERTIFICACIÓN SUPERADA · Exit Code 0');
process.exit(0);
