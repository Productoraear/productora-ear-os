const fs = require('fs');
const path = require('path');

const providersPath = path.join(__dirname, '../public/data/providers/finca.json');
const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

console.log('Sample record keys:', Object.keys(data[0]));
console.log('Sample 5 records with real phones:');
let count = 0;
for (const f of data) {
  const ph = f.phone || f.telephone;
  if (ph && !ph.includes('703 831 064')) {
    console.log({
      id: f.id,
      name: f.name,
      province: f.province,
      address: f.address,
      phone: ph,
      price: f.price || f.basePrice,
      rating: f.rating,
      reviews: f.reviews,
      hasImages: (f.imageUrls && f.imageUrls.length) || (f.gallery && f.gallery.length)
    });
    count++;
    if (count >= 5) break;
  }
}
