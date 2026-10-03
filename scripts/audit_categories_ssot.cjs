const fs = require('fs');
const path = require('path');

const PLACEHOLDER_RAW = '+34 693 693 048';
function normPhone(p) { return p == null ? '' : String(p).replace(/[^0-9]/g, ''); }
function isRealPhone(p) {
    const n = normPhone(p);
    return n && n !== normPhone(PLACEHOLDER_RAW) && n.length >= 9;
}

const DATA = path.join(__dirname, '..', 'src', 'data', 'all_providers_database.json');
const raw = JSON.parse(fs.readFileSync(DATA, 'utf8'));

const byCat = {};
let real = 0, placeholder = 0, empty = 0;
for (const r of raw) {
    if (!r) continue;
    const cat = String(r.category || 'sin_categoria').toLowerCase().trim();
    const ph = r.phone || r.telephone || '';
    const n = normPhone(ph);
    const kind = !n ? 'empty' : (n === normPhone(PLACEHOLDER_RAW) ? 'placeholder' : 'real');
    byCat[cat] = byCat[cat] || { total: 0, real: 0, placeholder: 0, empty: 0, verified: 0, verifiedFalse: 0 };
    byCat[cat].total++;
    byCat[cat][kind]++;
    if (r.verified === true) byCat[cat].verified++;
    if (r.verified === false) byCat[cat].verifiedFalse++;
}

console.log('CATEGORIA | total | real | placeholder | empty | verified:true | verified:false');
for (const [cat, c] of Object.entries(byCat).sort((a, b) => b[1].total - a[1].total)) {
    console.log(`${cat} | ${c.total} | ${c.real} | ${c.placeholder} | ${c.empty} | ${c.verified} | ${c.verifiedFalse}`);
}
console.log(`\nTOTAL registros: ${raw.length}`);