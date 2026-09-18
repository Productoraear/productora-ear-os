const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/NUCLEO_DATA/bodas_full.json');

try {
  console.log('Loading JSON...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Total records in bodas_full.json: ${data.length}`);

  const catCounts = {};
  let withPricing = 0;
  let withPhone = 0;
  let withReviews = 0;
  let withImages = 0;
  let withDescription = 0;

  for (const item of data) {
    const cat = item.category || 'Sin Categoría';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
    if (item.pricing) withPricing++;
    if (item.phone || (item.contact && item.contact.phone)) withPhone++;
    if (item.reviews_count || item.rating || item.reviews) withReviews++;
    if (item.images && item.images.length > 0) withImages++;
    if (item.description && item.description.length > 30) withDescription++;
  }

  console.log('\n--- Category Breakdown ---');
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedCats) {
    console.log(`${cat.padEnd(30)} : ${count}`);
  }

  console.log('\n--- Commercial Signals ---');
  console.log(`Total: ${data.length}`);
  console.log(`With Pricing: ${withPricing} (${((withPricing/data.length)*100).toFixed(1)}%)`);
  console.log(`With Phone: ${withPhone} (${((withPhone/data.length)*100).toFixed(1)}%)`);
  console.log(`With Reviews: ${withReviews} (${((withReviews/data.length)*100).toFixed(1)}%)`);
  console.log(`With Images: ${withImages} (${((withImages/data.length)*100).toFixed(1)}%)`);
  console.log(`With Rich Description: ${withDescription} (${((withDescription/data.length)*100).toFixed(1)}%)`);

} catch (err) {
  console.error('Error:', err.message);
}
