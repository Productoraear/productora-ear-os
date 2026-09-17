const fs = require('fs');
const path = require('path');

const providersPath = path.join(__dirname, '../public/data/providers/finca.json');
const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

// Check for top rated / most reviewed fincas
const topFincas = [...data]
  .filter(f => f.reviews && f.reviews > 10 && f.img)
  .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
  .slice(0, 10);

console.log('Top 10 real fincas by reviews:');
topFincas.forEach(f => {
  console.log(`- ${f.name} (${f.address}) | ${f.reviews} reviews | ${f.rating}★ | img: ${f.img ? f.img.substring(0, 50) + '...' : 'none'}`);
});
