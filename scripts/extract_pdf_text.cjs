/* Extractor mínimo de texto PDF (FlateDecode) sin dependencias. Uso: node scripts/extract_pdf_text.cjs <pdf> <out.txt> */
const fs = require('fs');
const zlib = require('zlib');

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Uso: node scripts/extract_pdf_text.cjs <pdf> <out.txt>');
  process.exit(2);
}

const buf = fs.readFileSync(input);
const raw = buf.toString('latin1');
const chunks = [];
const re = /stream\r?\n/g;
let m;
while ((m = re.exec(raw)) !== null) {
  const start = m.index + m[0].length;
  const end = raw.indexOf('endstream', start);
  if (end < 0) break;
  const data = buf.subarray(start, end);
  try {
    chunks.push(zlib.inflateSync(data).toString('latin1'));
  } catch {
    /* stream no comprimido o imagen */
  }
  re.lastIndex = end;
}

const out = [];
for (const c of chunks) {
  const lines = c.match(/\[(?:[^\]]*)\]\s*TJ|\((?:\\.|[^\\)])*\)\s*Tj/g) || [];
  for (const l of lines) {
    const parts = l.match(/\((?:\\.|[^\\)])*\)/g) || [];
    out.push(parts.map((p) => p.slice(1, -1).replace(/\\(.)/g, '$1')).join(''));
  }
}
fs.writeFileSync(output, out.join('\n'), 'utf8');
console.log(JSON.stringify({ streams: chunks.length, lines: out.length, bytes: fs.statSync(output).size }));
