const fs = require('fs');
const path = require('path');

const inv = require('../vault_absorbed/bodas_net_intel/inventario_campus_local.json');

const targetFolder = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\bodas_net_intel\\campus_lead_magnets';
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
}

// Filtrar documentos que coincidan con Bodas.net, Campus, Libro Blanco, Tendencias, Guías de Proveedores
const filtered = inv.filter(item => {
  const n = item.name.toLowerCase();
  const p = item.path.toLowerCase();
  return (
    n.includes('bodas.net') ||
    n.includes('bodas_net') ||
    n.includes('campus') ||
    n.includes('tendencias bodas') ||
    n.includes('weddingwire') ||
    n.includes('theknot') ||
    (n.includes('guia') && n.includes('boda')) ||
    (n.includes('manual') && n.includes('boda')) ||
    (n.includes('libro') && n.includes('boda'))
  );
});

console.log(`Documentos candidatos de Bodas.net / Campus: ${filtered.length}`);

// Desduplicar por tamaño exacto de archivo (misma versión)
const seenSizes = new Map();
const uniqueDocs = [];

for (const doc of filtered) {
  if (!seenSizes.has(doc.sizeBytes)) {
    seenSizes.set(doc.sizeBytes, doc);
    uniqueDocs.push(doc);
  }
}

console.log(`Documentos únicos canónicos (sin duplicados): ${uniqueDocs.length}`);

const report = [];

for (const doc of uniqueDocs) {
  // Limpiar nombre
  let cleanName = doc.name.replace(/_\[[A-F0-9]+\]/gi, '');
  const destPath = path.join(targetFolder, cleanName);
  
  try {
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(doc.path, destPath);
    }
    report.push({
      original: doc.path,
      destino: destPath,
      sizeMB: doc.sizeMB,
      nombre: cleanName
    });
    console.log(`✓ Copiado: ${cleanName} (${doc.sizeMB} MB)`);
  } catch (err) {
    console.error(`Error copiando ${doc.path}: ${err.message}`);
  }
}

// Guardar índice de los Lead Magnets
const catalogFile = path.join(targetFolder, '00_CATALOGO_LEAD_MAGNETS_CAMPUS.json');
fs.writeFileSync(catalogFile, JSON.stringify(report, null, 2), 'utf8');
console.log(`\nCatálogo guardado en: ${catalogFile}`);
