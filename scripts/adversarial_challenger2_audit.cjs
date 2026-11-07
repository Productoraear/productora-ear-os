/**
 * Challenger 2: Adversarial Audit Harness
 * Verifies Catalog, Dead Clicks, # hrefs, Centralita links, S-Class evaluator, and E2E status.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const catalogPath = path.join(ROOT, '.agents/teamwork/explorer_survey_2/routes_catalog.json');

console.log('=== CHALLENGER 2: ADVERSARIAL AUDIT HARNESS ===\n');

// -------------------------------------------------------------
// 1. Catalog & URL verification
// -------------------------------------------------------------
console.log('--- 1. CATALOG & URL VERIFICATION ---');

if (!fs.existsSync(catalogPath)) {
  console.error('FAIL: Catalog file does not exist at ' + catalogPath);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const routes = catalog.routes || [];

console.log(`Reported totals: totalRoutes=${catalog.totalRoutes}, totalPages=${catalog.totalPages}, totalApis=${catalog.totalApis}, totalDynamic=${catalog.totalDynamic}`);
console.log(`Actual array length: ${routes.length}`);

// A. Check total count is 496
const countMatches496 = routes.length === 496;
console.log(`[CHECK] Exactly 496 routes: ${countMatches496 ? 'PASS' : 'FAIL'} (${routes.length})`);

// B. Check all start with /
const invalidStarts = routes.filter(r => !(r.route || '').startsWith('/'));
console.log(`[CHECK] All routes start with "/": ${invalidStarts.length === 0 ? 'PASS' : 'FAIL'} (invalid: ${invalidStarts.length})`);

// C. Check zero duplicate routes
const seen = new Map();
const duplicates = [];
for (const r of routes) {
  const url = r.route;
  if (seen.has(url)) {
    duplicates.push({ url, orig: seen.get(url), dup: r });
  } else {
    seen.set(url, r);
  }
}
console.log(`[CHECK] Zero duplicate routes: ${duplicates.length === 0 ? 'PASS' : 'FAIL'} (duplicates: ${duplicates.length})`);

// D. Breakdown: 301 pages, 195 APIs, 49 dynamic
const pages = routes.filter(r => r.type === 'PAGE');
const apis = routes.filter(r => r.type === 'API');
const dynamic = routes.filter(r => r.isDynamic);
console.log(`[CHECK] 301 pages: ${pages.length === 301 ? 'PASS' : 'FAIL'} (${pages.length})`);
console.log(`[CHECK] 195 APIs: ${apis.length === 195 ? 'PASS' : 'FAIL'} (${apis.length})`);
console.log(`[CHECK] 49 Dynamic: ${dynamic.length === 49 ? 'PASS' : 'FAIL'} (${dynamic.length})`);

// E. 6 verticals coverage
const verticals = {
  artistas: routes.filter(r => (r.route + ' ' + r.filePath).toLowerCase().includes('artista')).length,
  fincas: routes.filter(r => (r.route + ' ' + r.filePath).toLowerCase().includes('finca')).length,
  bodas: routes.filter(r => (r.route + ' ' + r.filePath).toLowerCase().includes('boda')).length,
  acuerdos: routes.filter(r => (r.route + ' ' + r.filePath).toLowerCase().includes('acuerdo')).length,
  escaner: routes.filter(r => (r.route + ' ' + r.filePath).toLowerCase().includes('escaner') || (r.route + ' ' + r.filePath).toLowerCase().includes('scan')).length,
  studio: routes.filter(r => (r.route + ' ' + r.filePath).toLowerCase().includes('studio')).length,
};
console.log('[CHECK] 6 Verticals coverage:', verticals);
const allVerticalsPresent = Object.values(verticals).every(count => count > 0);
console.log(`[CHECK] All 6 verticals present: ${allVerticalsPresent ? 'PASS' : 'FAIL'}`);

// F. Dynamic route fixtures
const dynamicParamsPresent = dynamic.every(r => Array.isArray(r.dynamicParams) && r.dynamicParams.length > 0);
console.log(`[CHECK] All 49 dynamic routes specify dynamicParams tokens: ${dynamicParamsPresent ? 'PASS' : 'FAIL'}`);

// -------------------------------------------------------------
// 2. Dead clicks, '#' hrefs, and Centralita phone verification
// -------------------------------------------------------------
console.log('\n--- 2. ADVERSARIAL STATIC ANALYSIS (DEAD CLICKS, # HREFS, CENTRALITA) ---');

function walkDir(dir, filterExt) {
  let list = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!['node_modules', '.next', '.git', '.antigravity', '.data'].includes(item.name)) {
        list = list.concat(walkDir(full, filterExt));
      }
    } else if (filterExt.some(ext => item.name.endsWith(ext))) {
      list.push(full);
    }
  }
  return list;
}

const srcFiles = walkDir(path.join(ROOT, 'src'), ['.tsx', '.ts']);
console.log(`Scanning ${srcFiles.length} source files in src/...`);

const hashHrefs = [];
const emptyClickHandlers = [];
const CENTRALITA_NUMBER = '693 693 048';
const CENTRALITA_CLEAN = '693693048';
let centralitaOccurrences = 0;
const centralitaFiles = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);

  // Check for href="#" or href='#' or href={`#`}
  const hashMatches = content.match(/href\s*=\s*["']#["']/g);
  if (hashMatches) {
    hashHrefs.push({ file: rel, count: hashMatches.length });
  }

  // Check for dead clicks: onClick={() => {}} or onClick={() => void 0} or onClick={() => null}
  const deadClickMatches = content.match(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*(\{\s*\}|void\s*0|null|undefined)\s*\}/g);
  if (deadClickMatches) {
    emptyClickHandlers.push({ file: rel, count: deadClickMatches.length });
  }

  // Check centralita
  if (content.includes(CENTRALITA_NUMBER) || content.includes(CENTRALITA_CLEAN)) {
    centralitaOccurrences++;
    centralitaFiles.push(rel);
  }
}

console.log(`[AUDIT] Raw href="#" found in files: ${hashHrefs.length}`);
if (hashHrefs.length > 0) {
  hashHrefs.slice(0, 10).forEach(h => console.log(`   - ${h.file} (${h.count} instances)`));
}

console.log(`[AUDIT] Dead click handlers (onClick={() => {}}) found: ${emptyClickHandlers.length}`);
if (emptyClickHandlers.length > 0) {
  emptyClickHandlers.slice(0, 10).forEach(d => console.log(`   - ${d.file} (${d.count} instances)`));
}

console.log(`[AUDIT] Centralita (+34 693 693 048) found in ${centralitaFiles.length} files across src/`);
console.log(`Sample centralita integrations:`, centralitaFiles.slice(0, 5));

console.log('\n=== CATALOG & STATIC AUDIT COMPLETED ===');
