const fs = require('fs');
const path = require('path');

const SPANISH_PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 
  'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 
  'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Illes Balears', 'Baleares',
  'Jaén', 'A Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 
  'Murcia', 'Navarra', 'Ourense', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 
  'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 
  'Vizcaya', 'Bizkaia', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'
];

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const normProvinces = SPANISH_PROVINCES.map(p => ({
  original: p === 'Orense' ? 'Ourense' : p === 'Bizkaia' ? 'Vizcaya' : p,
  norm: normalize(p)
}));

const providersPath = path.join(__dirname, '../public/data/providers/finca.json');
const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

let fixedProvinceCount = 0;
let provinceStats = {};

data.forEach(f => {
  const addr = f.address || '';
  const normAddr = normalize(addr);
  let matched = null;

  // Search from end of address (usually "Town, Province")
  for (const prov of normProvinces) {
    if (normAddr.endsWith(prov.norm) || normAddr.includes(', ' + prov.norm) || normAddr.includes('(' + prov.norm + ')')) {
      matched = prov.original;
      break;
    }
  }
  if (!matched) {
    for (const prov of normProvinces) {
      if (normAddr.includes(prov.norm)) {
        matched = prov.original;
        break;
      }
    }
  }

  const realProv = matched || f.province || 'Madrid';
  if (realProv !== f.province) {
    fixedProvinceCount++;
  }
  provinceStats[realProv] = (provinceStats[realProv] || 0) + 1;
});

console.log('Fixed province count:', fixedProvinceCount, 'out of', data.length);
console.log('Top 15 detected real provinces:');
console.log(Object.entries(provinceStats).sort((a,b)=>b[1]-a[1]).slice(0, 15));
