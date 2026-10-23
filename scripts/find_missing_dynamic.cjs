const fs = require('fs');
const path = require('path');

function findRoutes(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findRoutes(full, list);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      list.push(full);
    }
  }
  return list;
}

const apiRoutes = findRoutes(path.join(__dirname, '..', 'src', 'app', 'api'));
console.log('Total API routes:', apiRoutes.length);

const missing = [];
for (const r of apiRoutes) {
  const content = fs.readFileSync(r, 'utf8');
  if (!content.includes("export const dynamic = 'force-dynamic'") && !content.includes('export const dynamic = "force-dynamic"')) {
    missing.push(r);
  }
}

console.log('Routes missing force-dynamic (' + missing.length + '):');
missing.forEach(m => console.log(' - ' + path.relative(path.join(__dirname, '..'), m)));
