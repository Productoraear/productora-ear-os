const fs = require('fs');

const PLACEHOLDER_RAW = '+34 693 693 048';

function normPhone(p) {
    if (p == null) return '';
    return String(p).replace(/[^0-9]/g, '');
}

function summarize(file) {
    if (!fs.existsSync(file)) {
        console.log(`\n### ${file} -> NO EXISTE`);
        return;
    }
    let data;
    try {
        data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        console.log(`\n### ${file} -> PARSE_ERROR: ${e.message}`);
        return;
    }

    if (!Array.isArray(data)) {
        console.log(`\n### ${file} -> NO ES ARRAY (top keys: ${Object.keys(data).join(', ')})`);
        return;
    }

    const arr = data;
    console.log(`\n### ${file} -> ${arr.length} registros`);
    if (arr.length === 0) return;

    const keys = Object.keys(arr[0]);
    const phoneKey = keys.find(k => /telefono|telefono_|phone|tel|movil|movil_|whatsapp/i.test(k));
    const vKey = keys.find(k => /verified|verificado|verif/i.test(k));

    let placeholder = 0, real = 0, empty = 0, hasPhoneField = 0;
    for (const r of arr) {
        if (!phoneKey) { hasPhoneField = 0; break; }
        const n = normPhone(r[phoneKey]);
        if (!n) { empty++; continue; }
        if (n === normPhone(PLACEHOLDER_RAW)) { placeholder++; }
        else { real++; }
    }

    let vTrue = 0, vFalse = 0, vOther = 0;
    for (const r of arr) {
        if (!vKey) break;
        const v = r[vKey];
        if (v === true || v === 'true') vTrue++;
        else if (v === false || v === 'false') vFalse++;
        else vOther++;
    }

    console.log(`phoneKey=${phoneKey || 'NINGUNO'} | verifiedKey=${vKey || 'NINGUNO'}`);
    console.log(`PHONE -> placeholder=${placeholder} real=${real} empty=${empty}`);
    console.log(`VERIFIED -> true=${vTrue} false=${vFalse} other=${vOther}`);
}

const edgeDir = 'public/data/providers';
const edgeFiles = [
    'finca.json', 'catering.json', 'musica.json', 'foto.json', 'decoracion.json',
    'servicios.json', 'moda.json', 'transporte.json', 'sonido.json', 'wedding.json', 'senior_care.json'
];
edgeFiles.forEach(f => summarize(`${edgeDir}/${f}`));

console.log('\n\n════════ DATA LAKES src/data ════════');
summarize('src/data/all_providers_database.json');
summarize('src/data/vampirized_providers.json');