const fs = require('fs');
const path = require('path');

const providersPath = path.join(__dirname, '../public/data/providers/finca.json');
const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

let directVendor = 0;
let earConcierge = 0;
let default703 = 0;
let other = 0;

for (const f of data) {
  const ph = (f.phone || f.telephone || '').replace(/\s+/g, '');
  if (ph.includes('693693048')) {
    earConcierge++;
  } else if (ph.includes('703831064')) {
    default703++;
  } else if (ph) {
    directVendor++;
  } else {
    other++;
  }
}

console.log({
  total: data.length,
  directVendorPhones: directVendor,
  earConciergePhones: earConcierge,
  default703Phones: default703,
  emptyPhones: other
});
