const fs = require('fs');
const path = require('path');

function inspect() {
  const providersPath = path.join(__dirname, '../../../public/data/providers/finca.json');
  if (fs.existsSync(providersPath)) {
    const raw = fs.readFileSync(providersPath, 'utf8');
    const data = JSON.parse(raw);
    console.log('Total fincas in public/data/providers/finca.json:', data.length);
    console.log('Sample 3 fincas:');
    data.slice(0, 3).forEach((f, i) => {
      console.log(`[${i}] Name: ${f.name} | Province: ${f.province} | Address: ${f.address} | Phone: ${f.phone || f.telephone}`);
    });
  } else {
    console.log('finca.json does not exist');
  }
}

inspect();
