const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../src/data/all_providers_database.json');
console.log('Reading first 500KB of all_providers_database.json...');

const fd = fs.openSync(dbPath, 'r');
const buf = Buffer.alloc(100000);
fs.readSync(fd, buf, 0, 100000, 0);
fs.closeSync(fd);

const text = buf.toString('utf8');
// Parse first array elements
const firstBracket = text.indexOf('[');
if (firstBracket !== -1) {
  // find first complete object
  const firstObjStart = text.indexOf('{', firstBracket);
  const firstObjEnd = text.indexOf('},', firstObjStart);
  if (firstObjEnd !== -1) {
    const objStr = text.substring(firstObjStart, firstObjEnd + 1);
    try {
      const obj = JSON.parse(objStr);
      console.log('Sample object in all_providers_database.json:', obj);
    } catch(e) {
      console.log('Parse error on first object, snippet:', objStr.substring(0, 500));
    }
  }
}
