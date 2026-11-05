const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 1. Asegurar alias verify:sonometro
pkg.scripts['verify:sonometro'] = 'node scripts/verify_sonometro_pwa.cjs';
pkg.scripts['verify:price-lock-flow'] = 'node scripts/verify_price_lock_flow.cjs';

// 2. Añadir puertas huérfanas a gate:prepush si no están
const neededInPrepush = [
  'npm run audit:tariff-copy',
  'npm run audit:residues',
  'node scripts/verify_sonometro_pwa.cjs',
  'node scripts/verify_price_lock_flow.cjs',
  'npm run audit:admin-ecosystem'
];

let prepush = pkg.scripts['gate:prepush'] || '';
for (const cmd of neededInPrepush) {
  if (!prepush.includes(cmd)) {
    prepush += ' && ' + cmd;
  }
}
pkg.scripts['gate:prepush'] = prepush;

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('UPDATED package.json gate:prepush');

