const fs = require('fs');
const path = require('path');

const SPANISH_PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 
  'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 
  'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Illes Balears', 'Baleares',
  'Jaén', 'A Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 
  'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 
  'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 
  'Vizcaya', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'
];

function normalize(s) {
  if (!s) return '';
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const normProvinces = SPANISH_PROVINCES.map(p => ({
  original: p,
  norm: normalize(p)
}));

const BLACKLIST_DIGITS = [
  '703831064', '721056835', '999999999', '727272727', 
  '703287473', '780850659', '123456789', '000000000'
];

function sanitizeFincas() {
  const filePath = path.join(__dirname, '../public/data/providers/finca.json');
  console.log('Reading finca.json...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let fixedProvinceCount = 0;
  let cleansedPhoneCount = 0;
  let directVendorCount = 0;

  for (const f of data) {
    // 1. Detect Real Province from Address
    const addr = f.address || '';
    const normAddr = normalize(addr);
    let matchedProv = null;

    for (const p of normProvinces) {
      if (
        normAddr.endsWith(p.norm) || 
        normAddr.includes(', ' + p.norm) || 
        normAddr.includes('(' + p.norm + ')') ||
        normAddr.includes(' ' + p.norm + ',')
      ) {
        matchedProv = p.original;
        break;
      }
    }
    if (!matchedProv) {
      for (const p of normProvinces) {
        if (normAddr.includes(p.norm)) {
          matchedProv = p.original;
          break;
        }
      }
    }

    if (matchedProv && matchedProv !== f.province) {
      f.province = matchedProv;
      fixedProvinceCount++;
    }

    // 2. Sanitize Phone Numbers
    const rawPh = (f.phone || f.telephone || '').trim();
    const digits = rawPh.replace(/[^\d]/g, '');

    const isFake = BLACKLIST_DIGITS.some(d => digits.includes(d));
    const isCentralita = digits.includes('693693048');

    if (isFake) {
      // It was a dummy Celebrents placeholder!
      f.phone = '+34 693 693 048';
      f.telephone = '+34 693 693 048';
      f.hasDirectPhone = false;
      f.phoneType = 'CENTRALITA_EAR';
      cleansedPhoneCount++;
    } else if (isCentralita) {
      f.phone = '+34 693 693 048';
      f.telephone = '+34 693 693 048';
      f.hasDirectPhone = false;
      f.phoneType = 'CENTRALITA_EAR';
    } else if (digits.length >= 9) {
      // Authentic direct vendor phone
      f.hasDirectPhone = true;
      f.phoneType = 'DIRECTO_VERIFICADO';
      directVendorCount++;
    } else {
      f.phone = '+34 693 693 048';
      f.telephone = '+34 693 693 048';
      f.hasDirectPhone = false;
      f.phoneType = 'CENTRALITA_EAR';
    }

    // 3. Clean Name
    if (f.name) {
      f.name = f.name
        .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
        .replace(/\s*-\s*Precios.*/i, '')
        .replace(/\s*-\s*Fotos y opiniones.*/i, '')
        .trim();
    }
  }

  console.log(`Finished sanitizing finca.json:`);
  console.log(`- Provinces corrected: ${fixedProvinceCount}`);
  console.log(`- Dummy placeholder phones purged: ${cleansedPhoneCount}`);
  console.log(`- Direct verified vendor phones: ${directVendorCount}`);

  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
  console.log('Saved sanitized finca.json successfully!');
}

sanitizeFincas();
