const fs = require('fs');
const path = 'C:\\Users\\M2-W10\\.gemini\\antigravity-ide\\brain\\93f049b7-ab0b-4b96-93cd-e01ad4f2b4a6\\scratch\\gsc_extracted\\zip_0';
const consultas = fs.readFileSync(path + '\\Consultas.csv', 'utf8').split('\n').slice(1).filter(Boolean);

const parsed = [];
for (const line of consultas) {
  // Regex to match CSV with possible commas inside quotes
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
  const parts = line.split(',');
  if (parts.length >= 5) {
    const posicion = parseFloat(parts[parts.length - 1]) || 0;
    const ctr = parts[parts.length - 2];
    const impresiones = parseInt(parts[parts.length - 3]) || 0;
    const clics = parseInt(parts[parts.length - 4]) || 0;
    const query = parts.slice(0, parts.length - 4).join(',').replace(/^"|"$/g, '');
    if (query && !isNaN(impresiones)) {
      parsed.push({ query, clics, impresiones, ctr, posicion });
    }
  }
}

console.log('Total valid queries parsed:', parsed.length);

// Sort by impressions descending (Top 100)
const top100ByImpressions = [...parsed].sort((a,b) => b.impresiones - a.impresiones).slice(0, 100);

// Let's see position distribution
const top3 = parsed.filter(q => q.posicion <= 3);
const page1 = parsed.filter(q => q.posicion > 3 && q.posicion <= 10);
const page2 = parsed.filter(q => q.posicion > 10 && q.posicion <= 20);
const graveyard = parsed.filter(q => q.posicion > 20);

console.log('\n--- BAÑO DE REALIDAD CRUDO (DISTRIBUCIÓN DE POSICIONES EN GOOGLE) ---');
console.log('Posición 1 a 3 (Zona de Clics Máximos):', top3.length, '(' + ((top3.length/parsed.length)*100).toFixed(1) + '%)');
console.log('Posición 4 a 10 (Página 1 de Google):', page1.length, '(' + ((page1.length/parsed.length)*100).toFixed(1) + '%)');
console.log('Posición 11 a 20 (Página 2 de Google):', page2.length, '(' + ((page2.length/parsed.length)*100).toFixed(1) + '%)');
console.log('Posición > 20 (El Cementerio de Google):', graveyard.length, '(' + ((graveyard.length/parsed.length)*100).toFixed(1) + '%)');

const totalImpressions = parsed.reduce((sum, q) => sum + q.impresiones, 0);
const totalClicks = parsed.reduce((sum, q) => sum + q.clics, 0);
console.log('\nTotal Impresiones acumuladas:', totalImpressions);
console.log('Total Clics acumulados:', totalClicks);
console.log('CTR Global:', ((totalClicks / totalImpressions)*100).toFixed(2) + '%');

console.log('\n--- TOP 35 INTENCIONES CON MAYOR VOLUMEN/IMPRESIONES ---');
top100ByImpressions.slice(0, 35).forEach((q, idx) => {
  console.log(`${idx + 1}. [${q.posicion.toFixed(1)}] (Imp: ${q.impresiones} | Clics: ${q.clics}) -> "${q.query}"`);
});

// Let's check queries that GOT CLICKS
console.log('\n--- CONSULTAS QUE SÍ GENERARON CLICS (TRÁFICO REAL) ---');
const withClicks = parsed.filter(q => q.clics > 0).sort((a,b) => b.clics - a.clics);
console.log('Total consultas con clics:', withClicks.length);
withClicks.forEach((q, idx) => {
  console.log(`${idx + 1}. [Pos: ${q.posicion.toFixed(1)}] ${q.clics} clics / ${q.impresiones} imp (CTR: ${q.ctr}) -> "${q.query}"`);
});

// Let's check Páginas.csv
const paginasRaw = fs.readFileSync(path + '\\Páginas.csv', 'utf8').split('\n').slice(1).filter(Boolean);
console.log('\n--- TOP PÁGINAS DE EAR OS INDEXADAS EN GOOGLE ---');
paginasRaw.slice(0, 15).forEach(p => console.log(' -', p));
