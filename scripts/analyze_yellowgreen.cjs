const fs = require('fs');
const html = fs.readFileSync('public/data/yellowgreen_root_index.html', 'utf8');

const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

const links = [];
const linkRegex = /href=["'](.*?)["']/gi;
let m;
while ((m = linkRegex.exec(html)) !== null) {
  if (!links.includes(m[1]) && m[1].includes('yellowgreen')) {
    links.push(m[1]);
  }
}
console.log('Found internal links:', links.length);
console.log('Links:', links);

const headings = [];
const hRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
while ((m = hRegex.exec(html)) !== null) {
  headings.push(m[1].replace(/<[^>]+>/g, '').trim());
}
console.log('Headings count:', headings.length);
console.log('Headings:', headings);

