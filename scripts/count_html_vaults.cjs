const fs = require('fs');
const path = require('path');

function countHtmlFiles(dir) {
  let count = 0;
  let sample = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.name.endsWith('.html') || ent.name.endsWith('.htm')) {
        count++;
        if (sample.length < 5) sample.push(full);
      }
    }
  }
  walk(dir);
  return { count, sample };
}

const resVault = countHtmlFiles(path.join(__dirname, '../vault'));
console.log('HTML files in vault:', resVault.count);
console.log('Sample vault HTML files:', resVault.sample);

const resAbsorbed = countHtmlFiles('H:/00_PRODUCTORA_EAR/EAR_ABSORBED_VAULT');
console.log('HTML files in H:/00_PRODUCTORA_EAR/EAR_ABSORBED_VAULT:', resAbsorbed.count);

const resWedding = countHtmlFiles(path.join(__dirname, '../src/data/wedding_intel_vault'));
console.log('HTML files in src/data/wedding_intel_vault:', resWedding.count);
