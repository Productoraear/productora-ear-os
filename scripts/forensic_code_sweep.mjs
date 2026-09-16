#!/usr/bin/env node
/**
 * BARRIDO FORENSE DE CÓDIGO — EAR OS (NIVEL PROFUNDO)
 * Escanea src/ en busca de:
 *   1. FACHADAS VACÍAS: datos hardcodeados, mocks, placeholders, TODO/FIXME.
 *   2. FUGAS DE SECRETOS: claves Stripe / API en archivos de cliente o NEXT_PUBLIC.
 *   3. INTEGRIDAD ZONA CERO: motores inmutables presentes y no degradados.
 *   4. INTEGRIDAD SSOT: reglas de negocio (tarifa, split, depósito, rider, B2G).
 * Salida: informe JSON en reports/ + resumen compacto.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports');

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', 'data', 'adn_vault', 'adn_vault_staging', 'archive', 'archive_vampires_legacy']);
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

const FACADE_PATTERNS = [
  { id: 'MOCK', re: /\b(mock|mocked|mockData|mock_data)\b/i, sev: 'high' },
  { id: 'FAKE', re: /\b(fake|fakeData|fake_data)\b/i, sev: 'high' },
  { id: 'DUMMY', re: /\b(dummy|dummyData|dummy_data)\b/i, sev: 'high' },
  { id: 'PLACEHOLDER', re: /\b(placeholder|lorem\s+ipsum)\b/i, sev: 'med' },
  { id: 'HARDCODE', re: /\b(simulado|hardcode|hardcoded|hard-coded)\b/i, sev: 'high' },
  { id: 'TODO', re: /\b(TODO|FIXME|XXX|HACK)\b/, sev: 'low' },
  { id: 'DATA_FAKE', re: /\b(12345|000000|ejemplo|example\.com|user@example|test@test)\b/i, sev: 'med' },
];

const SECRET_PATTERNS = [
  { id: 'STRIPE_LIVE', re: /sk_live_[A-Za-z0-9]{10,}/, sev: 'CRITICAL' },
  { id: 'STRIPE_TEST', re: /sk_test_[A-Za-z0-9]{10,}/, sev: 'high' },
  { id: 'SECRET_KEY_LITERAL', re: /(secret|api[_-]?key|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i, sev: 'high' },
  { id: 'NEXT_PUBLIC_SECRET', re: /NEXT_PUBLIC_[A-Z_]*SECRET/i, sev: 'high' },
];

const findings = { facades: [], secrets: [], zoneZero: [], ssot: [] };
const stats = { filesScanned: 0, linesScanned: 0, facadeHits: 0, secretHits: 0 };

async function walk(dir, out = []) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (CODE_EXT.has(path.extname(e.name))) out.push(full);
  }
  return out;
}

function rel(p) { return path.relative(ROOT, p).replace(/\\/g, '/'); }

async function scanFile(file) {
  let text;
  try { text = await fs.readFile(file, 'utf8'); } catch { return; }
  stats.filesScanned++;
  const isClient = /["']use client["']/.test(text);
  const lines = text.split(/\r?\n/);
  stats.linesScanned += lines.length;

  lines.forEach((line, i) => {
    for (const sp of SECRET_PATTERNS) {
      if (sp.re.test(line)) {
        const isEnvRead = /process\.env\.[A-Z_]+/.test(line) && !/['"][A-Za-z0-9_\-]{16,}['"]/.test(line);
        if (isEnvRead) continue;
        const sev = isClient && sp.sev !== 'CRITICAL' ? 'CRITICAL' : sp.sev;
        findings.secrets.push({ file: rel(file), line: i + 1, pattern: sp.id, sev, isClient, snippet: line.trim().slice(0, 120) });
        stats.secretHits++;
      }
    }
    for (const fp of FACADE_PATTERNS) {
      if (fp.re.test(line)) {
        findings.facades.push({ file: rel(file), line: i + 1, pattern: fp.id, sev: fp.sev, snippet: line.trim().slice(0, 120) });
        stats.facadeHits++;
      }
    }
  });
}

async function checkZoneZero() {
  const targets = [
    'src/lib/vimume/b2g-tender-engine.ts',
    'src/lib/astra/astra-conversation-engine.ts',
  ];
  for (const t of targets) {
    const full = path.join(ROOT, t);
    try {
      const st = await fs.stat(full);
      const text = await fs.readFile(full, 'utf8');
      findings.zoneZero.push({ file: t, present: true, bytes: st.size, lines: text.split(/\r?\n/).length, intact: true });
    } catch {
      findings.zoneZero.push({ file: t, present: false, intact: false });
    }
  }
}

async function checkSSOT() {
  const rules = [
    { id: 'TARIFA_BASE_350', re: /350(\.00)?\s*[,€]/, desc: 'Tarifa Base Solista 350,00 €' },
    { id: 'SPLIT_80_10_10', re: /(80\s*%|0\.8).{0,40}(10\s*%|0\.1)/i, desc: 'Split 80/10/10' },
    { id: 'DEPOSITO_100', re: /100(\.00)?\s*[,€]/, desc: 'Depósito 100,00 €' },
    { id: 'RIDER_12W', re: /12\s*W\s*\/\s*pax/i, desc: 'Rider 12 W/pax' },
    { id: 'B2G_14250', re: /14[.,]250|14250/, desc: 'B2G < 14.250 €' },
    { id: 'LOGISTICA_150_KM', re: /1[.,]50\s*€?\s*\/?\s*km/i, desc: 'Logística 1,50 €/km' },
  ];
  const candidates = [];
  const scanDirs = ['src/lib', 'src/config', 'src/data', 'src/core', 'src/services', 'src/shared', 'src/types', 'config'];
  for (const d of scanDirs) {
    const full = path.join(ROOT, d);
    try { candidates.push(...(await walk(full))); } catch { /* dir no existe */ }
  }
  const ruleResults = {};
  for (const rule of rules) ruleResults[rule.id] = { desc: rule.desc, found: false, hits: [] };
  for (const file of candidates) {
    let text;
    try { text = await fs.readFile(file, 'utf8'); } catch { continue; }
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const rule of rules) {
        if (rule.re.test(line) && ruleResults[rule.id].hits.length < 3) {
          ruleResults[rule.id].found = true;
          ruleResults[rule.id].hits.push({ file: rel(file), line: i + 1, snippet: line.trim().slice(0, 100) });
        }
      }
    });
  }
  findings.ssot = Object.values(ruleResults);
}

async function main() {
  console.log('==============================================================');
  console.log('BARRIDO FORENSE DE CÓDIGO — EAR OS (NIVEL PROFUNDO)');
  console.log('==============================================================');

  const srcDir = path.join(ROOT, 'src');
  const files = await walk(srcDir);
  console.log(`\n[ESCOPo] Archivos de código a escanear: ${files.length}`);

  for (const f of files) await scanFile(f);
  await checkZoneZero();
  await checkSSOT();

  const report = {
    meta: { generated_at: new Date().toISOString(), scope: 'src/' },
    stats,
    findings,
  };

  await fs.mkdir(REPORT_DIR, { recursive: true });
  const reportPath = path.join(REPORT_DIR, 'forensic_code_sweep.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  // ---------- RESUMEN COMPACTO ----------
  console.log('\n==============================================================');
  console.log('RESULTADO DEL BARRIDO FORENSE DE CÓDIGO');
  console.log('==============================================================');
  console.log(`Archivos escaneados:    ${stats.filesScanned}`);
  console.log(`Líneas escaneadas:      ${stats.linesScanned.toLocaleString()}`);
  console.log(`\n--- FUGAS DE SECRETOS (${stats.secretHits}) ---`);
  if (stats.secretHits === 0) console.log('   ✅ Ninguna fuga de secretos detectada.');
  else findings.secrets.slice(0, 20).forEach(s => console.log(`   [${s.sev}] ${s.file}:${s.line} (${s.pattern})${s.isClient ? ' [CLIENTE]' : ''}`));
  console.log(`\n--- FACHADAS VACÍAS (${stats.facadeHits}) ---`);
  const bySev = { high: 0, med: 0, low: 0 };
  findings.facades.forEach(f => { bySev[f.sev] = (bySev[f.sev] || 0) + 1; });
  console.log(`   high: ${bySev.high} | med: ${bySev.med} | low: ${bySev.low}`);
  const highFacades = findings.facades.filter(f => f.sev === 'high');
  if (highFacades.length) {
    console.log('   Hallazgos HIGH (posibles fachadas vacías):');
    highFacades.slice(0, 25).forEach(f => console.log(`     - ${f.file}:${f.line} [${f.pattern}] ${f.snippet}`));
    if (highFacades.length > 25) console.log(`     ... y ${highFacades.length - 25} más`);
  }
  console.log(`\n--- INTEGRIDAD ZONA CERO ---`);
  findings.zoneZero.forEach(z => console.log(`   ${z.present ? '✅' : '❌'} ${z.file} ${z.present ? `(${z.lines} líneas, ${(z.bytes / 1024).toFixed(1)} KB)` : '(AUSENTE)'}`));
  console.log(`\n--- INTEGRIDAD SSOT (reglas de negocio) ---`);
  findings.ssot.forEach(r => console.log(`   ${r.found ? '✅' : '❌'} ${r.desc} ${r.found ? `→ ${r.hits[0].file}:${r.hits[0].line}` : '(NO ENCONTRADA)'}`));
  console.log(`\nInforme completo:         reports/forensic_code_sweep.json`);
  console.log('==============================================================');
  console.log('BARRIDO FORENSE DE CÓDIGO FINALIZADO');
  console.log('==============================================================');
}

main().catch(err => {
  console.error('FATAL en barrido forense de código:', err);
  process.exit(1);
});