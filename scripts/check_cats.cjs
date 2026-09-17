const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../src/data/all_providers_database.json');
const raw = fs.readFileSync(dbPath, 'utf8');
const all = JSON.parse(raw);
console.log('Total records in all_providers_database.json:', all.length);

const cats = {};
all.forEach(p => {
  const c = p.category || 'unknown';
  cats[c] = (cats[c] || 0) + 1;
});
console.log('Categories breakdown:', cats);

const fincas = all.filter(p => (p.category || '').toLowerCase() === 'finca');
console.log('Total fincas in all_providers_database:', fincas.length);
if (fincas.length > 0) {
  console.log('Sample 3 fincas:');
  fincas.slice(0, 3).forEach((f, i) => {
    console.log(`[${i}] ${f.name} | Prov: ${f.province} | Address: ${f.address} | Phone: ${f.phone || f.telephone}`);
  });
}
