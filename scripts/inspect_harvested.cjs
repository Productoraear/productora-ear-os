const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../src/data/bodas-vendors-harvested.json');
if (fs.existsSync(p)) {
  const fd = fs.openSync(p, 'r');
  const buf = Buffer.alloc(10000);
  fs.readSync(fd, buf, 0, 10000, 0);
  fs.closeSync(fd);
  console.log('Snippet of bodas-vendors-harvested.json:');
  console.log(buf.toString('utf8').substring(0, 1500));
} else {
  console.log('Not found');
}
