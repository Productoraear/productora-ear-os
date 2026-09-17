const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../vault/proveedores_html_indexados/Fincas_Espacios');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).slice(0, 10);

const PHONE_REGEX = /(?:(?:\+|00)34[\s.-]?)?(?:[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|[6789]\d{8})/g;

console.log('Inspecting 10 HTML files in Fincas_Espacios for phone numbers:');
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Search for phone patterns
  const matches = content.match(PHONE_REGEX) || [];
  // Clean matches
  const uniquePhones = Array.from(new Set(matches.map(m => m.replace(/[\s.-]/g, ''))))
    .filter(p => !p.includes('693693048') && !p.includes('703831064') && p.length >= 9);

  // Search for bodas telephone attributes or data-phone
  const dataPhone = content.match(/data-(?:phone|telephone|tel)=["']([^"']+)["']/i);
  const hrefTel = content.match(/href=["']tel:([^"']+)["']/i);
  
  console.log(`- File: ${file}`);
  console.log(`  href tel:`, hrefTel ? hrefTel[1] : 'none');
  console.log(`  data-phone:`, dataPhone ? dataPhone[1] : 'none');
  console.log(`  regex phones found:`, uniquePhones.slice(0, 5));
}
