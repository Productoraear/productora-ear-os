const fs = require('fs');
const path = require('path');

function getFiles(dir, exts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        results = results.concat(getFiles(fullPath, exts));
      }
    } else {
      if (exts.some(ext => file.endsWith(ext))) results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('src', ['.tsx', '.ts']);
const hrefRegex = /href=["'](\/[a-zA-Z0-9_\-\/\?&=%#]+)["']/g;
const linksMap = new Map(); // route -> array of source files

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const raw = match[1].split('?')[0].split('#')[0];
    if (raw && raw.startsWith('/') && !raw.startsWith('/api') && !raw.startsWith('/_next') && !raw.startsWith('/images') && !raw.startsWith('/icons') && !raw.startsWith('/fonts') && !raw.startsWith('/data')) {
      if (!linksMap.has(raw)) linksMap.set(raw, new Set());
      linksMap.get(raw).add(f);
    }
  }
});

function routeExists(route) {
  if (route === '/' || route === '') return true;
  const parts = route.split('/').filter(Boolean);

  function checkDir(currDir, partIdx) {
    if (partIdx >= parts.length) {
      return fs.existsSync(path.join(currDir, 'page.tsx')) ||
             fs.existsSync(path.join(currDir, 'page.jsx')) ||
             fs.existsSync(path.join(currDir, 'page.js'));
    }
    const part = parts[partIdx];
    if (!fs.existsSync(currDir)) return false;

    const entries = fs.readdirSync(currDir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) {
        if (ent.name === part) {
          if (checkDir(path.join(currDir, ent.name), partIdx + 1)) return true;
        }
        if (ent.name.startsWith('[') && ent.name.endsWith(']')) {
          if (checkDir(path.join(currDir, ent.name), partIdx + 1)) return true;
        }
        if (ent.name.startsWith('(') && ent.name.endsWith(')')) {
          if (checkDir(path.join(currDir, ent.name), partIdx)) return true;
        }
      }
    }
    return false;
  }

  return checkDir('src/app', 0);
}

const missing = [];
const valid = [];

for (const [route, sourceFiles] of linksMap.entries()) {
  if (!routeExists(route)) {
    missing.push({ route, sources: Array.from(sourceFiles) });
  } else {
    valid.push(route);
  }
}

console.log(`Audited ${linksMap.size} unique internal routes.`);
console.log(`Found ${missing.length} missing/broken routes.`);
console.log('\n=== BROKEN / MISSING INTERNAL ROUTES ===');
missing.forEach(m => {
  console.log(`\n❌ ${m.route}`);
  m.sources.slice(0, 3).forEach(s => console.log(`   referenced in: ${s}`));
  if (m.sources.length > 3) console.log(`   ... and ${m.sources.length - 3} more files`);
});

// Also check duplicate/overlapping routes
console.log('\n=== SIMILAR / POTENTIALLY DUPLICATE CONCEPTS ===');
const concepts = {
  proveedores: ['/proveedores', '/proveedores-servicios', '/marketplace', '/directorio'],
  artistas: ['/artistas', '/artistas/dashboard', '/artistas/edwin-agudelo', '/artistas/solistas', '/directorio'],
  reservar: ['/reservar', '/reservar/solista', '/checkout/presupuesto', '/cotizador', '/calculadora'],
  fincas: ['/fincas', '/fincas-landing', '/fincasparaboda', '/espacio'],
  vimume: ['/vimume', '/vimume/protocolo', '/vimume/residencias', '/vimume/clinica', '/vimume/piloto-5-centros']
};

for (const [key, list] of Object.entries(concepts)) {
  console.log(`\nConcept: ${key.toUpperCase()}`);
  list.forEach(item => {
    const exists = routeExists(item);
    console.log(`  - ${item} : ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  });
}
