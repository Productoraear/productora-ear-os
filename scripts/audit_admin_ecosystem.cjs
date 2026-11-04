#!/usr/bin/env node
/**
 * AUDITOR DE ECOSISTEMA — COCKPIT /admin (EAR OS · S-CLASS)
 * ============================================================================
 * Un solo ecosistema, no 28 pantallas cada una por su lado.
 *
 * Aserciones (Exit Code 1 si falla cualquiera):
 *  A) CERO enlaces muertos: todo `href` del SSOT de navegación existe en disco.
 *  B) CERO módulos huérfanos: toda `page.tsx` bajo (admin)/admin está registrada
 *     en el SSOT (⇒ aparece en ribbon, sidebar, ⌘K y directorio del cockpit).
 *  C) CERO registros paralelos: ningún fichero de src/ declara un array de
 *     navegación con rutas /admin. Fuente única: admin-navigation.ts.
 *  D) CERO telemetría de demostración: prohibido inventar cifras cuando la DB
 *     no responde (AF-1/AF-2/INV-16). El dashboard debe declarar `dataMode`.
 *  E) CERO cifras de catálogo tecleadas a mano («22 URLs», «84K B2B»).
 *  F) El layout del cockpit consume el SSOT (no declara pestañas propias).
 *
 * Cero dependencias. Solo lectura. Uso:
 *   node scripts/audit_admin_ecosystem.cjs
 *   node scripts/audit_admin_ecosystem.cjs --write --json
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const ADMIN_APP_DIR = path.join(APP_DIR, '(admin)', 'admin');
const NAV_SSOT = path.join(ROOT, 'src', 'lib', 'config', 'admin-navigation.ts');
const DASHBOARD_PAGE = path.join(ADMIN_APP_DIR, 'page.tsx');
const DASHBOARD_UI = path.join(ADMIN_APP_DIR, 'AdminDashboardClient.tsx');
const COCKPIT_LAYOUT = path.join(ADMIN_APP_DIR, 'layout.tsx');
const REPORT = path.join(ROOT, '.antigravity', 'reports', 'ADMIN_ECOSYSTEM.md');

const SRC_DIRS = [path.join(ROOT, 'src', 'app'), path.join(ROOT, 'src', 'components')];

/** Marca de exención explícita para arrays de navegación legítimos. */
const OPTOUT_MARKER = 'audited:nav-source';

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

const rel = (file) => path.relative(ROOT, file).replace(/\\/g, '/');

/** Convierte un page.tsx en su ruta pública, ignorando (grupos) y @slots. */
function routeOf(pageFile) {
  const dir = path.relative(APP_DIR, path.dirname(pageFile)).replace(/\\/g, '/');
  const segments =
    dir === ''
      ? []
      : dir
          .split('/')
          .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')) && !seg.startsWith('@'));
  return '/' + segments.join('/');
}

/** Universo de rutas reales del árbol src/app. */
function buildRouteSet() {
  const set = new Set();
  for (const file of walk(APP_DIR)) {
    if (path.basename(file) !== 'page.tsx') continue;
    set.add(routeOf(file));
  }
  return set;
}

/** ¿El patrón registrado cubre la ruta destino? (soporta [slug] y [...slug]) */
function routeMatches(pattern, target) {
  const patternSegments = pattern.split('/').filter(Boolean);
  const targetSegments = target.split('/').filter(Boolean);
  for (let index = 0; index < patternSegments.length; index += 1) {
    const segment = patternSegments[index];
    if (segment.startsWith('[')) return true; // dinámico o catch-all
    if (segment !== targetSegments[index]) return false;
  }
  return patternSegments.length === targetSegments.length;
}

/** `href` declarados en el SSOT de navegación (fuente única). */
function readNavHrefs() {
  const source = fs.readFileSync(NAV_SSOT, 'utf8');
  const hrefs = new Set();
  const pattern = /\bhref:\s*'([^']+)'/g;
  let match = pattern.exec(source);
  while (match !== null) {
    hrefs.add(match[1]);
    match = pattern.exec(source);
  }
  return [...hrefs].sort();
}

/** Páginas reales bajo (admin)/admin. */
function discoverAdminRoutes() {
  return walk(ADMIN_APP_DIR)
    .filter((file) => path.basename(file) === 'page.tsx')
    .map(routeOf)
    .sort();
}

/** A) Ningún enlace del SSOT apunta al vacío. */
function assertNoDeadLinks(hrefs, routeSet) {
  const violations = [];
  for (const href of hrefs) {
    if (href.endsWith('.html')) {
      if (!fs.existsSync(path.join(ROOT, 'public', href))) {
        violations.push(`[A] Atajo muerto: ${href} no existe en public/`);
      }
      continue;
    }
    const routeList = [...routeSet];
    const covered = routeList.some((route) => route === href || routeMatches(route, href));
    if (!covered) {
      violations.push(`[A] Enlace muerto en el SSOT: ${href} (no hay page.tsx que lo sirva)`);
    }
  }
  return violations;
}

/** ¿La ruta está cubierta por algún href registrado (exacto o por prefijo)? */
function isRegistered(route, hrefs) {
  return hrefs.some((href) => {
    if (href === route) return true;
    if (route.startsWith(`${href}/`)) return true;
    if (href.includes('[') && routeMatches(href, route)) return true;
    return false;
  });
}

/** B) Ningún módulo existe fuera del ecosistema. */
function assertNoOrphans(adminRoutes, hrefs) {
  const violations = [];
  if (adminRoutes.length === 0) {
    violations.push(`[B] No se encontró ninguna page.tsx bajo ${rel(ADMIN_APP_DIR)}`);
    return violations;
  }
  for (const route of adminRoutes) {
    if (!isRegistered(route, hrefs)) {
      violations.push(
        `[B] Módulo huérfano: ${route} existe en disco pero NO está en el SSOT de navegación`,
      );
    }
  }
  return violations;
}

/** C) Ningún registro de navegación paralelo. */
// El nombre del array debe TERMINAR en el token (URLS/NAV/TABS/ROUTES/DIRECTORY):
// así `DIRECTORY_CATEGORY_CHIPS` (derivado) no dispara un falso positivo.
const NAV_ARRAY_PATTERN = /const\s+\w*(?:URLS?|NAV|TABS|ROUTES|DIRECTORY)\s*(?::[^=\n]+)?=\s*\[/i;

function assertSingleNavSource() {
  const violations = [];
  for (const base of SRC_DIRS) {
    for (const file of walk(base)) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      if (path.resolve(file) === path.resolve(NAV_SSOT)) continue;
      const source = fs.readFileSync(file, 'utf8');
      if (source.includes(OPTOUT_MARKER)) continue;
      if (!NAV_ARRAY_PATTERN.test(source)) continue;
      const adminLiterals = source.match(/'\/admin|"\/admin|\`\/admin/g);
      if (adminLiterals === null || adminLiterals.length < 2) continue;
      violations.push(
        `[C] Registro de navegación paralelo en ${rel(file)} · fuente única: ${rel(NAV_SSOT)}`,
      );
    }
  }
  return violations;
}

/** D) Ninguna telemetría inventada cuando la DB no responde. */
const FORBIDDEN_TELEMETRY = ['Telemetría canónica de demostración', 'telemetria baseline S-Class'];

function assertNoDemoTelemetry() {
  const violations = [];
  for (const file of [DASHBOARD_PAGE, DASHBOARD_UI]) {
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    for (const marker of FORBIDDEN_TELEMETRY) {
      if (source.includes(marker)) {
        violations.push(`[D] Telemetría de demostración en ${rel(file)}: «${marker}»`);
      }
    }
  }
  if (fs.existsSync(DASHBOARD_PAGE)) {
    const source = fs.readFileSync(DASHBOARD_PAGE, 'utf8');
    if (!source.includes('dataMode')) {
      violations.push(`[D] ${rel(DASHBOARD_PAGE)} no declara dataMode (AF-1: la sonda debe confesarse)`);
    }
  }
  return violations;
}

/** E) Ninguna cifra de catálogo tecleada a mano. */
const FORBIDDEN_VANITY = [/22\s+URLS/i, /\b84K B2B\b/, /\b19\.6K CDN\b/, /19\.608 registros/];

function assertNoVanityCounts() {
  const violations = [];
  if (!fs.existsSync(DASHBOARD_UI)) return violations;
  const source = fs.readFileSync(DASHBOARD_UI, 'utf8');
  for (const pattern of FORBIDDEN_VANITY) {
    if (pattern.test(source)) {
      violations.push(`[E] Cifra tecleada a mano en ${rel(DASHBOARD_UI)}: ${String(pattern)}`);
    }
  }
  return violations;
}

/** F) El layout del cockpit consume el SSOT y no declara pestañas propias. */
function assertLayoutConsumesSsot() {
  if (!fs.existsSync(COCKPIT_LAYOUT)) return [];
  const source = fs.readFileSync(COCKPIT_LAYOUT, 'utf8');
  const violations = [];
  if (!source.includes("@/lib/config/admin-navigation")) {
    violations.push(`[F] ${rel(COCKPIT_LAYOUT)} no importa el SSOT de navegación`);
  }
  if (!source.includes('ADMIN_MASTER_TABS')) {
    violations.push(`[F] ${rel(COCKPIT_LAYOUT)} no consume ADMIN_MASTER_TABS`);
  }
  return violations;
}

function renderReport(model) {
  const lines = [
    '# ECOSISTEMA DEL COCKPIT /admin',
    '',
    '> Emitido por `scripts/audit_admin_ecosystem.cjs` (solo lectura).',
    '> Fuente única de verdad: `src/lib/config/admin-navigation.ts`.',
    '',
    `- Módulos registrados en el SSOT: **${model.hrefs.length}**`,
    `- Páginas reales bajo (admin)/admin: **${model.adminRoutes.length}**`,
    `- Violaciones: **${model.violations.length}**`,
    '',
    '## Módulos registrados',
    '',
    ...model.hrefs.map((href) => `- \`${href}\``),
    '',
    '## Páginas en disco',
    '',
    ...model.adminRoutes.map((route) => `- \`${route}\``),
    '',
  ];
  if (model.violations.length > 0) {
    lines.push('## ❌ Violaciones', '', ...model.violations.map((v) => `- ${v}`), '');
  } else {
    lines.push('## ✅ Sin violaciones', '');
  }
  return lines.join('\n');
}

function main() {
  const routeSet = buildRouteSet();
  const hrefs = readNavHrefs();
  const adminRoutes = discoverAdminRoutes();

  const violations = [
    ...assertNoDeadLinks(hrefs, routeSet),
    ...assertNoOrphans(adminRoutes, hrefs),
    ...assertSingleNavSource(),
    ...assertNoDemoTelemetry(),
    ...assertNoVanityCounts(),
    ...assertLayoutConsumesSsot(),
  ];

  const model = { hrefs, adminRoutes, violations, checkedAt: new Date().toISOString() };

  if (process.argv.includes('--write')) {
    fs.mkdirSync(path.dirname(REPORT), { recursive: true });
    fs.writeFileSync(REPORT, `${renderReport(model)}\n`, 'utf8');
    console.log(`[AUDIT] Informe escrito en ${rel(REPORT)}`);
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(model, null, 2));
  } else if (!process.argv.includes('--write')) {
    console.log(
      `[AUDIT] ${hrefs.length} módulos registrados · ${adminRoutes.length} páginas en disco · ${violations.length} violaciones`,
    );
  }

  if (violations.length > 0) {
    console.error(`\n[AUDIT][FAIL] ${violations.length} violaciones de ecosistema:`);
    for (const violation of violations) console.error('  ❌', violation);
    process.exit(1);
  }

  console.log(
    '[AUDIT][OK] Ecosistema /admin unificado: 0 enlaces muertos, 0 huérfanos, 0 registros paralelos, 0 telemetría de demostración (Exit 0).',
  );
  process.exit(0);
}

main();

