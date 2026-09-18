const fs = require('fs');
const path = require('path');

const gscDir = 'C:\\Users\\M2-W10\\.gemini\\antigravity-ide\\brain\\93f049b7-ab0b-4b96-93cd-e01ad4f2b4a6\\gsc_export';
const pagesPath = path.join(gscDir, 'Páginas.csv');
const queriesPath = path.join(gscDir, 'Consultas.csv');

function parseGscCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  const dataLines = lines.slice(1);
  return dataLines.map(line => {
    // CSV headers: Name, Clicks, Impressions, CTR, Position
    const parts = line.split(',');
    if (parts.length < 5) return null;
    const name = parts[0].trim();
    const clicks = parseInt(parts[1], 10) || 0;
    const impressions = parseInt(parts[2], 10) || 0;
    const ctrStr = parts[3].trim();
    const position = parseFloat(parts[4]) || 0;
    return { name, clicks, impressions, ctrStr, position };
  }).filter(Boolean);
}

const pages = parseGscCsv(pagesPath);
const queries = parseGscCsv(queriesPath);

console.log('====================================================');
console.log('📊 FORENSIC ANALYTICS REPORT — GSC PERFORMANCE DATA');
console.log('====================================================');

const totalClicks = pages.reduce((acc, p) => acc + p.clicks, 0);
const totalImpressions = pages.reduce((acc, p) => acc + p.impressions, 0);
const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0';

console.log(`\n🔹 Total Impressions (Pages): ${totalImpressions.toLocaleString('es-ES')}`);
console.log(`🔹 Total Clicks (Pages): ${totalClicks.toLocaleString('es-ES')}`);
console.log(`🔹 Overall CTR: ${avgCtr}%\n`);

console.log('--- TOP 30 HIGH-IMPRESSION PAGES ---');
pages.sort((a, b) => b.impressions - a.impressions).slice(0, 30).forEach((p, i) => {
  console.log(`${(i + 1).toString().padStart(2, '0')}. ${p.impressions.toString().padStart(5, ' ')} imp | ${p.clicks.toString().padStart(3, ' ')} clk | ${p.ctrStr.padStart(6, ' ')} | Pos ${p.position.toFixed(1).padStart(4, ' ')} -> ${p.name}`);
});

console.log('\n--- TOP 30 HIGH-IMPRESSION QUERIES ---');
queries.sort((a, b) => b.impressions - a.impressions).slice(0, 30).forEach((q, i) => {
  console.log(`${(i + 1).toString().padStart(2, '0')}. ${q.impressions.toString().padStart(5, ' ')} imp | ${q.clicks.toString().padStart(3, ' ')} clk | ${q.ctrStr.padStart(6, ' ')} | Pos ${q.position.toFixed(1).padStart(4, ' ')} -> ${q.name}`);
});

// Detect root cause categories:
const provRawUrls = pages.filter(p => p.name.includes('/proveedores/prov-'));
const provRawImp = provRawUrls.reduce((a, b) => a + b.impressions, 0);
const provRawClk = provRawUrls.reduce((a, b) => a + b.clicks, 0);

console.log('\n--- DIAGNOSTIC PATTERNS ---');
console.log(`❌ Generic Raw Numerical Provider URLs (/proveedores/prov-XXXX):`);
console.log(`   Count: ${provRawUrls.length} URLs | Impressions: ${provRawImp} | Clicks: ${provRawClk} | CTR: ${provRawImp > 0 ? (provRawClk/provRawImp*100).toFixed(2) : 0}%`);
console.log(`   WHY CTR LOW: Google displays "prov-2825" instead of real business names ("Finca El Olivar") in search snippet titles!`);
