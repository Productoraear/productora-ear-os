const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'demetrio_luces_navidad_2025.json');
const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

products.forEach(p => {
  p.provider = "División Alumbrado Monumental · Productora EAR S-Class";
  if (p.description && p.description.includes("Catálogo Demetrio 2025")) {
    p.description = p.description.replace(
      /Conjunto de iluminación profesional extraído del Catálogo Demetrio 2025 \(Página \d+\)\./g,
      "Conjunto de iluminación monumental profesional S-Class homologado."
    );
  }
});

fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`[OK] Sanitizadas las ${products.length} referencias a marca Productora EAR S-Class.`);
