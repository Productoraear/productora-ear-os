const fs = require('fs');
const path = require('path');

const htmlIndexPath = path.join(__dirname, '../vault/proveedores_html_indexados/CATALOGO_PROVEEDORES_HTML_INDEX.json');
const fincasPath = path.join(__dirname, '../public/data/providers/finca.json');

const htmlIndex = JSON.parse(fs.readFileSync(htmlIndexPath, 'utf8'));
const fincas = JSON.parse(fs.readFileSync(fincasPath, 'utf8'));

console.log('htmlIndex total:', htmlIndex.length);
console.log('fincas total:', fincas.length);

const htmlBySlug = new Map();
const htmlByName = new Map();

htmlIndex.forEach(item => {
  if (item.slug) htmlBySlug.set(item.slug.toLowerCase().trim(), item);
  if (item.name) htmlByName.set(item.name.toLowerCase().trim(), item);
  // Also extract bodas ID --eXXXXX
  const m = (item.profile_url || item.original_html || '').match(/--e(\d+)/);
  if (m) {
    htmlBySlug.set('e-' + m[1], item);
    htmlBySlug.set('prov-' + m[1], item);
    htmlBySlug.set('prov-e-' + m[1], item);
  }
});

let matched = 0;
fincas.forEach(f => {
  const s = (f.slug || f.id || '').toLowerCase().trim();
  const n = (f.name || '').toLowerCase().trim();
  if (htmlBySlug.has(s) || htmlByName.has(n)) {
    matched++;
  }
});

console.log('Fincas matched against HTML Index:', matched);
