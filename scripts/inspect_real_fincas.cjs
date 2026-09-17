const fs = require('fs');
const path = require('path');

function inspect() {
  const providersPath = path.join(__dirname, '../public/data/providers/finca.json');
  if (fs.existsSync(providersPath)) {
    const raw = fs.readFileSync(providersPath, 'utf8');
    const data = JSON.parse(raw);
    console.log('Total fincas in public/data/providers/finca.json:', data.length);
    console.log('Sample 3 fincas:');
    data.slice(0, 3).forEach((f, i) => {
      console.log(`[${i}] Name: ${f.name} | Province: ${f.province} | Address: ${f.address} | Phone: ${f.phone || f.telephone}`);
    });
    
    // Check provinces distribution
    const provinces = {};
    let withRealPhone = 0;
    data.forEach(f => {
      const p = f.province || 'Unknown';
      provinces[p] = (provinces[p] || 0) + 1;
      const ph = f.phone || f.telephone;
      if (ph && !ph.includes('703 831 064') && !ph.includes('600 000')) {
        withRealPhone++;
      }
    });
    console.log('Provinces top 10:', Object.entries(provinces).sort((a,b)=>b[1]-a[1]).slice(0, 10));
    console.log('Fincas with unique/real phone (not default placeholder):', withRealPhone, 'out of', data.length);
  } else {
    console.log('finca.json does not exist');
  }

  // Check all_providers_database if exists
  const allDbPath = path.join(__dirname, '../src/data/all_providers_database.json');
  if (fs.existsSync(allDbPath)) {
    const stats = fs.statSync(allDbPath);
    console.log('all_providers_database.json size MB:', (stats.size / (1024*1024)).toFixed(2));
  }
}

inspect();
