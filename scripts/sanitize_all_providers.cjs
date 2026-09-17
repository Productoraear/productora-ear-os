const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/data/providers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'manifest.json');

const BLACKLIST_DIGITS = [
  '703831064', '721056835', '999999999', '727272727', 
  '703287473', '780850659', '123456789', '000000000'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fakes = 0;
    let directs = 0;
    for (const p of data) {
      const raw = (p.phone || p.telephone || '').replace(/[^\d]/g, '');
      if (BLACKLIST_DIGITS.some(d => raw.includes(d))) {
        fakes++;
        p.phone = '+34 693 693 048';
        p.telephone = '+34 693 693 048';
        p.hasDirectPhone = false;
      } else if (raw.length >= 9 && !raw.includes('693693048')) {
        directs++;
        p.hasDirectPhone = true;
      } else {
        p.phone = '+34 693 693 048';
        p.telephone = '+34 693 693 048';
        p.hasDirectPhone = false;
      }
    }
    if (fakes > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
      console.log(`Sanitized ${file}: purged ${fakes} fake numbers, kept ${directs} direct numbers.`);
    } else {
      console.log(`Checked ${file}: 0 fake numbers, ${directs} direct numbers.`);
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
}
