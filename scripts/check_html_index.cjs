const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../vault/proveedores_html_indexados/CATALOGO_PROVEEDORES_HTML_INDEX.json');
if (fs.existsSync(p)) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log('Total items in CATALOGO_PROVEEDORES_HTML_INDEX.json:', data.length);
  let withPhone = 0;
  let withProfileUrl = 0;
  let withGoogleUrl = 0;
  data.forEach(item => {
    if (item.has_real_phone && item.phone) withPhone++;
    if (item.profile_url) withProfileUrl++;
    if (item.google_search_url) withGoogleUrl++;
  });
  console.log({
    total: data.length,
    withPhone,
    withProfileUrl,
    withGoogleUrl
  });
  console.log('Sample 3 items:', data.slice(0, 3));
}
